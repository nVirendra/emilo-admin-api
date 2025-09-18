import express from "express";
import * as RoleController from "../controllers/role.controller.js";

const router = express.Router();

router.post("/bulk-add", RoleController.addRole);

export default router;