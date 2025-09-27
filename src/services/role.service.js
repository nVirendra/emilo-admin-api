

import { RoleModel } from "../models/clt_roles.js"
import { MenuModel } from "../models/clt_menus.js";
import { RoleMenuPermissionModel } from "../models/clt_role_menu_permissions.js";
import { PermissionModel } from "../models/clt_permissions.js";
import AppError from "../helper/appError.helper.js";

export const addRoleService =  async(role)=>{
    const data = await RoleModel.create(role);
    return data;
}


export const updateRoleService = async (id, updateData) => {
  // Add validation/transforms as needed (e.g., unique name)
  return await RoleModel.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteRoleService = async (id) => {
  return await RoleModel.findByIdAndDelete(id);
};


export const  getAllRoleService =  async()=>{
    const data = await RoleModel.find({roleKey:{$ne:"super_admin"}}).sort({ createdAt: -1 }).lean();
    return data;
}


export const assignPermissionsService = async ({ roleId, menuId, permissions }) => {
  if (!roleId || !menuId) throw new AppError("roleId and menuId are required");
  if (!permissions || !Array.isArray(permissions))
    throw new AppError("permissions array is required");

  // validate menu exists
  const menu = await MenuModel.findById(menuId);
  if (!menu) throw new AppError("Menu not found");

  // validate each permission
  const validPermissions = await PermissionModel.find({
    key: { $in: permissions.map((k) => k) },
    status: "ACTIVE",
  });

  console.log("validPermissions", validPermissions, 'permissions',permissions);
  if (validPermissions.length !== permissions.length) {
    throw new AppError("One or more permissions are invalid or inactive");
  }

  // upsert role-menu-permission
  return RoleMenuPermissionModel.findOneAndUpdate(
    { roleId, menuId },
    {
      roleId,
      menuId,
      permissions: permissions.map((p) => ({
        key: p.key,
        label: p.label,
      })),
    },
    { new: true, upsert: true }
  ).lean();
};

/**
 * Bulk assign all active permissions to all active menus for a role
 */
export const bulkAssignPermissionsService = async ({ roleId }) => {
  if (!roleId) throw new AppError("roleId is required");

  const menus = await MenuModel.find({ status: "ACTIVE" });
  if (!menus.length) throw new AppError("No active menus found");

  const validPermissions = await PermissionModel.find({ status: "ACTIVE" });
  if (!validPermissions.length) throw new AppError("No active permissions found");

  const bulkOps = menus.map((menu) => ({
    updateOne: {
      filter: { roleId, menuId: menu._id },
      update: {
        $set: {
          roleId,
          menuId: menu._id,
          permissions: validPermissions.map((p) => ({
            key: p.key,
            label: p.label,
          })),
        },
      },
      upsert: true,
    },
  }));

  const result = await RoleMenuPermissionModel.bulkWrite(bulkOps);

  return {
    menusAssigned: menus.length,
    permissionsAssigned: validPermissions.length,
    modifiedCount: result.modifiedCount,
    upsertedCount: result.upsertedCount,
  };
};

/**
 * Get all permissions assigned to a role
 */
export const getPermissionsByRoleService = async (roleId) => {
  if (!roleId) throw new AppError("roleId is required");

  return RoleMenuPermissionModel.find({ roleId })
    .populate("menuId", "title path icon")
    .lean();
};

/**
 * Get permissions for a specific role-menu pair
 */
export const getPermissionsForRoleMenuService = async (roleId, menuId) => {
  if (!roleId || !menuId) throw new AppError("roleId and menuId are required");

  return RoleMenuPermissionModel.findOne({ roleId, menuId }).lean();
};

/**
 * Remove permissions for a role-menu pair
 */
export const removePermissionsService = async (roleId, menuId) => {
  if (!roleId || !menuId) throw new AppError("roleId and menuId are required");

  return RoleMenuPermissionModel.findOneAndDelete({ roleId, menuId });
};


export const assignMultipleMenuPermissionsService = async ({ roleId, menus }) => {
  if (!roleId) throw new AppError("roleId is required");
  if (!menus || !Array.isArray(menus) || menus.length === 0) {
    throw new AppError("menus array is required");
  }

  // Validate all menus exist
  const menuIds = menus.map((m) => m.menuId);
  const foundMenus = await MenuModel.find({ _id: { $in: menuIds }, status: "ACTIVE" });

  // if (foundMenus.length !== menus.length) {
  //   throw new AppError("One or more menu IDs are invalid or inactive");
  // }

  // Validate all permission keys exist
  const allPermissionKeys = [
    ...new Set(menus.flatMap((m) => m.permissions.map((p) => p.key))),
  ];
  const validPermissions = await PermissionModel.find({
    key: { $in: allPermissionKeys },
    status: "ACTIVE",
  });

  if (validPermissions.length !== allPermissionKeys.length) {
    throw new AppError("One or more permission keys are invalid or inactive");
  }

  // Prepare bulk operations
  const bulkOps = menus.map((m) => ({
    updateOne: {
      filter: { roleId, menuId: m.menuId },
      update: {
        $set: {
          roleId,
          menuId: m.menuId,
          permissions: m.permissions.map((p) => ({
            key: p.key,
            label: p.label,
          })),
        },
      },
      upsert: true,
    },
  }));

  const result = await RoleMenuPermissionModel.bulkWrite(bulkOps);

  return {
    roleId,
    menusAssigned: menus.length,
    modifiedCount: result.modifiedCount,
    upsertedCount: result.upsertedCount,
  };
};
