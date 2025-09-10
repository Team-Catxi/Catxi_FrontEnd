import MemberItem from "./MemberItem";
import type { ApiMember } from "../../../../../types/chat/members";

interface MemberCardProps {
  members: ApiMember[];
  selectedId: string | null;
  onSelect: (id: string | null, pos?: { lat: number; lng: number }) => void; // 좌표도 전달
  className?: string;
}

const makeStableId = (m: ApiMember) => `${m.roomId}:${m.email}`;

export default function MemberCard({
  members,
  selectedId,
  onSelect,
  className = "",
}: MemberCardProps) {
  const handleClick = (member: ApiMember) => {
    const id = makeStableId(member);
    const nextId = selectedId === id ? null : id;

    let pos: { lat: number; lng: number } | undefined;
    const { latitude, longitude, name, email } = member;

    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      pos = { lat: latitude!, lng: longitude! };
      console.log("클릭한 멤버 좌표:", { name, email }, pos);
    } else {
      console.log("좌표 없음:", { name, email, latitude, longitude });
    }

    // id와 좌표(pos)를 함께 전달
    onSelect(nextId, pos);
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
        {Array.isArray(members) &&
          members.map((m) => {
            const id = makeStableId(m);
            return (
              <MemberItem
                key={id}
                member={m}
                selected={selectedId === id}
                onClick={() => handleClick(m)}
                maskName={true}
              />
            );
          })}
      </div>
    </div>
  );
}
