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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 입력해주세요.");

      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email,

        password,
      });

      console.log("로그인 응답:", response);

      // 기존 데이터 삭제

      localStorage.removeItem("token");

      localStorage.removeItem("email");

      localStorage.removeItem("nickname");

      // JWT 저장

      localStorage.setItem(
        "token",

        response.accessToken,
      );

      localStorage.setItem(
        "email",

        response.email,
      );

      localStorage.setItem(
        "nickname",

        response.nickname,
      );

      alert(response.message || "로그인되었습니다.");

      navigate("/home");
    } catch (error) {
      console.error("로그인 실패", error);

      alert("이메일 또는 비밀번호를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
min-h-screen
bg-[#f8f9ff]
flex
items-center
justify-center
"
    >
      <div
        className="
bg-white
shadow-lg
rounded-xl
p-10
w-full
max-w-md
"
      >
        <div
          className="
flex
justify-center
mb-8
"
        >
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
                placeholder="비밀번호 입력"
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
text-gray-500
"
              >
                {passwordVisible ? <Eye size={22} /> : <EyeOff size={22} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
w-full
bg-blue-700
text-white
rounded-lg
py-3
font-bold
disabled:opacity-50
"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div
          className="
mt-8
border-t
pt-6
text-center
"
        >
          <p
            className="
text-gray-500
mb-4
"
          >
            아직 회원이 아니신가요?
          </p>

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
    </div>
  );
}

export default Login;
