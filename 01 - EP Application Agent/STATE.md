# EP Application Bot - STATE.md

**Version:** 1.0.0 (Production Release)
**Last Updated:** March 27, 2026
**Status:** ✅ Production Ready
**Project:** HR Team of Agents / 01 - EP Application Agent

---

## 📋 **OVERVIEW**

The EP Application Bot is now part of the **Pantas HR Team of Agents** - a suite of specialized AI agents for complete HR operations.

### **HR Team of Agents Suite:**

| Bot | Status | Purpose |
|-----|--------|---------|
| **EP Application Bot** | ✅ Production Ready | Employment Pass automation for Malaysia |
| **HR Generalist Bot** | 🚧 Planning Phase | Employee onboarding, policies, leave, performance |
| **Talent Scout Bot** | 🚧 Planning Phase | Recruitment, screening, interview automation |

---

## 📋 **OVERVIEW**

The EP Application Bot is a keyword-based chatbot that guides HR teams through the complete Employment Pass (EP) application process for Malaysia. All information is displayed directly in the chat interface with downloadable templates and company documents.

### **Core Philosophy**
1. **All Information in Chat** - Users don't need to read external MD files; everything is displayed in the chat
2. **Step-by-Step Guidance** - Phase 3 (MyFutureJobs) now broken into 5 detailed steps
3. **Interactive Templates** - Download CSV/XLSX interview templates, upload filled files for auto-processing
4. **Progressive Disclosure** - No information dumps; users get focused, contextual responses
5. **Auto-Fill Forms** - Bot automatically fills official forms from uploaded CSV/Excel templates
6. **Modern Chat UI** - Clean, user-friendly interface with animated step-by-step flow visualization
7. **Landing Page** - Engaging homepage at root with app access at `/chat.html`

---

## 🎯 **CURRENT FUNCTIONALITIES**

### **1. Landing Page** (NEW in v3.0)
- **URL:** `http://localhost:3000/`
- **Features:**
  - Modern dark theme with gradient accents
  - Animated background with floating orbs
  - Feature showcase (6 cards)
  - 5-step process timeline
  - Stats section (100% compliance, 5x faster, etc.)
  - CTA sections with links to chat app
- **Chat App:** Access at `http://localhost:3000/chat.html`

### **2. Modern Chat UI** (REDESIGNED v3.1)

**Sidebar Features:**
- **Key Features Section** - Highlights auto-fill, CSV/Excel support, step-by-step
- **Phase Navigation** - Buttons for Phase 1-5 with badges
- **MyFutureJobs Steps** - Quick access to Step 1-5
- **Quick Action Grid** - Email, Checklist, Download, Help buttons
- **Download Links** - SSM, DBKL, Interview CSV/XLSX templates

**Chat Window:**
- **Welcome Message** with option cards (Phase 1, MyFutureJobs, Downloads, Help)
- **Highlight Box** - Auto-fill forms feature explanation
- **Quick Tip** - Contextual hints
- **Typing Indicator** - Animated dots
- **Smooth Animations** - Message fade-in effects

**Step-by-Step Modal:**
- **Animated Flow Visualization** - 5 steps with connecting lines
- **Start Buttons** - Click any step to begin
- **Overlay with Blur** - Modern backdrop effect

**File Upload:**
- **Drag & Drop** - Visual feedback on dragover
- **Click to Upload** - Traditional file picker
- **File Name Display** - Shows uploaded files

**Header:**
- **Status Badge** - Online indicator with pulse animation
- **Show Steps Button** - Opens modal (📍)
- **Export Chat** - Download conversation

**Footer:**
- **Modern Input** - Clean text field with focus states
- **Send Button** - Gradient background with hover effect

### **3. Phase-by-Phase Guidance**
- **Command:** `Phase 1` or `company documents`
- **What User Gets:**
  - Timeline visualization (Day 1 → Day 2 → Day 3)
  - Download links for SSM Documents (ZIP) and DBKL License (PDF)
  - Email template to request remaining documents from COO
  - Checklist of required documents
- **Downloads Available:**
  - `SSM_Documents.zip` - Latest SSM registration (March 2026)
  - `DBKL_License.pdf` - Company business license (DBKL)

#### **Phase 2: Candidate Documents** (1-2 weeks)
- **Command:** `Phase 2`
- **What User Gets:**
  - Complete checklist of candidate documents
  - Email template to send to candidate
  - Critical requirements (passport validity, CTC stamps, photo background)
  - Timeline visualization

#### **Phase 3: MyFutureJobs PERKESO** (2-3 weeks) - **NEW Step-by-Step Flow**
- **Command:** `Phase 3` or `MyFutureJobs`
- **What User Gets:**
  - **Step-by-step navigation** with 5 detailed sub-steps
  - Download CSV/XLSX interview templates
  - Upload filled templates for auto-processing
  - Auto-generated candidate tables
  - Email templates for company details
  
**Step 1: Account Setup**
- PERKESO registration guide
- Required documents checklist
- Company information template
- Email to COO for details

**Step 2: Job Posting**
- Complete job description template
- Requirements and skills list
- Company information format
- Submission instructions

**Step 3: Interview Period**
- 14-day minimum tracking
- Interview guidelines
- Rejection reason examples
- CSV/XLSX template downloads

**Step 4: Upload & Generate Form**
- Upload filled CSV/XLSX template
- Auto-parse candidate data
- Generate formatted candidate table
- Ready for official form generation

**Step 5: Submit & Approval**
- Submission checklist
- Portal navigation guide
- Approval tracking
- Next steps for Phase 4

- **Downloads Available:**
  - `/api/myfuturejobs/template/csv` - Interview tracking template (CSV)
  - `/api/myfuturejobs/template/xlsx` - Interview tracking template (Excel)

#### **Phase 4: JTKSM Application** (1 week)
- **Command:** `Phase 4` or `JTKSM`
- **What User Gets:**
  - **Download:** `MyFutureJobs_Expat_Form_Template.docx` - MyFutureJobs Expat Application Form (interview outcomes)
  - **Example:** `MyFutureJobs_Expat_Form_Example.pdf` - Filled example
  - Section-by-section filling guide
  - Candidate table format
  - Employer declaration instructions

#### **Phase 5: EP Application** (4-6 weeks)
- **Command:** `Phase 5` or `EP application`
- **What User Gets:**
  - **Download:** `GP_Checklist_Template.docx` - GP Checklist for EP submission
  - **Example:** `MyFutureJobs_Expat_Form_Example.pdf` - Previous approved EP
  - ESD portal submission guide
  - Document verification checklist
  - Agency submission email template

---

### **2. Template Downloads**

**⚠️ IMPORTANT: Document Types**

| Type | Purpose | Action Required |
|------|---------|-----------------|
| **Company Documents** | Send to agency | Download & forward (no filling) |
| **Word Templates** | Official forms | Download, fill in, sign, submit |
| **Interview Templates** | Track candidates | Fill in Excel/CSV, upload for auto-fill |
| **Reference Example** | Learning | View only (filled example) |

---

#### **A. Company Documents (Download & Send to Agency)**
**These are ready-to-send. No filling required.**

| File | Description | When to Use |
|------|-------------|-------------|
| `SSM_Documents.zip` | Latest SSM registration (Mar 2026) | Phase 1 - Send to agency |
| `DBKL_License.pdf` | DBKL business license | Phase 1 - Send to agency |
| `JTKSM_Approval.pdf` | JTKSM approval letter | Reference for agency |

---

#### **B. Word Templates (MUST Fill In Before Submission)**
**Download these, fill them in, get COO signature, then submit.**

| File | Purpose | When to Use |
|------|---------|-------------|
| `MyFutureJobs_Expat_Form_Template.docx` | LAPORAN PENGAMBILAN PEKERJA TEMPATAN - Interview outcomes form | Phase 3-4: After interviews, before JTKSM submission |
| `GP_Checklist_Template.docx` | GP Checklist for EP Application | Phase 5: Before EP submission to MDEC/ESD |

**How to Fill:**
1. **Manual:** Download → Fill in Word → Sign by COO → Stamp → Submit
2. **Auto-Fill (NEW v3.0):** Download interview CSV/Excel → Fill candidate data → Upload to bot → Bot fills MyFutureJobs form automatically

---

#### **C. Interview Templates (For Auto-Fill Feature)**
**Use these to track interviews, then upload for auto-fill.**

| File | Format | Use |
|------|--------|-----|
| `/api/myfuturejobs/template/csv` | CSV | Fill in Excel/Google Sheets, upload to bot |
| `/api/myfuturejobs/template/xlsx` | Excel | Fill in Excel, upload to bot |

**Workflow:**
1. Download CSV or Excel template
2. Conduct interviews and fill in candidate data
3. Upload filled file to bot
4. Bot auto-fills `MyFutureJobs_Expat_Form_Template.docx`
5. Download the filled form, sign, and submit

---

#### **D. Reference Example**
| File | Purpose |
|------|---------|
| `MyFutureJobs_Expat_Form_Example.pdf` | Filled example - use as reference for how to fill the form |

---

#### **E. Reference Guides (Optional Reading)**
- `PROGRESS_TRACKER.md` - Track application progress
- `DOCUMENT_CHECKLIST.md` - Complete document requirements
- `EMAIL_TEMPLATES.md` - All email templates reference
- `INTERVIEW_TEMPLATE.md` - Interview assessment guide
- `MyFutureJobs_GUIDE.md` - PERKESO application guide

#### **Company Documents (Ready to Send)**
| File | Description | Valid Until |
|------|-------------|-------------|
| `SSM_Documents.zip` | Latest SSM registration | September 2026 |
| `DBKL_License.pdf` | DBKL business license | As per license |
| `JTKSM_Approval.pdf` | JTKSM approval letter | Reference |

#### **Examples & References**
| File | Purpose |
|------|---------|
| `MyFutureJobs_Expat_Form_Example.pdf` | Filled MyFutureJobs expat application form (reference) |
| `SOCSO_Approval_Guide.pdf` | PERKESO guidelines (reference only, NOT for agency) |

#### **Reference Guides (Optional - MD Files)**
- `PROGRESS_TRACKER.md` - Track application progress
- `DOCUMENT_CHECKLIST.md` - Complete document requirements
- `EMAIL_TEMPLATES.md` - All email templates reference
- `INTERVIEW_TEMPLATE.md` - Interview assessment guide
- `MyFutureJobs_GUIDE.md` - PERKESO application guide

---

### **3. Email & Communication Templates**

All templates are displayed in chat (copy & paste ready):

#### **Request Templates**
- Email to COO (formal) - Company documents
- Slack to COO (casual) - Company documents
- Email to Candidate (detailed) - Personal documents
- WhatsApp to Candidate (quick) - Personal documents
- Email to Hiring Manager - Job description

#### **Help Request Templates**
- Email to HR Team - "Not sure where to find"
- Slack to #hr-team - "Not sure where to find"

#### **Follow-up Templates**
- Email follow-up - Pending documents
- Slack follow-up - Pending documents

#### **Submission Templates**
- Email to Immigration Agency - Complete submission

---

### **4. Bot Commands**

| Command | Response |
|---------|----------|
| `hi`, `hello`, `start`, `welcome` | Welcome message with phase selector & timeline |
| `Phase 1`, `company documents` | Company documents guide + downloads |
| `Phase 2`, `candidate documents` | Candidate documents checklist |
| `Phase 3`, `MyFutureJobs`, `PERKESO` | **Step-by-step guide** with 5 sub-steps + CSV/XLSX templates |
| `Step 1`, `Step 2`, `Step 3`, `Step 4`, `Step 5` | **MyFutureJobs detailed sub-step guidance** |
| `Phase 4`, `JTKSM` | MyFutureJobs Expat Form guide |
| `Phase 5`, `EP application` | EP checklist guide + GP Checklist template |
| `email template` | All email & Slack templates |
| `checklist` | Complete document checklist |
| `interview` | Interview assessment form guide |
| `download`, `download all` | All downloadable files organized by type |
| `not sure where to find` | Help request templates |
| `help` | All bot commands list |

**File Uploads:**
- Upload **CSV/XLSX** interview template → Auto-processes candidate data
- Upload **passport/CV/certificates** → Document analysis and checklist

---

## 📁 **FOLDER STRUCTURE**

```

├── 01 - EP Application Agent/
│   ├── src/
│   │   ├── keywordBot.js          # Main bot logic & responses (updated v3.0 with Step 1-5)
│   │   ├── api/                    # API endpoints (future use)
│   │   └── utils/                  # Utility functions (future use)
│   │
│   ├── public/                     # Frontend (Pantas theme UI)
│   │   ├── index.html              # Landing page (NEW v3.0)
│   │   ├── chat.html               # Chat interface (formerly index.html)
│   │   ├── script.js               # Frontend logic
│   │   └── style.css               # Pantas brand styling (+ home link)
│   │
│   ├── public-v1/                  # Previous clean UI design (archived)
│   │
│   ├── templates/                  # Word templates to fill
│   │   ├── GP Checklist - EP (New) - MDEC.docx
│   │   └── LAPORAN PENGAMBILAN PEKERJA TEMPATAN (Filled in) (1).docx
│   │
│   ├── 01_Getting_Started/
│   │   ├── START_HERE.md           # Quick start guide
│   │   ├── EP_APPLICATION_GUIDE.md # Complete walkthrough
│   │   ├── WHAT_YOU_CAN_ASK.md     # Bot commands reference
│   │   ├── REQUEST_TEMPLATES.md    # Email/Slack templates reference
│   │   └── SETUP_GROQ.md           # Bot setup (legacy)
│   │
│   ├── 02_Templates/
│   │   ├── PROGRESS_TRACKER.md     # Progress tracking
│   │   ├── DOCUMENT_CHECKLIST.md   # Document requirements
│   │   ├── EMAIL_TEMPLATES.md      # Email templates reference
│   │   ├── MyFutureJobs_GUIDE.md   # PERKESO guide (update needed v3.0)
│   │   ├── INTERVIEW_TEMPLATE.md   # Interview form guide
│   │   └── README.md               # Templates folder guide
│   │
│   ├── 03_Company_Documents/
│   │   ├── 2026_SSM_Documents_as_of_Mar_10_2026 (1).zip
│   │   ├── DBKL_License.pdf         # Company license (renamed from Lesen)
│   │   ├── SOCSO (Perkeso) approval. Steps (2025).pdf
│   │   ├── JTKSM Approval.pdf
│   │   └── Sustainability Data Analyst_*.pdf (MyFutureJobs example)
│   │
│   ├── 04_Help/                    # Additional help (future)
│   ├── docs/                       # Technical documentation
│   ├── tests/                      # Test files
│   ├── inspiration/                # Design inspiration files
│   ├── temp_docs/                  # Temporary file storage
│   ├── Output/                     # Generated forms output
│   │
│   ├── server.js                   # Express server + API endpoints (NEW: CSV/XLSX endpoints)
│   ├── package.json                # Dependencies (+ xlsx library v3.0)
│   ├── package-lock.json
│   ├── .env.example                # Environment variables template
│   ├── README.md                   # Main documentation
│   ├── TIMELINE.md                 # Visual timeline reference
│   └── STATE.md                    # This file - Current state
│
├── 02 - HR Generalist Bot/         # Future bot
└── README.md                       # Main project README
```

---

## 🔧 **TECHNICAL IMPLEMENTATION**

### **Server (server.js)**
- **Framework:** Express.js
- **Endpoints:**
  - `GET /` - Landing page (NEW v3.0)
  - `POST /api/chat` - Main chat endpoint (enhanced with CSV/XLSX upload detection v3.0)
  - `POST /api/process-candidate` - Candidate document processing
  - `GET /api/templates` - List all downloadable templates
  - `GET /api/templates/:filename` - Download specific template
  - `GET /api/myfuturejobs/template/csv` - Download CSV interview template (NEW v3.0)
  - `GET /api/myfuturejobs/template/xlsx` - Download XLSX interview template (NEW v3.0)
  - `POST /api/myfuturejobs/process` - Process uploaded interview template (NEW v3.0)
- **Static Files:** Serves `public/` folder
- **File Uploads:** Multer for document uploads
- **Template Mapping:** 11 files (2 Word templates, 4 company docs, 5 reference guides)
- **Libraries:** xlsx (NEW v3.0) for CSV/XLSX generation and parsing

### **Bot Logic (src/keywordBot.js)**
- **Pattern:** Keyword-based response system
- **No API Key Required:** Works offline
- **Response Categories:**
  - Greetings & Welcome (with timeline visualization)
  - Phase-specific guides (Phase 1-5)
  - **MyFutureJobs Step-by-Step (Step 1-5)** (NEW v3.0)
  - Document checklists
  - Email templates
  - Download management
  - Help requests
- **Company Info:** Configurable in `companyInfo` object

### **Frontend (public/)**
- **Landing Page (landing.html)** (NEW v3.2.4):
  - Modern white background with logo top-right
  - Blue/dark gradient sections
  - Agent cards with status badges (Live/Planned)
  - Feature showcase (6 cards)
  - Stats section (100% compliance, 5x faster, etc.)
  - Process timeline visualization
  - Primary CTA: "Launch HR Platform"
  - Secondary CTA: "Try EP Agent"
- **Chat App (chat.html)**:
  - Single-page chat interface with sidebar
  - Home button (🏠) to return to landing page (NEW v3.0)
  - CSS: Pantas brand theme (blue #1668F5, teal #00b5d8)
  - JavaScript: Chat functionality, file uploads, theme toggle
  - Markdown Rendering: marked.js library
  - Features:
    - Collapsible sidebar
    - Dark/Light mode toggle
    - Quick reply buttons
    - Interactive timeline
    - Export chat functionality
    - Copy to clipboard
    - Toast notifications
    - **CSV/XLSX file upload support** (NEW v3.0)

### **UI Design (Pantas Theme)**
- **Colors:**
  - Primary Blue: #1668F5
  - Teal: #00b5d8
  - Background: #f8faff (off-white)
  - Surface: #f0f4ff
  - Text: #0a0f1e (dark)
- **Fonts:**
  - Plus Jakarta Sans (headings)
  - DM Sans (body)
- **Elements:**
  - Dot grid background
  - Gradient buttons (blue to teal)
  - Pill-shaped buttons
  - Subtle blue-tinted shadows

### **Landing Page Design (NEW v3.0)**
- **Theme:** Dark modern with gradient accents
- **Colors:**
  - Background: #0f172a (dark slate)
  - Primary: #6366f1 (indigo)
  - Secondary: #06b6d4 (cyan)
  - Accent: #f472b6 (pink)
- **Fonts:**
  - Plus Jakarta Sans (body)
  - Space Grotesk (headings)
- **Features:**
  - Animated gradient background
  - Scroll-triggered animations
  - Responsive grid layouts
  - Smooth scroll navigation

---

## 🚀 **HOW TO RUN**

### **Prerequisites**
- Node.js 16.x or higher
- npm

### **Installation**
```bash
cd "01 - EP Application Agent"
npm install
```

### **Run Locally**
```bash
node server.js
```

### **Access**
Open browser: `http://localhost:3000`

### **Environment Variables (Optional)**
```bash
# .env file (not required - bot works without API keys)
PORT=3000
```

---

## 📊 **USAGE STATISTICS**

### **File Types**
- **Word Templates:** 2 files (MyFutureJobs Expat Form, GP Checklist)
- **Company Documents:** 4 files (SSM, DBKL License, JTKSM Approval, SOCSO Guide)
- **Reference Guides:** 5 MD files (optional)
- **Examples:** 1 PDF file (MyFutureJobs filled example)

### **Bot Responses**
- **Total Commands:** 15+
- **Phase Guides:** 5 (one per phase)
- **Email Templates:** 8+ (all displayed in chat)
- **Download Categories:** 3 (Company, Word Templates, Reference)

### **UI Features**
- Collapsible sidebar
- Dark/Light mode toggle
- Quick reply buttons
- Interactive timeline
- Export chat
- Copy to clipboard
- Toast notifications
- Mobile responsive

---

## 🔄 **CHANGELOG**

### **Version 1.0.0** (March 27, 2026) - **Production Release**
- ✅ **Complete EP Application Agent** - All 5 phases fully functional
- ✅ **Document Management** - SSM, DBKL, JTKSM downloads
- ✅ **Template System** - CSV, Excel, Word template generation
- ✅ **Upload & Auto-Fill** - Interview data processing
- ✅ **Chat Interface** - Quick questions + free-text chat
- ✅ **Unified Sidebar** - Matches HR Platform design
- ✅ **White Header** - Logo centered + "Employee Management System"
- ✅ **Responsive Design** - Desktop, tablet, mobile support
- ✅ **Touch Navigation** - Swipe support for mobile
- ✅ **Keyboard Shortcuts** - Arrow keys, Space, Home, End
- ✅ **Profile Integration** - User profile accessible from sidebar

### **Version 0.9.0** (March 27, 2026) - **Seamless Integration with HR Platform**
- ✅ **Fully Embedded** - EP Bot integrated within HR Platform, no redirects
- ✅ **Redesigned Chat UI** - Modern message bubbles with avatars
- ✅ **Consistent Sidebar** - White header (#ffffff) with logo, dark body (#1e293b)
- ✅ **HR Branding** - "HR Management System" at sidebar bottom with logo
- ✅ **Simplified Nav** - Only EP-related tabs (Process, Documents, Upload, Help)
- ✅ **No Other Agents** - Removed Onboarding/Leave/Interview from sidebar
- ✅ **Back to Dashboard** - Single button to return to HR Platform
- ✅ **Typing Indicator** - Animated dots while bot responds
- ✅ **Quick Actions** - Pre-defined question buttons for common queries
- ✅ **Same Window** - Opens in same tab for seamless experience
- ✅ **Plus Jakarta Sans** - Distinctive display font throughout

### **Version 3.3.0** (March 27, 2026) - **HR Platform as Main Landing Page**
- ✅ **HR Platform at Root** - Employee Management System serves as main landing page
- ✅ **Overview Dashboard** - Hero section, stats bar, employee table, quick actions
- ✅ **White Sidebar Header** - Logo area has white background for visibility
- ✅ **Blue/Dark Sidebar** - Rest of sidebar uses dark slate (#1e293b)
- ✅ **Plus Jakarta Sans** - Headings use distinctive display font
- ✅ **Inter** - Body text uses clean, readable font
- ✅ **Agent Integration** - EP Agent accessible from HR Platform sidebar
- ✅ **Removed Separate Landing** - No standalone landing.html, everything embedded

### **Version 3.2.5** (March 27, 2026) - **Unified Theme Across All Pages**
- ✅ **Chat Sidebar Updated** - Matches HR Platform navigation structure
- ✅ **Agent Navigation** - Shows all agents (EP Live, others Planned)
- ✅ **Unified Colors** - Inter font, blue (#2563eb), slate backgrounds
- ✅ **API Paths Fixed** - Changed from `/ep-api/` to `/api/`
- ✅ **Breadcrumb Updated** - Home / AI Agents / EP Application
- ✅ **Top Bar Actions** - Home and HR Platform buttons
- ✅ **User Badge** - Guest User / Demo Mode in sidebar footer

### **Version 3.2.4** (March 27, 2026) - **New Landing Page + Unified Navigation**
- ✅ **Modern Landing Page** - Fresh design with white background, logo top-right
- ✅ **Blue/Dark Color Scheme** - Professional gradient sections
- ✅ **Agent Cards** - Visual display of all agents with status badges
- ✅ **HR Platform Integration** - All agents accessible from HR Platform sidebar
- ✅ **Primary CTA** - "Launch HR Platform" as main action
- ✅ **Secondary CTA** - "Try EP Agent" for direct chat access
- ✅ **Feature Showcase** - 6 feature cards highlighting key benefits
- ✅ **Stats Section** - Key metrics (100% compliance, 5x faster, etc.)
- ✅ **Process Timeline** - Visual 5-phase EP application timeline

### **Version 3.2.3** (March 27, 2026) - **Unified Port Setup**
- ✅ **Single Server** - Both EP Agent and HR Platform run on port 3000
- ✅ **HR Platform Integration** - Accessible at `/platform` sub-path
- ✅ **Shared Database** - Employee/department data shared between apps
- ✅ **Simplified Deployment** - Single `node server.js` starts both apps
- ✅ **Updated Documentation** - STATE.md files reflect unified setup

### **Version 3.2.2** (March 27, 2026) - **Simplified WIP Plans**
- ✅ **HR Generalist Bot Plan** - Simplified to planning phase only
- ✅ **Talent Scout Bot Plan** - Simplified to planning phase only
- ✅ **Plan.md files** - Contain feature outlines and roadmaps for future development

### **Version 3.2.1** (March 27, 2026) - **Enhanced Bot Plans with Frappe HRMS Inspiration**
- ✅ **Multi-Bot Architecture** - EP Bot is now part of HR Team suite
- ✅ **Bot Selector** - Landing page shows all 3 bots with status
- ✅ **HR Generalist Bot Plan** - Created comprehensive Plan.md
- ✅ **Talent Scout Bot Plan** - Created comprehensive Plan.md
- ✅ **WIP Pages** - Work in Progress pages for upcoming bots
- ✅ **Landing Page Rebrand** - Now shows "Pantas HR Team of Agents"
- ✅ **Folder Structure** - Created folders for all 3 bots

### **Version 3.1.2** (March 27, 2026) - **Progress Tracker on Landing Page**
- ✅ **Progress Tracker Section** - Visual timeline showing all 5 phases
- ✅ **Phase Task Lists** - Checklist of tasks for each phase
- ✅ **Duration Indicators** - Shows how long each phase takes
- ✅ **Start Phase Buttons** - Direct links to chat app for each phase
- ✅ **Timeline Summary** - Total duration, success rate, auto-fill feature highlights
- ✅ **Scroll Animations** - Fade-in effects for timeline phases

### **Version 3.1.1** (March 27, 2026) - **Downloads Fixed & Organized**
- ✅ **Modern Chat Interface** - Clean, user-friendly design
- ✅ **Key Features Sidebar** - Highlights auto-fill, CSV/Excel, step-by-step
- ✅ **Welcome Option Cards** - Visual selection for starting points
- ✅ **Step-by-Step Modal** - Animated flow visualization with 5 steps
- ✅ **Progressive Disclosure** - No information dumps; focused responses
- ✅ **Drag & Drop Upload** - Visual feedback for file uploads
- ✅ **Typing Indicator** - Animated dots while bot responds
- ✅ **Status Badge** - Online indicator with pulse animation
- ✅ **Export Chat** - Download conversation as text file
- ✅ **Keyboard Shortcuts** - Ctrl+K focus, Enter send, Escape close
- ✅ **Responsive Design** - Works on mobile and desktop
- ✅ **Smooth Animations** - Message fade-in, hover effects
- ✅ **Updated Greeting** - Highlights auto-fill feature prominently

### **Version 3.0.0** (March 27, 2026) - **MyFutureJobs Step-by-Step + Landing Page**
- ✅ **Landing Page:** New engaging homepage at root (`/`) with modern dark theme
- ✅ **MyFutureJobs Step-by-Step:** Phase 3 split into 5 detailed sub-steps (Step 1-5)
- ✅ **CSV Template Download:** `/api/myfuturejobs/template/csv` endpoint
- ✅ **XLSX Template Download:** `/api/myfuturejobs/template/xlsx` endpoint
- ✅ **Interview Template Upload:** Auto-process CSV/XLSX files uploaded to chat
- ✅ **Auto-Generated Candidate Tables:** Parse uploaded templates and display formatted data
- ✅ **New Commands:** `Step 1`, `Step 2`, `Step 3`, `Step 4`, `Step 5`
- ✅ **Chat App Relocated:** Now at `/chat.html` (formerly `/`)
- ✅ **Home Button:** 🏠 in sidebar to return to landing page
- ✅ **Dependencies:** Added `xlsx` library for spreadsheet handling
- ✅ **Documentation:** Updated STATE.md with v3.0 changes

### **Version 2.1.0** (March 25, 2026)
- ✅ **Template Cleanup:** Removed duplicate GP checklist template
- ✅ **Template Renaming:** Correctly named MyFutureJobs Expat Form templates
- ✅ **Documentation:** Created comprehensive STATE.md
- ✅ **UI:** Pantas brand theme implementation
- ✅ **Sidebar:** Added downloads, timeline, phase navigation
- ✅ **Company Documents:** DBKL License renamed, all ready to send

### **Version 2.0.0** (March 25, 2026)
- ✅ **Major Restructure:** All information displayed in chat
- ✅ **Word Templates:** Added downloadable .docx forms
- ✅ **Company Documents:** Added SSM, License, and other company docs as downloads
- ✅ **Folder Cleanup:** Organized all files into designated folders
- ✅ **STATE.md:** Created comprehensive state documentation
- ✅ **README.md:** Updated with local run instructions
- ✅ **Server Updates:** Added support for .docx, .pdf, .zip downloads
- ✅ **Bot Responses:** Updated all responses to show information inline
- ✅ **Phase-Specific:** Users select phase instead of getting info dump

### **Version 1.0.0** (Previous Version)
- Basic keyword-based chatbot
- MD file downloads only
- No Word template support
- Limited company document availability

---

## 📝 **FUTURE ENHANCEMENTS**

### **Planned Features**
1. **Auto-fill Word Templates** - Bot fills templates from candidate data
2. **Document Upload & Validation** - Upload documents for compliance check
3. **Progress Tracking** - Save application progress
4. **Email Integration** - Send emails directly from bot
5. **Multi-candidate Support** - Track multiple EP applications
6. **Notification System** - Reminders for pending documents
7. **Analytics Dashboard** - Track application success rates

### **Technical Improvements**
1. **Database Integration** - Store application data
2. **User Authentication** - Secure access
3. **API Integration** - Connect to ESD/PERKESO APIs
4. **Document Storage** - Cloud storage for documents
5. **Version Control** - Track document versions

---

## 📞 **SUPPORT & MAINTENANCE**

### **Company Information Updates**
When company information changes, update in `src/keywordBot.js`:
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

### **Document Updates**
- **SSM Documents:** Update when new SSM copy is issued (every 6 months)
- **DBKL License:** Update when license is renewed
- **Templates:** Update when immigration forms change

### **Bot Updates**
1. Edit `src/keywordBot.js` for response changes
2. Edit `server.js` for API endpoint changes
3. Restart server: `pkill -f "node server.js" && node server.js`

---

## ✅ **CHECKLIST FOR NEW EP APPLICATION**

### **Before Starting**
- [ ] Bot is running (`http://localhost:3000`)
- [ ] SSM documents are current (within 6 months)
- [ ] DBKL license is valid
- [ ] COO contact information is updated

### **Phase 1: Company Documents**
- [ ] Download SSM_Documents.zip
- [ ] Download DBKL_License.pdf
- [ ] Email COO for Directors' IC
- [ ] Email COO for Employment Contracts
- [ ] Email COO for Staff Breakdown

### **Phase 2: Candidate Documents**
- [ ] Request passport copy from candidate
- [ ] Request CV/Resume from candidate
- [ ] Request certificates (with CTC) from candidate
- [ ] Request transcripts from candidate
- [ ] Request photo (light blue) from candidate
- [ ] Verify passport validity (15+ months)
- [ ] Verify CTC stamps on certificates

### **Phase 3: MyFutureJobs**
- [ ] Create PERKESO account
- [ ] Post job (14 days minimum)
- [ ] Conduct interviews
- [ ] Fill MyFutureJobs Expat Form
- [ ] Submit assessment
- [ ] Receive approval letter

### **Phase 4: JTKSM**
- [ ] Download MyFutureJobs Expat Form Template
- [ ] Fill company details
- [ ] Fill candidate table
- [ ] Get COO signature
- [ ] Apply company stamp
- [ ] Submit application

### **Phase 5: EP Application**
- [ ] Download GP_Checklist_Template.docx
- [ ] Fill candidate information
- [ ] Check off all documents
- [ ] Get COO signature
- [ ] Apply company stamp
- [ ] Submit via ESD portal
- [ ] Track application status
- [ ] Receive approval

---

## 🎨 **UI DESIGN NOTES**

### **Version History**
- **v2.1 (Current):** Pantas brand theme with sidebar
- **v2.0:** Clean white/blue theme
- **v1.0:** Glassmorphism purple gradient

### **Archived Designs**
- `public-v1/` - Previous clean design (archived for reference)
- `inspiration/` - Design inspiration files from pantas.com

### **Current Design Principles**
1. **Readability First** - Clean, uncluttered chat area
2. **Pantas Brand** - Blue (#1668F5) and Teal (#00b5d8) accents
3. **Off-White Backgrounds** - #f8faff, not harsh white
4. **Sidebar for Navigation** - Keep chat area focused
5. **Quick Actions** - One-click phase selection

---

**📄 STATE.md Created:** March 25, 2026
**📄 Last Updated:** March 27, 2026 (Version 1.0.0 Release)
**📄 Version:** 1.0.0
**📄 Status:** ✅ Production Ready
**📄 Location:** `01 - EP Application Agent/STATE.md`

---

## 🌐 **ACCESS**

**Both EP Agent and HR Platform now run on a single port!**

| Application | URL | Status |
|-------------|-----|--------|
| **EP Agent Landing** | http://localhost:3000/ | ✅ Live |
| **EP Agent Chat** | http://localhost:3000/chat.html | ✅ Live |
| **HR Platform** | http://localhost:3000/platform | ✅ Live (Demo Mode) |
| **WIP HR Generalist** | http://localhost:3000/wip-hr-generalist.html | ✅ Live |
| **WIP Talent Scout** | http://localhost:3000/wip-talent-scout.html | ✅ Live |

**Server Status:** Running on port 3000 (unified server)

---

## 🏢 **HR TEAM OF AGENTS**

### **Bot Architecture:**

```

├── 01 - EP Application Agent/          ✅ Production Ready (v3.2.3)
│   ├── server.js                     # Express server (unified with platform)
│   ├── public/                       # Web interface (Landing + Chat)
│   └── STATE.md                      # This file
│
├── platform/                         ✅ Demo Mode (v4.2.1)
│   ├── server.js                     # Merged into EP Bot server
│   ├── public/                       # HR Platform UI
│   └── data/                         # Employee/department database
│
├── 02 - Onboarding Agent/            📋 Planning
│   └── Plan.md
│
├── 03 - Leave Agent/                 📋 Planning
│   └── Plan.md
│
└── 04 - Interview Agent/             📋 Planning
    └── Plan.md
```

### **Bot Status:**

| Bot | Version | Status |
|-----|---------|--------|
| EP Application Bot | 3.2.3 | ✅ Live |
| HR Platform | 4.2.1 | ✅ Demo Mode |
| Onboarding Agent | 0.0.1 | 📋 Planning |
| Leave Agent | 0.0.1 | 📋 Planning |
| Interview Agent | 0.0.1 | 📋 Planning |

**Note:** Onboarding, Leave, and Interview Agents are in planning phase. Plan.md files contain feature outlines and development roadmaps for future implementation.
