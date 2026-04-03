// HR Bot - Modern Chat UI v3.0

const form = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatWindow = document.getElementById('chat-window');
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('uploadArea');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const exportChatBtn = document.getElementById('exportChat');
const showStepsBtn = document.getElementById('showSteps');
const stepModal = document.getElementById('stepModal');
const closeModal = document.getElementById('closeModal');
const toast = document.getElementById('toast');
const copyToast = document.getElementById('copyToast');

// ========== THEME ==========
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

// ========== SIDEBAR ==========
function toggleSidebar() {
  sidebar.classList.toggle('open');
}

function collapseSidebar() {
  sidebar.classList.add('collapsed');
}

function expandSidebar() {
  sidebar.classList.remove('collapsed');
}

// ========== MODAL ==========
function openStepModal() {
  stepModal.classList.add('active');
}

function closeStepModal() {
  stepModal.classList.remove('active');
}

// ========== TOAST ==========
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ========== COPY ==========
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    copyToast.classList.add('show');
    setTimeout(() => copyToast.classList.remove('show'), 2000);
  });
}

// ========== EXPORT ==========
function exportChat() {
  const messages = document.querySelectorAll('.message');
  let text = 'HR Bot Chat\n' + '='.repeat(40) + '\n\n';
  messages.forEach(m => {
    const sender = m.classList.contains('user-message') ? 'You' : 'Bot';
    text += `[${sender}]\n${m.querySelector('.bubble').textContent}\n\n`;
  });
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `hr-bot-chat-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  showToast('Chat exported!');
}

// ========== FILE UPLOAD ==========
fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    const names = Array.from(fileInput.files).map(f => f.name).join(', ');
    uploadArea.querySelector('.upload-text').textContent = `📎 ${names}`;
    uploadArea.style.borderColor = 'var(--blue)';
    uploadArea.style.background = 'var(--bg-surface)';
  }
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  fileInput.files = e.dataTransfer.files;
  if (fileInput.files.length > 0) {
    const names = Array.from(fileInput.files).map(f => f.name).join(', ');
    uploadArea.querySelector('.upload-text').textContent = `📎 ${names}`;
    uploadArea.style.borderColor = 'var(--blue)';
  }
});

uploadArea.addEventListener('click', () => {
  fileInput.click();
});

// ========== MESSAGES ==========
function appendMessage(sender, text, isHTML = false) {
  const div = document.createElement('div');
  div.className = `message ${sender}-message`;
  div.innerHTML = `
    <div class="avatar">${sender === 'user' ? '👤' : '🤖'}</div>
    <div class="bubble">${isHTML ? text : text}</div>
  `;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'message bot-message typing-indicator';
  div.innerHTML = `
    <div class="avatar">🤖</div>
    <div class="bubble">
      <div class="typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return div;
}

// ========== QUICK ACTIONS ==========
document.querySelectorAll('.quick-reply, .phase-btn, .step-btn, .download-link, .quick-action-btn, .option-card, .flow-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const cmd = btn.dataset.command || btn.dataset.phase || btn.textContent.trim();
    
    // Handle phase buttons
    if (btn.classList.contains('phase-btn')) {
      const phase = btn.dataset.phase;
      sendMessage(`Phase ${phase}`);
    } 
    // Handle step buttons
    else if (btn.classList.contains('step-btn')) {
      const step = btn.dataset.step;
      sendMessage(`Step ${step}`);
    }
    // Handle flow buttons in modal
    else if (btn.classList.contains('flow-btn')) {
      const command = btn.dataset.command;
      sendMessage(command);
      closeStepModal();
    }
    // Handle option cards
    else if (btn.classList.contains('option-card')) {
      const command = btn.dataset.command;
      sendMessage(command);
    }
    // Handle download links
    else if (btn.classList.contains('download-link')) {
      window.open(btn.href, '_blank');
      showToast('Download started!');
      return;
    }
    // Handle other buttons
    else {
      sendMessage(cmd);
    }
    
    if (window.innerWidth <= 768) sidebar.classList.remove('open');
  });
});

// ========== SEND MESSAGE ==========
function sendMessage(text) {
  const files = Array.from(fileInput.files);
  if (!text && files.length === 0) return;

  let userText = text;
  if (files.length > 0) userText += ` (Attached: ${files.map(f => f.name).join(', ')})`;
  appendMessage('user', userText);

  messageInput.value = '';
  uploadArea.querySelector('.upload-text').textContent = 'Drop files here or click to upload';
  uploadArea.style.borderColor = '';
  uploadArea.style.background = '';
  fileInput.value = '';

  const typing = showTyping();

  // Send to API
  const formData = new FormData();
  formData.append('message', text);
  formData.append('context', 'general');
  files.forEach(f => formData.append('file', f));

  fetch('/api/chat', { 
    method: 'POST', 
    body: formData 
  })
  .then(res => res.json())
  .then(data => {
    typing.remove();
    if (data.error) {
      appendMessage('bot', `**Error**: ${data.error}`, true);
    } else {
      appendMessage('bot', marked.parse(data.reply), true);
    }
  })
  .catch(err => {
    typing.remove();
    appendMessage('bot', `Error: ${err.message}`);
  });
}

// ========== FORM SUBMIT ==========
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  sendMessage(text);
});

// ========== EVENT LISTENERS ==========
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.contains('collapsed') ? expandSidebar() : collapseSidebar();
});

menuToggle.addEventListener('click', toggleSidebar);

themeToggle.addEventListener('click', toggleTheme);

exportChatBtn.addEventListener('click', exportChat);

showStepsBtn.addEventListener('click', openStepModal);

closeModal.addEventListener('click', closeStepModal);

// Close modal on overlay click
stepModal.addEventListener('click', (e) => {
  if (e.target === stepModal) {
    closeStepModal();
  }
});

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
  // Focus input with Ctrl/Cmd + K
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    messageInput.focus();
  }
  
  // Close modal/sidebar with Escape
  if (e.key === 'Escape') {
    sidebar.classList.remove('open');
    closeStepModal();
  }
  
  // Send with Enter (Shift+Enter for new line)
  if (e.key === 'Enter' && !e.shiftKey && document.activeElement === messageInput) {
    e.preventDefault();
    form.dispatchEvent(new Event('submit'));
  }
});

// ========== INIT ==========
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  // Welcome animation
  setTimeout(() => {
    const welcome = document.querySelector('.welcome-message');
    if (welcome) {
      welcome.style.opacity = '0';
      welcome.style.transform = 'translateY(20px)';
      setTimeout(() => {
        welcome.style.transition = 'all 0.6s ease';
        welcome.style.opacity = '1';
        welcome.style.transform = 'translateY(0)';
      }, 100);
    }
  }, 200);
});
