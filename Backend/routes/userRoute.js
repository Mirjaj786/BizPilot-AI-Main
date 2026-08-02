import express from "express";
const router = express.Router();
import { getMe, googleLogin, login, logout, register, forgotPassword, resetPassword } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/google-login").post(googleLogin);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/auth/me").get(authMiddleware, getMe);
router.route("/logout").post(authMiddleware, logout);

export default router;
