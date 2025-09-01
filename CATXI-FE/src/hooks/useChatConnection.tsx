import { useCallback, useEffect, useMemo, useState } from 'react';
import Storage from '../utils/storage';
import { useUserEmail } from './useUserEmail';
import { useChatSocket } from './useChatSocket';
import { useChatMessages } from './query/useChatMessages';
import { useChatRoomDetail } from './query/useChatDetail';
import { useModal } from '../contexts/ModalContext';
import ReadyRequestModal from '../components/Modal/ReadyRequestModal';
import { useReadyAccept, useReadyReject } from './mutation/chat/useReadyQuest';
import { mapChatHistoryToMessages } from '../utils/chat/messageUtils';
import { buildNicknameMap, getHostNickname } from '../utils/chat/chatUtils';
import type { ChatMessage } from '../types/chat/chat';
import type { ReadyMessage } from '../types/chat/readyMessage';

export function useChatConnection(roomId: number) {
  const email = useUserEmail();

  // ===== State =====
  const [acceptCount, setAcceptCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // ===== Query =====
  const { data: chatRoomDetail, isLoading, isError, refetch: refetchChatRoomDetail } =
    useChatRoomDetail(roomId);
  const { data: chatHistory } = useChatMessages(roomId);

  // ===== Hooks =====
  const { openModal } = useModal();
  const { mutate: acceptReady } = useReadyAccept();
  const { mutate: rejectReady } = useReadyReject();

  // ===== Derived Data =====
  const nicknameMap = useMemo(
    () =>
      buildNicknameMap(
        chatRoomDetail?.data?.participantEmails,
        chatRoomDetail?.data?.participantNicknames
      ),
    [chatRoomDetail]
  );

  const hostEmail = chatRoomDetail?.data?.hostEmail ?? '';
  const hostNickname = useMemo(
    () =>
      getHostNickname(
        hostEmail,
        chatRoomDetail?.data?.participantEmails,
        chatRoomDetail?.data?.participantNicknames
      ),
    [chatRoomDetail, hostEmail]
  );

  // ===== Accept / Reject Handlers =====
  const handleAccept = useCallback(() => {
    acceptReady(roomId);
    setAcceptCount((prev) => prev + 1);
  }, [acceptReady, roomId]);

  const handleReject = useCallback(() => {
    rejectReady(roomId);
  }, [rejectReady, roomId]);

  // ===== History 초기 세팅 =====
  useEffect(() => {
    if (chatHistory?.data && email) {
      setMessages(mapChatHistoryToMessages(chatHistory.data, email));
    }
  }, [chatHistory, email]);

  // ===== Message Handler =====
  const handleMessage = useCallback((msg: ChatMessage, options?: { isHistory?: boolean }) => {
    setMessages((prev) => {
      if (options?.isHistory && msg.messageId) {
        const exists = prev.some((m) => m.messageId === msg.messageId);
        return exists ? prev : [...prev, msg];
      }
      return [...prev, msg];
    });
  }, []);

  // ===== ReadyMessage Handler =====
  const handleReadyMessage = useCallback(
    (msg: ReadyMessage) => {
      if (!email || !hostEmail) return;

      const senderName = nicknameMap[msg.senderEmail] || msg.senderEmail;

      openModal(
        <ReadyRequestModal
          senderName={senderName}
          current={acceptCount}
          total={chatRoomDetail?.data.currentSize ?? 1}
          onAccept={handleAccept}
          onReject={handleReject}
          isHost={email === hostEmail}
        />,
        { dismissible: false }
      );

      if (msg.type === 'accept') {
        setAcceptCount((prev) => prev + 1);
      }
    },
    [nicknameMap, openModal, chatRoomDetail?.data?.currentSize, acceptCount, email, hostEmail, handleAccept, handleReject]
  );

  // ===== WebSocket 연결 =====
  const { connect, disconnect, sendMessage, isConnected } = useChatSocket(
    roomId,
    Storage.getAccessToken()!,
    email ?? '',
    handleMessage,
    handleReadyMessage,
    nicknameMap
  );

  useEffect(() => {
    if (!roomId || !email) return;
    connect();
    return () => disconnect();
  }, [roomId, email, connect, disconnect]);

  // ===== Return =====
  return {
    messages,
    myEmail: email ?? '',
    sendMessage,
    nicknameMap,
    hostEmail,
    hostNickname,
    chatRoomDetail: chatRoomDetail?.data,
    refetchChatRoomDetail,
    acceptCount,
    isLoading,
    isError,
    isConnected,
  };
}
