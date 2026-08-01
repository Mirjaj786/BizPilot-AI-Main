import { useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  IoCloudUploadOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircle,
  IoAlertCircleOutline,
  IoDownloadOutline,
} from "react-icons/io5";
import Modal from "./Modal.jsx";
import Button from "../Button/Button.jsx";
import { customerService } from "../../services/customerService.js";
import { salesService } from "../../services/salesService.js";
import * as XLSX from "xlsx";
import Papa from "papaparse";

export default function DataImportModal({ isOpen, onClose, onImportSuccess }) {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("customers"); // "customers" | "sales"
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [mappedRows, setMappedRows] = useState([]);
  const [duplicateStrategy, setDuplicateStrategy] = useState("update"); // "update" | "skip" | "create"
  const [loading, setLoading] = useState(false);
  const [importSummary, setImportSummary] = useState(null);

  if (!isOpen) return null;

  const resetState = () => {
    setFile(null);
    setParsedData([]);
    setMappedRows([]);
    setImportSummary(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helper to map column headers to standard fields
  const mapColumns = (rows, type) => {
    if (!rows || rows.length === 0) return [];

    return rows.map((row, index) => {
      const keys = Object.keys(row);
      const getVal = (...possibleKeys) => {
        const foundKey = keys.find((k) =>
          possibleKeys.some((pk) => k.toLowerCase().trim().includes(pk))
        );
        return foundKey ? String(row[foundKey] || "").trim() : "";
      };

      if (type === "customers") {
        const name = getVal("name", "party", "customer", "client", "full name");
        const rawPhone = getVal("phone", "mobile", "contact", "cell");
        // Clean phone format
        const phone = rawPhone ? rawPhone.replace(/[^\d+]/g, "") : "";
        const phoneDigits = phone.replace(/[^\d]/g, "");
        const email = getVal("email", "mail");
        const notes = getVal("note", "due", "balance", "address");

        return {
          id: index + 1,
          name: name || `Imported Client #${index + 1}`,
          phone: phone || `98765${String(index).padStart(5, "0")}`,
          email: email || "",
          notes: notes || "Imported via Excel/CSV",
          isValid: Boolean(name && phoneDigits.length >= 10),
        };
      } else {
        // Sales Mapping
        const customerName = getVal("customer", "name", "client", "buyer");
        const totalRaw = getVal("total", "amount", "price", "revenue");
        const total = Number(totalRaw.replace(/[^\d.]/g, "")) || 0;
        const statusVal = getVal("status", "payment", "type");
        const status = statusVal.toLowerCase().includes("pending") ? "Pending" : "Paid";
        const itemName = getVal("item", "product", "description") || "General Store Items";

        return {
          id: index + 1,
          customerName: customerName || "Walk-in Customer",
          items: [{ name: itemName, price: total, quantity: 1 }],
          total,
          status,
          paymentMethod: getVal("method", "mode") || "Cash",
          isValid: total > 0,
        };
      }
    });
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setLoading(true);

    const fileExt = uploadedFile.name.split(".").pop().toLowerCase();

    if (fileExt === "csv") {
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setParsedData(results.data);
          const mapped = mapColumns(results.data, activeTab);
          setMappedRows(mapped);
          setLoading(false);
          toast.success(`Loaded ${mapped.length} rows from CSV`);
        },
        error: (err) => {
          toast.error("Failed to parse CSV file: " + err.message);
          setLoading(false);
        },
      });
    } else if (fileExt === "xlsx" || fileExt === "xls") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const workbook = XLSX.read(bstr, { type: "binary" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          setParsedData(json);
          const mapped = mapColumns(json, activeTab);
          setMappedRows(mapped);
          toast.success(`Loaded ${mapped.length} rows from Excel`);
        } catch (err) {
          toast.error("Failed to parse Excel file: " + err.message);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsBinaryString(uploadedFile);
    } else {
      toast.error("Unsupported file format. Please upload a .csv or .xlsx file.");
      setLoading(false);
    }
  };

  const handleDownloadSample = () => {
    let sampleData = [];
    let fileName = "";

    if (activeTab === "customers") {
      sampleData = [
        { "Customer Name": "Rahul Sharma", Phone: "+91 98765 43210", Email: "rahul@gmail.com", Notes: "VIP Client" },
        { "Customer Name": "Priya Verma", Phone: "+91 98123 45678", Email: "priya@gmail.com", Notes: "Pending Dues ₹1500" },
        { "Customer Name": "Amit Patel", Phone: "+91 99887 76655", Email: "amit@gmail.com", Notes: "Regular Shopper" },
      ];
      fileName = "BizPilot_Sample_Customers.xlsx";
    } else {
      sampleData = [
        { "Customer Name": "Rahul Sharma", "Item Name": "Basmati Rice 5kg", Total: 650, Status: "Paid", "Payment Method": "UPI" },
        { "Customer Name": "Priya Verma", "Item Name": "Sunflower Oil 5L", Total: 850, Status: "Pending", "Payment Method": "Credit" },
      ];
      fileName = "BizPilot_Sample_Sales.xlsx";
    }

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample");
    XLSX.writeFile(wb, fileName);
    toast.success(`Downloaded ${fileName}`);
  };

  const handleProcessImport = async () => {
    if (mappedRows.length === 0) {
      toast.error("No valid rows to import.");
      return;
    }

    setLoading(true);

    try {
      const validRows = mappedRows.filter((r) => r.isValid);

      if (activeTab === "customers") {
        const stats = await customerService.bulkImportCustomers(validRows, duplicateStrategy);
        const data = stats || {};
        setImportSummary({
          total: mappedRows.length,
          success: data.importedCount || 0,
          updated: data.updatedCount || 0,
          skipped: data.skippedCount || (mappedRows.length - ((data.importedCount || 0) + (data.updatedCount || 0))),
        });
        toast.success(`Import completed: ${data.importedCount || 0} created, ${data.updatedCount || 0} updated!`);
      } else {
        let successCount = 0;
        for (const row of validRows) {
          try {
            await salesService.createSale({
              customerName: row.customerName,
              items: row.items,
              paymentMethod: row.paymentMethod,
              status: row.status,
            });
            successCount++;
          } catch {
            // Continue
          }
        }
        setImportSummary({
          total: mappedRows.length,
          success: successCount,
          updated: 0,
          skipped: mappedRows.length - successCount,
        });
        toast.success(`Imported ${successCount} sales invoices successfully!`);
      }

      if (onImportSuccess) onImportSuccess();
    } catch (err) {
      toast.error(err.message || "Failed to process import.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="1-Click Excel / CSV Data Importer" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Type Selector Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
            <button
              onClick={() => {
                setActiveTab("customers");
                resetState();
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "customers"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Import Customers CRM
            </button>
            <button
              onClick={() => {
                setActiveTab("sales");
                resetState();
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "sales"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Import Past Sales History
            </button>
          </div>

          <button
            onClick={handleDownloadSample}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <IoDownloadOutline size={16} /> Sample Template
          </button>
        </div>

        {/* File Dropzone */}
        {!mappedRows.length && !importSummary && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-800/30 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all cursor-pointer"
          >
            <IoCloudUploadOutline className="mx-auto text-4xl text-blue-600 dark:text-blue-400 mb-3 animate-bounce" />
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
              Upload {activeTab === "customers" ? "Customer Ledger" : "Sales History"} (.xlsx or .csv)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Drag and drop your spreadsheet here or click to browse files
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Data Preview Table */}
        {mappedRows.length > 0 && !importSummary && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">
                Preview ({mappedRows.length} items parsed from {file?.name})
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                Auto Column Mapping Active ✓
              </span>
            </div>

            {/* Smart Duplicate Resolution Selector */}
            {activeTab === "customers" && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  If Customer Account Already Exists:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
                  {[
                    { id: "update", label: "🔄 Update Profile", desc: "Merge new notes & info" },
                    { id: "skip", label: "⏭️ Skip Duplicate", desc: "Ignore matching phone/email" },
                    { id: "create", label: "➕ Create New Entry", desc: "Import as separate profile" },
                  ].map((strat) => (
                    <button
                      key={strat.id}
                      type="button"
                      onClick={() => setDuplicateStrategy(strat.id)}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        duplicateStrategy === strat.id
                          ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 shadow-2xs"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <p className="font-extrabold">{strat.label}</p>
                      <p className="text-[10px] font-normal opacity-80">{strat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 sticky top-0 font-extrabold">
                  <tr>
                    <th className="p-2.5">#</th>
                    {activeTab === "customers" ? (
                      <>
                        <th className="p-2.5">Name</th>
                        <th className="p-2.5">Phone</th>
                        <th className="p-2.5">Notes / Dues</th>
                      </>
                    ) : (
                      <>
                        <th className="p-2.5">Customer</th>
                        <th className="p-2.5">Total (₹)</th>
                        <th className="p-2.5">Status</th>
                      </>
                    )}
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {mappedRows.slice(0, 10).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 text-slate-400">{r.id}</td>
                      {activeTab === "customers" ? (
                        <>
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">{r.name}</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">{r.phone}</td>
                          <td className="p-2.5 text-slate-500">{r.notes}</td>
                        </>
                      ) : (
                        <>
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">{r.customerName}</td>
                          <td className="p-2.5 text-emerald-600 font-bold">₹{r.total}</td>
                          <td className="p-2.5">{r.status}</td>
                        </>
                      )}
                      <td className="p-2.5">
                        {r.isValid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-extrabold">
                            <IoCheckmarkCircle /> Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                            <IoAlertCircleOutline /> Check
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={resetState}>
                Upload Different File
              </Button>
              <Button variant="primary" size="md" loading={loading} onClick={handleProcessImport}>
                Import {mappedRows.length} Items Now
              </Button>
            </div>
          </div>
        )}

        {/* Final Import Summary Report */}
        {importSummary && (
          <div className="text-center p-6 space-y-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl">
            <IoCheckmarkCircle className="mx-auto text-5xl text-emerald-500" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Data Import Completed Successfully!
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto text-xs">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-400 font-bold">Total Parsed</p>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">{importSummary.total}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-emerald-600 font-bold">Created New</p>
                <p className="text-lg font-extrabold text-emerald-600">{importSummary.success}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-blue-500 font-bold">Updated Dues</p>
                <p className="text-lg font-extrabold text-blue-600">{importSummary.updated || 0}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-amber-500 font-bold">Skipped</p>
                <p className="text-lg font-extrabold text-amber-500">{importSummary.skipped}</p>
              </div>
            </div>

            <Button variant="primary" size="md" onClick={() => { resetState(); onClose(); }}>
              Close & View Updated Dashboard
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
