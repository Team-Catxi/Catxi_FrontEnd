import type { ChatMessage } from "../../types/chat/chat";
import type { SystemMessage } from "../../types/systemMessage/systemMessage";
import { isSystemMessage } from "./isSystemMessage";

type CombinedMessage = ChatMessage | SystemMessage;

export function getChatItemProps(
  msg: ChatMessage,
  prevMsg: CombinedMessage | null,
  nextMsg: CombinedMessage | null
) {
  const isSameSenderAsPrev =
    prevMsg &&
    !isSystemMessage(prevMsg) &&
    (prevMsg as ChatMessage).email === msg.email;

  const showName = !isSameSenderAsPrev;

  const isSameSenderAsNext =
    nextMsg &&
    !isSystemMessage(nextMsg) &&
    (nextMsg as ChatMessage).email === msg.email;

  const isSameMinuteAsNext =
    isSameSenderAsNext &&
    new Date(msg.sentAt).getHours() ===
      new Date((nextMsg as ChatMessage).sentAt).getHours() &&
    new Date(msg.sentAt).getMinutes() ===
      new Date((nextMsg as ChatMessage).sentAt).getMinutes();

  const showTimestamp = !isSameSenderAsNext || !isSameMinuteAsNext;

  const isSameMinuteAsPrev =
    isSameSenderAsPrev &&
    new Date(msg.sentAt).getHours() ===
      new Date((prevMsg as ChatMessage).sentAt).getHours() &&
    new Date(msg.sentAt).getMinutes() ===
      new Date((prevMsg as ChatMessage).sentAt).getMinutes();

  const gapClass = isSameMinuteAsPrev ? "gap-1" : "gap-3";

  return { showName, showTimestamp, gapClass };
}
