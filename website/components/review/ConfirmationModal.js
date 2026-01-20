"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Check, X, ShieldAlert, Calendar, Hospital } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, patient, disposition, urgency }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const getDispositionLabel = (id) => {
    switch(id) {
      case 'appt': return 'Schedule Appointment';
      case 'refer': return 'Refer to Hospital';
      case 'emerge': return 'Emergency Escalation';
      default: return '';
    }
  };

  const getDepartment = () => {
    if (disposition === 'appt') return 'Cardiology Outpatient';
    if (disposition === 'refer') return 'Acute Care / Referral Unit';
    if (disposition === 'emerge') return 'Emergency Department (ED)';
    return 'General Medicine';
  };

  const getTimeWindow = () => {
    if (disposition === 'emerge') return 'IMMEDIATE';
    if (disposition === 'refer') return 'Within 4-6 Hours';
    return 'Next 24-48 Hours';
  };

  const handleConfirm = () => {
    setIsSuccess(true);
    // Removed automatic close - now persistent until user navigates
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {!isSuccess ? (
          <>
            <div className="modal-header-row">
              <h2 className="modal-title">Confirm Disposition</h2>
              <button className="close-btn" onClick={onClose}><X size={20} /></button>
            </div>
            <p className="modal-subtitle">Verify the clinical escalation path for this patient case.</p>
            
            <div className="confirmation-details">
              <div className="conf-row">
                <span className="conf-label">Patient</span>
                <span className="conf-value">{patient.name}</span>
              </div>
              <div className="conf-row">
                <span className="conf-label">Disposition</span>
                <span className="conf-value">{getDispositionLabel(disposition)}</span>
              </div>
              <div className="conf-row">
                <span className="conf-label">Department</span>
                <span className="conf-value">{getDepartment()}</span>
              </div>
              <div className="conf-row">
                <span className="conf-label">Urgency</span>
                <span className={`conf-value ${urgency === 'HIGH' ? 'urgency-high' : ''}`}>{urgency}</span>
              </div>
              <div className="conf-row">
                <span className="conf-label">Time Window</span>
                <span className="conf-value">{getTimeWindow()}</span>
              </div>
            </div>

            <button className="btn-primary confirm-btn-large" onClick={handleConfirm}>
              Confirm & Submit Decision
            </button>
          </>
        ) : (
          <div className="success-container">
            <div className="success-icon-wrapper">
              <Check size={32} />
            </div>
            <h2 className="modal-title">Case {disposition === 'close' ? 'Resolved' : 'Escalated'}</h2>
            <p className="modal-subtitle">The decision has been logged and the clinical workflow is now updated.</p>
            
            <div className="closure-summary card">
              <div className="summary-line">
                <strong>Action:</strong> {getDispositionLabel(disposition)}
              </div>
              <div className="summary-line">
                <strong>Dest:</strong> {getDepartment()}
              </div>
              <div className="summary-line">
                <strong>Priority:</strong> {urgency}
              </div>
            </div>

            <div className="next-actions">
              <Link href="/" className="btn-primary next-btn">
                Return to Inbox
              </Link>
              <Link href={`/patient/${patient.id}`} className="btn-outline next-btn">
                View Patient Profile
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .close-btn {
          color: var(--text-muted);
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .confirm-btn-large {
          width: 100%;
          height: 52px;
          font-size: 16px;
          font-weight: 700;
          border-radius: 12px;
        }

        .closure-summary {
          width: 100%;
          background: #F8FAFC;
          padding: 16px;
          border-radius: 12px;
          margin: 24px 0;
          text-align: left;
        }

        .summary-line {
          font-size: 13px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .summary-line:last-child {
          margin-bottom: 0;
        }

        .next-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .next-btn {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
