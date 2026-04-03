const fs = require('fs').promises;
const path = require('path');

/**
 * Phase 5 (ORG): Organizes all generated documents into a per-candidate folder structure.
 * 
 * Creates: Output/{{FULL_NAME}}_{{ID}}/
 *   - audit_report.md (Human-readable compliance report)
 *   - generated_forms/ (JTKSM report, Interview outcomes, etc.)
 *   - extracted_data.json (Structured candidate data)
 *   - original_uploads/ (Copies of uploaded documents)
 * 
 * @param {Object} candidateData - Complete candidate data from extraction
 * @param {Object} auditReport - Audit result from Phase 3
 * @param {Array} generatedFiles - List of paths to generated documents
 * @param {string} baseOutputDir - Base directory for output (default: ./Output)
 * @returns {Promise<string>} Path to the created candidate folder
 */
async function organizeCandidateOutput(
  candidateData,
  auditReport,
  generatedFiles = [],
  baseOutputDir = './Output'
) {
  // Generate candidate identifier
  const fullName = candidateData.passport?.full_name?.replace(/\s+/g, '_') || 'Unknown_Candidate';
  const passportNumber = candidateData.passport?.passport_number || 'NO_PASSPORT';
  const candidateFolderName = `${fullName}_${passportNumber}`;
  const candidateFolderPath = path.join(baseOutputDir, candidateFolderName);

  console.log(`[ORG] Creating output folder: ${candidateFolderPath}`);

  // Create directory structure
  const subdirs = ['generated_forms', 'original_uploads'];
  for (const subdir of subdirs) {
    await fs.mkdir(path.join(candidateFolderPath, subdir), { recursive: true });
  }

  // 1. Generate human-readable audit report (Markdown)
  const auditReportPath = path.join(candidateFolderPath, 'audit_report.md');
  const auditReportContent = generateAuditReportMarkdown(candidateData, auditReport);
  await fs.writeFile(auditReportPath, auditReportContent);
  console.log(`[ORG] Generated audit report: ${auditReportPath}`);

  // 2. Save extracted data as JSON
  const extractedDataPath = path.join(candidateFolderPath, 'extracted_data.json');
  await fs.writeFile(extractedDataPath, JSON.stringify(candidateData, null, 2));
  console.log(`[ORG] Saved extracted data: ${extractedDataPath}`);

  // 3. Copy generated files to candidate folder
  const copiedFiles = [];
  for (const filePath of generatedFiles) {
    if (await fs.access(filePath).then(() => true).catch(() => false)) {
      const fileName = path.basename(filePath);
      const destPath = path.join(candidateFolderPath, 'generated_forms', fileName);
      await fs.copyFile(filePath, destPath);
      copiedFiles.push(destPath);
      console.log(`[ORG] Copied generated file: ${destPath}`);
    }
  }

  // 4. Generate JSON payload for downstream Codex integration
  const codexPayloadPath = path.join(candidateFolderPath, 'codex_payload.json');
  const codexPayload = {
    candidate_id: passportNumber,
    full_name: candidateData.passport?.full_name,
    audit_status: auditReport.action_status.ready_for_form_generation ? 'PASSED' : 'FAILED',
    audit_timestamp: new Date().toISOString(),
    pause_reasons: auditReport.action_status.pause_reasons,
    generated_files: copiedFiles.map(f => path.relative(baseOutputDir, f)),
    candidate_data: candidateData
  };
  await fs.writeFile(codexPayloadPath, JSON.stringify(codexPayload, null, 2));
  console.log(`[ORG] Generated Codex payload: ${codexPayloadPath}`);

  console.log(`[ORG] ✓ Success! Candidate folder created at: ${candidateFolderPath}`);
  return candidateFolderPath;
}

/**
 * Generates a human-readable Markdown audit report.
 * @param {Object} candidateData - Candidate data
 * @param {Object} auditReport - Audit report
 * @returns {string} Markdown content
 */
function generateAuditReportMarkdown(candidateData, auditReport) {
  const status = auditReport.action_status.ready_for_form_generation;
  const reasons = auditReport.action_status.pause_reasons;

  let md = `# Audit Report: ${candidateData.passport?.full_name || 'Unknown Candidate'}\n\n`;
  md += `**Generated:** ${new Date().toISOString()}\n\n`;
  md += `**Passport:** ${candidateData.passport?.passport_number || 'N/A'}\n`;
  md += `**Nationality:** ${candidateData.passport?.nationality || 'N/A'}\n\n`;

  md += `## Audit Status\n\n`;
  md += status 
    ? '### ✅ **PASSED** - Ready for Form Generation\n\n'
    : '### ❌ **FAILED** - Form Generation Blocked\n\n';

  if (reasons.length > 0) {
    md += `### Compliance Issues (${reasons.length})\n\n`;
    reasons.forEach((reason, index) => {
      md += `${index + 1}. ${reason}\n`;
    });
    md += '\n';
  } else {
    md += 'All compliance checks passed.\n\n';
  }

  md += `## Document Verification\n\n`;
  md += `| Document Type | Status | Details |\n`;
  md += `|---------------|--------|---------|\n`;
  
  // Passport
  const passportMonths = candidateData.passport?.months_valid || 'N/A';
  md += `| Passport | ${passportMonths >= 15 ? '✅' : '❌'} | ${passportMonths} months validity |\n`;
  
  // Certificates
  const certCount = candidateData.certificates?.length || 0;
  const ctcCount = candidateData.certificates?.filter(c => c.is_certified_true_copy)?.length || 0;
  md += `| Academic Certificates | ${ctcCount === certCount && certCount > 0 ? '✅' : '❌'} | ${ctcCount}/${certCount} with CTC stamps |\n`;
  
  // Tax Clearance
  const hasTaxClearance = candidateData.tax_clearance_letter?.is_valid || false;
  const taxClearanceRequired = candidateData.previous_malaysian_experience === true;
  const taxStatus = taxClearanceRequired ? (hasTaxClearance ? '✅' : '❌') : '⚪';
  md += `| Tax Clearance Letter | ${taxStatus} | ${taxClearanceRequired ? 'Required' : 'Not Required'} |\n`;
  
  // MYFutureJobs
  const myfuturejobsMatch = candidateData.myfuturejobs?.title === candidateData.job_offer?.title;
  const salaryMatch = (candidateData.job_offer?.salary || 0) >= (candidateData.myfuturejobs?.approved_salary || 0);
  md += `| MYFutureJobs | ${myfuturejobsMatch && salaryMatch ? '✅' : '❌'} | Title: ${myfuturejobsMatch ? 'Match' : 'Mismatch'}, Salary: ${salaryMatch ? 'OK' : 'Below Minimum'} |\n`;

  md += `\n## Recommendations\n\n`;
  if (!status) {
    md += 'Please address all compliance issues listed above before proceeding with form generation.\n';
    md += 'Once all issues are resolved, re-run the audit to generate application forms.\n';
  } else {
    md += 'All documents are compliant. Proceed with generating application forms.\n';
  }

  md += `\n---\n*This report was automatically generated by the HR Bot Compliance Engine.*\n`;

  return md;
}

module.exports = {
  organizeCandidateOutput,
  generateAuditReportMarkdown
};
