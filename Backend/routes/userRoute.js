import express from "express";
const router = express.Router();
import { getMe, login, register } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/auth/me").get(authMiddleware, getMe);

export default router;