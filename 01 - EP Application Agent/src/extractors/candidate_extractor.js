const { getAIModel } = require('../aiConnection');

/**
 * Helper function to create a file part for Gemini API or Groq
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
 * Extracts candidate data from passport images or scans.
 * @param {Buffer} buffer - The file buffer (image or PDF).
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Promise<Object>} Extracted passport data.
 */
async function extractPassportData(buffer, mimeType) {
  try {
    const model = getAIModel();

    const prompt = `Extract the following details from this passport document in JSON format:
    - full_name: The full name of the passport holder.
    - passport_number: The passport number.
    - nationality: The nationality.
    - date_of_birth: Date of birth (YYYY-MM-DD).
    - date_of_expiry: Date of expiry (YYYY-MM-DD).
    - issuing_country: Country of issue.

    Ensure the JSON is valid and only contains these fields. If a field is not visible or unclear, set it to null.
    Return ONLY valid JSON, no markdown formatting.`;

    const filePart = createFilePart(buffer, mimeType);

    const result = await model.generateContent([prompt, filePart]);
    const text = result.response.text();

    // Clean up potential markdown code blocks
    const jsonString = text.replace(/```json\n|```/g, '').trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error('Error extracting passport data:', error);
    throw new Error('Failed to extract passport data.');
  }
}

/**
 * Extracts education and professional experience from CVs.
 * @param {Buffer} buffer - The file buffer (PDF or image).
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Promise<Object>} Extracted CV data.
 */
async function extractCVData(buffer, mimeType) {
  try {
    const model = getGeminiModel(process.env.GEMINI_API_KEY);

    const prompt = `Extract the following details from this CV/Resume in JSON format:
    - full_name: The candidate's full name.
    - contact_info: { email, phone, address }.
    - education: Array of objects with { institution, degree, start_date, end_date, field_of_study }.
    - experience: Array of objects with { company, role, start_date, end_date, description }.
    - skills: Array of strings.

    Ensure the JSON is valid. If a field is missing, set it to null or an empty array.`;

    const filePart = createFilePart(buffer, mimeType);

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json\n|```/g, '').trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error('Error extracting CV data:', error);
    throw new Error('Failed to extract CV data.');
  }
}

/**
 * Extracts academic qualification details from certificates.
 * @param {Buffer} buffer - The file buffer (PDF or image).
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Promise<Object>} Extracted certificate data.
 */
async function extractCertificateData(buffer, mimeType) {
  try {
    const model = getGeminiModel(process.env.GEMINI_API_KEY);

    const prompt = `Extract the following details from this academic certificate in JSON format:
    - institution_name: Name of the university or institution.
    - degree_name: Name of the degree or qualification.
    - candidate_name: Name of the candidate on the certificate.
    - completion_date: Date of completion or graduation (YYYY-MM-DD).
    - grade_or_class: Grade, class, or CGPA if mentioned.
    - is_certified_true_copy: Boolean, true if a "Certified True Copy" stamp is visible, false otherwise.

    Ensure the JSON is valid.`;

    const filePart = createFilePart(buffer, mimeType);

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json\n|```/g, '').trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error('Error extracting certificate data:', error);
    throw new Error('Failed to extract certificate data.');
  }
}

/**
 * Validates a passport photo against MDEC specifications.
 * @param {Buffer} buffer - The image buffer.
 * @param {string} mimeType - The MIME type of the image.
 * @returns {Promise<Object>} Validation result { isValid: boolean, reason: string }.
 */
async function validatePhoto(buffer, mimeType) {
  try {
    const model = getGeminiModel(process.env.GEMINI_API_KEY);

    const prompt = `Analyze this passport photo for MDEC compliance.
    Requirements:
    1. Background color must be light blue.
    2. Facial expression must be neutral (no smiling, no frowning).
    3. Face must be clearly visible and centered.
    
    Return a JSON object with:
    - is_valid: boolean
    - background_color: string (description of the background color)
    - facial_expression: string (description of the expression)
    - reason: string (explanation if invalid, or "Compliant" if valid)
    
    Ensure the JSON is valid.`;

    const filePart = createFilePart(buffer, mimeType);

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json\n|```/g, '').trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error('Error validating photo:', error);
    throw new Error('Failed to validate photo.');
  }
}

module.exports = {
  extractPassportData,
  extractCVData,
  extractCertificateData,
  validatePhoto,
};
