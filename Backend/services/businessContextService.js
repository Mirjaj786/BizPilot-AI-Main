import User from "../models/userModel.js";
import Customer from "../models/customerModel.js";
import Sale from "../models/saleModel.js";
import Task from "../models/taskModel.js";
import ApiError from "../utils/apiError.js";
import httpStatus from "http-status";

export const buildBusinessService = async (userId, message) => {
  const [user, customers, sales, tasks] = await Promise.all([
    User.findById(userId).lean(),
    Customer.find({ owner: userId }).lean(),
    Sale.find({ owner: userId }).lean(),
    Task.find({ owner: userId }).lean(),
  ]);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  let totalRevenue = 0;
  let paidSales = 0;
  let pendingSales = 0;
  let cancelledSales = 0;

  const productMap = {};

  for (const sale of sales) {
    if (sale.status === "Paid") {
      totalRevenue += sale.total || 0;
      paidSales++;
    } else if (sale.status === "Pending") {
      pendingSales++;
    } else if (sale.status === "Cancelled") {
      cancelledSales++;
    }

    for (const item of sale.items || []) {
      if (item?.name) {
        productMap[item.name] = (productMap[item.name] || 0) + (item.quantity || 1);
      }
    }
  }

  const pendingTasks = tasks.filter((task) => task.status === "Pending");

  const pendingTaskTitles =
    pendingTasks.length > 0
      ? pendingTasks.map((task) => `• ${task.title}`).join("\n")
      : "No pending tasks";

  const bestSellingProduct =
    Object.entries(productMap).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "No sales yet";

  const recentSales =
    sales
      .sort((a, b) => new Date(b.saleDate || b.createdAt) - new Date(a.saleDate || a.createdAt))
      .slice(0, 5)
      .map((sale) => `${sale.invoiceNo} | ₹${sale.total} | ${sale.status}`)
      .join("\n") || "No sales available";

  return {
    business: {
      name: user.businessName || "My Business",
      type: user.businessType || "General",
    },

    statistics: {
      revenue: totalRevenue,
      customers: customers.length,
      sales: sales.length,
      paidSales,
      pendingSales,
      cancelledSales,
      pendingTasks: pendingTasks.length,
    },

    insights: {
      bestSellingProduct,
      pendingTasks: pendingTaskTitles,
      recentSales,
    },

    question: message,
  };
};
