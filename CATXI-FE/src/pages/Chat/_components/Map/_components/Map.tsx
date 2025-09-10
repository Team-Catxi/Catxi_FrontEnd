import { useEffect, useRef, useState } from "react";
import { loadKakaoMap } from "../../../../../apis/kakaoMap/useKakaoLoader";

type LatLng = { latitude: number; longitude: number };

declare global {
  interface Window {
    __kakao?: any;
    __kakaoMap?: any;
  }
}

interface MapProps {
  initialCenter?: LatLng | null;
  level?: number;
  onMapReady?: () => void; // 지도 준비 알림용
}

export const Map = ({ initialCenter, level = 3, onMapReady }: MapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadKakaoMap()
      .then((kakao) => {
        if (!mounted || !containerRef.current || mapRef.current) return;

        const centerLat = initialCenter?.latitude ?? 37.5665;
        const centerLng = initialCenter?.longitude ?? 126.978;

        const center = new kakao.maps.LatLng(centerLat, centerLng);
        mapRef.current = new kakao.maps.Map(containerRef.current, {
          center,
          level,
        });

        window.__kakao = kakao;
        window.__kakaoMap = mapRef.current;

        setMapReady(true);
        onMapReady?.(); // 외부에 알림
      })
      .catch((err) => {
        console.error("Kakao Map load failed:", err);
      });

    return () => {
      mounted = false;
      // cleanup
      mapRef.current = null;
      window.__kakaoMap = undefined;
    };
  }, []);

  // 초기 좌표 이동
  useEffect(() => {
    const kakao = window.__kakao;
    const map = window.__kakaoMap;
    if (!kakao || !map || !initialCenter) return;

    const pos = new kakao.maps.LatLng(
      initialCenter.latitude,
      initialCenter.longitude
    );
    map.setCenter(pos);
  }, [initialCenter, mapReady]); // mapReady가 true일 때만 실행

  return <div ref={containerRef} className="w-full h-full bg-amber-300" />;
};
