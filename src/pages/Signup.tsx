import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import PasswordInput from "../components/PasswordInput";
import { checkEmail, signup, sendEmailCode, verifyEmailCode } from "../api/authApi";

function Signup() {
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

      setEmailMessage("인증코드 발송 중...");

      await sendEmailCode({ email });

      setIsEmailChecked(true);
      setIsVerified(false);
      setCode("");
      setCodeMessage("");
      setEmailMessage("이메일로 인증코드가 발송되었습니다.");
      startTimer();
    } catch (error) {
      console.error(error);
      setEmailMessage("이메일 확인에 실패했습니다.");
    }
  };


  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setCodeMessage("인증번호를 입력해주세요.");
      return;
    }

    setCodeMessage("확인 중...");

    try {
      const response = await verifyEmailCode({ email, code });

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
      const response = await signup({
        email,
        password,
        nickname,
      });

      alert(response.message);

      window.location.href = "/login";
    } catch (error: any) {
      console.error(error);
      const serverMessage = error?.response?.data?.message;
      setSignupMessage(serverMessage || "회원가입에 실패했습니다.");
    }
  };


  return (
    <div className="bg-[#f8f9ff] h-screen overflow-hidden flex items-center justify-center p-3">
      <main className="w-full max-w-md">
        <div className="bg-white border rounded-xl p-6 shadow-lg">

          {/* Logo */}
          <div className="flex flex-col items-center mb-5">
            <Logo size="lg" stacked />

            <p className="mt-2 text-gray-500 text-center text-sm whitespace-nowrap">
              함께 소비를 공유하는 소셜 플랫폼 FEESH에 오신 것을 환영합니다.
            </p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-4">

            {/* 이메일 */}
            <div>
              <label className="block mb-2 font-medium">
                이메일
              </label>

              <div className="flex gap-2">

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsEmailChecked(false);
                    setIsVerified(false);
                    setEmailMessage("");
                  }}
                  placeholder="email@gsm.hs.kr"
                  className="w-full border rounded-lg px-4 py-2.5"
                />

                <button
                  type="button"
                  onClick={handleCheckEmail}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg whitespace-nowrap"
                >
                  이메일 확인
                </button>

              </div>

              {emailMessage && (
                <p className="mt-1 text-xs text-gray-500">{emailMessage}</p>
              )}
            </div>


            {/* 인증번호 */}
            <div>
              <label className="block mb-2 font-medium">
                인증번호
              </label>

              <div className="flex gap-2">

                <div className="relative flex-1">

                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="6자리 숫자 입력"
                    disabled={!isEmailChecked || isVerified}
                    className="w-full border rounded-lg px-4 py-2.5"
                  />

                  <span className="absolute right-4 top-2.5 text-red-500">
                    {formatTime()}
                  </span>

                </div>


                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={!isEmailChecked || isVerified}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg"
                >
                  {isVerified ? "인증완료" : "인증확인"}
                </button>

              </div>

              {codeMessage && (
                <p className="mt-1 text-xs text-gray-500">{codeMessage}</p>
              )}
            </div>


            {/* 닉네임 */}
            <div>
              <label className="block mb-2 font-medium">
                닉네임
              </label>

              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력해주세요"
                className="w-full border rounded-lg px-4 py-2.5"
              />
            </div>


            {/* 비밀번호 */}
            <div>
              <label className="block mb-2 font-medium">
                비밀번호
              </label>

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8-16자리 영문, 숫자 조합"
              />
            </div>


            {/* 비밀번호 확인 */}
            <div>
              <label className="block mb-2 font-medium">
                비밀번호 확인
              </label>

              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 한번 더 입력해주세요"
              />
            </div>


            {/* 회원가입 버튼 */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-700 text-white rounded-lg text-lg font-bold"
            >
              회원가입
            </button>

            {signupMessage && (
              <p className="text-xs text-gray-500 text-center">{signupMessage}</p>
            )}

          </form>


          {/* 로그인 이동 */}
          <div className="mt-5 pt-5 border-t text-center">

            <p className="text-gray-500">
              이미 계정이 있으신가요?
            </p>

            <a href="/login" className="text-blue-700">
              로그인 페이지로 돌아가기
            </a>

          </div>

        </div>


        <footer className="mt-3 text-center text-gray-400">
          © 2024 FEESH Social platform. All rights reserved.
        </footer>

      </main>
    </div>
  );
}

export default Signup;