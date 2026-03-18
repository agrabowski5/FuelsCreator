import { ProcessTemplate, Reaction, DesignVariable } from '../../data/process-library';

interface TheoryPanelProps {
  template: ProcessTemplate;
}

export function TheoryPanel({ template }: TheoryPanelProps) {
  const { theory } = template;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{template.name}</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {template.commonPathways.join(' · ')}
        </p>
      </div>

      {/* Core Principle */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
        <h4 className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1">Core Principle</h4>
        <p className="text-sm text-indigo-900 leading-relaxed">{theory.principle}</p>
      </div>

      {/* Full Education Content */}
      <div>
        <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Overview</h4>
        <p className="text-sm text-slate-700 leading-relaxed">{template.template.education.explanation}</p>
      </div>

      {/* Chemistry */}
      {template.template.education.chemistry && (
        <div>
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Chemistry</h4>
          <pre className="text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-3 whitespace-pre-wrap font-mono leading-relaxed">
            {template.template.education.chemistry}
          </pre>
        </div>
      )}

      {/* Detailed Reactions */}
      {theory.reactions.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
            Detailed Reactions ({theory.reactions.length})
          </h4>
          <div className="space-y-3">
            {theory.reactions.map((reaction, idx) => (
              <ReactionCard key={idx} reaction={reaction} />
            ))}
          </div>
        </div>
      )}

      {/* Design Variables */}
      {theory.designVariables.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
            Design Variables — How Operating Parameters Affect Performance
          </h4>
          <div className="space-y-2">
            {theory.designVariables.map((dv, idx) => (
              <DesignVariableCard key={idx} variable={dv} />
            ))}
          </div>
        </div>
      )}

      {/* Variants */}
      {theory.variants && theory.variants.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Industrial Variants</h4>
          <ul className="space-y-1">
            {theory.variants.map((v, i) => (
              <li key={i} className="text-xs text-slate-700 flex gap-2">
                <span className="text-slate-400 shrink-0">•</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Engineering Notes */}
      {template.template.education.engineeringNotes && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Engineering Notes</h4>
          <p className="text-xs text-amber-900 leading-relaxed">{template.template.education.engineeringNotes}</p>
        </div>
      )}

      {/* Key Terms */}
      {template.template.education.keyTerms && template.template.education.keyTerms.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Key Terms</h4>
          <div className="space-y-2">
            {template.template.education.keyTerms.map((kt, i) => (
              <div key={i} className="bg-slate-50 rounded-lg px-3 py-2">
                <span className="text-xs font-semibold text-slate-800">{kt.term}</span>
                <p className="text-xs text-slate-600 mt-0.5">{kt.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {theory.references && theory.references.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">References</h4>
          <ul className="space-y-1">
            {theory.references.map((ref, i) => (
              <li key={i} className="text-xs text-slate-500 italic">{ref}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ReactionCard({ reaction }: { reaction: Reaction }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3">
      {/* Equation */}
      <div className="bg-slate-900 text-emerald-300 rounded-md px-3 py-2 font-mono text-sm mb-2 overflow-x-auto">
        {reaction.equation}
      </div>

      {/* Name and metadata */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-semibold text-slate-800">{reaction.name}</span>
        {reaction.deltaH !== undefined && (
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
            reaction.deltaH < 0
              ? 'bg-red-50 text-red-700'
              : reaction.deltaH > 0
              ? 'bg-blue-50 text-blue-700'
              : 'bg-slate-100 text-slate-600'
          }`}>
            {reaction.deltaH < 0 ? 'Exothermic' : reaction.deltaH > 0 ? 'Endothermic' : 'Thermoneutral'}: ΔH = {reaction.deltaH > 0 ? '+' : ''}{reaction.deltaH} kJ/mol
          </span>
        )}
      </div>

      {reaction.deltaG !== undefined && (
        <div className="text-xs text-slate-500 mb-1">
          ΔG° = {reaction.deltaG > 0 ? '+' : ''}{reaction.deltaG} kJ/mol
        </div>
      )}

      {reaction.temperatureRange && (
        <div className="text-xs text-slate-500 mb-1">
          Temperature range: {reaction.temperatureRange[0]}–{reaction.temperatureRange[1]}°C
        </div>
      )}

      {reaction.catalyst && (
        <div className="text-xs text-slate-500 mb-1.5">
          Catalyst: {reaction.catalyst}
        </div>
      )}

      {/* Description */}
      <p className="text-xs text-slate-700 leading-relaxed">{reaction.description}</p>
    </div>
  );
}

function DesignVariableCard({ variable }: { variable: DesignVariable }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-800">{variable.name}</span>
        <span className="text-xs text-slate-400 font-mono">{variable.typicalRange}</span>
      </div>
      <div className="space-y-1 text-xs">
        <div className="text-slate-600">
          <span className="text-slate-400">Effect of increase:</span> {variable.effectOfIncrease}
        </div>
        <div className="text-amber-700 bg-amber-50 rounded px-2 py-1">
          <span className="font-medium">Tradeoff:</span> {variable.tradeoff}
        </div>
      </div>
    </div>
  );
}
