// Step 8:

// src/components/KnowledgeGraphPanel.jsx
import React, { useEffect, useRef } from 'react';
import { ENTITIES, RELATIONS } from '../data/parsedData';

const TYPE_COLORS = { Method: '#8b7dff', Dataset: '#4fffb0', Technology: '#ffc96b', Organization: '#ff7070' };
const REL_COLORS  = { combines:'#8b7dff', evaluated_on:'#4fffb0', outperforms:'#ff7070', uses:'#ffc96b', type_of:'#7a8499', variant_of:'#4fffb0', implemented_in:'#ffc96b', trained_on:'#ff9f6b', compared_to:'#a0a8c0', collaborates_with:'#ff7070' };

export default function KnowledgeGraphPanel() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width  = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // ── position nodes in a rough cluster layout ──
    const nodeMap = {};
    const nodes = ENTITIES.map((e, i) => {
      const typeAngle = { Method: 0, Dataset: Math.PI * 0.6, Technology: Math.PI * 1.1, Organization: Math.PI * 1.6 };
      const siblings = ENTITIES.filter(x => x.type === e.type);
      const idx = siblings.indexOf(e);
      const base = typeAngle[e.type] || 0;
      const spread = Math.PI * 0.45;
      const angle = base + (idx / (siblings.length - 1 || 1) - 0.5) * spread;
      const radius = 140 + (e.occurrences > 5 ? 0 : 55);
      const node = {
        ...e,
        x: W / 2 + Math.cos(angle) * radius,
        y: H / 2 + Math.sin(angle) * radius,
        vx: 0, vy: 0,
        r: Math.max(12, Math.min(22, 9 + e.occurrences * 1.4)),
      };
      nodeMap[e.id] = node;
      return node;
    });

    // simple repulsion sim
    for (let iter = 0; iter < 100; iter++) {
      nodes.forEach(a => {
        nodes.forEach(b => {
          if (a === b) return;
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy) || 1;
          const f = Math.max(0, 75 - d) / d * 0.25;
          a.vx += dx * f; a.vy += dy * f;
        });
        a.vx += (W / 2 - a.x) * 0.002;
        a.vy += (H / 2 - a.y) * 0.002;
        a.vx *= 0.85; a.vy *= 0.85;
        a.x = Math.max(a.r + 5, Math.min(W - a.r - 5, a.x + a.vx));
        a.y = Math.max(a.r + 5, Math.min(H - a.r - 5, a.y + a.vy));
      });
    }

    let dragging = null, hover = null;
    let dragOX = 0, dragOY = 0;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // edges
      RELATIONS.forEach(r => {
        const s = nodeMap[r.source], t = nodeMap[r.target];
        if (!s || !t) return;
        const col = REL_COLORS[r.type] || '#555';
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = col + '55';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // arrowhead
        const angle = Math.atan2(t.y - s.y, t.x - s.x);
        const ax = t.x - Math.cos(angle) * (t.r + 4);
        const ay = t.y - Math.sin(angle) * (t.r + 4);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - 7 * Math.cos(angle - 0.35), ay - 7 * Math.sin(angle - 0.35));
        ctx.lineTo(ax - 7 * Math.cos(angle + 0.35), ay - 7 * Math.sin(angle + 0.35));
        ctx.closePath();
        ctx.fillStyle = col + '88';
        ctx.fill();
      });

      // nodes
      nodes.forEach(n => {
        const col = TYPE_COLORS[n.type] || '#fff';
        const isHov = hover === n;
        if (isHov) {
          const g = ctx.createRadialGradient(n.x, n.y, n.r, n.x, n.y, n.r * 2.8);
          g.addColorStop(0, col + '44');
          g.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = col + '20';
        ctx.fill();
        ctx.strokeStyle = col;
        ctx.lineWidth = isHov ? 2.5 : 1.5;
        ctx.stroke();
        ctx.font = `${n.occurrences > 5 ? 500 : 400} 9px monospace`;
        ctx.fillStyle = isHov ? col : 'rgba(200,210,230,0.85)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const label = n.text.length > 16 ? n.text.slice(0, 14) + '…' : n.text;
        ctx.fillText(label, n.x, n.y);
      });
    }

    function getNode(ex, ey) {
      const rect = canvas.getBoundingClientRect();
      const mx = ex - rect.left, my = ey - rect.top;
      return nodes.find(n => Math.hypot(n.x - mx, n.y - my) < n.r + 5) || null;
    }

    canvas.onmousemove = e => {
      if (dragging) {
        const r = canvas.getBoundingClientRect();
        dragging.x = e.clientX - r.left - dragOX;
        dragging.y = e.clientY - r.top  - dragOY;
        draw();
      } else {
        const n = getNode(e.clientX, e.clientY);
        if (n !== hover) { hover = n; canvas.style.cursor = n ? 'grab' : 'default'; draw(); }
      }
    };
    canvas.onmousedown = e => {
      const n = getNode(e.clientX, e.clientY);
      if (n) { dragging = n; const r = canvas.getBoundingClientRect(); dragOX = e.clientX - r.left - n.x; dragOY = e.clientY - r.top - n.y; canvas.style.cursor = 'grabbing'; }
    };
    canvas.onmouseup = () => { dragging = null; canvas.style.cursor = 'default'; };
    canvas.onmouseleave = () => { dragging = null; hover = null; draw(); };

    draw();
  }, []);

  return (
    <div className="panel active">
      <div className="section-header">
        <h2 className="section-title">Knowledge Graph</h2>
        <p className="section-sub">22 nodes · 21 semantic relations · drag nodes to explore</p>
      </div>
      <div className="kg-container">
        <div>
          <div className="kg-canvas-wrap">
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="kg-legend">
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} className="kg-legend-item">
                <div className="kg-legend-dot" style={{ background: color }} />
                {type}
              </div>
            ))}
          </div>
        </div>
        <div className="kg-rel-list">
          <div className="kg-rel-title">All Relations ({RELATIONS.length})</div>
          {RELATIONS.map((r, i) => {
            const s = ENTITIES.find(e => e.id === r.source);
            const t = ENTITIES.find(e => e.id === r.target);
            return (
              <div key={i} className="rel-row">
                <div className="rel-type" style={{ color: REL_COLORS[r.type] || '#aaa' }}>
                  {r.type.replace(/_/g, ' ')}
                </div>
                <div className="rel-entities">
                  <span style={{ color: TYPE_COLORS[s?.type] }}>{s?.text}</span>
                  <span className="rel-arrow">→</span>
                  <span style={{ color: TYPE_COLORS[t?.type] }}>{t?.text}</span>
                </div>
                <div className="rel-conf">confidence: {Math.round(r.confidence * 100)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}