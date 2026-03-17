import { useState, useMemo } from 'react';
import { pathways, getPathwayById } from '../data';
import { Pathway } from '../types/pathway';

export function usePathway() {
  const [currentPathwayId, setPathwayId] = useState<string>(pathways[0].id);

  const pathway = useMemo<Pathway>(
    () => getPathwayById(currentPathwayId) ?? pathways[0],
    [currentPathwayId]
  );

  return {
    pathway,
    pathwayList: pathways,
    setPathwayId,
  };
}
