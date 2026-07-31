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

  // 게시글 이미지
  imageUrls?: string[];

  // 현재 로그인 사용자의 좋아요 여부
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

// 좋아요 추가

export const likePost = (postId: number) =>
  api.post<LikeResponse>(`/posts/${postId}/like`);

// 좋아요 취소

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

  images?: File[];
}

export const createPost = (data: PostRequest) => {
  const formData = new FormData();

  formData.append("title", data.title);

  formData.append("content", data.content);

  formData.append("category", data.category);

  formData.append("price", String(data.price));

  if (data.images) {
    data.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return api.post("/posts/post", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

  // 좋아요 여부
  liked: boolean;

  // 이미지 목록
  imageUrls: string[];
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
