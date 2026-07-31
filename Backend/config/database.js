import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected`);
    console.log(`Host : ${conn.connection.host}`);
    console.log(`Database : ${conn.connection.name}`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;