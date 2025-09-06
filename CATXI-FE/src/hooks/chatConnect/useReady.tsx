import { useCallback, useState } from 'react';
import { useModal } from '../../contexts/ModalContext';
import ReadyRequestModal from '../../components/Modal/ReadyRequestModal';
import { useReadyAccept, useReadyReject } from '../mutation/chat/useReadyQuest';
import type { ReadyMessage } from '../../types/chat/readyMessage';

export function useReady(
  roomId: number,
  myEmail: string,
  hostEmail: string,
  nicknameMap: Record<string, string>,
  totalParticipants: number,
) {
  const [acceptCount, setAcceptCount] = useState(0);

  const { openModal } = useModal();
  const { mutate: acceptReady } = useReadyAccept();
  const { mutate: rejectReady } = useReadyReject();

  const handleAccept = useCallback(() => {
    acceptReady(roomId);
    setAcceptCount((prev) => prev + 1);
  }, [acceptReady, roomId]);

  const handleReject = useCallback(() => {
    rejectReady(roomId);
  }, [rejectReady, roomId]);

  const handleReadyMessage = useCallback(
    (msg: ReadyMessage) => {
      if (!myEmail || !hostEmail) return;

      const senderName = nicknameMap[msg.senderEmail] || msg.senderEmail;

      if (msg.type === 'request') {
        openModal(
          <ReadyRequestModal
            senderName={senderName}
            current={acceptCount}
            total={totalParticipants}
            onAccept={handleAccept}
            onReject={handleReject}
            isHost={myEmail === hostEmail}
          />,
          { dismissible: false }
        );
      }

      if (msg.type === 'accept') {
        setAcceptCount((prev) => prev + 1);
      }
    },
    [nicknameMap, myEmail, hostEmail, acceptCount, totalParticipants, handleAccept, handleReject, openModal]
  );

  return { acceptCount, handleAccept, handleReject, handleReadyMessage };
}
