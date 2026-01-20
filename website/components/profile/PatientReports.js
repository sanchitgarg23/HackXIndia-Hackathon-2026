"use client";
import React, { useState } from 'react';
import { FileText, Image as ImageIcon, File, Download, Eye, ExternalLink, Shield } from 'lucide-react';
import ReportViewer from './ReportViewer';

const PatientReports = ({ patient }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText size={20} className="file-icon-pdf" />;
      case 'image': return <ImageIcon size={20} className="file-icon-img" />;
      default: return <File size={20} className="file-icon-doc" />;
    }
  };

  const reports = patient.reports || [];

  return (
    <div className="card profile-section-card reports-section">
      <div className="section-header-row">
        <FileText size={18} />
        <h2>Patient Reports</h2>
      </div>

      <div className="reports-list">
        {reports.length > 0 ? (
          <>
            <div className="reports-table-header">
              <span>Report Title</span>
              <span>Type</span>
              <span>Date</span>
              <span>By</span>
              <span className="actions-header">Actions</span>
            </div>
            {reports.map((report) => (
              <div key={report.id} className="report-row">
                <div className="report-title-cell">
                  {getFileIcon(report.fileType)}
                  <span className="report-title-text">{report.title}</span>
                </div>
                <div className="report-type-cell">
                  <span className="type-badge">{report.type}</span>
                </div>
                <div className="report-date-cell">{report.date}</div>
                <div className="report-by-cell">
                  <span className={`by-badge ${report.uploadedBy.toLowerCase()}`}>
                    {report.uploadedBy}
                  </span>
                </div>
                <div className="report-actions-cell">
                  <button className="icon-btn view" title="View Report" onClick={() => setSelectedReport(report)}>
                    <Eye size={16} />
                  </button>
                  <button className="icon-btn download" title="Download">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="empty-reports-state">
            <p>No reports uploaded for this patient.</p>
          </div>
        )}
      </div>

      <div className="compliance-note">
        <Shield size={14} />
        <span>Reports are uploaded by the patient or linked systems and shown for clinical reference.</span>
      </div>

      {selectedReport && (
        <ReportViewer 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}

      <style jsx>{`
        .section-header-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          color: var(--primary);
        }

        .section-header-row h2 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1;
        }

        .profile-section-card {
          padding: 24px;
        }

        .reports-section {
          margin-bottom: 24px;
        }

        .reports-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .reports-table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 100px 100px;
          padding: 12px 16px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          background: #F8FAFC;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .report-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 100px 100px;
          padding: 16px;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          transition: background 0.2s;
        }

        .report-row:hover {
          background: #F8FAFC;
        }

        .report-row:last-child {
          border-bottom: none;
        }

        .report-title-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .report-title-text {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .file-icon-pdf { color: #EF4444; }
        .file-icon-img { color: #8B5CF6; }
        .file-icon-doc { color: #3B82F6; }

        .type-badge {
          font-size: 12px;
          color: var(--text-secondary);
          background: #F1F5F9;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .report-date-cell {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .by-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .by-badge.patient { background: #E0F2FE; color: #0369A1; }
        .by-badge.clinic { background: #F1F5F9; color: var(--text-secondary); }

        .report-actions-cell {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .icon-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: white;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .icon-btn:hover {
          background: #F1F5F9;
          color: var(--primary);
          border-color: var(--primary);
        }

        .actions-header { text-align: right; }

        .empty-reports-state {
          padding: 32px;
          text-align: center;
          color: var(--text-muted);
          font-size: 14px;
          font-style: italic;
          background: #F8FAFC;
          border-radius: 12px;
          border: 1px dashed var(--border-color);
        }

        .compliance-note {
          margin-top: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-muted);
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }
      `}</style>
    </div>
  );
};

export default PatientReports;
