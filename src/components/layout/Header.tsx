import { Pathway } from '../../types/pathway';

export type AppMode = 'explore' | 'build';

interface HeaderProps {
  pathway: Pathway;
  pathwayList: Pathway[];
  customPathways: Pathway[];
  onPathwayChange: (id: string) => void;
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onNewPathway: () => void;
  onDuplicatePathway: () => void;
  onDeletePathway?: () => void;
  isCustom: boolean;
}

const categoryLabels: Record<string, string> = {
  saf: 'Sustainable Aviation Fuel',
  conventional: 'Conventional',
  synthetic: 'Synthetic / Power-to-Liquid',
};

const categoryColors: Record<string, string> = {
  saf: 'bg-emerald-100 text-emerald-800',
  conventional: 'bg-slate-100 text-slate-700',
  synthetic: 'bg-violet-100 text-violet-800',
};

export function Header({
  pathway,
  pathwayList,
  customPathways,
  onPathwayChange,
  mode,
  onModeChange,
  onNewPathway,
  onDuplicatePathway,
  onDeletePathway,
  isCustom,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">FuelsCreator</h1>
          <p className="text-xs text-slate-500">Interactive Fuel Production Pathway Explorer</p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-slate-100 rounded-lg p-0.5 ml-4">
          <button
            onClick={() => onModeChange('explore')}
            className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
              mode === 'explore' ? 'bg-white text-slate-900 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => onModeChange('build')}
            className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
              mode === 'build' ? 'bg-white text-slate-900 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Build
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Pathway selector */}
        <select
          value={pathway.id}
          onChange={(e) => onPathwayChange(e.target.value)}
          className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer max-w-[280px]"
        >
          <optgroup label="Built-in Pathways">
            {pathwayList.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </optgroup>
          {customPathways.length > 0 && (
            <optgroup label="Custom Pathways">
              {customPathways.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </optgroup>
          )}
        </select>

        <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[pathway.category] ?? 'bg-slate-100 text-slate-600'}`}>
          {categoryLabels[pathway.category] ?? pathway.category}
        </span>

        {isCustom && (
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-indigo-100 text-indigo-700">
            Custom
          </span>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1 ml-2 border-l border-slate-200 pl-3">
          <button
            onClick={onNewPathway}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
          >
            + New
          </button>
          <button
            onClick={onDuplicatePathway}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Duplicate current pathway as a custom one"
          >
            Duplicate
          </button>
          {isCustom && onDeletePathway && (
            <button
              onClick={onDeletePathway}
              className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
