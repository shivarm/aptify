import express from "express";
import { ENV } from "./src/config/env.js";
import { connectDB } from "./src/lib/db.js";

const app = express();

const PORT = ENV.PORT;


const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log("Server is running on port:", PORT));
  } catch (error) {
    console.error("Error starting the server", error);
  }
};

startServer();