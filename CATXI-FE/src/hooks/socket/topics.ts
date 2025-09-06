export const chatTopic = (roomId: number) => `/topic/${roomId}`;
export const systemMessageTopic = (roomId: number) => `/topic/chat/${roomId}`;
export const readyTopic = (roomId: number) => `/topic/ready/${roomId}`;
export const publishTopic = (roomId: number) => `/publish/${roomId}`;
export const participantsTopic = (roomId: number) =>
  `/topic/room/${roomId}/participants`;
export const deletedTopic = (roomId: number) =>
  `/topic/room/${roomId}/deleted`;
