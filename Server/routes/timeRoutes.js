import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createTime,
  updateTime,
  getTime,
  deleteTime,
  downloadToExcel,
} from "../controllers/timeController.js";

const router = express.Router();

router.post("/", protectRoute, createTime);
router.put("/", protectRoute, updateTime);
router.get("/excelDownload", protectRoute, downloadToExcel);
router.get("/", protectRoute, getTime);
router.delete("/", protectRoute, deleteTime);

export default router;
