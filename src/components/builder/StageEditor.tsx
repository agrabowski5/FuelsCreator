import { useState } from 'react';
import { ProcessStep, MaterialPort, EnergyFlow } from '../../types/pathway';
import { generateId } from '../../utils/storage';

interface StageEditorProps {
  step: ProcessStep;
  onChange: (updated: ProcessStep) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function StageEditor({ step, onChange, onDelete, onClose }: StageEditorProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'conditions' | 'io' | 'energy' | 'education'>('general');

  const update = (partial: Partial<ProcessStep>) => {
    onChange({ ...step, ...partial });
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Edit Stage</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-4 bg-slate-100 rounded-lg p-1">
        {(['general', 'conditions', 'io', 'energy', 'education'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs px-3 py-1.5 rounded-md capitalize transition-colors ${
              activeTab === tab ? 'bg-white text-slate-900 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'io' ? 'I/O' : tab}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-3">
          <Field label="Name">
            <input
              type="text"
              value={step.name}
              onChange={(e) => update({ name: e.target.value })}
              className="input-field"
            />
          </Field>
          <Field label="Type">
            <select
              value={step.nodeType}
              onChange={(e) => update({ nodeType: e.target.value as ProcessStep['nodeType'] })}
              className="input-field"
            >
              <option value="feedstock">Feedstock</option>
              <option value="process">Process</option>
              <option value="product">Product</option>
            </select>
          </Field>
          <Field label="Summary">
            <textarea
              value={step.education.summary}
              onChange={(e) => update({ education: { ...step.education, summary: e.target.value } })}
              className="input-field min-h-[60px]"
              rows={2}
            />
          </Field>
          <button
            onClick={onDelete}
            className="w-full mt-4 text-sm text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 rounded-lg px-3 py-2 transition-colors"
          >
            Delete Stage
          </button>
        </div>
      )}

      {/* Conditions Tab */}
      {activeTab === 'conditions' && (
        <div className="space-y-3">
          <Field label="Temperature">
            <div className="flex gap-2">
              <input
                type="number"
                value={step.conditions?.temperature?.value ?? ''}
                onChange={(e) => update({
                  conditions: {
                    ...step.conditions,
                    temperature: e.target.value ? { value: Number(e.target.value), unit: step.conditions?.temperature?.unit ?? '°C' } : undefined,
                  },
                })}
                className="input-field flex-1"
                placeholder="e.g. 350"
              />
              <select
                value={step.conditions?.temperature?.unit ?? '°C'}
                onChange={(e) => update({
                  conditions: {
                    ...step.conditions,
                    temperature: step.conditions?.temperature
                      ? { ...step.conditions.temperature, unit: e.target.value }
                      : undefined,
                  },
                })}
                className="input-field w-20"
              >
                <option value="°C">°C</option>
                <option value="°F">°F</option>
                <option value="K">K</option>
              </select>
            </div>
          </Field>
          <Field label="Pressure">
            <div className="flex gap-2">
              <input
                type="number"
                value={step.conditions?.pressure?.value ?? ''}
                onChange={(e) => update({
                  conditions: {
                    ...step.conditions,
                    pressure: e.target.value ? { value: Number(e.target.value), unit: step.conditions?.pressure?.unit ?? 'bar' } : undefined,
                  },
                })}
                className="input-field flex-1"
                placeholder="e.g. 50"
              />
              <select
                value={step.conditions?.pressure?.unit ?? 'bar'}
                onChange={(e) => update({
                  conditions: {
                    ...step.conditions,
                    pressure: step.conditions?.pressure
                      ? { ...step.conditions.pressure, unit: e.target.value }
                      : undefined,
                  },
                })}
                className="input-field w-20"
              >
                <option value="bar">bar</option>
                <option value="atm">atm</option>
                <option value="MPa">MPa</option>
                <option value="psi">psi</option>
              </select>
            </div>
          </Field>
          <Field label="Catalyst">
            <input
              type="text"
              value={step.conditions?.catalyst ?? ''}
              onChange={(e) => update({
                conditions: { ...step.conditions, catalyst: e.target.value || undefined },
              })}
              className="input-field"
              placeholder="e.g. NiMo/Al₂O₃"
            />
          </Field>
          <Field label="Residence Time">
            <input
              type="text"
              value={step.conditions?.residenceTime ?? ''}
              onChange={(e) => update({
                conditions: { ...step.conditions, residenceTime: e.target.value || undefined },
              })}
              className="input-field"
              placeholder="e.g. 1-2 hours"
            />
          </Field>
        </div>
      )}

      {/* I/O Tab */}
      {activeTab === 'io' && (
        <div className="space-y-4">
          <PortList
            label="Inputs"
            ports={step.inputs}
            onChange={(inputs) => update({ inputs })}
            color="emerald"
          />
          <PortList
            label="Outputs"
            ports={step.outputs}
            onChange={(outputs) => update({ outputs })}
            color="amber"
          />
        </div>
      )}

      {/* Energy Tab */}
      {activeTab === 'energy' && (
        <div className="space-y-4">
          <EnergyEditor
            label="Energy Input"
            energy={step.energyInput}
            onChange={(energyInput) => update({ energyInput })}
          />
          <EnergyEditor
            label="Energy Output"
            energy={step.energyOutput}
            onChange={(energyOutput) => update({ energyOutput })}
          />
        </div>
      )}

      {/* Education Tab */}
      {activeTab === 'education' && (
        <div className="space-y-3">
          <Field label="Summary">
            <textarea
              value={step.education.summary}
              onChange={(e) => update({ education: { ...step.education, summary: e.target.value } })}
              className="input-field min-h-[60px]"
              rows={2}
            />
          </Field>
          <Field label="Chemistry / Reactions">
            <textarea
              value={step.education.chemistry ?? ''}
              onChange={(e) => update({ education: { ...step.education, chemistry: e.target.value || undefined } })}
              className="input-field font-mono text-xs min-h-[80px]"
              rows={3}
              placeholder="e.g. CO₂ + H₂ → CO + H₂O"
            />
          </Field>
          <Field label="Detailed Explanation">
            <textarea
              value={step.education.explanation}
              onChange={(e) => update({ education: { ...step.education, explanation: e.target.value } })}
              className="input-field min-h-[100px]"
              rows={4}
            />
          </Field>
          <Field label="Engineering Notes">
            <textarea
              value={step.education.engineeringNotes ?? ''}
              onChange={(e) => update({ education: { ...step.education, engineeringNotes: e.target.value || undefined } })}
              className="input-field min-h-[80px]"
              rows={3}
            />
          </Field>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600 mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function PortList({
  label,
  ports,
  onChange,
  color,
}: {
  label: string;
  ports: MaterialPort[];
  onChange: (ports: MaterialPort[]) => void;
  color: string;
}) {
  const addPort = () => {
    onChange([...ports, { streamId: generateId('stream'), substance: '', phase: 'liquid' }]);
  };

  const updatePort = (idx: number, partial: Partial<MaterialPort>) => {
    const updated = [...ports];
    updated[idx] = { ...updated[idx], ...partial };
    onChange(updated);
  };

  const removePort = (idx: number) => {
    onChange(ports.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className={`text-xs font-semibold text-${color}-700 uppercase tracking-wide`}>{label}</h4>
        <button onClick={addPort} className={`text-xs text-${color}-600 hover:text-${color}-800 font-medium`}>
          + Add
        </button>
      </div>
      {ports.length === 0 && (
        <p className="text-xs text-slate-400 italic">No {label.toLowerCase()} defined</p>
      )}
      <div className="space-y-2">
        {ports.map((port, idx) => (
          <div key={idx} className={`bg-${color}-50 border border-${color}-200 rounded-lg p-2 space-y-2`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={port.substance}
                onChange={(e) => updatePort(idx, { substance: e.target.value })}
                className="input-field flex-1 text-xs"
                placeholder="Substance name"
              />
              <button onClick={() => removePort(idx)} className="text-red-400 hover:text-red-600 text-xs px-1">&times;</button>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={port.massFlow?.value ?? ''}
                onChange={(e) => updatePort(idx, {
                  massFlow: e.target.value
                    ? { value: Number(e.target.value), unit: port.massFlow?.unit ?? 'kg/h' }
                    : undefined,
                })}
                className="input-field flex-1 text-xs"
                placeholder="Mass flow"
              />
              <select
                value={port.massFlow?.unit ?? 'kg/h'}
                onChange={(e) => updatePort(idx, {
                  massFlow: port.massFlow ? { ...port.massFlow, unit: e.target.value } : undefined,
                })}
                className="input-field w-20 text-xs"
              >
                <option value="kg/h">kg/h</option>
                <option value="ton/h">ton/h</option>
              </select>
              <select
                value={port.phase ?? 'liquid'}
                onChange={(e) => updatePort(idx, { phase: e.target.value as MaterialPort['phase'] })}
                className="input-field w-20 text-xs"
              >
                <option value="liquid">Liquid</option>
                <option value="gas">Gas</option>
                <option value="solid">Solid</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnergyEditor({
  label,
  energy,
  onChange,
}: {
  label: string;
  energy?: EnergyFlow;
  onChange: (energy?: EnergyFlow) => void;
}) {
  const hasEnergy = energy != null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wide">{label}</h4>
        <button
          onClick={() => onChange(hasEnergy ? undefined : { value: 0, unit: 'MW' })}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          {hasEnergy ? 'Remove' : '+ Add'}
        </button>
      </div>
      {energy && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              value={energy.value}
              onChange={(e) => onChange({ ...energy, value: Number(e.target.value) })}
              className="input-field flex-1 text-xs"
              placeholder="Value"
            />
            <select
              value={energy.unit}
              onChange={(e) => onChange({ ...energy, unit: e.target.value })}
              className="input-field w-20 text-xs"
            >
              <option value="MW">MW</option>
              <option value="kW">kW</option>
              <option value="MJ">MJ</option>
              <option value="kWh">kWh</option>
            </select>
          </div>
          <input
            type="text"
            value={energy.source ?? ''}
            onChange={(e) => onChange({ ...energy, source: e.target.value || undefined })}
            className="input-field text-xs"
            placeholder="Source (e.g. steam, electricity, exothermic)"
          />
        </div>
      )}
    </div>
  );
}
