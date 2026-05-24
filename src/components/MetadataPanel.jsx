// Step 6:

// src/components/MetadataPanel.jsx
import React from 'react';
import { METADATA } from '../data/parsedData';

export default function MetadataPanel() {
  const { title, authors, keywords, stats, toc, documentClass, citationStyle, latexPackages, received, accepted } = METADATA;

  return (
    <div className="panel active">
      <div className="section-header">
        <h2 className="section-title">Document Metadata</h2>
        <p className="section-sub">Extracted from osdis-mmd v1.0</p>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        {[
          { num: stats.entities, label: 'Entities' },
          { num: stats.relations, label: 'Relations' },
          { num: toc.length, label: 'Sections' },
          { num: 4, label: 'Entity Types' },
        ].map(s => (
          <div key={s.label} className="stat-box">
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Title card */}
      <div className="meta-card accent-border full">
        <div className="meta-card-label">Title</div>
        <div className="meta-card-value large">{title}</div>
      </div>

      {/* Authors */}
      <div className="meta-card">
        <div className="meta-card-label">Authors</div>
        {authors.map(a => (
          <div key={a.name} className="author-row">
            <div className="author-avatar">{a.initials}</div>
            <div className="author-info">
              {a.name}
              <span>{a.affiliation} · {a.email}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Publication info */}
      <div className="meta-card">
        <div className="meta-card-label">Publication Info</div>
        <div>Format: {documentClass}</div>
        <div>Received: {received} / Accepted: {accepted}</div>
        <div>Citation: {citationStyle}</div>
        <div>LaTeX: {latexPackages.join(' · ')}</div>
      </div>

      {/* Keywords */}
      <div className="meta-card full">
        <div className="meta-card-label">Keywords</div>
        <div className="kw-list">
          {keywords.map(k => <span key={k} className="kw-pill">{k}</span>)}
        </div>
      </div>

      {/* Table of Contents */}
      <div className="meta-card full">
        <div className="meta-card-label">Table of Contents</div>
        <ul className="toc-list">
          {toc.map((item, i) => (
            <li key={i} className={`toc-item h${item.level}`}>
              <div className="toc-dot" />
              <span className="toc-text">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}