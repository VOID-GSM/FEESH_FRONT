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

// TODO: 백엔드 createPost가 @RequestBody(JSON)만 받고 사진 파라미터가 없어서
// 지금 FormData(사진 포함)로 보내면 바인딩이 안 될 수 있음. 사진 업로드 방식
// (presigned URL / multipart 전환 / 우선 텍스트만) 정해지면 아래 다시 수정 필요.
export const createPost = (payload: FormData) =>
  api.post("/posts/post", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export interface PostRequest {
  title: string;
  content: string;
  category: string;
  price: number;
}

export const updatePost = (postId: number, data: PostRequest) =>
  api.patch(`/posts/${postId}`, data);

export interface PostDetailResponse {
  id: number;
  title: string;
  content: string;
  category: string;
  authorNickname: string;
  likeCount: number;
  viewCount: number;
  createdAt: string;
}

export const getPost = (postId: number) =>
  api.get<PostDetailResponse>(`/posts/${postId}`);

export const deletePost = (postId: number) => api.delete(`/posts/${postId}`);