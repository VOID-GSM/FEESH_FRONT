import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  deletePost,
  getPost,
  likePost,
  unlikePost,
  updatePost,
} from "../api/post";

import {
  createComment,
  createReply,
  deleteComment,
  deleteReply,
  getComments,
  getReplies,
  updateComment,
  updateReply,
} from "../api/comment";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string | null;
  price: number;
  authorId: number;
  authorNickname: string | null;
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
  profileImageUrl: string | null;
  createdAt?: string;
}

// 백엔드 카테고리 → 화면 표시용 한국어
const categoryMap: Record<string, string> = {
  FOOD: "음식",
  FASHION_SHOPPING: "패션/쇼핑",
  DAILY_NECESSITY: "생활용품",
  CULTURE_LEISURE: "문화/여가",
  ETC: "기타",
};

// 화면 표시용 카테고리 목록
const categories = [
  { value: "FOOD", label: "음식" },
  { value: "FASHION_SHOPPING", label: "패션/쇼핑" },
  { value: "DAILY_NECESSITY", label: "생활용품" },
  { value: "CULTURE_LEISURE", label: "문화/여가" },
  { value: "ETC", label: "기타" },
];

// 카테고리 변환
const getCategoryLabel = (category: string | null): string => {
  if (!category) {
    return "";
  }

  return categoryMap[category] ?? category;
};

// 날짜 표시
const formatDate = (date: string): string => {
  const createdDate = date.endsWith("Z")
    ? new Date(date)
    : new Date(`${date}Z`);

  const now = new Date();

  const diffTime = now.getTime() - createdDate.getTime();

  if (diffTime <= 0) {
    return "방금 전";
  }

  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

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

// 기본 프로필 아이콘
const DefaultProfileIcon = ({ size = "w-7 h-7" }: { size?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={`${size} text-[#294C77]`}
    >
      {" "}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
      />{" "}
    </svg>
  );
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

  // 댓글 수정
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [commentEditLoading, setCommentEditLoading] = useState(false);

  // 답글
  const [replies, setReplies] = useState<Record<number, Comment[]>>({});
  const [openReplies, setOpenReplies] = useState<number[]>([]);
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  // 답글 수정
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");
  const [replyEditLoading, setReplyEditLoading] = useState(false);

  // 게시글 수정
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editLoading, setEditLoading] = useState(false);

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

  // 날짜 표시 주기적 갱신
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // 댓글 목록 조회
  const fetchComments = useCallback(async () => {
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
  }, [id]);

  // 게시글을 열었을 때 댓글 조회
  useEffect(() => {
    if (!id) {
      return;
    }

    // 게시글 상세 페이지가 열릴 때 댓글을 조회합니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComments();
  }, [id, fetchComments]);

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

  // 댓글 수정 시작
  const handleStartCommentEdit = (comment: Comment) => {
    setEditingCommentId(comment.commentId);
    setEditingCommentContent(comment.content);
  };

  // 댓글 수정 취소
  const handleCancelCommentEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  // 댓글 수정
  const handleUpdateComment = async (commentId: number) => {
    const content = editingCommentContent.trim();

    if (!content) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    if (commentEditLoading) {
      return;
    }

    try {
      setCommentEditLoading(true);

      await updateComment(commentId, {
        content,
      });

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.commentId === commentId
            ? {
                ...comment,
                content,
              }
            : comment,
        ),
      );

      handleCancelCommentEdit();
    } catch (error) {
      console.error("댓글 수정 실패:", error);

      alert("댓글 수정에 실패했습니다.");
    } finally {
      setCommentEditLoading(false);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteComment(commentId);

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.commentId !== commentId),
      );

      setReplies((prevReplies) => {
        const nextReplies = { ...prevReplies };

        delete nextReplies[commentId];

        return nextReplies;
      });

      setOpenReplies((prev) => prev.filter((id) => id !== commentId));

      if (replyTargetId === commentId) {
        setReplyTargetId(null);
        setReplyContent("");
      }
    } catch (error) {
      console.error("댓글 삭제 실패:", error);

      alert("댓글 삭제에 실패했습니다.");
    }
  };

  // 답글 조회
  const fetchReplies = async (commentId: number) => {
    try {
      const response = await getReplies(commentId);

      console.log(`댓글 ${commentId}의 답글 목록:`, response.data);

      setReplies((prev) => ({
        ...prev,
        [commentId]: response.data,
      }));
    } catch (error) {
      console.error("답글 조회 실패:", error);

      alert("답글을 불러오지 못했습니다.");
    }
  };

  // 답글 열기 / 닫기
  const handleToggleReplies = async (commentId: number) => {
    const isOpen = openReplies.includes(commentId);

    if (isOpen) {
      setOpenReplies((prev) => prev.filter((id) => id !== commentId));

      return;
    }

    setOpenReplies((prev) => [...prev, commentId]);

    await fetchReplies(commentId);
  };

  // 답글 입력창 열기
  const handleStartReply = (commentId: number) => {
    if (replyTargetId === commentId) {
      setReplyTargetId(null);
      setReplyContent("");

      return;
    }

    setReplyTargetId(commentId);
    setReplyContent("");

    if (!openReplies.includes(commentId)) {
      setOpenReplies((prev) => [...prev, commentId]);
      fetchReplies(commentId);
    }
  };

  // 답글 등록
  const handleCreateReply = async (commentId: number) => {
    const content = replyContent.trim();

    if (!content) {
      alert("답글 내용을 입력해주세요.");
      return;
    }

    if (replyLoading) {
      return;
    }

    try {
      setReplyLoading(true);

      await createReply(commentId, {
        content,
      });

      setReplyContent("");
      setReplyTargetId(null);

      await fetchReplies(commentId);
    } catch (error) {
      console.error("답글 등록 실패:", error);

      alert("답글 등록에 실패했습니다.");
    } finally {
      setReplyLoading(false);
    }
  };

  // 답글 수정 시작
  const handleStartReplyEdit = (reply: Comment) => {
    setEditingReplyId(reply.commentId);
    setEditingReplyContent(reply.content);
  };

  // 답글 수정 취소
  const handleCancelReplyEdit = () => {
    setEditingReplyId(null);
    setEditingReplyContent("");
  };

  // 답글 수정
  const handleUpdateReply = async (
    parentCommentId: number,
    replyId: number,
  ) => {
    const content = editingReplyContent.trim();

    if (!content) {
      alert("답글 내용을 입력해주세요.");
      return;
    }

    if (replyEditLoading) {
      return;
    }

    try {
      setReplyEditLoading(true);

      await updateReply(replyId, {
        content,
      });

      setReplies((prev) => ({
        ...prev,
        [parentCommentId]: (prev[parentCommentId] ?? []).map((reply) =>
          reply.commentId === replyId
            ? {
                ...reply,
                content,
              }
            : reply,
        ),
      }));

      handleCancelReplyEdit();
    } catch (error) {
      console.error("답글 수정 실패:", error);

      alert("답글 수정에 실패했습니다.");
    } finally {
      setReplyEditLoading(false);
    }
  };

  // 답글 삭제
  const handleDeleteReply = async (
    parentCommentId: number,
    replyId: number,
  ) => {
    const confirmDelete = window.confirm("답글을 삭제하시겠습니까?");

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteReply(replyId);

      setReplies((prev) => ({
        ...prev,
        [parentCommentId]: (prev[parentCommentId] ?? []).filter(
          (reply) => reply.commentId !== replyId,
        ),
      }));
    } catch (error) {
      console.error("답글 삭제 실패:", error);

      alert("답글 삭제에 실패했습니다.");
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

  // 게시글 수정 시작
  const handleStartEdit = () => {
    if (!post) {
      return;
    }

    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category ?? "");
    setEditPrice(String(post.price ?? ""));

    setIsEditing(true);
  };

  // 게시글 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);

    setEditTitle("");
    setEditContent("");
    setEditCategory("");
    setEditPrice("");
  };

  // 게시글 수정
  const handleUpdatePost = async () => {
    if (!post) {
      return;
    }

    const title = editTitle.trim();
    const content = editContent.trim();

    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (!editCategory) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    const price = Number(editPrice);

    if (editPrice.trim() === "" || Number.isNaN(price)) {
      alert("가격을 입력해주세요.");
      return;
    }

    if (price < 0) {
      alert("가격은 0원 이상이어야 합니다.");
      return;
    }

    if (editLoading) {
      return;
    }

    try {
      setEditLoading(true);

      const response = await updatePost(post.id, {
        title,
        content,
        category: editCategory,
        price,
      });

      console.log("게시글 수정 응답:", response.data);

      setPost((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          title,
          content,
          category: editCategory,
          price,
        };
      });

      setIsEditing(false);

      alert("게시글이 수정되었습니다.");
    } catch (error) {
      console.error("게시글 수정 실패:", error);

      alert("게시글 수정에 실패했습니다.");
    } finally {
      setEditLoading(false);
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
    return <div>존재하지 않는 게시글입니다.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      {/* 뒤로가기 */}
      <button
        type="button"
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 text-gray-600 mb-8"
      >
        {" "}
        <span className="material-symbols-outlined">arrow_back</span>
        뒤로가기{" "}
      </button>

      {/* 게시글 */}
      <article className="bg-white rounded-2xl shadow-sm border p-8">
        {/* 작성자 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {/* 작성자 프로필 이미지 */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-blue-200 flex items-center justify-center">
              {post.profileImageUrl ? (
                <img
                  src={post.profileImageUrl}
                  alt={`${post.authorNickname ?? "사용자"} 프로필`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <DefaultProfileIcon />
              )}
            </div>

            <div>
              <p className="font-semibold">
                {post.authorNickname ?? "알 수 없는 사용자"}
              </p>

              <p className="text-sm text-gray-500">
                {post.createdAt ? formatDate(post.createdAt) : ""}
              </p>
            </div>
          </div>

          {/* 본인 게시글만 수정 / 삭제 */}
          {post.authorId === userId && !isEditing && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleStartEdit}
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                수정
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="text-red-500 font-semibold hover:text-red-700"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 수정 모드 */}
        {isEditing ? (
          <div className="space-y-5">
            {/* 제목 */}
            <div>
              <label className="block mb-2 font-semibold">제목</label>

              <input
                type="text"
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="제목을 입력해주세요."
              />
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block mb-2 font-semibold">카테고리</label>

              <select
                value={editCategory}
                onChange={(event) => setEditCategory(event.target.value)}
                className="w-full border rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">카테고리를 선택해주세요.</option>

                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 가격 */}
            <div>
              <label className="block mb-2 font-semibold">가격</label>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={editPrice}
                  onChange={(event) => setEditPrice(event.target.value)}
                  className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="가격을 입력해주세요."
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  원
                </span>
              </div>
            </div>

            {/* 내용 */}
            <div>
              <label className="block mb-2 font-semibold">내용</label>

              <textarea
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                className="w-full h-60 border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="내용을 입력해주세요."
              />
            </div>

            {/* 수정 버튼 */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={editLoading}
                className="px-6 py-2.5 rounded-lg border text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleUpdatePost}
                disabled={editLoading}
                className="px-6 py-2.5 rounded-lg bg-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editLoading ? "수정 중..." : "수정 완료"}
              </button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </article>

      {/* 댓글 영역 */}
      {showComments && !isEditing && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-5">댓글</h2>

          {/* 댓글 입력 */}
          <div className="bg-white rounded-xl border p-5">
            <textarea
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
              placeholder="댓글을 입력하세요."
              className="w-full h-28 border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="button"
              onClick={handleCreateComment}
              disabled={commentLoading}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
              comments.map((comment) => {
                const commentReplies = replies[comment.commentId] ?? [];
                const isRepliesOpen = openReplies.includes(comment.commentId);
                const isEditingThisComment =
                  editingCommentId === comment.commentId;

                return (
                  <div
                    key={comment.commentId}
                    className="bg-white rounded-xl border p-5"
                  >
                    {/* 댓글 작성자 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* 댓글 프로필 */}
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-white border border-blue-200 flex items-center justify-center">
                          {comment.profileImageUrl ? (
                            <img
                              src={comment.profileImageUrl}
                              alt={`${comment.authorNickname} 프로필`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <DefaultProfileIcon size="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold">
                            {comment.authorNickname}
                          </p>

                          {comment.createdAt && (
                            <p className="text-xs text-gray-400">
                              {formatDate(comment.createdAt)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* 내 댓글만 수정 / 삭제 */}
                      {comment.authorId === userId && !isEditingThisComment && (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleStartCommentEdit(comment)}
                            className="text-sm text-blue-600 font-semibold hover:text-blue-800"
                          >
                            수정
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteComment(comment.commentId)
                            }
                            className="text-sm text-red-500 font-semibold hover:text-red-700"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 댓글 내용 / 수정 */}
                    {isEditingThisComment ? (
                      <div>
                        <textarea
                          value={editingCommentContent}
                          onChange={(event) =>
                            setEditingCommentContent(event.target.value)
                          }
                          className="w-full min-h-24 border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            type="button"
                            onClick={handleCancelCommentEdit}
                            disabled={commentEditLoading}
                            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            취소
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateComment(comment.commentId)
                            }
                            disabled={commentEditLoading}
                            className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
                          >
                            {commentEditLoading ? "수정 중..." : "수정 완료"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    )}

                    {/* 답글 / 답글 보기 */}
                    <div className="flex items-center gap-4 mt-4">
                      <button
                        type="button"
                        onClick={() => handleStartReply(comment.commentId)}
                        className="text-sm font-semibold text-gray-600 hover:text-primary"
                      >
                        답글 달기
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleReplies(comment.commentId)}
                        className="text-sm font-semibold text-primary"
                      >
                        {isRepliesOpen ? "답글 숨기기" : "답글 보기"}
                      </button>
                    </div>

                    {/* 답글 작성 */}
                    {replyTargetId === comment.commentId && (
                      <div className="mt-4 ml-8 p-4 bg-gray-50 rounded-xl">
                        <textarea
                          value={replyContent}
                          onChange={(event) =>
                            setReplyContent(event.target.value)
                          }
                          placeholder="답글을 입력하세요."
                          className="w-full h-24 border rounded-lg p-3 resize-none bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => {
                              setReplyTargetId(null);
                              setReplyContent("");
                            }}
                            disabled={replyLoading}
                            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-white disabled:opacity-50"
                          >
                            취소
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCreateReply(comment.commentId)}
                            disabled={replyLoading}
                            className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
                          >
                            {replyLoading ? "등록 중..." : "답글 등록"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 답글 목록 */}
                    {isRepliesOpen && (
                      <div className="mt-4 ml-8 space-y-3">
                        {commentReplies.length === 0 ? (
                          <div className="text-sm text-gray-400 py-3">
                            아직 답글이 없습니다.
                          </div>
                        ) : (
                          commentReplies.map((reply) => {
                            const isEditingThisReply =
                              editingReplyId === reply.commentId;

                            return (
                              <div
                                key={reply.commentId}
                                className="border-l-2 border-gray-200 pl-4 py-2"
                              >
                                {/* 답글 작성자 */}
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    {/* 답글 프로필 */}
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-blue-200 flex items-center justify-center">
                                      {reply.profileImageUrl ? (
                                        <img
                                          src={reply.profileImageUrl}
                                          alt={`${reply.authorNickname} 프로필`}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <DefaultProfileIcon size="w-4 h-4" />
                                      )}
                                    </div>

                                    <div>
                                      <p className="text-sm font-semibold">
                                        {reply.authorNickname}
                                      </p>

                                      {reply.createdAt && (
                                        <p className="text-xs text-gray-400">
                                          {formatDate(reply.createdAt)}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* 내 답글만 수정 / 삭제 */}
                                  {reply.authorId === userId &&
                                    !isEditingThisReply && (
                                      <div className="flex items-center gap-3">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleStartReplyEdit(reply)
                                          }
                                          className="text-xs text-blue-600 font-semibold hover:text-blue-800"
                                        >
                                          수정
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleDeleteReply(
                                              comment.commentId,
                                              reply.commentId,
                                            )
                                          }
                                          className="text-xs text-red-500 font-semibold hover:text-red-700"
                                        >
                                          삭제
                                        </button>
                                      </div>
                                    )}
                                </div>

                                {/* 답글 내용 / 수정 */}
                                {isEditingThisReply ? (
                                  <div>
                                    <textarea
                                      value={editingReplyContent}
                                      onChange={(event) =>
                                        setEditingReplyContent(
                                          event.target.value,
                                        )
                                      }
                                      className="w-full min-h-20 border rounded-lg p-3 resize-none bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    />

                                    <div className="flex justify-end gap-2 mt-2">
                                      <button
                                        type="button"
                                        onClick={handleCancelReplyEdit}
                                        disabled={replyEditLoading}
                                        className="px-3 py-1.5 text-sm rounded-lg border text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                      >
                                        취소
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateReply(
                                            comment.commentId,
                                            reply.commentId,
                                          )
                                        }
                                        disabled={replyEditLoading}
                                        className="px-3 py-1.5 text-sm rounded-lg bg-primary text-white disabled:opacity-50"
                                      >
                                        {replyEditLoading
                                          ? "수정 중..."
                                          : "수정 완료"}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {reply.content}
                                  </p>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default PostDetail;
