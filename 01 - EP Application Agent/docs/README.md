# Technical Documentation

**For developers and technical reference**

---

## 📁 What's Here

This folder contains technical documentation for the EP Application Bot.

### Source Code Documentation
- Bot logic and keyword matching
- Server configuration
- API endpoints

### Testing
- Test procedures
- Test data references

### Deployment
- Server setup
- Configuration

---

## 🤖 Bot Source Code

**Location:** `src/`

**Key Files:**
- `keywordBot.js` - Keyword-based response system
- `server.js` - Express server
- `extractors/` - Document extraction (optional, requires API)
- `audit/` - Compliance audit logic (optional)

---

## ⚙️ Configuration

**Environment Variables:**
```bash
# Server
PORT=3000
```

**Note:** Bot works without API keys using keyword matching!

---

## 🚀 Quick Start (Technical)

```bash
# Install dependencies
npm install

# Start server
node server.js

# Open browser
open http://localhost:3000
```

---

## 📖 User Documentation

For user guides and templates, see:
- **Getting Started:** `01_Getting_Started/`
- **Templates:** `02_Templates/`
- **Company Docs:** `03_Company_Documents/`

---

**📁 Folder:** docs/  
**Use for:** Technical reference and development
