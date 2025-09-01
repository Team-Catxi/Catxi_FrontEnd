import { useNavigate } from "react-router-dom";
import { useModal } from "../../contexts/ModalContext";
import { useReportUser } from "../mutation/chat/useReportUser";
import { useKickUser } from "../mutation/chat/useKickUser";

export function useChatActions(
  roomId: number | undefined,
  email: string,
  myEmail: string,
) {
  const { openModal, closeModal } = useModal();
  const { mutate: reportUser } = useReportUser();
  const { mutate: kickUser } = useKickUser();
  const navigate = useNavigate();

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
          if (email === myEmail) navigate("/home");
        },
        onError: () => {
          alert("강퇴에 실패했습니다.");
        },
      }
    );
  };

  return { handleReport, handleKick, openModal };
}
