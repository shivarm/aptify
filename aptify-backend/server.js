import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { ENV } from "./src/config/env.js";
import { connectDB } from "./src/lib/db.js";
import dns from "node:dns"

/* import routes here */ 
import authRoutes from "./src/routes/auth.routes.js"
import interviewRoutes from "./src/routes/interview.routes.js";

const app = express();
// Trust first proxy (needed for Render and other cloud hosts)
app.set('trust proxy', 1);

const PORT = ENV.PORT;

if (ENV.NODE_ENV != "production") {
  app.use(morgan("dev"));
}
dns.setServers(['8.8.8.8', '1.1.1.1']);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ENV.CLIENT_ORIGIN,
  credentials: true
}))

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);


const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log("Server is running on port:", PORT));
  } catch (error) {
    console.error("Error starting the server", error);
  }
};

startServer();
