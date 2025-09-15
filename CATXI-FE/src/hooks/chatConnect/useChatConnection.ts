import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Storage from "../../utils/storage";
import { useUserEmail } from "../useUserEmail";
import { useChatSocket } from "../socket/useChatSocket";
import { useChatMessages } from "../query/useChatMessages";
import { useChatRoomDetail } from "../query/useChatDetail";
import { mapChatHistoryToMessages } from "../../utils/chat/messageUtils";
import { buildNicknameMap } from "../../utils/chat/chatUtils";
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
import { queryClient } from "../../App";

export function useChatConnection(roomId: number) {
  const email = useUserEmail() ?? "";
  const navigate = useNavigate();

  const {
    data: chatRoomDetail,
    isLoading,
    isError,
    refetch: refetchChatRoomDetail,
  } = useChatRoomDetail(roomId);

  const { data: chatHistory } = useChatMessages(roomId);

  const participants = useMemo(() => {
    const liveParticipants =
      queryClient.getQueryData<{ email: string; nickname: string }[]>(
        ["participants", roomId]
      ) ?? [];

    if (liveParticipants.length > 0) {
      return liveParticipants;
    }

    if (!chatRoomDetail) return [];

    return chatRoomDetail.data.participantEmails
      .map((email: string | null, i: number) => {
        const nickname = chatRoomDetail.data.participantNicknames[i];
        if (!email || !email.trim()) return null;
        if (!nickname || !nickname.trim()) return null;
        return { email: email.trim(), nickname: nickname.trim() };
      })
      .filter((p): p is { email: string; nickname: string } => p !== null);
  }, [chatRoomDetail, roomId]);

  const nicknameMap = useMemo(() => {
    return buildNicknameMap(
      participants.map((p) => p.email),
      participants.map((p) => p.nickname)
    );
  }, [participants]);

  const hostEmail = chatRoomDetail?.data?.hostEmail ?? "";
  const hostNickname =
    participants.find((p) => p.email === hostEmail)?.nickname ?? hostEmail;

  const { messages, setMessages, handleMessage } =
    useChatMessagesHandler(email);

  const { handleReadyMessage } = useReady(
    roomId,
    email,
    hostEmail,
    nicknameMap,
    participants.length
  );

  useEffect(() => {
    if (chatHistory?.data && email) {
      setMessages(mapChatHistoryToMessages(chatHistory.data, email));
    }
  }, [chatHistory, email, setMessages]);

  const handleParticipantsMessage = useParticipantsHandler(roomId);
  const handleResultMessage = useResultHandler(roomId, handleMessage);

  const handleMapMessage = (raw: any) => {
    const parsed = parseMapMessage(raw);
    if (!parsed) return;
  };

  const token = Storage.getAccessToken() ?? "";

  const { connect, disconnect, sendMessage, sendCoordinate, status } =
    useChatSocket(roomId, token, {
      chat: (raw: any) =>
        handleMessage(parseChatMessage(raw, email, nicknameMap)),

      ready: (raw: any) =>
        handleReadyMessage(parseReadyMessage(raw)),

      participants: (raw: any) =>
        handleParticipantsMessage(raw),

      map: (raw: any) =>
        handleMapMessage(raw),

      result: (raw: any) =>
        handleResultMessage(raw),

      kick: (raw: any) => {
        console.warn("[useChatConnection] 강퇴 이벤트 수신:", raw);

        queryClient.setQueryData(
          ["chatRoomDetail", roomId],
          (
            prev:
              | {
                  data: {
                    participantEmails: string[];
                    participantNicknames: string[];
                    currentSize: number;
                  };
                }
              | undefined
          ) => {
            if (!prev) return prev;
            return {
              ...prev,
              data: {
                ...prev.data,
                participantEmails: prev.data.participantEmails.filter(
                  (e) => e !== raw.email
                ),
                participantNicknames: prev.data.participantNicknames.filter(
                  (_, i) => prev.data.participantEmails[i] !== raw.email
                ),
                currentSize: prev.data.currentSize - 1,
              },
            };
          }
        );

        queryClient.setQueryData(
          ["participants", roomId],
          (prev: { email: string; nickname: string }[] | undefined) => {
            if (!prev) return prev;
            return prev.filter((p) => p.email !== raw.email);
          }
        );

        setMessages((prev) => prev.filter((m) => m.sender !== raw.email));

        if (raw.email === email) {
          disconnect();
          navigate("/home");
        }
      },
    });

  useEffect(() => {
    if (!roomId || !email || !token) return;
    connect();
    return () => disconnect();
  }, [roomId, email, token]);

  const sendChatMessage = (message: string) => {
    if (!message.trim()) return;
    sendMessage(buildChatPayload(message, email, roomId));
  };

  return {
    messages,
    myEmail: email,
    sendMessage: sendChatMessage,
    sendCoordinate,
    nicknameMap,
    hostEmail,
    hostNickname,
    participants,
    chatRoomDetail: chatRoomDetail?.data,
    refetchChatRoomDetail,
    isLoading,
    isError,
    status,
  };
}
