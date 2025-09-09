import axiosInstance from "../axios";
import type { ReissueResponse } from "./type";

export const reissueToken = async (): Promise<ReissueResponse> => {
  const { data } = await axiosInstance.post<ReissueResponse>(
    "/api/auth/reissue",
    {},
    { withCredentials: true }
  );
  return data;
};
