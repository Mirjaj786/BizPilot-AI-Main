export const API_BASE_URL = "/api";

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
