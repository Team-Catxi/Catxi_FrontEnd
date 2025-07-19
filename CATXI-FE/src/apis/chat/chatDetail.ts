import axiosInstance from '../axios';
import type { ChatRoomDetailResponse } from '../../types/chat/chatRoomDetail';
import { mockChatRoomDetail } from '../../mocks/chat.mocks';

export const fetchChatRoomDetail = async (
  roomId: number
): Promise<ChatRoomDetailResponse> => {
  try {
    const { data } = await axiosInstance.get<ChatRoomDetailResponse>(
      `/chat/rooms/${roomId}`
    );
    return data;
  } catch (error) {
    console.error(`채팅방 상세 조회 실패 (roomId: ${roomId}) → mock 사용`, error);
    return mockChatRoomDetail;
  }
};
