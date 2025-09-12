import TopStatusBar from "./_components/TopStatusBar.tsx";
import DepartureInfoBox from "./_components/DepartureInfoBox.tsx";
import ChatBoard from "./_components/ChatBoard";
import SystemMessage from "./_components/SystemMessage.tsx";

const ChatPage = () => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">

      <div className="shrink-0 sticky top-0 z-10 bg-background">
        <TopStatusBar />
        <DepartureInfoBox />
        <SystemMessage />
      </div>

      <div className="flex-1 min-h-0">
        <ChatBoard />
      </div>
    </div>
  );
};

export default ChatPage;
