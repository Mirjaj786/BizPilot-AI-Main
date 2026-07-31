import { Link } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { HiCheckCircle } from "react-icons/hi2";
import logo from "../../assets/BizPilot_AI_Logo.png";

export default function AuthLayout({ children, title = "Welcome to BizPilot AI", subtitle = "Manage your sales, CRM & inventory in one place." }) {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-colors">
      <Link
        to="/"
        className="fixed left-6 top-6 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all z-20"
      >
        <IoArrowBackOutline size={16} />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] relative z-10">
        {/* Left Column: Form Content */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs overflow-hidden">
                <img src={logo} alt="BizPilot AI Logo" className="h-full w-full object-cover" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                BizPilot AI
              </span>
            </Link>

            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{subtitle}</p>
              )}
            </div>

            {children}
          </div>

          <div className="mt-8 text-center sm:text-left text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} BizPilot AI SaaS Inc. All rights reserved. Built for modern merchants.
          </div>
        </div>

        {/* Right Column: Premium SaaS Showcase */}
        <div className="hidden lg:flex lg:col-span-6 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-semibold text-blue-400 mb-6">
              ⚡ Smart Business Operating System
            </span>
            <h3 className="text-3xl font-extrabold leading-tight tracking-tight text-white mb-4">
              Everything your local business needs in one sleek dashboard.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Replace messy notebooks, Excel sheets, and manual invoice tracking with real-time POS, automated CRM, and AI insights.
            </p>

            <div className="mt-8 space-y-3.5">
              {[
                "1-Click POS Billing & Digital Invoices",
                "Automated Customer CRM & Debt Reminders",
                "AI-Powered Sales & Stock Analytics",
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                  <HiCheckCircle className="text-blue-400 text-lg shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Testimonial"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/40"
              />
              <div>
                <p className="text-xs font-semibold text-white">
                  "BizFlow cut our daily inventory & checkout time by 60%."
                </p>
                <p className="text-[11px] text-slate-400">
                  Sophia Chen — Founder, Artisan Cafe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
