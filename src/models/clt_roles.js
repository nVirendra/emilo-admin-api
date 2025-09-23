import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    roleKey: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    roleType: {
      type: String,
      enum: ["admin","employee"],
      required: true,
    },
    description: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  { timestamps: true } 
);

export const RoleModel = mongoose.model("Role", roleSchema, "clt_roles");
