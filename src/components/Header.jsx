// Step 5:

// src/components/Header.jsx
import React from 'react';

const TABS = ['Metadata', 'NER', 'Knowledge Graph', 'Vector Search'];

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="app-header">
      <div className="logo">MMD <em>Intelligence</em> Explorer</div>
      <div className="file-badge">reconstructed.mmd</div>
      <nav className="nav-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
    </header>
  );
}