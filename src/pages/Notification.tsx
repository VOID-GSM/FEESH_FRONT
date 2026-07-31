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

function Notification() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const loadNotifications = async () => {
    try {
      const [likeResponse, commentResponse] = await Promise.all([
        getLikeNotifications(),
        getCommentNotifications(),
      ]);

      const likes: NotificationItem[] = likeResponse.data.map((item) => ({
        type: "like",
        data: item,
      }));

      const comments: NotificationItem[] = commentResponse.data.map((item) => ({
        type: "comment",
        data: item,
      }));

      setNotifications([...likes, ...comments]);
    } catch (error) {
      console.error("알림 조회 실패", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <section className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-blue-700">알림</h1>

          {notifications.length === 0 ? (
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
                  "
                >
                  <p className="font-medium">
                    {notification.data.senderNickname}님이{" "}
                    {notification.type === "like"
                      ? "좋아요를 눌렀습니다."
                      : "댓글을 작성했습니다."}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    게시글 번호 : {notification.data.postId}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(notification.data.createdAt).toLocaleString()}
                  </p>
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
