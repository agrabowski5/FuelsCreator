import { useState, useMemo } from 'react';
import { ProcessStep } from '../../types/pathway';
import { ProcessConditions } from './ProcessConditions';
import { MassEnergyBalance } from './MassEnergyBalance';
import { ChemistrySection } from './ChemistrySection';
import { useSelectedNode } from '../../hooks/useSelectedNode';
import { processLibrary, ProcessTemplate } from '../../data/process-library';

interface NodeDetailProps {
  step: ProcessStep;
}

const nodeTypeStyles: Record<string, { bg: string; accent: string; label: string }> = {
  feedstock: { bg: 'bg-emerald-50', accent: 'text-emerald-700', label: 'Feedstock' },
  process: { bg: 'bg-sky-50', accent: 'text-sky-700', label: 'Process Step' },
  product: { bg: 'bg-amber-50', accent: 'text-amber-700', label: 'Product' },
};

/**
 * Try to find a matching process library template for this step
 * by fuzzy matching the step name against template names and tags.
 */
function findMatchingTemplate(step: ProcessStep): ProcessTemplate | null {
  const name = step.name.toLowerCase();

  // Direct name matches
  for (const t of processLibrary) {
    if (t.template.name.toLowerCase() === name || t.name.toLowerCase() === name) return t;
  }

  // Partial name matches
  for (const t of processLibrary) {
    const tName = t.name.toLowerCase();
    const tTemplateName = t.template.name.toLowerCase();
    if (name.includes(tName) || tName.includes(name)) return t;
    if (name.includes(tTemplateName) || tTemplateName.includes(name)) return t;
  }

  // Tag matches
  for (const t of processLibrary) {
    for (const tag of t.tags) {
      if (name.includes(tag.toLowerCase())) return t;
    }
  }

  return null;
}

export function NodeDetail({ step }: NodeDetailProps) {
  const { setSelectedNodeId } = useSelectedNode();
  const style = nodeTypeStyles[step.nodeType] ?? nodeTypeStyles.process;
  const [showTheory, setShowTheory] = useState(false);

  const matchedTemplate = useMemo(() => findMatchingTemplate(step), [step]);

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={`text-xs font-medium ${style.accent} ${style.bg} px-2 py-0.5 rounded-full`}>
            {style.label}
          </span>
          <h2 className="text-lg font-bold text-slate-900 mt-1">{step.name}</h2>
        </div>
        <button
          onClick={() => setSelectedNodeId(null)}
          className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
          title="Close"
        >
          &times;
        </button>
      </div>

      {/* Summary */}
      <p className="text-sm text-slate-600 leading-relaxed mb-5">{step.education.summary}</p>

      {/* Conditions */}
      {step.conditions && <ProcessConditions conditions={step.conditions} />}

      {/* Mass & Energy Balance */}
      <MassEnergyBalance step={step} />

      {/* Chemistry */}
      {step.education.chemistry && (
        <ChemistrySection
          chemistry={step.education.chemistry}
          explanation={step.education.explanation}
        />
      )}

      {/* Detailed Explanation (if no chemistry section already showed it) */}
      {!step.education.chemistry && step.education.explanation && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Details</h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{step.education.explanation}</p>
        </div>
      )}

      {/* Engineering Notes */}
      {step.education.engineeringNotes && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Engineering Notes</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-sm text-slate-600 leading-relaxed">{step.education.engineeringNotes}</p>
          </div>
        </div>
      )}

      {/* Key Terms */}
      {step.education.keyTerms && step.education.keyTerms.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Key Terms</h3>
          <div className="space-y-2">
            {step.education.keyTerms.map((kt) => (
              <div key={kt.term} className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                <dt className="text-sm font-semibold text-indigo-800">{kt.term}</dt>
                <dd className="text-sm text-indigo-700 mt-0.5">{kt.definition}</dd>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deep Dive: Theory & Reactions (from Process Library) */}
      {matchedTemplate && (
        <div className="mb-5">
          <button
            onClick={() => setShowTheory(!showTheory)}
            className="w-full text-left bg-violet-50 border border-violet-200 rounded-lg p-3 hover:bg-violet-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-violet-800">
                  Deep Dive: Theory & Reactions
                </h3>
                <p className="text-xs text-violet-600 mt-0.5">
                  {matchedTemplate.theory.reactions.length} detailed reaction{matchedTemplate.theory.reactions.length !== 1 ? 's' : ''} · {matchedTemplate.theory.designVariables.length} design variable{matchedTemplate.theory.designVariables.length !== 1 ? 's' : ''}
                  {matchedTemplate.theory.variants ? ` · ${matchedTemplate.theory.variants.length} industrial variants` : ''}
                </p>
              </div>
              <span className="text-violet-400 text-xs">{showTheory ? '▼' : '▶'}</span>
            </div>
          </button>

          {showTheory && (
            <div className="mt-3 space-y-4">
              {/* Core Principle */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1">Core Principle</h4>
                <p className="text-sm text-indigo-900 leading-relaxed">{matchedTemplate.theory.principle}</p>
              </div>

              {/* Detailed Reactions */}
              {matchedTemplate.theory.reactions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Detailed Reactions</h4>
                  <div className="space-y-3">
                    {matchedTemplate.theory.reactions.map((reaction, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                        {/* Equation */}
                        <div className="bg-slate-900 text-emerald-300 rounded-md px-3 py-2 font-mono text-sm mb-2 overflow-x-auto">
                          {reaction.equation}
                        </div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-slate-800">{reaction.name}</span>
                          {reaction.deltaH !== undefined && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                              reaction.deltaH < 0
                                ? 'bg-red-50 text-red-700'
                                : reaction.deltaH > 0
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              ΔH = {reaction.deltaH > 0 ? '+' : ''}{reaction.deltaH} kJ/mol
                            </span>
                          )}
                        </div>
                        {reaction.temperatureRange && (
                          <div className="text-xs text-slate-500 mb-1">
                            Favored at: {reaction.temperatureRange[0]}–{reaction.temperatureRange[1]}°C
                          </div>
                        )}
                        {reaction.catalyst && (
                          <div className="text-xs text-slate-500 mb-1.5">Catalyst: {reaction.catalyst}</div>
                        )}
                        <p className="text-xs text-slate-700 leading-relaxed">{reaction.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Design Variables */}
              {matchedTemplate.theory.designVariables.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                    Design Variables — How Operating Parameters Affect Performance
                  </h4>
                  <div className="space-y-2">
                    {matchedTemplate.theory.designVariables.map((dv, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-slate-800">{dv.name}</span>
                          <span className="text-xs text-slate-400 font-mono">{dv.typicalRange}</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="text-slate-600">
                            <span className="text-slate-400">Effect of increase:</span> {dv.effectOfIncrease}
                          </div>
                          <div className="text-amber-700 bg-amber-50 rounded px-2 py-1">
                            <span className="font-medium">Tradeoff:</span> {dv.tradeoff}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants */}
              {matchedTemplate.theory.variants && matchedTemplate.theory.variants.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Industrial Variants</h4>
                  <ul className="space-y-1">
                    {matchedTemplate.theory.variants.map((v, i) => (
                      <li key={i} className="text-xs text-slate-700 flex gap-2">
                        <span className="text-slate-400 shrink-0">•</span>
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* References */}
              {matchedTemplate.theory.references && matchedTemplate.theory.references.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">References</h4>
                  <ul className="space-y-1">
                    {matchedTemplate.theory.references.map((ref, i) => (
                      <li key={i} className="text-xs text-slate-500 italic">{ref}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
