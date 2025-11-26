import mongoose from "mongoose";

async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error("please define mongo environment variable");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  const opts = {
    bufferCommands: false,
  };
  await mongoose.connect(MONGO_URI, opts);
  return mongoose;
}

export default connectDB;
