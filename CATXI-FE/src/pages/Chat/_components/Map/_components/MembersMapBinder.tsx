import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import MemberCard from "./MemberCard";
import LocationItem from "./LocationItem";
import type { MemberLite } from "./MemberItem";

declare global {
  interface Window {
    kakao: any;
  }
}

export interface MemberWithCoord extends MemberLite {
  lat: number;
  lng: number;
  email?: string;
}

interface MembersMapBinderProps {
  map?: any; // kakao.maps.Map 인스턴스
  members?: MemberWithCoord[];
  myEmail?: string;
  className?: string; // 카드에 전달할 추가 클래스
}

export default function MembersMapBinder({
  map,
  members,
  myEmail,
  className,
}: MembersMapBinderProps) {
  const fallback = useMemo<MemberWithCoord[]>(
    () => [
      {
        id: 1,
        name: "김예연",
        distanceKm: 12,
        lat: 37.5,
        lng: 126.9,
        email: "a@a.com",
      },
      {
        id: 2,
        name: "김예연",
        distanceKm: 13,
        lat: 37.501,
        lng: 126.902,
        email: "b@a.com",
      },
      {
        id: 3,
        name: "가나다라마바",
        distanceKm: 1,
        lat: 37.503,
        lng: 126.905,
        email: "c@a.com",
      },
    ],
    []
  );

  const data = members?.length ? members : fallback;

  const [selectedId, setSelectedId] = useState<string | number | null>(
    data[0]?.id ?? null
  );

  // 오버레이 관리
  const overlaysRef = useRef<
    Record<
      string | number,
      { overlay: any; root: Root; container: HTMLElement }
    >
  >({});

  const toggleSelect = (id: string | number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  // 멤버 / 선택 변경 시 오버레이 갱신
  useEffect(() => {
    if (!map || !window.kakao) return;

    // 기존 것들 제거
    Object.values(overlaysRef.current).forEach(({ overlay, root }) => {
      overlay.setMap(null);
      root.unmount();
    });
    overlaysRef.current = {};

    // 새로 생성
    data.forEach((m) => {
      const container = document.createElement("div");
      const root = createRoot(container);
      root.render(
        <LocationItem
          name={m.name}
          selected={selectedId === m.id}
          email={m.email}
          myEmail={myEmail}
          onClick={() => toggleSelect(m.id)} // ✅ 마커 클릭 → 선택 동기화
        />
      );

      const pos = new window.kakao.maps.LatLng(m.lat, m.lng);
      const overlay = new window.kakao.maps.CustomOverlay({
        position: pos,
        content: container,
        xAnchor: 0.5,
        yAnchor: 1.0,
        zIndex: selectedId === m.id ? 5 : 2,
      });

      overlay.setMap(map);
      overlaysRef.current[m.id] = { overlay, root, container };
    });

    // cleanup
    return () => {
      Object.values(overlaysRef.current).forEach(({ overlay, root }) => {
        overlay.setMap(null);
        root.unmount();
      });
      overlaysRef.current = {};
    };
  }, [map, data, selectedId, myEmail]);

  return (
    <MemberCard
      className={className}
      members={data}
      selectedId={selectedId}
      onSelect={setSelectedId} // ✅ 카드 클릭 → 마커 선택 동기화
    />
  );
}
