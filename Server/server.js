import express from "express";
import cors from "cors";
import { DOTENV } from "./lib/dotenv.js";

const PORT = DOTENV.PORT;

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
