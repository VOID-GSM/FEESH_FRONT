import axios from "axios";

const api = axios.create({
  baseURL: "http://ssh.gsmsv.site:25126",
});

// 자동 로그아웃 타이머
let logoutTimer: ReturnType<typeof setTimeout> | null = null;

// JWT 만료 시간 확인
const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (!payload.exp) {
      return null;
    }

    // JWT exp는 초 단위이므로 밀리초로 변환
    return payload.exp * 1000;
  } catch (error) {
    console.error("JWT 해석 실패:", error);

    return null;
  }
};

// JWT 만료 시 자동 로그아웃
export const setTokenExpirationTimer = (token: string) => {
  // 기존 타이머 제거
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }

  const expirationTime = getTokenExpirationTime(token);

  if (!expirationTime) {
    console.error("JWT 만료 시간을 확인할 수 없습니다.");
    return;
  }

  const remainingTime = expirationTime - Date.now();

  // 이미 만료된 토큰
  if (remainingTime <= 0) {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("nickname");

    window.location.href = "/login";

    return;
  }

  console.log(
    "JWT 만료까지 남은 시간:",
    Math.floor(remainingTime / 1000 / 60),
    "분",
  );

  logoutTimer = setTimeout(() => {
    console.log("JWT가 만료되어 자동 로그아웃됩니다.");

    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("nickname");

    alert("로그인이 만료되었습니다. 다시 로그인해주세요.");

    window.location.href = "/login";
  }, remainingTime);
};

// 페이지 새로고침 후에도 JWT 만료 시간 확인
const savedToken = localStorage.getItem("token");

if (savedToken) {
  setTokenExpirationTimer(savedToken);
}

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("요청 URL:", config.url);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData 요청인 경우
    // Content-Type을 직접 지정하지 않고 Axios가 자동으로 설정하도록 함
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      // JSON 요청
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      console.log("로그인이 만료되었거나 인증이 필요합니다.");

      // 로그인 정보 삭제
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("nickname");

      // 자동 로그아웃 타이머 제거
      if (logoutTimer) {
        clearTimeout(logoutTimer);
        logoutTimer = null;
      }

      // 로그인 페이지로 이동
      if (window.location.pathname !== "/login") {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
