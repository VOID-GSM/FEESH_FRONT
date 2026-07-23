import Logo from "./Logo";
import profileImage from "../assets/profile.png";

function Header() {
  return (
    <header className="w-full h-16 bg-white sticky top-0 z-50 shadow-sm">
      <nav className="flex items-center justify-between w-full px-12 h-full">
        {/* 왼쪽 : 로고 */}
        <div className="flex items-center gap-2 min-w-fit mx-4">
          <Logo size="sm" />

          <span className="text-2xl font-bold text-blue-700">FEESH</span>
        </div>

        {/* 가운데 : 검색창 */}
        <div className="hidden md:flex w-[420px] px-4 py-2 bg-gray-100 rounded-full items-center gap-3 mx-8">
          <span className="material-symbols-outlined text-gray-400">
            search
          </span>

          <input
            type="text"
            placeholder="소비 기록 검색..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        {/* 오른쪽 : 버튼 */}
        <div className="flex items-center gap-4 min-w-fit mx-4">
          {/* 글쓰기 */}
          <button
            className="
              flex items-center gap-2
              bg-blue-700
              text-white
              px-5 py-2
              rounded-full
              hover:bg-blue-800
              transition
            "
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            글쓰기
          </button>

          {/* 알림 */}
          <button
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-full
              text-blue-700
              hover:bg-gray-100
              hover:-translate-y-1
              transition
            "
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>

          {/* 프로필 */}
          <div
            className="
              w-10 h-10
              rounded-full
              border-2 border-blue-700
              overflow-hidden
            "
          >
            <img
              src={profileImage}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
