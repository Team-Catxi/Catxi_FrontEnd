import { useEffect, useState } from "react";
import { Map } from "./_components/Map";
import MemberCard from "./_components/MemberCard";
import LocationLayer from "./_components/LocationLayer";
import { useMapGet } from "../../../../hooks/query/useMapGet";
import type { ApiMember } from "../../../../types/chat/members";
import { useTabBar } from "../../../../contexts/TabBarContext";
import DepartureMarker from "./_components/DepartureMarker";
import { locationCoordinatesMap } from "../../../../constants/coordinates";
import type { ConnectionStatus } from "../../../../hooks/socket/useChatSocket";
import { useKakaoLocation } from "../../../../apis/kakaoMap/useKakaoLocation";

type DepartureKey = keyof typeof locationCoordinatesMap;

interface MapViewProps {
  onClose: () => void;
  roomId: number;
  myEmail: string;
  sendCoordinate: (payload: {
    roomId: number;
    email: string;
    name: string;
    nickname: string;
    latitude: number;
    longitude: number;
  }) => void;
  status: ConnectionStatus;
}

const makeStableId = (m: ApiMember) => `${m.roomId}:${m.email}`;

const MapView = ({
  onClose,
  roomId,
  myEmail,
  sendCoordinate,
  status,
}: MapViewProps) => {
  const { data, isLoading, isError, error } = useMapGet(roomId);
  const { setHidden } = useTabBar();
  const { location, error: locationError } = useKakaoLocation();

  if (isLoading) {
    return <p className="text-center text-gray-500">지도를 불러오는 중...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">
        좌표 데이터를 불러오지 못했습니다: {String(error)}
      </p>
    );
  }

  if (locationError) {
    return (
      <p className="text-center text-red-500">
        위치 권한 오류: {locationError}
      </p>
    );
  }

  /** 서버에서 내려온 멤버들 */
  const members: ApiMember[] = Array.isArray(data?.data?.coordinates)
    ? data!.data!.coordinates
    : [];

  /** 출발지 키 */
  const d = data?.data?.departure;
  const departureKey: DepartureKey | null =
    typeof d === "string" && d in locationCoordinatesMap ? (d as DepartureKey) : null;

  /** 출발지 좌표 */
  const departureCoords = departureKey ? locationCoordinatesMap[departureKey] : null;

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setHidden(true);
    return () => {
      setHidden(false);
    };
  }, [setHidden]);

  useEffect(() => {
    if (selectedId !== null && !members.some((m) => makeStableId(m) === selectedId)) {
      setSelectedId(null);
    }
  }, [members, selectedId]);

  const handleSelect = (id: string | null) => setSelectedId(id);

  /** 좌표 publish (내 위치 바뀔 때마다) */
  useEffect(() => {
    if (status !== "connected" || !location) return;

    const me = members.find((m) => m.email === myEmail);
    sendCoordinate({
      roomId,
      email: myEmail,
      name: me?.name ?? "",
      nickname: me?.nickname ?? "",
      latitude: location.latitude,
      longitude: location.longitude,
    });

    console.log("좌표 전송됨:", location.latitude, location.longitude);
  }, [status, location, roomId, myEmail, members, sendCoordinate]);

  return (
    <div className="absolute inset-0">
      {/* 지도 */}
      <div className="absolute inset-0 z-0">
        <Map initialCenter={departureCoords} level={3} />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* 상단 헤더 */}
        <div
          aria-label="헤더"
          className="absolute top-5 left-0 right-0 flex justify-between items-center px-[1.5rem] z-30 "
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            닫기
          </button>
          <DepartureMarker departureKey={departureKey} />
        </div>

        {/* 멤버 마커 */}
        <LocationLayer
          members={members}
          selectedId={selectedId}
          onSelect={handleSelect}
          myEmail={myEmail}
          className="absolute inset-0 pointer-events-auto z-20"
        />

        {/* 하단 멤버 카드 */}
        <div className="absolute bottom-5 left-0 right-0 px-4 pointer-events-auto">
          <MemberCard members={members} selectedId={selectedId} onSelect={handleSelect} />
        </div>
      </div>
    </div>
  );
};

export default MapView;
