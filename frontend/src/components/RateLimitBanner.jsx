import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Clock, RefreshCw, X, Zap, Timer } from 'lucide-react';

/**
 * Formats remaining seconds into a human-readable string.
 * Examples: "45s", "2m 15s", "1h 30m", "23h 59m"
 */
function formatCountdown(totalSeconds) {
  if (totalSeconds <= 0) return 'Ready!';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/**
 * Returns the icon and label for each limit type.
 */
function getLimitMeta(limitType) {
  switch (limitType) {
    case 'tokens_per_minute':
      return { icon: Zap, label: 'Token limit (per minute)' };
    case 'requests_per_minute':
      return { icon: Timer, label: 'Request limit (per minute)' };
    case 'requests_per_hour':
      return { icon: Clock, label: 'Request limit (per hour)' };
    case 'requests_per_day':
      return { icon: Clock, label: 'Daily request limit' };
    default:
      return { icon: AlertTriangle, label: 'API rate limit' };
  }
}

/**
 * RateLimitBanner — an animated banner shown when an API rate limit is hit.
 *
 * Props:
 *  - rateLimitInfo: { retryAfter: number, limitType: string, limitLabel: string, serverMessage: string }
 *  - onDismiss: () => void  — clear the banner
 *  - onRetry:  () => void  — retry the last request
 */
export default function RateLimitBanner({ rateLimitInfo, onDismiss, onRetry }) {
  const { retryAfter, limitType } = rateLimitInfo;

  const [remaining, setRemaining] = useState(retryAfter);
  const [isReady, setIsReady] = useState(false);

  // Tick the countdown every second
  useEffect(() => {
    setRemaining(retryAfter);
    setIsReady(false);

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [retryAfter]);

  const progress = retryAfter > 0 ? ((retryAfter - remaining) / retryAfter) * 100 : 100;

  const { icon: LimitIcon, label: limitLabel } = getLimitMeta(limitType);

  const handleRetry = useCallback(() => {
    if (onRetry) onRetry();
    if (onDismiss) onDismiss();
  }, [onRetry, onDismiss]);

  return (
    <div className="rate-limit-banner" role="alert" aria-live="assertive">
      {/* Progress bar filling from left to right */}
      <div className="rlb-progress-track">
        <div
          className="rlb-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="rlb-content">
        {/* Left section — icon + text */}
        <div className="rlb-info">
          <div className="rlb-icon-box">
            <AlertTriangle size={20} />
          </div>

          <div className="rlb-text">
            <span className="rlb-title">Rate Limit Reached</span>
            <span className="rlb-detail">
              <LimitIcon size={13} />
              {limitLabel} — {isReady ? 'limit has been refreshed' : 'limit will refresh in'}
            </span>
          </div>
        </div>

        {/* Center — countdown */}
        <div className={`rlb-countdown ${isReady ? 'ready' : ''}`}>
          <Clock size={16} className={isReady ? '' : 'rlb-clock-pulse'} />
          <span className="rlb-time">{formatCountdown(remaining)}</span>
        </div>

        {/* Right — actions */}
        <div className="rlb-actions">
          {isReady && onRetry && (
            <button className="rlb-retry-btn" onClick={handleRetry}>
              <RefreshCw size={14} />
              <span>Retry Now</span>
            </button>
          )}
          <button
            className="rlb-dismiss-btn"
            onClick={onDismiss}
            title="Dismiss"
            aria-label="Dismiss rate limit notice"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
