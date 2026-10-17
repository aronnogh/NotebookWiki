import { useState } from 'react';
import { type Notebook } from '@/utils/ipynb';
import { MarkdownCell } from './MarkdownCell';
import { CodeCell } from './CodeCell';
import { RawCell } from './RawCell';
import { Infobox } from './Infobox';
import { SiteHeader, TOCList } from './SiteHeader';
import { extractHeadings, buildInfobox, formatDate } from '@/utils/ipynb';
import { Globe, Clock, Eye, Edit, Printer } from 'lucide-react';

interface Props {
  notebook: Notebook;
  filename: string;
  onReset: () => void;
}

export function NotebookWiki({ notebook, filename, onReset }: Props) {
  const [tocOpen, setTocOpen] = useState(false);

  const headings = extractHeadings(notebook);
  const infoboxEntries = buildInfobox(notebook);

  const title = notebook.metadata?.title || filename.replace(/\.ipynb$/i, '').replace(/_/g, ' ');
  const subtitle = notebook.metadata?.subtitle || 'A wiki article generated from a Jupyter Notebook';

  const categories: string[] = [];
  if (notebook.metadata?.kernelspec?.name) {
    categories.push(notebook.metadata.kernelspec.name.toUpperCase());
  }
  categories.push('Jupyter Notebooks');
  categories.push('Wiki Articles');

  const lastUpdated = formatDate(notebook.metadata?.last_updated || new Date().toISOString());

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader
        title={title}
        headings={headings}
        onReset={onReset}
        onToggleTOC={() => setTocOpen(!tocOpen)}
        tocOpen={tocOpen}
      />

      <div className="wiki-layout">
        {/* Desktop sidebar TOC */}
        <aside className="wiki-sidebar hidden md:block">
          <div className="wiki-sidebar-inner">
            <h3 className="wiki-sidebar-title">Contents</h3>
            <TOCList headings={headings} activeId="" onClick={(e, id) => {
              e.preventDefault();
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }} />
          </div>
        </aside>

        {/* Main content */}
        <main className="wiki-main">
          <article className="wiki-article">
            {/* Breadcrumbs */}
            <div className="wiki-breadcrumbs">
              <span className="wiki-breadcrumb-link">NotebookWiki</span>
              <span className="wiki-breadcrumb-sep">›</span>
              <span className="wiki-breadcrumb-link">Articles</span>
              <span className="wiki-breadcrumb-sep">›</span>
              <span className="wiki-breadcrumb-current">{title}</span>
            </div>

            {/* Article header */}
            <h1 className="wiki-article-title">{title}</h1>
            <p className="wiki-article-subtitle">{subtitle}</p>

            {/* Article meta bar */}
            <div className="wiki-meta-bar">
              <div className="wiki-meta-actions">
                <span className="wiki-meta-item">
                  <Globe className="w-3.5 h-3.5" />
                  Open access
                </span>
                <span className="wiki-meta-item">
                  <Clock className="w-3.5 h-3.5" />
                  Updated {lastUpdated}
                </span>
                <span className="wiki-meta-item">
                  <Eye className="w-3.5 h-3.5" />
                  View
                </span>
                <span className="wiki-meta-item">
                  <Edit className="w-3.5 h-3.5" />
                  Edit source
                </span>
                <button onClick={() => window.print()} className="wiki-meta-item wiki-meta-clickable">
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
              </div>
            </div>

            <hr className="wiki-divider" />

            {/* Content with infobox */}
            <div className="wiki-content-area">
              <Infobox
                title={title}
                subtitle={subtitle}
                entries={infoboxEntries}
                categories={categories}
              />

              <div className="wiki-body">
                {/* Lead section */}
                <div className="wiki-lead">
                  <p>
                    <strong>{title}</strong> is a computational notebook converted into a wiki-style article.
                    Below you'll find the full content of the original Jupyter Notebook, with markdown cells rendered
                    as readable prose, code cells displayed with syntax highlighting, and outputs shown inline.
                  </p>
                </div>

                {/* Cells */}
                {notebook.cells.map((cell, i) => (
                  <div key={i} className="wiki-cell-wrapper">
                    {cell.cell_type === 'markdown' && <MarkdownCell cell={cell} />}
                    {cell.cell_type === 'code' && <CodeCell cell={cell} />}
                    {cell.cell_type === 'raw' && <RawCell cell={cell} />}
                  </div>
                ))}

                {/* Footer categories */}
                <div className="wiki-footer-categories">
                  <span className="wiki-footer-label">Categories: </span>
                  {categories.map((cat, i) => (
                    <span key={i}>
                      <span className="wiki-footer-cat">{cat}</span>
                      {i < categories.length - 1 && <span className="wiki-footer-sep"> · </span>}
                    </span>
                  ))}
                </div>

                {/* License footer */}
                <div className="wiki-license-footer">
                  <p>
                    This article is a converted Jupyter Notebook. Content is displayed as-is from the original
                    notebook file <code className="wiki-code-inline">{filename}</code>.
                  </p>
                  <p className="wiki-license-text">
                    This page was last edited on {lastUpdated}.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
