import { useModal } from "../../contexts/ModalContext";
import { useReportUser } from "../mutation/chat/useReportUser";
import { useKickUser } from "../mutation/chat/useKickUser";
import { queryClient } from "../../App";

export function useChatActions(
  roomId: number | undefined,
  email: string,
) {
  const { openModal, closeModal } = useModal();
  const { mutate: reportUser } = useReportUser();
  const { mutate: kickUser } = useKickUser();

  const handleReport = (reason: string) => {
    if (!roomId) return;
    reportUser({ roomId, targetUserEmail: email, reason });
  };

  const handleKick = () => {
    if (!roomId) return;
    kickUser(
      { roomId, targetEmail: email },
      {
        onSuccess: () => {
          closeModal();

          queryClient.setQueryData(["participants", roomId], 
            (prev: { email: string; nickname: string }[] | undefined) => {
              if (!prev) return prev;
              return prev.filter((p) => p.email !== email);
            }
          );

          queryClient.setQueryData(["chatRoomDetail", roomId],
            (prev: any) => {
              if (!prev) return prev;
              return {
                ...prev,
                data: {
                  ...prev.data,
                  participantEmails: prev.data.participantEmails.filter((e: string) => e !== email),
                  participantNicknames: prev.data.participantNicknames.filter(
                    (_: string, i: number) => prev.data.participantEmails[i] !== email
                  ),
                  currentSize: prev.data.currentSize - 1,
                }
              };
            }
          );
        },
        onError: () => {
          alert("강퇴에 실패했습니다.");
        },
      }
    );
  };

  return { handleReport, handleKick, openModal };
}
