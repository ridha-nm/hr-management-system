'use strict';

/**
 * Generate a COO-ready standup summary combining:
 *   - Standup session (attendance, submitted updates)
 *   - Jira sprint data (actual tickets per person)
 *   - Parsed Gemini Notes (meeting highlights, decisions, next steps context)
 *   - Team roster & accounts list
 */
function generateCooSummary({ session, team, jiraByMember, geminiParsed, geminiHighlights, accounts }) {
  const lines = [];
  const date  = new Date(session.date);
  const dateStr = date.toLocaleDateString('en-MY', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // ── Header ─────────────────────────────────────────────────────────────────
  lines.push(`BD TEAM STANDUP SUMMARY`);
  lines.push(dateStr.toUpperCase());
  lines.push('─'.repeat(60));
  lines.push('');

  // ── Attendance ─────────────────────────────────────────────────────────────
  const present = team.filter(m => {
    const att = session.attendance[m.id];
    return att && (att.status === 'present' || att.status === 'late');
  });
  const absent = team.filter(m => {
    const att = session.attendance[m.id];
    return att && att.status === 'absent';
  });
  const pending = team.filter(m => {
    const att = session.attendance[m.id];
    return !att || att.status === 'pending';
  });

  lines.push(`ATTENDANCE  ${present.length}/${team.length} present`);
  if (absent.length)  lines.push(`  Absent:   ${absent.map(m => m.name).join(', ')}`);
  if (pending.length) lines.push(`  Pending:  ${pending.map(m => m.name).join(', ')}`);
  lines.push('');

  // ── Meeting highlights (from Gemini Summary section) ───────────────────────
  if (geminiHighlights && geminiHighlights.length) {
    lines.push('MEETING HIGHLIGHTS');
    geminiHighlights.forEach(h => lines.push(`  • ${h}`));
    lines.push('');
  }

  // ── Accounts in focus (aggregated from Jira + Gemini) ─────────────────────
  const accountsInFocus = new Map(); // accountName → Set of memberNames
  if (jiraByMember) {
    jiraByMember.forEach((issues, memberId) => {
      const member = team.find(m => m.id === memberId);
      if (!member) return;
      issues.forEach(issue => {
        // Try matching Jira labels/components to known account names
        if (accounts) {
          const searchText = [issue.summary, ...issue.labels].join(' ');
          accounts.forEach(acc => {
            const terms = [acc.name, ...(acc.aliases || [])];
            const pattern = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
            try {
              if (new RegExp(`\\b(${pattern})\\b`, 'i').test(searchText)) {
                if (!accountsInFocus.has(acc.name)) accountsInFocus.set(acc.name, new Set());
                accountsInFocus.get(acc.name).add(member.name);
              }
            } catch { /* skip */ }
          });
        }
      });
    });
  }
  // Supplement from Gemini parsed data
  if (geminiParsed) {
    geminiParsed.forEach(p => {
      const member = team.find(m => m.id === p.memberId);
      if (!member || !p.accounts) return;
      p.accounts.forEach(accName => {
        if (!accountsInFocus.has(accName)) accountsInFocus.set(accName, new Set());
        accountsInFocus.get(accName).add(member.name);
      });
    });
  }

  if (accountsInFocus.size) {
    lines.push('ACCOUNTS IN FOCUS');
    [...accountsInFocus.entries()].sort((a, b) => a[0].localeCompare(b[0])).forEach(([acc, members]) => {
      lines.push(`  • ${acc} — ${[...members].join(', ')}`);
    });
    lines.push('');
  }

  // ── Per-person updates ─────────────────────────────────────────────────────
  lines.push('TEAM UPDATES');
  lines.push('');

  present.forEach(member => {
    const update  = session.updates[member.id];
    const tickets = jiraByMember?.get(member.id) || [];
    const parsed  = geminiParsed?.find(p => p.memberId === member.id);
    const att     = session.attendance[member.id];
    const lateTag = att?.status === 'late' ? ' (late)' : '';

    lines.push(`▸ ${member.name} — ${member.role}${lateTag}`);

    // Yesterday (from session update or Gemini Details)
    const yesterday = update?.yesterday || parsed?.yesterday || '';
    if (yesterday) lines.push(`  Yesterday: ${yesterday}`);

    // Today: Jira tickets take priority, supplement with session/Gemini text
    if (tickets.length) {
      lines.push(`  Sprint tickets:`);
      tickets.forEach(t => {
        const statusBadge = formatStatus(t.status);
        lines.push(`    [${t.key}] ${statusBadge} ${t.summary}`);
      });
    }

    const todayText = update?.today || parsed?.today || '';
    if (todayText && !tickets.length) {
      lines.push(`  Today: ${todayText}`);
    } else if (todayText && tickets.length) {
      // Suppress redundant today text if Jira already covers it
      // Only add if it contains meaningful context not in tickets
      const lower = todayText.toLowerCase();
      const ticketWords = tickets.map(t => t.summary.toLowerCase()).join(' ');
      const hasNewInfo = !tickets.every(t => lower.includes(t.key.toLowerCase()) ||
        t.summary.toLowerCase().split(' ').filter(w => w.length > 4).some(w => lower.includes(w)));
      if (hasNewInfo) lines.push(`  Context: ${todayText}`);
    }

    // Blockers
    const blockers = update?.blockers || parsed?.blockers || '';
    if (blockers) lines.push(`  🚫 Blocker: ${blockers}`);

    lines.push('');
  });

  // ── Blockers raised ────────────────────────────────────────────────────────
  const allBlockers = present.filter(m => {
    const u = session.updates[m.id];
    const p = geminiParsed?.find(x => x.memberId === m.id);
    return (u?.blockers && u.blockers.trim()) || (p?.blockers && p.blockers.trim());
  });

  if (allBlockers.length) {
    lines.push('BLOCKERS / ESCALATIONS');
    allBlockers.forEach(m => {
      const u = session.updates[m.id];
      const p = geminiParsed?.find(x => x.memberId === m.id);
      const b = u?.blockers || p?.blockers || '';
      lines.push(`  • ${m.name}: ${b}`);
    });
    lines.push('');
  } else {
    lines.push('No blockers raised.');
    lines.push('');
  }

  // ── Sprint overview (Jira totals) ──────────────────────────────────────────
  if (jiraByMember && jiraByMember.size) {
    const statusTotals = {};
    jiraByMember.forEach(issues => {
      issues.forEach(i => {
        statusTotals[i.status] = (statusTotals[i.status] || 0) + 1;
      });
    });
    const total = Object.values(statusTotals).reduce((a, b) => a + b, 0);
    lines.push(`SPRINT STATUS  (${total} open tickets)`);
    Object.entries(statusTotals)
      .sort((a, b) => b[1] - a[1])
      .forEach(([status, count]) => {
        lines.push(`  ${formatStatus(status)} ${status}: ${count}`);
      });
    lines.push('');
  }

  lines.push('─'.repeat(60));
  lines.push(`Generated ${new Date().toLocaleString('en-MY')}`);

  return lines.join('\n');
}

function formatStatus(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('done') || s.includes('closed') || s.includes('complete')) return '✅';
  if (s.includes('progress') || s.includes('review'))                        return '🔄';
  if (s.includes('block'))                                                    return '🚫';
  if (s.includes('todo') || s.includes('to do') || s.includes('open') || s.includes('backlog')) return '📋';
  return '•';
}

/**
 * Extract meeting highlights from Gemini Notes text.
 * Pulls from the Summary section (the short bullet-like paragraphs Gemini writes at the top).
 */
function extractGeminiHighlights(text) {
  if (!text) return [];
  const norm = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Summary section is between "Summary" header and "Next steps" / "Rate this"
  const summaryMatch = norm.match(/\bSummary\b\s*\n([\s\S]*?)(?=\nNext steps|\nRate this|\n📖|$)/i);
  if (!summaryMatch) return [];

  const sentences = summaryMatch[1]
    .split(/\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && !s.startsWith('Rate') && !s.startsWith('Helpful'));

  // Return topic headers (bold/short lines) + first sentence of each paragraph
  const highlights = [];
  sentences.forEach(s => {
    // Short lines that look like section headings
    if (s.length < 80 && !s.endsWith('.') && s.split(' ').length <= 8) {
      highlights.push(s);
    }
  });

  // Fallback: if no headings found, return first 3 sentences
  if (!highlights.length) {
    return sentences.slice(0, 3);
  }
  return highlights.slice(0, 6);
}

module.exports = { generateCooSummary, extractGeminiHighlights, formatStatus };
