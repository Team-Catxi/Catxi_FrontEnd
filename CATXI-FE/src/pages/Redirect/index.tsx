import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Storage from "../../utils/storage";
import axiosInstance from "../../apis/axios";
import type { LoginResponse } from "../../types/login";

const Redirection = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, headers } = await axiosInstance.get<LoginResponse>(
          `/api/auth/login/kakao?code=${code}`
        );
        const accessToken = headers["access"];
        const isNewUser =
          headers["isnewuser"] === true || headers["isnewuser"] === "true";

        if (data.success && accessToken) {
          Storage.setAccessToken(accessToken);

          if (isNewUser) {
            navigate("/signIn");
          } else {
            navigate("/home");
          }
        }
      } catch {
        window.alert("소셜 로그인에 실패하였습니다.");
        window.location.href = "/";
      }
    };

    if (code) {
      fetchData();
    }
  }, [code, navigate]);

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 border-4 border-[#8C46F6] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-600">로딩 중입니다...</p>
      </div>
    </div>
  );
};

export default Redirection;
