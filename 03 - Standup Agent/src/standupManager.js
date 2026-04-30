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

function submitUpdate(session, memberId, { yesterday, today, blockers, tickets }) {
  session.updates[memberId] = {
    yesterday: yesterday || '',
    today: today || '',
    blockers: blockers || '',
    tickets: tickets || [],
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
  calcAnalytics
};
