# 🧠 CereboAI – One Brain, Many Minds

**Harness the power of every model, side by side.**  
CereboAI is a modern web application that lets you **test and compare responses** from multiple AI models using only **free APIs**.  
Built with **Supabase Auth + Database** for secure login and persistent chat history.  

---

## ✨ Features

### 🆓 100% Free AI Models
- **Google Gemini 1.5 Flash** – 15 requests/min, 1500/day (free forever)
- **DeepSeek Chat via OpenRouter** – $1 free credit, great for coding and analysis
- **No subscriptions required** – all APIs are free to start

### 🔐 Authentication (Supabase)
- Secure **sign-up, login, and logout**
- **Password reset** via email
- Protected routes for chat and model comparison
- **Profiles stored in Supabase database**

### 🤖 AI Model Integration
- **Direct API calls** – browser-to-API, no proxy servers
- **Concurrent requests** – fast, side-by-side comparison
- **Error handling** – smooth handling of rate limits & API failures
- **Usage tracking** – monitor free token usage per model

### 🆚 Comparison Mode
- **Side-by-side results** from multiple models
- **Parallel processing** for speed
- Clean display with success/error indicators
- Token metrics for each response

### 💬 Single Model Chat
- Contextual **one-on-one conversations**
- **Persistent chat history** per session
- Choose which model to talk to
- Real-time responses with loading indicators

### 🎨 Modern UI
- Responsive (desktop & mobile)
- Dark/Light mode support
- Smooth animations
- Built with **shadcn/ui + Tailwind**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Free API keys:
  - [Google Gemini API Key](https://ai.google.dev) – no credit card
  - [OpenRouter API Key](https://openrouter.ai) – $1 free credit

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NEVIL5249/CereboAI.git
   cd CereboAI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (or copy `.env.example`):
   ```env
   # Supabase
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   
   # Free AI API Keys
   VITE_GOOGLE_API_KEY=your_google_gemini_key
   VITE_OPENROUTER_API_KEY=your_openrouter_key
   ```

4. Run Supabase migrations (in `supabase/migrations/`) to set up:
   - Profiles
   - Chat sessions & messages
   - Comparison sessions & responses

5. Start the dev server:
   ```bash
   npm run dev
   ```

6. Open in browser:
   ```
   http://localhost:8080
   ```

---

## 🛠 Configuration

### Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Run SQL migrations from `/supabase/migrations`
3. Enable **email authentication**
4. Copy project URL + anon key into `.env`

### Free API Keys
- **Gemini** → [ai.google.dev](https://ai.google.dev)
- **OpenRouter** → [openrouter.ai](https://openrouter.ai)

---

## 📂 Project Structure

```
CereboAI/
├── 📁 public/                    # Static assets
│   ├── favicon.svg
│   ├── placeholder.svg
│   └── robots.txt
├── 📁 server/                    # Server configuration
│   └── package-lock.json
├── 📁 src/                       # Main source code
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 ui/                # shadcn/ui components
│   │   ├── Navigation.tsx        # Navigation component
│   │   └── ProtectedRoute.tsx    # Route protection
│   ├── 📁 contexts/              # React contexts
│   │   └── AuthContext.tsx       # Authentication context
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── use-mobile.tsx        # Mobile detection hook
│   │   └── use-toast.ts          # Toast notifications
│   ├── 📁 integrations/          # External service configs
│   │   └── 📁 supabase/          # Supabase client setup
│   ├── 📁 lib/                   # Utility functions
│   ├── 📁 pages/                 # Application pages
│   ├── 📁 services/              # Business logic & API calls
│   ├── App.css                   # App-specific styles
│   ├── App.tsx                   # Main App component
│   ├── index.css                 # Global styles
│   ├── main.tsx                  # App entry point
│   └── vite-env.d.ts            # Vite type definitions
├── 📁 supabase/                  # Database & migrations
│   └── config.toml               # Supabase configuration
├── .env                          # Environment variables (not in git)
├── .gitignore                    # Git ignore rules
├── README.md                     # Project documentation
├── bun.lockb                     # Bun lock file
├── components.json               # shadcn/ui config
├── eslint.config.js              # ESLint configuration
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── package-lock.json             # NPM lock file
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.app.json             # App-specific TS config
├── tsconfig.node.json            # Node-specific TS config
└── vite.config.ts                # Vite build configuration
```

---

## 🔒 Security

- `.env` is **ignored** (see `.gitignore`)
- API keys are **stored locally only**
- Supabase uses **Row Level Security (RLS)**
- HTTPS enforced for all API calls

---

## 💡 Why CereboAI?

- **Free forever** – powered by free APIs  
- **Learning-friendly** – compare models easily  
- **Secure & scalable** – thanks to Supabase  
- **Modern UI** – clean and responsive  

**Start comparing AI models for free today!** 🎉
