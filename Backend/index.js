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
app.use(cors());

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
