# Pantas Agent Team

**Version:** 4.0.0 (Multi-Agent Platform)
**Status:** 🚧 In Development

---

## 🎯 **Vision**

A unified HR platform with specialized AI agents for each HR function, accessible via web and mobile with secure authentication, user profiles, and company analytics.

---

## 🤖 **Available Agents**

### **✅ Live Agents**

| # | Agent | Purpose | Access |
|---|-------|---------|--------|
| 1 | **EP Application Agent** | Employment Pass automation | http://localhost:3000/chat.html |

### **🚧 Work in Progress (Tier 1 - Core HR)**

| # | Agent | Purpose | Priority | Status |
|---|-------|---------|----------|--------|
| 2 | **Onboarding Agent** | 16-step new hire onboarding | P0 | 📋 Planning |
| 3 | **Leave Agent** | Leave application & approval | P0 | 📋 Planning |
| 4 | **Interview Agent** | Interview scheduling & coordination | P0 | 📋 Planning |

### **📋 Planned Agents (Tier 2 - Essential HR)**

| # | Agent | Purpose | Priority |
|---|-------|---------|----------|
| 5 | **Payroll Agent** | Salary slips, tax, EPF/SOCSO | P1 |
| 6 | **Expense Agent** | Expense claims & advances | P1 |
| 7 | **Performance Agent** | OKR/KRA, appraisals, 360 feedback | P1 |
| 8 | **Talent Scout Agent** | Recruitment & candidate sourcing | P1 |

### **📋 Planned Agents (Tier 3 - Support Services)**

| # | Agent | Purpose | Priority |
|---|-------|---------|----------|
| 9 | **IT Support Agent** | IT tickets & equipment requests | P2 |
| 10 | **Facility Agent** | Room booking & desk allocation | P2 |
| 11 | **Attendance Agent** | Check-in/out, geolocation, shifts | P2 |
| 12 | **Engagement Agent** | Surveys, recognition, announcements | P2 |

---

## 🔐 **Platform Features (Coming Soon)**

### **Authentication**
- Email + Password login
- Google SSO
- Microsoft SSO
- Magic Link (passwordless)
- Multi-device sessions

### **User Profiles**
- Employee information
- Department & role
- Manager assignment
- Leave balance
- Attendance stats
- Goal progress

### **Company Management**
- Department structure
- Team organization
- Headcount tracking
- Location distribution
- Reporting hierarchy

### **Unified Dashboard**
- Quick stats (leave, expenses, goals, attendance)
- Agent cards with status
- Recent activity feed
- Notifications
- Upcoming events

---

## 📁 **Project Structure**

```
/
├── ARCHITECTURE.md              # Platform architecture plan
├── README.md                    # This file
│
├── 01 - EP Application Agent/   ✅ LIVE
│   ├── server.js
│   ├── public/
│   └── STATE.md
│
├── 02 - Onboarding Agent/       📋 PLANNING
│   └── Plan.md
│
├── 03 - Leave Agent/            📋 PLANNING
│   └── Plan.md
│
├── 04 - Interview Agent/        📋 PLANNING
│   └── Plan.md
│
├── 05 - Payroll Agent/          📋 PLANNING
│   └── Plan.md
│
├── 06 - Expense Agent/          📋 PLANNING
│   └── Plan.md
│
├── 07 - Performance Agent/      📋 PLANNING
│   └── Plan.md
│
├── 08 - Talent Scout Agent/     📋 PLANNING
│   └── Plan.md
│
├── 09 - IT Support Agent/       📋 PLANNING
│   └── Plan.md
│
├── 10 - Facility Agent/         📋 PLANNING
│   └── Plan.md
│
├── 11 - Attendance Agent/       📋 PLANNING
│   └── Plan.md
│
└── 12 - Engagement Agent/       📋 PLANNING
    └── Plan.md
```

---

## 🚀 **Development Roadmap**

### **Phase 1: Foundation (Weeks 1-8)**
- [ ] Authentication system
- [ ] User profiles
- [ ] Company structure
- [ ] Unified dashboard

### **Phase 2: Core Agents (Weeks 9-16)**
- [ ] Onboarding Agent
- [ ] Leave Agent
- [ ] Interview Agent

### **Phase 3: Essential Agents (Weeks 17-24)**
- [ ] Payroll Agent
- [ ] Expense Agent
- [ ] Performance Agent
- [ ] Talent Scout Agent

### **Phase 4: Support Agents (Weeks 25-32)**
- [ ] IT Support Agent
- [ ] Facility Agent
- [ ] Attendance Agent
- [ ] Engagement Agent

### **Phase 5: Mobile & Advanced (Weeks 33-40)**
- [ ] Mobile app (iOS + Android)
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Third-party integrations

---

## 🌐 **Access**

| Page | URL |
|------|-----|
| **Landing Page** | http://localhost:3000/ |
| **EP Agent Chat** | http://localhost:3000/chat.html |
| **WIP Pages** | http://localhost:3000/wip-hr-generalist.html |
| | http://localhost:3000/wip-talent-scout.html |



## 📊 **Architecture**

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed platform architecture including:
- Authentication system design
- User profile structure
- Company management
- Agent communication
- Technical stack
- Analytics dashboard

---

## 📝 **Inspiration**

Based on features from:
- **Frappe HRMS** - Employee lifecycle, leave, attendance, payroll, performance
- **HR Assistant Agent** - 16-step onboarding, IT ticketing, meeting scheduler

---

**📄 Created:** March 27, 2026
**📄 Last Updated:** March 27, 2026
**📄 Version:** 4.0.0
