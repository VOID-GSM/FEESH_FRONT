import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import Logo from "../components/Logo";
import { login } from "../api/authApi";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await login({
        email,
        password,
      });

      // 기존 토큰 제거
      localStorage.removeItem("token");

      // 새로운 JWT 저장
      localStorage.setItem("accessToken", response.accessToken);

      localStorage.setItem("email", response.email);

      localStorage.setItem("nickname", response.nickname);

      // 좋아요 상태 초기화
      localStorage.setItem("likedPosts", "[]");

      alert(response.message);

      navigate("/home");
    } catch (error) {
      console.error("로그인 실패", error);

      alert("로그인에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans">
      <header className="w-full h-16 flex items-center px-8">
        <Logo />
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-10">
          <div className="flex flex-col items-center mb-8">
            <Logo size="lg" stacked />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">이메일</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@gsm.hs.kr"
                className="
                  w-full
                  border
                  rounded-lg
                  px-4
                  py-3
                "
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">비밀번호</label>

              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="
                    w-full
                    border
                    rounded-lg
                    px-4
                    py-3
                    pr-12
                  "
                />

                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                  "
                >
                  {passwordVisible ? <Eye size={22} /> : <EyeOff size={22} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="
                w-full
                bg-blue-700
                text-white
                rounded-lg
                py-3
              "
            >
              로그인
            </button>
          </form>

          <div className="mt-8 border-t pt-6 text-center">
            <p className="mb-4 text-gray-500">아직 회원이 아니신가요?</p>

            <button
              onClick={() => navigate("/signup")}
              className="
                w-full
                border
                border-blue-700
                text-blue-700
                rounded-lg
                py-3
              "
            >
              회원가입
            </button>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-400">FEESH</footer>
    </div>
  );
}

export default Login;
