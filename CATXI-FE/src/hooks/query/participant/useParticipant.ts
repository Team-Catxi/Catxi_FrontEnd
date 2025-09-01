import { useQuery } from '@tanstack/react-query';
import { fetchParticipants } from '../../../apis/participant/api';
import type { ParticipantsResponse } from '../../../apis/participant/type';

export const useParticipants = (roomId: number) => {
  return useQuery<ParticipantsResponse>({
    queryKey: ['participants', roomId],
    queryFn: () => fetchParticipants(roomId),
    enabled: !!roomId,
  });
};
