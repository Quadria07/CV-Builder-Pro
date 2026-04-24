export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const GROQ_MODEL = 'llama-3.3-70b-versatile';

export const MAX_PROMPT_LENGTH = 15000;
export const MAX_CV_TEXT_LENGTH = 15000;
export const MAX_JOB_DETAILS_LENGTH = 15000;

// Simple rate limiter using IP + timestamp (in-memory)
// Note: In production with multiple serverless instances, consider using Redis/external service
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 60 seconds
const RATE_LIMIT_MAX = 10; // 10 requests per window

export function getClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    'unknown'
  );
}

export function checkRateLimit(clientIP) {
  const now = Date.now();
  const key = clientIP;

  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }

  const requests = rateLimitStore.get(key);
  const recentRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return false;
  }

  recentRequests.push(now);
  rateLimitStore.set(key, recentRequests);
  return true;
}

export const CV_STRUCTURE_PROMPT = `You must respond ONLY with a valid JSON object matching this exact structure. No markdown, no explanation, only the JSON:
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
  "projects": [
    {
      "id": "unique string id",
      "title": "string",
      "description": "string (brief description of the project)",
      "technologies": ["array of technologies used"]
    }
  ],
  "languages": [
    {
      "id": "unique string id",
      "name": "string (language name)",
      "proficiency": "string (Basic | Intermediate | Advanced | Fluent | Native)"
    }
  ],
  "interests": ["string array"],
  "achievements": [
    {
      "id": "unique string id",
      "title": "string (achievement title)",
      "description": "string (description of the achievement)"
    }
  ],
  "references": "Available on request"
}`;

export function sanitizeString(input, maxLen) {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLen);
}

export async function callGroq(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('AI service is not configured.');
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
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
      signal: controller.signal,
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) throw new Error('AI rate limit reached. Please try again shortly.');
      if (status === 401) throw new Error('AI service authentication failed.');
      throw new Error('AI service is temporarily unavailable.');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI returned an empty response.');
    return JSON.parse(content);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('AI request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

