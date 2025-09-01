import { useMutation } from '@tanstack/react-query';
import { requestReady, acceptReady, rejectReady } from '../../../apis/chat/chatReady';
import { queryClient } from '../../../App';

export const useReadyRequest = () => {
  return useMutation({
    mutationFn: (roomId: number) => requestReady(roomId),
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useReadyAccept = () => {
  return useMutation({
    mutationFn: (roomId: number) => acceptReady(roomId),
    onMutate: async (roomId: number) => {
      await queryClient.cancelQueries({ queryKey: ['chatRoomDetail', roomId] });

      const prev = queryClient.getQueryData(['chatRoomDetail', roomId]);

      queryClient.setQueryData(['chatRoomDetail', roomId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            acceptCount: (old.data.acceptCount ?? 0) + 1,
          },
        };
      });

      return { prev };
    },
    onError: (_err, roomId, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['chatRoomDetail', roomId], context.prev);
      }
    },
    onSettled: (_data, _error, roomId) => {
      queryClient.invalidateQueries({ queryKey: ['chatRoomDetail', roomId] });
    },
  });
};

export const useReadyReject = () => {
  return useMutation({
    mutationFn: (roomId: number) => rejectReady(roomId),
    onMutate: async (roomId: number) => {
      await queryClient.cancelQueries({ queryKey: ['chatRoomDetail', roomId] });

      const prev = queryClient.getQueryData(['chatRoomDetail', roomId]);

      queryClient.setQueryData(['chatRoomDetail', roomId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            rejectCount: (old.data.rejectCount ?? 0) + 1,
          },
        };
      });

      return { prev };
    },
    onError: (_err, roomId, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['chatRoomDetail', roomId], context.prev);
      }
    },
    onSettled: (_data, _error, roomId) => {
      queryClient.invalidateQueries({ queryKey: ['chatRoomDetail', roomId] });
    },
  });
};
