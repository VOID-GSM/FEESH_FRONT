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

  const posts = [
    {
      category: "음식",
      title: "성수동 파스타 맛집 탐방",
      price: "24,500원",
      description:
        "오랜만에 친구랑 성수동에서 점심 먹었어요. 분위기도 좋고 파스타 맛도 일품이었습니다. 가격은 조금 비싸지만 추천해요!",
      user: "민지킴",
      likes: 42,
      comments: 8,
      time: "3시간 전",
    },
    {
      category: "의류/쇼핑",
      title: "무신사 스탠다드 기본 티셔츠",
      price: "15,900원",
      description:
        "여름 맞이 가성비 기본 티셔츠 구매했습니다. 핏이 깔끔하고 세탁 후에도 변형이 거의 없어서 대만족 중입니다.",
      user: "준영디자인",
      likes: 15,
      comments: 3,
      time: "5시간 전",
    },
    {
      category: "기타",
      title: "관리비 자동이체 완료",
      price: "185,000원",
      description:
        "이번 달 관리비가 생각보다 많이 나왔네요. 에어컨 사용량 조절이 필요해 보입니다.",
      user: "세이버",
      likes: 4,
      comments: 1,
      time: "어제",
    },
    {
      category: "문화/여가",
      title: "영화 관람 후기",
      price: "15,000원",
      description:
        "오랜만에 영화관에 방문했어요. 재미있고 힐링되는 시간이었습니다.",
      user: "해피무비",
      likes: 128,
      comments: 24,
      time: "2일 전",
    },
    {
      category: "생활용품",
      title: "생활용품 구매",
      price: "38,000원",
      description: "필요했던 생활용품을 구매했습니다. 만족도가 높아요.",
      user: "올리브러버",
      likes: 56,
      comments: 12,
      time: "3일 전",
    },
    {
      category: "기타",
      title: "자격증 응시료 결제",
      price: "45,000원",
      description: "자기계발을 위한 투자! 이번에는 꼭 합격하고 싶네요.",
      user: "챌린저",
      likes: 210,
      comments: 45,
      time: "1주일 전",
    },
  ];

  return (
    <main className="max-w-[1024px] mx-auto px-margin-tablet py-stack-lg">
      {/* 카테고리 */}
      <section className="mb-stack-lg flex overflow-x-auto pb-2 gap-stack-sm">
        {categories.map((category, index) => (
          <button
            key={category}
            className={`
              px-5 py-2 rounded-full
              font-label-lg whitespace-nowrap
              transition-colors
              ${
                index === 0
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }
            `}
          >
            {category}
          </button>
        ))}
      </section>

      {/* 정렬 */}
      <div className="flex items-center gap-stack-lg border-b border-outline-variant mb-stack-lg">
        <button className="font-label-lg text-primary py-3">최신순</button>

        <button className="font-label-lg text-on-surface-variant py-3 hover:text-primary">
          좋아요순
        </button>
      </div>

      {/* 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-lg">
        {posts.map((post) => (
          <article
            key={post.title}
            className="
              bg-surface-container-lowest
              border border-outline-variant
              rounded-xl
              overflow-hidden
              flex flex-col
            "
          >
            {/* 이미지 */}
            <div
              className="
                relative
                aspect-video
                bg-surface-container-low
                flex
                flex-col
                items-center
                justify-center
                text-outline-variant
              "
            >
              <span className="material-symbols-outlined text-[48px] mb-2">
                image_not_supported
              </span>

              <p className="text-label-sm">이미지 없음</p>

              <div
                className="
                  absolute
                  top-2
                  right-2
                  bg-black/50
                  text-white
                  px-2
                  py-1
                  rounded-md
                  text-xs
                "
              >
                {post.category}
              </div>
            </div>

            {/* 내용 */}
            <div className="p-stack-md flex-grow">
              <h3 className="font-headline-md text-headline-md mb-base line-clamp-1">
                {post.title}
              </h3>

              <p className="text-primary font-bold text-lg mb-stack-sm">
                {post.price}
              </p>

              <p className="text-on-surface-variant line-clamp-2 text-body-md mb-stack-md">
                {post.description}
              </p>
            </div>

            {/* 하단 */}
            <div
              className="
                px-stack-md
                py-stack-sm
                border-t
                border-outline-variant
                flex
                justify-between
                items-center
                bg-surface-container-low
              "
            >
              <div className="flex items-center gap-stack-sm">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img
                    src={profileImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="text-label-sm text-on-surface-variant">
                  by {post.user}
                </span>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  text-on-surface-variant
                  text-label-sm
                "
              >
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-error">
                    favorite
                  </span>
                  {post.likes}
                </span>

                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    chat_bubble
                  </span>
                  {post.comments}
                </span>

                <span className="ml-2 text-outline">{post.time}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 모바일 글쓰기 */}
      <button
        onClick={() => navigate("/create")}
        className="
          fixed
          bottom-4
          right-4
          md:hidden
          bg-primary
          text-on-primary
          w-14
          h-14
          rounded-full
          shadow-lg
          flex
          items-center
          justify-center
        "
      >
        <span className="material-symbols-outlined text-[24px]">add</span>
      </button>
    </main>
  );
}

export default Home;
