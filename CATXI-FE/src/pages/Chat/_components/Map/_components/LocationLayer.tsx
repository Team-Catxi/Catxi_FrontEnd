import LocationItem from "./LocationItem";
import { type MemberLite } from "./MemberItem"; // 또는 './members.types'

interface LocationLayerProps {
  members: MemberLite[];
  selectedId: string | number | null;
  onSelect: (id: string | number | null) => void;
  myEmail?: string;
  className?: string;
}

export default function LocationLayer({
  members,
  selectedId,
  onSelect,
  myEmail,
  className = "",
}: LocationLayerProps) {
  const handleClick = (id: string | number) => {
    onSelect(selectedId === id ? null : id);
  };

  return (
    <div className={className}>
      {members.map((m) => (
        <LocationItem
          key={m.id}
          name={m.name}
          selected={selectedId === m.id}
          myEmail={myEmail}
          onClick={() => handleClick(m.id)}
        />
      ))}
    </div>
  );
}
