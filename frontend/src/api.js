const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Send a chat/research query to the FastAPI backend.
 * @param {string} message - The user prompt or research request
 * @param {string|null} sessionId - Optional session ID to continue a thread
 */
export async function sendChatMessage(message, sessionId = null) {
  const payload = { message };
  if (sessionId) {
    payload.session_id = sessionId;
  }

  const response = await fetch(`${API_BASE}/chat/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let errorDetail = 'Research request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || JSON.stringify(errJson);
    } catch {
      errorDetail = `Server returned status ${response.status} (${response.statusText})`;
    }
    throw new Error(errorDetail);
  }

  return await response.json();
}

/**
 * Fetch list of generated reports from backend
 */
export async function fetchReports() {
  const response = await fetch(`${API_BASE}/reports/`);
  if (!response.ok) {
    throw new Error('Failed to fetch reports list');
  }
  const data = await response.json();
  return data.reports || [];
}

/**
 * Generate download URL for a report file
 * @param {string} filename 
 */
export function getDownloadUrl(filename) {
  const cleanName = filename ? filename.replace(/^.*[\\\/]/, '').trim() : '';
  return `${API_BASE}/download/${encodeURIComponent(cleanName)}`;
}

/**
 * Download any report file directly using the backend's Content-Disposition attachment header.
 * Ensures the file is saved with its real name and extension (e.g. .pdf or .md) instead of a blob UUID.
 * @param {string} filename 
 */
export function downloadReportFile(filename) {
  if (!filename) return;
  const cleanName = filename.replace(/^.*[\\\/]/, '').trim();
  const url = getDownloadUrl(cleanName);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', cleanName);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Check backend connection status
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/`, { method: 'GET', signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
