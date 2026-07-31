import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

import { getPosts, likePost, unlikePost } from "../api/post";

interface Post {
  id: number;

  title: string;

  content: string | null;

  category: string | null;

  price: number | null;

  authorNickname: string | null;

  likeCount: number | null;

  liked: boolean;

  viewCount: number | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: "음식",
  FASHION_SHOPPING: "패션/쇼핑",
  DAILY_NECESSITY: "생활용품",
  CULTURE_LEISURE: "문화/여가",
  ETC: "기타",
};

const categories = [
  "전체",
  "음식",
  "패션/쇼핑",
  "생활용품",
  "문화/여가",
  "기타",
];

function Home() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("전체");

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const response = await getPosts();

      console.log("게시글 목록:", response.data);

      setPosts(response.data.posts);
    } catch (error) {
      console.error("게시글 조회 실패", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, []);

  const handleLike = async (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();

    try {
      if (post.liked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }

      // 좋아요 변경 후 서버 기준으로 다시 불러오기
      await fetchPosts();
    } catch (error) {
      console.error("좋아요 처리 실패", error);
    }
  };

  const filteredPosts =
    selectedCategory === "전체"
      ? posts
      : posts.filter(
          (post) => CATEGORY_LABELS[post.category ?? ""] === selectedCategory,
        );

  return (
    <div
      className="
      min-h-screen
      bg-[#f8f9ff]
      "
    >
      <Header />

      <main
        className="
        max-w-5xl
        mx-auto
        px-6
        py-10
        "
      >
        <section
          className="
          mb-8
          "
        >
          <h1
            className="
            text-3xl
            font-bold
            "
          >
            FEESH
          </h1>

          <p
            className="
            mt-2
            text-gray-500
            "
          >
            나의 소비를 공유하고 기록해보세요.
          </p>
        </section>

        <div
          className="
          flex
          gap-3
          mb-8
          overflow-x-auto
          "
        >
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
                    ? "bg-blue-700 text-white"
                    : "bg-white text-gray-600"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div>게시글을 불러오는 중...</div>
        ) : (
          <div
            className="
            flex
            flex-col
            gap-5
            "
          >
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                className="
                bg-white
                rounded-xl
                shadow-sm
                p-6
                flex
                justify-between
                items-center
                cursor-pointer
                hover:shadow-md
                transition
                "
              >
                <div
                  className="
                  flex-1
                  "
                >
                  <div
                    className="
                    flex
                    items-center
                    gap-3
                    "
                  >
                    <h2
                      className="
                      text-xl
                      font-bold
                      "
                    >
                      {post.title}
                    </h2>

                    <span
                      className="
                      text-sm
                      text-blue-600
                      "
                    >
                      {CATEGORY_LABELS[post.category ?? ""] ?? "기타"}
                    </span>
                  </div>

                  <p
                    className="
                    mt-3
                    text-gray-600
                    line-clamp-2
                    "
                  >
                    {post.content}
                  </p>

                  <div
                    className="
                    mt-5
                    flex
                    items-center
                    gap-5
                    text-sm
                    text-gray-500
                    "
                  >
                    <span>{post.authorNickname ?? "알 수 없음"}</span>

                    <button
                      onClick={(e) => handleLike(e, post)}
                      className="
                      flex
                      items-center
                      gap-2
                      "
                    >
                      <svg
                        className="
                        w-5
                        h-5
                        "
                        viewBox="0 0 24 24"
                        fill={post.liked ? "#ef4444" : "none"}
                        stroke={post.liked ? "#ef4444" : "#9ca3af"}
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="
                          M21 8.25
                          c0-2.485-2.099-4.5-4.688-4.5
                          -1.935 0-3.597 1.126-4.312 2.733
                          C11.285 4.876 9.623 3.75 7.688 3.75
                          5.099 3.75 3 5.765 3 8.25
                          c0 7.22 9 11.25 9 11.25
                          s9-4.03 9-11.25
                          Z
                          "
                        />
                      </svg>

                      {post.likeCount ?? 0}
                    </button>

                    <span>조회수 {post.viewCount ?? 0}</span>
                  </div>
                </div>

                <div
                  className="
                  ml-8
                  text-right
                  "
                >
                  <p
                    className="
                    text-xl
                    font-bold
                    text-blue-700
                    "
                  >
                    {post.price
                      ? `${post.price.toLocaleString()}원`
                      : "가격 미정"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
