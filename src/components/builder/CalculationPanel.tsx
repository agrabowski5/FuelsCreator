import { useState, useMemo } from 'react';
import { Pathway } from '../../types/pathway';
import { calculateForward, calculateBackward, PathwayCalculation } from '../../utils/calculate';

interface CalculationPanelProps {
  pathway: Pathway;
}

export function CalculationPanel({ pathway }: CalculationPanelProps) {
  const [mode, setMode] = useState<'forward' | 'backward'>('forward');
  const [targetProductId, setTargetProductId] = useState<string>('');
  const [targetMass, setTargetMass] = useState<number>(1000);

  const products = pathway.steps.filter((s) => s.nodeType === 'product');
  const hasSteps = pathway.steps.length > 0 && pathway.streams.length > 0;

  const calculation = useMemo<PathwayCalculation | null>(() => {
    if (!hasSteps) return null;
    try {
      if (mode === 'forward') {
        return calculateForward(pathway);
      } else {
        const prodId = targetProductId || products[0]?.id;
        if (!prodId) return null;
        return calculateBackward(pathway, prodId, targetMass);
      }
    } catch {
      return null;
    }
  }, [pathway, mode, targetProductId, targetMass, hasSteps, products]);

  if (!hasSteps) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-slate-400 mb-2">No calculation possible</p>
        <p className="text-xs text-slate-400">Add stages and connections first, then run calculations</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Calculation Mode</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('forward')}
            className={`flex-1 text-xs px-3 py-2 rounded-lg border transition-colors ${
              mode === 'forward'
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-medium'
                : 'border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            Forward
            <span className="block text-xs opacity-70 mt-0.5">Feedstock → Products</span>
          </button>
          <button
            onClick={() => setMode('backward')}
            className={`flex-1 text-xs px-3 py-2 rounded-lg border transition-colors ${
              mode === 'backward'
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-medium'
                : 'border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            Backward
            <span className="block text-xs opacity-70 mt-0.5">Products → Feedstock</span>
          </button>
        </div>
      </div>

      {/* Backward mode config */}
      {mode === 'backward' && (
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 space-y-2">
          <label className="block">
            <span className="text-xs font-medium text-violet-700">Target Product</span>
            <select
              value={targetProductId || products[0]?.id || ''}
              onChange={(e) => setTargetProductId(e.target.value)}
              className="input-field text-xs mt-1"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-violet-700">Desired Output (kg/h)</span>
            <input
              type="number"
              value={targetMass}
              onChange={(e) => setTargetMass(Number(e.target.value))}
              className="input-field text-xs mt-1"
            />
          </label>
        </div>
      )}

      {/* Results */}
      {calculation && (
        <div className="space-y-3">
          {/* Overall metrics */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Overall Metrics</h4>
            <div className="grid grid-cols-2 gap-2">
              <MetricCard label="Overall Yield" value={`${(calculation.overallYield * 100).toFixed(1)}%`} />
              <MetricCard label="Net Energy" value={`${calculation.overallEnergy.toFixed(2)} MW`} />
            </div>
          </div>

          {/* Per-step breakdown */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Step-by-Step Breakdown</h4>
            <div className="space-y-2">
              {pathway.steps.map((step) => {
                const calc = calculation.steps.get(step.id);
                if (!calc) return null;
                return (
                  <StepCalcCard key={step.id} step={step} calc={calc} />
                );
              })}
            </div>
          </div>

          {/* Stream flows */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Stream Flows</h4>
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-3 py-1.5 font-medium text-slate-600">Stream</th>
                    <th className="text-right px-3 py-1.5 font-medium text-slate-600">Calculated</th>
                    <th className="text-right px-3 py-1.5 font-medium text-slate-600">Defined</th>
                  </tr>
                </thead>
                <tbody>
                  {pathway.streams.map((stream) => {
                    const calc = calculation.streams.get(stream.id);
                    return (
                      <tr key={stream.id} className="border-b border-slate-100 last:border-0">
                        <td className="px-3 py-1.5 text-slate-700">{stream.substance}</td>
                        <td className="px-3 py-1.5 text-right text-slate-800 font-medium">
                          {calc ? `${calc.mass.toFixed(1)} kg/h` : '—'}
                        </td>
                        <td className="px-3 py-1.5 text-right text-slate-500">
                          {stream.massFlow ? `${stream.massFlow.value} ${stream.massFlow.unit}` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Warnings */}
          {calculation.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-yellow-700 mb-1">Warnings</h4>
              {calculation.warnings.map((w, i) => (
                <p key={i} className="text-xs text-yellow-600">{w}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-md border border-slate-200 px-3 py-2 text-center">
      <div className="text-lg font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function StepCalcCard({
  step,
  calc,
}: {
  step: import('../../types/pathway').ProcessStep;
  calc: import('../../utils/calculate').StepCalculation;
}) {
  const typeColors: Record<string, string> = {
    feedstock: 'border-l-emerald-500',
    process: 'border-l-sky-500',
    product: 'border-l-amber-500',
  };

  return (
    <div className={`border-l-4 ${typeColors[step.nodeType]} bg-white border border-slate-200 rounded-r-lg p-2`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-800">{step.name}</span>
        <span className={`text-xs font-medium ${
          calc.efficiency >= 0.9 ? 'text-emerald-600' : calc.efficiency >= 0.7 ? 'text-amber-600' : 'text-red-600'
        }`}>
          {(calc.efficiency * 100).toFixed(1)}% eff.
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1 text-xs">
        <div>
          <span className="text-slate-400">In:</span>{' '}
          <span className="text-slate-700">{calc.totalMassIn.toFixed(1)}</span>
        </div>
        <div>
          <span className="text-slate-400">Out:</span>{' '}
          <span className="text-slate-700">{calc.totalMassOut.toFixed(1)}</span>
        </div>
        <div>
          <span className="text-slate-400">Loss:</span>{' '}
          <span className="text-slate-700">{calc.massLoss.toFixed(1)}</span>
        </div>
      </div>
      {(calc.totalEnergyIn > 0 || calc.totalEnergyOut > 0) && (
        <div className="text-xs mt-1 text-blue-600">
          Energy: {calc.totalEnergyIn > 0 ? `${calc.totalEnergyIn.toFixed(2)} MW in` : ''}
          {calc.totalEnergyIn > 0 && calc.totalEnergyOut > 0 ? ' / ' : ''}
          {calc.totalEnergyOut > 0 ? `${calc.totalEnergyOut.toFixed(2)} MW out` : ''}
        </div>
      )}
    </div>
  );
}
