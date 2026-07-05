<div align="center">

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║        ░█████╗░██╗░░░██╗██████╗░░█████╗░██╗░░██╗██████╗░     ║
║        ██╔══██╗██║░░░██║██╔══██╗██╔══██╗██║░░██║██╔══██╗     ║
║        ███████║██║░░░██║██████╔╝███████║███████║██████╔╝     ║
║        ██╔══██║██║░░░██║██╔══██╗██╔══██║██╔══██║██╔══██╗     ║
║        ██║░░██║╚██████╔╝██║░░██║██║░░██║██║░░██║██║░░██║     ║
║        ╚═╝░░╚═╝░╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝     ║
║                                                               ║
║          Employee Feedback Intelligence Platform              ║
╚═══════════════════════════════════════════════════════════════╝
```

<img src="https://img.shields.io/badge/STATUS-LIVE-00ff88?style=for-the-badge&logo=render&logoColor=white&labelColor=0a0a1a"/>
<img src="https://img.shields.io/badge/AI-GEMINI-6c47ff?style=for-the-badge&logo=google&logoColor=white&labelColor=0a0a1a"/>
<img src="https://img.shields.io/badge/DB-MONGODB-00ed64?style=for-the-badge&logo=mongodb&logoColor=white&labelColor=0a0a1a"/>
<img src="https://img.shields.io/badge/REACT-19-61dafb?style=for-the-badge&logo=react&logoColor=white&labelColor=0a0a1a"/>
<img src="https://img.shields.io/badge/NODE-EXPRESS-68a063?style=for-the-badge&logo=node.js&logoColor=white&labelColor=0a0a1a"/>

</div>

---

<div align="center">

## ◈ LIVE DEMO

### 🌐 [`https://feedback-project-leb9.onrender.com`](https://feedback-project-leb9.onrender.com)

> ⚡ Hosted on **Render** · Free Tier · Node Runtime · Branch: `main`
>
> ℹ️ First load may take ~30s on free tier (cold start)

</div>

---

```
┌─────────────────────────────────────────────────────────────┐
│  ▓▓▓  WHAT IS AURAHR?                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   A smart HR platform where employees submit feedback       │
│   and Google Gemini AI instantly analyzes the sentiment,    │
│   detects stress & burnout, and gives HR actionable         │
│   recommendations — all in real time.                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ◈ Features

```
╭──────────────────────────╮    ╭──────────────────────────╮
│   🏢  ADMIN PANEL        │    │   👤  EMPLOYEE PORTAL    │
├──────────────────────────┤    ├──────────────────────────┤
│ ► Build feedback forms   │    │ ► Submit survey answers  │
│ ► View AI sentiment data │    │ ► Chat with AI coach     │
│ ► Burnout alert system   │    │ ► Message HR directly    │
│ ► Chat with HR AI bot    │    │ ► Anonymous & secure     │
│ ► Message employees      │    │                          │
╰──────────────────────────╯    ╰──────────────────────────╯

╭──────────────────────────────────────────────────────────╮
│   🧠  GEMINI AI ENGINE                                   │
├──────────────────────────────────────────────────────────┤
│ ► Sentiment score  (1 – 100)                             │
│ ► Positive / Neutral / Negative classification           │
│ ► Urgency level  (Low / Medium / High)                   │
│ ► Empathetic summary paragraph                           │
│ ► Actionable HR recommendations                          │
╰──────────────────────────────────────────────────────────╯
```

---

## ◈ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + TypeScript + Tailwind CSS v4 |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **AI** | Google Gemini (`gemini-3.5-flash`) |
| **Build** | Vite 6 + esbuild |
| **Deploy** | Render · Docker · Vercel ready |

---

## ◈ Project Structure

```
project/
│
├── 📄 server.ts               ← Express backend + API routes
├── 📄 index.html              ← App entry HTML
│
├── 📁 server/
│   └── models.ts              ← MongoDB schemas
│
├── 📁 src/
│   ├── App.tsx                ← View router
│   ├── main.tsx               ← React entry
│   ├── types.ts               ← Type definitions
│   ├── index.css              ← Global styles
│   └── components/
│       ├── RoleSelector.tsx   ← Login / role picker
│       ├── AdminDashboard.tsx ← Admin stats & analytics
│       ├── EmployeeDashboard.tsx ← Survey submission
│       ├── FormCreator.tsx    ← Dynamic form builder
│       ├── AIChat.tsx         ← AI co-pilot chat
│       └── Messages.tsx       ← Direct messaging
│
├── 📄 .env.example            ← Environment variable template
├── 📄 docker-compose.yml      ← Docker setup
├── 📄 render.yaml             ← Render deployment config
└── 📄 vite.config.ts          ← Build config
```

---

## ◈ Run Locally

**1 — Clone & Install**
```bash
git clone https://github.com/Matheeshkumar368/Feedback-Project.git
cd Feedback-Project
npm install
```

**2 — Set Environment Variables**

Create a `.env` file in the root:
```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/aurahr
```

**3 — Start**
```bash
npm run dev
```
Open → `http://localhost:3000`

---

## ◈ Deploy on Render

```
┌─────────────────────────────────────────────────────────────┐
│  RENDER SETTINGS                                            │
├──────────────────┬──────────────────────────────────────────┤
│  Language        │  Node                                    │
│  Branch          │  main                                    │
│  Build Command   │  npm install && npm run build            │
│  Start Command   │  npm start                               │
│  Instance Type   │  Free                                    │
├──────────────────┴──────────────────────────────────────────┤
│  ENVIRONMENT VARIABLES                                      │
├──────────────────┬──────────────────────────────────────────┤
│  NODE_ENV        │  production                              │
│  PORT            │  3000                                    │
│  GEMINI_API_KEY  │  <your key>                              │
│  MONGODB_URI     │  <your atlas uri>                        │
└──────────────────┴──────────────────────────────────────────┘
```

---

## ◈ API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/forms` | Get all active forms |
| `POST` | `/api/forms` | Create a new form |
| `DELETE` | `/api/forms/:id` | Archive a form |
| `GET` | `/api/submissions` | Get all submissions |
| `POST` | `/api/submissions` | Submit + trigger AI analysis |
| `GET` | `/api/stats` | Dashboard analytics |
| `GET` | `/api/messages` | Get messages |
| `POST` | `/api/messages` | Send a message |
| `POST` | `/api/ai-chat` | Chat with AI agent |

---

<div align="center">

```
╔═══════════════════════════════════════════╗
║                                           ║
║   Built with ♥ by  Matheeshkumar368       ║
║   github.com/Matheeshkumar368             ║
║                                           ║
╚═══════════════════════════════════════════╝
```

</div>
