// Step 7:

// src/components/NerPanel.jsx
import React, { useState } from 'react';
import { ENTITIES } from '../data/parsedData';

const TYPES = ['ALL', 'Method', 'Dataset', 'Technology', 'Organization'];
const TYPE_COLORS = { Method: '#8b7dff', Dataset: '#4fffb0', Technology: '#ffc96b', Organization: '#ff7070' };

export default function NerPanel() {
  const [activeTypes, setActiveTypes] = useState(new Set(TYPES));

  function toggleType(type) {
    setActiveTypes(prev => {
      const next = new Set(prev);
      if (type === 'ALL') {
        return next.has('ALL') ? new Set() : new Set(TYPES);
      }
      next.delete('ALL');
      if (next.has(type)) next.delete(type);
      else next.add(type);
      if (next.size === 4) next.add('ALL');
      return next;
    });
  }

  const visible = activeTypes.has('ALL')
    ? ENTITIES
    : ENTITIES.filter(e => activeTypes.has(e.type));

  const countByType = type => ENTITIES.filter(e => e.type === type).length;

  return (
    <div className="panel active">
      <div className="section-header">
        <h2 className="section-title">Named Entity Recognition</h2>
        <p className="section-sub">{ENTITIES.length} entities across 4 types</p>
      </div>

      {/* Filter buttons */}
      <div className="ner-filter-row">
        {TYPES.map(type => (
          <button
            key={type}
            className={`ner-filter-btn ${activeTypes.has(type) ? 'active' : ''}`}
            onClick={() => toggleType(type)}
            style={activeTypes.has(type) && type !== 'ALL'
              ? { borderColor: `${TYPE_COLORS[type]}80`, color: TYPE_COLORS[type] }
              : {}}
          >
            {type !== 'ALL' && (
              <span className="dot" style={{ background: TYPE_COLORS[type] }} />
            )}
            {type}
            <span className="count">
              {type === 'ALL' ? ENTITIES.length : countByType(type)}
            </span>
          </button>
        ))}
      </div>

      {/* Entity cards */}
      <div className="ner-grid">
        {visible.map(entity => (
          <div key={entity.id} className={`ner-card ${entity.type}`}>
            <div className="ner-card-top">
              <div className="ner-entity-name">{entity.text}</div>
              <div className={`ner-type-badge ${entity.type}`}>{entity.type}</div>
            </div>
            <div className="ner-meta">
              <span>✦ {entity.occurrences} occurrences</span>
              <span>◈ {Math.round(entity.confidence * 100)}% conf</span>
            </div>
            <div className="conf-bar-wrap">
              <div
                className={`conf-bar ${entity.type}`}
                style={{ width: `${entity.confidence * 100}%` }}
              />
            </div>
            <div className="ner-sections">
              {entity.sections.map(s => (
                <span key={s} className="ner-section-chip">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}