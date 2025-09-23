

import { RoleModel } from "../models/clt_roles.js"
import { MenuModel } from "../models/clt_menus.js";
import { RoleMenuPermissionModel } from "../models/clt_role_menu_permissions.js";
import { PermissionModel } from "../models/clt_permissions.js";
import AppError from "../helper/appError.helper.js";

export const addRoleService =  async(roles)=>{
    const data = await RoleModel.insertMany(roles);
    return data;
}


export const roleMenuPermissionService = {
  async assignPermissions({ roleId, menuId, permissions }) {
    // validate menu exists
    const menu = await MenuModel.findById(menuId);
    if (!menu) throw new AppError("Menu not found");

    // validate each permission key exists in master permissions
    const validPermissions = await PermissionModel.find({
      key: { $in: permissions.map(p => p.key) },
      status: "ACTIVE"
    });

    if (validPermissions.length !== permissions.length) {
      throw new AppError("One or more permissions are invalid");
    }

    // upsert role-menu-permission
    const record = await RoleMenuPermissionModel.findOneAndUpdate(
      { roleId, menuId },
      { roleId, menuId, permissions },
      { new: true, upsert: true }
    );

    return record;
  },

  async getPermissionsByRole(roleId) {
    return RoleMenuPermissionModel.find({ roleId })
      .populate("menuId", "title path icon")
      .lean();
  },

  async getPermissionsForRoleMenu(roleId, menuId) {
    return RoleMenuPermissionModel.findOne({ roleId, menuId }).lean();
  },

  async removePermissions(roleId, menuId) {
    return RoleMenuPermissionModel.findOneAndDelete({ roleId, menuId });
  }
};