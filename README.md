# AI Chatbot

A modern, responsive AI chatbot built with React and Vite that supports multiple AI providers including OpenAI and Google AI. Features a clean interface with customizable themes and optional web search integration.

![AI Chatbot](react-ai-chatbot/public/chat-bot.png)

## ✨ Features

- **Multiple AI Providers**: Support for both OpenAI and Google AI
- **Web Search Integration**: Optional web search capabilities for enhanced responses
- **Responsive Design**: Clean, modern interface that works on all devices
- **Theme Support**: Multiple theme options including auto, light, and dark modes
- **Real-time Chat**: Smooth messaging experience with loading indicators
- **Settings Management**: Easy configuration through a settings modal
- **Message History**: Persistent chat history during sessions
- **Error Handling**: Graceful error handling with system messages

## 🚀 Quick Start

### Prerequisites

- Node.js (version 22 or higher)
- npm or pnpm
- API keys for OpenAI and/or Google AI

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/farooq-teqniqly/udemy-chatbot.git
   cd udemy-chatbot/react-ai-chatbot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file and add your API keys:

   ```env
   VITE_GOOGLE_API_KEY=your-google-api-key
   VITE_OPENAI_API_KEY=your-openai-api-key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to start chatting!

## 🔧 Configuration

### API Keys

You'll need at least one of the following API keys:

- **OpenAI API Key**: Get yours from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Google AI API Key**: Get yours from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Environment Variables

| Variable              | Description            | Required   |
| --------------------- | ---------------------- | ---------- |
| `VITE_OPENAI_API_KEY` | Your OpenAI API key    | Optional\* |
| `VITE_GOOGLE_API_KEY` | Your Google AI API key | Optional\* |

\*At least one API key is required for the chatbot to function.

## 🏗️ Project Structure

```text
react-ai-chatbot/
├── public/
│   └── chat-bot.png          # App logo
├── src/
│   ├── components/           # React components
│   │   ├── Chat/            # Main chat interface
│   │   ├── Controls/        # Message input controls
│   │   ├── Loader/          # Loading indicator
│   │   ├── SettingsButton/  # Settings toggle button
│   │   └── SettingsModal/   # Settings configuration modal
│   ├── assistants/          # AI provider integrations
│   │   ├── googleAI.js      # Google AI implementation
│   │   ├── openAI.js        # OpenAI implementation
│   │   └── messages.js      # Message utilities
│   ├── stores/              # State management
│   │   └── settingsStore.js # Zustand store for settings
│   ├── App.jsx              # Main application component
│   ├── App.module.css       # App-specific styles
│   ├── index.css            # Global styles
│   └── main.jsx             # Application entry point
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## 🎨 Components

### Chat Component

Displays the conversation history with support for markdown rendering and different message types (user, assistant, system).

### Controls Component

Handles user input with an auto-resizing textarea and send functionality.

### Settings Modal

Provides configuration options for:

- AI provider selection
- Theme preferences
- Web search toggle

### Loader Component

Shows a loading indicator during API requests.

## 🔌 AI Assistants

The application supports multiple AI providers through a modular assistant system:

- **OpenAI Assistant**: Uses the OpenAI API for chat completions
- **Google AI Assistant**: Uses Google's Generative AI API

Each assistant implements the same interface, making it easy to switch between providers or add new ones.

## 🛠️ Available Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## 🎯 Usage

1. **Start a conversation**: Type your message in the input field and press Enter or click Send
2. **Configure settings**: Click the settings button to:
   - Switch between AI providers
   - Toggle web search functionality
   - Change theme preferences
3. **View responses**: The AI will respond with helpful information, and if web search is enabled, it can provide current information from the web

## 🔍 Web Search Integration

When enabled, the chatbot can perform web searches to provide more current and comprehensive responses. This feature enhances the AI's knowledge with real-time information from the internet.

## 🎨 Theming

The application supports multiple themes:

- **Auto**: Follows system preference
- **Light**: Light theme
- **Dark**: Dark theme

Themes are managed through CSS custom properties and can be easily customized.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of a Udemy course and is intended for educational purposes.

## 🐛 Troubleshooting

### Common Issues

### API Key Not Working

- Ensure your API keys are correctly set in the `.env` file
- Verify the API keys are valid and have sufficient credits
- Check that the environment variable names match exactly

### Build Errors

- Make sure you're using Node.js version 16 or higher
- Try deleting `node_modules` and running `npm install` again
- Check for any missing dependencies

### Development Server Issues

- Ensure port 5173 is not being used by another application
- Try running `npm run dev -- --port 3000` to use a different port

## 📚 Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and development server
- **Zustand** - State management
- **OpenAI API** - AI chat completions
- **Google AI API** - Alternative AI provider
- **React Markdown** - Markdown rendering
- **CSS Modules** - Scoped styling

## 🔗 Links

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google AI Documentation](https://ai.google.dev/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

---

Built with ❤️ for learning and exploration of AI technologies.
