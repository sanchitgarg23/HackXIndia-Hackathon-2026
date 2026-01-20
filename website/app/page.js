"use client";
import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import CaseCard from "@/components/CaseCard";
import EmptyState from "@/components/EmptyState";
import api from "@/lib/api";
import { useRouter } from 'next/navigation';

export default function Home() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("ALL");
  const router = useRouter();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data } = await api.get('/cases/doctor/inbox');
      
      const transformedCases = data.map(kase => ({
        id: kase._id,
        name: kase.patientId?.name || 'Unknown',
        age: kase.patientId?.dob ? calculateAge(kase.patientId.dob) : 'N/A',
        gender: kase.patientId?.gender || 'Unknown',
        language: 'English',
        priority: kase.priority,
        status: kase.status,
        source: kase.inputMode === 'voice' ? 'Voice Call' : 'Symptom Check',
        narrative: kase.aiAnalysis?.summary || kase.transcript || 'No details provided.',
        redFlags: kase.aiAnalysis?.redFlags || [],
        metrics: {
          urgencyScore: kase.aiAnalysis?.urgencyScore || 0,
          aiConfidence: kase.aiAnalysis?.confidence || 0,
          activeTime: timeSince(kase.createdAt),
          prevAppt: 'None'
        }
      }));

      setCases(transformedCases);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + 'y';
  };

  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = urgencyFilter === "ALL" || c.priority === urgencyFilter;
    return matchesSearch && matchesUrgency;
  });

  const sortedCases = [...filteredCases].sort((a, b) => {
    const statusOrder = { 'NEW': 0, 'UNDER REVIEW': 0, 'ESCALATED': 1, 'RESOLVED': 2 };
    const priorityOrder = { 'HIGH': 0, 'MODERATE': 1, 'LOW': 2 };

    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority]; 
  });

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <Header />
      <FilterBar 
        onSearch={setSearchQuery} 
        onUrgencyChange={setUrgencyFilter} 
      />
      
      <div className="cases-list">
        {sortedCases.length > 0 ? (
          sortedCases.map((patientCase) => (
            <CaseCard key={patientCase.id} patientCase={patientCase} />
          ))
        ) : (
          <EmptyState 
            type={searchQuery ? 'search' : (urgencyFilter !== 'ALL' ? 'priority' : 'cases')} 
            title={searchQuery ? `No results for "${searchQuery}"` : undefined}
          />
        )}
      </div>
    </div>
  );
}
