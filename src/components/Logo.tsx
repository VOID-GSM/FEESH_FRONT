import logo from "../assets/logo.png";

interface LogoProps {
  size?: "sm" | "lg";
  className?: string;
}

function Logo({ size = "sm", className = "" }: LogoProps) {
  const sizeClass = size === "lg" ? "h-16 w-auto" : "h-10 w-auto";

  return (
    <img src={logo} alt="FEESH 로고" className={`${sizeClass} ${className}`} />
  );
}

export default Logo;
