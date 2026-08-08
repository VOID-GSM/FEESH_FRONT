import axios from "./axios";

export const getMyFeed = () => {
  return axios.get("/mypage/feed");
};

export const getMyComments = () => {
  return axios.get("/mypage/comments");
};

// 프로필 이미지 업로드
export const uploadProfileImage = (image: File) => {
  const formData = new FormData();

  formData.append("image", image);

  return axios.post("/mypage/image", formData);
};

export const logout = () => {
  return axios.post("/mypage/logout");
};

export const withdraw = () => {
  return axios.delete("/auth/withdraw");
};
