import LocationItem from "./LocationItem";
import type { ApiMember } from "../../../../../types/chat/members";

interface LocationLayerProps {
  members: ApiMember[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  myEmail?: string;
  className?: string;
}

const makeStableId = (m: ApiMember) => `${m.roomId}:${m.email}`;

export default function LocationLayer({
  members,
  selectedId,
  onSelect,
  myEmail,
  className = "",
}: LocationLayerProps) {
  // 클릭 시: 선택 토글 + 위도/경도 콘솔 출력 => 추후 마커 위치로 반영
  const handleClick = (member: ApiMember) => {
    const id = makeStableId(member);
    onSelect(selectedId === id ? null : id);

    const { latitude, longitude, name, email } = member;

    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      console.log(
        "클릭한 멤버 좌표:",
        { name, email },
        { latitude, longitude }
      );
    } else {
      console.log("좌표 없음:", { name, email, latitude, longitude });
    }
  };

  return (
    <div className={className}>
      {members.map((m) => {
        const id = makeStableId(m);
        return (
          <LocationItem
            key={id}
            name={m.name}
            selected={selectedId === id}
            email={m.email}
            myEmail={myEmail || ""}
            onClick={() => handleClick(m)}
          />
        );
      })}
    </div>
  );
}
