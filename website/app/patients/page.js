"use client";
import React from 'react';
import Link from 'next/link';
import { User, ChevronRight, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import Header from "@/components/Header";
import api from "@/lib/api";

export default function PatientsPage() {
  const [patients, setPatients] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/cases/doctor/inbox');
      // Extract unique patients from cases
      const uniquePatients = [];
      const seenIds = new Set();
      
      data.forEach(kase => {
        if (kase.patientId && !seenIds.has(kase.patientId._id)) {
          seenIds.add(kase.patientId._id);
          uniquePatients.push({
            id: kase.patientId._id,
            name: kase.patientId.name || 'Unknown',
            age: kase.patientId.dob ? calculateAge(kase.patientId.dob) : 'N/A',
            gender: kase.patientId.gender || 'Unknown',
            priority: kase.priority // Just taking priority of most recent case? Or highest? 
            // For now, let's just use the case priority as a proxy for "current status"
          });
        }
      });
      setPatients(uniquePatients);
    } catch (error) {
      console.error("Failed to fetch patients", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + 'y';
  };

  if (loading) return <div className="p-8">Loading patients...</div>;


  const getRiskIcon = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <AlertCircle size={18} className="risk-icon high" />;
      case 'MODERATE':
        return <Clock size={18} className="risk-icon moderate" />;
      case 'LOW':
        return <CheckCircle2 size={18} className="risk-icon low" />;
      default:
        return null;
    }
  };

  return (
    <div className="patients-page">
      <Header />
      
      <div className="patients-content">
        <div className="page-header">
          <h1>Patients</h1>
          <p className="subtitle">View and manage your patient list</p>
        </div>

        <div className="patients-list-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Risk Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="patient-row">
                  <td>
                    <Link href={`/patient/${patient.id}`} className="patient-name-cell">
                      <div className="avatar-small">
                        {patient.name.charAt(0)}
                      </div>
                      <span>{patient.name}</span>
                    </Link>
                  </td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>
                    <div className="risk-badge">
                      {getRiskIcon(patient.priority)}
                      <span className={`risk-text ${patient.priority.toLowerCase()}`}>
                        {patient.priority}
                      </span>
                    </div>
                  </td>
                  <td className="actions-cell">
                    <Link href={`/patient/${patient.id}`} className="view-link">
                      <span>View Profile</span>
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .patients-page {
          padding-bottom: 40px;
        }
        .patients-content {
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
        .patients-list-container {
          background: white;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .patients-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .patients-table th {
          padding: 16px 24px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          background: #F8FAFC;
          border-bottom: 1px solid var(--border-color);
        }
        .patients-table td {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color);
          vertical-align: middle;
          font-size: 14px;
          color: var(--text-primary);
        }
        .patient-row:last-child td {
          border-bottom: none;
        }
        .patient-row:hover {
          background: #F8FAFC;
        }
        .patient-name-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: inherit;
          font-weight: 600;
        }
        .avatar-small {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
        }
        .risk-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .risk-icon.high { color: #EF4444; }
        .risk-icon.moderate { color: #F59E0B; }
        .risk-icon.low { color: #10B981; }
        .risk-text {
          font-size: 12px;
          font-weight: 600;
        }
        .risk-text.high { color: #EF4444; }
        .risk-text.moderate { color: #F59E0B; }
        .risk-text.low { color: #10B981; }
        .view-link {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
          font-size: 13px;
          transition: transform 0.2s;
        }
        .view-link:hover {
          transform: translateX(4px);
        }
        .actions-cell {
          text-align: right;
        }
      `}</style>
    </div>
  );
}
