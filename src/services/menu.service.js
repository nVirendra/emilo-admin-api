import { MenuModel } from "../models/clt_menus.js";
import { RoleMenuPermissionModel } from "../models/clt_role_menu_permissions.js";
import mongoose from "mongoose";
import { PermissionModel } from "../models/clt_permissions.js";
//  Add on
export const addMenuService = async (menus) => {
  const data = await MenuModel.insertMany(menus);
  return data;
};

// Get All
export const getMenusService = async (roleId) => {
  const result = await RoleMenuPermissionModel.aggregate([
    {
      $match: { roleId: new mongoose.Types.ObjectId(roleId) },
    },
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
      $replaceRoot: { newRoot: "$menu" }, 
    },
    {
      $match: { status: "ACTIVE" }, 
    },
    { $sort: { order: 1 } },
  ]);
  return result;
  
};






export const getFlatMenusService = async (page, limit, search) => {
  const skip = (page - 1) * limit;

  
  const matchStage = {
    status: "ACTIVE",
  };

  if (search) {
    matchStage.$or = [
      { title: { $regex: search, $options: "i" } },
      { path: { $regex: search, $options: "i" } },
    ];
  }

  const result = await MenuModel.aggregate([
    { $match: matchStage },
    {
      $facet: {
        menus: [
          { $sort: { createdAt: -1 } }, 
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const menus = result[0].menus;
  const totalMenus = result[0].totalCount[0]?.count || 0;

  return {
    menus,
    totalMenus,
    totalPages: Math.ceil(totalMenus / limit),
  };
};






export const getAllMenusService = async (roleId) => {
  const result = await RoleMenuPermissionModel.aggregate([
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
      $replaceRoot: { newRoot: "$menu" }, 
    },
    {
      $match: { status: "ACTIVE" }, 
    },
    { $sort: { order: 1 } },
  ]);
  return result;
  
};

// Update One
export const updateMenuService = async (id, updateData) => {
  return await MenuModel.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete One
export const deleteMenuService = async (id) => {
  return await MenuModel.findByIdAndDelete(id);
};


export const getMenusPermissionsService = async (id) => {
  return await PermissionModel.find().lean();
};