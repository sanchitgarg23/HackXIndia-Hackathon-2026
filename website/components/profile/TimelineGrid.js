"use client";
import React from 'react';
import { Calendar, Clock, History, Clipboard, ExternalLink } from 'lucide-react';
import EmptyState from '../EmptyState';
import PatientReports from './PatientReports';

const TimelineGrid = ({ patient }) => {
  return (
    <div className="timeline-grid">
      <div className="timeline-col-left">
        {/* Medical History Section */}
        <div className="card profile-section-card">
          <div className="section-header-row">
            <Clipboard size={18} />
            <h2>Medical History</h2>
          </div>
          <div className="history-summary">
            {patient.medicalHistory ? (
              <>
                <p className="history-highlight-text">{patient.medicalHistory}</p>
                <div className="read-only-notice">
                  <span>Read-only summary from EMR sync</span>
                </div>
              </>
            ) : (
              <EmptyState type="cases" title="No medical history" description="No historical medical records available." isProfile={true} />
            )}
          </div>
        </div>

        {/* Patient Reports Section */}
        <PatientReports patient={patient} />

        {/* Case History Section */}
        <div className="card profile-section-card">
          <div className="section-header-row">
            <History size={18} />
            <h2>Previous Cases</h2>
          </div>
          <div className="case-timeline-list">
            {patient.caseHistory && patient.caseHistory.length > 0 ? (
              patient.caseHistory.map((item, idx) => (
                <div key={idx} className="case-history-item">
                  <div className="case-history-meta">
                    <span className="case-date">{item.date}</span>
                    <span className={`urgency-pill ${item.urgency.toLowerCase()}`}>{item.urgency}</span>
                  </div>
                  <p className="case-history-outcome">{item.outcome}</p>
                </div>
              ))
            ) : (
              <EmptyState type="cases" title="No previous cases" description="No prior clinical resolution events." isProfile={true} />
            )}
          </div>
        </div>
      </div>

      <div className="timeline-col-right">
        {/* Appointments Section */}
        <div className="card profile-section-card appointments-card">
          <div className="section-header-row">
            <Calendar size={18} />
            <h2>Patient Appointments</h2>
          </div>

          <div className="appt-sub-section">
            <h3 className="appt-group-title">Upcoming</h3>
            {patient.appointments.upcoming && patient.appointments.upcoming.length > 0 ? (
              patient.appointments.upcoming.map((appt) => (
                <div key={appt.id} className="appt-card upcoming">
                  <div className="appt-time-box">
                    <span className="appt-day">{appt.date.split('-')[2]}</span>
                    <span className="appt-month">JAN</span>
                  </div>
                  <div className="appt-details">
                    <p className="appt-dept">{appt.dept}</p>
                    <p className="appt-time">{appt.time}</p>
                  </div>
                  <span className="appt-status-chip confirmed">{appt.status}</span>
                </div>
              ))
            ) : (
              <EmptyState type="appt" isProfile={true} />
            )}
          </div>

          <div className="appt-sub-section">
            <h3 className="appt-group-title">Past Appointments</h3>
            <div className="past-appt-list">
              {patient.appointments.past && patient.appointments.past.length > 0 ? (
                patient.appointments.past.map((appt) => (
                  <div key={appt.id} className="past-appt-row">
                    <div className="past-meta">
                      <span className="past-date">{appt.date}</span>
                      <span className="past-dept">{appt.dept}</span>
                    </div>
                    <span className="past-status">Completed</span>
                  </div>
                ))
              ) : (
                <EmptyState type="appt" title="No past appointments" isProfile={true} />
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .timeline-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 24px;
        }

        .profile-section-card {
          padding: 24px;
          margin-bottom: 24px;
        }

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
        }

        .history-highlight-text {
          font-size: 16px;
          line-height: 1.6;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .read-only-notice {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          background: #F8FAFC;
          padding: 4px 10px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .case-timeline-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .case-history-item {
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .case-history-item:last-child {
          border-bottom: none;
        }

        .case-history-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .case-date {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .urgency-pill {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .urgency-pill.moderate { background: #FFFBEB; color: #B45309; }
        .urgency-pill.low { background: #F0FDF4; color: #15803D; }
        .urgency-pill.high { background: #FEF2F2; color: #B91C1C; }

        .case-history-outcome {
          font-size: 14px;
          color: var(--text-primary);
        }

        .appt-group-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }

        .appt-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #F8FAFC;
          border-radius: 12px;
          margin-bottom: 24px;
          border: 1px solid var(--border-color);
        }

        .appt-time-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 10px;
          border: 1px solid var(--border-color);
        }

        .appt-day { font-size: 18px; font-weight: 800; color: var(--primary); }
        .appt-month { font-size: 10px; font-weight: 700; color: var(--text-muted); }

        .appt-details { flex: 1; }
        .appt-dept { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; }
        .appt-time { font-size: 12px; color: var(--text-secondary); }

        .appt-status-chip {
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .appt-status-chip.confirmed { background: #EFF6FF; color: var(--primary); }

        .past-appt-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .past-appt-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }

        .past-meta {
          display: flex;
          flex-direction: column;
        }

        .past-date { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .past-dept { font-size: 12px; color: var(--text-secondary); }

        .past-status { font-size: 11px; font-weight: 600; color: var(--text-muted); }

        .no-data-text {
          font-size: 14px;
          color: var(--text-muted);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default TimelineGrid;
