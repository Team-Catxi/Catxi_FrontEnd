interface ChatBubbleProps {
  message: string;
  isMe: boolean;
}

const ChatBubble = ({ message, isMe }: ChatBubbleProps) => {
  return (
    <div
      className={`inline-block text-sm px-3 py-2 ${
        isMe
          ? "bg-[#8C46F6] text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
          : "bg-gray-200 text-black rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"
      }`}
    >
      {message}
    </div>
  );
};

export default ChatBubble;
