const { callGroq } = require('./_helpers.js');

const MAX_CV_LENGTH = 15000;

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

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { cvText, jobDescription } = req.body || {};

        if (!cvText || typeof cvText !== 'string' || cvText.trim().length === 0) {
            return res.status(400).json({ error: 'CV text is required.' });
        }
        if (cvText.length > MAX_CV_LENGTH) {
            return res.status(400).json({ error: `CV must be under ${MAX_CV_LENGTH} characters.` });
        }

        const cleanCV = cvText.trim().slice(0, MAX_CV_LENGTH);
        const userPrompt = jobDescription?.trim()
            ? `Please analyze this CV against the following Job Description:\n\n[JOB DESCRIPTION]\n${jobDescription.trim().slice(0, 5000)}\n\n[CV]\n${cleanCV}`
            : `Please analyze this CV for general ATS compatibility:\n\n[CV]\n${cleanCV}`;

        const messages = [
            { role: 'system', content: ATS_PROMPT },
            { role: 'user', content: userPrompt },
        ];

        const data = await callGroq(messages);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('[ATS Analyze Error]:', error.message);
        return res.status(500).json({ error: error.message || 'Failed to analyze CV.' });
    }
};
