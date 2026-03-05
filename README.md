# CV Builder Pro

AI-powered professional CV builder with customizable templates and instant PDF downloads. Completely free, no watermarks.

## What It Does

CV Builder Pro helps job seekers create professional, ATS-friendly CVs quickly. It offers two AI-powered modes plus manual editing:

- **Generate from Prompt** - Describe your background and AI creates a polished, complete CV
- **Optimize for Job** - Paste your existing CV and a job description, AI rewrites it to match
- **Manual Editor** - Full control over every section with a live preview
- **PDF Export** - Download a clean, print-ready PDF with one click

## Features

- AI-powered CV generation and optimization (via Groq)
- 6+ professionally designed, ATS-optimized templates
- Real-time live preview while editing
- Instant PDF download with no watermarks
- Scroll-reveal animations and modern teal design
- Secure server-side AI processing (API keys never touch the browser)
- Rate-limited API to prevent abuse
- Input validation and sanitization

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| AI | Groq API (LLaMA 3.3 70B) |
| PDF | jsPDF, html2canvas |
| Backend | Vercel Serverless Functions |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A free [Groq API key](https://console.groq.com/keys)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Quadria07/CV-Builder-Pro.git
cd CV-Builder-Pro
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Add your Groq API key to `.env`:
```
GROQ_API_KEY=gsk_your_key_here
```

5. Start the development server:
```bash
npm run dev
```

This runs both the Vite frontend and Express backend concurrently.

### Deploying to Vercel

The project is configured for Vercel out of the box:

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add `GROQ_API_KEY` as an environment variable in Vercel dashboard
4. Deploy

The `vercel.json` config handles everything: Vite builds the frontend, and the `api/` directory runs as serverless functions.

## Project Structure

```
CV-Builder-Pro/
├── api/                    # Vercel serverless functions
│   ├── _helpers.js         # Shared Groq API caller and validation
│   ├── generate.js         # POST /api/generate
│   └── optimize.js         # POST /api/optimize
├── server/
│   └── index.js            # Express dev server (local development)
├── src/
│   ├── components/
│   │   ├── HomePage.tsx     # Landing page
│   │   ├── CVEditor.tsx     # Editor with AI/Edit/Preview tabs
│   │   ├── CVPreview.tsx    # CV preview renderer
│   │   └── AIAssistant.tsx  # AI generation and optimization UI
│   ├── hooks/
│   │   └── useScrollReveal.ts  # Intersection Observer scroll animations
│   ├── utils/
│   │   ├── aiService.ts     # Client-side API service
│   │   └── pdfGenerator.ts  # PDF export logic
│   ├── types/
│   │   └── cv.ts            # TypeScript interfaces
│   ├── App.tsx
│   └── index.css            # Global styles and animations
├── vercel.json              # Vercel deployment config
├── .env.example             # Environment variable template
└── package.json
```

## How It Works

1. **User describes themselves** or pastes an existing CV with a job description
2. **AI generates/optimizes** the CV using Groq's LLaMA model via secure serverless functions
3. **User reviews and edits** in the live editor with real-time preview
4. **User downloads** a professional PDF

## Security

- API keys are stored server-side only (environment variables)
- Input validation with length limits on all user input
- Rate limiting on AI endpoints (10 requests/min per IP in dev)
- Helmet security headers on the Express dev server
- No user data is stored or logged

See [SECURITY.md](SECURITY.md) for the security policy.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.