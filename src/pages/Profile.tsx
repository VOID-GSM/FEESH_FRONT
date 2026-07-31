import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Profile() {
  const navigate = useNavigate();

  const nickname = localStorage.getItem("nickname");
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
    localStorage.removeItem("email");

    alert("로그아웃 되었습니다.");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Header />

      <main
        className="
          max-w-3xl
          mx-auto
          px-6
          py-10
        "
      >
        <section
          className="
            bg-white
            rounded-xl
            shadow-sm
            p-8
          "
        >
          <h1
            className="
              text-2xl
              font-bold
              text-blue-700
              mb-8
            "
          >
            내 정보
          </h1>

          <div
            className="
              flex
              flex-col
              items-center
              gap-4
            "
          >
            {/* 프로필 이미지 */}
            <div
              className="
                w-24
                h-24
                rounded-full
                bg-gray-200
                flex
                items-center
                justify-center
                text-4xl
              "
            >
              👤
            </div>

            <h2
              className="
                text-xl
                font-bold
              "
            >
              {nickname ?? "사용자"}
            </h2>

            <p className="text-gray-500">{email ?? "이메일 없음"}</p>
          </div>

          <div
            className="
              mt-8
              border-t
              pt-6
            "
          >
            <button
              onClick={handleLogout}
              className="
                w-full
                bg-blue-700
                text-white
                py-3
                rounded-lg
                hover:bg-blue-800
              "
            >
              로그아웃
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
