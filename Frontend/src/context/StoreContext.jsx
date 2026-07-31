import { useState, useEffect } from "react";
import { StoreContext } from "./StoreContext.js";

export { StoreContext };

const DEFAULT_CUSTOMERS = [
  {
    id: "c1",
    name: "Aarav Sharma",
    phone: "+91 98765 43210",
    email: "aarav@gmail.com",
    address: "Sector 15, Noida",
    business: "Apex Design Studio",
    status: "VIP",
    totalSpent: 342500,
    ordersCount: 18,
    lastOrderDate: "2026-07-28",
    outstandingBalance: 0,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    tags: ["Retail", "High Volume"],
    notes: "Regular customer. Prefers UPI payments.",
  },
  {
    id: "c2",
    name: "Priya Patel",
    phone: "+91 91234 56789",
    email: "priya@yahoo.com",
    address: "Ghatkopar, Mumbai",
    business: "Holloway Logistics",
    status: "Active",
    totalSpent: 128900.5,
    ordersCount: 12,
    lastOrderDate: "2026-07-26",
    outstandingBalance: 1400,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    tags: ["Logistics", "Pending Due"],
    notes: "Often buys wholesale groceries. Weekly visits.",
  },
  {
    id: "c3",
    name: "Amit Verma",
    phone: "+91 88776 65544",
    email: "amit.v@hotmail.com",
    address: "Salt Lake, Kolkata",
    business: "Artisan Bakery & Cafe",
    status: "Active",
    totalSpent: 451200,
    ordersCount: 34,
    lastOrderDate: "2026-07-29",
    outstandingBalance: 0,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    tags: ["Food & Bev", "Recurring"],
    notes: "Requires home delivery for medicines/grocery.",
  },
  {
    id: "c4",
    name: "Sneha Reddy",
    phone: "+91 77665 54433",
    email: "sneha.r@gmail.com",
    address: "Jubilee Hills, Hyderabad",
    business: "Miller Imports",
    status: "Inactive",
    totalSpent: 65000,
    ordersCount: 3,
    lastOrderDate: "2026-06-12",
    outstandingBalance: 1625,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    tags: ["Wholesale"],
    notes: "Outstanding balance of ₹1,625 from last order.",
  },
  {
    id: "c5",
    name: "Rajesh Kumar",
    phone: "+91 99887 76655",
    email: "rajesh@outlook.com",
    address: "Indiranagar, Bengaluru",
    business: "Bloom Boutique Florals",
    status: "VIP",
    totalSpent: 564200,
    ordersCount: 29,
    lastOrderDate: "2026-07-27",
    outstandingBalance: 0,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    tags: ["Florist", "Local VIP"],
    notes: "Restaurateur buying in bulk. Send invoices via email.",
  },
];

const DEFAULT_SALES = [
  {
    id: "s1",
    invoiceNo: "BF-2026-001",
    customerId: "c1",
    customerName: "Aarav Sharma",
    customer: "Aarav Sharma",
    date: "2026-07-10",
    items: [
      { name: "Premium Basmati Rice 5kg", price: 650, quantity: 2 },
      { name: "Mustard Oil 1L", price: 180, quantity: 3 },
    ],
    total: 1840,
    amount: 1840,
    paymentMethod: "UPI",
    method: "UPI",
    status: "Paid",
  },
  {
    id: "s2",
    invoiceNo: "BF-2026-002",
    customerId: "c2",
    customerName: "Priya Patel",
    customer: "Priya Patel",
    date: "2026-07-11",
    items: [
      { name: "Organic Honey 500g", price: 320, quantity: 1 },
      { name: "Whole Wheat Atta 10kg", price: 450, quantity: 2 },
    ],
    total: 1220,
    amount: 1220,
    paymentMethod: "Cash",
    method: "Cash",
    status: "Paid",
  },
  {
    id: "s3",
    invoiceNo: "BF-2026-003",
    customerId: "c4",
    customerName: "Sneha Reddy",
    customer: "Sneha Reddy",
    date: "2026-07-12",
    items: [
      { name: "Amul Butter 500g", price: 275, quantity: 2 },
      { name: "Tropicana Orange Juice 1L", price: 120, quantity: 4 },
    ],
    total: 1030,
    amount: 1030,
    paymentMethod: "Due",
    method: "Due",
    status: "Unpaid",
  },
  {
    id: "s4",
    invoiceNo: "BF-2026-004",
    customerId: "c5",
    customerName: "Rajesh Kumar",
    customer: "Rajesh Kumar",
    date: "2026-07-13",
    items: [
      { name: "Dairy Milk Silk", price: 80, quantity: 10 },
      { name: "Nescafe Classic Coffee 200g", price: 380, quantity: 2 },
    ],
    total: 1560,
    amount: 1560,
    paymentMethod: "Card",
    method: "Card",
    status: "Paid",
  },
  {
    id: "s5",
    invoiceNo: "BF-2026-005",
    customerId: "c3",
    customerName: "Amit Verma",
    customer: "Amit Verma",
    date: "2026-07-14",
    items: [
      { name: "Aashirvaad Multigrain Atta 5kg", price: 290, quantity: 1 },
      { name: "Tata Salt 1kg", price: 28, quantity: 2 },
      { name: "Surf Excel Easy Wash 1kg", price: 140, quantity: 2 },
    ],
    total: 626,
    amount: 626,
    paymentMethod: "UPI",
    method: "UPI",
    status: "Paid",
  },
];

const DEFAULT_TASKS = [
  {
    id: "t1",
    title: "Restock popular items",
    category: "Inventory",
    description: "Basmati Rice, Mustard Oil, and Amul Butter are running low in stock.",
    dueDate: "2026-07-30",
    priority: "High",
    status: "Pending",
    assignee: "Marcus H.",
  },
  {
    id: "t2",
    title: "Collect outstanding due from Sneha Reddy",
    category: "Billing",
    description: "Follow up via WhatsApp for the pending bill of ₹1,030 & ₹595.",
    dueDate: "2026-07-31",
    priority: "High",
    status: "Pending",
    assignee: "Eleanor V.",
  },
  {
    id: "t3",
    title: "Update GST returns",
    category: "Finance",
    description: "Compile sales data for the current month and submit details.",
    dueDate: "2026-08-05",
    priority: "Medium",
    status: "Pending",
    assignee: "Sophia C.",
  },
  {
    id: "t4",
    title: "Check inventory expiry dates",
    category: "Legal",
    description: "Go through the grocery shelves to check for items expiring in next 30 days.",
    dueDate: "2026-08-10",
    priority: "Low",
    status: "Completed",
    assignee: "Self",
  },
];

const DEFAULT_SETTINGS = {
  businessName: "Verma General Store",
  businessType: "Grocery Store",
  phone: "+91 98765 43210",
  email: "owner@bizflow.com",
  currency: "₹",
  address: "12, Market Lane, Block C, New Delhi",
};

const DEFAULT_USER = {
  name: "Amit Verma",
  email: "owner@bizflow.com",
  role: "Owner & CEO",
  businessName: "Verma General Store",
  businessType: "Grocery Store",
  currency: "₹",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

const INITIAL_PRODUCTS = [
  { id: "PROD-01", name: "Artisanal Espresso Blend", category: "Beverages", price: 499.00, sku: "ESP-001", inStock: 45, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&auto=format&fit=crop&q=80" },
  { id: "PROD-02", name: "Organic Honey Jar (500g)", category: "Grocery", price: 350.00, sku: "HNY-500", inStock: 28, image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=300&auto=format&fit=crop&q=80" },
  { id: "PROD-03", name: "Butter Croissant Box (6pcs)", category: "Bakery", price: 299.00, sku: "CRS-006", inStock: 12, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=80" },
  { id: "PROD-04", name: "Handcrafted Ceramic Mug", category: "Merchandise", price: 599.00, sku: "MUG-002", inStock: 60, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80" },
  { id: "PROD-05", name: "Nitro Cold Brew Can (4-pack)", category: "Beverages", price: 399.00, sku: "CLD-004", inStock: 34, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop&q=80" },
];

export const StoreContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("bizflow_theme") || "dark";
  });

  const [user, setUserState] = useState(() => {
    try {
      const stored = localStorage.getItem("bf_user");
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [customers, setCustomersState] = useState(() => {
    try {
      const stored = localStorage.getItem("bf_customers");
      return stored ? JSON.parse(stored) : DEFAULT_CUSTOMERS;
    } catch {
      return DEFAULT_CUSTOMERS;
    }
  });

  const [sales, setSalesState] = useState(() => {
    try {
      const stored = localStorage.getItem("bf_sales");
      return stored ? JSON.parse(stored) : DEFAULT_SALES;
    } catch {
      return DEFAULT_SALES;
    }
  });

  const [tasks, setTasksState] = useState(() => {
    try {
      const stored = localStorage.getItem("bf_tasks");
      return stored ? JSON.parse(stored) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [settings, setSettingsState] = useState(() => {
    try {
      const stored = localStorage.getItem("bf_settings");
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [products] = useState(INITIAL_PRODUCTS);

  // Cart State for POS
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(DEFAULT_CUSTOMERS[0]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Order #BF-2026-005", desc: "₹626.00 completed via POS", time: "10 mins ago", unread: true },
    { id: 2, title: "Low Stock Alert", desc: "Butter Croissant Box (12 left)", time: "1 hour ago", unread: true },
    { id: 3, title: "Payment Due Reminder", desc: "Sneha Reddy due ₹1,625", time: "3 hours ago", unread: false },
  ]);

  // AI Chat History
  const [aiChats, setAiChats] = useState([
    { sender: "ai", text: "Namaste! I am your **BizFlow AI Assistant**. How can I help optimize your sales, inventory, or billing performance today?", time: "09:00 AM" },
  ]);

  // Sync Theme to HTML Root
  useEffect(() => {
    localStorage.setItem("bizflow_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setThemeMode = (mode) => {
    if (mode === "dark" || mode === "light") {
      setTheme(mode);
    }
  };

  const setUser = (userData) => {
    setUserState(userData);
    localStorage.setItem("bf_user", JSON.stringify(userData));
  };

  const loginUser = (userData) => {
    setUserState(userData);
    localStorage.setItem("bf_user", JSON.stringify(userData));
    const updatedSettings = {
      ...settings,
      businessName: userData.businessName || settings.businessName,
      businessType: userData.businessType || settings.businessType,
    };
    setSettingsState(updatedSettings);
    localStorage.setItem("bf_settings", JSON.stringify(updatedSettings));
  };

  const registerUser = (userData) => {
    setUserState(userData);
    localStorage.setItem("bf_user", JSON.stringify(userData));
    const updatedSettings = {
      ...settings,
      businessName: userData.businessName,
      businessType: userData.businessType,
    };
    setSettingsState(updatedSettings);
    localStorage.setItem("bf_settings", JSON.stringify(updatedSettings));
  };

  const logoutUser = () => {
    setUserState(null);
    localStorage.removeItem("bf_user");
  };

  const saveCustomers = (newCustomers) => {
    setCustomersState(newCustomers);
    localStorage.setItem("bf_customers", JSON.stringify(newCustomers));
  };

  const addCustomer = (customerData) => {
    const newCust = {
      id: `c${customers.length + 1}`,
      name: customerData.name,
      email: customerData.email || "",
      phone: customerData.phone || "+91 98765 00000",
      business: customerData.business || "Independent",
      status: "Active",
      totalSpent: 0,
      ordersCount: 0,
      lastOrderDate: "Just now",
      outstandingBalance: 0,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      tags: customerData.tags ? customerData.tags.split(',') : ["New Client"],
      notes: customerData.notes || "",
    };
    const updated = [newCust, ...customers];
    saveCustomers(updated);
  };

  const saveSales = (newSales) => {
    setSalesState(newSales);
    localStorage.setItem("bf_sales", JSON.stringify(newSales));
  };

  const saveTasks = (newTasks) => {
    setTasksState(newTasks);
    localStorage.setItem("bf_tasks", JSON.stringify(newTasks));
  };

  const addTask = (newTask) => {
    const taskObj = {
      id: `t${tasks.length + 1}`,
      title: newTask.title,
      category: newTask.category || "General",
      description: newTask.description || "",
      status: newTask.status || "Pending",
      priority: newTask.priority || "Medium",
      dueDate: newTask.dueDate || "2026-08-10",
      assignee: newTask.assignee || "Self",
    };
    const updated = [taskObj, ...tasks];
    saveTasks(updated);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
    saveTasks(updated);
  };

  const deleteTask = (taskId) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    saveTasks(updated);
  };

  const saveSettings = (newSettings) => {
    setSettingsState(newSettings);
    localStorage.setItem("bf_settings", JSON.stringify(newSettings));
    if (user) {
      const updatedUser = {
        ...user,
        businessName: newSettings.businessName,
        businessType: newSettings.businessType,
      };
      setUserState(updatedUser);
      localStorage.setItem("bf_user", JSON.stringify(updatedUser));
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const completeCheckout = (paymentMethod = "UPI") => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const taxAmount = ((subtotal - discountAmount) * taxPercent) / 100;
    const finalTotal = subtotal - discountAmount + taxAmount;

    const newSale = {
      id: `s${sales.length + 1}`,
      invoiceNo: `BF-2026-00${sales.length + 1}`,
      customerId: selectedCustomer ? selectedCustomer.id : null,
      customerName: selectedCustomer ? selectedCustomer.name : "Walk-in Customer",
      customer: selectedCustomer ? selectedCustomer.name : "Walk-in Customer",
      items: [...cart],
      total: parseFloat(finalTotal.toFixed(2)),
      amount: parseFloat(finalTotal.toFixed(2)),
      paymentMethod,
      method: paymentMethod,
      status: paymentMethod === "Due" ? "Unpaid" : "Paid",
      date: new Date().toISOString().split("T")[0],
    };

    const updatedSales = [newSale, ...sales];
    saveSales(updatedSales);
    clearCart();
    return newSale;
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const sendAiMessage = (prompt) => {
    const userMsg = { sender: "user", text: prompt, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setAiChats((prev) => [...prev, userMsg]);
  };

  const seedDemoData = () => {
    saveCustomers(DEFAULT_CUSTOMERS);
    saveSales(DEFAULT_SALES);
    saveTasks(DEFAULT_TASKS);
    saveSettings(DEFAULT_SETTINGS);
    setUserState(DEFAULT_USER);
    localStorage.setItem("bf_user", JSON.stringify(DEFAULT_USER));
  };

  const resetDatabase = () => {
    saveCustomers([]);
    saveSales([]);
    saveTasks([]);
    saveSettings({
      businessName: "My Business",
      businessType: "Retail Shop",
      phone: "",
      email: "",
      currency: "₹",
      address: "",
    });
  };

  const contextValue = {
    theme,
    toggleTheme,
    setThemeMode,
    user,
    setUser,
    customers,
    saveCustomers,
    addCustomer,
    sales,
    saveSales,
    recentSales: sales,
    products,
    tasks,
    saveTasks,
    addTask,
    updateTaskStatus,
    deleteTask,
    settings,
    saveSettings,
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    selectedCustomer,
    setSelectedCustomer,
    discountPercent,
    setDiscountPercent,
    taxPercent,
    setTaxPercent,
    completeCheckout,
    notifications,
    markAllNotificationsRead,
    aiChats,
    sendAiMessage,
    loginUser,
    registerUser,
    logoutUser,
    seedDemoData,
    resetDatabase,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
