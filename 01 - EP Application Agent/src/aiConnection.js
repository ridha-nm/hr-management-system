/**
 * AI Model Connection
 * Supports both Groq (Llama 3) and Google Gemini
 */

require('dotenv').config();

let groqModel = null;
let geminiModel = null;

/**
 * Get AI model (auto-selects best available)
 * @returns {Object} AI model instance
 */
function getAIModel() {
  // Try Groq first (free, fast)
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
    return getGroqModel(process.env.GROQ_API_KEY);
  }
  
  // Fallback to Gemini
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    return getGeminiModel(process.env.GEMINI_API_KEY);
  }
  
  throw new Error('No API key configured. Set GROQ_API_KEY or GEMINI_API_KEY in .env file');
}

/**
 * Get Groq model (Llama 3 - Fast & Free)
 * @param {string} apiKey - Groq API key
 * @returns {Object} Groq model instance
 */
function getGroqModel(apiKey) {
  if (!groqModel) {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey });
    
    groqModel = {
      provider: 'groq',
      model: groq,
      
      async generateContent(prompt) {
        const chatCompletion = await this.model.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama3-70b-8192',
          temperature: 0.7,
          max_tokens: 4096,
        });
        
        return {
          response: {
            text: () => chatCompletion.choices[0].message.content
          }
        };
      }
    };
    
    console.log('[AI] Using Groq (Llama 3 70B)');
  }
  
  return groqModel;
}

/**
 * Get Gemini model
 * @param {string} apiKey - Gemini API key
 * @returns {Object} Gemini model instance
 */
function getGeminiModel(apiKey) {
  if (!geminiModel) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    geminiModel = {
      provider: 'gemini',
      model: model,
      
      async generateContent(prompt) {
        return await model.generateContent(prompt);
      }
    };
    
    console.log('[AI] Using Google Gemini (gemini-1.5-flash)');
  }
  
  return geminiModel;
}

module.exports = {
  getAIModel,
  getGroqModel,
  getGeminiModel
};
