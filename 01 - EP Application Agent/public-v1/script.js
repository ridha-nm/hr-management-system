// EP Bot - Clean & Simple

const form = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatWindow = document.getElementById('chat-window');
const fileInput = document.getElementById('file-input');
const fileNameDisplay = document.getElementById('file-name');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const exportChatBtn = document.getElementById('exportChat');
const toast = document.getElementById('toast');
const copyToast = document.getElementById('copyToast');

// Theme
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('.theme-icon');
  const text = themeToggle.querySelector('span:last-child');
  if (theme === 'dark') {
    icon.textContent = '☀️';
    text.textContent = 'Light Mode';
  } else {
    icon.textContent = '🌙';
    text.textContent = 'Dark Mode';
  }
}

// Sidebar
function toggleSidebar() {
  sidebar.classList.toggle('open');
}

function collapseSidebar() {
  sidebar.classList.add('collapsed');
}

function expandSidebar() {
  sidebar.classList.remove('collapsed');
}

// Toast
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Copy
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    copyToast.classList.add('show');
    setTimeout(() => copyToast.classList.remove('show'), 2000);
  });
}

// Export
function exportChat() {
  const messages = document.querySelectorAll('.message');
  let text = 'EP Bot Chat\n' + '='.repeat(40) + '\n\n';
  messages.forEach(m => {
    const sender = m.classList.contains('user-message') ? 'You' : 'Bot';
    text += `[${sender}]\n${m.querySelector('.bubble').textContent}\n\n`;
  });
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `chat-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  showToast('Chat exported!');
}

// File
fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    fileNameDisplay.textContent = Array.from(fileInput.files).map(f => f.name).join(', ');
    fileNameDisplay.style.display = 'inline';
  }
});

// Messages
function appendMessage(sender, text, isHTML = false) {
  const div = document.createElement('div');
  div.className = `message ${sender}-message`;
  div.innerHTML = `
    <div class="avatar">${sender === 'user' ? 'U' : 'AI'}</div>
    <div class="bubble">${isHTML ? text : text}</div>
  `;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'message bot-message typing-indicator';
  div.innerHTML = `
    <div class="avatar">AI</div>
    <div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>
  `;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return div;
}

// Quick replies
document.querySelectorAll('.quick-reply, .phase-btn, .download-link').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const cmd = btn.dataset.command || btn.textContent.trim();
    if (btn.classList.contains('download-link')) {
      window.open(btn.href, '_blank');
      showToast('Download started!');
      return;
    }
    messageInput.value = cmd;
    form.dispatchEvent(new Event('submit'));
    if (window.innerWidth <= 1024) sidebar.classList.remove('open');
  });
});

// Submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  const files = Array.from(fileInput.files);
  if (!text && files.length === 0) return;

  let userText = text;
  if (files.length > 0) userText += ` (Attached: ${files.map(f => f.name).join(', ')})`;
  appendMessage('user', userText);

  messageInput.value = '';
  fileNameDisplay.textContent = '';
  fileInput.value = '';

  const typing = showTyping();

  try {
    const formData = new FormData();
    formData.append('message', text);
    formData.append('context', 'general');
    files.forEach(f => formData.append('file', f));

    const res = await fetch('/api/chat', { method: 'POST', body: formData });
    const data = await res.json();
    typing.remove();

    if (data.error) {
      appendMessage('bot', `**Error**: ${data.error}`, true);
    } else {
      appendMessage('bot', marked.parse(data.reply), true);
    }
  } catch (err) {
    typing.remove();
    appendMessage('bot', `Error: ${err.message}`);
  }
});

// Events
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.contains('collapsed') ? expandSidebar() : collapseSidebar();
});
menuToggle.addEventListener('click', toggleSidebar);
themeToggle.addEventListener('click', toggleTheme);
exportChatBtn.addEventListener('click', exportChat);

// Keyboard
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    messageInput.focus();
  }
  if (e.key === 'Escape') sidebar.classList.remove('open');
});

// Init
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
});
