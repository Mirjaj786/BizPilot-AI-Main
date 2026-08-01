import { useContext } from "react";
import {
  HiOutlineChartPie,
  HiOutlineArrowTrendingUp,
  HiOutlineBanknotes,
  HiOutlineUsers,
  HiOutlineArrowDownTray,
} from "react-icons/hi2";
import { StoreContext } from "../../context/StoreContext.jsx";
import StatCard from "../../components/StatCard/StatCard.jsx";
import { RevenueOverviewYTDChart, BudgetVsSpendBarChart } from "../../components/Charts/Charts.jsx";
import Button from "../../components/Button/Button.jsx";
import { exportFinancialReportPDF } from "../../utils/reportGenerator.js";

export default function Analytics() {
  const context = useContext(StoreContext) || {};
  const customers = context.customers || [];
  const sales = context.sales || [];
  const settings = context.settings || {};
  const currency = settings.currency || "₹";

  const totalRev = sales.reduce((a, s) => a + (s.status === "Paid" ? Number(s.total || s.amount || 0) : 0), 0);
  const totalSalesCount = sales.length;
  const aov = totalSalesCount > 0 ? (totalRev / totalSalesCount) : 0;
  const paidSalesCount = sales.filter((s) => s.status === "Paid").length;
  const paidRatio = totalSalesCount > 0 ? ((paidSalesCount / totalSalesCount) * 100).toFixed(1) : 0;

  const getMonthlyTrend = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthMap = {};
    months.forEach((m) => { monthMap[m] = 0; });

    sales.forEach((s) => {
      const dateVal = s.saleDate || s.createdAt || s.date;
      if (dateVal) {
        const d = new Date(dateVal);
        if (!isNaN(d)) {
          const mName = months[d.getMonth()];
          monthMap[mName] += Number(s.total || s.amount || 0);
        }
      }
    });

    return months.map((m) => ({ month: m, revenue: monthMap[m] }));
  };

  const getPaymentMethodVolume = () => {
    const methodMap = {};
    sales.forEach((s) => {
      const m = s.paymentMethod || s.method || "Cash";
      methodMap[m] = (methodMap[m] || 0) + Number(s.total || s.amount || 0);
    });
    return Object.entries(methodMap).map(([name, value]) => ({ name, value }));
  };

  const getTopCustomers = () => {
    const custSpend = {};
    const custOrders = {};
    const custNameMap = {};

    sales.forEach((s) => {
      const cId = s.customer?._id || s.customer?.id || (typeof s.customer === "string" ? s.customer : "walk-in");
      const name = s.customer?.name || s.customerName || (typeof s.customer === "string" ? s.customer : "Walk-in Customer");
      const total = Number(s.total || s.amount || 0);

      custSpend[cId] = (custSpend[cId] || 0) + total;
      custOrders[cId] = (custOrders[cId] || 0) + 1;
      custNameMap[cId] = name;
    });

    const list = customers.map((c) => {
      const id = c._id || c.id;
      const spend = custSpend[id] !== undefined ? custSpend[id] : (c.totalSpent || 0);
      const orders = custOrders[id] !== undefined ? custOrders[id] : (c.ordersCount || 0);
      return {
        id,
        name: c.name,
        business: c.business || c.address?.city || "Individual",
        ordersCount: orders,
        totalSpent: spend,
      };
    });

    Object.keys(custSpend).forEach((cId) => {
      if (!list.some((item) => item.id === cId)) {
        list.push({
          id: cId,
          name: custNameMap[cId] || "Walk-in Customer",
          business: "Walk-in Client",
          ordersCount: custOrders[cId],
          totalSpent: custSpend[cId],
        });
      }
    });

    return list.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  };

  const topCustomers = getTopCustomers();
  const monthlyTrendData = getMonthlyTrend();
  const paymentMethodData = getPaymentMethodVolume();

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Executive Analytics & Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deep insights into business revenue velocity, margin metrics, and top spending accounts ({currency}).
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          icon={HiOutlineArrowDownTray}
          className="bg-white dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
          onClick={() => exportFinancialReportPDF({ sales, customers, settings })}
        >
          Export Financial Report (PDF)
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Gross Paid Revenue"
          value={`${currency}${totalRev.toLocaleString()}`}
          change={`${sales.length} transactions`}
          trend="up"
          timeframe="Live fetched sales"
          icon={HiOutlineBanknotes}
          badgeText="Real Data"
          badgeType="emerald"
        />
        <StatCard
          title="Average Order Value"
          value={`${currency}${aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={`${totalSalesCount} total checkouts`}
          trend="up"
          timeframe="across all tickets"
          icon={HiOutlineArrowTrendingUp}
          badgeText="Calculated"
          badgeType="blue"
        />
        <StatCard
          title="Paid Invoices Ratio"
          value={`${paidRatio}%`}
          change={`${paidSalesCount} paid of ${totalSalesCount}`}
          trend="up"
          timeframe="Settled payments"
          icon={HiOutlineChartPie}
          badgeText="Healthy Flow"
          badgeType="purple"
        />
        <StatCard
          title="Registered Clients"
          value={`${customers.length} Accounts`}
          change="CRM Directory"
          trend="up"
          timeframe="Active clients"
          icon={HiOutlineUsers}
          badgeText="High Loyalty"
          badgeType="emerald"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue Timeline Trend ({currency})</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Historical breakdown across calendar months</p>
            </div>
          </div>
          <RevenueOverviewYTDChart data={monthlyTrendData} currency={currency} height={320} />
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Sales Volume by Payment Method</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">UPI, Cash, Card & Bank Transfer distribution</p>
          </div>
          <div className="my-4">
            <BudgetVsSpendBarChart data={paymentMethodData} currency={currency} height={260} />
          </div>
        </div>
      </div>

      {/* Top Customers Leaderboard */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Grossing Client Accounts</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Highest lifetime value customers dynamically derived from sales</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-3">Rank</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Company / Segment</th>
                <th className="pb-3 text-right">Orders</th>
                <th className="pb-3 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {topCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    No client sales recorded yet.
                  </td>
                </tr>
              ) : (
                topCustomers.map((cust, idx) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 font-extrabold text-blue-600 dark:text-blue-400">#{idx + 1}</td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">{cust.name}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{cust.business || "Individual"}</td>
                    <td className="py-3 text-right text-slate-600 dark:text-slate-400">{cust.ordersCount || 0} checkouts</td>
                    <td className="py-3 text-right font-extrabold text-slate-900 dark:text-white">
                      {currency}{(cust.totalSpent || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

