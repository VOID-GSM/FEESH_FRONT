import axios from "./axios";

/**
 * 알림 응답 타입
 */
export interface NotificationResponse {
  id: number;

  // 알림을 발생시킨 사용자
  senderId: number;
  senderNickname: string;

  // 관련 게시글
  postId: number;

  // 댓글 알림일 경우
  commentId?: number | null;

  // 답글일 경우 부모 댓글 ID
  parentCommentId?: number | null;

  // 알림 생성 시간
  createdAt: string;

  // 읽음 여부
  read: boolean;
}

/**
 * 좋아요 알림 조회
 *
 * GET /alarm/like
 */
export const getLikeNotifications = async () => {
  const response = await axios.get<NotificationResponse[]>("/alarm/like");

  return response;
};

/**
 * 댓글/답글 알림 조회
 *
 * GET /alarm/comment
 */
export const getCommentNotifications = async () => {
  const response = await axios.get<NotificationResponse[]>("/alarm/comment");

  return response;
};
