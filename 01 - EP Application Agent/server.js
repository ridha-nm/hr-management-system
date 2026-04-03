const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');
const XLSX = require('xlsx');
const { analyzeMessage, companyInfo } = require('./src/keywordBot');

// ========== HR PLATFORM PATHS (defined before use) ==========
const hrPlatformPath = path.join(__dirname, '..', 'platform', 'public');
const hrPlatformDataPath = path.join(__dirname, '..', 'platform', 'data');

const app = express();
app.use(cors());
app.use(express.json());

// Serve HR Platform (Employee Management System) at root
app.get('/', (req, res) => {
  res.sendFile(path.join(hrPlatformPath, 'index.html'));
});

app.use(express.static('public'));

const upload = multer({ dest: 'temp_docs/uploads/' });

// ========== HR PLATFORM INTEGRATION ==========
// Load HR Platform data
const hrPlatformDB = {
  users: [],
  companies: [],
  employees: [],
  departments: [],
  teams: []
};

function loadHRPlatformDB() {
  try {
    ['users', 'companies', 'employees', 'departments', 'teams'].forEach(table => {
      const file = path.join(hrPlatformDataPath, `${table}.json`);
      if (fs.existsSync(file)) {
        hrPlatformDB[table] = JSON.parse(fs.readFileSync(file, 'utf8'));
      }
    });
    console.log('✅ HR Platform database loaded');
  } catch (error) {
    console.log('ℹ️ HR Platform database will be initialized on first use');
  }
}

// Initialize HR Platform default data
function initHRPlatformDB() {
  if (hrPlatformDB.users.length === 0) {
    const bcrypt = require('bcrypt');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    hrPlatformDB.users.push({
      id: 'USR001',
      email: 'admin@pantas.com',
      password: hashedPassword,
      role: 'admin',
      employeeId: 'EMP001',
      createdAt: new Date().toISOString()
    });

    hrPlatformDB.companies.push({
      id: 'COMP001',
      name: 'Pantas Climate Solutions',
      totalEmployees: 32,
      createdAt: new Date().toISOString()
    });

    hrPlatformDB.departments = [
      { id: 'DEPT001', name: 'Business Development', headcount: 8 },
      { id: 'DEPT002', name: 'Product', headcount: 6 },
      { id: 'DEPT003', name: 'CSM', headcount: 5 },
      { id: 'DEPT004', name: 'Engineering', headcount: 10 },
      { id: 'DEPT005', name: 'Data Science', headcount: 4 }
    ];

    hrPlatformDB.employees = [
      {
        id: 'EMP001', name: 'Ahmad Abdullah', email: 'ahmad@pantas.com',
        department: 'Engineering', designation: 'Software Engineer',
        manager: 'EMP005', joinDate: '2024-01-15', status: 'Active',
        phone: '+60 12-345-6789', location: 'Kuala Lumpur',
        employmentType: 'Full-time', workArrangement: 'Hybrid',
        leaveBalance: 14, avatar: '👨‍💻'
      },
      {
        id: 'EMP002', name: 'Sarah Chen', email: 'sarah@pantas.com',
        department: 'Business Development', designation: 'BD Manager',
        manager: 'EMP003', joinDate: '2023-06-01', status: 'Active',
        phone: '+60 12-345-6790', location: 'Kuala Lumpur',
        employmentType: 'Full-time', workArrangement: 'Hybrid',
        leaveBalance: 16, avatar: '👩‍💼'
      },
      {
        id: 'EMP003', name: 'Syaheedah', email: 'syaheedah@pantas.com',
        department: 'CSM', designation: 'COO', manager: null,
        joinDate: '2022-01-01', status: 'Active',
        phone: '+60 12-345-6791', location: 'Kuala Lumpur',
        employmentType: 'Full-time', workArrangement: 'Hybrid',
        leaveBalance: 18, avatar: '👩‍💼'
      },
      {
        id: 'EMP004', name: 'Ridham Mohamed', email: 'ridham@pantas.com',
        department: 'Data Science', designation: 'Lead Data Scientist',
        manager: 'EMP005', joinDate: '2023-03-15', status: 'Active',
        phone: '+60 12-345-6792', location: 'Kuala Lumpur',
        employmentType: 'Full-time', workArrangement: 'Hybrid',
        leaveBalance: 15, avatar: '👨‍💼'
      },
      {
        id: 'EMP005', name: 'David Tan', email: 'david@pantas.com',
        department: 'Product', designation: 'Head of Product',
        manager: 'EMP003', joinDate: '2022-06-01', status: 'Active',
        phone: '+60 12-345-6793', location: 'Kuala Lumpur',
        employmentType: 'Full-time', workArrangement: 'Hybrid',
        leaveBalance: 17, avatar: '👨‍🔧'
      }
    ];

    hrPlatformDB.teams = [
      { id: 'TEAM001', name: 'Engineering Team', department: 'Engineering', lead: 'EMP001', members: ['EMP001'] },
      { id: 'TEAM002', name: 'Business Development Team', department: 'Business Development', lead: 'EMP002', members: ['EMP002'] },
      { id: 'TEAM003', name: 'CSM Team', department: 'CSM', lead: 'EMP003', members: ['EMP003'] },
      { id: 'TEAM004', name: 'Product Development Team', department: 'Product', lead: 'EMP005', members: ['EMP005'] },
      { id: 'TEAM005', name: 'Data Science Team', department: 'Data Science', lead: 'EMP004', members: ['EMP004'] }
    ];

    // Save to files
    const saveDB = (table) => {
      const file = path.join(hrPlatformDataPath, `${table}.json`);
      fs.writeFileSync(file, JSON.stringify(hrPlatformDB[table], null, 2));
    };
    ['users', 'companies', 'employees', 'departments', 'teams'].forEach(saveDB);
    console.log('✅ HR Platform default data initialized');
  }
}

// Load and initialize HR Platform DB
loadHRPlatformDB();
initHRPlatformDB();

// Serve HR Platform static files
app.use('/platform', express.static(hrPlatformPath));

// HR Platform API routes (Demo Mode - no auth required)
app.get('/platform/api/employees', (req, res) => {
  res.json(hrPlatformDB.employees);
});

app.get('/platform/api/departments', (req, res) => {
  res.json(hrPlatformDB.departments);
});

app.get('/platform/api/teams', (req, res) => {
  res.json(hrPlatformDB.teams);
});

app.get('/platform/api/company', (req, res) => {
  res.json(hrPlatformDB.companies[0]);
});

app.get('/platform/api/dashboard/stats', (req, res) => {
  res.json({
    leave: { balance: 18, pending: 0, taken: 0 },
    expenses: { pending: 2, approved: 5, total: 450 },
    goals: { completed: 5, total: 8, progress: 62.5 },
    attendance: { rate: 98, present: 22, absent: 1, late: 2 }
  });
});

// HR Platform root route
app.get('/platform', (req, res) => {
  res.sendFile(path.join(hrPlatformPath, 'index.html'));
});

// ========== EP BOT TEMPLATE ROUTES ==========
// Template files mapping
const templateFiles = {
  // ========== WORD TEMPLATES (Fill In) ==========
  // These need to be filled in before submission
  'GP_Checklist_Template.docx': 'templates/GP Checklist - EP (New) - MDEC.docx',
  'MyFutureJobs_Expat_Form_Template.docx': 'templates/LAPORAN PENGAMBILAN PEKERJA TEMPATAN (Filled in) (1).docx',

  // ========== COMPANY DOCUMENTS (Download & Send to Agency) ==========
  // Ready to send - no filling needed
  'SSM_Documents.zip': '03_Company_Documents/2026_SSM_Docs_as_of_Mar_10_2026 (1).zip',
  'DBKL_License.pdf': '03_Company_Documents/DBKL_License.pdf',
  'JTKSM_Approval.pdf': '03_Company_Documents/JTKSM Approval.pdf',
  'SOCSO_Guide.pdf': '03_Company_Documents/SOCSO (Perkeso) approval. Steps (2025).pdf',
  
  // ========== REFERENCE EXAMPLE ==========
  // Filled example for reference
  'MyFutureJobs_Expat_Form_Example.pdf': '03_Company_Documents/Sustainability Data Analyst_72b9e4e7c14542d09b03fd4fbc04147b (1) (1).pdf',

  // ========== REFERENCE GUIDES (Optional Reading) ==========
  'PROGRESS_TRACKER.md': '02_Templates/PROGRESS_TRACKER.md',
  'DOCUMENT_CHECKLIST.md': '02_Templates/DOCUMENT_CHECKLIST.md',
  'EMAIL_TEMPLATES.md': '02_Templates/EMAIL_TEMPLATES.md',
  'MyFutureJobs_GUIDE.md': '02_Templates/MyFutureJobs_GUIDE.md',
  'INTERVIEW_TEMPLATE.md': '02_Templates/INTERVIEW_TEMPLATE.md',
  'TEMPLATES_README.md': '02_Templates/README.md'
};

// Serve template files for download
app.get('/api/templates', (req, res) => {
  res.json({
    templates: Object.keys(templateFiles).map(name => ({
      name,
      url: `/api/templates/${encodeURIComponent(name)}`,
      type: name.endsWith('.docx') ? 'Word Template' : 
             name.endsWith('.zip') || name.endsWith('.pdf') ? 'Company Document' : 'Reference Guide'
    }))
  });
});

app.get('/api/templates/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const relativePath = templateFiles[filename];
    
    if (!relativePath) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    const filePath = path.join(__dirname, relativePath);
    
    // Check if file exists
    await fsPromises.access(filePath);
    
    // Set appropriate headers based on file type
    let contentType = 'text/markdown';
    if (filename.endsWith('.docx')) {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (filename.endsWith('.pdf')) {
      contentType = 'application/pdf';
    } else if (filename.endsWith('.zip')) {
      contentType = 'application/zip';
    }
    
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', contentType);
    
    const fileContent = await fsPromises.readFile(filePath);
    res.send(fileContent);
  } catch (error) {
    console.error('Template error:', error);
    res.status(404).json({ error: 'Template not found' });
  }
});

app.post('/api/chat', upload.single('file'), async (req, res) => {
  try {
    const { message, context } = req.body;

    console.log(`[Chat] Message: ${message?.substring(0, 50)}...`);
    console.log(`[Chat] Context: ${context}`);
    console.log(`[Chat] File: ${req.file ? req.file.originalname : 'none'}`);

    // Check if uploaded file is an interview template (CSV/XLSX)
    if (req.file) {
      const fileName = req.file.originalname;
      const fileType = fileName.split('.').pop().toLowerCase();
      
      if ((fileType === 'csv' || fileType === 'xlsx') && 
          (fileName.toLowerCase().includes('interview') || 
           fileName.toLowerCase().includes('myfuturejobs') ||
           fileName.toLowerCase().includes('candidate'))) {
        // Redirect to interview template processor
        const filePath = req.file.path;
        
        // Read and process the file
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length >= 2) {
          const headers = jsonData[0];
          const candidates = jsonData.slice(1).filter(row => row.length > 0 && row[2]);
          
          if (candidates.length > 0) {
            const formattedCandidates = candidates.map((row, index) => ({
              bil: row[0] || (index + 1).toString(),
              icPassport: row[1] || '',
              nama: row[2] || '',
              telefon: row[3] || '',
              emel: row[4] || '',
              jantina: row[5] || '',
              pendidikan: row[6] || '',
              keputusan: row[7] || 'Tidak Berjaya',
              ulasan: row[8] || ''
            }));
            
            const summary = {
              totalCandidates: candidates.length,
              selected: candidates.filter(c => c[7] === 'Berjaya').length,
              notSelected: candidates.filter(c => c[7] === 'Tidak Berjaya').length
            };
            
            let candidateTable = '| BIL | IC/Passport | Nama | Telefon | Emel | Jantina | Pendidikan | Keputusan | Ulasan |\n';
            candidateTable += '|-----|-------------|------|---------|------|---------|------------|-----------|--------|\n';
            
            formattedCandidates.forEach(c => {
              candidateTable += `| ${c.bil} | ${c.icPassport} | ${c.nama} | ${c.telefon} | ${c.emel} | ${c.jantina} | ${c.pendidikan} | ${c.keputusan} | ${c.ulasan} |\n`;
            });
            
            const reply = `## ✅ Interview Template Processed Successfully!

**File:** ${fileName}
**Candidates Found:** ${summary.totalCandidates}

---

## 📊 **SUMMARY**

| Category | Count |
|----------|-------|
| **Total Interviewed** | ${summary.totalCandidates} |
| **Selected (Berjaya)** | ${summary.selected} |
| **Not Selected** | ${summary.notSelected} |

---

## 👥 **CANDIDATES**

${candidateTable}

---

## 📄 **NEXT: GENERATE OFFICIAL FORM**

Your data has been processed. Here's what to do next:

1. **Review** the candidate data above
2. **Confirm** all information is accurate
3. **Reply** with "Generate form" to create the official Interview Assessment Form

The generated form will include:
- Job details (Sustainability Data Analyst)
- Company information (Pantas Climate Solutions)
- All candidates from your template
- Ready for COO signature

---

**Need changes?** Upload a corrected file or tell me what to adjust!`;
            
            // Clean up and respond
            await fsPromises.unlink(filePath).catch(console.error);
            
            return res.json({ reply });
          }
        }
        
        // Clean up file if processing failed
        await fsPromises.unlink(filePath).catch(console.error);
      }
    }
    
    // Use keyword-based response
    let reply = analyzeMessage(message || '');

    // Add file-specific info if file uploaded
    if (req.file) {
      const fileName = req.file.originalname;
      const fileType = fileName.split('.').pop().toLowerCase();

      // Detect document type from filename
      let docType = 'Unknown';
      if (fileName.toLowerCase().includes('passport')) docType = 'Passport';
      else if (fileName.toLowerCase().includes('cv') || fileName.toLowerCase().includes('resume')) docType = 'CV';
      else if (fileName.toLowerCase().includes('cert')) docType = 'Certificate';
      else if (fileName.toLowerCase().includes('photo') || fileName.toLowerCase().includes('picture')) docType = 'Photo';
      else if (fileName.toLowerCase().includes('email')) docType = 'Email';

      reply += `\n\n📎 **File Detected:** ${fileName}\n**Type:** ${docType}\n\nI've noted this document. What would you like to do with it?`;

      // Clean up uploaded file
      await fsPromises.unlink(req.file.path).catch(console.error);
    }

    res.json({ reply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/myfuturejobs/template/csv
 * Download empty CSV template for interview tracking
 */
app.get('/api/myfuturejobs/template/csv', (req, res) => {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  
  // Define headers
  const headers = [
    'BIL',
    'IC/Passport',
    'Nama',
    'Telefon',
    'Emel',
    'Jantina',
    'Pendidikan',
    'Keputusan',
    'Ulasan'
  ];
  
  // Create sample data with example row
  const data = [
    headers,
    [
      '1',
      '900515-01-1234',
      'Ahmad bin Abdullah',
      '+60 12-345-6789',
      'ahmad@email.com',
      'Lelaki',
      'Bachelor Computer Science - UM',
      'Tidak Berjaya',
      'Lacks practical experience in SQL and Power BI'
    ]
  ];
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 5 },  // BIL
    { wch: 15 }, // IC/Passport
    { wch: 25 }, // Nama
    { wch: 15 }, // Telefon
    { wch: 25 }, // Emel
    { wch: 12 }, // Jantina
    { wch: 30 }, // Pendidikan
    { wch: 15 }, // Keputusan
    { wch: 40 }  // Ulasan
  ];
  
  // Add to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Interview Template');
  
  // Generate CSV
  const csv = XLSX.utils.sheet_to_csv(ws);
  
  // Send as download
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="MyFutureJobs_Interview_Template.csv"');
  res.send(csv);
});

/**
 * GET /api/myfuturejobs/template/xlsx
 * Download empty XLSX template for interview tracking
 */
app.get('/api/myfuturejobs/template/xlsx', (req, res) => {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  
  // Define headers
  const headers = [
    'BIL',
    'IC/Passport',
    'Nama',
    'Telefon',
    'Emel',
    'Jantina',
    'Pendidikan',
    'Keputusan',
    'Ulasan'
  ];
  
  // Create sample data with example row
  const data = [
    headers,
    [
      '1',
      '900515-01-1234',
      'Ahmad bin Abdullah',
      '+60 12-345-6789',
      'ahmad@email.com',
      'Lelaki',
      'Bachelor Computer Science - UM',
      'Tidak Berjaya',
      'Lacks practical experience in SQL and Power BI'
    ]
  ];
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 5 },  // BIL
    { wch: 15 }, // IC/Passport
    { wch: 25 }, // Nama
    { wch: 15 }, // Telefon
    { wch: 25 }, // Emel
    { wch: 12 }, // Jantina
    { wch: 30 }, // Pendidikan
    { wch: 15 }, // Keputusan
    { wch: 40 }  // Ulasan
  ];
  
  // Add header styling (merge row for title)
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }];
  
  // Add to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Interview Template');
  
  // Generate buffer
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  
  // Send as download
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="MyFutureJobs_Interview_Template.xlsx"');
  res.send(buffer);
});

/**
 * POST /api/myfuturejobs/process
 * Process uploaded CSV/XLSX interview template and generate report
 */
app.post('/api/myfuturejobs/process', upload.single('interviewFile'), async (req, res) => {
  const uploadedFiles = [];
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please upload your filled CSV or XLSX template.' });
    }
    
    const fileName = req.file.originalname;
    const fileType = fileName.split('.').pop().toLowerCase();
    const filePath = req.file.path;
    
    uploadedFiles.push(filePath);
    
    console.log(`[MyFutureJobs] Processing file: ${fileName} (${fileType})`);
    
    // Read the file based on type
    let workbook;
    if (fileType === 'csv') {
      workbook = XLSX.readFile(filePath, { type: 'string' });
    } else if (fileType === 'xlsx') {
      workbook = XLSX.readFile(filePath);
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Please upload CSV or XLSX.' });
    }
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length < 2) {
      return res.status(400).json({ error: 'File appears to be empty. Please fill in at least one candidate.' });
    }
    
    // Extract headers and data
    const headers = jsonData[0];
    const candidates = jsonData.slice(1).filter(row => row.length > 0 && row[2]); // Filter rows with names
    
    if (candidates.length === 0) {
      return res.status(400).json({ error: 'No candidate data found. Please fill in candidate information.' });
    }
    
    // Validate required columns
    const requiredColumns = ['BIL', 'IC/Passport', 'Nama', 'Keputusan'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      return res.status(400).json({ 
        error: `Missing required columns: ${missingColumns.join(', ')}. Please ensure your template has all required columns.` 
      });
    }
    
    // Format candidates for response
    const formattedCandidates = candidates.map((row, index) => ({
      bil: row[0] || (index + 1).toString(),
      icPassport: row[1] || '',
      nama: row[2] || '',
      telefon: row[3] || '',
      emel: row[4] || '',
      jantina: row[5] || '',
      pendidikan: row[6] || '',
      keputusan: row[7] || 'Tidak Berjaya',
      ulasan: row[8] || ''
    }));
    
    // Generate markdown table
    let candidateTable = '| BIL | IC/Passport | Nama | Telefon | Emel | Jantina | Pendidikan | Keputusan | Ulasan |\n';
    candidateTable += '|-----|-------------|------|---------|------|---------|------------|-----------|--------|\n';
    
    formattedCandidates.forEach(c => {
      candidateTable += `| ${c.bil} | ${c.icPassport} | ${c.nama} | ${c.telefon} | ${c.emel} | ${c.jantina} | ${c.pendidikan} | ${c.keputusan} | ${c.ulasan} |\n`;
    });
    
    // Generate response
    const summary = {
      totalCandidates: candidates.length,
      selected: candidates.filter(c => c[7] === 'Berjaya').length,
      notSelected: candidates.filter(c => c[7] === 'Tidak Berjaya').length
    };
    
    const reply = `## ✅ Interview Template Processed Successfully!

**File:** ${fileName}
**Candidates Found:** ${summary.totalCandidates}

---

## 📊 **SUMMARY**

| Category | Count |
|----------|-------|
| **Total Interviewed** | ${summary.totalCandidates} |
| **Selected (Berjaya)** | ${summary.selected} |
| **Not Selected** | ${summary.notSelected} |

---

## 👥 **CANDIDATES**

${candidateTable}

---

## 📄 **NEXT: GENERATE OFFICIAL FORM**

Your data has been processed. Here's what to do next:

1. **Review** the candidate data above
2. **Confirm** all information is accurate
3. **Reply** with "Generate form" to create the official Interview Assessment Form

The generated form will include:
- Job details (Sustainability Data Analyst)
- Company information (Pantas Climate Solutions)
- All candidates from your template
- Ready for COO signature

---

**Need changes?** Upload a corrected file or tell me what to adjust!`;

    // Clean up uploaded file
    await fsPromises.unlink(filePath).catch(console.error);
    
    res.json({
      success: true,
      candidates: formattedCandidates,
      summary,
      reply
    });
    
  } catch (error) {
    console.error("Processing Error:", error);
    
    for (const filePath of uploadedFiles) {
      await fsPromises.unlink(filePath).catch(() => {});
    }
    
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`HR Bot Chat Server running at http://localhost:${PORT}`);
});

/**
 * POST /api/process-candidate
 * Simplified workflow without AI extraction
 */
app.post('/api/process-candidate', upload.fields([
  { name: 'passport', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'certificates', maxCount: 10 },
  { name: 'photo', maxCount: 1 }
]), async (req, res) => {
  const uploadedFiles = [];
  
  try {
    console.log('\n========== CANDIDATE PROCESSING ==========\n');
    
    // Detect uploaded documents
    const documents = {
      passport: req.files.passport && req.files.passport[0],
      cv: req.files.cv && req.files.cv[0],
      certificates: req.files.certificates || [],
      photo: req.files.photo && req.files.photo[0]
    };
    
    // Check what was uploaded
    const uploaded = [];
    if (documents.passport) {
      uploaded.push('Passport');
      uploadedFiles.push(documents.passport.path);
    }
    if (documents.cv) {
      uploaded.push('CV');
      uploadedFiles.push(documents.cv.path);
    }
    if (documents.certificates.length > 0) {
      uploaded.push(`${documents.certificates.length} Certificate(s)`);
      documents.certificates.forEach(f => uploadedFiles.push(f.path));
    }
    if (documents.photo) {
      uploaded.push('Photo');
      uploadedFiles.push(documents.photo.path);
    }
    
    // Clean up files
    for (const filePath of uploadedFiles) {
      await fsPromises.unlink(filePath).catch(console.error);
    }
    
    // Provide checklist response
    const reply = `## ✅ Documents Received

**Uploaded:** ${uploaded.join(', ')}

**⚠️ Note:** Full AI extraction requires API key.

**Manual Processing Checklist:**

### Passport
- [ ] Check validity (15+ months)
- [ ] Extract: Name, Number, Nationality, Expiry

### CV
- [ ] Check for Malaysian work experience
- [ ] Extract: Education, Experience, Skills

### Certificates
- [ ] Verify CTC stamps visible
- [ ] Extract: Institution, Degree, Date

### Photo
- [ ] Check light blue background
- [ ] Check neutral expression

**Next Steps:**
1. Manually verify documents meet requirements
2. Use docs/DOCUMENT_CHECKLIST.md for full checklist
3. Use docs/EMAIL_TEMPLATES.md for communication
4. Contact ${companyInfo.cooEmail} for company documents

**Test Data:** Use Test_Data/ folders for testing`;

    console.log('========== PROCESSING COMPLETE ==========\n');

    res.json({
      success: true,
      audit_status: 'PENDING_MANUAL_REVIEW',
      documents_received: uploaded,
      message: reply
    });

  } catch (error) {
    console.error("Processing Error:", error);
    
    for (const filePath of uploadedFiles) {
      await fsPromises.unlink(filePath).catch(()=>{});
    }
    
    res.status(500).json({ 
      error: error.message,
      success: false
    });
  }
});
