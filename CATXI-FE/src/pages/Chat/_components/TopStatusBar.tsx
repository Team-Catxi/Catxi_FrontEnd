import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { statusTextMap, statusColorMap } from '../../../constants/chatStatus';
import type { ChatRoomDetail } from '../../../types/chat/chatRoomDetail';
import { useLeaveChatRoom, useDeleteChatRoom } from '../../../hooks/mutation/chat/useChatDelete';
import { useModal } from '../../../contexts/ModalContext';
import LeaveRoomModal from '../../../components/Modal/LeaveRoomModal';
import RoomOutIcon from '../../../assets/icons/RoomOut.svg?react';
import LocationBlockedModal from './Map/LocationBlockedModal';
import { useState } from 'react';
import { queryClient } from '../../../App'; 

interface ChatContext {
  hostEmail: string;
  hostNickname: string;
  myEmail: string;
  chatRoom?: ChatRoomDetail;
  setShowMap: (show: boolean) => void;
}

const TopStatusBar = () => {
  const { myEmail, chatRoom, setShowMap } = useOutletContext<ChatContext>();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { mutate: leaveRoom } = useLeaveChatRoom();
  const { mutate: deleteRoom } = useDeleteChatRoom();
  const { openModal, closeModal } = useModal();

  const [showBlockedModal, setShowBlockedModal] = useState(false);

  const current =
    chatRoom?.currentSize ??
    chatRoom?.participantEmails?.length ??
    0;
    
  const total = (chatRoom?.recruitSize ?? 0) + 1;
  const status = chatRoom?.roomStatus;
  const statusText = status ? statusTextMap[status] : '';
  const statusColor = status ? statusColorMap[status] : '#D1D5DB';
  const isHost = myEmail === chatRoom?.hostEmail;

  const clearChatCache = (id: number) => {
    queryClient.removeQueries({ queryKey: ['chatRoomDetail', id] });
    queryClient.removeQueries({ queryKey: ['chatMessages', id] });
    queryClient.removeQueries({ queryKey: ['participants', id] });
    queryClient.removeQueries({ queryKey: ['myChatRoomId'] }); 
    queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
  };

  const handleViewLocation = () => {
    if (status === 'READY_LOCKED') {
      setShowMap(true);
    } else {
      setShowBlockedModal(true);
    }
  };

  const handleLeave = () => {
    if (!roomId) return;
    openModal(
      <LeaveRoomModal
        onConfirm={() => {
          leaveRoom(Number(roomId), {
            onSuccess: () => {
              closeModal();
              setTimeout(() => {
                clearChatCache(Number(roomId));
                navigate('/home');
              }, 0);
            },
            onError: () => {
              closeModal();
              alert('채팅방 나가기에 실패했습니다.');
            },
          });
        }}
        onCancel={closeModal}
      />,
      { dismissible: false }
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
              setTimeout(() => {
                clearChatCache(Number(roomId));
                navigate('/home');
              }, 0);
            },
            onError: () => {
              closeModal();
              alert('채팅방 삭제에 실패했습니다.');
            },
          });
        }}
        onCancel={closeModal}
      />,
      { dismissible: false }
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

      <button
        className="text-sm"
        style={{
          color: status === 'READY_LOCKED' ? '#000000' : '#9E9E9E',
          cursor: 'pointer',
        }}
        onClick={handleViewLocation}
      >
        위치보기
      </button>

      {showBlockedModal && (
        <LocationBlockedModal onConfirm={() => setShowBlockedModal(false)} />
      )}
    </div>
  );
};

export default TopStatusBar;
