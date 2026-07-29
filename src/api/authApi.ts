import axios from "./axios";

// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답
export interface LoginResponse {
  token: string;
  email: string;
  nickname: string;
}

// 회원가입 요청
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

// 회원가입 응답
export interface SignupResponse {
  id: number;
  email: string;
  nickname: string;
}

// 이메일 중복 확인 요청
export interface CheckEmailRequest {
  email: string;
}

// 이메일 인증번호 전송 요청
export interface SendEmailCodeRequest {
  email: string;
}

// 이메일 인증번호 확인 요청
export interface VerifyEmailCodeRequest {
  email: string;
  code: string;
}

// 이메일 중복 확인
export const checkEmail = (data: CheckEmailRequest) => {
  return axios.post("/auth/check-email", data);
};

// 이메일 인증번호 전송
export const sendEmailCode = (data: SendEmailCodeRequest) => {
  return axios.post("/auth/send-email-code", data);
};

// 이메일 인증번호 확인
export const verifyEmailCode = (data: VerifyEmailCodeRequest) => {
  return axios.post("/auth/verify-email-code", data);
};

// 회원가입
export const signup = (data: SignupRequest) => {
  return axios.post<SignupResponse>("/auth/signup", data);
};

// 로그인
export const login = (data: LoginRequest) => {
  return axios.post<LoginResponse>("/auth/login", data);
};
