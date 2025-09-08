import { useEffect, useRef } from "react";
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
}

export const Map = ({ initialCenter, level = 3 }: MapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

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
      })
      .catch((err) => {
        console.error("Kakao Map load failed:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const kakao = window.__kakao;
    const map = window.__kakaoMap;
    if (!kakao || !map || !initialCenter) return;

    const pos = new kakao.maps.LatLng(
      initialCenter.latitude,
      initialCenter.longitude
    );
    map.setCenter(pos);
  }, [initialCenter]);

  return <div ref={containerRef} className="w-full h-full bg-amber-300" />;
};
