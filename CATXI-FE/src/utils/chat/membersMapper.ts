import type { ApiMember, MemberLite } from "../../types/chat/members";

type MapOpts = {
  idStrategy?: "roomEmail" | "email";
};

export function toMemberLite(
  m: ApiMember,
  opts: MapOpts = { idStrategy: "roomEmail" }
): MemberLite {
  const id =
    (opts.idStrategy ?? "roomEmail") === "email"
      ? m.email
      : `${m.roomId}:${m.email}`;

  const displayName =
    m.name?.trim() || m.nickname?.trim() || m.email.split("@")[0];

  return {
    id,
    name: displayName,
    email: m.email,
    nickname: m.nickname || undefined,
    lat: m.latitude,
    lng: m.longitude,
    distanceKm: m.distance, // ✅ 서버가 주는 km 그대로
  };
}

export const toMemberLiteList = (arr: ApiMember[], opts?: MapOpts) =>
  arr.map((m) => toMemberLite(m, opts));
