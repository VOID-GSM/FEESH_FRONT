import axios from "./axios";

export interface NotificationResponse {
  id: number;
  senderId: number;
  senderNickname: string;
  postId: number;
  commentId: number;
  createdAt: string;
  read: boolean;
}

export const getLikeNotifications = () => {
  return axios.get<NotificationResponse[]>("/alarm/like");
};

export const getCommentNotifications = () => {
  return axios.get<NotificationResponse[]>("/alarm/comment");
};
