import axiosInstance from "../axios";
import type { GetMembersResponse } from "../../types/chat/members";

export const GetMembers = async (
  roomId: number
): Promise<GetMembersResponse> => {
  const { data } = await axiosInstance.get<GetMembersResponse>(
    `api/map/${roomId}/coordinates`
  );
  return data;
};
