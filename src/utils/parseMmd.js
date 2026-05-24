// Step 3: parse the .mmd file

// src/utils/parseMmd.js
import yaml from 'js-yaml';
import rawFile from '../data/reconstructed.mmd';

export function parseMmd(fileText) {
  // Split on the --- separators
  const parts = fileText.split(/^---\s*$/m);
  // parts[0] = empty, parts[1] = YAML, parts[2] = Markdown body

  const yamlData = yaml.load(parts[1]);
  const markdownBody = parts[2] || '';

  return {
    metadata: extractMetadata(yamlData, markdownBody),
    entities: extractEntities(yamlData),
    relations: extractRelations(yamlData),
    sections:  extractSections(markdownBody),
  };
}

function extractMetadata(yaml, markdown) {
  // Title comes from the first # heading in the markdown body
  const titleMatch = markdown.match(/^# (.+)$/m);
  // Authors come from the line after the title
  const authorLine = markdown.match(/^(Dr\.|Prof\.).+$/m);

  return {
    title: titleMatch?.[1] || yaml.title,
    authors: parseAuthors(markdown),
    format: yaml.format,
    version: yaml.version,
    generated: yaml.extraction_timestamp,
    documentClass: yaml.document_class,
    citationStyle: yaml.citation_style,
    latexPackages: yaml.latex_packages || [],
    stats: yaml.statistics,
    toc: buildTOC(markdown),
    keywords: extractKeywords(markdown),
  };
}

function parseAuthors(markdown) {
  // Look for the author line pattern: "Dr. X¹*, Prof. Y², ..."
  const lines = markdown.split('\n');
  const authorLineIdx = lines.findIndex(l => /^(Dr\.|Prof\.)/.test(l));
  if (authorLineIdx === -1) return [];

  const raw = lines[authorLineIdx];
  // Split by comma, clean up
  return raw.split(',').map(a => a.trim()).filter(Boolean);
}

function buildTOC(markdown) {
  const lines = markdown.split('\n');
  return lines
    .filter(l => /^#{1,3} /.test(l))
    .map(l => {
      const level = l.match(/^(#+)/)[1].length;
      const text = l.replace(/^#+\s*/, '').trim();
      return { level, text };
    });
}

function extractKeywords(markdown) {
  const match = markdown.match(/\*\*Keywords:\*\*\s*(.+)/);
  if (!match) return [];
  return match[1].split(',').map(k => k.trim());
}

function extractEntities(yaml) {
  const byType = yaml.semantic_entities?.by_type || {};
  const all = [];
  Object.entries(byType).forEach(([type, entities]) => {
    (entities || []).forEach(e => {
      all.push({
        id: e.entity_id,
        text: e.text,
        type: type,
        occurrences: e.occurrence_count,
        confidence: e.max_confidence,
        sections: e.sections || [],
        instances: e.instances || [],
      });
    });
  });
  return all;
}

function extractRelations(yaml) {
  const byType = yaml.semantic_relations?.by_type || {};
  const all = [];
  Object.entries(byType).forEach(([type, rels]) => {
    (rels || []).forEach(r => {
      all.push({
        id: r.relation_id,
        type: type,
        source: r.source_entity_id,
        target: r.target_entity_id,
        confidence: r.confidence,
        blockId: r.block_id,
      });
    });
  });
  return all;
}

function extractSections(markdown) {
  // Split the markdown by section headings
  const blocks = [];
  const lines = markdown.split('\n');
  let current = null;

  lines.forEach(line => {
    const h = line.match(/^(#{1,3}) (.+)$/);
    if (h) {
      if (current) blocks.push(current);
      current = { level: h[1].length, title: h[2].trim(), content: '' };
    } else if (current) {
      current.content += line + '\n';
    }
  });
  if (current) blocks.push(current);
  return blocks;
}