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

  const content = (
    <>
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
    </>
  );

  // to prop이 없으면 클릭해도 아무 곳으로도 이동하지 않음 (로그인/회원가입 화면 등)
  if (!to) {
    return (
      <div className={`${layoutClass} gap-2`}>
        {content}
      </div>
    );
  }

  return (
    <button
      onClick={() => navigate(to)}
      className={`${layoutClass} gap-2 p-0 m-0 bg-transparent border-0 cursor-pointer`}
    >
      {content}
    </button>
  );
}

export default Logo;
