"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, User, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Header from "@/components/Header";
import api from "@/lib/api";

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments');
      const now = new Date();
      
      const mappedAppointments = data.map(app => ({
        id: app._id,
        patientId: app.patientId?._id,
        patientName: app.patientId?.name || 'Unknown',
        type: new Date(app.date) > now ? 'upcoming' : 'past',
        priority: 'MODERATE', // Default as appointments don't have priority field in backend model yet
        status: app.status,
        date: new Date(app.date).toLocaleDateString(),
        time: app.time,
        dept: app.location || 'Cardiology', // Default or from backend
        notes: app.notes
      }));
      
      setAppointments(mappedAppointments);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading appointments...</div>;

  const filteredAppointments = appointments.filter(app => app.type === activeTab);

  return (
    <div className="appointments-page">
      <Header />
      
      <div className="appointments-content">
        <div className="page-header">
          <h1>Appointments</h1>
          <p className="subtitle">Manage and track your clinical schedule</p>
        </div>

        <div className="tabs-container">
          <button 
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
            <span className="count">
              {appointments.filter(a => a.type === 'upcoming').length}
            </span>
          </button>
          <button 
            className={`tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past
            <span className="count">
              {appointments.filter(a => a.type === 'past').length}
            </span>
          </button>
        </div>

        <div className="appointments-grid">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((app) => (
              <div key={app.id} className="appointment-card">
                <div className="card-header">
                  <div className="patient-info">
                    <div className="avatar">
                      {app.patientName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="patient-name">{app.patientName}</h3>
                      <p className="appointment-type">Clinical Follow-up</p>
                    </div>
                  </div>
                  <div className={`status-badge ${app.status.toLowerCase()}`}>
                    {app.status === 'CONFIRMED' ? <Calendar size={14} /> : <CheckCircle2 size={14} />}
                    <span>{app.status}</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-item">
                    <Clock size={16} />
                    <span>{app.date} • {app.time || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <MapPin size={16} />
                    <span>{app.dept}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <Link href={`/patient/${app.patientId}`} className="secondary-btn">
                    View Case
                  </Link>
                  <button className="primary-btn" disabled>
                    Enter Room
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-appointments">
              <Calendar size={48} />
              <p>No {activeTab} appointments found.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .appointments-page {
          padding-bottom: 40px;
        }
        .appointments-content {
          padding: 24px 32px;
        }
        .page-header {
          margin-bottom: 32px;
        }
        .page-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .subtitle {
          color: var(--text-secondary);
          font-size: 14px;
        }
        .tabs-container {
          display: flex;
          gap: 32px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
        }
        .tab {
          padding: 12px 4px;
          background: none;
          border: none;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tab.active {
          color: var(--primary);
        }
        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary);
        }
        .count {
          font-size: 11px;
          background: #F1F5F9;
          padding: 2px 6px;
          border-radius: 10px;
          color: var(--text-muted);
        }
        .tab.active .count {
          background: var(--primary-light);
          color: var(--primary);
        }
        .appointments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }
        .appointment-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .patient-info {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        .patient-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .appointment-type {
          font-size: 12px;
          color: var(--text-secondary);
        }
        .status-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
        }
        .status-badge.confirmed {
          background: #E0F2FE;
          color: #0284C7;
        }
        .status-badge.completed {
          background: #DCFCE7;
          color: #16A34A;
        }
        .card-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 14px;
        }
        .card-footer {
          display: flex;
          gap: 12px;
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
        }
        .primary-btn, .secondary-btn {
          flex: 1;
          padding: 8px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
        }
        .primary-btn {
          background: var(--primary);
          color: white;
          border: none;
        }
        .primary-btn:disabled {
          background: #F1F5F9;
          color: var(--text-muted);
          cursor: not-allowed;
        }
        .secondary-btn {
          background: white;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
        }
        .secondary-btn:hover {
          background: #F8FAFC;
        }
        .empty-appointments {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px;
          color: var(--text-muted);
          gap: 16px;
        }
      `}</style>
    </div>
  );
}
