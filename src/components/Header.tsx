import Logo from "./Logo";

function Header() {
  return (
    <header className="bg-surface-bright sticky top-0 z-50 shadow-sm">
      <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-tablet py-stack-sm max-w-[1024px] mx-auto">
        {/* 로고 */}
        <div className="flex items-center gap-gutter">
          <Logo size="sm" />

          <span className="font-headline-xl text-headline-xl font-bold text-primary">
            FEESH
          </span>
        </div>

        {/* 오른쪽 */}
        <div className="flex items-center gap-stack-md">
          <button className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
            notifications
          </button>

          <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2tozAdh7Q0TiZRuHJ3xXnEFR_ebkI3R2C2i9WQIHnjpr-KeSmqnZst9GNagxIXF3TT1fRPMzp8nWl0DlvVXR-WMv8hYiCfdwcWgYhDU5JOJSdD9uSx0nWfaKCD6tuYU-4AXn55BgpPleVetiNJ_gZ13PbFWfVrz1r3fAdHDzzEobB3HwYiVIFLVqqG0f8gdE8uzrkNNLzsR8goq2LhYDeVvK_leZBWnfFZEV25ENfqMQkpZzBh3an6Q"
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
