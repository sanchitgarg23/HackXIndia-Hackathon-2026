"use client";
import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, ArrowUpCircle, ArrowDownCircle, Send } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

const ActionPanel = ({ patient }) => {
  const [urgency, setUrgency] = useState(patient.priority);
  const [disposition, setDisposition] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispositions = [
    { id: 'close', label: 'Treat & Close', icon: <CheckCircle size={18} /> },
    { id: 'appt', label: 'Schedule Appointment', icon: <CheckCircle size={18} /> },
    { id: 'refer', label: 'Refer to Hospital', icon: <CheckCircle size={18} /> },
    { id: 'emerge', label: 'Emergency Escalation', icon: <ShieldAlert size={18} /> },
  ];

  const handleSubmit = () => {
    if (!disposition) return;
    setIsModalOpen(true);
  };

  return (
    <div className="action-panel card review-card">
      <div className="review-section-title">
        <ShieldAlert size={14} />
        Doctor Action Panel
      </div>
      
      {/* ... previous content ... */}

      <div className="urgency-control-section">
        <label className="section-label">Current Urgency: <span className={`urgency-text ${urgency.toLowerCase()}`}>{urgency}</span></label>
        <div className="urgency-btn-group">
          <button 
            className={`urgency-btn ${urgency === 'HIGH' ? 'active high' : ''}`}
            onClick={() => setUrgency('HIGH')}
          >
            <ArrowUpCircle size={16} />
            Upgrade
          </button>
          <button 
            className={`urgency-btn ${urgency === 'MODERATE' ? 'active' : ''}`}
            onClick={() => setUrgency('MODERATE')}
          >
            <CheckCircle size={16} />
            Confirm
          </button>
          <button 
            className="urgency-btn"
            onClick={() => setUrgency('LOW')}
          >
            <ArrowDownCircle size={16} />
            Downgrade
          </button>
        </div>
      </div>

      <div className="disposition-section">
        <label className="section-label">Clinical Disposition</label>
        <div className="action-radio-group">
          {dispositions.map((item) => (
            <div 
              key={item.id} 
              className={`action-radio-item ${disposition === item.id ? 'selected' : ''}`}
              onClick={() => setDisposition(item.id)}
            >
              <div className={`radio-indicator ${disposition === item.id ? 'selected' : ''}`} />
              <span className="radio-label">{item.label}</span>
              <div className="radio-icon">{item.icon}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="notes-section">
        <label className="section-label">Decision Notes (Optional)</label>
        <textarea className="notes-area" placeholder="Add clinical notes or reasoning..."></textarea>
      </div>

      <button 
        className="btn-primary submit-btn"
        onClick={handleSubmit}
      >
        <Send size={18} />
        Submit Decision
      </button>

      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={patient}
        disposition={disposition}
        urgency={urgency}
      />

      <style jsx>{`
        .urgency-control-section {
          margin-bottom: 32px;
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

        .urgency-text {
          font-weight: 800;
        }

        .urgency-text.high { color: var(--priority-high); }
        .urgency-text.moderate { color: var(--priority-moderate); }

        .urgency-btn-group {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }

        .urgency-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 10px 4px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .urgency-btn:hover {
          background: #F8FAFC;
        }

        .urgency-btn.active {
          background: #EFF6FF;
          border-color: var(--primary);
          color: var(--primary);
        }

        .urgency-btn.active.high {
          background: #FEF2F2;
          border-color: var(--priority-high);
          color: var(--priority-high);
        }

        .disposition-section {
          margin-bottom: 32px;
        }

        .radio-indicator {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid var(--border-color);
          position: relative;
        }

        .radio-indicator.selected {
          border-color: var(--primary);
        }

        .radio-indicator.selected::after {
          content: '';
          position: absolute;
          inset: 3px;
          background: var(--primary);
          border-radius: 50%;
        }

        .radio-label {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .radio-icon {
          color: var(--text-muted);
        }

        .action-radio-item.selected .radio-icon {
          color: var(--primary);
        }

        .notes-section {
          margin-bottom: 32px;
        }

        .submit-btn {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          height: 48px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default ActionPanel;
