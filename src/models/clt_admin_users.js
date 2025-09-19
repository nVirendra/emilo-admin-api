import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role", // references RoleModel
      required: true
    },
    status: {
      type: String,
      enum:['Pending', 'Active'],
      default: "Pending",
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  { timestamps: true } // adds createdAt & updatedAt
);

adminUserSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

adminUserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Export as AdminUserModel to prevent conflicts
export const AdminUserModel = mongoose.model("AdminUser", adminUserSchema, "clt_admin_users");
