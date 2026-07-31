import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import { taskService } from "../../services/taskService.js";
import Button from "../../components/Button/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";
import {
  IoAddOutline,
  IoTrashOutline,
  IoCalendarOutline,
  IoListOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";

const PRIORITY_BADGES = { High: "danger", Medium: "warning", Low: "neutral" };

export default function Tasks() {
  const { tasks, saveTasks } = useContext(StoreContext);
  const [filter, setFilter] = useState("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "High",
    status: "Pending",
    dueDate: new Date().toISOString().split("T")[0],
  });

  const loadBackendTasks = async () => {
    setFetching(true);
    try {
      const data = await taskService.getTasks();
      if (data && Array.isArray(data)) {
        saveTasks(data);
      }
    } catch {
      // Keep existing context state if offline
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadBackendTasks();
  }, []);

  const handleToggleTask = async (task) => {
    const taskId = task._id || task.id;
    const currentStatus = task.status;
    const nextStatus = currentStatus === "Completed" || currentStatus === "completed" ? "Pending" : "Completed";

    try {
      await taskService.updateTask(taskId, {
        title: task.title,
        description: task.description || task.title,
        priority: task.priority || "Medium",
        status: nextStatus,
        dueDate: task.dueDate || new Date().toISOString(),
      });
      toast.success(nextStatus === "Completed" ? "Task marked completed!" : "Task marked pending.");
      loadBackendTasks();
    } catch (error) {
      toast.error(error?.message || "Failed to update task status.");
    }
  };

  const handleDeleteTask = async (task) => {
    const taskId = task._id || task.id;
    if (confirm(`Delete operational task "${task.title}"?`)) {
      try {
        await taskService.deleteTask(taskId);
        toast.success("Task deleted successfully.");
        loadBackendTasks();
      } catch (error) {
        toast.error(error?.message || "Failed to delete task.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Task title is required.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || form.title.trim(),
      priority: form.priority,
      status: form.status || "Pending",
      dueDate: form.dueDate || new Date().toISOString().split("T")[0],
    };

    setLoading(true);
    try {
      await taskService.addTask(payload);
      toast.success("Task added to operational board!");
      setForm({
        title: "",
        description: "",
        priority: "High",
        status: "Pending",
        dueDate: new Date().toISOString().split("T")[0],
      });
      setAddModalOpen(false);
      loadBackendTasks();
    } catch (error) {
      toast.error(error?.message || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const filteredTasks = (tasks || []).filter((t) => {
    if (!t) return false;
    const isDone = t.status === "Completed" || t.status === "completed";
    if (filter === "pending") return !isDone;
    if (filter === "completed") return isDone;
    return true;
  });

  return (
    <div className="space-y-6 pb-8 font-sans">
      <Card className="!p-6 sm:!p-7">
        <SectionHeader title="Operational Action Items" subtitle="Desk checklists and team assignments">
          <Button onClick={() => setAddModalOpen(true)} size="md" className="font-bold rounded-xl text-xs px-4 py-2.5 shrink-0 whitespace-nowrap flex items-center gap-1.5">
            <IoAddOutline size={18} /> New Task
          </Button>
        </SectionHeader>

        {/* Filter Chips */}
        <div className="flex gap-2 my-4 flex-wrap">
          {[
            ["all", "All Tasks"],
            ["pending", "Pending"],
            ["completed", "Completed"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filter === key
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        {fetching && tasks.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading tasks from database...</div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            icon={IoListOutline}
            title="No tasks found"
            description="Create a new task to organize inventory, billing, or client followups."
          />
        ) : (
          <div className="space-y-3 mt-4">
            {filteredTasks.map((t) => {
              const taskId = t._id || t.id;
              const isDone = t.status === "Completed" || t.status === "completed";
              return (
                <div
                  key={taskId}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    isDone
                      ? "bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 opacity-75"
                      : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <button
                      onClick={() => handleToggleTask(t)}
                      className={`mt-0.5 shrink-0 rounded-lg p-1 transition-colors cursor-pointer ${
                        isDone
                          ? "text-emerald-500 hover:text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                          : "text-slate-300 hover:text-slate-500 bg-slate-100 dark:bg-slate-800"
                      }`}
                      title={isDone ? "Mark Pending" : "Mark Completed"}
                    >
                      <IoCheckmarkCircleOutline size={20} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-bold text-xs sm:text-sm ${isDone ? "line-through text-slate-400" : "text-slate-900 dark:text-white"}`}>
                          {t.title}
                        </p>
                        <Badge variant={PRIORITY_BADGES[t.priority] || "neutral"}>{t.priority}</Badge>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isDone ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      {t.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2 font-medium">
                        <span className="flex items-center gap-1"><IoCalendarOutline size={13} /> Due: {formatDate(t.dueDate)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(t)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-lg cursor-pointer shrink-0"
                    title="Delete task"
                  >
                    <IoTrashOutline size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Add Task Modal */}
      {addModalOpen && (
        <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Create New Operational Task" maxWidth="max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="bf-label">Task Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Restock popular items & verify dairy inventory"
                className="bf-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="bf-label">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="bf-select"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="bf-label">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="bf-input"
                />
              </div>
            </div>

            <div>
              <label className="bf-label">Description Details</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Basmati Rice, Mustard Oil, and Amul Butter are running low..."
                rows={3}
                className="bf-textarea"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={loading} className="flex-1 font-bold">
                Save Task
              </Button>
              <Button type="button" onClick={() => setAddModalOpen(false)} variant="secondary" className="flex-1 font-bold">
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
