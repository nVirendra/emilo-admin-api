// controllers/masterDataController.js
import {
  createMasterData as createService,
  getSingleDocument,
  getMultipleDocuments,
  getMultipleDocumentsWithPagination,
  updateDocument,
  deleteDocument,
  aggregateDocuments,
  bulkCreateDocuments,
  bulkUpdateDocuments,
  bulkDeleteDocuments,
  countDocuments,
} from "../services/db.Service.js";


// CREATE document
export const createMasterData = async (req, res) => {
  try {
    const { ModelName, data } = req.body;
    const result = await createService(ModelName, data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create document", error: error.message });
  }
};

// GET single document
export const getSingleMasterData = async (req, res) => {
  try {
    const { id } = req.params;
    const { ModelName = "clt_master_data", select = null, populate = null } = req.query;
    
    if (!id) {
      return res.status(400).json({ success: false, message: "ID parameter is required" });
    }

    const result = await getSingleDocument(ModelName, { _id: id }, select, null, populate);
    if (!result) return res.status(404).json({ success: false, message: "Document not found" });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch document", error: error.message });
  }
};

// GET multiple documents with advanced filtering and pagination
export const getMultipleMasterData = async (req, res) => {
  try {
    const { 
      ModelName, 
      match = {}, 
      select = null, 
      project = null,
      sort = { createdAt: -1 },
      page = 1,
      limit = 50,
      search = null,
      searchFields = [],
      populate = null
    } = req.body;

    // Build dynamic search query
    let finalMatch = { ...match };
    if (search && searchFields.length > 0) {
      const searchRegex = new RegExp(search, 'i');
      finalMatch.$or = searchFields.map(field => ({ [field]: searchRegex }));
    }

    // Use pagination if page/limit provided
    if (page && limit) {
      const result = await getMultipleDocumentsWithPagination(
        ModelName, 
        finalMatch, 
        select, 
        sort, 
        page, 
        limit,
        populate
      );
      return res.json({ success: true, ...result });
    }

    // Use simple find for non-paginated requests
    const result = await getMultipleDocuments(ModelName, finalMatch, select, project, sort, populate);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch documents", error: error.message });
  }
};

// UPDATE document
export const updateMasterData = async (req, res) => {
  try {
    const { ModelName, match = {}, updateData = {}, options = { new: true } } = req.body;
    const result = await updateDocument(ModelName, match, updateData, options);
    if (!result) return res.status(404).json({ success: false, message: "Document not found" });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update document", error: error.message });
  }
};

// DELETE document
export const deleteMasterData = async (req, res) => {
  try {
    const { ModelName, match = {} } = req.body;
    const result = await deleteDocument(ModelName, match);
    if (!result) return res.status(404).json({ success: false, message: "Document not found" });
    res.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete document", error: error.message });
  }
};

// AGGREGATE documents
export const aggregateMasterData = async (req, res) => {
  try {
    const { ModelName, pipeline = [] } = req.body;
    const result = await aggregateDocuments(ModelName, pipeline);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to aggregate documents", error: error.message });
  }
};

// COUNT documents
export const countMasterData = async (req, res) => {
  try {
    const { ModelName, match = {} } = req.body;
    const count = await countDocuments(ModelName, match);
    res.json({ success: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to count documents", error: error.message });
  }
};

// BULK CREATE documents
export const bulkCreateMasterData = async (req, res) => {
  try {
    const { ModelName, documents = [] } = req.body;
    if (!Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ success: false, message: "Documents array is required" });
    }
    const result = await bulkCreateDocuments(ModelName, documents);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to bulk create documents", error: error.message });
  }
};

// BULK UPDATE documents
export const bulkUpdateMasterData = async (req, res) => {
  try {
    const { ModelName, updates = [] } = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ success: false, message: "Updates array is required" });
    }
    const result = await bulkUpdateDocuments(ModelName, updates);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to bulk update documents", error: error.message });
  }
};

// BULK DELETE documents
export const bulkDeleteMasterData = async (req, res) => {
  try {
    const { ModelName, conditions = [] } = req.body;
    if (!Array.isArray(conditions) || conditions.length === 0) {
      return res.status(400).json({ success: false, message: "Conditions array is required" });
    }
    const result = await bulkDeleteDocuments(ModelName, conditions);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to bulk delete documents", error: error.message });
  }
};

// GET REPORT REASONS - Specialized endpoint for report functionality
export const getReportReasons = async (req, res) => {
  try {
    const { targetType = "post" } = req.query;
    
    const match = {
      type: "reportReason",
      target: targetType,
      status: "ACTIVE"
    };
    
    const select = "key label description order";
    const sort = { order: 1, createdAt: 1 };
    
    const reasons = await getMultipleDocuments("clt_master_data", match, select, null, sort);
    
    res.json({ 
      success: true, 
      message: "Report reasons fetched successfully",
      data: reasons 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch report reasons", 
      error: error.message 
    });
  }
};

// GET MASTER DATA BY TYPE - Specialized endpoint for type-based queries
export const getMasterDataByType = async (req, res) => {
  try {
    const { type, target = null, status = "ACTIVE" } = req.query;
    
    if (!type) {
      return res.status(400).json({ success: false, message: "Type parameter is required" });
    }
    
    const match = { type, status };
    if (target) match.target = target;
    
    const select = "key label description order target";
    const sort = { order: 1, createdAt: 1 };
    
    const data = await getMultipleDocuments("clt_master_data", match, select, null, sort);
    
    res.json({ 
      success: true, 
      message: `${type} data fetched successfully`,
      data 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch master data", 
      error: error.message 
    });
  }
};
