import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";
import StatCard from "../../components/StatCard/StatCard.jsx";
import { RevenueAreaChart } from "../../components/Charts/Charts.jsx";
import Button from "../../components/Button/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";
import InvoiceModal from "../../components/ui/InvoiceModal.jsx";
import {
  IoCashOutline, IoPeopleOutline, IoCheckboxOutline, IoAlertCircleOutline,
  IoArrowForwardOutline, IoPrintOutline, IoReceiptOutline, IoPersonAddOutline,
  IoAddCircleOutline, IoSparklesOutline, IoCartOutline, IoCheckmarkCircleOutline,
  IoPulseOutline, IoShieldCheckmarkOutline,
} from "react-icons/io5";

const QUICK_ACTIONS = [
  { to: "/dashboard/sales", label: "Create sale", icon: IoReceiptOutline },
  { to: "/dashboard/customers", label: "Add client", icon: IoPersonAddOutline },
  { to: "/dashboard/tasks", label: "Add task", icon: IoAddCircleOutline },
  { to: "/dashboard/ai", label: "Ask AI", icon: IoSparklesOutline, accent: true },
];

const PRIORITY_BADGE = { High: "danger", Medium: "warning", Low: "neutral" };

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, customers, sales, tasks, settings, saveTasks } = useContext(StoreContext);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showHealthModal, setShowHealthModal] = useState(false);

  const totalRevenue = sales.reduce((a, s) => a + (s.status === "Paid" ? Number(s.total || s.amount || 0) : 0), 0);
  const totalDues = sales.filter((s) => s.status === "Unpaid" || s.status === "Pending").reduce((a, s) => a + Number(s.total || s.amount || 0), 0);
  const pendingTasks = tasks.filter((t) => t.status === "Pending" || t.status === "todo").length;
  const recentSalesList = [...sales].slice(0, 5);
  const activeTasks = tasks.filter((t) => t.status === "Pending" || t.status === "todo").slice(0, 4);
  const currency = settings?.currency || "₹";

  const handleToggleTask = (taskId) => {
    saveTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: t.status === "Completed" || t.status === "completed" ? "Pending" : "Completed" } : t)));
  };

  const getSalesChartData = () => {
    const map = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      map[key] = { name: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), revenue: 0 };
    }
    sales.forEach((s) => {
      let sDate = "";
      if (s.saleDate) {
        const d = new Date(s.saleDate);
        if (!isNaN(d)) sDate = d.toISOString().split("T")[0];
      } else if (s.createdAt) {
        const d = new Date(s.createdAt);
        if (!isNaN(d)) sDate = d.toISOString().split("T")[0];
      } else if (s.date) {
        sDate = s.date.split(" ")[0];
      }
      if (map[sDate]) map[sDate].revenue += Number(s.total || s.amount || 0);
    });
    return Object.values(map);
  };

  return (
    <div className="space-y-6 lg:space-y-8 pb-8 font-sans">
      {/* ── SECTION 1: Welcome Banner ── */}
      <Card className="!p-6 sm:!p-8 bg-gradient-to-r from-white via-slate-50/70 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 h-56 w-56 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800 px-3.5 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse-soft" />
                Live Workspace
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back, {user?.name?.split(" ")[0] || "Owner"} 👋
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Here is your operational summary for <span className="font-bold text-slate-800 dark:text-slate-200">{settings?.businessName || user?.businessName || "My Business"}</span>.
              </p>
            </div>

            {/* Metric Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 rounded-xl px-4 py-2 shadow-2xs text-xs sm:text-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">Total Revenue:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{currency}{totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 rounded-xl px-4 py-2 shadow-2xs text-xs sm:text-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">Active Clients:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{customers.length}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 rounded-xl px-4 py-2 shadow-2xs text-xs sm:text-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">Open Tasks:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{pendingTasks} tasks</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <Button size="lg" className="px-5 py-3 font-bold rounded-xl shadow-xs shrink-0 whitespace-nowrap flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" onClick={() => setShowHealthModal(true)}>
            <IoPulseOutline size={20} className="animate-pulse" /> Run AI Health Scan
          </Button>
          <Button size="lg" variant="outline" className="px-5 py-3 font-bold rounded-xl shrink-0 whitespace-nowrap flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard/sales")}>
            <IoCartOutline size={20} /> New Transaction
          </Button>
          <Button size="lg" variant="outline" className="px-5 py-3 font-bold rounded-xl shrink-0 whitespace-nowrap flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard/ai")}>
            <IoSparklesOutline size={20} className="text-purple-500" /> Ask BizPilot AI
          </Button>
        </div>
      </Card>

      {/* ── SECTION 2: KPI Metrics Cards ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total revenue" value={`${currency}${totalRevenue.toLocaleString()}`} icon={IoCashOutline} trend="+14.2%" trendType="up" subtext="lifetime sales" colorScheme="green" />
        <StatCard title="Outstanding dues" value={`${currency}${totalDues.toLocaleString()}`} icon={IoAlertCircleOutline} trend={totalDues > 0 ? "Followup due" : "Settled"} trendType={totalDues > 0 ? "down" : "up"} subtext="unpaid invoices" colorScheme="red" />
        <StatCard title="Registered clients" value={customers.length.toString()} icon={IoPeopleOutline} trend="+3 new" trendType="up" subtext="in CRM directory" colorScheme="blue" />
        <StatCard title="Pending tasks" value={pendingTasks.toString()} icon={IoCheckboxOutline} trend={pendingTasks > 0 ? "In progress" : "All completed"} trendType={pendingTasks > 0 ? "neutral" : "up"} subtext="open action items" colorScheme="orange" />
      </div>

      {/* ── SECTION 3: Revenue Analytics & Side Widgets ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <Card className="lg:col-span-8 flex flex-col justify-between !p-6 sm:!p-7">
          <SectionHeader title="Revenue analytics" subtitle="Daily breakdown for the last 7 days">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5">
              7-Day Trend
            </span>
          </SectionHeader>
          <div className="pt-3">
            <RevenueAreaChart data={getSalesChartData()} currency={currency} />
          </div>
        </Card>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="!p-6 flex-1">
            <SectionHeader title="Quick actions" subtitle="Shortcuts for fast workflow" />
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map(({ to, label, icon: Icon, accent }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center justify-center gap-2.5 rounded-2xl border p-4 text-center transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-[0.98] ${accent
                    ? "border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-50 text-purple-700 dark:text-purple-300"
                    : "border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    }`}
                >
                  <Icon size={22} className={accent ? "text-purple-600 dark:text-purple-400" : "text-blue-600 dark:text-blue-400"} />
                  <span className="text-xs font-bold">{label}</span>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="!p-6 flex-1">
            <SectionHeader title="Priority tasks" subtitle="Items needing your desk attention">
              <Link to="/dashboard/tasks" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                View all <IoArrowForwardOutline size={12} />
              </Link>
            </SectionHeader>

            {activeTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/60 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                <IoCheckmarkCircleOutline size={30} className="text-emerald-500 mb-1.5" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">All tasks completed!</span>
                <span className="text-[11px] text-slate-400 mt-0.5">Nice job staying ahead of schedule.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={t.status === "Completed" || t.status === "completed"}
                      onChange={() => handleToggleTask(t.id)}
                      className="bf-checkbox mt-0.5 cursor-pointer"
                      title="Mark done"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{t.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Due: {t.dueDate}</p>
                    </div>
                    <Badge variant={PRIORITY_BADGE[t.priority] || "neutral"}>{t.priority}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ── SECTION 4: Recent Transactions Table ── */}
      <Card className="!p-6 sm:!p-7">
        <SectionHeader title="Recent transactions" subtitle="Most recent billing records">
          <Link to="/dashboard/sales">
            <Button size="md" variant="outline" className="font-bold rounded-xl text-xs px-4 py-2">
              Manage sales →
            </Button>
          </Link>
        </SectionHeader>

        {sales.length === 0 ? (
          <EmptyState
            icon={IoCartOutline}
            title="No transactions logged yet"
            description='Click "New Transaction" above to generate your first invoice.'
          />
        ) : (
          <div className="-mx-6 -mb-6 sm:-mx-7 sm:-mb-7 overflow-x-auto">
            <table className="bf-table">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Payment Method</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentSalesList.map((s) => (
                  <tr key={s._id || s.id}>
                    <td className="font-extrabold text-slate-900 dark:text-white font-mono text-xs">{s.invoiceNo || s._id || s.id}</td>
                    <td className="font-semibold text-slate-800 dark:text-slate-200">
                      {s.customer?.name || s.customerName || (typeof s.customer === "string" ? s.customer : "Walk-in Customer")}
                    </td>
                    <td className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                      {s.saleDate ? new Date(s.saleDate).toLocaleDateString() : s.date || "N/A"}
                    </td>
                    <td><Badge variant="neutral">{s.paymentMethod || s.method || "Cash"}</Badge></td>
                    <td className="font-bold text-slate-900 dark:text-white">{currency}{(s.total || s.amount || 0).toLocaleString()}</td>
                    <td><Badge variant={s.status === "Paid" ? "success" : s.status === "Pending" || s.status === "Unpaid" ? "warning" : "danger"}>{s.status}</Badge></td>
                    <td className="text-right">
                      <button
                        onClick={() => setSelectedInvoice(s)}
                        className="inline-flex items-center gap-1 rounded-lg p-2 text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                        title="View & print invoice"
                      >
                        <IoPrintOutline size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Invoice Print Modal */}
      {selectedInvoice && (
        <InvoiceModal invoice={selectedInvoice} settings={settings} onClose={() => setSelectedInvoice(null)} />
      )}

      {/* ── AI STORE HEALTH & RISK DIAGNOSTIC MODAL ── */}
      {showHealthModal && (
        <Modal title="AI Store Health & Risk Diagnostics" maxWidth="max-w-lg" top="top-10" onClose={() => setShowHealthModal(false)}>
          <div className="space-y-6 font-sans">
            {/* Health Score Header Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Overall Business Health Score</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black">{totalDues === 0 ? "96" : totalDues < 2000 ? "91" : "82"}</span>
                  <span className="text-sm font-bold text-blue-200">/ 100</span>
                </div>
                <p className="text-xs text-blue-100 mt-1 font-medium">
                  {totalDues === 0 ? "Optimal Store Health • Low Financial Exposure" : "Strong Revenue • Moderate Pending Credit Exposure"}
                </p>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-2xl shrink-0">
                <IoPulseOutline className="animate-pulse text-amber-300" size={32} />
              </div>
            </div>

            {/* Indicator Progress Bars */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Key Store Performance Indicators</h4>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Cash Settlement Ratio</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">{sales.length > 0 ? ((sales.filter(s => s.status === 'Paid').length / sales.length) * 100).toFixed(0) : 100}% Paid</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${sales.length > 0 ? (sales.filter(s => s.status === 'Paid').length / sales.length) * 100 : 100}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Credit Risk Exposure</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">{totalRevenue > 0 ? ((totalDues / (totalRevenue + totalDues)) * 100).toFixed(1) : 0}% Dues</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${totalRevenue > 0 ? Math.min(100, (totalDues / (totalRevenue + totalDues)) * 100) : 0}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Store Tasks Completion</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono">{tasks.length > 0 ? (((tasks.length - pendingTasks) / tasks.length) * 100).toFixed(0) : 100}% Done</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${tasks.length > 0 ? ((tasks.length - pendingTasks) / tasks.length) * 100 : 100}%` }} />
                </div>
              </div>
            </div>

            {/* 3 Strategic Advice Cards */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider">AI Executive Action Advice</h4>

              <div className="p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 flex items-start gap-3">
                <IoAlertCircleOutline size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-slate-900 dark:text-white">Recover Outstanding Dues ({currency}{totalDues.toLocaleString()})</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">Send 1-click WhatsApp payment reminders to accounts with open balances to increase working capital.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 flex items-start gap-3">
                <IoSparklesOutline size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-slate-900 dark:text-white">Consult BizPilot AI Voice Copilot</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">Ask questions about top grossing clients and peak revenue days to optimize store inventory.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-start gap-3">
                <IoShieldCheckmarkOutline size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-slate-900 dark:text-white">Generate Executive PDF Reports</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">Export corporate financial report summaries from the Analytics page for accounting and GST review.</p>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Modal Actions */}
            <div className="sticky -bottom-1 bg-white dark:bg-slate-900 pt-3 pb-1 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button onClick={() => setShowHealthModal(false)} className="w-full font-bold py-2.5">
                Close Health Diagnostics
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
