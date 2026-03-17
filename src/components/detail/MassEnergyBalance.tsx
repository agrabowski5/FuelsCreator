import { ProcessStep } from '../../types/pathway';

interface MassEnergyBalanceProps {
  step: ProcessStep;
}

export function MassEnergyBalance({ step }: MassEnergyBalanceProps) {
  const hasInputs = step.inputs.length > 0;
  const hasOutputs = step.outputs.length > 0;
  const hasEnergy = step.energyInput || step.energyOutput;

  if (!hasInputs && !hasOutputs && !hasEnergy) return null;

  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">Mass & Energy Balance</h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Inputs */}
        {hasInputs && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-emerald-700 mb-1.5 uppercase tracking-wide">Inputs</h4>
            <ul className="space-y-1">
              {step.inputs.map((port, i) => (
                <li key={i} className="text-xs text-slate-700">
                  <span className="font-medium">{port.substance}</span>
                  {port.massFlow && (
                    <span className="text-slate-500 ml-1">
                      {port.massFlow.value.toLocaleString()} {port.massFlow.unit}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Outputs */}
        {hasOutputs && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-amber-700 mb-1.5 uppercase tracking-wide">Outputs</h4>
            <ul className="space-y-1">
              {step.outputs.map((port, i) => (
                <li key={i} className="text-xs text-slate-700">
                  <span className="font-medium">{port.substance}</span>
                  {port.massFlow && (
                    <span className="text-slate-500 ml-1">
                      {port.massFlow.value.toLocaleString()} {port.massFlow.unit}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Energy */}
      {hasEnergy && (
        <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wide">Energy</h4>
          {step.energyInput && (
            <p className="text-xs text-slate-700">
              <span className="font-medium">Input:</span> {step.energyInput.value} {step.energyInput.unit}
              {step.energyInput.source && <span className="text-slate-500"> ({step.energyInput.source})</span>}
            </p>
          )}
          {step.energyOutput && (
            <p className="text-xs text-slate-700">
              <span className="font-medium">Output:</span> {step.energyOutput.value} {step.energyOutput.unit}
              {step.energyOutput.source && <span className="text-slate-500"> ({step.energyOutput.source})</span>}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
