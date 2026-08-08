import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import { createPost } from "../api/post";

function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [price, setPrice] = useState("");

  const [category, setCategory] = useState("FOOD");
  const [etcCategory, setEtcCategory] = useState("");

  const [loading, setLoading] = useState(false);

  const categories = [
    {
      id: "FOOD",
      label: "음식",
    },
    {
      id: "FASHION_SHOPPING",
      label: "패션/쇼핑",
    },
    {
      id: "DAILY_NECESSITY",
      label: "생활용품",
    },
    {
      id: "CULTURE_LEISURE",
      label: "문화/여가",
    },
    {
      id: "ETC",
      label: "기타",
    },
  ];

  const changePrice = (amount: number) => {
    const current = Number(price) || 0;

    const next = current + amount;

    setPrice(String(Math.max(0, next)));
  };

  const handleCancel = () => {
    const confirmed = window.confirm("작성 중인 게시글을 취소하시겠습니까?");

    if (!confirmed) return;

    setTitle("");
    setContent("");
    setPrice("");
    setCategory("FOOD");
    setEtcCategory("");
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (category === "ETC" && !etcCategory.trim()) {
      alert("기타 카테고리를 입력해주세요.");
      return;
    }

    const requestData = {
      title: title.trim(),
      content: content.trim(),
      category,
      price: Number(price) || 0,
    };

    try {
      setLoading(true);

      const response = await createPost(requestData);

      console.log("게시글 등록 성공", response.data);

      alert("게시글이 등록되었습니다.");

      navigate("/home");
    } catch (error: unknown) {
      console.error("게시글 등록 실패", error);

      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message ?? "게시글 등록에 실패했습니다.");
      } else {
        alert("게시글 등록에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-10">
      <Header />

      <main
        className="
          max-w-[768px]
          mx-auto
          px-6
          mt-10
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            mb-8
          "
        >
          <button
            onClick={() => navigate("/home")}
            className="material-symbols-outlined text-[#294C77]"
          >
            arrow_back
          </button>

          <h1 className="text-2xl font-bold">소비 게시물 작성</h1>
        </div>

        <div
          className="
            bg-white
            rounded-xl
            p-8
            space-y-8
          "
        >
          {/* 제목 */}
          <div>
            <label className="font-semibold">제목</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시물 제목을 입력해주세요"
              className="
                w-full
                mt-2
                px-4
                py-3
                rounded-lg
                bg-gray-100
                outline-none
              "
            />
          </div>

          {/* 가격 */}
          <div>
            <label className="font-semibold">가격</label>

            <div
              className="
                flex
                items-center
                gap-4
                mt-2
              "
            >
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="가격 입력"
                className="
                  flex-1
                  h-14
                  px-5
                  rounded-lg
                  border
                  text-lg
                  appearance-none
                "
              />

              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  w-52
                "
              >
                <button
                  type="button"
                  onClick={() => changePrice(500)}
                  className="
                    h-7
                    rounded-lg
                    bg-blue-100
                    text-[#294C77]
                    hover:bg-blue-200
                    transition
                  "
                >
                  +500
                </button>

                <button
                  type="button"
                  onClick={() => changePrice(1000)}
                  className="
                    h-7
                    rounded-lg
                    bg-blue-100
                    text-[#294C77]
                    hover:bg-blue-200
                    transition
                  "
                >
                  +1000
                </button>

                <button
                  type="button"
                  onClick={() => changePrice(-500)}
                  className="
                    h-7
                    rounded-lg
                    bg-blue-50
                    text-[#294C77]
                    hover:bg-blue-100
                    transition
                  "
                >
                  -500
                </button>

                <button
                  type="button"
                  onClick={() => changePrice(-1000)}
                  className="
                    h-7
                    rounded-lg
                    bg-blue-50
                    text-[#294C77]
                    hover:bg-blue-100
                    transition
                  "
                >
                  -1000
                </button>
              </div>
            </div>
          </div>

          {/* 카테고리 */}
          <div>
            <label className="font-semibold">카테고리</label>

            <div
              className="
                flex
                flex-wrap
                gap-3
                mt-3
              "
            >
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
                    transition

                    ${
                      category === item.id
                        ? "bg-blue-200 text-[#294C77] border-blue-200 hover:bg-blue-300"
                        : "bg-blue-50 text-[#294C77] border-blue-100 hover:bg-blue-100"
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 기타 카테고리 */}
          {category === "ETC" && (
            <input
              value={etcCategory}
              onChange={(e) => setEtcCategory(e.target.value)}
              placeholder="기타 카테고리 입력"
              className="
                w-full
                px-4
                py-3
                rounded-lg
                bg-gray-100
              "
            />
          )}

          {/* 내용 */}
          <div>
            <label className="font-semibold">내용</label>

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
                rounded-lg
                bg-gray-100
                resize-none
              "
            />
          </div>

          {/* 버튼 */}
          <div
            className="
              flex
              gap-3
              pt-5
              border-t
            "
          >
            <button
              type="button"
              onClick={handleCancel}
              className="
                flex-1
                py-3
                rounded-lg
                bg-blue-50
                text-[#294C77]
                hover:bg-blue-100
                transition
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
                bg-blue-100
                text-[#294C77]
                font-semibold
                hover:bg-blue-200
                disabled:opacity-50
                transition
              "
            >
              {loading ? "등록 중..." : "등록"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreatePost;
