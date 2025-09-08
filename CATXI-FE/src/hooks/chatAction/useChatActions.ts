import { useNavigate } from "react-router-dom";
import { useModal } from "../../contexts/ModalContext";
import { useReportUser } from "../mutation/chat/useReportUser";
import { useKickUser } from "../mutation/chat/useKickUser";
import { useQueryClient } from "@tanstack/react-query";
import { useUserEmail } from "../useUserEmail";

export function useChatActions(
  roomId: number | undefined,
  email: string, 
) {
  const { openModal, closeModal } = useModal();
  const { mutate: reportUser } = useReportUser();
  const { mutate: kickUser } = useKickUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const myEmail = useUserEmail(); 

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
          queryClient.invalidateQueries({ queryKey: ["chatRoomDetail", roomId] });
          queryClient.invalidateQueries({ queryKey: ["chatRooms"] });

          closeModal();

          if (myEmail === email) {
            navigate("/home");
          }
        },
        onError: () => {
          alert("강퇴에 실패했습니다.");
        },
      }
    );
  };

  return { handleReport, handleKick, openModal };
}
