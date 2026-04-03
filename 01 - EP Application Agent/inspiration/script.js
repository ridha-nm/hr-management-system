const form          = document.getElementById('chat-form');
const messageInput  = document.getElementById('message-input');
const chatWindow    = document.getElementById('chat-window');
const fileInput     = document.getElementById('file-input');
const dropZone      = document.getElementById('drop-zone');
const agentSelector = document.getElementById('agent-selector');
const attachBtn     = document.getElementById('attach-btn');
const fileChips     = document.getElementById('file-chips');

let selectedFiles = [];

// ─── File helpers ──────────────────────────────────────────────

function renderChips() {
  fileChips.innerHTML = '';
  selectedFiles.forEach((f, i) => {
    const chip = document.createElement('div');
    chip.className = 'file-chip';
    chip.innerHTML = `
      <svg class="chip-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/>
      </svg>
      <span class="chip-name" title="${f.name}">${truncate(f.name, 22)}</span>
      <button class="chip-remove" data-i="${i}" type="button" aria-label="Remove">×</button>
    `;
    fileChips.appendChild(chip);
  });

  fileChips.querySelectorAll('.chip-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedFiles.splice(parseInt(btn.dataset.i, 10), 1);
      renderChips();
      syncAttachState();
    });
  });
  syncAttachState();
}

function addFiles(list) {
  Array.from(list).forEach(f => {
    if (!selectedFiles.find(ex => ex.name === f.name && ex.size === f.size)) {
      selectedFiles.push(f);
    }
  });
  renderChips();
}

function clearFiles() {
  selectedFiles = [];
  fileInput.value = '';
  renderChips();
}

function syncAttachState() {
  attachBtn.classList.toggle('has-files', selectedFiles.length > 0);
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

// ─── File triggers ─────────────────────────────────────────────

attachBtn.addEventListener('click', (e) => {
  if (e.target !== fileInput) fileInput.click();
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length) addFiles(fileInput.files);
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
});

// ─── Message rendering ─────────────────────────────────────────

function appendMessage(sender, text, isHTML = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}-message`;

  const avatar = document.createElement('div');
  avatar.className = `avatar ${sender}-avatar`;
  avatar.textContent = sender === 'user' ? 'U' : 'AI';

  const bubble = document.createElement('div');
  bubble.className = `bubble ${sender}-bubble`;
  if (isHTML) { bubble.innerHTML = text; } else { bubble.textContent = text; }

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTyping() {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message bot-message typing-indicator';
  msgDiv.innerHTML = `
    <div class="avatar bot-avatar">AI</div>
    <div class="bubble bot-bubble">
      <div class="typing"><span></span><span></span><span></span></div>
    </div>`;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msgDiv;
}

// ─── Form submit ───────────────────────────────────────────────

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text  = messageInput.value.trim();
  const files = [...selectedFiles];
  const agent = agentSelector.value;

  if (!text && files.length === 0) return;

  let userText = text;
  if (files.length > 0) {
    const names = files.map(f => f.name).join(', ');
    userText += userText ? ` *(Attached: ${names})*` : `*(Attached: ${names})*`;
  }
  appendMessage('user', userText);

  messageInput.value = '';
  clearFiles();

  const typingEl = showTyping();

  // ── EP Application Bot ─────────────────

  if (agent === 'ep-application') {
    const processKeywords = ['process', 'candidate', 'upload', 'generate', 'form', 'audit'];
    const shouldProcess   = processKeywords.some(kw => text.toLowerCase().includes(kw)) || files.length > 0;

    if (shouldProcess && files.length > 0) {
      try {
        const fd = new FormData();
        files.forEach(f => {
          const n = f.name.toLowerCase();
          if      (n.includes('passport'))                    fd.append('passport', f);
          else if (n.includes('cv') || n.includes('resume')) fd.append('cv', f);
          else if (n.includes('cert'))                        fd.append('certificates', f);
          else if (n.includes('photo') || n.includes('pic')) fd.append('photo', f);
          else                                                fd.append('certificates', f);
        });
        fd.append('message', text || 'Process candidate documents');

        const res  = await fetch('/api/process-candidate', { method: 'POST', body: fd });
        const data = await res.json();
        typingEl.remove();

        if (data.error) {
          appendMessage('bot', `**Error:** ${data.error}`, true);
        } else {
          let reply = `## ✅ Candidate Processing Complete\n\n`;
          reply += `**Status:** ${data.audit_status === 'PASSED' ? '✅ PASSED' : '⚠️ NEEDS ATTENTION'}\n\n`;
          if (data.pause_reasons?.length) {
            reply += `**Compliance Issues:**\n`;
            data.pause_reasons.forEach((r, i) => { reply += `${i + 1}. ${r}\n`; });
            reply += '\n';
          }
          reply += `**Candidate:** ${data.candidate_data?.name || 'Unknown'}\n`;
          reply += `**Passport:** ${data.candidate_data?.passport || 'N/A'}\n`;
          reply += `**Nationality:** ${data.candidate_data?.nationality || 'N/A'}\n\n`;
          reply += `**Output Folder:** \`${data.output_folder}\`\n\n`;
          reply += `Forms are ready in the output folder.`;
          appendMessage('bot', marked.parse(reply), true);
        }
      } catch (err) {
        typingEl.remove();
        appendMessage('bot', `Processing failed: ${err.message}`);
      }
      return;
    }

    // Standard chat
    try {
      const fd = new FormData();
      fd.append('message', text);
      fd.append('context', 'general');
      files.forEach(f => fd.append('file', f));

      const res  = await fetch('/api/chat', { method: 'POST', body: fd });
      const data = await res.json();
      typingEl.remove();

      if (data.error) {
        appendMessage('bot', `**Error:** ${data.error}`, true);
      } else {
        appendMessage('bot', marked.parse(data.reply), true);
      }
    } catch (err) {
      typingEl.remove();
      appendMessage('bot', `Connection failed: ${err.message}`);
    }
    return;
  }

  // ── HR Generalist (placeholder) ─────────

  if (agent === 'hr-generalist') {
    typingEl.remove();
    appendMessage('bot', marked.parse('**🚧 HR Generalist Bot — Coming Soon**\n\nThis feature is under development. Please use the EP Application Bot for now.'), true);
  }
});
