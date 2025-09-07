interface Props {
  onClick?: () => void;
  myRoomId?: number | null;  
  roomId: number;         
}

const ChatJoinButton = ({ onClick, myRoomId, roomId }: Props) => {
  if (!myRoomId) {
    return (
      <button
        onClick={onClick}
        className="py-[0.65rem] px-[2rem] rounded-[6px] text-[14px] 
                   bg-[#7424F5] text-white hover:bg-[#5b1fd1] transition"
      >
        채팅 참여하기
      </button>
    );
  }

  if (myRoomId === roomId) {
    return (
      <button
        disabled
        className="py-[0.65rem] px-[2rem] rounded-[6px] text-[14px] 
                   bg-[#424242]/70 text-white cursor-not-allowed"
      >
        현재 참여중
      </button>
    );
  }

  return (
    <button
      disabled
      className="py-[0.65rem] px-[2rem] rounded-[6px] text-[14px] 
                 bg-[#E0E0E0] text-white cursor-not-allowed"
    >
      다른 채팅 참여중
    </button>
  );
};

export default ChatJoinButton;
