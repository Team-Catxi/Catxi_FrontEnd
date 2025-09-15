import axiosInstance from "./axios";

type CheckNNResponse = {
    success: boolean;
    code: string;
    message: string;
    data: boolean;
};

export const getNickNameCheck = async (nickname: string): Promise<boolean> => {
  const { data } = await axiosInstance.get<CheckNNResponse>(
    `/api/auth/signUp/catxi/checkNN?nickname=${nickname}`
  );
  return data.data;
};
