# MMD Intelligence Explorer

> Master's Capstone · Arc Intelligence Lab · University of Sydney · May 2026

Interactive semantic document explorer built with React — surfaces NER results, knowledge graph, vector search, and document metadata from academic papers in a single 4-panel interface.

## Features

### 4 Panels
- **Metadata** — document title, authors, affiliations, publication info, keywords, table of contents
- **NER** — 22 named entities across 4 types (Method · Dataset · Technology · Organisation) with occurrence counts and confidence scores up to 99%
- **Knowledge Graph** — 22 nodes, 21 typed semantic relations rendered as interactive force-directed D3.js graph with confidence sidebar
- **Vector Search** — section-level semantic retrieval with entity highlighting — Abstract: 90% match, Section 5.3: 83% match

## What I Built

| File | Description |
|---|---|
| `src/components/MetadataPanel.jsx` | Document metadata display |
| `src/components/NerPanel.jsx` | Entity cards with type badges and confidence scores |
| `src/components/KnowledgeGraphPanel.jsx` | Force-directed graph with D3.js + relation sidebar |
| `src/components/VectorSearchPanel.jsx` | Semantic search UI with entity-highlighted results |
| `src/components/Header.jsx` | Navigation header with panel switching |
| `src/data/parsedData.js` | Complete data layer — 22 entities, 21 relations, 25 sections |
| `src/utils/parseMmd.js` | MMD file parser utility |
| `src/App.jsx` | Root application component |
| `src/index.css` | Complete dark theme stylesheet |

## Repository Structure

```
src/
├── components/
│   ├── Header.jsx
│   ├── MetadataPanel.jsx
│   ├── NerPanel.jsx
│   ├── KnowledgeGraphPanel.jsx
│   └── VectorSearchPanel.jsx
├── data/
│   ├── parsedData.js
│   └── reconstructed.mmd
├── utils/
│   └── parseMmd.js
├── App.jsx
└── index.css
```

## Tech Stack

- **Frontend:** React 18
- **Graph Visualisation:** D3.js (force-directed)
- **Styling:** Custom dark theme CSS
- **Build:** Create React App

## How to Run

```bash
npm install
npm start
```

Opens at http://localhost:3000

---

*Part of a broader semantically-augmented RAG research platform built at University of Sydney.*
