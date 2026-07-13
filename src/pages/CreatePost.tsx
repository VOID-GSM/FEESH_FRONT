import { useState } from "react";
import Header from "../components/Header";
import PhotoUpload from "../components/PhotoUpload";

function CreatePost() {
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

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("등록 완료!");
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-stack-lg">
      <Header />

      <main className="max-w-[768px] mx-auto px-margin-mobile md:px-margin-tablet mt-stack-lg">
        <div className="flex items-center gap-stack-sm mb-stack-md">
          <button
            onClick={() => window.history.back()}
            className="material-symbols-outlined text-primary"
          >
            arrow_back
          </button>

          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            소비 게시물 작성
          </h1>
        </div>

        <div className="form-card bg-surface-container-lowest p-stack-lg rounded-xl">
          <div className="space-y-stack-lg">
            {/* 제목 */}
            <div className="space-y-base">
              <label
                htmlFor="title"
                className="font-label-lg text-label-lg text-on-surface-variant"
              >
                제목
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="게시물 제목을 입력해주세요"
                className="w-full px-4 py-3 bg-surface-container-low rounded-lg outline-none"
              />
            </div>

            {/* 카테고리 */}
            <div className="space-y-base">
              <label className="font-label-lg text-label-lg text-on-surface-variant">
                카테고리
              </label>

              <div className="flex flex-wrap gap-stack-sm">
                {categories.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={`px-4 py-2 rounded-full border
                    ${
                      category === item.id
                        ? "bg-primary text-on-primary border-primary"
                        : "border-outline-variant"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 기타 카테고리 */}
            {category === "etc" && (
              <div className="space-y-base">
                <label
                  htmlFor="etc-category"
                  className="font-label-lg text-label-lg text-on-surface-variant"
                >
                  카테고리 직접 입력
                </label>

                <input
                  id="etc-category"
                  type="text"
                  value={etcCategory}
                  onChange={(e) => setEtcCategory(e.target.value)}
                  placeholder="원하는 카테고리를 입력하세요"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-lg outline-none"
                />
              </div>
            )}

            {/* 내용 */}
            <div className="space-y-base">
              <label
                htmlFor="content"
                className="font-label-lg text-label-lg text-on-surface-variant"
              >
                내용
              </label>

              <textarea
                id="content"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 작성해주세요."
                className="w-full px-4 py-3 bg-surface-container-low rounded-lg outline-none resize-none"
              />
            </div>

            {/* 사진 첨부 */}
            <PhotoUpload photos={photos} setPhotos={setPhotos} />

            {/* 버튼 */}
            <div className="flex flex-col md:flex-row gap-stack-sm pt-stack-md border-t border-surface-variant">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 py-3 rounded-lg"
              >
                취소
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className={`flex-1 py-3 rounded-lg ${
                  loading
                    ? "bg-secondary text-white"
                    : "bg-primary text-on-primary"
                }`}
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
