const fs = require('fs').promises;
const path = require('path');
const mammoth = require('mammoth');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

/**
 * Parses a DOCX file and extracts its raw text.
 * @param {string} filePath 
 * @returns {Promise<string>}
 */
async function extractTextFromDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

/**
 * Phase 4 (GEN): Generates a personalized Interview Report / JD form.
 * 
 * Uses Gemini to dynamically align the candidate's interview outcome
 * with the specific requirements found in their customized JD template.
 * 
 * @param {Object} geminiModel - Authenticated Gemini model instance
 * @param {string} candidateName - Name of the candidate
 * @param {string} jdFilePath - Path to the specific JD docx for this person
 * @param {string} templateFilePath - Path to the interview template with placeholders
 * @param {string} interviewNotes - Raw notes/feedback from their interview
 */
async function generateInterviewReport(geminiModel, candidateName, jdFilePath, templateFilePath, interviewNotes) {
  console.log(`[GEN] Starting Interview Report generation for ${candidateName}...`);
  
  // 1. Read the text of the specific Job Description
  const jdText = await extractTextFromDocx(jdFilePath);

  // 2. Prompt Gemini to align the interview outcome against this exact JD
  const prompt = `
    You are an expert HR and Immigration Compliance Agent.
    
    <job_description>
    ${jdText}
    </job_description>
    
    <candidate_interview_notes>
    ${interviewNotes}
    </candidate_interview_notes>
    
    Your task:
    1. Read the Specific Job Description (JD) provided above.
    2. Read the raw interview notes for the candidate.
    3. Generate a highly professional, tailored interview outcome that directly maps their performance (or lack thereof) to the specific core requirements of this JD.
    4. If it's a rejection, the rejection reason MUST explicitly reference the technical/soft skills missing from the JD.
    
    Output a strictly formatted JSON object with the following keys exactly (these match the placeholders in our docx template):
    {
      "candidate_name": "${candidateName}",
      "job_title": "...",
      "interview_period": "...",
      "core_jd_requirements": "...",
      "interview_outcome": "...",
      "adjusted_jd_notes": "..."
    }
    
    Return ONLY valid JSON (no markdown formatting blocks like \`\`\`json).
  `;

  console.log(`[GEN] Prompting Gemini to align outcome with JD...`);
  const response = await geminiModel.generateContent(prompt);
  let jsonString = response.response.text().trim();
  
  // Clean up potential markdown formatting from Gemini
  if (jsonString.startsWith('\`\`\`json')) {
    jsonString = jsonString.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
  }
  
  const generatedData = JSON.parse(jsonString);

  // 3. Load the Word Template (Form with placeholders)
  const templateContent = await fs.readFile(templateFilePath);
  const zip = new PizZip(templateContent);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // 4. Inject the Gemini-generated data into the placeholders
  doc.render(generatedData);

  // 5. Save the populated Final Report
  const outputBuffer = doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  });

  const outputFileName = `Interview_Outcome_${candidateName.replace(/\\s+/g, '_')}.docx`;
  const outputPath = path.join(path.dirname(templateFilePath), outputFileName);
  await fs.writeFile(outputPath, outputBuffer);

  console.log(`✅ Success! Generated customized report at: ${outputPath}`);
  return outputPath;
}

module.exports = {
  generateInterviewReport
};
