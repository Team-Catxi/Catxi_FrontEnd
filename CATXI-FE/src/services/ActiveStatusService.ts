import axiosInstance from "../apis/axios";
import { ActiveStatusQueue } from "./ActiveStatusQueue";

export interface ActiveStatusRequest {
  roomId: number;
  isActive: boolean;
}

class ActiveStatusService {
  private currentRoomId: number | null = null;
  private isActive = false;
  private queue = new ActiveStatusQueue(async (req) => {
    return this.updateActiveStatus(req.roomId, req.isActive);
  });

  async updateActiveStatus(roomId: number, isActive: boolean): Promise<void> {
    if (this.currentRoomId === roomId && this.isActive === isActive) {
      console.log(`⏩ 중복 상태 무시: Room=${roomId}, Active=${isActive}`);
      return;
    }

    const req: ActiveStatusRequest = { roomId, isActive };

    if (!this.queue.getOnlineStatus()) {
      return this.queue.enqueue(req);
    }

    try {
      const { data } = await axiosInstance.put("/api/fcm/active-status", req);

      if (!data.success) throw new Error(data.message);

      this.currentRoomId = isActive ? roomId : null;
      this.isActive = isActive;

      console.log(`✅ 상태 업데이트 성공: Room=${roomId}, Active=${isActive}`);
    } catch (err) {
      console.error("❌ 상태 업데이트 실패:", err);
      this.queue.enqueue(req);
    }
  }

  enterRoom(roomId: number) {
    return this.updateActiveStatus(roomId, true);
  }

  leaveRoom(roomId?: number) {
    const target = roomId ?? this.currentRoomId;
    if (target) return this.updateActiveStatus(target, false);
  }

  getCurrentRoomId() {
    return this.currentRoomId;
  }
  getIsActive() {
    return this.isActive;
  }
}

export default new ActiveStatusService();
