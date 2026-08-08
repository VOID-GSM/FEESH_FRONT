import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  // 현재 로그인한 사용자의 이메일
  const email = localStorage.getItem("email");

  // 계정별 프로필 사진 저장 키
  const profileImageKey = email ? `profileImage_${email}` : "profileImage";

  // localStorage에 저장된 프로필 사진
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    return localStorage.getItem(profileImageKey);
  });

  // 프로필 사진 가져오기
  const loadProfileImage = () => {
    const currentEmail = localStorage.getItem("email");

    const image = currentEmail
      ? localStorage.getItem(`profileImage_${currentEmail}`)
      : localStorage.getItem("profileImage");

    setProfileImage(image);
  };

  // 프로필 사진 변경 감지
  useEffect(() => {
    loadProfileImage();

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

  // 백엔드에서 받은 이미지 경로를 실제 이미지 URL로 변환
  const getProfileImageUrl = () => {
    if (!profileImage) {
      return null;
    }

    // 이미 완전한 URL인 경우
    if (profileImage.startsWith("http")) {
      return profileImage;
    }

    // /uploads/... 형태인 경우
    return `http://ssh.gsmsv.site:25126${profileImage}`;
  };

  const profileImageUrl = getProfileImageUrl();

  // 프로필 이미지 로딩 실패 시 기본 아이콘 표시
  const handleProfileImageError = () => {
    setProfileImage(null);

    // 잘못된 이미지 URL이 localStorage에 남아있지 않도록 삭제
    const currentEmail = localStorage.getItem("email");

    if (currentEmail) {
      localStorage.removeItem(`profileImage_${currentEmail}`);
    } else {
      localStorage.removeItem("profileImage");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white shadow-sm">
      <nav className="flex items-center justify-between w-full h-full px-4 sm:px-6 lg:px-12 box-border">
        {/* 왼쪽 : 로고 */}
        <div className="shrink-0">
          <Logo to="/home" />
        </div>

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
              // 프로필 사진이 없으면 기본 사람 아이콘 표시
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
