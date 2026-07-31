import express from "express";
import {
  createTask,
  deleteTask,
  getAllTask,
  getOneTask,
  searchTask,
  updateTask,
} from "../controllers/taskController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/create").post(authMiddleware, createTask);
router.route("/get-all").get(authMiddleware, getAllTask);
router.route("/search").get(authMiddleware, searchTask);
router.route("/:id").get(authMiddleware, getOneTask);
router.route("/update/:id").put(authMiddleware, updateTask);
router.route("/delete/:id").delete(authMiddleware, deleteTask);

export default router;
