import mongoose from "mongoose";
import Customer from "../models/customerModel.js";
import AsyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import httpStatus from "http-status";
import validator from "validator";

export const createCustomer = AsyncHandler(async (req, res) => {
  const { name, phone, email, address, notes, tags } = req.body;

  const userId = req.user._id;

  if (!name || !phone || !email) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Name, phone and email are required.",
    );
  }

  const normalizedPhone = phone.trim();
  const normalizedEmail = email?.trim().toLowerCase() || "";

  if (!validator.isMobilePhone(normalizedPhone, "en-IN")) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid phone number.");
  }

  if (normalizedEmail && !validator.isEmail(normalizedEmail)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid email address.");
  }

  const existingCustomer = await Customer.findOne({
    owner: userId,
    $or: [
      { phone: normalizedPhone },
      ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
    ],
  });

  if (existingCustomer) {
    throw new ApiError(httpStatus.CONFLICT, "Customer already exists.");
  }

  const customer = await Customer.create({
    owner: userId,
    name: name.trim(),
    phone: normalizedPhone,
    email: normalizedEmail,
    address: address || {},
    notes: notes?.trim() || "",
    tags: tags?.map((tag) => tag.trim()) || [],
  });

  return res.status(httpStatus.CREATED).json(
    new ApiResponse({
      message: "Customer created successfully.",
      data: customer,
    }),
  );
});

export const getAllCustomer = AsyncHandler(async (req, res) => {
  const userId = req.user._id;

  const customers = await Customer.find({
    owner: userId,
  }).sort({ createdAt: -1 });

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      message: "Customers fetched successfully.",
      data: customers,
    }),
  );
});

export const getCustomerById = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid customer ID.");
  }

  const customer = await Customer.findOne({
    _id: id,
    owner: req.user._id,
  });

  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer not found.");
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      message: "Customer fetched successfully.",
      data: customer,
    }),
  );
});

export const deleteCustomer = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid customer ID.");
  }

  const customer = await Customer.findOneAndUpdate(
    {
      _id: id,
      owner: req.user._id,
      isActive: true,
    },
    {
      $set: {
        isActive: false,
      },
    },
    {
      returnDocument: "after",
    },
  );

  if (!customer) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Customer not found or already deleted.",
    );
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      message: "Customer deleted successfully.",
      data: customer,
    }),
  );
});

export const updateCustomer = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid customer ID.");
  }

  const { name, phone, email, address, notes, tags } = req.body;

  const customer = await Customer.findOne({
    _id: id,
    owner: req.user._id,
    isActive: true,
  });

  if (!customer) {
    console.log(customer);
    throw new ApiError(httpStatus.NOT_FOUND, "Customer not found.");
  }

  if (name !== undefined) {
    customer.name = name.trim();
  }

  if (phone !== undefined) {
    const normalizedPhone = phone.trim();

    const phoneExist = await Customer.findOne({
      phone: normalizedPhone,
      owner: req.user._id,
      _id: { $ne: id },
      isActive: true,
    });

    if (phoneExist) {
      throw new ApiError(httpStatus.CONFLICT, "Phone number already exists.");
    }

    customer.phone = normalizedPhone;
  }

  if (email !== undefined) {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail && !validator.isEmail(normalizedEmail)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid email address.");
    }

    const emailExist = await Customer.findOne({
      email: normalizedEmail,
      owner: req.user._id,
      _id: { $ne: id },
      isActive: true,
    });

    if (emailExist) {
      throw new ApiError(httpStatus.CONFLICT, "Email already exists.");
    }

    customer.email = normalizedEmail;
  }

  if (address !== undefined) {
    customer.address = address;
  }

  if (notes !== undefined) {
    customer.notes = notes.trim();
  }

  if (tags !== undefined) {
    customer.tags = tags;
  }

  await customer.save();

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      message: "Customer updated successfully.",
      data: customer,
    }),
  );
});

export const restoreCustomer = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid customer id!");
  }
  const customer = await Customer.findOneAndUpdate(
    {
      _id: id,
      owner: req.user._id,
      isActive: false,
    },
    {
      $set: {
        isActive: true,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer not found.");
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      success: true,
      message: "Customer restore successfully!",
      data: customer,
    }),
  );
});

export const permanentDelete = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid customer ID.");
  }

  const deletedCustomer = await Customer.findOneAndDelete({
    _id: id,
    owner: req.user._id,
  });

  if (!deletedCustomer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer not found.");
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      message: "Customer permanently deleted successfully.",
      data: deletedCustomer,
    }),
  );
});

export const searchCustomers = AsyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Search query is required.");
  }

  const keyword = q.trim();

  const customers = await Customer.find({
    owner: req.user._id,
    isActive: true,
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
      { phone: { $regex: keyword, $options: "i" } },
    ],
  }).sort({ createdAt: -1 });

  if (!customers) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found!");
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      message: "Customers fetched successfully.",
      data: customers,
    }),
  );
});
