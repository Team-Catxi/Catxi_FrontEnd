import { useMemo } from "react";
import { locationCoordinatesMap } from "../../../../../constants/coordinates";
import DepartIcon from "../../../../../assets/icons/departure.svg?react";

type DepartureKey = keyof typeof locationCoordinatesMap;
type LatLng = { latitude: number; longitude: number };

interface DepartureLayerProps {
  departureKey: DepartureKey | null;
  onFocus?: (coords: LatLng) => void;
}

export default function DepartureLayer({
  departureKey,
  onFocus,
}: DepartureLayerProps) {
  const coords = useMemo<LatLng | null>(() => {
    return departureKey ? locationCoordinatesMap[departureKey] ?? null : null;
  }, [departureKey]);

  const handleClick = () => {
    if (coords && onFocus) onFocus(coords);
    else
      console.log("출발지 좌표 없음(유효한 departureKey 아님):", departureKey);
  };

  return (
    <div className="pointer-events-auto" onClick={handleClick}>
      <DepartIcon className="w-[3rem] h-[3rem]" />
    </div>
  );
}
