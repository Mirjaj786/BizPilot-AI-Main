import Task from "./models/taskModel.js";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import Sale from "./models/saleModel.js";
dotenv.config();

// const tasks = [
//   {
//     owner: "6a6cdd20fc7b7abd2a29f251",
//     title: "Restock popular items",
//     description:
//       "Basmati Rice, Mustard Oil, and Amul Butter are running low in stock.",
//     priority: "High",
//     status: "Pending",
//     dueDate: new Date("2026-07-30"),
//   },
//   {
//     owner: "6a6cdd20fc7b7abd2a29f251",
//     title: "Check dairy inventory",
//     description: "Verify milk, cheese, and yogurt stock levels.",
//     priority: "Medium",
//     status: "Pending",
//     dueDate: new Date("2026-08-02"),
//   },
//   {
//     owner: "6a6cdd20fc7b7abd2a29f251",
//     title: "Update product prices",
//     description: "Apply the latest supplier price changes.",
//     priority: "High",
//     status: "Pending",
//     dueDate: new Date("2026-08-03"),
//   },
//   {
//     owner: "6a6cdd20fc7b7abd2a29f251",
//     title: "Clean warehouse shelves",
//     description: "Organize and clean storage racks before new stock arrives.",
//     priority: "Low",
//     status: "Pending",
//     dueDate: new Date("2026-08-05"),
//   },
//   {
//     owner: "6a6cdd20fc7b7abd2a29f251",
//     title: "Contact supplier",
//     description: "Confirm delivery schedule for grocery items.",
//     priority: "Medium",
//     status: "Completed",
//     dueDate: new Date("2026-07-28"),
//   },
//   {
//     owner: "6a6cdd20fc7b7abd2a29f251",
//     title: "Prepare monthly inventory report",
//     description: "Generate and review inventory summary for July.",
//     priority: "High",
//     status: "Pending",
//     dueDate: new Date("2026-08-07"),
//   },
//   {
//     owner: "6a6cdd20fc7b7abd2a29f251",
//     title: "Inspect damaged goods",
//     description: "Separate expired and damaged products for return.",
//     priority: "Medium",
//     status: "Pending",
//     dueDate: new Date("2026-08-04"),
//   },
//   {
//     owner: "6a6cdd20fc7b7abd2a29f251",
//     title: "Reorder beverages",
//     description: "Place an order for soft drinks and bottled water.",
//     priority: "High",
//     status: "Completed",
//     dueDate: new Date("2026-07-29"),
//   },
//   {
//     owner: "6a6cdd20fc7b7abd2a29f251",
//     title: "Verify supplier invoices",
//     description: "Cross-check invoices with delivered quantities.",
//     priority: "Low",
//     status: "Pending",
//     dueDate: new Date("2026-08-10"),
//   },
//   {
//     owner: "6a6cdd20fc7b7abd2a29f251",
//     title: "Schedule freezer maintenance",
//     description: "Book technician for freezer inspection and servicing.",
//     priority: "Medium",
//     status: "Pending",
//     dueDate: new Date("2026-08-08"),
//   },
//   {
//     owner: "6a6cdd20fc7b7abd2a29f251",
//     title: "Audit stock records",
//     description: "Compare physical stock with database records.",
//     priority: "High",
//     status: "Pending",
//     dueDate: new Date("2026-08-06"),
//   },
//   {
//     owner: "6a6cdd20fc7b7abd2a29f251",
//     title: "Review weekly sales",
//     description: "Analyze top-selling and low-selling products.",
//     priority: "Low",
//     status: "Completed",
//     dueDate: new Date("2026-07-31"),
//   },
// ];

const sales = [
  {
    owner: "6a6cdd20fc7b7abd2a29f251",
    customer: "6a6ce94f240e17093be7b3f3",
    invoiceNo: "INV-2026-001",
    items: [
      { name: "Premium Basmati Rice 5kg", price: 650, quantity: 2 },
      { name: "Mustard Oil 1L", price: 180, quantity: 3 },
    ],
    total: 1840,
    paymentMethod: "UPI",
    status: "Paid",
    saleDate: new Date("2026-07-10"),
    notes: "Paid successfully.",
  },
  {
    owner: "6a6cdd20fc7b7abd2a29f251",
    customer: "6a6ce94f240e17093be7b3f4",
    invoiceNo: "INV-2026-002",
    items: [
      { name: "Amul Butter 500g", price: 290, quantity: 2 },
      { name: "Whole Wheat Flour 10kg", price: 520, quantity: 1 },
    ],
    total: 1100,
    paymentMethod: "Cash",
    status: "Paid",
    saleDate: new Date("2026-07-11"),
    notes: "",
  },
  {
    owner: "6a6cdd20fc7b7abd2a29f251",
    customer: "6a6ce94f240e17093be7b3f5",
    invoiceNo: "INV-2026-003",
    items: [
      { name: "Tea 1kg", price: 480, quantity: 1 },
      { name: "Sugar 5kg", price: 260, quantity: 2 },
    ],
    total: 1000,
    paymentMethod: "Card",
    status: "Pending",
    saleDate: new Date("2026-07-12"),
    notes: "Awaiting payment.",
  },
  {
    owner: "6a6cdd20fc7b7abd2a29f251",
    customer: "6a6ce94f240e17093be7b3f3",
    invoiceNo: "INV-2026-004",
    items: [
      { name: "Milk 1L", price: 65, quantity: 10 },
      { name: "Bread", price: 45, quantity: 5 },
    ],
    total: 875,
    paymentMethod: "Cash",
    status: "Paid",
    saleDate: new Date("2026-07-13"),
    notes: "",
  },
  {
    owner: "6a6cdd20fc7b7abd2a29f251",
    customer: "6a6ce94f240e17093be7b3f4",
    invoiceNo: "INV-2026-005",
    items: [
      { name: "Sunflower Oil 5L", price: 980, quantity: 1 },
      { name: "Toor Dal 2kg", price: 320, quantity: 2 },
    ],
    total: 1620,
    paymentMethod: "Bank Transfer",
    status: "Paid",
    saleDate: new Date("2026-07-14"),
    notes: "",
  },
  {
    owner: "6a6cdd20fc7b7abd2a29f251",
    customer: "6a6ce94f240e17093be7b3f5",
    invoiceNo: "INV-2026-006",
    items: [
      { name: "Coffee 500g", price: 420, quantity: 2 },
      { name: "Green Tea", price: 280, quantity: 1 },
    ],
    total: 1120,
    paymentMethod: "UPI",
    status: "Paid",
    saleDate: new Date("2026-07-15"),
    notes: "",
  },
  {
    owner: "6a6cdd20fc7b7abd2a29f251",
    customer: "6a6ce94f240e17093be7b3f3",
    invoiceNo: "INV-2026-007",
    items: [
      { name: "Biscuits Pack", price: 40, quantity: 20 },
      { name: "Soft Drink 2L", price: 120, quantity: 5 },
    ],
    total: 1400,
    paymentMethod: "Card",
    status: "Cancelled",
    saleDate: new Date("2026-07-16"),
    notes: "Customer cancelled order.",
  },
  {
    owner: "6a6cdd20fc7b7abd2a29f251",
    customer: "6a6ce94f240e17093be7b3f4",
    invoiceNo: "INV-2026-008",
    items: [
      { name: "Paneer 500g", price: 180, quantity: 3 },
      { name: "Eggs (30 pcs)", price: 210, quantity: 2 },
    ],
    total: 960,
    paymentMethod: "Cash",
    status: "Paid",
    saleDate: new Date("2026-07-17"),
    notes: "",
  },
  {
    owner: "6a6cdd20fc7b7abd2a29f251",
    customer: "6a6ce94f240e17093be7b3f5",
    invoiceNo: "INV-2026-009",
    items: [
      { name: "Detergent Powder", price: 350, quantity: 2 },
      { name: "Dishwash Liquid", price: 140, quantity: 2 },
    ],
    total: 980,
    paymentMethod: "UPI",
    status: "Paid",
    saleDate: new Date("2026-07-18"),
    notes: "",
  },
  {
    owner: "6a6cdd20fc7b7abd2a29f251",
    customer: "6a6ce94f240e17093be7b3f3",
    invoiceNo: "INV-2026-010",
    items: [
      { name: "Corn Flour 1kg", price: 90, quantity: 5 },
      { name: "Tomato Ketchup", price: 150, quantity: 2 },
    ],
    total: 750,
    paymentMethod: "Cash",
    status: "Pending",
    saleDate: new Date("2026-07-19"),
    notes: "Payment due in 3 days.",
  },
  {
    owner: "6a6cdd20fc7b7abd2a29f251",
    customer: "6a6ce94f240e17093be7b3f4",
    invoiceNo: "INV-2026-011",
    items: [
      { name: "Refined Oil 1L", price: 170, quantity: 4 },
      { name: "Salt 1kg", price: 25, quantity: 6 },
    ],
    total: 830,
    paymentMethod: "Bank Transfer",
    status: "Paid",
    saleDate: new Date("2026-07-20"),
    notes: "",
  },
  {
    owner: "6a6cdd20fc7b7abd2a29f251",
    customer: "6a6ce94f240e17093be7b3f5",
    invoiceNo: "INV-2026-012",
    items: [
      { name: "Maggi Noodles", price: 18, quantity: 20 },
      { name: "Biscuits Pack", price: 40, quantity: 10 },
    ],
    total: 760,
    paymentMethod: "Card",
    status: "Paid",
    saleDate: new Date("2026-07-21"),
    notes: "Repeat customer purchase.",
  },
];

const seedCustomers = async () => {
  try {
    await connectDB();

    await Sale.deleteMany({});
    console.log("All previous data deleted!")
    await Sale.insertMany(sales);

    console.log("✅ Sales seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding sales:", err);
    process.exit(1);
  }
};

seedCustomers();