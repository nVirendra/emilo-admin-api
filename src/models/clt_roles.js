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
    // permissions: [
    //   {
    //     type: String,
    //     required: true,
    //     enum: [
    //       "manage_admins",
    //       "manage_users",
    //       "moderate_content",
    //       "review_reports",
    //       "handle_finance",
    //       "support_tickets",
    //       "manage_tech",
    //       "view_analytics",
    //       "send_notifications",
    //       "legal_compliance"
    //     ]
    //   }
    // ],
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
