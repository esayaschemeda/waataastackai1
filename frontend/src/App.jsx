import { useState, useRef, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0b1120;
    --navy2: #131c30;
    --navy3: #1a2540;
    --blue: #2563eb;
    --blue2: #3b82f6;
    --cyan: #06b6d4;
    --green: #10b981;
    --orange: #f59e0b;
    --red: #ef4444;
    --text: #f0f4ff;
    --text2: #94a3b8;
    --text3: #64748b;
    --border: rgba(99,131,255,0.15);
    --glass: rgba(255,255,255,0.04);
    --card: rgba(19,28,48,0.95);
  }

  body { font-family: 'Sora', sans-serif; background: var(--navy); color: var(--text); }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 64px;
    background: rgba(11,17,32,0.96);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(12px);
  }
  .nav-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .nav-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 800; color: white;
  }
  .nav-logo-text { font-size: 18px; font-weight: 700; color: var(--text); }
  .nav-logo-text span { color: var(--cyan); }
  .nav-links { display: flex; gap: 4px; }
  .nav-link {
    padding: 7px 14px; border-radius: 8px; cursor: pointer;
    font-size: 14px; font-weight: 500; color: var(--text2);
    transition: all 0.2s; border: none; background: none;
  }
  .nav-link:hover { color: var(--text); background: var(--glass); }
  .nav-link.active { color: var(--cyan); background: rgba(6,182,212,0.1); }
  .nav-right { display: flex; align-items: center; gap: 12px; }
  .btn {
    padding: 8px 18px; border-radius: 8px; cursor: pointer;
    font-size: 14px; font-weight: 600; font-family: 'Sora', sans-serif;
    transition: all 0.2s; border: none;
  }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text2); }
  .btn-outline:hover { border-color: var(--blue2); color: var(--text); }
  .btn-primary { background: linear-gradient(135deg, var(--blue), var(--cyan)); color: white; }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(37,99,235,0.4); }
  .btn-sm { padding: 6px 14px; font-size: 13px; }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; cursor: pointer;
    color: white;
  }

  /* HERO */
  .hero {
    padding: 80px 32px 60px;
    background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.18) 0%, transparent 70%);
    text-align: center; position: relative; overflow: hidden;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 14px; border-radius: 20px;
    background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3);
    color: var(--cyan); font-size: 12px; font-weight: 600;
    margin-bottom: 24px; letter-spacing: 0.05em;
  }
  .hero h1 { font-size: clamp(32px, 5vw, 56px); font-weight: 800; line-height: 1.1; margin-bottom: 20px; }
  .hero h1 span { background: linear-gradient(90deg, var(--blue2), var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero p { font-size: 17px; color: var(--text2); max-width: 560px; margin: 0 auto 36px; line-height: 1.6; }
  .hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .hero-stats { display: flex; gap: 40px; justify-content: center; margin-top: 52px; flex-wrap: wrap; }
  .hero-stat { text-align: center; }
  .hero-stat-num { font-size: 28px; font-weight: 800; color: var(--text); }
  .hero-stat-num span { background: linear-gradient(90deg, var(--blue2), var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero-stat-label { font-size: 13px; color: var(--text3); margin-top: 2px; }

  /* MAIN LAYOUT */
  .main { display: flex; flex: 1; }
  .sidebar {
    width: 240px; min-height: calc(100vh - 64px);
    background: var(--navy2); border-right: 1px solid var(--border);
    padding: 20px 12px; position: sticky; top: 64px; align-self: flex-start;
    max-height: calc(100vh - 64px); overflow-y: auto;
  }
  .sidebar-section { margin-bottom: 24px; }
  .sidebar-label { font-size: 10px; font-weight: 700; color: var(--text3); letter-spacing: 0.1em; text-transform: uppercase; padding: 0 10px; margin-bottom: 6px; }
  .sidebar-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px; border-radius: 8px; cursor: pointer;
    font-size: 13.5px; font-weight: 500; color: var(--text2);
    transition: all 0.15s; width: 100%;
    border: none; background: none; text-align: left;
  }
  .sidebar-item:hover { color: var(--text); background: var(--glass); }
  .sidebar-item.active { color: var(--cyan); background: rgba(6,182,212,0.1); }
  .sidebar-icon { font-size: 16px; width: 20px; text-align: center; }

  /* CONTENT */
  .content { flex: 1; padding: 28px 32px; overflow-x: hidden; }

  /* CARDS */
  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 24px;
    transition: border-color 0.2s;
  }
  .card:hover { border-color: rgba(99,131,255,0.3); }
  .card-grid { display: grid; gap: 16px; }
  .grid-2 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
  .grid-3 { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
  .grid-4 { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }

  /* STAT CARDS */
  .stat-card { display: flex; flex-direction: column; gap: 8px; }
  .stat-card-header { display: flex; justify-content: space-between; align-items: center; }
  .stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .stat-num { font-size: 28px; font-weight: 800; }
  .stat-label { font-size: 13px; color: var(--text3); }
  .stat-change { font-size: 12px; font-weight: 600; }
  .positive { color: var(--green); }
  .negative { color: var(--red); }

  /* CHAT */
  .chat-container { display: flex; flex-direction: column; height: 520px; }
  .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 14px; }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .msg { display: flex; gap: 10px; max-width: 85%; }
  .msg.user { align-self: flex-end; flex-direction: row-reverse; }
  .msg-avatar { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .msg-ai-avatar { background: linear-gradient(135deg, var(--blue), var(--cyan)); color: white; font-weight: 700; }
  .msg-user-avatar { background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; font-weight: 700; }
  .msg-bubble {
    padding: 11px 15px; border-radius: 12px; font-size: 14px; line-height: 1.6;
  }
  .msg.ai .msg-bubble { background: var(--navy3); border: 1px solid var(--border); border-top-left-radius: 4px; }
  .msg.user .msg-bubble { background: linear-gradient(135deg, var(--blue), var(--cyan)); color: white; border-top-right-radius: 4px; }
  .chat-input-row {
    display: flex; gap: 10px; padding: 14px;
    border-top: 1px solid var(--border);
  }
  .chat-input {
    flex: 1; background: var(--navy3); border: 1px solid var(--border);
    border-radius: 10px; padding: 11px 16px; color: var(--text);
    font-size: 14px; font-family: 'Sora', sans-serif; outline: none;
    transition: border-color 0.2s;
  }
  .chat-input:focus { border-color: var(--blue2); }
  .chat-input::placeholder { color: var(--text3); }
  .send-btn {
    width: 42px; height: 42px; border-radius: 10px;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.2s; flex-shrink: 0;
  }
  .send-btn:hover { transform: scale(1.05); }
  .typing { display: flex; gap: 4px; align-items: center; padding: 6px 0; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue2); animation: bounce 1.2s infinite; }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)} }

  /* CODE */
  .code-block {
    background: #0d1117; border: 1px solid var(--border); border-radius: 10px;
    padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 13px;
    overflow-x: auto; position: relative;
  }
  .code-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .code-lang { font-size: 11px; color: var(--cyan); font-weight: 600; letter-spacing: 0.08em; }
  .code-copy { font-size: 11px; color: var(--text3); cursor: pointer; background: none; border: none; font-family: 'Sora', sans-serif; }
  .code-copy:hover { color: var(--text); }
  .line { display: block; color: #e2e8f0; }
  .kw { color: #7dd3fc; }
  .fn { color: #86efac; }
  .str { color: #fbbf24; }
  .cmt { color: #4b5563; }
  .num { color: #c084fc; }

  /* SECTION HEADER */
  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .section-title { font-size: 20px; font-weight: 700; }
  .section-sub { font-size: 13px; color: var(--text3); margin-top: 2px; }

  /* TABS */
  .tabs { display: flex; gap: 4px; margin-bottom: 20px; background: var(--navy2); border-radius: 10px; padding: 4px; border: 1px solid var(--border); }
  .tab { padding: 8px 16px; border-radius: 7px; cursor: pointer; font-size: 13.5px; font-weight: 500; color: var(--text3); transition: all 0.2s; border: none; background: none; font-family: 'Sora', sans-serif; }
  .tab.active { background: var(--blue); color: white; }

  /* PROGRESS */
  .progress-bar { height: 6px; background: var(--navy3); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--blue), var(--cyan)); transition: width 1s ease; }

  /* TAG / BADGE */
  .tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .tag-blue { background: rgba(37,99,235,0.15); color: var(--blue2); }
  .tag-green { background: rgba(16,185,129,0.15); color: var(--green); }
  .tag-orange { background: rgba(245,158,11,0.15); color: var(--orange); }
  .tag-red { background: rgba(239,68,68,0.15); color: var(--red); }
  .tag-cyan { background: rgba(6,182,212,0.15); color: var(--cyan); }

  /* FORM */
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: var(--text2); margin-bottom: 6px; }
  .form-input, .form-select, .form-textarea {
    width: 100%; background: var(--navy3); border: 1px solid var(--border);
    border-radius: 10px; padding: 11px 14px; color: var(--text);
    font-size: 14px; font-family: 'Sora', sans-serif; outline: none;
    transition: border-color 0.2s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--blue2); }
  .form-select option { background: var(--navy2); }
  .form-textarea { resize: vertical; min-height: 100px; }

  /* COURSE CARD */
  .course-card { border-radius: 14px; overflow: hidden; background: var(--card); border: 1px solid var(--border); transition: all 0.2s; cursor: pointer; }
  .course-card:hover { transform: translateY(-3px); border-color: rgba(99,131,255,0.4); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
  .course-thumb { height: 140px; display: flex; align-items: center; justify-content: center; font-size: 48px; }
  .course-body { padding: 16px; }
  .course-title { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
  .course-meta { font-size: 12px; color: var(--text3); margin-bottom: 10px; }
  .course-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
  .course-price { font-size: 18px; font-weight: 800; color: var(--cyan); }

  /* LOGIN */
  .login-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.2) 0%, transparent 70%);
    padding: 20px;
  }
  .login-box { width: 100%; max-width: 440px; }
  .login-logo { text-align: center; margin-bottom: 32px; }
  .login-title { font-size: 28px; font-weight: 800; margin-bottom: 6px; }
  .login-sub { font-size: 14px; color: var(--text3); }
  .login-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; }
  .login-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
  .login-divider span { font-size: 12px; color: var(--text3); white-space: nowrap; }
  .login-divider::before, .login-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .social-btn { width: 100%; padding: 11px; border-radius: 10px; border: 1px solid var(--border); background: var(--navy3); color: var(--text); font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'Sora', sans-serif; transition: all 0.2s; margin-bottom: 10px; }
  .social-btn:hover { border-color: var(--blue2); }

  /* LOADING */
  .loading-spinner {
    display: inline-block; width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* MISC */
  .flex { display: flex; }
  .items-center { align-items: center; }
  .gap-2 { gap: 8px; }
  .gap-3 { gap: 12px; }
  .mb-2 { margin-bottom: 8px; }
  .mb-3 { margin-bottom: 16px; }
  .mb-4 { margin-bottom: 24px; }
  .text-sm { font-size: 13px; }
  .text-xs { font-size: 11px; }
  .text-muted { color: var(--text3); }
  .font-bold { font-weight: 700; }
  .w-full { width: 100%; }
  .rounded { border-radius: 8px; }
  .divider { height: 1px; background: var(--border); margin: 20px 0; }
  .chip { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; background: var(--navy3); color: var(--text2); }
  .notification { display: flex; gap: 12px; padding: 14px; border-radius: 10px; background: var(--navy3); border: 1px solid var(--border); margin-bottom: 10px; }
  .notif-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
`;

// ─── DATA ───────────────────────────────────────────────
const COURSES = [
  { id: 1, emoji: "⚛️", title: "React Mastery", tag: "Frontend", level: "Intermediate", lessons: 42, students: 3241, price: "$79", progress: 68, color: "#1e3a5f" },
  { id: 2, emoji: "🟢", title: "Node.js & Express", tag: "Backend", level: "Intermediate", lessons: 38, students: 2108, price: "$69", progress: 45, color: "#1a3a2e" },
  { id: 3, emoji: "🗄️", title: "PostgreSQL Deep Dive", tag: "Database", level: "Advanced", lessons: 29, students: 1576, price: "$59", progress: 20, color: "#2d1f3f" },
  { id: 4, emoji: "🤖", title: "AI Integration with Claude", tag: "AI/ML", level: "Advanced", lessons: 35, students: 4820, price: "$99", progress: 0, color: "#1f2d3f" },
  { id: 5, emoji: "☁️", title: "AWS Deployment", tag: "DevOps", level: "Advanced", lessons: 31, students: 1982, price: "$89", progress: 0, color: "#1a2e1a" },
  { id: 6, emoji: "🔷", title: "TypeScript Fundamentals", tag: "Language", level: "Beginner", lessons: 24, students: 5102, price: "$49", progress: 100, color: "#1e2a3f" },
];

const CHAT_STARTERS = [
  "What is the difference between REST and GraphQL?",
  "Explain async/await in JavaScript",
  "How do I deploy a Node.js app to AWS?",
  "What are React hooks and when to use them?",
];

const AI_REPLIES = {
  "What is the difference between REST and GraphQL?": `**REST vs GraphQL** — great question!\n\n**REST** uses multiple endpoints, one per resource (e.g. /users, /posts). Each returns a fixed shape.\n\n**GraphQL** uses a *single endpoint* where you specify exactly what data you need. This eliminates over-fetching and under-fetching.\n\nUse **REST** for simple CRUD APIs. Use **GraphQL** when clients need flexible, nested data shapes.`,
  "Explain async/await in JavaScript": `**async/await** is syntactic sugar over Promises, making async code read like sync code.\n\n\`\`\`js\nasync function fetchUser(id) {\n  const res = await fetch('/api/users/' + id);\n  const user = await res.json();\n  return user;\n}\n\`\`\`\n\nThe \`await\` keyword pauses execution until the Promise resolves. Always wrap in try/catch for error handling!`,
};

const defaultReply = (q) => `Great question about "${q}"! As your AI tutor, I'd walk you through this step-by-step with examples, exercises, and links to relevant course modules. Try asking about specific concepts from your current module for the most targeted help!`;

// ─── COMPONENTS ─────────────────────────────────────────

function StatCard({ icon, iconBg, label, value, change, positive }) {
  return (
    <div className="card stat-card">
      <div className="stat-card-header">
        <div className="stat-icon" style={{ background: iconBg }}>{icon}</div>
        <span className={`stat-change ${positive ? "positive" : "negative"}`}>{change}</span>
      </div>
      <div className="stat-num">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function ChatPanel({ user }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: `Hey ${user?.name?.split(" ")[0] || "there"}! 👋 I'm your AI tutor. Ask me anything about full stack development, your current modules, or code challenges.` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: q }]);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are an expert full stack development AI tutor for a coding platform called StackAI. You help students learn React, Node.js, databases, APIs, and AI integration. Be concise, friendly, and educational. Use code examples when helpful. Keep responses under 150 words.",
          messages: [{ role: "user", content: q }]
        })
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text).join("") || "Sorry, I couldn't process that. Please try again!";
      setMessages(m => [...m, { role: "ai", text: reply }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: AI_REPLIES[q] || defaultReply(q) }]);
    }
    setLoading(false);
  };

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--blue), var(--cyan))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white" }}>AI</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>AI Tutor</div>
          <div style={{ fontSize: 11, color: "var(--green)", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }}></span>
            Online • Powered by Claude
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className={`msg-avatar ${m.role === "ai" ? "msg-ai-avatar" : "msg-user-avatar"}`}>
              {m.role === "ai" ? "AI" : user?.name?.[0] || "U"}
            </div>
            <div className="msg-bubble" style={{ whiteSpace: "pre-line" }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="msg ai">
            <div className="msg-avatar msg-ai-avatar">AI</div>
            <div className="msg-bubble"><div className="typing"><div className="dot"/><div className="dot"/><div className="dot"/></div></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: "10px 16px", display: "flex", gap: 6, flexWrap: "wrap", borderTop: "1px solid var(--border)" }}>
        {CHAT_STARTERS.map((s, i) => (
          <button key={i} onClick={() => send(s)} style={{ padding: "5px 10px", borderRadius: 20, border: "1px solid var(--border)", background: "transparent", color: "var(--text3)", fontSize: 11, cursor: "pointer", fontFamily: "Sora, sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.borderColor = "var(--blue2)"; e.target.style.color = "var(--text)"; }}
            onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text3)"; }}>
            {s.length > 30 ? s.slice(0, 30) + "…" : s}
          </button>
        ))}
      </div>

      <div className="chat-input-row">
        <input className="chat-input" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask your AI tutor anything…" />
        <button className="send-btn" onClick={() => send()}>➤</button>
      </div>
    </div>
  );
}

function CodeReviewer() {
  const [code, setCode] = useState(`function fetchUsers() {\n  fetch('/api/users')\n    .then(res => res.json())\n    .then(data => console.log(data))\n}`);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const reviewCode = async () => {
    setLoading(true);
    setReview(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a senior full stack developer doing code review for students. Analyze the code briefly: give a score (1-10), list 2-3 issues, suggest improvements, and show a corrected version. Be educational and encouraging. Keep under 200 words.",
          messages: [{ role: "user", content: `Review this code:\n\n${code}` }]
        })
      });
      const data = await res.json();
      setReview(data.content?.map(b => b.text).join("") || "Could not analyze code.");
    } catch {
      setReview("⚠️ Issues found:\n1. Missing error handling — add .catch() or try/catch\n2. No loading state management\n3. Consider using async/await for readability\n\nScore: 5/10 — Good start, but needs error handling before production use!");
    }
    setLoading(false);
  };

  return (
    <div className="card-grid grid-2" style={{ gap: 16 }}>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>📝 Your Code</span>
          <span className="tag tag-cyan">JavaScript</span>
        </div>
        <textarea value={code} onChange={e => setCode(e.target.value)}
          style={{ width: "100%", minHeight: 280, background: "#0d1117", border: "none", padding: 16, color: "#e2e8f0", fontFamily: "JetBrains Mono, monospace", fontSize: 13, outline: "none", resize: "vertical" }} />
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
          <button className="btn btn-primary w-full" onClick={reviewCode} disabled={loading}>
            {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span className="loading-spinner" /> Analyzing…</span> : "🔍 Review My Code"}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>🤖 AI Review</span>
        </div>
        <div style={{ padding: 16, minHeight: 280, fontFamily: "Sora, sans-serif", fontSize: 13.5, lineHeight: 1.7, color: "var(--text2)", whiteSpace: "pre-wrap" }}>
          {!review && !loading && <span style={{ color: "var(--text3)" }}>Paste your code and click "Review My Code" to get instant AI feedback on quality, bugs, and best practices.</span>}
          {loading && <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text3)" }}><div className="loading-spinner" style={{ borderTopColor: "var(--blue2)" }} /> Analyzing your code…</div>}
          {review && review}
        </div>
      </div>
    </div>
  );
}

function ProjectGenerator() {
  const [form, setForm] = useState({ stack: "React + Node.js", level: "Intermediate", domain: "E-commerce" });
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setProject(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a project idea generator for full stack dev students. Generate a practical, portfolio-worthy project idea. Include: Project Name, Description (2 sentences), 5 Key Features, Tech Stack breakdown, Estimated build time, and 3 learning outcomes. Be specific and inspiring.",
          messages: [{ role: "user", content: `Generate a ${form.level} ${form.domain} project using ${form.stack}` }]
        })
      });
      const data = await res.json();
      setProject(data.content?.map(b => b.text).join("") || "Project generated!");
    } catch {
      setProject(`🚀 **AfriShop — Multi-Vendor Marketplace**\n\nA full-featured e-commerce platform supporting multiple African vendors with mobile money integration.\n\n**Features:**\n• Vendor registration & dashboard\n• Product catalog with search/filter\n• Cart, checkout & order tracking\n• M-Pesa / Paystack payment integration\n• Admin analytics dashboard\n\n**Stack:** React, Node.js/Express, PostgreSQL, Redis\n**Duration:** 4–6 weeks | **Level:** Intermediate`);
    }
    setLoading(false);
  };

  return (
    <div className="card-grid grid-2" style={{ gap: 16 }}>
      <div className="card">
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>⚙️ Project Settings</div>
        <div className="form-group">
          <label className="form-label">Tech Stack</label>
          <select className="form-select" value={form.stack} onChange={e => setForm(f => ({ ...f, stack: e.target.value }))}>
            <option>React + Node.js</option>
            <option>Next.js Full Stack</option>
            <option>React + Python/FastAPI</option>
            <option>Vue + Node.js</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Difficulty Level</label>
          <select className="form-select" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Domain / Industry</label>
          <select className="form-select" value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}>
            <option>E-commerce</option>
            <option>EdTech</option>
            <option>HealthTech</option>
            <option>FinTech</option>
            <option>Social Platform</option>
            <option>SaaS Tool</option>
            <option>AI Application</option>
          </select>
        </div>
        <button className="btn btn-primary w-full" onClick={generate} disabled={loading}>
          {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span className="loading-spinner" /> Generating…</span> : "✨ Generate Project Idea"}
        </button>
      </div>
      <div className="card" style={{ background: project ? "var(--card)" : "var(--navy2)" }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🗂️ Your Project</div>
        {!project && !loading && (
          <div style={{ color: "var(--text3)", fontSize: 14, lineHeight: 1.7 }}>
            Configure your preferences and generate a custom project idea tailored to your skill level and interests. Each project is portfolio-ready!
          </div>
        )}
        {loading && <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text3)" }}><div className="loading-spinner" style={{ borderTopColor: "var(--blue2)" }} /> Crafting your perfect project…</div>}
        {project && <div style={{ fontSize: 13.5, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "var(--text2)" }}>{project}</div>}
      </div>
    </div>
  );
}

function Dashboard({ user }) {
  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Welcome back, {user.name.split(" ")[0]} 👋</div>
          <div className="section-sub">Continue your journey to becoming a full stack developer</div>
        </div>
        <button className="btn btn-primary btn-sm">+ Enroll New Course</button>
      </div>

      <div className="card-grid grid-4 mb-4">
        <StatCard icon="📚" iconBg="rgba(37,99,235,0.2)" label="Courses Enrolled" value="4" change="↑ 1 this month" positive />
        <StatCard icon="⚡" iconBg="rgba(16,185,129,0.2)" label="Lessons Completed" value="87" change="↑ 12 this week" positive />
        <StatCard icon="🏆" iconBg="rgba(245,158,11,0.2)" label="Current Streak" value="14d" change="🔥 Personal best" positive />
        <StatCard icon="⭐" iconBg="rgba(239,68,68,0.2)" label="Avg. Quiz Score" value="88%" change="↓ 2% vs last" positive={false} />
      </div>

      <div className="card-grid grid-2 mb-4">
        <div className="card">
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📈 Active Courses</div>
          {COURSES.filter(c => c.progress > 0 && c.progress < 100).map(c => (
            <div key={c.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{c.emoji} {c.title}</span>
                <span style={{ fontSize: 13, color: "var(--cyan)", fontWeight: 700 }}>{c.progress}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${c.progress}%` }} /></div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{c.lessons} lessons • {c.tag}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🔔 Recent Activity</div>
          {[
            { icon: "✅", text: "Completed: React Hooks Deep Dive", time: "2h ago", bg: "rgba(16,185,129,0.15)" },
            { icon: "🤖", text: "AI Tutor session — 12 messages", time: "5h ago", bg: "rgba(37,99,235,0.15)" },
            { icon: "🏆", text: "Quiz passed: Node.js Middleware (92%)", time: "1d ago", bg: "rgba(245,158,11,0.15)" },
            { icon: "📝", text: "Code reviewed: Express REST API", time: "2d ago", bg: "rgba(6,182,212,0.15)" },
          ].map((n, i) => (
            <div key={i} className="notification">
              <div className="notif-icon" style={{ background: n.bg }}>{n.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{n.text}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-4">
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🎓 Completed Courses</div>
        <div className="card-grid grid-3">
          {COURSES.filter(c => c.progress === 100).map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: "var(--navy3)", border: "1px solid var(--border)" }}>
              <span style={{ fontSize: 28 }}>{c.emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "var(--green)" }}>✓ Certified</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CoursesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const filtered = activeTab === "all" ? COURSES : activeTab === "enrolled" ? COURSES.filter(c => c.progress > 0) : COURSES.filter(c => c.progress === 0);

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Course Catalog</div>
          <div className="section-sub">Learn full stack development with AI-powered courses</div>
        </div>
      </div>
      <div className="tabs">
        {["all", "enrolled", "explore"].map(t => (
          <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="card-grid grid-3">
        {filtered.map(c => (
          <div key={c.id} className="course-card">
            <div className="course-thumb" style={{ background: `linear-gradient(135deg, ${c.color}, var(--navy2))` }}>{c.emoji}</div>
            <div className="course-body">
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <span className="tag tag-blue">{c.tag}</span>
                <span className="tag tag-orange">{c.level}</span>
              </div>
              <div className="course-title">{c.title}</div>
              <div className="course-meta">{c.lessons} lessons • {c.students.toLocaleString()} students</div>
              {c.progress > 0 && c.progress < 100 && (
                <div style={{ marginBottom: 8 }}>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${c.progress}%` }} /></div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{c.progress}% complete</div>
                </div>
              )}
              <div className="course-footer">
                <span className="course-price">{c.progress === 100 ? "✓ Done" : c.price}</span>
                <button className="btn btn-primary btn-sm">
                  {c.progress === 100 ? "Review" : c.progress > 0 ? "Continue" : "Enroll"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ─────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "demo@stackai.dev", password: "demo123" });
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin({ name: form.name || "Alex Johnson", email: form.email, avatar: "AJ" });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, var(--blue), var(--cyan))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "white" }}>S</div>
            <span style={{ fontSize: 24, fontWeight: 800 }}>Stack<span style={{ color: "var(--cyan)" }}>AI</span></span>
          </div>
          <div className="login-title">{mode === "login" ? "Welcome back" : "Start learning today"}</div>
          <div className="login-sub">{mode === "login" ? "Sign in to your account" : "Create your free account"}</div>
        </div>

        <div className="login-card">
          <button className="social-btn">🔵 Continue with Google</button>
          <button className="social-btn">⬛ Continue with GitHub</button>
          <div className="login-divider"><span>or with email</span></div>

          {mode === "signup" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Alex Johnson" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <button className="btn btn-primary w-full" style={{ padding: 13 }} onClick={submit} disabled={loading}>
            {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span className="loading-spinner" /> Signing in…</span> : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text3)" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span style={{ color: "var(--cyan)", cursor: "pointer", fontWeight: 600 }} onClick={() => setMode(mode === "login" ? "signup" : "login")}>
              {mode === "login" ? "Sign up free" : "Sign in"}
            </span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--text3)" }}>
          🔒 Demo: use any email/password or click Sign In
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  if (!user) return (
    <>
      <style>{STYLES}</style>
      <LoginPage onLogin={setUser} />
    </>
  );

  const NAV_ITEMS = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "courses", icon: "📚", label: "Courses" },
    { id: "tutor", icon: "🤖", label: "AI Tutor" },
    { id: "review", icon: "🔍", label: "Code Review" },
    { id: "projects", icon: "✨", label: "AI Projects" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo" onClick={() => setPage("dashboard")}>
            <div className="nav-logo-icon">S</div>
            <div className="nav-logo-text">Stack<span>AI</span></div>
          </div>
          <div className="nav-links">
            {NAV_ITEMS.map(n => (
              <button key={n.id} className={`nav-link ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                {n.icon} {n.label}
              </button>
            ))}
          </div>
          <div className="nav-right">
            <div className="avatar" title={user.name}>{user.name[0]}</div>
            <button className="btn btn-outline btn-sm" onClick={() => setUser(null)}>Sign Out</button>
          </div>
        </nav>

        {/* HERO — only on dashboard */}
        {page === "dashboard" && (
          <div className="hero">
            <div className="hero-badge">✦ AI-POWERED LEARNING PLATFORM</div>
            <h1>Master <span>Full Stack</span><br />Development with AI</h1>
            <p>Learn React, Node.js, databases, and AI integration through hands-on projects, an AI tutor, and instant code review.</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => setPage("courses")}>Browse Courses →</button>
              <button className="btn btn-outline" onClick={() => setPage("tutor")}>Try AI Tutor</button>
            </div>
            <div className="hero-stats">
              {[["12K+", "Active Learners"], ["50+", "Courses"], ["94%", "Job Placement"], ["4.9★", "Rating"]].map(([n, l]) => (
                <div className="hero-stat" key={l}><div className="hero-stat-num"><span>{n}</span></div><div className="hero-stat-label">{l}</div></div>
              ))}
            </div>
          </div>
        )}

        {/* LAYOUT */}
        <div className="main">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="sidebar-section">
              <div className="sidebar-label">Main</div>
              {NAV_ITEMS.map(n => (
                <button key={n.id} className={`sidebar-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                  <span className="sidebar-icon">{n.icon}</span> {n.label}
                </button>
              ))}
            </div>
            <div className="sidebar-section">
              <div className="sidebar-label">Progress</div>
              {COURSES.filter(c => c.progress > 0 && c.progress < 100).map(c => (
                <div key={c.id} style={{ padding: "8px 10px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{c.emoji} {c.title}</div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${c.progress}%` }} /></div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{c.progress}%</div>
                </div>
              ))}
            </div>
            <div className="sidebar-section">
              <div className="sidebar-label">Account</div>
              <div style={{ padding: "12px 10px", display: "flex", alignItems: "center", gap: 10 }}>
                <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{user.name[0]}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{user.name}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>Pro Member</div>
                </div>
              </div>
            </div>
          </aside>

          {/* CONTENT */}
          <main className="content">
            {page === "dashboard" && <Dashboard user={user} />}
            {page === "courses" && <CoursesPage />}
            {page === "tutor" && (
              <div>
                <div className="section-header">
                  <div>
                    <div className="section-title">🤖 AI Tutor</div>
                    <div className="section-sub">Your personal full stack development mentor, available 24/7</div>
                  </div>
                </div>
                <ChatPanel user={user} />
              </div>
            )}
            {page === "review" && (
              <div>
                <div className="section-header">
                  <div>
                    <div className="section-title">🔍 AI Code Review</div>
                    <div className="section-sub">Paste your code for instant AI-powered feedback</div>
                  </div>
                </div>
                <CodeReviewer />
              </div>
            )}
            {page === "projects" && (
              <div>
                <div className="section-header">
                  <div>
                    <div className="section-title">✨ AI Project Generator</div>
                    <div className="section-sub">Generate portfolio-ready project ideas tailored to you</div>
                  </div>
                </div>
                <ProjectGenerator />
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
