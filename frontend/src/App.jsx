import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send,
  Sparkles,
  Terminal,
  Compass,
  Cpu,
  Database,
  Layers,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ReportViewerModal from './components/ReportViewerModal';
import { sendChatMessage, checkBackendHealth } from './api';
import {
  loadAllSessions,
  saveSession,
  deleteSession,
  clearAllSessions,
  deriveTitle,
  generateLocalId,
} from './sessionStore';

const STARTER_PROMPTS = [
  {
    icon: Database,
    title: 'Vector Databases vs Relational DBs',
    desc: 'Research key differences, indexing strategies (HNSW/IVF), and performance tradeoffs. Save as MD.',
    prompt:
      'Research Vector Databases vs Traditional Relational DBs for AI applications, compare their indexing techniques, and save only in Markdown format.',
  },
  {
    icon: Cpu,
    title: 'Modern LLM Attention Mechanisms',
    desc: 'Analyze Multi-Head, Flash Attention, and Grouped-Query Attention with complexity breakdown.',
    prompt:
      'Research modern LLM attention mechanisms including Multi-Head Attention, FlashAttention, and Grouped-Query Attention. Provide mathematical insights and save report.',
  },
  {
    icon: Layers,
    title: 'Data Structures for Fast Search',
    desc: 'Deep dive into Tries, B-Trees, and LSM trees used in large-scale search engines.',
    prompt:
      'Research high-performance Data Structures used in modern search engines (Tries, B+ Trees, LSM Trees) and generate a detailed report saved in Markdown.',
  },
  {
    icon: Compass,
    title: 'Agentic RAG Architectures',
    desc: 'Investigate Routing, Self-Correction, and Tool Calling patterns in LangChain / LangGraph.',
    prompt:
      'Research Agentic RAG patterns: routing, self-correction, iterative retrieval, and tool invocation. Generate a structured report.',
  },
];

export default function App() {
  // ─── Session & message state ───
  const [sessions, setSessions] = useState(() => loadAllSessions());
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null); // FastAPI thread_id

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [previewReport, setPreviewReport] = useState(null);
  const [errorNotice, setErrorNotice] = useState(null);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // ─── Helpers ───
  const refreshSessions = useCallback(() => {
    setSessions(loadAllSessions());
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Health-check polling
  useEffect(() => {
    const check = async () => setIsOnline(await checkBackendHealth());
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  // ─── Persist current session whenever messages change ───
  useEffect(() => {
    if (!activeSessionId || messages.length === 0) return;

    const firstUserMsg = messages.find((m) => m.role === 'user');
    const title = deriveTitle(firstUserMsg?.content);

    saveSession({
      id: activeSessionId,
      title,
      messages,
      sessionId, // FastAPI thread_id for follow-ups
    });
    refreshSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // ─── Session actions ───
  const handleNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setActiveSessionId(null);
    setErrorNotice(null);
    setInput('');
  };

  const handleSelectSession = (id) => {
    const session = sessions.find((s) => s.id === id);
    if (!session) return;
    setActiveSessionId(session.id);
    setMessages(session.messages || []);
    setSessionId(session.sessionId || null);
    setErrorNotice(null);
    setInput('');
  };

  const handleDeleteSession = (id) => {
    deleteSession(id);
    refreshSessions();
    if (id === activeSessionId) {
      handleNewChat();
    }
  };

  const handleClearAllSessions = () => {
    clearAllSessions();
    refreshSessions();
    handleNewChat();
  };

  // ─── Send message ───
  const handleSend = async (messageText = null) => {
    const textToSend = (typeof messageText === 'string' ? messageText : input).trim();
    if (!textToSend || isLoading) return;

    setErrorNotice(null);

    // If no active session, create one
    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      currentSessionId = generateLocalId();
      setActiveSessionId(currentSessionId);
    }

    const userMsg = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await sendChatMessage(textToSend, sessionId);

      if (data.session_id) {
        setSessionId(data.session_id);
      }

      const assistantMsg = {
        role: 'assistant',
        content: data.response,
        downloads: data.downloads,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setErrorNotice(err.message || 'Error occurred while contacting research assistant.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─── Render ───
  return (
    <div className="app-container">
      {/* Sidebar with session history */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onClearAllSessions={handleClearAllSessions}
        isOnline={isOnline}
      />

      {/* Main Research Window */}
      <main className="main-content">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="nav-session">
            {sessionId ? (
              <span className="session-badge" title="Active Thread ID">
                <Terminal size={12} /> session: {sessionId}
              </span>
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                New Research Session
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {messages.length > 0 && (
              <button
                className="utility-btn"
                onClick={handleNewChat}
                title="Start a fresh session"
              >
                <RotateCcw size={13} />
                <span>New Chat</span>
              </button>
            )}
          </div>
        </header>

        {/* Chat / Report Stream */}
        <div className="chat-scroll-area">
          {messages.length === 0 ? (
            <div className="welcome-hero">
              <div className="hero-icon-glow">
                <Sparkles size={32} />
              </div>
              <h2 className="hero-title">Where Deep Research Meets Autonomous Agents</h2>
              <p className="hero-subtitle">
                Ask any research question. The agent autonomously navigates sources, synthesizes
                multi-document findings, and formats downloadable PDF and Markdown reports.
              </p>

              <div className="quick-prompts-grid">
                {STARTER_PROMPTS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="quick-prompt-card"
                      onClick={() => handleSend(item.prompt)}
                    >
                      <div className="quick-prompt-title">
                        <Icon size={16} style={{ color: 'var(--accent-cyan)' }} />
                        <span>{item.title}</span>
                      </div>
                      <div className="quick-prompt-desc">{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="chat-thread">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg}
                  onPreviewReport={(r) => setPreviewReport(r)}
                />
              ))}

              {isLoading && (
                <div className="message-row assistant">
                  <div className="message-avatar assistant">
                    <Sparkles size={18} />
                  </div>
                  <div className="message-bubble">
                    <div className="loading-indicator">
                      <div className="spinner-orb" />
                      <span>
                        Deep searching the web, analyzing documents, and generating report...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {errorNotice && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    color: '#fda4af',
                    fontSize: '0.9rem',
                  }}
                >
                  <AlertCircle size={18} />
                  <span>{errorNotice}</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Dock */}
        <div className="input-dock">
          <div className="input-box-wrapper">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder="What research topic would you like to explore? (e.g. 'Research Vector DBs and save in MD')"
              value={input}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />

            <button
              className="send-btn"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              title="Execute Research Query"
              id="btn-send-research"
            >
              <Send size={18} />
            </button>
          </div>

          <div className="input-footer-hint">
            Press{' '}
            <kbd
              style={{
                background: 'rgba(255,255,255,0.08)',
                padding: '2px 5px',
                borderRadius: '4px',
              }}
            >
              Enter
            </kbd>{' '}
            to search &bull; Sessions are saved locally in your browser
          </div>
        </div>
      </main>

      {/* Report Modal Viewer */}
      {previewReport && (
        <ReportViewerModal report={previewReport} onClose={() => setPreviewReport(null)} />
      )}
    </div>
  );
}
