import express from "express";
import { DOTENV } from "./lib/dotenv.js";
import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./lib/DB.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import cors from "cors";
import path from "path";

import timeRoutes from "./routes/timeRoutes.js";

const PORT = DOTENV.PORT;
const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

app.use(
  cors({
    origin: "http://localhost:5173", // Exact origin
    credentials: true, // Must match frontend's withCredentials
  })
);

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/time", timeRoutes);

app.get("/itawit", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Relax ka lang kaldo ka sangaw🚀",
  });
});

if (DOTENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Client/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../Client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
