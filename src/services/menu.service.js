import { MenuModel } from "../models/clt_menus.js";

//  Add on
export const addMenuService = async (menus) => {
  const data = await MenuModel.insertMany(menus);
  return data;
};

// Get All
export const getMenusService = async () => {
  return await MenuModel.find().sort({ order: 1 });
};

// Update One
export const updateMenuService = async (id, updateData) => {
  return await MenuModel.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete One
export const deleteMenuService = async (id) => {
  return await MenuModel.findByIdAndDelete(id);
};
