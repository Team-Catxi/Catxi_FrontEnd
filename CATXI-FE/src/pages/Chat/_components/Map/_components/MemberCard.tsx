import MemberItem, { type MemberLite } from "./MemberItem";

interface MemberCardProps {
  members: MemberLite[];
  selectedId: string | number | null;
  onSelect: (id: string | number | null) => void;
  className?: string;
}

export default function MemberCard({
  members,
  selectedId,
  onSelect,
  className = "",
}: MemberCardProps) {
  const handleSelect = (id: string | number) => {
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
        {members.map((m) => (
          <MemberItem
            key={m.id}
            member={m} // ✅ email 포함된 MemberLite 공유
            selected={selectedId === m.id}
            onClick={() => handleSelect(m.id)}
            maskName
          />
        ))}
      </div>
    </div>
  );
}
