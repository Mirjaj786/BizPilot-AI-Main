import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import { customerService } from "../../services/customerService.js";
import Button from "../../components/Button/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";
import CustomerDetailsModal from "../../components/ui/CustomerDetailsModal.jsx";
import DataImportModal from "../../components/ui/DataImportModal.jsx";
import {
  IoPeopleOutline,
  IoPersonAddOutline,
  IoSearchOutline,
  IoMailOutline,
  IoCallOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoRefreshOutline,
  IoTrashBinOutline,
  IoLocationOutline,
  IoPricetagOutline,
  IoEyeOutline,
  IoChatbubbleEllipsesOutline,
  IoCloudUploadOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import SkeletonLoader from "../../components/Loader/SkeletonLoader.jsx";

const INITIAL_FORM = {
  name: "",
  phone: "",
  email: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  notes: "",
  tags: "",
};

export default function Customers() {
  const { customers, saveCustomers, settings } = useContext(StoreContext);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "active", "inactive"
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingCust, setEditingCust] = useState(null);
  const [viewingCust, setViewingCust] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const loadBackendCustomers = async () => {
    setFetching(true);
    try {
      const data = await customerService.getCustomers();
      if (data && Array.isArray(data)) {
        saveCustomers(data);
      }
    } catch {
      // Keep existing context state if offline
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadBackendCustomers();
  }, []);

  const handleSendWhatsAppReminder = (cust) => {
    const phone = cust.phone ? cust.phone.replace(/[^0-9]/g, "") : "";
    const duesAmount = Number(cust.outstandingBalance || 0);
    const businessName = settings?.businessName || "BizPilot AI Store";
    const currency = settings?.currency || "₹";

    const textMessage = `*Dear ${cust.name},*\n\nGreetings from *${businessName}*! 👋\n\nThis is a friendly statement reminder regarding your account:\n-------------------------------------------\n💰 *Outstanding Balance*: ${currency}${duesAmount.toLocaleString()}\n📌 *Account Status*: ${cust.status || "Active"}\n-------------------------------------------\n\nKindly settle the pending balance via UPI / Bank Transfer at your earliest convenience.\n\nThank you for your business! 🙏\n\n*${businessName}*`;

    const whatsappUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(textMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(textMessage)}`;

    window.open(whatsappUrl, "_blank");
  };

  const handleOpenAdd = () => {
    setEditingCust(null);
    setForm(INITIAL_FORM);
    setAddModalOpen(true);
  };

  const handleOpenEdit = (cust) => {
    setEditingCust(cust);
    const addr = typeof cust.address === "object" && cust.address !== null ? cust.address : {};
    setForm({
      name: cust.name || "",
      phone: cust.phone || "",
      email: cust.email || "",
      street: addr.street || (typeof cust.address === "string" ? cust.address : ""),
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      country: addr.country || "India",
      notes: cust.notes || "",
      tags: Array.isArray(cust.tags) ? cust.tags.join(", ") : (cust.tags || ""),
    });
    setAddModalOpen(true);
  };

  const [actionLoadingId, setActionLoadingId] = useState(null);

  const handleSoftDelete = async (cust) => {
    const custId = cust._id || cust.id;
    if (actionLoadingId) return;
    if (confirm(`Deactivate customer ${cust.name}?`)) {
      setActionLoadingId(custId);
      try {
        await customerService.deleteCustomer(custId);
        toast.success(`Customer ${cust.name} set to inactive.`);
        await loadBackendCustomers();
      } catch (error) {
        toast.error(error?.message || "Failed to deactivate customer.");
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleRestore = async (cust) => {
    const custId = cust._id || cust.id;
    if (actionLoadingId) return;
    setActionLoadingId(custId);
    try {
      await customerService.restoreCustomer(custId);
      toast.success(`Customer ${cust.name} restored to active!`);
      await loadBackendCustomers();
    } catch (error) {
      toast.error(error?.message || "Failed to restore customer.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePermanentDelete = async (cust) => {
    const custId = cust._id || cust.id;
    if (actionLoadingId) return;
    if (confirm(`PERMANENT DELETE: Are you sure you want to permanently remove ${cust.name}? This action cannot be undone.`)) {
      setActionLoadingId(custId);
      try {
        await customerService.permanentDeleteCustomer(custId);
        toast.success(`Customer ${cust.name} permanently deleted.`);
        await loadBackendCustomers();
      } catch (error) {
        toast.error(error?.message || "Failed to permanently delete customer.");
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleFormChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone number are required.");
      return;
    }

    const phoneDigits = form.phone.replace(/[^\d]/g, "");
    if (phoneDigits.length < 10) {
      toast.error("Please enter a valid phone number with at least 10 digits.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: {
        street: form.street.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        country: form.country.trim() || "India",
      },
      notes: form.notes.trim(),
      tags: typeof form.tags === "string"
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : form.tags || [],
    };

    setLoading(true);
    try {
      if (editingCust) {
        const custId = editingCust._id || editingCust.id;
        await customerService.updateCustomer(custId, payload);
        toast.success("Customer record updated!");
      } else {
        await customerService.addCustomer(payload);
        toast.success("New customer created!");
      }
      setAddModalOpen(false);
      loadBackendCustomers();
    } catch (error) {
      toast.error(error?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return "—";
    if (typeof addr === "string") return addr;
    const parts = [addr.street, addr.city, addr.state, addr.pincode, addr.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "—";
  };

  const filteredCustomers = (customers || []).filter((c) => {
    if (!c) return false;
    const q = search.toLowerCase();
    const addrStr = formatAddress(c.address).toLowerCase();
    const tagsStr = Array.isArray(c.tags) ? c.tags.join(" ").toLowerCase() : "";

    const matchesSearch =
      c.name?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      addrStr.includes(q) ||
      tagsStr.includes(q);

    if (!matchesSearch) return false;

    if (filterStatus === "active") return c.isActive !== false;
    if (filterStatus === "inactive") return c.isActive === false;
    return true;
  });

  return (
    <div className="space-y-6 pb-8 font-sans">
      <Card className="!p-6 sm:!p-7">
        <SectionHeader
          title="Customer CRM Directory"
          subtitle="Manage client contact profiles, address details, notes, and tags"
        >
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsImportModalOpen(true)}
              size="md"
              className="font-bold rounded-xl text-xs px-4 py-2.5 shrink-0 whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-emerald-600 border-emerald-500/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              <IoCloudUploadOutline size={18} /> Import Excel / CSV
            </Button>
            <Button onClick={handleOpenAdd} size="md" className="font-bold rounded-xl text-xs px-4 py-2.5 shrink-0 whitespace-nowrap flex items-center gap-1.5 cursor-pointer">
              <IoPersonAddOutline size={18} /> Add Customer
            </Button>
          </div>
        </SectionHeader>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-4">
          <div className="relative flex-1 max-w-md">
            <IoSearchOutline className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              type="text"
              placeholder="Search by name, phone, city, email or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bf-input pl-10"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            {[
              ["all", "All"],
              ["active", "Active"],
              ["inactive", "Inactive"],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilterStatus(val)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterStatus === val
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        {fetching && customers.length === 0 ? (
          <SkeletonLoader type="table" rows={6} columns={6} />
        ) : filteredCustomers.length === 0 ? (
          <EmptyState
            icon={IoPeopleOutline}
            title="No customers found"
            description={search ? "Try searching with a different keyword." : "Click '+ Add Customer' to create your first client record."}
          />
        ) : (
          <div className="-mx-6 -mb-6 sm:-mx-7 sm:-mb-7 overflow-x-auto">
            <table className="bf-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Contact Info</th>
                  <th>Address & Location</th>
                  <th>Tags</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((cust) => {
                  const isActive = cust.isActive !== false;
                  return (
                    <tr
                      key={cust._id || cust.id}
                      className={`transition-colors ${isActive
                        ? "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        : "bg-slate-50/40 dark:bg-slate-900/40 opacity-75 hover:opacity-100"
                        }`}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-white text-xs shrink-0 ${isActive ? "bg-blue-600" : "bg-slate-400 dark:bg-slate-700"
                            }`}>
                            {cust.name?.[0]?.toUpperCase() || "C"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{cust.name}</p>
                            {cust.notes && (
                              <p className="text-[11px] text-slate-400 truncate max-w-xs">{cust.notes}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="space-y-0.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                          <p className="flex items-center gap-1.5">
                            <IoCallOutline size={13} className="text-slate-400" /> {cust.phone || "—"}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <IoMailOutline size={13} className="text-slate-400" /> {cust.email || "—"}
                          </p>
                        </div>
                      </td>
                      <td className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-xs">
                        <p className="flex items-start gap-1">
                          <IoLocationOutline size={14} className="text-slate-400 mt-0.5 shrink-0" />
                          <span className="truncate">{formatAddress(cust.address)}</span>
                        </p>
                      </td>
                      <td>
                        {Array.isArray(cust.tags) && cust.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {cust.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800"
                              >
                                <IoPricetagOutline size={10} />
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td>
                        <Badge variant={isActive ? "success" : "neutral"}>
                          {isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Send WhatsApp Payment Reminder */}
                          <button
                            onClick={() => handleSendWhatsAppReminder(cust)}
                            className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                            title="Send WhatsApp Statement / Payment Reminder"
                          >
                            <IoChatbubbleEllipsesOutline size={17} />
                          </button>

                          {/* View Customer Details & Sales History */}
                          <button
                            onClick={() => setViewingCust(cust)}
                            className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="View Customer Profile & Sales Invoices"
                          >
                            <IoEyeOutline size={17} />
                          </button>

                          {actionLoadingId === (cust._id || cust.id) ? (
                            <div className="p-2 flex items-center gap-1 text-blue-600 dark:text-blue-400">
                              <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span className="text-[11px] font-bold">Processing...</span>
                            </div>
                          ) : (
                            <>
                              {/* Edit Button */}
                              {isActive && (
                                <button
                                  onClick={() => handleOpenEdit(cust)}
                                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                  title="Edit Customer"
                                >
                                  <IoCreateOutline size={17} />
                                </button>
                              )}

                              {/* Soft Delete (Deactivate) Button */}
                              {isActive && (
                                <button
                                  onClick={() => handleSoftDelete(cust)}
                                  className="p-2 rounded-lg text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600 transition-colors cursor-pointer"
                                  title="Soft Delete (Deactivate)"
                                >
                                  <IoTrashOutline size={17} />
                                </button>
                              )}

                              {/* Restore Button (for Inactive) */}
                              {!isActive && (
                                <button
                                  onClick={() => handleRestore(cust)}
                                  className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors cursor-pointer"
                                  title="Restore Customer"
                                >
                                  <IoRefreshOutline size={17} />
                                </button>
                              )}

                              {/* Permanent Delete Button */}
                              <button
                                onClick={() => handlePermanentDelete(cust)}
                                className="p-2 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 transition-colors cursor-pointer"
                                title="Permanent Delete"
                              >
                                <IoTrashBinOutline size={17} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modern, Compact, Good-Looking Add / Edit Customer Modal */}
      {addModalOpen && (
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title={editingCust ? "Edit Customer Profile" : "Create New Customer"}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center gap-3 w-full">
              <Button type="submit" form="customer-form" loading={loading} className="flex-1 font-bold">
                {editingCust ? "Update Customer" : "Save Customer"}
              </Button>
              <Button
                type="button"
                onClick={() => setAddModalOpen(false)}
                variant="secondary"
                className="flex-1 font-bold"
              >
                Cancel
              </Button>
            </div>
          }
        >
          <form id="customer-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Primary Details: Name, Phone, Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="bf-label !text-xs font-bold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={handleFormChange("name")}
                  placeholder="e.g. Rahul Sharma"
                  className="bf-input"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="bf-label !text-xs font-bold">Phone * (10 digits)</label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={handleFormChange("phone")}
                  placeholder="9876543210"
                  className="bf-input"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="bf-label !text-xs font-bold">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={handleFormChange("email")}
                  placeholder="rahul@example.com"
                  className="bf-input"
                />
              </div>
            </div>

            {/* Address Group Card */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                Address Details
              </span>

              <div>
                <label className="bf-label !text-[11px]">Street Address</label>
                <input
                  type="text"
                  value={form.street}
                  onChange={handleFormChange("street")}
                  placeholder="12 MG Road, Sector 15"
                  className="bf-input"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="bf-label !text-[11px]">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={handleFormChange("city")}
                    placeholder="Bengaluru"
                    className="bf-input"
                  />
                </div>
                <div>
                  <label className="bf-label !text-[11px]">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={handleFormChange("state")}
                    placeholder="Karnataka"
                    className="bf-input"
                  />
                </div>
                <div>
                  <label className="bf-label !text-[11px]">Pincode</label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={handleFormChange("pincode")}
                    placeholder="560001"
                    className="bf-input"
                  />
                </div>
                <div>
                  <label className="bf-label !text-[11px]">Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={handleFormChange("country")}
                    placeholder="India"
                    className="bf-input"
                  />
                </div>
              </div>
            </div>

            {/* Secondary Details: Tags & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="bf-label !text-xs">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={handleFormChange("tags")}
                  placeholder="VIP, Wholesale, Retail"
                  className="bf-input"
                />
              </div>
              <div>
                <label className="bf-label !text-xs">Notes (Optional)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={handleFormChange("notes")}
                  placeholder="Regular customer since 2023..."
                  className="bf-input"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {viewingCust && (
        <CustomerDetailsModal
          customer={viewingCust}
          onClose={() => setViewingCust(null)}
        />
      )}

      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={loadBackendCustomers}
      />
    </div>
  );
}
