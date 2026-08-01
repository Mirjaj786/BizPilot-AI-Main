import { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  IoGridOutline,
  IoPeopleOutline,
  IoReceiptOutline,
  IoListOutline,
  IoBarChartOutline,
  IoSparklesOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { StoreContext } from "../../context/StoreContext.jsx";

import logo from "../../assets/BizPilot_AI_Logo.png";

const menuItems = [
  { path: "/dashboard", name: "Overview", icon: IoGridOutline },
  { path: "/dashboard/customers", name: "Customers", icon: IoPeopleOutline },
  { path: "/dashboard/sales", name: "Sales & POS", icon: IoReceiptOutline },
  { path: "/dashboard/tasks", name: "Task Board", icon: IoListOutline },
  { path: "/dashboard/analytics", name: "Analytics", icon: IoBarChartOutline },
  { path: "/dashboard/ai", name: "BizPilot AI", icon: IoSparklesOutline, highlight: true },
  { path: "/dashboard/settings", name: "Settings", icon: IoSettingsOutline },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  onLogout,
}) {
  const location = useLocation();
  const { user } = useContext(StoreContext);

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#0F172A] text-white border-r border-slate-800 transition-all duration-300 ease-in-out ${collapsed ? "w-20" : "w-64"
          } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800/80">
          <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-blue-600/30 flex items-center justify-center text-white font-extrabold shadow-md shrink-0 overflow-hidden border border-blue-500/30">
              <img src={logo} alt="BizPilot AI Logo" className="h-full w-full object-cover" />
            </div>
            {!collapsed && (
              <span className="font-extrabold text-white text-lg tracking-tight">
                BizPilot AI
              </span>
            )}
          </NavLink>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {collapsed ? <IoChevronForwardOutline size={18} /> : <IoChevronBackOutline size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex lg:hidden items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-150 group cursor-pointer ${isActive
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : item.highlight
                    ? "text-purple-400 hover:bg-purple-950/40 hover:text-purple-300"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`text-lg shrink-0 ${isActive ? "text-white" : item.highlight ? "text-purple-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-800/80 flex items-center justify-between">
          <NavLink
            to="/dashboard/settings"
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/60 transition-colors min-w-0 flex-1"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt="Avatar"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/40 shrink-0"
            />
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">
                  {user?.name || "Alex Morgan"}
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  {user?.role || "Owner"}
                </span>
              </div>
            )}
          </NavLink>

          {onLogout && !collapsed && (
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
              title="Logout"
            >
              <IoLogOutOutline size={18} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
