import { useEffect, useState } from "react";

export interface KakaoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export function useKakaoLocation() {
  const [location, setLocation] = useState<KakaoLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("브라우저에서 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        if (window.kakao?.maps?.services) {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2Address(lng, lat, (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              setLocation({
                latitude: lat,
                longitude: lng,
                address: result[0].address.address_name,
              });
            } else {
              setLocation({ latitude: lat, longitude: lng });
            }
          });
        } else {
          setLocation({ latitude: lat, longitude: lng });
        }
      },
      (err) => {
        setError(err.message);
      }
    );
  }, []);

  return { location, error };
}
