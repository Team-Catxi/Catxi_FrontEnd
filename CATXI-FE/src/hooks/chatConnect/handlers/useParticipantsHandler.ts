import { queryClient } from "../../../App";

interface Participant {
  email: string;
  nickname: string;
}

export function useParticipantsHandler(roomId: number) {

  return (raw: any) => {
    const participants: Participant[] = ((raw.participants ?? []) as Participant[])
      .map((p): Participant | null => {
        if (!p?.email || !p.email.trim()) return null;
        if (!p.nickname || !p.nickname.trim()) return null;
        return { email: p.email.trim(), nickname: p.nickname.trim() };
      })
      .filter((p): p is Participant => p !== null);

    queryClient.setQueryData(
      ["chatRoomDetail", roomId],
      (
        prev:
          | {
              data: {
                participantEmails: string[];
                participantNicknames: string[];
                currentSize: number;
              };
            }
          | undefined
      ) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            participantEmails: participants.map((p) => p.email),
            participantNicknames: participants.map((p) => p.nickname),
            currentSize: participants.length,
          },
        };
      }
    );

    queryClient.setQueryData(["participants", roomId], participants);
  };
}
