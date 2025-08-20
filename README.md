# 🧠 CereboAI - One Brain, Many Minds

**Harness the power of every model, side by side.** CereboAI is a modern web application that lets you test and compare responses from multiple AI models using only **free APIs**. Perfect for learning, experimenting, and choosing the right AI model for your needs.

## ✨ Features

### 🆓 **100% Free AI Models**
- **Google Gemini 1.5 Flash**: 15 requests/min, 1500/day - completely free
- **DeepSeek Chat**: $1 free credit via OpenRouter - excellent for coding
- **No subscriptions**: Use powerful AI without any paid plans

### 🔐 Authentication System
- **User Registration & Login**: Secure authentication with Supabase Auth
- **Password Reset**: Email-based password recovery
- **Protected Routes**: Secure access to comparison and chat features

### 🤖 Free AI Model Integration
- **Direct API Calls**: No proxy servers - direct browser-to-API communication
- **Real-time Responses**: Fast, concurrent API calls to free AI services
- **Token Usage Tracking**: Monitor your free API usage
- **Smart Error Handling**: Graceful handling of rate limits and API errors

### 🆚 Comparison Mode
- **Side-by-Side Comparison**: Compare responses from multiple AI models simultaneously
- **Parallel Processing**: Fast, concurrent API calls to all selected models
- **Visual Results**: Clean, organized display of responses with success/error indicators
- **Token Metrics**: View token usage for each model response

### 💬 Single Model Chat
- **Focused Conversations**: Deep, contextual conversations with one AI model
- **Conversation History**: Persistent chat history within sessions
- **Model Selection**: Choose from available configured AI models
- **Real-time Responses**: Streaming-like experience with loading indicators

### ⚙️ Simple Setup
- **Free API Keys**: Easy setup with free Google Gemini and OpenRouter accounts
- **No Complex Config**: Just add API keys to .env file and you're ready
- **Model Status**: Visual indicators showing which free models are available

### Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Built-in theme support
- **Smooth Animations**: Polished user experience with loading states
- **Accessible**: Built with accessibility best practices
- **Customizable**: Customize your CereboAI experience

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for authentication and data storage)
- **Free API keys** (no credit card required):
  - [Google Gemini API Key](https://ai.google.dev) - 100% free, no credit card
  - [OpenRouter API Key](https://openrouter.ai) - $1 free credit, includes DeepSeek

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cereboai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create/update your `.env` file:
   ```env
   # Supabase (already configured)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   
   # Free AI API Keys
   VITE_GOOGLE_API_KEY=your_free_google_gemini_key
   VITE_OPENROUTER_API_KEY=your_free_openrouter_key
   ```

4. **Set up Supabase database**
   
   Run the migrations in the `supabase/migrations/` folder to set up the database schema:
   - User profiles
   - Chat sessions and messages
   - Comparison sessions and responses

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:8080` to see the application.

## Configuration

### Setting up Free AI API Keys

1. **Get Google Gemini API Key** (100% Free)
   - Visit [ai.google.dev](https://ai.google.dev)
   - Sign in with Google account
   - Create API key (no credit card required)
   - 15 requests/minute, 1500/day limit

2. **Get OpenRouter API Key** ($1 Free Credit)
   - Visit [openrouter.ai](https://openrouter.ai)
   - Sign up for free account
   - Get $1 free credit (no credit card required)
   - Access to DeepSeek and other models

3. **Add keys to `.env` file** and restart the app

### Supabase Setup

If you're setting up your own Supabase project:

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL migrations from `supabase/migrations/` in your Supabase SQL editor
3. Update the environment variables with your project credentials
4. Enable email authentication in Supabase Auth settings

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Context + Hooks
- **Routing**: React Router v6
- **Icons**: Lucide React

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navigation.tsx  # Main navigation component
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/      # Supabase client and types
├── pages/              # Application pages
│   ├── Index.tsx      # Landing page
│   ├── Login.tsx      # Authentication pages
│   ├── SignUp.tsx
│   ├── Compare.tsx    # Model comparison page
│   ├── Chat.tsx       # Single model chat page
│   └── Settings.tsx   # User settings page
├── services/           # Business logic services
│   └── aiService.ts   # AI model integration service
└── lib/               # Utility functions
```

### Database Schema
- **profiles**: User profile information
- **chat_sessions**: Chat session metadata
- **chat_messages**: Individual chat messages
- **comparison_sessions**: Comparison session metadata
- **comparison_responses**: Individual model responses

## Security

- **Free API Keys**: Stored in environment variables (never sent to external servers)
- **Authentication**: Secure JWT-based authentication via Supabase
- **Row Level Security**: Database policies ensure users can only access their own data
- **HTTPS**: All API communications use HTTPS
- **Input Validation**: Client and server-side input validation

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **Supabase**: Use Supabase's built-in hosting
- **Any static hosting**: The built files in `dist/` can be served from any static host

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues:

1. **API Key Issues**: Check that your free API keys are correctly added to `.env`
2. **Rate Limits**: Gemini has 15 req/min limit, OpenRouter has usage-based limits
3. **Supabase Setup**: Verify your Supabase project has the correct migrations
4. **Browser Console**: Check for any error messages in developer tools

### Getting Free API Keys
- **Google Gemini**: Visit [ai.google.dev](https://ai.google.dev) - no credit card needed
- **OpenRouter**: Visit [openrouter.ai](https://openrouter.ai) - $1 free credit

For additional help, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, Supabase, and **100% free AI APIs**.

## Why CereboAI?

- **Completely Free**: CereboAI uses only free AI models - no paid subscriptions required!
- **Perfect for Learning**: Experiment with AI models without financial risk
- **High Quality**: Gemini 1.5 Flash rivals many paid models
- **Developer Friendly**: Clean code, easy to extend and customize
- **Modern UI**: Beautiful, responsive design with dark/light mode

**Start comparing AI models for free today!** 🎉
