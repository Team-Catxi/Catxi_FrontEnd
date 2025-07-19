import type { ChatRoomItem, ChatRoomResponse } from '../../types/chat/chatData';
import axiosInstance from '../axios';
import { mockChatRooms } from '../../mocks/chat.mocks';

interface GetChatRoomsParams {
  direction: string;
  station: string;
  sort: string;
  page?: number;
}

export const fetchChatRooms = async ({
  direction,
  station,
  sort,
  page = 0,
}: GetChatRoomsParams): Promise<ChatRoomResponse> => {
  try {
    const { data } = await axiosInstance.get<ChatRoomResponse>('/chat/rooms', {
      params: {
        direction,
        station,
        sort,
        page,
      },
    });
    return data;
  } catch (error) {
    console.error('채팅방 목록 조회 실패 → mock 데이터 사용', error);
    return mockChatRooms;
  }
};

export const joinChatRoom = async (roomId: number): Promise<ChatRoomItem> => {
  try {
    const { data } = await axiosInstance.post(`/chat/rooms/${roomId}/join`);
    return data as ChatRoomItem;
  } catch (error) {
    console.error(`채팅방 참여 실패 (roomId: ${roomId}) → mock 데이터 사용`, error);

    return mockChatRooms.data.content[0];
  }
};
