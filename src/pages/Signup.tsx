//회원가입 페이지
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Signup() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [timer, setTimer] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 인증번호 타이머
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const startTimer = () => {
    setTimer(180);
    setIsTimerRunning(true);
  };

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim() || !confirmPassword.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    alert("회원가입이 완료되었습니다!");
  };

  return (
    <div className="bg-[#f8f9ff] min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-md">
        <div className="bg-white border rounded-xl p-10 shadow-lg">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8F1UnfUespXiWuS3Iq8OA0C8iGDYx2Z2uDMAqAMlXXpGzWXp3Ph5TVqLOZZ3ZCVhQDzhAvEuSMAp4xOBCj4f9D4OflaooII7dGwR6cxmvLVHnT8YNFLE53IrYBlyT16w5Vm8wb_HlN6e7MwRHKyqlepkQKwEC3hMxS4DN-bBG1hrNAOWdpXkzRnZ-pFpEaV5CpQ0_q_WJPyrpjPARPDTkJHdg2KlF9eGRESR7ZovqMpB2Zl2TGhM-TGTuwIMZeLL43Z4"
              alt="FEESH Logo"
              className="w-20 h-20 object-contain mb-4"
            />

            <h1 className="text-3xl font-bold text-blue-700">FEESH</h1>

            <p className="mt-2 text-gray-500 text-center text-sm whitespace-nowrap">
              함께 소비를 공유하는 소셜 플랫폼 FEESH에 오신 것을 환영합니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이메일 */}
            <div>
              <label className="block mb-2 font-medium">이메일</label>

              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="email@gsm.hs.kr"
                  className="w-52 border rounded-lg px-4 py-3"
                />

                <button
                  type="button"
                  onClick={startTimer}
                  className="px-5 py-3 bg-blue-600 text-white rounded-lg whitespace-nowrap"
                >
                  인증번호 전송
                </button>
              </div>
            </div>

            {/* 인증번호 */}
            <div>
              <label className="block mb-2 font-medium">인증번호</label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="6자리 숫자 입력"
                    className="w-full border rounded-lg px-4 py-3"
                  />

                  <span className="absolute right-4 top-3 text-red-500">
                    {formatTime()}
                  </span>
                </div>

                <button
                  type="button"
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg"
                >
                  인증확인
                </button>
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block mb-2 font-medium">비밀번호</label>

              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="8-16자리 영문, 숫자 조합"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* 비밀번호 확인 */}
            <div>
              <label className="block mb-2 font-medium">비밀번호 확인</label>

              <div className="relative">
                <input
                  type={confirmVisible ? "text" : "password"}
                  placeholder="비밀번호를 한번 더 입력해주세요"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setConfirmVisible(!confirmVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {confirmVisible ? <Eye size={22} /> : <EyeOff size={22} />}
                </button>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              className="w-full py-4 bg-blue-700 text-white rounded-lg text-lg font-bold"
            >
              회원가입
            </button>
          </form>

          {/* 로그인 이동 */}
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-gray-500">이미 계정이 있으신가요?</p>

            <a href="/login" className="text-blue-700">
              로그인 페이지로 돌아가기
            </a>
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-400">
          © 2024 FEESH Social platform. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default Signup;
