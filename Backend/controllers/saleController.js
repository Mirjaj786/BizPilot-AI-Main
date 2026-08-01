import mongoose from "mongoose";

import ApiError from "../utils/apiError.js";
import AsyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import httpStatus from "http-status";
import generateInvoice from "../utils/invoiceGenerate.js";

import Sale from "../models/saleModel.js";
import Customer from "../models/customerModel.js";

export const getAllSales = AsyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid owner ID!");
  }

  const sales = await Sale.find({ owner: ownerId })
    .populate("customer", "name phone email business")
    .sort({ createdAt: -1 });

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      success: true,
      message: "All sales fetched successfully.",
      data: sales || [],
    }),
  );
});

export const createSale = AsyncHandler(async (req, res) => {
  const { customer, items, paymentMethod, status, saleDate, notes } = req.body;

  // Validation
  if (!items || items.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Items are required for a sale.",
    );
  }

  let customerId = customer || req.body.customerName;

  if (customerId && mongoose.Types.ObjectId.isValid(customerId)) {
    const customerExists = await Customer.findOne({
      _id: customerId,
      owner: req.user._id,
      isActive: true,
    });
    if (!customerExists) {
      customerId = null;
    }
  } else if (typeof customerId === "string" && customerId.trim() !== "") {
    const nameStr = customerId.trim();
    let existingByName = await Customer.findOne({ owner: req.user._id, name: nameStr });
    if (existingByName) {
      customerId = existingByName._id;
    } else {
      const newCust = await Customer.create({
        owner: req.user._id,
        name: nameStr,
        phone: `91${Math.floor(10000000 + Math.random() * 90000000)}`,
        email: "",
      });
      customerId = newCust._id;
    }
  } else {
    customerId = null;
  }

  if (!customerId) {
    let walkInCust = await Customer.findOne({ owner: req.user._id, name: "Walk-in Customer" });
    if (!walkInCust) {
      walkInCust = await Customer.create({
        owner: req.user._id,
        name: "Walk-in Customer",
        phone: "9100000000",
        email: "walkin@bizflow.com",
      });
    }
    customerId = walkInCust._id;
  }

  // Calculate Total
  const total = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0,
  );

  // Generate Invoice Number
  const invoiceNo = await generateInvoice();

  // Create Sale
  const sale = await Sale.create({
    owner: req.user._id,
    customer: customerId,
    invoiceNo,
    items,
    total,
    paymentMethod: paymentMethod || "Cash",
    status: status || "Paid",
    saleDate: saleDate || new Date(),
    notes: notes || "",
  });

  const populatedSale = await Sale.findById(sale._id).populate("customer", "name phone email business");

  return res.status(httpStatus.CREATED).json(
    new ApiResponse({
      success: true,
      message: "Sale created successfully.",
      data: populatedSale,
    }),
  );
});

export const getSaleById = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Sale ID!");
  }

  const sale = await Sale.findOne({
    _id: id,
    owner: req.user._id,
  }).populate("customer", "name phone email business");

  if (!sale) {
    throw new ApiError(httpStatus.NOT_FOUND, "Sale not found!");
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      success: true,
      message: "Sale fetched successfully.",
      data: sale,
    }),
  );
});

export const getSalesStats = AsyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const sales = await Sale.find({ owner: ownerId });

  if (!sales || sales.length === 0) {
    return res.status(httpStatus.OK).json(
      new ApiResponse({
        success: true,
        message: "No sales found.",
        data: {
          totalRevenue: 0,
          totalSales: 0,
          paidSales: 0,
          pendingSales: 0,
          cancelledSales: 0,
          todayRevenue: 0,
        },
      }),
    );
  }

  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.status === "Paid" ? sale.total : 0), 0);

  const paidSales = sales.filter((sale) => sale.status === "Paid").length;

  const pendingSales = sales.filter((sale) => sale.status === "Pending").length;

  const cancelledSales = sales.filter(
    (sale) => sale.status === "Cancelled",
  ).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayRevenue = sales
    .filter(
      (sale) =>
        new Date(sale.saleDate) >= today &&
        new Date(sale.saleDate) < tomorrow &&
        sale.status === "Paid",
    )
    .reduce((sum, sale) => sum + sale.total, 0);

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      success: true,
      message: "Sales statistics fetched successfully.",
      data: {
        totalRevenue,
        totalSales: sales.length,
        paidSales,
        pendingSales,
        cancelledSales,
        todayRevenue,
      },
    }),
  );
});

