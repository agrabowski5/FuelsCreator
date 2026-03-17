import { useSelectedNode } from '../../hooks/useSelectedNode';
import { NodeDetail } from '../detail/NodeDetail';
import { Pathway } from '../../types/pathway';

interface SidebarProps {
  pathway: Pathway;
}

export function Sidebar({ pathway }: SidebarProps) {
  const { selectedStep } = useSelectedNode();

  return (
    <aside className="w-[420px] shrink-0 bg-white border-l border-slate-200 overflow-y-auto">
      {selectedStep ? (
        <NodeDetail step={selectedStep} />
      ) : (
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">{pathway.name}</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{pathway.description}</p>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-sm text-indigo-800 font-medium mb-2">How to use</p>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>Click any process step to learn about it</li>
              <li>Zoom and pan to explore the flow diagram</li>
              <li>Use the dropdown to switch pathways</li>
              <li>Edge labels show material flows between steps</li>
            </ul>
          </div>

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">Legend</h3>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-3 h-3 rounded-full bg-emerald-500" /> Feedstock / Input
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-3 h-3 rounded-full bg-sky-500" /> Process Step
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-3 h-3 rounded-full bg-amber-500" /> Product / Output
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Process Steps</h3>
            <div className="space-y-1">
              {pathway.steps.map((step, i) => (
                <button
                  key={step.id}
                  onClick={() => {
                    // This will be handled by the context
                    const event = new CustomEvent('selectNode', { detail: step.id });
                    window.dispatchEvent(event);
                  }}
                  className="w-full text-left text-xs px-3 py-2 rounded-md hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <span className="text-slate-400 mr-2">{i + 1}.</span>
                  {step.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
