import { getSourceString, type NotebookCell } from '@/utils/ipynb';

export function CodeCell({ cell }: { cell: NotebookCell }) {
  const code = getSourceString(cell);
  const outputs = cell.outputs || [];

  return (
    <div className="wiki-code-cell">
      <div className="wiki-code-block">
        <div className="wiki-code-header">
          <span className="wiki-code-label">In [{cell.execution_count ?? '-'}]:</span>
        </div>
        <pre><code className="language-python">{code}</code></pre>
      </div>
      {outputs.length > 0 && (
        <div className="wiki-outputs">
          {outputs.map((output, i) => (
            <OutputView key={i} output={output} />
          ))}
        </div>
      )}
    </div>
  );
}

function OutputView({ output }: { output: any }) {
  if (output.output_type === 'stream') {
    return (
      <div className="wiki-output-stream">
        <div className="wiki-code-header">
          <span className="wiki-code-label wiki-output-label">Out:</span>
        </div>
        <pre className="wiki-stream-text">{output.text?.join('') || ''}</pre>
      </div>
    );
  }

  if (output.output_type === 'error') {
    return (
      <div className="wiki-output-error">
        <div className="wiki-code-header">
          <span className="wiki-code-label wiki-output-label wiki-error-label">
            {output.ename}: {output.evalue}
          </span>
        </div>
        {output.traceback && (
          <pre className="wiki-traceback">{output.traceback.join('\n').replace(/\x1b\[[0-9;]*m/g, '')}</pre>
        )}
      </div>
    );
  }

  if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
    const data = output.data || {};
    const executionCount = output.output_type === 'execute_result' ? output.execution_count : null;

    if (data['image/png']) {
      return (
        <div className="wiki-output-image">
          {executionCount != null && (
            <div className="wiki-code-header">
              <span className="wiki-code-label wiki-output-label">Out [{executionCount}]:</span>
            </div>
          )}
          <img
            src={`data:image/png;base64,${data['image/png']}`}
            alt="Cell output"
            className="wiki-output-img"
          />
        </div>
      );
    }

    if (data['image/jpeg']) {
      return (
        <div className="wiki-output-image">
          {executionCount != null && (
            <div className="wiki-code-header">
              <span className="wiki-code-label wiki-output-label">Out [{executionCount}]:</span>
            </div>
          )}
          <img
            src={`data:image/jpeg;base64,${data['image/jpeg']}`}
            alt="Cell output"
            className="wiki-output-img"
          />
        </div>
      );
    }

    if (data['text/html']) {
      const html = Array.isArray(data['text/html']) ? data['text/html'].join('') : data['text/html'];
      return (
        <div className="wiki-output-html">
          {executionCount != null && (
            <div className="wiki-code-header">
              <span className="wiki-code-label wiki-output-label">Out [{executionCount}]:</span>
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      );
    }

    if (data['text/markdown']) {
      const md = Array.isArray(data['text/markdown']) ? data['text/markdown'].join('') : data['text/markdown'];
      return (
        <div className="wiki-output-md">
          {executionCount != null && (
            <div className="wiki-code-header">
              <span className="wiki-code-label wiki-output-label">Out [{executionCount}]:</span>
            </div>
          )}
          <div className="wiki-markdown"><p>{md}</p></div>
        </div>
      );
    }

    if (data['text/plain']) {
      const text = Array.isArray(data['text/plain']) ? data['text/plain'].join('') : data['text/plain'];
      return (
        <div className="wiki-output-text">
          {executionCount != null && (
            <div className="wiki-code-header">
              <span className="wiki-code-label wiki-output-label">Out [{executionCount}]:</span>
            </div>
          )}
          <pre className="wiki-plain-output">{text}</pre>
        </div>
      );
    }
  }

  return null;
}
