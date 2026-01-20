"use client";
import React from 'react';
import { RefreshCcw, Download } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-titles">
        <h1 className="header-title">Patient Case Inbox</h1>
        <p className="header-subtitle">Prioritize and review clinically significant triage alerts</p>
      </div>

      <div className="header-actions">
        <button className="btn-outline btn-refresh">
          <RefreshCcw size={18} />
          <span>Refresh</span>
        </button>
        <button className="btn-outline btn-export">
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
