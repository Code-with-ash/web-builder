# ⚡ AI Web Builder

An AI-powered web builder that generates complete, production-quality static websites from natural language prompts.

## ✨ Features

- **AI-Powered Generation** - Describe the website you want, and AI generates the complete HTML, CSS, and JavaScript
- **Live Preview** - Instantly preview generated websites in an embedded iframe
- **Code View** - View and inspect the generated source code
- **Copy & Download** - Copy code to clipboard or download as a complete HTML file
- **Iterative Editing** - Modify existing websites with follow-up prompts
- **Mobile Responsive** - All generated websites are mobile-friendly by default

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite

**Backend:**
- Express.js
- Groq SDK (LLM API)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm
- Groq API key ([Get one here](https://console.groq.com))

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Code-with-ash/web-builder.git
   cd web-builder
   ```

2. **Setup Backend**
   ```bash
   cd Aiwebbuilder/backend
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file in backend directory
   echo "GROQ_API_KEY=your_groq_api_key_here" > .env
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

## 🚀 Running the App

1. **Start the backend server**
   ```bash
   cd Aiwebbuilder/backend
   node index.js
   ```
   Server runs on `http://localhost:3000`

2. **Start the frontend** (in a new terminal)
   ```bash
   cd Aiwebbuilder/frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 💡 Usage

1. Open the app in your browser
2. Type a description of the website you want to create (e.g., "Create a modern gym landing page with hero section, features, and contact form")
3. Click **Generate** or press Enter
4. View the live preview or switch to code view
5. Copy or download the generated code

## 📁 Project Structure

```
Aiwebbuilder/
├── backend/
│   ├── index.js        # Express server with Groq AI integration
│   ├── package.json
│   └── .env            # API keys (not tracked in git)
└── frontend/
    ├── src/
    │   ├── App.jsx     # Main React component
    │   └── App.css     # Styles
    ├── index.html
    └── package.json
```

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Your Groq API key for LLM access |

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
