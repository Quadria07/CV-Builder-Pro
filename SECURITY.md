# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

**Do not open a public issue.** Instead, email the maintainer directly or use GitHub's private vulnerability reporting feature.

To report privately on GitHub:
1. Go to the **Security** tab of this repository
2. Click **Report a vulnerability**
3. Fill in the details

We aim to respond within 48 hours and will work with you to resolve the issue before any public disclosure.

## Security Practices

This project follows these security principles:

### API Key Protection
- API keys are stored as environment variables on the server
- Keys are never sent to the browser or included in client-side code
- The `.env` file is excluded from version control via `.gitignore`

### Input Handling
- All user input is validated for type and length before processing
- Input strings are sanitized and trimmed before being sent to the AI
- Maximum character limits are enforced on all text fields

### Rate Limiting
- AI endpoints are rate-limited to prevent abuse (10 requests/min per IP in development)
- Vercel's built-in protections apply in production

### HTTP Security
- Helmet middleware sets security headers in the development server
- CORS is configured with an allowlist of permitted origins
- Only POST requests are accepted on API endpoints

### Error Handling
- Error responses are sanitized to prevent information leakage
- Stack traces and internal paths are never exposed to the client
- Generic error messages are returned for unexpected failures

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |

## Dependencies

We recommend keeping dependencies up to date. Run `npm audit` periodically to check for known vulnerabilities.
