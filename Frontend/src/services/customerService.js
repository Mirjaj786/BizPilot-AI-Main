import { apiFetch } from "./api.js";

export const customerService = {
  getCustomers: async () => {
    try {
      const res = await apiFetch("/customers/get-all", { method: "GET" });
      const customers = res?.data || [];
      localStorage.setItem("bf_customers", JSON.stringify(customers));
      return customers;
    } catch {
      const local = localStorage.getItem("bf_customers");
      return local ? JSON.parse(local) : [];
    }
  },

  addCustomer: async (customerData) => {
    try {
      const res = await apiFetch("/customers/create", {
        method: "POST",
        body: JSON.stringify(customerData),
      });
      return res?.data;
    } catch (err) {
      throw err;
    }
  },

  updateCustomer: async (id, updatedFields) => {
    try {
      const res = await apiFetch(`/customers/update-customer/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedFields),
      });
      return res?.data;
    } catch (err) {
      throw err;
    }
  },

  deleteCustomer: async (id) => {
    try {
      const res = await apiFetch(`/customers/delete-customer/${id}`, {
        method: "DELETE",
      });
      return res?.data;
    } catch (err) {
      throw err;
    }
  },

  restoreCustomer: async (id) => {
    try {
      const res = await apiFetch(`/customers/restore/${id}`, {
        method: "PATCH",
      });
      return res?.data;
    } catch (err) {
      throw err;
    }
  },

  permanentDeleteCustomer: async (id) => {
    try {
      const res = await apiFetch(`/customers/permanent-delete/${id}`, {
        method: "DELETE",
      });
      return res?.data;
    } catch (err) {
      throw err;
    }
  },

  searchCustomers: async (query) => {
    try {
      const res = await apiFetch(`/customers/search?q=${encodeURIComponent(query)}`, {
        method: "GET",
      });
      return res?.data || [];
    } catch {
      return [];
    }
  },
};
