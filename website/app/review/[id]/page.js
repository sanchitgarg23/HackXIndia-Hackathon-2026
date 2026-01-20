"use client";
import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, MessageSquare, ClipboardList, ShieldAlert } from 'lucide-react';
import Header from "@/components/Header";
import api from "@/lib/api";
import PatientContext from "@/components/review/PatientContext";
import ClinicalSummary from "@/components/review/ClinicalSummary";
import ActionPanel from "@/components/review/ActionPanel";

export default function ReviewPage({ params }) {
  const unwrappedParams = use(params);
  const [patientCase, setPatientCase] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const router = React.useRouter ? React.useRouter() : null; // Next.js 13+ app dir specific, used Link instead.
  // Actually page components default export don't need useRouter if using Link.
  
  React.useEffect(() => {
    const fetchCase = async () => {
      try {
        const { data } = await api.get(`/cases/${unwrappedParams.id}`);
        // Map to mock structure to ensure child components work
        const mappedCase = {
            id: data._id,
            name: data.patientId?.name || 'Unknown',
            age: data.patientId?.dob ? calculateAge(data.patientId.dob) : 'N/A',
            gender: data.patientId?.gender || 'Unknown',
            language: 'English',
            priority: data.priority,
            status: data.status,
            source: data.inputMode,
            transcript: data.transcript,
            narrative: data.aiAnalysis?.summary || data.transcript,
            symptoms: data.symptoms || [],
            redFlags: data.aiAnalysis?.redFlags || [],
            metrics: {
                urgencyScore: data.aiAnalysis?.urgencyScore || 0,
                aiConfidence: data.aiAnalysis?.confidence || 0,
                activeTime: new Date(data.createdAt).toLocaleString(),
                prevAppt: 'None'
            },
            aiAnalysis: data.aiAnalysis, // Pass full object just in case
            medicalHistory: data.patientId?.chronicConditions || [],
            medications: [], // Need to fetch separately or mock
            allergies: data.patientId?.allergies || []
        };
        setPatientCase(mappedCase);
      } catch (error) {
        console.error("Failed to fetch case", error);
        // Handle 404 or auth error
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [unwrappedParams.id]);

  const calculateAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970); // Number for age here probably? Dashboard used string '52y' but here components might need number.
  };

  if (loading) return <div className="p-8">Loading case details...</div>;
  if (!patientCase) return <div className="p-8">Case not found.</div>;


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
