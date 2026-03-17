export function formatTemperature(value: number, unit: string): string {
  return `${value} ${unit}`;
}

export function formatPressure(value: number, unit: string): string {
  return `${value} ${unit}`;
}

export function formatMassFlow(value: number, unit: string): string {
  return `${value.toLocaleString()} ${unit}`;
}

export function formatEnergy(value: number, unit: string, source?: string): string {
  const base = `${value} ${unit}`;
  return source ? `${base} (${source})` : base;
}
