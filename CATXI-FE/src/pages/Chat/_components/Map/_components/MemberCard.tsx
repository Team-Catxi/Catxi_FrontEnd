import MemberItem from "./MemberItem";
import type { ApiMember } from "../../../../../types/chat/members";

interface MemberCardProps {
  members: ApiMember[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
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
