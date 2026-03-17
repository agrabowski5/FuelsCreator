import { Node, Edge } from '@xyflow/react';
import { Pathway, ProcessStep } from '../types/pathway';

interface LayoutResult {
  nodes: Node[];
  edges: Edge[];
}

export function layoutPathway(pathway: Pathway): LayoutResult {
  const stepMap = new Map<string, ProcessStep>();
  for (const step of pathway.steps) {
    stepMap.set(step.id, step);
  }

  // Build adjacency from streams
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, Set<string>>();
  const allIds = new Set(pathway.steps.map((s) => s.id));

  for (const stream of pathway.streams) {
    if (!allIds.has(stream.from) || !allIds.has(stream.to)) continue;
    if (!outgoing.has(stream.from)) outgoing.set(stream.from, []);
    outgoing.get(stream.from)!.push(stream.to);
    if (!incoming.has(stream.to)) incoming.set(stream.to, new Set());
    incoming.get(stream.to)!.add(stream.from);
  }

  // Topological sort via Kahn's algorithm
  const inDegree = new Map<string, number>();
  for (const id of allIds) {
    inDegree.set(id, incoming.get(id)?.size ?? 0);
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    sorted.push(id);
    for (const next of outgoing.get(id) ?? []) {
      const newDeg = (inDegree.get(next) ?? 1) - 1;
      inDegree.set(next, newDeg);
      if (newDeg === 0) queue.push(next);
    }
  }

  // Add any remaining nodes (disconnected)
  for (const id of allIds) {
    if (!sorted.includes(id)) sorted.push(id);
  }

  // Assign columns based on longest path from any root
  const column = new Map<string, number>();
  for (const id of sorted) {
    const parents = incoming.get(id);
    if (!parents || parents.size === 0) {
      column.set(id, 0);
    } else {
      let maxCol = 0;
      for (const parent of parents) {
        maxCol = Math.max(maxCol, (column.get(parent) ?? 0) + 1);
      }
      column.set(id, maxCol);
    }
  }

  // Group by column
  const columns = new Map<number, string[]>();
  for (const [id, col] of column) {
    if (!columns.has(col)) columns.set(col, []);
    columns.get(col)!.push(id);
  }

  const NODE_WIDTH = 280;
  const NODE_HEIGHT = 120;
  const X_GAP = 100;
  const Y_GAP = 40;

  const nodes: Node[] = [];
  for (const [col, ids] of columns) {
    const totalHeight = ids.length * NODE_HEIGHT + (ids.length - 1) * Y_GAP;
    const startY = -totalHeight / 2;

    for (let i = 0; i < ids.length; i++) {
      const step = stepMap.get(ids[i])!;
      const nodeType =
        step.nodeType === 'feedstock'
          ? 'feedstockNode'
          : step.nodeType === 'product'
          ? 'productNode'
          : 'processNode';

      nodes.push({
        id: step.id,
        type: nodeType,
        position: {
          x: col * (NODE_WIDTH + X_GAP),
          y: startY + i * (NODE_HEIGHT + Y_GAP),
        },
        data: { step },
      });
    }
  }

  // Create edges from streams (deduplicate by from-to pair)
  const edgeSet = new Set<string>();
  const edges: Edge[] = [];
  for (const stream of pathway.streams) {
    if (!allIds.has(stream.from) || !allIds.has(stream.to)) continue;
    const key = `${stream.from}-${stream.to}`;
    if (edgeSet.has(key)) continue;
    edgeSet.add(key);

    edges.push({
      id: `edge-${stream.id}`,
      source: stream.from,
      target: stream.to,
      type: 'materialEdge',
      data: { label: stream.label ?? stream.substance, stream },
      animated: false,
    });
  }

  return { nodes, edges };
}
