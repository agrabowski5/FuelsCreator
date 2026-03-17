import { Handle, Position } from '@xyflow/react';
import { ProcessStep } from '../../../types/pathway';
import { useSelectedNode } from '../../../hooks/useSelectedNode';

interface ProcessNodeProps {
  data: { step: ProcessStep };
  selected?: boolean;
}

export function ProcessNode({ data }: ProcessNodeProps) {
  const { step } = data;
  const { selectedStep, setSelectedNodeId } = useSelectedNode();
  const isSelected = selectedStep?.id === step.id;

  const conditionBadge = step.conditions
    ? [
        step.conditions.temperature && `${step.conditions.temperature.value} ${step.conditions.temperature.unit}`,
        step.conditions.pressure && `${step.conditions.pressure.value} ${step.conditions.pressure.unit}`,
      ]
        .filter(Boolean)
        .join(' / ')
    : null;

  const energyBadge = step.energyInput
    ? `${step.energyInput.value} ${step.energyInput.unit} in`
    : step.energyOutput
    ? `${step.energyOutput.value} ${step.energyOutput.unit} out`
    : null;

  return (
    <div
      onClick={() => setSelectedNodeId(step.id)}
      className={`bg-sky-50 border-2 rounded-xl shadow-md px-4 py-3 min-w-[220px] max-w-[260px] cursor-pointer transition-all
        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-300 shadow-lg' : 'border-sky-400 hover:border-sky-600 hover:shadow-lg'}`}
    >
      <Handle type="target" position={Position.Left} className="!bg-sky-500 !w-3 !h-3" />

      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
        <div className="font-semibold text-sm text-slate-800 leading-tight">{step.name}</div>
      </div>

      {conditionBadge && (
        <div className="text-xs text-sky-700 bg-sky-100 rounded-md px-2 py-0.5 inline-block mb-1">
          {conditionBadge}
        </div>
      )}

      {step.conditions?.catalyst && (
        <div className="text-xs text-slate-500 truncate" title={step.conditions.catalyst}>
          Cat: {step.conditions.catalyst}
        </div>
      )}

      {energyBadge && (
        <div className={`text-xs mt-1 px-2 py-0.5 rounded-md inline-block ${
          step.energyOutput ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {step.energyOutput ? '⚡ ' : '🔥 '}{energyBadge}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!bg-sky-500 !w-3 !h-3" />
    </div>
  );
}
