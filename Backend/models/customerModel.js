import mongoose from "mongoose";
import validator from "validator";

const customerSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
      validate: {
        validator: function (value) {
          if (!value) return false;
          const digits = value.replace(/[^\d]/g, "");
          return digits.length >= 10 && digits.length <= 13;
        },
        message: "Please enter a valid phone number with at least 10 digits.",
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      validate: {
        validator: (value) => value === "" || validator.isEmail(value),
        message: "Invalid email address",
      },
    },

    address: {
      street: {
        type: String,
        trim: true,
        default: "",
      },

      city: {
        type: String,
        trim: true,
        default: "",
      },

      state: {
        type: String,
        trim: true,
        default: "",
      },

      pincode: {
        type: String,
        trim: true,
        default: "",
      },

      country: {
        type: String,
        trim: true,
        default: "India",
      },
    },

    notes: {
      type: String,
      trim: true,
      default: "",
      maxLength: 500,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
