"use client";
import React from 'react';
import { User, Globe, ShieldCheck, Heart, Wind, Activity } from 'lucide-react';

const PatientContext = ({ patient }) => {
  return (
    <div className="patient-context-card card review-card">
      <div className="review-section-title">
        <User size={14} />
        Patient Context
      </div>

      <div className="patient-profile-brief">
        <div className="profile-large-avatar">
          {patient.name.charAt(0)}
        </div>
        <div className="profile-details">
          <h2 className="patient-name-large">{patient.name}</h2>
          <p className="patient-meta-large">{patient.age} years · {patient.gender}</p>
        </div>
      </div>

      <div className="context-list">
        <div className="context-item">
          <Globe size={16} />
          <div className="context-info">
            <label>Language</label>
            <span>{patient.language === 'EN' ? 'English' : 'Spanish'}</span>
          </div>
        </div>

        <div className="context-item">
          <ShieldCheck size={16} />
          <div className="context-info">
            <label>Source</label>
            <span>{patient.source}</span>
          </div>
        </div>
      </div>

      <div className="risk-icons-section">
        <label className="section-label">Risk Categories</label>
        <div className="risk-icons-grid">
          <div className="risk-icon active" title="Cardiac Risk">
            <Heart size={20} />
          </div>
          <div className="risk-icon active" title="Respiratory Risk">
            <Wind size={20} />
          </div>
          <div className="risk-icon" title="Neurological Risk">
            <Activity size={20} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .patient-profile-brief {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .profile-large-avatar {
          width: 56px;
          height: 56px;
          background: #EEF2FF;
          color: var(--primary);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
        }

        .patient-name-large {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .patient-meta-large {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .context-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 32px;
        }

        .context-item {
          display: flex;
          gap: 12px;
          color: var(--text-secondary);
        }

        .context-info {
          display: flex;
          flex-direction: column;
        }

        .context-info label {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }

        .context-info span {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .section-label {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 7400;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 12px;
        }

        .risk-icons-grid {
          display: flex;
          gap: 12px;
        }

        .risk-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.2s;
        }

        .risk-icon.active {
          background: #FEF2F2;
          border-color: #FEE2E2;
          color: var(--priority-high);
        }
      `}</style>
    </div>
  );
};

export default PatientContext;
