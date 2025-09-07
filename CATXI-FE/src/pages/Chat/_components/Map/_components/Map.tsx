import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export const Map = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null); // 중복 초기화 방지

  useEffect(() => {
    if (!window.kakao) return;
    window.kakao.maps.load(() => {
      if (!containerRef.current || mapRef.current) return;
      const center = new window.kakao.maps.LatLng(33.450701, 126.570667);
      mapRef.current = new window.kakao.maps.Map(containerRef.current, {
        center,
        level: 3,
      });
    });
  }, []);

  return <div ref={containerRef} className="w-full h-full bg-amber-300" />;
};
