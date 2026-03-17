import { ProcessConditions as ConditionsType } from '../../types/pathway';

interface ProcessConditionsProps {
  conditions: ConditionsType;
}

export function ProcessConditions({ conditions }: ProcessConditionsProps) {
  const rows: { label: string; value: string }[] = [];

  if (conditions.temperature) {
    rows.push({ label: 'Temperature', value: `${conditions.temperature.value} ${conditions.temperature.unit}` });
  }
  if (conditions.pressure) {
    rows.push({ label: 'Pressure', value: `${conditions.pressure.value} ${conditions.pressure.unit}` });
  }
  if (conditions.catalyst) {
    rows.push({ label: 'Catalyst', value: conditions.catalyst });
  }
  if (conditions.residenceTime) {
    rows.push({ label: 'Residence Time', value: conditions.residenceTime });
  }

  if (rows.length === 0) return null;

  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">Operating Conditions</h3>
      <div className="bg-sky-50 border border-sky-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-sky-100 last:border-0">
                <td className="px-3 py-2 text-sky-700 font-medium w-1/3">{row.label}</td>
                <td className="px-3 py-2 text-slate-700">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
