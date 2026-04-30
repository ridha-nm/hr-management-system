const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'pantas-hr-team-secret-key-2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// EP Agent paths (defined before use)
const epBotFullPath = path.join(__dirname, '..', '01 - EP Application Agent');
const epBotPath = path.join(epBotFullPath, 'public');

// Serve EP Agent files
app.use('/ep', express.static(epBotPath));
app.get('/chat.html', (req, res) => res.sendFile(path.join(epBotPath, 'chat.html')));

// EP Agent API proxy (simple implementation)
const epBotServer = require('express')();
const multer = require('multer');
const XLSX = require('xlsx');
const { analyzeMessage, companyInfo } = require(path.join(epBotFullPath, 'src', 'keywordBot'));

const upload = multer({ dest: 'temp_docs/uploads/' });
epBotServer.use(cors());
epBotServer.use(express.json());
epBotServer.use(express.static(path.join(epBotFullPath, 'public')));
epBotServer.post('/api/chat', upload.single('file'), async (req, res) => {
  try {
    const { message, context } = req.body;
    let reply = analyzeMessage(message || '');
    if (req.file) {
      const fileName = req.file.originalname;
      const fileType = fileName.split('.').pop().toLowerCase();
      let docType = 'Unknown';
      if (fileName.toLowerCase().includes('passport')) docType = 'Passport';
      else if (fileName.toLowerCase().includes('cv') || fileName.toLowerCase().includes('resume')) docType = 'CV';
      else if (fileName.toLowerCase().includes('cert')) docType = 'Certificate';
      else if (fileName.toLowerCase().includes('photo')) docType = 'Photo';
      else if (fileName.toLowerCase().includes('email')) docType = 'Email';
      reply += `\n\n📎 **File Detected:** ${fileName}\n**Type:** ${docType}`;
      require('fs').promises.unlink(req.file.path).catch(console.error);
    }
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EP Agent template endpoints
epBotServer.get('/api/templates', (req, res) => {
  const templateFiles = {
    'MyFutureJobs_Expat_Form_Template.docx': 'templates/LAPORAN PENGAMBILAN PEKERJA TEMPATAN (Filled in) (1).docx',
    'GP_Checklist_Template.docx': 'templates/GP Checklist - EP (New) - MDEC.docx',
    'SSM_Documents.zip': '03_Company_Documents/2026_SSM_Docs_as_of_Mar_10_2026 (1).zip',
    'DBKL_License.pdf': '03_Company_Documents/DBKL_License.pdf',
    'JTKSM_Approval.pdf': '03_Company_Documents/JTKSM Approval.pdf',
    'SOCSO_Guide.pdf': '03_Company_Documents/SOCSO (Perkeso) approval. Steps (2025).pdf',
    'MyFutureJobs_Expat_Form_Example.pdf': '03_Company_Documents/Sustainability Data Analyst_72b9e4e7c14542d09b03fd4fbc04147b (1) (1).pdf'
  };
  res.json({ templates: Object.keys(templateFiles).map(name => ({ name, url: `/api/templates/${encodeURIComponent(name)}` })) });
});

epBotServer.get('/api/templates/:filename', async (req, res) => {
  const templateFiles = {
    'MyFutureJobs_Expat_Form_Template.docx': 'templates/LAPORAN PENGAMBILAN PEKERJA TEMPATAN (Filled in) (1).docx',
    'GP_Checklist_Template.docx': 'templates/GP Checklist - EP (New) - MDEC.docx',
    'SSM_Documents.zip': '03_Company_Documents/2026_SSM_Docs_as_of_Mar_10_2026 (1).zip',
    'DBKL_License.pdf': '03_Company_Documents/DBKL_License.pdf',
    'JTKSM_Approval.pdf': '03_Company_Documents/JTKSM Approval.pdf',
    'SOCSO_Guide.pdf': '03_Company_Documents/SOCSO (Perkeso) approval. Steps (2025).pdf',
    'MyFutureJobs_Expat_Form_Example.pdf': '03_Company_Documents/Sustainability Data Analyst_72b9e4e7c14542d09b03fd4fbc04147b (1) (1).pdf'
  };
  const filename = req.params.filename;
  const relativePath = templateFiles[filename];
  if (!relativePath) return res.status(404).json({ error: 'Template not found' });
  const filePath = path.join(epBotFullPath, relativePath);
  try {
    await require('fs').promises.access(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    const fileContent = await require('fs').promises.readFile(filePath);
    res.send(fileContent);
  } catch (error) {
    res.status(404).json({ error: 'Template not found' });
  }
});

// MyFutureJobs template endpoints
epBotServer.get('/api/myfuturejobs/template/csv', (req, res) => {
  const wb = XLSX.utils.book_new();
  const headers = ['BIL', 'IC/Passport', 'Nama', 'Telefon', 'Emel', 'Jantina', 'Pendidikan', 'Keputusan', 'Ulasan'];
  const data = [headers, ['1', '900515-01-1234', 'Ahmad bin Abdullah', '+60 12-345-6789', 'ahmad@email.com', 'Lelaki', 'Bachelor Computer Science - UM', 'Tidak Berjaya', 'Lacks practical experience in SQL and Power BI']];
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Interview Template');
  const csv = XLSX.utils.sheet_to_csv(ws);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="MyFutureJobs_Interview_Template.csv"');
  res.send(csv);
});

epBotServer.get('/api/myfuturejobs/template/xlsx', (req, res) => {
  const wb = XLSX.utils.book_new();
  const headers = ['BIL', 'IC/Passport', 'Nama', 'Telefon', 'Emel', 'Jantina', 'Pendidikan', 'Keputusan', 'Ulasan'];
  const data = [headers, ['1', '900515-01-1234', 'Ahmad bin Abdullah', '+60 12-345-6789', 'ahmad@email.com', 'Lelaki', 'Bachelor Computer Science - UM', 'Tidak Berjaya', 'Lacks practical experience in SQL and Power BI']];
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Interview Template');
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="MyFutureJobs_Interview_Template.xlsx"');
  res.send(buffer);
});

// Mount EP Bot API
app.use('/ep-api', epBotServer);

// Mirror EP API at /api/* so chat.html calls work without path changes
const epTemplateFiles = {
  'MyFutureJobs_Expat_Form_Template.docx': 'templates/LAPORAN PENGAMBILAN PEKERJA TEMPATAN (Filled in) (1).docx',
  'GP_Checklist_Template.docx': 'templates/GP Checklist - EP (New) - MDEC.docx',
  'SSM_Documents.zip': '03_Company_Documents/2026_SSM_Docs_as_of_Mar_10_2026 (1).zip',
  'DBKL_License.pdf': '03_Company_Documents/DBKL_License.pdf',
  'JTKSM_Approval.pdf': '03_Company_Documents/JTKSM Approval.pdf',
  'SOCSO_Guide.pdf': '03_Company_Documents/SOCSO (Perkeso) approval. Steps (2025).pdf',
  'MyFutureJobs_Expat_Form_Example.pdf': '03_Company_Documents/Sustainability Data Analyst_72b9e4e7c14542d09b03fd4fbc04147b (1) (1).pdf'
};

app.post('/api/chat', upload.single('file'), async (req, res) => {
  try {
    const { message } = req.body;
    let reply = analyzeMessage(message || '');
    if (req.file) {
      const fileName = req.file.originalname;
      let docType = 'Unknown';
      if (fileName.toLowerCase().includes('passport')) docType = 'Passport';
      else if (/cv|resume/i.test(fileName)) docType = 'CV';
      else if (fileName.toLowerCase().includes('cert')) docType = 'Certificate';
      else if (fileName.toLowerCase().includes('photo')) docType = 'Photo';
      reply += `\n\n📎 **File Detected:** ${fileName}\n**Type:** ${docType}`;
      fs.promises.unlink(req.file.path).catch(console.error);
    }
    res.json({ reply });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/templates', (req, res) => {
  res.json({ templates: Object.keys(epTemplateFiles).map(name => ({ name, url: `/api/templates/${encodeURIComponent(name)}` })) });
});

app.get('/api/templates/:filename', async (req, res) => {
  const rel = epTemplateFiles[req.params.filename];
  if (!rel) return res.status(404).json({ error: 'Not found' });
  const filePath = path.join(epBotFullPath, rel);
  try {
    await fs.promises.access(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`);
    res.send(await fs.promises.readFile(filePath));
  } catch { res.status(404).json({ error: 'File not found on disk' }); }
});

app.get('/api/myfuturejobs/template/csv', (req, res) => {
  const wb = XLSX.utils.book_new();
  const headers = ['BIL','IC/Passport','Nama','Telefon','Emel','Jantina','Pendidikan','Keputusan','Ulasan'];
  const ws = XLSX.utils.aoa_to_sheet([headers, ['1','900515-01-1234','Ahmad bin Abdullah','+60 12-345-6789','ahmad@email.com','Lelaki','Bachelor Computer Science - UM','Tidak Berjaya','Lacks SQL/Power BI experience']]);
  XLSX.utils.book_append_sheet(wb, ws, 'Interview Template');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="MyFutureJobs_Interview_Template.csv"');
  res.send(XLSX.utils.sheet_to_csv(ws));
});

app.get('/api/myfuturejobs/template/xlsx', (req, res) => {
  const wb = XLSX.utils.book_new();
  const headers = ['BIL','IC/Passport','Nama','Telefon','Emel','Jantina','Pendidikan','Keputusan','Ulasan'];
  const ws = XLSX.utils.aoa_to_sheet([headers, ['1','900515-01-1234','Ahmad bin Abdullah','+60 12-345-6789','ahmad@email.com','Lelaki','Bachelor Computer Science - UM','Tidak Berjaya','Lacks SQL/Power BI experience']]);
  XLSX.utils.book_append_sheet(wb, ws, 'Interview Template');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="MyFutureJobs_Interview_Template.xlsx"');
  res.send(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
});

// ── Onboarding Agent ──
const onboardingAgentPath = path.join(__dirname, '..', '02 - Onboarding Agent');
const onboardingPublicPath = path.join(onboardingAgentPath, 'public');
const onboardingDataFile = path.join(onboardingAgentPath, 'data', 'onboardings.json');

if (!fs.existsSync(path.join(onboardingAgentPath, 'data'))) {
  fs.mkdirSync(path.join(onboardingAgentPath, 'data'), { recursive: true });
}

const { processMessage: obProcessMessage, calcProgress: obCalcProgress } = require(path.join(onboardingAgentPath, 'src', 'onboardingBot'));

// ── Standup Agent ──
const standupManagerPath = path.join(__dirname, '..', '03 - Standup Agent', 'src', 'standupManager');
const { createSession: sdCreateSession, markAttendance: sdMarkAttendance, submitUpdate: sdSubmitUpdate, closeSession: sdCloseSession, calcAnalytics: sdCalcAnalytics, getTodayKey: sdGetTodayKey } = require(standupManagerPath);

const SD_DATA_DIR = path.join(__dirname, '..', '03 - Standup Agent', 'data');
if (!fs.existsSync(SD_DATA_DIR)) fs.mkdirSync(SD_DATA_DIR, { recursive: true });

function loadSDFile(file) {
  const fp = path.join(SD_DATA_DIR, file);
  if (!fs.existsSync(fp)) return [];
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { return []; }
}
function saveSDFile(file, data) {
  fs.writeFileSync(path.join(SD_DATA_DIR, file), JSON.stringify(data, null, 2));
}

function loadOnboardings() {
  if (!fs.existsSync(onboardingDataFile)) return [];
  try { return JSON.parse(fs.readFileSync(onboardingDataFile, 'utf8')); }
  catch { return []; }
}
function saveOnboardings(data) { fs.writeFileSync(onboardingDataFile, JSON.stringify(data, null, 2)); }

app.use('/onboarding', express.static(onboardingPublicPath));

const obRouter = require('express').Router();

obRouter.post('/chat', (req, res) => {
  const { message, sessionId, activeOnboardingId } = req.body;
  const onboardings = loadOnboardings();
  const result = obProcessMessage(message, sessionId, onboardings, activeOnboardingId || null);
  if (result.newOnboarding) { onboardings.push(result.newOnboarding); saveOnboardings(onboardings); }
  res.json({ reply: result.reply, quickReplies: result.quickReplies || [], activeOnboarding: result.activeOnboarding || null, action: result.action || null });
});

obRouter.get('/onboardings', (req, res) => {
  const list = loadOnboardings();
  res.json(list.map(o => ({ ...o, progress: obCalcProgress(o) })));
});
obRouter.get('/onboardings/:id', (req, res) => {
  const o = loadOnboardings().find(o => o.id === req.params.id);
  if (!o) return res.status(404).json({ error: 'Not found' });
  res.json({ ...o, progress: obCalcProgress(o) });
});
obRouter.patch('/onboardings/:id/setup/:item', (req, res) => {
  const list = loadOnboardings(); const o = list.find(o => o.id === req.params.id);
  if (!o) return res.status(404).json({ error: 'Not found' });
  if (req.params.item in o.setup) { o.setup[req.params.item] = !o.setup[req.params.item]; saveOnboardings(list); }
  res.json({ ...o, progress: obCalcProgress(o) });
});
obRouter.patch('/onboardings/:id/academy/:module', (req, res) => {
  const list = loadOnboardings(); const o = list.find(o => o.id === req.params.id);
  if (!o) return res.status(404).json({ error: 'Not found' });
  const { field } = req.body;
  if (o.academy[req.params.module] && field in o.academy[req.params.module]) { o.academy[req.params.module][field] = !o.academy[req.params.module][field]; saveOnboardings(list); }
  res.json({ ...o, progress: obCalcProgress(o) });
});
obRouter.patch('/onboardings/:id/documents/:item', (req, res) => {
  const list = loadOnboardings(); const o = list.find(o => o.id === req.params.id);
  if (!o) return res.status(404).json({ error: 'Not found' });
  if (req.params.item in o.documents) { o.documents[req.params.item] = !o.documents[req.params.item]; saveOnboardings(list); }
  res.json({ ...o, progress: obCalcProgress(o) });
});
obRouter.patch('/onboardings/:id/day1', (req, res) => {
  const list = loadOnboardings(); const o = list.find(o => o.id === req.params.id);
  if (!o) return res.status(404).json({ error: 'Not found' });
  o.day1Completed = !o.day1Completed; saveOnboardings(list);
  res.json({ ...o, progress: obCalcProgress(o) });
});

app.use('/onboarding-api', obRouter);

// ── Standup Router ──
const sdRouter = express.Router();

sdRouter.get('/team', (req, res) => res.json(loadSDFile('team.json')));

sdRouter.post('/team', (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) return res.status(400).json({ error: 'name and role required' });
  const team = loadSDFile('team.json');
  const id = 'BD' + String(team.length + 1).padStart(3, '0');
  const member = { id, name, role };
  team.push(member);
  saveSDFile('team.json', team);
  res.status(201).json(member);
});

sdRouter.delete('/team/:id', (req, res) => {
  let team = loadSDFile('team.json');
  const len = team.length;
  team = team.filter(m => m.id !== req.params.id);
  if (team.length === len) return res.status(404).json({ error: 'Not found' });
  saveSDFile('team.json', team);
  res.json({ ok: true });
});

sdRouter.get('/sessions', (req, res) => {
  const sessions = loadSDFile('standups.json');
  res.json(sessions.slice().sort((a, b) => b.date.localeCompare(a.date)));
});

sdRouter.get('/sessions/today', (req, res) => {
  const today = sdGetTodayKey();
  const sessions = loadSDFile('standups.json');
  const session = sessions.find(s => s.date === today) || null;
  res.json(session);
});

sdRouter.post('/sessions', (req, res) => {
  const today = sdGetTodayKey();
  const sessions = loadSDFile('standups.json');
  if (sessions.find(s => s.date === today)) {
    return res.status(409).json({ error: 'Session already exists for today' });
  }
  const team = loadSDFile('team.json');
  const session = sdCreateSession(today, team);
  sessions.push(session);
  saveSDFile('standups.json', sessions);
  res.status(201).json(session);
});

sdRouter.get('/sessions/:id', (req, res) => {
  const sessions = loadSDFile('standups.json');
  const session = sessions.find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Not found' });
  res.json(session);
});

sdRouter.patch('/sessions/:id/attendance', (req, res) => {
  const { memberId, status } = req.body;
  if (!memberId || !status) return res.status(400).json({ error: 'memberId and status required' });
  const sessions = loadSDFile('standups.json');
  const idx = sessions.findIndex(s => s.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  sdMarkAttendance(sessions[idx], memberId, status);
  saveSDFile('standups.json', sessions);
  res.json(sessions[idx]);
});

sdRouter.post('/sessions/:id/updates', (req, res) => {
  const { memberId, yesterday, today, blockers, tickets } = req.body;
  if (!memberId) return res.status(400).json({ error: 'memberId required' });
  const sessions = loadSDFile('standups.json');
  const idx = sessions.findIndex(s => s.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  sdSubmitUpdate(sessions[idx], memberId, { yesterday, today, blockers, tickets });
  if (blockers && blockers.trim()) {
    const blockerList = loadSDFile('blockers.json');
    blockerList.push({
      id: 'BLK_' + Date.now(),
      text: blockers.trim(),
      memberId,
      sessionId: req.params.id,
      tickets: tickets || [],
      status: 'open',
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().slice(0, 10)
    });
    saveSDFile('blockers.json', blockerList);
  }
  saveSDFile('standups.json', sessions);
  res.json(sessions[idx]);
});

sdRouter.patch('/sessions/:id/close', (req, res) => {
  const sessions = loadSDFile('standups.json');
  const idx = sessions.findIndex(s => s.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  const team = loadSDFile('team.json');
  sdCloseSession(sessions[idx], team);
  saveSDFile('standups.json', sessions);
  res.json(sessions[idx]);
});

sdRouter.get('/blockers', (req, res) => res.json(loadSDFile('blockers.json')));

sdRouter.post('/blockers', (req, res) => {
  const { text, memberId, sessionId, tickets, date } = req.body;
  if (!text || !memberId) return res.status(400).json({ error: 'text and memberId required' });
  const blockers = loadSDFile('blockers.json');
  const blocker = {
    id: 'BLK_' + Date.now(),
    text,
    memberId,
    sessionId: sessionId || null,
    tickets: tickets || [],
    status: 'open',
    createdAt: new Date().toISOString(),
    date: date || new Date().toISOString().slice(0, 10)
  };
  blockers.push(blocker);
  saveSDFile('blockers.json', blockers);
  res.status(201).json(blocker);
});

sdRouter.patch('/blockers/:id/resolve', (req, res) => {
  const blockers = loadSDFile('blockers.json');
  const idx = blockers.findIndex(b => b.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  blockers[idx].status = 'resolved';
  blockers[idx].resolvedAt = new Date().toISOString();
  saveSDFile('blockers.json', blockers);
  res.json(blockers[idx]);
});

sdRouter.get('/analytics', (req, res) => {
  const sessions = loadSDFile('standups.json');
  const team = loadSDFile('team.json');
  res.json(sdCalcAnalytics(sessions, team));
});

app.use('/standup-api', sdRouter);

app.use(express.static('public'));
app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Database folder
const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Simple file-based database
const db = {
  users: [],
  companies: [],
  employees: [],
  departments: [],
  teams: []
};

// Load data from files
function loadDB() {
  try {
    ['users', 'companies', 'employees', 'departments', 'teams'].forEach(table => {
      const file = path.join(DB_DIR, `${table}.json`);
      if (fs.existsSync(file)) {
        db[table] = JSON.parse(fs.readFileSync(file, 'utf8'));
      }
    });
    console.log('✅ Database loaded');
  } catch (error) {
    console.error('Error loading database:', error);
  }
}

// Save data to files
function saveDB(table) {
  try {
    const file = path.join(DB_DIR, `${table}.json`);
    fs.writeFileSync(file, JSON.stringify(db[table], null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Initialize default data
function initDB() {
  if (db.users.length === 0) {
    // Create admin user
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.users.push({
      id: 'USR001',
      email: 'admin@pantas.com',
      password: hashedPassword,
      role: 'admin',
      employeeId: 'EMP001',
      createdAt: new Date().toISOString()
    });
    saveDB('users');

    // Create default company
    db.companies.push({
      id: 'COMP001',
      name: 'Pantas Climate Solutions',
      totalEmployees: 32,
      createdAt: new Date().toISOString()
    });
    saveDB('companies');

    // Create departments
    db.departments = [
      { id: 'DEPT001', name: 'Engineering', headcount: 12 },
      { id: 'DEPT002', name: 'Sales', headcount: 8 },
      { id: 'DEPT003', name: 'Marketing', headcount: 5 },
      { id: 'DEPT004', name: 'HR', headcount: 3 },
      { id: 'DEPT005', name: 'Finance', headcount: 4 }
    ];
    saveDB('departments');

    // Create sample employees
    db.employees = [
      {
        id: 'EMP001',
        name: 'Ahmad Abdullah',
        email: 'ahmad@pantas.com',
        department: 'Engineering',
        designation: 'Software Engineer',
        manager: 'EMP005',
        joinDate: '2024-01-15',
        status: 'Active',
        phone: '+60 12-345-6789',
        location: 'Kuala Lumpur',
        employmentType: 'Full-time',
        workArrangement: 'Hybrid',
        leaveBalance: 14,
        avatar: '👨‍💻'
      },
      {
        id: 'EMP002',
        name: 'Sarah Chen',
        email: 'sarah@pantas.com',
        department: 'Engineering',
        designation: 'Senior Software Engineer',
        manager: 'EMP005',
        joinDate: '2023-06-01',
        status: 'Active',
        phone: '+60 12-345-6790',
        location: 'Kuala Lumpur',
        employmentType: 'Full-time',
        workArrangement: 'Hybrid',
        leaveBalance: 16,
        avatar: '👩‍💻'
      },
      {
        id: 'EMP003',
        name: 'Syaheedah',
        email: 'syaheedah@pantas.com',
        department: 'HR',
        designation: 'COO',
        manager: null,
        joinDate: '2022-01-01',
        status: 'Active',
        phone: '+60 12-345-6791',
        location: 'Kuala Lumpur',
        employmentType: 'Full-time',
        workArrangement: 'Hybrid',
        leaveBalance: 18,
        avatar: '👩‍💼'
      },
      {
        id: 'EMP004',
        name: 'Ridham Mohamed',
        email: 'ridham@pantas.com',
        department: 'Engineering',
        designation: 'Lead Engineer',
        manager: 'EMP005',
        joinDate: '2023-03-15',
        status: 'Active',
        phone: '+60 12-345-6792',
        location: 'Kuala Lumpur',
        employmentType: 'Full-time',
        workArrangement: 'Hybrid',
        leaveBalance: 15,
        avatar: '👨‍💼'
      },
      {
        id: 'EMP005',
        name: 'David Tan',
        email: 'david@pantas.com',
        department: 'Engineering',
        designation: 'Engineering Manager',
        manager: 'EMP003',
        joinDate: '2022-06-01',
        status: 'Active',
        phone: '+60 12-345-6793',
        location: 'Kuala Lumpur',
        employmentType: 'Full-time',
        workArrangement: 'Hybrid',
        leaveBalance: 17,
        avatar: '👨‍🔧'
      }
    ];
    saveDB('employees');

    // Create teams
    db.teams = [
      { id: 'TEAM001', name: 'Backend Team', department: 'Engineering', lead: 'EMP005', members: ['EMP001', 'EMP002', 'EMP004'] },
      { id: 'TEAM002', name: 'Frontend Team', department: 'Engineering', lead: 'EMP002', members: ['EMP001', 'EMP004'] },
      { id: 'TEAM003', name: 'Sales Team', department: 'Sales', lead: null, members: [] },
      { id: 'TEAM004', name: 'HR Team', department: 'HR', lead: 'EMP003', members: ['EMP003'] }
    ];
    saveDB('teams');

    console.log('✅ Default data initialized');
  }
}

// Auth middleware
function authMiddleware(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// ========== AUTH ROUTES ==========

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'employee' } = req.body;
    
    // Check if user exists
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: `USR${String(db.users.length + 1).padStart(3, '0')}`,
      email,
      password: hashedPassword,
      role,
      name,
      createdAt: new Date().toISOString()
    };

    db.users.push(user);
    saveDB('users');

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    req.session.userId = user.id;

    res.json({ success: true, token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    req.session.userId = user.id;

    // Get employee details if exists
    const employee = db.employees.find(e => e.id === user.employeeId);

    res.json({ 
      success: true, 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        employeeId: user.employeeId,
        employee
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = db.users.find(u => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const employee = db.employees.find(e => e.id === user.employeeId);
  res.json({ 
    user: { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      employeeId: user.employeeId
    },
    employee
  });
});

// ========== EMPLOYEE ROUTES ==========

app.get('/api/employees', (req, res) => {
  res.json(db.employees);
});

app.get('/api/employees/:id', (req, res) => {
  const employee = db.employees.find(e => e.id === req.params.id);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  res.json(employee);
});

app.get('/api/employees/stats/summary', (req, res) => {
  const stats = {
    total: db.employees.length,
    byDepartment: {},
    byLocation: {},
    byEmploymentType: {}
  };

  db.employees.forEach(emp => {
    stats.byDepartment[emp.department] = (stats.byDepartment[emp.department] || 0) + 1;
    stats.byLocation[emp.location] = (stats.byLocation[emp.location] || 0) + 1;
    stats.byEmploymentType[emp.employmentType] = (stats.byEmploymentType[emp.employmentType] || 0) + 1;
  });

  res.json(stats);
});

// ========== DEPARTMENT ROUTES ==========

app.get('/api/departments', (req, res) => {
  res.json(db.departments);
});

// ========== COMPANY ROUTES ==========

app.get('/api/company', (req, res) => {
  res.json(db.companies[0]);
});

// ========== TEAM ROUTES ==========

app.get('/api/teams', (req, res) => {
  res.json(db.teams);
});

app.get('/api/teams/:id', (req, res) => {
  const team = db.teams.find(t => t.id === req.params.id);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  
  // Get team members details
  const members = team.members.map(memberId => db.employees.find(e => e.id === memberId)).filter(Boolean);
  const lead = team.lead ? db.employees.find(e => e.id === team.lead) : null;
  
  res.json({ ...team, members, lead });
});

// ========== DASHBOARD ROUTES ==========

app.get('/api/dashboard/stats', (req, res) => {
  const employee = db.employees[0];

  const stats = {
    leave: {
      balance: employee?.leaveBalance || 0,
      pending: 0,
      taken: 0
    },
    expenses: {
      pending: 2,
      approved: 5,
      total: 450
    },
    goals: {
      completed: 5,
      total: 8,
      progress: 62.5
    },
    attendance: {
      rate: 98,
      present: 22,
      absent: 1,
      late: 2
    }
  };

  res.json(stats);
});

// Initialize database
loadDB();
initDB();

// Serve main app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Pantas HR Platform running at http://localhost:${PORT}`);
  console.log(`\n📊 Default Admin:`);
  console.log(`   Email: admin@pantas.com`);
  console.log(`   Password: admin123\n`);
});
