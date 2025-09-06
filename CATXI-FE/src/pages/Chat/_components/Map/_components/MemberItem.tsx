import { useEffect, useMemo, useState } from "react";
import ClickMember from "../../../../../assets/icons/ClickMember.svg";
import Member from "../../../../../assets/icons/Member.svg";

interface MemberLite {
  id: string | number;
  name: string;
  distanceKm: number;
  active?: boolean;
}

interface MemberItemProps {
  roomId?: number;
  members?: MemberLite[];
  selectedId?: string | number | null;
  onSelect?: (id: string | number | null) => void;
}

function maskName(name: string) {
  if (!name) return "";
  const arr = [...name];
  if (arr.length <= 1) return name;
  if (arr.length === 2) return `${arr[0]}*`;
  return `${arr[0]}*${arr[arr.length - 1]}`;
}

export default function MemberItem({
  members,
  selectedId: controlledSelected,
  onSelect,
}: MemberItemProps) {
  const fallbackMembers = useMemo<MemberLite[]>(
    () => [
      { id: 1, name: "김예연", distanceKm: 12, active: true },
      { id: 2, name: "김예연", distanceKm: 13, active: false },
      { id: 3, name: "김예연", distanceKm: 1, active: false },
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
    <div className="p-[1.25rem] rounded-[0.625rem] bg-white flex flex-col gap-[0.625rem] shadow-md">
      <p className="text-gray-700 text-lg font-medium">
        채팅 멤버{" "}
        <span className="text-violet-600 font-semibold">{data.length}</span>
      </p>

      <div className="flex gap-[1.25rem] ">
        {data.map((m) => {
          const isSelected = selected === m.id;
          const isDimmed = m.active === false && !isSelected;
          const name = maskName(m.name);
          const km = Math.round(m.distanceKm);

          return (
            <button
              type="button"
              key={m.id}
              onClick={() => handleSelect(m.id)}
              aria-pressed={isSelected}
              className={`group flex flex-col items-center gap-1 focus:outline-none ${
                isDimmed ? "opacity-60" : ""
              }`}
            >
              <div className="w-[66px] h-[66px] rounded-full flex items-center justify-center transition-all">
                <img
                  src={
                    isSelected
                      ? (ClickMember as unknown as string)
                      : (Member as unknown as string)
                  }
                  alt={name}
                  className="w-60 h-60"
                />
              </div>

              <div
                className={`text-[13px] font-medium ${
                  isSelected ? "text-violet-600" : "text-gray-500"
                }`}
              >
                {name}
              </div>

              <div
                className={`px-3 h-6 leading-6 rounded-full text-[12px] font-semibold mt-0.5 ${
                  isSelected
                    ? "bg-violet-600 text-white"
                    : "bg-gray-300 text-white"
                }`}
              >
                {km}km
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
