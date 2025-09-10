import { useEffect, useMemo, useState } from "react";
import DepartIcon from "../../../../../assets/icons/departIcon.svg?react";
import { locationCoordinatesMap } from "../../../../../constants/coordinates";

type DepartureKey = keyof typeof locationCoordinatesMap;
type LatLng = { latitude: number; longitude: number };

interface DepartureLayerProps {
  departureKey: DepartureKey | null;
  onFocus?: (coords: LatLng) => void;
  freezeDuringDrag?: boolean;
}

export default function DepartureLayer({
  departureKey,
  onFocus,
  freezeDuringDrag = true,
}: DepartureLayerProps) {
  const coords = useMemo(
    () => (departureKey ? locationCoordinatesMap[departureKey] ?? null : null),
    [departureKey]
  );

  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const w = window;
    if (!coords || !w.__kakao || !w.__kakaoMap) return;

    const { maps } = w.__kakao;
    const map = w.__kakaoMap;
    const latlng = new maps.LatLng(coords.latitude, coords.longitude);

    let raf: number | null = null;
    let dragging = false;

    const compute = () => {
      const p = map.getProjection().containerPointFromCoords(latlng);
      setPt({ x: p.x, y: p.y });
    };
    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    compute();

    const onDragStart = () => {
      dragging = true;
    };
    const onDragEnd = () => {
      dragging = false;
      schedule();
    };
    const onCenterChanged = () => {
      if (!freezeDuringDrag) {
        schedule();
        return;
      }
      if (!dragging) {
        schedule();
      }
    };
    const onZoomChanged = () => {
      schedule();
    };

    maps.event.addListener(map, "dragstart", onDragStart);
    maps.event.addListener(map, "dragend", onDragEnd);
    maps.event.addListener(map, "center_changed", onCenterChanged);
    maps.event.addListener(map, "zoom_changed", onZoomChanged);
    maps.event.addListener(map, "idle", schedule);

    const onResize = () => {
      if (typeof map.relayout === "function") map.relayout();
      schedule();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      maps.event.removeListener(map, "dragstart", onDragStart);
      maps.event.removeListener(map, "dragend", onDragEnd);
      maps.event.removeListener(map, "center_changed", onCenterChanged);
      maps.event.removeListener(map, "zoom_changed", onZoomChanged);
      maps.event.removeListener(map, "idle", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, [coords, freezeDuringDrag]);

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
