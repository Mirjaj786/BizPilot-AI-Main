import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createSale,
  getAllSales,
  getSaleById,
  getSalesStats,
} from "../controllers/saleController.js";

const router = express.Router();

router.route("/create").post(authMiddleware, createSale);
router.route("/stats").get(authMiddleware, getSalesStats);
router.route("/get-all").get(authMiddleware, getAllSales);
router.route("/:id").get(authMiddleware, getSaleById);

export default router;
