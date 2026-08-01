import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import Button from "../../components/Button/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import {
  IoSaveOutline,
  IoRefreshOutline,
  IoTrashOutline,
  IoMoonOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";

const CURRENCIES = ["₹", "$", "€", "£", "AED", "¥"];

export default function Settings() {
  const { settings, saveSettings, user, setUser, theme, setThemeMode, seedDemoData, resetDatabase } = useContext(StoreContext);

  const [form, setForm] = useState({
    businessName: settings?.businessName || user?.businessName || "",
    businessType: settings?.businessType || user?.businessType || "Retail Shop",
    phone: settings?.phone || "",
    email: settings?.email || user?.email || "",
    currency: settings?.currency || "₹",
    address: settings?.address || "",
    ownerName: user?.fullName || user?.name || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      saveSettings(form);
      if (setUser && user) {
        setUser({
          ...user,
          name: form.ownerName,
          businessName: form.businessName,
          businessType: form.businessType,
          email: form.email,
        });
      }
      toast.success("Settings saved successfully!");
      setLoading(false);
    }, 300);
  };

  const handleSeedDemo = () => {
    seedDemoData();
  };

  const handleResetDB = () => {
    resetDatabase();
  };

  return (
    <div className="space-y-6 pb-8 font-sans max-w-4xl mx-auto">
      {/* Business Details Form */}
      <Card className="!p-6 sm:!p-7">
        <SectionHeader title="Business & Profile Settings" subtitle="Configure shop ledger details, receipt header, and currency" />
        <form onSubmit={handleSave} className="space-y-4 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="bf-label">Owner Full Name</label>
              <input type="text" value={form.ownerName} onChange={handleChange("ownerName")} className="bf-input" />
            </div>
            <div>
              <label className="bf-label">Work Email</label>
              <input type="email" value={form.email} onChange={handleChange("email")} className="bf-input" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="bf-label">Business / Shop Name *</label>
              <input type="text" required value={form.businessName} onChange={handleChange("businessName")} className="bf-input" />
            </div>
            <div>
              <label className="bf-label">Business Type</label>
              <select value={form.businessType} onChange={handleChange("businessType")} className="bf-select">
                {["Grocery Store", "Retail Shop", "Pharmacy", "Restaurant", "Coaching Center", "Services & Repairs", "Other"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="bf-label">Phone Number</label>
              <input type="text" value={form.phone} onChange={handleChange("phone")} className="bf-input" />
            </div>
            <div>
              <label className="bf-label">Default Currency Symbol</label>
              <select value={form.currency} onChange={handleChange("currency")} className="bf-select">
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="bf-label">Physical Shop Address (for Printed Receipts)</label>
            <textarea value={form.address} onChange={handleChange("address")} rows={2} className="bf-textarea" />
          </div>

          <div className="pt-2">
            <Button type="submit" loading={loading} className="font-bold px-6">
              <IoSaveOutline size={16} /> Save Settings
            </Button>
          </div>
        </form>
      </Card>

      {/* Interface Theme Settings */}
      <Card className="!p-6 sm:!p-7">
        <SectionHeader title="Interface Display Theme" subtitle="Switch between Light and Dark workspace modes" />
        <div className="flex items-center gap-4 mt-4">
          <button
            type="button"
            onClick={() => setThemeMode("light")}
            className={`flex-1 p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all cursor-pointer ${
              theme === "light"
                ? "border-blue-600 bg-blue-50/50 text-blue-700 font-bold ring-2 ring-blue-600/20"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <IoSunnyOutline size={20} className="text-amber-500" />
            <span>Light Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setThemeMode("dark")}
            className={`flex-1 p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all cursor-pointer ${
              theme === "dark"
                ? "border-blue-600 bg-slate-800 text-white font-bold ring-2 ring-blue-600/40"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <IoMoonOutline size={20} className="text-indigo-400" />
            <span>Dark Mode</span>
          </button>
        </div>
      </Card>

      {/* Database & Demo Management */}
      <Card className="!p-6 sm:!p-7">
        <SectionHeader title="Database & Storage Operations" subtitle="Manage local store data persistence" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Seed Demo Dataset</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Populate sample customers, sales transactions, and task items for testing.</p>
            <Button onClick={handleSeedDemo} variant="outline" size="sm" className="w-full font-bold">
              <IoRefreshOutline size={16} /> Load Demo Data
            </Button>
          </div>

          <div className="p-4 rounded-2xl border border-red-200 dark:border-red-950 bg-red-50/30 dark:bg-red-950/20 space-y-3">
            <h4 className="font-bold text-xs sm:text-sm text-red-700 dark:text-red-400">Reset Local Database</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Wipe all local store records and restore to default empty state.</p>
            <Button onClick={handleResetDB} variant="danger" size="sm" className="w-full font-bold">
              <IoTrashOutline size={16} /> Reset All Data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
