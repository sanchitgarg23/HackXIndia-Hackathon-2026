"use client";
import React from 'react';
import { X, Download, FileText, ExternalLink } from 'lucide-react';

const ReportViewer = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className="report-viewer-overlay" onClick={onClose}>
      <div className="report-viewer-content" onClick={e => e.stopPropagation()}>
        <div className="viewer-header">
          <div className="report-meta">
            <h2 className="report-title">{report.title}</h2>
            <p className="report-subtitle">{report.type} • Uploaded on {report.date}</p>
          </div>
          <div className="viewer-actions">
            <button className="action-btn download">
              <Download size={18} />
              <span>Download</span>
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="viewer-body">
          {report.title.toLowerCase().includes('ecg') ? (
            <div className="image-preview">
              <img src="/reports/ecg.png" alt="ECG Report" />
            </div>
          ) : report.title.toLowerCase().includes('lab') || report.title.toLowerCase().includes('blood') ? (
            <div className="image-preview">
              <img src="/reports/blood.png" alt="Blood Test" />
            </div>
          ) : report.title.toLowerCase().includes('mri') || report.title.toLowerCase().includes('scan') ? (
            <div className="image-preview">
              <img src="/reports/mri.png" alt="MRI Scan" />
            </div>
          ) : report.fileType === 'pdf' ? (
            <div className="pdf-placeholder">
              <FileText size={64} />
              <h3>PDF Report Preview</h3>
              <p>In a production environment, the PDF content for <strong>{report.title}</strong> would be rendered here using a library like PDF.js or an object embed.</p>
              <button className="open-external-btn">
                <span>Open in New Tab</span>
                <ExternalLink size={16} />
              </button>
            </div>
          ) : (
            <div className="image-preview">
              <img 
                src={`https://placehold.co/800x1100/F8FAFC/2563EB?text=${encodeURIComponent(report.title)}%0A(Image+Scan+Placeholder)`} 
                alt={report.title} 
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .report-viewer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          animation: fadeIn 0.2s ease-out;
        }

        .report-viewer-content {
          background: white;
          width: 100%;
          max-width: 900px;
          height: 100%;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .viewer-header {
          padding: 20px 32px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
        }

        .report-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .report-subtitle {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .viewer-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.download {
          background: var(--primary);
          color: white;
        }

        .close-btn {
          color: var(--text-muted);
          padding: 8px;
          border-radius: 50%;
        }

        .close-btn:hover {
          background: #F1F5F9;
          color: var(--text-primary);
        }

        .viewer-body {
          flex: 1;
          background: #F1F5F9;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          padding: 40px;
        }

        .pdf-placeholder {
          background: white;
          width: 100%;
          max-width: 700px;
          padding: 80px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          color: var(--text-muted);
          gap: 16px;
        }

        .pdf-placeholder h3 {
          color: var(--text-primary);
          font-size: 20px;
          margin-top: 8px;
        }

        .open-external-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid var(--border-color);
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          color: var(--text-primary);
          margin-top: 12px;
        }

        .image-preview img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default ReportViewer;
