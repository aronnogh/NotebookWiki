import { type InfoboxEntry } from '@/utils/ipynb';
import { Info } from 'lucide-react';

interface Props {
  title: string;
  subtitle: string;
  entries: InfoboxEntry[];
  categories: string[];
}

export function Infobox({ title, subtitle, entries, categories }: Props) {
  return (
    <aside className="wiki-infobox">
      <table className="w-full border-collapse bg-white">
        <tbody>
          <tr>
            <th colSpan={2} className="wiki-infobox-title">
              {title}
            </th>
          </tr>
          {subtitle && (
            <tr>
              <td colSpan={2} className="wiki-infobox-subtitle">
                {subtitle}
              </td>
            </tr>
          )}
          <tr>
            <td colSpan={2} className="wiki-infobox-section">
              <span className="inline-flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Notebook details
              </span>
            </td>
          </tr>
          {entries.map((entry, i) => (
            <tr key={i} className="border-b border-[#eaecf0]">
              <th className="wiki-infobox-label">{entry.label}</th>
              <td className="wiki-infobox-value">{entry.value}</td>
            </tr>
          ))}
          {categories.length > 0 && (
            <>
              <tr>
                <td colSpan={2} className="wiki-infobox-section">
                  Categories
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="wiki-infobox-categories">
                  {categories.map((cat, i) => (
                    <span key={i} className="wiki-category-tag">
                      {cat}
                    </span>
                  ))}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </aside>
  );
}
