import { useState, useMemo } from 'react';
import {
  processLibrary,
  ProcessTemplate,
  categoryLabels,
  searchLibrary,
} from '../../data/process-library';
import { TheoryPanel } from './TheoryPanel';

interface ProcessLibraryProps {
  onUseTemplate: (template: ProcessTemplate) => void;
  onClose: () => void;
}

export function ProcessLibrary({ onUseTemplate, onClose }: ProcessLibraryProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showTheory, setShowTheory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let results = search ? searchLibrary(search) : processLibrary;
    if (selectedCategory) {
      results = results.filter((t) => t.category === selectedCategory);
    }
    return results;
  }, [search, selectedCategory]);

  const categories = ['feedstock-preparation', 'reaction', 'separation', 'upgrading', 'utility'];

  // If showing theory panel, render it full-width
  if (showTheory) {
    const template = processLibrary.find((t) => t.id === showTheory);
    if (template) {
      return (
        <div className="p-4">
          <button
            onClick={() => setShowTheory(null)}
            className="text-xs text-indigo-600 hover:text-indigo-800 mb-3 flex items-center gap-1"
          >
            &larr; Back to Library
          </button>
          <TheoryPanel template={template} />
          <button
            onClick={() => { onUseTemplate(template); setShowTheory(null); }}
            className="w-full mt-4 text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors"
          >
            Use This Template
          </button>
        </div>
      );
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Process Library</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        Browse common refinery and chemical process operations. Each template includes theoretical backing, reaction chemistry, and typical operating conditions.
      </p>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field text-xs mb-3"
        placeholder="Search by name, tag, or pathway (e.g. 'HEFA', 'hydrogen', 'FT')..."
      />

      {/* Category filter */}
      <div className="flex flex-wrap gap-1 mb-3">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`text-xs px-2 py-1 rounded-full transition-colors ${
            !selectedCategory ? 'bg-indigo-100 text-indigo-700 font-medium' : 'bg-slate-100 text-slate-500 hover:text-slate-700'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              selectedCategory === cat ? 'bg-indigo-100 text-indigo-700 font-medium' : 'bg-slate-100 text-slate-500 hover:text-slate-700'
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">No matching processes found</p>
        )}
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isExpanded={expandedId === template.id}
            onToggle={() => setExpandedId(expandedId === template.id ? null : template.id)}
            onUse={() => onUseTemplate(template)}
            onShowTheory={() => setShowTheory(template.id)}
          />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  isExpanded,
  onToggle,
  onUse,
  onShowTheory,
}: {
  template: ProcessTemplate;
  isExpanded: boolean;
  onToggle: () => void;
  onUse: () => void;
  onShowTheory: () => void;
}) {
  const catColors: Record<string, string> = {
    'feedstock-preparation': 'border-l-emerald-400',
    reaction: 'border-l-rose-400',
    separation: 'border-l-sky-400',
    upgrading: 'border-l-amber-400',
    utility: 'border-l-violet-400',
  };

  return (
    <div className={`border-l-4 ${catColors[template.category]} bg-white border border-slate-200 rounded-r-lg overflow-hidden`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-800">{template.name}</span>
          <span className="text-xs text-slate-400">{isExpanded ? '▼' : '▶'}</span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{template.template.education.summary}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {template.commonPathways.slice(0, 3).map((p) => (
            <span key={p} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
              {p}
            </span>
          ))}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-slate-100 pt-2">
          {/* Chemistry preview */}
          {template.template.education.chemistry && (
            <div className="mb-2">
              <h5 className="text-xs font-semibold text-slate-600 mb-1">Key Reactions</h5>
              <pre className="text-xs text-slate-700 bg-slate-50 rounded p-2 whitespace-pre-wrap font-mono leading-relaxed">
                {template.template.education.chemistry}
              </pre>
            </div>
          )}

          {/* Conditions preview */}
          {template.template.conditions && (
            <div className="mb-2">
              <h5 className="text-xs font-semibold text-slate-600 mb-1">Typical Conditions</h5>
              <div className="text-xs text-slate-600 space-y-0.5">
                {template.template.conditions.temperature && (
                  <div>Temperature: {template.template.conditions.temperature.value}{template.template.conditions.temperature.unit}</div>
                )}
                {template.template.conditions.pressure && (
                  <div>Pressure: {template.template.conditions.pressure.value} {template.template.conditions.pressure.unit}</div>
                )}
                {template.template.conditions.catalyst && (
                  <div>Catalyst: {template.template.conditions.catalyst}</div>
                )}
              </div>
            </div>
          )}

          {/* Theory reaction count */}
          <div className="text-xs text-slate-500 mb-2">
            {template.theory.reactions.length} detailed reaction{template.theory.reactions.length !== 1 ? 's' : ''} · {template.theory.designVariables.length} design variable{template.theory.designVariables.length !== 1 ? 's' : ''}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={onShowTheory}
              className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors font-medium"
            >
              View Theory & Reactions
            </button>
            <button
              onClick={onUse}
              className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
            >
              Use Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
