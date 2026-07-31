import { useState, useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  HiBars3,
  HiMagnifyingGlass,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi2";
import { StoreContext } from "../../context/StoreContext.jsx";

export default function Header({ setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, notifications, markAllNotificationsRead, theme, setThemeMode, logoutUser } = useContext(StoreContext);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const routeTitles = {
    "/dashboard": "Dashboard Overview",
    "/dashboard/customers": "Customer CRM",
    "/dashboard/sales": "POS Billing Terminal",
    "/dashboard/tasks": "Tasks & Workflow",
    "/dashboard/ai": "BizFlow AI Copilot",
    "/dashboard/analytics": "Executive Analytics",
    "/dashboard/settings": "Business Settings",
    "/customers": "Customer CRM",
    "/sales": "POS Billing Terminal",
    "/tasks": "Tasks & Workflow",
    "/ai": "BizFlow AI Copilot",
    "/analytics": "Executive Analytics",
    "/settings": "Business Settings",
  };

  const currentTitle = routeTitles[location.pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left section: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <HiBars3 className="text-xl" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="hidden sm:inline">BizFlow</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-600">/</span>
          <h1 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Middle section: Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            placeholder="Search customers, orders, products... (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-12 py-1.5 bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 focus:bg-white dark:focus:bg-slate-900 text-xs text-slate-900 dark:text-white rounded-lg border border-slate-200/60 dark:border-slate-700 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right section: Theme Toggle, Ask AI, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dual Segmented Theme Selector Buttons */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setThemeMode("light")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              theme === "light"
                ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-300"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Switch entire dashboard to White Theme"
          >
            <HiOutlineSun className="text-amber-500 text-sm" />
            <span className="hidden sm:inline">White</span>
          </button>
          <button
            onClick={() => setThemeMode("dark")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              theme === "dark"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Switch entire dashboard to Dark Mode"
          >
            <HiOutlineMoon className="text-indigo-300 text-sm" />
            <span className="hidden sm:inline">Dark</span>
          </button>
        </div>

        {/* Quick AI button */}
        <Link
          to="/ai"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800 rounded-lg transition-colors"
        >
          <HiOutlineSparkles className="text-blue-600 dark:text-blue-400 text-sm" />
          <span>Ask AI</span>
        </Link>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <HiOutlineBell className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-fade-in">
              <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Mark read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      n.unread ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                    }`}
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{n.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt="User"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/20"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <HiOutlineUser className="text-base text-slate-500" />
                  <span>Profile & Business</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <HiOutlineCog6Tooth className="text-base text-slate-500" />
                  <span>Preferences</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    if (logoutUser) logoutUser();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                >
                  <HiOutlineArrowLeftOnRectangle className="text-base" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
