import { useChatRooms } from "../../../hooks/query/useChatRooms";
import ChatCard from "./ChatCard";
import type { ChatRoomItem } from "../../../types/chat/chatData";
import LogoText from "../../../assets/icons/logoText.svg?react";
import Logo from "../../../assets/icons/CatxiLogo.svg?react";
import NoContent from "../../../assets/icons/noContent.svg?react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ChatCardListProps {
  direction: string;
  station: string;
  sort: string;
  page?: number;
}

const ChatCardList = ({
  direction,
  station,
  sort,
  page = 0,
}: ChatCardListProps) => {
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const { data, isLoading, isError } = useChatRooms({
    direction,
    station,
    sort,
    page,
  });

  const myRoomId = data?.data?.myRoomId ?? null;

  const futureRooms = useMemo(() => {
    const now = Date.now();
    return (data?.data?.rooms.content || []).filter((room: ChatRoomItem) => {
      const departTime = new Date(room.departAt).getTime();
      return departTime > now;
    });
  }, [data]);

  const handleRetry = () => {
    const nextCount = retryCount + 1;
    setRetryCount(nextCount);

    if (nextCount < 4) {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    if (futureRooms.length > 0) {
      const ids = futureRooms.map((r) => r.roomId);
      localStorage.setItem("homeChatRoomIds", JSON.stringify(ids));
    } else {
      localStorage.removeItem("homeChatRoomIds");
    }
  }, [futureRooms]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-[#8C46F6] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-600">로딩 중입니다...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[65vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo />
          <LogoText className="w-[10rem] h-auto" />
          <button
            onClick={handleRetry}
            className="px-8 py-2 bg-[#8C46F6] text-white rounded-full shadow hover:bg-[#722de2] transition"
          >
            reStart
          </button>
        </div>
      </div>
    );
  }

  if (!futureRooms.length) {
    return (
      <div className="flex justify-center items-center p-4 h-[70vh] custom-scrollbar">
        <div className="flex flex-col justify-center items-center gap-2 text-[#9E9E9E]">
          <NoContent />
          <p>아직 생성된 채팅방이 없어요</p>
          <p>새로운 대화를 시작해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4 custom-scrollbar">
      {futureRooms.map((room: ChatRoomItem) => (
        <ChatCard key={room.roomId} data={room} myRoomId={myRoomId} />
      ))}
    </div>
  );
};

export default ChatCardList;
