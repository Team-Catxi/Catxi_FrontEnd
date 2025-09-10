// LocationLayer.tsx
import { useEffect, useRef, useState } from "react";
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
  const [retryKey, setRetryKey] = useState(0); // 재시도 트리거

  useEffect(() => {
    const kakao = window.__kakao;
    const map = window.__kakaoMap;

    // 지도가 아직 준비 안 됐으면 100ms 후 재시도
    if (!kakao || !map) {
      const id = setTimeout(() => {
        setRetryKey((k) => k + 1);
      }, 100);
      return () => clearTimeout(id);
    }

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

    // 기존 overlay 중 빠진 멤버 제거
    existing.forEach((entry, id) => {
      if (!nextIds.has(id)) {
        entry.root.unmount();
        entry.overlay.setMap(null);
        existing.delete(id);
      }
    });

    // 새 멤버 overlay 추가/업데이트
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

      // 새 overlay 생성
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
  }, [members, selectedId, onSelect, myEmail, retryKey]);

  // 언마운트 시 정리
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
