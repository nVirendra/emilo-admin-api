import express from "express";
import * as RoleController from "../controllers/role.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add-role", RoleController.addRole);
router.get("/get-all", RoleController.getAll);

// Update (one)
router.put("/:id/update",  RoleController.updateRole);

// Delete (one)
router.delete("/:id/delete",  RoleController.deleteRole);


// Assign/Update permissions for a role & menu
router.post("/assign", RoleController.assign);

router.post("/bulk-assign", protect, RoleController.bulkAssign);

// Get all permissions for a role
router.get("/role/:roleId", RoleController.getByRole);

// Get permissions for a specific role+menu
router.get("/role/:roleId/menu/:menuId", RoleController.getByRoleMenu);

// Remove permissions for a role+menu
router.delete("/role/:roleId/menu/:menuId", RoleController.remove);


// Assign permissions to multiple menus for a role
router.post("/permissions/assign", RoleController.assignMultipleMenuPermissions);


export default router;