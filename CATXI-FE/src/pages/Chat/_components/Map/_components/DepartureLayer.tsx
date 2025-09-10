import { useEffect, useState } from "react";
import DepartIcon from "../../../../../assets/icons/departIcon.svg?react";
import { locationCoordinatesMap } from "../../../../../constants/coordinates";
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
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const w = window;
    if (!departureKey || !w.__kakao || !w.__kakaoMap) return;

    const { maps } = w.__kakao;
    const map = w.__kakaoMap;
    const coords = locationCoordinatesMap[departureKey];
    if (!coords) return;

    const update = () => {
      const latlng = new maps.LatLng(coords.latitude, coords.longitude);
      const proj = map.getProjection();
      const p = proj.containerPointFromCoords(latlng); // (x,y)
      setPt({ x: p.x, y: p.y });
    };

    update();
    maps.event.addListener(map, "idle", update); // 팬/줌 후 재계산
    return () => maps.event.removeListener(map, "idle", update);
  }, [departureKey]);

  if (!pt) return null;

  return (
    <div
      className="absolute z-30 pointer-events-auto"
      style={{
        left: pt.x,
        top: pt.y,
        transform: "translate(-50%, -100%)",
      }}
      onClick={() => {
        const c = locationCoordinatesMap[departureKey!];
        onFocus?.(c);
      }}
    >
      <DepartIcon className="w-[3rem] h-[3rem]" />
    </div>
  );
}
