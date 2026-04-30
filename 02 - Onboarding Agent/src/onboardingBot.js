/**
 * Pantas Onboarding Bot - State Machine
 * Guides HR through new hire onboarding step by step.
 */

const sessions = new Map();

const DEPARTMENTS = ['Engineering', 'Business Development', 'Product', 'CSM', 'Data Science'];

const SETUP_ITEMS = [
  { key: 'pantas_email',       label: 'Pantas email setup',                  contact: 'Eong',     note: 'Send: first name, last name, personal email, phone' },
  { key: 'google_calendar',    label: 'Google Calendar invites',              contact: 'Eong / Manager', note: 'BD/Engineering Standup, Sprint meetings' },
  { key: 'slack',              label: 'Slack account + channels (2FA)',       contact: 'Eong',     note: 'All relevant team channels' },
  { key: 'jira',               label: 'JIRA access + BD Ops Board',           contact: 'Eong / BD Manager', note: 'pantas.atlassian.net/jira' },
  { key: 'pantas_platform',    label: 'Pantas platform access',               contact: 'Eong / BD Manager', note: 'beta.pantas.com + pantas.com/admin' },
  { key: 'facial_recognition', label: 'Facial recognition registration',      contact: 'Joshua',   note: 'Office entry system' },
  { key: 'laptop_check',       label: 'Laptop assigned & ready',              contact: 'Eong',     note: 'Check laptop availability spreadsheet' },
  { key: 'epf_submission',     label: 'EPF number collected',                 contact: 'Syaheedah', note: 'Email to syaheedah@pantas.com + CC nadzim, arman' },
  { key: 'lhdn_submission',    label: 'LHDN number collected',                contact: 'Syaheedah', note: 'Same email as EPF' },
  { key: 'bank_details',       label: 'Bank account details collected',       contact: 'Syaheedah', note: 'Account name + account number' },
  { key: 'employee_handbook',  label: 'Employee Handbook signed',             contact: 'Syaheedah', note: 'Sign and return copy to supervisor' },
  { key: 'financial_policy',   label: 'Financial Data Handling Policy signed', contact: 'Eong',    note: 'Sign and return' },
];

const DOC_ITEMS = [
  { key: 'ic_passport',      label: 'IC / Passport copy' },
  { key: 'emergency_contact', label: 'Emergency contact info' },
  { key: 'education_certs',  label: 'Education certificates' },
];

const ACADEMY_MODULES_INTERN = [
  { key: 'starter',      label: 'Starter Module',      duration: '5 days (Days 3–7)',   quizUrl: 'https://forms.gle/hj896cq3Nuny9HTb9', hasQuiz: true },
  { key: 'intermediate', label: 'Intermediate Module', duration: '5 days (Days 11–15)', quizUrl: 'https://forms.gle/Yf1wJLhpR7eXsT377',  hasQuiz: true },
];

const ACADEMY_MODULES_FT = [
  { key: 'starter',      label: 'Starter Module',       duration: '5 days (Days 3–7)',   quizUrl: 'https://forms.gle/hj896cq3Nuny9HTb9', hasQuiz: true },
  { key: 'intermediate', label: 'Intermediate Module',  duration: '5 days (Days 11–15)', quizUrl: 'https://forms.gle/Yf1wJLhpR7eXsT377',  hasQuiz: true },
  { key: 'advanced',     label: 'Advanced Module',      duration: '5 days (Days 16–20)', quizUrl: 'https://forms.gle/zr4DtYe5EgtHNzHg9',  hasQuiz: true },
  { key: 'software',     label: 'Software Module',      duration: '5 days (Days 21–25)', hasQuiz: false },
  { key: 'utilities',    label: 'Utilities Module',     duration: '4 days (Days 26–29)', hasQuiz: false },
];

const DAY1_SCHEDULE = [
  { time: '9:00 AM',  activity: 'Welcome & company overview presentation', contact: 'Syaheedah' },
  { time: '10:00 AM', activity: 'HR onboarding (paperwork, SOPs, culture deck)', contact: 'Syaheedah' },
  { time: '11:00 AM', activity: 'Office tour', contact: 'Team' },
  { time: '12:00 PM', activity: 'Welcome lunch', contact: 'Team' },
  { time: '2:00 PM',  activity: 'Workstation & IT setup', contact: 'Eong' },
  { time: '3:00 PM',  activity: 'Facial recognition registration', contact: 'Joshua' },
  { time: '4:00 PM',  activity: 'Role, project & supervisor introduction', contact: 'Manager' },
  { time: '5:00 PM',  activity: 'Wrap up + Day 2 overview', contact: 'Manager' },
];

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, { state: 'greeting', collecting: {} });
  }
  return sessions.get(sessionId);
}

function setSession(sessionId, data) {
  sessions.set(sessionId, data);
}

function generateId(onboardings) {
  return `ONB${String(onboardings.length + 1).padStart(3, '0')}`;
}

function buildAcademyRecord(type) {
  const modules = type === 'intern' ? ACADEMY_MODULES_INTERN : ACADEMY_MODULES_FT;
  const record = {};
  modules.forEach(m => {
    record[m.key] = { started: false, completed: false, ...(m.hasQuiz ? { quizPassed: false } : {}) };
  });
  return record;
}

function createOnboardingRecord(data, id) {
  return {
    id,
    employee: {
      name: data.name,
      role: data.role,
      department: data.department,
      type: data.type,
      startDate: data.startDate,
    },
    setup: Object.fromEntries(SETUP_ITEMS.map(i => [i.key, false])),
    academy: buildAcademyRecord(data.type),
    documents: Object.fromEntries(DOC_ITEMS.map(i => [i.key, false])),
    day1Completed: false,
    createdAt: new Date().toISOString(),
    status: 'active',
  };
}

function calcProgress(onboarding) {
  const setupVals = Object.values(onboarding.setup);
  const setupDone = setupVals.filter(Boolean).length;

  const academyVals = Object.values(onboarding.academy);
  const academyDone = academyVals.filter(m => m.completed).length;

  const docVals = Object.values(onboarding.documents);
  const docsDone = docVals.filter(Boolean).length;

  const total = setupVals.length + academyVals.length + docVals.length;
  const done = setupDone + academyDone + docsDone;

  return {
    setup: { done: setupDone, total: setupVals.length },
    academy: { done: academyDone, total: academyVals.length },
    docs: { done: docsDone, total: docVals.length },
    pct: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

function generateWelcomeEmail(onboarding) {
  const { name, role, startDate, department } = onboarding.employee;
  return `Subject: Welcome to Pantas, ${name}! 🎉\n\nHi ${name},\n\nWe're thrilled to have you joining us as **${role}** in the **${department}** team!\n\nYour first day is **${startDate}**. Please arrive at 9:00 AM and ask for Syaheedah.\n\nBefore Day 1, please send the following to syaheedah@pantas.com (CC: nadzim@pantas.com, arman@pantas.com):\n• EPF number\n• LHDN number\n• Bank account name + account number\n\nAlso prepare:\n• IC / Passport copy\n• Education certificates\n• Emergency contact details\n\nWhat to expect on Day 1:\n• 9:00 AM — Welcome & company overview\n• 10:00 AM — HR onboarding session\n• 12:00 PM — Welcome lunch with the team\n• 2:00 PM — IT setup (email, Slack, JIRA, platform)\n\nWe're excited to have you on board!\n\nWarm regards,\nSyaheedah\nCOO, Pantas Climate Solutions\nsyaheedah@pantas.com`;
}

function r(text, quickReplies = [], extra = {}) {
  return { reply: text, quickReplies, ...extra };
}

function processMessage(message, sessionId, onboardings, activeOnboardingId = null) {
  const session = getSession(sessionId);
  const msg = (message || '').toLowerCase().trim();

  // Sidebar load: frontend passes activeOnboardingId when user clicks a record
  if (activeOnboardingId) {
    const onboarding = onboardings.find(o => o.id === activeOnboardingId);
    if (onboarding) {
      setSession(sessionId, { ...session, state: 'active', activeId: activeOnboardingId });
      const p = calcProgress(onboarding);
      return r(
        `📋 Loaded **${onboarding.employee.name}'s** onboarding.\n\n**${p.pct}% complete** — ${p.setup.done}/${p.setup.total} setup items done.\n\nUse the checklist on the left to track progress.`,
        ['View Status', 'Day 1 Schedule', 'Generate Welcome Email']
      );
    }
  }

  // Global reset
  if (msg === 'new' || msg === 'reset' || msg === 'start new onboarding') {
    setSession(sessionId, { state: 'greeting', collecting: {} });
    return r(
      `Ready to onboard a new team member?\n\nType **"start"** to begin.`,
      ['Start New Onboarding', 'View Active Onboardings']
    );
  }

  // List active
  if (msg === 'view active onboardings' || msg === 'view active' || msg === 'list') {
    const active = onboardings.filter(o => o.status === 'active');
    if (active.length === 0) {
      return r('No active onboardings yet. Start one!', ['Start New Onboarding']);
    }
    const list = active.map(o => `• **${o.employee.name}** (${o.employee.role}) — starts ${o.employee.startDate}`).join('\n');
    return r(`**Active Onboardings (${active.length})**\n\n${list}\n\nSelect one from the sidebar to manage.`, ['Start New Onboarding']);
  }

  switch (session.state) {

    case 'greeting': {
      if (msg.includes('start') || msg.includes('new') || msg.includes('onboard') || msg.includes('hi') || msg.includes('hello')) {
        setSession(sessionId, { state: 'collect_name', collecting: {} });
        return r(`👋 Let\'s get started!\n\n**Step 1 of 5** — What is the new hire's **full name**?`);
      }
      return r(
        `👋 Welcome to the **Pantas Onboarding Agent**.\n\nI\'ll guide you through setting up a new team member, step by step.`,
        ['Start New Onboarding', 'View Active Onboardings']
      );
    }

    case 'collect_name': {
      if (!message.trim()) return r('Please enter the new hire\'s name.');
      const collecting = { ...session.collecting, name: message.trim() };
      setSession(sessionId, { state: 'collect_role', collecting });
      return r(`Got it — **${collecting.name}**.\n\n**Step 2 of 5** — What is their **role / designation**?\n_(e.g. Software Engineer, Business Analyst, Data Scientist)_`);
    }

    case 'collect_role': {
      const collecting = { ...session.collecting, role: message.trim() };
      setSession(sessionId, { state: 'collect_dept', collecting });
      return r(`**Step 3 of 5** — Which **department**?`, DEPARTMENTS);
    }

    case 'collect_dept': {
      const dept = DEPARTMENTS.find(d => d.toLowerCase() === msg) || message.trim();
      const collecting = { ...session.collecting, department: dept };
      setSession(sessionId, { state: 'collect_type', collecting });
      return r(`**Step 4 of 5** — Employment type?`, ['Full-time', 'Intern']);
    }

    case 'collect_type': {
      const type = msg.includes('intern') ? 'intern' : 'full-time';
      const collecting = { ...session.collecting, type };
      setSession(sessionId, { state: 'collect_date', collecting });
      return r(`**Step 5 of 5** — What is their **start date**?\n_(e.g. 5 May 2026)_`);
    }

    case 'collect_date': {
      const collecting = { ...session.collecting, startDate: message.trim() };
      setSession(sessionId, { state: 'confirm', collecting });
      const { name, role, department, type, startDate } = collecting;
      const track = type === 'intern' ? 'Intern (3-week academy track)' : 'Full-time (6-week academy track)';
      return r(
        `📋 **Confirm New Hire Details**\n\n👤 **Name:** ${name}\n💼 **Role:** ${role}\n🏢 **Department:** ${department}\n📄 **Type:** ${track}\n📅 **Start Date:** ${startDate}\n\nCreate this onboarding?`,
        ['Confirm ✓', 'Start Over']
      );
    }

    case 'confirm': {
      if (msg.includes('confirm') || msg.includes('yes') || msg.includes('✓')) {
        const id = generateId(onboardings);
        const record = createOnboardingRecord(session.collecting, id);
        setSession(sessionId, { state: 'active', activeId: id, collecting: {} });
        return r(
          `✅ **Onboarding created for ${session.collecting.name}!**\n\nThe checklist is now live on the left.\n\n**First step:** Email Eong with ${session.collecting.name}'s details to kick off IT setup — email, Slack, and JIRA access.`,
          ['Generate Welcome Email', 'Day 1 Schedule', 'View Status'],
          { newOnboarding: record, activeOnboarding: record, action: 'LOAD_ONBOARDING' }
        );
      }
      if (msg.includes('no') || msg.includes('back') || msg.includes('start over')) {
        setSession(sessionId, { state: 'greeting', collecting: {} });
        return r('No problem. Start over when ready.', ['Start New Onboarding']);
      }
      return r('Confirm the details?', ['Confirm ✓', 'Start Over']);
    }

    case 'active': {
      const onboarding = onboardings.find(o => o.id === session.activeId);
      if (!onboarding) {
        setSession(sessionId, { state: 'greeting', collecting: {} });
        return r('No active onboarding found. Start a new one?', ['Start New Onboarding']);
      }

      if (msg.includes('welcome email') || msg.includes('email template')) {
        return r(`📧 **Welcome Email**\n\n\`\`\`\n${generateWelcomeEmail(onboarding)}\n\`\`\``, ['View Status', 'Day 1 Schedule']);
      }

      if (msg.includes('day 1') || msg.includes('schedule')) {
        const rows = DAY1_SCHEDULE.map(s => `**${s.time}** — ${s.activity} _(${s.contact})_`).join('\n');
        return r(`📅 **Day 1 Schedule**\n\n${rows}`, ['Generate Welcome Email', 'View Status']);
      }

      if (msg.includes('status') || msg.includes('progress')) {
        const p = calcProgress(onboarding);
        return r(
          `📊 **${onboarding.employee.name}\'s Progress**\n\n⚙️ Setup: ${p.setup.done}/${p.setup.total} done\n🎓 Academy: ${p.academy.done}/${p.academy.total} modules\n📄 Docs: ${p.docs.done}/${p.docs.total} collected\n\n**Overall: ${p.pct}% complete**`,
          ['Generate Welcome Email', 'Day 1 Schedule', 'View Academy Plan']
        );
      }

      if (msg.includes('academy') || msg.includes('module') || msg.includes('training')) {
        const isIntern = onboarding.employee.type === 'intern';
        const modules = isIntern ? ACADEMY_MODULES_INTERN : ACADEMY_MODULES_FT;
        const lines = modules.map(m => `• **${m.label}** — ${m.duration}${m.hasQuiz ? ' + quiz' : ''}`).join('\n');
        const track = isIntern ? 'Intern (3 weeks)' : 'Full-time (6 weeks)';
        return r(`🎓 **Pantas Academy — ${track} Track**\n\n${lines}\n\nTrack progress using the checklist on the left.`, ['View Status', 'Day 1 Schedule']);
      }

      if (msg.includes('checklist') || msg.includes('setup')) {
        const p = calcProgress(onboarding);
        return r(
          `⚙️ **Setup Progress: ${p.setup.done}/${p.setup.total}**\n\nCheck off items in the left panel as they\'re completed.\n\n**Priority items:**\n1. Pantas email (Eong)\n2. Slack + 2FA (Eong)\n3. Facial recognition (Joshua)`,
          ['View Status', 'Generate Welcome Email']
        );
      }

      if (msg.includes('help') || msg === '?') {
        return r(
          `**Commands**\n\n• **"status"** — progress overview\n• **"day 1"** — Day 1 schedule\n• **"academy"** — training plan\n• **"welcome email"** — email template\n• **"new"** — start new onboarding`,
          ['View Status', 'Day 1 Schedule', 'Generate Welcome Email']
        );
      }

      return r(
        `I\'m managing **${onboarding.employee.name}\'s** onboarding. What do you need?`,
        ['View Status', 'Day 1 Schedule', 'Generate Welcome Email', 'Academy Plan']
      );
    }

    default: {
      setSession(sessionId, { state: 'greeting', collecting: {} });
      return r('👋 Ready to onboard a new team member?', ['Start New Onboarding', 'View Active Onboardings']);
    }
  }
}

module.exports = {
  processMessage,
  SETUP_ITEMS,
  DOC_ITEMS,
  ACADEMY_MODULES_INTERN,
  ACADEMY_MODULES_FT,
  DAY1_SCHEDULE,
  calcProgress,
};
