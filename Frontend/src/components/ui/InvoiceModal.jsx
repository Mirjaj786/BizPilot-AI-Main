import Modal from "./Modal.jsx";
import Button from "../Button/Button.jsx";
import { IoPrintOutline } from "react-icons/io5";

export default function InvoiceModal({ invoice, settings, onClose }) {
  const currency = settings.currency || "₹";

  return (
    <Modal title="Invoice receipt" onClose={onClose}>
      <div className="space-y-5">
        {/* Business header */}
        <div className="text-center pb-4 border-b border-dashed border-slate-200 dark:border-slate-800">
          <h4 className="text-[15px] font-bold text-slate-900 dark:text-white">{settings.businessName}</h4>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{settings.address || "Main Market, New Delhi"}</p>
          <p className="text-[12px] text-slate-500 dark:text-slate-400">Phone: {settings.phone || "+91 98765 43210"}</p>
        </div>

        {/* Invoice meta */}
        <div className="grid grid-cols-2 gap-y-3 text-[13px] pb-4 border-b border-dashed border-slate-200 dark:border-slate-800">
          {[
            ["Invoice number", <span className="font-mono text-[12px] text-slate-900 dark:text-white">{invoice.invoiceNo}</span>],
            ["Billing date", <span className="text-slate-900 dark:text-white">{invoice.date}</span>],
            ["Customer", <span className="text-slate-900 dark:text-white">{invoice.customerName}</span>],
            ["Payment", <span className="text-blue-600 dark:text-blue-400 font-bold">{invoice.status} ({invoice.paymentMethod})</span>],
          ].map(([label, value], i) => (
            <div key={i}>
              <p className="text-slate-400 dark:text-slate-500 text-[12px]">{label}</p>
              <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Items */}
        <div className="space-y-2">
          <p className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Items</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {invoice.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-[13px]">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                  <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5">{currency}{item.price} × {item.quantity}</p>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white ml-4">{currency}{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-between">
          <span className="text-[13px] font-bold text-slate-600 dark:text-slate-300">Total amount</span>
          <span className="text-[22px] font-extrabold text-blue-600 dark:text-blue-400">{currency}{invoice.total.toLocaleString()}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button onClick={() => window.print()} className="flex-1">
            <IoPrintOutline size={15} /> Print receipt
          </Button>
          <Button onClick={onClose} variant="secondary" className="flex-1">Close</Button>
        </div>
      </div>
    </Modal>
  );
}
