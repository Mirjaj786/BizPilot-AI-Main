import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Database Connected Successfully`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;