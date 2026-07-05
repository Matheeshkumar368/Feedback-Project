import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { Form, Submission, Message, User } from './server/models.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Connect to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not set. Please configure it in your .env file.");
  process.exit(1);
}
console.log("Connecting to MongoDB...");
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
    seedInitialData();
  })
  .catch((err) => {
    console.error("MongoDB Connection Error: ", err);
  });

// Initialize Gemini SDK
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY environment variable is not set. Please configure it in your .env file.");
  process.exit(1);
}
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Real-time Event Clients for Server-Sent Events (SSE)
let sseClients: any[] = [];

// Real-time SSE Stream Endpoint
app.get('/api/realtime-stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  sseClients.push(newClient);

  // Send initial connected notification
  res.write(`event: connected\ndata: ${JSON.stringify({ clientId })}\n\n`);

  // Send heartbeats to prevent idle connection termination
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch (err) {
      // Ignore if socket is closed but 'close' event hasn't fired yet
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// Broadcast Helper
function broadcastRealtimeEvent(event: string, data: any) {
  sseClients.forEach(c => {
    try {
      c.res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      // Handled automatically via cleanup or on next connection close
    }
  });
}

// Seed data function to prepopulate application for instant professional look
async function seedInitialData() {
  try {
    // Seed default admin account
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({ username: 'admin', password: 'admin123', role: 'admin' });
      console.log("Default admin user seeded: admin / admin123");
    }

    const formCount = await Form.countDocuments();
    if (formCount === 0) {
      console.log("Seeding default feedback forms...");
      const defaultForm = await Form.create({
        title: "Quarterly Work Culture & Well-being",
        description: "We care about your experience. Please help us evaluate our general work culture, workload balance, and mental health resources.",
        fields: [
          { id: "f1", type: "rating", label: "How would you rate your overall work-life balance at AuraHR?", required: true },
          { id: "f2", type: "select", label: "Which department do you work in?", required: true, options: ["Engineering", "Product", "HR", "Sales", "Marketing", "Operations"] },
          { id: "f3", type: "text", label: "What are the biggest challenges or stressors you are currently facing in your role?", required: true },
          { id: "f4", type: "text", label: "What is one actionable change our leadership team can make to improve company culture?", required: false }
        ],
        isActive: true
      });

      console.log("Seeding sample feedback submissions...");
      await Submission.create([
        {
          formId: defaultForm._id.toString(),
          formTitle: defaultForm.title,
          employeeName: "Marcus Vance",
          employeeDepartment: "Engineering",
          rating: 4,
          answers: [
            { fieldId: "f1", label: "How would you rate your overall work-life balance at AuraHR?", type: "rating", value: 4 },
            { fieldId: "f2", label: "Which department do you work in?", type: "select", value: "Engineering" },
            { fieldId: "f3", label: "What are the biggest challenges or stressors you are currently facing in your role?", type: "text", value: "We have some tight release deadlines, but the team handles it well. Code reviews can occasionally block us." },
            { fieldId: "f4", label: "What is one actionable change our leadership team can make to improve company culture?", type: "text", value: "Providing a budget for developer learning resources or local tech conferences." }
          ],
          aiAnalysis: {
            sentiment: "Positive",
            score: 82,
            summary: "Marcus is generally happy with the work-life balance but mentions minor blockers during release sprints and code reviews.",
            actionablePoints: [
              "Streamline developer code reviews during release periods.",
              "Allocate budget for technical learning and growth resources."
            ],
            urgency: "Low",
            category: "Culture"
          },
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          formId: defaultForm._id.toString(),
          formTitle: defaultForm.title,
          employeeName: "Alice Chen",
          employeeDepartment: "Marketing",
          rating: 2,
          answers: [
            { fieldId: "f1", label: "How would you rate your overall work-life balance at AuraHR?", type: "rating", value: 2 },
            { fieldId: "f2", label: "Which department do you work in?", type: "select", value: "Marketing" },
            { fieldId: "f3", label: "What are the biggest challenges or stressors you are currently facing in your role?", type: "text", value: "I feel very overwhelmed. There is an expectation to answer messages at late hours. We are severely understaffed and trying to execute a massive campaign." },
            { fieldId: "f4", label: "What is one actionable change our leadership team can make to improve company culture?", type: "text", value: "Set strict guidelines on work hours and hire a freelance designer to assist with campaign assets." }
          ],
          aiAnalysis: {
            sentiment: "Negative",
            score: 35,
            summary: "Alice is showing signs of burnout due to out-of-bounds working hours and severe understaffing during critical campaigns.",
            actionablePoints: [
              "Enforce 'No Late-Night Ping' guidelines for non-urgent tasks.",
              "Hire a temporary contractor or freelance designer to support campaign execution."
            ],
            urgency: "High",
            category: "Workload"
          },
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]);

      console.log("Seeding sample messages...");
      await Message.create([
        { fromUser: "admin", toUser: "Marcus Vance", text: "Hi Marcus, saw your feedback on the training budget. I will present this to leadership this Friday!", senderRole: "admin" },
        { fromUser: "Marcus Vance", toUser: "admin", text: "Thanks so much! Really appreciate the quick check-in.", senderRole: "employee" }
      ]);
    }
  } catch (err) {
    console.error("Seeding failed: ", err);
  }
}

// ==========================================
// API ROUTES
// ==========================================

// 1. FORMS API
app.get('/api/forms', async (req, res) => {
  try {
    const forms = await Form.find({ isActive: true } as any).sort({ createdAt: -1 });
    res.json(forms);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/forms', async (req, res) => {
  try {
    const { title, description, fields } = req.body;
    if (!title || !fields || fields.length === 0) {
      return res.status(400).json({ error: "Form Title and Fields are required." });
    }
    const newForm = await Form.create({ title, description, fields, isActive: true });
    broadcastRealtimeEvent('new-form', newForm);
    res.status(201).json(newForm);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/forms/:id', async (req, res) => {
  try {
    await Form.updateOne({ _id: req.params.id } as any, { isActive: false } as any);
    broadcastRealtimeEvent('new-form', { id: req.params.id, archived: true });
    res.json({ success: true, message: "Form successfully archived." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. SUBMISSIONS API (Submit Feedback + Trigger Gemini AI analysis)
app.post('/api/submissions', async (req, res) => {
  try {
    const { formId, formTitle, employeeName, employeeDepartment, answers, rating } = req.body;
    if (!formId || !employeeName || !answers) {
      return res.status(400).json({ error: "Missing required feedback submission fields." });
    }

    // Build user text context for the AI prompt
    const textAnswersText = answers
      .filter((a: any) => a.type === 'text' && a.value)
      .map((a: any) => `Question: "${a.label}"\nAnswer: "${a.value}"`)
      .join('\n\n');

    const promptText = `
      You are AuraHR AI, an elite HR Psychologist and workplace sentiment agent.
      Analyze the following employee feedback submission and generate a deep analytical output.

      Employee: ${employeeName}
      Department: ${employeeDepartment}
      Overall Rating (1-5 Scale): ${rating} / 5
      
      Written Responses:
      ${textAnswersText || "No written text provided."}

      Evaluate:
      1. Sentiment: Positive, Neutral, or Negative
      2. Score: A sentiment score from 1 (terrible) to 100 (excellent)
      3. Summary: A detailed, clear, empathetic paragraph summary of their workplace experience. Do NOT use dry or robotic placeholders. Make it specific to the answers given.
      4. Actionable points: 2 to 3 concrete HR recommendations to improve their situation or support them.
      5. Urgency: 'Low', 'Medium', or 'High' based on indicators of stress, burnout, conflict, or high engagement.
      6. Category: Classify the core feedback theme as 'Culture', 'Management', 'Tooling', 'Workload', 'Benefits', 'Career Growth', or 'Other'.
    `;

    let aiAnalysis = {
      sentiment: 'Neutral' as 'Positive' | 'Neutral' | 'Negative',
      score: 50,
      summary: 'Feedback successfully received and stored.',
      actionablePoints: ['Review submission in details with department manager.'],
      urgency: 'Medium' as 'Low' | 'Medium' | 'High',
      category: 'Other'
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentiment: { type: Type.STRING, description: "Must be exactly Positive, Neutral, or Negative" },
              score: { type: Type.INTEGER, description: "Numeric score 1-100" },
              summary: { type: Type.STRING, description: "An empathetic summary paragraph of the employee's state" },
              actionablePoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific takeaways for management" },
              urgency: { type: Type.STRING, description: "Must be exactly Low, Medium, or High" },
              category: { type: Type.STRING, description: "One of: Culture, Management, Tooling, Workload, Benefits, Career Growth, Other" }
            },
            required: ["sentiment", "score", "summary", "actionablePoints", "urgency", "category"]
          }
        }
      });

      const textResponse = response.text?.trim() || "";
      if (textResponse) {
        const parsed = JSON.parse(textResponse);
        aiAnalysis = {
          sentiment: (parsed.sentiment === "Positive" || parsed.sentiment === "Negative") ? parsed.sentiment : "Neutral",
          score: Number(parsed.score) || 50,
          summary: parsed.summary || "Summary generation completed successfully.",
          actionablePoints: Array.isArray(parsed.actionablePoints) ? parsed.actionablePoints : ["No specific points identified"],
          urgency: (parsed.urgency === "Low" || parsed.urgency === "High") ? parsed.urgency : "Medium",
          category: parsed.category || "Other"
        };
      }
    } catch (aiErr) {
      console.error("AI Analysis failed or timed out: ", aiErr);
      // Fallback AI calculation based on rating
      const fallbackSentiment = rating >= 4 ? 'Positive' : rating <= 2 ? 'Negative' : 'Neutral';
      aiAnalysis = {
        sentiment: fallbackSentiment as any,
        score: rating * 20,
        summary: `Empirical analysis generated based on numerical rating of ${rating}/5. Written responses highlight aspects related to company workflows.`,
        actionablePoints: [
          `Connect with the employee to check in on their workload and sentiment.`,
          `Analyze department culture trends to identify any systemic issues.`
        ],
        urgency: rating <= 2 ? 'High' : rating === 3 ? 'Medium' : 'Low',
        category: 'Culture'
      };
    }

    const submission = await Submission.create({
      formId,
      formTitle,
      employeeName,
      employeeDepartment,
      answers,
      rating,
      aiAnalysis
    });

    broadcastRealtimeEvent('new-submission', submission);

    res.status(201).json(submission);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. STATS API
app.get('/api/stats', async (req, res) => {
  try {
    const subs = await Submission.find();
    
    // Initial structures
    const sentimentBreakdown = { Positive: 0, Neutral: 0, Negative: 0 };
    const urgencyBreakdown = { Low: 0, Medium: 0, High: 0 };
    const feedbacksByDepartment: Record<string, number> = {};
    let totalRating = 0;

    subs.forEach(s => {
      // Rating sum
      totalRating += s.rating;

      // Sentiment
      if (s.aiAnalysis && s.aiAnalysis.sentiment) {
        const sent = s.aiAnalysis.sentiment as 'Positive' | 'Neutral' | 'Negative';
        sentimentBreakdown[sent] = (sentimentBreakdown[sent] || 0) + 1;
      } else {
        sentimentBreakdown.Neutral += 1;
      }

      // Urgency
      if (s.aiAnalysis && s.aiAnalysis.urgency) {
        const urg = s.aiAnalysis.urgency as 'Low' | 'Medium' | 'High';
        urgencyBreakdown[urg] = (urgencyBreakdown[urg] || 0) + 1;
      } else {
        urgencyBreakdown.Medium += 1;
      }

      // Dept
      const dept = s.employeeDepartment || "Other";
      feedbacksByDepartment[dept] = (feedbacksByDepartment[dept] || 0) + 1;
    });

    const averageRating = subs.length > 0 ? Number((totalRating / subs.length).toFixed(1)) : 0;

    // Real monthly trends calculated dynamically from database submissions
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trendsMap: Record<string, number> = {};
    
    // Initialize current and past 3 months to 0 to prevent empty state in charts
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      trendsMap[months[d.getMonth()]] = 0;
    }

    subs.forEach(s => {
      const date = s.createdAt ? new Date(s.createdAt) : new Date();
      const mName = months[date.getMonth()];
      if (trendsMap[mName] !== undefined) {
        trendsMap[mName]++;
      }
    });

    const monthlyTrends = Object.entries(trendsMap).map(([month, count]) => ({
      month,
      count
    }));

    res.json({
      totalFeedbacks: subs.length,
      averageRating,
      sentimentBreakdown,
      urgencyBreakdown,
      feedbacksByDepartment,
      monthlyTrends
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. MESSAGES API
app.get('/api/messages', async (req, res) => {
  try {
    const { from, to } = req.query;
    let query: any = {};
    if (from && to) {
      query = {
        $or: [
          { fromUser: from, toUser: to },
          { fromUser: to, toUser: from }
        ]
      };
    }
    const messages = await Message.find(query).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { fromUser, toUser, text, senderRole } = req.body;
    if (!fromUser || !toUser || !text || !senderRole) {
      return res.status(400).json({ error: "Missing sender, receiver, or message body." });
    }
    const msg = await Message.create({ fromUser, toUser, text, senderRole });
    broadcastRealtimeEvent('new-message', msg);
    res.status(201).json(msg);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. AI AGENT DISCUSSIONS (Chat with general context)
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { prompt, currentRole } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    // Get all feedbacks to feed into prompt context
    const subs = await Submission.find();
    const feedbackSummaries = subs.map((s, idx) => {
      const texts = s.answers.filter(a => a.type === 'text').map(a => `Q: ${a.label} -> A: ${a.value}`).join(' | ');
      return `[Feedback #${idx+1}] Dept: ${s.employeeDepartment}, Rating: ${s.rating}/5, Category: ${s.aiAnalysis?.category || 'None'}, Sentiment: ${s.aiAnalysis?.sentiment || 'None'}. Written answers: ${texts}`;
    }).join('\n');

    const systemInstruction = currentRole === 'admin' 
      ? `You are the AuraHR Admin AI Consultant, a strategic HR analyst helping managers identify team burnout, culture gaps, and workspace issues. 
         Analyze company feedback and speak professionally, objectively, and construct lists of practical initiatives. Use formatting like markdown bold, bullet points, etc.
         Here is the current database of employee submissions:\n${feedbackSummaries}`
      : `You are the AuraHR Employee AI Coach, a supportive, confidential assistant helping employees deal with work-life balance, giving strategies to communicate with managers, or managing stress. 
         You do NOT reveal specific other employees' confidential details or names. Give actionable self-care, communication, and boundary-setting recommendations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction
      }
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error("AI Chat Error: ", err);
    res.status(500).json({ error: "Unable to process request with AI: " + err.message });
  }
});

// ==========================================
// AUTH ROUTES
// ==========================================

// Admin Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }
    const user = await User.findOne({ username: username.trim(), role: 'admin' });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
    }
    res.json({ success: true, role: 'admin', username: user.username });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Employee Register / Login (by name + department — creates account if new)
app.post('/api/auth/employee', async (req, res) => {
  try {
    const { name, department } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Employee name is required.' });
    }
    const username = name.trim();
    let user = await User.findOne({ username, role: 'employee' });
    if (!user) {
      // Auto-register new employee
      user = await User.create({
        username,
        password: '',
        role: 'employee',
        department: department || 'General'
      });
    } else {
      // Update department if changed
      if (department && user.department !== department) {
        user.department = department;
        await user.save();
      }
    }
    res.json({ success: true, role: 'employee', username: user.username, department: user.department });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// VITE OR STATIC SERVING MIDDLEWARE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
