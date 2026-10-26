const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Custom error class for rate-limit responses.
 * Contains structured data the UI can use to show countdowns and context.
 */
export class RateLimitError extends Error {
  constructor({ retryAfter, limitType, serverMessage }) {
    const friendlyLimit = {
      tokens_per_minute: 'Token limit per minute',
      requests_per_minute: 'Request limit per minute',
      requests_per_hour: 'Request limit per hour',
      requests_per_day: 'Daily request limit',
      unknown: 'API rate limit',
    };

    const label = friendlyLimit[limitType] || friendlyLimit.unknown;
    super(`${label} reached`);

    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;       // seconds
    this.limitType = limitType;          // e.g. 'requests_per_minute'
    this.limitLabel = label;
    this.serverMessage = serverMessage;  // raw provider error
  }
}

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
    let errJson = null;
    try {
      errJson = await response.json();
      errorDetail = errJson.detail || JSON.stringify(errJson);
    } catch {
      errorDetail = `Server returned status ${response.status} (${response.statusText})`;
    }

    const detailStr = typeof errorDetail === 'object' ? JSON.stringify(errorDetail) : String(errorDetail);
    const lower = detailStr.toLowerCase();

    const isRateLimit =
      response.status === 429 ||
      lower.includes('rate limit') ||
      lower.includes('rate_limit') ||
      lower.includes('429') ||
      lower.includes('too many requests') ||
      lower.includes('resource_exhausted') ||
      lower.includes('quota') ||
      lower.includes('tokens per minute') ||
      lower.includes('requests per minute') ||
      lower.includes('requests per day');

    if (isRateLimit) {
      let retryAfter = 60;
      let limitType = 'unknown';

      // If backend provided structured detail
      if (errJson && typeof errJson.detail === 'object' && errJson.detail !== null) {
        retryAfter = errJson.detail.retry_after || 60;
        limitType = errJson.detail.limit_type || 'unknown';
      } else {
        // Parse "try again in X[s|m|h]" from provider error strings (e.g. Groq)
        const match = detailStr.match(/(?:try again in|retry[_\- ]?after|please retry after)[:\s]*(\d+\.?\d*)\s*(s|sec|second|seconds|ms|m|min|minute|minutes|h|hour|hours)?/i);
        if (match) {
          const val = parseFloat(match[1]);
          const unit = (match[2] || 's').toLowerCase();
          if (unit === 'ms') {
            retryAfter = Math.max(1, Math.round(val / 1000));
          } else if (unit.startsWith('m') && unit !== 'ms') {
            retryAfter = Math.round(val * 60);
          } else if (unit.startsWith('h')) {
            retryAfter = Math.round(val * 3600);
          } else {
            retryAfter = Math.max(1, Math.round(val));
          }
        }

        if (lower.includes('tokens per minute') || lower.includes('tpm')) {
          limitType = 'tokens_per_minute';
        } else if (lower.includes('requests per minute') || lower.includes('rpm')) {
          limitType = 'requests_per_minute';
        } else if (lower.includes('requests per hour') || lower.includes('rph')) {
          limitType = 'requests_per_hour';
        } else if (lower.includes('requests per day') || lower.includes('rpd') || lower.includes('daily')) {
          limitType = 'requests_per_day';
        }
      }

      throw new RateLimitError({
        retryAfter,
        limitType,
        serverMessage: detailStr,
      });
    }

    throw new Error(detailStr);
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
