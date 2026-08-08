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
  profileImageUrl?: string | null;
  likeCount: number | null;
  commentCount?: number | null;
  liked: boolean;
  viewCount: number | null;
  createdAt?: string | null;
}

// 백엔드에서 오는 카테고리 → 화면에 보여줄 이름
const CATEGORY_LABELS: Record<string, string> = {
  FOOD: "음식",
  FASHION_SHOPPING: "패션/쇼핑",
  DAILY_NECESSITY: "생활용품",
  CULTURE_LEISURE: "문화/여가",
  ETC: "기타",
};

// 화면에서 선택한 카테고리 → 백엔드에 보낼 값
const CATEGORY_VALUES: Record<string, string | null> = {
  전체: null,
  음식: "FOOD",
  "패션/쇼핑": "FASHION_SHOPPING",
  생활용품: "DAILY_NECESSITY",
  "문화/여가": "CULTURE_LEISURE",
  기타: "ETC",
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

  // 게시글
  const [posts, setPosts] = useState<Post[]>([]);

  // 로딩
  const [loading, setLoading] = useState(true);

  // 선택한 카테고리
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // 최신순 / 인기순
  const [sort, setSort] = useState<"latest" | "popular">("latest");

  // 정렬 메뉴 열림 여부
  const [isSortOpen, setIsSortOpen] = useState(false);

  // 현재 페이지
  const [page, setPage] = useState(0);

  // 전체 페이지 수
  // 카테고리를 선택하면 해당 카테고리 기준의 totalPages가 들어옴
  const [totalPages, setTotalPages] = useState(0);

  // 더 보기 로딩
  const [loadingMore, setLoadingMore] = useState(false);

  // 게시글 조회
  const fetchPosts = async (pageNumber = 0, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      // 현재 선택된 카테고리의 백엔드 값
      const category = CATEGORY_VALUES[selectedCategory];

      console.log("게시글 조회");
      console.log("정렬:", sort);
      console.log("페이지:", pageNumber);
      console.log("카테고리:", selectedCategory);
      console.log("백엔드에 보낼 category:", category);

      const response = await getPosts(sort, pageNumber, 10, category);

      console.log("게시글 목록 응답:", response.data);

      // 더 보기
      if (append) {
        setPosts((prev) => [...prev, ...response.data.posts]);
      } else {
        // 처음 조회하거나
        // 카테고리/정렬을 변경했을 때
        setPosts(response.data.posts);
      }

      setPage(pageNumber);

      // 백엔드에서 현재 카테고리 기준으로 보내주는 totalPages
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("게시글 조회 실패:", error);

      if (!append) {
        setPosts([]);
        setTotalPages(0);
      }
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  // 정렬 또는 카테고리가 바뀌면
  // 무조건 첫 페이지부터 다시 조회
  useEffect(() => {
    setPage(0);
    fetchPosts(0, false);
  }, [sort, selectedCategory]);

  // 카테고리 선택
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  // 좋아요
  const handleLike = async (
    e: React.MouseEvent<HTMLButtonElement>,
    post: Post,
  ) => {
    e.stopPropagation();

    try {
      if (post.liked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }

      // 현재 카테고리 + 현재 정렬 기준으로
      // 첫 페이지를 다시 가져옴
      await fetchPosts(0, false);
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
  };

  // 정렬 선택
  const handleSortSelect = (value: "latest" | "popular") => {
    setSort(value);
    setIsSortOpen(false);
  };

  // 더 보기
  const handleLoadMore = async () => {
    if (loadingMore) {
      return;
    }

    if (page + 1 >= totalPages) {
      return;
    }

    await fetchPosts(page + 1, true);
  };

  // 더 불러올 게시글이 있는지
  const hasMorePosts = page + 1 < totalPages;

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Header />

      <main
        className="
          w-full
          max-w-5xl
          mx-auto
          px-4
          sm:px-6
          py-8
          sm:py-10
        "
      >
        {/* 페이지 제목 */}
        <section className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">FEESH</h1>

          <p className="mt-2 text-sm sm:text-base text-gray-500">
            나의 소비를 공유하고 기록해보세요.
          </p>
        </section>

        {/* 카테고리 + 정렬 */}
        <div
          className="
            flex
            items-center
            gap-3
            mb-8
            w-full
          "
        >
          {/* 카테고리 */}
          <div
            className="
              flex-1
              min-w-0
              flex
              gap-2
              overflow-x-auto
              pb-2
              scrollbar-hide
            "
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategorySelect(category)}
                className={`
                  shrink-0
                  px-4
                  sm:px-5
                  py-2
                  rounded-full
                  whitespace-nowrap
                  text-sm
                  sm:text-base
                  transition

                  ${
                    selectedCategory === category
                      ? "bg-blue-200 text-[#294C77] hover:bg-blue-300"
                      : "bg-blue-50 text-[#294C77] hover:bg-blue-100"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 최신순 / 인기순 */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="
                flex
                items-center
                gap-1
                bg-blue-50
                px-3
                sm:px-4
                py-2
                rounded-xl
                shadow-sm
                text-sm
                sm:text-base
                text-[#294C77]
                whitespace-nowrap
                hover:bg-blue-100
                transition
              "
            >
              <span>{sort === "latest" ? "최신순" : "인기순"}</span>

              <span className="material-symbols-outlined text-[20px]">
                {isSortOpen ? "arrow_drop_up" : "arrow_drop_down"}
              </span>
            </button>

            {/* 정렬 메뉴 */}
            {isSortOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-2
                  w-28
                  bg-white
                  rounded-xl
                  shadow-md
                  border
                  border-blue-100
                  overflow-hidden
                  z-20
                "
              >
                <button
                  type="button"
                  onClick={() => handleSortSelect("latest")}
                  className={`
                    w-full
                    px-4
                    py-2.5
                    text-left
                    text-sm
                    transition

                    ${
                      sort === "latest"
                        ? "bg-blue-100 text-[#294C77] font-medium"
                        : "text-[#294C77] hover:bg-blue-50"
                    }
                  `}
                >
                  최신순
                </button>

                <button
                  type="button"
                  onClick={() => handleSortSelect("popular")}
                  className={`
                    w-full
                    px-4
                    py-2.5
                    text-left
                    text-sm
                    transition

                    ${
                      sort === "popular"
                        ? "bg-blue-100 text-[#294C77] font-medium"
                        : "text-[#294C77] hover:bg-blue-50"
                    }
                  `}
                >
                  인기순
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 로딩 */}
        {loading ? (
          <div className="py-10 text-center text-gray-500">
            게시글을 불러오는 중...
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500">
            {selectedCategory === "전체"
              ? "게시글이 없습니다."
              : `${selectedCategory} 카테고리의 게시글이 없습니다.`}
          </div>
        ) : (
          <>
            {/* 게시글 목록 */}
            <div className="flex flex-col gap-4 sm:gap-5">
              {posts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="
                    w-full
                    bg-white
                    rounded-xl
                    shadow-sm
                    p-4
                    sm:p-6
                    cursor-pointer
                    hover:shadow-md
                    transition
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* 게시글 내용 */}
                    <div className="min-w-0 flex-1">
                      {/* 제목 + 카테고리 */}
                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-x-3
                          gap-y-1
                        "
                      >
                        <h2
                          className="
                            min-w-0
                            max-w-full
                            text-lg
                            sm:text-xl
                            font-bold
                            break-words
                          "
                        >
                          {post.title}
                        </h2>

                        <span className="shrink-0 text-sm text-[#294C77]">
                          {CATEGORY_LABELS[post.category ?? ""] ?? "기타"}
                        </span>
                      </div>

                      {/* 내용 */}
                      <p
                        className="
                          mt-3
                          text-sm
                          sm:text-base
                          text-gray-600
                          line-clamp-2
                          break-words
                        "
                      >
                        {post.content}
                      </p>

                      {/* 작성자 / 좋아요 / 댓글 / 조회수 */}
                      <div
                        className="
                          mt-5
                          flex
                          flex-wrap
                          items-center
                          gap-x-4
                          gap-y-2
                          text-sm
                          text-gray-500
                        "
                      >
                        <span className="max-w-[120px] truncate">
                          {post.authorNickname ?? "알 수 없음"}
                        </span>

                        {/* 좋아요 */}
                        <button
                          type="button"
                          onClick={(e) => handleLike(e, post)}
                          className="
                            flex
                            items-center
                            gap-1.5
                            shrink-0
                            hover:opacity-70
                          "
                        >
                          <svg
                            className="w-5 h-5"
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

                          <span>{Math.max(post.likeCount ?? 0, 0)}</span>
                        </button>

                        {/* 댓글 */}
                        <span className="shrink-0">
                          댓글 {Math.max(post.commentCount ?? 0, 0)}
                        </span>

                        {/* 조회수 */}
                        <span className="shrink-0">
                          조회수 {Math.max(post.viewCount ?? 0, 0)}
                        </span>
                      </div>
                    </div>

                    {/* 가격 */}
                    <div className="shrink-0 text-right">
                      <p
                        className="
                          text-lg
                          sm:text-xl
                          font-bold
                          text-blue-700
                          whitespace-nowrap
                        "
                      >
                        {post.price !== null && post.price !== undefined
                          ? `${post.price.toLocaleString()}원`
                          : "가격 미정"}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* 더 보기 */}
            {hasMorePosts && (
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="
                    px-8
                    py-3
                    rounded-xl
                    bg-blue-50
                    text-[#294C77]
                    font-medium
                    hover:bg-blue-100
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {loadingMore ? "불러오는 중..." : "더 보기"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Home;
