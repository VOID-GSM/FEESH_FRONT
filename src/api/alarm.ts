import api from "./axios";

// 읽지 않은 알림 개수 조회
export const getUnreadAlarmCount = async (): Promise<number> => {
  const response = await api.get("/alarm/unread-count");

  console.log("알림 API 응답:", response.data);

  return response.data.unreadCount;
};
