/**
 * Test Script: Template Generation with docxtemplater
 * 
 * This script tests the generation of JTKSM and Interview reports
 * using sample data and docxtemplater templates.
 * 
 * Run with: node tests/test_template_generation.js
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Sample candidate data (matching the structure from the filled form)
const sampleCandidate = {
  Name: "Ahmad bin Abdullah",
  IC: "900515-01-1234",
  Phone: "+60 12-345-6789",
  Email: "ahmad.abdullah@email.com",
  Gender: "Lelaki",
  Education: "Bachelor of Computer Science - University of Malaya",
  Decision: "Tidak Berjaya",
  Remarks: "Lacks practical experience in SQL and Power BI; does not meet core technical requirements."
};

const sampleJobDescription = `
Sustainability Data Analyst

Responsibilities:
- Develop and maintain data pipelines for sustainability metrics
- Analyze large datasets to identify trends and insights
- Create dashboards and reports for stakeholders
- Work with cross-functional teams to implement data-driven solutions

Requirements:
- Bachelor's degree in Computer Science, Data Science, or related field
- 3+ years of experience in data analysis
- Proficiency in SQL, Python, and data visualization tools
- Strong analytical and problem-solving skills
- Excellent communication skills in Bahasa Malaysia and English
`;

const sampleCandidates = [
  {
    Bil: 1,
    IC: "900515-01-1234",
    Name: "Ahmad bin Abdullah",
    Phone: "+60 12-345-6789",
    Email: "ahmad.abdullah@email.com",
    Gender: "Lelaki",
    Education: "Bachelor of Computer Science - University of Malaya",
    Decision: "Tidak Berjaya",
    Remarks: "Lacks practical experience in SQL and Power BI; does not meet core technical requirements."
  },
  {
    Bil: 2,
    IC: "920820-02-5678",
    Name: "Siti Nurhaliza binti Rahman",
    Phone: "+60 13-456-7890",
    Email: "siti.rahman@email.com",
    Gender: "Perempuan",
    Education: "Master of Data Science - Universiti Kebangsaan Malaysia",
    Decision: "Berjaya",
    Remarks: "Meets all requirements with strong SQL and Python background."
  }
];

async function testJTKSMReportGeneration() {
  console.log('\n========== Testing JTKSM Report Generation ==========\n');
  
  try {
    // Check if template exists
    const templatePath = path.join(__dirname, '../templates/jtksm_template.docx');
    
    try {
      await fs.access(templatePath);
    } catch (error) {
      console.log('⚠️  Template file not found. Creating placeholder template...');
      console.log('   Please create a Word document with the following placeholders:');
      console.log('   - {bil}, {ic}, {name}, {phone}, {email}, {gender}, {education}, {decision}, {remarks}');
      console.log('   - Use loop syntax: {#candidates}...{/candidates} for table rows\n');
      return false;
    }

    // Load template
    const templateContent = await fs.readFile(templatePath);
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render with data
    doc.render({
      candidates: sampleCandidates
    });

    // Generate output
    const outputBuffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    const outputPath = path.join(__dirname, '../Output/test_jtksm_report.docx');
    await fs.writeFile(outputPath, outputBuffer);
    
    console.log('✅ Success! Generated JTKSM report at:', outputPath);
    console.log('   Candidates processed:', sampleCandidates.length);
    return true;

  } catch (error) {
    console.error('❌ Error generating JTKSM report:', error.message);
    if (error.properties && error.properties.errors) {
      console.error('   Docxtemplater errors:', error.properties.errors);
    }
    return false;
  }
}

async function testInterviewReportGeneration() {
  console.log('\n========== Testing Interview Report Generation ==========\n');
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Simulate Gemini-generated content
    const generatedData = {
      candidate_name: sampleCandidate.Name,
      job_title: "Sustainability Data Analyst",
      interview_period: "13th March - 19th March 2024",
      core_jd_requirements: "SQL, Python, data visualization, 3+ years experience",
      interview_outcome: "Candidate demonstrated strong theoretical knowledge but lacked practical SQL experience",
      adjusted_jd_notes: "While the candidate has a strong educational background, hands-on experience with required tools is insufficient"
    };

    // Check if template exists
    const templatePath = path.join(__dirname, '../templates/interview_template.docx');
    
    try {
      await fs.access(templatePath);
    } catch (error) {
      console.log('⚠️  Template file not found. Creating placeholder template...');
      console.log('   Please create a Word document with the following placeholders:');
      console.log('   - {candidate_name}, {job_title}, {interview_period}');
      console.log('   - {core_jd_requirements}, {interview_outcome}, {adjusted_jd_notes}\n');
      return false;
    }

    // Load template
    const templateContent = await fs.readFile(templatePath);
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render with data
    doc.render(generatedData);

    // Generate output
    const outputBuffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    const outputPath = path.join(__dirname, '../Output/test_interview_report.docx');
    await fs.writeFile(outputPath, outputBuffer);
    
    console.log('✅ Success! Generated Interview report at:', outputPath);
    return true;

  } catch (error) {
    console.error('❌ Error generating Interview report:', error.message);
    if (error.properties && error.properties.errors) {
      console.error('   Docxtemplater errors:', error.properties.errors);
    }
    return false;
  }
}

async function main() {
  console.log('\n========================================', 'cyan');
  console.log('Template Generation Test', 'cyan');
  console.log('========================================\n', 'cyan');

  // Ensure Output directory exists
  const outputDir = path.join(__dirname, '../Output');
  await fs.mkdir(outputDir, { recursive: true });

  const results = {
    jtksm: await testJTKSMReportGeneration(),
    interview: await testInterviewReportGeneration()
  };

  console.log('\n========================================');
  console.log('Test Summary', 'cyan');
  console.log('========================================\n');

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(r => r).length;

  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}\n`);

  if (passed === total) {
    console.log('✅ All template generation tests passed!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please create the required template files.\n');
    console.log('Template Creation Instructions:');
    console.log('1. Open the existing filled documents:');
    console.log('   - GP Checklist - EP (New) - MDEC [CANDIDATE] Completed.docx');
    console.log('   - Interviews/101024 - LAPORAN PENGAMBILAN PEKERJA TEMPATAN - SEMENANJUNG (1)_FILLED.docx');
    console.log('2. Replace actual data with docxtemplater placeholders');
    console.log('3. Save as:');
    console.log('   - templates/jtksm_template.docx');
    console.log('   - templates/interview_template.docx\n');
    process.exit(1);
  }
}

main();
