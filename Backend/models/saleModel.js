import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  },
);

const saleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    invoiceNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    items: {
      type: [itemSchema],
      required: true,
      validate: [(arr) => arr.length > 0, "At least one item is required"],
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Bank Transfer"],
      default: "Cash",
    },

    status: {
      type: String,
      enum: ["Paid", "Pending", "Cancelled"],
      default: "Paid",
    },

    saleDate: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;

