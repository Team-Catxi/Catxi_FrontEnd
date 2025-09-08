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

  const requestFCMToken = async (): Promise<string | null> => {
    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    }

    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (currentToken) {
      setToken(currentToken);
      return currentToken;
    }
    return null;
  };

  const registerTokenToBackend = async (fcmToken: string) => {
    try {
      await axiosInstance.put("/api/fcm/token", { token: fcmToken });
      console.log("FCM token registered:", fcmToken);
    } catch (err) {
      console.error("Failed to register FCM token:", err);
    }
  };

  const initializeFCM = async () => {
    const fcmToken = await requestFCMToken();
    if (fcmToken) {
      await registerTokenToBackend(fcmToken);
    }
  };

  useEffect(() => {
    if (!messaging) return;
    const unsubscribe = onMessage(messaging, (payload) => {
      if (payload.notification) {
        setNotification({
          title: payload.notification.title || "",
          body: payload.notification.body || "",
          data: payload.data,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return {
    token,
    notification,
    initializeFCM,       
    requestFCMToken,      
    registerTokenToBackend 
  };
};
