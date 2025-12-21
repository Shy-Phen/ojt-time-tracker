import express from "express";
import cors from "cors";
import { DOTENV } from "./lib/dotenv.js";
import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./lib/DB.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import path from "path";

import timeRoutes from "./routes/timeRoutes.js";

const PORT = DOTENV.PORT;
const __dirname = path.resolve();

const app = express();

app.use(clerkMiddleware());

//Middleware
app.use(cors());
app.use(express.json());

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/time", timeRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
  });
});

if (DOTENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Client/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../Client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
