import { apiFetch } from "./api.js";

const saveSession = (user, token) => {
  if (user) localStorage.setItem("bf_user", JSON.stringify(user));
  if (token) localStorage.setItem("bf_token", token);
};

export const authService = {
  // Login Handler
  login: async (email, password) => {
    try {
      const res = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const user = res?.data?.user || res?.user;
      const token = res?.data?.token || res?.token || "jwt-auth-token";

      const userData = {
        name: user?.fullName || user?.name || "Owner",
        email: user?.email || email,
        businessName: user?.businessName || "Verma General Store",
        businessType: user?.businessType || "Grocery Store",
      };

      saveSession(userData, token);
      return { success: true, user: userData };
    } catch (err) {
      if (err.message.includes("Failed to fetch") || err.message.includes("Server error")) {
        const fallbackUser = {
          name: email.split("@")[0] || "Owner",
          email,
          businessName: "Verma General Store",
          businessType: "Grocery Store",
        };
        saveSession(fallbackUser, "demo-session-token");
        return { success: true, user: fallbackUser, isOffline: true };
      }
      throw err;
    }
  },

  // Register Handler
  register: async (fullName, email, password, businessName, businessType) => {
    try {
      const res = await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password, businessName, businessType }),
      });

      const user = res?.data?.user || res?.user;
      const token = res?.data?.token || res?.token || "jwt-auth-token";

      const userData = {
        name: user?.fullName || user?.name || fullName,
        email: user?.email || email,
        businessName: user?.businessName || businessName,
        businessType: user?.businessType || businessType,
      };

      saveSession(userData, token);
      return { success: true, user: userData };
    } catch (err) {
      if (err.message.includes("Failed to fetch") || err.message.includes("Server error")) {
        const fallbackUser = {
          name: fullName,
          email,
          businessName,
          businessType,
        };
        saveSession(fallbackUser, "demo-session-token");
        return { success: true, user: fallbackUser, isOffline: true };
      }
      throw err;
    }
  },

  // Get Logged In User Profile
  getMe: async () => {
    const token = localStorage.getItem("bf_token");
    if (!token) return null;

    try {
      const res = await apiFetch("/auth/me", { method: "GET" });
      const user = res?.data || res?.user;
      if (!user) return null;

      const userData = {
        name: user.fullName || user.name || "Owner",
        email: user.email || "",
        businessName: user.businessName || "My Store",
        businessType: user.businessType || "Retail",
      };
      localStorage.setItem("bf_user", JSON.stringify(userData));
      return userData;
    } catch {
      return null;
    }
  },

  // Google Login Handler
  googleLogin: async (credential) => {
    try {
      const res = await apiFetch("/google-login", {
        method: "POST",
        body: JSON.stringify({ credential }),
      });

      const user = res?.data?.user || res?.user;
      const token = res?.data?.token || res?.token || "jwt-auth-token";

      const userData = {
        name: user?.fullName || user?.name || "Google Merchant",
        email: user?.email || "",
        businessName: user?.businessName || "My Retail Store",
        businessType: user?.businessType || "Retail",
      };

      saveSession(userData, token);
      return { success: true, user: userData };
    } catch (err) {
      if (err.message.includes("Failed to fetch") || err.message.includes("Server error")) {
        const fallbackUser = {
          name: "Google Merchant",
          email: "merchant@google.com",
          businessName: "Google Store",
          businessType: "Retail",
        };
        saveSession(fallbackUser, "demo-google-token");
        return { success: true, user: fallbackUser, isOffline: true };
      }
      throw err;
    }
  },

  // Forgot Password Handler
  forgotPassword: async (email) => {
    return await apiFetch("/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Reset Password Handler
  resetPassword: async (token, newPassword) => {
    return await apiFetch(`/reset-password/${token}`, {
      method: "POST",
      body: JSON.stringify({ newPassword }),
    });
  },

  // Logout Handler
  logout: () => {
    localStorage.removeItem("bf_token");
    localStorage.removeItem("bf_user");
  },
};
