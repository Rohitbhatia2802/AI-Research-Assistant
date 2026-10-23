import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  MessageSquare,
  Trash2,
  Clock,
  Search,
  TrashIcon,
} from 'lucide-react';

export default function Sidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onClearAllSessions,
  isOnline,
}) {
  const [searchFilter, setSearchFilter] = useState('');
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(isoString).toLocaleDateString();
  };

  const messageCount = (session) => {
    const count = session.messages?.length || 0;
    const pairs = Math.floor(count / 2);
    return pairs === 1 ? '1 exchange' : `${pairs} exchanges`;
  };

  return (
    <aside className="sidebar">
      {/* Brand Section */}
      <div className="brand-section">
        <div className="brand-logo">
          <div className="brand-icon-box">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="brand-title">Research AI</h1>
            <span className="brand-tag">Autonomous RAG</span>
          </div>
        </div>
      </div>

      {/* New Research Action */}
      <button
        className="new-chat-btn"
        onClick={onNewChat}
        id="btn-new-research"
      >
        <Plus size={18} />
        <span>New Research Session</span>
      </button>

      {/* Session History Header */}
      <div style={{ marginTop: '6px' }}>
        <div className="sidebar-section-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} /> Sessions ({sessions.length})
          </span>
          {sessions.length > 0 && (
            <button
              className="icon-action-btn"
              onClick={() => {
                if (confirmClearAll) {
                  onClearAllSessions();
                  setConfirmClearAll(false);
                } else {
                  setConfirmClearAll(true);
                  setTimeout(() => setConfirmClearAll(false), 3000);
                }
              }}
              title={confirmClearAll ? 'Click again to confirm' : 'Clear all sessions'}
              style={confirmClearAll ? { color: '#f43f5e' } : {}}
            >
              <TrashIcon size={13} />
            </button>
          )}
        </div>

        {sessions.length > 3 && (
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <Search
              size={13}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 28px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none',
              }}
            />
          </div>
        )}
      </div>

      {/* Sessions List */}
      <div className="reports-container">
        {filteredSessions.length === 0 ? (
          <div
            style={{
              padding: '24px 12px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
            }}
          >
            {searchFilter
              ? 'No matching sessions found.'
              : 'No sessions yet. Start a new research session!'}
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                className={`report-item ${isActive ? 'session-active' : ''}`}
                onClick={() => onSelectSession(session.id)}
                title="Click to restore this session"
              >
                <div className="report-meta" style={{ maxWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare
                      size={14}
                      style={{
                        flexShrink: 0,
                        color: isActive ? '#a5b4fc' : 'var(--text-muted)',
                      }}
                    />
                    <span className="report-name">{session.title}</span>
                  </div>
                  <div className="report-sub">
                    <span>{messageCount(session)}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(session.updatedAt)}</span>
                  </div>
                </div>

                <div
                  className="report-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="icon-action-btn session-delete-btn"
                    onClick={() => onDeleteSession(session.id)}
                    title="Delete this session"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Server Connection */}
      <div className="sidebar-footer">
        <div className="status-pill">
          <div className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
          <span>{isOnline ? 'FastAPI Connected' : 'Server Offline'}</span>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>:8000</span>
      </div>
    </aside>
  );
}
