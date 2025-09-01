import axiosInstance from '../axios';
import type { ParticipantsResponse } from './type';

export const fetchParticipants = async (roomId: number): Promise<ParticipantsResponse> => {
  const { data } = await axiosInstance.get<ParticipantsResponse>(
    `/chat/rooms/${roomId}/participants`
  );
  return data;
};
