import axiosInstance from '../axios';

export const kickUser = async (roomId: number, targetEmail: string) => {
  const res = await axiosInstance.post(`/chat/rooms/${roomId}/kick`, {
    roomId,
    targetEmail,
  });

  return res.data;
};
