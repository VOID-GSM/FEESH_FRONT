import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import profileImage from "../assets/profile.png";

import { deletePost, getPost, likePost, unlikePost } from "../api/post";
import { createComment, getComments } from "../api/comment";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string | null;
  price: number;
  authorId: number;
  authorNickname: string | null;

  // 백엔드에서 작성자의 프로필 이미지 URL을 받음
  profileImageUrl: string | null;

  likeCount: number;
  viewCount: number;
  createdAt: string;
  liked?: boolean;
}

interface Comment {
  commentId: number;
  content: string;
  authorId: number;
  authorNickname: string;
}

// 백엔드 카테고리 → 화면 표시용 한국어
const categoryMap: Record<string, string> = {
  FOOD: "음식",
  FASHION_SHOPPING: "패션/쇼핑",
  DAILY_NECESSITY: "생활용품",
  CULTURE_LEISURE: "문화/여가",
  ETC: "기타",
};

// 카테고리 변환
const getCategoryLabel = (category: string | null): string => {
  if (!category) {
    return "";
  }

  return categoryMap[category] ?? category;
};

// 게시글 작성 날짜 표시
const formatDate = (date: string): string => {
  // 백엔드 createdAt이 UTC 기준인데 Z가 빠져서 오는 경우
  const createdDate = new Date(`${date}Z`);

  const now = new Date();

  const diffTime = now.getTime() - createdDate.getTime();

  // 미래 시간이면 방금 전
  if (diffTime <= 0) {
    return "방금 전";
  }

  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);

  // 1시간 미만
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  // 24시간 미만
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  // 날짜만 비교
  const createdDay = new Date(
    createdDate.getFullYear(),
    createdDate.getMonth(),
    createdDate.getDate(),
  );

  const todayDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffDays = Math.floor(
    (todayDay.getTime() - createdDay.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 1) {
    return "어제";
  }

  if (diffDays >= 2 && diffDays < 7) {
    return `${diffDays}일 전`;
  }

  return `${createdDate.getFullYear()}년 ${
    createdDate.getMonth() + 1
  }월 ${createdDate.getDate()}일`;
};

// JWT에서 로그인한 사용자 ID 가져오기
const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return Number(payload.sub);
  } catch (error) {
    console.error("토큰 해석 실패:", error);

    return null;
  }
};

function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const userId = getUserIdFromToken();

  // 게시글
  const [post, setPost] = useState<Post | null>(null);

  // 좋아요
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 댓글
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // 날짜 갱신용
  const [, setCurrentDate] = useState(new Date());

  // 게시글 상세 조회
  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchPost = async () => {
      try {
        const response = await getPost(Number(id));

        console.log("게시글 상세:", JSON.stringify(response.data, null, 2));

        console.log("백엔드 createdAt:", response.data.createdAt);

        console.log("프로필 이미지:", response.data.profileImageUrl);

        setPost(response.data);

        setLiked(response.data.liked ?? false);

        setLikeCount(Math.max(response.data.likeCount ?? 0, 0));
      } catch (error) {
        console.error("게시글 조회 실패:", error);
      }
    };

    fetchPost();
  }, [id]);

  // 날짜 표시를 주기적으로 갱신
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // 댓글 목록 조회
  const fetchComments = async () => {
    if (!id) {
      return;
    }

    try {
      const response = await getComments(Number(id));

      console.log("댓글 목록:", response.data);

      setComments(response.data);
    } catch (error) {
      console.error("댓글 조회 실패:", error);
    }
  };

  // 게시글을 열었을 때 댓글 개수도 미리 조회
  useEffect(() => {
    if (!id) {
      return;
    }

    fetchComments();
  }, [id]);

  // 댓글 열기 / 닫기
  const handleToggleComments = async () => {
    const nextShowComments = !showComments;

    setShowComments(nextShowComments);

    if (nextShowComments) {
      await fetchComments();
    }
  };

  // 댓글 등록
  const handleCreateComment = async () => {
    if (!id) {
      return;
    }

    const content = commentContent.trim();

    if (!content) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    if (commentLoading) {
      return;
    }

    try {
      setCommentLoading(true);

      await createComment(Number(id), {
        content,
      });

      setCommentContent("");

      await fetchComments();
    } catch (error) {
      console.error("댓글 등록 실패:", error);

      alert("댓글 등록에 실패했습니다.");
    } finally {
      setCommentLoading(false);
    }
  };

  // 좋아요
  const handleLike = async () => {
    if (!post) {
      return;
    }

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
      console.error("좋아요 처리 실패:", error);
    }
  };

  // 게시글 삭제
  const handleDelete = async () => {
    if (!post) {
      return;
    }

    const confirmDelete = window.confirm("게시글을 삭제하시겠습니까?");

    if (!confirmDelete) {
      return;
    }

    try {
      await deletePost(post.id);

      alert("게시글이 삭제되었습니다.");

      navigate("/home");
    } catch (error) {
      console.error("게시글 삭제 실패:", error);

      alert("삭제에 실패했습니다.");
    }
  };

  // 게시글 조회 전
  if (!post) {
    return (
      <main className="p-10 text-center">존재하지 않는 게시글입니다.</main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      {/* 뒤로가기 */}
      <button
        type="button"
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 text-gray-600 mb-8"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        뒤로가기
      </button>

      {/* 게시글 */}
      <article className="bg-white rounded-2xl shadow-sm border p-8">
        {/* 작성자 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {/* 작성자 프로필 이미지 */}
            <img
              src={post.profileImageUrl || profileImage}
              alt="프로필"
              className="w-12 h-12 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold">
                {post.authorNickname ?? "알 수 없는 사용자"}
              </p>

              <p className="text-sm text-gray-500">
                {post.createdAt ? formatDate(post.createdAt) : ""}
              </p>
            </div>
          </div>

          {/* 본인 게시글만 삭제 */}
          {post.authorId === userId && (
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-500 font-semibold"
            >
              삭제
            </button>
          )}
        </div>

        {/* 제목 */}
        <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

        {/* 카테고리 */}
        <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm mb-6">
          {getCategoryLabel(post.category)}
        </span>

        {/* 이미지 영역 */}
        <div className="w-full h-[360px] rounded-xl bg-gray-100 flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-7xl text-gray-400">
            image
          </span>
        </div>

        {/* 게시글 내용 */}
        <div className="text-gray-700 leading-8 whitespace-pre-wrap">
          {post.content}
        </div>

        {/* 조회수 / 좋아요 / 댓글 */}
        <div className="flex items-center gap-8 mt-8 pt-6 border-t">
          {/* 조회수 */}
          <div className="flex items-center gap-2 text-gray-500">
            <span className="material-symbols-outlined">visibility</span>

            <span>조회수 {Math.max(post.viewCount ?? 0, 0)}</span>
          </div>

          {/* 좋아요 */}
          <button
            type="button"
            onClick={handleLike}
            className="flex items-center gap-2"
            aria-label={liked ? "좋아요 취소" : "좋아요"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={
                liked
                  ? "w-6 h-6 fill-red-500 stroke-red-500 transition-all duration-200"
                  : "w-6 h-6 fill-none stroke-gray-500 transition-all duration-200"
              }
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
              />
            </svg>

            <span>좋아요 {Math.max(likeCount, 0)}</span>
          </button>

          {/* 댓글 */}
          <button
            type="button"
            onClick={handleToggleComments}
            className="flex items-center gap-2"
          >
            <span className="material-symbols-outlined">
              {showComments ? "chat_bubble" : "chat_bubble_outline"}
            </span>

            <span>댓글 {comments.length}</span>
          </button>
        </div>
      </article>

      {/* 댓글 영역 */}
      {showComments && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-5">댓글</h2>

          {/* 댓글 입력 */}
          <div className="bg-white rounded-xl border p-5">
            <textarea
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
              placeholder="댓글을 입력하세요."
              className="
                w-full
                h-28
                border
                rounded-lg
                p-4
                resize-none
                focus:outline-none
                focus:ring-2
                focus:ring-primary
              "
            />

            <button
              type="button"
              onClick={handleCreateComment}
              disabled={commentLoading}
              className="
                mt-4
                bg-primary
                text-white
                px-6
                py-2
                rounded-lg
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {commentLoading ? "등록 중..." : "등록"}
            </button>
          </div>

          {/* 댓글 목록 */}
          <div className="mt-5 space-y-4">
            {comments.length === 0 ? (
              <div className="bg-white rounded-xl border p-6 text-center text-gray-500">
                아직 댓글이 없습니다.
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.commentId}
                  className="bg-white rounded-xl border p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {/* 댓글 작성자는 아직 profileImageUrl이
                        댓글 API 응답에 없으므로 기본 이미지 사용 */}
                    <img
                      src={profileImage}
                      alt="프로필"
                      className="w-9 h-9 rounded-full object-cover"
                    />

                    <p className="font-semibold">{comment.authorNickname}</p>
                  </div>

                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default PostDetail;
