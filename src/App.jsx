// Step 10: wiring all together

// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import MetadataPanel from './components/MetadataPanel';
import NerPanel from './components/NerPanel';
import KnowledgeGraphPanel from './components/KnowledgeGraphPanel';
import VectorSearchPanel from './components/VectorSearchPanel';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('Metadata');

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {activeTab === 'Metadata'        && <MetadataPanel />}
        {activeTab === 'NER'             && <NerPanel />}
        {activeTab === 'Knowledge Graph' && <KnowledgeGraphPanel />}
        {activeTab === 'Vector Search'   && <VectorSearchPanel />}
      </main>
    </div>
  );
}