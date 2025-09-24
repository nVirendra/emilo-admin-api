import express from "express";
import {protect, checkPermission } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Example: require "view" permission on "/users" menu
router.get(
  "/",
  protect,
  checkPermission("/admin/users", "view"),
  (req, res) => {
    res.json({ message: "You can view users ✅" });
  }
);

export default router;