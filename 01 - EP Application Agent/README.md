# EP Application Agent - Complete Package

**Version:** 3.0.0
**Status:** ✅ Production Ready
**Last Updated:** March 27, 2026

**All information is displayed directly in the chat - no need to read MD files!**

---

## 🚀 **QUICK START - Run Locally**

### **Step 1: Navigate to Bot Folder**
```bash
cd "01 - EP Application Agent"
```

### **Step 2: Install Dependencies** (First Time Only)
```bash
npm install
```

### **Step 3: Run the Bot**
```bash
node server.js
```

### **Step 4: Open in Browser**
```
http://localhost:3000        # Landing page (NEW v3.0)
http://localhost:3000/chat.html   # Chat application
```

### **Step 5: Start Using**
Type **"hi"** or **"start"** in the chat to get the complete EP application guide!

---

## ✨ **WHAT'S NEW IN v3.0**

### **Landing Page** (NEW)
- Modern dark theme with gradient accents
- Animated background with floating orbs
- Feature showcase and 5-step process timeline
- Stats section (100% compliance, 5x faster, etc.)
- Access at: `http://localhost:3000/`

### **MyFutureJobs Step-by-Step** (NEW)
Phase 3 now broken into **5 detailed sub-steps**:
- **Step 1:** Account Setup
- **Step 2:** Job Posting
- **Step 3:** Interview Period (14 days)
- **Step 4:** Upload Template & Generate Form
- **Step 5:** Submit & Approval

### **Interactive Templates** (NEW)
- **Download CSV/XLSX** interview templates
- **Fill in** candidate data in Excel/Google Sheets
- **Upload** filled file to bot
- **Auto-process** and generate formatted candidate tables

### **New Endpoints**
- `GET /api/myfuturejobs/template/csv` - Download CSV template
- `GET /api/myfuturejobs/template/xlsx` - Download XLSX template
- `POST /api/myfuturejobs/process` - Process uploaded template

---

## 📋 **WHAT YOU GET IN THE CHAT**

All information is displayed directly in the chat - ready to copy & use!

### **Complete Phase Guides**
- **Phase 1:** Company Documents (with email templates)
- **Phase 2:** Candidate Documents (with email templates)
- **Phase 3:** MyFutureJobs PERKESO (with interview guide)
- **Phase 4:** JTKSM Application (with Word template download)
- **Phase 5:** EP Application (with Word template download)

### **Ready-to-Send Templates**
- ✉️ Email to COO (formal)
- 💬 Slack to COO (casual)
- ✉️ Email to Candidate (detailed)
- 💬 WhatsApp to Candidate (quick)
- ✉️ Help Request templates
- ✉️ Follow-up templates
- ✉️ Agency submission templates

### **Downloadable Files**
- **Word Templates:** JTKSM form, GP Checklist (fill these in)
- **Company Documents:** SSM, License (ready to send to agency)
- **Reference Guides:** Progress tracker, checklists (optional)

---

## 🤖 **BOT COMMANDS**

| Command | What You Get |
|---------|--------------|
| **"hi"** / **"start"** | Complete welcome package |
| **"company documents"** | All company docs ready to download |
| **"Phase 1"** | Company documents guide + templates |
| **"Phase 2"** | Candidate documents checklist |
| **"Phase 3"** / **"MyFutureJobs"** | **Step-by-step guide** with 5 sub-steps + CSV/XLSX templates |
| **"Step 1"** - **"Step 5"** | **MyFutureJobs detailed sub-step guidance** (NEW v3.0) |
| **"Phase 4"** / **"JTKSM"** | JTKSM Word template + guide |
| **"Phase 5"** / **"EP application"** | EP checklist template + guide |
| **"email template"** | All email & Slack templates |
| **"checklist"** | Complete document requirements |
| **"interview"** | Interview assessment form |
| **"download"** | All downloadable files |
| **"help"** | All bot commands list |

**File Uploads (NEW v3.0):**
- Upload **CSV/XLSX** interview template → Auto-processes candidate data
- Upload **passport/CV/certificates** → Document analysis and checklist

---

## 📁 **FOLDER STRUCTURE**

```
01 - EP Application Agent/
├── src/
│   ├── keywordBot.js          # Main bot logic (updated v3.0 with Step 1-5)
│   ├── api/                    # API endpoints
│   └── utils/                  # Utility functions
│
├── public/
│   ├── index.html              # Landing page (NEW v3.0)
│   ├── chat.html               # Chat interface (formerly index.html)
│   ├── script.js               # Frontend logic
│   └── style.css               # Styling (+ home link v3.0)
│
├── templates/
│   ├── JTKSM_Template.docx     # Word form (Phase 4)
│   ├── GP_Checklist_Template.docx  # Word form (Phase 5)
│   └── [original templates]
│
├── 01_Getting_Started/         # User guides
├── 02_Templates/               # Reference templates
├── 03_Company_Documents/       # Company documents
├── 04_Help/                    # Additional help
│
├── docs/                       # Technical docs
├── tests/                      # Test files
├── Output/                     # Generated forms
│
├── server.js                   # Express server (+ CSV/XLSX endpoints v3.0)
├── package.json                # Dependencies (+ xlsx library v3.0)
├── .env.example                # Environment template
├── README.md                   # This file
└── STATE.md                    # Current state & changelog
```

---

## ⚙️ **TECHNICAL REQUIREMENTS**

### **System Requirements**
- **Node.js:** 16.x or higher
- **npm:** Included with Node.js
- **RAM:** 2GB minimum
- **Storage:** 500MB
- **Network:** Optional (bot works offline)

### **Dependencies**
All dependencies are listed in `package.json`:
- express
- cors
- multer
- dotenv
- marked (frontend)

### **No API Key Required!**
This bot uses keyword matching and works completely offline. No API keys needed.

---

## 🔧 **CONFIGURATION**

### **Environment Variables (Optional)**
Create a `.env` file in the bot folder:

```bash
# .env
PORT=3000
```

**Note:** The bot works perfectly without a `.env` file. Default port is 3000.

### **Customize Company Information**
Edit `src/keywordBot.js`:

```javascript
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
```

---

## 📥 **DOWNLOADABLE FILES**

### **Word Templates** (Required - Fill In)
| File | When to Use |
|------|-------------|
| `JTKSM_Template.docx` | Phase 4 - Fill after interviews |
| `GP_Checklist_Template.docx` | Phase 5 - Fill before EP submission |

### **Company Documents** (Ready to Send)
| File | Description |
|------|-------------|
| `SSM_Documents.zip` | Latest SSM registration (Mar 2026) |
| `Company_License.pdf` | Company business license |
| `SOCSO_Approval_Guide.pdf` | PERKESO guidelines |

### **Examples & References**
| File | Purpose |
|------|---------|
| `JTKSM_Form_Example.pdf` | Filled JTKSM example |
| `Filled_EP_Example.pdf` | Previous approved EP |
| `JTKSM_Approval.pdf` | JTKSM approval example |

### **Reference Guides** (Optional)
- `PROGRESS_TRACKER.md` - Track progress
- `DOCUMENT_CHECKLIST.md` - Complete checklist
- `EMAIL_TEMPLATES.md` - Email templates reference
- `INTERVIEW_TEMPLATE.md` - Interview guide
- `MyFutureJobs_GUIDE.md` - PERKESO guide

---

## 🎯 **HOW TO USE**

### **First Time User**
1. Run the bot: `node server.js`
2. Open: `http://localhost:3000`
3. Type: **"hi"** or **"start"**
4. Download company documents (SSM, License)
5. Copy email template and send to COO
6. Follow phase-by-phase guidance

### **Processing an Application**
1. **Phase 1:** Type "Phase 1" → Download company docs
2. **Phase 2:** Type "Phase 2" → Request candidate docs
3. **Phase 3:** Type "MyFutureJobs" → PERKESO process
4. **Phase 4:** Type "JTKSM" → Download & fill Word template
5. **Phase 5:** Type "EP application" → Download & fill Word template
6. **Submit:** All forms completed + documents ready!

### **Need Help**
- Type **"help"** → See all commands
- Type **"checklist"** → Document requirements
- Type **"email template"** → All email templates
- Type **"download"** → All downloadable files
- Type **"not sure where to find"** → Help request templates

---

## 📞 **IMPORTANT CONTACTS**

| Purpose | Contact | Email |
|---------|---------|-------|
| Company Documents | Syaheedah (COO) | syaheedah@pantas.com |
| Bot Help | HR Bot | Ask in chat |
| PERKESO | PERKESO Support | - |
| MDEC/ESD | MDEC Support | - |

---

## 🔗 **IMPORTANT LINKS**

- **PERKESO (MyFutureJobs):** https://www.perkeso.gov.my/pengiklanan-myfuturejobs-bagi-penggajian-pegawai-dagang.html
- **ESD Online (EP):** https://esd.imi.gov.my/
- **MDEC:** https://mdec.my/

---

## ⚠️ **IMPORTANT NOTES**

1. **No API Key Required** - Bot works offline with keyword matching!
2. **All Information in Chat** - Everything displayed directly, no need to read MD files
3. **Email + Slack Templates** - Both formats available for all requests
4. **Ready to Send** - Templates are copy-paste ready
5. **Company Documents Current** - SSM valid until September 2026
6. **Word Templates** - Download and fill in Microsoft Word or compatible software

---

## 🔄 **UPDATES & MAINTENANCE**

### **Update Company Documents**
- **SSM:** Update every 6 months or when changes occur
- **License:** Update when renewed
- **Location:** `03_Company_Documents/` folder

### **Update Bot Responses**
- Edit `src/keywordBot.js`
- Restart server: `pkill -f "node server.js" && node server.js`

### **Check Current State**
- Read `STATE.md` for complete functionality list
- Check changelog for recent updates

---

## 📊 **USAGE STATISTICS**

- **Total Commands:** 15+
- **Phase Guides:** 5 (one per phase)
- **Email Templates:** 8+ (all displayed in chat)
- **Downloadable Files:** 15 (Word, PDF, ZIP, MD)
- **Processing Time:** 6-8 weeks total (all phases)

---

## 🎉 **READY TO START?**

```bash
# Navigate to bot folder
cd "01 - EP Application Agent"

# Run the bot
node server.js

# Open browser
http://localhost:3000

# Type "hi" and begin!
```

**🤖 The bot will guide you through every step with all information displayed directly in the chat!**

---

**📄 Documentation:** See `STATE.md` for complete technical details  
**📄 Version:** 3.0.0
**📄 Status:** ✅ Production Ready
