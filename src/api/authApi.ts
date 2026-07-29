import axios from "./axios";

// =====================
// 로그인
// =====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  nickname: string;
}

export const login = (data: LoginRequest) => {
  return axios.post<LoginResponse>("/auth/login", data);
};

// =====================
// 회원가입
// =====================

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  nickname: string;
}

export const signup = (data: SignupRequest) => {
  return axios.post<SignupResponse>("/auth/signup", data);
};

// =====================
// 이메일 인증
// =====================

export interface CheckEmailRequest {
  email: string;
}

export interface SendEmailCodeRequest {
  email: string;
}

export interface VerifyEmailCodeRequest {
  email: string;
  code: string;
}

// 이메일 중복 확인
export const checkEmail = (data: CheckEmailRequest) => {
  return axios.post("/auth/check-email", data);
};

// 인증번호 전송
export const sendEmailCode = (data: SendEmailCodeRequest) => {
  return axios.post("/auth/send-email-code", data);
};

// 인증번호 확인
export const verifyEmailCode = (data: VerifyEmailCodeRequest) => {
  return axios.post("/auth/verify-email-code", data);
};
