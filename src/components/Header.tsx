import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Logo from "./Logo";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const keywordFromUrl = searchParams.get("keyword") ?? "";

  const [searchKeyword, setSearchKeyword] = useState(keywordFromUrl);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get("keyword") ?? "";

    setSearchKeyword(keyword);
  }, [location.search]);
  const email = localStorage.getItem("email");

  const profileImageKey = email ? `profileImage_${email}` : "profileImage";

  const [profileImage, setProfileImage] = useState<string | null>(() => {
    return localStorage.getItem(profileImageKey);
  });

  const loadProfileImage = () => {
    const currentEmail = localStorage.getItem("email");

    const image = currentEmail
      ? localStorage.getItem(`profileImage_${currentEmail}`)
      : localStorage.getItem("profileImage");

    setProfileImage(image);
  };

  useEffect(() => {
    const handleProfileImageUpdate = () => {
      loadProfileImage();
    };

    window.addEventListener("profileImageUpdated", handleProfileImageUpdate);

    return () => {
      window.removeEventListener(
        "profileImageUpdated",
        handleProfileImageUpdate,
      );
    };
  }, []);

  const getProfileImageUrl = () => {
    if (!profileImage) {
      return null;
    }

    if (profileImage.startsWith("http")) {
      return profileImage;
    }

    return `http://ssh.gsmsv.site:25126${profileImage}`;
  };

  const profileImageUrl = getProfileImageUrl();

  const handleProfileImageError = () => {
    setProfileImage(null);

    const currentEmail = localStorage.getItem("email");

    if (currentEmail) {
      localStorage.removeItem(`profileImage_${currentEmail}`);
    } else {
      localStorage.removeItem("profileImage");
    }
  };

  const handleSearch = () => {
    const keyword = searchKeyword.trim();

    if (!keyword) {
      return;
    }

    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <header className="w-full bg-white">
      <nav className="w-full px-10 py-4 flex items-center gap-6">
        {/* 왼쪽 : 로고 */}
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="shrink-0"
        >
          <Logo />
        </button>

        {/* 검색창 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex-1 max-w-xl mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="게시글을 검색해보세요"
              className="
                w-full
                h-10
                pl-4
                pr-12
                rounded-full
                border
                border-blue-100
                bg-blue-50
                text-sm
                text-gray-700
                outline-none
                focus:border-[#294C77]
                focus:bg-white
                transition
              "
            />

            <button
              type="submit"
              aria-label="검색"
              className="
                absolute
                right-1
                top-1/2
                -translate-y-1/2
                w-8
                h-8
                flex
                items-center
                justify-center
                rounded-full
                text-[#294C77]
                hover:bg-blue-100
                transition
              "
            >
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </button>
          </div>
        </form>

        {/* 오른쪽 : 버튼 영역 */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* 글쓰기 */}
          <button
            type="button"
            onClick={() => navigate("/create")}
            className="
              flex
              items-center
              justify-center
              gap-2
              bg-blue-100
              text-[#294C77]
              px-3
              sm:px-5
              py-2
              rounded-full
              hover:bg-blue-200
              transition
              whitespace-nowrap
            "
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            <span className="hidden sm:inline">글쓰기</span>
          </button>

          {/* 알림 */}
          <button
            type="button"
            onClick={() => navigate("/notification")}
            className="
              flex
              items-center
              justify-center
              w-10
              h-10
              shrink-0
              text-[#294C77]
              hover:text-blue-600
              transition
            "
            aria-label="알림"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>

          {/* 프로필 */}
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="
              flex
              items-center
              justify-center
              w-10
              h-10
              shrink-0
              rounded-full
              overflow-hidden
              border-2
              border-blue-200
              bg-white
            "
            aria-label="프로필"
          >
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="프로필"
                className="w-full h-full object-cover"
                onError={handleProfileImageError}
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-6 h-6 text-[#294C77]"
              >
                <circle cx="12" cy="8" r="4" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
