import { useEffect, useMemo, useState } from "react";
import MemberCard from "./Chat/_components/Map/_components/MemberCard";
import LocationLayer from "./Chat/_components/Map/_components/LocationLayer"; // TODO: 지도 컴포넌트로 교체 예정
import { toMemberLiteList } from "../utils/chat/membersMapper";
import { mockApiMembers } from "./Chat/_components/Map/_components/members.mock";
import type { MemberLite } from "./Chat/_components/Map/_components/MemberItem";

const TestPage = () => {
  //TODO: 목업 → UI 모델로 변환 (API 연결되면 mockApiMembers만 교체)
  const members = useMemo(() => toMemberLiteList(mockApiMembers), []);

  const [selectedId, setSelectedId] = useState<MemberLite["id"] | null>(null);

  useEffect(() => {
    if (selectedId !== null && !members.some((m) => m.id === selectedId)) {
      setSelectedId(null);
    }
  }, [members, selectedId]);

  //TODO: 내 이메일 상위 프롭스롭 받기 + 이메일 확인로직 active로 밑에 내려주기
  const me = { email: "me@example.com" };

  const handleSelect = (id: MemberLite["id"] | null) => setSelectedId(id);

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-gray-50">
      <p className="text-lg font-medium text-gray-700">현재 Room ID:</p>

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
