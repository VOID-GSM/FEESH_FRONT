import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { getPost, likePost, unlikePost } from "../api/post";
import { getComments, createComment } from "../api/comment";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  price: number;
  authorNickname: string;
  likeCount: number;
  viewCount: number;
  createdAt: string;
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
  const [liked, setLiked] = useState(false);

  const loadPost = useCallback(async () => {
    if (!id) return;

    try {
      const response = await getPost(Number(id));
      setPost(response.data);
    } catch (error) {
      console.error("게시글 조회 실패", error);
      alert("게시글을 불러오지 못했습니다.");
    }
  }, [id]);

  const loadComments = useCallback(async () => {
    if (!id) return;

    try {
      const response = await getComments(Number(id));
      setComments(response.data);
    } catch (error) {
      console.error("댓글 조회 실패", error);
    }
  }, [id]);

  useEffect(() => {
    loadPost();
    loadComments();
  }, [loadPost, loadComments]);

  const handleLike = async () => {
    if (!id) return;

    try {
      if (liked) {
        await unlikePost(Number(id));
        setLiked(false);
      } else {
        await likePost(Number(id));
        setLiked(true);
      }

      await loadPost();
    } catch (error) {
      console.error("좋아요 실패", error);
    }
  };

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
      await loadPost();
    } catch (error) {
      console.error("댓글 작성 실패", error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8f9ff]">
        <Header />

        <div className="flex justify-center items-center h-[80vh] text-gray-500 text-lg">
          게시글을 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-700 hover:underline"
        >
          ← 뒤로가기
        </button>

        <section className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{post.title}</h1>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              {post.category}
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold text-blue-700">
            {post.price.toLocaleString()}원
          </p>

          <p className="mt-6 whitespace-pre-line text-gray-700 leading-7">
            {post.content}
          </p>

          <div className="mt-8 text-sm text-gray-500 space-y-1">
            <p>작성자 : {post.authorNickname}</p>

            <p>조회수 : {post.viewCount}</p>

            <p>좋아요 : {post.likeCount}</p>

            <p>작성일 : {new Date(post.createdAt).toLocaleString("ko-KR")}</p>
          </div>

          <button
            onClick={handleLike}
            className="
              mt-8
              bg-blue-700
              hover:bg-blue-800
              text-white
              px-6
              py-3
              rounded-lg
              transition
            "
          >
            {liked ? "❤️" : "🤍"} 좋아요 {post.likeCount}
          </button>
        </section>

        <section className="mt-8 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-bold mb-6">댓글 ({comments.length})</h2>

          <div className="flex gap-3 mb-6">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요."
              className="
                flex-1
                border
                rounded-lg
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

            <button
              onClick={handleComment}
              className="
                bg-blue-700
                hover:bg-blue-800
                text-white
                px-6
                rounded-lg
                transition
              "
            >
              작성
            </button>
          </div>

          {comments.length === 0 ? (
            <div className="text-center text-gray-400 py-6">
              아직 작성된 댓글이 없습니다.
            </div>
          ) : (
            <div className="space-y-5">
              {comments.map((item) => (
                <div key={item.commentId} className="border-b pb-4">
                  <p className="text-gray-800 whitespace-pre-line">
                    {item.content}
                  </p>

                  <div className="mt-2 flex justify-between text-sm text-gray-400">
                    <span>{item.authorNickname}</span>

                    <span>
                      {new Date(item.createdAt).toLocaleString("ko-KR")}
                    </span>
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

export default PostDetail;
