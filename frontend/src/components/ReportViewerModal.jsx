import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Download, FileText, ExternalLink, Loader2 } from 'lucide-react';
import { getDownloadUrl, downloadReportFile } from '../api';

export default function ReportViewerModal({ report, onClose }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isPdf = report.format === 'pdf' || report.filename.endsWith('.pdf');
  const downloadUrl = getDownloadUrl(report.filename);

  useEffect(() => {
    if (!isPdf && report.filename) {
      setLoading(true);
      setError(null);
      fetch(downloadUrl)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load report content');
          return res.text();
        })
        .then((text) => setContent(text))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [report.filename, isPdf, downloadUrl]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <FileText size={20} style={{ color: isPdf ? '#ef4444' : '#38bdf8' }} />
            <span>{report.filename}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              ({report.size_kb} KB)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => downloadReportFile(report.filename)}
              className="utility-btn"
              title={`Download ${report.filename}`}
            >
              <Download size={14} />
              <span>Download</span>
            </button>
            <button className="icon-action-btn" onClick={onClose} title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {isPdf ? (
            <div style={{ height: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <p style={{ color: 'var(--text-secondary)' }}>
                PDF Preview is best viewed in full browser viewer or downloaded.
              </p>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="new-chat-btn"
                style={{ width: 'auto', padding: '10px 20px' }}
              >
                <ExternalLink size={16} />
                <span>Open PDF in New Tab</span>
              </a>
            </div>
          ) : loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="spinner-orb" style={{ margin: '0 auto 12px auto' }} />
              Reading report...
            </div>
          ) : error ? (
            <div style={{ padding: '24px', color: 'var(--accent-rose)' }}>
              {error}
            </div>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
