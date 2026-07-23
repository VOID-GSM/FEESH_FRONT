import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

interface LogoProps {
  size?: "sm" | "lg";
  className?: string;
}

function Logo({ size = "sm", className = "" }: LogoProps) {
  const navigate = useNavigate();

  const sizeClass = size === "lg" ? "h-16 w-auto" : "h-10 w-auto";

  const handleLogoClick = () => {
    const isLogin = localStorage.getItem("accessToken");

    if (isLogin) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogoClick}
      className="p-0 m-0 bg-transparent border-0 cursor-pointer flex items-center"
    >
      <img
        src={logo}
        alt="FEESH 로고"
        className={`${sizeClass} ${className}`}
      />
    </button>
  );
}

export default Logo;
