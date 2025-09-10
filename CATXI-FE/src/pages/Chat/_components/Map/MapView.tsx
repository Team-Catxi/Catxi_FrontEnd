import { useEffect, useState, useCallback } from "react"; // [ADDED] useCallback 추가
import { useQueryClient } from "@tanstack/react-query";
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
import DepartureLayer from "./_components/DepartureLayer";

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
  const { data } = useMapGet(roomId);
  const queryClient = useQueryClient();
  const { setHidden } = useTabBar();
  const { location, error: _locationError } = useKakaoLocation();

  const members: ApiMember[] = Array.isArray(data?.data?.coordinates)
    ? data!.data!.coordinates
    : [];

  const d = data?.data?.departure;
  const departureKey: DepartureKey | null =
    typeof d === "string" && d in locationCoordinatesMap
      ? (d as DepartureKey)
      : null;

  const departureCoords = departureKey
    ? locationCoordinatesMap[departureKey]
    : null;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setHidden(true);
    return () => {
      setHidden(false);
    };
  }, [setHidden]);

  useEffect(() => {
    if (
      selectedId !== null &&
      !members.some((m) => makeStableId(m) === selectedId)
    ) {
      setSelectedId(null);
    }
  }, [members, selectedId]);

  const handleSelect = (
    id: string | null,
    pos?: { lat: number; lng: number }
  ) => {
    setSelectedId(id);

    if (id && pos && window.__kakao && window.__kakaoMap) {
      const kakao = window.__kakao;
      const map = window.__kakaoMap;
      const latlng = new kakao.maps.LatLng(pos.lat, pos.lng);
      map.panTo(latlng);
    }
  };

  const focusToCoords = useCallback(
    (c: { latitude: number; longitude: number }) => {
      const w = window;
      if (!w.__kakao || !w.__kakaoMap) return;
      const kakao = w.__kakao;
      const map = w.__kakaoMap;
      map.panTo(new kakao.maps.LatLng(c.latitude, c.longitude));
    },
    []
  );

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

    queryClient.setQueryData(["mapGet", roomId], (old: any) => {
      if (!old?.data) return old;
      const updatedCoords = old.data.coordinates.map((m: ApiMember) =>
        m.email === myEmail
          ? { ...m, latitude: location.latitude, longitude: location.longitude }
          : m
      );
      return {
        ...old,
        data: {
          ...old.data,
          coordinates: updatedCoords,
        },
      };
    });

    console.log(
      "좌표 전송 & 즉시 반영됨:",
      location.latitude,
      location.longitude
    );
  }, [status, location, roomId, myEmail, members, sendCoordinate, queryClient]);

  return (
    <div className="absolute inset-0">
      {/* 지도 */}
      <div className="absolute inset-0 z-0">
        <Map
          initialCenter={departureCoords}
          level={3}
          onMapReady={() => setMapReady(true)}
        />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* 상단 헤더 */}
        <div
          aria-label="헤더"
          className="absolute pointer-events-auto top-5 left-0 right-0 flex justify-between items-center px-[1.5rem] z-30 "
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            닫기
          </button>
          <DepartureMarker
            departureKey={departureKey}
            onFocus={focusToCoords}
          />
        </div>
        {/*마커 레이어*/}
        {mapReady && (
          <LocationLayer
            members={members}
            selectedId={selectedId}
            onSelect={handleSelect}
            myEmail={myEmail}
            className="absolute inset-0 pointer-events-auto z-20"
          />
        )}

        {mapReady && departureCoords && (
          <DepartureLayer departureKey={departureKey} onFocus={focusToCoords} />
        )}

        {/* 하단 멤버 카드 */}
        <div className="absolute bottom-5 left-0 right-0 px-4 pointer-events-auto">
          <MemberCard
            members={members}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default MapView;
