import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/profile.png";

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

  const defaultPosts = [
    {
      id: 1,
      category: "음식",
      title: "성수동 파스타 맛집 탐방",
      price: "24,500원",
      description:
        "오랜만에 친구랑 성수동에서 점심 먹었어요. 분위기도 좋고 파스타 맛도 일품이었습니다.",
      user: "민지킴",
      likes: 42,
      comments: 8,
      time: "3시간 전",
    },
    {
      id: 2,
      category: "의류/쇼핑",
      title: "무신사 스탠다드 기본 티셔츠",
      price: "15,900원",
      description: "여름 맞이 가성비 기본 티셔츠 구매했습니다.",
      user: "준영디자인",
      likes: 15,
      comments: 3,
      time: "5시간 전",
    },
    {
      id: 3,
      category: "생활용품",
      title: "생활용품 구매",
      price: "38,000원",
      description: "필요했던 생활용품을 구매했습니다.",
      user: "올리브러버",
      likes: 56,
      comments: 12,
      time: "어제",
    },
    {
      id: 4,
      category: "문화/여가",
      title: "영화 관람 후기",
      price: "15,000원",
      description: "오랜만에 영화관에 방문했어요.",
      user: "해피무비",
      likes: 128,
      comments: 24,
      time: "2일 전",
    },
    {
      id: 5,
      category: "기타",
      title: "관리비 자동이체 완료",
      price: "185,000원",
      description: "이번 달 관리비가 생각보다 많이 나왔네요.",
      user: "세이버",
      likes: 4,
      comments: 1,
      time: "3일 전",
    },
    {
      id: 6,
      category: "기타",
      title: "자격증 응시료 결제",
      price: "45,000원",
      description: "자기계발을 위한 투자!",
      user: "챌린저",
      likes: 210,
      comments: 45,
      time: "1주일 전",
    },
  ];

  const [posts, setPosts] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // 저장된 게시글 불러오기
  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");
    const savedLikes = localStorage.getItem("likedPosts");

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(defaultPosts);
      localStorage.setItem("posts", JSON.stringify(defaultPosts));
    }

    if (savedLikes) {
      setLikedPosts(JSON.parse(savedLikes));
    }
  }, []);

  // 좋아요
  const handleLike = (id: number) => {
    let updatedPosts;

    if (likedPosts.includes(id)) {
      updatedPosts = posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes - 1 } : post,
      );

      const updatedLikes = likedPosts.filter((postId) => postId !== id);

      setLikedPosts(updatedLikes);

      localStorage.setItem("likedPosts", JSON.stringify(updatedLikes));
    } else {
      updatedPosts = posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post,
      );

      const updatedLikes = [...likedPosts, id];

      setLikedPosts(updatedLikes);

      localStorage.setItem("likedPosts", JSON.stringify(updatedLikes));
    }

    setPosts(updatedPosts);

    localStorage.setItem("posts", JSON.stringify(updatedPosts));
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

              <p
                className="
              text-primary
              font-bold
              mt-2
            "
              >
                {post.price}
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
                  src={profileImage}
                  className="w-6 h-6 rounded-full"
                  alt="profile"
                />

                <span>{post.user}</span>
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

                  {post.likes}
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

                  {post.comments}
                </span>

                <span>{post.time}</span>
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
