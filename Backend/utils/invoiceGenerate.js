import Sale from "../models/saleModel.js";

const generateInvoice = async () => {
  const year = new Date().getFullYear();

  const lastSale = await Sale.findOne().sort({ createdAt: -1 });

  const lastNumber = lastSale
    ? parseInt(lastSale.invoiceNo.split("-")[2], 10)
    : 0;

  const invoiceNo = `BF-${year}-${String(lastNumber + 1).padStart(6, "0")}`;

  return invoiceNo;
};
export default generateInvoice;
