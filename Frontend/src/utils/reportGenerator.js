export const exportFinancialReportPDF = ({ sales = [], customers = [], settings = {} }) => {
  const currency = settings?.currency || "₹";
  const businessName = settings?.businessName || "BizPilot Store";
  const businessType = settings?.businessType || "Business Enterprise";
  const address = settings?.address || "Main Market, Business Plaza";
  const reportDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalRev = sales.reduce((a, s) => a + (s.status === "Paid" ? Number(s.total || s.amount || 0) : 0), 0);
  const totalSalesCount = sales.length;
  const aov = totalSalesCount > 0 ? totalRev / totalSalesCount : 0;
  const paidSalesCount = sales.filter((s) => s.status === "Paid").length;
  const paidRatio = totalSalesCount > 0 ? ((paidSalesCount / totalSalesCount) * 100).toFixed(1) : 0;

  // Monthly trend
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthMap = {};
  months.forEach((m) => { monthMap[m] = 0; });
  sales.forEach((s) => {
    const dVal = s.saleDate || s.createdAt || s.date;
    if (dVal) {
      const d = new Date(dVal);
      if (!isNaN(d)) monthMap[months[d.getMonth()]] += Number(s.total || s.amount || 0);
    }
  });

  // Payment Methods
  const methodMap = {};
  sales.forEach((s) => {
    const m = s.paymentMethod || s.method || "Cash";
    methodMap[m] = (methodMap[m] || 0) + Number(s.total || s.amount || 0);
  });

  // Top Customers
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

  const topCustList = customers.map((c) => {
    const id = c._id || c.id;
    return {
      name: c.name,
      business: c.business || c.address?.city || "Individual",
      orders: custOrders[id] || c.ordersCount || 0,
      spend: custSpend[id] || c.totalSpent || 0,
    };
  });
  Object.keys(custSpend).forEach((cId) => {
    if (!topCustList.some((item) => item.name === custNameMap[cId])) {
      topCustList.push({
        name: custNameMap[cId] || "Walk-in Customer",
        business: "Walk-in",
        orders: custOrders[cId],
        spend: custSpend[cId],
      });
    }
  });
  topCustList.sort((a, b) => b.spend - a.spend);

  const printWindow = window.open("", "_blank", "width=900,height=1000");
  if (!printWindow) {
    alert("Please allow popups to export the PDF financial report.");
    return;
  }

  const reportHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Executive Financial Report - ${businessName}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; background: #fff; line-height: 1.5; }
    .header { border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .company-title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
    .company-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
    .report-badge { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #334155; margin: 24px 0 12px 0; border-left: 4px solid #2563eb; padding-left: 8px; }
    
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; }
    .kpi-label { font-size: 11px; font-weight: 600; color: #64748b; margin: 0; }
    .kpi-val { font-size: 18px; font-weight: 800; color: #0f172a; margin: 4px 0 0 0; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
    th { background: #f1f5f9; text-align: left; padding: 10px 12px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 10px; border-bottom: 2px solid #cbd5e1; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; }
    tr:nth-child(even) { background: #fafafa; }
    .text-right { text-align: right; }
    .font-mono { font-family: monospace; font-weight: 700; }
    .font-bold { font-weight: 700; }
    .highlight { color: #2563eb; font-weight: 800; }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; pt: 16px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="company-title">${businessName}</h1>
      <p class="company-sub">${businessType} • ${address}</p>
      <p class="company-sub">Report Issued Date: <strong>${reportDate}</strong></p>
    </div>
    <div style="text-align: right;">
      <span class="report-badge">Executive Financial Summary</span>
      <p style="font-size: 10px; color: #94a3b8; margin-top: 6px;">Confidential Business Document</p>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <p class="kpi-label">Gross Revenue</p>
      <p class="kpi-val highlight">${currency}${totalRev.toLocaleString()}</p>
    </div>
    <div class="kpi-card">
      <p class="kpi-label">Total Transactions</p>
      <p class="kpi-val">${totalSalesCount} Checkouts</p>
    </div>
    <div class="kpi-card">
      <p class="kpi-label">Average Order Value</p>
      <p class="kpi-val">${currency}${aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
    <div class="kpi-card">
      <p class="kpi-label">Settlement Ratio</p>
      <p class="kpi-val">${paidRatio}% Paid</p>
    </div>
  </div>

  <div class="grid-2">
    <div>
      <div class="section-title">Monthly Revenue Timeline</div>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th class="text-right">Revenue (${currency})</th>
          </tr>
        </thead>
        <tbody>
          ${months.map(m => `
            <tr>
              <td class="font-bold">${m}</td>
              <td class="text-right font-mono">${currency}${monthMap[m].toLocaleString()}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <div>
      <div class="section-title">Payment Method Volume</div>
      <table>
        <thead>
          <tr>
            <th>Channel</th>
            <th class="text-right">Volume (${currency})</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(methodMap).map(([m, val]) => `
            <tr>
              <td class="font-bold">${m}</td>
              <td class="text-right font-mono">${currency}${val.toLocaleString()}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  </div>

  <div class="section-title">Top Grossing Client Accounts</div>
  <table>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Customer Name</th>
        <th>Company / Segment</th>
        <th class="text-right">Checkouts</th>
        <th class="text-right">Lifetime Volume (${currency})</th>
      </tr>
    </thead>
    <tbody>
      ${topCustList.slice(0, 5).map((c, i) => `
        <tr>
          <td class="highlight font-mono">#${i + 1}</td>
          <td class="font-bold">${c.name}</td>
          <td>${c.business}</td>
          <td class="text-right">${c.orders}</td>
          <td class="text-right font-mono font-bold">${currency}${c.spend.toLocaleString()}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <div class="footer">
    <div>
      <p><strong>Generated By:</strong> BizPilot AI Business OS • Executive Financial Reporting Module</p>
    </div>
    <div style="text-align: right;">
      <p>Signature Verification: _______________________</p>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(reportHTML);
  printWindow.document.close();
};
