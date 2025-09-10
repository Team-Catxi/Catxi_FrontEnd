import { useMemo } from "react";
import { locationCoordinatesMap } from "../../../../../constants/coordinates";
import LocationIcon from "../../../../../assets/icons/LocationIcon.svg?react";

type DepartureKey = keyof typeof locationCoordinatesMap;
type LatLng = { latitude: number; longitude: number };

interface DepartureMarkerProps {
  departureKey: DepartureKey | null;
  className?: string;
  onFocus?: (coords: LatLng) => void;
}

export default function DepartureMarker({
  departureKey,
  className = "",
  onFocus,
}: DepartureMarkerProps) {
  const coords = useMemo<LatLng | null>(() => {
    return departureKey ? locationCoordinatesMap[departureKey] ?? null : null;
  }, [departureKey]);

  const handleClick = () => {
    if (coords && onFocus) onFocus(coords);
    else if (!coords) console.log("출발지 좌표 없음:", departureKey);
  };

  return (
    <div
      className={`p-[0.5rem] flex flex-row bg-violet-600 rounded-[2rem] items-center gap-[0.25rem] pointer-events-auto ${className}`}
      onClick={handleClick}
    >
      <LocationIcon className="w-[1.125rem] h-[1.125rem] " />
      <p className="text-white text-[1rem]">출발지</p>
    </div>
  );
}
