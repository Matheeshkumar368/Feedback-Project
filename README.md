# AuraHR - Employee Feedback AI Agent 🚀

AuraHR is a next-generation, full-stack workplace sentiment intelligence platform. It features secure admin and employee dashboards, dynamic feedback form creation (like Google Forms), direct secure messaging, and **Google Gemini AI** processing to automatically run deep psychological sentiment and stress audits on employee feedback.

---

## 🎨 Design Concept: "Obsidian Neon"

AuraHR is styled with a custom dark UI:
- **Obsidian Dark Theme**: Crafted using deep slates and charcoal off-blacks (`#030712`, `#0b0f19`) with luxurious negative space and glowing sapphire and amethyst accent colors.
- **Micro-interactions**: Interactive progress gauges, sentiment meters, and feedback summaries.
- **Aesthetic Pairings**: Headings pair Inter and Space Grotesk for display rhythm, while data indices use JetBrains Mono.

---

## ✨ Features

### 🏢 HR Administration Panel
1. **Dynamic Form Builder**: Define questions with text fields, 1-5 rating scales, or custom drop-down selection options. Published forms instantly appear in employee portals.
2. **Interactive Sentiment Analytics**: Review metrics such as Average Morale rating, Sentiment breakdown ratios, and Departmental engagement meters.
3. **Critical HR Burnout Alerts**: High-urgency warning system powered by AI that surfaces employees indicating stress, extreme workload, or systemic blocks.
4. **AI HR Consultant**: Directly chat with a professional HR strategy co-pilot that scans all submissions to draft policies, mitigation plans, and general team updates.
5. **Direct Secure Mailbox**: Send direct follow-ups and messages to employees.

### 👥 Confidential Employee Portal
1. **Interactive Check-ins**: Fill out active survey and culture check-ins dynamically in a beautifully styled wizard.
2. **Confidential AI Coach**: Chat privately with an AI workspace wellbeing helper about managing stress, professional boundary setting, or pre-conversation advice.
3. **Secure HR Hot-line**: Send messages directly to the HR administration team to discuss issues securely.

### 🧠 Gemini AI Engine
- **Automated sentiment reports** generated instantly upon submission.
- Empathic summary paragraph mapping written feedback.
- Numeric sentiment index score generation (1-100%).
- Actionable management recommendations to resolve employee friction.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons + Motion
- **Build System**: Vite 6 + esbuild CJS bundling
- **Backend**: Node.js + Express.js + tsx runner
- **Database**: MongoDB Atlas via Mongoose ODM
- **AI Core**: `@google/genai` (utilizing `gemini-3.5-flash`)

---

## 📁 Folder Structure

```text
├── .env.example            # Environment variables example
├── Dockerfile              # Production multi-stage Docker build
├── docker-compose.yml      # Service orchestration
├── package.json            # Scripts & App dependencies
├── server.ts               # Express.js main backend
├── server/
│   └── models.ts           # Mongoose Database schemas
├── src/
│   ├── App.tsx             # State view router
│   ├── index.css           # Tailwind v4 theme & Global fonts
│   ├── main.tsx            # React SPA Entry point
│   ├── types.ts            # Type definitions
│   └── components/
│       ├── RoleSelector.tsx      # Landing selection and login
│       ├── AdminDashboard.tsx    # Admin visual statistics
│       ├── EmployeeDashboard.tsx # Survey forms submission
│       ├── AIChat.tsx            # Co-pilot chats
│       └── Messages.tsx          # Chat thread messaging
├── metadata.json           # AI Studio app metadata
├── tsconfig.json           # TypeScript compilation config
└── vite.config.ts          # Vite asset pipeline configuration
```

---

## 🚀 How to Run the App

### Prerequisites
- [Node.js v20+](https://nodejs.org) or [Docker Desktop](https://www.docker.com)
- MongoDB Connection String (Atlas or Local)
- Google Gemini API Key

---

### Option A: Local Run (Development)

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root folder using `.env.example`:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_KEY"
   MONGODB_URI="mongodb+srv://..."
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will boot on **http://localhost:3000** with hot reload.

---

### Option B: Production Build

1. **Build the assets and server**:
   ```bash
   npm run build
   ```
   This compiles the React code to static assets inside `/dist` and bundles the Express backend server into `/dist/server.cjs` via `esbuild`.

2. **Start the production server**:
   ```bash
   npm start
   ```

---

### Option C: Running with Docker 🐳

1. **Build and Run with Docker Compose**:
   ```bash
   docker-compose up --build -d
   ```
   AuraHR will be running inside a secure container on `http://localhost:3000`.

---

## 📊 API Documentation

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/forms` | `GET` | All | Fetch active surveys and check-ins |
| `/api/forms` | `POST` | Admin | Create and publish a dynamic custom feedback form |
| `/api/forms/:id` | `DELETE`| Admin | Archive a feedback form |
| `/api/submissions` | `GET` | Admin | Fetch all employee submissions and sentiment reports |
| `/api/submissions` | `POST` | Employee | Submit feedback; triggers real-time Gemini AI sentiment analysis |
| `/api/stats` | `GET` | Admin | Fetch aggregated statistics, sentiment metrics & breakdowns |
| `/api/messages` | `GET` | All | Fetch conversation messages |
| `/api/messages` | `POST` | All | Send direct messages |
| `/api/ai-chat` | `POST` | All | Chat with the strategic/anonymous AI Agent |

---

## 📸 Screenshots

### 1. Unified Landing & Login (HR vs. Employee)
*Beautiful obsidian gradient selection card supporting secure Admin credentials or dynamic Employee profile creation.*

### 2. HR Analytics Dashboard
*High-contrast statistical widgets showing average morale rating, action-needed warning flags, sentiment trends, and bar charts.*

### 3. Dynamic Form Creator
*Add multiple text inputs, select criteria, and 1-5 rating questions. Dynamic preview displays exactly how it appears to employees.*

### 4. Interactive AI-Powered Feedbacks Review
*Full submission tracking panel. Clicking on any employee entry triggers a detail modal with Gemini-evaluated summaries, categorized themes, and recommended management steps.*
