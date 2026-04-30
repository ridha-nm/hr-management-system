'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const {
  getTodayKey,
  createSession,
  markAttendance,
  submitUpdate,
  closeSession,
  calcAnalytics
} = require('./src/standupManager');

const app = express();
const PORT = 3003;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(express.json());

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function loadFile(file) {
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(fp)) return [];
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { return []; }
}

function saveFile(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

const router = express.Router();

// ── Team ──────────────────────────────────────────────────
router.get('/team', (req, res) => {
  res.json(loadFile('team.json'));
});

router.post('/team', (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) return res.status(400).json({ error: 'name and role required' });
  const team = loadFile('team.json');
  const id = 'BD' + String(team.length + 1).padStart(3, '0');
  const member = { id, name, role };
  team.push(member);
  saveFile('team.json', team);
  res.status(201).json(member);
});

router.delete('/team/:id', (req, res) => {
  let team = loadFile('team.json');
  const len = team.length;
  team = team.filter(m => m.id !== req.params.id);
  if (team.length === len) return res.status(404).json({ error: 'Not found' });
  saveFile('team.json', team);
  res.json({ ok: true });
});

// ── Sessions ──────────────────────────────────────────────
router.get('/sessions', (req, res) => {
  const sessions = loadFile('standups.json');
  res.json(sessions.slice().sort((a, b) => b.date.localeCompare(a.date)));
});

router.get('/sessions/today', (req, res) => {
  const today = getTodayKey();
  const sessions = loadFile('standups.json');
  const session = sessions.find(s => s.date === today) || null;
  res.json(session);
});

router.post('/sessions', (req, res) => {
  const today = getTodayKey();
  const sessions = loadFile('standups.json');
  if (sessions.find(s => s.date === today)) {
    return res.status(409).json({ error: 'Session already exists for today' });
  }
  const team = loadFile('team.json');
  const session = createSession(today, team);
  sessions.push(session);
  saveFile('standups.json', sessions);
  res.status(201).json(session);
});

router.get('/sessions/:id', (req, res) => {
  const sessions = loadFile('standups.json');
  const session = sessions.find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Not found' });
  res.json(session);
});

router.patch('/sessions/:id/attendance', (req, res) => {
  const { memberId, status } = req.body;
  if (!memberId || !status) return res.status(400).json({ error: 'memberId and status required' });
  const sessions = loadFile('standups.json');
  const idx = sessions.findIndex(s => s.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  markAttendance(sessions[idx], memberId, status);
  saveFile('standups.json', sessions);
  res.json(sessions[idx]);
});

router.post('/sessions/:id/updates', (req, res) => {
  const { memberId, yesterday, today, blockers, tickets } = req.body;
  if (!memberId) return res.status(400).json({ error: 'memberId required' });
  const sessions = loadFile('standups.json');
  const idx = sessions.findIndex(s => s.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  submitUpdate(sessions[idx], memberId, { yesterday, today, blockers, tickets });
  // Auto-create blocker entry if blockers field is non-empty
  if (blockers && blockers.trim()) {
    const blockerList = loadFile('blockers.json');
    const blocker = {
      id: 'BLK_' + Date.now(),
      text: blockers.trim(),
      memberId,
      sessionId: req.params.id,
      tickets: tickets || [],
      status: 'open',
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().slice(0, 10)
    };
    blockerList.push(blocker);
    saveFile('blockers.json', blockerList);
  }
  saveFile('standups.json', sessions);
  res.json(sessions[idx]);
});

router.patch('/sessions/:id/close', (req, res) => {
  const sessions = loadFile('standups.json');
  const idx = sessions.findIndex(s => s.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  const team = loadFile('team.json');
  closeSession(sessions[idx], team);
  saveFile('standups.json', sessions);
  res.json(sessions[idx]);
});

// ── Blockers ──────────────────────────────────────────────
router.get('/blockers', (req, res) => {
  res.json(loadFile('blockers.json'));
});

router.post('/blockers', (req, res) => {
  const { text, memberId, sessionId, tickets, date } = req.body;
  if (!text || !memberId) return res.status(400).json({ error: 'text and memberId required' });
  const blockers = loadFile('blockers.json');
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
  saveFile('blockers.json', blockers);
  res.status(201).json(blocker);
});

router.patch('/blockers/:id/resolve', (req, res) => {
  const blockers = loadFile('blockers.json');
  const idx = blockers.findIndex(b => b.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  blockers[idx].status = 'resolved';
  blockers[idx].resolvedAt = new Date().toISOString();
  saveFile('blockers.json', blockers);
  res.json(blockers[idx]);
});

// ── Analytics ─────────────────────────────────────────────
router.get('/analytics', (req, res) => {
  const sessions = loadFile('standups.json');
  const team = loadFile('team.json');
  res.json(calcAnalytics(sessions, team));
});

app.use('/standup-api', router);

app.listen(PORT, () => {
  console.log(`BD Standup Agent running at http://localhost:${PORT}`);
});
