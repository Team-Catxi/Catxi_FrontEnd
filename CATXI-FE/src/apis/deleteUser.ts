import type { ApiResponse } from "../types/apiResponse";
import axiosInstance from "./axios";

export const DeleteUser = async (): Promise<ApiResponse<void>> => {
  const { data } = await axiosInstance.patch("/api/members/delete");
  return data;
};
