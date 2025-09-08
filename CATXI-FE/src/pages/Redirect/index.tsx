import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Storage from "../../utils/storage";
import axiosInstance from "../../apis/axios";
import type { LoginResponse } from "../../types/login";
import { useFCM } from "../../hooks/fcm/useFCM";

const Redirection = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");
  const navigate = useNavigate();
  const { requestFCMToken, registerTokenToBackend } = useFCM();

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

          requestFCMToken()
            .then((token) => {
              if (token) registerTokenToBackend(token);
            })
            .catch((e) => console.warn("FCM token fetch failed:", e));
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

  return <></>;
};

export default Redirection;
