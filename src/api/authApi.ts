import api from "./axios";

/**
 * 이메일 중복 확인
 */

export interface CheckEmailRequest {
  email: string;
}

export interface CheckEmailResponse {
  duplicated: boolean;
  message: string;
}

export const checkEmail = async (
  data: CheckEmailRequest,
): Promise<CheckEmailResponse> => {
  const response = await api.post("/auth/check-email", data);

  return response.data;
};

/**
 * 로그인
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;

  accessToken: string;

  email: string;

  nickname: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

/**
 * 회원가입
 */

export interface SignupRequest {
  email: string;

  password: string;

  nickname: string;
}

export interface SignupResponse {
  message: string;

  email: string;

  nickname: string;
}

export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await api.post("/auth/signup", data);

  return response.data;
};

/**
 * 인증번호 발송
 */

export interface SendEmailCodeRequest {
  email: string;
}

export interface SendEmailCodeResponse {
  message: string;
}

export const sendEmailCode = async (
  data: SendEmailCodeRequest,
): Promise<SendEmailCodeResponse> => {
  const response = await api.post("/auth/send-email-code", data);

  return response.data;
};

/**
 * 인증번호 확인
 */

export interface VerifyEmailCodeRequest {
  email: string;

  code: string;
}

export interface VerifyEmailCodeResponse {
  verified: boolean;

  message: string;
}

export const verifyEmailCode = async (
  data: VerifyEmailCodeRequest,
): Promise<VerifyEmailCodeResponse> => {
  const response = await api.post("/auth/verify-email-code", data);

  return response.data;
};
