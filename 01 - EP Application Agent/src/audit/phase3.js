/**
 * Phase 3: AUDIT (Compliance & Logic)
 *
 * Implements the "Gatekeeper" engine for the HR Bot.
 */

/**
 * Calculates months until passport expiry from a given date.
 * @param {string} expiryDate - Passport expiry date in YYYY-MM-DD format
 * @returns {number} Number of months until expiry
 */
function calculateMonthsUntilExpiry(expiryDate) {
  if (!expiryDate) return 0;
  
  const today = new Date();
  const expiry = new Date(expiryDate);
  
  if (isNaN(expiry.getTime())) return 0;
  
  const months = (expiry.getFullYear() - today.getFullYear()) * 12;
  const monthDiff = expiry.getMonth() - today.getMonth();
  const daysDiff = expiry.getDate() - today.getDate();
  
  const totalMonths = months + monthDiff - (daysDiff < 0 ? 1 : 0);
  return totalMonths;
}

/**
 * Audits the candidate's extracted data against Malaysian compliance rules.
 * @param {Object} candidateData - Data extracted from Phase 1 and 2
 * @param {boolean} calculatePassportValidity - If true, calculates months_valid from date_of_expiry
 * @returns {Object} AuditReport - Contains boolean status and array of missing/invalid reasons
 */
function auditCandidateData(candidateData, calculatePassportValidity = false) {
  // Auto-calculate passport validity if requested and expiry date exists
  if (calculatePassportValidity && candidateData.passport && candidateData.passport.date_of_expiry) {
    candidateData.passport.months_valid = calculateMonthsUntilExpiry(candidateData.passport.date_of_expiry);
  }
  const auditReport = {
    action_status: {
      ready_for_form_generation: true,
      pause_reasons: []
    },
    candidate_payload: candidateData
  };

  const reasons = auditReport.action_status.pause_reasons;

  // [AUDIT-04] Check passport validity (Minimum 15 months from intended travel)
  if (!candidateData.passport || typeof candidateData.passport.months_valid !== 'number') {
    reasons.push("Missing passport data or 'months_valid' calculation.");
  } else if (candidateData.passport.months_valid < 15) {
    reasons.push(`Passport expires in ${candidateData.passport.months_valid} months. Minimum 15 months required.`);
  }

  // [AUDIT-01] Flag missing "Certified True Copy" (CTC) marks on academic certificates
  if (candidateData.certificates && candidateData.certificates.length > 0) {
    candidateData.certificates.forEach(cert => {
      if (!cert.has_ctc_stamp) {
        reasons.push(`Missing Certified True Copy (CTC) stamp on certificate: ${cert.name}`);
      }
    });
  } else {
    reasons.push("No academic certificates found for verification.");
  }

  // [AUDIT-02] Verify presence and validity of IRB Tax Clearance Letter/e-SPC
  // **UPDATE**: Not everybody has a tax clearance letter as not everyone has previous work experience in Malaysia.
  if (candidateData.previous_malaysian_experience === true) {
    if (!candidateData.tax_clearance_letter || !candidateData.tax_clearance_letter.is_valid) {
      reasons.push("Missing or invalid IRB Tax Clearance Letter (required for candidates with prior Malaysian work experience).");
    }
  } else {
    // If no previous experience or it's explicitly false, we don't require the Tax Clearance letter.
    console.log("[AUDIT] Skipping Tax Clearance Letter check: Candidate has no prior Malaysian work experience.");
  }

  // [AUDIT-03] Cross-reference job title and salary against MYFutureJobs approval letter
  if (!candidateData.myfuturejobs || !candidateData.job_offer) {
    reasons.push("Missing MYFutureJobs data or Job Offer data for cross-referencing.");
  } else {
    if (candidateData.job_offer.title !== candidateData.myfuturejobs.title) {
      reasons.push(`Job Title mismatch: Offer says '${candidateData.job_offer.title}' but MYFutureJobs says '${candidateData.myfuturejobs.title}'.`);
    }
    if (candidateData.job_offer.salary < candidateData.myfuturejobs.approved_salary) {
      reasons.push("Salary offered is below the MYFutureJobs approved minimum.");
    }
  }

  // [AUDIT-05] Strict "Pause" logic: Block form generation if any mandatory document is missing or invalid.
  if (reasons.length > 0) {
    auditReport.action_status.ready_for_form_generation = false;
  }

  return auditReport;
}

module.exports = {
  auditCandidateData,
  calculateMonthsUntilExpiry
};
