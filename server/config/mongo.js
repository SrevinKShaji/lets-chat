import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lets-chat";

mongoose.connect(MONGO_URI).catch((err) => {
  console.error("Initial Mongo connection error:", err.message);
});

mongoose.connection.on("connected", () => {
  console.log("Mongo has connected successfully");
});
mongoose.connection.on("reconnected", () => {
  console.log("Mongo has reconnected");
});
mongoose.connection.on("error", (error) => {
  console.log("Mongo connection error:", error);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongo connection disconnected");
});

