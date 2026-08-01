import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import bizflowVisual from "../../assets/bizflow_visual.png";
import Button from "../../components/Button/Button.jsx";
import {
  IoSparklesOutline,
  IoCheckmarkCircleOutline,
  IoArrowForwardOutline,
  IoReceiptOutline,
  IoPeopleOutline,
  IoListOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

export default function Home() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white transition-colors">
      {/* Global Brand Navbar */}
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-purple-600/15 to-transparent blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-bold shadow-2xs">
              <IoSparklesOutline className="text-blue-600 dark:text-blue-400 text-base" />
              <span>Next-Gen Operating System for Local Merchants</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              Run your shop with <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">real-time AI</span> clarity.
            </h1>

            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Replace paper notebooks, Excel sheets, and manual invoice calculations. BizFlow brings POS billing, customer ledger CRM, tasks, and AI insights into one unified dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto text-base font-extrabold px-8 py-4 rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all"
                onClick={() => navigate("/dashboard")}
              >
                Get Started Free <IoArrowForwardOutline className="ml-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base font-bold px-8 py-4 rounded-2xl"
                onClick={() => navigate("/login")}
              >
                Sign In to Workspace
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold pt-2">
              <span className="flex items-center gap-1.5"><IoCheckmarkCircleOutline className="text-emerald-500 text-base" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><IoCheckmarkCircleOutline className="text-emerald-500 text-base" /> Instant 2-min setup</span>
              <span className="flex items-center gap-1.5"><IoCheckmarkCircleOutline className="text-emerald-500 text-base" /> Full local storage backup</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic */}
          <div className="lg:col-span-5 relative flex items-center justify-center animate-fade-in">
            <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-2xl backdrop-blur-md overflow-hidden floating">
              <img
                src={bizflowVisual}
                alt="BizFlow Visual Dashboard"
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-[1280px] mx-auto px-6 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built for speed, accuracy & shop growth
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">
              Four core tools in one seamless operating environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: IoReceiptOutline, title: "1-Click POS Billing", desc: "Generate GST/standard thermal receipts in seconds. Select client, add items, and print." },
              { icon: IoPeopleOutline, title: "Customer Ledger CRM", desc: "Track VIP clients, order volume, and pending dues with automated payment reminders." },
              { icon: IoListOutline, title: "Operational Task Board", desc: "Keep shop tasks organized by priority. Checklists for restock, expiry audits, and GST filings." },
              { icon: IoSparklesOutline, title: "BizFlow AI Copilot", desc: "Ask AI questions about your revenue, best customers, and inventory safety thresholds." },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-2xs hover:shadow-md group"
                >
                  <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl mb-6 shadow-xs group-hover:scale-110 transition-transform">
                    <Icon />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="py-20 max-w-[1280px] mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simple, predictable pricing
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
            Start for free, scale as your business grows.
          </p>

          <div className="inline-flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 mt-4">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === "monthly" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs" : "text-slate-500"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === "yearly" ? "bg-blue-600 text-white shadow-2xs" : "text-slate-500"
              }`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: "Starter", price: "₹0", period: "forever free", desc: "For single-counter shops starting digital tracking.", features: ["Up to 100 sales/mo", "Basic Customer CRM", "Local Data Sync", "Standard Invoice Print"] },
            { name: "Pro Merchant", price: billingCycle === "yearly" ? "₹799" : "₹999", period: "per month", popular: true, desc: "For growing stores needing AI analytics & unlimited POS.", features: ["Unlimited Sales & Invoices", "Full AI Copilot Insights", "WhatsApp Payment Links", "Priority Store Task Board", "Export Reports to Excel"] },
            { name: "Multi-Store Enterprise", price: billingCycle === "yearly" ? "₹1,999" : "₹2,499", period: "per month", desc: "For multi-branch retail chains with staff permissions.", features: ["Multi-Branch Inventory", "Staff Permission Roles", "Dedicated Account Manager", "Custom Tax Integration"] },
          ].map((plan, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-b from-blue-600 to-indigo-700 text-white border-blue-500 shadow-xl scale-105 relative"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xs"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-xl font-extrabold mb-1">{plan.name}</h3>
                <p className={`text-xs mb-6 font-medium ${plan.popular ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className={`text-xs font-semibold ${plan.popular ? "text-blue-200" : "text-slate-400"}`}>/{plan.period}</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm font-medium mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <IoShieldCheckmarkOutline className={`text-base shrink-0 ${plan.popular ? "text-amber-300" : "text-blue-600"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant={plan.popular ? "secondary" : "primary"}
                size="lg"
                className={`w-full font-extrabold rounded-2xl py-3 ${plan.popular ? "!bg-white !text-slate-900 hover:!bg-slate-100" : ""}`}
                onClick={() => navigate("/dashboard")}
              >
                Choose {plan.name}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}
