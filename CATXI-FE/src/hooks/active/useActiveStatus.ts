import { useEffect } from "react";
import activeStatusService from "../../services/ActiveStatusService";

export const useActiveStatus = (roomId: number | null) => {
  useEffect(() => {
    if (!roomId) return;

    void activeStatusService.enterRoom(roomId);

    return () => {
      void activeStatusService.leaveRoom(roomId);
    };
  }, [roomId]);
};
