import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createSale,
  getAllSales,
  getSaleById,
  getSalesStats,
  updateSaleStatus,
} from "../controllers/saleController.js";

const router = express.Router();

router.route("/create").post(authMiddleware, createSale);
router.route("/stats").get(authMiddleware, getSalesStats);
router.route("/get-all").get(authMiddleware, getAllSales);
router.route("/:id").get(authMiddleware, getSaleById);
router.route("/:id/status").patch(authMiddleware, updateSaleStatus).put(authMiddleware, updateSaleStatus);

export default router;
