// Step 9:

// src/components/VectorSearchPanel.jsx
import React, { useState } from 'react';
import { SECTIONS, ENTITIES } from '../data/parsedData';

const CHIPS = ['EMFN architecture', 'training hyperparameters', 'baseline comparison', 'attention mechanism', 'datasets evaluation', 'limitations'];

// Simple TF-IDF-like scoring (replace with real embeddings later)
function score(query, section) {
  const qWords = query.toLowerCase().split(/\s+/);
  const text = (section.text + ' ' + section.section + ' ' + section.entities.join(' ')).toLowerCase();
  let s = 0;
  qWords.forEach(w => {
    if (w.length < 2) return;
    if (text.includes(w)) s += w.length > 5 ? 1.5 : 1;
    text.split(/\s+/).forEach(tw => { if (tw.startsWith(w.slice(0, 4)) && tw !== w) s += 0.25; });
  });
  return Math.min(1, s / (qWords.length * 1.8 + 0.001));
}

function highlight(text, query) {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  return words.reduce((t, w) => t.replace(new RegExp(`(${w})`, 'gi'), '<mark>$1</mark>'), text);
}

export default function VectorSearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  function doSearch(q = query) {
    if (!q.trim()) return;
    const scored = SECTIONS
      .map(s => ({ ...s, score: score(q, s) }))
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score);
    setResults({ query: q, items: scored });
  }

  return (
    <div className="panel active">
      <div className="section-header">
        <h2 className="section-title">Vector Search</h2>
        <p className="section-sub">Semantic search across document sections and entities</p>
      </div>

      <div className="search-wrap">
        <div className="search-box">
          <input
            className="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doSearch()}
            placeholder="e.g. attention mechanism, training procedure, ImageNet results..."
          />
          <button className="search-btn" onClick={() => doSearch()}>Search</button>
        </div>
        <div className="search-chips">
          {CHIPS.map(c => (
            <span key={c} className="search-chip" onClick={() => { setQuery(c); doSearch(c); }}>{c}</span>
          ))}
        </div>
      </div>

      <div className="search-results">
        {!results && <div className="result-empty">Type a query above or click a chip to search.</div>}
        {results?.items.length === 0 && <div className="result-empty">No results for "{results.query}".</div>}
        {results?.items.map(r => {
          const matchedEntities = ENTITIES.filter(e =>
            r.entities.some(re => re.toLowerCase().includes(e.text.toLowerCase().slice(0, 5)))
          );
          return (
            <div key={r.id} className="result-card">
              <div className="result-top">
                <div className="result-section">{r.section}</div>
                <div className="result-score">
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${Math.round(r.score * 100)}%` }} />
                  </div>
                  <span>{Math.round(r.score * 100)}% match</span>
                </div>
              </div>
              <div
                className="result-text"
                dangerouslySetInnerHTML={{ __html: highlight(r.text, results.query) }}
              />
              {matchedEntities.length > 0 && (
                <div className="result-entities">
                  {matchedEntities.slice(0, 6).map(e => (
                    <span key={e.id} className={`result-entity-tag ${e.type}`}>{e.text}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}