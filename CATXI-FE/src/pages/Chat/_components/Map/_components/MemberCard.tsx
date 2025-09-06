import { useEffect, useMemo, useState } from "react";
import MemberItem, { type MemberLite } from "./MemberItem";

interface MemberCardProps {
  members?: MemberLite[];
  selectedId?: string | number | null;
  onSelect?: (id: string | number | null) => void;
  className?: string;
}

export default function MemberCard({
  members,
  selectedId: controlledSelected,
  onSelect,
  className = "",
}: MemberCardProps) {
  const fallbackMembers = useMemo<MemberLite[]>(
    () => [
      { id: 1, name: "김예연", distanceKm: 12 },
      { id: 2, name: "김예연", distanceKm: 13 },
      { id: 3, name: "가나다라마바", distanceKm: 1 },
      { id: 4, name: "홍길동", distanceKm: 0.5 },
    ],
    []
  );

  const data = members && members.length ? members : fallbackMembers;

  const [uncontrolledSelected, setUncontrolledSelected] = useState<
    string | number | null
  >(data[0]?.id ?? null);

  useEffect(() => {
    if (controlledSelected === undefined) {
      setUncontrolledSelected(data[0]?.id ?? null);
    }
  }, [data, controlledSelected]);

  const selected =
    controlledSelected !== undefined
      ? controlledSelected
      : uncontrolledSelected;

  const handleSelect = (id: string | number) => {
    const next = selected === id ? null : id;
    onSelect?.(next);
    if (controlledSelected === undefined) setUncontrolledSelected(next);
  };

  return (
    <div
      className={`w-full p-[1.25rem] rounded-[0.625rem] bg-white flex flex-col gap-[0.625rem] shadow-md ${className}`}
    >
      <p className="text-gray-700 text-lg font-medium">
        채팅 멤버{" "}
        <span className="text-violet-600 font-semibold">{data.length}</span>
      </p>

      <div className=" w-full inline-flex flex-nowrap justify-center gap-[1.25rem]">
        {data.map((m) => (
          <MemberItem
            key={m.id}
            member={m}
            selected={selected === m.id}
            onClick={() => handleSelect(m.id)}
            maskName
          />
        ))}
      </div>
    </div>
  );
}
