import { useEffect, useMemo } from 'react';
import Storage from '../../utils/storage';
import { useUserEmail } from '../useUserEmail';
import { useChatSocket } from '../socket/useChatSocket';
import { useChatMessages } from '../query/useChatMessages';
import { useChatRoomDetail } from '../query/useChatDetail';
import { mapChatHistoryToMessages } from '../../utils/chat/messageUtils';
import { buildNicknameMap, getHostNickname } from '../../utils/chat/chatUtils';
import { useChatMessagesHandler } from './useChatMessagesHandler';
import { useReady } from './useReady';
import { buildChatPayload } from '../socket/payloadBuilder';
import { parseChatMessage, parseReadyMessage } from '../../utils/chat/parseSocketMessages';
import { useParticipantsHandler } from './handlers/useParticipantsHandler';
import { useResultHandler } from './handlers/useResultHandlers';

export function useChatConnection(roomId: number) {
  const email = useUserEmail();

  const {
    data: chatRoomDetail,
    isLoading,
    isError,
    refetch: refetchChatRoomDetail,
  } = useChatRoomDetail(roomId);

  const { data: chatHistory } = useChatMessages(roomId);

  const nicknameMap = useMemo(
    () =>
      buildNicknameMap(
        chatRoomDetail?.data?.participantEmails,
        chatRoomDetail?.data?.participantNicknames,
      ),
    [chatRoomDetail],
  );

  const hostEmail = chatRoomDetail?.data?.hostEmail ?? '';
  const hostNickname = useMemo(
    () =>
      getHostNickname(
        hostEmail,
        chatRoomDetail?.data?.participantEmails,
        chatRoomDetail?.data?.participantNicknames,
      ),
    [chatRoomDetail, hostEmail],
  );

  const { messages, setMessages, handleMessage } = useChatMessagesHandler(email ?? '');

  const { handleReadyMessage } = useReady(
    roomId,
    email ?? '',
    hostEmail,
    nicknameMap,
    chatRoomDetail?.data?.currentSize ?? 0,
  );

  useEffect(() => {
    if (chatHistory?.data && email) {
      setMessages(mapChatHistoryToMessages(chatHistory.data, email));
    }
  }, [chatHistory, email, setMessages]);

  const handleParticipantsMessage = useParticipantsHandler(roomId);
  const handleResultMessage = useResultHandler(roomId, handleMessage);

  const { connect, disconnect, sendMessage, status } = useChatSocket(
    roomId,
    Storage.getAccessToken()!,
    (raw) => handleMessage(parseChatMessage(raw, email ?? '', nicknameMap)),  // chat
    (raw) => handleReadyMessage(parseReadyMessage(raw)),                      // ready
    undefined,                                                                // system
    (raw) => handleParticipantsMessage(raw),                                  // participants
    undefined,                                                                // map
    (raw) => handleResultMessage(raw),                                        // result
  );

  useEffect(() => {
    if (!roomId || !email) return;
    connect();
    return () => disconnect();
  }, [roomId, email]);

  const sendChatMessage = (message: string) =>
    sendMessage(buildChatPayload(message, email ?? '', roomId));

  return {
    messages,
    myEmail: email ?? '',
    sendMessage: sendChatMessage,
    nicknameMap,
    hostEmail,
    hostNickname,
    chatRoomDetail: chatRoomDetail?.data,
    refetchChatRoomDetail,
    isLoading,
    isError,
    status,
  };
}
