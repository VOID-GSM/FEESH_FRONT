import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/profile.png";
import { getPosts, likePost, unlikePost } from "../api/post";

type Post = {
  id: number;
  category: string;
  title: string;
  price: number;
  description: string;
  nickname: string;
  profileImageUrl: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
};

function Home() {
  const navigate = useNavigate();

  const categories = [
    "전체",
    "음식",
    "의류/쇼핑",
    "생활용품",
    "문화/여가",
    "기타",
  ];

  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // 게시글 조회
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();

        setPosts(response.data.posts);
      } catch (error) {
        console.error("게시글 조회 실패", error);
      }
    };

    fetchPosts();
  }, []);

  // 좋아요
  const handleLike = async (id: number) => {
    const isLiked = likedPosts.includes(id);

    try {
      if (isLiked) {
        await unlikePost(id);

        setLikedPosts((prev) => prev.filter((postId) => postId !== id));

        setPosts((prev) =>
          prev.map((post) =>
            post.id === id
              ? {
                  ...post,
                  likeCount: post.likeCount - 1,
                }
              : post,
          ),
        );
      } else {
        await likePost(id);

        setLikedPosts((prev) => [...prev, id]);

        setPosts((prev) =>
          prev.map((post) =>
            post.id === id
              ? {
                  ...post,
                  likeCount: post.likeCount + 1,
                }
              : post,
          ),
        );
      }
    } catch (error) {
      console.error("좋아요 처리 실패", error);
    }
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
        <button className="text-primary py-3">최신순</button>

        <button className="text-gray-500 py-3">좋아요순</button>
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
              <span className="material-symbols-outlined text-5xl">
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
                {post.price.toLocaleString()}원
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

              <div className="flex gap-3 text-sm text-gray-500">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1"
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

                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    chat_bubble
                  </span>

                  {post.commentCount}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 글쓰기 */}

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
