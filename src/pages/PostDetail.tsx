import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";

import { getPost, likePost, unlikePost } from "../api/post";
import { getComments, createComment } from "../api/comment";

interface Post {
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

interface Comment {
  commentId: number;
  content: string;
  authorNickname: string;
  createdAt: string;
}

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");

  // 게시글 조회
  const loadPost = useCallback(async () => {
    if (!id) return;

    try {
      const response = await getPost(Number(id));

      console.log("게시글:", response.data);

      setPost(response.data);
    } catch (error) {
      console.error("게시글 조회 실패", error);
    }
  }, [id]);

  // 댓글 조회
  const loadComments = useCallback(async () => {
    if (!id) return;

    try {
      const response = await getComments(Number(id));

      console.log("댓글:", response.data);

      setComments(response.data);
    } catch (error) {
      console.error("댓글 조회 실패", error);
    }
  }, [id]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPost();

    loadComments();
  }, [loadPost, loadComments]);
  // 좋아요
  const handleLike = async () => {
    if (!post) return;

    try {
      if (post.liked) {
        // 좋아요 취소
        await unlikePost(post.id);

        setPost((prev) =>
          prev
            ? {
                ...prev,
                liked: false,
                likeCount: Math.max(0, prev.likeCount - 1),
              }
            : prev,
        );
      } else {
        // 좋아요 추가
        await likePost(post.id);

        setPost((prev) =>
          prev
            ? {
                ...prev,
                liked: true,
                likeCount: prev.likeCount + 1,
              }
            : prev,
        );
      }
    } catch (error) {
      console.error("좋아요 실패", error);
    }
  };

  // 댓글 작성
  const handleComment = async () => {
    if (!id) return;

    if (!comment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    try {
      await createComment(Number(id), {
        content: comment,
      });

      setComment("");

      await loadComments();
    } catch (error) {
      console.error("댓글 작성 실패", error);
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8f9ff]">
        <Header />

        <div className="flex justify-center items-center h-[80vh] text-gray-500">
          게시글 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <button onClick={() => navigate(-1)} className="mb-6 text-blue-700">
          ← 뒤로가기
        </button>

        <section className="bg-white rounded-xl shadow-sm">
          <div className="p-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{post.title}</h1>

              <span className="text-blue-600">{post.category ?? "기타"}</span>
            </div>

            <p className="mt-5 text-2xl font-bold text-blue-700">
              {post.price ? `${post.price.toLocaleString()}원` : "가격 미정"}
            </p>

            <p className="mt-6 whitespace-pre-line text-gray-700">
              {post.content}
            </p>

            <div className="mt-8 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <p>작성자 : {post.authorNickname ?? "알 수 없음"}</p>

                <p>조회수 : {post.viewCount}</p>
              </div>

              <button onClick={handleLike} className="flex items-center gap-2">
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill={post.liked ? "#ef4444" : "none"}
                  stroke={post.liked ? "#ef4444" : "#9ca3af"}
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="
                    M21 8.25
                    c0-2.485-2.099-4.5-4.688-4.5
                    -1.935 0-3.597 1.126-4.312 2.733
                    C11.285 4.876 9.623 3.75 7.688 3.75
                    5.099 3.75 3 5.765 3 8.25
                    c0 7.22 9 11.25 9 11.25
                    s9-4.03 9-11.25
                    Z
                    "
                  />
                </svg>

                <span>{post.likeCount}</span>
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl p-8">
          <h2 className="text-xl font-bold mb-5">댓글 ({comments.length})</h2>

          <div className="flex gap-3">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요."
              className="
              flex-1
              h-14
              border
              rounded-lg
              px-4
              "
            />

            <button
              onClick={handleComment}
              className="
              h-14
              px-6
              rounded-lg
              bg-blue-700
              text-white
              "
            >
              작성
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {comments.map((item) => (
              <div key={item.commentId} className="border-b pb-4">
                <p>{item.content}</p>

                <span className="text-sm text-gray-400">
                  {item.authorNickname}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default PostDetail;
