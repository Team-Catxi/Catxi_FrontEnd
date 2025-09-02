import axiosInstance from '../axios';

export const reportUser = (
  roomId: number,
  targetUserId: string,
  reason: string
) => {
  return axiosInstance.post(`/api/rooms/${roomId}/report/${targetUserId}`, {
    reason,
  });
};
