"use client";
import React, { useState } from 'react';
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import CaseCard from "@/components/CaseCard";
import EmptyState from "@/components/EmptyState";
import { mockCases } from "@/components/mockData";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("ALL");

  const filteredCases = mockCases.filter(c => {
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
