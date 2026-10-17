import { getSourceString, type NotebookCell } from '@/utils/ipynb';

export function RawCell({ cell }: { cell: NotebookCell }) {
  return (
    <div className="wiki-raw-cell">
      <pre>{getSourceString(cell)}</pre>
    </div>
  );
}
