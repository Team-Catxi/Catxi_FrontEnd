import { useMutation } from "@tanstack/react-query";
import { saveDepart } from "../../../apis/coordinates/api";
import type { SaveDepartRequest, SaveDepartResponse } from "../../../apis/coordinates/type";

export const useSaveDepart = () => {
  return useMutation<
    SaveDepartResponse,
    Error,
    { roomId: number; body: SaveDepartRequest }
  >({
    mutationFn: ({ roomId, body }) => saveDepart(roomId, body),
  });
};
