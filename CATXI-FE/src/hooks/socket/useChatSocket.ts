import { useEffect, useRef, useCallback, useState } from "react";
import SockJS from "sockjs-client";
import * as webstomp from "webstomp-client";
import type { Client, Subscription } from "webstomp-client";
import { chatTopic, readyTopic, publishTopic, systemMessageTopic, participantsTopic } from "./topics.ts";

const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

export type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export function useChatSocket(
  roomId: number,
  jwtToken: string,
  onChatMessage: (raw: any) => void,
  onReadyMessage?: (raw: any) => void,
  onSystemMessage?: (raw: any) => void,
  onParticipantsMessage?: (raw: any) => void
) {
  const stompClientRef = useRef<Client | null>(null);
  const chatSubRef = useRef<Subscription | null>(null);
  const readySubRef = useRef<Subscription | null>(null);
  const systemMessageSubRef = useRef<Subscription | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const isConnectingRef = useRef(false);
  const chatHandlerRef = useRef(onChatMessage);
  const readyHandlerRef = useRef(onReadyMessage);
  const systemHandlerRef = useRef(onSystemMessage);
  const participantsHandlerRef = useRef(onParticipantsMessage);
  const participantsSubRef = useRef<Subscription | null>(null);

  useEffect(() => {
    chatHandlerRef.current = onChatMessage;
    readyHandlerRef.current = onReadyMessage;
    systemHandlerRef.current = onSystemMessage;
    participantsHandlerRef.current = onParticipantsMessage;
  }, [onChatMessage, onReadyMessage, onSystemMessage, onParticipantsMessage]);

  const connect = useCallback(() => {
    if (isConnectingRef.current || stompClientRef.current?.connected) {
      console.log("[WebSocket] 이미 연결 중이거나 연결됨");
      return;
    }

    isConnectingRef.current = true;
    setStatus("connecting");

    const socket = new SockJS(`${SERVER_URL}/connect`);
    const stompClient = webstomp.over(socket);
    stompClient.debug = () => {};

    stompClient.connect(
      { Authorization: `Bearer ${jwtToken}` },
      () => {
        console.log("[WebSocket] 연결 성공");
        stompClientRef.current = stompClient;
        isConnectingRef.current = false;
        setStatus("connected");

        chatSubRef.current?.unsubscribe();
        readySubRef.current?.unsubscribe();
        systemMessageSubRef.current?.unsubscribe();
        participantsSubRef.current?.unsubscribe();

        chatSubRef.current = stompClient.subscribe(
          chatTopic(roomId),
          (msg) => chatHandlerRef.current?.(JSON.parse(msg.body)),
          { Authorization: `Bearer ${jwtToken}` }
        );

        readySubRef.current = stompClient.subscribe(
          readyTopic(roomId),
          (msg) => readyHandlerRef.current?.(JSON.parse(msg.body)),
          { Authorization: `Bearer ${jwtToken}` }
        );

        systemMessageSubRef.current = stompClient.subscribe(
          systemMessageTopic(roomId),
          (msg) => systemHandlerRef.current?.(JSON.parse(msg.body)),
          { Authorization: `Bearer ${jwtToken}` }
        );

        participantsSubRef.current = stompClient.subscribe(
          participantsTopic(roomId),
          (msg) => participantsHandlerRef.current?.(JSON.parse(msg.body)),
          { Authorization: `Bearer ${jwtToken}` }
        );
      },
      (err) => {
        console.error("[WebSocket] 연결 실패:", err);
        isConnectingRef.current = false;
        setStatus("error");
      }
    );
  }, [roomId, jwtToken]);

  const disconnect = useCallback(() => {
    chatSubRef.current?.unsubscribe();
    readySubRef.current?.unsubscribe();
    systemMessageSubRef.current?.unsubscribe();
    participantsSubRef.current?.unsubscribe();

    chatSubRef.current = null;
    readySubRef.current = null;
    systemMessageSubRef.current = null;
    participantsSubRef.current = null;

    stompClientRef.current?.disconnect(() => {
      console.log("[WebSocket] 연결 해제됨");
      setStatus("idle");
    });

    stompClientRef.current = null;
  }, []);

  const sendMessage = useCallback(
    (payload: any) => {
      if (status !== "connected" || !stompClientRef.current?.connected) {
        console.warn("[WebSocket] 연결 전이므로 메시지를 보낼 수 없음");
        return;
      }
      stompClientRef.current.send(
        publishTopic(roomId),
        JSON.stringify(payload),
        { Authorization: `Bearer ${jwtToken}` }
      );
    },
    [status, roomId, jwtToken]
  );

  useEffect(() => () => disconnect(), [disconnect]);

  return { connect, disconnect, sendMessage, status };
}
