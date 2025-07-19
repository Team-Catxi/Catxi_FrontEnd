import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { statusTextMap, statusColorMap } from '../../../constants/chatStatus';
import type { ChatRoomDetail } from '../../../types/chat/chatRoomDetail';
import { useLeaveChatRoom, useDeleteChatRoom } from '../../../hooks/mutation/chat/useChatDelete';
import { useModal } from '../../../contexts/ModalContext';
import LeaveRoomModal from '../../../components/Modal/LeaveRoomModal';
import RoomOutIcon from '../../../assets/icons/RoomOut.svg?react';

interface ChatContext {
  hostEmail: string;
  hostNickname: string;
  myEmail: string;
  chatRoom?: ChatRoomDetail;
}

const TopStatusBar = () => {
  const { myEmail, chatRoom } = useOutletContext<ChatContext>();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { mutate: leaveRoom } = useLeaveChatRoom();
  const { mutate: deleteRoom } = useDeleteChatRoom();
  const { openModal, closeModal } = useModal();

  const current = chatRoom?.currentSize ?? 0;
  const total = (chatRoom?.recruitSize ?? 0) + 1;
  const status = chatRoom?.roomStatus;
  const statusText = status ? statusTextMap[status] : '';
  const statusColor = status ? statusColorMap[status] : '#D1D5DB';
  const isHost = myEmail === chatRoom?.hostEmail;

  const handleLeave = () => {
    if (!roomId) return;
    openModal(
      <LeaveRoomModal
        onConfirm={() => {
          leaveRoom(Number(roomId), {
            onSuccess: () => {
              closeModal();
              navigate('/home');
            },
            onError: () => {
              closeModal();
              alert('채팅방 나가기에 실패했습니다.');
            },
          });
        }}
        onCancel={closeModal}
      />
    );
  };

  const handleDelete = () => {
    if (!roomId) return;
    openModal(
      <LeaveRoomModal
        type="delete"
        onConfirm={() => {
          deleteRoom(Number(roomId), {
            onSuccess: () => {
              closeModal();
              navigate('/home');
            },
            onError: () => {
              closeModal();
              alert('채팅방 삭제에 실패했습니다.');
            },
          });
        }}
        onCancel={closeModal}
      />
    );
  };

  return (
    <div className="w-full flex justify-between items-center py-6 px-[1.688rem]">
      <button onClick={isHost ? handleDelete : handleLeave}>
        <RoomOutIcon className="w-5 h-5" />
      </button>

      <div className="font-medium text-[0.875rem] flex items-center gap-2">
        <span className="text-[0.5rem] ml-5" style={{ color: statusColor }}>●</span>
        <span className="text-gray-600 font-medium">
          {statusText} ({current}/{total})
        </span>
      </div>

      <button className="text-sm text-gray-500">위치보기</button>
    </div>
  );
};

export default TopStatusBar;
