import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FEEDBACK_EMAIL = 'quadriadebisi3@gmail.com';

const feedbackTypeLabels = {
  bug: 'Bug Report',
  improvement: 'Improvement Suggestion',
  feature: 'Feature Request',
  other: 'Other Feedback',
};

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    // Format feedback data for email
    const feedbackDate = new Date(timestamp).toLocaleString();
    const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    const ratingText = ratingLabels[parseInt(rating) - 1];

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
    .value { background: #f0fdf4; padding: 10px; border-left: 3px solid #0d9488; }
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
        <p><strong>User Agent:</strong> ${escapeHtml(userAgent)}</p>
        <p><strong>IP Address:</strong> ${req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown'}</p>
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
      console.error('Resend email error:', emailResponse.error);
      return res.status(500).json({
        error: 'Failed to send feedback email',
        details: emailResponse.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback received successfully',
      messageId: emailResponse.data?.id,
    });
  } catch (error) {
    console.error('Feedback API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

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
