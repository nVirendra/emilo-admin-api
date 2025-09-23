import express from "express";
import * as RoleController from "../controllers/role.controller.js";
import { roleMenuPermissionController } from "../controllers/role.controller.js";

const router = express.Router();

router.post("/bulk-add", RoleController.addRole);

// Assign/Update permissions for a role & menu
router.post("/assign", roleMenuPermissionController.assign);

// Get all permissions for a role
router.get("/role/:roleId", roleMenuPermissionController.getByRole);

// Get permissions for a specific role+menu
router.get("/role/:roleId/menu/:menuId", roleMenuPermissionController.getByRoleMenu);

// Remove permissions for a role+menu
router.delete("/role/:roleId/menu/:menuId", roleMenuPermissionController.remove);

export default router;