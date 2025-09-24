import express from "express";
import * as MenuController from "../controllers/menu.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create menu - only admin role can do this
router.post("/add-menu", protect, authorize("admin"), MenuController.addMenu);

// Get all menus for a role
router.get("/role-menus/:roleId", MenuController.getRoleMenus);



// Update one menu - only admin role
router.put("/:id/update", protect, authorize(["admin"]), MenuController.updateMenu);

// Delete one menu - only admin role
router.delete("/:id/delete", protect, authorize("admin"), MenuController.deleteMenu);

export default router;