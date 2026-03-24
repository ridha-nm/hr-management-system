# Expert Malaysian HR and Immigration Compliance Agent

## Project Context
The **Expert Malaysian HR and Immigration Compliance Agent** is a specialized tool designed to automate the complex, multi-step process of applying for Malaysian Employment Passes (EP), JTKSM (Jabatan Tenaga Kerja Semenanjung Malaysia) permissions, and PERKESO (SOCSO) approvals. Based on the **Great Pyramid consulting framework**, the agent ensures that all applications are perfectly formatted, PII-compliant, and strictly audited against official MDEC and JTKSM requirements.

## The "Three-Headed Monster"
A successful EP application requires a synchronized triplet of data:
1.  **Candidate Data:** Passport scans (all pages), CV, CTC Academic Certificates, Photos (light blue background).
2.  **JTKSM (Local Staff Ratios):** Company headcount, local vs. foreign staff ratios, starting salaries.
3.  **Company Data:** SSM profiles, DBKL licenses, Director ICs.

## Core Value
To eliminate manual data entry errors and compliance "gotchas" by providing a strict, automated audit-then-generate workflow that handles multipage document scans and produces ready-to-sign application folders.

## Operational Rules
- **PII Protection:** All historical data is scrubbed to create "Master Templates" with `{{PLACEHOLDERS}}`.
- **Strict Compliance:** [cite: 2302] for CTC certificates and [cite: 2303] for Tax Clearance are mandatory.
- **Pause on Error:** The agent will **not** generate forms if a single mandatory document (e.g., IRB Tax Clearance) is missing.
- **Organized Output:** Every successful run produces a dedicated folder: `Output/{{FULL_NAME}}_{{ID}}/`.

## Requirements

### Validated
(None yet — initialization phase)

### Active
- [ ] **EXTRACT-01**: Extract candidate details from Resume, Passport (multipage), and Certificates.
- [ ] **AUDIT-01**: Cross-reference uploads against JTKSM and EP requirements.
- [ ] **TEMPLATE-01**: Create "Sanitized Master Templates" by stripping PII from completed GP Checklists.
- [ ] **GEN-01**: Inject JSON data into Master Templates and output completed PDFs/Docx.
- [ ] **ORG-01**: Organize all generated documents into a per-candidate folder structure.

### Out of Scope
- Real-time submission to MDEC/ESD portals (API limitations).
- Direct payment processing for government fees.

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Pause on Missing Data | Ensures 100% compliance before form generation to avoid rejection. | Strategy A |
| Multipage Scan Support | Crucial for Passport copies which require every page (15+ pages). | Confirmed |
| PII-Scrubbing for Templates | Protects previous applicants' data while allowing for reusable templates. | Mandatory |

---
*Last updated: March 24, 2026 after initialization*
