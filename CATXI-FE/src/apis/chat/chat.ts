import axiosInstance from '../axios';
import type { ChatMessagesResponse } from '../../types/chat/chatData';
import { mockChatMessages } from '../../mocks/chat.mocks';

export const fetchChatMessages = async (roomId: number): Promise<ChatMessagesResponse> => {
  try {
    const response = await axiosInstance.get<ChatMessagesResponse>(
      `/chat/${roomId}/messages`
    );
    return response.data;
  } catch (error) {
    console.error(`채팅 메시지 요청 실패 (roomId: ${roomId}) → mock 데이터 사용`, error);
    return mockChatMessages;
  }
};
