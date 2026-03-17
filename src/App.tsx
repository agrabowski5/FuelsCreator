import { useState, useMemo, useCallback, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { usePathway } from './hooks/usePathway';
import { SelectedNodeContext } from './hooks/useSelectedNode';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PathwayCanvas } from './components/flow/PathwayCanvas';
import { ProcessStep } from './types/pathway';

function App() {
  const { pathway, pathwayList, setPathwayId } = usePathway();
  const [selectedNodeId, setSelectedNodeIdState] = useState<string | null>(null);

  const selectedStep = useMemo<ProcessStep | null>(() => {
    if (!selectedNodeId) return null;
    return pathway.steps.find((s) => s.id === selectedNodeId) ?? null;
  }, [selectedNodeId, pathway]);

  const setSelectedNodeId = useCallback((id: string | null) => {
    setSelectedNodeIdState(id);
  }, []);

  // Listen for selectNode events from sidebar step list
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSelectedNodeIdState(customEvent.detail);
    };
    window.addEventListener('selectNode', handler);
    return () => window.removeEventListener('selectNode', handler);
  }, []);

  const contextValue = useMemo(
    () => ({ selectedStep, setSelectedNodeId }),
    [selectedStep, setSelectedNodeId]
  );

  return (
    <SelectedNodeContext.Provider value={contextValue}>
      <div className="h-full flex flex-col bg-slate-50">
        <Header
          pathway={pathway}
          pathwayList={pathwayList}
          onPathwayChange={setPathwayId}
        />
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 min-w-0">
            <ReactFlowProvider>
              <PathwayCanvas pathway={pathway} />
            </ReactFlowProvider>
          </div>
          <Sidebar pathway={pathway} />
        </div>
      </div>
    </SelectedNodeContext.Provider>
  );
}

export default App;
