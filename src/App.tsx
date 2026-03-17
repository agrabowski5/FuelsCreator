import { useState, useMemo, useCallback, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { SelectedNodeContext } from './hooks/useSelectedNode';
import { Header, AppMode } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PathwayCanvas } from './components/flow/PathwayCanvas';
import { BuilderSidebar } from './components/builder/BuilderSidebar';
import { Pathway, ProcessStep } from './types/pathway';
import { pathways as builtInPathways } from './data';
import {
  loadCustomPathways,
  saveCustomPathway,
  deleteCustomPathway,
  createEmptyPathway,
} from './utils/storage';

function App() {
  const [mode, setMode] = useState<AppMode>('explore');
  const [customPathways, setCustomPathways] = useState<Pathway[]>(() => loadCustomPathways());
  const [currentPathwayId, setCurrentPathwayId] = useState<string>(builtInPathways[0].id);
  const [selectedNodeId, setSelectedNodeIdState] = useState<string | null>(null);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  // Find the current pathway from either built-in or custom
  const allPathways = useMemo(() => [...builtInPathways, ...customPathways], [customPathways]);
  const pathway = useMemo(
    () => allPathways.find((p) => p.id === currentPathwayId) ?? builtInPathways[0],
    [currentPathwayId, allPathways]
  );
  const isCustom = customPathways.some((p) => p.id === currentPathwayId);

  // Selected step for explore mode
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
      if (mode === 'explore') {
        setSelectedNodeIdState(customEvent.detail);
      } else {
        setEditingStepId(customEvent.detail);
      }
    };
    window.addEventListener('selectNode', handler);
    return () => window.removeEventListener('selectNode', handler);
  }, [mode]);

  const contextValue = useMemo(
    () => ({ selectedStep, setSelectedNodeId }),
    [selectedStep, setSelectedNodeId]
  );

  // Custom pathway CRUD
  const handleUpdateCustomPathway = useCallback((updated: Pathway) => {
    saveCustomPathway(updated);
    setCustomPathways(loadCustomPathways());
  }, []);

  const handleNewPathway = useCallback(() => {
    const newPathway = createEmptyPathway();
    saveCustomPathway(newPathway);
    setCustomPathways(loadCustomPathways());
    setCurrentPathwayId(newPathway.id);
    setMode('build');
    setEditingStepId(null);
  }, []);

  const handleDuplicatePathway = useCallback(() => {
    const duplicate: Pathway = {
      ...JSON.parse(JSON.stringify(pathway)),
      id: `custom-${Date.now()}`,
      name: `${pathway.name} (Copy)`,
    };
    saveCustomPathway(duplicate);
    setCustomPathways(loadCustomPathways());
    setCurrentPathwayId(duplicate.id);
    setMode('build');
    setEditingStepId(null);
  }, [pathway]);

  const handleDeletePathway = useCallback(() => {
    if (!isCustom) return;
    deleteCustomPathway(currentPathwayId);
    setCustomPathways(loadCustomPathways());
    setCurrentPathwayId(builtInPathways[0].id);
    setMode('explore');
  }, [currentPathwayId, isCustom]);

  const handlePathwayChange = useCallback((id: string) => {
    setCurrentPathwayId(id);
    setSelectedNodeIdState(null);
    setEditingStepId(null);
  }, []);

  // In build mode, clicking a node edits it
  const handleNodeClickInBuilder = useCallback((stepId: string) => {
    setEditingStepId(stepId);
  }, []);

  return (
    <SelectedNodeContext.Provider value={contextValue}>
      <div className="h-full flex flex-col bg-slate-50">
        <Header
          pathway={pathway}
          pathwayList={builtInPathways}
          customPathways={customPathways}
          onPathwayChange={handlePathwayChange}
          mode={mode}
          onModeChange={setMode}
          onNewPathway={handleNewPathway}
          onDuplicatePathway={handleDuplicatePathway}
          onDeletePathway={isCustom ? handleDeletePathway : undefined}
          isCustom={isCustom}
        />
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 min-w-0">
            <ReactFlowProvider>
              <PathwayCanvas
                pathway={pathway}
                onNodeClick={mode === 'build' ? handleNodeClickInBuilder : undefined}
              />
            </ReactFlowProvider>
          </div>
          {mode === 'explore' ? (
            <Sidebar pathway={pathway} />
          ) : (
            <BuilderSidebar
              pathway={pathway}
              onChange={isCustom ? handleUpdateCustomPathway : () => {}}
              editingStepId={editingStepId}
              onEditStep={setEditingStepId}
            />
          )}
        </div>

        {/* Build mode overlay for non-custom pathways */}
        {mode === 'build' && !isCustom && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Read-Only Pathway</h2>
              <p className="text-sm text-slate-600 mb-4">
                Built-in pathways cannot be edited directly. You can duplicate this pathway to create an editable copy, or create a new one from scratch.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDuplicatePathway}
                  className="flex-1 text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors"
                >
                  Duplicate & Edit
                </button>
                <button
                  onClick={handleNewPathway}
                  className="flex-1 text-sm px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  New Pathway
                </button>
                <button
                  onClick={() => setMode('explore')}
                  className="text-sm px-4 py-2 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SelectedNodeContext.Provider>
  );
}

export default App;
