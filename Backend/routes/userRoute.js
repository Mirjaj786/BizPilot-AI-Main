import express from "express";
const router = express.Router();
import { getMe, login, logout, register } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/auth/me").get(authMiddleware, getMe);
router.route("/logout").post(authMiddleware, logout);

export default router;
