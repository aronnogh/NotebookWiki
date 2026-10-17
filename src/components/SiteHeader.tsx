import { useEffect, useRef, useState } from 'react';
import { BookOpen, RotateCcw, List, X } from 'lucide-react';
import { type Heading } from '@/utils/ipynb';

interface Props {
  title: string;
  headings: Heading[];
  onReset: () => void;
  onToggleTOC: () => void;
  tocOpen: boolean;
}

export function SiteHeader({ title, headings, onReset, onToggleTOC, tocOpen }: Props) {
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          setActiveId(topMost.target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#a2a9b1] shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleTOC}
              className="md:hidden p-1.5 rounded hover:bg-[#eaecf0] transition-colors"
              aria-label="Toggle table of contents"
            >
              <List className="w-5 h-5 text-[#202122]" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 bg-[#3366cc] rounded">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-serif text-lg font-bold text-[#202122] leading-tight">NotebookWiki</span>
                <div className="text-xs text-[#54595d] leading-tight">The Free Notebook Encyclopedia</div>
              </div>
            </div>
          </div>
          <div className="flex-1 mx-4 min-w-0 hidden lg:block">
            <p className="text-sm text-[#54595d] truncate text-center font-serif italic">
              {title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-sm text-[#3366cc] hover:text-[#2a4ba8] font-medium px-3 py-1.5 rounded hover:bg-[#eaecf0] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">New Notebook</span>
            </button>
          </div>
        </div>
      </header>

      {tocOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden bg-black/30"
          onClick={onToggleTOC}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-lg overflow-y-auto pt-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#eaecf0]">
              <span className="font-serif font-bold text-[#202122]">Contents</span>
              <button onClick={onToggleTOC} className="p-1 rounded hover:bg-[#eaecf0]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <TOCList headings={headings} activeId={activeId} onClick={handleClick} />
          </div>
        </div>
      )}
    </>
  );
}

export function TOCList({
  headings,
  activeId,
  onClick,
}: {
  headings: Heading[];
  activeId: string;
  onClick: (e: React.MouseEvent, id: string) => void;
}) {
  if (headings.length === 0) {
    return <p className="px-4 py-3 text-sm text-[#54595d]">No headings found.</p>;
  }

  return (
    <nav className="px-4 py-2">
      <ul className="space-y-0.5">
        {headings.map((h, i) => (
          <li key={i}>
            <a
              href={`#${h.id}`}
              onClick={(e) => onClick(e, h.id)}
              className={`block text-sm py-1 rounded transition-colors ${
                activeId === h.id
                  ? 'text-[#3366cc] font-bold'
                  : 'text-[#202122] hover:text-[#3366cc]'
              }`}
              style={{ paddingLeft: `${(h.level - 1) * 12 + 0}px` }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
