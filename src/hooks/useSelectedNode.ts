import { createContext, useContext } from 'react';
import { ProcessStep } from '../types/pathway';

interface SelectedNodeContextType {
  selectedStep: ProcessStep | null;
  setSelectedNodeId: (id: string | null) => void;
}

export const SelectedNodeContext = createContext<SelectedNodeContextType>({
  selectedStep: null,
  setSelectedNodeId: () => {},
});

export function useSelectedNode() {
  return useContext(SelectedNodeContext);
}
