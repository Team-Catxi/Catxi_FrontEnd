import { queryClient } from "../../../App";

export function useParticipantsHandler(roomId: number) {
  return (raw: any) => {
    const participants = raw.participants ?? [];
    const emails = participants.map((p: any) => p.email);
    const nicknames = participants.map((p: any) => p.nickname);

    queryClient.setQueryData(['chatRoomDetail', roomId], (prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        data: {
          ...prev.data,
          currentSize: participants.length,
          participantEmails: emails,
          participantNicknames: nicknames,
        },
      };
    });
  };
}
