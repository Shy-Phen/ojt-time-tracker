import express from "express";
import { DOTENV } from "./lib/dotenv.js";
import { connectDB } from "./lib/DB.js";
import { toNodeHandler } from "better-auth/node";
import { initializeAuth, getAuth } from "./lib/auth.js";
import cors from "cors";
import path from "path";
import morgan from "morgan";

import timeRoutes from "./routes/timeRoutes.js";

const PORT = DOTENV.PORT;
const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Start server function to initialize auth before setting up routes
const startServer = async () => {
  try {
    // 1. Connect to database
    await connectDB();
    console.log("✅ Database connected");

    // 2. Initialize Better Auth
    await initializeAuth();
    console.log("✅ Better Auth initialized");

    // 3. Get auth instance and create handler
    const auth = getAuth();
    const authHandler = toNodeHandler(auth);

    // 4. Setup auth routes with the handler
    app.all("/api/auth/{*any}", authHandler);

    // 5. Other routes
    app.use("/api/time", timeRoutes);

    app.get("/itawit", (req, res) => {
      res.status(200).json({
        success: true,
        message: "Relax ka lang kaldo ka sangaw🚀",
      });
    });

    // 6. Production setup
    if (DOTENV.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../Client/dist")));

      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../Client", "dist", "index.html"));
      });
    }

    // 7. Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
