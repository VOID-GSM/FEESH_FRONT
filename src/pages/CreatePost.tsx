import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import { createPost } from "../api/post";

const categories = [
  { value: "FOOD", label: "음식" },
  { value: "FASHION_SHOPPING", label: "패션/쇼핑" },
  { value: "DAILY_NECESSITY", label: "생활용품" },
  { value: "CULTURE_LEISURE", label: "문화/여가" },
  { value: "ETC", label: "기타" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("이미지는 10MB 이하만 업로드할 수 있습니다.");
      event.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!trimmedContent) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (!category) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    if (price === "") {
      alert("가격을 입력해주세요.");
      return;
    }

    const priceNumber = Number(price);

    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      alert("가격은 0원 이상이어야 합니다.");
      return;
    }

    try {
      setLoading(true);

      const postData = {
        title: trimmedTitle,
        content: trimmedContent,
        category,
        price: priceNumber,
      };

      await createPost(postData, image);

      alert("게시글이 작성되었습니다.");
      navigate("/home");
    } catch (error) {
      console.error("게시글 작성 실패:", error);
      alert("게시글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) {
      return;
    }

    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#121c2a]">
      <Header />

      <main className="mx-auto w-full max-w-4xl px-5 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#294C77]">게시글 작성</h1>

          <p className="mt-2 text-sm text-gray-500">
            나누고 싶은 물건이나 정보를 자유롭게 작성해주세요.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-7">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-[#294C77]"
              >
                제목
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="게시글 제목을 입력해주세요."
                maxLength={100}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#294C77] focus:ring-2 focus:ring-[#294C77]/10"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-[#294C77]"
              >
                카테고리
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#294C77] focus:ring-2 focus:ring-[#294C77]/10"
              >
                <option value="">카테고리를 선택해주세요.</option>

                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-semibold text-[#294C77]"
              >
                가격
              </label>

              <div className="relative">
                <input
                  id="price"
                  type="number"
                  min="0"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="가격을 입력해주세요."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#294C77] focus:ring-2 focus:ring-[#294C77]/10"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  원
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-semibold text-[#294C77]"
              >
                내용
              </label>

              <textarea
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="게시글 내용을 입력해주세요."
                maxLength={5000}
                rows={10}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#294C77] focus:ring-2 focus:ring-[#294C77]/10"
              />

              <div className="mt-2 text-right text-xs text-gray-400">
                {content.length} / 5000
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-[#294C77]">사진</p>

              {!imagePreview ? (
                <label
                  htmlFor="post-image"
                  className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-[#294C77]/40 hover:bg-[#f8f9ff]"
                >
                  <span className="material-symbols-outlined text-3xl text-gray-400">
                    add_photo_alternate
                  </span>

                  <span className="mt-2 text-sm font-medium text-gray-500">
                    사진을 첨부해주세요
                  </span>

                  <span className="mt-1 text-xs text-gray-400">최대 10MB</span>

                  <input
                    id="post-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="게시글 첨부 이미지 미리보기"
                    className="max-h-[500px] w-full object-contain"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/75"
                    aria-label="사진 삭제"
                  >
                    <span className="material-symbols-outlined text-xl">
                      close
                    </span>
                  </button>
                </div>
              )}

              {image && (
                <p className="mt-2 text-xs text-gray-400">{image.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                취소
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#294C77] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#203c60] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "작성 중..." : "게시글 작성"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreatePost;
