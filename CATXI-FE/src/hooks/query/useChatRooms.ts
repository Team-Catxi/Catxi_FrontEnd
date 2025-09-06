import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchChatRooms } from '../../apis/chat/chatRooms';
import type { ChatRoomResponse } from '../../types/chat/chatData';

interface GetChatRoomsParams {
  direction: string;
  station: string;
  sort: string;
  page?: number;
}

export const useChatRooms = (params: GetChatRoomsParams) => {
  return useQuery<ChatRoomResponse, Error>({
    queryKey: ['chatRooms', params],
    queryFn: () => fetchChatRooms(params),
    staleTime: 1000 * 60 * 5,   
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
    placeholderData: keepPreviousData,   
    enabled: !!params.direction && !!params.station && !!params.sort,
  });
};
