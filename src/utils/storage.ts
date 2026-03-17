import { Pathway } from '../types/pathway';

const STORAGE_KEY = 'fuels-creator-custom-pathways';

export function loadCustomPathways(): Pathway[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Pathway[];
  } catch {
    return [];
  }
}

export function saveCustomPathways(pathways: Pathway[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pathways));
}

export function saveCustomPathway(pathway: Pathway): void {
  const existing = loadCustomPathways();
  const idx = existing.findIndex((p) => p.id === pathway.id);
  if (idx >= 0) {
    existing[idx] = pathway;
  } else {
    existing.push(pathway);
  }
  saveCustomPathways(existing);
}

export function deleteCustomPathway(id: string): void {
  const existing = loadCustomPathways();
  saveCustomPathways(existing.filter((p) => p.id !== id));
}

let counter = 0;
export function generateId(prefix: string = 'node'): string {
  counter++;
  return `${prefix}-${Date.now()}-${counter}`;
}

export function createEmptyPathway(): Pathway {
  const id = generateId('pathway');
  return {
    id,
    name: 'New Custom Pathway',
    description: 'A custom fuel production pathway.',
    category: 'saf',
    steps: [],
    streams: [],
  };
}

export function createEmptyStep(nodeType: 'feedstock' | 'process' | 'product'): import('../types/pathway').ProcessStep {
  return {
    id: generateId(nodeType),
    name: nodeType === 'feedstock' ? 'New Feedstock' : nodeType === 'product' ? 'New Product' : 'New Process Step',
    nodeType,
    conditions: nodeType === 'process' ? { temperature: { value: 200, unit: '°C' }, pressure: { value: 1, unit: 'bar' } } : undefined,
    inputs: [],
    outputs: [],
    education: {
      summary: '',
      explanation: '',
    },
  };
}
