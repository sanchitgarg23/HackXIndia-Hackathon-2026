"use client";
import React from 'react';
import { Search, Inbox, AlertCircle, Calendar } from 'lucide-react';

const EmptyState = ({ type = 'cases', title, description, isProfile = false }) => {
  const getIcon = () => {
    switch (type) {
      case 'search': return <Search size={isProfile ? 24 : 32} />;
      case 'priority': return <AlertCircle size={isProfile ? 24 : 32} />;
      case 'appt': return <Calendar size={isProfile ? 24 : 32} />;
      case 'cases':
      default: return <Inbox size={isProfile ? 24 : 32} />;
    }
  };

  const getDefaults = () => {
    switch (type) {
      case 'search': return { 
        title: 'No results found', 
        description: 'Try adjusting your search terms or filters to find what you are looking for.' 
      };
      case 'priority': return { 
        title: 'No high-priority cases detected', 
        description: 'All current cases are within normal triaging parameters.' 
      };
      case 'appt': return { 
        title: 'No upcoming appointments', 
        description: 'No scheduled follow-ups or visits for this patient at this moment.' 
      };
      case 'cases':
      default: return { 
        title: 'No active cases', 
        description: 'All patient triages have been addressed and finalized.' 
      };
    }
  };

  const defaults = getDefaults();

  return (
    <div className={`${isProfile ? 'profile-empty-state' : 'empty-state-container'}`}>
      <div className="empty-icon-wrapper">
        {getIcon()}
      </div>
      <h3 className="empty-title">{title || defaults.title}</h3>
      <p className="empty-description">{description || defaults.description}</p>
    </div>
  );
};

export default EmptyState;
