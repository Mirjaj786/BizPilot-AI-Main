import { apiFetch } from "./api.js";

export const salesService = {
  getSales: async () => {
    try {
      const res = await apiFetch("/sales/get-all", { method: "GET" });
      const sales = res?.data || [];
      localStorage.setItem("bf_sales", JSON.stringify(sales));
      return sales;
    } catch (err) {
      console.warn("Failed to fetch sales from API, falling back to local storage:", err);
      const local = localStorage.getItem("bf_sales");
      return local ? JSON.parse(local) : [];
    }
  },

  getSalesStats: async () => {
    try {
      const res = await apiFetch("/sales/stats", { method: "GET" });
      return res?.data || null;
    } catch (err) {
      console.warn("Failed to fetch sales stats from API:", err);
      return null;
    }
  },

  createSale: async (saleData) => {
    try {
      const res = await apiFetch("/sales/create", {
        method: "POST",
        body: JSON.stringify(saleData),
      });
      return res?.data;
    } catch (err) {
      throw err;
    }
  },

  getSaleById: async (id) => {
    try {
      const res = await apiFetch(`/sales/${id}`, { method: "GET" });
      return res?.data;
    } catch (err) {
      throw err;
    }
  },
};

