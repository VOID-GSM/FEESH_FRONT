import api from "./axios";

export interface PostSummary {
  id: number;
  title: string;
  category: string;
  price: number;
  description: string;
  nickname: string;
  profileImageUrl: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface PostListResponse {
  posts: PostSummary[];
  totalPages: number;
  totalElements: number;
}

export interface Category {
  id: number;
  name: string;
}

export const getPosts = (sort: "latest" | "popular", page = 0, size = 10) => {
  const url = sort === "popular" ? "/main/posts/popular" : "/main/posts/latest";
  return api.get<PostListResponse>(url, { params: { page, size } });
};

export const getCategories = () => api.get<Category[]>("/main/categories");

export const likePost = (postId: number) => api.post(`/posts/${postId}/like`);

export const unlikePost = (postId: number) => api.delete(`/posts/${postId}/like`);

export const createPost = (payload: FormData) =>
  api.post("/posts", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  