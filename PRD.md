# Pantas HR Team of Agents - Product Requirements Document (PRD)

**Version:** 1.0.0 (Production Release)  
**Date:** March 27, 2026  
**Status:** ✅ Production Ready (Phase 1 Complete)  
**Author:** Development Team  
**Stakeholders:** CEO, COO, HR Department, Engineering Team

---

## 📋 Executive Summary

### **Product Vision**

A unified HR management platform for Pantas Climate Solutions with specialized AI agents that automate repetitive HR tasks, ensure compliance with Malaysian regulations, and provide employees with a seamless self-service experience across web and mobile platforms.

**Purpose:** Internal deployment for Pantas Climate Solutions (not for external sale)

### **Problem Statement**

HR operations at Pantas Climate Solutions currently involve:
- Manual Employment Pass (EP) application processing (8-12 weeks per application)
- Document collection and verification across multiple phases
- Repetitive employee onboarding workflows
- Leave application tracking and approval coordination
- Interview scheduling and candidate communication
- Scattered employee data across multiple systems

### **Solution**

**Pantas HR Team of Agents** - An internal platform with:
1. **Centralized Employee Management System** - Single source of truth for employee data
2. **Specialized AI Agents** - Each handling specific HR functions autonomously
3. **Unified Interface** - Consistent experience across web and mobile
4. **Automated Compliance** - Built-in Malaysian regulation adherence
5. **Employee Self-Service** - Employees manage their own profiles and requests

### **Business Value for Pantas**
- **50% faster** EP application processing
- **100% compliance** with Malaysian immigration and labor laws
- **80% reduction** in manual HR administrative tasks
- **24/7 availability** for employee self-service
- **Real-time analytics** for HR decision-making
- **Centralized data** - all employee information in one designated area

---

## 🎯 Product Overview

### **Platform Architecture**

```
┌─────────────────────────────────────────────────────────┐
│              Pantas HR Team of Agents                   │
├─────────────────────────────────────────────────────────┤
│  Presentation Layer                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Web App   │  │  Mobile App │  │   Admin     │    │
│  │  (React)    │  │ (Flutter/   │  │   Portal    │    │
│  │             │  │  KMP)       │  │             │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
├─────────────────────────────────────────────────────────┤
│  AI Agent Layer (Plugin Architecture)                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│  │  EP  │ │ On-  │ │Leave │ │ Inter│ │Pay-  │ │Exp-  ││
│  │Agent │ │board │ │Agent │ │ iew  │ │roll  │ │ense  ││
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘│
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│  │Perf- │ │Talent│ │  IT  │ │Facil-│ │Atten-│ │Engage││
│  │ormance││Scout │ │Support│ │ity   │ │dance │ │ment  ││
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘│
├─────────────────────────────────────────────────────────┤
│  Core Services Layer                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   User Mgmt │  │  Employee   │  │  Department │    │
│  │   & Auth    │  │    DB       │  │   Mgmt      │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Document   │  │ Notification│  │  Analytics  │    │
│  │  Storage    │  │   Service   │  │  Dashboard  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
├─────────────────────────────────────────────────────────┤
│  Integration Layer                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  ESD     │ │ PERKESO  │ │  JTKSM   │ │  Slack   │  │
│  │  Portal  │ │ (MyFuture│ │  Portal  │ │  & Email │  │
│  │          │ │  Jobs)   │ │          │ │          │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
```

### **Technical Stack**

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Web Frontend** | HTML5, CSS3, Vanilla JS | Fast, no build step, easy deployment |
| **Mobile App** | Kotlin Multiplatform (KMP) | Single codebase for iOS + Android |
| **Backend** | Node.js + Express.js | Lightweight, scalable, real-time |
| **Database** | SQLite (Dev) → PostgreSQL (Prod) | File-based for dev, production-ready |
| **Authentication** | JWT + Sessions | Secure, stateless, industry standard |
| **File Storage** | Local (Dev) → AWS S3 (Prod) | Scalable cloud storage |
| **AI/ML** | Keyword-based (v1) → LLM (v2) | Start simple, upgrade later |

---

## 🤖 AI Agents Catalog

### **Tier 1: Core HR (Priority P0)**

| # | Agent | Status | Sprint | Description |
|---|-------|--------|--------|-------------|
| 1 | **EP Application Agent** | ✅ Live | v1.0 | Employment Pass automation for Malaysia |
| 2 | **Onboarding Agent** | 📋 Planned | v2.0 | 16-step automated new hire onboarding |
| 3 | **Leave Agent** | 📋 Planned | v2.0 | Leave application and approval workflow |
| 4 | **Interview Agent** | 📋 Planned | v2.0 | Interview scheduling and coordination |

### **Tier 2: Essential HR (Priority P1)**

| # | Agent | Status | Sprint | Description |
|---|-------|--------|--------|-------------|
| 5 | **Payroll Agent** | 📋 Planned | v3.0 | Salary processing, tax, EPF/SOCSO |
| 6 | **Expense Agent** | 📋 Planned | v3.0 | Expense claims and advances |
| 7 | **Performance Agent** | 📋 Planned | v3.0 | OKR/KRA tracking, appraisals |
| 8 | **Talent Scout Agent** | 📋 Planned | v3.0 | Recruitment and candidate sourcing |

### **Tier 3: Support Services (Priority P2)**

| # | Agent | Status | Sprint | Description |
|---|-------|--------|--------|-------------|
| 9 | **IT Support Agent** | 📋 Planned | v4.0 | IT tickets and equipment requests |
| 10 | **Facility Agent** | 📋 Planned | v4.0 | Room booking and desk allocation |
| 11 | **Attendance Agent** | 📋 Planned | v4.0 | Check-in/out, geolocation, shifts |
| 12 | **Engagement Agent** | 📋 Planned | v4.0 | Surveys, recognition, announcements |

---

## 📱 Multi-Platform Strategy

### **Phase 1: Web Application (Current)**
- **Technology:** HTML5, CSS3, Vanilla JavaScript
- **Features:**
  - Employee Management System
  - EP Application Agent (Live)
  - Profile Management with Avatar Upload
  - Department and Team Management
  - Dashboard with Analytics
- **Access:** http://localhost:3000/

### **Phase 2: Mobile Application (Planned)**
- **Technology:** Kotlin Multiplatform (KMP)
- **Platforms:** iOS 15+, Android 10+
- **Features:**
  - All web features
  - Push notifications
  - Biometric authentication
  - Offline mode
  - Camera integration (document scanning)
  - Geolocation (attendance tracking)

### **Phase 3: Unified Experience**
- **Single Sign-On (SSO)** across web and mobile
- **Real-time sync** of data across devices
- **Progressive Web App (PWA)** for web
- **Deep linking** for mobile

---

## 🏗️ Technical Architecture

### **Plugin Architecture (Inspired by Best Practices)**

```
agents/
├── core/                    # Core platform functionality
│   ├── auth/               # Authentication & authorization
│   ├── database/           # Database layer
│   ├── api/                # REST API endpoints
│   └── utils/              # Shared utilities
│
├── agents/                  # AI Agent plugins
│   ├── ep-application/     # EP Application Agent
│   ├── onboarding/         # Onboarding Agent
│   ├── leave/              # Leave Agent
│   └── ...                 # Other agents
│
├── plugins/                 # Shared plugin infrastructure
│   ├── multi-platform-apps/
│   │   ├── web/            # Web app components
│   │   ├── mobile/         # Mobile app components
│   │   └── shared/         # Shared business logic
│   ├── notifications/      # Notification service
│   └── storage/            # File storage abstraction
│
└── commands/                # CLI commands for development
    ├── dev-server/         # Development server
    ├── build/              # Build commands
    └── deploy/             # Deployment scripts
```

### **Agent Plugin Interface**

```javascript
// Base agent interface that all agents must implement
class HRAgent {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.version = config.version;
    this.status = 'inactive';
  }

  // Initialize agent
  async initialize() { }

  // Process user request
  async process(message, context) { }

  // Get agent status
  getStatus() { return this.status; }

  // Cleanup resources
  async shutdown() { }
}

// Example: EP Application Agent
class EPApplicationAgent extends HRAgent {
  constructor() {
    super({
      id: 'ep-application',
      name: 'EP Application Agent',
      version: '3.5.0'
    });
  }

  async initialize() {
    // Load templates, configure routes
    this.status = 'active';
  }

  async process(message, context) {
    // Handle EP-related queries
    return await this.handleQuery(message);
  }
}
```

---

## 📊 Current Implementation Status

### **✅ Completed Features (v1.0)**

#### **Employee Management System**
- [x] Employee CRUD operations
- [x] Department management (5 departments)
- [x] Team management (5 teams)
- [x] Profile editing with avatar upload
- [x] Email and team restrictions (admin-only)
- [x] LocalStorage for profile persistence
- [x] Toast notifications
- [x] Responsive design

#### **EP Application Agent**
- [x] Process Flow visualization (5 phases)
- [x] Document downloads (SSM, DBKL, JTKSM)
- [x] Template downloads (Word, CSV, Excel)
- [x] Upload & Auto-Fill functionality
- [x] Chat interface for questions
- [x] Quick question buttons (8 pre-defined)
- [x] Keyword-based responses
- [x] File upload processing

#### **Platform Features**
- [x] Unified sidebar navigation
- [x] White sidebar header with logo (top right)
- [x] "HR Management System" branding
- [x] Consistent design across all pages
- [x] Seamless navigation (no redirects)
- [x] Dashboard with stats
- [x] Employee directory
- [x] Department overview

### **🚧 In Progress**

- [ ] Onboarding Agent (Planning phase)
- [ ] Leave Agent (Planning phase)
- [ ] Interview Agent (Planning phase)
- [ ] Mobile app architecture design

### **📋 Planned (Next 6 Months)**

- [ ] Payroll Agent
- [ ] Expense Agent
- [ ] Performance Agent
- [ ] Talent Scout Agent
- [ ] Mobile app (iOS + Android)
- [ ] Push notifications
- [ ] Advanced analytics dashboard

---

## 📈 Metrics & KPIs

### **Current Metrics (Demo Mode)**

| Metric | Value | Target |
|--------|-------|--------|
| Total Employees | 33 | 50 by EOY 2026 |
| Departments | 5 | 8 by EOY 2026 |
| Live Agents | 1/12 | 4/12 by Q2 2026 |
| EP Processing Time | 8-12 weeks | 4-6 weeks (target) |
| Compliance Rate | 100% | Maintain 100% |

### **Success Metrics**

| Metric | Current | Target (6 months) | Impact |
|--------|---------|-------------------|--------|
| EP Application Time | 8-12 weeks | 4-6 weeks | 50% reduction |
| Manual HR Tasks | 100% | 20% | 80% automation |
| Employee Satisfaction | N/A | 4.5/5 | Improved UX |
| Compliance Violations | 0 | 0 | Risk mitigation |
| Time to Hire | N/A | -30% | Faster recruitment |

---

## 🚀 Deployment Strategy

### **Phase 1: Internal Deployment (Q2 2026)**
- **Audience:** Pantas Climate Solutions HR team
- **Features:** EP Agent + Employee Management
- **Goal:** Daily HR operations on the platform
- **Success Criteria:** HR team using it daily, 80% employee adoption

### **Phase 2: Core HR Agents (Q3 2026)**
- **Audience:** All Pantas employees
- **Features:** Onboarding, Leave, Interview agents
- **Goal:** Complete HR automation for core functions
- **Success Criteria:** 90% employee satisfaction

### **Phase 3: Mobile App (Q4 2026)**
- **Audience:** All Pantas employees (mobile access)
- **Features:** iOS + Android apps with push notifications
- **Goal:** Accessible anywhere, anytime
- **Success Criteria:** 70% mobile adoption

### **Phase 4: Full Automation (2027)**
- **Audience:** Pantas Climate Solutions
- **Features:** All 12 agents, advanced analytics
- **Goal:** Complete HR automation
- **Success Criteria:** 80% of HR tasks automated

---

## 💰 Cost Analysis

### **Infrastructure Costs (Monthly)**

| Service | Provider | Cost (MYR/month) |
|---------|----------|------------------|
| **Cloud Hosting** | AWS/Azure/DigitalOcean | 150-300 |
| **Database** | PostgreSQL (managed) | 100-200 |
| **File Storage** | AWS S3 | 50-100 |
| **Domain & SSL** | Namecheap/Let's Encrypt | 20 |
| **Email Service** | SendGrid (free tier) | 0 |
| **Total** | | **RM 320-620/month** |

### **Development Costs**

| Item | Cost (MYR) |
|------|------------|
| **Current Development** | Already invested (internal) |
| **Mobile App Development** | RM 80K-120K (if outsourced) |
| **Ongoing Maintenance** | RM 5K-10K/month (hosting + support) |

### **Cheapest Path Forward**

1. **Start with cloud hosting** (RM 320-620/month)
2. **Use free tiers** where possible (SendGrid, Let's Encrypt)
3. **Develop mobile app in-house** (use existing team)
4. **Phase deployment** - add features as needed

### **ROI for Pantas**

**Time Savings:**
- HR Admin Time: 40 hours/week → 8 hours/week (80% reduction)
- EP Processing: 8-12 weeks → 4-6 weeks (50% reduction)
- Annual Time Savings: ~1,500 hours

**Intangible Benefits:**
- ✅ Better employee experience
- ✅ Reduced errors
- ✅ Compliance assurance
- ✅ Data-driven decisions
- ✅ Scalable platform

---

## 🔒 Security & Compliance

### **Data Security**
- JWT-based authentication
- Encrypted password storage (bcrypt)
- Session management with expiry
- Role-based access control (RBAC)
- Audit logging for all actions

### **Compliance**
- Malaysian Personal Data Protection Act (PDPA)
- Employment Pass regulations (ESD, JTKSM, PERKESO)
- GDPR-ready for international expansion
- SOC 2 Type II certification (planned)

### **Data Privacy**
- Employee data encrypted at rest
- Secure file uploads (virus scanning)
- Data retention policies
- Right to deletion (GDPR)

---

## 📱 Mobile App Specifications

### **Technical Approach: Kotlin Multiplatform (KMP)**

**Why KMP?**
- Single codebase for iOS + Android
- Native performance
- Shared business logic
- Platform-specific UI when needed
- Growing ecosystem and community support

### **Core Features**

| Feature | Description | Priority |
|---------|-------------|----------|
| **Biometric Auth** | Face ID, Touch ID, Fingerprint | P0 |
| **Push Notifications** | Real-time alerts for approvals | P0 |
| **Offline Mode** | View data without connection | P1 |
| **Document Scanner** | Camera integration for uploads | P1 |
| **Geolocation** | Attendance tracking | P2 |
| **Dark Mode** | System theme detection | P2 |

### **Development Timeline**

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Design** | 2 weeks | UI/UX mockups, user flows |
| **Core Setup** | 3 weeks | KMP project, navigation, auth |
| **Feature Dev** | 8 weeks | All features implemented |
| **Testing** | 3 weeks | QA, bug fixes, performance |
| **Launch** | 2 weeks | App Store + Play Store submission |

**Total:** 18 weeks (~4.5 months)

---

## 🎯 Next Steps

### **Immediate (Next 2 Weeks)**
1. [ ] CEO approval on PRD
2. [ ] Finalize mobile app tech stack (KMP vs Flutter)
3. [ ] Begin Onboarding Agent planning
4. [ ] Set up production infrastructure (AWS/Azure)

### **Short-term (Next Month)**
1. [ ] Complete Onboarding Agent design
2. [ ] Start mobile app development
3. [ ] Migrate database to PostgreSQL
4. [ ] Implement advanced analytics

### **Long-term (Next Quarter)**
1. [ ] Launch all Tier 1 agents
2. [ ] Beta test with 3 partner companies
3. [ ] Mobile app beta release
4. [ ] Prepare for public launch

---

## 📞 Contact Information

**Product Owner:** [Your Name]  
**Email:** [your.email@pantas.com]  
**Slack:** #[hr-team-of-agents]  
**GitHub:** [Repository Link]

---

**Last Updated:** March 27, 2026  
**Next Review:** April 3, 2026  
**Version:** 1.0.0
