import { useState, useCallback } from 'react';
import { UploadLanding } from '@/components/UploadLanding';
import { NotebookWiki } from '@/components/NotebookWiki';
import { parseNotebook, type Notebook } from '@/utils/ipynb';
import { EXAMPLE_NOTEBOOK } from '@/utils/exampleNotebook';

function App() {
  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [filename, setFilename] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback((content: string, name: string) => {
    try {
      const parsed = parseNotebook(content);
      if (!parsed.cells || parsed.cells.length === 0) {
        setError('This notebook appears to be empty — it contains no cells.');
        return;
      }
      setNotebook(parsed);
      setFilename(name);
      setError(null);
      window.scrollTo(0, 0);
    } catch (e) {
      setError('Could not parse this file. Please make sure it is a valid Jupyter Notebook (.ipynb) file.');
    }
  }, []);

  const handleExample = useCallback(() => {
    const content = JSON.stringify(EXAMPLE_NOTEBOOK, null, 2);
    handleUpload(content, 'monty_hall_problem.ipynb');
  }, [handleUpload]);

  const handleReset = useCallback(() => {
    setNotebook(null);
    setFilename('');
    setError(null);
    window.scrollTo(0, 0);
  }, []);

  if (notebook) {
    return <NotebookWiki notebook={notebook} filename={filename} onReset={handleReset} />;
  }

  return <UploadLanding onUpload={handleUpload} onTryExample={handleExample} error={error} />;
}

export default App;
