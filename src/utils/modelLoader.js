// utils/modelLoader.js
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const modelCache = {};
const modelsPath = path.join(process.cwd(), "src/models");

/**
 * Auto-load all models inside /models folder
 */
const loadModels = async () => {
  const files = fs.readdirSync(modelsPath);

  for (const file of files) {
    if (file.endsWith(".js")) {
      const modulePath = path.join(modelsPath, file);
      const modelModule = await import(pathToFileURL(modulePath).href);
      
      // Handle default exports
      if (modelModule.default?.modelName) {
        console.log(`Loaded default model: ${modelModule.default.modelName} from ${file}`);
        modelCache[modelModule.default.modelName] = modelModule.default;
      }
      
      // Handle named exports
      Object.keys(modelModule).forEach(key => {
        if (key !== 'default' && modelModule[key]?.modelName) {
          console.log(`Loaded named model: ${modelModule[key].modelName} from ${file}`);
          modelCache[modelModule[key].modelName] = modelModule[key];
        }
      });
    }
  }
};

// Immediately load models on import
await loadModels();

/**
 * Get mongoose model by name
 * @param {string} modelName
 */
export function getModel(modelName) {
  return modelCache[modelName];
}
