import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

import { getMyFeed, logout, withdraw, uploadProfileImage } from "../api/mypage";

import axios from "../api/axios";

interface MyPost {
  postId?: number;
  title?: string;
  likeCount?: number;
  createdAt?: string;
}

function Profile() {
  const navigate = useNavigate();

  const nickname = localStorage.getItem("nickname");
  const email = localStorage.getItem("email");

  const profileImageKey = email ? `profileImage_${email}` : "profileImage";

  const [posts, setPosts] = useState<MyPost[]>([]);

  const [profileImage, setProfileImage] = useState<string | null>(() => {
    if (email) {
      return localStorage.getItem(`profileImage_${email}`);
    }

    return localStorage.getItem("profileImage");
  });

  const [profileImageLoading, setProfileImageLoading] = useState(false);

  // 내 게시글 조회
  useEffect(() => {
    let cancelled = false;

    const loadMyPosts = async () => {
      try {
        const response = await getMyFeed();

        console.log(
          "내 게시글 전체 데이터:",
          JSON.stringify(response.data, null, 2),
        );

        const data = response.data;

        if (cancelled) {
          return;
        }

        if (Array.isArray(data)) {
          setPosts(data);
        } else if (Array.isArray(data.content)) {
          setPosts(data.content);
        } else if (Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else if (Array.isArray(data.data)) {
          setPosts(data.data);
        } else {
          setPosts([]);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("내 게시글 조회 실패:", error);
        }
      }
    };

    loadMyPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  // 프로필 사진 선택 및 업로드
  const handleProfileImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      event.target.value = "";
      return;
    }

    if (profileImageLoading) {
      return;
    }

    try {
      setProfileImageLoading(true);

      const response = await uploadProfileImage(file);

      console.log(
        "프로필 이미지 업로드 응답:",
        JSON.stringify(response.data, null, 2),
      );

      const imageUrl = response.data?.imageUrl;

      if (!imageUrl) {
        console.error("응답에서 imageUrl을 찾을 수 없습니다.");

        alert("프로필 사진 URL을 받아오지 못했습니다.");

        return;
      }

      console.log("업로드된 imageUrl:", imageUrl);

      const fullImageUrl = imageUrl.startsWith("http")
        ? imageUrl
        : `http://ssh.gsmsv.site:25126${imageUrl}`;

      console.log("저장할 profileImageUrl:", fullImageUrl);

      await axios.patch("/mypage/update", {
        image: fullImageUrl,
      });

      console.log("프로필 이미지 URL DB 저장 완료");

      setProfileImage(fullImageUrl);

      localStorage.setItem(profileImageKey, fullImageUrl);

      window.dispatchEvent(new Event("profileImageUpdated"));

      alert("프로필 사진이 변경되었습니다.");
    } catch (error) {
      console.error("프로필 이미지 변경 실패:", error);

      alert("프로필 사진 변경에 실패했습니다.");
    } finally {
      setProfileImageLoading(false);
      event.target.value = "";
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 API 실패:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
    localStorage.removeItem("email");

    alert("로그아웃 되었습니다.");

    navigate("/login");
  };

  // 회원탈퇴
  const handleWithdraw = async () => {
    const confirmDelete = window.confirm("정말 회원탈퇴 하시겠습니까?");

    if (!confirmDelete) {
      return;
    }

    try {
      await withdraw();

      localStorage.removeItem(profileImageKey);
      localStorage.removeItem("token");
      localStorage.removeItem("nickname");
      localStorage.removeItem("email");

      alert("회원탈퇴가 완료되었습니다.");

      navigate("/login");
    } catch (error) {
      console.error("회원탈퇴 실패:", error);

      alert("회원탈퇴에 실패했습니다.");
    }
  };

  return (
    <div>
      <Header />

      <main
        className="
          w-full
          max-w-3xl
          mx-auto
          px-4
          sm:px-6
          py-8
        "
      >
        {/* 내 정보 */}
        <section className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-black">내 정보</h1>

          <div className="flex flex-col items-center gap-4 mt-8">
            {/* 프로필 사진 영역 */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-white border-2 border-blue-200 flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="프로필 사진"
                    className="w-full h-full object-cover"
                    onError={() => {
                      console.error("프로필 이미지 표시 실패:", profileImage);

                      setProfileImage(null);

                      localStorage.removeItem(profileImageKey);
                    }}
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-14 h-14 text-black"
                  >
                    <circle cx="12" cy="8" r="4" />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8"
                    />
                  </svg>
                )}
              </div>

              {/* 사진 변경 버튼 */}
              <label
                htmlFor="profile-image-input"
                className={`
                  absolute
                  right-0
                  bottom-0
                  w-9
                  h-9
                  rounded-full
                  bg-blue-100
                  border
                  border-blue-200
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  ${
                    profileImageLoading
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-blue-200"
                  }
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="w-5 h-5 text-[#294C77]"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <circle cx="8.5" cy="10" r="1.5" />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 15l-4.5-4.5L9 18"
                  />
                </svg>
              </label>

              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                disabled={profileImageLoading}
                className="hidden"
              />
            </div>

            {profileImageLoading && (
              <p className="text-sm text-gray-500">
                프로필 사진을 업로드하고 있습니다...
              </p>
            )}

            <h2 className="text-xl font-bold text-black">
              {nickname ?? "사용자"}
            </h2>

            <p className="text-gray-500">{email ?? "이메일 없음"}</p>
          </div>

          {/* 로그아웃 / 회원탈퇴 */}
          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full
                rounded-lg
                bg-blue-100
                py-3
                font-medium
                text-blue-700
                transition
                hover:bg-blue-200
              "
            >
              로그아웃
            </button>

            <button
              type="button"
              onClick={handleWithdraw}
              className="
                w-full
                rounded-lg
                border
                border-blue-200
                bg-blue-50
                py-3
                font-medium
                text-blue-600
                transition
                hover:bg-blue-100
              "
            >
              회원탈퇴
            </button>
          </div>
        </section>

        {/* 내 게시글 */}
        <section className="mt-8 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-black">내 게시글</h2>

          <div className="mt-5 space-y-3">
            {posts.length === 0 ? (
              <p className="text-gray-500">작성한 게시글이 없습니다.</p>
            ) : (
              posts.map((post, index) => (
                <div
                  key={post.postId ?? index}
                  onClick={() => {
                    if (post.postId) {
                      navigate(`/post/${post.postId}`);
                    }
                  }}
                  className="
                    border
                    border-gray-200
                    rounded-lg
                    p-4
                    cursor-pointer
                    hover:bg-gray-50
                    transition
                  "
                >
                  <p className="font-bold text-black">
                    {post.title ?? "제목 없음"}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    좋아요 {post.likeCount ?? 0}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
