import { useState } from "react";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("food");
  const [etcCategory, setEtcCategory] = useState("");
  const [loading, setLoading] = useState(false);

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
      {/* Header */}

      <header className="bg-surface-bright sticky top-0 z-50 shadow-sm">
        <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-tablet py-stack-sm max-w-[1024px] mx-auto">
          <div className="flex items-center gap-gutter">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpU5sdBTrbDO2tLTVnZu_PXSbVLNbtxb3ttbamVn0ykl_vK4V1K2_RKpdkCmzx9fgg_KuIhRyhdYzmuRQvsyeSRl-uBFOkqPriRL5XTkNn0KPGHCyom8BMmI_dJkXz2704tOZUrZgPbuhjOoOsN2crKqROPaWb6m8MWL-246mYNen9C5iCI8Do4-ChM17b_oMK1JaTtwQaxQNLeRE-7OoRIMpCeni5GZKFb8zDnaiI9fOC0qmUe0HHEHtEYHi7tUmp1Zo"
              alt="FEESH Logo"
              className="h-8 w-auto"
            />

            <span className="font-headline-xl text-headline-xl font-bold text-primary">
              FEESH
            </span>
          </div>

          <div className="flex items-center gap-stack-md">
            <button className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
              notifications
            </button>

            <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2tozAdh7Q0TiZRuHJ3xXnEFR_ebkI3R2C2i9WQIHnjpr-KeSmqnZst9GNagxIXF3TT1fRPMzp8nWl0DlvVXR-WMv8hYiCfdwcWgYhDU5JOJSdD9uSx0nWfaKCD6tuYU-4AXn55BgpPleVetiNJ_gZ13PbFWfVrz1r3fAdHDzzEobB3HwYiVIFLVqqG0f8gdE8uzrkNNLzsR8goq2LhYDeVvK_leZBWnfFZEV25ENfqMQkpZzBh3an6Q"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </nav>
      </header>

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
                className="w-full px-4 py-3 bg-surface-container-low border-transparent rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all-200 font-body-lg text-body-lg text-on-surface"
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
                    className={`px-4 py-2 rounded-full border font-label-lg text-label-lg transition-all-200
                    ${
                      category === item.id
                        ? "bg-primary text-on-primary border-primary"
                        : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
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
                  className="w-full px-4 py-3 bg-surface-container-low border-transparent rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all-200 font-body-lg text-body-lg text-on-surface"
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
                placeholder="내용을 작성해주세요. 자유로운 의견 교환은 커뮤니티의 힘이 됩니다."
                className="w-full px-4 py-3 bg-surface-container-low border-transparent rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all-200 font-body-lg text-body-lg text-on-surface resize-none"
              />
            </div>

            {/* 사진 첨부 */}

            <label className="flex items-center gap-stack-sm p-4 border-2 border-dashed border-outline-variant rounded-xl cursor-pointer hover:bg-surface-container hover:border-primary transition-colors group">
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary">
                add_a_photo
              </span>

              <span className="font-label-lg text-label-lg text-on-surface-variant group-hover:text-primary">
                사진 첨부 (최대 5장)
              </span>

              <input type="file" accept="image/*" multiple className="hidden" />
            </label>

            {/* 버튼 */}

            <div className="flex flex-col md:flex-row gap-stack-sm pt-stack-md border-t border-surface-variant">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="md:order-1 flex-1 text-on-surface-variant py-3 rounded-lg font-label-lg text-label-lg hover:bg-surface-container-low transition-all active:scale-[0.98]"
              >
                취소
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className={`md:order-3 flex-1 py-3 rounded-lg font-label-lg text-label-lg transition-all active:scale-[0.98]
                ${
                  loading
                    ? "bg-secondary text-white cursor-not-allowed"
                    : "bg-primary text-on-primary hover:bg-primary-container"
                }`}
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">◌</span>
                    등록 중...
                  </>
                ) : (
                  "등록"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreatePost;
