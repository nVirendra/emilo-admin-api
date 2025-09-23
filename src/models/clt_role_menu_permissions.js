import mongoose from "mongoose";

const RoleMenuPermissionSchema = new mongoose.Schema(
  {
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clt_roles",
      required: true,
      index: true,
    },
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clt_menus",
      required: true,
      index: true,
    },
    permissions: [
      {
        key: { type: String, required: true },   // permission key e.g., "view", "create"
        label: { type: String, required: true }, // human-readable label e.g., "View"
      }
    ]
  },
  { timestamps: true }
);

// Ensure unique role-menu combination
RoleMenuPermissionSchema.index({ roleId: 1, menuId: 1 }, { unique: true });

export const RoleMenuPermissionModel = mongoose.model(
  "clt_role_menu_permissions",
  RoleMenuPermissionSchema
);
