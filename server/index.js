import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security Middleware ──────────────────────────────────────────────
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
}));

app.use(express.json({ limit: '50kb' }));

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment before trying again.' },
});

app.use('/api/ai', aiLimiter);

// ─── Input Validation ─────────────────────────────────────────────────
const MAX_PROMPT_LENGTH = 5000;
const MAX_CV_TEXT_LENGTH = 15000;
const MAX_JOB_DETAILS_LENGTH = 10000;

function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, MAX_CV_TEXT_LENGTH);
}

function validateGenerateRequest(req, res, next) {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'A valid prompt is required.' });
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({ error: `Prompt must be under ${MAX_PROMPT_LENGTH} characters.` });
  }
  req.body.prompt = sanitizeString(prompt);
  next();
}

function validateOptimizeRequest(req, res, next) {
  const { cvText, jobDetails } = req.body;
  if (!cvText || typeof cvText !== 'string' || cvText.trim().length === 0) {
    return res.status(400).json({ error: 'CV text is required.' });
  }
  if (!jobDetails || typeof jobDetails !== 'string' || jobDetails.trim().length === 0) {
    return res.status(400).json({ error: 'Job details are required.' });
  }
  if (cvText.length > MAX_CV_TEXT_LENGTH) {
    return res.status(400).json({ error: `CV text must be under ${MAX_CV_TEXT_LENGTH} characters.` });
  }
  if (jobDetails.length > MAX_JOB_DETAILS_LENGTH) {
    return res.status(400).json({ error: `Job details must be under ${MAX_JOB_DETAILS_LENGTH} characters.` });
  }
  req.body.cvText = sanitizeString(cvText);
  req.body.jobDetails = sanitizeString(jobDetails);
  next();
}

// ─── Groq API Helper ──────────────────────────────────────────────────
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

async function callGroq(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('AI service is not configured.');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429) throw new Error('AI service rate limit reached. Please try again shortly.');
    if (status === 401) throw new Error('AI service authentication failed.');
    throw new Error('AI service is temporarily unavailable.');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('AI returned an empty response.');
  return JSON.parse(content);
}

// ─── CV Data Structure Prompt ──────────────────────────────────────────
const CV_STRUCTURE_PROMPT = `You must respond ONLY with a valid JSON object matching this exact structure. No markdown, no explanation — only the JSON:
{
  "personalInfo": {
    "name": "string",
    "address": "string",
    "phone": "string",
    "email": "string",
    "summary": "string (professional summary, 3-4 sentences)"
  },
  "skills": ["string array of professional skills"],
  "workHistory": [
    {
      "id": "unique string id",
      "position": "string",
      "company": "string",
      "duration": "string (e.g. Jan 2020 - Present)",
      "responsibilities": ["string array of bullet points using strong action verbs"]
    }
  ],
  "education": [
    {
      "id": "unique string id",
      "degree": "string",
      "institution": "string",
      "duration": "string"
    }
  ],
  "interests": ["string array"],
  "references": "Available on request"
}`;

// ─── Routes ────────────────────────────────────────────────────────────
app.post('/api/ai/generate', validateGenerateRequest, async (req, res) => {
  try {
    const { prompt } = req.body;
    const messages = [
      {
        role: 'system',
        content: `You are an expert CV/resume writer. Based on the user's description, generate a complete, professional CV. Use strong action verbs, quantify achievements where possible, and make the summary compelling. ${CV_STRUCTURE_PROMPT}`
      },
      {
        role: 'user',
        content: `Generate a professional CV based on this description:\n\n${prompt}`
      }
    ];

    const cvData = await callGroq(messages);
    res.json({ success: true, data: cvData });
  } catch (error) {
    console.error('[AI Generate Error]:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate CV.' });
  }
});

app.post('/api/ai/optimize', validateOptimizeRequest, async (req, res) => {
  try {
    const { cvText, jobDetails } = req.body;
    const messages = [
      {
        role: 'system',
        content: `You are an expert CV/resume optimizer and ATS specialist. Your job is to take an existing CV and a target job description, then rewrite the CV to perfectly match the job requirements. Key rules:
- Mirror keywords and phrases from the job description
- Rewrite the professional summary to target this specific role
- Reorder and rewrite skills to match what the job asks for
- Rewrite work experience bullet points using action verbs that match the job requirements
- Quantify achievements where possible
- Keep all information truthful — enhance phrasing, don't fabricate
- Make the CV ATS-friendly
${CV_STRUCTURE_PROMPT}`
      },
      {
        role: 'user',
        content: `Here is my current CV:\n\n${cvText}\n\n---\n\nHere is the job I'm applying for:\n\n${jobDetails}\n\nPlease optimize my CV to perfectly match this job.`
      }
    ];

    const cvData = await callGroq(messages);
    res.json({ success: true, data: cvData });
  } catch (error) {
    console.error('[AI Optimize Error]:', error.message);
    res.status(500).json({ error: error.message || 'Failed to optimize CV.' });
  }
});

// ─── Health Check ──────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ─── 404 for everything else ───────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ─── Global Error Handler ──────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]:', err.message);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

app.listen(PORT, () => {
  console.log(`✔ CV Builder API server running on http://localhost:${PORT}`);
});
