import {
    CV_STRUCTURE_PROMPT,
    MAX_CV_TEXT_LENGTH,
    sanitizeString,
    callGroq,
} from './_helpers.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { cvText, atsFeedback, jobDescription } = req.body || {};

        if (!cvText || typeof cvText !== 'string' || cvText.trim().length === 0) {
            return res.status(400).json({ error: 'CV text is required.' });
        }
        if (!atsFeedback || typeof atsFeedback !== 'string') {
            return res.status(400).json({ error: 'ATS feedback is required.' });
        }

        const cleanCV = sanitizeString(cvText, MAX_CV_TEXT_LENGTH);
        const cleanFeedback = sanitizeString(atsFeedback, MAX_CV_TEXT_LENGTH);
        const cleanJobDesc = jobDescription ? sanitizeString(jobDescription, MAX_CV_TEXT_LENGTH) : '';

        let systemContent = `You are an expert CV/resume optimizer. Take the user's CV and the ATS feedback, and comprehensively rewrite the CV to address all the "Improvements" and errors mentioned.
Maintain the original sections but improve bullet points, phrasing, skills, and the summary.
${cleanJobDesc ? `Crucially, make sure it perfectly targets this Job Description: ${cleanJobDesc}\n` : ''}
${CV_STRUCTURE_PROMPT}`;

        const messages = [
            { role: 'system', content: systemContent },
            { role: 'user', content: `Here is the ATS scanner feedback on what is wrong with this CV:\n\n${cleanFeedback}\n\nHere is my current CV (in internal JSON structure):\n\n${cleanCV}\n\nPlease output the fully fixed CV JSON addressing these errors completely.` }
        ];

        const cvData = await callGroq(messages);
        return res.status(200).json({ success: true, data: cvData });
    } catch (error) {
        console.error('[AI Fix Error]:', error.message);
        return res.status(500).json({ error: error.message || 'Failed to automatically fix CV.' });
    }
}

