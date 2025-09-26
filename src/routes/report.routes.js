import express from "express";
import * as reportController from "../controllers/report.controller.js";

const router = express.Router();

// Public endpoint for receiving reports from main API
router.post("/submit", reportController.createReport);

// Protected admin endpoints

router.get("/get-report", reportController.getReports);
router.get("/stats", reportController.getReportStats);
router.get("/:id", reportController.getReportById);
router.post("/:id/status", reportController.updateReportStatus);
router.post("/:id", reportController.deleteReport);
router.get("/target/:targetType/:targetId", reportController.getReportsByTarget);

export default router;