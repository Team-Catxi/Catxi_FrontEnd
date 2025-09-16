import type { ActiveStatusRequest } from "./ActiveStatusService";

export class ActiveStatusQueue {
  private retryQueue: ActiveStatusRequest[] = [];
  private isOnline = navigator.onLine;
  private onRetry: (req: ActiveStatusRequest) => Promise<void>;

  constructor(onRetry: (req: ActiveStatusRequest) => Promise<void>) {
    this.onRetry = onRetry;
    window.addEventListener("online", this.flushQueue.bind(this));
    window.addEventListener("offline", () => (this.isOnline = false));
  }

  enqueue(req: ActiveStatusRequest) {
    this.retryQueue.push(req);
    console.log("📥 요청이 큐에 저장됨:", req);
  }
  
  async flushQueue() {
    this.isOnline = true;
    console.log("🌐 온라인 복귀 - 큐 처리 시작");
    await this.processQueue();
  }

  async processQueue(): Promise<void> {
    if (!this.isOnline || this.retryQueue.length === 0) {
      return;
    }

    console.log(`🔄 큐 처리 시작 - ${this.retryQueue.length}개 요청`);

    const queueCopy = [...this.retryQueue];
    this.retryQueue = [];

    for (const req of queueCopy) {
      try {
        await this.onRetry(req);
      } catch (error) {
        console.error("❌ 큐 처리 중 오류:", error);
        this.retryQueue.unshift(req);
      }
    }

    console.log(`✅ 큐 처리 완료 - ${this.retryQueue.length}개 요청 남음`);
  }

  getOnlineStatus() {
    return this.isOnline;
  }

  getQueueInfo() {
    return {
      length: this.retryQueue.length,
      isOnline: this.isOnline,
      isProcessing: this.retryQueue.length > 0 && this.isOnline,
    };
  }
}
