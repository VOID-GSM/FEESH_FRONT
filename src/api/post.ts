import api from "./axios";

// ======================
// 게시글 목록 타입
// ======================

export interface PostSummary {
  id: number;
  title: string;
  content: string | null;
  category: string | null;
  price: number | null;
  authorNickname: string | null;
  profileImageUrl?: string | null;
  likeCount: number | null;
  viewCount: number | null;
  commentCount?: number | null;
  createdAt: string | null;
  liked: boolean;
}

export interface PostListResponse {
  posts: PostSummary[];
  totalPages: number;
  totalElements: number;
}

// ======================
// 게시글 목록 조회
// ======================

export const getPosts = (
  sort: "latest" | "popular" = "latest",
  page = 0,
  size = 10,
) => {
  const url = sort === "popular" ? "/main/posts/popular" : "/main/posts/latest";

  return api.get<PostListResponse>(url, {
    params: {
      page,
      size,
    },
  });
};

// ======================
// 좋아요
// ======================

export interface LikeResponse {
  likeCount: number;
  liked: boolean;
}

export const likePost = (postId: number) =>
  api.post<LikeResponse>(`/posts/${postId}/like`);

export const unlikePost = (postId: number) =>
  api.delete<LikeResponse>(`/posts/${postId}/like`);

// ======================
// 게시글 작성
// ======================

export interface PostRequest {
  title: string;
  content: string;
  category: string;
  price: number;
}

export const createPost = (data: PostRequest) => {
  return api.post("/posts/post", data);
};

// ======================
// 게시글 상세 조회
// ======================

export interface PostDetailResponse {
  id: number;
  title: string;
  content: string;
  category: string | null;
  price: number | null;
  authorNickname: string | null;
  likeCount: number;
  viewCount: number;
  createdAt: string | null;
  liked: boolean;
}

export const getPost = (postId: number) =>
  api.get<PostDetailResponse>(`/posts/${postId}`);

// ======================
// 게시글 수정
// ======================

export const updatePost = (postId: number, data: PostRequest) =>
  api.patch(`/posts/${postId}`, data);

// ======================
// 게시글 삭제
// ======================

export const deletePost = (postId: number) => api.delete(`/posts/${postId}`);
