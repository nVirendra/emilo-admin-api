import asyncHandler from "../middlewares/asyncHandler.js";
import * as reportService from "../services/report.service.js";
import responseHelper from "../helper/response.helper.js";

export const createReport = asyncHandler(async (req, res) => {
    const reportData = req.body;
    const result = await reportService.createReportService(reportData);
    return responseHelper.created(res, "Report submitted successfully", result);
});

export const getReports = asyncHandler(async (req, res) => {
    const filters = req.query;
    const result = await reportService.getReportsService(filters);
    return responseHelper.success(res, "Reports fetched successfully", result);
});

export const getReportById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await reportService.getReportByIdService(id);
    return responseHelper.success(res, "Report fetched successfully", result);
});

export const updateReportStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { statusId, resolution, priorityId } = req.body;
    const adminId = req.user?.id;
    
    const result = await reportService.updateReportStatusService(id, {
        statusId,
        resolution,
        priorityId,
        reviewedBy: adminId,
        reviewedAt: new Date()
    });
    
    return responseHelper.success(res, "Report updated successfully", result);
});

export const deleteReport = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await reportService.deleteReportService(id);
    return responseHelper.success(res, "Report deleted successfully");
});

export const getReportStats = asyncHandler(async (req, res) => {
    const stats = await reportService.getReportStatsService();
    return responseHelper.success(res, "Report statistics fetched successfully", stats);
});

export const getReportsByTarget = asyncHandler(async (req, res) => {
    const { targetType, targetId } = req.params;
    const result = await reportService.getReportsByTargetService(targetType, targetId);
    return responseHelper.success(res, "Target reports fetched successfully", result);
});