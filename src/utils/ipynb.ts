export interface NotebookCell {
  cell_type: string;
  source: string[];
  outputs?: any[];
  metadata?: any;
  execution_count?: number | null;
}

export interface Notebook {
  cells: NotebookCell[];
  metadata: any;
  nbformat: number;
  nbformat_minor: number;
}

export function parseNotebook(content: string): Notebook {
  const json = JSON.parse(content);
  return {
    cells: (json.cells || []).map((c: any) => ({
      ...c,
      source: Array.isArray(c.source) ? c.source : [c.source || ''],
    })),
    metadata: json.metadata || {},
    nbformat: json.nbformat || 4,
    nbformat_minor: json.nbformat_minor || 0,
  };
}

export function getSourceString(cell: NotebookCell): string {
  return Array.isArray(cell.source) ? cell.source.join('') : String(cell.source || '');
}

export function extractMarkdownContent(notebook: Notebook): string {
  return notebook.cells
    .filter((c) => c.cell_type === 'markdown')
    .map(getSourceString)
    .join('\n\n');
}

export function extractHeadings(notebook: Notebook): Heading[] {
  const headings: Heading[] = [];
  for (const cell of notebook.cells) {
    if (cell.cell_type !== 'markdown') continue;
    const text = getSourceString(cell);
    const lines = text.split('\n');
    for (const line of lines) {
      const m = line.match(/^(#{1,6})\s+(.+)$/);
      if (m) {
        headings.push({
          level: m[1].length,
          text: m[2].replace(/[#*`]/g, '').trim(),
          id: slugify(m[2].replace(/[#*`]/g, '').trim()),
        });
      }
    }
  }
  return headings;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_');
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export function buildInfobox(notebook: Notebook): InfoboxEntry[] {
  const entries: InfoboxEntry[] = [];
  const meta = notebook.metadata || {};

  if (meta.title || meta.kernelspec?.name) {
    entries.push({ label: 'Kernel', value: meta.kernelspec?.display_name || meta.kernelspec?.name || 'Python' });
  }
  if (meta.language_info?.name) {
    entries.push({ label: 'Language', value: meta.language_info?.name });
  }
  if (meta.language_info?.version) {
    entries.push({ label: 'Version', value: meta.language_info?.version });
  }

  const mdCount = notebook.cells.filter((c) => c.cell_type === 'markdown').length;
  const codeCount = notebook.cells.filter((c) => c.cell_type === 'code').length;
  entries.push({ label: 'Markdown cells', value: String(mdCount) });
  entries.push({ label: 'Code cells', value: String(codeCount) });
  entries.push({ label: 'Total cells', value: String(mdCount + codeCount) });

  const codeLines = notebook.cells
    .filter((c) => c.cell_type === 'code')
    .reduce((acc, c) => acc + getSourceString(c).split('\n').length, 0);
  entries.push({ label: 'Lines of code', value: String(codeLines) });

  return entries;
}

export interface InfoboxEntry {
  label: string;
  value: string;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
