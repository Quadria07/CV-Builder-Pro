const {
    CV_STRUCTURE_PROMPT,
    MAX_PROMPT_LENGTH,
    sanitizeString,
    callGroq,
    getClientIP,
    checkRateLimit,
} = require('./_helpers.js');

module.exports = async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check rate limit
    const clientIP = getClientIP(req);
    if (!checkRateLimit(clientIP)) {
        return res.status(429).json({ error: 'Too many requests. Please wait a moment before trying again.' });
    }

    try {
        const { prompt } = req.body || {};

        // Validate
        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            return res.status(400).json({ error: 'A valid prompt is required.' });
        }
        if (prompt.length > MAX_PROMPT_LENGTH) {
            return res.status(400).json({ error: `Prompt must be under ${MAX_PROMPT_LENGTH} characters.` });
        }

        const cleanPrompt = sanitizeString(prompt, MAX_PROMPT_LENGTH);

        const messages = [
            {
                role: 'system',
                content: `You are an expert CV/resume writer. Based on the user's description, generate a complete, professional CV. Use strong action verbs, quantify achievements where possible, and make the summary compelling. ${CV_STRUCTURE_PROMPT}`,
            },
            {
                role: 'user',
                content: `Generate a professional CV based on this description:\n\n${cleanPrompt}`,
            },
        ];

        const cvData = await callGroq(messages);
        return res.status(200).json({ success: true, data: cvData });
    } catch (error) {
        console.error('[AI Generate Error]:', error.message);
        return res.status(500).json({ error: error.message || 'Failed to generate CV.' });
    }
};
