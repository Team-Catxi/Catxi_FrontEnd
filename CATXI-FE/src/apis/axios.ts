import axios from "axios";
import Storage from "../utils/storage";
import { reissueToken } from "../apis/reissue/api"; // 방금 만든 API

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Storage.getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401 || data?.code === "ACCESS401") {
      originalRequest._retry = true; 

      try {
        const { data } = await reissueToken();
        Storage.setAccessToken(data.accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        Storage.clearStorage();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    if (status === 403) {
      console.error("403 Forbidden:", error.response?.data);
      Storage.clearStorage();
      window.location.href = "/";
    }

    if (status === 500) {
      alert("서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
      Storage.clearStorage();
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
