// LocationLayer.tsx (projection 버전)
import { useEffect, useMemo, useState, useCallback } from "react";
import LocationItem from "./LocationItem";
import type { ApiMember } from "../../../../../types/chat/members";

const makeStableId = (m: ApiMember) => `${m.roomId}:${m.email}`;

interface LocationLayerProps {
  members: ApiMember[];
  selectedId: string | null;
  onSelect: (id: string | null, pos?: { lat: number; lng: number }) => void;
  myEmail?: string;
  className?: string; // 상위에서 absolute inset-0로 깔려 있음
}

type Pt = { x: number; y: number };

export default function LocationLayer({
  members,
  selectedId,
  onSelect,
  myEmail = "",
  className = "",
}: LocationLayerProps) {
  const validMembers = useMemo(
    () =>
      members.filter(
        (m) =>
          m &&
          typeof m.email === "string" &&
          m.email.trim() !== "" &&
          typeof m.name === "string" &&
          m.name.trim() !== "" &&
          Number.isFinite(m.latitude) &&
          Number.isFinite(m.longitude)
      ),
    [members]
  );

  // id -> {x,y} 매핑
  const [pts, setPts] = useState<Record<string, Pt>>({});

  const recompute = useCallback(() => {
    const w = window;
    const kakao = w.__kakao;
    const map = w.__kakaoMap;
    if (!kakao || !map) return;

    const proj = map.getProjection();
    const next: Record<string, Pt> = {};
    for (const m of validMembers) {
      const id = makeStableId(m);
      const p = proj.containerPointFromCoords(
        new kakao.maps.LatLng(m.latitude!, m.longitude!)
      );
      next[id] = { x: p.x, y: p.y };
    }
    setPts(next);
  }, [validMembers]);

  // 초기 계산 + 팬/줌 후 재계산(idle) + 윈도우 리사이즈
  useEffect(() => {
    const w = window;
    const kakao = w.__kakao;
    const map = w.__kakaoMap;

    if (!kakao || !map) return;

    // 최초
    recompute();

    const handler = () => recompute();
    kakao.maps.event.addListener(map, "idle", handler);

    const onResize = () => {
      // 지도 relayout 후 좌표 재계산(필요시)
      if (map.relayout) map.relayout();
      recompute();
    };
    window.addEventListener("resize", onResize);

    return () => {
      kakao.maps.event.removeListener(map, "idle", handler);
      window.removeEventListener("resize", onResize);
    };
  }, [recompute]);

  useEffect(() => {
    recompute();
  }, [recompute, validMembers]);

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{ pointerEvents: "none" }}
    >
      {validMembers.map((m) => {
        const id = makeStableId(m);
        const p = pts[id];
        if (!p) return null;

        const selected = selectedId === id;

        return (
          <div
            key={id}
            className="absolute"
            style={{
              left: p.x,
              top: p.y,
              transform: "translate(-50%, -100%)",
              pointerEvents: "auto",
              zIndex: selected ? 2 : 1,
            }}
            onClick={() => {
              onSelect(selected ? null : id, {
                lat: m.latitude!,
                lng: m.longitude!,
              });
            }}
          >
            <LocationItem
              name={m.name ?? "이름없음"}
              email={m.email ?? ""}
              myEmail={myEmail}
              selected={selected}
              onClick={() => {
                onSelect(selected ? null : id, {
                  lat: m.latitude!,
                  lng: m.longitude!,
                });
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
