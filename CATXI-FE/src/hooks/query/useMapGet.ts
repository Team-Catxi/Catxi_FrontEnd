import { useQuery } from "@tanstack/react-query";
import { GetMembers } from "../../apis/chat/mapView";

export const useMapGet = (roomId: number) => {
  return useQuery({
    queryKey: ["mapGet", roomId],
    queryFn: () => GetMembers(roomId),
    enabled: false,
  });
};
