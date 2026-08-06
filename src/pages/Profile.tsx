import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

import {
  getMyFeed,
  getMyComments,
  logout,
  withdraw,
  uploadProfileImage,
} from "../api/mypage";

import axios from "../api/axios";

interface MyPost {
  postId?: number;
  title?: string;
  likeCount?: number;
  createdAt?: string;
}

interface MyComment {
  commentId?: number;
  postId?: number;
  comment?: string;
  createdAt?: string;
}

function Profile() {
  const navigate = useNavigate();

  const nickname = localStorage.getItem("nickname");
  const email = localStorage.getItem("email");

  // 계정별 프로필 이미지 저장 키
  const profileImageKey = email ? `profileImage_${email}` : "profileImage";

  const [posts, setPosts] = useState<MyPost[]>([]);
  const [comments, setComments] = useState<MyComment[]>([]);

  // 저장된 프로필 사진 불러오기
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    if (email) {
      return localStorage.getItem(`profileImage_${email}`);
    }

    return localStorage.getItem("profileImage");
  });

  // 프로필 사진 업로드 중인지 확인
  const [profileImageLoading, setProfileImageLoading] = useState(false);

  // 내 게시글 조회
  const loadMyPosts = async () => {
    try {
      const response = await getMyFeed();

      console.log(
        "내 게시글 전체 데이터:",
        JSON.stringify(response.data, null, 2),
      );

      const data = response.data;

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
      console.error("내 게시글 조회 실패:", error);
    }
  };

  // 내 댓글 조회
  const loadMyComments = async () => {
    try {
      const response = await getMyComments();

      console.log(
        "내 댓글 전체 데이터:",
        JSON.stringify(response.data, null, 2),
      );

      const data = response.data;

      if (Array.isArray(data)) {
        setComments(data);
      } else if (Array.isArray(data.content)) {
        setComments(data.content);
      } else if (Array.isArray(data.comments)) {
        setComments(data.comments);
      } else if (Array.isArray(data.data)) {
        setComments(data.data);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("내 댓글 조회 실패:", error);
    }
  };

  // 프로필 사진 선택 및 업로드
  const handleProfileImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // 이미지 파일인지 확인
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

      // 1. 이미지 파일 업로드
      const response = await uploadProfileImage(file);

      console.log(
        "프로필 이미지 업로드 응답:",
        JSON.stringify(response.data, null, 2),
      );

      // 2. 업로드 응답에서 imageUrl 가져오기
      const imageUrl = response.data?.imageUrl;

      if (!imageUrl) {
        console.error("응답에서 imageUrl을 찾을 수 없습니다.");

        alert("프로필 사진 URL을 받아오지 못했습니다.");

        return;
      }

      console.log("업로드된 imageUrl:", imageUrl);

      // 백엔드가 상대 경로를 보내는 경우
      const fullImageUrl = imageUrl.startsWith("http")
        ? imageUrl
        : `http://ssh.gsmsv.site:25126${imageUrl}`;

      console.log("저장할 profileImageUrl:", fullImageUrl);

      // 3. 백엔드 DB에 프로필 이미지 URL 저장
      await axios.patch("/mypage/update", {
        image: fullImageUrl,
      });

      console.log("프로필 이미지 URL DB 저장 완료");

      // 4. 화면에 표시
      setProfileImage(fullImageUrl);

      // 5. localStorage에도 저장
      localStorage.setItem(profileImageKey, fullImageUrl);

      // 6. Header에 프로필 이미지 변경 알림
      window.dispatchEvent(new Event("profileImageUpdated"));

      alert("프로필 사진이 변경되었습니다.");
    } catch (error) {
      console.error("프로필 이미지 변경 실패:", error);

      alert("프로필 사진 변경에 실패했습니다.");
    } finally {
      setProfileImageLoading(false);

      // 같은 파일을 다시 선택할 수 있도록 초기화
      event.target.value = "";
    }
  };

  useEffect(() => {
    loadMyPosts();
    loadMyComments();
  }, []);

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 API 실패:", error);
    }

    // 로그인 정보만 삭제
    // 프로필 이미지는 삭제하지 않음
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

      // 회원탈퇴이므로 프로필 이미지까지 삭제
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
    <div className="min-h-screen bg-[#f8f9ff]">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* 내 정보 */}
        <section className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-black mb-8">내 정보</h1>

          <div className="flex flex-col items-center gap-4">
            {/* 프로필 사진 영역 */}
            <div className="relative">
              {/* 프로필 사진 */}
              <div className="w-28 h-28 rounded-full overflow-hidden bg-white border border-black flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="프로필 사진"
                    className="w-full h-full object-cover"
                    onError={(event) => {
                      console.error("프로필 이미지 표시 실패:", profileImage);

                      event.currentTarget.style.display = "none";
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
                  bg-white
                  border
                  border-black
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  ${
                    profileImageLoading
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-gray-100"
                  }
                `}
              >
                {/* 사진 아이콘 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="w-5 h-5 text-black"
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

              {/* 파일 선택 */}
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                disabled={profileImageLoading}
                className="hidden"
              />
            </div>

            {/* 업로드 중일 때만 표시 */}
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
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              로그아웃
            </button>

            <button
              type="button"
              onClick={handleWithdraw}
              className="w-full border border-black text-black py-3 rounded-lg hover:bg-gray-100 transition"
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
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
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

        {/* 내 댓글 */}
        <section className="mt-8 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-black">내 댓글</h2>

          <div className="mt-5 space-y-3">
            {comments.length === 0 ? (
              <p className="text-gray-500">작성한 댓글이 없습니다.</p>
            ) : (
              comments.map((comment, index) => (
                <div
                  key={comment.commentId ?? index}
                  onClick={() => {
                    if (comment.postId) {
                      navigate(`/post/${comment.postId}`);
                    }
                  }}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
                >
                  <p className="text-black">{comment.comment ?? "내용 없음"}</p>
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
