import { useCallback, useState } from 'react';
import type { ChatMessage } from '../../types/chat/chat';

export function useChatMessagesHandler(myEmail?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleMessage = useCallback(
    (msg: ChatMessage, options?: { isHistory?: boolean }) => {
      const enriched = myEmail ? { ...msg, isMine: msg.email === myEmail } : msg;
      setMessages((prev) => {
        if (options?.isHistory && msg.messageId) {
          const exists = prev.some((m) => m.messageId === msg.messageId);
          return exists ? prev : [...prev, enriched];
        }
        return [...prev, enriched];
      });
    },
    [myEmail]
  );

  return { messages, setMessages, handleMessage };
}

