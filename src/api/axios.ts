import axios from "axios";

const api = axios.create({
  baseURL: "http://ssh.gsmsv.site:25126",

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("요청 URL:", config.url);

    console.log("JWT 토큰:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      console.log("로그인 만료");

      // 토큰 삭제
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  },
);

export default api;
