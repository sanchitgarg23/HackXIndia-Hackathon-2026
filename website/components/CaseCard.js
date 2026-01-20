"use client";
import React from 'react';
import Link from 'next/link';
import { Heart, Wind, AlertTriangle, ShieldCheck, Clock, Calendar, Edit3, ArrowDown } from 'lucide-react';

const CaseCard = ({ patientCase }) => {
  const isHighPriority = patientCase.priority === "HIGH";
  const isResolved = patientCase.status === "RESOLVED";

  const getStatusClass = (status) => {
    switch(status) {
      case 'NEW': return 'new';
      case 'UNDER REVIEW': return 'under-review';
      case 'ESCALATED': return 'escalated';
      case 'RESOLVED': return 'resolved';
      default: return '';
    }
  };

  return (
    <div className={`case-card card ${isHighPriority ? 'high-priority' : 'moderate-priority'} ${isResolved ? 'resolved' : ''}`}>
      <div className="card-header">
        <div className="case-meta">
          <span className={`badge ${isHighPriority ? 'badge-high' : 'badge-moderate'}`}>
            <AlertTriangle size={12} style={{ marginRight: 4 }} />
            Priority: {patientCase.priority}
          </span>
          <span className="source-tag">
            <ShieldCheck size={12} style={{ marginRight: 4 }} />
            {patientCase.source}
          </span>
        </div>
        {patientCase.status && (
          <span className={`status-badge ${getStatusClass(patientCase.status)}`}>
            {patientCase.status}
          </span>
        )}
      </div>

      <div className="card-body">
        <div className="patient-info-section">
          <div className="patient-main">
            <h2 className="patient-name">{patientCase.name}</h2>
            <div className="patient-stats">
              <span className="stat-pill">{patientCase.age} · {patientCase.gender}</span>
              <span className="stat-pill"><Heart size={14} color="#EF4444" fill="#EF4444" /></span>
              <span className="stat-pill"><Wind size={14} color="#3B82F6" /></span>
              <span className="stat-pill lang">{patientCase.language}</span>
            </div>
          </div>
          
          <div className="action-buttons">
            <Link href={`/review/${patientCase.id}`} className="btn-primary" style={{ textAlign: 'center', lineHeight: '2.5' }}>
              Review Case
            </Link>
            <Link href={`/patient/${patientCase.id}`} className="btn-outline" style={{ textAlign: 'center', lineHeight: '2.5' }}>
              View Patient
            </Link>
          </div>
        </div>

        <p className="case-narrative">{patientCase.narrative}</p>

        <div className="red-flags">
          <span className="red-flags-label">Red Flags:</span>
          {patientCase.redFlags.map((flag, idx) => (
            <span key={idx} className="flag-tag">
              <AlertTriangle size={12} />
              {flag}
            </span>
          ))}
        </div>

        <div className="metrics-grid">
          <div className="metric-box">
            <label><ShieldCheck size={12} /> Urgency Score</label>
            <div className="metric-value">
              <span className="score">{patientCase.metrics.urgencyScore}</span>
              <span className="score-total">/100</span>
            </div>
          </div>
          <div className="metric-box">
            <label><ShieldCheck size={12} /> AI Confidence</label>
            <div className="metric-value">
              {patientCase.metrics.aiConfidence}%
            </div>
          </div>
          <div className="metric-box">
            <label><Clock size={12} /> Active Time</label>
            <div className="metric-value">
              {patientCase.metrics.activeTime}
            </div>
          </div>
          <div className="metric-box">
            <label><Calendar size={12} /> Prev. Appt</label>
            <div className="metric-value dimmed">
              {patientCase.metrics.prevAppt}
            </div>
          </div>
        </div>

        <div className="card-footer">
          <button className="footer-action">
            <Edit3 size={14} />
            Reclassify
          </button>
          <button className="footer-action">
            <ArrowDown size={14} />
            Downgrade
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseCard;
