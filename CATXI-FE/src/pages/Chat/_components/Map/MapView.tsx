import { useEffect, useMemo, useState } from "react";
import { Map } from "./_components/Map";
import MemberCard from "./_components/MemberCard";
import LocationLayer from "./_components/LocationLayer";
import { useMapGet } from "../../../../hooks/query/useMapGet";
import type { ApiMember } from "../../../../types/chat/members";
import { useTabBar } from "../../../../contexts/TabBarContext";

// ✅ 추가
import { useChatSocket } from "../../../../hooks/socket/useChatSocket"; // 경로 맞춰주세요

interface MapViewProps {
  onClose: () => void;
  roomId: number;
  myEmail: string;
}

const makeStableId = (m: ApiMember) => `${m.roomId}:${m.email}`;

const MapView = ({ onClose, roomId, myEmail }: MapViewProps) => {
  // 1) 초기 좌표 조회 (GET /coordinates)
  const { data, isLoading, isError, error, refetch } = useMapGet(roomId);

  const { setHidden } = useTabBar();

  // 2) 실시간 수신 좌표를 저장할 로컬 스토어
  const [liveMap, setLiveMap] = useState<Record<string, ApiMember>>({});

  // 3) JWT 토큰 확보 (프로젝트 방식에 맞춰 교체)
  const jwtToken =
    localStorage.getItem("jwt") || sessionStorage.getItem("jwt") || "";

  // 4) 웹소켓 연결 (useChatSocket 활용)
  const { connect, disconnect, sendCoordinate, status } = useChatSocket(
    roomId,
    jwtToken,
    () => {}, // onChatMessage (미사용)
    undefined, // onReadyMessage
    undefined, // onSystemMessage
    undefined, // onParticipantsMessage
    // onMapMessage: 서버 브로드캐스트 수신 시 호출
    (raw) => {
      const payload: ApiMember =
        typeof raw === "string" ? JSON.parse(raw) : raw;
      setLiveMap((prev) => ({ ...prev, [makeStableId(payload)]: payload }));
    }
  );

  // 탭바 숨김 유지
  useEffect(() => {
    setHidden(true);
    return () => setHidden(false);
  }, [setHidden]);

  // 마운트 시: 웹소켓 연결 + 초기 좌표 조회
  useEffect(() => {
    connect();
    refetch(); // 최초 1회 조회
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // 5) 주기적으로 내 좌표 발행 (3~5초 권장 → 4초)
  useEffect(() => {
    if (status !== "connected") return;

    const push = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          sendCoordinate({
            roomId,
            email: myEmail,
            name: "me", // TODO: 실제 사용자 이름
            nickname: "me", // TODO: 실제 닉네임
            latitude: +pos.coords.latitude.toFixed(6),
            longitude: +pos.coords.longitude.toFixed(6),
          });
        },
        (e) => console.warn("geolocation error:", e),
        { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
      );
    };

    push(); // 즉시 1회
    const t = setInterval(push, 4000);
    return () => clearInterval(t);
  }, [status, roomId, myEmail, sendCoordinate]);

  // 6) API 결과 + 실시간 업데이트 병합
  const apiMembers = useMemo<ApiMember[]>(
    () => data?.data?.coordinates ?? [],
    [data]
  );

  const members = useMemo<ApiMember[]>(() => {
    // API 리스트를 바탕으로 live 값 덮어쓰기
    const merged = apiMembers.map((m) => liveMap[makeStableId(m)] ?? m);
    // live에만 있고 API에 없는 멤버 추가
    Object.values(liveMap).forEach((m) => {
      if (!merged.some((x) => makeStableId(x) === makeStableId(m))) {
        merged.push(m);
      }
    });
    return merged;
  }, [apiMembers, liveMap]);

  // 선택 상태 유지
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    if (
      selectedId !== null &&
      !members.some((m) => makeStableId(m) === selectedId)
    ) {
      setSelectedId(null);
    }
  }, [members, selectedId]);

  const handleSelect = (id: string | null) => setSelectedId(id);

  return (
    <div className="absolute inset-0">
      {/* 지도는 풀스크린 배경 */}
      <div className="absolute inset-0 z-0">
        <Map />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* 상단 UI */}
        <div className="flex flex-col items-center gap-4 p-4 pointer-events-auto">
          <p className="text-gray-700 text-lg font-medium">
            현재 Room ID: {roomId}
          </p>

          <div className="text-xs text-gray-500">
            WS: {status === "connected" ? "연결됨" : status}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            임시 닫기
          </button>

          {isLoading && (
            <div className="text-sm text-gray-500">지도 멤버 로딩 중…</div>
          )}
          {isError && (
            <div className="text-sm text-red-600">
              로드 실패: {String(error?.message ?? "네트워크 오류")}
            </div>
          )}
        </div>

        {/* 지도 위 마커: 서버 좌표 기반 + 실시간 반영 */}
        <LocationLayer
          members={members}
          selectedId={selectedId}
          onSelect={handleSelect}
          myEmail={myEmail}
          className="absolute inset-0 pointer-events-auto"
        />

        {/* 하단 고정 MemberCard */}
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
