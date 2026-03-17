import { Pathway } from '../../types/pathway';

interface HeaderProps {
  pathway: Pathway;
  pathwayList: Pathway[];
  onPathwayChange: (id: string) => void;
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

export function Header({ pathway, pathwayList, onPathwayChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">FuelsCreator</h1>
          <p className="text-xs text-slate-500">Interactive Fuel Production Pathway Explorer</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={pathway.id}
          onChange={(e) => onPathwayChange(e.target.value)}
          className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
        >
          {pathwayList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[pathway.category] ?? 'bg-slate-100 text-slate-600'}`}>
          {categoryLabels[pathway.category] ?? pathway.category}
        </span>
      </div>
    </header>
  );
}
