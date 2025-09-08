import { useEffect, useMemo, useState } from "react";
import { Map } from "./_components/Map";
import MemberCard from "./_components/MemberCard";
import LocationLayer from "./_components/LocationLayer";
import { useMapGet } from "../../../../hooks/query/useMapGet";
import type { ApiMember } from "../../../../types/chat/members";
import { useTabBar } from "../../../../contexts/TabBarContext";

interface MapViewProps {
  onClose: () => void;
  roomId: number;
  myEmail: string;
}

const makeStableId = (m: ApiMember) => `${m.roomId}:${m.email}`;

const MapView = ({ onClose, roomId, myEmail }: MapViewProps) => {
  const { data, isLoading, isError, error } = useMapGet(roomId);
  const { setHidden } = useTabBar();

  console.log(" roomId:", roomId);
  console.log(" myEmail:", myEmail);
  console.log("Map data  1:", data);

  const members = useMemo<ApiMember[]>(() => {
    return data?.data?.coordinates ?? [];
  }, [data]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setHidden(true);
    return () => {
      setHidden(false);
    };
  }, [setHidden]);

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
    <div className="absolute inset-0">
      {/* 지도는 풀스크린 배경 */}
      <div className="absolute inset-0 z-0">
        <Map />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* 상단 UI */}
        <div className="flex flex-col items-center gap-4 p-4 pointer-events-auto">
          <p className="text-gray-700 text-lg font-medium">
            현재 Room ID: {roomId}
          </p>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            임시 닫기
          </button>

          {isLoading && (
            <div className="text-sm text-gray-500">지도 멤버 로딩 중…</div>
          )}
          {isError && (
            <div className="text-sm text-red-600">
              로드 실패: {String(error?.message ?? "네트워크 오류")}
            </div>
          )}
        </div>

        {/* 지도 위 마커: 서버 좌표 기반 */}
        <LocationLayer
          members={members}
          selectedId={selectedId}
          onSelect={handleSelect}
          myEmail={myEmail}
          className="absolute inset-0 pointer-events-auto"
        />

        {/* 하단 고정 MemberCard */}
        <div className="absolute bottom-5 left-0 right-0 px-4 pointer-events-auto">
          <MemberCard
            members={members}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default MapView;
