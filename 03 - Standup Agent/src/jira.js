'use strict';

const https = require('https');
const path  = require('path');
const fs    = require('fs');

// ── Config ────────────────────────────────────────────────────────────────────

function loadConfig() {
  const cfgPath = path.join(__dirname, '..', 'data', 'config.json');
  try { return JSON.parse(fs.readFileSync(cfgPath, 'utf8')); } catch { return {}; }
}

function getJiraCfg() {
  const cfg = loadConfig();
  const j = cfg.jira || {};
  return {
    domain:     process.env.JIRA_DOMAIN      || j.domain      || '',
    email:      process.env.JIRA_EMAIL       || j.email       || '',
    token:      process.env.JIRA_API_TOKEN   || j.token       || '',
    projectKey: process.env.JIRA_PROJECT_KEY || j.projectKey  || 'BO',
    boardId:    process.env.JIRA_BOARD_ID    || j.boardId     || 113,
  };
}

function isConfigured() {
  const j = getJiraCfg();
  return !!(j.domain && j.email && j.token);
}

// ── HTTP helper ───────────────────────────────────────────────────────────────

function jiraGet(path) {
  const cfg = getJiraCfg();
  const auth = Buffer.from(`${cfg.email}:${cfg.token}`).toString('base64');
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: cfg.domain, path, method: 'GET',
        headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' } },
      res => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 400) reject(new Error(`Jira ${res.statusCode}: ${parsed.errorMessages || parsed.message || data}`));
            else resolve(parsed);
          } catch { reject(new Error(`Invalid JSON from Jira: ${data.slice(0, 200)}`)); }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

// ── API calls ─────────────────────────────────────────────────────────────────

/**
 * Fetch active sprint issues for the BD team.
 * Uses JQL:  project = BO AND sprint in openSprints() [AND assignee in (...)]
 * Returns raw Jira issue objects.
 */
async function fetchOpenSprintIssues(team) {
  const cfg = getJiraCfg();

  // Build assignee filter from team members that have accountId or email
  const accountIds = team.map(m => m.jiraAccountId).filter(Boolean);
  const emails     = team.map(m => m.email).filter(Boolean);

  let assigneeClause = '';
  if (accountIds.length) {
    assigneeClause = ` AND assignee in (${accountIds.map(id => `"${id}"`).join(',')})`;
  } else if (emails.length) {
    assigneeClause = ` AND assignee in (${emails.map(e => `"${e}"`).join(',')})`;
  }

  const jql = encodeURIComponent(
    `project = ${cfg.projectKey} AND sprint in openSprints()${assigneeClause} ORDER BY assignee ASC, updated DESC`
  );
  const fields = 'summary,status,assignee,priority,labels,components,parent,subtasks,updated,created';
  const url = `/rest/api/3/search?jql=${jql}&fields=${fields}&maxResults=100`;

  const data = await jiraGet(url);
  return data.issues || [];
}

/**
 * Resolve Jira account IDs from team member emails.
 * Returns array of { memberId, jiraAccountId, displayName } for matched members.
 */
async function resolveTeamAccountIds(team) {
  const results = [];
  for (const member of team) {
    if (!member.email) continue;
    try {
      const users = await jiraGet(`/rest/api/3/user/search?query=${encodeURIComponent(member.email)}&maxResults=5`);
      if (users.length) {
        results.push({ memberId: member.id, jiraAccountId: users[0].accountId, displayName: users[0].displayName });
      }
    } catch { /* skip failures */ }
  }
  return results;
}

/**
 * Group Jira issues by team member ID.
 * team: array of team members (with id, name, email, jiraAccountId)
 * issues: raw Jira issue array
 * Returns Map<memberId, Issue[]>
 */
function groupIssuesByMember(issues, team) {
  const byMember = new Map();

  issues.forEach(issue => {
    const assignee = issue.fields?.assignee;
    if (!assignee) return;

    // Match by accountId first, then by displayName
    const member = team.find(m =>
      (m.jiraAccountId && m.jiraAccountId === assignee.accountId) ||
      assignee.displayName?.toLowerCase().includes(m.name.split(' ')[0].toLowerCase()) ||
      m.name.toLowerCase().includes((assignee.displayName || '').split(' ')[0].toLowerCase())
    );

    if (!member) return;
    if (!byMember.has(member.id)) byMember.set(member.id, []);
    byMember.get(member.id).push({
      key:      issue.key,
      summary:  issue.fields.summary,
      status:   issue.fields.status?.name || 'Unknown',
      priority: issue.fields.priority?.name || '',
      labels:   issue.fields.labels || [],
      updated:  issue.fields.updated,
    });
  });

  return byMember;
}

/**
 * High-level: fetch and group sprint issues for the whole BD team.
 * Returns { ok: true, byMember: Map<memberId, Issue[]> }
 *      or { ok: false, error: string }
 */
async function getTeamSprintData(team) {
  if (!isConfigured()) return { ok: false, error: 'Jira not configured — add credentials to config.json' };
  try {
    const issues = await fetchOpenSprintIssues(team);
    const byMember = groupIssuesByMember(issues, team);
    return { ok: true, byMember, total: issues.length };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = { isConfigured, getJiraCfg, getTeamSprintData, resolveTeamAccountIds, fetchOpenSprintIssues, groupIssuesByMember };
