import { useParams, useOutletContext } from 'react-router-dom';
import { useReadyRequest } from '../../../hooks/mutation/chat/useReadyQuest';
import type { ChatRoomDetail } from '../../../types/chat/chatRoomDetail';
import { useState } from 'react';
import ReadyLockedBox from './Info/ReadyLockedBox';
import DefaultBox from './Info/DefaultBox';

interface ChatContext {
  hostEmail: string;
  myEmail: string;
  chatRoom?: ChatRoomDetail;
  refetchChatRoomDetail: () => Promise<any>;
}

const DepartureInfoBox = () => {
  const { roomId } = useParams();
  const { myEmail, chatRoom, refetchChatRoomDetail } = useOutletContext<ChatContext>();

  const [_isRequested, setIsRequested] = useState(false);
  const { mutate } = useReadyRequest();

  const handleRequestReady = () => {
    if (!roomId) return;

    mutate(Number(roomId), {
      onSuccess: () => {
        if (typeof refetchChatRoomDetail === 'function') {
          refetchChatRoomDetail();
        }
        setIsRequested(true);
      }
    });
    setIsRequested(true);
  };

  if (!chatRoom) return null;

  // 원래 코드로는 이걸 사용!
  // if (['READY_LOCKED', 'MATCHED'].includes(chatRoom.roomStatus)) {
  //   return <ReadyLockedBox departAt={chatRoom.departAt} />;
  // }

  // 테스트를 위한
  if (['WAITING'].includes(chatRoom.roomStatus)) {
    return <ReadyLockedBox departAt={chatRoom.departAt} />;
  }

  return (
    <DefaultBox
      chatRoom={chatRoom}
      myEmail={myEmail} 
      onRequestReady={handleRequestReady}
    />
  );
};

export default DepartureInfoBox;
