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
  IoMicOutline,
  IoLogoWhatsapp,
  IoDocumentTextOutline,
} from "react-icons/io5";

export default function Home() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white transition-colors">
      <Navbar />

      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-purple-600/15 to-transparent blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-bold shadow-2xs">
              <IoSparklesOutline className="text-blue-600 dark:text-blue-400 text-base" />
              <span>Smart Business Operating System & AI Copilot</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              Turn daily shop sales into <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">real-time AI growth.</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Replace paper notebooks and manual calculations. BizPilot AI combines 1-click POS billing, instant WhatsApp receipts, customer CRM ledgers, and a voice-enabled AI copilot into one unified workspace.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto text-base font-extrabold px-8 py-4 rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all"
                onClick={() => navigate("/dashboard")}
              >
                Launch Workspace
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base font-bold px-8 py-4 rounded-2xl"
                onClick={() => navigate("/login")}
              >
                Sign In to Account
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold pt-2">
              <span className="flex items-center gap-1.5"><IoCheckmarkCircleOutline className="text-emerald-500 text-base" /> No setup fee</span>
              <span className="flex items-center gap-1.5"><IoCheckmarkCircleOutline className="text-emerald-500 text-base" /> Instant 2-min setup</span>
              <span className="flex items-center gap-1.5"><IoCheckmarkCircleOutline className="text-emerald-500 text-base" /> Local & Cloud Sync</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center animate-fade-in">
            <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-2xl backdrop-blur-md overflow-hidden floating">
              <img
                src={bizflowVisual}
                alt="BizPilot AI Visual Dashboard"
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
              Engineered for merchant speed, CRM control & revenue
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">
              Everything your retail store needs to operate efficiently and grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: IoMicOutline, title: "Voice AI Speech Copilot", desc: "Speak or type to consult AI. Get direct line-by-line answers about sales, top buyers, and stock levels." },
              { icon: IoReceiptOutline, title: "POS Billing & WhatsApp Share", desc: "Generate thermal receipts or send formatted digital bills to customers directly via WhatsApp." },
              { icon: IoPeopleOutline, title: "Customer Ledger CRM", desc: "Track VIP accounts, purchase histories, and overdue balances with 1-click payment reminders." },
              { icon: IoDocumentTextOutline, title: "Executive Financial Reports", desc: "Export professional PDF financial reports, weekly trend charts, and payment channel volumes." },
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

      {/* ── EVERYTHING YOUR STORE NEEDS SECTION ── */}
      <section id="why-us" className="py-20 max-w-[1280px] mx-auto px-6 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            Why BizPilot AI?
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything Your Store Needs To Scale
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
            Designed from the ground up for modern retail merchants. Built for speed, clarity, and profit growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: "🛒", title: "Smart POS Billing", desc: "Create thermal invoices & digital receipts in seconds. Fast checkout with walk-in client support." },
            { icon: "👥", title: "Customer CRM & Credit", desc: "Keep clear track of customer ledgers, unpaid dues, and send 1-click WhatsApp payment reminders." },
            { icon: "🤖", title: "AI Business Consultant", desc: "Get real-time diagnostic advice on stock movement, peak sales days, and dues collection." },
            { icon: "🎤", title: "Voice AI Speech Assistant", desc: "Talk naturally to your AI store manager using Web Speech. Hands-free operational insights." },
            { icon: "📊", title: "Live Store Analytics", desc: "Visualize weekly sales trends, best-selling inventory items, and payment channel breakdowns." },
            { icon: "📄", title: "Executive PDF Reports", desc: "Generate professional corporate-grade PDF financial summaries for accounting and bank loans." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">{item.icon}</div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMING SOON ROADMAP ── */}
      <section className="py-20 bg-slate-900 text-white border-t border-slate-800 transition-colors">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-extrabold uppercase tracking-wider">
              🚀 Product Roadmap
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Coming Soon to BizPilot AI
            </h2>
            <p className="text-slate-400 font-medium text-base">
              We are continuously expanding BizPilot AI to empower retail merchants everywhere.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { title: "AI Data Migration Assistant", tag: "LIVE NOW ✨" },
              { title: "Google OAuth Login", tag: "LIVE NOW ✨" },
              { title: "Mobile Commerce & Payment Ecosystem", tag: "Q4 2026" },
              { title: "BizPilot Mobile App", tag: "Q4 2026" },
              { title: "Multi-Store Management", tag: "Q3 2026" },
              { title: "Barcode & SKU Scanner", tag: "Q3 2026" },
              { title: "Advanced Stock Tracking", tag: "Q3 2026" },
              { title: "WhatsApp Business API", tag: "Q4 2026" },
              { title: "Automated GST Filing", tag: "Q4 2026" },
              { title: "Offline Multi-Counter Sync", tag: "Q4 2026" },
            ].map((road, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-3"
              >
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/50 px-2.5 py-1 rounded-lg w-fit">
                  {road.tag}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-100">{road.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
