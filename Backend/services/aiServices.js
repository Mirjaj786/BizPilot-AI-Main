import groq from "../config/groq.js";
import { buildBusinessService } from "./businessContextService.js";
import { createBusinessPrompt } from "./promptService.js";

export const generateResponse = async (prompt) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return completion.choices[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.warn("Groq API Call Error / Fallback activated:", error.message);
    return null;
  }
};

export const chatWithBusinessAI = async (userId, message) => {
  const businessData = await buildBusinessService(userId, message);
  const prompt = createBusinessPrompt(businessData, message);

  // Try Groq LLM API
  const aiOutput = await generateResponse(prompt);
  if (aiOutput) {
    return aiOutput;
  }

  // Fallback intelligent response handler if Groq API is offline
  const { business, statistics, insights } = businessData;
  const msgLower = message.toLowerCase();

  // 1. Specific Query: Overdue Payments / Dues
  if (msgLower.includes("overdue") || msgLower.includes("due") || msgLower.includes("unpaid") || msgLower.includes("pending payment")) {
    return `### 💳 Overdue Payments & Outstanding Dues Summary

Your business **${business.name}** currently has **₹${statistics.unpaidRevenue.toLocaleString()}** in outstanding pending payments across **${statistics.pendingSalesCount}** pending invoices.

**Unpaid Customer Breakdown:**
${insights.duesBreakdownStr}

**Action Steps to Collect Immediately:**
- Send automated WhatsApp invoice reminders with payment details.
- Follow up directly with top accounts holding pending balances.
- Offer a 2% early settlement discount to expedite cash flow.`;
  }

  // 2. Specific Query: Weekly Sales / Performance
  if (msgLower.includes("this week") || msgLower.includes("week sale") || msgLower.includes("weekly")) {
    return `### 📊 This Week's Sales Performance Summary

In the past 7 days, **${business.name}** generated **₹${statistics.thisWeekRev.toLocaleString()}** in revenue across **${statistics.thisWeekOrders} transactions**.

- **Weekly Revenue**: ₹${statistics.thisWeekRev.toLocaleString()}
- **Weekly Checkouts**: ${statistics.thisWeekOrders} orders
- **Average Order Value (AOV)**: ₹${statistics.aov}
- **Peak Revenue Day**: ${insights.bestDay}
- **Lowest Revenue Day**: ${insights.worstDay}

**Recommendation**: Focus promotions on low-volume weekdays like ${insights.worstDay.split(' ')[0]} to balance weekly store cashflow.`;
  }

  // 3. Specific Query: Best Customer / Top Spender
  if (msgLower.includes("top customer") || msgLower.includes("best customer") || msgLower.includes("spender")) {
    return `### 👑 Top Grossing Customer Account

Your highest-value customer account is **${insights.topCustomer}**.

**Strategic Recommendations:**
- Assign custom VIP tags to build long-term loyalty.
- Offer priority stock reservation and personalized invoice billing.
- Follow up regularly to maintain high repeat order velocity.`;
  }

  // 4. Default Full Business Audit (for general requests)
  return `### 1. Business Overview
- **Overall Health**: ${statistics.unpaidRevenue > 0 ? "Good (Needs Dues Collection)" : "Excellent"}
- **Revenue**: ₹${statistics.revenue.toLocaleString()}
- **Orders**: ${statistics.totalSales} transactions (Paid: ${statistics.paidSalesCount}, Pending: ${statistics.pendingSalesCount})
- **Customers**: ${statistics.customersCount} accounts
- **Pending Payments**: ₹${statistics.unpaidRevenue.toLocaleString()}
- **Pending Tasks**: ${statistics.pendingTasksCount} action items

### 2. Key Insights
- **Top Customer**: ${insights.topCustomer}
- **Best-Selling Product**: ${insights.bestSellingProduct}
- **Slow-Moving Products**: ${insights.slowMovingProducts}
- **Sales Trends**: Strongest revenue day is ${insights.bestDay}. Average order value is ₹${statistics.aov}.

### 3. Problems Detected
- **Outstanding Payment Risk**: ₹${statistics.unpaidRevenue.toLocaleString()} is pending across customer bills.
- **Task Overdue Risk**: ${statistics.pendingTasksCount} tasks require owner execution.

### 4. Top 5 Actionable Recommendations
1. **Follow up on Unpaid Balances**: Send WhatsApp invoice reminders for ₹${statistics.unpaidRevenue.toLocaleString()} in dues. — **Why it helps**: Improves immediate store cashflow.
2. **Reorder Best-Selling Inventory**: Restock ${insights.bestSellingProduct.split(' ')[0]} before inventory runs out. — **Why it helps**: Protects daily revenue stream.
3. **Engage Top Spenders**: Offer custom discounts or loyalty perks to ${insights.topCustomer.split(' ')[0]}. — **Why it helps**: Maximizes customer lifetime value.
4. **Bundle Slow-Moving Items**: Offer discount combos on ${insights.slowMovingProducts}. — **Why it helps**: Clears stale inventory.
5. **Clear Pending Task Backlog**: Complete open shop tasks today. — **Why it helps**: Maintains smooth store operations.

### 5. Weekly Performance Analysis
- **Revenue (7 Days)**: ₹${statistics.thisWeekRev.toLocaleString()}
- **Orders**: ${statistics.thisWeekOrders} checkouts
- **Average Order Value**: ₹${statistics.aov}
- **Peak Day**: ${insights.bestDay}

### 6. Action Plan
- **Immediate (Today)**: Send payment reminders for pending bills.
- **Short-Term (This Week)**: Reorder fast-moving items and audit stock.
- **Long-Term**: Expand retail CRM accounts and automate digital receipts.

### 7. Final Executive Summary
${business.name} is performing well with ₹${statistics.revenue.toLocaleString()} in paid sales. Prioritizing dues collection of ₹${statistics.unpaidRevenue.toLocaleString()} will ensure optimal working capital.`;
};
