# Pantas HR Team of Agents - Technical Architecture

**Version:** 1.0.0  
**Date:** March 27, 2026  
**Status:** Phase 1 Complete, Mobile Planning

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Web App    │  │  Mobile App  │  │  Admin       │         │
│  │  (HTML/CSS/  │  │  (Kotlin     │  │  Portal      │         │
│  │   JS)        │  │   Multiplat) │  │  (Web)       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Express.js API Server                        │  │
│  │  - Authentication & Authorization                         │  │
│  │  - Rate Limiting                                          │  │
│  │  - Request Validation                                     │  │
│  │  - API Versioning                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Agent Plugin Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              HRAgent Base Interface                       │  │
│  │  - initialize()                                           │  │
│  │  - process(message, context)                              │  │
│  │  - getStatus()                                            │  │
│  │  - shutdown()                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Tier 1 (Core HR):                                              │
│  ┌─────────┐ ┌──────────┐ ┌───────┐ ┌─────────┐               │
│  │ EP App  │ │Onboarding│ │ Leave │ │Interview│               │
│  │ Agent   │ │ Agent    │ │ Agent │ │ Agent   │               │
│  └─────────┘ └──────────┘ └───────┘ └─────────┘               │
│                                                                 │
│  Tier 2 (Essential HR):                                         │
│  ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐              │
│  │Payroll │ │Expense │ │Performance│ │Talent   │              │
│  │ Agent  │ │ Agent  │ │ Agent    │ │ Scout   │              │
│  └────────┘ └────────┘ └──────────┘ └─────────┘              │
│                                                                 │
│  Tier 3 (Support):                                              │
│  ┌─────┐ ┌────────┐ ┌──────────┐ ┌──────────┐                 │
│  │ IT  │ │Facility│ │Attendance│ │Engagement│                 │
│  │Support│ │ Agent │ │ Agent    │ │ Agent    │                 │
│  └─────┘ └────────┘ └──────────┘ └──────────┘                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Core Services Layer                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │   User   │ │ Employee │ │Department│ │  Team    │          │
│  │  Service │ │ Service  │ │ Service  │ │ Service  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Document │ │Notification│ │Analytics │ │  Audit   │          │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  PostgreSQL  │  │    Redis     │  │  File Store  │         │
│  │  (Primary)   │  │   (Cache)    │  │  (S3/Local)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   External Integrations                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────┐ ┌─────────┐ ┌──────┐ ┌──────┐ ┌────────┐          │
│  │  ESD   │ │PERKESO  │ │JTKSM │ │Slack │ │ Google │          │
│  │ Portal │ │(MyFuture│ │Portal│ │&Email│ │Calendar│          │
│  │        │ │  Jobs)  │ │      │ │      │ │        │          │
│  └────────┘ └─────────┘ └──────┘ └──────┘ └────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Multi-Platform App Architecture

### **Design Principles (Learned from Industry Best Practices)**

1. **Shared Business Logic** - Core functionality written once, used everywhere
2. **Platform-Specific UI** - Native look and feel on each platform
3. **Plugin-Based Agents** - Each agent is a self-contained module
4. **Offline-First** - Works without connection, syncs when online
5. **Real-Time Sync** - Changes propagate instantly across devices

### **Kotlin Multiplatform (KMP) Structure**

```
mobile-app/
├── shared/                    # Shared code (Kotlin)
│   ├── src/commonMain/
│   │   ├── kotlin/
│   │   │   ├── api/          # API client
│   │   │   ├── database/     # SQLDelight database
│   │   │   ├── models/       # Data models
│   │   │   ├── agents/       # Agent business logic
│   │   │   └── utils/        # Shared utilities
│   │   └── commonMain.kotlin_module
│   │
│   ├── src/androidMain/
│   │   └── kotlin/
│   │       ├── ui/           # Android UI (Compose)
│   │       └── platform/     # Android-specific implementations
│   │
│   └── src/iosMain/
│       └── kotlin/
│           ├── ui/           # iOS UI (SwiftUI/UIKit)
│           └── platform/     # iOS-specific implementations
│
├── androidApp/                # Android application
│   └── src/main/
│       ├── kotlin/
│       └── AndroidManifest.xml
│
└── iosApp/                    # iOS application
    └── iosApp/
        ├── iosApp.swift
        └── ContentView.swift
```

### **Plugin Architecture for Agents**

```kotlin
// Shared code (commonMain)

// Base interface that all agents must implement
interface HRAgent {
    val id: String
    val name: String
    val version: String
    val icon: String
    val status: AgentStatus
    
    suspend fun initialize(): Result<Unit>
    suspend fun process(message: String, context: AgentContext): AgentResponse
    suspend fun shutdown(): Result<Unit>
    fun getStatus(): AgentStatus
}

enum class AgentStatus {
    ACTIVE,
    INACTIVE,
    ERROR,
    MAINTENANCE
}

data class AgentContext(
    val userId: String,
    val employeeId: String,
    val department: String,
    val role: UserRole,
    val preferences: UserPreferences
)

data class AgentResponse(
    val message: String,
    val action: AgentAction?,
    val data: Map<String, Any>?,
    val quickActions: List<QuickAction>
)

// Example: EP Application Agent Implementation
class EPApplicationAgent : HRAgent {
    override val id = "ep-application"
    override val name = "EP Application Agent"
    override val version = "3.5.0"
    override val icon = "🛂"
    override var status = AgentStatus.INACTIVE
    
    private val documentService: DocumentService
    private val templateService: TemplateService
    
    override suspend fun initialize(): Result<Unit> {
        // Initialize services, load templates
        status = AgentStatus.ACTIVE
        return Result.success(Unit)
    }
    
    override suspend fun process(message: String, context: AgentContext): AgentResponse {
        // Process EP-related queries
        return when {
            message.contains("phase", ignoreCase = true) -> handlePhaseQuery(message)
            message.contains("document", ignoreCase = true) -> handleDocumentQuery(message)
            message.contains("upload", ignoreCase = true) -> handleUploadQuery(message)
            else -> handleGeneralQuery(message)
        }
    }
    
    override suspend fun shutdown(): Result<Unit> {
        // Cleanup resources
        status = AgentStatus.INACTIVE
        return Result.success(Unit)
    }
}
```

---

## 🔌 Agent Plugin System

### **Plugin Manifest**

Each agent includes a manifest file:

```json
{
  "agent": {
    "id": "ep-application",
    "name": "EP Application Agent",
    "version": "3.5.0",
    "description": "Automate Employment Pass applications for Malaysia",
    "author": "Pantas HR Team",
    "license": "Proprietary"
  },
  "capabilities": [
    "document-management",
    "template-generation",
    "file-upload",
    "chat-support"
  ],
  "permissions": [
    "read:employee-data",
    "write:documents",
    "send:notifications"
  ],
  "dependencies": {
    "platform": ">=2.0.0",
    "database": ">=1.0.0",
    "storage": ">=1.0.0"
  },
  "endpoints": [
    {
      "path": "/api/ep/chat",
      "method": "POST",
      "handler": "processChat"
    },
    {
      "path": "/api/ep/templates",
      "method": "GET",
      "handler": "getTemplates"
    }
  ],
  "ui": {
    "icon": "🛂",
    "color": "#2563eb",
    "badge": "LIVE"
  }
}
```

### **Plugin Loader**

```javascript
// core/plugin-loader.js

const fs = require('fs');
const path = require('path');

class PluginLoader {
  constructor() {
    this.plugins = new Map();
    this.pluginDir = path.join(__dirname, '..', 'agents');
  }

  async loadAll() {
    const agentDirs = fs.readdirSync(this.pluginDir);
    
    for (const dir of agentDirs) {
      try {
        await this.loadPlugin(dir);
        console.log(`✅ Loaded plugin: ${dir}`);
      } catch (error) {
        console.error(`❌ Failed to load plugin ${dir}:`, error);
      }
    }
  }

  async loadPlugin(name) {
    const pluginPath = path.join(this.pluginDir, name);
    const manifestPath = path.join(pluginPath, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Validate manifest
    this.validateManifest(manifest);
    
    // Load agent module
    const agentModule = require(path.join(pluginPath, 'index.js'));
    const agent = new agentModule.Agent();
    
    // Initialize agent
    await agent.initialize();
    
    // Register agent
    this.plugins.set(manifest.agent.id, {
      manifest,
      agent,
      routes: this.registerRoutes(agent, manifest)
    });
  }

  validateManifest(manifest) {
    const required = ['agent', 'capabilities', 'permissions'];
    for (const field of required) {
      if (!manifest[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  registerRoutes(agent, manifest) {
    const routes = [];
    // Register API endpoints from manifest
    for (const endpoint of manifest.endpoints || []) {
      routes.push({
        path: endpoint.path,
        method: endpoint.method,
        handler: agent[endpoint.handler].bind(agent)
      });
    }
    return routes;
  }

  getPlugin(id) {
    return this.plugins.get(id);
  }

  getAllPlugins() {
    return Array.from(this.plugins.values());
  }
}

module.exports = { PluginLoader };
```

---

## 🗄️ Database Schema

### **PostgreSQL Schema (Production)**

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    employee_id UUID REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    department_id UUID REFERENCES departments(id),
    team_id UUID REFERENCES teams(id),
    designation VARCHAR(255),
    manager_id UUID REFERENCES employees(id),
    join_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    location VARCHAR(255),
    employment_type VARCHAR(50),
    work_arrangement VARCHAR(50),
    leave_balance INTEGER DEFAULT 0,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    headcount INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES departments(id),
    lead_id UUID REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent executions (for analytics)
CREATE TABLE agent_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id),
    input TEXT,
    output TEXT,
    duration_ms INTEGER,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id),
    type VARCHAR(100),
    url TEXT NOT NULL,
    metadata JSONB,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(100),
    title VARCHAR(255),
    message TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_agent_executions_agent ON agent_executions(agent_id);
CREATE INDEX idx_documents_employee ON documents(employee_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
```

---

## 🔐 Security Architecture

### **Authentication Flow**

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│  Client │      │   API   │      │  Auth   │      │Database │
│         │      │ Gateway │      │ Service │      │         │
└────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘
     │                │                │                │
     │  1. Login      │                │                │
     │───────────────>│                │                │
     │                │  2. Validate   │                │
     │                │───────────────>│                │
     │                │                │  3. Query User │
     │                │                │───────────────>│
     │                │                │<───────────────│
     │                │<───────────────│                │
     │                │                │                │
     │                │  4. Generate JWT                │
     │                │───────────────>│                │
     │                │                │                │
     │  5. JWT Token  │                │                │
     │<───────────────│                │                │
     │                │                │                │
     │  6. Request with JWT            │                │
     │───────────────>│                │                │
     │                │  7. Verify JWT │                │
     │                │───────────────>│                │
     │                │<───────────────│                │
     │                │                │                │
     │  8. Response   │                │                │
     │<───────────────│                │                │
     │                │                │                │
```

### **JWT Token Structure**

```javascript
{
  "userId": "uuid",
  "employeeId": "uuid",
  "email": "user@pantas.com",
  "role": "employee",
  "iat": 1711526400,
  "exp": 1711612800
}
```

### **Security Measures**

| Layer | Measure | Implementation |
|-------|---------|----------------|
| **Transport** | HTTPS/TLS | All communication encrypted |
| **Authentication** | JWT + Sessions | Stateless + stateful options |
| **Authorization** | RBAC | Role-based access control |
| **Password** | bcrypt | Salted hashing (10 rounds) |
| **API** | Rate Limiting | Prevent abuse |
| **Data** | Encryption at Rest | Database encryption |
| **Audit** | Logging | All actions logged |

---

## 📊 API Design

### **RESTful API Structure**

```
/api/v1/
├── auth/
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /register
│   └── GET  /me
│
├── employees/
│   ├── GET    /              # List all employees
│   ├── POST   /              # Create employee
│   ├── GET    /:id           # Get employee by ID
│   ├── PUT    /:id           # Update employee
│   ├── DELETE /:id           # Delete employee
│   └── GET    /:id/stats     # Employee statistics
│
├── departments/
│   ├── GET /                 # List all departments
│   └── GET /:id              # Get department details
│
├── teams/
│   ├── GET /                 # List all teams
│   └── GET /:id              # Get team details
│
├── agents/
│   ├── GET /                 # List all agents
│   ├── GET /:id              # Get agent details
│   └── POST /:id/process     # Process with agent
│
└── dashboard/
    └── GET /stats            # Dashboard statistics
```

### **API Response Format**

```javascript
// Success response
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-03-27T10:30:00Z",
    "version": "1.0.0"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-03-27T10:30:00Z",
    "version": "1.0.0"
  }
}
```

---

## 📱 Mobile App Features

### **Feature Comparison**

| Feature | Web App | Mobile App | Notes |
|---------|---------|------------|-------|
| **Dashboard** | ✅ | ✅ | Same data, optimized layout |
| **Employee Profile** | ✅ | ✅ | Mobile: camera for avatar |
| **Leave Management** | ✅ | ✅ | Mobile: push notifications |
| **Expense Claims** | ✅ | ✅ | Mobile: receipt scanner |
| **EP Application** | ✅ | ✅ | Same functionality |
| **Document Upload** | ✅ | ✅ | Mobile: camera integration |
| **Notifications** | ❌ | ✅ | Push notifications |
| **Offline Mode** | ❌ | ✅ | Local database sync |
| **Biometric Auth** | ❌ | ✅ | Face ID, Touch ID |
| **Geolocation** | ❌ | ✅ | Attendance tracking |

### **Mobile App Screens**

```
┌─────────────────────────────────────────┐
│  Authentication Flow                    │
├─────────────────────────────────────────┤
│  1. Splash Screen                       │
│  2. Login (Email/Biometric)             │
│  3. Onboarding (first-time users)       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Main Navigation (Bottom Tab Bar)       │
├─────────────────────────────────────────┤
│  📊 Dashboard    │  🤖 Agents           │
│  👤 Profile      │  🔔 Notifications    │
│  ⚙️ Settings     │                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Dashboard Screen                       │
├─────────────────────────────────────────┤
│  - Welcome header                       │
│  - Quick stats cards                    │
│  - Recent activity                      │
│  - Agent shortcuts                      │
│  - Upcoming events                      │
└─────────────────────────────────────────┘
```

---

## 🔄 Deployment Architecture

### **Development Environment**

```
┌─────────────────────────────────────────┐
│  Local Development                      │
├─────────────────────────────────────────┤
│  - Node.js server (port 3000)           │
│  - SQLite database (file-based)         │
│  - Local file storage                   │
│  - Hot reload enabled                   │
└─────────────────────────────────────────┘
```

### **Production Environment**

```
┌─────────────────────────────────────────────────────────┐
│  Cloud Infrastructure (AWS/Azure)                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐                                       │
│  │   CloudFlare│  (CDN + DDoS Protection)              │
│  └──────┬──────┘                                       │
│         │                                               │
│  ┌──────▼──────┐                                       │
│  │Load Balancer│  (Auto-scaling)                       │
│  └──────┬──────┘                                       │
│         │                                               │
│  ┌──────▼──────────────────────────────┐               │
│  │         EC2 Instances               │               │
│  │  ┌─────────┐  ┌─────────┐          │               │
│  │  │  Node 1 │  │  Node 2 │  ...     │               │
│  │  └─────────┘  └─────────┘          │               │
│  └─────────────────────────────────────┘               │
│         │                                               │
│  ┌──────▼──────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL │  │    Redis     │  │     S3       │  │
│  │  (Primary + │  │   (Cache +   │  │  (File       │  │
│  │   Replica)  │  │   Sessions)  │  │   Storage)   │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────┐       │
│  │  Monitoring & Logging                       │       │
│  │  - CloudWatch                               │       │
│  │  - DataDog/New Relic                        │       │
│  │  - Sentry (Error Tracking)                  │       │
│  └─────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

---

## 📈 Monitoring & Observability

### **Key Metrics to Track**

| Category | Metric | Alert Threshold |
|----------|--------|-----------------|
| **Performance** | API Response Time | > 500ms |
| **Performance** | Page Load Time | > 3s |
| **Availability** | Uptime | < 99.9% |
| **Errors** | Error Rate | > 1% |
| **Database** | Query Time | > 100ms |
| **Database** | Connection Pool | > 80% |
| **Business** | Active Users | < expected |
| **Business** | Agent Executions | Anomaly detection |

### **Logging Strategy**

```javascript
// Structured logging format
{
  "timestamp": "2026-03-27T10:30:00Z",
  "level": "INFO",
  "service": "hr-platform",
  "traceId": "abc123",
  "userId": "user-uuid",
  "action": "employee.created",
  "message": "New employee created",
  "metadata": {
    "employeeId": "EMP001",
    "department": "Engineering"
  }
}
```

---

**Last Updated:** March 27, 2026  
**Next Review:** April 10, 2026  
**Owner:** Tech Lead
