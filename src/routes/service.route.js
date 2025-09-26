// routes/masterDataRoutes.js
import express from "express";
import {
  createMasterData,
  getSingleMasterData,
  getMultipleMasterData,
  updateMasterData,
  deleteMasterData,
  aggregateMasterData,
  countMasterData,
  bulkCreateMasterData,
  bulkUpdateMasterData,
  bulkDeleteMasterData,
  getReportReasons,
  getMasterDataByType,
} from "../controllers/service.controller.js";

const router = express.Router();

// Create
router.post("/", createMasterData);

// Specialized endpoints (MUST be before /:id route)
router.get("/report-reasons", getReportReasons);
router.get("/by-type", getMasterDataByType);

// Read
router.get("/:id", getSingleMasterData);
router.post("/getall", getMultipleMasterData);

// Update
router.put("/:id", updateMasterData);

// Delete
router.delete("/:id", deleteMasterData);

// Aggregate
router.post("/aggregate", aggregateMasterData);

// Count
router.post("/count", countMasterData);

// Bulk Operations
router.post("/bulk/create", bulkCreateMasterData);
router.post("/bulk/update", bulkUpdateMasterData);
router.post("/bulk/delete", bulkDeleteMasterData);

export default router;
