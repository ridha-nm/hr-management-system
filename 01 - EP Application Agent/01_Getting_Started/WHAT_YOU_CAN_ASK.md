# HR Bot - What You Can Ask

**Bot is running at:** http://localhost:3000

**Last Updated:** March 25, 2026

---

## 🤖 Quick Start

### 1. Open the Bot
```
http://localhost:3000
```

### 2. Select Mode
Choose from dropdown:
- **⚡ Process Candidate** - Upload documents & process
- **General HR Advisor** - Ask HR questions
- **Email Thread Analysis** - Analyze email PDFs
- **MYFutureJobs Template Gen** - Generate templates

### 3. Upload & Ask
Drag & drop files or type your question

---

## 📋 What You Can Ask

### Category 1: Process Candidate Documents

**Upload:** Passport, CV, Certificates, Photo

**What to say:**
```
"Process candidate"
"Extract data from these documents"
"Run compliance audit"
"Generate EP application forms"
"Check if candidate is eligible"
```

**Bot will:**
- Extract data from documents
- Run 5-point compliance audit
- Generate JTKSM & GP Checklist forms
- Create output folder with all documents

---

### Category 2: HR Compliance Questions

**No upload needed**

**What to ask:**
```
"What documents are needed for EP application?"
"How long does JTKSM approval take?"
"What is the minimum salary for EP?"
"What is CTC stamp?"
"Is Tax Clearance required?"
"What are the 5 audit checks?"
"Explain MYFutureJobs process"
```

**Bot will:**
- Answer HR compliance questions
- Provide document checklists
- Explain processes and requirements

---

### Category 3: Email Analysis

**Upload:** Email thread PDF

**What to say:**
```
"Analyze this email"
"What documents are missing?"
"Draft a response"
"Summarize this email thread"
```

**Bot will:**
- Summarize email content
- Identify missing documents
- Draft email responses

---

### Category 4: MyFutureJobs

**What to ask:**
```
"How do I apply for MyFutureJobs?"
"What is the interview period?"
"Help me fill the interview assessment form"
"What documents needed for MyFutureJobs?"
```

**Bot will:**
- Guide through MyFutureJobs process
- Provide interview template
- Help fill assessment form

---

### Category 5: Document Requests

**What to ask:**
```
"Email template for requesting SSM from COO"
"How to request Director ICs?"
"Email template for employment contracts"
```

**Bot will:**
- Provide email templates
- Show contact information (syaheedah@pantas.com)
- Guide on document requests

---

### Category 6: Company Information

**What to ask:**
```
"What is our current staff breakdown?"
"What is the starting salary for local staff?"
"Where are the company documents stored?"
```

**Bot will provide:**
- Top Management: 3
- Middle Management: 6
- Entry Level: 23
- Starting Salary: RM 3,800
- Contact for updates: syaheedah@pantas.com

---

## 🎯 Example Conversations

### Example 1: Process Candidate

**You:** (Upload passport, CV, certificates, photo)
**You:** "Process candidate for EP application"

**Bot:**
```
✅ Candidate Processing Complete!

Status: ✅ PASSED

Candidate: [Name]
Passport: [Number]
Nationality: [Nationality]

Output Folder: ./Output/[NAME]_[PASSPORT]/

📁 Generated forms are ready!
```

---

### Example 2: Compliance Question

**You:** "What documents are needed for JTKSM application?"

**Bot:**
```
For JTKSM application, you need:

1. SSM Copy (latest; within 6 months)
2. Signed Offer Letters - Management (2 pax)
3. Signed Offer Letters - General Worker (2 pax)
4. Latest 3 months' payslips
5. Directors' IC/Passport
6. Staff Breakdown:
   - Top Management: 3
   - Middle Management: 6
   - Entry Level: 23
   - Starting Salary: RM 3,800

For company documents, contact: syaheedah@pantas.com
```

---

### Example 3: Email Analysis

**You:** (Upload email PDF)
**You:** "What documents are they requesting?"

**Bot:**
```
Based on the email, they are requesting:

1. SSM copy
2. Employment contracts
3. Directors' IC copies
4. Staff breakdown

Use Template 1A from docs/EMAIL_TEMPLATES.md to request from COO.
```

---

### Example 4: MyFutureJobs Help

**You:** "Help me fill the MyFutureJobs interview assessment form"

**Bot:**
```
I can help with that! Please provide:

Candidate 1:
- Name, IC, Phone, Email
- Gender, Education
- Decision (Berjaya/Tidak Berjaya)
- Reason for rejection

I'll format it for the form.
```

---

## 📁 Document Locations

When bot mentions documents, they're here:

| Document | Location |
|----------|----------|
| Document Checklist | `docs/DOCUMENT_CHECKLIST.md` |
| Email Templates | `docs/EMAIL_TEMPLATES.md` |
| MyFutureJobs Guide | `docs/MyFutureJobs_GUIDE.md` |
| Interview Template | `docs/INTERVIEW_TEMPLATE.md` |
| Company Documents | `Legal Company Documentation/` |
| Test Plan | `docs/TEST_PLAN.md` |

---

## 🔗 Quick Links

- **Web Interface:** http://localhost:3000
- **Documentation:** `docs/README.md`
- **Test Data:** `docs/TEST_DATA_QUICKSTART.md`
- **Company Info:** `docs/MyFutureJobs_GUIDE.md` (Section 1)

---

## 📞 Contact

**For company document updates:**
- Syaheedah (COO)
- Email: syaheedah@pantas.com

**For technical issues:**
- Check `docs/README.md`
- Review `docs/STATE.md`

---

**🤖 Bot is ready! Open http://localhost:3000 and start chatting!**
