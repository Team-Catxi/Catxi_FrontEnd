// MapView.tsx
import { useEffect, useMemo, useState } from "react";
import { Map } from "./_components/Map";
import MemberCard from "./_components/MemberCard";
import LocationLayer from "./_components/LocationLayer";
import { useMapGet } from "../../../../hooks/query/useMapGet";
import type { ApiMember } from "../../../../types/chat/members";

interface MapViewProps {
  onClose: () => void;
  roomId: number;
  myEmail: string;
}

// 안정 키: roomId + email
const makeStableId = (m: ApiMember) => `${m.roomId}:${m.email}`;

const MapView = ({ onClose, roomId, myEmail }: MapViewProps) => {
  const { data, isLoading, isError, error } = useMapGet(roomId);

  // 서버 응답 그대로 사용
  const members = useMemo<ApiMember[]>(() => {
    return data?.data?.coordinates ?? [];
  }, [data]);

  // 안정 키 기반으로 선택 관리
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (
      selectedId !== null &&
      !members.some((m) => makeStableId(m) === selectedId)
    ) {
      setSelectedId(null);
    }
  }, [members, selectedId]);

  const handleSelect = (id: string | null) => setSelectedId(id);

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col items-center gap-4 p-4">
      <p className="text-gray-700 text-lg font-medium">
        현재 Room ID: {roomId}
      </p>

      <button
        onClick={onClose}
        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
      >
        임시 닫기
      </button>

      <Map />

      {isLoading && (
        <div className="text-sm text-gray-500">지도 멤버 로딩 중…</div>
      )}
      {isError && (
        <div className="text-sm text-red-600">
          로드 실패: {String(error?.message ?? "네트워크 오류")}
        </div>
      )}

      <div className="p-[1.25rem] w-full">
        <MemberCard
          members={members}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </div>

      <LocationLayer
        members={members}
        selectedId={selectedId}
        onSelect={handleSelect}
        myEmail={myEmail}
      />
    </div>
  );
};

export default MapView;
