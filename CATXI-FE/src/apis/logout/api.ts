import axiosInstance from "../../apis/axios";
import type { LogoutResponse } from "./type";

export const logoutUser = async (): Promise<LogoutResponse> => {
  const { data } = await axiosInstance.post<LogoutResponse>(
    "/api/auth/logout",
    {},
    { withCredentials: true } 
  );
  return data;
};
