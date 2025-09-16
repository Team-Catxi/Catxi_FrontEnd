import { usePWAActivity } from '../fcm/usePWAActivity.ts';
import activeStatusService from "../../services/ActiveStatusService";
import { sendBeaconOnUnload } from "../../utils/beacon";
import { useEffect, useRef } from "react";

interface Options {
  roomId: number | null;
  inactiveThreshold?: number;
}

export const useChatRoomActivity = ({ roomId, inactiveThreshold = 30000 }: Options) => {
  const isPWA = activeStatusService.isPWAInstalled();

  if (isPWA) {
    return usePWAActivity({ roomId, inactiveThreshold });
  }

  const timeoutRef = useRef<number | null>(null);
  const isActiveRef = useRef(true);

  const resetTimer = async () => {
    if (!roomId) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!isActiveRef.current) {
      await activeStatusService.updateActiveStatus(roomId, true);
      isActiveRef.current = true;
    }

    timeoutRef.current = setTimeout(async () => {
      await activeStatusService.updateActiveStatus(roomId, false);
      isActiveRef.current = false;
    }, inactiveThreshold);
  };

  useEffect(() => {
    if (!roomId) return;

    activeStatusService.enterRoom(roomId);
    resetTimer();

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((e) => document.addEventListener(e, resetTimer, { passive: true }));

    document.addEventListener("visibilitychange", () => {
      if (!roomId) return;
      document.hidden
        ? activeStatusService.updateActiveStatus(roomId, false)
        : activeStatusService.updateActiveStatus(roomId, true);
    });

    window.addEventListener("beforeunload", () => {
      if (roomId) sendBeaconOnUnload(roomId);
    });

    return () => {
      activeStatusService.leaveRoom(roomId);
      events.forEach((e) => document.removeEventListener(e, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [roomId, inactiveThreshold]);

  return { isActive: isActiveRef.current };
};
