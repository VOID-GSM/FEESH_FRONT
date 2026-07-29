import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청마다 토큰 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

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

// 인증 실패 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    console.log("API ERROR:", status);

    if (status === 401 || status === 403) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("email");
      localStorage.removeItem("nickname");
      localStorage.removeItem("likedPosts");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
