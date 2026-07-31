import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

import { getMyFeed, getMyComments, logout, withdraw } from "../api/mypage";

interface MyPost {
  id?: number;
  title?: string;
  content?: string;
}

interface MyComment {
  id?: number;
  commentId?: number;
  content?: string;
  commentContent?: string;
  comment?: string;
  text?: string;
}

function Profile() {
  const navigate = useNavigate();

  const nickname = localStorage.getItem("nickname");
  const email = localStorage.getItem("email");

  const [posts, setPosts] = useState<MyPost[]>([]);
  const [comments, setComments] = useState<MyComment[]>([]);

  // 내 게시글 조회
  const loadMyPosts = async () => {
    try {
      const response = await getMyFeed();

      console.log(
        "내 게시글 전체 데이터:",
        JSON.stringify(response.data, null, 2),
      );

      const data = response.data;

      if (Array.isArray(data)) {
        setPosts(data);
      } else if (Array.isArray(data.content)) {
        setPosts(data.content);
      } else if (Array.isArray(data.posts)) {
        setPosts(data.posts);
      } else if (Array.isArray(data.data)) {
        setPosts(data.data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("내 게시글 조회 실패", error);
    }
  };

  // 내 댓글 조회
  const loadMyComments = async () => {
    try {
      const response = await getMyComments();

      console.log(
        "내 댓글 전체 데이터:",
        JSON.stringify(response.data, null, 2),
      );

      const data = response.data;

      if (Array.isArray(data)) {
        setComments(data);
      } else if (Array.isArray(data.content)) {
        setComments(data.content);
      } else if (Array.isArray(data.comments)) {
        setComments(data.comments);
      } else if (Array.isArray(data.data)) {
        setComments(data.data);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("내 댓글 조회 실패", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMyPosts();
    loadMyComments();
  }, []);

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 API 실패", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
    localStorage.removeItem("email");

    alert("로그아웃 되었습니다.");

    navigate("/login");
  };

  // 회원탈퇴
  const handleWithdraw = async () => {
    const confirmDelete = window.confirm("정말 회원탈퇴 하시겠습니까?");

    if (!confirmDelete) return;

    try {
      await withdraw();

      localStorage.clear();

      alert("회원탈퇴가 완료되었습니다.");

      navigate("/login");
    } catch (error) {
      console.error("회원탈퇴 실패", error);

      alert("회원탈퇴에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <section className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-blue-700 mb-8">내 정보</h1>

          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
              👤
            </div>

            <h2 className="text-xl font-bold">{nickname ?? "사용자"}</h2>

            <p className="text-gray-500">{email ?? "이메일 없음"}</p>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full bg-blue-700 text-white py-3 rounded-lg"
            >
              로그아웃
            </button>

            <button
              onClick={handleWithdraw}
              className="w-full border border-red-500 text-red-500 py-3 rounded-lg"
            >
              회원탈퇴
            </button>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-bold">내 게시글</h2>

          <div className="mt-5 space-y-3">
            {posts.length === 0 ? (
              <p className="text-gray-500">작성한 게시글이 없습니다.</p>
            ) : (
              posts.map((post, index) => (
                <div key={post.id ?? index} className="border rounded-lg p-4">
                  <p className="font-bold">{post.title ?? "제목 없음"}</p>

                  <p className="text-gray-500">{post.content ?? ""}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-bold">내 댓글</h2>

          <div className="mt-5 space-y-3">
            {comments.length === 0 ? (
              <p className="text-gray-500">작성한 댓글이 없습니다.</p>
            ) : (
              comments.map((comment, index) => (
                <div
                  key={comment.id ?? comment.commentId ?? index}
                  className="border rounded-lg p-4"
                >
                  <p>
                    {comment.content ??
                      comment.commentContent ??
                      comment.comment ??
                      comment.text ??
                      "내용 없음"}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
