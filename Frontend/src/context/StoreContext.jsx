import { useState, useEffect } from "react";
import { StoreContext } from "./StoreContext.js";
import { authService } from "../services/authService.js";
import { taskService } from "../services/taskService.js";
import { salesService } from "../services/salesService.js";
import { customerService } from "../services/customerService.js";

export { StoreContext };

const DEFAULT_CUSTOMERS = [];
const DEFAULT_SALES = [];
const DEFAULT_TASKS = [];

const DEFAULT_SETTINGS = {
  businessName: "My Business",
  businessType: "Retail Shop",
  phone: "",
  email: "",
  currency: "₹",
  address: "",
};

const DEFAULT_USER = null;

const INITIAL_PRODUCTS = [
  { id: "PROD-01", name: "Artisanal Espresso Blend", category: "Beverages", price: 499.00, sku: "ESP-001", inStock: 45, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&auto=format&fit=crop&q=80" },
  { id: "PROD-02", name: "Organic Honey Jar (500g)", category: "Grocery", price: 350.00, sku: "HNY-500", inStock: 28, image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=300&auto=format&fit=crop&q=80" },
  { id: "PROD-03", name: "Butter Croissant Box (6pcs)", category: "Bakery", price: 299.00, sku: "CRS-006", inStock: 12, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=80" },
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
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);

  // AI Chat History
  const [aiChats, setAiChats] = useState([
    { sender: "ai", text: "Namaste! I am your **BizPilot AI Copilot**. How can I help optimize your sales, inventory, or billing performance today?", time: "09:00 AM" },
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

  // Sync user profile, sales, customers, and tasks on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("bf_token");
    if (token) {
      if (typeof authService?.getMe === "function") {
        authService.getMe().then((freshUser) => {
          if (freshUser) {
            setUserState(freshUser);
          }
        });
      }

      salesService.getSales().then((fetchedSales) => {
        if (fetchedSales && Array.isArray(fetchedSales) && fetchedSales.length > 0) {
          setSalesState(fetchedSales);
        }
      });

      customerService.getCustomers().then((fetchedCusts) => {
        if (fetchedCusts && Array.isArray(fetchedCusts) && fetchedCusts.length > 0) {
          setCustomersState(fetchedCusts);
        }
      });

      taskService.getTasks().then((fetchedTasks) => {
        if (fetchedTasks && Array.isArray(fetchedTasks) && fetchedTasks.length > 0) {
          setTasksState(fetchedTasks);
        }
      });
    }
  }, []);

  const logoutUser = () => {
    const isConfirmed = window.confirm("Are you sure you want to logout?");
    if (!isConfirmed) return;

    setUserState(null);
    localStorage.removeItem("bf_user");
    localStorage.removeItem("bf_token");
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
    const isConfirmed = window.confirm("Are you sure you want to delete this task item?");
    if (!isConfirmed) return;
    const updated = tasks.filter((t) => (t._id || t.id) !== taskId);
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

  const sendAiMessage = (prompt) => {
    const userMsg = { sender: "user", text: prompt, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setAiChats((prev) => [...prev, userMsg]);
  };

  const seedDemoData = () => {
    const isConfirmed = window.confirm("Load sample demo data into your workspace?");
    if (!isConfirmed) return;
    saveCustomers([]);
    saveSales([]);
    saveTasks([]);
  };

  const resetDatabase = () => {
    const isConfirmed = window.confirm("DANGER: Are you sure you want to reset all stored local data?");
    if (!isConfirmed) return;
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
