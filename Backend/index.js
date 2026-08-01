import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import database from "./config/database.js";

import ErrorHandler from "./middlewares/errorHandler.js";
import userRoute from "./routes/userRoute.js";
import customerRoute from "./routes/customerRoute.js";
import taskRoute from "./routes/taskRoute.js";
import saleRoute from "./routes/saleRoute.js";
import aiRoute from "./routes/aiRoute.js";

const app = express();

app.use(express.json());

// CORS Configuration for Production Netlify Frontend & Local Development
const allowedOrigins = [
  "https://bizpilotcrm.netlify.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".netlify.app") || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "bf_token"],
  })
);

app.get("/", (req, res) => {
  res.json({ message: "BizPilot AI Backend API is running live on Vercel! 🚀" });
});

database();

app.use("/api", userRoute);
app.use("/api/customers", customerRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/sales", saleRoute);
app.use("/api/ai", aiRoute);

app.use(ErrorHandler);

const PORT = process.env.PORT || 8080;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
