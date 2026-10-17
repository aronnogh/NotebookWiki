import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { getSourceString, type NotebookCell } from '@/utils/ipynb';

export function MarkdownCell({ cell }: { cell: NotebookCell }) {
  return (
    <div className="wiki-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
      >
        {getSourceString(cell)}
      </ReactMarkdown>
    </div>
  );
}
