import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

interface LogoProps {
  size?: "sm" | "lg";
  className?: string;
  to?: string;
}

function Logo({ size = "sm", className = "", to }: LogoProps) {
  const navigate = useNavigate();

  // 헤더: h-12 (48px)
  // 로그인/회원가입: h-24 (96px)
  const imageSize = size === "lg" ? "h-24" : "h-12";

  const content = (
    <img
      src={logo}
      alt="FEESH 로고"
      className={`${imageSize} w-auto object-contain ${className}`}
    />
  );

  // 이동 경로가 없으면 로고만 표시
  if (!to) {
    return <div>{content}</div>;
  }

  // 이동 경로가 있으면 클릭 시 해당 페이지로 이동
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="
        p-0
        m-0
        bg-transparent
        border-0
        cursor-pointer
      "
    >
      {content}
    </button>
  );
}

export default Logo;
