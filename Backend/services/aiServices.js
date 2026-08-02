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

export const chatWithBusinessAI = async (userId, message, language = "en") => {
  const businessData = await buildBusinessService(userId, message);
  let prompt = createBusinessPrompt(businessData, message);

  if (language === "hi") {
    prompt += "\n\nCRITICAL INSTRUCTION: Please reply entirely in Hindi (हिंदी script) with professional, clear business terminology.";
  } else if (language === "bn") {
    prompt += "\n\nCRITICAL INSTRUCTION: Please reply entirely in Bengali (বাংলা script) with professional, clear business terminology.";
  }

  // Try Groq LLM API
  const aiOutput = await generateResponse(prompt);
  if (aiOutput) {
    return aiOutput;
  }

  // Fallback intelligent response handler if Groq API is offline
  const { business, statistics, insights } = businessData;
  const msgLower = message.toLowerCase();

  // BENGALI FALLBACK RESPONSES (bn)
  if (language === "bn") {
    if (msgLower.includes("overdue") || msgLower.includes("due") || msgLower.includes("unpaid") || msgLower.includes("pending") || msgLower.includes("বাকি")) {
      return `### 💳 বকেয়া পাওনা এবং খাতার হিসাব - **${business.name}**\n\nআপনার ব্যবসার মোট **₹${statistics.unpaidRevenue.toLocaleString()}** টাকা **${statistics.pendingSalesCount}**টি বিলে বকেয়া রয়েছে।\n\n**বকেয়া খাতার তালিকা:**\n${insights.duesBreakdownStr}\n\n**তাত্ক্ষণিক পদক্ষেপ:**\n- গ্রাহকদের হোয়াটসঅ্যাপে রিমাইন্ডার এবং রসিদ পাঠাতে **কাস্টমার্স** পেজে যান।\n- নগদ অর্থ প্রবাহ উন্নত করতে বাকি টাকা দ্রুত আদায় করুন।`;
    }
    if (msgLower.includes("week") || msgLower.includes("বিক্রি") || msgLower.includes("সপ্তাহ") || msgLower.includes("মোট")) {
      return `### 📊 সাপ্তাহিক বিক্রি এবং আয়ের রিপোর্ট - **${business.name}**\n\nগত ৭ দিনে মোট বিক্রি: **₹${statistics.thisWeekRev.toLocaleString()}** (মোট **${statistics.thisWeekOrders}**টি অর্ডার)।\n\n- **মোট আয়:** ₹${statistics.thisWeekRev.toLocaleString()}\n- **গড় অর্ডার মূল্যায়ণ (AOV):** ₹${statistics.aov}\n- **সেরা বিক্রির দিন:** ${insights.bestDay}\n\n**পরামর্শ:** বিক্রির গতি বাড়াতে খাতা পরিচালনা নিয়মিত রাখুন।`;
    }
    return `### 👋 নমেস্কার! আমি **BizPilot AI Copilot**\n\nআমি আপনার ব্যবসার সমস্ত খাতা, বিক্রি এবং কাস্টমার ডাটা বিশ্লেষণ করছি:\n\n- 💰 **মোট বিক্রি ও রাজস্ব:** ₹${statistics.revenue.toLocaleString()}\n- 👥 **নিবন্ধিত গ্রাহক:** ${statistics.customersCount} জন\n- ⚠️ **বকেয়া টাকা:** ₹${statistics.unpaidRevenue.toLocaleString()}\n- 📋 **চলতি কাজ (Tasks):** ${statistics.pendingTasksCount}টি পেন্ডিং\n\nআজ আপনাকে কীভাবে সাহায্য করতে পারি?`;
  }

  // HINDI FALLBACK RESPONSES (hi)
  if (language === "hi") {
    if (msgLower.includes("overdue") || msgLower.includes("due") || msgLower.includes("unpaid") || msgLower.includes("pending") || msgLower.includes("उधार")) {
      return `### 💳 बकाया भुगतान और खाता विवरण - **${business.name}**\n\nआपकी दुकान का कुल **₹${statistics.unpaidRevenue.toLocaleString()}** बकाया **${statistics.pendingSalesCount}** बिलों में लंबित है।\n\n**बकाया ग्राहक सूची:**\n${insights.duesBreakdownStr}\n\n**तुरंत कदम उठाएं:**\n- ग्राहकों को व्हाट्सएप पेमेंट रिमाइंडर भेजने के लिए **Customers** पेज पर जाएं।\n- बकाया राशि जल्दी वसूल करके कैश फ्लो बनाए रखें।`;
    }
    if (msgLower.includes("week") || msgLower.includes("बिक्री") || msgLower.includes("सप्ताह") || msgLower.includes("कमाई")) {
      return `### 📊 इस सप्ताह की बिक्री रिपोर्ट - **${business.name}**\n\nपिछले 7 दिनों में कुल बिक्री: **₹${statistics.thisWeekRev.toLocaleString()}** (कुल **${statistics.thisWeekOrders}** ऑर्डर)।\n\n- **कुल राजस्व:** ₹${statistics.thisWeekRev.toLocaleString()}\n- **औसत ऑर्डर मूल्य:** ₹${statistics.aov}\n- **सर्वश्रेष्ठ बिक्री दिन:** ${insights.bestDay}\n\n**सलाह:** कम बिक्री वाले दिनों में ग्राहकों को विशेष ऑफर दें।`;
    }
    return `### 👋 नमस्ते! मैं **BizPilot AI Copilot** हूँ\n\nमैं आपकी दुकान के लाइव डेटा का विश्लेषण कर रहा हूँ:\n\n- 💰 **कुल बिक्री राजस्व:** ₹${statistics.revenue.toLocaleString()}\n- 👥 **पंजीकृत ग्राहक:** ${statistics.customersCount} खाते\n- ⚠️ **कुल बकाया राशि:** ₹${statistics.unpaidRevenue.toLocaleString()}\n- 📋 **लंबित कार्य (Tasks):** ${statistics.pendingTasksCount} काम बाकी\n\nआज आपकी क्या सहायता कर सकता हूँ?`;
  }

  // ENGLISH FALLBACK RESPONSES (en)
  // 1. Specific Query: Overdue Payments / Dues
  if (msgLower.includes("overdue") || msgLower.includes("due") || msgLower.includes("unpaid") || msgLower.includes("pending payment")) {
    return `### 💳 Overdue Payments & Outstanding Dues Summary\n\nYour business **${business.name}** currently has **₹${statistics.unpaidRevenue.toLocaleString()}** in outstanding pending payments across **${statistics.pendingSalesCount}** pending invoices.\n\n**Unpaid Customer Breakdown:**\n${insights.duesBreakdownStr}\n\n**Action Steps to Collect Immediately:**\n- Send automated WhatsApp invoice reminders with payment details.\n- Follow up directly with top accounts holding pending balances.\n- Offer a 2% early settlement discount to expedite cash flow.`;
  }

  // 2. Specific Query: Weekly Sales / Performance
  if (msgLower.includes("this week") || msgLower.includes("week sale") || msgLower.includes("weekly")) {
    return `### 📊 This Week's Sales Performance Summary\n\nIn the past 7 days, **${business.name}** generated **₹${statistics.thisWeekRev.toLocaleString()}** in revenue across **${statistics.thisWeekOrders} transactions**.\n\n- **Weekly Revenue**: ₹${statistics.thisWeekRev.toLocaleString()}\n- **Weekly Checkouts**: ${statistics.thisWeekOrders} orders\n- **Average Order Value (AOV)**: ₹${statistics.aov}\n- **Peak Revenue Day**: ${insights.bestDay}\n- **Lowest Revenue Day**: ${insights.worstDay}\n\n**Recommendation**: Focus promotions on low-volume weekdays like ${insights.worstDay.split(' ')[0]} to balance weekly store cashflow.`;
  }

  // 3. Specific Query: Best Customer / Top Spender
  if (msgLower.includes("top customer") || msgLower.includes("best customer") || msgLower.includes("spender")) {
    return `### 👑 Top Grossing Customer Account\n\nYour highest-value customer account is **${insights.topCustomer}**.\n\n**Strategic Recommendations:**\n- Assign custom VIP tags to build long-term loyalty.\n- Offer priority stock reservation and personalized invoice billing.\n- Follow up regularly to maintain high repeat order velocity.`;
  }

  // 4. Default Full Business Audit (for general requests)
  return `### 1. Business Overview\n- **Overall Health**: ${statistics.unpaidRevenue > 0 ? "Good (Needs Dues Collection)" : "Excellent"}\n- **Revenue**: ₹${statistics.revenue.toLocaleString()}\n- **Orders**: ${statistics.totalSales} transactions (Paid: ${statistics.paidSalesCount}, Pending: ${statistics.pendingSalesCount})\n- **Customers**: ${statistics.customersCount} accounts\n- **Pending Payments**: ₹${statistics.unpaidRevenue.toLocaleString()}\n- **Pending Tasks**: ${statistics.pendingTasksCount} action items\n\n### 2. Key Insights\n- **Top Customer**: ${insights.topCustomer}\n- **Best-Selling Product**: ${insights.bestSellingProduct}\n- **Slow-Moving Products**: ${insights.slowMovingProducts}\n- **Sales Trends**: Strongest revenue day is ${insights.bestDay}. Average order value is ₹${statistics.aov}.\n\n### 3. Problems Detected\n- **Outstanding Payment Risk**: ₹${statistics.unpaidRevenue.toLocaleString()} is pending across customer bills.\n- **Task Overdue Risk**: ${statistics.pendingTasksCount} tasks require owner execution.\n\n### 4. Top 5 Actionable Recommendations\n1. **Follow up on Unpaid Balances**: Send WhatsApp invoice reminders for ₹${statistics.unpaidRevenue.toLocaleString()} in dues. — **Why it helps**: Improves immediate store cashflow.\n2. **Reorder Best-Selling Inventory**: Restock ${insights.bestSellingProduct.split(' ')[0]} before inventory runs out. — **Why it helps**: Protects daily revenue stream.\n3. **Engage Top Spenders**: Offer custom discounts or loyalty perks to ${insights.topCustomer.split(' ')[0]}. — **Why it helps**: Maximizes customer lifetime value.\n4. **Bundle Slow-Moving Items**: Offer discount combos on ${insights.slowMovingProducts}. — **Why it helps**: Clears stale inventory.\n5. **Clear Pending Task Backlog**: Complete open shop tasks today. — **Why it helps**: Maintains smooth store operations.\n\n### 5. Weekly Performance Analysis\n- **Revenue (7 Days)**: ₹${statistics.thisWeekRev.toLocaleString()}\n- **Orders**: ${statistics.thisWeekOrders} checkouts\n- **Average Order Value**: ₹${statistics.aov}\n- **Peak Day**: ${insights.bestDay}\n\n### 6. Action Plan\n- **Immediate (Today)**: Send payment reminders for pending bills.\n- **Short-Term (This Week)**: Reorder fast-moving items and audit stock.\n- **Long-Term**: Expand retail CRM accounts and automate digital receipts.\n\n### 7. Final Executive Summary\n${business.name} is performing well with ₹${statistics.revenue.toLocaleString()} in paid sales. Prioritizing dues collection of ₹${statistics.unpaidRevenue.toLocaleString()} will ensure optimal working capital.`;
};
