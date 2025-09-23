
import * as roleService from "../services/role.service.js"
import responseHelper from "../helper/response.helper.js";
import { RoleResponse } from "../response/role.response.js";
import { roleMenuPermissionService } from "../services/role.service.js";


export const addRole = async (req, res)=>{
    try{
        const roles = req.body;
        const result = await roleService.addRoleService(roles);
        return responseHelper.success(res, 'Roles added successfully', result.map(RoleResponse));
    }catch(err){
        console.error('Error in role.controller.controller inside addRole function');
    }
};

export const roleMenuPermissionController = {
  async assign(req, res) {
    try {
      const { roleId, menuId, permissions } = req.body;
      const result = await roleMenuPermissionService.assignPermissions({
        roleId,
        menuId,
        permissions
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async getByRole(req, res) {
    try {
      const { roleId } = req.params;
      const result = await roleMenuPermissionService.getPermissionsByRole(roleId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async getByRoleMenu(req, res) {
    try {
      const { roleId, menuId } = req.params;
      const result = await roleMenuPermissionService.getPermissionsForRoleMenu(roleId, menuId);
      if (!result) {
        return res.status(404).json({ success: false, message: "No permissions found" });
      }
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const { roleId, menuId } = req.params;
      await roleMenuPermissionService.removePermissions(roleId, menuId);
      res.status(200).json({ success: true, message: "Permissions removed" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};