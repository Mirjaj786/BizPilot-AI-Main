import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoMenu,
  IoClose,
  IoChevronDown,
  IoSettingsOutline,
  IoLogOutOutline,
  IoSparklesOutline,
  IoSunnyOutline,
  IoMoonOutline,
} from "react-icons/io5";
import Button from "../Button/Button.jsx";
import logo from "../../assets/BizPilot_AI_Logo.png";
import { StoreContext } from "../../context/StoreContext.jsx";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "POS Billing", to: "/sales" },
  { name: "AI Assistant", to: "/ai" },
  { name: "Why Us", href: "#why-us" },
];


export default function Navbar() {
  const { user, logoutUser, theme, setThemeMode } = useContext(StoreContext);

  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-200 select-none ${scrolled
          ? "bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800 shadow-2xs backdrop-blur-md"
          : "bg-white/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800 backdrop-blur-sm"
          }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-extrabold text-white text-sm shadow-xs group-hover:scale-105 transition-transform">
              <img src={logo} alt="logo" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              BizPilot
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 bg-slate-100/60 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700">
            {navLinks.map((item) =>
              item.to ? (
                <Link
                  key={item.name}
                  to={item.to}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all shadow-2xs"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all shadow-2xs"
                >
                  {item.name}
                </a>
              )
            )}
          </nav>

          {/* Right Side Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle Button (Matches Dashboard Header) */}
            <button
              onClick={() => setThemeMode(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? (
                <IoSunnyOutline className="text-xl text-amber-400" />
              ) : (
                <IoMoonOutline className="text-xl text-slate-600" />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-bold text-white text-xs">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[120px] truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                    {user.name}
                  </span>
                  <IoChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${dropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-xl animate-fade-in z-50">
                    <div className="border-b border-slate-100 dark:border-slate-700 p-3">
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{user.name}</p>
                      <p className="truncate text-[11px] text-slate-400 mt-0.5">{user.email}</p>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdown(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors"
                      >
                        <IoSparklesOutline size={15} />
                        Dashboard Overview
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        onClick={() => setDropdown(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <IoSettingsOutline size={15} />
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 pt-1">
                      <button
                        onClick={() => {
                          logoutUser();
                          setDropdown(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      >
                        <IoLogOutOutline size={15} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="md" className="font-bold text-xs rounded-xl dark:text-slate-200">
                    Sign In
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="md" className="font-bold text-xs rounded-xl shadow-xs hover:shadow-md">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <IoMenu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 lg:hidden flex flex-col ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-extrabold text-white text-xs shadow-xs">
              BF
            </span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">BizFlow</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navLinks.map((item) =>
            item.to ? (
              <Link
                key={item.name}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {item.name}
              </a>
            )
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <button
            onClick={() => setThemeMode(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {theme === "dark" ? <IoSunnyOutline className="text-amber-400 text-base" /> : <IoMoonOutline className="text-slate-600 text-base" />}
            <span>{theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
          </button>
          <Link to="/dashboard" onClick={() => setOpen(false)}>
            <Button size="lg" className="w-full font-bold rounded-xl">
              Dashboard
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
}
