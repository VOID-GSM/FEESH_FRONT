import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import profileImage from "../assets/profile.png";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full h-16 bg-white sticky top-0 z-50 shadow-sm">
      <nav
        className="
          flex
          items-center
          justify-between
          w-full
          h-full
          px-12
          box-border
        "
      >
        {/* 왼쪽 : 로고 */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* 오른쪽 : 버튼 영역 */}
        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          {/* 글쓰기 */}
          <button
            onClick={() => navigate("/create")}
            className="
              flex
              items-center
              gap-2
              bg-blue-700
              text-white
              px-5
              py-2
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
            onClick={() => navigate("/notification")}
            className="
              flex
              items-center
              justify-center
              w-10
              h-10
              text-gray-600
              hover:text-blue-700
              transition
            "
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>

          {/* 프로필 */}
          <button
            onClick={() => navigate("/profile")}
            className="
              flex
              items-center
              justify-center
              w-10
              h-10
            "
          >
            <img
              src={profileImage}
              alt="profile"
              className="
                w-9
                h-9
                rounded-full
                object-cover
              "
            />
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
