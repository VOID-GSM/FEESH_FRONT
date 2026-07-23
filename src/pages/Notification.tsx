import { useState } from "react";

const Notification = () => {
  const [activeTab, setActiveTab] = useState("전체");
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">알림</h1>

      {/* 탭 */}
      <div className="flex gap-5 border-b pb-3 mb-6">
        {["전체", "댓글", "좋아요"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
        pb-2 transition-all duration-200
        hover:text-blue-600 hover:-translate-y-1
        ${
          activeTab === tab
            ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
            : "text-gray-500"
        }
      `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 오늘 */}
      <h2 className="mb-3 ml-2 text-sm font-semibold text-gray-500">오늘</h2>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex cursor-pointer gap-4 p-6 transition hover:bg-slate-50">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
            💬
          </div>

          <div className="flex-1">
            <p className="text-[15px] leading-7 text-slate-800">
              <span className="font-bold">김민수</span>님이 내 게시물에 댓글을
              남겼습니다.
            </p>

            <p className="mt-2 text-sm text-gray-500">오늘 오후 2:30</p>
          </div>
        </div>
      </div>

      {/* 어제 */}
      <h2 className="mt-8 mb-3 ml-2 text-sm font-semibold text-gray-500">
        어제
      </h2>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex cursor-pointer gap-4 p-6 transition hover:bg-slate-50">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
            💬
          </div>

          <div className="flex-1">
            <p className="text-[15px] leading-7 text-slate-800">
              <span className="font-bold">박지민</span>님이 내 게시물
              <span className="italic"> "가계부 어플 추천 Top 3"</span>에 댓글을
              남겼습니다.
            </p>

            <p className="mt-2 text-sm text-gray-500">어제 오후 4:20</p>
          </div>
        </div>
      </div>

      {/* 지난 7일 */}
      <h2 className="mt-8 mb-3 ml-2 text-sm font-semibold text-gray-500">
        지난 7일
      </h2>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex cursor-pointer gap-4 border-b p-6 transition hover:bg-slate-50">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-2xl">
            ❤️
          </div>

          <div className="flex-1">
            <p className="text-[15px] leading-7 text-slate-800">
              <span className="font-bold">MoneyKing</span>님이 내 게시물을
              좋아합니다.
            </p>

            <p className="mt-2 text-sm text-gray-500">3일 전</p>
          </div>
        </div>

        <div className="flex cursor-pointer gap-4 border-b p-6 transition hover:bg-slate-50">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-2xl">
            ❤️
          </div>

          <div className="flex-1">
            <p className="text-[15px] leading-7 text-slate-800">
              <span className="font-bold">알뜰살뜰</span>님이 내 게시물을
              좋아합니다.
            </p>

            <p className="mt-2 text-sm text-gray-500">5일 전</p>
          </div>
        </div>

        <div className="flex cursor-pointer gap-4 p-6 transition hover:bg-slate-50">
          <div className="flex h-14 w-14">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
              💬
            </div>
          </div>

          <div className="flex-1">
            <p className="text-[15px] leading-7 text-slate-800">
              <span className="font-bold">소비요정</span>님이 내 게시물에 댓글을
              남겼습니다.
            </p>

            <p className="mt-2 text-sm text-gray-500">6일 전</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Notification;
