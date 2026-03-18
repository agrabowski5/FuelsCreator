import { useState } from 'react';
import { Pathway, ProcessStep } from '../../types/pathway';
import { StageEditor } from './StageEditor';
import { CalculationPanel } from './CalculationPanel';
import { ConnectionEditor } from './ConnectionEditor';
import { ProcessLibrary } from './ProcessLibrary';
import { ProcessTemplate } from '../../data/process-library';
import { createEmptyStep, generateId } from '../../utils/storage';

interface BuilderSidebarProps {
  pathway: Pathway;
  onChange: (pathway: Pathway) => void;
  editingStepId: string | null;
  onEditStep: (id: string | null) => void;
}

export function BuilderSidebar({ pathway, onChange, editingStepId, onEditStep }: BuilderSidebarProps) {
  const [activeView, setActiveView] = useState<'stages' | 'connections' | 'calculate' | 'library' | 'settings'>('stages');
  const [showLibrary, setShowLibrary] = useState(false);

  const editingStep = editingStepId
    ? pathway.steps.find((s) => s.id === editingStepId) ?? null
    : null;

  // If editing a step, show the stage editor
  if (editingStep) {
    return (
      <aside className="w-[420px] shrink-0 bg-white border-l border-slate-200 overflow-y-auto">
        <StageEditor
          step={editingStep}
          onChange={(updated) => {
            const steps = pathway.steps.map((s) => (s.id === updated.id ? updated : s));
            onChange({ ...pathway, steps });
          }}
          onDelete={() => {
            const steps = pathway.steps.filter((s) => s.id !== editingStep.id);
            const streams = pathway.streams.filter(
              (s) => s.from !== editingStep.id && s.to !== editingStep.id
            );
            onChange({ ...pathway, steps, streams });
            onEditStep(null);
          }}
          onClose={() => onEditStep(null)}
        />
      </aside>
    );
  }

  const addStep = (nodeType: 'feedstock' | 'process' | 'product') => {
    const step = createEmptyStep(nodeType);
    onChange({ ...pathway, steps: [...pathway.steps, step] });
    onEditStep(step.id);
  };

  const addFromTemplate = (template: ProcessTemplate) => {
    const newId = generateId(template.template.nodeType);
    const step: ProcessStep = {
      ...JSON.parse(JSON.stringify(template.template)),
      id: newId,
      // Regenerate stream IDs for inputs/outputs
      inputs: template.template.inputs.map((inp) => ({ ...inp, streamId: generateId('stream') })),
      outputs: template.template.outputs.map((out) => ({ ...out, streamId: generateId('stream') })),
    };
    onChange({ ...pathway, steps: [...pathway.steps, step] });
    setShowLibrary(false);
    setActiveView('stages');
    onEditStep(step.id);
  };

  // Show process library overlay
  if (showLibrary) {
    return (
      <aside className="w-[420px] shrink-0 bg-white border-l border-slate-200 overflow-y-auto">
        <ProcessLibrary
          onUseTemplate={addFromTemplate}
          onClose={() => setShowLibrary(false)}
        />
      </aside>
    );
  }

  return (
    <aside className="w-[420px] shrink-0 bg-white border-l border-slate-200 overflow-y-auto">
      <div className="p-4">
        {/* View tabs */}
        <div className="flex gap-1 mb-4 bg-slate-100 rounded-lg p-1">
          {(['stages', 'connections', 'calculate', 'library', 'settings'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`text-xs px-2 py-1.5 rounded-md capitalize transition-colors flex-1 ${
                activeView === view ? 'bg-white text-slate-900 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Stages View */}
        {activeView === 'stages' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">Process Stages</h3>
            </div>

            {/* Add from library */}
            <button
              onClick={() => setActiveView('library')}
              className="w-full text-xs px-3 py-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors font-medium mb-3"
            >
              Browse Process Library — add from templates with theory & reactions
            </button>

            {/* Add blank stage buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => addStep('feedstock')}
                className="flex-1 text-xs px-3 py-2 rounded-lg border-2 border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-colors"
              >
                + Feedstock
              </button>
              <button
                onClick={() => addStep('process')}
                className="flex-1 text-xs px-3 py-2 rounded-lg border-2 border-dashed border-sky-300 text-sky-600 hover:bg-sky-50 hover:border-sky-400 transition-colors"
              >
                + Process
              </button>
              <button
                onClick={() => addStep('product')}
                className="flex-1 text-xs px-3 py-2 rounded-lg border-2 border-dashed border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-400 transition-colors"
              >
                + Product
              </button>
            </div>

            {/* Stage list */}
            {pathway.steps.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400 mb-2">No stages yet</p>
                <p className="text-xs text-slate-400">Add feedstocks, process steps, and products to build your pathway</p>
              </div>
            ) : (
              <div className="space-y-1">
                {pathway.steps.map((step, i) => (
                  <StageListItem
                    key={step.id}
                    step={step}
                    onEdit={() => onEditStep(step.id)}
                    onMoveUp={i > 0 ? () => {
                      const steps = [...pathway.steps];
                      [steps[i - 1], steps[i]] = [steps[i], steps[i - 1]];
                      onChange({ ...pathway, steps });
                    } : undefined}
                    onMoveDown={i < pathway.steps.length - 1 ? () => {
                      const steps = [...pathway.steps];
                      [steps[i], steps[i + 1]] = [steps[i + 1], steps[i]];
                      onChange({ ...pathway, steps });
                    } : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Connections View */}
        {activeView === 'connections' && (
          <ConnectionEditor pathway={pathway} onChange={onChange} />
        )}

        {/* Calculate View */}
        {activeView === 'calculate' && (
          <CalculationPanel pathway={pathway} />
        )}

        {/* Library View */}
        {activeView === 'library' && (
          <ProcessLibrary
            onUseTemplate={addFromTemplate}
            onClose={() => setActiveView('stages')}
          />
        )}

        {/* Settings View */}
        {activeView === 'settings' && (
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-slate-600 mb-1 block">Pathway Name</span>
              <input
                type="text"
                value={pathway.name}
                onChange={(e) => onChange({ ...pathway, name: e.target.value })}
                className="input-field"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600 mb-1 block">Description</span>
              <textarea
                value={pathway.description}
                onChange={(e) => onChange({ ...pathway, description: e.target.value })}
                className="input-field min-h-[80px]"
                rows={3}
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600 mb-1 block">Category</span>
              <select
                value={pathway.category}
                onChange={(e) => onChange({ ...pathway, category: e.target.value as Pathway['category'] })}
                className="input-field"
              >
                <option value="saf">Sustainable Aviation Fuel</option>
                <option value="conventional">Conventional</option>
                <option value="synthetic">Synthetic / Power-to-Liquid</option>
              </select>
            </label>
          </div>
        )}
      </div>
    </aside>
  );
}

function StageListItem({
  step,
  onEdit,
  onMoveUp,
  onMoveDown,
}: {
  step: ProcessStep;
  onEdit: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const typeColors: Record<string, string> = {
    feedstock: 'border-l-emerald-500 bg-emerald-50/50',
    process: 'border-l-sky-500 bg-sky-50/50',
    product: 'border-l-amber-500 bg-amber-50/50',
  };

  const dotColors: Record<string, string> = {
    feedstock: 'bg-emerald-500',
    process: 'bg-sky-500',
    product: 'bg-amber-500',
  };

  return (
    <div
      className={`border-l-4 rounded-r-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:shadow-sm transition-shadow ${
        typeColors[step.nodeType] ?? ''
      }`}
      onClick={onEdit}
    >
      <div className={`w-2 h-2 rounded-full shrink-0 ${dotColors[step.nodeType]}`} />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-slate-800 truncate">{step.name}</div>
        <div className="text-xs text-slate-500 truncate">
          {step.nodeType}
          {step.conditions?.temperature && ` · ${step.conditions.temperature.value}${step.conditions.temperature.unit}`}
        </div>
      </div>
      <div className="flex gap-0.5 shrink-0">
        {onMoveUp && (
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            className="text-slate-400 hover:text-slate-600 text-xs p-0.5"
            title="Move up"
          >
            ▲
          </button>
        )}
        {onMoveDown && (
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            className="text-slate-400 hover:text-slate-600 text-xs p-0.5"
            title="Move down"
          >
            ▼
          </button>
        )}
      </div>
    </div>
  );
}
