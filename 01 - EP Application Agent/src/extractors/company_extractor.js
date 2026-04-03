const { getGeminiModel } = require('../geminiConnection');

/**
 * Helper function to create a file part for Gemini API.
 * @param {Buffer} buffer - The file buffer.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Object} The file part object.
 */
function createFilePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType: mimeType,
    },
  };
}

/**
 * Extracts DBKL license data (License #, Expiry Date).
 * @param {Buffer} buffer - The file buffer (PDF or image).
 * @param {string} mimeType - The MIME type.
 * @returns {Promise<Object>} Extracted DBKL data.
 */
async function extractDBKLData(buffer, mimeType) {
  try {
    const model = getGeminiModel(process.env.GEMINI_API_KEY);

    const prompt = `Extract the following details from this DBKL License document in JSON format:
    - license_number: The license number (e.g., DBKL.JPPP_...).
    - expiry_date: The expiry date of the license (YYYY-MM-DD).
    - company_name: The company name listed on the license.
    - premise_address: The premise address listed.
    - status: Is it "Instant" or "Approved"?

    Ensure the JSON is valid. If a field is not visible, set it to null.`;

    const filePart = createFilePart(buffer, mimeType);

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json\n|```/g, '').trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error('Error extracting DBKL data:', error);
    throw new Error('Failed to extract DBKL data.');
  }
}

/**
 * Extracts SSM company registration data.
 * @param {Buffer} buffer - The file buffer (PDF or image).
 * @param {string} mimeType - The MIME type.
 * @returns {Promise<Object>} Extracted SSM data.
 */
async function extractSSMData(buffer, mimeType) {
  try {
    const model = getGeminiModel(process.env.GEMINI_API_KEY);

    const prompt = `Extract the following details from this SSM (Companies Commission of Malaysia) document in JSON format:
    - registration_number: The company registration number.
    - company_name: The official company name.
    - date_of_incorporation: Date of incorporation (YYYY-MM-DD).
    - registered_office_address: The registered office address.
    - business_nature: A brief description of the nature of business.

    Ensure the JSON is valid. If a field is not visible, set it to null.`;

    const filePart = createFilePart(buffer, mimeType);

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json\n|```/g, '').trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error('Error extracting SSM data:', error);
    throw new Error('Failed to extract SSM data.');
  }
}


/**
 * Calculates JTKSM compliance based on staff headcount and salary.
 * @param {number} localStaffCount - Number of local (Malaysian) employees.
 * @param {number} foreignStaffCount - Number of foreign employees.
 * @param {number} startingSalary - The starting basic salary for the position.
 * @returns {Object} Compliance data { ratio, compliance_status, reason }
 */
function calculateJTKSMCompliance(localStaffCount, foreignStaffCount, startingSalary) {
  const JTKSM_RATIO_REQUIREMENT = 3; // 1 foreign staff for every 3 local staff
  const MIN_SALARY_REQUIREMENT = 3000; // Example minimum salary for foreign staff

  let compliance_status = true;
  let reason = "Compliant";

  // Check ratio
  if (foreignStaffCount > 0 && localStaffCount / foreignStaffCount < JTKSM_RATIO_REQUIREMENT) {
    compliance_status = false;
    reason = `Ratio non-compliant: Requires ${JTKSM_RATIO_REQUIREMENT} local staff per foreign staff.`;
  }

  // Check salary
  if (startingSalary < MIN_SALARY_REQUIREMENT) {
    compliance_status = false;
    reason = `Salary non-compliant: Minimum salary of RM ${MIN_SALARY_REQUIREMENT} required.`;
  }

  const total_staff = localStaffCount + foreignStaffCount;
  const ratio = foreignStaffCount > 0 ? (localStaffCount / foreignStaffCount).toFixed(2) : "N/A";

  return {
    total_staff,
    local_staff: localStaffCount,
    foreign_staff: foreignStaffCount,
    ratio: parseFloat(ratio),
    compliance_status,
    reason,
  };
}

/**
 * Extracts JTKSM staff headcount and ratio data.
 * @param {Buffer} buffer - The file buffer.
 * @param {string} mimeType - The MIME type.
 * @returns {Promise<Object>} Extracted JTKSM data.
 */
async function extractJTKSMData(buffer, mimeType, localStaffCount, startingSalary) {
  try {
    const model = getGeminiModel(process.env.GEMINI_API_KEY);

    const prompt = `Extract the number of foreign employees from this document in JSON format:
    - foreign_staff: Number of foreign employees (or null if not found).

    Ensure the JSON is valid.`;

    const filePart = createFilePart(buffer, mimeType);

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json\n|```/g, '').trim();
    const extractedData = JSON.parse(jsonString);
    const foreignStaff = extractedData.foreign_staff !== null ? parseInt(extractedData.foreign_staff, 10) : 0;

    return calculateJTKSMCompliance(localStaffCount, foreignStaff, startingSalary);

  } catch (error) {
    console.error('Error extracting JTKSM data:', error);
    throw new Error('Failed to extract JTKSM data.');
  }
}

module.exports = {
  extractDBKLData,
  extractSSMData,
  extractJTKSMData,
  calculateJTKSMCompliance,
};
