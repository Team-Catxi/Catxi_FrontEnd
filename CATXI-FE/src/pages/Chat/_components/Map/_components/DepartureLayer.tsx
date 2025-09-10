import { useEffect, useMemo, useState } from "react";
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
  const coords = useMemo(() => {
    return departureKey ? locationCoordinatesMap[departureKey] ?? null : null;
  }, [departureKey]);

  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const w = window;
    if (!coords || !w.__kakao || !w.__kakaoMap) return;

    const { maps } = w.__kakao;
    const map = w.__kakaoMap;
    const latlng = new maps.LatLng(coords.latitude, coords.longitude);

    let raf: number | null = null;

    const compute = () => {
      const p = map.getProjection().containerPointFromCoords(latlng);
      setPt({ x: p.x, y: p.y });
    };

    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    compute();

    maps.event.addListener(map, "center_changed", schedule);
    maps.event.addListener(map, "zoom_changed", schedule);
    maps.event.addListener(map, "idle", schedule);

    const onResize = () => {
      if (typeof map.relayout === "function") map.relayout();
      schedule();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      maps.event.removeListener(map, "center_changed", schedule);
      maps.event.removeListener(map, "zoom_changed", schedule);
      maps.event.removeListener(map, "idle", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, [coords]);

  if (!coords || !pt) return null;

  return (
    <div
      className="absolute z-30 pointer-events-auto"
      style={{
        left: pt.x,
        top: pt.y,
        transform: "translate(-50%, -100%)",
      }}
      onClick={() => onFocus?.(coords)}
    >
      <DepartIcon className="w-[3rem] h-[3rem]" />
    </div>
  );
}
