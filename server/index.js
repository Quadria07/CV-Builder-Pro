import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { Resend } from 'resend';

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

const feedbackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many feedback submissions. Please wait a moment before trying again.' },
});

app.use('/api/ai', aiLimiter);

// ─── Input Validation ─────────────────────────────────────────────────
const MAX_PROMPT_LENGTH = 15000;
const MAX_CV_TEXT_LENGTH = 15000;
const MAX_JOB_DETAILS_LENGTH = 15000;

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

function validateFixRequest(req, res, next) {
  const { cvText, atsFeedback } = req.body;
  if (!cvText || typeof cvText !== 'string' || cvText.trim().length === 0) {
    return res.status(400).json({ error: 'CV text is required.' });
  }
  if (!atsFeedback || typeof atsFeedback !== 'string') {
    return res.status(400).json({ error: 'ATS feedback is required.' });
  }
  req.body.cvText = sanitizeString(cvText);
  req.body.atsFeedback = sanitizeString(atsFeedback);
  if (req.body.jobDescription) {
    req.body.jobDescription = sanitizeString(req.body.jobDescription);
  }
  next();
}

function validateAnalyzeRequest(req, res, next) {
  const { cvText, jobDescription } = req.body;
  if (!cvText || typeof cvText !== 'string' || cvText.trim().length === 0) {
    return res.status(400).json({ error: 'CV text is required.' });
  }
  if (cvText.length > MAX_CV_TEXT_LENGTH) {
    return res.status(400).json({ error: `CV text must be under ${MAX_CV_TEXT_LENGTH} characters.` });
  }
  req.body.cvText = sanitizeString(cvText);
  if (jobDescription) {
    req.body.jobDescription = sanitizeString(jobDescription);
  }
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

app.post('/api/ai/fix', validateFixRequest, async (req, res) => {
  try {
    const { cvText, atsFeedback, jobDescription } = req.body;
    let systemContent = `You are an expert CV/resume optimizer. Take the user's CV and the ATS feedback, and comprehensively rewrite the CV to address all the "Improvements" and errors mentioned.
Maintain the original sections but improve bullet points, phrasing, skills, and the summary.
${jobDescription ? `Crucially, make sure it perfectly targets this Job Description: ${jobDescription}\n` : ''}
${CV_STRUCTURE_PROMPT}`;

    const messages = [
      { role: 'system', content: systemContent },
      { role: 'user', content: `Here is the ATS scanner feedback on what is wrong with this CV:\n\n${atsFeedback}\n\nHere is my current CV (in internal JSON structure):\n\n${cvText}\n\nPlease output the fully fixed CV JSON addressing these errors completely.` }
    ];

    const cvData = await callGroq(messages);
    res.json({ success: true, data: cvData });
  } catch (error) {
    console.error('[AI Fix Error]:', error.message);
    res.status(500).json({ error: error.message || 'Failed to automatically fix CV.' });
  }
});

const ATS_PROMPT = `You are an expert ATS (Applicant Tracking System) specialist and CV reviewer. Analyze the provided CV. If a Job Description is provided, calculate the match rate and keyword optimization. Return ONLY a valid JSON object with this exact structure:
{
  "overall": <number 0-100>,
  "breakdown": [
    { "label": "Contact Information", "score": <0-10>, "max": 10, "tip": "<brief actionable tip>" },
    { "label": "Professional Summary", "score": <0-20>, "max": 20, "tip": "<brief actionable tip>" },
    { "label": "Work Experience", "score": <0-30>, "max": 30, "tip": "<brief actionable tip>" },
    { "label": "Skills & Keywords", "score": <0-20>, "max": 20, "tip": "<brief actionable tip (mention missing keywords if job description provided)>" },
    { "label": "Education", "score": <0-10>, "max": 10, "tip": "<brief actionable tip>" },
    { "label": "Formatting", "score": <0-10>, "max": 10, "tip": "<brief actionable tip>" }
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1 (missing keywords if any)>", "<improvement 2>", "<improvement 3>", "<improvement 4>"]
}

Be honest and specific. Tips must be actionable and concise (max 15 words). Focus heavily on the Job Description match if one is provided.`;

app.post('/api/ai/analyze', validateAnalyzeRequest, async (req, res) => {
  try {
    const { cvText, jobDescription } = req.body;

    const cleanCV = cvText.trim().slice(0, MAX_CV_TEXT_LENGTH);
    const userPrompt = jobDescription?.trim()
      ? `Please analyze this CV against the following Job Description:\n\n[JOB DESCRIPTION]\n${jobDescription.trim().slice(0, MAX_JOB_DETAILS_LENGTH)}\n\n[CV]\n${cleanCV}`
      : `Please analyze this CV for general ATS compatibility:\n\n[CV]\n${cleanCV}`;

    const messages = [
      { role: 'system', content: ATS_PROMPT },
      { role: 'user', content: userPrompt },
    ];

    const data = await callGroq(messages);
    res.json({ success: true, data });
  } catch (error) {
    console.error('[ATS Analyze Error]:', error.message);
    res.status(500).json({ error: error.message || 'Failed to analyze CV.' });
  }
});

// ─── Feedback Endpoint ────────────────────────────────────────────────
const FEEDBACK_EMAIL = 'quadriadebisi3@gmail.com';
const feedbackTypeLabels = {
  bug: 'Bug Report',
  improvement: 'Improvement Suggestion',
  feature: 'Feature Request',
  other: 'Other Feedback',
};

app.post('/api/feedback', feedbackLimiter, async (req, res) => {
  try {
    const { category, rating, message, userEmail, timestamp, userAgent } = req.body;

    // Validation
    if (!category || !rating || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['bug', 'improvement', 'feature', 'other'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    if (!['1', '2', '3', '4', '5'].includes(String(rating))) {
      return res.status(400).json({ error: 'Invalid rating' });
    }

    if (message.trim().length === 0 || message.trim().length > 500) {
      return res.status(400).json({ error: 'Message must be between 1-500 characters' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Format feedback data for email
    const feedbackDate = new Date(timestamp).toLocaleString();
    const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    const ratingText = ratingLabels[parseInt(rating) - 1];
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .header { background: #0d9488; color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px; }
    .header h2 { margin: 0; font-size: 24px; }
    .content { background: white; padding: 20px; border-radius: 6px; }
    .field { margin-bottom: 20px; }
    .label { font-weight: 600; color: #065f46; margin-bottom: 5px; }
    .value { background: #f0fdf4; padding: 10px; border-left: 3px solid #0d9488; word-break: break-word; }
    .footer { font-size: 12px; color: #6b7280; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Feedback from CV Builder Pro</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Type</div>
        <div class="value">${feedbackTypeLabels[category]}</div>
      </div>
      <div class="field">
        <div class="label">Rating</div>
        <div class="value">${rating}/5 - ${ratingText}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="value" style="white-space: pre-wrap;">${escapeHtml(message)}</div>
      </div>
      ${userEmail ? `
      <div class="field">
        <div class="label">User Email</div>
        <div class="value"><a href="mailto:${escapeHtml(userEmail)}">${escapeHtml(userEmail)}</a></div>
      </div>
      ` : ''}
      <div class="footer">
        <p><strong>Submitted:</strong> ${feedbackDate}</p>
        <p><strong>IP Address:</strong> ${clientIp}</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: 'CV Builder <onboarding@resend.dev>',
      to: FEEDBACK_EMAIL,
      replyTo: userEmail || 'noreply@resend.dev',
      subject: `[CV Builder] ${feedbackTypeLabels[category]} - Rating: ${rating}/5`,
      html: emailHtml,
    });

    if (emailResponse.error) {
      console.error('[Feedback Email Error]:', emailResponse.error);
      return res.status(500).json({
        error: 'Failed to send feedback email',
        details: emailResponse.error,
      });
    }

    res.json({
      success: true,
      message: 'Feedback received successfully',
      messageId: emailResponse.data?.id,
    });
  } catch (error) {
    console.error('[Feedback Error]:', error.message);
    res.status(500).json({
      error: 'Failed to process feedback',
      message: error.message,
    });
  }
});

// ─── Helper function to escape HTML ──────────────────────────────────
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

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
