// TestPage.tsx
import { useEffect, useMemo, useState } from "react";
import MemberCard from "./Chat/_components/Map/_components/MemberCard";
import LocationLayer from "./Chat/_components/Map/_components/LocationLayer";
import { Map } from "./Chat/_components/Map/_components/Map";
import { useMapGet } from "../hooks/query/useMapGet";
import type { ApiMember } from "../types/chat/members";

const makeStableId = (m: ApiMember) => `${m.roomId}:${m.email}`;

const TestPage = () => {
  const roomId = 100; // TODO: 실제 값으로 대체 (e.g. useParams)
  const { data, isLoading, isError, error } = useMapGet(roomId);

  console.log("Map data:", data);

  // 서버 응답 그대로 사용
  const members = useMemo<ApiMember[]>(() => {
    return data?.data?.coordinates ?? [];
  }, [data]);

  // 안정 키 기반 선택 상태
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 선택된 항목이 목록에서 사라지면 선택 해제
  useEffect(() => {
    if (
      selectedId !== null &&
      !members.some((m) => makeStableId(m) === selectedId)
    ) {
      setSelectedId(null);
    }
  }, [members, selectedId]);

  const me = { email: "me@example.com" };
  const handleSelect = (id: string | null) => setSelectedId(id);

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-gray-50">
      <Map />

      <p className="text-lg font-medium text-gray-700">
        현재 Room ID: <span className="font-semibold">{roomId}</span>
      </p>

      {isLoading && (
        <div className="text-sm text-gray-500 px-5 py-2">
          지도 멤버 로딩 중…
        </div>
      )}
      {isError && (
        <div className="text-sm text-red-600 px-5 py-2">
          로드 실패: {String(error?.message ?? "네트워크 오류")}
        </div>
      )}

      <div className="p-[1.25rem]">
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
        myEmail={me.email}
      />
    </div>
  );
};

export default TestPage;
