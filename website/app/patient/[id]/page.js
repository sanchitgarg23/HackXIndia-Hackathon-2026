"use client";
import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { mockCases } from "@/components/mockData";
import ProfileHeader from "@/components/profile/ProfileHeader";
import TimelineGrid from "@/components/profile/TimelineGrid";

export default function PatientProfilePage({ params }) {
  const unwrappedParams = use(params);
  const patient = mockCases.find(c => c.id === parseInt(unwrappedParams.id)) || mockCases[0];

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
