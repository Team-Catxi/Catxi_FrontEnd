import LocationItem from "./LocationItem";
import type { ApiMember } from "../../../../../types/chat/members";

interface LocationLayerProps {
  members: ApiMember[]; // ✅ 서버 스키마 사용
  selectedId: string | null; // ✅ 안정 키 문자열
  onSelect: (id: string | null) => void;
  myEmail?: string;
  className?: string;
}

// 안정 키: roomId + email
const makeStableId = (m: ApiMember) => `${m.roomId}:${m.email}`;

export default function LocationLayer({
  members,
  selectedId,
  onSelect,
  myEmail,
  className = "",
}: LocationLayerProps) {
  const handleClick = (id: string) => {
    onSelect(selectedId === id ? null : id);
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
            onClick={() => handleClick(id)}
          />
        );
      })}
    </div>
  );
}
