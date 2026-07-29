import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import profileImage from "../assets/profile.png";
import { deletePost, getPost, likePost, unlikePost } from "../api/post";

interface Post {
  id: number;
  user: string;
  time: string;
  title: string;
  description: string;
  price: string;
  likes: number;
  comments: number;
  isMine: boolean;
}

function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showComments, setShowComments] = useState(false);

  // 게시글 상세 조회
  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await getPost(Number(id));

        setPost(response.data);
        setLikes(response.data.likes);
      } catch (error) {
        console.error("게시글 조회 실패", error);
      }
    };

    fetchPost();
  }, [id]);

  // 좋아요
  const handleLike = async () => {
    if (!post) return;

    const previousLiked = liked;
    const previousLikes = likes;

    // 화면 먼저 변경
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);

    try {
      if (previousLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
    } catch (error) {
      console.error("좋아요 실패", error);

      // 실패하면 원상복구
      setLiked(previousLiked);
      setLikes(previousLikes);
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
      console.error("삭제 실패", error);

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
        text-gray-600
        hover:text-primary
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
        {/* 작성자 영역 */}

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
              alt="프로필"
              className="
              w-12
              h-12
              rounded-full
              "
            />

            <div>
              <p className="font-semibold">{post.user}</p>

              <p className="text-sm text-gray-500">{post.time}</p>
            </div>
          </div>

          {post.isMine && (
            <button
              onClick={handleDelete}
              className="
              text-red-500
              hover:text-red-700
              font-semibold
              "
            >
              삭제
            </button>
          )}
        </div>

        {/* 제목 */}

        <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

        {/* 이미지 */}

        <div
          className="
          w-full
          h-[360px]
          rounded-xl
          bg-gray-200
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

        {/* 내용 */}

        <div
          className="
          text-gray-700
          leading-8
          "
        >
          <p>{post.description}</p>
        </div>

        {/* 금액 */}

        <div
          className="
          bg-blue-50
          rounded-xl
          p-5
          mt-8
          "
        >
          <h3 className="font-bold text-lg mb-3">총 지출</h3>

          <p
            className="
            font-bold
            text-blue-700
            "
          >
            {post.price}
          </p>
        </div>

        {/* 좋아요 댓글 */}

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
            onClick={() => setShowComments(!showComments)}
            className="
            flex
            items-center
            gap-2
            "
          >
            <span className="material-symbols-outlined">chat_bubble</span>
            댓글 {post.comments}
          </button>
        </div>
      </article>

      {showComments && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-5">댓글</h2>

          <div
            className="
            bg-white
            rounded-2xl
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

            <div className="flex justify-end mt-4">
              <button
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
        </section>
      )}
    </main>
  );
}

export default PostDetail;
