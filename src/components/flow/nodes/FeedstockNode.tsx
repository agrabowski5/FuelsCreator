import { Handle, Position } from '@xyflow/react';
import { ProcessStep } from '../../../types/pathway';
import { useSelectedNode } from '../../../hooks/useSelectedNode';

interface FeedstockNodeProps {
  data: { step: ProcessStep };
}

export function FeedstockNode({ data }: FeedstockNodeProps) {
  const { step } = data;
  const { selectedStep, setSelectedNodeId } = useSelectedNode();
  const isSelected = selectedStep?.id === step.id;
  const output = step.outputs[0];

  return (
    <div
      onClick={() => setSelectedNodeId(step.id)}
      className={`bg-emerald-50 border-2 rounded-xl shadow-md px-4 py-3 min-w-[180px] max-w-[220px] cursor-pointer transition-all
        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-300 shadow-lg' : 'border-emerald-400 hover:border-emerald-600 hover:shadow-lg'}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        <div className="font-semibold text-sm text-slate-800">{step.name}</div>
      </div>

      {output && (
        <div className="text-xs text-emerald-700">
          {output.massFlow && `${output.massFlow.value.toLocaleString()} ${output.massFlow.unit}`}
          {output.phase && ` · ${output.phase}`}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!bg-emerald-500 !w-3 !h-3" />
    </div>
  );
}
