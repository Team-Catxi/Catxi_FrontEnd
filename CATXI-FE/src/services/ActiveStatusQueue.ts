import type { ActiveStatusRequest } from "./ActiveStatusService";

export class ActiveStatusQueue {
  private retryQueue: ActiveStatusRequest[] = [];
  private isOnline = navigator.onLine;
  private onRetry: (req: ActiveStatusRequest) => Promise<void>; // ✅ 명시적 선언

  constructor(onRetry: (req: ActiveStatusRequest) => Promise<void>) {
    this.onRetry = onRetry; 
    window.addEventListener("online", this.flushQueue.bind(this));
    window.addEventListener("offline", () => (this.isOnline = false));
  }

  enqueue(req: ActiveStatusRequest) {
    this.retryQueue.push(req);
    console.log("📥 요청이 큐에 저장됨");
  }

  async flushQueue() {
    this.isOnline = true;
    console.log("🌐 온라인 복귀 - 큐 처리 시작");

    while (this.retryQueue.length > 0) {
      const req = this.retryQueue.shift()!;
      await this.onRetry(req);
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  getOnlineStatus() {
    return this.isOnline;
  }
}
