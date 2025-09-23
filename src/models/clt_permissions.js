import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true, // e.g., "view", "edit_post", "ban_user"
      lowercase: true,
      trim: true,
    },
    label: {
      type: String,
      required: true, // e.g., "View", "Edit Post"
      trim: true,
    },
    description: {
      type: String,
      default: null, // e.g., "Allows viewing of records"
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export const PermissionModel = mongoose.model("clt_permissions", PermissionSchema);
