import { ReportModel } from "../models/clt_reports.js";
import MasterDataModel from "../models/clt_master_data.js";
import AppError from "../helper/appError.helper.js";

export const createReportService = async (reportData) => {
    const {
        targetType,
        targetId,
        reportedBy,
        reportedByName,
        reportedByEmail,
        reasonId,
        statusId,
        priorityId,
        customReason,
        description,
        targetData,
        source = "api"
    } = reportData;

    // Validate reason exists
    const reason = await MasterDataModel.findOne({
        _id: reasonId,
        type: "reportReason",
        status: "ACTIVE"
    });

    if (!reason) {
        throw new AppError("Invalid report reason", 400);
    }

    const report = await ReportModel.create({
        targetType,
        targetId,
        reportedBy,
        reportedByName,
        reportedByEmail,
        reasonId,
        statusId,
        priorityId,
        customReason,
        description,
        targetData,
        source
    });

    return await ReportModel.findById(report._id)
        .populate("reasonId")
        .populate("statusId")
        .populate("priorityId");
};

export const getReportsService = async (filters = {}) => {
    const {
        page = 1,
        limit = 20,
        statusId,
        targetType,
        priorityId,
        reportedBy,
        sortBy = "createdAt",
        sortOrder = "desc"
    } = filters;

    const query = {};
    
    if (statusId) query.statusId = statusId;
    if (targetType) query.targetType = targetType;
    if (priorityId) query.priorityId = priorityId;
    if (reportedBy) query.reportedBy = reportedBy;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const reports = await ReportModel
        .find(query)
        .populate("reasonId")
        .populate("statusId")
        .populate("priorityId")
        .populate("reviewedBy", "name email")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

    const total = await ReportModel.countDocuments(query);

    return {
        reports,
        pagination: {
            current: parseInt(page),
            total: Math.ceil(total / limit),
            count: reports.length,
            totalRecords: total
        }
    };
};

export const getReportByIdService = async (id) => {
    const report = await ReportModel
        .findById(id)
        .populate("reasonId")
        .populate("statusId")
        .populate("priorityId")
        .populate("reviewedBy", "name email")
        .lean();

    if (!report) {
        throw new AppError("Report not found", 404);
    }

    return report;
};

export const updateReportStatusService = async (id, updateData) => {
    const report = await ReportModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );

    if (!report) {
        throw new AppError("Report not found", 404);
    }

    return await ReportModel
        .findById(report._id)
        .populate("reasonId")
        .populate("statusId")
        .populate("priorityId")
        .populate("reviewedBy", "name email");
};

export const deleteReportService = async (id) => {
    const report = await ReportModel.findByIdAndDelete(id);
    
    if (!report) {
        throw new AppError("Report not found", 404);
    }

    return report;
};

export const getReportStatsService = async () => {
    const stats = await ReportModel.aggregate([
        {
            $lookup: {
                from: "clt_master_data",
                localField: "statusId",
                foreignField: "_id",
                as: "status"
            }
        },
        {
            $unwind: "$status"
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                pending: { $sum: { $cond: [{ $eq: ["$status.key", "pending"] }, 1, 0] } },
                reviewed: { $sum: { $cond: [{ $eq: ["$status.key", "reviewed"] }, 1, 0] } },
                resolved: { $sum: { $cond: [{ $eq: ["$status.key", "resolved"] }, 1, 0] } },
                dismissed: { $sum: { $cond: [{ $eq: ["$status.key", "dismissed"] }, 1, 0] } }
            }
        }
    ]);

    const targetTypeStats = await ReportModel.aggregate([
        {
            $group: {
                _id: "$targetType",
                count: { $sum: 1 }
            }
        }
    ]);

    const priorityStats = await ReportModel.aggregate([
        {
            $lookup: {
                from: "clt_master_data",
                localField: "priorityId",
                foreignField: "_id",
                as: "priority"
            }
        },
        {
            $unwind: "$priority"
        },
        {
            $group: {
                _id: "$priority.key",
                count: { $sum: 1 }
            }
        }
    ]);

    return {
        overview: stats[0] || { total: 0, pending: 0, reviewed: 0, resolved: 0, dismissed: 0 },
        byTargetType: targetTypeStats,
        byPriority: priorityStats
    };
};

export const getReportsByTargetService = async (targetType, targetId) => {
    const reports = await ReportModel
        .find({ targetType, targetId })
        .populate("reasonId")
        .populate("statusId")
        .populate("priorityId")
        .populate("reviewedBy", "name email")
        .sort({ createdAt: -1 })
        .lean();

    return reports;
};