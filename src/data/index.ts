import { Pathway } from '../types/pathway';
import { hefaTallow } from './hefa-tallow';
import { fischerTropschGreenH2 } from './fischer-tropsch-green-h2';
import { conventionalJet } from './conventional-jet';

export const pathways: Pathway[] = [
  hefaTallow,
  fischerTropschGreenH2,
  conventionalJet,
];

export const getPathwayById = (id: string): Pathway | undefined =>
  pathways.find((p) => p.id === id);
