import { useEffect, useRef, useMemo } from "react";
import ChatItem from "./ChatItem";
import UserMessageItem from "./UserMessage";
import { useOutletContext, useParams } from "react-router-dom";
import type { ChatMessage } from "../../../types/chat/chat";
import type { SystemMessage } from "../../../types/systemMessage/systemMessage";

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
    const isAtBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 10;

    if (isAtBottom) {
      requestAnimationFrame(() => {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [messages, roomId]);

  const renderedMessages = useMemo(() => {
    return messages.map((msg, idx) => {
      if ("type" in msg && msg.type === "SYSTEM") {
        return (
          <UserMessageItem
            key={`system-${idx}`}
            content={msg.content}
          />
        );
      }

      const chatMsg = msg as ChatMessage;

      return (
        <ChatItem
          key={`chat-${chatMsg.messageId ?? idx}`}
          message={chatMsg.message}
          isMe={chatMsg.isMine ?? false}
          email={chatMsg.email}
          sentAt={chatMsg.sentAt}
        />
      );
    });
  }, [messages, nicknameMap]);

  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto space-y-5 mb-[1rem] pb-[1.25rem] custom-scrollbar"
    >
      {renderedMessages}
    </div>
  );
};

export default ChatList;
