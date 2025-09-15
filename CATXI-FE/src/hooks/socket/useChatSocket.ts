import { useEffect, useRef, useCallback, useState } from "react";
import SockJS from "sockjs-client";
import * as webstomp from "webstomp-client";
import type { Client } from "webstomp-client";
import { publishTopic, mapPublish } from "./topics";
import type { SubRefs } from "./subscriptions";
import { cleanupSubscriptions, setupSubscriptions } from "./subscriptions";

const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

export type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export interface ChatHandlers {
  chat: (raw: any) => void;
  ready?: (raw: any) => void;
  system?: (raw: any) => void;
  participants: (raw: any) => void;
  map?: (raw: any) => void;
  result?: (raw: any) => void;
  kick?: (raw: any) => void;
  deleted?: () => void;
}

export function useChatSocket(
  roomId: number,
  jwtToken: string,
  handlers: ChatHandlers
) {
  const stompClientRef = useRef<Client | null>(null);
  const subRefs = useRef<SubRefs>({
    chat: null,
    ready: null,
    system: null,
    participants: null,
    deleted: null,
    map: null,
    result: null,
    kick: null,
  });

  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const isConnectingRef = useRef(false);

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

        cleanupSubscriptions(subRefs.current);
        subRefs.current = setupSubscriptions(stompClient, roomId, jwtToken, handlers);
      },
      (err) => {
        console.error("[WebSocket] 연결 실패:", err);
        isConnectingRef.current = false;
        setStatus("error");
      }
    );
  }, [roomId, jwtToken, handlers]);

  const disconnect = useCallback(() => {
    cleanupSubscriptions(subRefs.current);
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

  const sendCoordinate = useCallback(
    (coordPayload: {
      roomId: number;
      email: string;
      name: string;
      nickname: string;
      latitude: number;
      longitude: number;
    }) => {
      if (status !== "connected" || !stompClientRef.current?.connected) {
        console.warn("[WebSocket] 연결 전이므로 좌표를 보낼 수 없음");
        return;
      }
      stompClientRef.current.send(
        mapPublish(roomId),
        JSON.stringify(coordPayload),
        { Authorization: `Bearer ${jwtToken}` }
      );
    },
    [status, roomId, jwtToken]
  );

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return { connect, disconnect, sendMessage, sendCoordinate, status };
}
