import { Link } from "react-router-dom";
import { IoRocketOutline, IoMailOutline, IoCallOutline, IoTimeOutline } from "react-icons/io5";
import logo from "../../assets/BizPilot_AI_Logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 pt-16 pb-12 select-none transition-colors">
      <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-12">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 items-start">
          {/* Col 1: Brand & Vision */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-extrabold text-white text-sm shadow-xs overflow-hidden">
                <img src={logo} alt="BizPilot AI Logo" className="h-full w-full object-cover" />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                BizPilot AI
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs font-medium">
              The AI-powered Business Operating System replacing spreadsheets, calculators, and paper notebooks for small businesses.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
                <IoRocketOutline className="text-blue-600" />
                BizPilot AI Operating System v1.0
              </span>
            </div>
          </div>

          {/* Col 2: Platform Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-wider uppercase">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/dashboard/sales" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Sales & POS Billing
                </Link>
              </li>
              <li>
                <Link to="/dashboard/customers" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Customer Ledger CRM
                </Link>
              </li>
              <li>
                <Link to="/dashboard/tasks" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Task Management Board
                </Link>
              </li>
              <li>
                <Link to="/dashboard/ai" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  BizPilot AI Intelligence
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-wider uppercase">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Dashboard Overview
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Account Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Register Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Support Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-wider uppercase">
              Help & Support
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-medium">
              <li className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                <IoMailOutline className="text-blue-600 flex-shrink-0" size={16} />
                <span>support@bizpilotai.com</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                <IoCallOutline className="text-blue-600 flex-shrink-0" size={16} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                <IoTimeOutline className="text-blue-600 flex-shrink-0" size={16} />
                <span>Mon-Sat, 9AM - 6PM IST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <p>&copy; {new Date().getFullYear()} BizPilot AI. All rights reserved. Built with &hearts; by Mirjaj</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
