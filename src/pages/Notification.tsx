import { useEffect, useState } from "react";

import Header from "../components/Header";

import {
  getLikeNotifications,
  getCommentNotifications,
} from "../api/notification";

import type { NotificationResponse } from "../api/notification";

interface NotificationItem {
  type: "like" | "comment";
  data: NotificationResponse;
}

// 백엔드에서 받은 UTC 시간을 한국 시간으로 변환
const parseNotificationDate = (dateString: string) => {
  // 백엔드의 createdAt이
  // "2026-08-21T11:16:53.414979"
  // 형태이므로 UTC 시간으로 처리한다.
  const utcDateString = `${dateString}Z`;

  return new Date(utcDateString);
};

// 알림 날짜 표시
const formatNotificationDate = (dateString: string) => {
  const date = parseNotificationDate(dateString);

  if (Number.isNaN(date.getTime())) {
    return "날짜를 확인할 수 없습니다.";
  }

  return date.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Notification() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const [likeResponse, commentResponse] = await Promise.all([
        getLikeNotifications(),
        getCommentNotifications(),
      ]);

      console.log("좋아요 알림 응답:", likeResponse.data);
      console.log("댓글 알림 응답:", commentResponse.data);

      const likes: NotificationItem[] = (likeResponse.data ?? []).map(
        (item) => ({
          type: "like",
          data: item,
        }),
      );

      const comments: NotificationItem[] = (commentResponse.data ?? []).map(
        (item) => ({
          type: "comment",
          data: item,
        }),
      );

      const combined = [...likes, ...comments];

      // 중복 제거
      const uniqueNotifications = combined.filter(
        (item, index, array) =>
          index ===
          array.findIndex(
            (target) =>
              target.type === item.type && target.data.id === item.data.id,
          ),
      );

      // 최신 알림 순 정렬
      uniqueNotifications.sort(
        (a, b) =>
          parseNotificationDate(b.data.createdAt).getTime() -
          parseNotificationDate(a.data.createdAt).getTime(),
      );

      setNotifications(uniqueNotifications);
    } catch (error) {
      console.error("알림 조회 실패:", error);

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 알림 페이지를 확인한 시간 저장
    localStorage.setItem("notificationLastCheckedAt", new Date().toISOString());

    // Header의 알림 숫자 갱신
    window.dispatchEvent(new Event("notificationUpdated"));

    // 알림 데이터 조회
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
  }, []);

  return (
    <div>
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <section
          className="
            bg-white
            shadow-lg
            rounded-xl
            p-8
            w-full
          "
        >
          {/* 알림 제목 */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#243B64]">알림</h1>
          </div>

          {/* 로딩 */}
          {loading ? (
            <p className="mt-6 text-gray-500">알림을 불러오는 중입니다.</p>
          ) : notifications.length === 0 ? (
            <p className="mt-6 text-gray-500">아직 받은 알림이 없습니다.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {notifications.map((notification) => (
                <div
                  key={`${notification.type}-${notification.data.id}`}
                  className="
                    border
                    rounded-lg
                    p-4
                    bg-white
                  "
                >
                  <div>
                    {/* 알림 내용 */}
                    <p className="font-medium">
                      {notification.data.senderNickname || "알 수 없는 사용자"}
                      님이{" "}
                      {notification.type === "like"
                        ? "좋아요를 눌렀습니다."
                        : notification.data.parentCommentId
                          ? "답글을 작성했습니다."
                          : "댓글을 작성했습니다."}
                    </p>

                    {/* 게시글 번호 */}
                    <p className="mt-2 text-sm text-gray-500">
                      게시글 번호 : {notification.data.postId}
                    </p>

                    {/* 댓글 번호 */}
                    {notification.data.commentId && (
                      <p className="mt-1 text-sm text-gray-500">
                        댓글 번호 : {notification.data.commentId}
                      </p>
                    )}

                    {/* 답글인 경우 부모 댓글 번호 */}
                    {notification.data.parentCommentId && (
                      <p className="mt-1 text-sm text-gray-500">
                        부모 댓글 번호 : {notification.data.parentCommentId}
                      </p>
                    )}

                    {/* 날짜 */}
                    <p className="mt-2 text-xs text-gray-400">
                      {formatNotificationDate(notification.data.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Notification;
