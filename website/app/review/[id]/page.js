"use client";
import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, MessageSquare, ClipboardList, ShieldAlert } from 'lucide-react';
import Header from "@/components/Header";
import { mockCases } from "@/components/mockData";
import PatientContext from "@/components/review/PatientContext";
import ClinicalSummary from "@/components/review/ClinicalSummary";
import ActionPanel from "@/components/review/ActionPanel";

export default function ReviewPage({ params }) {
  const unwrappedParams = use(params);
  const patientCase = mockCases.find(c => c.id === parseInt(unwrappedParams.id)) || mockCases[0];

  return (
    <div className="review-page-container">
      <div className="review-header">
        <Link href="/" className="back-link">
          <ArrowLeft size={18} />
          Back to Inbox
        </Link>
        <div className="review-breadcrumb">
          <span>Patient Case Inbox</span> / <span>Case Review</span> / <span className="current">{patientCase.name}</span>
        </div>
      </div>

      <div className="review-layout">
        <div className="review-column">
          <PatientContext patient={patientCase} />
        </div>
        
        <div className="review-column">
          <ClinicalSummary patient={patientCase} />
        </div>

        <div className="review-column">
          <ActionPanel patient={patientCase} />
        </div>
      </div>

      <style jsx>{`
        .review-page-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .review-header {
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

        .review-breadcrumb {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .review-breadcrumb .current {
          color: var(--text-primary);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
