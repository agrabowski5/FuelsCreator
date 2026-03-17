import { Pathway, Stream } from '../../types/pathway';
import { generateId } from '../../utils/storage';

interface ConnectionEditorProps {
  pathway: Pathway;
  onChange: (pathway: Pathway) => void;
}

export function ConnectionEditor({ pathway, onChange }: ConnectionEditorProps) {
  const addStream = () => {
    const newStream: Stream = {
      id: generateId('stream'),
      from: pathway.steps[0]?.id ?? '',
      to: pathway.steps[1]?.id ?? pathway.steps[0]?.id ?? '',
      substance: 'Material',
      label: 'New Connection',
    };
    onChange({ ...pathway, streams: [...pathway.streams, newStream] });
  };

  const updateStream = (idx: number, partial: Partial<Stream>) => {
    const streams = [...pathway.streams];
    streams[idx] = { ...streams[idx], ...partial };
    // Auto-update label
    if (partial.substance || partial.massFlow) {
      const s = streams[idx];
      streams[idx].label = s.massFlow
        ? `${s.massFlow.value} ${s.massFlow.unit} ${s.substance}`
        : s.substance;
    }
    onChange({ ...pathway, streams });
  };

  const removeStream = (idx: number) => {
    onChange({ ...pathway, streams: pathway.streams.filter((_, i) => i !== idx) });
  };

  const stepOptions = pathway.steps.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.nodeType})`,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Connections</h3>
        <button
          onClick={addStream}
          disabled={pathway.steps.length < 2}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium disabled:text-slate-300 disabled:cursor-not-allowed"
        >
          + Add Connection
        </button>
      </div>

      {pathway.steps.length < 2 && (
        <p className="text-xs text-slate-400 italic mb-3">Add at least 2 stages to create connections</p>
      )}

      {pathway.streams.length === 0 && pathway.steps.length >= 2 && (
        <div className="text-center py-6">
          <p className="text-sm text-slate-400 mb-1">No connections yet</p>
          <p className="text-xs text-slate-400">Connect stages to define material flow</p>
        </div>
      )}

      <div className="space-y-3">
        {pathway.streams.map((stream, idx) => (
          <div key={stream.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Connection {idx + 1}</span>
              <button
                onClick={() => removeStream(idx)}
                className="text-red-400 hover:text-red-600 text-xs"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-xs text-slate-500">From</span>
                <select
                  value={stream.from}
                  onChange={(e) => updateStream(idx, { from: e.target.value })}
                  className="input-field text-xs"
                >
                  {stepOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-slate-500">To</span>
                <select
                  value={stream.to}
                  onChange={(e) => updateStream(idx, { to: e.target.value })}
                  className="input-field text-xs"
                >
                  {stepOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={stream.substance}
                onChange={(e) => updateStream(idx, { substance: e.target.value })}
                className="input-field flex-1 text-xs"
                placeholder="Substance"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                value={stream.massFlow?.value ?? ''}
                onChange={(e) => updateStream(idx, {
                  massFlow: e.target.value
                    ? { value: Number(e.target.value), unit: stream.massFlow?.unit ?? 'kg/h' }
                    : undefined,
                })}
                className="input-field flex-1 text-xs"
                placeholder="Mass flow"
              />
              <select
                value={stream.massFlow?.unit ?? 'kg/h'}
                onChange={(e) => updateStream(idx, {
                  massFlow: stream.massFlow ? { ...stream.massFlow, unit: e.target.value } : undefined,
                })}
                className="input-field w-20 text-xs"
              >
                <option value="kg/h">kg/h</option>
                <option value="ton/h">ton/h</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
