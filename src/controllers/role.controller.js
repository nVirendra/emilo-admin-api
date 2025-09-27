
import * as roleService from "../services/role.service.js"
import responseHelper from "../helper/response.helper.js";
import { RoleResponse } from "../response/role.response.js";
import mongoose from "mongoose";


export const addRole = async (req, res)=>{
    try{
        const role = req.body;
        const result = await roleService.addRoleService(role);
        return responseHelper.success(res, 'Roles added successfully', RoleResponse(result));
    }catch(err){
        console.error('Error in role.controller.controller inside addRole function');
    }
};

export const updateRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const updateData = req.body;
    const updated = await roleService.updateRoleService(roleId, updateData);
    if (!updated) return responseHelper.notFound(res, "Role not found");
    return responseHelper.success(
      res,
      "Role updated successfully",
      RoleResponse(updated)
    );
  } catch (err) {
    console.error("Error in role.controller updateRole:", err);
    return responseHelper.error(res, "Failed to update role");
  }
};

export const deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const deleted = await roleService.deleteRoleService(roleId);
    if (!deleted) return responseHelper.notFound(res, "Role not found");
    return responseHelper.success(res, "Role deleted successfully", null);
  } catch (err) {
    console.error("Error in role.controller deleteRole:", err);
    return responseHelper.error(res, "Failed to delete role");
  }
};


export const getAll = async (req, res)=>{
    try{
        const result = await roleService.getAllRoleService();
        return responseHelper.success(res, 'Roles fetched successfully', result.map(RoleResponse));
    }catch(err){
        console.error('Error in role.controller.controller inside getAll function');
    }
};







/**
 * @desc Assign permission to a specific role-menu
 */
export const assign = async (req, res) => {
  try {
    const { roleId, menuId, permissions } = req.body;
    const result = await roleService.assignPermissionsService({
      roleId,
      menuId,
      permissions,
    });

    return responseHelper.success(res, "Permissions assigned", result);
  } catch (err) {
    console.error("Error in assign:", err.message);
    return responseHelper.error(
      res,
      err.message || "Failed to assign permissions"
    );
  }
};

/**
 * @desc Bulk assign permissions to a role
 */
export const bulkAssign = async (req, res) => {
  try {
    const roleId = req.user?.role?.id || null;
    const result = await roleService.bulkAssignPermissionsService({
      roleId,
    });

    return responseHelper.success(res, "Permissions bulk-assigned", result);
  } catch (err) {
    console.error("Error in bulkAssign:", err.message);
    return responseHelper.error(
      res,
      err.message || "Failed to bulk-assign permissions"
    );
  }
};

/**
 * @desc Get permissions by role
 */
export const getByRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const result = await roleService.getPermissionsByRoleService(roleId);

    return responseHelper.success(res, "Permissions fetched", result);
  } catch (err) {
    console.error("Error in getByRole:", err.message);
    return responseHelper.error(
      res,
      err.message || "Failed to fetch permissions"
    );
  }
};

/**
 * @desc Get permissions for a specific role-menu pair
 */
export const getByRoleMenu = async (req, res) => {
  try {
    const { roleId, menuId } = req.params;
    const result = await roleService.getPermissionsForRoleMenuService(
      roleId,
      menuId
    );

    if (!result) {
      return responseHelper.error(res, "No permissions found", 404);
    }

    return responseHelper.success(res, "Permissions fetched", result);
  } catch (err) {
    console.error("Error in getByRoleMenu:", err.message);
    return responseHelper.error(
      res,
      err.message || "Failed to fetch permissions"
    );
  }
};

/**
 * @desc Remove permissions for a specific role-menu pair
 */
export const remove = async (req, res) => {
  try {
    const { roleId, menuId } = req.params;
    await roleService.removePermissions(roleId, menuId);

    return responseHelper.success(res, "Permissions removed");
  } catch (err) {
    console.error("Error in remove:", err.message);
    return responseHelper.error(
      res,
      err.message || "Failed to remove permissions"
    );
  }
};



export const assignMultipleMenuPermissions = async (req, res) => {
  try {
    
    let { roleId, menus } = req.body;

    roleId = new mongoose.Types.ObjectId(roleId);

    console.log("Role ID:", roleId);
    console.log("Menus:", menus);

    const result = await roleService.assignMultipleMenuPermissionsService({ roleId, menus });

    return responseHelper.success(
      res,
      "Permissions assigned to multiple menus successfully",
      result
    );
  } catch (err) {
    console.error("Error in assignMultipleMenuPermissions:", err.message);
    return responseHelper.error(res, err.message || "Failed to assign permissions");
  }
};