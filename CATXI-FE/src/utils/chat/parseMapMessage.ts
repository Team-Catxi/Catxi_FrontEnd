export function parseMapMessage(raw: any) {
  try {
    return {
      roomId: raw.roomId,
      email: raw.email,
      name: raw.name,
      nickname: raw.nickname,
      latitude: raw.latitude,
      longitude: raw.longitude,
      distance: raw.distance,
    };
  } catch (err) {
    console.error("❌ map message parse 실패:", raw, err);
    return null;
  }
}
