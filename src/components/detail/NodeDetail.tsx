import { ProcessStep } from '../../types/pathway';
import { ProcessConditions } from './ProcessConditions';
import { MassEnergyBalance } from './MassEnergyBalance';
import { ChemistrySection } from './ChemistrySection';
import { useSelectedNode } from '../../hooks/useSelectedNode';

interface NodeDetailProps {
  step: ProcessStep;
}

const nodeTypeStyles: Record<string, { bg: string; accent: string; label: string }> = {
  feedstock: { bg: 'bg-emerald-50', accent: 'text-emerald-700', label: 'Feedstock' },
  process: { bg: 'bg-sky-50', accent: 'text-sky-700', label: 'Process Step' },
  product: { bg: 'bg-amber-50', accent: 'text-amber-700', label: 'Product' },
};

export function NodeDetail({ step }: NodeDetailProps) {
  const { setSelectedNodeId } = useSelectedNode();
  const style = nodeTypeStyles[step.nodeType] ?? nodeTypeStyles.process;

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
    </div>
  );
}
