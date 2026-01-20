"use client";
import React from 'react';
import { Search, ChevronDown, Briefcase, Snowflake } from 'lucide-react';

const FilterBar = ({ onSearch, onUrgencyChange }) => {
  return (
    <div className="filter-bar card">
      <div className="filter-group">
        <label>Department</label>
        <div className="select-wrapper">
          <Briefcase size={18} className="select-icon" />
          <select className="select-input">
            <option>General Medicine</option>
            <option>Emergency</option>
            <option>Pediatrics</option>
          </select>
          <ChevronDown size={16} className="chevron-icon" />
        </div>
      </div>

      <div className="filter-group">
        <label>Urgency</label>
        <div className="select-wrapper">
          <Snowflake size={18} className="select-icon" />
          <select 
            className="select-input"
            onChange={(e) => onUrgencyChange(e.target.value)}
          >
            <option value="ALL">All Cases</option>
            <option value="HIGH">High Priority</option>
            <option value="MODERATE">Moderate</option>
          </select>
          <ChevronDown size={16} className="chevron-icon" />
        </div>
      </div>

      <div className="search-group">
        <label>Search Database</label>
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, ID, or symptoms..." 
            className="search-input" 
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
