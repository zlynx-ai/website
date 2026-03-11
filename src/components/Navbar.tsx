import { Link, useLocation } from "react-router-dom";

const GITHUB_URL = "https://github.com/zlynx-ai/zlynx";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-theme-border bg-[#050505]/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/icon.png" className="h-16" />
          {/* <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white group-hover:text-theme-accent transition-colors duration-300"
          >
            <path
              d="M4 6h16L4 18h16"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
          {/* <span className="font-bold text-[19px] tracking-tight text-white group-hover:text-gray-200 transition-colors duration-300 ml-1">
            zlynx
          </span> */}
        </Link>

        <div className="flex items-center gap-8">
          <Link
            to="/docs"
            className={`text-[14px] font-medium transition-colors duration-200 ${
              isActive("/docs")
                ? "text-white"
                : "text-theme-muted hover:text-white"
            }`}
          >
            Docs
          </Link>
          <Link
            to="/tutorials"
            className={`text-[14px] font-medium transition-colors duration-200 ${
              isActive("/tutorials")
                ? "text-white"
                : "text-theme-muted hover:text-white"
            }`}
          >
            Tutorials
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] font-medium text-theme-muted hover:text-white transition-colors duration-200"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
