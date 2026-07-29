import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import PasswordInput from "../components/PasswordInput";
import {
  checkEmail,
  sendEmailCode,
  verifyEmailCode,
  signup,
} from "../api/authApi";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [code, setCode] = useState("");

  const [timer, setTimer] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // 인증번호 타이머
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
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

  // 인증번호 전송
  const handleSendCode = async () => {
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      await checkEmail({
        email,
      });

      await sendEmailCode({
        email,
      });

      startTimer();

      alert("인증번호가 전송되었습니다.");
    } catch (error) {
      console.error("인증번호 전송 실패", error);

      alert("인증번호 전송에 실패했습니다.");
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!code.trim()) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    try {
      await verifyEmailCode({
        email,
        code,
      });

      setIsEmailVerified(true);
      setIsTimerRunning(false);

      alert("이메일 인증이 완료되었습니다.");
    } catch (error) {
      console.error("인증 확인 실패", error);

      alert("인증번호가 올바르지 않습니다.");
    }
  };

  // 회원가입
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);

      await signup({
        email,
        password,
        nickname,
      });

      alert("회원가입이 완료되었습니다.");

      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패", error);

      alert("회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f9ff] min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-md">
        <div className="bg-white border rounded-xl p-10 shadow-lg">
          <div className="flex flex-col items-center mb-10">
            <Logo size="lg" />

            <h1 className="mt-4 text-3xl font-bold text-blue-700">FEESH</h1>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@gsm.hs.kr"
                  className="w-52 border rounded-lg px-4 py-3"
                />

                <button
                  type="button"
                  onClick={handleSendCode}
                  className="
                    px-5
                    py-3
                    bg-blue-600
                    text-white
                    rounded-lg
                    whitespace-nowrap
                  "
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
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="6자리 숫자 입력"
                    className="w-full border rounded-lg px-4 py-3"
                  />

                  <span className="absolute right-4 top-3 text-red-500">
                    {formatTime()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="
                    px-4
                    py-3
                    bg-blue-600
                    text-white
                    rounded-lg
                  "
                >
                  인증확인
                </button>
              </div>
            </div>

            {/* 닉네임 */}
            <div>
              <label className="block mb-2 font-medium">닉네임</label>

              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력해주세요"
                className="
                  w-full
                  border
                  rounded-lg
                  px-4
                  py-3
                "
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block mb-2 font-medium">비밀번호</label>

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8-16자리 영문, 숫자 조합"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block mb-2 font-medium">비밀번호 확인</label>

              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 한번 더 입력해주세요"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-4
                bg-blue-700
                text-white
                rounded-lg
                text-lg
                font-bold
                disabled:opacity-50
              "
            >
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-gray-500">이미 계정이 있으신가요?</p>

            <button
              onClick={() => navigate("/login")}
              className="text-blue-700"
            >
              로그인 페이지로 돌아가기
            </button>
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
