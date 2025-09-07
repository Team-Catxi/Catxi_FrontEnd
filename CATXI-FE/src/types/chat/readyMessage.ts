export interface ReadyMessage {
  type: 'READY_REQUEST' | 'READY_ACCEPT' | 'READY_DENY';
  roomId: number;
  senderId: number;
  senderEmail: string;
  senderName: string;
  content: string;
  sentAt: string; 
}
