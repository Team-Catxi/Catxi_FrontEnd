import { useEffect, useRef, useMemo } from "react";
import ChatItem from "./ChatItem";
import UserSystemMessageItem from "./UserSystemMessage";
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

const isSystemMessage = (msg: CombinedMessage): msg is SystemMessage => {
  return (msg as any).type === "SYSTEM";
};

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
    return messages.map((msg) => {
      if (isSystemMessage(msg)) {
        return (
          <UserSystemMessageItem
            key={`system-${msg.timestamp}`}
            content={msg.content}
          />
        );
      }

      const chatMsg = msg as ChatMessage;
      return (
        <ChatItem
          key={`chat-${chatMsg.messageId ?? chatMsg.sentAt}`}
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
