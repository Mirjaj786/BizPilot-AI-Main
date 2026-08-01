import { useState, useContext } from "react";
import Modal from "./Modal.jsx";
import Badge from "./Badge.jsx";
import Button from "../Button/Button.jsx";
import InvoiceModal from "./InvoiceModal.jsx";
import { StoreContext } from "../../context/StoreContext.jsx";
import {
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoPricetagOutline,
  IoReceiptOutline,
  IoPrintOutline,
  IoCalendarOutline,
  IoBriefcaseOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";

export default function CustomerDetailsModal({ customer, onClose }) {
  const { sales, settings } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "sales"
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  if (!customer) return null;

  const currency = settings?.currency || "₹";
  const custId = customer._id || customer.id;
  const isActive = customer.isActive !== false;

  // Match customer's sales
  const customerSales = (sales || []).filter((s) => {
    if (!s) return false;
    const saleCustId = s.customer?._id || s.customer?.id || (typeof s.customer === "string" ? s.customer : s.customerId);
    const saleCustName = s.customer?.name || s.customerName || (typeof s.customer === "string" ? s.customer : "");

    return (
      (saleCustId && String(saleCustId) === String(custId)) ||
      (saleCustName && saleCustName.toLowerCase() === (customer.name || "").toLowerCase())
    );
  });

  const totalSpentCalculated = customerSales.reduce(
    (sum, s) => sum + (s.status === "Paid" ? Number(s.total || s.amount || 0) : 0),
    0
  );
  const totalSpent = totalSpentCalculated > 0 ? totalSpentCalculated : (customer.totalSpent || 0);
  const ordersCount = customerSales.length > 0 ? customerSales.length : (customer.ordersCount || 0);

  const pendingDues = customerSales
    .filter((s) => s.status === "Pending" || s.status === "Unpaid")
    .reduce((sum, s) => sum + Number(s.total || s.amount || 0), 0);

  const handleSendWhatsApp = () => {
    const phone = customer.phone ? customer.phone.replace(/[^0-9]/g, "") : "";
    const duesAmount = pendingDues > 0 ? pendingDues : Number(customer.outstandingBalance || 0);
    const businessName = settings?.businessName || "BizPilot AI Store";

    const textMessage = `*Dear ${customer.name},*\n\nGreetings from *${businessName}*! 👋\n\nThis is a friendly statement reminder regarding your account:\n-------------------------------------------\n💰 *Outstanding Dues*: ${currency}${duesAmount.toLocaleString()}\n📌 *Total Orders*: ${ordersCount} checkouts\n-------------------------------------------\n\nKindly settle your pending balance via UPI / Bank Transfer at your earliest convenience.\n\nThank you for your business! 🙏\n\n*${businessName}*`;

    const whatsappUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(textMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(textMessage)}`;

    window.open(whatsappUrl, "_blank");
  };

  const formatAddress = (addr) => {
    if (!addr) return "No address provided";
    if (typeof addr === "string") return addr;
    const parts = [addr.street, addr.city, addr.state, addr.pincode, addr.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "No address provided";
  };

  return (
    <>
      <Modal title="Customer Account Details" onClose={onClose}>
        <div className="space-y-5 font-sans max-w-2xl">
          {/* Header Profile Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/40 dark:from-slate-900 dark:to-slate-800/80 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-black text-white text-base shadow-xs ${isActive ? "bg-blue-600" : "bg-slate-500"
                }`}>
                {customer.name?.[0]?.toUpperCase() || "C"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {customer.name}
                  </h3>
                  <Badge variant={isActive ? "success" : "neutral"}>
                    {isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                  <IoBriefcaseOutline size={13} /> {customer.business || customer.address?.city || "Individual Client"}
                </p>
              </div>
            </div>

            {/* Quick Metrics & WhatsApp Button */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
              <button
                onClick={handleSendWhatsApp}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Send WhatsApp Statement & Reminder"
              >
                <span>💬</span> WhatsApp Statement
              </button>

              <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Spent</p>
                <p className="text-xs font-black text-slate-900 dark:text-white">{currency}{totalSpent.toLocaleString()}</p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Checkouts</p>
                <p className="text-xs font-black text-blue-600 dark:text-blue-400">{ordersCount} orders</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "overview"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
            >
              Contact & Overview
            </button>
            <button
              onClick={() => setActiveTab("sales")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "sales"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
            >
              <IoReceiptOutline size={14} />
              Sales & Invoices ({customerSales.length})
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                  <p className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                    <IoCallOutline size={14} className="text-blue-500" /> Phone Number
                  </p>
                  <p className="font-extrabold text-slate-900 dark:text-white">{customer.phone || "—"}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                  <p className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                    <IoMailOutline size={14} className="text-blue-500" /> Email Address
                  </p>
                  <p className="font-extrabold text-slate-900 dark:text-white truncate">{customer.email || "—"}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
                <p className="text-slate-400 font-medium flex items-center gap-1.5">
                  <IoLocationOutline size={14} className="text-blue-500" /> Address & Location
                </p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {formatAddress(customer.address)}
                </p>
              </div>

              {pendingDues > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold">
                    <IoAlertCircleOutline size={18} />
                    <span>Pending Dues: {currency}{pendingDues.toLocaleString()}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Payment Due</span>
                </div>
              )}

              {/* Tags & Notes */}
              {Array.isArray(customer.tags) && customer.tags.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1.5">Tags & Classification</p>
                  <div className="flex flex-wrap gap-1.5">
                    {customer.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800"
                      >
                        <IoPricetagOutline size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {customer.notes && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
                  <p className="text-slate-400 font-medium mb-0.5">Notes</p>
                  <p className="text-slate-700 dark:text-slate-300 italic">{customer.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SALES & INVOICES */}
          {activeTab === "sales" && (
            <div className="space-y-3">
              {customerSales.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  <IoReceiptOutline size={28} className="mx-auto text-slate-300 mb-2" />
                  No sales invoices recorded for this customer yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {customerSales.map((s) => (
                    <div
                      key={s._id || s.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs hover:bg-white dark:hover:bg-slate-800 transition-all shadow-2xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-900 dark:text-white">
                            {s.invoiceNo || s._id || s.id}
                          </span>
                          <Badge variant={s.status === "Paid" ? "success" : "warning"}>
                            {s.status}
                          </Badge>
                          <span className="px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            {s.paymentMethod || s.method || "Cash"}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] flex items-center gap-1">
                          <IoCalendarOutline size={12} />
                          {s.saleDate ? new Date(s.saleDate).toLocaleDateString() : s.date || "N/A"}
                          <span className="mx-1">•</span>
                          {s.items?.length || 1} items
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          {currency}{(s.total || s.amount || 0).toLocaleString()}
                        </span>
                        <button
                          onClick={() => setSelectedInvoice(s)}
                          className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                          title="View & Print Invoice Receipt"
                        >
                          <IoPrintOutline size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex justify-end">
            <Button onClick={onClose} variant="secondary" size="md">
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Invoice Modal Popup for viewing individual receipts from customer history */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          settings={settings}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </>
  );
}
