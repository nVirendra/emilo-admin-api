import { getModel } from "../utils/modelLoader.js";

export const createMasterData = async (ModelName, data) => {
  console.log("Creating document for model:", ModelName);
  const  Model = getModel(ModelName);
  console.log("Model retrieved:", Model ? "Found" : "Not found");
  if (!Model) {
    throw new Error(`Model "${ModelName}" not found`);
  }
  return await Model.create(data);
};

export const getSingleDocument = async (ModelName, match = {}, select = null, project = null, populate = null) => {
  const Model = getModel(ModelName);
  if (!Model) {
    throw new Error(`Model "${ModelName}" not found`);
  }
  
  let query = Model.findOne(match);
  
  if (select) query = query.select(select);
  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach(pop => query = query.populate(pop));
    } else {
      query = query.populate(populate);
    }
  }
  
  return await query.lean();
};

export const getMultipleDocuments = async (ModelName, match = {}, select = null, project = null, sort = null, populate = null) => {
  const Model = getModel(ModelName);
  if (!Model) {
    throw new Error(`Model "${ModelName}" not found`);
  }

  let query = Model.find(match);
  
  if (select) query = query.select(select);
  if (sort) query = query.sort(sort);
  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach(pop => query = query.populate(pop));
    } else {
      query = query.populate(populate);
    }
  }
  
  return await query.lean();
};

export const getMultipleDocumentsWithPagination = async (ModelName, match = {}, select = null, sort = { createdAt: -1 }, page = 1, limit = 10, populate = null) => {
  const Model = getModel(ModelName);
  if (!Model) {
    throw new Error(`Model "${ModelName}" not found`);
  }

  const skip = (page - 1) * limit;
  
  let query = Model.find(match);
  
  if (select) query = query.select(select);
  if (sort) query = query.sort(sort);
  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach(pop => query = query.populate(pop));
    } else {
      query = query.populate(populate);
    }
  }
  
  const [data, total] = await Promise.all([
    query.skip(skip).limit(limit).lean(),
    Model.countDocuments(match)
  ]);

  return {
    data,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / limit),
      count: data.length,
      total
    }
  };
};

export const updateDocument = async (ModelName, match = {}, updateData = {}, options = { new: true }) => {
  const Model = getModel(ModelName);
  if (!Model) {
    throw new Error(`Model "${ModelName}" not found`);
  }
  return await Model.findOneAndUpdate(match, updateData, options).lean();
};

export const deleteDocument = async (ModelName, match = {}) => {
  const Model = getModel(ModelName);
  if (!Model) {
    throw new Error(`Model "${ModelName}" not found`);
  }
  return await Model.findOneAndDelete(match).lean();
};

export const aggregateDocuments = async (ModelName, pipeline = []) => {
  const Model = getModel(ModelName);
  if (!Model) {
    throw new Error(`Model "${ModelName}" not found`);
  }
  return await Model.aggregate(pipeline);
};

export const countDocuments = async (ModelName, match = {}) => {
  const Model = getModel(ModelName);
  if (!Model) {
    throw new Error(`Model "${ModelName}" not found`);
  }
  return await Model.countDocuments(match);
};

export const bulkCreateDocuments = async (ModelName, documents = []) => {
  const Model = getModel(ModelName);
  if (!Model) {
    throw new Error(`Model "${ModelName}" not found`);
  }
  return await Model.insertMany(documents, { ordered: false });
};

export const bulkUpdateDocuments = async (ModelName, updates = []) => {
  const Model = getModel(ModelName);
  if (!Model) {
    throw new Error(`Model "${ModelName}" not found`);
  }
  
  const bulkOps = updates.map(({ match, updateData, options = {} }) => ({
    updateOne: {
      filter: match,
      update: updateData,
      ...options
    }
  }));
  
  return await Model.bulkWrite(bulkOps);
};

export const bulkDeleteDocuments = async (ModelName, conditions = []) => {
  const Model = getModel(ModelName);
  if (!Model) {
    throw new Error(`Model "${ModelName}" not found`);
  }
  
  const bulkOps = conditions.map(condition => ({
    deleteMany: { filter: condition }
  }));
  
  return await Model.bulkWrite(bulkOps);
};
