import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/profile.png";
import { getPosts, getCategories, likePost, unlikePost } from "../api/post";
import type { PostSummary } from "../api/post";

function Home() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<string[]>(["전체"]);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sort, setSort] = useState<"latest" | "popular">("latest");

  // 카테고리 불러오기 (백엔드 /main/categories 연동)
  useEffect(() => {
    getCategories()
      .then((res) => {
        // 백엔드 CategoryResponse 구조에 맞춰 배열 매핑
        const names = res.data.map((c: { name: string }) => c.name);
        setCategories(["전체", ...names]);
      })
      .catch((err) => console.error("카테고리 불러오기 실패", err));
  }, []);

  // 게시글 불러오기 (백엔드 /main/posts/latest 및 /main/posts/popular 연동)
  useEffect(() => {
    getPosts(sort)
      .then((res) => {
        // 백엔드 PostListReponse 구조에 맞춰 posts 데이터 설정
        setPosts(res.data.posts);
      })
      .catch((err) => console.error("게시글 불러오기 실패", err));
  }, [sort]);

  // 좋아요
  const handleLike = async (id: number) => {
    const isLiked = likedPosts.includes(id);

    // 화면 먼저 업데이트 (낙관적 업데이트)
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post,
      ),
    );

    if (isLiked) {
      setLikedPosts(likedPosts.filter((postId) => postId !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
    }

    // 서버에 반영
    try {
      if (isLiked) {
        await unlikePost(id);
      } else {
        await likePost(id);
      }
    } catch (err) {
      console.error("좋아요 처리 실패", err);

      // 실패 시 원래 상태로 롤백
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...post,
                likeCount: isLiked ? post.likeCount + 1 : post.likeCount - 1,
              }
            : post,
        ),
      );
      setLikedPosts((prev) =>
        isLiked ? [...prev, id] : prev.filter((postId) => postId !== id),
      );
    }
  };

  // 상대 시간 표시 (3시간 전, 어제 등)
const formatTime = (iso: string) => {
  // eslint-disable-next-line react-hooks/purity
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return "어제";
  if (diffDay < 7) return `${diffDay}일 전`;
  return new Date(iso).toLocaleDateString();
};

  // 카테고리 필터
  const filteredPosts =
    selectedCategory === "전체"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <main className="max-w-[1024px] mx-auto px-margin-tablet py-stack-lg">
      {/* 카테고리 */}

      <section className="flex gap-3 overflow-x-auto mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-5
              py-2
              rounded-full
              whitespace-nowrap

              ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600"
              }
            `}
          >
            {category}
          </button>
        ))}
      </section>

      {/* 정렬 */}

      <div className="flex gap-8 border-b mb-6">
        <button
          onClick={() => setSort("latest")}
          className={sort === "latest" ? "text-primary py-3" : "text-gray-500 py-3"}
        >
          최신순
        </button>

        <button
          onClick={() => setSort("popular")}
          className={sort === "popular" ? "text-primary py-3" : "text-gray-500 py-3"}
        >
          좋아요순
        </button>
      </div>

      {/* 게시글 */}

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
      "
      >
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => navigate(`/post/${post.id}`)}
            className="
            bg-white
            border
            rounded-xl
            overflow-hidden
            hover:shadow-lg
            transition
            cursor-pointer
          "
          >
            {/* 이미지 */}

            <div
              className="
            aspect-video
            bg-gray-100
            flex
            flex-col
            items-center
            justify-center
            text-gray-400
            relative
          "
            >
              <span
                className="
              material-symbols-outlined
              text-5xl
            "
              >
                image_not_supported
              </span>

              <p>이미지 없음</p>

              <span
                className="
              absolute
              right-2
              top-2
              bg-black/50
              text-white
              px-2
              py-1
              rounded
              text-xs
            "
              >
                {post.category}
              </span>
            </div>

            {/* 내용 */}

            <div className="p-4">
              <h3 className="font-bold text-lg">{post.title}</h3>

             <p className="text-primary font-bold mt-2">
  {post.price != null ? `${post.price.toLocaleString()}원` : "가격 미정"}
</p>

              <p
                className="
              text-gray-600
              text-sm
              mt-2
              line-clamp-2
            "
              >
                {post.description}
              </p>
            </div>

            {/* 하단 */}

            <div
              onClick={(e) => e.stopPropagation()}
              className="
              border-t
              px-4
              py-3
              flex
              justify-between
              items-center
              bg-gray-50
            "
            >
              <div className="flex items-center gap-2">
                <img
                  src={post.profileImageUrl || profileImage}
                  className="w-6 h-6 rounded-full"
                  alt="profile"
                />

                <span>{post.nickname}</span>
              </div>

              <div
                className="
              flex
              gap-3
              text-sm
              text-gray-500
            "
              >
                {/* 좋아요만 클릭 가능 */}

                <button
                  onClick={() => handleLike(post.id)}
                  className="
                  flex
                  items-center
                  gap-1
                "
                >
                  <span
                    className={`
                  material-symbols-outlined
                  text-[16px]

                  ${
                    likedPosts.includes(post.id)
                      ? "text-red-500"
                      : "text-gray-400"
                  }

                `}
                  >
                    favorite
                  </span>

                  {post.likeCount}
                </button>

                {/* 댓글 표시만 */}

                <span
                  className="
                flex
                items-center
                gap-1
              "
                >
                  <span
                    className="
                  material-symbols-outlined
                  text-[16px]
                "
                  >
                    chat_bubble
                  </span>

                  {post.commentCount}
                </span>

                <span>{formatTime(post.createdAt)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 글쓰기 버튼 */}

      <button
        onClick={() => navigate("/create")}
        className="
          fixed
          bottom-4
          right-4
          md:hidden
          w-14
          h-14
          bg-primary
          text-white
          rounded-full
          flex
          items-center
          justify-center
          shadow-lg
        "
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </main>
  );
}

export default Home;
