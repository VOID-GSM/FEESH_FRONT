import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Header from "../components/Header";
import { searchPosts } from "../api/post";

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
  viewCount: number | null;
  createdAt?: string | null;
  liked: boolean;
}

// 백엔드 카테고리 → 화면에 보여줄 이름
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

function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") ?? "";

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 선택한 카테고리
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // 현재 페이지
  const [page, setPage] = useState(0);

  // 전체 페이지 수
  const [totalPages, setTotalPages] = useState(0);

  // 더 보기 로딩
  const [loadingMore, setLoadingMore] = useState(false);

  // 검색
  const fetchSearchResults = async (
    pageNumber = 0,
    append = false,
    category = selectedCategory,
  ) => {
    if (!keyword.trim()) {
      setPosts([]);
      setLoading(false);
      return;
    }

    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      // 현재 선택한 카테고리의 백엔드 값
      const categoryValue = CATEGORY_VALUES[category];

      console.log("게시글 검색");
      console.log("검색어:", keyword);
      console.log("카테고리:", category);
      console.log("백엔드 category:", categoryValue);
      console.log("페이지:", pageNumber);

      const response = await searchPosts(
        keyword,
        pageNumber,
        10,
        categoryValue,
      );

      console.log("검색 결과:", response.data);

      if (append) {
        setPosts((prev) => [...prev, ...response.data.posts]);
      } else {
        setPosts(response.data.posts);
      }

      setPage(pageNumber);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("검색 실패:", error);

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

  // 검색어가 변경되면 다시 검색
  useEffect(() => {
    fetchSearchResults(0, false);
  }, [keyword]);

  // 카테고리 선택
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);

    // 선택한 카테고리로 첫 페이지부터 다시 검색
    fetchSearchResults(0, false, category);
  };

  // 더 보기
  const handleLoadMore = async () => {
    if (loadingMore) {
      return;
    }

    if (page + 1 >= totalPages) {
      return;
    }

    await fetchSearchResults(page + 1, true);
  };

  const hasMorePosts = page + 1 < totalPages;

  return (
    <div className="min-h-screen">
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
        {/* 검색 결과 제목 */}
        <section className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">검색 결과</h1>

          <p className="mt-2 text-sm sm:text-base text-gray-500">
            '{keyword}'에 대한 검색 결과입니다.
          </p>
        </section>

        {/* 카테고리 */}
        <div
          className="
            flex
            gap-2
            overflow-x-auto
            pb-2
            mb-8
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

        {/* 로딩 */}
        {loading ? (
          <div className="py-10 text-center text-gray-500">
            검색 결과를 불러오는 중...
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500">
            <p className="text-base">
              '{keyword}'에 대한 검색 결과가 없습니다.
            </p>

            <p className="mt-2 text-sm text-gray-400">
              다른 검색어로 다시 검색해보세요.
            </p>
          </div>
        ) : (
          <>
            {/* 검색 결과 개수 */}
            <div className="mb-4 text-sm text-gray-500">
              검색 결과 {posts.length}개
            </div>

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

                        <span className="shrink-0">
                          좋아요 {Math.max(post.likeCount ?? 0, 0)}
                        </span>

                        <span className="shrink-0">
                          댓글 {Math.max(post.commentCount ?? 0, 0)}
                        </span>

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

export default Search;
