# Contributing to CV Builder Pro

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/CV-Builder-Pro.git
   cd CV-Builder-Pro
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file from `.env.example` and add your Groq API key
5. Start the dev server:
   ```bash
   npm run dev
   ```

## Making Changes

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test that the build succeeds:
   ```bash
   npm run build
   ```
4. Commit with a clear, descriptive message (see commit guidelines below)
5. Push to your fork and open a Pull Request

## Commit Messages

Write commit messages that tell a clear story:

```
Add dark mode toggle to the editor

Allow users to switch between light and dark themes
in the CV editor. Preference is saved to localStorage.
```

Avoid vague messages like "fix stuff" or "update code".

## Code Style

- Use TypeScript for all new frontend code
- Follow existing naming conventions and file structure
- Use Tailwind CSS utility classes for styling
- Keep components focused and reasonably sized
- Run `npm run lint` before committing

## What to Contribute

Here are some areas where contributions are welcome:

- **New templates** - Add new CV template designs
- **UI improvements** - Better responsiveness, accessibility, animations
- **Bug fixes** - Check the Issues tab for reported bugs
- **Documentation** - Improve README, add code comments, write guides
- **Testing** - Add unit or integration tests

## Pull Request Guidelines

- Keep PRs focused on a single change
- Describe what you changed and why
- Include screenshots for visual changes
- Make sure the build passes before requesting review
- Link any related issues

## Reporting Bugs

Use the [Bug Report](https://github.com/Quadria07/CV-Builder-Pro/issues/new?template=bug_report.md) issue template. Include:

- Steps to reproduce
- Expected vs actual behavior
- Browser and OS info
- Screenshots if applicable

## Security Issues

Do not report security vulnerabilities in public issues. See [SECURITY.md](SECURITY.md) for how to report them privately.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
