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

  const [likeCount, setLikeCount] = useState(0);

  const [showComments, setShowComments] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);

  const [comment, setComment] = useState("");

  // 게시글 조회

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await getPost(Number(id));

        setPost(response.data);

        setLikeCount(response.data.likeCount);
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

  // 댓글 열기

  const handleComments = async () => {
    const next = !showComments;

    setShowComments(next);

    if (next) {
      await fetchComments();
    }
  };

  // 댓글 작성

  const handleCreateComment = async () => {
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

      await fetchComments();
    } catch (error) {
      console.error("댓글 작성 실패", error);
    }
  };

  // 댓글 삭제

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);

      setComments((prev) =>
        prev.filter((item) => item.commentId !== commentId),
      );
    } catch (error) {
      console.error("댓글 삭제 실패", error);
    }
  };

  // 좋아요

  const handleLike = async () => {
    if (!post) return;

    try {
      if (liked) {
        await unlikePost(post.id);

        setLiked(false);

        setLikeCount((prev) => prev - 1);
      } else {
        await likePost(post.id);

        setLiked(true);

        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("좋아요 실패", error);
    }
  };

  // 게시글 삭제

  const handleDelete = async () => {
    if (!post) return;

    if (!window.confirm("게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deletePost(post.id);

      alert("삭제되었습니다.");

      navigate("/home");
    } catch (error) {
      console.error("삭제 실패", error);
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
        className="flex gap-2 mb-8 text-gray-600"
      >
        ← 뒤로가기
      </button>

      <article className="bg-white border rounded-2xl p-8">
        <div className="flex justify-between mb-6">
          <div className="flex gap-3 items-center">
            <img
              src={profileImage}
              className="w-12 h-12 rounded-full"
              alt="profile"
            />

            <div>
              <p className="font-semibold">{post.authorNickname}</p>

              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {post.isMine && (
            <button onClick={handleDelete} className="text-red-500">
              삭제
            </button>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

        <p className="text-gray-700 leading-8">{post.content}</p>

        <div className="flex gap-8 mt-8 border-t pt-6">
          <button onClick={handleLike}>❤️ 좋아요 {likeCount}</button>

          <button onClick={handleComments}>💬 댓글 {comments.length}</button>
        </div>
      </article>

      {showComments && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-5">댓글</h2>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-28 border rounded-lg p-4"
            placeholder="댓글을 입력하세요."
          />

          <button
            onClick={handleCreateComment}
            className="mt-3 bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            등록
          </button>

          <div className="mt-5 space-y-3">
            {comments.map((item) => (
              <div
                key={item.commentId}
                className="border rounded-xl p-4 flex justify-between"
              >
                <div>
                  <p className="font-semibold">{item.authorNickname}</p>

                  <p>{item.content}</p>
                </div>

                <button
                  onClick={() => handleDeleteComment(item.commentId)}
                  className="text-red-500"
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
