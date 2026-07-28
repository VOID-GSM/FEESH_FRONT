import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

interface LogoProps {
  size?: "sm" | "lg";
  className?: string;
  stacked?: boolean;
  to?: string;
}

function Logo({ size = "sm", className = "", stacked = false, to }: LogoProps) {
  const navigate = useNavigate();

  const imageSize = size === "lg" ? "h-16" : "h-10";

  const layoutClass = stacked
    ? "flex flex-col items-center"
    : "flex items-center";

  const handleClick = () => {
    if (to) {
      navigate(to);
      return;
    }

    // to prop이 없으면 토큰 유무로 분기 (미로그인 상태에서 로그인/회원가입 화면 로고 클릭 시 /home으로 안 가도록)
    const token = localStorage.getItem("token");
    navigate(token ? "/home" : "/");
  };

  return (
    <button
      onClick={handleClick}
      className={`${layoutClass} gap-2 p-0 m-0 bg-transparent border-0 cursor-pointer`}
    >
      {/* FEESH 이미지 로고 */}
      <img
        src={logo}
        alt="FEESH 로고"
        className={`${imageSize} w-auto object-contain ${className}`}
      />

      {/* FEESH 글씨 로고 */}
      <span className="text-2xl font-extrabold text-blue-700 tracking-wide">
        FEESH
      </span>
    </button>
  );
}

export default Logo;
