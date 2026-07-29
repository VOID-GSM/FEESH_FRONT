import api from "./axios";

/**
 * 이메일 중복 확인
 */
interface CheckEmailRequest {
  email: string;
}

interface CheckEmailResponse {
  duplicated: boolean;
  message: string;
}

export const checkEmail = async (
  data: CheckEmailRequest
): Promise<CheckEmailResponse> => {
  const response = await api.post("/auth/check-email", data);

  return response.data;
};


/**
 * 로그인
 */
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  accessToken: string;
  email: string;
  nickname: string;
}

export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);

  return response.data;
};


/**
 * 회원가입
 */
interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

interface SignupResponse {
  message: string;
  email: string;
  nickname: string;
}

export const signup = async (
  data: SignupRequest
): Promise<SignupResponse> => {
  const response = await api.post("/auth/signup", data);

  return response.data;
};

/**
 * 이메일 인증번호 발송
 */
interface SendEmailCodeRequest {
  email: string;
}

interface SendEmailCodeResponse {
  message: string;
}

export const sendEmailCode = async (
  data: SendEmailCodeRequest
): Promise<SendEmailCodeResponse> => {
  const response = await api.post("/auth/send-email-code", data);

  return response.data;
};


/**
 * 이메일 인증번호 확인
 */
interface VerifyEmailCodeRequest {
  email: string;
  code: string;
}

interface VerifyEmailCodeResponse {
  verified: boolean;
  message: string;
}

export const verifyEmailCode = async (
  data: VerifyEmailCodeRequest
): Promise<VerifyEmailCodeResponse> => {
  const response = await api.post("/auth/verify-email-code", data);

  return response.data;
};