import { useState } from "react";
import Modal from "./Modal.jsx";
import Button from "../Button/Button.jsx";
import { IoPrintOutline } from "react-icons/io5";

export default function InvoiceModal({ invoice, settings, onClose }) {
  if (!invoice) return null;

  const currency = settings?.currency || "₹";
  const invoiceNo = invoice.invoiceNo || invoice._id || invoice.id || "BF-2026-INV";
  const customerName =
    invoice.customer?.name ||
    invoice.customerName ||
    (typeof invoice.customer === "string" ? invoice.customer : "Walk-in Customer");
  const invoiceDate = invoice.saleDate
    ? new Date(invoice.saleDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : invoice.date || new Date().toLocaleDateString();

  const paymentMethod = invoice.paymentMethod || invoice.method || "Cash";
  const status = invoice.status || "Paid";
  const totalAmount = Number(invoice.total || invoice.amount || 0);

  const [printing, setPrinting] = useState(false);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 200);
  };

  const handleShareWhatsApp = () => {
    const textMessage = `*Official Receipt - ${settings?.businessName || "BizPilot AI Store"}*\nInvoice: ${invoiceNo}\nDate: ${invoiceDate}\nCustomer: ${customerName}\nTotal Amount: ${currency}${totalAmount.toLocaleString()}\nPayment Status: ${status}\n\nThank you for your business!`;
    const url = `https://wa.me/?text=${encodeURIComponent(textMessage)}`;
    window.open(url, "_blank");
  };

  const footerActions = (
    <div className="flex flex-col sm:flex-row gap-2.5 w-full print:hidden">
      <Button onClick={handlePrint} loading={printing} className="flex-1 font-bold">
        <IoPrintOutline size={16} /> Print Receipt
      </Button>

      <Button onClick={handleShareWhatsApp} className="flex-1 font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
        <span>💬</span> Share via WhatsApp
      </Button>

      <Button onClick={onClose} variant="secondary" className="sm:w-auto font-bold px-5">
        Close
      </Button>
    </div>
  );

  return (
    <Modal title="Official Invoice Receipt" onClose={onClose} footer={footerActions}>
      <div className="space-y-5 font-sans print:space-y-4">
        {/* Printable Area Wrapper */}
        <div id="printable-receipt" className="space-y-5">
          {/* Business header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-200 dark:border-slate-800">
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {settings?.businessName || "BizPilot AI Store"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {settings?.address || "Main Market, Business Plaza"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Phone: {settings?.phone || "+91 98765 43210"}
            </p>
          </div>

          {/* Invoice meta */}
          <div className="grid grid-cols-2 gap-y-3 text-xs pb-4 border-b border-dashed border-slate-200 dark:border-slate-800">
            {[
              ["Invoice Number", <span key="inv" className="font-mono font-bold text-slate-900 dark:text-white">{invoiceNo}</span>],
              ["Billing Date", <span key="dt" className="text-slate-900 dark:text-white">{invoiceDate}</span>],
              ["Customer Account", <span key="cust" className="font-bold text-slate-900 dark:text-white">{customerName}</span>],
              ["Payment Details", <span key="pay" className="text-blue-600 dark:text-blue-400 font-extrabold">{status} ({paymentMethod})</span>],
            ].map(([label, value], i) => (
              <div key={i}>
                <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">{label}</p>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Purchased Items</p>
            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item, idx) => {
                  const qty = Number(item.quantity) || 1;
                  const prc = Number(item.price) || 0;
                  return (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                          {currency}{prc.toLocaleString()} × {qty}
                        </p>
                      </div>
                      <span className="font-extrabold text-slate-900 dark:text-white ml-4 shrink-0">
                        {currency}{(prc * qty).toLocaleString()}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400">Standard Retail Order Item</p>
              )}
            </div>
          </div>

          {/* Notes if available */}
          {invoice.notes && (
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-300">Note:</span> {invoice.notes}
            </div>
          )}

          {/* Total Summary */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Grand Total Amount</span>
            <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
              {currency}{totalAmount.toLocaleString()}
            </span>
          </div>

          {/* Receipt Footer */}
          <div className="text-center pt-2 text-[10px] text-slate-400 border-t border-dashed border-slate-100 dark:border-slate-800">
            <p>Thank you for your business!</p>
            <p className="mt-0.5">Powered by BizPilot AI OS</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

