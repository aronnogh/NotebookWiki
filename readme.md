# NotebookWiki

**Convert any Jupyter Notebook into a beautiful, Wikipedia-style wiki article.**

NotebookWiki takes a `.ipynb` file and renders it as a polished, navigable encyclopedia page — with markdown cells as readable prose, syntax-highlighted code blocks, inline cell outputs, an auto-generated table of contents, and a metadata infobox. No backend required; everything runs in the browser.

![NotebookWiki](https://i.ibb.co.com/Jj01nDBf/63b6780c-6924-4f24-849a-aaa07e80139c.jpg)

---

## Features

### Wikipedia-style layout
- **Infobox sidebar** — displays kernel name, language version, cell counts, and lines of code in the classic Wikipedia infobox format.
- **Table of contents** — auto-generated from your notebook's markdown headings. The active section is highlighted as you scroll, and clicking any entry jumps to that section.
- **Article chrome** — breadcrumbs, article title, subtitle, meta bar (view / edit / print), categories, and a license footer — all styled to match Wikipedia's look and feel.

### Full notebook rendering
- **Markdown cells** — rendered as prose with support for GitHub-Flavored Markdown (tables, task lists, strikethrough), LaTeX math via KaTeX (`$inline$` and `$$display$$`), and raw HTML.
- **Code cells** — displayed in styled code blocks with `In [n]:` / `Out [n]:` labels and Python syntax highlighting.
- **Cell outputs** — all major output types render inline:
  - Stream output (stdout / stderr)
  - Plain text
  - HTML (e.g. pandas DataFrames)
  - Images (base64 PNG / JPEG)
  - Markdown output
  - Error tracebacks (with ANSI escape codes stripped)
- **Raw cells** — displayed in a distinct styled block.

### User experience
- **Drag-and-drop upload** — drop a `.ipynb` file anywhere on the landing page, or click to browse.
- **Example notebook** — try the app instantly with a built-in Monty Hall Problem notebook.
- **Responsive design** — works from mobile to desktop. The sidebar collapses into a slide-out drawer on small screens.
- **Print support** — clean print stylesheet hides navigation chrome and optimizes the article for paper.
- **No data leaves your browser** — all parsing and rendering happens client-side. No uploads, no servers, no tracking.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS + custom Wikipedia-inspired CSS |
| Markdown | `react-markdown` + `remark-gfm` + `remark-math` |
| Math rendering | `rehype-katex` + KaTeX |
| HTML in markdown | `rehype-raw` |
| Icons | `lucide-react` |

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** (comes with Node.js)

### Installation

```bash
git clone https://github.com/aronnogh/NotebookWiki.git
cd notebookwiki
npm install
```

### Development

```bash
npm run dev
```

This starts the Vite dev server. Open the URL shown in your terminal (typically `http://localhost:5173`).

### Production Build

```bash
npm run build
```

This outputs a fully static site to `dist/`. You can preview it locally with:

```bash
npm run preview
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

---

## Usage

1. **Open the app** in your browser.
2. **Drag and drop** a `.ipynb` file onto the upload area, or click to browse and select one.
3. The notebook is **parsed and rendered instantly** as a Wikipedia-style article.
4. Use the **sidebar table of contents** to navigate between sections.
5. Click **New Notebook** in the header to convert another file.

Don't have a notebook handy? Click **"Try with an example notebook"** on the landing page to see a pre-loaded Monty Hall Problem notebook with markdown, code, outputs, and LaTeX math.

---

## How It Works

NotebookWiki parses the `.ipynb` JSON format entirely in the browser:

1. **File reading** — the `.ipynb` file is read as text using the browser's `FileReader` API. No data is sent to any server.
2. **JSON parsing** — the file is parsed into a notebook structure (cells, metadata, nbformat).
3. **Cell rendering** — each cell is rendered based on its type:
   - `markdown` cells → rendered with `react-markdown` (GFM + math + raw HTML)
   - `code` cells → displayed as syntax-highlighted code blocks with their outputs
   - `raw` cells → displayed as-is in a styled block
4. **Metadata extraction** — notebook metadata (kernel, language, cell counts) is extracted into the infobox.
5. **Heading extraction** — markdown headings are collected to build the table of contents and assign anchor IDs.

```
src/
├── App.tsx                      # Root component — upload vs. wiki view routing
├── components/
│   ├── UploadLanding.tsx        # Landing page with drag-and-drop upload
│   ├── NotebookWiki.tsx         # Main wiki article layout
│   ├── SiteHeader.tsx           # Sticky header + table of contents sidebar
│   ├── Infobox.tsx              # Wikipedia-style metadata infobox
│   ├── MarkdownCell.tsx         # Renders markdown cells (GFM + math + HTML)
│   ├── CodeCell.tsx             # Renders code cells + their outputs
│   └── RawCell.tsx              # Renders raw cells
├── utils/
│   ├── ipynb.ts                 # Notebook parsing, heading extraction, infobox data
│   └── exampleNotebook.ts       # Built-in example notebook (Monty Hall Problem)
├── types.ts                     # Shared TypeScript types
├── index.css                    # Wikipedia-inspired global styles
└── main.tsx                     # React entry point
```

---

## Supported Notebook Features

| Feature | Status |
|---------|--------|
| Markdown cells (GFM) | ✅ |
| LaTeX math (`$...$`, `$$...$$`) | ✅ |
| Raw HTML in markdown | ✅ |
| Code cells with syntax highlighting | ✅ |
| Stream output (stdout/stderr) | ✅ |
| Plain text output | ✅ |
| HTML output (DataFrames, etc.) | ✅ |
| Image output (PNG, JPEG) | ✅ |
| Markdown output | ✅ |
| Error tracebacks | ✅ |
| Raw cells | ✅ |
| Interactive widgets (ipywidgets) | ❌ |
| SVG output | ❌ |
| Cell execution | ❌ (static rendering only) |

---

## Deployment

Since NotebookWiki is a fully static app, you can deploy the `dist/` folder to any static host:

### GitHub Pages

```bash
npm run build
# Push the contents of dist/ to a gh-pages branch or use a GitHub Action
```

### Netlify / Vercel / Cloudflare Pages

1. Connect your GitHub repository.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.

---

## Contributing

Contributions are welcome! Here are some ideas:

- **SVG output support** — parse and render `image/svg+xml` outputs
- **More syntax highlighting** — add language support beyond Python
- **ipywidgets support** — render interactive widgets
- **Dark mode** — a Wikipedia-dark theme toggle
- **Export** — save the rendered wiki as a standalone HTML file
- **Search** — full-text search across notebook content

### How to contribute

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m 'Add my feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Open a Pull Request.

Please ensure `npm run typecheck` and `npm run build` pass before submitting a PR.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Jupyter Project](https://jupyter.org/) — for the `.ipynb` notebook format
- [Wikipedia](https://www.wikipedia.org/) — for the design language this project emulates
- [react-markdown](https://github.com/remarkjs/react-markdown) — markdown rendering
- [KaTeX](https://katex.org/) — fast math typesetting
- [Tailwind CSS](https://tailwindcss.com/) — utility-first CSS framework
- [Lucide](https://lucide.dev/) — clean, consistent icons
