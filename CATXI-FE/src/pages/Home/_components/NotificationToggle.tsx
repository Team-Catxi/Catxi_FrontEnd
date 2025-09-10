import { useState, useEffect } from "react";
import { useFCM } from "../../../hooks/fcm/useFCM";
import axiosInstance from "../../../apis/axios";
import { deleteToken } from "firebase/messaging";
import { messaging } from "../../../config/firebase";

const NotificationToggle = () => {
  const { requestNotificationPermission, initializeFCM, token } = useFCM();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (Notification.permission === "granted") {
      setEnabled(true);
    }
  }, []);

  const handleToggle = async () => {
    if (!enabled) {
      setEnabled(true);

      const granted = await requestNotificationPermission();
      if (granted) {
        await initializeFCM();
      } else {
        setEnabled(false);
      }
    } else {
      setEnabled(false);
      if (token) {
        try {
          await axiosInstance.delete("/api/fcm/token");

          if (messaging) {
            await deleteToken(messaging);
          }

          console.log("서버 및 클라이언트 FCM 토큰 삭제 완료");
        } catch (err) {
          console.error("FCM 토큰 삭제 실패:", err);
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[0.875rem] text-[#9E9E9E] font-medium">알림 설정</span>
      <button
        onClick={handleToggle}
        className={`relative w-[3.25rem] h-[1.25rem] rounded-full transition-colors ${
          enabled ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-[0.125rem] left-[0.125rem] w-[1rem] h-[1rem] bg-white rounded-full shadow-md transform transition-transform ${
            enabled ? "translate-x-[2rem]" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default NotificationToggle;
