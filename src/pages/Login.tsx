//로그인 페이지
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans">
      {/* Header */}
      <header className="w-full h-16 flex items-center px-8">
        <div className="flex items-center gap-2">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxif62lTLsOV1cSAQssslSmGyaNeCAjI1iF4wLFAxGgpJEimdTKEIqMOiYNlZhp9RGKaB2_LU-wnCsUPPiA-tw0hxtkLJjiPZO-GpBmayDs4doeKg5YM568v_NbWW3kCwfvw3ZRJY3X0rA7XfMTnloxbfhuFpD3eE_tlDYZskw4D3oKQnThdsl1I3bynOpSHU8_5nOu122rQs5RtA_O_tDU_x3yGMc9kFJhGxIG1xvepg8lnyIChyicjSk9hSmu8lCAiA"
            alt="FEESH"
            className="h-10"
          />

          <h1 className="text-2xl font-bold text-blue-700">FEESH</h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7PYBntYn_HRkqX6LLSceEw75qDI8qf_8ENX1jxRh6nfOcodpOZ8Tj0wwp0Qd7GY0Hy8PjjCGh2yUUac_eB3Iaeka8fFi4aZPZMKbUVIOmTdPIyGnQs1d2SH9SLPoAuxtm3LTP8dn7lrPxNKQwmwhTopEBYr4-UtCF6B6glHaRKL31IJiPAzZ9MnrEcURmvxGBcq-htfD7y0hMHtv-5_dM-9QT4ebqf3is_3Yu005Fzm0uXM7-QyOf6tY0h9O8q6Thvws"
              alt="FEESH"
              className="h-16 mb-4"
            />

            <h2 className="text-3xl font-bold text-blue-700">FEESH</h2>
          </div>

          <form className="space-y-6">
            {/* 이메일 */}
            <div>
              <label className="block mb-2 font-medium">이메일</label>

              <input
                type="email"
                placeholder="email@gsm.hs.kr"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block mb-2 font-medium">비밀번호</label>

              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full border rounded-lg px-4 py-3 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {passwordVisible ? <Eye size={22} /> : <EyeOff size={22} />}
                </button>
              </div>
            </div>

            {/* 자동 로그인 */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                자동 로그인
              </label>

              <a href="#" className="text-blue-700">
                아이디/비밀번호 찾기
              </a>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full bg-blue-700 text-white rounded-lg py-3 hover:bg-blue-800"
            >
              로그인
            </button>
          </form>

          {/* 회원가입 이동 */}
          <div className="mt-8 border-t pt-6 text-center">
            <p className="mb-4 text-gray-500">아직 회원이 아니신가요?</p>

            <button
              onClick={() => navigate("/signup")}
              className="w-full border border-blue-700 text-blue-700 rounded-lg py-3"
            >
              회원가입
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400">FEESH</footer>
    </div>
  );
}

export default Login;
