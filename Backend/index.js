import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import ErrorHandler from "./middlewares/errorHandler.js";
import userRoute from "./routes/userRoute.js";
import database from "./config/database.js"

const app = express();

app.use(express.json());
app.use(cors());

app.listen(8080, () => {
  console.log("server was listin at 8080: ");
});
database();

app.use(ErrorHandler);

app.use("/api", userRoute);
