import MemberItem from "./_components/MemberItem";

interface MapViewProps {
  onClose: () => void;
  roomId: number;
}
//TODO: 지도 컴포넌트로 교체 예정

const MapView = ({ onClose, roomId }: MapViewProps) => {
  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center gap-4">
      <p className="text-gray-700 text-lg font-medium">
        현재 Room ID: {roomId}
      </p>
      <button
        onClick={onClose}
        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
      >
        임시 닫기
      </button>
      <MemberItem roomId={roomId} />
    </div>
  );
};

export default MapView;
