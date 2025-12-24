import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createTime,
  updateTime,
  getTime,
  deleteTime,
  viewHistory,
} from "../controllers/timeController.js";

const router = express.Router();

router.post("/", protectRoute, createTime);
router.put("/", protectRoute, updateTime);
router.get("/", protectRoute, getTime);
router.get("/history", protectRoute, viewHistory);
router.delete("/", protectRoute, deleteTime);

export default router;
