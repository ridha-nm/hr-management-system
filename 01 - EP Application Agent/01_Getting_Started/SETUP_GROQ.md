# Setup Guide - No API Key Required

**Last Updated:** March 25, 2026

---

## ✅ No API Key Needed!

This bot uses **keyword matching** to respond to your questions. No API key configuration is required!

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd "01 - EP Application Agent"
npm install
```

### Step 2: Run the Bot

```bash
node server.js
```

### Step 3: Open in Browser

**Open:** http://localhost:3000

---

## ✅ Verify Setup

**Test:**
```bash
node server.js
# Open http://localhost:3000
# You should see the chatbot interface
```

**Expected Output:**
```
HR Bot Chat Server running at http://localhost:3000
```

---

## 🎯 Quick Test

1. **Open:** http://localhost:3000
2. **Type:** "What documents do I need?"
3. **Expected:** Bot shows the document requirements

---

## 🤖 What You Can Ask

**Company Info:**
- "What is our staff breakdown?"
- "What is the starting salary?"

**Document Requirements:**
- "What documents needed for EP?"
- "JTKSM requirements"

**Contact Info:**
- "Who to contact for SSM?"
- "COO email"

**Templates:**
- "Email template for requesting documents"
- "Interview template"

**Process:**
- "MyFutureJobs process"
- "How to apply for EP"

---

## 🐛 Troubleshooting

### Error: "Module not found"
**Solution:** Run `npm install`

### Error: "Port already in use"
**Solution:** Change port: `PORT=3001 node server.js`

---

**🎉 You're ready to use the bot!**
