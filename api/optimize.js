const {
    CV_STRUCTURE_PROMPT,
    MAX_CV_TEXT_LENGTH,
    MAX_JOB_DETAILS_LENGTH,
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
        const { cvText, jobDetails } = req.body || {};

        // Validate
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

        const cleanCV = sanitizeString(cvText, MAX_CV_TEXT_LENGTH);
        const cleanJob = sanitizeString(jobDetails, MAX_JOB_DETAILS_LENGTH);

        const messages = [
            {
                role: 'system',
                content: `You are an expert CV/resume optimizer and ATS specialist. Your job is to take an existing CV and a target job description, then rewrite the CV to perfectly match the job requirements. Key rules:
- Mirror keywords and phrases from the job description
- Rewrite the professional summary to target this specific role
- Reorder and rewrite skills to match what the job asks for
- Rewrite work experience bullet points using action verbs that match the job requirements
- Quantify achievements where possible
- Keep all information truthful, enhance phrasing, don't fabricate
- Make the CV ATS-friendly
${CV_STRUCTURE_PROMPT}`,
            },
            {
                role: 'user',
                content: `Here is my current CV:\n\n${cleanCV}\n\n---\n\nHere is the job I'm applying for:\n\n${cleanJob}\n\nPlease optimize my CV to perfectly match this job.`,
            },
        ];

        const cvData = await callGroq(messages);
        return res.status(200).json({ success: true, data: cvData });
    } catch (error) {
        console.error('[AI Optimize Error]:', error.message);
        return res.status(500).json({ error: error.message || 'Failed to optimize CV.' });
    }
};
