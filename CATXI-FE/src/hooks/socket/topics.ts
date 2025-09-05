export const chatTopic = (roomId: number) => `/topic/${roomId}`;
export const systemMessageTopic = (roomId: number) => `/topic/chat/${roomId}`;
export const readyTopic = (roomId: number) => `/topic/ready/${roomId}`;
export const publishTopic = (roomId: number) => `/publish/${roomId}`; //채팅메시지 보내는거
export const participantsTopic = (roomId: number) =>
  `/topic/room/${roomId}/participants`;
//TODO: /topic/map/{roomId} 를 구독해주세요
