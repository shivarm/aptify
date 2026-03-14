import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { ENV } from "./src/config/env.js";
import { connectDB } from "./src/lib/db.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* import routes here */ 
import authRoutes from "./src/routes/auth.routes.js"
import interviewRoutes from "./src/routes/interview.routes.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = ENV.PORT;

if (ENV.NODE_ENV != "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ENV.CLIENT_ORIGIN,
  credentials: true
}))

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

if (ENV.NODE_ENV === "production") {
  // From aptify-backend to ai-app, then into aptify-frontend/dist
  const clientDistPath = path.resolve(__dirname, "../aptify-frontend/dist");
  
  app.use(express.static(clientDistPath));

  app.get("/{*any}", (_, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log("Server is running on port:", PORT));
  } catch (error) {
    console.error("Error starting the server", error);
  }
};

startServer();
