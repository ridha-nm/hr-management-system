/**
 * Keyword-Based Response System - v3.0
 * No AI API keys required - works offline!
 *
 * KEY FEATURES:
 * - Step-by-step guidance with progressive disclosure
 * - Auto-fill forms from uploaded CSV/Excel templates
 * - Clean, focused responses without information dumps
 */

const companyInfo = {
  staffBreakdown: {
    top: 3,
    middle: 6,
    entry: 23,
    total: 32
  },
  startingSalary: 3800,
  cooEmail: 'syaheedah@pantas.com',
  position: 'Sustainability Data Analyst'
};

const responses = {
  greetings: {
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'start', 'welcome', 'begin'],
    response: `👋 **Welcome! I'm your EP Application Assistant.**

## ✨ **How I Can Help**

I'll guide you through the EP application **step-by-step** - no information overload!

### 🎯 **Key Feature: Auto-Fill Forms**

**Here's the magic:** Upload your interview template (CSV/Excel), and I'll automatically fill the official MyFutureJobs form for you!

**How it works:**
1. Download the interview template (CSV or Excel)
2. Conduct your interviews and fill in the template
3. Drag & drop the filled file here
4. I'll parse it and generate the official form automatically

---

## 📍 **Where Would You Like to Start?**

**Option 1: Phase-by-Phase**
- Type **"Phase 1"** → Company documents
- Type **"Phase 2"** → Candidate documents  
- Type **"Phase 3"** → MyFutureJobs (with step-by-step guidance)
- Type **"Phase 4"** → JTKSM form
- Type **"Phase 5"** → EP application

**Option 2: MyFutureJobs Steps**
- Type **"Step 1"** → Account setup
- Type **"Step 2"** → Job posting
- Type **"Step 3"** → Interview period
- Type **"Step 4"** → Upload template
- Type **"Step 5"** → Submit & approve

**Option 3: Quick Actions**
- Type **"download"** → Get all templates
- Type **"email template"** → Email templates
- Type **"checklist"** → Document checklist

---

💡 **Tip:** Click the option cards in the welcome message or use the sidebar for quick access!`
  },

  documentsNeeded: {
    keywords: ['what documents', 'documents needed', 'required documents', 'document checklist', 'ep application', 'checklist'],
    response: `📋 **COMPLETE DOCUMENT CHECKLIST**

---

## 🏢 **COMPANY DOCUMENTS** (Ready to Download & Send to Agency)

**Download and send directly to agency:**

- **[SSM_Documents.zip](/api/templates/SSM_Documents.zip)** - Latest SSM (Mar 2026)
- **[Company_License.pdf](/api/templates/Company_License.pdf)** - Company license (Lesen)
- **[JTKSM_Approval.pdf](/api/templates/JTKSM_Approval.pdf)** - JTKSM approval

**Still need to request from COO:**
- Directors' IC/Passport copies
- Employment contracts + payslips
- Staff breakdown confirmation

---

## 📚 **REFERENCE GUIDES** (For Your Learning - NOT for Agency)

- **[SOCSO_Approval_Guide.pdf](/api/templates/SOCSO_Approval_Guide.pdf)** - How to use MyFutureJobs (Phase 3)

---

## **PHASE 1: COMPANY DOCUMENTS**

**Contact:** Syaheedah (COO) - syaheedah@pantas.com

| Document | Details | Status |
|----------|---------|--------|
| **SSM Copy** | Latest, within 6 months | ✅ Ready |
| **Company License** | Lesen | ✅ Ready |
| **Directors' IC/Passport** | All directors in SSM | ⬜ Request from COO |
| **Employment Contracts** | 2 Management + 2 General Worker | ⬜ Request from COO |
| **Payslips** | Latest 3 months (all 4 workers) | ⬜ Request from COO |
| **Staff Breakdown** | Top: 3, Middle: 6, Entry: 23 | ⬜ Request from COO |

---

## **PHASE 2: CANDIDATE DOCUMENTS**

**Contact:** Candidate directly

| Document | Details | Status |
|----------|---------|--------|
| **Passport** | ALL pages, 15+ months validity | ⬜ |
| **CV/Resume** | Updated, PDF format | ⬜ |
| **Certificates** | With CTC stamp | ⬜ |
| **Transcripts** | Official from all institutions | ⬜ |
| **Photo** | Light blue background, 35x50mm | ⬜ |
| **Tax Clearance** | Only if worked in MY before | ⬜ |

---

## **PHASE 3: MYFUTUREJOBS**

| Document | Details | Status |
|----------|---------|--------|
| **Job Posting** | 14 days minimum | ⬜ |
| **Interview Records** | All candidates interviewed | ⬜ |
| **Assessment Form** | Use template I provide | ⬜ |
| **Approval Letter** | 5-7 days after submission | ⬜ |

---

## **PHASE 4: JTKSM**

| Document | Details | Status |
|----------|---------|--------|
| **JTKSM Report** | Download & fill Word template | ⬜ |
| **Application** | Submit with all forms | ⬜ |

---

## **PHASE 5: EP APPLICATION**

| Document | Details | Status |
|----------|---------|--------|
| **GP Checklist** | Download & fill Word template | ⬜ |
| **EP Application** | Submit via ESD portal | ⬜ |
| **Approval** | 4-6 weeks processing | ⬜ |

---

## ⚠️ **CRITICAL REQUIREMENTS:**

1. **Passport Validity:** Minimum 15 months from intended travel
2. **CTC Stamps:** All certificates MUST have "Certified True Copy" stamp
3. **Photo Background:** Light blue (NOT white)
4. **SSM Date:** Within 6 months of submission
5. **MyFutureJobs:** Minimum 14 days interview period

---

## 📧 **EMAIL TEMPLATES:**

### **To COO (Syaheedah):**
\`\`\`
Subject: EP Application - Company Documents Required

Dear Syaheedah,

We are proceeding with the EP application for:

Candidate: [NAME]
Position: [POSITION]

Required:
1. Latest SSM Copy (within 6 months)
2. Directors' IC/Passport (all in SSM)
3. Employment Contracts + payslips (2 Mgmt + 2 Worker)
4. Staff Breakdown confirmation

Needed by: [DATE]

Thank you!
\`\`\`

### **To Candidate:**
\`\`\`
Subject: EP Application - Required Documents

Dear [Name],

Required:
1. Passport (all pages, 15+ months)
2. CV/Resume
3. Certificates (with CTC stamp)
4. Transcripts
5. Photo (light blue background)
6. Tax clearance (if applicable)

Please provide by: [DATE]

Thank you!
\`\`\`

---

**Type "Phase 1", "Phase 2", etc. for detailed guidance on each phase!**`
  },

  companyDocs: {
    keywords: ['company documents', 'ssm', 'lesen', 'license', 'company docs', 'download company'],
    response: `🏢 **COMPANY DOCUMENTS - READY TO DOWNLOAD**

These documents are ready to send directly to the immigration agency.

---

## 📥 **DOWNLOAD COMPANY DOCUMENTS**

### **1. SSM Registration**
**[SSM_Documents.zip](/api/templates/SSM_Documents.zip)**

- Latest SSM registration (March 2026)
- Contains all company registration details
- **Use:** Send to agency with EP application
- **Valid:** Within 6 months of submission ✅

---

### **2. Company License (Lesen)**
**[Company_License.pdf](/api/templates/Company_License.pdf)**

- Official company business license
- **Use:** Send to agency with EP application
- **Status:** Ready to use ✅

---

### **3. JTKSM Approval**
**[JTKSM_Approval.pdf](/api/templates/JTKSM_Approval.pdf)**

- Previous JTKSM approval letter
- **Use:** Send to agency as reference/supporting document
- **Status:** Ready to use ✅

---

## 📋 **WHAT YOU HAVE**

✅ SSM Copy (March 2026) - Ready to download
✅ Company License - Ready to download
✅ JTKSM Approval - Ready to download

---

## ⬜ **STILL NEED TO REQUEST FROM COO**

Send this to **Syaheedah (COO)** at **syaheedah@pantas.com**:

\`\`\`
Subject: EP Application - Additional Company Documents Required

Dear Syaheedah,

We are proceeding with the EP application and require:

1. Directors' IC/Passport (all in SSM)
2. Employment Contracts + payslips:
   - Management Level: 2 pax + latest 3 months
   - General Worker: 2 pax + latest 3 months
3. Staff Breakdown Confirmation:
   - Top Management: 3 pax
   - Middle Management: 6 pax
   - Entry Level: 23 pax
   - Starting Salary: RM 3,800

Documents needed by: [DATE]

Thank you!
\`\`\`

---

## 📚 **REFERENCE GUIDES** (Not for Agency)

**SOCSO/PERKESO Guidelines:** [SOCSO_Approval_Guide.pdf](/api/templates/SOCSO_Approval_Guide.pdf)
- **Purpose:** Learn how to get job posting up on MyFutureJobs
- **Use:** Reference for applying for approval letter
- **When:** Phase 3 - MyFutureJobs process
- **Note:** This is for YOUR reference, NOT to send to agency

---

## 📄 **EXAMPLES & REFERENCES**

**Filled EP Example:** [Filled_EP_Example.pdf](/api/templates/Filled_EP_Example.pdf)
- Previous approved EP application
- Use as reference for filling forms

**JTKSM Form Example:** [JTKSM_Form_Example.pdf](/api/templates/JTKSM_Form_Example.pdf)
- Filled JTKSM form example
- Use as reference for Phase 4

---

**Type "Phase 1" for complete company documents guide!**
**Type "Phase 3" or "MyFutureJobs" for PERKESO process guide!**
**Type "email template" for request email templates!**`
  },

  phase1: {
    keywords: ['phase 1', 'company documents', 'ssm', 'director ic', 'employment contract'],
    response: `📋 **PHASE 1: COMPANY DOCUMENTS**

**Timeline:** 1-3 days
**Contact:** Syaheedah (COO) - syaheedah@pantas.com

---

## ⏱️ **TIMELINE**

\`\`\`
Day 1        Day 2        Day 3
│            │            │
├─ Email COO ├─ Follow up ├─ Receive docs
│            │            │
└────────────┴────────────┴──→ Complete
\`\`\`

---

## 📥 **DOWNLOAD READY DOCUMENTS**

**Ready to send to agency:**
- **[SSM_Documents.zip](/api/templates/SSM_Documents.zip)** - Latest SSM (Mar 2026)
- **[DBKL_License.pdf](/api/templates/DBKL_License.pdf)** - DBKL license

---

## ⬜ **REQUEST FROM COO**

**Email template** (copy & send):

\`\`\`
Subject: EP Application - Company Documents Required

Dear Syaheedah,

We are proceeding with the EP application for:

Candidate: [NAME]
Position: [POSITION]

Required:
1. Directors' IC/Passport (all in SSM)
2. Employment Contracts + payslips:
   - Management: 2 pax + 3 months
   - General Worker: 2 pax + 3 months
3. Staff Breakdown:
   - Top: 3, Middle: 6, Entry: 23
   - Starting Salary: RM 3,800

Needed by: [DATE]

Thank you!
\`\`\`

---

## ✅ **CHECKLIST**

- [ ] Download SSM documents
- [ ] Download DBKL license
- [ ] Email COO for remaining docs
- [ ] Receive directors' IC
- [ ] Receive employment contracts
- [ ] Receive staff breakdown

---

**⏭️ Next:** Type **"Phase 2"** when ready!`
  },

  phase2: {
    keywords: ['phase 2', 'candidate documents', 'passport', 'cv', 'certificates', 'photo'],
    response: `📋 **PHASE 2: CANDIDATE DOCUMENTS - COMPLETE GUIDE**

---

## 📞 **CONTACT**

**Who:** Candidate directly
**Timeline:** 1-2 weeks

---

## ✅ **DOCUMENTS TO REQUEST**

### **1. Passport Copy (ALL pages)**
- **Requirement:** All pages including blank pages
- **Validity:** Minimum 15 months from intended travel
- **Format:** Clear color scan, PDF
- **Check:** Expiry date - today = 15+ months

### **2. CV/Resume (Updated)**
- **Requirement:** Include all education & experience
- **Format:** PDF preferred
- **Check:** No gaps in employment history

### **3. Educational Certificates**
- **Requirement:** ALL degrees/diplomas
- **CRITICAL:** Must have CTC (Certified True Copy) stamp
- **Where to get CTC:**
  - Original institution
  - Notary public
  - Commissioner of Oaths
- **Format:** Clear color scans, PDF

### **4. Academic Transcripts**
- **Requirement:** Official transcripts from all institutions
- **Format:** Clear color scans, PDF

### **5. Passport Photo**
- **Requirement:** Light blue background (NOT white)
- **Expression:** Neutral (no smiling)
- **Size:** 35mm x 50mm
- **Recent:** Within 3 months
- **Clothing:** White or light-colored

### **6. IRB Tax Clearance (IF APPLICABLE)**
- **Only if:** Candidate previously worked in Malaysia
- **Document:** Latest tax declaration slip (Form BE/B)
- **Not needed:** If first time working in Malaysia

---

## ⚠️ **CRITICAL CHECKS**

Before accepting documents, verify:

✅ **Passport:** Valid 15+ months from today
✅ **Certificates:** Have CTC stamp (reject without!)
✅ **Photo:** Light blue background (not white)
✅ **All scans:** Clear and readable

---

## 📧 **EMAIL TEMPLATE - COPY & SEND**

\`\`\`
Subject: EP Application - Required Documents

Dear [Candidate Name],

Congratulations on your selection for the [POSITION] position!

We are now proceeding with your Employment Pass (EP) application. To complete the application, please provide the following documents:

=== REQUIRED DOCUMENTS ===

1. Passport Copy (ALL pages)
   ✓ All pages including blank pages
   ✓ Clear color scan
   ✓ PDF format
   ✓ Valid 15+ months from today

2. Passport-Sized Photo
   ✓ Light blue background (NOT white)
   ✓ Neutral expression (no smiling)
   ✓ Recent photo (within 3 months)
   ✓ White or light-colored clothing
   ✓ Size: 35mm x 50mm

3. CV/Resume
   ✓ Updated with latest experience
   ✓ Include all educational qualifications
   ✓ PDF format preferred

4. Educational Certificates
   ✓ All degree/diploma certificates
   ✓ MUST have "Certified True Copy" (CTC) stamp
   ✓ Clear color scans
   ✓ PDF format

5. Academic Transcripts
   ✓ Official transcripts from all institutions
   ✓ Clear color scans
   ✓ PDF format

6. IRB Tax Clearance (if applicable)
   ✓ Only if you previously worked in Malaysia
   ✓ Latest tax declaration slip (Form BE/B)

=== IMPORTANT REQUIREMENTS ===

⚠️ Passport Validity: Must be valid for at least 15 months from today
⚠️ CTC Stamps: Certificates without CTC stamp will be rejected
⚠️ Photo Background: Must be light blue (not white)

=== SUBMISSION ===

Please provide all documents by: [DATE]
Format: PDF via email
Subject line: "EP Documents - [YOUR NAME]"

=== NEXT STEPS ===

Once we receive your documents:
1. We'll verify all documents meet requirements
2. Submit MyFutureJobs application (14 days processing)
3. Generate and submit JTKSM forms
4. Submit EP application (4-6 weeks processing)

Total estimated processing time: 6-8 weeks

=== QUESTIONS? ===

If you have any questions or need clarification on any of these requirements, please don't hesitate to contact me.

We look forward to receiving your documents soon.

Best regards,
[YOUR NAME]
[YOUR POSITION]
[YOUR CONTACT]
\`\`\`

---

## 💬 **WHATSAPP/SLACK VERSION (CASUAL)**

\`\`\`
Hi [Candidate Name]! 👋

Congratulations again on the [POSITION] role!

We're starting your EP (Employment Pass) application. Here's what we need:

📄 REQUIRED DOCUMENTS:

1️⃣ Passport Copy (ALL pages - including blank)
2️⃣ Passport Photo (light blue background, neutral expression)
3️⃣ CV/Resume (updated)
4️⃣ Educational Certificates (with CTC stamp*)
5️⃣ Academic Transcripts
6️⃣ Tax Clearance (only if worked in Malaysia before)

⚠️ IMPORTANT:
• Passport must be valid 15+ months
• Certificates NEED "Certified True Copy" (CTC) stamp
• Photo: light blue background (not white!)

⏰ DEADLINE: [DATE]

📧 Send as PDF to: [YOUR EMAIL]
Subject: "EP Documents - [YOUR NAME]"

❓ QUESTIONS:
Not sure where to get CTC stamp? Passport photo requirements? Just ask!

Total processing time: 6-8 weeks

I'll send you a detailed email with full requirements. Let me know if you have any questions!

Thanks! 🙏
\`\`\`

---

## ✅ **CHECKLIST**

- [ ] Email/message sent to candidate
- [ ] Passport received (check 15+ months!)
- [ ] CV received
- [ ] Certificates received (check CTC stamps!)
- [ ] Transcripts received
- [ ] Photo received (check light blue background!)
- [ ] Tax clearance received (if applicable)

---

## ⏭️ **NEXT: Phase 3**

Once you have all candidate documents, type **"Phase 3"** or **"MyFutureJobs"** for the PERKESO application guide!

---

**Need help? Ask me about CTC stamps, photo requirements, or any document issues!**`
  },

  phase3: {
    keywords: ['phase 3', 'myfuturejobs', 'perkeso', 'socso', 'job posting', 'interview'],
    response: `📋 **PHASE 3: MYFUTUREJOBS (PERKESO) - STEP-BY-STEP GUIDE**

---

## 📞 **PORTAL & TIMELINE**

**Portal:** https://www.perkeso.gov.my/
**Duration:** 2-3 weeks total
- Job posting: 14 days minimum
- Approval: 5-7 working days after submission

---

## 🎯 **SELECT YOUR STEP**

Type the step number to get detailed guidance:

\`\`\`
Step 1  →  Step 2  →  Step 3  →  Step 4  →  Step 5
Account     Job        Interview  Upload    Submit
Setup       Posting               Template  & Approve
\`\`\`

---

## ✅ **QUICK OVERVIEW**

| Step | Action | Duration |
|------|--------|----------|
| **Step 1** | Create MyFutureJobs account | 1 day |
| **Step 2** | Post job advertisement | 1-2 days |
| **Step 3** | Interview period (min 14 days) | 2 weeks |
| **Step 4** | Download & fill interview template | 1 day |
| **Step 5** | Submit & get approval | 5-7 days |

---

## 📥 **DOWNLOAD INTERVIEW TEMPLATE**

**Available formats:**
- [📊 Download CSV Template](/api/myfuturejobs/template/csv) - Excel/Google Sheets
- [📈 Download XLSX Template](/api/myfuturejobs/template/xlsx) - Excel format

**After filling, upload to bot:**
- Drag & drop your filled CSV/XLSX file
- Bot will auto-generate the official form

---

## 📧 **NEED COMPANY DETAILS?**

Before starting, you may need info from COO:

\`\`\`
Subject: MyFutureJobs Application - Company Details Required

Dear Syaheedah,

We are proceeding with the MyFutureJobs application for Sustainability Data Analyst and require:

1. Company SSM Registration Number
2. Company Code (if applicable)
3. Company Phone Number
4. Company Email
5. Staff breakdown confirmation (Top: 3, Middle: 6, Entry: 23)
6. Starting salary: RM 3,800

Needed by: [DATE]

Thank you!
\`\`\`

---

## ⏭️ **NEXT STEPS**

**Type "Step 1"** to begin the account setup process!

**Need help?** Ask about any specific step or type "interview template" for form guidance.`
  },

  // Step 1: MyFutureJobs Account Setup
  step1: {
    keywords: ['step 1', 'step1', 'create account', 'account setup', 'register myfuturejobs'],
    response: `📋 **STEP 1: CREATE MYFUTUREJOBS ACCOUNT**

---

## 🎯 **OBJECTIVE**

Register your company account on the MyFutureJobs (PERKESO) portal.

**Duration:** 1 day
**Portal:** https://www.perkeso.gov.my/

---

## ✅ **REGISTRATION STEPS**

### **1. Visit the Registration Page**

Go to: https://www.perkeso.gov.my/pengiklanan-myfuturejobs-bagi-penggajian-pegawai-dagang.html

---

### **2. Prepare Required Documents**

Before registering, have these ready:
- [ ] Company SSM Registration Number
- [ ] Company Code (if applicable)
- [ ] Company Phone Number
- [ ] Company Email (official)
- [ ] SOCSO Registration Number
- [ ] Authorized person's IC (for verification)

---

### **3. Fill Registration Form**

**Company Information:**
\`\`\`
Company Name: Pantas Climate Solutions
SSM Number: [From SSM documents]
Company Code: [From COO, if applicable]
Phone: [From COO]
Email: [Official company email]
SOCSO Number: [From COO/HR]
\`\`\`

**Authorized Person:**
\`\`\`
Name: [COO or HR Manager]
IC Number: [IC of authorized person]
Position: [Position in company]
Phone: [Direct contact]
Email: [Direct email]
\`\`\`

---

### **4. Submit & Verify**

1. Submit registration form
2. Wait for email verification (usually within 24 hours)
3. Login credentials will be sent via email
4. Test login to ensure access

---

## 📧 **EMAIL TO COO FOR DETAILS**

\`\`\`
Subject: MyFutureJobs Registration - Company Details Required

Dear Syaheedah,

I need the following company details to register for MyFutureJobs:

1. Company SSM Registration Number
2. Company Code (if applicable)
3. SOCSO Registration Number
4. Official company phone & email
5. Your IC number (for authorized person verification)

Needed by: [DATE]

Thank you!
\`\`\`

---

## ✅ **CHECKLIST**

- [ ] All company details collected
- [ ] Registration form submitted
- [ ] Email verification received
- [ ] Login credentials obtained
- [ ] Test login successful

---

## ⏭️ **NEXT STEP**

After successful registration, type **"Step 2"** to proceed with job posting!

---

**Need help?** Ask me for company details or registration issues.`
  },

  // Step 2: Job Posting
  step2: {
    keywords: ['step 2', 'step2', 'job posting', 'post job', 'create job'],
    response: `📋 **STEP 2: CREATE JOB POSTING**

---

## 🎯 **OBJECTIVE**

Create and submit the job advertisement for Sustainability Data Analyst.

**Duration:** 1-2 days
**Portal:** MyFutureJobs (after login)

---

## ✅ **JOB POSTING DETAILS**

### **Position Information**

\`\`\`
Position Title: Sustainability Data Analyst
Employment Type: Full-time
Location: [City, Malaysia]
Salary Range: RM 3,800 - RM [X,XXX]
\`\`\`

---

### **Job Description**

\`\`\`
Key Responsibilities:
• Develop and maintain data pipelines for sustainability metrics
• Analyze large datasets to identify trends and insights
• Create dashboards and reports for stakeholders
• Work with cross-functional teams to implement data-driven solutions
• Collaborate with engineering teams on data infrastructure
• Support ESG reporting and carbon accounting initiatives
\`\`\`

---

### **Requirements**

\`\`\`
Education:
• Bachelor's degree in Computer Science, Data Science, Statistics, or related field

Experience:
• 3+ years of experience in data analysis or related role
• Proven track record with large-scale data projects

Technical Skills:
• Proficiency in SQL and database querying
• Python programming for data analysis
• Data visualization tools (Power BI, Tableau, or similar)
• Experience with cloud platforms (AWS, GCP, Azure)

Soft Skills:
• Strong analytical and problem-solving abilities
• Excellent communication in Bahasa Malaysia and English
• Ability to present complex data to non-technical stakeholders
\`\`\`

---

### **Company Information**

\`\`\`
Company: Pantas Climate Solutions
Industry: Climate Tech / Sustainability
Local Staff: 32 employees
  - Top Management: 3
  - Middle Management: 6
  - Entry Level: 23
Starting Salary: RM 3,800
\`\`\`

---

## ✅ **SUBMISSION STEPS**

1. Login to MyFutureJobs portal
2. Click "Create New Job Posting"
3. Fill in all fields with above information
4. Review for accuracy
5. Submit for approval
6. Note the job posting reference number

---

## ⏱️ **TIMELINE**

\`\`\`
Day 1        Day 2         Day 3-16
│            │             │
├─ Create    ├─ Submit     ├─ Interview
│  posting   │  for        │  Period
│            │  approval    │  (14 days min)
│            │             │
└────────────┴─────────────┴──→ Complete
\`\`\`

---

## ✅ **CHECKLIST**

- [ ] Job description finalized
- [ ] Requirements clearly stated
- [ ] Salary range competitive
- [ ] All company info accurate
- [ ] Job posting submitted
- [ ] Reference number saved
- [ ] Approval received (1-2 days)

---

## ⏭️ **NEXT STEP**

After job posting approval, type **"Step 3"** to begin the interview period!

---

**Need help?** Ask me to adjust the job description or requirements.`
  },

  // Step 3: Interview Period
  step3: {
    keywords: ['step 3', 'step3', 'interview period', 'schedule interviews', 'conduct interviews'],
    response: `📋 **STEP 3: INTERVIEW PERIOD (14 DAYS MINIMUM)**

---

## 🎯 **OBJECTIVE**

Conduct interviews with all candidates during the mandatory 14-day period.

**Duration:** Minimum 14 days
**Requirement:** All candidates must be interviewed and documented

---

## ✅ **INTERVIEW GUIDELINES**

### **During the 14-Day Period**

1. **Schedule Interviews**
   - Contact shortlisted candidates
   - Arrange interview slots (online or in-person)
   - Send calendar invites with details

2. **Conduct Interviews**
   - Use standardized interview questions
   - Assess technical skills (SQL, Python, Power BI)
   - Evaluate communication skills
   - Check cultural fit

3. **Document Everything**
   - Record interview date & time
   - Note candidate's IC/Passport number
   - Document decision (Berjaya/Tidak Berjaya)
   - Write specific rejection reasons

---

## 📊 **TRACKING TEMPLATE**

**Download and track interviews:**
- [📊 CSV Template](/api/myfuturejobs/template/csv) - Excel/Google Sheets
- [📈 XLSX Template](/api/myfuturejobs/template/xlsx) - Excel format

**Columns to track:**
| Column | Description |
|--------|-------------|
| BIL | Sequential number (1, 2, 3...) |
| IC/Passport | Candidate's ID number |
| Name | Full name |
| Phone | Contact number |
| Email | Email address |
| Gender | Lelaki/Perempuan |
| Education | Highest qualification |
| Decision | Berjaya/Tidak Berjaya |
| Reason | Specific rejection reason |

---

## 📝 **REJECTION REASONS EXAMPLES**

Use these specific reasons (customize as needed):

- "Lacks practical experience in SQL and Power BI; does not meet core technical requirements"
- "Insufficient years of experience (requires 3+ years, candidate has 1 year)"
- "Does not meet educational requirements (no relevant degree)"
- "Selected another offer with better compensation"
- "Unable to relocate to job location"
- "Salary expectations exceed budget (RM 5,000 vs RM 3,800)"
- "Weak communication skills in Bahasa Malaysia"

---

## ✅ **CHECKLIST**

- [ ] Interview schedule created
- [ ] Candidates contacted
- [ ] Interviews conducted (min 14 days)
- [ ] All decisions documented
- [ ] Rejection reasons specific and clear
- [ ] Template file filled with all candidates

---

## 📤 **AFTER INTERVIEWS**

**Once all interviews are complete:**

1. Fill the CSV/XLSX template with all candidate data
2. Upload the filled file to this bot
3. Bot will auto-generate the official Interview Assessment Form
4. Download and review the generated form
5. Proceed to Step 5 for submission

**To upload:** Drag & drop your filled CSV/XLSX file into the chat!

---

## ⏭️ **NEXT STEP**

After filling the interview template, type **"Step 4"** to generate the official form!

---

**Need help?** Upload your filled template or ask about rejection reasons.`
  },

  // Step 4: Upload Template & Generate Form
  step4: {
    keywords: ['step 4', 'step4', 'upload template', 'fill template', 'generate form'],
    response: `📋 **STEP 4: UPLOAD FILLED TEMPLATE & GENERATE FORM**

---

## 🎯 **OBJECTIVE**

Upload your filled interview template (CSV/XLSX) and let the bot auto-generate the official Interview Assessment Form.

**Duration:** 1 day
**What you need:** Filled CSV or XLSX template with all candidate data

---

## 📤 **HOW TO UPLOAD**

### **Option 1: Drag & Drop**
1. Open your filled CSV/XLSX file
2. Drag it directly into this chat window
3. Bot will process and generate the form

### **Option 2: Click to Upload**
1. Click the 📎 paperclip icon
2. Select your filled CSV/XLSX file
3. Bot will process and generate the form

---

## ✅ **WHAT THE BOT DOES**

After you upload the file:

1. **Parses** your CSV/XLSX file
2. **Extracts** all candidate information
3. **Generates** the official "Laporan Pengambilan Pekerja Tempatan" form
4. **Formats** it according to MyFutureJobs requirements
5. **Provides** download link for the generated form

---

## 📄 **GENERATED FORM INCLUDES**

**Section A-F: Job Details**
- Position: Sustainability Data Analyst
- Company: Pantas Climate Solutions
- SSM Number, Company Code, Phone, Email
- Interview dates, location, job posting link

**Candidate Table:**
- All candidates from your uploaded file
- Properly formatted with IC, name, contact, education
- Decisions (Berjaya/Tidak Berjaya)
- Rejection reasons

**Employer Declaration:**
- Ready for COO signature
- Company stamp area
- Date of submission

---

## ✅ **CHECKLIST**

- [ ] CSV/XLSX template filled with all candidates
- [ ] All required columns completed
- [ ] Decisions recorded for each candidate
- [ ] Rejection reasons specific and clear
- [ ] File uploaded to bot
- [ ] Generated form downloaded
- [ ] Form reviewed for accuracy

---

## ⚠️ **BEFORE SUBMITTING**

**Verify the generated form:**
- [ ] All candidate names spelled correctly
- [ ] IC/Passport numbers accurate
- [ ] Contact information correct
- [ ] Education details match
- [ ] Rejection reasons appropriate
- [ ] Company details accurate

**After verification:**
- [ ] Print form for COO signature
- [ ] Apply company stamp
- [ ] Scan signed form (if submitting digitally)

---

## ⏭️ **NEXT STEP**

After form is signed and stamped, type **"Step 5"** to proceed with submission!

---

**Ready to upload?** Drag & drop your filled CSV/XLSX file now!`
  },

  // Step 5: Submit & Get Approval
  step5: {
    keywords: ['step 5', 'step5', 'submit', 'approval', 'final step'],
    response: `📋 **STEP 5: SUBMIT & RECEIVE APPROVAL**

---

## 🎯 **OBJECTIVE**

Submit the completed Interview Assessment Form and receive MyFutureJobs approval.

**Duration:** 5-7 working days
**Portal:** MyFutureJobs (PERKESO)

---

## ✅ **SUBMISSION CHECKLIST**

**Before submitting, ensure you have:**
- [ ] Interview Assessment Form (generated from Step 4)
- [ ] Form signed by COO
- [ ] Company stamp applied
- [ ] All candidate interview records
- [ ] Job posting reference number
- [ ] MyFutureJobs login credentials

---

## 📤 **SUBMISSION STEPS**

### **1. Login to MyFutureJobs Portal**

Visit: https://www.perkeso.gov.my/
Login with your registered credentials

---

### **2. Navigate to Assessment Submission**

- Go to "My Applications" or "Job Postings"
- Find your Sustainability Data Analyst posting
- Click "Submit Interview Assessment" or similar

---

### **3. Upload Required Documents**

**Upload the following:**
- Interview Assessment Form (signed & stamped)
- Any additional supporting documents if required

---

### **4. Enter Candidate Summary**

**Input summary data:**
- Total candidates interviewed: [X]
- Selected: [X] (usually 1 for EP)
- Not Selected: [X]

---

### **5. Submit & Confirm**

- Review all information
- Confirm submission
- Save reference/confirmation number

---

## ⏱️ **PROCESSING TIMELINE**

\`\`\`
Submission    Review      Approval
Day 1         Days 2-6    Day 7
│             │           │
├─ Submit     ├─ PERKESO  ├─ Download
│  form       │  reviews  │  approval
│             │           │
└─────────────┴───────────┴──→ Complete
\`\`\`

---

## 📥 **AFTER APPROVAL**

**Once approved (5-7 working days):**

1. **Download Approval Letter**
   - Login to MyFutureJobs portal
   - Go to "My Applications"
   - Download approval letter (PDF)
   - Save multiple copies

2. **Save for Next Phase**
   - This approval is required for Phase 4 (JTKSM)
   - Keep digital and printed copies
   - Note the approval reference number

---

## ✅ **CHECKLIST**

- [ ] Form submitted via portal
- [ ] Reference number saved
- [ ] Approval letter received (5-7 days)
- [ ] Copies saved (digital + printed)
- [ ] Ready for Phase 4 (JTKSM)

---

## 🎉 **CONGRATULATIONS!**

You've completed Phase 3 - MyFutureJobs!

**Next:** Type **"Phase 4"** or **"JTKSM"** to proceed with the JTKSM application!

---

**Need help?** Ask about submission issues or approval tracking.`
  },

  phase4: {
    keywords: ['phase 4', 'jtksm', 'laporan pengambilan', 'jtksm report'],
    response: `📋 **PHASE 4: JTKSM APPLICATION - COMPLETE GUIDE**

---

## 📥 **DOWNLOAD WORD TEMPLATE**

**[JTKSM_Template.docx](/api/templates/JTKSM_Template.docx)**

Download this Word file and fill in:
- Company details (Sections A-F)
- Candidate table (Section C)
- Employer declaration (Section D)

---

## 📞 **OVERVIEW**

**Submit:** JTKSM Laporan Pengambilan
**Timeline:** 1 week
**Purpose:** Report to PERKESO on local hiring efforts

---

## ✅ **DOCUMENTS NEEDED**

Before filling the JTKSM form, ensure you have:

- [ ] All Phase 1 documents (Company)
- [ ] All Phase 2 documents (Candidate)
- [ ] MyFutureJobs Approval Letter (Phase 3)

---

## 📄 **HOW TO FILL THE FORM**

### **Section A: Job Information**
- A. Nama Jawatan: Sustainability Data Analyst
- B. Nama Majikan: Pantas Climate Solutions
- C. No Pendaftaran Syarikat: [From SSM]
- D. No Kod Majikan: [From COO]
- E. No Telefon Majikan: [From COO]
- F. Emel Majikan: [From COO]

### **Section B: Interview Details**
- G. Tarikh & Masa Temuduga: [Your interview dates]
- H. Lokasi Temuduga: [Online/In-person]
- I. Pautan Pengiklanan: [MyFutureJobs job link]

### **Section C: Candidate Table**

| BIL | IC/Passport | Nama | Telefon | Emel | Jantina | Pendidikan | Keputusan | Ulasan |
|-----|-------------|------|---------|------|---------|------------|-----------|--------|
| 1   | [Number]    | [Name] | [Phone] | [Email] | [M/F] | [Education] | [Berjaya/Tidak] | [Reason] |

**Example rejection reasons:**
- "Lacks practical experience in SQL and Power BI"
- "Insufficient years of experience (requires 3+ years)"
- "Does not meet educational requirements"

### **Section D: Employer Declaration**
- Signed by COO
- Company stamp applied
- Date of submission

---

## ✅ **CHECKLIST**

- [ ] Download JTKSM_Template.docx
- [ ] Fill company details (Sections A-F)
- [ ] Fill candidate table with all interviewed candidates
- [ ] MyFutureJobs approval attached
- [ ] Company documents attached
- [ ] Form signed by COO
- [ ] Company stamp applied
- [ ] Application submitted

---

## ⏭️ **NEXT: Phase 5**

After JTKSM submission, type **"Phase 5"** or **"EP application"** for the final EP application guide!

---

**Need help? Ask me for specific field guidance!**`
  },

  phase5: {
    keywords: ['phase 5', 'ep application', 'mdec', 'esd', 'gp checklist'],
    response: `📋 **PHASE 5: EP APPLICATION (MDEC/ESD) - COMPLETE GUIDE**

---

## 📥 **DOWNLOAD WORD TEMPLATE**

**[GP_Checklist_Template.docx](/api/templates/GP_Checklist_Template.docx)**

Download this Word file and fill in:
- Candidate information
- Document verification checklist
- Company documents checklist
- Employer declaration

---

## 📞 **PORTAL & TIMELINE**

**Portal:** https://esd.imi.gov.my/
**Processing Time:** 4-6 weeks
**Application Type:** New Employment Pass

---

## ✅ **DOCUMENTS NEEDED**

### **From Previous Phases:**
- [ ] All Phase 1 documents (Company)
- [ ] All Phase 2 documents (Candidate)
- [ ] MyFutureJobs Approval Letter (Phase 3)
- [ ] JTKSM Laporan Pengambilan (Phase 4)

---

## 📄 **HOW TO FILL THE GP CHECKLIST**

### **Section 1: Candidate Information**
- Full Name
- Nationality
- Passport Number & Expiry
- Position
- Salary

### **Section 2: Document Verification**
Check off each document:
- ✓ Passport Copy (All Pages)
- ✓ Educational Certificates (CTC stamped)
- ✓ Academic Transcripts
- ✓ CV/Resume
- ✓ Passport Photo (Light blue background)
- ✓ Tax Clearance (if applicable)

### **Section 3: Company Documents**
- ✓ SSM Copy (Latest)
- ✓ Directors' IC
- ✓ Employment Contracts (2 Mgmt + 2 Worker)
- ✓ Payslips (3 months)
- ✓ Staff Breakdown
- ✓ MyFutureJobs Approval
- ✓ JTKSM Report

### **Section 4: Declaration**
- Signed by COO
- Company stamp applied
- Date of submission

---

## 📧 **AGENCY SUBMISSION EMAIL**

When submitting to immigration agency:

\`\`\`
Subject: EP Application Documents - [CANDIDATE NAME]

Dear [Agency Contact],

Please find attached the complete document package:

CANDIDATE:
Name: [CANDIDATE NAME]
Nationality: [NATIONALITY]
Passport: [NUMBER]
Position: Sustainability Data Analyst

ATTACHED:
1. JTKSM Laporan Pengambilan
2. GP Checklist (Completed)
3. MyFutureJobs Approval Letter
4. Passport Copy (All Pages)
5. Educational Certificates (CTC)
6. CV/Resume
7. Passport Photo
8. Job Description
9. Company SSM
10. Local Staff Documentation

COMPLIANCE:
✓ All documents verified
✓ Passport valid 15+ months
✓ Certificates CTC stamped
✓ Photo light blue background

Please review and let us know if additional information is needed.

Thank you!

Best regards,
[YOUR NAME]
\`\`\`

---

## 📊 **TRACKING**

After submission:

1. **Application Reference Number:** Will be provided by ESD
2. **Track Status:** Via ESD Online portal
3. **Expected Decision:** 4-6 weeks
4. **Upon Approval:** Collect e-EP or EP sticker

---

## ✅ **CHECKLIST**

- [ ] Download GP_Checklist_Template.docx
- [ ] Fill candidate information
- [ ] Check off all documents
- [ ] GP Checklist signed by COO
- [ ] All documents compiled
- [ ] Application submitted via ESD portal
- [ ] Reference number received
- [ ] Application fee paid
- [ ] Status tracked weekly
- [ ] Approval received
- [ ] EP sticker/e-EP collected

---

## 🎉 **COMPLETION!**

Once EP is approved:

1. Notify candidate
2. Arrange onboarding
3. Keep copies of all documents
4. Update company records

---

**Need help? Ask me about tracking, document verification, or any submission issues!**`
  },

  interview: {
    keywords: ['interview', 'interview template', 'assessment form', 'interview assessment'],
    response: `📋 **INTERVIEW ASSESSMENT TEMPLATE - COMPLETE GUIDE**

---

## 📄 **SECTION 1: JOB DETAILS** (Stays same for all candidates)

\`\`\`
LAPORAN PENGAMBILAN PEKERJA TEMPATAN

Nota: Laporan ini perlu dihantar selepas tamat tempoh pengiklanan minimum 14 hari

A. Nama Jawatan: Sustainability Data Analyst
B. Nama Majikan: Pantas Climate Solutions
C. No Pendaftaran Syarikat: [From SSM]
D. No Kod Majikan: [From COO]
E. No Telefon Majikan: [From COO]
F. Emel Majikan: [From COO]
G. Tarikh & Masa Temuduga: [Your interview dates]
H. Lokasi Temuduga: [Online/In-person]
I. Pautan Pengiklanan: [MyFutureJobs job link]
\`\`\`

---

## 📄 **SECTION 2: CANDIDATE TABLE** (Edit per candidate)

\`\`\`
| BIL | No Kad Pengenalan | Nama Calon | No Telefon | Emel | Jantina | Pendidikan | Keputusan | Ulasan |
|-----|-------------------|------------|------------|------|---------|------------|-----------|--------|
| 1   | [IC/Passport No]  | [Full Name] | [Phone]   | [Email] | [L/P] | [Education] | [Berjaya/Tidak] | [Reason] |
| 2   | ...               | ...         | ...        | ...   | ...     | ...        | ...       | ...    |
\`\`\`

**Add pages if more than 10 candidates**

---

## 📄 **SECTION 3: EMPLOYER DECLARATION**

\`\`\`
PENGESAHAN MAJIKAN

Saya membuat akuan ini dengan kepercayaan bahawa apa-apa yang tersebut di dalamnya adalah benar dan betul.
Saya sesungguhnya faham sekiranya apa-apa maklumat yang saya berikan atau pengesahan akuan ini adalah
tidak benar, tidak betul atau palsu, boleh menyebabkan kelewatan permohonan ini diproses atau permohonan
boleh ditolak.

TANDATANGAN: _________________

Nama: [COO Name]
Jawatan: [COO Position]
Tarikh: [Date of submission]

Cop Syarikat
\`\`\`

---

## ✅ **EXAMPLE FILLED ENTRY**

| BIL | No Kad Pengenalan | Nama | Telefon | Emel | Jantina | Pendidikan | Keputusan | Ulasan |
|-----|-------------------|------|---------|------|---------|------------|-----------|--------|
| 1   | 900515-01-1234 | Ahmad bin Abdullah | +60 12-345-6789 | ahmad@email.com | Lelaki | Bachelor Computer Science - UM | Tidak Berjaya | Lacks practical experience in SQL and Power BI |
| 2   | 920832-02-5678 | Siti binti Hassan | +60 19-876-5432 | siti@email.com | Perempuan | Master Data Science - UKM | Berjaya | Meets all requirements |

---

## 📧 **REJECTION REASONS EXAMPLES**

Use these in the "Ulasan" column:

- "Lacks practical experience in SQL and Power BI; does not meet core technical requirements"
- "Insufficient years of experience (requires 3+ years)"
- "Does not meet educational requirements"
- "Selected another offer"
- "Salary expectations exceed budget"
- "Unable to relocate to job location"

---

## 💬 **HOW TO GET HELP FILLING THIS FORM**

After interviews, tell me:

\`\`\`
I have interviewed [X] candidates for Sustainability Data Analyst.

Candidate 1: [Name], [IC], [Phone], [Email], [Gender], [Education], [Decision], [Reason]
Candidate 2: [Name], [IC], [Phone], [Email], [Gender], [Education], [Decision], [Reason]

Job details:
- Interview dates: [Dates]
- Location: [Online/In-person]
- MyFutureJobs link: [URL]
\`\`\`

I'll format it for the form!

---

## ✅ **CHECKLIST**

- [ ] Section 1 filled (job details)
- [ ] All candidates listed in Section 2
- [ ] Decision recorded (Berjaya/Tidak Berjaya)
- [ ] Rejection reasons provided
- [ ] Section 3 signed by COO
- [ ] Company stamp applied
- [ ] Submitted via MyFutureJobs platform

---

**Need help? Give me candidate details and I'll format the form for you!**`
  },

  emailTemplate: {
    keywords: ['email template', 'template for', 'how to request', 'request email', 'slack message', 'slack template'],
    response: `📧 **ALL EMAIL & SLACK TEMPLATES**

All templates are displayed below - copy, paste, and send!

---

## **1. REQUEST FROM COO (SYAAHEDAH)**

**Email:** syaheedah@pantas.com

### 📧 EMAIL FORMAT (FORMAL)

\`\`\`
Subject: EP Application - Company Documents Required

Dear Syaheedah,

I hope this email finds you well.

We are proceeding with the Employment Pass (EP) application for:

Candidate: [CANDIDATE NAME]
Position: [POSITION]
Nationality: [NATIONALITY]

Required Company Documents:

1. Latest SSM Copy (printing date within 6 months)
2. Directors' IC/Passport (all in SSM)
3. Employment Contracts + payslips:
   - Management Level: 2 pax + latest 3 months
   - General Worker: 2 pax + latest 3 months
4. Staff Breakdown Confirmation:
   - Top Management: 3 pax
   - Middle Management: 6 pax
   - Entry Level: 23 pax
   - Starting Salary: RM 3,800

Documents needed by: [DATE]

Please let me know if you need any clarification.

Thank you for your support.

Best regards,
[YOUR NAME]
\`\`\`

### 💬 SLACK FORMAT (CASUAL)

\`\`\`
Hi @syaheedah! 👋

We're starting an EP application and need company documents:

📄 NEEDED:
• Latest SSM Copy (within 6 months)
• Directors' IC/Passport (all in SSM)
• Employment Contracts + payslips (2 Mgmt + 2 Worker)
• Staff Breakdown (Top: 3, Middle: 6, Entry: 23)

⏰ Need by: [DATE]

📧 Should I send a formal email with full details?

Note: Employment contracts will be sent directly to immigration agency.

Thanks! 🙏
\`\`\`

---

## **2. REQUEST JOB DESCRIPTION FROM HIRING MANAGER**

### 📧 EMAIL FORMAT

\`\`\`
Subject: Job Description Required - [POSITION]

Dear [Hiring Manager Name],

We are preparing the EP application for [CANDIDATE NAME] and require the finalized job description.

Please include:
1. Key responsibilities
2. Reporting line
3. Required qualifications
4. Technical skills
5. Location

Deadline: [DATE]

Thank you!

Best regards,
[YOUR NAME]
\`\`\`

### 💬 SLACK FORMAT

\`\`\`
Hi [Name]! 👋

Quick request for the EP application.

📋 NEED: Job Description for [POSITION]

Can you share the finalized JD? We need:
• Key responsibilities
• Reporting line
• Required qualifications
• Technical skills
• Location

⏰ DEADLINE: [DATE]

Do you have an existing template, or should I send one?

Thanks! 🙏
\`\`\`

---

## **3. REQUEST FROM CANDIDATE**

### 📧 EMAIL FORMAT

\`\`\`
Subject: EP Application - Required Documents

Dear [Candidate Name],

Congratulations on your selection!

Required Documents:

1. Passport Copy (ALL pages, valid 15+ months)
2. CV/Resume (updated)
3. Educational Certificates (with CTC stamp)
4. Academic Transcripts
5. Passport Photo (light blue background)
6. Tax Clearance (if worked in Malaysia before)

Please provide by: [DATE]

Thank you!

Best regards,
[YOUR NAME]
\`\`\`

### 💬 WHATSAPP FORMAT

\`\`\`
Hi [Name]! 👋

Congratulations again on the [POSITION] role!

We're starting your EP application. Here's what we need:

📄 REQUIRED:
1️⃣ Passport (all pages, 15+ months)
2️⃣ CV/Resume
3️⃣ Certificates (with CTC stamp)
4️⃣ Transcripts
5️⃣ Photo (light blue background)
6️⃣ Tax clearance (if worked in MY before)

⏰ DEADLINE: [DATE]

📧 Send to: [YOUR EMAIL]

Questions? Just ask!

Thanks! 🙏
\`\`\`

---

## **4. "NOT SURE WHERE TO FIND" - HELP REQUEST**

### 📧 EMAIL TO HR TEAM

\`\`\`
Subject: Question: Document Location for EP Application

Dear [Name],

I'm processing an EP application and need guidance on document locations.

DOCUMENTS I'M LOOKING FOR:
1. [Document 1]
2. [Document 2]

WHAT I'VE CHECKED:
□ 02_Templates/ folder
□ 03_Company_Documents/ folder
□ Legal Company Documentation/ folder

QUESTIONS:
1. Where are latest company documents stored?
2. Who should I contact for [document]?
3. Any previous EP applications as reference?

TIMELINE:
• Target submission: [DATE]
• Need documents by: [DATE]

Any guidance appreciated!

Best regards,
[YOUR NAME]
\`\`\`

### 💬 SLACK TO #HR-TEAM

\`\`\`
Hi team! 👋

Quick question about document locations.

🔍 LOOKING FOR:
• [Specific document]

✅ ALREADY CHECKED:
• 02_Templates/
• 03_Company_Documents/
• Legal Company Documentation/

❓ QUESTIONS:
1. Where are latest docs stored?
2. Who to contact for [document]?
3. Previous EP apps as reference?

⏰ Need by: [DATE]

Any help appreciated! Thanks! 🙏
\`\`\`

---

## **5. FOLLOW-UP ON PENDING DOCUMENTS**

### 📧 EMAIL FORMAT

\`\`\`
Subject: REMINDER: Pending Documents - EP Application

Dear [Name],

Friendly reminder about pending documents:

PENDING:
□ [Document 1]
□ [Document 2]

ORIGINAL DEADLINE: [DATE]
NEW DEADLINE: [NEW DATE]

IMPACT:
Can't proceed with [JTKSM/MyFutureJobs/EP] submission.

Please provide by [NEW DATE].

Thank you!

Best regards,
[YOUR NAME]
\`\`\`

### 💬 SLACK FORMAT

\`\`\`
Hi [Name]! 👋

Friendly reminder about pending documents:

⏳ STILL NEEDED:
• [Document 1]
• [Document 2]

📅 NEW DEADLINE: [DATE]

⚠️ Can't proceed with submission until we have these.

Can you help expedite?

Thanks! 🙏
\`\`\`

---

## **6. AGENCY SUBMISSION**

### 📧 EMAIL TO IMMIGRATION AGENCY

\`\`\`
Subject: EP Application Documents - [CANDIDATE NAME]

Dear [Agency Contact],

Please find attached the complete document package:

CANDIDATE:
Name: [CANDIDATE NAME]
Nationality: [NATIONALITY]
Passport: [NUMBER]
Position: Sustainability Data Analyst

ATTACHED:
1. JTKSM Laporan Pengambilan
2. GP Checklist
3. MyFutureJobs Approval Letter
4. Passport Copy (All Pages)
5. Educational Certificates (CTC)
6. CV/Resume
7. Passport Photo
8. Job Description
9. Company SSM
10. Local Staff Documentation

COMPLIANCE:
✓ All documents verified
✓ Passport valid 15+ months
✓ Certificates CTC stamped
✓ Photo light blue background

Please review and let us know if additional information is needed.

Thank you!

Best regards,
[YOUR NAME]
\`\`\`

---

**All templates ready to copy & send! Type "Phase 1", "Phase 2", etc. for phase-specific guidance!**`
  },

  notSureWhereToFind: {
    keywords: ['not sure where', 'where to find', 'cannot find', 'help request', 'looking for document', 'need help finding'],
    response: `🔍 **NOT SURE WHERE TO FIND DOCUMENTS?**

Here are ready-to-send help request templates:

---

## 📧 **EMAIL TO HR TEAM**

\`\`\`
Subject: Question: Document Location for EP Application

Dear [Name],

I hope this email finds you well.

I'm processing an EP application for [CANDIDATE NAME] ([POSITION]) and need guidance on document locations.

=== DOCUMENTS I'M LOOKING FOR ===

1. [Document 1 - e.g., Latest SSM Copy]
2. [Document 2 - e.g., Previous EP approval letters]
3. [Document 3 - e.g., MyFutureJobs approval from last application]

=== WHAT I'VE CHECKED ===

□ 02_Templates/ folder
□ 03_Company_Documents/ folder
□ Legal Company Documentation/ folder
□ Previous EP application files

=== SPECIFIC QUESTIONS ===

1. Where are the latest company documents stored?
2. Who should I contact for [specific document]?
3. Are there any previous EP applications I can use as reference?
4. Is there a shared drive/folder for all EP-related documents?

=== TIMELINE ===

Target submission date: [DATE]
Need documents by: [DATE]

Any guidance you can provide would be greatly appreciated. If there's a specific person I should contact, please let me know.

Thank you for your help.

Best regards,
[YOUR NAME]
[YOUR POSITION]
[YOUR CONTACT]
\`\`\`

---

## 💬 **SLACK TO #HR-TEAM**

\`\`\`
Hi team! 👋

Quick question about document locations for an EP application I'm processing.

🔍 LOOKING FOR:
• [Document 1 - e.g., Latest SSM]
• [Document 2 - e.g., Previous EP approvals]
• [Document 3]

✅ ALREADY CHECKED:
• 02_Templates/ folder
• 03_Company_Documents/ folder
• Legal Company Documentation/ folder

❓ QUESTIONS:
1. Where are latest company documents stored?
2. Who should I contact for [specific document]?
3. Any previous EP applications I can use as reference?
4. Is there a shared drive for EP documents?

⏰ TIMELINE:
• Target submission: [DATE]
• Need docs by: [DATE]

Any help or pointers would be appreciated! Thanks! 🙏
\`\`\`

---

## 📞 **WHO TO CONTACT**

| Document Type | Contact | Email |
|--------------|---------|-------|
| SSM Copy | Syaheedah (COO) | syaheedah@pantas.com |
| Directors' IC | Syaheedah (COO) | syaheedah@pantas.com |
| Employment Contracts | Syaheedah (COO) | syaheedah@pantas.com |
| Staff Breakdown | Syaheedah (COO) | syaheedah@pantas.com |
| Previous EP Files | HR Team | #hr-team (Slack) |
| Bot Help | Ask me! | Type your question |

---

## ✅ **BEFORE ASKING, CHECK:**

1. **02_Templates/** folder - All working templates
2. **01_Getting_Started/** folder - Guides
3. **03_Company_Documents/** folder - Company reference
4. **Legal Company Documentation/** folder - Official docs

---

**Still stuck? Tell me specifically what document you're looking for and I'll help!**`
  },

  download: {
    keywords: ['download', 'download all', 'download templates', 'download files', 'send me files', 'get all files'],
    response: `📥 **ALL AVAILABLE DOWNLOADS**

**Important:** All information is displayed in this chat. Downloads are for forms to fill in and optional reference guides.

---

## 📄 **WORD TEMPLATES** (Required - Fill These In!)

These are official forms you need to download and fill in:

### **1. JTKSM Form**
- **[JTKSM_Template.docx](/api/templates/JTKSM_Template.docx)**
- **When:** Phase 4 - After MyFutureJobs approval
- **Fill in:** Company details, candidate table, employer declaration
- **Sign:** COO + company stamp

### **2. GP Checklist**
- **[GP_Checklist_Template.docx](/api/templates/GP_Checklist_Template.docx)**
- **When:** Phase 5 - Before EP submission
- **Fill in:** Candidate info, document checklist, declaration
- **Sign:** COO + company stamp

---

## 📚 **REFERENCE GUIDES** (Optional - For Reading)

These are supplementary guides for reference:

### **Progress & Checklists**
- [PROGRESS_TRACKER.md](/api/templates/PROGRESS_TRACKER.md) - Track your application progress
- [DOCUMENT_CHECKLIST.md](/api/templates/DOCUMENT_CHECKLIST.md) - Complete document requirements

### **Templates & Guides**
- [EMAIL_TEMPLATES.md](/api/templates/EMAIL_TEMPLATES.md) - All email templates (also in chat)
- [INTERVIEW_TEMPLATE.md](/api/templates/INTERVIEW_TEMPLATE.md) - Interview assessment guide
- [MyFutureJobs_GUIDE.md](/api/templates/MyFutureJobs_GUIDE.md) - PERKESO application guide

### **Reference**
- [TEMPLATES_README.md](/api/templates/TEMPLATES_README.md) - Templates folder guide
- [SETUP_GROQ.md](/api/templates/SETUP_GROQ.md) - Bot setup (not needed - bot works without API key!)

---

## 🎯 **WHAT YOU REALLY NEED:**

**For Phase 4 (JTKSM):**
- Download: JTKSM_Template.docx
- Fill in after interviews

**For Phase 5 (EP Application):**
- Download: GP_Checklist_Template.docx
- Fill in before submission

**Everything else is reference - all information is in this chat!**`
  },

  templates: {
    keywords: ['templates', 'what templates', 'available templates', 'template folder'],
    response: `📁 **ALL TEMPLATES & GUIDES**

All information is displayed in this chat. Downloads are optional.

---

## 🚀 **START HERE**

**Type "hi" or "start"** - Get complete welcome package with all phases explained!

---

## 📋 **PHASE GUIDES**

**Type "Phase 1"** - Company documents (with email templates)
**Type "Phase 2"** - Candidate documents (with email templates)
**Type "Phase 3"** - MyFutureJobs PERKESO (with interview template)
**Type "Phase 4"** - JTKSM application
**Type "Phase 5"** - EP application MDEC/ESD

---

## 💬 **TEMPLATES**

**Type "email template"** - All email & Slack templates displayed
**Type "checklist"** - Complete document checklist
**Type "interview"** - Interview assessment form

---

## 🔍 **HELP**

**Type "not sure where to find"** - Help request templates
**Type "download"** - Optional formatted guides
**Type "help"** - All bot commands

---

## 📥 **OPTIONAL DOWNLOADS**

- [START_HERE.md](/api/templates/START_HERE.md)
- [PROGRESS_TRACKER.md](/api/templates/PROGRESS_TRACKER.md)
- [REQUEST_TEMPLATES.md](/api/templates/REQUEST_TEMPLATES.md)
- [DOCUMENT_CHECKLIST.md](/api/templates/DOCUMENT_CHECKLIST.md)
- [EMAIL_TEMPLATES.md](/api/templates/EMAIL_TEMPLATES.md)
- [INTERVIEW_TEMPLATE.md](/api/templates/INTERVIEW_TEMPLATE.md)
- [MyFutureJobs_GUIDE.md](/api/templates/MyFutureJobs_GUIDE.md)
- [EP_APPLICATION_GUIDE.md](/api/templates/EP_APPLICATION_GUIDE.md)
- [WHAT_YOU_CAN_ASK.md](/api/templates/WHAT_YOU_CAN_ASK.md)

---

**Everything you need is right here in this chat! Start by typing "hi" or "Phase 1"**`
  },

  help: {
    keywords: ['help', 'what can you do', 'features', 'how to use', 'where to start'],
    response: `🤖 **EP APPLICATION BOT - HELP GUIDE**

---

## 🎯 **START HERE**

**Type "hi" or "start"** - Get complete welcome package!

---

## 📋 **PHASE-BY-PHASE GUIDES**

**Type "Phase 1"** → Company documents guide + email templates
**Type "Phase 2"** → Candidate documents checklist + email templates
**Type "Phase 3"** → MyFutureJobs PERKESO process + interview template
**Type "Phase 4"** → JTKSM application guide
**Type "Phase 5"** → EP application MDEC/ESD guide

---

## 💬 **TEMPLATES & DOWNLOADS**

**Type "email template"** → All email & Slack templates (copy & send!)
**Type "checklist"** → Complete document checklist
**Type "interview"** → Interview assessment form
**Type "download"** → Optional formatted guides
**Type "not sure where to find"** → Help request templates

---

## 📞 **COMPANY INFO**

**Type "staff breakdown"** → Current local staff numbers
**Type "salary"** → Starting salary info
**Type "COO"** → Contact for company documents

---

## 🔍 **SPECIFIC QUESTIONS**

- "What documents do I need?"
- "Email template for COO"
- "Slack message for candidate"
- "MyFutureJobs process"
- "Interview template"
- "Where to find SSM?"
- "CTC stamp requirements"
- "Passport photo requirements"

---

## 📥 **OPTIONAL DOWNLOADS**

All information is displayed in chat, but you can download formatted guides:

- [START_HERE.md](/api/templates/START_HERE.md)
- [PROGRESS_TRACKER.md](/api/templates/PROGRESS_TRACKER.md)
- [REQUEST_TEMPLATES.md](/api/templates/REQUEST_TEMPLATES.md)

---

**Ready to start? Type "hi" or "Phase 1"!**`
  }
};

/**
 * Analyze message and return appropriate response
 * @param {string} message - User message
 * @returns {string} Bot response
 */
function analyzeMessage(message) {
  const lowerMessage = message.toLowerCase();

  // Check for file uploads in message
  const hasAttachment = message.includes('attached') || message.includes('upload') ||
                        message.includes('.pdf') || message.includes('.jpg');

  // Check each response category
  for (const [category, data] of Object.entries(responses)) {
    if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return data.response;
    }
  }

  // Check for email analysis
  if (hasAttachment && (lowerMessage.includes('email') || lowerMessage.includes('analyze'))) {
    return `📧 **Email Analysis**

I see you've uploaded an email. Here's what to look for:

**Common Document Requests:**
1. SSM Copy
2. Employment Contracts
3. Directors' IC
4. Staff Breakdown
5. Tax Clearance

**Next Steps:**
1. Identify which documents they're requesting
2. Use appropriate email template (type "email template")
3. Contact: syaheedah@pantas.com for company docs

**For detailed analysis, please paste the email text or describe what they're asking for.**`;
  }

  // Default response for unrecognized messages
  return `🤔 I'm not sure I understand.

**Try asking about:**
- Phase guides: "Phase 1", "Phase 2", "Phase 3", etc.
- Templates: "email template", "checklist", "interview"
- Company info: "staff breakdown", "salary", "COO"
- Help: "not sure where to find", "download"

**Type "help" for full list of what I can do!**

**Or type "hi" to get started with the complete EP application package!**`;
}

module.exports = {
  analyzeMessage,
  companyInfo,
  responses
};
