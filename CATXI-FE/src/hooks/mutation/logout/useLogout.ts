import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../../../apis/logout/api";
import Storage from "../../../utils/storage";

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      Storage.clearStorage(); 
      window.location.href = "/"; 
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
    },
  });
};
