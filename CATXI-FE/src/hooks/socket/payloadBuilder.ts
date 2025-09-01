export const buildChatPayload = (
  message: string,
  email: string,
  roomId: number
) => ({
  message,
  email,
  roomId,
  sentAt: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString(), // KST 기준
});
