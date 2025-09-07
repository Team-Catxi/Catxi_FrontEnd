import MemberItem from "./MemberItem";
import type { ApiMember } from "../../../../../types/chat/members";

interface MemberCardProps {
  members: ApiMember[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  className?: string;
}

// 안정 키 생성기: roomId + email
const makeStableId = (m: ApiMember) => `${m.roomId}:${m.email}`;

export default function MemberCard({
  members,
  selectedId,
  onSelect,
  className = "",
}: MemberCardProps) {
  const handleSelect = (id: string) => {
    onSelect(selectedId === id ? null : id);
  };

  return (
    <div
      className={`w-full p-[1.25rem] rounded-[0.625rem] bg-white flex flex-col gap-[0.625rem] shadow-md ${className}`}
    >
      <p className="text-gray-700 text-lg font-medium">
        채팅 멤버{" "}
        <span className="text-violet-600 font-semibold">{members.length}</span>
      </p>

      <div className="w-full inline-flex flex-nowrap justify-center gap-[1.25rem]">
        {members.map((m) => {
          const id = makeStableId(m);
          return (
            <MemberItem
              key={id}
              member={m} // ✅ 서버 스키마 그대로 전달
              selected={selectedId === id}
              onClick={() => handleSelect(id)}
              maskName
            />
          );
        })}
      </div>
    </div>
  );
}
