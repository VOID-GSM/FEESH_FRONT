import axios from "./axios";

// 댓글 요청 타입
export interface CommentRequest {
  content: string;
}

// 댓글 응답 타입
export interface CommentResponse {
  commentId: number;
  content: string;
  authorId: number;
  authorNickname: string;
  createdAt: string;
}

// 댓글 목록 조회
export const getComments = (postId: number) => {
  return axios.get<CommentResponse[]>(`/view/${postId}/comments`);
};

// 댓글 작성
export const createComment = (postId: number, data: CommentRequest) => {
  return axios.post<CommentResponse>(`/view/${postId}/comments`, data);
};

// 댓글 삭제
export const deleteComment = (commentId: number) => {
  return axios.delete(`/view/comments/${commentId}`);
};

// 대댓글 목록 조회
export const getReplies = (commentId: number) => {
  return axios.get<CommentResponse[]>(`/view/comments/${commentId}/replies`);
};

// 대댓글 작성
export const createReply = (commentId: number, data: CommentRequest) => {
  return axios.post<CommentResponse>(
    `/view/comments/${commentId}/replies`,
    data,
  );
};

// 대댓글 삭제
export const deleteReply = (replyId: number) => {
  return axios.delete(`/view/replies/${replyId}`);
};
