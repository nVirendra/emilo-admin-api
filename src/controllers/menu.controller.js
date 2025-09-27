
import * as menuService from "../services/menu.service.js"
import responseHelper from "../helper/response.helper.js";
import { menuResponse, permissionResponse } from "../response/menu.response.js";


export const addMenu = async (req, res) => {
  try {
    const menu = req.body;
    const result = await menuService.addMenuService(menu);
    return responseHelper.success(
      res,
      "Menus added successfully",
      menuResponse(result)
    );
  } catch (err) {
    console.error("Error in menu.controller addMenu:", err);
    return responseHelper.error(res, "Failed to add menus");
  }
};

export const getMenusPermissions = async (req, res) => {
  try {
    const menus = req.body;
    const result = await menuService.getMenusPermissionsService(menus);
    return responseHelper.success(
      res,
      "Permissions fetched successfully",
      result.map(permissionResponse)
    );
  } catch (err) {
    console.error("Error in menu.controller addMenu:", err);
    return responseHelper.error(res, "Failed to add menus");
  }
};




// Get All Menus
export const getRoleMenus = async (req, res) => {
  try {
    const roleId  = req.user?.role?.id || null;
    const result = await menuService.getMenusService(roleId);

    const menuMap = {};
    const parents = [];

    result.forEach(menu => {
      menu.child_menu = [];
      menuMap[menu._id.toString()] = menu;
    });

    result.forEach(menu => {
      if (menu.parentId) {
        const parent = menuMap[menu.parentId.toString()];
        if (parent) {
          parent.child_menu.push(menu);
        }
      } else {
        parents.push(menu);
      }
    });

    return res.json({
        success: true,
        message: "menu fetched for role",
        data: parents,
      });
  } catch (err) {
    console.error("Error in menu.controller getMenus:", err);
    return responseHelper.error(res, "Failed to fetch menus");
  }
};


export const getRoleMenuPermissions = async (req, res) => {
  try {
    const {roleId}  = req.params;
    const result = await menuService.getRoleMenuPermissionsService(roleId);
    return responseHelper.success(res, "Role menu permissions fetched successfully", result);
  } catch (err) {
    console.error("Error in menu.controller getRoleMenuPermissions:", err);
    return responseHelper.error(res, "Failed to fetch role menu permissions");
  }
}


export const getFlatMenus = async (req, res) => {
  try {
    // Default page = 1, limit = 10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search?.trim() || "";

    const { menus, totalMenus, totalPages } = await menuService.getFlatMenusService(page, limit, search);

    const nextPage = page < totalPages;

    return responseHelper.success(res, "Menus fetched successfully", {
      menus: menus.map(menuResponse), // format each menu
      pagination: {
        page,
        limit,
        totalMenus,
        totalPages,
        nextPage
      }
    });

  } catch (err) {
    console.error("Error in menu.controller getFlatMenus:", err);
    return responseHelper.error(res, "Failed to fetch menus");
  }
};



export const getAllMenus = async (req, res) => {
  try {
    const roleId  = req.user?.role?.id || null;
    const result = await menuService.getAllMenusService(roleId);

    const menuMap = {};
    const parents = [];

    result.forEach(menu => {
      menu.child_menu = [];
      menuMap[menu._id.toString()] = menu;
    });

    result.forEach(menu => {
      if (menu.parentId) {
        const parent = menuMap[menu.parentId.toString()];
        if (parent) {
          parent.child_menu.push(menu);
        }
      } else {
        parents.push(menu);
      }
    });

    return res.json({
        success: true,
        message: "All menu fetched successfully",
        data: parents,
      });
  } catch (err) {
    console.error("Error in menu.controller getMenus:", err);
    return responseHelper.error(res, "Failed to fetch menus");
  }
};

// Update Menu
export const updateMenu = async (req, res) => {
  try {
    const menuId = req.params.id;
    const updateData = req.body;
    const result = await menuService.updateMenuService(menuId, updateData);
    return responseHelper.success(res, "Menu updated successfully", menuResponse(result));
  } catch (err) {
    console.error("Error in menu.controller updateMenu:", err);
    return responseHelper.error(res, "Failed to update menu");
  }
};

// Delete Menu
export const deleteMenu = async (req, res) => {
  try {
    const menuId = req.params.id;
    await menuService.deleteMenuService(menuId);
    return responseHelper.success(res, "Menu deleted successfully", null);
  } catch (err) {
    console.error("Error in menu.controller deleteMenu:", err);
    return responseHelper.error(res, "Failed to delete menu");
  }
};