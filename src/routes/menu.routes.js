import express from "express";
import * as MenuController from "../controllers/menu.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// add menu - only admin role
router.post("/add-menu", protect, MenuController.addMenu);

//get all menus in flat structure with pagination and search
router.get("/get-flat-menus", protect, MenuController.getFlatMenus);

// Update one menu - only admin role
router.put("/:id/update", protect, MenuController.updateMenu);

// Delete one menu - only admin role
router.delete("/:id/delete", protect, MenuController.deleteMenu);



// Get all menus for a role
router.get("/permissions", protect, MenuController.getMenusPermissions);


//get auth user role menus
router.get("/role-menus", protect, MenuController.getRoleMenus);

//get auth user role menus
router.get("/role-menu-permissions/:roleId", protect, MenuController.getRoleMenuPermissions);

router.get("/get-all", protect, MenuController.getAllMenus);






export default router;