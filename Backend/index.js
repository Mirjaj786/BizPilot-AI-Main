import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(8080, () => {
  console.log("server was listin at 8080: ");
});
