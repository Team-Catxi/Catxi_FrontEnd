import { locationCoordinatesMap } from "../../../../../constants/coordinates";

interface DepartureMarkerProps {
  onClick: () => void;
  departure?: typeof locationCoordinatesMap;
}

export default function DepartureMarker({ onClick }: DepartureMarkerProps) {
  return (
    <div
      className="p-[0.5rem] bg-violet-600 rounded-[2rem]  items-center gap-[0.25rem] "
      onClick={onClick}
    >
      <p className="text-white text-[1rem] ">출발지</p>
    </div>
  );
}
