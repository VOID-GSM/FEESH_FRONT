import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { createPost } from "../api/post";

function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("FOOD");
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "FOOD", label: "음식" },
    { id: "SHOPPING", label: "의류/쇼핑" },
    { id: "LIFE", label: "생활용품" },
    { id: "CULTURE", label: "문화/여가" },
    { id: "ETC", label: "기타" },
  ];

  // 작성 취소
  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "작성 중인 글을 취소하시겠습니까?\n작성한 내용은 삭제됩니다.",
    );

    if (confirmCancel) {
      setTitle("");
      setContent("");
      setCategory("FOOD");
      setPrice(0);

      alert("작성 내용이 삭제되었습니다.");
    }
  };

  // 뒤로가기
  const handleBack = () => {
    navigate("/home");
  };

  // 게시글 작성
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (price <= 0) {
      alert("금액을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      await createPost({
        title,
        content,
        category,
        price,
      });

      alert("게시글이 등록되었습니다.");

      navigate("/home");
    } catch (error) {
      console.error("게시글 등록 실패:", error);

      alert("게시글 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-stack-lg">
      <Header />

      <main
        className="
        max-w-[768px]
        mx-auto
        px-margin-mobile
        md:px-margin-tablet
        mt-stack-lg
        "
      >
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

            {/* 금액 */}

            <div>
              <label className="font-label-lg">금액</label>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="금액을 입력해주세요"
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
                disabled:opacity-50
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
