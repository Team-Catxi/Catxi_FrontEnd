import { useEffect, useRef, useMemo } from "react";
import ChatItem from "./ChatItem";
import UserSystemMessageItem from "./UserSystemMessage";
import { useOutletContext, useParams } from "react-router-dom";
import type { ChatMessage } from "../../../types/chat/chat";
import type { SystemMessage } from "../../../types/systemMessage/systemMessage";
import { isSystemMessage } from "../../../utils/chat/isSystemMessage";
import { getChatItemProps } from "../../../utils/chat/getChatItemprops";

type CombinedMessage = ChatMessage | SystemMessage;

interface ChatContext {
  nicknameMap: Record<string, string>;
}

interface Props {
  messages: CombinedMessage[];
}

const ChatList = ({ messages }: Props) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { nicknameMap } = useOutletContext<ChatContext>();
  const { roomId } = useParams();

  useEffect(() => {
    if (!listRef.current || !roomId) return;
    const el = listRef.current;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [messages, roomId]);

  const renderedMessages = useMemo(() => {
    return messages.map((msg, idx) => {
      if (isSystemMessage(msg)) {
        const sysMsg = msg as SystemMessage;
        return (
          <UserSystemMessageItem
            key={`system-${sysMsg.createdAt}`}
            content={sysMsg.message}
          />
        );
      }

      const chatMsg = msg as ChatMessage;
      const prevMsg = idx > 0 ? messages[idx - 1] : null;
      const nextMsg = idx < messages.length - 1 ? messages[idx + 1] : null;

      const { showName, showTimestamp, gapClass } = getChatItemProps(
        chatMsg,
        prevMsg,
        nextMsg
      );

      return (
        <ChatItem
          key={`chat-${chatMsg.messageId ?? chatMsg.sentAt}`}
          message={chatMsg.message}
          isMe={chatMsg.isMine ?? false}
          senderEmail={chatMsg.email}
          sentAt={chatMsg.sentAt}
          showName={showName}
          showTimestamp={showTimestamp}
          gapClass={gapClass}
        />
      );
    });
  }, [messages, nicknameMap]);

  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto space-y-5 mb-[1rem] custom-scrollbar"
    >
      {renderedMessages}
    </div>
  );
};

export default ChatList;
