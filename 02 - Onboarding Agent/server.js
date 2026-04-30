const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { processMessage, calcProgress } = require('./src/onboardingBot');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data', 'onboardings.json');

function loadOnboardings() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
}

function saveOnboardings(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Standalone: mount all routes under /onboarding-api so same HTML works via platform or standalone
const router = express.Router();

router.post('/chat', (req, res) => {
  const { message, sessionId, activeOnboardingId } = req.body;
  const onboardings = loadOnboardings();
  const result = processMessage(message, sessionId, onboardings, activeOnboardingId || null);

  if (result.newOnboarding) {
    onboardings.push(result.newOnboarding);
    saveOnboardings(onboardings);
  }

  res.json({
    reply: result.reply,
    quickReplies: result.quickReplies || [],
    activeOnboarding: result.activeOnboarding || null,
    action: result.action || null,
  });
});

router.get('/onboardings', (req, res) => {
  const onboardings = loadOnboardings();
  const withProgress = onboardings.map(o => ({ ...o, progress: calcProgress(o) }));
  res.json(withProgress);
});

router.get('/onboardings/:id', (req, res) => {
  const onboardings = loadOnboardings();
  const o = onboardings.find(o => o.id === req.params.id);
  if (!o) return res.status(404).json({ error: 'Not found' });
  res.json({ ...o, progress: calcProgress(o) });
});

router.patch('/onboardings/:id/setup/:item', (req, res) => {
  const onboardings = loadOnboardings();
  const o = onboardings.find(o => o.id === req.params.id);
  if (!o) return res.status(404).json({ error: 'Not found' });
  const item = req.params.item;
  if (item in o.setup) {
    o.setup[item] = !o.setup[item];
    saveOnboardings(onboardings);
  }
  res.json({ ...o, progress: calcProgress(o) });
});

router.patch('/onboardings/:id/academy/:module', (req, res) => {
  const onboardings = loadOnboardings();
  const o = onboardings.find(o => o.id === req.params.id);
  if (!o) return res.status(404).json({ error: 'Not found' });
  const mod = req.params.module;
  const field = req.body.field;
  if (o.academy[mod] && field in o.academy[mod]) {
    o.academy[mod][field] = !o.academy[mod][field];
    saveOnboardings(onboardings);
  }
  res.json({ ...o, progress: calcProgress(o) });
});

router.patch('/onboardings/:id/documents/:item', (req, res) => {
  const onboardings = loadOnboardings();
  const o = onboardings.find(o => o.id === req.params.id);
  if (!o) return res.status(404).json({ error: 'Not found' });
  const item = req.params.item;
  if (item in o.documents) {
    o.documents[item] = !o.documents[item];
    saveOnboardings(onboardings);
  }
  res.json({ ...o, progress: calcProgress(o) });
});

router.patch('/onboardings/:id/day1', (req, res) => {
  const onboardings = loadOnboardings();
  const o = onboardings.find(o => o.id === req.params.id);
  if (!o) return res.status(404).json({ error: 'Not found' });
  o.day1Completed = !o.day1Completed;
  saveOnboardings(onboardings);
  res.json({ ...o, progress: calcProgress(o) });
});

app.use('/onboarding-api', router);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`\n🎉 Pantas Onboarding Agent running at http://localhost:${PORT}`);
});
