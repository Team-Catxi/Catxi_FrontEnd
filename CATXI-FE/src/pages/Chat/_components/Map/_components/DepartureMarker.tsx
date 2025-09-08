import { useMemo } from "react";
import { locationCoordinatesMap } from "../../../../../constants/coordinates";

type DepartureKey = keyof typeof locationCoordinatesMap;
type LatLng = { latitude: number; longitude: number };

interface DepartureMarkerProps {
  departureKey: DepartureKey | null;
  className?: string;
}

export default function DepartureMarker({
  departureKey,
  className = "",
}: DepartureMarkerProps) {
  const coords = useMemo<LatLng | null>(() => {
    return departureKey ? locationCoordinatesMap[departureKey] ?? null : null;
  }, [departureKey]);

  const handleClick = () => {
    if (coords) {
      console.log("출발지 좌표:", coords);
    } else {
      console.log("출발지 좌표 없음(유효한 departureKey 아님):", departureKey);
    }
  };

  return (
    <div
      className={`p-[0.5rem] bg-violet-600 rounded-[2rem] items-center gap-[0.25rem] pointer-events-auto ${className}`}
      onClick={handleClick}
    >
      <p className="text-white text-[1rem]">출발지</p>
    </div>
  );
}
