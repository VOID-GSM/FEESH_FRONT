import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import profileImage from "../assets/profile.png";

function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");

  const post = posts.find((item: any) => item.id === Number(id));

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [showComments, setShowComments] = useState(false);

  // 좋아요
  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }

    setLiked(!liked);
  };

  // 게시글 삭제
  const handleDelete = () => {
    const confirmDelete = window.confirm("게시글을 삭제하시겠습니까?");

    if (confirmDelete) {
      const updatedPosts = posts.filter((item: any) => item.id !== Number(id));

      localStorage.setItem("posts", JSON.stringify(updatedPosts));

      alert("게시글이 삭제되었습니다.");

      navigate("/home");
    }
  };

  // 게시글 없음
  if (!post) {
    return (
      <main className="p-10 text-center">존재하지 않는 게시글입니다.</main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate("/home")}
        className="
        flex
        items-center
        gap-2
        text-gray-600
        hover:text-blue-700
        mb-8
        "
      >
        <span className="material-symbols-outlined">arrow_back</span>
        뒤로가기
      </button>

      <article className="bg-white rounded-2xl shadow-sm border p-8">
        {/* 작성자 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img
              src={profileImage}
              alt="프로필"
              className="w-12 h-12 rounded-full"
            />

            <div>
              <p className="font-semibold">{post.user}</p>

              <p className="text-sm text-gray-500">{post.time}</p>
            </div>
          </div>

          {/* 내 글 삭제 버튼 */}
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
        <div className="text-gray-700 leading-8">
          <p>{post.description}</p>
        </div>

        {/* 지출 */}
        <div className="bg-blue-50 rounded-xl p-5 mt-8">
          <h3 className="font-bold text-lg mb-3">총 지출</h3>

          <p className="font-bold text-blue-700">{post.price}</p>
        </div>

        {/* 좋아요 댓글 */}
        <div className="flex items-center gap-8 mt-8 pt-6 border-t">
          <button
            onClick={handleLike}
            className="
            flex
            items-center
            gap-2
            hover:text-red-500
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
            hover:text-blue-600
            "
          >
            <span className="material-symbols-outlined">chat_bubble</span>
            댓글 {post.comments}
          </button>
        </div>
      </article>

      {/* 댓글 */}
      {showComments && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-5">댓글</h2>

          <div className="bg-white rounded-2xl border p-5">
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
                  bg-blue-700
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
