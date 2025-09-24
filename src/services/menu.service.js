import { MenuModel } from "../models/clt_menus.js";
import { RoleMenuPermissionModel } from "../models/clt_role_menu_permissions.js";

//  Add on
export const addMenuService = async (menus) => {
  const data = await MenuModel.insertMany(menus);
  return data;
};

// Get All
export const getMenusService = async (roleId) => {
  // return await MenuModel.find().sort({ order: 1 });
  return await RoleMenuPermissionModel.aggregate([
      { $match: { roleId: roleId } },
      {
        $lookup: {
          from: "clt_menus",
          localField: "menuId",
          foreignField: "_id",
          as: "menu",
        },
      },
      { $unwind: "$menu" },
      {
        $group: {
          _id: "$menu.parentId",
          menus: { $push: "$menu" },
        },
      },
    ]);

};

// Update One
export const updateMenuService = async (id, updateData) => {
  return await MenuModel.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete One
export const deleteMenuService = async (id) => {
  return await MenuModel.findByIdAndDelete(id);
};
