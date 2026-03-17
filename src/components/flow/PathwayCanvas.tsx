import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';
import { Pathway } from '../../types/pathway';
import { layoutPathway } from '../../utils/layoutPathway';
import { nodeTypes } from './nodes/nodeTypes';
import { edgeTypes } from './edges/edgeTypes';
import { useSelectedNode } from '../../hooks/useSelectedNode';

interface PathwayCanvasProps {
  pathway: Pathway;
  onNodeClick?: (stepId: string) => void;
}

export function PathwayCanvas({ pathway, onNodeClick }: PathwayCanvasProps) {
  const { setSelectedNodeId } = useSelectedNode();
  const { fitView } = useReactFlow();

  const layout = useMemo(() => layoutPathway(pathway), [pathway]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layout.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layout.edges);

  useEffect(() => {
    setNodes(layout.nodes);
    setEdges(layout.edges);
    setSelectedNodeId(null);
    // Delay fitView to allow nodes to render
    setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 50);
  }, [layout, setNodes, setEdges, setSelectedNodeId, fitView]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: { id: string }) => {
    if (onNodeClick) {
      onNodeClick(node.id);
    }
  }, [onNodeClick]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onPaneClick={onPaneClick}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{ type: 'materialEdge' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls showInteractive={false} className="!bg-white !shadow-lg !border-slate-200" />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'feedstockNode': return '#10b981';
              case 'processNode': return '#0ea5e9';
              case 'productNode': return '#f59e0b';
              default: return '#94a3b8';
            }
          }}
          className="!bg-white/80 !shadow-lg !border-slate-200"
        />
      </ReactFlow>
    </div>
  );
}
