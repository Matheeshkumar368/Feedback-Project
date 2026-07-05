<div align="center"><br/>

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=AuraHR&fontSize=80&fontColor=ffffff&fontAlignY=38&desc=Employee+Feedback+Intelligence&descAlignY=58&descSize=18&descColor=a78bfa"/>

</div>

<div align="center">

&nbsp;&nbsp;&nbsp;
![](https://img.shields.io/badge/⬡_LIVE-feedback--project--leb9.onrender.com-6d28d9?style=flat-square&labelColor=1e1b4b)
&nbsp;&nbsp;&nbsp;
![](https://img.shields.io/badge/⬡_AI-Gemini_3.5_Flash-7c3aed?style=flat-square&labelColor=1e1b4b)
&nbsp;&nbsp;&nbsp;
![](https://img.shields.io/badge/⬡_DB-MongoDB_Atlas-059669?style=flat-square&labelColor=1e1b4b)

</div>

<br/>

---

<table>
<tr>
<td width="50%" valign="top">

### `01` &nbsp; The Idea

Employees fill a form.  
AI reads it instantly.  
HR gets a full sentiment report — score, urgency, summary, and what to do next.

No manual reading. No guessing.  
Just signal.

</td>
<td width="50%" valign="top">

### `02` &nbsp; Two Sides

**Admin** — builds forms, reads AI reports, spots burnout early, chats with an HR strategy bot.

**Employee** — submits feedback, chats privately with a wellbeing AI, messages HR directly.

</td>
</tr>
</table>

---

<br/>

<div align="center">

```
  ┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │ Employee │────▶│  Fills Form  │────▶│  Gemini AI   │────▶│ HR Dashboard │
  │  Portal  │     │   (survey)   │     │  (analysis)  │     │  (insights)  │
  └──────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

*Submit → Analyze → Act. That's the loop.*

</div>

<br/>

---

### `03` &nbsp; What Gemini does with each submission

> Reads the written answers → generates a **sentiment score** out of 100  
> Labels it `Positive` / `Neutral` / `Negative`  
> Sets urgency to `Low` / `Medium` / `High`  
> Writes an empathetic summary paragraph  
> Suggests 2–3 HR action points

---

### `04` &nbsp; Stack

```
Frontend   →   React 19  +  TypeScript  +  Tailwind CSS v4
Backend    →   Node.js   +  Express.js
Database   →   MongoDB Atlas  (Mongoose)
AI         →   Google Gemini  gemini-3.5-flash
Build      →   Vite 6  +  esbuild
Hosting    →   Render  (live)
```

---

### `05` &nbsp; Run it yourself

```bash
git clone https://github.com/Matheeshkumar368/Feedback-Project.git
cd Feedback-Project
npm install
```

Create a `.env` file:

```
GEMINI_API_KEY=your_key_here
MONGODB_URI=your_mongodb_atlas_uri
```

```bash
npm run dev
# → http://localhost:3000
```

---

### `06` &nbsp; Deploy on Render

| Field | Value |
|---|---|
| Language | Node |
| Branch | `main` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `GEMINI_API_KEY` | *your Gemini key* |
| `MONGODB_URI` | *your Atlas URI* |

> 🔗 Live → **[feedback-project-leb9.onrender.com](https://feedback-project-leb9.onrender.com)**  
> ⚠️ Free tier sleeps after inactivity — first load takes ~30s

---

### `07` &nbsp; API

| Method | Route | What it does |
|---|---|---|
| GET | `/api/forms` | List all active forms |
| POST | `/api/forms` | Create a form |
| DELETE | `/api/forms/:id` | Archive a form |
| POST | `/api/submissions` | Submit feedback + trigger AI |
| GET | `/api/submissions` | Get all submissions |
| GET | `/api/stats` | Analytics & sentiment breakdown |
| GET/POST | `/api/messages` | Direct HR messaging |
| POST | `/api/ai-chat` | Chat with AI agent |

---

<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=120&section=footer&fontSize=14&fontColor=a78bfa&text=made+by+Matheeshkumar368&fontAlignY=65"/>

</div>
