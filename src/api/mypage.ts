import axios from "./axios";

export const getMyFeed = () => {
  return axios.get("/mypage/feed");
};

export const getMyComments = () => {
  return axios.get("/mypage/comments");
};

export const logout = () => {
  return axios.post("/mypage/logout");
};

export const withdraw = () => {
  return axios.delete("/auth/withdraw");
};
