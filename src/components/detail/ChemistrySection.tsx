interface ChemistrySectionProps {
  chemistry: string;
  explanation: string;
}

export function ChemistrySection({ chemistry, explanation }: ChemistrySectionProps) {
  const reactions = chemistry.split('\n').filter((line) => line.trim());

  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">Chemistry</h3>

      {/* Reaction equations */}
      <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 mb-3 space-y-1.5">
        {reactions.map((reaction, i) => (
          <div key={i} className="font-mono text-xs text-violet-800 leading-relaxed">
            {reaction}
          </div>
        ))}
      </div>

      {/* Explanation */}
      <p className="text-sm text-slate-600 leading-relaxed">{explanation}</p>
    </div>
  );
}
