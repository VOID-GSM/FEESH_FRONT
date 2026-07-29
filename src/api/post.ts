import axios from "./axios";

// 게시글 목록 조회
export const getPosts = () => {
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

// 좋아요 추가
export const likePost = (postId: number) => {
  return axios.post(`/posts/${postId}/like`);
};

// 좋아요 취소
export const unlikePost = (postId: number) => {
  return axios.delete(`/posts/${postId}/like`);
};

// 게시글 작성
export const createPost = (data: {
  title: string;
  content: string;
  category?: string;
  photos?: File[];
}) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("content", data.content);

  if (data.category) {
    formData.append("category", data.category);
  }

  data.photos?.forEach((photo) => {
    formData.append("photos", photo);
  });

  return axios.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 게시글 상세 조회
export const getPost = (id: number) => {
  return axios.get(`/posts/${id}`);
};

// 게시글 삭제
export const deletePost = (id: number) => {
  return axios.delete(`/posts/${id}`);
};
