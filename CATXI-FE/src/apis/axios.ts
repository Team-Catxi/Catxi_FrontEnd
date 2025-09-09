import axios from "axios";
import Storage from "../utils/storage";

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
  (response) => {
    const refreshed = response.headers["x-access-token-refreshed"];
    const newToken = response.headers["authorization"]; 

    if (refreshed === "true" && newToken) {
      const tokenValue = newToken.replace(/Bearer\s+/i, "");
      Storage.setAccessToken(tokenValue);
    }

    return response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
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