import mongoose from "mongoose";
import User from "../models/userModel.js";
import Customer from "../models/customerModel.js";
import Sale from "../models/saleModel.js";
import Task from "../models/taskModel.js";
import ApiError from "../utils/apiError.js";
import httpStatus from "http-status";

export const buildBusinessService = async (userId, message) => {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  let [customers, sales, tasks] = await Promise.all([
    Customer.find({ owner: userId }).lean(),
    Sale.find({ owner: userId }).populate("customer", "name phone email").lean(),
    Task.find({ owner: userId }).lean(),
  ]);

  if (!sales || sales.length === 0) {
    const dummyOwnerId = new mongoose.Types.ObjectId("6a6cdd20fc7b7abd2a29f251");
    const seededCount = await Sale.countDocuments({ owner: dummyOwnerId });
    if (seededCount > 0) {
      await Sale.updateMany({ owner: dummyOwnerId }, { owner: userId });
      sales = await Sale.find({ owner: userId }).populate("customer", "name phone email").lean();
    }
  }

  let totalRevenue = 0;
  let paidSalesCount = 0;
  let pendingSalesCount = 0;
  let cancelledSalesCount = 0;
  let unpaidRevenue = 0;

  const productQtyMap = {};
  const customerSpendMap = {};
  const customerOrderCountMap = {};
  const pendingDuesByCustomer = {};
  const dayOfWeekRevMap = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  let thisWeekRev = 0;
  let thisWeekOrders = 0;

  for (const sale of sales) {
    const total = Number(sale.total) || 0;
    const custName = sale.customer?.name || sale.customerName || "Walk-in Customer";
    customerSpendMap[custName] = (customerSpendMap[custName] || 0) + total;
    customerOrderCountMap[custName] = (customerOrderCountMap[custName] || 0) + 1;

    const saleDate = sale.saleDate ? new Date(sale.saleDate) : sale.createdAt ? new Date(sale.createdAt) : new Date();
    if (!isNaN(saleDate)) {
      try {
        const dayName = saleDate.toLocaleDateString("en-US", { weekday: "long" });
        const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        if (dayOfWeekRevMap[capitalizedDay] !== undefined) {
          dayOfWeekRevMap[capitalizedDay] += total;
        }
      } catch {
        // fallback ignored
      }
      if (saleDate >= sevenDaysAgo) {
        thisWeekRev += total;
        thisWeekOrders++;
      }
    }

    if (sale.status === "Paid") {
      totalRevenue += total;
      paidSalesCount++;
    } else if (sale.status === "Pending" || sale.status === "Unpaid") {
      pendingSalesCount++;
      unpaidRevenue += total;
      pendingDuesByCustomer[custName] = (pendingDuesByCustomer[custName] || 0) + total;
    } else if (sale.status === "Cancelled") {
      cancelledSalesCount++;
    }

    for (const item of sale.items || []) {
      if (item?.name) {
        const q = Number(item.quantity) || 1;
        productQtyMap[item.name] = (productQtyMap[item.name] || 0) + q;
      }
    }
  }

  const aov = sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : "0.00";

  // Product ranking
  const sortedProducts = Object.entries(productQtyMap).sort((a, b) => b[1] - a[1]);
  const bestSellingProduct = sortedProducts[0] ? `${sortedProducts[0][0]} (${sortedProducts[0][1]} units sold)` : "N/A";
  const slowMovingProducts = sortedProducts.slice(-3).map(([name, qty]) => `${name} (${qty} units)`).join(", ") || "None";

  // Customer ranking
  const sortedCustomers = Object.entries(customerSpendMap).sort((a, b) => b[1] - a[1]);
  const topCustomer = sortedCustomers[0] ? `${sortedCustomers[0][0]} (Spent ₹${sortedCustomers[0][1].toLocaleString()})` : "N/A";

  // Outstanding dues breakdown
  const duesBreakdownStr = Object.entries(pendingDuesByCustomer)
    .map(([cust, amount]) => `• ${cust}: ₹${amount.toLocaleString()} due`)
    .join("\n") || "No outstanding dues";

  // Day ranking
  const sortedDays = Object.entries(dayOfWeekRevMap).sort((a, b) => b[1] - a[1]);
  const bestDay = sortedDays[0] ? `${sortedDays[0][0]} (₹${sortedDays[0][1].toLocaleString()})` : "N/A";
  const worstDay = sortedDays[sortedDays.length - 1] ? `${sortedDays[sortedDays.length - 1][0]} (₹${sortedDays[sortedDays.length - 1][1].toLocaleString()})` : "N/A";

  // Tasks
  const pendingTasks = tasks.filter((t) => t.status === "Pending");
  const pendingTasksStr = pendingTasks.length > 0
    ? pendingTasks.map((t) => `• [Priority: ${t.priority || "Normal"}] ${t.title} (Due: ${t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : "N/A"})`).join("\n")
    : "No pending tasks";

  return {
    business: {
      name: user.businessName || "Retail Business",
      type: user.businessType || "Retail Store",
      ownerName: user.fullName || "Business Owner",
    },
    statistics: {
      revenue: totalRevenue,
      unpaidRevenue,
      customersCount: customers.length,
      totalSales: sales.length,
      paidSalesCount,
      pendingSalesCount,
      cancelledSalesCount,
      pendingTasksCount: pendingTasks.length,
      aov,
      thisWeekRev,
      thisWeekOrders,
    },
    insights: {
      bestSellingProduct,
      slowMovingProducts,
      topCustomer,
      bestDay,
      worstDay,
      duesBreakdownStr,
      pendingTasksStr,
    },
    question: message,
  };
};
