const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
/**
 * Initializes and returns a Gemini model instance.
 * @param {string} apiKey 
 * @param {string} modelName 
 */
function getGeminiModel(apiKey, modelName = 'gemini-flash-latest') {
  if (!apiKey) {
    throw new Error('Please provide a GENINI_API_KEY in the .env file.');
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  // Defaulting to gemini-flash-latest for broader availability
  return genAI.getGenerativeModel({ model: modelName });
}

function getGeminiFileManager(apiKey) {
  if (!apiKey) {
    throw new Error('Please provide a GENINI_API_KEY in the .env file.');
  }
  return new GoogleAIFileManager(apiKey);
}

module.exports = {
  getGeminiModel,
  getGeminiFileManager
};
