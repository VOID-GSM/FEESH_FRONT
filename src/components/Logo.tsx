import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

interface LogoProps {
  size?: "sm" | "lg";
  className?: string;
  stacked?: boolean;
}

function Logo({ size = "sm", className = "", stacked = false }: LogoProps) {
  const navigate = useNavigate();

  const imageSize = size === "lg" ? "h-16" : "h-10";

  const layoutClass = stacked
    ? "flex flex-col items-center"
    : "flex items-center";

  return (
    <button
      onClick={() => navigate("/home")}
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