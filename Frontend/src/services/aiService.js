import { apiFetch } from "./api.js";

export const aiService = {
  askAI: async (query, language = "en") => {
    try {
      const res = await apiFetch("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message: query, language }),
      });

      if (res?.data?.response) {
        return res.data.response;
      }
    } catch (err) {
      console.warn("Backend AI endpoint unavailable or error, using local business engine fallback:", err);
    }

    const salesData = localStorage.getItem("bf_sales");
    const customersData = localStorage.getItem("bf_customers");
    const tasksData = localStorage.getItem("bf_tasks");
    const settingsData = localStorage.getItem("bf_settings");

    const sales = salesData ? JSON.parse(salesData) : [];
    const customers = customersData ? JSON.parse(customersData) : [];
    const tasks = tasksData ? JSON.parse(tasksData) : [];
    const settings = settingsData ? JSON.parse(settingsData) : { businessType: "Retail Shop", businessName: "My Business", currency: "₹" };

    const currency = settings.currency || "₹";
    const q = query.toLowerCase();

    // 1. SALES ANALYSIS
    if (q.includes("sale") || q.includes("revenue") || q.includes("earn") || q.includes("money") || q.includes("income") || q.includes("sold") || q.includes("transaction")) {
      const totalRevenue = sales.reduce((acc, curr) => acc + (curr.status === "Paid" ? Number(curr.total || curr.amount || 0) : 0), 0);
      const unpaidRevenue = sales.filter(s => s.status === "Pending" || s.status === "Unpaid").reduce((acc, curr) => acc + Number(curr.total || curr.amount || 0), 0);

      const upiSales = sales.filter(s => s.paymentMethod === "UPI").reduce((acc, curr) => acc + Number(curr.total || curr.amount || 0), 0);
      const cashSales = sales.filter(s => s.paymentMethod === "Cash").reduce((acc, curr) => acc + Number(curr.total || curr.amount || 0), 0);
      const cardSales = sales.filter(s => s.paymentMethod === "Card" || s.paymentMethod === "Bank Transfer").reduce((acc, curr) => acc + Number(curr.total || curr.amount || 0), 0);

      return `### 📊 Live Sales & Revenue Diagnostics for **${settings.businessName}**

      I have analyzed your **${sales.length} backend sales records**:

      - 💰 **Gross Paid Revenue:** **${currency}${totalRevenue.toLocaleString()}**
      - ⚠️ **Pending / Unpaid Invoices:** **${currency}${unpaidRevenue.toLocaleString()}**

      **Payment Channel Breakdown:**
      - 📱 **UPI / Digital:** ${currency}${upiSales.toLocaleString()}
      - 💵 **Cash Sales:** ${currency}${cashSales.toLocaleString()}
      - 💳 **Card & Bank Transfers:** ${currency}${cardSales.toLocaleString()}

      **BizPilot Copilot Action:** 
      *You have **${currency}${unpaidRevenue.toLocaleString()}** in pending sales. Go to **Customers** or **Tasks** page to issue WhatsApp reminders to your accounts.*`;
    }

    // 2. CUSTOMERS CRM ANALYSIS
    if (q.includes("customer") || q.includes("client") || q.includes("crm") || q.includes("buyer") || q.includes("best") || q.includes("spent")) {
      if (customers.length === 0 && sales.length === 0) {
        return `### 👥 Customer Insights
        You currently have no customer entries registered. Go to the **Customers** page or record sales to view top accounts!`;
      }

      const customerSpending = {};
      sales.forEach(sale => {
        const name = sale.customer?.name || sale.customerName || (typeof sale.customer === "string" ? sale.customer : "Walk-in Customer");
        customerSpending[name] = (customerSpending[name] || 0) + Number(sale.total || sale.amount || 0);
      });

      const sortedCusts = Object.entries(customerSpending).sort((a, b) => b[1] - a[1]);
      const topSpender = sortedCusts[0] || ["Walk-in Customer", 0];

      return `### 👥 Client Account Copilot Analysis

      You have **${customers.length} registered clients** and **${sales.length} checkout records**.

      🌟 **Top Spending Client Account:**
      - **${topSpender[0]}** has spent **${currency}${topSpender[1].toLocaleString()}** across checkouts.

      **BizPilot Copilot Action:**
      *Reward **${topSpender[0]}** with a VIP discount or priority order fulfillment.*`;
    }

    // 3. TASKS & OPERATIONS
    if (q.includes("task") || q.includes("todo") || q.includes("pending") || q.includes("work")) {
      const pendingTasks = tasks.filter(t => t.status === "Pending");
      const highPriority = pendingTasks.filter(t => t.priority === "High");

      return `### 📋 Operations & Action Checklist

      You have **${pendingTasks.length} pending tasks** on your board.

      🚨 **High Priority Pending Items:**
      ${highPriority.length > 0 ? highPriority.map(t => `- **${t.title}** (Due: ${t.dueDate || "N/A"})`).join("\n") : "- No urgent high priority items pending! 🎉"}

      **BizPilot Copilot Action:**
      *Complete urgent inventory and payment collection tasks first on the **Tasks** page.*`;
    }

    // DEFAULT SUMMARY
    const totalRev = sales.reduce((acc, curr) => acc + (curr.status === "Paid" ? Number(curr.total || curr.amount || 0) : 0), 0);
    return `### 👋 Hello! I am **BizPilot AI Copilot**

      I am analyzing your live shop dashboard data:

      - 💰 **Total Revenue**: ${currency}${totalRev.toLocaleString()} (${sales.length} transactions fetched)
      - 👥 **CRM Clients**: ${customers.length} registered accounts
      - 📋 **Active Tasks**: ${tasks.filter(t => t.status === "Pending").length} pending items

      How can I assist your business operations today?`;
  },
};

