import axios from "axios";

const api = axios.create({
  baseURL: "http://ssh.gsmsv.site:25126",
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================
// 요청 인터셉터
// JWT 자동 첨부
// ======================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    console.log("요청 URL:", config.url);
    console.log("JWT 토큰:", token);

    // 로그인 / 회원가입 요청에는 토큰 제외
    const isAuthRequest =
      config.url === "/auth/login" || config.url === "/auth/signup";

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// ======================
// 응답 인터셉터
// 인증 실패 처리
// ======================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status = error.response?.status;

    console.log("API ERROR:", status, error.response?.data);

    // 인증 만료 또는 인증 실패
    if (status === 401 || status === 403) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("email");
      localStorage.removeItem("nickname");
      localStorage.removeItem("likedPosts");

      alert("로그인이 만료되었습니다. 다시 로그인해주세요.");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
