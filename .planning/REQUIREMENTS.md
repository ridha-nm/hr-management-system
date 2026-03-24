# Requirements: Expert Malaysian HR and Immigration Compliance Agent (v1)

## v1 Requirements

### Candidate Extraction (CANDIDATE)
- [ ] **CANDIDATE-01**: Extract full name, passport number, nationality, and expiry from multipage passport scans.
- [ ] **CANDIDATE-02**: Extract education history and professional experience from CV/Resume.
- [ ] **CANDIDATE-03**: Extract academic qualification details from certificates (Degree, Institution, Date).
- [ ] **CANDIDATE-04**: Validate photo against MDEC specifications (Light blue background, neutral expression).

### Company & JTKSM Data (COMPANY)
- [ ] **COMPANY-01**: Extract company registration (SSM) and local staff headcount from uploaded SSM profiles.
- [ ] **COMPANY-02**: Extract DBKL license validity and registration numbers.
- [ ] **COMPANY-03**: Map JTKSM local-to-foreign staff ratios from internal headcount reports.

### Compliance Audit (AUDIT)
- [ ] **AUDIT-01**: Flag missing "Certified True Copy" (CTC) marks on academic certificates [cite: 2302].
- [ ] **AUDIT-02**: Verify presence and validity of IRB Tax Clearance Letter/e-SPC [cite: 2303].
- [ ] **AUDIT-03**: Cross-reference job title and salary against MYFutureJobs approval letter.
- [ ] **AUDIT-04**: Check passport validity (Minimum 15 months from intended travel).
- [ ] **AUDIT-05**: Strict "Pause" logic: Block form generation if any mandatory document is missing or invalid.

### Form Generation (GEN)
- [ ] **GEN-01**: Inject extracted data into "Sanitized Master Templates" (GP Checklist, JTKSM Form).
- [ ] **GEN-02**: Produce completed Docx/PDF files with zero manual data entry required.
- [ ] **GEN-03**: Strip all Personally Identifiable Information (PII) from historical "Sanitized Master Templates" before use.

### Organization & Output (ORG)
- [ ] **ORG-01**: Create a dedicated output folder for each candidate: `Output/{{FULL_NAME}}_{{ID}}/`.
- [ ] **ORG-02**: Generate a "Human-Readable Audit Report" (PDF/Markdown) listing all verified documents and any missing items.
- [ ] **ORG-03**: Output a strictly formatted JSON payload for downstream Codex script integration.

## v2 Requirements (Deferred)
- [ ] **EXT-01**: Automatic MyFutureJobs advertisement monitoring.
- [ ] **EXT-02**: Bulk processing of multiple candidates in a single zip upload.
- [ ] **EXT-03**: Multi-factor authentication for the agent interface.

## Out of Scope
- [ ] Real-time submission to government portals (ESD/MDEC/JTKSM).
- [ ] Management of government fee payments.

---
*Last updated: March 24, 2026 after initialization*
