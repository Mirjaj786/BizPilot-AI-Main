import { useState, useContext, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  HiBars3,
  HiMagnifyingGlass,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineXMark,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { StoreContext } from "../../context/StoreContext.jsx";

export default function Header({ setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const {
    user,
    theme,
    setThemeMode,
    logoutUser,
    customers = [],
    sales = [],
    tasks = [],
  } = useContext(StoreContext);

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const routeTitles = {
    "/dashboard": "Dashboard Overview",
    "/dashboard/customers": "Customer CRM",
    "/dashboard/sales": "POS Billing Terminal",
    "/dashboard/tasks": "Tasks & Workflow",
    "/dashboard/ai": "BizPilot AI Copilot",
    "/dashboard/analytics": "Executive Analytics",
    "/dashboard/settings": "Business Settings",
    "/customers": "Customer CRM",
    "/sales": "POS Billing Terminal",
    "/tasks": "Tasks & Workflow",
    "/ai": "BizPilot AI Copilot",
    "/analytics": "Executive Analytics",
    "/settings": "Business Settings",
  };

  const currentTitle = routeTitles[location.pathname] || "Dashboard";

  // Cmd+K / Ctrl+K focus shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter search results
  const q = searchQuery.trim().toLowerCase();
  const matchingCustomers = q
    ? customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.email?.toLowerCase().includes(q)
    ).slice(0, 3)
    : [];

  const matchingSales = q
    ? sales.filter(
      (s) =>
        s.invoiceNo?.toLowerCase().includes(q) ||
        s.customer?.name?.toLowerCase().includes(q) ||
        s.customerName?.toLowerCase().includes(q)
    ).slice(0, 3)
    : [];

  const matchingTasks = q
    ? tasks.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
    ).slice(0, 3)
    : [];

  const hasResults =
    matchingCustomers.length > 0 || matchingSales.length > 0 || matchingTasks.length > 0;

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <HiBars3 className="text-2xl" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            {currentTitle}
          </h1>
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 hidden sm:block">
            BizPilot AI Management Workspace
          </p>
        </div>
      </div>

      {/* Middle: Search Input */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden md:block">
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Quick search customers, invoices, or tasks... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="w-full pl-10 pr-10 py-2 text-xs rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <HiOutlineXMark className="text-sm" />
            </button>
          ) : (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {searchFocused && searchQuery.trim() && (
          <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-fade-in max-h-96 overflow-y-auto">
            {!hasResults ? (
              <div className="px-4 py-3 text-xs text-slate-400 text-center">
                No matching customers, invoices, or tasks found.
              </div>
            ) : (
              <div className="space-y-3">
                {matchingCustomers.length > 0 && (
                  <div>
                    <div className="px-4 pb-1 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <HiOutlineUserGroup className="text-blue-500" /> Customers
                    </div>
                    {matchingCustomers.map((c) => (
                      <Link
                        key={c._id || c.id}
                        to="/dashboard/customers"
                        onClick={() => { setSearchFocused(false); setSearchQuery(""); }}
                        className="px-4 py-2 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                        <span className="text-slate-400">{c.phone}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {matchingSales.length > 0 && (
                  <div>
                    <div className="px-4 pb-1 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <HiOutlineDocumentText className="text-emerald-500" /> Invoices
                    </div>
                    {matchingSales.map((s) => (
                      <Link
                        key={s._id || s.id}
                        to="/dashboard/sales"
                        onClick={() => { setSearchFocused(false); setSearchQuery(""); }}
                        className="px-4 py-2 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{s.invoiceNo || s.id}</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">₹{(s.total || s.amount || 0).toLocaleString()}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {matchingTasks.length > 0 && (
                  <div>
                    <div className="px-4 pb-1 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <HiOutlineCheckCircle className="text-purple-500" /> Tasks
                    </div>
                    {matchingTasks.map((t) => (
                      <Link
                        key={t.id || t._id}
                        to="/dashboard/tasks"
                        onClick={() => { setSearchFocused(false); setSearchQuery(""); }}
                        className="px-4 py-2 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <span className="font-bold text-slate-900 dark:text-white truncate">{t.title}</span>
                        <span className="text-slate-400">{t.priority}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Mode Toggle */}
        <button
          onClick={() => setThemeMode(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? <HiOutlineSun className="text-xl text-amber-400" /> : <HiOutlineMoon className="text-xl text-slate-600" />}
        </button>

        <Link
          to={"/home"}
          className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/60 transition-all shadow-2xs"
        >Home</Link>

        {/* Quick AI button */}
        <Link
          to="/dashboard/ai"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800 rounded-xl transition-colors shrink-0 whitespace-nowrap"
        >
          <HiOutlineSparkles className="text-blue-600 dark:text-blue-400 text-sm shrink-0" />
          <span>Ask AI</span>
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.fullName || user?.name || "Owner"}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <HiOutlineUser className="text-base text-slate-500" />
                  <span>Profile & Business</span>
                </Link>
                <Link
                  to="/dashboard/settings"
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
                    if (window.confirm("Are you sure you want to sign out?")) {
                      setProfileOpen(false);
                      if (logoutUser) logoutUser();
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
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
