import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import profileImage from "../assets/profile.png";
import { getPost, deletePost } from "../api/post";
import type { PostDetailResponse } from "../api/post";

function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState<PostDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showComments, setShowComments] = useState(false);

 useEffect(() => {
    // id가 바뀔 때 로딩 상태를 다시 켜기 위한 의도된 동작
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    getPost(Number(id))
      .then((res) => {
        setPost(res.data);
        setLikes(res.data.likeCount);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

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
  // TODO: 백엔드 응답에 isMine 추가되면 아래 삭제 버튼 JSX 주석 해제하고 연결
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = async () => {
    const confirmDelete = window.confirm("게시글을 삭제하시겠습니까?");

    if (!confirmDelete) return;

    try {
      await deletePost(Number(id));
      alert("게시글이 삭제되었습니다.");
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return <main className="p-10 text-center">불러오는 중...</main>;
  }

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
              <p className="font-semibold">{post.authorNickname}</p>

              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* 내 글 삭제 버튼 - 백엔드 응답에 isMine 없어 현재 비활성화 */}
          {/* {post.isMine && (
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
          )} */}
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
          <p>{post.content}</p>
        </div>

        {/* 조회수 (price 필드가 없어 임시로 대체) */}
        <div className="bg-blue-50 rounded-xl p-5 mt-8">
          <h3 className="font-bold text-lg mb-3">조회수</h3>

          <p className="font-bold text-blue-700">{post.viewCount}</p>
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
            댓글
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
