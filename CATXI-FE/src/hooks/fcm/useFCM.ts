import { useState, useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging, VAPID_KEY } from "../../config/firebase";
import axiosInstance from "../../apis/axios";

interface FCMNotification {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export const useFCM = () => {
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<FCMNotification | null>(null);

  const requestNotificationPermission = async (): Promise<boolean> => {
    try {
      if (Notification.permission === "granted") return true;
      if (Notification.permission === "denied") return false;

      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (err) {
      console.error("알림 권한 요청 실패:", err);
      return false;
    }
  };

  const requestFCMToken = async (): Promise<string | null> => {
    if (!messaging) {
      console.warn("Firebase messaging이 아직 초기화되지 않았습니다.");
      return null;
    }

    try {
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (currentToken) {
        setToken(currentToken);
        console.log("FCM 토큰 발급 성공:", currentToken);
        return currentToken;
      } else {
        console.warn("FCM 토큰을 발급받지 못했습니다.");
      }
    } catch (error) {
      console.error("FCM 토큰 요청 중 오류:", error);
    }
    return null;
  };

  const registerTokenToBackend = async (fcmToken: string) => {
    try {
      await axiosInstance.put("/api/fcm/token", { token: fcmToken });
      console.log("서버에 FCM 토큰 등록 완료:", fcmToken);
    } catch (err) {
      console.error("서버에 FCM 토큰 등록 실패:", err);
    }
  };

  const initializeFCM = async () => {
    const granted = await requestNotificationPermission();
    if (!granted) return;

    const fcmToken = await requestFCMToken();
    if (fcmToken) {
      await registerTokenToBackend(fcmToken);
    }
  };

  useEffect(() => {
    if (!messaging) return;
    const unsubscribe = onMessage(messaging, (payload) => {
      if (payload.data) {
        setNotification({
          title: payload.data.title || "새 알림",
          body: payload.data.body || "",
          data: payload.data,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return {
    token,
    notification,
    requestNotificationPermission,
    requestFCMToken,
    registerTokenToBackend,
    initializeFCM,
  };
};
