import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PhotoUpload from "../components/PhotoUpload";

function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("food");
  const [etcCategory, setEtcCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const categories = [
    { id: "food", label: "음식" },
    { id: "shopping", label: "의류/쇼핑" },
    { id: "daily", label: "생활용품" },
    { id: "culture", label: "문화/여가" },
    { id: "etc", label: "기타" },
  ];

  // 작성 취소
  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "작성 중인 글을 취소하시겠습니까?\n작성한 내용은 삭제됩니다.",
    );

    if (confirmCancel) {
      setTitle("");
      setContent("");
      setCategory("food");
      setEtcCategory("");
      setPhotos([]);

      alert("작성 내용이 삭제되었습니다.");
    }
  };

  // 뒤로가기
  const handleBack = () => {
    navigate("/home");
  };

  // 게시글 등록
  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (category === "etc" && !etcCategory.trim()) {
      alert("카테고리를 입력해주세요.");
      return;
    }

    const categoryName =
      category === "etc"
        ? etcCategory
        : categories.find((item) => item.id === category)?.label;

    const newPost = {
      // 게시글 고유 번호
      id: Date.now(),

      // 카테고리
      category: categoryName,

      // 제목
      title,

      // 금액
      price: "0원",

      // 내용
      description: content,

      // 작성자
      user: "민서",

      // 사용자 구분
      userId: "user1",

      // 내가 작성한 글인지 확인
      isMine: true,

      // 좋아요
      likes: 0,

      // 댓글
      comments: 0,

      // 사진
      photos,

      // 작성 시간
      createdAt: Date.now(),

      // 표시용 시간
      time: "방금 전",
    };

    // 기존 게시글 가져오기
    const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");

    // 새 게시글 추가
    const updatedPosts = [newPost, ...savedPosts];

    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      alert("게시글이 등록되었습니다.");

      navigate("/home");
    }, 1000);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-stack-lg">
      <Header />

      <main className="max-w-[768px] mx-auto px-margin-mobile md:px-margin-tablet mt-stack-lg">
        {/* 제목 + 뒤로가기 */}
        <div className="flex items-center gap-stack-sm mb-stack-md">
          <button
            onClick={handleBack}
            className="material-symbols-outlined text-primary"
          >
            arrow_back
          </button>

          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg">
            소비 게시물 작성
          </h1>
        </div>

        <div className="bg-surface-container-lowest p-stack-lg rounded-xl">
          <div className="space-y-stack-lg">
            {/* 제목 */}
            <div>
              <label className="font-label-lg">제목</label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="게시물 제목을 입력해주세요"
                className="
                w-full
                px-4
                py-3
                mt-2
                bg-surface-container-low
                rounded-lg
                outline-none
                "
              />
            </div>

            {/* 카테고리 */}
            <div>
              <label className="font-label-lg">카테고리</label>

              <div className="flex flex-wrap gap-3 mt-3">
                {categories.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={`
                    px-4
                    py-2
                    rounded-full
                    border

                    ${
                      category === item.id
                        ? "bg-primary text-white border-primary"
                        : "border-gray-300"
                    }

                    `}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 기타 카테고리 */}
            {category === "etc" && (
              <input
                value={etcCategory}
                onChange={(e) => setEtcCategory(e.target.value)}
                placeholder="카테고리를 입력하세요"
                className="
                  w-full
                  px-4
                  py-3
                  bg-surface-container-low
                  rounded-lg
                  "
              />
            )}

            {/* 내용 */}
            <div>
              <label className="font-label-lg">내용</label>

              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 작성해주세요."
                className="
                w-full
                mt-2
                px-4
                py-3
                bg-surface-container-low
                rounded-lg
                resize-none
                "
              />
            </div>

            {/* 사진 업로드 */}
            <PhotoUpload photos={photos} setPhotos={setPhotos} />

            {/* 버튼 */}
            <div className="flex gap-3 pt-5 border-t">
              <button
                onClick={handleCancel}
                className="
                flex-1
                py-3
                rounded-lg
                border
                "
              >
                취소
              </button>

              <button
                disabled={loading}
                onClick={handleSubmit}
                className="
                flex-1
                py-3
                rounded-lg
                bg-primary
                text-white
                "
              >
                {loading ? "등록 중..." : "등록"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreatePost;
