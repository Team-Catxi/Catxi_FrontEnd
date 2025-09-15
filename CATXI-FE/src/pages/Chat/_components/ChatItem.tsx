import { useParams, useOutletContext } from "react-router-dom";
import ChatMemberModal from "../../../components/Modal/UserModal";
import ChatBubble from "./ChatItem/ChatBubble";
import { useChatActions } from "../../../hooks/chatAction/useChatActions";
import { formatTimestamp } from "../../../utils/chat/format";
// import { getDisplayName } from "../../../utils/chat/displayName";

interface ChatContext {
  nicknameMap: Record<string, string>;
  hostEmail: string;
  hostNickname: string;
  myEmail: string;
}

interface Props {
  message: string;
  isMe: boolean;
  senderEmail: string;
  sentAt: string;
  showName?: boolean;
  showTimestamp?: boolean;
  gapClass?: string;
}

const ChatItem = ({
  message,
  isMe,
  senderEmail,
  sentAt,
  showName = true,
  showTimestamp = true,
  gapClass = "gap-3",
}: Props) => {
  const { nicknameMap, hostEmail, myEmail } = useOutletContext<ChatContext>();
  const { roomId } = useParams();
  const isMyself = senderEmail === myEmail;
  const isHost = myEmail === hostEmail;
  const isTargetHost = senderEmail === hostEmail;
  const displayName = nicknameMap[senderEmail];

  const { handleReport, handleKick, openModal } = useChatActions(
    Number(roomId),
    senderEmail,
  );

  const handleNameClick = () => {
    if (isMyself || !displayName) return;
    openModal(
      <ChatMemberModal
        name={displayName}
        nickname={displayName}
        isHost={isHost}
        isMyself={isMyself}
        roomId={parseInt(roomId ?? "0")}
        targetUserId={senderEmail}
        onReport={handleReport}
        onKick={isHost && !isTargetHost ? handleKick : undefined}
      />,
    );
  };

  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
      {showName && displayName && (
        <div
          className="flex items-center gap-[0.5rem] mb-1"
          onClick={handleNameClick}
        >
          <p className="text-xs text-gray-600 cursor-pointer hover:underline">
            {displayName}
          </p>
          {senderEmail === hostEmail && (
            <span className="text-[0.625rem] font-medium text-[#FF8114] bg-[#FFF4EA] px-[0.205rem] py-[0.125rem] rounded">
              방장
            </span>
          )}
        </div>
      )}

      <div
        className={`inline-flex items-end ${gapClass} ${
          isMe ? "justify-end" : "justify-start"
        }`}
      >
        {isMe ? (
          <>
            {showTimestamp && (
              <span className="text-[10px] text-gray-400 mb-0.5">
                {formatTimestamp(sentAt)}
              </span>
            )}
            <ChatBubble message={message} isMe />
          </>
        ) : (
          <>
            <ChatBubble message={message} isMe={false} />
            {showTimestamp && (
              <span className="text-[10px] text-gray-400 mb-0.5">
                {formatTimestamp(sentAt)}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
