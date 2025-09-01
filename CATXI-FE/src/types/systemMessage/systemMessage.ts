export type SystemMessageType = 'SYSTEM';

export interface SystemMessage {
  type: SystemMessageType;  
  roomId: number;
  sender: string;         
  content: string;        
  timestamp: string;  
}

export interface SystemMessageResponse {
  success: boolean;
  data: SystemMessage[];
}
