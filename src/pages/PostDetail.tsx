import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import profileImage from "../assets/profile.png";

import { deletePost, getPost, likePost, unlikePost } from "../api/post";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  authorId: number;
  authorNickname: string;
  likeCount: number;
  viewCount: number;
  createdAt: string;
  liked?: boolean;
}

// JWT에서 로그인한 사용자 ID 가져오기
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return Number(payload.sub);
  } catch (error) {
    console.error("토큰 해석 실패", error);

    return null;
  }
};

function PostDetail() {
  const navigate = useNavigate();

  const { id } = useParams();

  const userId = getUserIdFromToken();

  const [post, setPost] = useState<Post | null>(null);

  const [liked, setLiked] = useState(false);

  const [likeCount, setLikeCount] = useState(0);

  const [showComments, setShowComments] = useState(false);

  // 게시글 상세 조회
  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await getPost(Number(id));

        console.log("게시글 상세:", response.data);
        console.log("현재 사용자 ID:", userId);

        setPost(response.data);

        setLiked(response.data.liked ?? false);

        setLikeCount(Math.max(response.data.likeCount ?? 0, 0));
      } catch (error) {
        console.error("게시글 조회 실패", error);
      }
    };

    fetchPost();
  }, [id]);

  // 좋아요
  const handleLike = async () => {
    if (!post) return;

    try {
      if (liked) {
        await unlikePost(post.id);

        setLiked(false);

        setLikeCount((prev) => Math.max(prev - 1, 0));
      } else {
        await likePost(post.id);

        setLiked(true);

        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("좋아요 처리 실패", error);
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!post) return;

    const confirmDelete = window.confirm("게시글을 삭제하시겠습니까?");

    if (!confirmDelete) return;

    try {
      await deletePost(post.id);

      alert("게시글이 삭제되었습니다.");

      navigate("/home");
    } catch (error) {
      console.error("삭제 실패", error);

      alert("삭제에 실패했습니다.");
    }
  };

  if (!post) {
    return (
      <main className="p-10 text-center">존재하지 않는 게시글입니다.</main>
    );
  }

  return (
    <main
      className="
      max-w-4xl
      mx-auto
      px-6
      py-10
      "
    >
      <button
        onClick={() => navigate("/home")}
        className="
        flex
        items-center
        gap-2
        text-gray-600
        mb-8
        "
      >
        <span className="material-symbols-outlined">arrow_back</span>
        뒤로가기
      </button>

      <article
        className="
        bg-white
        rounded-2xl
        shadow-sm
        border
        p-8
        "
      >
        <div
          className="
          flex
          justify-between
          items-center
          mb-6
          "
        >
          <div
            className="
            flex
            items-center
            gap-3
            "
          >
            <img
              src={profileImage}
              alt="프로필"
              className="
              w-12
              h-12
              rounded-full
              "
            />

            <div>
              <p className="font-semibold">{post.authorNickname}</p>

              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* 내 게시글만 삭제 버튼 표시 */}
          {post.authorId === userId && (
            <button
              onClick={handleDelete}
              className="
              text-red-500
              font-semibold
              "
            >
              삭제
            </button>
          )}
        </div>

        <h1
          className="
          text-3xl
          font-bold
          mb-6
          "
        >
          {post.title}
        </h1>

        <span
          className="
          inline-block
          bg-primary
          text-white
          px-3
          py-1
          rounded-full
          text-sm
          mb-6
          "
        >
          {post.category}
        </span>

        <div
          className="
          w-full
          h-[360px]
          rounded-xl
          bg-gray-100
          flex
          items-center
          justify-center
          mb-8
          "
        >
          <span
            className="
            material-symbols-outlined
            text-7xl
            text-gray-400
            "
          >
            image
          </span>
        </div>

        <div
          className="
          text-gray-700
          leading-8
          "
        >
          {post.content}
        </div>

        <div
          className="
          flex
          items-center
          gap-8
          mt-8
          pt-6
          border-t
          "
        >
          <button
            onClick={handleLike}
            className="
            flex
            items-center
            gap-2
            "
          >
            좋아요 {Math.max(likeCount, 0)}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="
            flex
            items-center
            gap-2
            "
          >
            댓글
          </button>
        </div>
      </article>

      {showComments && (
        <section className="mt-10">
          <h2
            className="
            text-2xl
            font-bold
            mb-5
            "
          >
            댓글
          </h2>

          <div
            className="
            bg-white
            rounded-xl
            border
            p-5
            "
          >
            <textarea
              placeholder="댓글을 입력하세요."
              className="
              w-full
              h-28
              border
              rounded-lg
              p-4
              resize-none
              "
            />

            <button
              className="
              mt-4
              bg-primary
              text-white
              px-6
              py-2
              rounded-lg
              "
            >
              등록
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default PostDetail;
