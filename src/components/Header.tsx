import Logo from "./Logo";
import profileImage from "../assets/profile.png";

function Header() {
  return (
    <header className="bg-surface-bright sticky top-0 z-50 shadow-sm">
      <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-tablet py-stack-sm max-w-[1024px] mx-auto">
        <div className="flex items-center gap-gutter">
          <Logo size="sm" />
          <span className="font-headline-xl text-headline-xl font-bold text-primary">
            FEESH
          </span>
        </div>

        <div className="flex items-center gap-stack-md">
          <button className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
            notifications
          </button>

          <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
            <img
              src={profileImage}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
