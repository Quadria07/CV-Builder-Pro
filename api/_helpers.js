const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const MAX_PROMPT_LENGTH = 15000;
const MAX_CV_TEXT_LENGTH = 15000;
const MAX_JOB_DETAILS_LENGTH = 15000;

const CV_STRUCTURE_PROMPT = `You must respond ONLY with a valid JSON object matching this exact structure. No markdown, no explanation, only the JSON:
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

function sanitizeString(input, maxLen) {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLen);
}

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
    if (status === 429) throw new Error('AI rate limit reached. Please try again shortly.');
    if (status === 401) throw new Error('AI service authentication failed.');
    throw new Error('AI service is temporarily unavailable.');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('AI returned an empty response.');
  return JSON.parse(content);
}

module.exports = {
  CV_STRUCTURE_PROMPT,
  MAX_PROMPT_LENGTH,
  MAX_CV_TEXT_LENGTH,
  MAX_JOB_DETAILS_LENGTH,
  sanitizeString,
  callGroq,
};
