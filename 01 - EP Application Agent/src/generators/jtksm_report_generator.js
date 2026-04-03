const fs = require('fs').promises;
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

/**
 * Helper to determine gender from Malaysian IC number.
 * Last digit: Odd = Male (Lelaki), Even = Female (Perempuan).
 */
function getGender(ic) {
  if (!ic) return "";
  const icClean = ic.replace(/\\D/g, '');
  if (!icClean) return "";
  const lastDigit = parseInt(icClean[icClean.length - 1], 10);
  return lastDigit % 2 !== 0 ? "Lelaki" : "Perempuan";
}

/**
 * Analyzes a candidate's CV against the JD and generates a formal rejection reason 
 * using the Gemini API.
 */
async function generateRejectionReason(geminiModel, jdText, candidateObj) {
  const prompt = `
    You are an expert HR and Immigration Compliance Agent for Malaysia.
    
    <job_description>
    ${jdText}
    </job_description>
    
    <candidate_profile>
    Name: ${candidateObj.Name}
    Education: ${candidateObj.Education}
    </candidate_profile>
    
    Task: Write a single, professional sentence explaining why this candidate was 
    rejected for the role based on their profile mismatching the core technical or 
    domain requirements of the Job Description.

    Keep it concise, objective, and similar to this tone:
    "Lacks practical experience in SQL and Power BI; does not meet core technical requirements."
  `;

  const response = await geminiModel.generateContent(prompt);
  return response.response.text().trim();
}

/**
 * Phase 4 (GEN): Generates the consolidated "LAPORAN PENGAMBILAN" JTKSM report.
 * 
 * Replaces both 'consolidate_final.py' and 'expand_and_fill.py'.
 * 
 * @param {Object} geminiModel - Authenticated Gemini model instance
 * @param {string} jdFilePath - Path to the Job Description text/docx
 * @param {Array} rawCandidates - List of candidate objects (with Name, Email, Phone, Education, IC)
 * @param {string} templateFilePath - Path to the DOCX template (.docx)
 * @param {string} outputFilePath - Path to save the final populated DOCX
 */
async function generateJTKSMReport(geminiModel, jdText, rawCandidates, templateFilePath, outputFilePath) {
  console.log(`[GEN] Compiling details for ${rawCandidates.length} candidates...`);

  // 1. Process candidate data and generate dynamic AI decisions
  const processedCandidates = [];
  
  for (let i = 0; i < rawCandidates.length; i++) {
    const c = rawCandidates[i];
    
    // Validate missing fields
    const missing = [];
    if (!c.IC) missing.push("IC");
    if (!c.Name) missing.push("Full Name");
    if (!c.Email) missing.push("Email");
    
    if (missing.length > 0) {
      console.warn(`[WARN] Incomplete Data for ${c.Name || 'Unknown'} - Missing: ${missing.join(', ')}`);
    }

    console.log(`Analyzing mismatch for ${c.Name}...`);
    // Pass to Gemini to generate custom rejection reason mapped to JD
    const dynamicReason = await generateRejectionReason(geminiModel, jdText, c);

    processedCandidates.push({
      bil: i + 1,
      ic: c.IC || "",
      name: c.Name || "",
      phone: c.Phone || "",
      email: c.Email || "",
      gender: getGender(c.IC),
      education: c.Education || "",
      decision: "Tidak Berjaya",
      remarks: dynamicReason
    });
  }

  // 2. Load the Word Template
  // IMPORTANT: The existing DOCX template needs to trace a Docxtemplater loop over the table rows:
  // e.g., A table row containing: {#candidates} | {bil} | {ic} | {name} | ... | {remarks} | {/candidates}
  const templateContent = await fs.readFile(templateFilePath);
  const zip = new PizZip(templateContent);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // 3. Render the data into the doc
  doc.render({
    candidates: processedCandidates
  });

  // 4. Save Output
  const outputBuffer = doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  });

  await fs.writeFile(outputFilePath, outputBuffer);
  console.log(`✅ Success! Generated consolidated JTKSM report at: ${outputFilePath}`);
}

module.exports = {
  generateJTKSMReport
};
