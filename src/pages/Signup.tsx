import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import PasswordInput from "../components/PasswordInput";
import {
  checkEmail,
  signup,
  sendEmailCode,
  verifyEmailCode,
} from "../api/authApi";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const [timer, setTimer] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");

  const [code, setCode] = useState("");

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [emailMessage, setEmailMessage] = useState("");
  const [codeMessage, setCodeMessage] = useState("");
  const [signupMessage, setSignupMessage] = useState("");

  const [loading, setLoading] = useState(false);

  // 인증번호 타이머
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          setCodeMessage("인증번호 시간이 만료되었습니다.");
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

  // 이메일 확인 + 인증번호 발송
  const handleCheckEmail = async () => {
    if (!email.trim()) {
      setEmailMessage("이메일을 입력해주세요.");
      return;
    }

    setEmailMessage("확인 중...");

    try {
      const response = await checkEmail({
        email,
      });

      if (response.duplicated) {
        setEmailMessage("중복된 이메일입니다.");
        return;
      }

      await sendEmailCode({
        email,
      });

      setIsEmailChecked(true);
      setIsVerified(false);
      setCode("");

      setEmailMessage("이메일로 인증코드가 발송되었습니다.");
      setCodeMessage("");

      startTimer();
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        setEmailMessage(message || "이메일 확인에 실패했습니다.");
      } else {
        setEmailMessage("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setCodeMessage("인증번호를 입력해주세요.");
      return;
    }

    try {
      const response = await verifyEmailCode({
        email,
        code,
      });

      if (!response.verified) {
        setCodeMessage(response.message || "인증번호가 일치하지 않습니다.");
        return;
      }

      setIsVerified(true);
      setIsTimerRunning(false);

      setCodeMessage("이메일 인증이 완료되었습니다.");
    } catch (error) {
      console.error(error);

      setCodeMessage("인증 확인에 실패했습니다.");
    }
  };

  // 회원가입
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSignupMessage("");

    if (!email.trim() || !password.trim() || !nickname.trim()) {
      setSignupMessage("이메일, 비밀번호, 닉네임을 입력해주세요.");
      return;
    }

    if (!isVerified) {
      setSignupMessage("이메일 인증을 완료해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setSignupMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);

      const response = await signup({
        email,
        password,
        nickname,
      });

      alert(response.message || "회원가입이 완료되었습니다.");

      navigate("/login");
    } catch (error) {
      console.error(error);

      const serverMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      setSignupMessage(serverMessage || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-[#f8f9ff] p-3">
      <main className="w-full min-w-0 max-w-md">
        <div className="w-full min-w-0 rounded-xl border bg-white p-6 shadow-lg">
          {/* 로고 */}
          <div className="mb-5 flex min-w-0 flex-col items-center">
            <Logo size="lg" className="scale-125" />

            <p className="mt-4 w-full max-w-full break-keep text-center text-sm leading-relaxed text-gray-500">
              함께 소비를 공유하는 소셜 플랫폼 FEESH에 오신 것을 환영합니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 */}
            <div className="min-w-0">
              <label className="mb-2 block font-medium">이메일</label>

              <div className="flex min-w-0 gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    setIsEmailChecked(false);
                    setIsVerified(false);

                    setEmailMessage("");
                    setCodeMessage("");
                  }}
                  placeholder="email@gsm.hs.kr"
                  className="min-w-0 w-full rounded-lg border px-4 py-2.5"
                />

                <button
                  type="button"
                  onClick={handleCheckEmail}
                  disabled={isVerified}
                  className="
                    shrink-0
                    rounded-lg
                    bg-blue-600
                    px-3
                    py-2.5
                    text-white
                    disabled:opacity-50
                    sm:px-5
                  "
                >
                  이메일 확인
                </button>
              </div>

              {emailMessage && (
                <p className="mt-1 break-keep text-xs text-gray-500">
                  {emailMessage}
                </p>
              )}
            </div>

            {/* 인증번호 */}
            <div className="min-w-0">
              <label className="mb-2 block font-medium">인증번호</label>

              <div className="flex min-w-0 gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="6자리 숫자 입력"
                    disabled={!isEmailChecked || isVerified}
                    className="w-full rounded-lg border px-4 py-2.5 pr-16"
                  />

                  <span className="absolute right-4 top-2.5 text-red-500">
                    {formatTime()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={!isEmailChecked || isVerified}
                  className="
                    shrink-0
                    rounded-lg
                    bg-blue-600
                    px-3
                    py-2.5
                    text-white
                    disabled:opacity-50
                    sm:px-4
                  "
                >
                  {isVerified ? "인증완료" : "인증확인"}
                </button>
              </div>

              {codeMessage && (
                <p className="mt-1 break-keep text-xs text-gray-500">
                  {codeMessage}
                </p>
              )}
            </div>

            {/* 닉네임 */}
            <div>
              <label className="mb-2 block font-medium">닉네임</label>

              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력해주세요"
                className="w-full rounded-lg border px-4 py-2.5"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="mb-2 block font-medium">비밀번호</label>

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8-16자리 영문, 숫자 조합"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="mb-2 block font-medium">비밀번호 확인</label>

              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 한번 더 입력해주세요"
              />
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-lg
                bg-blue-700
                py-3
                text-lg
                font-bold
                text-white
                disabled:opacity-50
              "
            >
              {loading ? "가입 중..." : "회원가입"}
            </button>

            {signupMessage && (
              <p className="break-keep text-center text-xs text-gray-500">
                {signupMessage}
              </p>
            )}
          </form>

          {/* 로그인 */}
          <div className="mt-5 border-t pt-5 text-center">
            <p className="text-gray-500">이미 계정이 있으신가요?</p>

            <button
              onClick={() => navigate("/login")}
              className="text-blue-700"
            >
              로그인 페이지로 돌아가기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;
