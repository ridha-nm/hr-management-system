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
app.use('/chat.html', express.static(path.join(epBotFullPath, 'public', 'chat.html')));
app.use('/api', express.static(path.join(epBotFullPath, 'public')));

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

app.get('/api/employees', authMiddleware, (req, res) => {
  res.json(db.employees);
});

app.get('/api/employees/:id', authMiddleware, (req, res) => {
  const employee = db.employees.find(e => e.id === req.params.id);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  res.json(employee);
});

app.get('/api/employees/stats/summary', authMiddleware, (req, res) => {
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

app.get('/api/departments', authMiddleware, (req, res) => {
  res.json(db.departments);
});

// ========== COMPANY ROUTES ==========

app.get('/api/company', authMiddleware, (req, res) => {
  res.json(db.companies[0]);
});

// ========== TEAM ROUTES ==========

app.get('/api/teams', authMiddleware, (req, res) => {
  res.json(db.teams);
});

app.get('/api/teams/:id', authMiddleware, (req, res) => {
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

app.get('/api/dashboard/stats', authMiddleware, (req, res) => {
  const user = db.users.find(u => u.id === req.session.userId);
  const employee = db.employees.find(e => e.id === user.employeeId);

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
