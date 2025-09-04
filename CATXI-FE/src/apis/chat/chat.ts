import axiosInstance from '../axios';
import type { ChatMessagesResponse } from '../../types/chat/chatData';

export const fetchChatMessages = async (
  roomId: number
): Promise<ChatMessagesResponse> => {
  const { data } = await axiosInstance.get<ChatMessagesResponse>(
    `/chat/${roomId}/messages`
  );
  return data;
};
