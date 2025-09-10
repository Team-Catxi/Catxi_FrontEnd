import MemberLocation from "../../../../../assets/icons/MemberLocation.svg?react";
import YourLocation from "../../../../../assets/icons/YourLocation.svg?react";
import ClickMemberLocation from "../../../../../assets/icons/ClickLocation.svg?react";

interface LocationItemProps {
  name: string;
  selected: boolean;
  email: string;
  myEmail: string;
  className?: string;
  onClick: () => void;
}

function maskSecond(name: string) {
  if (!name) return "";
  const arr = [...name];
  if (arr.length >= 2) arr[1] = "*";
  return arr.join("");
}

const LocationItem = ({
  name,
  selected,
  email,
  myEmail,
  className = "",
  onClick,
}: LocationItemProps) => {
  const self = myEmail && email ? myEmail === email : false;

  const nameColor = selected
    ? "text-violet-600"
    : self
    ? "text-blue-600"
    : "text-gray-400";

  const displayName = maskSecond(name);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      className={`cursor-pointer select-none flex flex-col items-center ${className}`}
      aria-selected={selected}
    >
      {/* 이름 */}
      <div
        className={`mb-1 text-sm font-semibold ${nameColor} max-w-[6ch] truncate text-center`}
        title={displayName}
      >
        {displayName}
      </div>

      {/* 아이콘 조건부 렌더링 */}
      {selected ? (
        <ClickMemberLocation className="w-[72px] h-[72px] pointer-events-none select-none" />
      ) : self ? (
        <YourLocation className="w-[72px] h-[72px] pointer-events-none select-none" />
      ) : (
        <MemberLocation className="w-[72px] h-[72px] pointer-events-none select-none" />
      )}
    </div>
  );
};

export default LocationItem;
