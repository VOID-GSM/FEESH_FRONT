import axios from "./axios";

// 게시글 목록 조회
export const getPosts = () => {
  return axios.get("/main/posts");
};

// 최신 게시글 조회
export const getLatestPosts = () => {
  return axios.get("/main/posts/latest");
};

// 인기 게시글 조회
export const getPopularPosts = () => {
  return axios.get("/main/posts/popular");
};

// 카테고리 조회
export const getCategories = () => {
  return axios.get("/main/categories");
};

// 게시글 작성
export const createPost = (data: {
  title: string;
  content: string;
  category: string;
  price: number;
}) => {
  return axios.post("/posts/post", data);
};

// 게시글 상세 조회
export const getPost = (postId: number) => {
  return axios.get(`/posts/${postId}`);
};

// 게시글 삭제
export const deletePost = (postId: number) => {
  return axios.delete(`/posts/${postId}`);
};

// 게시글 수정
export const updatePost = (
  postId: number,
  data: {
    title: string;
    content: string;
    category: string;
    price: number;
  },
) => {
  return axios.patch(`/posts/${postId}`, data);
};

// 좋아요 추가
export const likePost = (postId: number) => {
  return axios.post(`/posts/${postId}/like`);
};

// 좋아요 취소
export const unlikePost = (postId: number) => {
  return axios.delete(`/posts/${postId}/like`);
};
