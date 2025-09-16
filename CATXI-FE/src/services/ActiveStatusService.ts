import axiosInstance from "../apis/axios";
import { ActiveStatusQueue } from "./ActiveStatusQueue";

export interface ActiveStatusRequest {
  roomId: number;
  isActive: boolean;
}

class ActiveStatusService {
  private currentRoomId: number | null = null;
  private isActive = false;
  public queue = new ActiveStatusQueue(async (req) => {
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
  
  async updateActiveStatusWithRetry(roomId: number, isActive: boolean, retryCount = 3): Promise<void> {
    for (let i = 0; i < retryCount; i++) {
      try {
        await this.updateActiveStatus(roomId, isActive);
        return;
      } catch (error) {
        console.warn(`⚠️ 상태 업데이트 시도 ${i + 1}/${retryCount} 실패:`, error);

        if (i === retryCount - 1) {
          const req: ActiveStatusRequest = { roomId, isActive };
          this.queue.enqueue(req);
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  isOnline(): boolean {
    return navigator.onLine && this.queue.getOnlineStatus();
  }

  isPWAInstalled(): boolean {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true || 
      document.referrer.includes("android-app://")
    );
  }

  async forceSyncActiveStatus(roomId: number): Promise<void> {
    if (!this.isOnline()) {
      console.log("🔄 오프라인 상태 - 동기화 연기");
      return;
    }

    try {
      await this.updateActiveStatusWithRetry(roomId, true);
      this.currentRoomId = roomId;
      this.isActive = true;
      console.log(`🔄 강제 동기화 완료: Room=${roomId}, Active=true`);
    } catch (error) {
      console.error("❌ 강제 동기화 실패:", error);
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
