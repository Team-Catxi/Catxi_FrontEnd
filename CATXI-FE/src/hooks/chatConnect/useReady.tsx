import { useCallback } from 'react';
import { useModal } from '../../contexts/ModalContext';
import ReadyRequestModal from '../../components/Modal/ReadyRequestModal';
import { useReadyAccept, useReadyReject } from '../mutation/chat/useReadyQuest';
import type { ReadyMessage } from '../../types/chat/readyMessage';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export function useReady(
  roomId: number,
  myEmail: string,
  hostEmail: string,
  nicknameMap: Record<string, string>,
  totalParticipants: number,
) {
  const { openModal } = useModal();
  const { mutate: acceptReady } = useReadyAccept();
  const { mutate: rejectReady } = useReadyReject();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleAccept = useCallback(() => {
    acceptReady(roomId);
  }, [acceptReady, roomId]);

  const handleReject = useCallback(() => {
    rejectReady(roomId);
  }, [rejectReady, roomId]);

  const handleReadyMessage = useCallback(
    (msg: ReadyMessage) => {
      if (!myEmail || !hostEmail) return;

      const senderName = nicknameMap[msg.senderEmail] || msg.senderEmail;

      if (msg.type === 'READY_REQUEST') {
        if (myEmail !== hostEmail) {
          const chatRoomDetail: any = queryClient.getQueryData(['chatRoomDetail', roomId]);
          const current = chatRoomDetail?.data?.acceptCount ?? 0;

          openModal(
            <ReadyRequestModal
              senderName={senderName}
              current={current}
              total={totalParticipants}
              onAccept={handleAccept}
              onReject={handleReject}
            />,
            { dismissible: false }
          );
        }
      }

      if (msg.type === 'READY_DENY') {
        navigate('/home');
      }
    },
    [nicknameMap, myEmail, hostEmail, totalParticipants, handleAccept, handleReject, openModal, navigate, queryClient, roomId]
  );

  return { handleAccept, handleReject, handleReadyMessage };
}
