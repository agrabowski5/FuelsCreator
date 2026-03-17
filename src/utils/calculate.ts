import { Pathway, ProcessStep, Stream } from '../types/pathway';

/**
 * Calculation engine for propagating mass and energy flows through a pathway.
 *
 * Supports two modes:
 * 1. Forward (downstream): Given feedstock inputs, calculate what comes out of each step
 * 2. Backward (upstream): Given desired product output, calculate what inputs are needed
 *
 * Each process step can define a "yield" (mass out / mass in) and an "energy factor"
 * (energy consumed or produced per unit mass throughput). The engine propagates these
 * through the stream graph.
 */

export interface StepCalculation {
  stepId: string;
  totalMassIn: number;
  totalMassOut: number;
  totalEnergyIn: number;
  totalEnergyOut: number;
  massLoss: number;
  efficiency: number; // mass out / mass in
  inputBreakdown: { substance: string; mass: number }[];
  outputBreakdown: { substance: string; mass: number }[];
}

export interface PathwayCalculation {
  steps: Map<string, StepCalculation>;
  streams: Map<string, { mass: number; energyContent: number }>;
  overallYield: number; // total product mass / total feedstock mass
  overallEnergy: number; // total energy consumed across all steps
  warnings: string[];
}

/**
 * Build adjacency structures from a pathway
 */
function buildGraph(pathway: Pathway) {
  const stepMap = new Map<string, ProcessStep>();
  for (const step of pathway.steps) stepMap.set(step.id, step);

  const outgoingStreams = new Map<string, Stream[]>();
  const incomingStreams = new Map<string, Stream[]>();
  const allIds = new Set(pathway.steps.map(s => s.id));

  for (const stream of pathway.streams) {
    if (!allIds.has(stream.from) || !allIds.has(stream.to)) continue;
    if (!outgoingStreams.has(stream.from)) outgoingStreams.set(stream.from, []);
    outgoingStreams.get(stream.from)!.push(stream);
    if (!incomingStreams.has(stream.to)) incomingStreams.set(stream.to, []);
    incomingStreams.get(stream.to)!.push(stream);
  }

  return { stepMap, outgoingStreams, incomingStreams, allIds };
}

/**
 * Topological sort for calculation ordering
 */
function topoSort(allIds: Set<string>, incomingStreams: Map<string, Stream[]>): string[] {
  const inDegree = new Map<string, number>();
  const outgoing = new Map<string, Set<string>>();

  for (const id of allIds) {
    inDegree.set(id, 0);
  }

  // Build from incoming streams
  for (const [toId, streams] of incomingStreams) {
    const uniqueFroms = new Set(streams.map(s => s.from));
    inDegree.set(toId, uniqueFroms.size);
    for (const fromId of uniqueFroms) {
      if (!outgoing.has(fromId)) outgoing.set(fromId, new Set());
      outgoing.get(fromId)!.add(toId);
    }
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

  for (const id of allIds) {
    if (!sorted.includes(id)) sorted.push(id);
  }

  return sorted;
}

/**
 * Forward calculation: propagate mass/energy from feedstocks through to products.
 * Uses the mass flows defined on each step's outputs, and where outputs don't have
 * explicit mass flows, applies the step's yield ratio.
 */
export function calculateForward(pathway: Pathway): PathwayCalculation {
  const { stepMap, outgoingStreams, incomingStreams, allIds } = buildGraph(pathway);
  const sorted = topoSort(allIds, incomingStreams);
  const warnings: string[] = [];

  const stepCalcs = new Map<string, StepCalculation>();
  const streamCalcs = new Map<string, { mass: number; energyContent: number }>();

  // Track the computed mass available at each node
  const nodeMass = new Map<string, number>();

  for (const stepId of sorted) {
    const step = stepMap.get(stepId);
    if (!step) continue;

    // Sum incoming mass
    const inStreams = incomingStreams.get(stepId) ?? [];
    let totalMassIn = 0;
    const inputBreakdown: { substance: string; mass: number }[] = [];

    for (const s of inStreams) {
      const computed = streamCalcs.get(s.id);
      const mass = computed?.mass ?? s.massFlow?.value ?? 0;
      totalMassIn += mass;
      inputBreakdown.push({ substance: s.substance, mass });
    }

    // For feedstocks with no incoming, use their output definitions
    if (step.nodeType === 'feedstock' && inStreams.length === 0) {
      let feedMass = 0;
      for (const out of step.outputs) {
        feedMass += out.massFlow?.value ?? 0;
      }
      totalMassIn = feedMass;
    }

    // Compute total mass out from step definitions
    let totalMassOut = 0;
    const outputBreakdown: { substance: string; mass: number }[] = [];

    if (step.outputs.length > 0) {
      // Use defined outputs
      const definedTotal = step.outputs.reduce((sum, o) => sum + (o.massFlow?.value ?? 0), 0);
      if (definedTotal > 0) {
        // If we have explicit outputs, scale them proportionally if input differs from expected
        const expectedIn = step.inputs.reduce((sum, i) => sum + (i.massFlow?.value ?? 0), 0);
        const scale = expectedIn > 0 && totalMassIn > 0 ? totalMassIn / expectedIn : 1;

        for (const out of step.outputs) {
          const mass = (out.massFlow?.value ?? 0) * scale;
          totalMassOut += mass;
          outputBreakdown.push({ substance: out.substance, mass });
        }
      } else {
        // No mass defined on outputs, pass through
        totalMassOut = totalMassIn;
        outputBreakdown.push({ substance: 'Mixed', mass: totalMassIn });
      }
    } else {
      // Product nodes: mass out = mass in
      totalMassOut = totalMassIn;
    }

    nodeMass.set(stepId, totalMassOut);

    const energyIn = step.energyInput?.value ?? 0;
    const energyOut = step.energyOutput?.value ?? 0;

    stepCalcs.set(stepId, {
      stepId,
      totalMassIn,
      totalMassOut,
      totalEnergyIn: energyIn,
      totalEnergyOut: energyOut,
      massLoss: totalMassIn - totalMassOut,
      efficiency: totalMassIn > 0 ? totalMassOut / totalMassIn : 1,
      inputBreakdown,
      outputBreakdown,
    });

    // Propagate to outgoing streams
    const outStreams = outgoingStreams.get(stepId) ?? [];
    if (outStreams.length > 0) {
      // Distribute output mass across outgoing streams proportionally to defined flows
      const totalDefined = outStreams.reduce((sum, s) => sum + (s.massFlow?.value ?? 0), 0);

      for (const s of outStreams) {
        let streamMass: number;
        if (totalDefined > 0) {
          const fraction = (s.massFlow?.value ?? 0) / totalDefined;
          streamMass = totalMassOut * fraction;
        } else {
          streamMass = totalMassOut / outStreams.length;
        }
        streamCalcs.set(s.id, {
          mass: streamMass,
          energyContent: s.energyContent?.value ?? 0,
        });
      }
    }
  }

  // Compute overall metrics
  let totalFeedstockMass = 0;
  let totalProductMass = 0;
  let totalEnergy = 0;

  for (const step of pathway.steps) {
    const calc = stepCalcs.get(step.id);
    if (!calc) continue;
    if (step.nodeType === 'feedstock') totalFeedstockMass += calc.totalMassIn;
    if (step.nodeType === 'product') totalProductMass += calc.totalMassOut;
    totalEnergy += calc.totalEnergyIn - calc.totalEnergyOut;
  }

  return {
    steps: stepCalcs,
    streams: streamCalcs,
    overallYield: totalFeedstockMass > 0 ? totalProductMass / totalFeedstockMass : 0,
    overallEnergy: totalEnergy,
    warnings,
  };
}

/**
 * Backward calculation: given a desired product output, work backwards to
 * determine required feedstock inputs and intermediate flows.
 */
export function calculateBackward(
  pathway: Pathway,
  targetProductId: string,
  targetMass: number
): PathwayCalculation {
  const { stepMap, incomingStreams, allIds } = buildGraph(pathway);
  const sorted = topoSort(allIds, incomingStreams);
  const reverseSorted = [...sorted].reverse();
  const warnings: string[] = [];

  const stepCalcs = new Map<string, StepCalculation>();
  const streamCalcs = new Map<string, { mass: number; energyContent: number }>();
  const requiredOutput = new Map<string, number>();

  // Set target
  requiredOutput.set(targetProductId, targetMass);

  for (const stepId of reverseSorted) {
    const step = stepMap.get(stepId);
    if (!step) continue;

    const neededOut = requiredOutput.get(stepId) ?? 0;
    if (neededOut === 0 && step.nodeType !== 'feedstock') continue;

    // Determine the yield ratio from defined data
    const definedIn = step.inputs.reduce((sum, i) => sum + (i.massFlow?.value ?? 0), 0);
    const definedOut = step.outputs.reduce((sum, o) => sum + (o.massFlow?.value ?? 0), 0);
    const yieldRatio = definedIn > 0 && definedOut > 0 ? definedOut / definedIn : 1;

    let totalMassIn: number;
    let totalMassOut: number;

    if (step.nodeType === 'product') {
      totalMassOut = neededOut;
      totalMassIn = neededOut;
    } else if (step.nodeType === 'feedstock') {
      totalMassOut = neededOut;
      totalMassIn = neededOut;
    } else {
      totalMassOut = neededOut;
      totalMassIn = yieldRatio > 0 ? neededOut / yieldRatio : neededOut;
    }

    const scale = definedOut > 0 ? totalMassOut / definedOut : 1;

    const inputBreakdown = step.inputs.map(i => ({
      substance: i.substance,
      mass: (i.massFlow?.value ?? 0) * scale,
    }));
    const outputBreakdown = step.outputs.map(o => ({
      substance: o.substance,
      mass: (o.massFlow?.value ?? 0) * scale,
    }));

    const energyScale = definedIn > 0 ? totalMassIn / definedIn : scale;
    const energyIn = (step.energyInput?.value ?? 0) * energyScale;
    const energyOut = (step.energyOutput?.value ?? 0) * energyScale;

    stepCalcs.set(stepId, {
      stepId,
      totalMassIn,
      totalMassOut,
      totalEnergyIn: energyIn,
      totalEnergyOut: energyOut,
      massLoss: totalMassIn - totalMassOut,
      efficiency: totalMassIn > 0 ? totalMassOut / totalMassIn : 1,
      inputBreakdown,
      outputBreakdown,
    });

    // Propagate requirements upstream through incoming streams
    const inStreams = incomingStreams.get(stepId) ?? [];
    const totalDefinedIncoming = inStreams.reduce((sum, s) => sum + (s.massFlow?.value ?? 0), 0);

    for (const s of inStreams) {
      let streamMass: number;
      if (totalDefinedIncoming > 0) {
        const fraction = (s.massFlow?.value ?? 0) / totalDefinedIncoming;
        streamMass = totalMassIn * fraction;
      } else {
        streamMass = totalMassIn / Math.max(inStreams.length, 1);
      }
      streamCalcs.set(s.id, { mass: streamMass, energyContent: s.energyContent?.value ?? 0 });

      // Add to required output of the upstream step
      const existing = requiredOutput.get(s.from) ?? 0;
      requiredOutput.set(s.from, existing + streamMass);
    }
  }

  let totalFeedstockMass = 0;
  let totalProductMass = 0;
  let totalEnergy = 0;

  for (const step of pathway.steps) {
    const calc = stepCalcs.get(step.id);
    if (!calc) continue;
    if (step.nodeType === 'feedstock') totalFeedstockMass += calc.totalMassIn;
    if (step.nodeType === 'product') totalProductMass += calc.totalMassOut;
    totalEnergy += calc.totalEnergyIn - calc.totalEnergyOut;
  }

  return {
    steps: stepCalcs,
    streams: streamCalcs,
    overallYield: totalFeedstockMass > 0 ? totalProductMass / totalFeedstockMass : 0,
    overallEnergy: totalEnergy,
    warnings,
  };
}
