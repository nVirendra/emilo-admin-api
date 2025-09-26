import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ["post", "comment", "user"],
      required: true,
      index: true
    },
    targetId: {
      type: String,
      required: true,
      index: true
    },
    reportedBy: {
      type: String, // User ID from main API
      required: true,
      index: true
    },
    reportedByName: {
      type: String,
      required: true
    },
    reportedByEmail: {
      type: String,
      default: null
    },
    reasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clt_master_data",
      required: true
    },
    customReason: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    targetData: {
      type: mongoose.Schema.Types.Mixed, // Store the actual reported content
      default: null
    },
    statusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clt_master_data",
      // required: true,
      index: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    resolution: {
      type: String,
      default: null
    },
    priorityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clt_master_data",
      // required: true
    },
    source: {
      type: String,
      default: "api", // To track which service the report came from
    }
  },
  { timestamps: true }
);

// Compound indexes for efficient querying
reportSchema.index({ targetType: 1, statusId: 1 });
reportSchema.index({ reportedBy: 1, createdAt: -1 });
reportSchema.index({ statusId: 1, priorityId: 1, createdAt: -1 });

export const ReportModel = mongoose.model("Report", reportSchema, "clt_reports");