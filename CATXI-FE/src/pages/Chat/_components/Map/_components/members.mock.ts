// mock/members.mock.ts
import type { ApiMember } from "../../../../../types/chat/members"; // 경로 맞게 수정

export const mockApiMembers: ApiMember[] = [
  {
    roomId: 101,
    email: "yeyeon.kim@example.com",
    name: "김예연",
    nickname: "예연",
    latitude: 37.5665,
    longitude: 126.978,
    distance: 0.4, // km
  },
  {
    roomId: 101,
    email: "gildong.hong@example.com",
    name: "홍길동",
    nickname: "길동",
    latitude: 37.5655,
    longitude: 126.977,
    distance: 1.2,
  },
  {
    roomId: 101,
    email: "ganada@example.com",
    name: "가나다라마바",
    nickname: "",
    latitude: 37.564,
    longitude: 126.979,
    distance: 3.7,
  },
  //   {
  //     roomId: 101,
  //     email: "yeyeon2@example.com",
  //     name: "김예연",
  //     nickname: "예예",
  //     latitude: 37.563,
  //     longitude: 126.98,
  //     distance: 12,
  //   },
];
