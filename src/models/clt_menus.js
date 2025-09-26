import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    // serviceName: { type: String, enum:['emilo','softcorner', 'page', 'ads'], required: true },
    path: { type: String, required: true },
    apiPath: { type: String },
    icon: { type: String },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "clt_menus", default: null },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" }
  },
  { timestamps: true }
);

export const MenuModel = mongoose.model("clt_menus", MenuSchema);
