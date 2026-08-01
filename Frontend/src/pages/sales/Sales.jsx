import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import { salesService } from "../../services/salesService.js";
import Button from "../../components/Button/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";
import InvoiceModal from "../../components/ui/InvoiceModal.jsx";
import DataImportModal from "../../components/ui/DataImportModal.jsx";
import {
  IoCartOutline,
  IoTrashOutline,
  IoAddOutline,
  IoPrintOutline,
  IoSearchOutline,
  IoReceiptOutline,
  IoCloudUploadOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";

const TABS = [
  { id: "billing", label: "POS Billing Terminal" },
  { id: "history", label: "Sales History & Invoices" },
];

const PAYMENT_METHODS = ["UPI", "Cash", "Card", "Due"];

export default function Sales() {
  const { customers, sales, saveSales, settings } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState("billing");
  const [customerId, setCustomerId] = useState(customers[0]?.id || "");
  const [cart, setCart] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQty, setItemQty] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [searchHistory, setSearchHistory] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const currency = settings?.currency || "₹";
  const selectedCust = customers.find((c) => (c._id || c.id) === customerId) || { name: "Walk-in Customer", phone: "" };
  const subtotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const total = Math.max(0, subtotal - (Number(discount) || 0));

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName || !itemPrice || Number(itemPrice) <= 0 || Number(itemQty) <= 0) {
      toast.error("Enter a valid item name, price and quantity.");
      return;
    }
    setCart([...cart, { name: itemName, price: Number(itemPrice), quantity: Number(itemQty) }]);
    setItemName("");
    setItemPrice("");
    setItemQty(1);
  };

  const handleRemoveCartItem = (idx) => {
    setCart(cart.filter((_, i) => i !== idx));
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty.");
      return;
    }
    try {
      const result = await salesService.createSale({
        customer: customerId || null,
        items: cart,
        total,
        paymentMethod: paymentMethod === "Due" ? "Cash" : paymentMethod,
        status: paymentMethod === "Due" ? "Pending" : "Paid",
      });
      if (result) {
        const freshSales = await salesService.getSales();
        saveSales(freshSales.length > 0 ? freshSales : [result, ...sales]);
        toast.success(`Invoice ${result.invoiceNo} generated!`);
        setSelectedInvoice(result);
        setCart([]);
        setDiscount(0);
        setPaymentMethod("UPI");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to complete sale.");
    }
  };

  const getCustomerName = (s) => {
    if (s?.customer && typeof s.customer === "object" && s.customer.name) return s.customer.name;
    if (typeof s?.customer === "string" && s.customer) return s.customer;
    return s?.customerName || "Walk-in Customer";
  };

  const filteredSales = [...sales].filter((s) => {
    const custName = getCustomerName(s).toLowerCase();
    const invNo = (s.invoiceNo || s.id || "").toLowerCase();
    const term = searchHistory.toLowerCase();
    return invNo.includes(term) || custName.includes(term);
  });

  return (
    <div className="space-y-6 pb-8 font-sans">
      {/* Navigation Tabs & Import Action */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === tab.id
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() => setIsImportModalOpen(true)}
          size="md"
          className="font-bold rounded-xl text-xs px-4 py-2 shrink-0 whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-emerald-600 border-emerald-500/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
        >
          <IoCloudUploadOutline size={18} /> Import Excel / CSV
        </Button>
      </div>

      {activeTab === "billing" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Col: Customer & Item Input */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="!p-6">
              <SectionHeader title="Select Client Account" subtitle="Link this POS order to a registered customer in CRM" />
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="bf-select mt-3"
              >
                <option value="">Walk-in Customer (General)</option>
                {customers.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name} {c.address?.city ? `(${c.address.city})` : c.business ? `(${c.business})` : ""} — {c.phone}
                  </option>
                ))}
              </select>
            </Card>

            <Card className="!p-6">
              <SectionHeader title="Add Invoice Items" subtitle="Enter item name, price, and quantity for POS checkout" />
              <form onSubmit={handleAddItem} className="space-y-4 mt-4">
                <div>
                  <label className="bf-label">Item / Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Organic Honey Jar (500g)"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="bf-input"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="bf-label">Unit Price ({currency})</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="350.00"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      className="bf-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="bf-label">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={itemQty}
                      onChange={(e) => setItemQty(e.target.value)}
                      className="bf-input"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" size="md" className="w-full font-bold">
                  Add Item to Cart
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Col: Cart Summary & Checkout */}
          <div className="lg:col-span-5">
            <Card className="!p-6 space-y-6 sticky top-24">
              <SectionHeader title="POS Checkout Ticket" subtitle={`${cart.length} item(s) in active cart`} />

              {cart.length === 0 ? (
                <EmptyState
                  icon={IoCartOutline}
                  title="Cart is empty"
                  description="Use the form on the left to add items to this invoice."
                />
              ) : (
                <div className="space-y-4">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
                    {cart.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                          <p className="text-slate-400">
                            {item.quantity} x {currency}{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            {currency}{(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCartItem(idx)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <IoTrashOutline size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{currency}{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Discount ({currency})</span>
                      <input
                        type="number"
                        min="0"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="bf-input !w-24 !py-1 text-right"
                      />
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>Grand Total</span>
                      <span className="text-blue-600 dark:text-blue-400 text-lg">{currency}{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="bf-label">Payment Method</label>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      {PAYMENT_METHODS.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setPaymentMethod(m)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${paymentMethod === m
                            ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleCompleteSale} size="lg" className="w-full font-bold py-3">
                    <IoReceiptOutline size={18} /> Complete Sale & Print Ticket
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        /* History Tab */
        <Card className="!p-6 sm:!p-7">
          <SectionHeader title="Sales History & Invoices" subtitle="Complete billing archive" />
          <div className="relative max-w-md my-4">
            <IoSearchOutline className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              type="text"
              placeholder="Search invoice number or customer name..."
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              className="bf-input pl-10"
            />
          </div>

          {filteredSales.length === 0 ? (
            <EmptyState icon={IoCartOutline} title="No invoices found" description="Generated sales will appear here." />
          ) : (
            <div className="-mx-6 -mb-6 sm:-mx-7 sm:-mb-7 overflow-x-auto">
              <table className="bf-table">
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((s) => (
                    <tr key={s._id || s.id}>
                      <td className="font-extrabold text-slate-900 dark:text-white font-mono text-xs">{s.invoiceNo || s._id || s.id}</td>
                      <td className="font-semibold text-slate-800 dark:text-slate-200">{getCustomerName(s)}</td>
                      <td className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                        {s.saleDate ? new Date(s.saleDate).toLocaleDateString() : s.date || "N/A"}
                      </td>
                      <td><Badge variant="neutral">{s.paymentMethod || s.method || "Cash"}</Badge></td>
                      <td className="font-bold text-slate-900 dark:text-white">{currency}{(s.total || s.amount || 0).toLocaleString()}</td>
                      <td><Badge variant={s.status === "Paid" ? "success" : s.status === "Pending" || s.status === "Unpaid" ? "warning" : "danger"}>{s.status}</Badge></td>
                      <td className="text-right">
                        <button
                          onClick={() => setSelectedInvoice(s)}
                          className="inline-flex items-center gap-1 rounded-lg p-2 text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Print Invoice"
                        >
                          <IoPrintOutline size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {selectedInvoice && (
        <InvoiceModal invoice={selectedInvoice} settings={settings} onClose={() => setSelectedInvoice(null)} />
      )}

      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={() => {
          if (typeof salesService?.getSales === "function") {
            salesService.getSales().then((s) => s && saveSales(s));
          }
        }}
      />
    </div>
  );
}
