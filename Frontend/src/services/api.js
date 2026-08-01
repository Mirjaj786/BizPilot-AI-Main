// Production Vercel Backend API base URL fallback
const envUrl = import.meta.env.VITE_API_BASE_URL || "https://biz-pilot-ai-main.vercel.app/api";
const cleanUrl = envUrl.replace(/\/+$/, "");
export const API_BASE_URL = cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("bf_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Server error (${response.status})`);
  }

  return data;
};
