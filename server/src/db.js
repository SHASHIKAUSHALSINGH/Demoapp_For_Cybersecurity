const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI");

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");
}

module.exports = { connectDB };
