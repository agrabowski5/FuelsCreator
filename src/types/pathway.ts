export interface Pathway {
  id: string;
  name: string;
  description: string;
  category: 'saf' | 'conventional' | 'synthetic';
  steps: ProcessStep[];
  streams: Stream[];
}

export interface ProcessStep {
  id: string;
  name: string;
  nodeType: 'feedstock' | 'process' | 'product';
  conditions?: ProcessConditions;
  inputs: MaterialPort[];
  outputs: MaterialPort[];
  energyInput?: EnergyFlow;
  energyOutput?: EnergyFlow;
  education: EducationContent;
}

export interface ProcessConditions {
  temperature?: { value: number; unit: string };
  pressure?: { value: number; unit: string };
  catalyst?: string;
  residenceTime?: string;
}

export interface MaterialPort {
  streamId: string;
  substance: string;
  massFlow?: { value: number; unit: string };
  phase?: 'gas' | 'liquid' | 'solid' | 'mixed';
}

export interface Stream {
  id: string;
  from: string;
  to: string;
  substance: string;
  massFlow?: { value: number; unit: string };
  energyContent?: { value: number; unit: string };
  label?: string;
}

export interface EnergyFlow {
  value: number;
  unit: string;
  source?: string;
}

export interface EducationContent {
  summary: string;
  chemistry?: string;
  explanation: string;
  engineeringNotes?: string;
  keyTerms?: { term: string; definition: string }[];
}
