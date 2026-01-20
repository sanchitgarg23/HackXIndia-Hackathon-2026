"use client";
import React from 'react';
import { ClipboardList, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

const ClinicalSummary = ({ patient }) => {
  return (
    <div className="clinical-summary-column">
      <div className="card review-card summary-card">
        <div className="review-section-title">
          <ClipboardList size={14} />
          Clinical Summary
        </div>
        
        <div className="primary-problem">
          <p className="problem-text">{patient.narrative}</p>
        </div>

        <div className="red-flags-section">
          <label className="section-label">Red Flags</label>
          <div className="red-flags-tags">
            {patient.redFlags.map((flag, idx) => (
              <span key={idx} className="flag-tag">
                <AlertTriangle size={14} />
                {flag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="card review-card timeline-card">
        <div className="review-section-title">
          <Clock size={14} />
          Symptom Timeline
        </div>
        
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-time">2 days ago</div>
            <div className="timeline-content">Onset of chest pain, described as pressure-like sensation.</div>
          </div>
          <div className="timeline-item">
            <div className="timeline-time">12 hours ago</div>
            <div className="timeline-content">Pain started radiating to left shoulder and neck region.</div>
          </div>
          <div className="timeline-item">
            <div className="timeline-time">2 hours ago</div>
            <div className="timeline-content">Noted increasing shortness of breath while at rest.</div>
          </div>
        </div>
      </div>

      <div className="card review-card ai-brief-card">
        <div className="review-section-title">
          <ShieldCheck size={14} />
          AI Clinical Brief
        </div>
        
        <ul className="ai-brief-list">
          <li>Symptoms suggest potential acute cardiac distress.</li>
          <li>Radiating pain and dyspnea are significant risk markers.</li>
          <li>Early intervention recommended based on severity score.</li>
        </ul>

        <div className="ai-metrics-row">
          <div className="ai-metric">
            <label>AI Confidence</label>
            <span>{patient.metrics.aiConfidence}%</span>
          </div>
          <div className="ai-metric">
            <label>Urgency Score</label>
            <span className="urgency-score">{patient.metrics.urgencyScore}/100</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .clinical-summary-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .problem-text {
          font-size: 18px;
          font-weight: 500;
          line-height: 1.6;
          color: var(--text-primary);
          margin-bottom: 24px;
        }

        .section-label {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 12px;
        }

        .red-flags-tags {
          display: flex;
          gap: 12px;
        }

        .flag-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FEF2F2;
          color: var(--priority-high);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid #FEE2E2;
        }

        .ai-brief-list {
          padding-left: 20px;
          margin-bottom: 24px;
        }

        .ai-brief-list li {
          font-size: 14px;
          color: var(--text-primary);
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .ai-metrics-row {
          display: flex;
          gap: 32px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }

        .ai-metric {
          display: flex;
          flex-direction: column;
        }

        .ai-metric label {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .ai-metric span {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .ai-metric .urgency-score {
          color: var(--priority-high);
        }
      `}</style>
    </div>
  );
};

export default ClinicalSummary;
