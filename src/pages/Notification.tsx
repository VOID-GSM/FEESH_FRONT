import { useEffect, useState } from "react";

import Header from "../components/Header";

import {
  getLikeNotifications,
  getCommentNotifications,
} from "../api/notification";

import type { NotificationResponse } from "../api/notification";

import feeshBackground from "../assets/feesh-background.png";

interface NotificationItem {
  type: "like" | "comment";
  data: NotificationResponse;
}

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
          new Date(b.data.createdAt).getTime() -
          new Date(a.data.createdAt).getTime(),
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
    loadNotifications();
  }, []);

  return (
    <div
      className="
        feesh-background
        min-h-screen
        bg-[#f8f9ff]
        bg-contain
        bg-center
        bg-no-repeat
      "
      style={{
        backgroundImage: `url(${feeshBackground})`,
      }}
    >
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
            <h1 className="text-2xl font-bold text-blue-700">알림</h1>
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
                    flex
                    justify-between
                    bg-white
                  "
                >
                  <div>
                    <p className="font-medium">
                      {notification.data.senderNickname || "알 수 없는 사용자"}
                      님이{" "}
                      {notification.type === "like"
                        ? "좋아요를 눌렀습니다."
                        : "댓글을 작성했습니다."}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      게시글 번호 : {notification.data.postId}
                    </p>

                    {notification.data.commentId && (
                      <p className="mt-1 text-sm text-gray-500">
                        댓글 번호 : {notification.data.commentId}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(notification.data.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`
                      text-xs
                      ${
                        notification.data.read
                          ? "text-gray-400"
                          : "text-blue-500"
                      }
                    `}
                  >
                    {notification.data.read ? "읽음" : "새 알림"}
                  </span>
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
