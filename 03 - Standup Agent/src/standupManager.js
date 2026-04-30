'use strict';

// Mon=1, Tue=2, Thu=4, Fri=5
const STANDUP_DAYS = [1, 2, 4, 5];
const STANDUP_TIME = '09:45';

function isStandupDay(date) {
  const d = date ? new Date(date) : new Date();
  return STANDUP_DAYS.includes(d.getDay());
}

function getTodayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getNextStandupDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (!STANDUP_DAYS.includes(d.getDay())) {
    d.setDate(d.getDate() + 1);
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function createSession(date, team) {
  const key = date || getTodayKey();
  const id = 'SD_' + key.replace(/-/g, '');
  const attendance = {};
  const updates = {};
  team.forEach(member => {
    attendance[member.id] = { status: 'pending' };
  });
  return {
    id,
    date: key,
    status: 'active',
    attendance,
    updates,
    summary: null,
    createdAt: new Date().toISOString()
  };
}

function markAttendance(session, memberId, status) {
  if (!session.attendance[memberId]) {
    session.attendance[memberId] = {};
  }
  session.attendance[memberId].status = status;
  return session;
}

function submitUpdate(session, memberId, { yesterday, today, blockers, tickets, accounts }) {
  session.updates[memberId] = {
    yesterday: yesterday || '',
    today: today || '',
    blockers: blockers || '',
    tickets: tickets || [],
    accounts: accounts || [],
    submittedAt: new Date().toISOString()
  };
  return session;
}

function closeSession(session, team) {
  session.status = 'completed';
  session.closedAt = new Date().toISOString();

  const dateStr = new Date(session.date).toLocaleDateString('en-MY', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const presentMembers = team.filter(m => {
    const att = session.attendance[m.id];
    return att && (att.status === 'present' || att.status === 'late');
  });

  const absentMembers = team.filter(m => {
    const att = session.attendance[m.id];
    return att && att.status === 'absent';
  });

  let lines = [];
  lines.push(`BD STANDUP — ${dateStr}`);
  lines.push(`${'─'.repeat(50)}`);
  lines.push(`Attendance: ${presentMembers.length}/${team.length} present`);
  lines.push('');

  presentMembers.forEach(member => {
    const update = session.updates[member.id];
    const att = session.attendance[member.id];
    const attLabel = att.status === 'late' ? ' (late)' : '';
    lines.push(`▸ ${member.name} — ${member.role}${attLabel}`);
    if (update) {
      if (update.yesterday) lines.push(`  Yesterday: ${update.yesterday}`);
      if (update.today)     lines.push(`  Today:     ${update.today}`);
      if (update.blockers)  lines.push(`  BLOCKER:   ${update.blockers}`);
      if (update.tickets && update.tickets.length) {
        lines.push(`  Tickets:   ${update.tickets.join(', ')}`);
      }
    } else {
      lines.push(`  (no update submitted)`);
    }
    lines.push('');
  });

  if (absentMembers.length) {
    lines.push(`Absent: ${absentMembers.map(m => m.name).join(', ')}`);
    lines.push('');
  }

  const blockersRaised = presentMembers
    .filter(m => session.updates[m.id]?.blockers)
    .map(m => `• ${m.name}: ${session.updates[m.id].blockers}`);

  if (blockersRaised.length) {
    lines.push('Blockers raised:');
    blockersRaised.forEach(b => lines.push(b));
  } else {
    lines.push('No blockers raised.');
  }

  session.summary = lines.join('\n');
  return session;
}

function calcAnalytics(sessions, team) {
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const recentSessions = sessions.filter(s => {
    return s.status === 'completed' && new Date(s.date) >= fourWeeksAgo;
  });

  const totalSessions = sessions.length;
  let totalBlockers = 0;

  sessions.forEach(s => {
    Object.values(s.updates || {}).forEach(u => {
      if (u.blockers && u.blockers.trim()) totalBlockers++;
    });
  });

  const attendance = team.map(member => {
    const eligible = recentSessions.length;
    const attended = recentSessions.filter(s => {
      const att = s.attendance[member.id];
      return att && (att.status === 'present' || att.status === 'late');
    }).length;
    const rate = eligible > 0 ? Math.round((attended / eligible) * 100) : 0;
    return {
      id: member.id,
      name: member.name,
      role: member.role,
      rate,
      sessions: attended
    };
  });

  const avgAttendance = attendance.length > 0
    ? Math.round(attendance.reduce((sum, m) => sum + m.rate, 0) / attendance.length)
    : 0;

  return { attendance, totalSessions, totalBlockers, avgAttendance };
}

/**
 * Parse a Gemini Notes document (Notes by Gemini for Google Meet).
 *
 * Document structure (always present in this order):
 *   📝 Notes header
 *   Summary  — topic paragraphs (not per-person)
 *   Next steps — [Full Name] Short Title: Description.
 *   Details   — narrative paragraphs per topic with (HH:MM:SS) refs
 *   📖 Transcript — HH:MM:SS Speaker: text  or  Speaker: text (continuation)
 *
 * Strategy:
 *   - Next steps  → "Today / tasks" per person  (most reliable signal)
 *   - Transcript  → speaker utterances → detect yesterday (past) / blockers (stuck)
 *   - Details     → supplemental context for yesterday / blockers
 *
 * Returns array of { memberId, name, yesterday, today, blockers, tickets }
 */
/**
 * Given a text string and the accounts list, return canonical account names
 * mentioned anywhere in the text.
 */
function detectAccounts(text, accounts) {
  if (!text || !accounts || !accounts.length) return [];
  const found = new Set();
  accounts.forEach(acc => {
    const terms = [acc.name, ...(acc.aliases || [])];
    const pattern = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    try {
      if (new RegExp(`\\b(${pattern})\\b`, 'i').test(text)) found.add(acc.name);
    } catch (_) { /* ignore */ }
  });
  return [...found];
}

function parseTranscript(text, team, accounts) {
  if (!text || !team.length) return [];

  const norm = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const results = {}; // memberId → { memberId, name, todayItems[], yesterdayChunks[], blockerChunks[], tickets Set }

  // ── helpers ────────────────────────────────────────────────────────────────

  function matchMember(nameStr) {
    const n = nameStr.toLowerCase().trim();
    return team.find(m => {
      const ml = m.name.toLowerCase();
      const parts = ml.split(' ');
      // exact match
      if (n === ml) return true;
      // document name is a substring of member name or vice versa
      if (ml.includes(n) || n.includes(ml)) return true;
      // any word with 3+ chars matches (handles "Kasib" matching "Mohamed Kasib Farhan Cassim")
      return parts.some(p => p.length >= 3 && n.includes(p));
    });
  }

  function getOrCreate(member) {
    if (!results[member.id]) {
      results[member.id] = {
        memberId: member.id,
        name: member.name,
        todayItems: [],
        yesterdayChunks: [],  // from Details section (clean summaries)
        txYesterdayChunks: [], // from Transcript (speaker utterances)
        blockerChunks: [],
        tickets: new Set(),
        accountsSet: new Set(),
      };
    }
    return results[member.id];
  }

  function extractTickets(str) {
    return (str.match(/\bBO-\d+\b/gi) || []).map(t => t.toUpperCase());
  }

  // Build account-matching regexes — use word boundaries to avoid partial matches
  const accountMatchers = []; // [{ name: string, re: RegExp }]
  if (accounts && accounts.length) {
    accounts.forEach(acc => {
      const terms = [acc.name, ...(acc.aliases || [])];
      // Escape special regex chars, wrap each term in word boundaries
      const pattern = terms
        .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');
      try {
        accountMatchers.push({ name: acc.name, re: new RegExp(`\\b(${pattern})\\b`, 'i') });
      } catch (_) { /* ignore bad patterns */ }
    });
  }

  function extractAccounts(str) {
    return accountMatchers.filter(a => a.re.test(str)).map(a => a.name);
  }

  const YESTERDAY_KW = ['yesterday', 'completed', 'finished', 'done', 'wrapped up', 'sent over', 'sent out', 'reviewed', 'finalized', 'from yesterday'];
  const BLOCKER_KW   = ['blocked', 'waiting for', 'waiting on', 'stuck', 'issue with', 'problem with', 'delay', "can't", 'not done', 'need approval'];
  // First-person signals required for transcript-sourced blockers/yesterday
  const FIRST_PERSON = ['i ', "i'm", "i've", "i'll", "i need", 'i am', "i can't", "i cannot", 'my ', 'for me'];

  function hasFirstPerson(str) {
    const sl = ' ' + str.toLowerCase();
    return FIRST_PERSON.some(fp => sl.includes(' ' + fp) || sl.includes('\n' + fp));
  }

  // ── 1. Next steps section ─────────────────────────────────────────────────
  // Format: [Full Name] Short Title: Full description sentence.
  const nextStepsSection = norm.match(/Next steps\s*\n([\s\S]*?)(?=\n📖|\nDetails\b|\nRate this|$)/i);
  if (nextStepsSection) {
    const lines = nextStepsSection[1].split('\n');
    lines.forEach(line => {
      const m = line.match(/^\[([^\]]+)\]\s*[^:]*:\s*(.+)/);
      if (!m) return;
      const member = matchMember(m[1]);
      if (!member) return;
      const r = getOrCreate(member);
      r.todayItems.push(m[2].trim());
      extractTickets(m[2]).forEach(t => r.tickets.add(t));
      extractAccounts(m[2]).forEach(a => r.accountsSet.add(a));
    });
  }

  // ── 2. Transcript section ─────────────────────────────────────────────────
  // Real Gemini Notes format:
  //   Timestamps appear on their OWN line: "00:01:02"
  //   Then speaker lines below: "Speaker Name: spoken text"
  //   Continuation lines follow with no speaker prefix
  const transcriptSection = norm.match(/📖 Transcript[\s\S]*?(?:Transcript\s*\n)([\s\S]*?)(?=\nThis editable transcript|$)/i)
    || norm.match(/📖 Transcript\s*\n([\s\S]*?)$/i);

  if (transcriptSection) {
    const lines = transcriptSection[1].split('\n');
    let currentMember = null;
    let buffer = [];

    function cleanTranscript(str) {
      // Remove filler words and clean up transcript speech artifacts
      return str
        .replace(/\b(um|uh|yeah|yep|okay|ok|so|right|like)\b[,.]?\s*/gi, ' ')
        .replace(/\s{2,}/g, ' ').trim();
    }

    function flushBuffer() {
      if (!currentMember || !buffer.length) return;
      const chunk = cleanTranscript(buffer.join(' ').trim());
      buffer = [];
      if (chunk.length < 5) return;
      const r = getOrCreate(currentMember);
      const cl = chunk.toLowerCase();
      // Blocker: require first-person signal + blocker keyword + reasonable length
      if (chunk.length < 400 && hasFirstPerson(chunk) && BLOCKER_KW.some(kw => cl.includes(kw))) {
        r.blockerChunks.push(chunk);
      }
      // Yesterday: require first-person + yesterday keyword
      if (chunk.length < 400 && hasFirstPerson(chunk) && YESTERDAY_KW.some(kw => cl.includes(kw))) {
        r.txYesterdayChunks.push(chunk);
      }
      extractTickets(chunk).forEach(t => r.tickets.add(t));
      extractAccounts(chunk).forEach(a => r.accountsSet.add(a));
    }

    lines.forEach(rawLine => {
      const line = rawLine.trim();
      if (!line) return;

      // Skip standalone timestamp lines (e.g. "00:01:02")
      if (/^\d{1,2}:\d{2}:\d{2}$/.test(line)) { flushBuffer(); return; }

      // Format A: "00:01:02 Speaker Name: text" (inline timestamp — some Gemini variants)
      const withTs = line.match(/^\d{1,2}:\d{2}:\d{2}\s+(.+?):\s*(.*)$/);
      if (withTs) {
        flushBuffer();
        currentMember = matchMember(withTs[1]);
        if (withTs[2].trim()) buffer.push(withTs[2].trim());
        return;
      }

      // Format B: "Speaker Name: text"  — name must match a team member
      const speakerLine = line.match(/^([A-Z][^:]{2,50}):\s+(.+)$/);
      if (speakerLine) {
        const candidate = matchMember(speakerLine[1]);
        if (candidate) {
          flushBuffer();
          currentMember = candidate;
          if (speakerLine[2].trim()) buffer.push(speakerLine[2].trim());
          return;
        }
      }

      // Continuation line — skip embedded timestamp artifacts like "00:04:35."
      if (currentMember && line.length > 3 && !/^\d{1,2}:\d{2}:\d{2}/.test(line)) {
        buffer.push(line);
      }
    });
    flushBuffer();
  }

  // ── 3. Details section ────────────────────────────────────────────────────
  // Clean narrative summaries per topic. Most reliable source for yesterday info.
  // These are past-tense narrative sentences written by Gemini about what happened.
  const DETAILS_YESTERDAY_KW = ['yesterday', 'from yesterday', 'previous day', 'last week',
    'completed', 'finished', 'reviewed', 'sent out', 'sent over', 'wrapped up', 'submitted',
    'discussed yesterday'];
  // Skip sentences that are clearly about future/current tasks (not past work)
  const FUTURE_SIGNALS = ['will be', 'needs to', 'is tasked', 'is going to', 'is asked to',
    'is scheduled', 'to finalize', 'to send out', 'to troubleshoot', 'to review', 'to work on',
    'to prioritize', 'to address', 'to arrange', 'to set up', 'to focus on'];

  const detailsSection = norm.match(/\bDetails\b\s*\n([\s\S]*?)(?=\n📖|$)/i);
  if (detailsSection) {
    const sentences = detailsSection[1]
      .split(/(?<=[.!?])\s+|\n/)
      .map(s => s
        .replace(/\(\d{2}:\d{2}:\d{2}\)/g, '')
        .replace(/\d{2}:\d{2}:\d{2}/g, '')
        // Strip "Section Header: " prefix (no comma in header, ends with colon+space)
        .replace(/^[^,:]{5,60}:\s+(?=[A-Z])/, '')
        .trim())
      .filter(s => s.length > 10);

    sentences.forEach(sentence => {
      const sl = sentence.toLowerCase();
      // Skip future-tense sentences — not about what was done yesterday
      if (FUTURE_SIGNALS.some(sig => sl.includes(sig))) return;
      const member = team.find(m => {
        const first = m.name.split(' ')[0].toLowerCase();
        return sl.includes(first) || sl.includes(m.name.toLowerCase());
      });
      if (!member) return;
      const r = getOrCreate(member);
      if (DETAILS_YESTERDAY_KW.some(kw => sl.includes(kw))) r.yesterdayChunks.push(sentence);
      // Blockers from Details only if clearly blocking in nature
      const detailsBlockerKW = ['blocked', 'waiting for', 'unable to', 'cannot proceed', 'delay'];
      if (detailsBlockerKW.some(kw => sl.includes(kw))) r.blockerChunks.push(sentence);
      extractTickets(sentence).forEach(t => r.tickets.add(t));
      extractAccounts(sentence).forEach(a => r.accountsSet.add(a));
    });
  }

  // ── Assemble results ───────────────────────────────────────────────────────
  return Object.values(results).map(r => {
    const today = r.todayItems.join('. ') || '';
    // Prefer Details-sourced yesterday (clean prose) over raw transcript chunks
    const allYesterday = [...new Set([...r.yesterdayChunks, ...r.txYesterdayChunks])];
    const yesterday = allYesterday.slice(0, 2).join('. ');
    const blockers  = [...new Set(r.blockerChunks)].slice(0, 2).join('. ');
    const tickets   = [...r.tickets];
    const accounts  = [...r.accountsSet];

    if (!today && !yesterday && !blockers && !tickets.length) return null;
    return { memberId: r.memberId, name: r.name, yesterday, today, blockers, tickets, accounts };
  }).filter(Boolean);
}

module.exports = {
  STANDUP_DAYS,
  STANDUP_TIME,
  isStandupDay,
  getTodayKey,
  getNextStandupDate,
  createSession,
  markAttendance,
  submitUpdate,
  closeSession,
  calcAnalytics,
  parseTranscript,
  detectAccounts,
};
