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

  // 멤버 배열/선택 상태 변화에 따라 오버레이 생성/업데이트/삭제
  useEffect(() => {
    const kakao = window.__kakao;
    const map = window.__kakaoMap;
    if (!kakao || !map) return;

    const existing = overlaysRef.current;

    // 1) 유효 좌표만 대상
    const validMembers = members.filter(
      (m) => Number.isFinite(m.latitude) && Number.isFinite(m.longitude)
    );
    const nextIds = new Set(validMembers.map(makeStableId));

    // 2) 사라진 멤버 오버레이 제거
    existing.forEach((entry, id) => {
      if (!nextIds.has(id)) {
        entry.root.unmount();
        entry.overlay.setMap(null);
        existing.delete(id);
      }
    });

    // 3) 새/변경 멤버 오버레이 생성/업데이트
    validMembers.forEach((m) => {
      const id = makeStableId(m);
      const pos = new kakao.maps.LatLng(m.latitude, m.longitude);
      const isSelected = selectedId === id;

      const renderItem = (root: Root) => {
        root.render(
          <LocationItem
            name={m.name}
            email={m.email}
            myEmail={myEmail || ""}
            selected={isSelected}
            onClick={() => {
              const next = isSelected ? null : id;
              onSelect(next);

              // 클릭 시 포커스 이동
              window.__kakaoMap?.panTo(pos);

              // 디버그 로그
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
