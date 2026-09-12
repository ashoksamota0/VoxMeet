import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AstroidIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  Menu,
  X,
} from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/react";

const Navbar = () => {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "User";

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const publicLinks = [
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
  ];

  return (
    <header className="w-full max-w-305 mx-auto bg-white/90 backdrop-blur xl:rounded-b-xl sticky top-0 z-40 px-6 py-4 border border-slate-200">
      <div className="flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/dashboard"
          onClick={closeMenu}
          className="flex items-center gap-0.5"
        >
          <img src="/favicon.png" alt="VoxMeet Logo" className="size-7.5" />

          <span className="text-2xl font-medium tracking-tight text-slate-900">
            VoxMeet
          </span>
        </Link>

        {/* Desktop Navigation */}
        {isSignedIn ? (
          <nav className="hidden lg:flex items-center gap-1.5 ml-2">
            <Link
              to="/dashboard"
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                location.pathname === "/dashboard"
                  ? "ring ring-blue-100 bg-blue-50 text-slate-800"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboardIcon className="w-3.5 h-3.5" />
              Dashboard
            </Link>

            <Link
              to="/sessions"
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                location.pathname === "/sessions"
                  ? "ring ring-blue-100 bg-blue-50 text-slate-800"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <HistoryIcon className="w-3.5 h-3.5" />
              Sessions
            </Link>

            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  location.pathname === link.path
                    ? "ring ring-blue-100 bg-blue-50 text-slate-800"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        ) : (
          <nav className="hidden lg:flex items-center gap-1 ml-2">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Desktop Right Side */}
        {isSignedIn ? (
          <div className="hidden lg:flex items-center gap-4">
            <span className="font-medium tracking-wide text-sm text-slate-700">
              Welcome, {userName}
            </span>

            <UserButton afterSignOutUrl="/dashboard" />
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2">
            <SignInButton mode="modal">
              <button className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900">
                Login
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-700">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        )}

        {/* Mobile Right Side */}
        <div className="flex lg:hidden items-center gap-3">
          {isSignedIn && <UserButton afterSignOutUrl="/dashboard" />}

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center justify-center rounded-full p-2 text-slate-700 transition-all hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 border-t border-slate-200 pt-4 pb-2">
          <nav className="flex flex-col gap-1.5">
            {isSignedIn && (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    location.pathname === "/dashboard"
                      ? "bg-blue-50 text-slate-800"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <LayoutDashboardIcon className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  to="/sessions"
                  onClick={closeMenu}
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    location.pathname === "/sessions"
                      ? "bg-blue-50 text-slate-800"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <HistoryIcon className="w-4 h-4" />
                  Sessions
                </Link>
              </>
            )}

            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Authentication */}
            {!isSignedIn && (
              <div className="flex items-center gap-2 border-t border-slate-200 mt-2 pt-4">
                <SignInButton mode="modal">
                  <button
                    onClick={closeMenu}
                    className="flex-1 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100"
                  >
                    Login
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button
                    onClick={closeMenu}
                    className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-700"
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
