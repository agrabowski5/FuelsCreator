import { Handle, Position } from '@xyflow/react';
import { ProcessStep } from '../../../types/pathway';
import { useSelectedNode } from '../../../hooks/useSelectedNode';

interface ProductNodeProps {
  data: { step: ProcessStep };
}

export function ProductNode({ data }: ProductNodeProps) {
  const { step } = data;
  const { selectedStep, setSelectedNodeId } = useSelectedNode();
  const isSelected = selectedStep?.id === step.id;
  const input = step.inputs[0];

  return (
    <div
      onClick={() => setSelectedNodeId(step.id)}
      className={`bg-amber-50 border-2 rounded-xl shadow-md px-4 py-3 min-w-[180px] max-w-[220px] cursor-pointer transition-all
        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-300 shadow-lg' : 'border-amber-400 hover:border-amber-600 hover:shadow-lg'}`}
    >
      <Handle type="target" position={Position.Left} className="!bg-amber-500 !w-3 !h-3" />

      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
        <div className="font-semibold text-sm text-slate-800">{step.name}</div>
      </div>

      {input?.massFlow && (
        <div className="text-xs text-amber-700">
          {input.massFlow.value.toLocaleString()} {input.massFlow.unit}
        </div>
      )}

      <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{step.education.summary}</div>
    </div>
  );
}
