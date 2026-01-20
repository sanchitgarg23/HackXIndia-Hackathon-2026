"use client";
import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import api from "@/lib/api";
import ProfileHeader from "@/components/profile/ProfileHeader";
import TimelineGrid from "@/components/profile/TimelineGrid";

export default function PatientProfilePage({ params }) {
  const unwrappedParams = use(params);
  const [patient, setPatient] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data } = await api.get(`/patients/${unwrappedParams.id}`);
        // Map backend data to what components expect
        const mappedPatient = {
          id: data._id,
          name: data.name,
          age: data.dob ? calculateAge(data.dob) : 'N/A',
          gender: data.gender || 'Unknown',
          language: data.settings?.language || 'English',
          email: data.email,
          phone: data.emergencyContact?.phone || 'N/A',
          emergencyContact: data.emergencyContact || {},
          chronicConditions: data.chronicConditions || [],
          allergies: data.allergies || [],
          cases: data.cases.map(c => ({
            id: c._id,
            status: c.status,
            priority: c.priority,
            date: new Date(c.createdAt).toLocaleDateString(),
            title: c.aiAnalysis?.summary || 'Case Report'
          })),
          records: data.records || [],
          medications: [], // Filter from records if needed
        };
        setPatient(mappedPatient);
      } catch (error) {
        console.error("Failed to fetch patient", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [unwrappedParams.id]);

  const calculateAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if(loading) return <div className="p-8">Loading profile...</div>;
  if(!patient) return <div className="p-8">Patient not found</div>;

  return (
    <div className="profile-page-container">
      <div className="profile-nav-header">
        <Link href="/" className="back-link">
          <ArrowLeft size={18} />
          Back to Inbox
        </Link>
        <div className="profile-breadcrumb">
          <span>Patients</span> / <span className="current">{patient.name}</span>
        </div>
      </div>

      <div className="profile-content-area">
        <ProfileHeader patient={patient} />
        <TimelineGrid patient={patient} />
      </div>

      <style jsx>{`
        .profile-page-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .profile-nav-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 600;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: var(--primary);
        }

        .profile-breadcrumb {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .profile-breadcrumb .current {
          color: var(--text-primary);
          font-weight: 600;
        }

        .profile-content-area {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}
