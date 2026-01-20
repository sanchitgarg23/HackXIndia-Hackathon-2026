"use client";
import React from 'react';
import { User, Globe, Heart, Wind, Activity, ShieldCheck } from 'lucide-react';

const ProfileHeader = ({ patient }) => {
  return (
    <div className="profile-header-card card">
      <div className="profile-hero">
        <div className="profile-avatar-large">
          {patient.name.charAt(0)}
        </div>
        <div className="profile-main-info">
          <div className="name-row">
            <h1 className="profile-name-text">{patient.name}</h1>
            <span className="id-badge">ID: #PX-{patient.id}092</span>
          </div>
          <p className="profile-sub-text">
            {patient.age} years old · {patient.gender} · {patient.language === 'EN' ? 'English' : 'Spanish'} Speaker
          </p>
        </div>
        
        <div className="profile-risk-summary">
          <label className="section-label">Clinical Risk Profile</label>
          <div className="risk-badge-group">
            <div className="risk-item active-cardiac">
              <Heart size={18} />
              <span>Cardiac</span>
            </div>
            <div className="risk-item active-respiratory">
              <Wind size={18} />
              <span>Respiratory</span>
            </div>
            <div className="risk-item">
              <Activity size={18} />
              <span>Neurological</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-header-card {
          padding: 32px;
          margin-bottom: 24px;
          border-radius: 20px;
        }

        .profile-hero {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .profile-avatar-large {
          width: 80px;
          height: 80px;
          background: #EFF6FF;
          color: var(--primary);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          border: 1px solid #DBEAFE;
        }

        .profile-main-info {
          flex: 1;
        }

        .name-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 8px;
        }

        .profile-name-text {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }

        .id-badge {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          background: #F1F5F9;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .profile-sub-text {
          font-size: 16px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .section-label {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 1px;
          display: block;
          margin-bottom: 12px;
        }

        .risk-badge-group {
          display: flex;
          gap: 12px;
        }

        .risk-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
        }

        .risk-item.active-cardiac {
          background: #FEF2F2;
          border-color: #FEE2E2;
          color: var(--priority-high);
        }

        .risk-item.active-respiratory {
          background: #EFF6FF;
          border-color: #DBEAFE;
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default ProfileHeader;
