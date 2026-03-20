import { useEffect, useMemo, useState } from "react";
import Storage from "../../utils/storage";
import { useUserEmail } from "../useUserEmail";
import { useChatSocket } from "../socket/useChatSocket";
import { useChatMessages } from "../query/useChatMessages";
import { useChatRoomDetail } from "../query/useChatDetail";
import { mapChatHistoryToMessages } from "../../utils/chat/messageUtils";
import { buildNicknameMap, getHostNickname } from "../../utils/chat/chatUtils";
import { useChatMessagesHandler } from "./useChatMessagesHandler";
import { useReady } from "./useReady";
import { buildChatPayload } from "../socket/payloadBuilder";
import {
  parseChatMessage,
  parseReadyMessage,
} from "../../utils/chat/parseSocketMessages";
import { useParticipantsHandler } from "./handlers/useParticipantsHandler";
import { useResultHandler } from "./handlers/useResultHandlers";
import { parseMapMessage } from "../../utils/chat/parseMapMessage";
import type { ApiMember } from "../../types/chat/members";

export function useChatConnection(roomId: number) {
  const safeRoomId = Number.isFinite(roomId) && roomId > 0 ? roomId : 0;
  const email = useUserEmail() ?? "";

  const {
    data: chatRoomDetail,
    isLoading,
    isError,
    refetch: refetchChatRoomDetail,
  } = useChatRoomDetail(safeRoomId);

  const { data: chatHistory } = useChatMessages(safeRoomId);

  const nicknameMap = useMemo(() => {
    return buildNicknameMap(
      chatRoomDetail?.data?.participantEmails ?? [],
      chatRoomDetail?.data?.participantNicknames ?? []
    );
  }, [chatRoomDetail]);

  const hostEmail = chatRoomDetail?.data?.hostEmail ?? "";
  const hostNickname = useMemo(() => {
    return getHostNickname(
      hostEmail,
      chatRoomDetail?.data?.participantEmails ?? [],
      chatRoomDetail?.data?.participantNicknames ?? []
    );
  }, [chatRoomDetail, hostEmail]);

  const { messages, setMessages, handleMessage } = useChatMessagesHandler(email);

  const { handleReadyMessage } = useReady(
    safeRoomId,
    email,
    hostEmail,
    nicknameMap,
    chatRoomDetail?.data?.currentSize ?? 0
  );

  const [coordinates, setCoordinates] = useState<ApiMember[]>([]);

  useEffect(() => {
    if (chatHistory?.data?.messages && email) {
      setMessages(mapChatHistoryToMessages(chatHistory.data.messages, email));
    }
  }, [chatHistory, email, setMessages]);

  const handleParticipantsMessage = useParticipantsHandler(safeRoomId);
  const handleResultMessage = useResultHandler(safeRoomId, handleMessage);

  const handleMapMessage = (raw: any) => {
    const parsed = parseMapMessage(raw);
    if (!parsed) return;

    setCoordinates((prev) => {
      const exists = prev.some((m) => m.email === parsed.email);
      if (exists) {
        return prev.map((m) =>
          m.email === parsed.email
            ? { ...m, latitude: parsed.latitude, longitude: parsed.longitude, distance: parsed.distance }
            : m
        );
      } else {
        return [
          ...prev,
          {
            roomId: safeRoomId,
            email: parsed.email,
            name: parsed.name,
            nickname: parsed.nickname,
            latitude: parsed.latitude,
            longitude: parsed.longitude,
            distance: parsed.distance,
          },
        ];
      }
    });
  };

  const token = Storage.getAccessToken() ?? "";

  const { connect, disconnect, sendMessage, sendCoordinate, status } =
    useChatSocket(
      safeRoomId,
      token,
      (raw) => handleMessage(parseChatMessage(raw, email, nicknameMap)), // chat
      (raw) => handleReadyMessage(parseReadyMessage(raw)), // ready
      undefined, // system
      (raw) => handleParticipantsMessage(raw), // participants
      (raw) => handleMapMessage(raw), // map
      (raw) => handleResultMessage(raw) // result
    );

  useEffect(() => {
    if (!safeRoomId || !email || !token) return;
    connect();
    return () => disconnect();
  }, [safeRoomId, email, token]);

  const sendChatMessage = (message: string) => {
    if (!message.trim()) return;
    sendMessage(buildChatPayload(message, email, safeRoomId));
  };

  return {
    messages,
    myEmail: email,
    sendMessage: sendChatMessage,
    sendCoordinate,
    nicknameMap,
    hostEmail,
    hostNickname,
    chatRoomDetail: chatRoomDetail?.data ?? null,
    refetchChatRoomDetail,
    isLoading,
    isError,
    status,
    coordinates, 
  };
}
