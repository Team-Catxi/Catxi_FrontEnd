import { useEffect, useRef } from "react";
import activeStatusService from "../../services/ActiveStatusService";
import { sendBeaconOnUnload } from "../../utils/beacon";

interface PWAActivityOptions {
  roomId: number | null;
  inactiveThreshold?: number; 
}

export const usePWAActivity = ({ roomId, inactiveThreshold = 30000 }: PWAActivityOptions) => {
  const timeoutRef = useRef<number | null>(null);
  const isActiveRef = useRef(true);
  const lastActiveRef = useRef(Date.now());

  const resetTimer = async () => {
    if (!roomId) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    lastActiveRef.current = Date.now();

    if (!isActiveRef.current) {
      await activeStatusService.updateActiveStatus(roomId, true);
      isActiveRef.current = true;
    }

    timeoutRef.current = setTimeout(async () => {
      await activeStatusService.updateActiveStatus(roomId, false);
      isActiveRef.current = false;
    }, inactiveThreshold);
  };

  const handleAppStateChange = async (isVisible: boolean) => {
    if (!roomId) return;

    if (isVisible) {
      await activeStatusService.updateActiveStatus(roomId, true);
      isActiveRef.current = true;
      resetTimer();
    } else {
      await activeStatusService.updateActiveStatus(roomId, false);
      isActiveRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (!roomId) return;

    activeStatusService.enterRoom(roomId);
    resetTimer();

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "touchmove"];
    events.forEach((e) => document.addEventListener(e, resetTimer, { passive: true }));

    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      handleAppStateChange(isVisible);
    };

    const handlePageHide = () => {
      if (roomId) {
        sendBeaconOnUnload(roomId);
        handleAppStateChange(false);
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted && !document.hidden) {
        handleAppStateChange(true);
      }
    };

    const handleOnline = async () => {
      console.log("📶 네트워크 연결 복구됨");
      if (activeStatusService.queue) {
        await activeStatusService.queue.processQueue();
      }
      if (roomId && !document.hidden) {
        await activeStatusService.updateActiveStatus(roomId, true);
        isActiveRef.current = true;
      }
    };

    const handleOffline = () => {
      console.log("📵 네트워크 연결 끊김");
      isActiveRef.current = false;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("beforeunload", () => {
      if (roomId) sendBeaconOnUnload(roomId);
    });
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    const handleFocus = () => handleAppStateChange(true);
    const handleBlur = () => handleAppStateChange(false);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      activeStatusService.leaveRoom(roomId);
      events.forEach((e) => document.removeEventListener(e, resetTimer));
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("beforeunload", handlePageHide);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [roomId, inactiveThreshold]);

  return {
    isActive: isActiveRef.current,
    lastActive: lastActiveRef.current,
  };
};
