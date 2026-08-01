import express from "express";
const router = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
  bulkImportCustomers,
  createCustomer,
  deleteCustomer,
  getAllCustomer,
  getCustomerById,
  permanentDelete,
  restoreCustomer,
  searchCustomers,
  updateCustomer,
} from "../controllers/customerController.js";

router.route("/create").post(authMiddleware, createCustomer);
router.route("/bulk-import").post(authMiddleware, bulkImportCustomers);
router.route("/get-all").get(authMiddleware, getAllCustomer);
router.route("/search").get(authMiddleware, searchCustomers);
router.route("/get-customer/:id").get(authMiddleware, getCustomerById);
router.route("/delete-customer/:id").delete(authMiddleware, deleteCustomer);
router.route("/update-customer/:id").put(authMiddleware, updateCustomer);
router.route("/restore/:id").patch(authMiddleware, restoreCustomer);
router.route("/permanent-delete/:id").delete(authMiddleware, permanentDelete);

export default router;
