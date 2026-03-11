import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { ENV } from "./src/config/env.js";
import { connectDB } from "./src/lib/db.js";

/* import routes here */ 
import userAuth from "./src/routes/auth.routes.js"

const app = express();

const PORT = ENV.PORT;

if (process.env.NODE_ENV != "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ENV.CLIENT_ORIGIN,
  credentials: true
}))

app.use("/api/auth", userAuth)


const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log("Server is running on port:", PORT));
  } catch (error) {
    console.error("Error starting the server", error);
  }
};

startServer();