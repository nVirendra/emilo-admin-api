
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { AdminUserModel } from "../models/clt_admin_users.js";
import responseHelper from "../helper/response.helper.js";
import { MenuModel } from "../models/clt_menus.js";
import { RoleMenuPermissionModel } from "../models/clt_role_menu_permissions.js";

export const protect = async (req, res, next) => {
  try {

    const token = req.cookies?.authAccessToken;
    if (!token) {
        return responseHelper.error(res,"Not authorized, token missing", 401);
    }

    const decoded = jwt.verify(token, ENV.JWT_ACCESS_PASS_KEY);

    // Attach user to request
    req.user = decoded;

    // Optional: Fetch fresh user from DB to check status
    const admin = await AdminUserModel.findById(decoded.id).populate("roleId");
    if (!admin || admin.status !== "Active") {
        return responseHelper.error(res,"Account inactive or not found", 403);
    }

    next();
  } catch (err) {
    // console.error(res,"Auth error:", err.message);
    return responseHelper.error(res,"Not authorized, token invalid", 401);
  }
};


export const authorize = (...allowedRoles) => {


  return (req, res, next) => {
    if (!req.user?.role?.roleKey) {
        return responseHelper.error(res,"Role not assigned", 403);
    }

    if (!allowedRoles.includes(req.user.role.roleKey)) {
        return responseHelper.error(res, "Forbidden: insufficient role", 403);
    }

    next();
  };
};



export function checkPermission(menuPathOrId, requiredPermission) {
  return async (req, res, next) => {
    try {
      // assume req.user is set by auth middleware (JWT/session decode)
      const roleId  = req.user?.role?.id || null;
      
      if (!roleId) {
        return res.status(401).json({ success: false, message: "Unauthorized: roleId missing" });
      }

      // Try to match by menuId or menu.path
      const filter = menuPathOrId.match(/^[0-9a-fA-F]{24}$/)
        ? { roleId, menuId: menuPathOrId }
        : { roleId, "menuId": await resolveMenuId(menuPathOrId) };

      if (!filter.menuId) {
        return res.status(404).json({ success: false, message: "Menu not found" });
      }

      const roleMenuPermission = await RoleMenuPermissionModel.findOne(filter).lean();
      if (!roleMenuPermission) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      const hasPermission = roleMenuPermission.permissions.some(
        (p) => p.key === requiredPermission
      );

      if (!hasPermission) {
        return res.status(403).json({ success: false, message: "Permission denied" });
      }

      next();
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };
}

// helper: resolve menuId from path
async function resolveMenuId(path) {
  const menu = await MenuModel.findOne({ path }).lean();
  return menu ? menu._id : null;
}