import ClickMember from "../../../../../assets/icons/ClickMember.svg?react";
import Member from "../../../../../assets/icons/Member.svg?react";

interface MemberLite {
  roomId: number;
  email: string;
  name: string;
  nickname: string;
  latitude: number;
  longitude: number;
  distance: number;
  active?: boolean;
}

interface MemberItemProps {
  member: MemberLite;
  selected?: boolean;
  onClick?: () => void;
  maskName?: boolean;
}

function mask(name: string) {
  if (!name) return "";
  const arr = [...name];
  if (arr.length >= 2) arr[1] = "*";
  return arr.join("");
}

export default function MemberItem({
  member,
  selected = false,
  onClick,
  maskName = true,
}: MemberItemProps) {
  const name = maskName ? mask(member.name) : member.name;
  const km = Number.isFinite(member.distance)
    ? Math.round(member.distance)
    : 0;
  const isDimmed = member.active === false && !selected;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex flex-col items-center gap-1 ${
        isDimmed ? "opacity-60" : ""
      }`}
    >
      {/* 아이콘 */}
      <div className="w-[4rem] h-[4rem] flex items-center justify-center transition-all">
        {selected ? (
          <ClickMember className="w-[3.75rem] h-[3.75rem] select-none" />
        ) : (
          <Member className="w-[3.75rem] h-[3.75rem] select-none" />
        )}
      </div>

      {/* 이름 */}
      <div
        className={`text-[13px] font-medium ${
          selected ? "text-violet-600" : "text-gray-500"
        } max-w-[5ch] truncate`}
        title={name}
      >
        {name}
      </div>

      {/* 거리 뱃지 */}
      <div
        className={`px-3 h-6 leading-6 rounded-full text-[12px] font-semibold mt-0.5 ${
          selected ? "bg-violet-600 text-white" : "bg-gray-300 text-white"
        }`}
      >
        {km}km
      </div>
    </button>
  );
}
