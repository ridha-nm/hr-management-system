require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs = require('fs').promises;
const path = require('path');
const { getGeminiModel, getGeminiFileManager } = require('../geminiConnection');

/**
 * Uploads large local files (like a 57MB email PDF) to Gemini using File API.
 */
async function uploadToGemini(filePath, mimeType) {
  const fileManager = getGeminiFileManager(process.env.GEMINI_API_KEY);
  console.log(`[Upload] Uploading ${path.basename(filePath)} to Gemini for analysis...`);
  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: mimeType,
    displayName: path.basename(filePath),
  });
  console.log(`[Upload] Uploaded successfully: ${uploadResponse.file.uri}`);
  return uploadResponse.file;
}

/**
 * 1. Read email thread and advise on missing docs
 */
async function adviseEmailThread(emailPdfPath) {
  const model = getGeminiModel(process.env.GEMINI_API_KEY);
  const geminiFile = await uploadToGemini(emailPdfPath, 'application/pdf');

  const prompt = `
    You are an expert Malaysian HR and Immigration Compliance Agent.
    Read through this email thread regarding an Employment Pass / JTKSM application.
    
    1. Summarize the current status of the application based on the correspondence.
    2. Explicitly outline what documents or actions are MISSING/REQUESTED from the employee or company.
    3. Draft a short, professional response email to the candidate. Outline exactly what files they must provide so we can proceed, and briefly explain how we will use their files to navigate the local compliance requirements on their behalf.
  `;

  console.log(`[Advisor] Analyzing the email thread...`);
  const result = await model.generateContent([geminiFile, { text: prompt }]);
  
  console.log("\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(" GSD ► HR EMAIL ADVISOR / NEXT STEPS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n");
  console.log(result.response.text());
}

/**
 * 2. Generate Interview Template & MyFutureJobs submission steps
 */
async function createInterviewTemplateAndSteps(jdDocxPath) {
  const model = getGeminiModel(process.env.GEMINI_API_KEY);
  
  const prompt = `
    You are an expert Malaysian HR advisor handling MYFutureJobs (PERKESO) compliance.
    
    We need an Interview Template aligned with MYFutureJobs requirements for the role matching the attached Job Description at: ${jdDocxPath}.
    
    1. Generate a printable Interview Assessment Template (including technical scoring matrices and specific domain questions) customized for this JD. 
    2. Provide standard operating procedure (SOP) steps explaining how to use the completed interview outcomes to fill up the internal 'Surat Perakuan MYFJ' form, and exactly how to submit it via the MYFutureJobs/PERKESO portal (following the mandatory 14-day ad rules and local objection guidelines).
  `;
  
  console.log(`[Advisor] Generating Interview Template and MYFJ Guidelines...`);
  const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
  
  console.log("\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(" GSD ► MYFUTUREJOBS TEMPLATE & SOP");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n");
  console.log(result.response.text());
}

// --------------------- CLI Router ---------------------
const command = process.argv[2];
const filePath = process.argv[3];

if (!command || !filePath) {
  console.log("Usage: node src/agent/advisor.js <command> <file-path>");
  console.log("Commands:");
  console.log("  email-advise            <path-to-email-pdf>");
  console.log("  myfuturejobs-template   <path-to-jd>");
  process.exit(1);
}

if (command === 'email-advise') {
  adviseEmailThread(filePath).catch(console.error);
} else if (command === 'myfuturejobs-template') {
  createInterviewTemplateAndSteps(filePath).catch(console.error);
} else {
  console.log("Unknown command.");
}
