import axiosInstance from "../axios";
import type { SaveDepartRequest, SaveDepartResponse } from "./type";

export const saveDepart = async (
  roomId: number,
  body: SaveDepartRequest
): Promise<SaveDepartResponse> => {
  const { data } = await axiosInstance.post<SaveDepartResponse>(
    `/api/map/${roomId}/save-depart`,
    body
  );
  return data;
};
