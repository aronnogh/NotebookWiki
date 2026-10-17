import { FileUp, Notebook as NotebookIcon, Github, BookOpen } from 'lucide-react';

interface Props {
  onUpload: (content: string, filename: string) => void;
  onTryExample: () => void;
  error: string | null;
}

export function UploadLanding({ onUpload, onTryExample, error }: Props) {
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      onUpload(reader.result as string, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.ipynb')) {
      handleFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-[#3366cc] rounded-lg shadow-lg">
            <BookOpen className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#202122] mb-4">
            NotebookWiki
          </h1>
          <p className="text-lg md:text-xl text-[#54595d] max-w-2xl mx-auto leading-relaxed">
            Convert any Jupyter Notebook into a beautiful, Wikipedia-style wiki article.
            Upload a <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono">.ipynb</code> file
            and get a readable, navigable wiki page instantly.
          </p>
        </div>

        <label
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="block cursor-pointer"
        >
          <input type="file" accept=".ipynb" onChange={handleChange} className="hidden" />
          <div className="border-2 border-dashed border-[#a2a9b1] rounded-xl bg-white p-12 text-center transition-all hover:border-[#3366cc] hover:shadow-md group">
            <FileUp className="w-12 h-12 mx-auto text-[#a2a9b1] group-hover:text-[#3366cc] transition-colors mb-4" />
            <p className="text-lg font-medium text-[#202122] mb-1">
              Drop your notebook here, or click to browse
            </p>
            <p className="text-sm text-[#54595d]">
              Supports <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">.ipynb</code> files (Jupyter Notebook format)
            </p>
          </div>
        </label>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={onTryExample}
            className="inline-flex items-center gap-2 text-[#3366cc] font-medium hover:underline transition-all"
          >
            <NotebookIcon className="w-5 h-5" />
            Try with an example notebook
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Readable Articles"
            desc="Markdown cells become prose, code blocks are syntax-highlighted, and outputs render inline."
          />
          <FeatureCard
            icon={<FileUp className="w-6 h-6" />}
            title="Table of Contents"
            desc="An auto-generated sidebar lets you jump to any section of the notebook instantly."
          />
          <FeatureCard
            icon={<Github className="w-6 h-6" />}
            title="Infobox Sidebar"
            desc="A Wikipedia-style infobox shows notebook metadata, cell counts, and kernel info."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-[#a2a9b1]/30">
      <div className="inline-flex items-center justify-center w-10 h-10 mb-3 bg-[#eaecf0] rounded-lg text-[#3366cc]">
        {icon}
      </div>
      <h3 className="font-serif text-lg font-bold text-[#202122] mb-2">{title}</h3>
      <p className="text-sm text-[#54595d] leading-relaxed">{desc}</p>
    </div>
  );
}
