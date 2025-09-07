// 서버 응답 DTO (distance = km 고정)
export type ApiMember = {
  roomId: number;
  email: string;
  name: string;
  nickname: string;
  latitude: number;
  longitude: number;
  distance: number; // km
};

// UI 공통 모델
export type MemberLite = {
  id: string; // `${roomId}:${email}` 등 안정 키
  name: string; // name || nickname || email id
  email: string;
  nickname?: string;
  lat: number;
  lng: number;
  distanceKm: number; // km 고정
};
