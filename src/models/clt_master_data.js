import mongoose from "mongoose";

const MasterDataSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      index: true, 
      enum: [
        "roleType", 
        "status", 
        "category", 
        "postType", 
        "reportReason", 
        "other"
      ],
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0, // helps sorting dropdowns
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

MasterDataSchema.index({ type: 1, key: 1 }, { unique: true });

export const MasterDataModel = mongoose.model("clt_master_data", MasterDataSchema);
