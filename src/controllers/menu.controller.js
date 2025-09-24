
import * as menuService from "../services/menu.service.js"
import responseHelper from "../helper/response.helper.js";
import { menuResponse } from "../response/menu.response.js";


// Bulk Add Menus
export const addMenu = async (req, res) => {
  try {
    const menus = req.body;
    const result = await menuService.addMenuService(menus);
    return responseHelper.success(
      res,
      "Menus added successfully",
      result.map(menuResponse)
    );
  } catch (err) {
    console.error("Error in menu.controller addMenu:", err);
    return responseHelper.error(res, "Failed to add menus");
  }
};

// Get All Menus
export const getRoleMenus = async (req, res) => {
  try {
    const { roleId } = req.params;
    const result = await menuService.getMenusService(roleId);
    // return responseHelper.success(res, "Menus fetched successfully", result.map(menuResponse));
    return res.json({
        success: true,
        message: "menu fetched for role",
        data: result,
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