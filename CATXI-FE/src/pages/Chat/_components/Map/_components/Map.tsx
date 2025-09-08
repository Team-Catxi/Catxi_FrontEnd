import { useEffect, useRef } from "react";
import { loadKakaoMap } from "../../../../../apis/kakaoMap/useKakaoLoader";

export const Map = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    loadKakaoMap()
      .then((kakao) => {
        if (!mounted || !containerRef.current || mapRef.current) return;

        const center = new kakao.maps.LatLng(33.450701, 126.570667);
        mapRef.current = new kakao.maps.Map(containerRef.current, {
          center,
          level: 3,
        });
      })
      .catch((err) => {
        console.error("Kakao Map load failed:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full bg-amber-300" />;
};
