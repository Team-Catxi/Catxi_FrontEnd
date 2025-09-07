import MemberLocation from "../../../../../assets/icons/MemberLocation.svg";
import YourLocation from "../../../../../assets/icons/YourLocation.svg";
import ClickMemberLocation from "../../../../../assets/icons/ClickLocation.svg";

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

  const iconSrc = selected
    ? (ClickMemberLocation as unknown as string)
    : self
    ? (YourLocation as unknown as string)
    : (MemberLocation as unknown as string);

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
      className={`cursor-pointer select-none flex flex-col items-center -translate-x-1/2 -translate-y-full ${className}`}
      aria-selected={selected}
    >
      <div
        className={`mb-1 text-sm font-semibold ${nameColor} max-w-[6ch] truncate text-center`}
        title={displayName}
      >
        {displayName}
      </div>

      <img
        src={iconSrc}
        alt={selected ? "선택한 사용자 위치" : self ? "내 위치" : "멤버 위치"}
        className="w-[72px] h-[72px] pointer-events-none"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default LocationItem;
