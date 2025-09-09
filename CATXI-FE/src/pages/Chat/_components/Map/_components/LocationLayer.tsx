// LocationLayer.tsx
import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import LocationItem from "./LocationItem";
import type { ApiMember } from "../../../../../types/chat/members";

const makeStableId = (m: ApiMember) => `${m.roomId}:${m.email}`;

interface LocationLayerProps {
  members: ApiMember[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  myEmail?: string;
  className?: string;
}

type OverlayEntry = {
  overlay: any;
  root: Root;
  container: HTMLDivElement;
  member: ApiMember;
};

export default function LocationLayer({
  members,
  selectedId,
  onSelect,
  myEmail,
}: LocationLayerProps) {
  const overlaysRef = useRef<Map<string, OverlayEntry>>(new Map());

  useEffect(() => {
    const kakao = window.__kakao;
    const map = window.__kakaoMap;
    if (!kakao || !map) return;

    const existing = overlaysRef.current;

    const validMembers = members.filter(
      (m) =>
        m &&
        typeof m.email === "string" &&
        m.email.trim() !== "" &&
        typeof m.name === "string" &&
        m.name.trim() !== "" &&
        typeof m.latitude === "number" &&
        typeof m.longitude === "number" &&
        Number.isFinite(m.latitude) &&
        Number.isFinite(m.longitude)
    );

    const nextIds = new Set(validMembers.map(makeStableId));

    existing.forEach((entry, id) => {
      if (!nextIds.has(id)) {
        entry.root.unmount();
        entry.overlay.setMap(null);
        existing.delete(id);
      }
    });

    validMembers.forEach((m) => {
      const id = makeStableId(m);
      const pos = new kakao.maps.LatLng(m.latitude!, m.longitude!);
      const isSelected = selectedId === id;

      const renderItem = (root: Root) => {
        root.render(
          <LocationItem
            name={m.name ?? "이름없음"}
            email={m.email ?? ""}
            myEmail={myEmail ?? ""}
            selected={isSelected}
            onClick={() => {
              const next = isSelected ? null : id;
              onSelect(next);

              if (window.__kakaoMap) {
                window.__kakaoMap.panTo(pos);
              }

              console.log("멤버 좌표:", {
                name: m.name,
                email: m.email,
                latitude: m.latitude,
                longitude: m.longitude,
              });
            }}
          />
        );
      };

      if (existing.has(id)) {
        const entry = existing.get(id)!;
        entry.overlay.setPosition(pos);
        renderItem(entry.root);
        entry.overlay.setZIndex(isSelected ? 2 : 1);
        entry.member = m;
        return;
      }

      const container = document.createElement("div");
      container.style.pointerEvents = "auto";
      const root = createRoot(container);
      renderItem(root);

      const overlay = new kakao.maps.CustomOverlay({
        map,
        position: pos,
        content: container,
        yAnchor: 1,
        xAnchor: 0.5,
        clickable: true,
      });
      overlay.setZIndex(isSelected ? 2 : 1);

      existing.set(id, { overlay, root, container, member: m });
    });
  }, [members, selectedId, onSelect, myEmail]);

  useEffect(() => {
    return () => {
      const existing = overlaysRef.current;
      existing.forEach(({ overlay, root }) => {
        root.unmount();
        overlay.setMap(null);
      });
      existing.clear();
    };
  }, []);

  return null;
}
