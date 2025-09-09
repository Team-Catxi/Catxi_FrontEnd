import { queryClient } from "../../../App";

export function useResultHandler(roomId: number, handleMessage: any) {
  return (raw: any) => {
    const { type, message } = raw;

    queryClient.setQueryData(['chatRoomDetail', roomId], (prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        data: {
          ...prev.data,
          roomStatus: type === "MATCHED" ? "MATCHED" : "WAITING",
        },
      };
    });

    handleMessage({
      message,
      email: "system",
      senderName: "시스템",
      roomId,
      sentAt: new Date().toISOString(),
      systemType: type,
    });
  };
}
