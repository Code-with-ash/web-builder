import "./App.css"
import { useState } from "react"

function App() {
  const [prompt, setPrompt] = useState("")
  const [toai, setToai] = useState("")
  const [data, setData] = useState(null)
  const [viewMode, setViewMode] = useState("preview") // preview | code
  const [activeFile, setActiveFile] = useState("index.html") // index.html | style.css | script.js
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null) // { message, type: 'success' | 'error' }

  function showToast(message, type = "success") {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  function handleGenerate(e) {
    if (!prompt.trim()) return
    setLoading(true)
    setToai(prompt)

    fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
        console.log("Generated Data:", data?.error ? data.error : data)
        if (data?.error) {
          showToast(data.error, "error")
        } else {
          showToast("Website generated successfully! 🎉")
        }
      })
      .catch((err) => {
        console.error("Error:", err)
        setLoading(false)
        showToast("Failed to generate website", "error")
      })
      e.value = ""
  }

  function copyCode() {
    if (!data?.files?.[activeFile]) return
    navigator.clipboard.writeText(data.files[activeFile])
    showToast("Code copied to clipboard! 📋")
  }

  function downloadFile() {
    if (!data?.files) return
    
    // Create a zip-like structure by downloading individual files
    const files = {
      "index.html": data.files["index.html"] || "",
      "style.css": data.files["style.css"] || "",
      "script.js": data.files["script.js"] || "",
    }

    // Download HTML with embedded CSS and JS
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  <style>
${files["style.css"]}
  </style>
</head>
<body>
${files["index.html"]}
  <script>
${files["script.js"]}
  </script>
</body>
</html>`

    const blob = new Blob([fullHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "website.html"
    a.click()
    URL.revokeObjectURL(url)
    showToast("Website downloaded! 💾")
  }

  return (
    <div className="app">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">⚡ AI Builder</div>
        
        <div className="sidebar-section">
          <div className="sidebar-label">Recent Projects</div>
          <div className="sidebar-item">
            <span className="sidebar-icon">📄</span>
            <span>Gym Landing Page</span>
          </div>
          <div className="sidebar-item">
            <span className="sidebar-icon">🎨</span>
            <span>Portfolio Site</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="theme-toggle">
            <span className="theme-icon">🌙</span>
            <span>Dark Mode</span>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="workspace">
        {/* Topbar */}
        <div className="topbar">
          <div className="project-name">✨ AI Web Builder</div>

          <div className="topbar-actions">
            <div className="view-toggle">
              <button
                className={viewMode === "preview" ? "active" : ""}
                onClick={() => setViewMode("preview")}
              >
                👁️ Preview
              </button>
              <button
                className={viewMode === "code" ? "active" : ""}
                onClick={() => setViewMode("code")}
              >
                💻 Code
              </button>
            </div>

            {data && (
              <div className="action-buttons">
                <button className="icon-btn" onClick={copyCode} title="Copy Code">
                  📋
                </button>
                <button className="icon-btn" onClick={downloadFile} title="Download">
                  💾
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="content">
          {/* Chat Panel */}
          <div className="chat-panel">
            <div className="chat-messages">
              {toai ? (
                <>
                  <div className="message user">{toai}</div>
                  <div className="message ai">
                    {loading ? (
                      <div className="loading-animation">
                        <div className="loading-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span className="loading-text">Generating your website...</span>
                      </div>
                    ) : (
                      data?.explanation || ""
                    )}
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🚀</div>
                  <div className="empty-title">Let's build something amazing</div>
                  <div className="empty-description">
                    Describe the website you want to create and I'll generate it for you
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input">
              <input
                placeholder="Create a modern gym landing page..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate(e)}
                disabled={loading}
              />
              <button onClick={handleGenerate} disabled={loading}>
                {loading ? "⏳" : "✨"} Generate
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="output-panel">
            {/* File Tabs for Code View */}
            {viewMode === "code" && data?.files && (
              <div className="file-tabs">
                {Object.keys(data.files).map((filename) => (
                  <button
                    key={filename}
                    className={`file-tab ${activeFile === filename ? "active" : ""}`}
                    onClick={() => setActiveFile(filename)}
                  >
                    <span className="file-icon">
                      {filename.endsWith(".html")
                        ? "📄"
                        : filename.endsWith(".css")
                        ? "🎨"
                        : "⚙️"}
                    </span>
                    {filename}
                  </button>
                ))}
              </div>
            )}

            {viewMode === "preview" ? (
              <div className="preview-container">
                {data?.files?.["index.html"] ? (
                  <iframe
                    title="preview"
                    sandbox="allow-scripts"
                    srcDoc={`
                      <style>${data.files["style.css"] || ""}</style>
                      ${data.files["index.html"] || ""}
                      <script>${data.files["script.js"] || ""}</script>
                    `}
                  />
                ) : (
                  <div className="placeholder">
                    <div className="placeholder-icon">👀</div>
                    <div className="placeholder-text">Live preview will appear here</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="code-container">
                {data?.files?.[activeFile] ? (
                  <pre>
                    <code className={getLanguageClass(activeFile)}>
                      {data.files[activeFile]}
                    </code>
                  </pre>
                ) : (
                  <div className="placeholder">
                    <div className="placeholder-icon">💻</div>
                    <div className="placeholder-text">Generated code will appear here</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getLanguageClass(filename) {
  if (filename.endsWith(".html")) return "language-html"
  if (filename.endsWith(".css")) return "language-css"
  if (filename.endsWith(".js")) return "language-javascript"
  return ""
}

export default App