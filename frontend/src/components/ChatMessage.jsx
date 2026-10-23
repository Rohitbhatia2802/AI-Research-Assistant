import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Bot, 
  User, 
  FileText, 
  FileDown, 
  Copy, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { getDownloadUrl, downloadReportFile } from '../api';

export default function ChatMessage({ message, onPreviewReport }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCleanFilename = (path) => {
    if (!path) return '';
    return decodeURIComponent(path.replace(/^\/download\//, ''));
  };

  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && (
        <div className="message-avatar assistant">
          <Bot size={20} />
        </div>
      )}

      <div className="message-bubble">
        {isUser ? (
          <p style={{ margin: 0, fontSize: '0.98rem', whiteSpace: 'pre-wrap' }}>
            {message.content}
          </p>
        ) : (
          <div>
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>

            {/* Action Bar & Report Downloads */}
            <div className="response-action-bar">
              <div className="download-cards-container">
                {message.downloads?.pdf && (
                  <button
                    onClick={() => downloadReportFile(getCleanFilename(message.downloads.pdf))}
                    className="download-btn pdf"
                    title="Download PDF report to your computer"
                  >
                    <FileDown size={16} />
                    <span>Download PDF Report</span>
                  </button>
                )}

                {message.downloads?.markdown && (
                  <button
                    onClick={() => downloadReportFile(getCleanFilename(message.downloads.markdown))}
                    className="download-btn md"
                    title="Download Markdown report to your computer"
                  >
                    <FileText size={16} />
                    <span>Download Markdown</span>
                  </button>
                )}
              </div>

              <div className="utility-actions">
                <button 
                  className="utility-btn" 
                  onClick={handleCopy}
                  title="Copy response markdown"
                >
                  {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="message-avatar user">
          <User size={18} />
        </div>
      )}
    </div>
  );
}
