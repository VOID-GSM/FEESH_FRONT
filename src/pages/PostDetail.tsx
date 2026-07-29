import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import profileImage from "../assets/profile.png";

import { deletePost, getPost, likePost, unlikePost } from "../api/post";
import { createComment, deleteComment, getComments } from "../api/comment";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  authorNickname: string;
  likeCount: number;
  viewCount: number;
  createdAt: string;
  isMine?: boolean;
}

interface Comment {
  commentId: number;
  content: string;
  authorNickname: string;
  createdAt: string;
}

function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState<Post | null>(null);

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const [showComments, setShowComments] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");

  // 게시글 조회
  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await getPost(Number(id));

        setPost(response.data);
        setLikes(response.data.likeCount);
      } catch (error) {
        console.error("게시글 조회 실패", error);
      }
    };

    fetchPost();
  }, [id]);

  // 댓글 조회
  const fetchComments = async () => {
    if (!id) return;

    try {
      const response = await getComments(Number(id));

      setComments(response.data);
    } catch (error) {
      console.error("댓글 조회 실패", error);
    }
  };

  // 댓글 버튼
  const handleComments = async () => {
    const next = !showComments;

    setShowComments(next);

    if (next) {
      await fetchComments();
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!id) return;

    if (!commentInput.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    try {
      await createComment(Number(id), {
        content: commentInput,
      });

      setCommentInput("");

      await fetchComments();
    } catch (error) {
      console.error("댓글 작성 실패", error);

      alert("댓글 작성에 실패했습니다.");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);

      setComments((prev) =>
        prev.filter((comment) => comment.commentId !== commentId),
      );
    } catch (error) {
      console.error("댓글 삭제 실패", error);

      alert("댓글 삭제에 실패했습니다.");
    }
  };

  // 좋아요
  const handleLike = async () => {
    if (!post) return;

    const beforeLiked = liked;
    const beforeLikes = likes;

    setLiked(!liked);

    setLikes(liked ? likes - 1 : likes + 1);

    try {
      if (beforeLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
    } catch (error) {
      console.error("좋아요 실패", error);

      setLiked(beforeLiked);
      setLikes(beforeLikes);
    }
  };

  // 게시글 삭제
  const handleDelete = async () => {
    if (!post) return;

    const confirmDelete = window.confirm("게시글을 삭제하시겠습니까?");

    if (!confirmDelete) return;

    try {
      await deletePost(post.id);

      alert("게시글이 삭제되었습니다.");

      navigate("/home");
    } catch (error) {
      console.error("게시글 삭제 실패", error);

      alert("게시글 삭제에 실패했습니다.");
    }
  };

  if (!post) {
    return (
      <main className="p-10 text-center">존재하지 않는 게시글입니다.</main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate("/home")}
        className="
          flex
          items-center
          gap-2
          mb-8
          text-gray-600
          hover:text-blue-700
        "
      >
        <span className="material-symbols-outlined">arrow_back</span>
        뒤로가기
      </button>

      <article
        className="
          bg-white
          border
          rounded-2xl
          p-8
        "
      >
        {/* 작성자 */}

        <div
          className="
            flex
            justify-between
            items-center
            mb-6
          "
        >
          <div className="flex items-center gap-3">
            <img
              src={profileImage}
              alt="profile"
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

          {post.isMine && (
            <button
              onClick={handleDelete}
              className="
                text-red-500
                hover:text-red-700
              "
            >
              삭제
            </button>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

        <div
          className="
            bg-gray-100
            rounded-xl
            h-80
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

        <p
          className="
            leading-8
            text-gray-700
          "
        >
          {post.content}
        </p>

        {/* 좋아요 댓글 */}

        <div
          className="
            flex
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
            <span
              className={`
                material-symbols-outlined
                ${liked ? "text-red-500" : "text-gray-500"}
              `}
            >
              favorite
            </span>
            좋아요 {likes}
          </button>

          <button
            onClick={handleComments}
            className="
              flex
              items-center
              gap-2
            "
          >
            <span className="material-symbols-outlined">chat_bubble</span>
            댓글 {comments.length}
          </button>
        </div>
      </article>

      {/* 댓글 영역 */}

      {showComments && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-5">댓글</h2>

          <div
            className="
              bg-white
              border
              rounded-xl
              p-5
            "
          >
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
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

            <div className="flex justify-end mt-4">
              <button
                onClick={handleCommentSubmit}
                className="
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
          </div>

          <div className="mt-5 space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.commentId}
                className="
                  bg-white
                  border
                  rounded-xl
                  p-4
                  flex
                  justify-between
                "
              >
                <div>
                  <p className="font-semibold">{comment.authorNickname}</p>

                  <p>{comment.content}</p>

                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteComment(comment.commentId)}
                  className="
                    text-red-500
                  "
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default PostDetail;
