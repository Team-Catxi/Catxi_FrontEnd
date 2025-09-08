export function sendBeaconOnUnload(roomId: number) {
  try {
    const data = JSON.stringify({ roomId, isActive: false });
    const blob = new Blob([data], { type: "application/json" });
    navigator.sendBeacon("/api/fcm/active-status", blob);
  } catch (err) {
    console.error("❌ Beacon 전송 실패:", err);
  }
}
