/**
 * Session persistence layer using localStorage.
 *
 * Each session is stored as:
 * {
 *   id:        string   — unique identifier (matches FastAPI session_id or a generated UUID)
 *   title:     string   — derived from the first user message
 *   messages:  array    — full chat message history [{role, content, downloads?}]
 *   createdAt: string   — ISO timestamp of first message
 *   updatedAt: string   — ISO timestamp of latest activity
 * }
 */

const STORAGE_KEY = 'research_ai_sessions';

/** Read all sessions from localStorage, newest first. */
export function loadAllSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const sessions = JSON.parse(raw);
    // Sort newest first
    return sessions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  } catch {
    return [];
  }
}

/** Persist a single session (insert or update). */
export function saveSession(session) {
  const all = loadAllSessions();
  const idx = all.findIndex((s) => s.id === session.id);
  const now = new Date().toISOString();

  const record = {
    ...session,
    updatedAt: now,
    createdAt: session.createdAt || now,
  };

  if (idx >= 0) {
    all[idx] = record;
  } else {
    all.unshift(record);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return record;
}

/** Delete a session by id. */
export function deleteSession(id) {
  const all = loadAllSessions();
  const filtered = all.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/** Delete all sessions. */
export function clearAllSessions() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Derive a human-readable title from the first user message. */
export function deriveTitle(message) {
  if (!message) return 'Untitled Session';
  // Take the first 55 characters, trim at word boundary
  const trimmed = message.length > 55 ? message.slice(0, 55).replace(/\s+\S*$/, '') + '…' : message;
  return trimmed;
}

/** Generate a short client-side ID. */
export function generateLocalId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
