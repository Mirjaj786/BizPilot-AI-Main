import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not configured in environment variables!");
    throw new Error("Database configuration error: MONGODB_URI environment variable is missing.");
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fail fast instead of hanging 10 seconds on buffering
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if DB is unreachable
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log(`✅ MongoDB Database Connected Successfully`);
      return mongooseInstance;
    }).catch((error) => {
      cached.promise = null;
      console.error(`❌ MongoDB Connection Failure: ${error.message}`);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectDB;