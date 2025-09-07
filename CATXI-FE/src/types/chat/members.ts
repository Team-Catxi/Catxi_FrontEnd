import type { ApiResponse } from "../apiResponse";

export interface ApiMembersPayload {
  departure: string;
  coordinates: ApiMember[];
}

export type ApiMember = {
  roomId: number;
  email: string;
  name: string;
  nickname: string;
  latitude: number;
  longitude: number;
  distance: number; // km
};

export type GetMembersResponse = ApiResponse<ApiMembersPayload>;

export type MemberLite = {
  id: string;
  name: string;
  email: string;
  nickname?: string;
  lat: number;
  lng: number;
  distanceKm: number;
};
