# mails.samk0.com

[Checkout the live site](https://mails.samk0.com).

An open-source web application that generates email templates using AI, built with Nuxt 3 and Vue Email components. With live preview, tailwind support, and more.

## Features

- 🤖 AI-powered email template generation using Google's Gemini
- 📝 Monaco Editor integration for code editing
- 🎨 Tailwind CSS support with email-safe configurations
- 👀 Live preview with shadow DOM isolation
- 📋 One-click code copying
- 🔄 Real-time rendering
- 📱 Email-client compatible output

## Tech Stack

- [Nuxt 3](https://nuxt.com/) - Vue Framework
- [Vue Email](https://www.vuemail.net/) - Email Components
- [@ai-sdk/google](https://www.npmjs.com/package/@ai-sdk/google) - Gemini AI Integration
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code Editor
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [DrizzleORM](https://orm.drizzle.team/) - Database ORM

## Prerequisites

- Node.js (Latest LTS version recommended)
- Google Gemini API key

## Environment Variables

Create a `.env` file in the root directory:

```
NUXT_GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
NUXT_GITHUB_CLIENT_ID=your_github_client_id_here
NUXT_GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

## Running the app

```
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vue Email](https://www.vuemail.net/) for the email components
- [Google Gemini](https://deepmind.google/technologies/gemini/) for the AI capabilities
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editing experience
