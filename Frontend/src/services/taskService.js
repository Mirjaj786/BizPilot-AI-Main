import { apiFetch } from "./api.js";

export const taskService = {
  getTasks: async () => {
    try {
      const res = await apiFetch("/tasks/get-all", { method: "GET" });
      const tasks = res?.data || [];
      localStorage.setItem("bf_tasks", JSON.stringify(tasks));
      return tasks;
    } catch {
      const local = localStorage.getItem("bf_tasks");
      return local ? JSON.parse(local) : [];
    }
  },

  addTask: async (taskData) => {
    try {
      const res = await apiFetch("/tasks/create", {
        method: "POST",
        body: JSON.stringify(taskData),
      });
      return res?.data;
    } catch (err) {
      throw err;
    }
  },

  updateTask: async (id, updatedFields) => {
    try {
      const res = await apiFetch(`/tasks/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedFields),
      });
      return res?.data;
    } catch (err) {
      throw err;
    }
  },

  deleteTask: async (id) => {
    try {
      const res = await apiFetch(`/tasks/delete/${id}`, {
        method: "DELETE",
      });
      return res?.data;
    } catch (err) {
      throw err;
    }
  },

  searchTasks: async (title, priority, status) => {
    try {
      const params = new URLSearchParams();
      if (title) params.append("title", title);
      if (priority) params.append("priority", priority);
      if (status) params.append("status", status);

      const res = await apiFetch(`/tasks/search?${params.toString()}`, {
        method: "GET",
      });
      return res?.data || [];
    } catch {
      return [];
    }
  },
};
