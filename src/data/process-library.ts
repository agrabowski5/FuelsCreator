import { ProcessStep } from '../types/pathway';

/**
 * Process Operations Knowledge Base
 *
 * A library of common refinery and chemical process unit operations
 * with theoretical backing, reaction chemistry, typical conditions,
 * and educational content. Users can browse this library and import
 * templates into their custom pathways.
 *
 * Categories:
 * - feedstock-preparation: Pretreatment, purification, feed conditioning
 * - reaction: Core chemical transformations
 * - separation: Distillation, absorption, extraction, membrane
 * - upgrading: Hydroprocessing, isomerization, cracking
 * - utility: H₂ production, heat recovery, water treatment
 */

export interface ProcessTemplate {
  /** Unique template identifier */
  id: string;
  /** Display name */
  name: string;
  /** Which part of the process this belongs to */
  category: 'feedstock-preparation' | 'reaction' | 'separation' | 'upgrading' | 'utility';
  /** Tags for search/filter */
  tags: string[];
  /** What fuel pathways commonly use this */
  commonPathways: string[];
  /** The template step data (ready to clone into a pathway) */
  template: Omit<ProcessStep, 'id'>;
  /** Extended theory section beyond what fits in education */
  theory: {
    /** The core principle or mechanism */
    principle: string;
    /** Key reactions with thermodynamic data */
    reactions: Reaction[];
    /** How operating variables affect the outcome */
    designVariables: DesignVariable[];
    /** Common industrial variants of this operation */
    variants?: string[];
    /** References and further reading */
    references?: string[];
  };
}

export interface Reaction {
  /** Equation string (using Unicode subscripts) */
  equation: string;
  /** Name of this reaction */
  name: string;
  /** Enthalpy of reaction (kJ/mol) — positive = endothermic */
  deltaH?: number;
  /** Gibbs free energy (kJ/mol) */
  deltaG?: number;
  /** Temperature range where this reaction is favored (°C) */
  temperatureRange?: [number, number];
  /** Narrative explanation */
  description: string;
  /** Catalyst if applicable */
  catalyst?: string;
}

export interface DesignVariable {
  /** Variable name */
  name: string;
  /** What happens when you increase this variable */
  effectOfIncrease: string;
  /** Typical operating range */
  typicalRange: string;
  /** Why this matters */
  tradeoff: string;
}

// ─────────────────────────────────────────────────────────────
// FEEDSTOCK PREPARATION
// ─────────────────────────────────────────────────────────────

const degummingBleaching: ProcessTemplate = {
  id: 'tpl-degumming-bleaching',
  name: 'Degumming & Bleaching',
  category: 'feedstock-preparation',
  tags: ['fats', 'oils', 'pretreatment', 'lipid', 'tallow', 'UCO', 'vegetable oil'],
  commonPathways: ['HEFA', 'HVO', 'Co-processing'],
  template: {
    name: 'Degumming & Bleaching',
    nodeType: 'process',
    conditions: {
      temperature: { value: 85, unit: '°C' },
      pressure: { value: 1, unit: 'bar' },
    },
    inputs: [
      { streamId: '', substance: 'Raw fat/oil', massFlow: { value: 1000, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Phosphoric acid (H₃PO₄)', massFlow: { value: 3, unit: 'kg/h' }, phase: 'liquid' },
    ],
    outputs: [
      { streamId: '', substance: 'Pretreated oil', massFlow: { value: 970, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Gums & waste', massFlow: { value: 33, unit: 'kg/h' }, phase: 'solid' },
    ],
    energyInput: { value: 0.05, unit: 'MW', source: 'Steam heating' },
    education: {
      summary: 'Removes phospholipids, metals, and color bodies from fats and oils to protect downstream catalysts.',
      chemistry: 'Phospholipids + H₃PO₄ → hydrated gums (insoluble, removed by centrifuge)\nMetal ions + bleaching earth → adsorbed metals (removed by filtration)',
      explanation: 'Crude fats and oils contain phospholipids (gums), trace metals (Fe, Cu, Ca, Na), chlorides, and color bodies that would poison hydrotreating catalysts. Acid degumming uses phosphoric or citric acid to hydrate non-hydratable phospholipids, making them water-soluble and separable by centrifuge. Bleaching uses activated clay (bentonite or montmorillonite) to adsorb metals and pigments. The treatment sequence is critical: degumming first (removes bulk contaminants), then bleaching (polishes to <1 ppm metals), then optional vacuum drying to remove moisture. For HEFA processing, target specifications are typically P <5 ppm, metals <1 ppm combined, and moisture <500 ppm.',
      engineeringNotes: 'Bleaching earth consumption: 0.5–2% of oil mass. Spent earth contains ~30% residual oil and must be disposed of carefully (fire hazard). Guard beds of alumina or silica gel downstream provide additional protection. Acid addition is typically 0.1–0.3% by weight.',
      keyTerms: [
        { term: 'Phospholipid', definition: 'Glycerol ester with one fatty acid replaced by a phosphate group; forms cell membranes in biological fats and acts as a catalyst poison.' },
        { term: 'Degumming', definition: 'Removal of phospholipids from crude oil by hydration and centrifugal separation.' },
        { term: 'Bleaching', definition: 'Adsorption of metal ions and pigments onto activated clay, followed by filtration.' },
        { term: 'Guard bed', definition: 'A sacrificial catalyst bed that captures trace contaminants before the main reactor.' },
      ],
    },
  },
  theory: {
    principle: 'Adsorption and hydration-based purification. Phospholipids become insoluble when hydrated with acid, enabling physical separation. Bleaching earth uses van der Waals and electrostatic forces to adsorb polar contaminants from the non-polar oil matrix.',
    reactions: [
      {
        equation: 'Phospholipid + H₃PO₄ + H₂O → Hydrated gum (precipitate)',
        name: 'Acid degumming',
        description: 'Phosphoric acid converts non-hydratable phospholipids (Ca/Mg salts) to their hydratable acid form, which readily absorbs water and precipitates from the oil phase.',
      },
      {
        equation: 'Fe²⁺/Cu²⁺ + Clay(surface) → Clay·Metal (adsorbed)',
        name: 'Metal adsorption',
        description: 'Activated bleaching earth (acid-activated montmorillonite) has a high surface area (~200 m²/g) with charged sites that bind metal ions through ion exchange and surface complexation.',
      },
    ],
    designVariables: [
      {
        name: 'Acid dosage',
        effectOfIncrease: 'Better phospholipid removal, but excess acid can hydrolyze triglycerides and increase free fatty acids',
        typicalRange: '0.05–0.3 wt% of oil',
        tradeoff: 'More acid = cleaner oil but higher FFA and disposal costs',
      },
      {
        name: 'Bleaching temperature',
        effectOfIncrease: 'Faster adsorption kinetics, but risk of oil oxidation and color fixation above 110°C',
        typicalRange: '80–110°C',
        tradeoff: 'Higher temperature speeds treatment but can degrade oil quality',
      },
      {
        name: 'Clay dosage',
        effectOfIncrease: 'Better metal/color removal but higher oil losses (retained in spent clay) and disposal volume',
        typicalRange: '0.5–2.0 wt% of oil',
        tradeoff: 'More clay = cleaner oil but 20–30% of clay mass is retained oil loss',
      },
    ],
    variants: [
      'Water degumming (simpler, for oils with mostly hydratable phospholipids)',
      'Enzymatic degumming (uses phospholipase, lower chemical consumption)',
      'Silica refining (replaces bleaching clay with synthetic silica gel)',
    ],
  },
};

const desalting: ProcessTemplate = {
  id: 'tpl-desalting',
  name: 'Crude Oil Desalting',
  category: 'feedstock-preparation',
  tags: ['crude oil', 'desalting', 'pretreatment', 'electrostatic', 'conventional'],
  commonPathways: ['Conventional refining', 'Crude-to-jet'],
  template: {
    name: 'Crude Oil Desalting',
    nodeType: 'process',
    conditions: {
      temperature: { value: 130, unit: '°C' },
      pressure: { value: 10, unit: 'bar' },
    },
    inputs: [
      { streamId: '', substance: 'Crude oil', massFlow: { value: 10000, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Wash water', massFlow: { value: 500, unit: 'kg/h' }, phase: 'liquid' },
    ],
    outputs: [
      { streamId: '', substance: 'Desalted crude', massFlow: { value: 9800, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Brine effluent', massFlow: { value: 700, unit: 'kg/h' }, phase: 'liquid' },
    ],
    energyInput: { value: 0.1, unit: 'MW', source: 'Electrostatic field + heating' },
    education: {
      summary: 'Removes inorganic salts (NaCl, MgCl₂, CaCl₂) and suspended solids from crude oil to prevent corrosion and fouling in downstream units.',
      chemistry: 'MgCl₂ + H₂O → MgOHCl + HCl (at furnace temperatures — this is why salts must be removed!)\nCaCl₂ + H₂O → CaOHCl + HCl\nSalt dissolution: NaCl(crude) → NaCl(aq) in wash water',
      explanation: 'Crude oil typically contains 5–100 lb/1000 bbl of inorganic salts dissolved in entrained water droplets. If not removed, these salts — particularly MgCl₂ and CaCl₂ — hydrolyze at distillation furnace temperatures (350°C+) to form HCl, causing severe corrosion of overhead condensers and trays. The desalter operates by mixing the crude with 3–7 vol% fresh water at 120–150°C, then applying a high-voltage electrostatic field (15–35 kV AC) to coalesce the small water-in-oil emulsion droplets. The coalesced water settles to the bottom as brine, carrying dissolved salts with it. Modern two-stage desalters can achieve >99% salt removal, reducing salt content to <1 lb/1000 bbl.',
      engineeringNotes: 'Desalter efficiency depends on: mixing valve ΔP (optimal 5–15 psi), oil temperature (higher = lower viscosity = better coalescence), wash water ratio, and residence time (20–30 min). The electrostatic field does not separate oil and water — it coalesces small droplets into larger ones that gravity can separate. Demulsifier chemicals (5–20 ppm) break the emulsion interface.',
      keyTerms: [
        { term: 'Electrostatic coalescence', definition: 'Application of AC electric field to induce dipole alignment in water droplets, causing them to attract and merge into larger drops that settle by gravity.' },
        { term: 'Brine', definition: 'Salt-laden water separated from crude oil in the desalter, typically sent to wastewater treatment.' },
        { term: 'Demulsifier', definition: 'Surface-active chemical that destabilizes water-in-oil emulsions by weakening the interfacial film around water droplets.' },
      ],
    },
  },
  theory: {
    principle: 'Electrostatic coalescence combined with gravity settling. The AC field polarizes water droplets trapped in crude oil, causing them to oscillate, collide, and merge. Larger drops settle faster per Stokes\' law: v = (Δρ·g·d²)/(18μ), so coalescence dramatically accelerates separation.',
    reactions: [
      {
        equation: 'MgCl₂ + H₂O → Mg(OH)Cl + HCl',
        name: 'Magnesium chloride hydrolysis',
        deltaH: 3.2,
        temperatureRange: [300, 400],
        description: 'At atmospheric distillation furnace temperatures, MgCl₂ rapidly hydrolyzes to release HCl gas, which dissolves in condensed water in the overhead system to form hydrochloric acid — extremely corrosive. This is the primary driver for desalting.',
        catalyst: 'None (thermal)',
      },
      {
        equation: 'CaCl₂ + H₂O → Ca(OH)Cl + HCl',
        name: 'Calcium chloride hydrolysis',
        temperatureRange: [350, 450],
        description: 'Similar to MgCl₂ hydrolysis but occurs at higher temperatures. CaCl₂ is less aggressive than MgCl₂ but still contributes to overhead corrosion.',
        catalyst: 'None (thermal)',
      },
    ],
    designVariables: [
      {
        name: 'Wash water ratio',
        effectOfIncrease: 'Better salt extraction (more water to dissolve salts) but harder to separate and more effluent',
        typicalRange: '3–7 vol% of crude',
        tradeoff: 'More water = lower salt but higher wastewater volume and potential emulsion issues',
      },
      {
        name: 'Operating temperature',
        effectOfIncrease: 'Lower crude viscosity improves water droplet coalescence and settling, but higher energy cost',
        typicalRange: '120–150°C',
        tradeoff: 'Higher temp = better separation but more energy and potential vaporization issues',
      },
      {
        name: 'Electrostatic field voltage',
        effectOfIncrease: 'Stronger coalescence force, but too high can cause short-circuiting through water-wetted insulators',
        typicalRange: '15–35 kV AC',
        tradeoff: 'Higher voltage = faster coalescence but risk of arcing and power consumption',
      },
    ],
    variants: [
      'Single-stage desalting (90–95% removal, adequate for low-salt crudes)',
      'Two-stage desalting (>99% removal, required for high-salt or opportunity crudes)',
      'Three-stage desalting (rare, used for very heavy/sour crudes)',
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// REACTION OPERATIONS
// ─────────────────────────────────────────────────────────────

const hydrodeoxygenation: ProcessTemplate = {
  id: 'tpl-hdo',
  name: 'Hydrodeoxygenation (HDO)',
  category: 'reaction',
  tags: ['HEFA', 'HVO', 'hydrotreating', 'deoxygenation', 'hydrogen', 'renewable diesel', 'SAF', 'triglyceride'],
  commonPathways: ['HEFA', 'HVO', 'Co-processing'],
  template: {
    name: 'Hydrodeoxygenation',
    nodeType: 'process',
    conditions: {
      temperature: { value: 350, unit: '°C' },
      pressure: { value: 50, unit: 'bar' },
      catalyst: 'NiMo/Al₂O₃ (sulfided)',
      residenceTime: '1–2 hours (LHSV 0.5–1.0 h⁻¹)',
    },
    inputs: [
      { streamId: '', substance: 'Pretreated fat/oil', massFlow: { value: 1000, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Hydrogen (H₂)', massFlow: { value: 35, unit: 'kg/h' }, phase: 'gas' },
    ],
    outputs: [
      { streamId: '', substance: 'n-Paraffins (C15–C18)', massFlow: { value: 830, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Water', massFlow: { value: 120, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'CO₂ + Propane + light gases', massFlow: { value: 85, unit: 'kg/h' }, phase: 'gas' },
    ],
    energyOutput: { value: 0.8, unit: 'MW', source: 'Exothermic reaction heat (~2 MJ/kg feed)' },
    education: {
      summary: 'The core HEFA reaction: hydrogen removes oxygen from fatty acid chains, producing straight-chain alkanes (n-paraffins), water, and light gases.',
      chemistry: 'Triglyceride + 12 H₂ → 3 n-C₁₇H₃₆ + C₃H₈ + 6 H₂O  (hydrodeoxygenation path)\nR-COOH + 3 H₂ → R-CH₃ + 2 H₂O  (free fatty acid HDO)\nR-COOH → R-H + CO₂  (decarboxylation — minor path, loses 1 carbon)\nR-COOH + H₂ → R-H + CO + H₂O  (decarbonylation — minor path)',
      explanation: 'Hydrodeoxygenation is the dominant reaction in HEFA processing. Hydrogen gas reacts with triglycerides at the catalyst surface to cleave the glycerol backbone and saturate the fatty acid chains. The oxygen is removed as water (HDO pathway) or CO₂ (decarboxylation pathway). The HDO pathway preserves chain length (e.g., C18 fatty acid → C18 paraffin) while decarboxylation shortens by one carbon (C18 → C17). The relative selectivity between these pathways depends on catalyst choice, temperature, and H₂ partial pressure. NiMo catalysts at high H₂ pressure favor HDO. CoMo catalysts at lower H₂ pressure allow more decarboxylation. The reaction is strongly exothermic (~2 MJ/kg), requiring careful heat management — typically using hydrogen quench gas injected between catalyst beds to prevent thermal runaway.',
      engineeringNotes: 'H₂ consumption: 300–400 Nm³/ton of feed (much higher than petroleum hydrotreating at 5–15 Nm³/ton). Catalyst life: 1–3 years before regeneration needed. The reactor typically has 3–4 catalyst beds with inter-bed quench. Product is a mixture of n-paraffins (mainly C15–C18) with excellent cetane number (>70) but poor cold flow properties — requires subsequent isomerization for jet fuel.',
      keyTerms: [
        { term: 'Hydrodeoxygenation (HDO)', definition: 'Catalytic removal of oxygen from organic molecules using hydrogen, producing water as byproduct. The dominant reaction path in HEFA processing.' },
        { term: 'Decarboxylation', definition: 'Removal of oxygen as CO₂, shortening the carbon chain by one. Requires less hydrogen but reduces yield slightly.' },
        { term: 'LHSV', definition: 'Liquid Hourly Space Velocity — volumetric flow of liquid feed per hour divided by catalyst volume. Lower LHSV = longer contact time = higher conversion.' },
        { term: 'Quench', definition: 'Injection of cold hydrogen gas between catalyst beds to absorb exothermic reaction heat and prevent temperature runaway.' },
        { term: 'Sulfided catalyst', definition: 'NiMo and CoMo catalysts require sulfur on their surface to be active. A small amount of sulfur agent (DMDS) is co-fed to maintain catalyst activity.' },
      ],
    },
  },
  theory: {
    principle: 'Catalytic hydrogenolysis of C-O bonds in triglycerides and fatty acids. The reaction proceeds through adsorption of the oxygenated molecule on the sulfided metal catalyst surface, followed by sequential hydrogenation steps that replace oxygen with hydrogen. The mechanism involves: (1) saturation of C=C double bonds, (2) hydrogenolysis of the ester bond, (3) hydrogenation of the resulting aldehyde/alcohol, (4) final C-O bond cleavage releasing H₂O.',
    reactions: [
      {
        equation: 'C₅₅H₁₀₆O₆ + 12 H₂ → 3 C₁₈H₃₈ + C₃H₈ + 6 H₂O',
        name: 'Tristearin hydrodeoxygenation',
        deltaH: -950,
        description: 'Complete HDO of a saturated C18 triglyceride (tristearin). The glycerol backbone becomes propane, and each fatty acid chain becomes an n-C18 paraffin. This is the idealized reaction — in practice, some decarboxylation also occurs.',
        catalyst: 'NiMo/Al₂O₃ or NiW/Al₂O₃ (sulfided form)',
      },
      {
        equation: 'C₁₇H₃₅COOH + 3 H₂ → C₁₈H₃₈ + 2 H₂O',
        name: 'Stearic acid HDO',
        deltaH: -115,
        description: 'HDO of a free fatty acid (stearic acid, C18:0). Consumes 3 mol H₂ per mol acid and preserves the full C18 chain. Preferred at high H₂ partial pressure.',
        catalyst: 'NiMo/Al₂O₃',
      },
      {
        equation: 'C₁₇H₃₅COOH → C₁₇H₃₆ + CO₂',
        name: 'Stearic acid decarboxylation',
        deltaH: -10,
        description: 'Alternative deoxygenation pathway that removes oxygen as CO₂ instead of water. Produces a C17 paraffin (one carbon shorter). Dominant on Pd/C or CoMo catalysts at lower H₂ pressure. Uses less hydrogen but gives lower carbon yield.',
        catalyst: 'Pd/C or CoMo/Al₂O₃',
      },
      {
        equation: 'C₁₇H₃₃COOH + H₂ → C₁₇H₃₅COOH',
        name: 'Oleic acid saturation',
        deltaH: -120,
        description: 'First step: saturation of the C=C double bond in unsaturated fatty acids (e.g., oleic acid C18:1 → stearic acid C18:0). This is fast and occurs before deoxygenation.',
        catalyst: 'NiMo/Al₂O₃',
      },
    ],
    designVariables: [
      {
        name: 'H₂ partial pressure',
        effectOfIncrease: 'Favors HDO over decarboxylation, higher conversion, less coking, but higher compression cost',
        typicalRange: '30–80 bar',
        tradeoff: 'Higher pressure = better selectivity and catalyst life, but more expensive equipment and compression',
      },
      {
        name: 'Temperature',
        effectOfIncrease: 'Faster reaction rate, but more cracking (shorter chains), more decarboxylation, faster catalyst deactivation',
        typicalRange: '300–400°C',
        tradeoff: 'Higher temp = faster conversion but lower product quality and shorter catalyst life',
      },
      {
        name: 'LHSV',
        effectOfIncrease: 'Higher throughput but lower per-pass conversion and potentially incomplete deoxygenation',
        typicalRange: '0.5–2.0 h⁻¹',
        tradeoff: 'Higher LHSV = more capacity but less conversion per pass',
      },
      {
        name: 'H₂/oil ratio',
        effectOfIncrease: 'Better heat control (more quench gas), higher H₂ partial pressure, but more gas recycle energy',
        typicalRange: '500–1500 Nm³/m³ oil',
        tradeoff: 'More H₂ circulation = better control but higher recycle compressor cost',
      },
    ],
    variants: [
      'Co-processing: blending 5–20% bio-oils into petroleum hydrotreater feed',
      'Stand-alone HEFA: dedicated unit for 100% renewable feed',
      'Ecofining™ (Honeywell UOP): commercial HEFA technology',
      'Vegan™ (Axens): alternative commercial HEFA process',
      'BioSynfining™ (Syntroleum/Tyson): uses animal fats specifically',
    ],
    references: [
      'Kalnes, T. et al. "Green diesel: a second generation biofuel." Int. J. Chem. Reactor Eng. 2007.',
      'Kubička, D. & Tukač, V. "Hydrodeoxygenation of vegetable oils." Advances in Chemical Engineering, 2012.',
    ],
  },
};

const fischerTropsch: ProcessTemplate = {
  id: 'tpl-fischer-tropsch',
  name: 'Fischer-Tropsch Synthesis',
  category: 'reaction',
  tags: ['FT', 'syngas', 'GTL', 'PTL', 'power-to-liquid', 'wax', 'cobalt', 'iron', 'chain growth'],
  commonPathways: ['Fischer-Tropsch', 'Gas-to-Liquids', 'Power-to-Liquid', 'Biomass-to-Liquid'],
  template: {
    name: 'Fischer-Tropsch Reactor',
    nodeType: 'process',
    conditions: {
      temperature: { value: 220, unit: '°C' },
      pressure: { value: 25, unit: 'bar' },
      catalyst: 'Cobalt on Al₂O₃ support (Co/Al₂O₃)',
      residenceTime: 'Per-pass conversion: 40–60%',
    },
    inputs: [
      { streamId: '', substance: 'Syngas (H₂:CO ≈ 2:1)', massFlow: { value: 1000, unit: 'kg/h' }, phase: 'gas' },
    ],
    outputs: [
      { streamId: '', substance: 'FT liquids (C5+)', massFlow: { value: 380, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'FT wax (C20+)', massFlow: { value: 250, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Water', massFlow: { value: 280, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Tail gas (C1–C4 + unreacted syngas)', massFlow: { value: 90, unit: 'kg/h' }, phase: 'gas' },
    ],
    energyOutput: { value: 2.5, unit: 'MW', source: 'Highly exothermic (~165 kJ/mol CO converted)' },
    education: {
      summary: 'Converts syngas (H₂ + CO) into long-chain hydrocarbons via catalytic polymerization on cobalt or iron surfaces. The product distribution follows Anderson-Schulz-Flory statistics.',
      chemistry: 'n CO + (2n+1) H₂ → CₙH₂ₙ₊₂ + n H₂O  (paraffin formation)\nn CO + 2n H₂ → CₙH₂ₙ + n H₂O  (olefin formation)\nAnderson-Schulz-Flory: Wₙ = n(1-α)²αⁿ⁻¹  (product weight fraction)\nα = chain growth probability (0.85–0.95 for cobalt catalysts)',
      explanation: 'Fischer-Tropsch synthesis is a surface polymerization reaction discovered in 1925. CO and H₂ molecules adsorb on the catalyst surface, where CO is dissociated and hydrogenated to form CH₂ monomers. These monomers can either: (1) initiate a new chain, (2) insert into a growing chain (propagation), or (3) terminate the chain by hydrogen addition (paraffin) or β-hydride elimination (olefin). The ratio of propagation to termination is the chain growth probability α, which determines the entire product distribution via the ASF equation. With α = 0.90, you get roughly: 1% methane, 3% C2–C4, 15% naphtha (C5–C10), 25% middle distillates (C11–C20), and 56% wax (C20+). The high wax fraction is actually desirable — it can be hydrocracked to produce premium diesel and jet fuel with near-zero aromatics and sulfur.',
      engineeringNotes: 'The reaction is highly exothermic (~165 kJ/mol CO), making heat removal the key engineering challenge. Reactor types: fixed-bed multitubular (Shell SMDS), slurry bubble column (Sasol SPD), microchannel (Velocys). Per-pass CO conversion is typically 40–60%; tail gas is recycled to achieve overall conversion >90%. Water management is critical — the FT water contains oxygenates (alcohols, acids) and must be treated before disposal.',
      keyTerms: [
        { term: 'Anderson-Schulz-Flory (ASF)', definition: 'Statistical model predicting FT product distribution from a single parameter α. The weight fraction of carbon number n is: Wₙ = n(1-α)²αⁿ⁻¹' },
        { term: 'Chain growth probability (α)', definition: 'The probability that a growing chain adds another CH₂ unit rather than terminating. Higher α = heavier products. Cobalt: α ≈ 0.85–0.95; Iron: α ≈ 0.70–0.85.' },
        { term: 'Syngas ratio (H₂:CO)', definition: 'Molar ratio of hydrogen to carbon monoxide in the feed gas. FT requires ~2:1 for paraffins. Cobalt catalysts are sensitive to this ratio.' },
        { term: 'Tail gas', definition: 'Unreacted syngas plus light hydrocarbons (C1–C4) leaving the FT reactor. Usually recycled to increase overall conversion.' },
      ],
    },
  },
  theory: {
    principle: 'Surface-catalyzed chain polymerization of CO and H₂. The mechanism involves: (1) CO adsorption and dissociation, (2) hydrogenation to surface CH₂ species, (3) chain initiation by C-C coupling, (4) chain propagation by CH₂ insertion, (5) chain termination by hydrogenation (→paraffin) or β-elimination (→olefin). The product selectivity is governed by kinetics on the catalyst surface, well-described by Anderson-Schulz-Flory statistics.',
    reactions: [
      {
        equation: 'CO + 2 H₂ → -CH₂- + H₂O',
        name: 'FT monomer formation',
        deltaH: -165,
        description: 'The net reaction for each CH₂ unit added to a growing chain. This is the fundamental building block — all FT products are built from these units. The strong exotherm (-165 kJ/mol CO) is the dominant engineering challenge.',
        catalyst: 'Co/Al₂O₃ or Fe/SiO₂',
      },
      {
        equation: '8 CO + 17 H₂ → C₈H₁₈ + 8 H₂O',
        name: 'Octane synthesis (example)',
        deltaH: -1320,
        description: 'Formation of a representative C8 paraffin (iso-octane equivalent). Note the large exotherm — for every kg of liquid product, roughly 1.7 MJ of heat must be removed.',
        catalyst: 'Co/Al₂O₃',
      },
      {
        equation: 'CO + H₂O ⇌ CO₂ + H₂',
        name: 'Water-gas shift (WGS) — on iron catalysts',
        deltaH: -41,
        temperatureRange: [200, 350],
        description: 'Iron FT catalysts are also active for WGS, which adjusts the H₂:CO ratio in situ. This means iron catalysts can use syngas with H₂:CO < 2:1 (e.g., from biomass gasification). Cobalt catalysts have negligible WGS activity and require pre-adjusted syngas ratio.',
        catalyst: 'Fe-based FT catalysts only',
      },
    ],
    designVariables: [
      {
        name: 'Temperature',
        effectOfIncrease: 'Higher conversion rate, lower α (lighter products, more methane), potential for carbon deposition',
        typicalRange: '200–240°C (low-T FT, cobalt) or 300–350°C (high-T FT, iron)',
        tradeoff: 'Higher T = more conversion but lighter products and faster deactivation',
      },
      {
        name: 'Pressure',
        effectOfIncrease: 'Higher CO conversion per pass, heavier products (higher α), suppresses methane formation',
        typicalRange: '20–40 bar',
        tradeoff: 'Higher pressure = better selectivity but higher equipment and compression costs',
      },
      {
        name: 'H₂:CO ratio',
        effectOfIncrease: 'More paraffins vs. olefins, less carbon deposition, but too high H₂ favors methane',
        typicalRange: '1.8–2.2 for cobalt; 1.0–1.7 for iron',
        tradeoff: 'Optimal ratio depends on catalyst — cobalt needs stoichiometric ~2:1, iron is flexible via WGS',
      },
      {
        name: 'Space velocity',
        effectOfIncrease: 'Higher throughput, lower per-pass conversion, lighter average product',
        typicalRange: '500–2000 h⁻¹ (gas hourly space velocity)',
        tradeoff: 'Higher SV = more capacity per reactor volume but lower conversion and potentially poorer selectivity',
      },
    ],
    variants: [
      'Low-temperature FT (LTFT, 200–240°C): Cobalt catalyst, heavy wax product, hydrocracked to diesel/jet',
      'High-temperature FT (HTFT, 300–350°C): Iron catalyst, lighter olefinic product, for chemicals/gasoline',
      'Microchannel FT (Velocys): Enhanced heat transfer in small channels, suits smaller distributed plants',
      'Slurry bubble column (Sasol): Catalyst suspended in liquid wax, excellent heat removal',
      'Shell SMDS (fixed-bed multitubular): Proven at >100,000 bbl/day scale (Pearl GTL, Qatar)',
    ],
    references: [
      'Dry, M.E. "The Fischer-Tropsch process: 1950–2000." Catalysis Today, 2002.',
      'Iglesia, E. "Design, synthesis, and use of cobalt-based FT synthesis catalysts." Applied Catalysis A, 1997.',
      'Steynberg, A. & Dry, M. "Fischer-Tropsch Technology." Studies in Surface Science and Catalysis, 2004.',
    ],
  },
};

const rwgs: ProcessTemplate = {
  id: 'tpl-rwgs',
  name: 'Reverse Water-Gas Shift (RWGS)',
  category: 'reaction',
  tags: ['RWGS', 'CO₂', 'syngas', 'carbon capture', 'power-to-liquid', 'endothermic', 'Lydian'],
  commonPathways: ['Fischer-Tropsch (CO₂ route)', 'Power-to-Liquid', 'E-fuels'],
  template: {
    name: 'Reverse Water-Gas Shift',
    nodeType: 'process',
    conditions: {
      temperature: { value: 950, unit: '°C' },
      pressure: { value: 25, unit: 'bar' },
      catalyst: 'Ni/Al₂O₃ or Fe-Cr oxide (some designs are non-catalytic at >900°C)',
      residenceTime: '< 1 second (high temperature, fast kinetics)',
    },
    inputs: [
      { streamId: '', substance: 'CO₂', massFlow: { value: 440, unit: 'kg/h' }, phase: 'gas' },
      { streamId: '', substance: 'H₂', massFlow: { value: 100, unit: 'kg/h' }, phase: 'gas' },
    ],
    outputs: [
      { streamId: '', substance: 'Syngas (H₂:CO ≈ 2:1)', massFlow: { value: 420, unit: 'kg/h' }, phase: 'gas' },
      { streamId: '', substance: 'H₂O', massFlow: { value: 120, unit: 'kg/h' }, phase: 'gas' },
    ],
    energyInput: { value: 1.5, unit: 'MW', source: 'Electric resistive heating or fired furnace' },
    education: {
      summary: 'Converts CO₂ and H₂ into syngas (CO + H₂) by running the water-gas shift reaction in reverse. This is the key link between captured CO₂ and synthetic fuel production.',
      chemistry: 'CO₂ + H₂ ⇌ CO + H₂O   (ΔH = +41 kJ/mol, endothermic)\nOverall with excess H₂: CO₂ + 3 H₂ → CO + H₂O + 2 H₂  (produces 2:1 H₂:CO syngas)',
      explanation: 'The reverse water-gas shift (RWGS) is the thermodynamic reverse of the industrial WGS reaction used in hydrogen production. Because the forward WGS is exothermic (-41 kJ/mol), the reverse is endothermic and favored at high temperatures (Le Chatelier\'s principle). At 800–1000°C, equilibrium CO₂ conversion can exceed 60–95% depending on H₂:CO₂ feed ratio and pressure. Companies like Lydian Fuels use electrically-heated reactors where renewable electricity provides the endothermic heat directly via resistive heating of the catalyst bed or reactor walls — avoiding the need to burn fuel for process heat. This makes the entire carbon path: CO₂ → CO → hydrocarbons, with only renewable electricity and green H₂ as inputs.',
      engineeringNotes: 'Key challenge: materials of construction at >900°C under pressure (nickel alloys, ceramics). Side reactions to manage: methanation (CO + 3H₂ → CH₄ + H₂O) and Boudouard reaction (2CO → CO₂ + C, causing coking). Excess H₂ suppresses coking. Water must be removed from the product to shift equilibrium forward and to protect downstream FT catalyst.',
      keyTerms: [
        { term: 'Le Chatelier\'s principle', definition: 'A system at equilibrium responds to a disturbance by shifting to counteract it. For RWGS: high temperature shifts equilibrium toward products (CO + H₂O) because the reaction is endothermic.' },
        { term: 'Equilibrium conversion', definition: 'The maximum conversion achievable at a given temperature and pressure, limited by thermodynamics rather than kinetics.' },
        { term: 'Resistive heating', definition: 'Using electricity to heat a reactor by passing current through a resistive element (the reactor wall or catalyst bed itself). Enables precise temperature control and use of renewable electricity.' },
        { term: 'Methanation', definition: 'Unwanted side reaction (CO + 3H₂ → CH₄ + H₂O) that consumes syngas. Favored at lower temperatures — avoided by operating RWGS at high temperature.' },
      ],
    },
  },
  theory: {
    principle: 'Thermodynamic equilibrium of the water-gas shift reaction. At low temperatures (<400°C), equilibrium favors CO₂ + H₂ → CO + H₂O only slightly; at high temperatures (>800°C), equilibrium strongly favors CO formation. The equilibrium constant Keq = exp(-ΔG°/RT) increases with temperature for this endothermic reaction. By operating at 900–1000°C, single-pass CO₂ conversions of 60–75% are achievable.',
    reactions: [
      {
        equation: 'CO₂ + H₂ ⇌ CO + H₂O',
        name: 'Reverse water-gas shift',
        deltaH: 41,
        deltaG: 29,
        temperatureRange: [700, 1100],
        description: 'The core equilibrium reaction. Endothermic, so favored at high temperature. At 950°C with H₂:CO₂ = 3:1, equilibrium CO₂ conversion is ~70%. With water removal and recycle, overall conversion >95% is achieved.',
      },
      {
        equation: 'CO₂ + 4 H₂ → CH₄ + 2 H₂O',
        name: 'CO₂ methanation (Sabatier reaction — undesired)',
        deltaH: -165,
        temperatureRange: [200, 500],
        description: 'Thermodynamically favored at low temperatures. At RWGS operating temperatures (>800°C), methanation is kinetically and thermodynamically suppressed. However, during startup/shutdown, passing through the 300–500°C window can cause transient methane formation.',
        catalyst: 'Ni (unfortunately, also the RWGS catalyst)',
      },
      {
        equation: '2 CO → C + CO₂',
        name: 'Boudouard reaction (carbon deposition — undesired)',
        deltaH: -172,
        temperatureRange: [400, 700],
        description: 'Carbon deposition from CO disproportionation. Favored below 700°C. At RWGS temperatures (>800°C), equilibrium disfavors this reaction. Excess H₂ in the feed also suppresses carbon formation by maintaining a reducing atmosphere.',
      },
    ],
    designVariables: [
      {
        name: 'Temperature',
        effectOfIncrease: 'Higher equilibrium CO₂ conversion, suppresses methanation and coking, but extreme materials challenges',
        typicalRange: '800–1100°C',
        tradeoff: 'Higher T = better conversion but exotic materials (Inconel, ceramics) needed, higher energy input',
      },
      {
        name: 'H₂:CO₂ feed ratio',
        effectOfIncrease: 'Higher CO₂ conversion (excess H₂ drives equilibrium), suppresses coking, but excess H₂ must be recycled',
        typicalRange: '3:1 to 4:1 (stoichiometric is 1:1)',
        tradeoff: 'Higher ratio = more conversion but larger hydrogen requirement and gas recycle volume',
      },
      {
        name: 'Pressure',
        effectOfIncrease: 'Slightly unfavorable for equilibrium (same moles both sides, but water condenses at high pressure), but matches downstream FT pressure',
        typicalRange: '1–30 bar',
        tradeoff: 'Pressure has minimal thermodynamic effect but operating at FT pressure avoids costly recompression',
      },
    ],
    variants: [
      'Catalytic RWGS at 800–900°C (Ni, Fe-Cr, or perovskite catalysts)',
      'Non-catalytic thermal RWGS at >1000°C (homogeneous gas-phase, no catalyst needed)',
      'Electrically-heated RWGS (Lydian Fuels approach — reactor walls as heating element)',
      'Solar-thermochemical RWGS (concentrated solar heat drives the reaction)',
      'Sorption-enhanced RWGS (water sorbent shifts equilibrium in situ)',
    ],
    references: [
      'Daza, Y.A. & Kuhn, J.N. "CO₂ conversion by reverse water gas shift catalysis." RSC Advances, 2016.',
      'Kaiser, P. et al. "Production of liquid hydrocarbons with CO₂ as carbon source." Chemie Ingenieur Technik, 2013.',
    ],
  },
};

const waterElectrolysis: ProcessTemplate = {
  id: 'tpl-electrolysis',
  name: 'Water Electrolysis',
  category: 'utility',
  tags: ['hydrogen', 'green H₂', 'PEM', 'alkaline', 'SOEC', 'electrolysis', 'renewable'],
  commonPathways: ['Fischer-Tropsch (green H₂)', 'Power-to-Liquid', 'HEFA (green H₂)', 'E-fuels'],
  template: {
    name: 'Water Electrolysis',
    nodeType: 'process',
    conditions: {
      temperature: { value: 80, unit: '°C' },
      pressure: { value: 30, unit: 'bar' },
      catalyst: 'PEM: Ir/Ru oxide anode, Pt/C cathode',
    },
    inputs: [
      { streamId: '', substance: 'Deionized water', massFlow: { value: 900, unit: 'kg/h' }, phase: 'liquid' },
    ],
    outputs: [
      { streamId: '', substance: 'Hydrogen (H₂)', massFlow: { value: 100, unit: 'kg/h' }, phase: 'gas' },
      { streamId: '', substance: 'Oxygen (O₂)', massFlow: { value: 800, unit: 'kg/h' }, phase: 'gas' },
    ],
    energyInput: { value: 5.5, unit: 'MW', source: 'Renewable electricity (55 kWh/kg H₂ for PEM)' },
    education: {
      summary: 'Splits water into hydrogen and oxygen using renewable electricity. The hydrogen feeds downstream processes (RWGS, HDO, FT). This is the most energy-intensive step in power-to-liquid pathways.',
      chemistry: '2 H₂O → 2 H₂ + O₂   (ΔH = +286 kJ/mol H₂, endothermic)\nCathode: 2 H₂O + 2e⁻ → H₂ + 2 OH⁻  (alkaline)\nAnode: 2 OH⁻ → ½ O₂ + H₂O + 2e⁻  (alkaline)\nOr (PEM): Anode: H₂O → ½ O₂ + 2 H⁺ + 2e⁻  |  Cathode: 2 H⁺ + 2e⁻ → H₂',
      explanation: 'Water electrolysis is the foundation of green hydrogen production. Three main technologies exist: (1) Alkaline electrolysis (most mature, 50 kWh/kg H₂, KOH electrolyte, Ni electrodes), (2) PEM — Proton Exchange Membrane (most flexible, 55 kWh/kg H₂, solid polymer electrolyte, precious metal catalysts), (3) SOEC — Solid Oxide Electrolysis Cell (most efficient at 40 kWh/kg H₂, but operates at 700–900°C using ceramic electrolyte). PEM electrolyzers are preferred for coupling with intermittent renewables because they can ramp from 0–100% in seconds and operate at high current density, giving compact footprint. The theoretical minimum energy is 39.4 kWh/kg H₂ (higher heating value of H₂); real systems are 50–55 kWh/kg due to overpotentials.',
      engineeringNotes: 'PEM stack lifetime: 60,000–80,000 hours. Water purity critical: <0.1 μS/cm conductivity (deionized). Capital cost: $500–1000/kW for PEM in 2024, projected $200–400/kW at scale by 2030. For a typical FT plant producing 1000 bbl/day of synthetic fuel, roughly 200 MW of electrolysis capacity is needed.',
      keyTerms: [
        { term: 'Green hydrogen', definition: 'Hydrogen produced by water electrolysis powered by renewable electricity. Distinguished from grey (natural gas SMR) and blue (SMR + CCS) hydrogen.' },
        { term: 'PEM', definition: 'Proton Exchange Membrane — a solid polymer (Nafion) that conducts protons but not electrons, enabling electrochemical water splitting.' },
        { term: 'Overpotential', definition: 'Extra voltage beyond the thermodynamic minimum needed to drive the reaction at practical rates. Caused by kinetic barriers at electrodes and ionic resistance in the membrane.' },
        { term: 'SOEC', definition: 'Solid Oxide Electrolysis Cell — operates at 700–900°C with a ceramic electrolyte (YSZ). Can use waste heat to improve efficiency to ~40 kWh/kg H₂.' },
      ],
    },
  },
  theory: {
    principle: 'Electrochemical water splitting. Electrical energy drives the thermodynamically unfavorable decomposition of water. At the cathode, water molecules accept electrons to form H₂ gas. At the anode, hydroxide ions (alkaline) or water (PEM) are oxidized to release O₂ and electrons. The minimum cell voltage is 1.23 V (reversible potential at 25°C), but real cells operate at 1.6–2.0 V due to activation overpotential (slow oxygen evolution kinetics), ohmic losses (membrane/electrolyte resistance), and mass transport limitations.',
    reactions: [
      {
        equation: '2 H₂O(l) → 2 H₂(g) + O₂(g)',
        name: 'Overall water splitting',
        deltaH: 286,
        deltaG: 237,
        description: 'The overall reaction. ΔG = 237 kJ/mol gives the minimum electrical work (1.23 V). ΔH = 286 kJ/mol includes the entropy term — the difference (TΔS = 49 kJ/mol) can be supplied as heat, which is why high-temperature SOEC is more electrically efficient.',
      },
      {
        equation: '2 H₂O + 2e⁻ → H₂ + 2 OH⁻',
        name: 'Cathode reaction (alkaline)',
        description: 'Hydrogen evolution reaction (HER). Relatively fast on Ni or Pt catalysts. The overpotential is small (~50 mV) compared to the anode reaction.',
        catalyst: 'Ni (alkaline) or Pt/C (PEM)',
      },
      {
        equation: '2 OH⁻ → ½ O₂ + H₂O + 2e⁻',
        name: 'Anode reaction (alkaline) — oxygen evolution',
        description: 'Oxygen evolution reaction (OER). This is the kinetically limiting step — breaking O-H bonds and forming O=O requires high overpotential (~300–400 mV). Improving OER catalysts is a major research focus.',
        catalyst: 'Ni-Fe oxides (alkaline) or IrO₂/RuO₂ (PEM)',
      },
    ],
    designVariables: [
      {
        name: 'Current density',
        effectOfIncrease: 'Higher H₂ production rate per cell area, but higher overpotential losses (lower efficiency)',
        typicalRange: '0.5–2.0 A/cm² (PEM); 0.2–0.5 A/cm² (alkaline)',
        tradeoff: 'Higher current density = smaller stack (lower capital) but lower efficiency (higher opex)',
      },
      {
        name: 'Operating temperature',
        effectOfIncrease: 'Lower thermodynamic voltage needed, faster kinetics, but accelerated material degradation',
        typicalRange: '60–80°C (PEM), 70–90°C (alkaline), 700–900°C (SOEC)',
        tradeoff: 'Higher T = better efficiency but shorter lifetime and more complex balance of plant',
      },
      {
        name: 'Pressure',
        effectOfIncrease: 'Produces pressurized H₂ directly (avoids external compressor), but slightly higher cell voltage and gas crossover risk',
        typicalRange: '1–80 bar (PEM can electrolyze at pressure; alkaline typically 1–30 bar)',
        tradeoff: 'Higher pressure = saves compressor cost but increases crossover and membrane stress',
      },
    ],
    variants: [
      'PEM electrolysis: Best for variable renewable power, fast response, compact',
      'Alkaline electrolysis: Most mature, lowest cost, uses non-precious metals',
      'SOEC (solid oxide): Highest efficiency when waste heat available, reversible (fuel cell mode)',
      'AEM (anion exchange membrane): Emerging, combines PEM compactness with alkaline cost advantage',
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// SEPARATION OPERATIONS
// ─────────────────────────────────────────────────────────────

const atmosphericDistillation: ProcessTemplate = {
  id: 'tpl-atm-distillation',
  name: 'Atmospheric Distillation (CDU)',
  category: 'separation',
  tags: ['distillation', 'crude', 'CDU', 'fractionation', 'kerosene', 'conventional'],
  commonPathways: ['Conventional refining', 'Crude-to-jet'],
  template: {
    name: 'Atmospheric Distillation',
    nodeType: 'process',
    conditions: {
      temperature: { value: 360, unit: '°C' },
      pressure: { value: 1.5, unit: 'bar' },
      residenceTime: '30–60 trays, liquid residence ~10 min per tray',
    },
    inputs: [
      { streamId: '', substance: 'Desalted crude oil', massFlow: { value: 10000, unit: 'kg/h' }, phase: 'liquid' },
    ],
    outputs: [
      { streamId: '', substance: 'Light naphtha (C5–C6, <80°C)', massFlow: { value: 500, unit: 'kg/h' }, phase: 'gas' },
      { streamId: '', substance: 'Heavy naphtha (C6–C10, 80–150°C)', massFlow: { value: 1500, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Kerosene (C9–C16, 150–250°C)', massFlow: { value: 1200, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Diesel (C14–C20, 250–370°C)', massFlow: { value: 2500, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Atmospheric residue (>370°C)', massFlow: { value: 4300, unit: 'kg/h' }, phase: 'liquid' },
    ],
    energyInput: { value: 4.0, unit: 'MW', source: 'Fired furnace + reboiler steam' },
    education: {
      summary: 'Separates crude oil into boiling-range fractions by vapor-liquid equilibrium in a tall column. No chemical reactions — purely physical separation.',
      chemistry: 'No chemical reactions — this is a physical separation based on vapor-liquid equilibrium at different temperatures.\n\nRaoult\'s Law (ideal): pᵢ = xᵢ · P°ᵢ(T)\nRelative volatility: αᵢⱼ = P°ᵢ / P°ⱼ',
      explanation: 'The atmospheric distillation unit (CDU) is the first and largest unit in any refinery. Crude oil is heated in a fired furnace to ~360°C (partially vaporizing it) and fed to a large column (50–80 m tall, 30–50 trays). Heavier components remain liquid and flow down; lighter components vaporize and rise. At each tray, ascending vapor contacts descending liquid, transferring lighter molecules upward and heavier molecules downward. Side-draw products are withdrawn at different heights corresponding to different boiling ranges. The overhead condenser collects the lightest fractions. For a typical medium crude, the column yields roughly: 5% light gases, 15–20% naphtha, 10–15% kerosene, 20–25% diesel, and 40–50% atmospheric residue (which goes to vacuum distillation or conversion units).',
      engineeringNotes: 'The CDU is the most energy-intensive unit in a refinery, consuming 40–50% of total refinery fuel. Heat integration is critical — the crude preheat train recovers 60–70% of furnace heat by exchanging hot product streams against cold crude feed. Modern crude columns operate at slightly above atmospheric pressure (1.1–1.5 bar) at the top.',
      keyTerms: [
        { term: 'Boiling range', definition: 'The temperature interval over which a petroleum fraction distills. Kerosene: 150–250°C. Diesel: 250–370°C.' },
        { term: 'Side-draw', definition: 'A product stream withdrawn from the side of a distillation column at a specific tray, corresponding to a particular boiling range.' },
        { term: 'Preheat train', definition: 'A network of heat exchangers that recovers heat from hot product streams to preheat cold crude feed before the furnace, reducing fuel consumption.' },
      ],
    },
  },
  theory: {
    principle: 'Vapor-liquid equilibrium (VLE) separation. Components separate based on their relative volatility — the ratio of vapor pressures at a given temperature. In a multi-stage column, repeated vaporization and condensation on each tray enriches light components at the top and heavy components at the bottom. Crude oil contains thousands of components, so separation is by boiling range rather than individual species.',
    reactions: [],
    designVariables: [
      {
        name: 'Furnace outlet temperature',
        effectOfIncrease: 'More crude vaporized, heavier cuts pulled overhead, but risk of thermal cracking above 370–380°C',
        typicalRange: '340–380°C',
        tradeoff: 'Higher T = more overhead product but risk of cracking and coking in furnace tubes',
      },
      {
        name: 'Number of trays',
        effectOfIncrease: 'Sharper separation between fractions (better product quality), but taller and more expensive column',
        typicalRange: '30–50 trays',
        tradeoff: 'More trays = sharper cuts but higher capital cost and pressure drop',
      },
      {
        name: 'Reflux ratio',
        effectOfIncrease: 'Better separation sharpness, but higher energy consumption (more condensing and reboiling)',
        typicalRange: '1.0–3.0',
        tradeoff: 'Higher reflux = sharper products but more energy and larger condenser/reboiler',
      },
    ],
    variants: [
      'Pre-flash column (reduces CDU load by removing lights before the main column)',
      'Vacuum distillation (operates at 25–50 mmHg to separate atmospheric residue without cracking)',
      'Divided-wall column (combines two separations in one shell for energy savings)',
    ],
  },
};

const hydrocracking: ProcessTemplate = {
  id: 'tpl-hydrocracking',
  name: 'Hydrocracking',
  category: 'upgrading',
  tags: ['hydrocracking', 'FT wax', 'heavy oil', 'jet fuel', 'diesel', 'hydrogen', 'upgrading'],
  commonPathways: ['Fischer-Tropsch', 'Conventional refining', 'Gas-to-Liquids'],
  template: {
    name: 'Hydrocracking',
    nodeType: 'process',
    conditions: {
      temperature: { value: 370, unit: '°C' },
      pressure: { value: 120, unit: 'bar' },
      catalyst: 'Bifunctional: NiMo or NiW (hydrogenation) + zeolite (cracking)',
      residenceTime: 'LHSV 0.5–2.0 h⁻¹',
    },
    inputs: [
      { streamId: '', substance: 'Heavy feed (VGO or FT wax)', massFlow: { value: 1000, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Hydrogen (H₂)', massFlow: { value: 25, unit: 'kg/h' }, phase: 'gas' },
    ],
    outputs: [
      { streamId: '', substance: 'Light naphtha', massFlow: { value: 100, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Kerosene / Jet (C9–C16)', massFlow: { value: 400, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Diesel (C14–C20)', massFlow: { value: 350, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Light gases + unconverted', massFlow: { value: 175, unit: 'kg/h' }, phase: 'mixed' },
    ],
    energyOutput: { value: 0.3, unit: 'MW', source: 'Mildly exothermic (cracking endothermic + hydrogenation exothermic)' },
    education: {
      summary: 'Breaks long-chain hydrocarbons into shorter molecules (jet/diesel range) in the presence of hydrogen and a bifunctional catalyst. Especially important for converting FT wax into usable fuels.',
      chemistry: 'C₃₀H₆₂ + H₂ → C₁₅H₃₂ + C₁₅H₃₂  (ideal mid-cracking)\nC₃₀H₆₂ + H₂ → C₁₂H₂₆ + C₁₈H₃₈  (asymmetric cracking)\nCracking step: CₙH₂ₙ₊₂ → CₘH₂ₘ + C(n-m)H₂(n-m)+₂  (on acid sites)\nHydrogenation step: CₘH₂ₘ + H₂ → CₘH₂ₘ₊₂  (on metal sites)',
      explanation: 'Hydrocracking uses a bifunctional catalyst with two types of active sites working in concert: (1) Metal sites (NiMo, NiW, or Pt/Pd) that dehydrogenate paraffins to olefins and re-hydrogenate cracked fragments, and (2) Acid sites (zeolite — typically USY, beta, or ZSM-5) that crack the olefin intermediates via carbenium ion chemistry. The process: n-paraffin → dehydrogenates on metal → olefin migrates to acid site → protonated to carbenium ion → β-scission (C-C bond breaks) → fragments desorb → hydrogenated back to paraffins on metal sites. The high H₂ pressure ensures rapid re-hydrogenation, preventing over-cracking and coking. Product selectivity is controlled by: catalyst acid strength (milder = more diesel, stronger = more naphtha), temperature, and pressure. For FT wax (C20–C60 linear paraffins), hydrocracking gives an outstanding jet/diesel product with near-zero sulfur, very low aromatics, and excellent combustion properties.',
      engineeringNotes: 'H₂ consumption: 15–30 Nm³/ton feed (much less than HDO since no heteroatom removal). The high pressure (100–150 bar) is the main cost driver. Single-pass conversion: 50–80%; unconverted material is recycled (once-through or recycle operation). FT wax hydrocracking is easier than petroleum VGO cracking because FT wax has no nitrogen, sulfur, or aromatics — it\'s essentially pure linear paraffins.',
      keyTerms: [
        { term: 'Bifunctional catalyst', definition: 'A catalyst with both metal (hydrogenation/dehydrogenation) and acid (cracking) functions that work cooperatively.' },
        { term: 'β-scission', definition: 'Breaking of a C-C bond at the beta position relative to the positive charge in a carbenium ion. The primary cracking mechanism in hydrocracking.' },
        { term: 'Carbenium ion', definition: 'A positively charged carbon species (R₃C⁺) formed by protonation of an olefin on an acid catalyst site. The reactive intermediate in catalytic cracking.' },
        { term: 'Zeolite', definition: 'Crystalline aluminosilicate with regular micropores and strong acid sites. The shape and size of pores controls which molecules can react (shape selectivity).' },
      ],
    },
  },
  theory: {
    principle: 'Bifunctional catalysis via the Weisz intimacy criterion. Paraffins are dehydrogenated on metal sites to form olefins, which migrate to nearby acid sites where they are protonated and crack via β-scission. The fragments are then re-hydrogenated on metal sites. The balance between metal and acid function controls selectivity: too much acid = over-cracking; too little acid = insufficient conversion.',
    reactions: [
      {
        equation: 'n-C₃₀H₆₂ → n-C₃₀H₆₀ + H₂',
        name: 'Dehydrogenation (on metal sites)',
        description: 'First step: the metal function removes H₂ from the paraffin to create an olefin intermediate. This is fast and reversible.',
        catalyst: 'NiMo, NiW, or Pt',
      },
      {
        equation: 'C₃₀H₆₀ + H⁺ → C₃₀H₆₁⁺ (carbenium ion)',
        name: 'Protonation (on acid sites)',
        description: 'The olefin migrates to a Brønsted acid site on the zeolite where it accepts a proton to form a carbenium ion — the key reactive intermediate.',
        catalyst: 'USY or Beta zeolite',
      },
      {
        equation: 'C₃₀H₆₁⁺ → C₁₅H₃₁⁺ + C₁₅H₃₀',
        name: 'β-scission (cracking)',
        description: 'The carbenium ion undergoes C-C bond cleavage at the beta position, splitting into a smaller carbenium ion and an olefin. The position of scission determines the product carbon number distribution.',
        catalyst: 'Zeolite acid sites',
      },
      {
        equation: 'C₁₅H₃₀ + H₂ → C₁₅H₃₂',
        name: 'Re-hydrogenation (on metal sites)',
        description: 'The olefin fragment quickly re-hydrogenates to a stable paraffin on a nearby metal site. This prevents secondary cracking and coking, which is why high H₂ pressure is essential.',
        catalyst: 'NiMo, NiW, or Pt',
      },
    ],
    designVariables: [
      {
        name: 'Temperature',
        effectOfIncrease: 'Higher conversion, lighter products, but more gas make and faster catalyst deactivation by coking',
        typicalRange: '350–420°C',
        tradeoff: 'Higher T = more conversion but lighter products (more naphtha, less diesel) and shorter catalyst life',
      },
      {
        name: 'H₂ partial pressure',
        effectOfIncrease: 'Suppresses coking, longer catalyst life, more saturated products, but higher compression cost',
        typicalRange: '80–150 bar',
        tradeoff: 'Higher pressure = better product quality and catalyst life but expensive vessels and compressors',
      },
      {
        name: 'Zeolite acidity / type',
        effectOfIncrease: 'More acid sites = higher cracking activity but potentially over-cracking to light gases',
        typicalRange: 'USY (mild), Beta (moderate), ZSM-5 (strong)',
        tradeoff: 'Stronger acid = higher conversion but narrower product range and more gas',
      },
    ],
    variants: [
      'Mild hydrocracking (50–80 bar): lower conversion, used as pre-treatment',
      'Severe hydrocracking (100–200 bar): high conversion, max jet/diesel yield',
      'Wax hydrocracking: FT wax upgrading, very clean feed, excellent product quality',
      'Residue hydrocracking (LC-Fining, H-Oil): processes atmospheric/vacuum residue',
    ],
    references: [
      'Weitkamp, J. "Catalytic Hydrocracking — Mechanisms and Versatility." ChemCatChem, 2012.',
      'Scherzer, J. & Gruia, A.J. "Hydrocracking Science and Technology." CRC Press, 1996.',
    ],
  },
};

const isomerization: ProcessTemplate = {
  id: 'tpl-isomerization',
  name: 'Hydroisomerization',
  category: 'upgrading',
  tags: ['isomerization', 'cold flow', 'pour point', 'jet fuel', 'HEFA', 'branching', 'dewaxing'],
  commonPathways: ['HEFA', 'Fischer-Tropsch', 'HVO'],
  template: {
    name: 'Hydroisomerization',
    nodeType: 'process',
    conditions: {
      temperature: { value: 300, unit: '°C' },
      pressure: { value: 35, unit: 'bar' },
      catalyst: 'Pt/SAPO-11 or Pt/ZSM-22 (shape-selective zeolite)',
      residenceTime: 'LHSV 1.0–2.0 h⁻¹',
    },
    inputs: [
      { streamId: '', substance: 'n-Paraffins (C15–C18)', massFlow: { value: 1000, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Hydrogen (H₂)', massFlow: { value: 5, unit: 'kg/h' }, phase: 'gas' },
    ],
    outputs: [
      { streamId: '', substance: 'Iso-paraffins (branched C15–C18)', massFlow: { value: 950, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Light cracking products', massFlow: { value: 55, unit: 'kg/h' }, phase: 'gas' },
    ],
    education: {
      summary: 'Converts straight-chain n-paraffins into branched iso-paraffins to dramatically improve cold flow properties (freeze point, pour point) without changing the carbon number — essential for making jet fuel.',
      chemistry: 'n-C₁₆H₃₄ → iso-C₁₆H₃₄  (skeletal isomerization, ΔH ≈ -5 kJ/mol)\nn-hexadecane (freeze +18°C) → 2-methylpentadecane (freeze -17°C)\nMechanism: n-paraffin → dehydrogenate → olefin → protonate → carbenium ion → methyl shift or PCP branching → deprotonate → iso-olefin → hydrogenate → iso-paraffin',
      explanation: 'The n-paraffins produced by HDO or Fischer-Tropsch have excellent combustion properties but terrible cold flow: n-C16 (cetane) freezes at +18°C, while jet fuel needs freeze point below -40°C. Hydroisomerization introduces methyl branches along the chain, which disrupt crystal packing and dramatically lower the freeze/pour point — often by 40–60°C — with minimal loss of carbon number or energy content. The key is selectivity: you want branching (isomerization) without chain breaking (cracking). This is achieved with shape-selective zeolite catalysts (SAPO-11, ZSM-22, ZSM-23) whose 1D pore channels allow mono-branched isomers to form and diffuse out, but prevent the multi-branched isomers that would easily crack. Pt provides the metal function for dehydrogenation/rehydrogenation.',
      engineeringNotes: 'Isomerization conversion is typically 60–80%, with 90–95% selectivity to iso-paraffins (5–10% cracking losses). The unconverted n-paraffins can be recycled for higher overall isomer yield. H₂ consumption is very low (only catalyst maintenance, not stoichiometric). Product freeze point depends on conversion: -40°C to -60°C is achievable for HEFA-SPK meeting ASTM D7566.',
      keyTerms: [
        { term: 'Iso-paraffin', definition: 'A branched-chain alkane (e.g., 2-methylpentadecane). Has the same molecular formula as the linear n-paraffin but different structure and physical properties.' },
        { term: 'Freeze point', definition: 'Temperature at which fuel begins to form solid crystals. Jet A-1 spec: <-47°C. n-C16: +18°C. Iso-C16: as low as -40°C.' },
        { term: 'Shape selectivity', definition: 'The ability of a zeolite\'s pore geometry to control which molecular shapes can enter, react, and exit. SAPO-11\'s 1D pores favor mono-methyl branching.' },
        { term: 'PCP mechanism', definition: 'Protonated Cyclopropane — a reaction intermediate where a methyl group migrates along the carbon chain via a three-membered ring transition state.' },
      ],
    },
  },
  theory: {
    principle: 'Shape-selective bifunctional catalysis. The zeolite\'s pore geometry (SAPO-11: 4.0×6.5 Å, 1D channels) controls product shape: n-paraffins enter the pores, isomerize to mono-branched products that can diffuse out, but di/tri-branched products are too bulky to form or exit — preventing over-branching that leads to cracking. This "product shape selectivity" is the key to high isomerization selectivity.',
    reactions: [
      {
        equation: 'n-C₁₆H₃₄ ⇌ 2-methyl-C₁₅H₃₂',
        name: 'Skeletal isomerization',
        deltaH: -5,
        description: 'Conversion of a linear n-paraffin to a mono-methyl branched isomer. Nearly thermoneutral. Equilibrium slightly favors branched isomers at lower temperatures.',
      },
      {
        equation: 'n-C₁₆H₃₄ → C₈H₁₈ + C₈H₁₆',
        name: 'Undesired cracking',
        description: 'Over-reaction: if the intermediate carbenium ion undergoes β-scission instead of methyl shift. Minimized by using mild acid strength zeolites and moderate temperature.',
      },
    ],
    designVariables: [
      {
        name: 'Temperature',
        effectOfIncrease: 'Higher isomerization rate but also more cracking; equilibrium slightly less favorable for branching',
        typicalRange: '280–340°C',
        tradeoff: 'Higher T = faster but less selective; optimal is just enough temperature for target conversion',
      },
      {
        name: 'Conversion (recycle rate)',
        effectOfIncrease: 'Lower freeze point (more n-paraffins converted), but more cracking losses at high per-pass conversion',
        typicalRange: '60–90% n-paraffin conversion',
        tradeoff: 'Higher conversion = better cold flow but more cracking; use recycle to get high overall conversion at moderate per-pass severity',
      },
      {
        name: 'Zeolite pore size',
        effectOfIncrease: 'Larger pores allow multi-branching (lower freeze point per isomer) but more cracking',
        typicalRange: 'SAPO-11 (6.5 Å) or ZSM-22 (5.5 Å)',
        tradeoff: 'Larger pores = more branching flexibility but risk of over-branching → cracking',
      },
    ],
    variants: [
      'Catalytic dewaxing (removes rather than isomerizes n-paraffins — simpler but lower yield)',
      'Pt/SAPO-11: Premium jet fuel isomerization catalyst (high selectivity)',
      'Pt/ZSM-22: Alternative with slightly different pore geometry',
      'Dual catalyst system: isomerization + mild hydrocracking in series',
    ],
  },
};

const hydrotreating: ProcessTemplate = {
  id: 'tpl-hydrotreating',
  name: 'Hydrotreating (HDS/HDN)',
  category: 'upgrading',
  tags: ['hydrotreating', 'HDS', 'HDN', 'desulfurization', 'jet fuel', 'diesel', 'conventional'],
  commonPathways: ['Conventional refining', 'Crude-to-jet', 'Co-processing'],
  template: {
    name: 'Kerosene Hydrotreater',
    nodeType: 'process',
    conditions: {
      temperature: { value: 330, unit: '°C' },
      pressure: { value: 40, unit: 'bar' },
      catalyst: 'CoMo/Al₂O₃ (for sulfur) or NiMo/Al₂O₃ (for nitrogen + refractory S)',
      residenceTime: 'LHSV 1.5–3.0 h⁻¹',
    },
    inputs: [
      { streamId: '', substance: 'Straight-run kerosene', massFlow: { value: 1000, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Hydrogen (H₂)', massFlow: { value: 5, unit: 'kg/h' }, phase: 'gas' },
    ],
    outputs: [
      { streamId: '', substance: 'Hydrotreated kerosene', massFlow: { value: 995, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'H₂S + NH₃ (off-gas)', massFlow: { value: 10, unit: 'kg/h' }, phase: 'gas' },
    ],
    energyOutput: { value: 0.15, unit: 'MW', source: 'Mildly exothermic' },
    education: {
      summary: 'Removes sulfur, nitrogen, and other contaminants from petroleum kerosene using hydrogen and a catalyst. Converts organic S/N compounds to H₂S and NH₃ which are washed out.',
      chemistry: 'R-SH + H₂ → R-H + H₂S  (mercaptan desulfurization)\nR₂S + 2 H₂ → 2 R-H + H₂S  (thioether removal)\nC₄H₄S (thiophene) + 4 H₂ → C₄H₁₀ + H₂S  (HDS of aromatics)\nC₈H₆S (benzothiophene) + 2 H₂ → C₈H₁₀ + H₂S\nR-NH₂ + H₂ → R-H + NH₃  (hydrodenitrogenation)\nOlefin + H₂ → paraffin  (olefin saturation)',
      explanation: 'Hydrotreating is the most widely used catalytic process in petroleum refining. For kerosene/jet fuel, the primary targets are sulfur (specification: <3000 ppm → final Jet A-1 spec <0.3 wt%) and nitrogen (which poisons downstream catalysts). The catalyst operates via a sulfide phase: CoMoS₂ or NiMoS₂ on alumina support. Sulfur compounds adsorb on coordinatively unsaturated sites (CUS) at the edges of MoS₂ slabs, where C-S bonds are hydrogenolyzed. Easy sulfur (mercaptans, thioethers) reacts first; refractory sulfur (dibenzothiophene and its alkylated derivatives) requires higher severity. CoMo catalysts are preferred for easy desulfurization; NiMo catalysts for deep HDS and HDN. The H₂S produced is separated in an amine scrubber and sent to a Claus unit for sulfur recovery.',
      engineeringNotes: 'H₂ consumption is low for hydrotreating: 5–15 Nm³/ton (compare to 300–400 for HEFA HDO). Catalyst life: 2–5 years. Operating pressure: 30–70 bar depending on severity. Kerosene hydrotreating is mild compared to diesel — lower sulfur content in the feed and less refractory sulfur species.',
      keyTerms: [
        { term: 'HDS', definition: 'Hydrodesulfurization — catalytic removal of sulfur from organic compounds using H₂, producing H₂S as byproduct.' },
        { term: 'HDN', definition: 'Hydrodenitrogenation — catalytic removal of nitrogen from organic compounds using H₂, producing NH₃ as byproduct.' },
        { term: 'Mercaptan', definition: 'An organic sulfur compound with -SH group (thiol). Easily removed by hydrotreating. Example: butanethiol.' },
        { term: 'Refractory sulfur', definition: 'Sulfur compounds that are difficult to remove — especially 4,6-dialkyl-dibenzothiophenes, which have steric hindrance around the S atom.' },
        { term: 'Amine scrubbing', definition: 'Gas treatment process where an amine solution (MEA, DEA, or MDEA) selectively absorbs H₂S from the reactor off-gas.' },
      ],
    },
  },
  theory: {
    principle: 'Catalytic hydrogenolysis of heteroatom bonds (C-S, C-N, C-O) on transition metal sulfide catalysts. The active phase is MoS₂ nano-slabs decorated with Co or Ni promoter atoms at the edges. Reactant molecules adsorb at sulfur vacancies (coordinatively unsaturated sites) on the slab edge, where the C-heteroatom bond is cleaved by hydrogenation.',
    reactions: [
      {
        equation: 'C₄H₄S + 4 H₂ → C₄H₁₀ + H₂S',
        name: 'Thiophene HDS (direct desulfurization)',
        deltaH: -262,
        description: 'The C-S bond is directly cleaved by hydrogen, releasing the sulfur as H₂S. This "DDS" pathway is dominant for less-hindered sulfur compounds. The ring opens and is fully saturated.',
        catalyst: 'CoMo/Al₂O₃',
      },
      {
        equation: 'C₁₂H₈S + 2 H₂ → C₁₂H₁₀ + H₂S',
        name: 'Dibenzothiophene HDS',
        description: 'For bulky aromatic sulfur compounds, the reaction can proceed via either DDS (direct C-S bond breaking) or HYD (ring hydrogenation first, then C-S cleavage). The HYD route is dominant for sterically hindered 4,6-dimethyl-DBT.',
        catalyst: 'NiMo/Al₂O₃ (better for HYD pathway)',
      },
      {
        equation: 'C₅H₅N + 5 H₂ → C₅H₁₂ + NH₃',
        name: 'Pyridine HDN',
        deltaH: -300,
        description: 'Nitrogen removal is harder than sulfur removal because C-N bonds are stronger. The aromatic ring must first be saturated before C-N cleavage can occur. This is why NiMo (stronger hydrogenation) is preferred for HDN.',
        catalyst: 'NiMo/Al₂O₃',
      },
    ],
    designVariables: [
      {
        name: 'Temperature',
        effectOfIncrease: 'Higher conversion of refractory compounds, but risk of catalyst coking and product color degradation',
        typicalRange: '300–380°C',
        tradeoff: 'Higher T = more HDS but shorter catalyst life and potential cracking',
      },
      {
        name: 'H₂ partial pressure',
        effectOfIncrease: 'Better desulfurization, suppresses coke formation, longer catalyst life',
        typicalRange: '30–70 bar',
        tradeoff: 'Higher pressure = better performance but more expensive equipment',
      },
      {
        name: 'LHSV',
        effectOfIncrease: 'Higher throughput but lower sulfur removal; may not meet product spec',
        typicalRange: '1.0–4.0 h⁻¹',
        tradeoff: 'Higher LHSV = more capacity but less contact time for reactions',
      },
    ],
    variants: [
      'Kerosene/jet hydrotreating (mild, CoMo)',
      'Ultra-low sulfur diesel (ULSD, <10 ppm S, requires NiMo + high severity)',
      'Naphtha hydrotreating (pre-treatment for catalytic reforming)',
      'Residue hydrotreating (demetallization + desulfurization of heavy feeds)',
    ],
  },
};

// Feedstock templates
const crudeFeedstock: ProcessTemplate = {
  id: 'tpl-crude-feedstock',
  name: 'Crude Oil Feedstock',
  category: 'feedstock-preparation',
  tags: ['crude', 'petroleum', 'API gravity', 'conventional', 'feedstock'],
  commonPathways: ['Conventional refining'],
  template: {
    name: 'Crude Oil',
    nodeType: 'feedstock',
    inputs: [],
    outputs: [
      { streamId: '', substance: 'Crude oil', massFlow: { value: 10000, unit: 'kg/h' }, phase: 'liquid' },
    ],
    education: {
      summary: 'Naturally occurring mixture of hydrocarbons ranging from C1 to C60+, with minor sulfur, nitrogen, oxygen, and metal contaminants.',
      explanation: 'Crude oil is a complex mixture of thousands of hydrocarbon species formed by thermal decomposition of ancient marine organisms over millions of years. It is classified by API gravity (light >31°, medium 22–31°, heavy <22°) and sulfur content (sweet <0.5 wt% S, sour >0.5 wt% S). Typical composition: 15–25% gasoline-range (C5–C10), 10–15% kerosene-range (C9–C16), 15–20% diesel-range (C14–C20), and the remainder heavier fractions. The kerosene fraction (150–250°C boiling range) is the basis for jet fuel production.',
      keyTerms: [
        { term: 'API gravity', definition: 'An inverse measure of petroleum density: API = 141.5/(SG at 60°F) - 131.5. Higher API = lighter crude. Water = 10° API.' },
        { term: 'Sweet vs sour', definition: 'Sweet crude has <0.5 wt% sulfur; sour crude has >0.5 wt%. Sweet crudes are more valuable because they require less hydrotreating.' },
      ],
    },
  },
  theory: {
    principle: 'Crude oil is the starting material for conventional refining. Its composition determines the product slate and processing requirements.',
    reactions: [],
    designVariables: [],
  },
};

const tallowFeedstock: ProcessTemplate = {
  id: 'tpl-tallow-feedstock',
  name: 'Tallow / Used Cooking Oil Feedstock',
  category: 'feedstock-preparation',
  tags: ['tallow', 'UCO', 'WCO', 'animal fat', 'lipid', 'HEFA', 'feedstock', 'renewable'],
  commonPathways: ['HEFA', 'HVO', 'Biodiesel'],
  template: {
    name: 'Technical Tallow',
    nodeType: 'feedstock',
    inputs: [],
    outputs: [
      { streamId: '', substance: 'Technical tallow', massFlow: { value: 1000, unit: 'kg/h' }, phase: 'liquid' },
    ],
    education: {
      summary: 'Rendered animal fat (tallow) or used cooking oil — the primary feedstocks for HEFA/HVO jet fuel production. Lipid-rich feedstock composed mainly of triglycerides (C14–C22 fatty acid chains).',
      explanation: 'Technical tallow is rendered from slaughterhouse byproducts (beef, pork, poultry). It consists of ~95% triglycerides (three fatty acid chains on a glycerol backbone) with minor free fatty acids (FFA, 2–15%), moisture, and impurities (phospholipids, metals, sulfur compounds). The fatty acid profile is predominantly C16:0 (palmitic, 25%), C18:0 (stearic, 20%), and C18:1 (oleic, 40%). This profile determines the n-paraffin chain length distribution after HDO: mainly C15–C18. Tallow is classified as a waste material, making it attractive for its low CI (carbon intensity) score under LCFS/RED frameworks. Used cooking oil (UCO) is similar but has higher FFA content (5–25%) and more polymerized species from frying.',
      keyTerms: [
        { term: 'Triglyceride', definition: 'An ester of glycerol with three fatty acids. The major component of fats and oils. General structure: glycerol backbone + 3 fatty acid chains.' },
        { term: 'FFA', definition: 'Free fatty acids — fatty acids not bound to glycerol. Formed by hydrolysis of triglycerides. Higher FFA = more acidic, more corrosive, but not a problem for HDO processing.' },
        { term: 'FAME vs HEFA', definition: 'FAME (biodiesel) transesterifies fat with methanol → fatty acid methyl esters. HEFA hydroprocesses fat with H₂ → straight hydrocarbons. HEFA produces a true hydrocarbon fuel; FAME is an oxygenated blend component.' },
        { term: 'Carbon intensity (CI)', definition: 'Lifecycle greenhouse gas emissions per unit energy of fuel, measured in gCO₂e/MJ. Tallow-HEFA has very low CI because the feedstock is a waste product.' },
      ],
    },
  },
  theory: {
    principle: 'Lipid feedstocks provide the carbon backbone for HEFA fuels. The fatty acid chain length (typically C14–C22) determines the product paraffin chain length, which sets the boiling range and fuel properties.',
    reactions: [],
    designVariables: [
      {
        name: 'FFA content',
        effectOfIncrease: 'More corrosive, but easier to process by HDO (no glycerol cracking). Higher FFA actually simplifies HDO somewhat.',
        typicalRange: '2–25% (tallow ~5%, UCO ~10–25%)',
        tradeoff: 'Higher FFA = more corrosion management but slightly simpler chemistry',
      },
      {
        name: 'Unsaturation (iodine value)',
        effectOfIncrease: 'More double bonds = more H₂ consumption for saturation, more exothermic, potential for polymerization',
        typicalRange: 'Tallow: IV 40–55, UCO: IV 60–90, Soybean oil: IV 120–140',
        tradeoff: 'Higher unsaturation = more H₂ needed and harder to manage reaction heat',
      },
    ],
    variants: [
      'Technical tallow (beef/pork rendering, lowest cost)',
      'Used cooking oil (UCO/WCO, waste classification, variable quality)',
      'Palm fatty acid distillate (PFAD, byproduct of palm oil refining)',
      'Camelina/jatropha oil (energy crops, not competing with food)',
      'Algae oil (high potential but not yet commercial at scale)',
    ],
  },
};

const co2Feedstock: ProcessTemplate = {
  id: 'tpl-co2-feedstock',
  name: 'CO₂ Feedstock (DAC or Point Source)',
  category: 'feedstock-preparation',
  tags: ['CO₂', 'carbon capture', 'DAC', 'point source', 'feedstock', 'power-to-liquid'],
  commonPathways: ['Power-to-Liquid', 'Fischer-Tropsch (CO₂ route)', 'E-fuels'],
  template: {
    name: 'CO₂ Supply',
    nodeType: 'feedstock',
    inputs: [],
    outputs: [
      { streamId: '', substance: 'CO₂', massFlow: { value: 500, unit: 'kg/h' }, phase: 'gas' },
    ],
    energyInput: { value: 0.5, unit: 'MW', source: 'DAC: 1.5–2.5 MWh/ton CO₂; Point source: 0.1–0.3 MWh/ton' },
    education: {
      summary: 'Carbon dioxide sourced from direct air capture (DAC) or industrial point sources — provides the carbon for synthetic fuels. The CO₂ source determines the fuel\'s lifecycle carbon intensity.',
      explanation: 'CO₂ for power-to-liquid fuels can come from two sources: (1) Direct Air Capture (DAC) uses solid sorbents or liquid solvents to extract CO₂ from ambient air (~420 ppm). Energy requirement: 1.5–2.5 MWh/ton CO₂ (thermal + electrical). Companies: Climeworks (solid sorbent), Carbon Engineering (liquid solvent). (2) Point source capture collects concentrated CO₂ from industrial exhaust (cement, steel, fermentation). Much cheaper (0.1–0.3 MWh/ton) because the CO₂ is concentrated (5–25% vs 0.04% in air), but only qualifies as "carbon neutral" if the source is biogenic (e.g., fermentation, biomass combustion). For truly carbon-negative fuels, DAC is required. Cost: DAC currently $400–600/ton CO₂, projected $100–200/ton at scale; point source $30–80/ton.',
      keyTerms: [
        { term: 'DAC', definition: 'Direct Air Capture — extracting CO₂ directly from the atmosphere using chemical sorbents. The most expensive but most scalable carbon source for synthetic fuels.' },
        { term: 'Biogenic CO₂', definition: 'CO₂ from biological sources (fermentation, biomass combustion). Considered carbon-neutral under lifecycle accounting because the carbon was recently atmospheric.' },
        { term: 'E-fuel', definition: 'Electrofuel — synthetic fuel made from CO₂ and green hydrogen using renewable electricity. Net-zero carbon if CO₂ is from DAC or biogenic sources.' },
      ],
    },
  },
  theory: {
    principle: 'Carbon sourcing for synthetic fuel production. The carbon atoms in every hydrocarbon molecule must come from somewhere — in e-fuels, they come from CO₂. The purity of CO₂ affects downstream processes: trace contaminants (SO₂, NOₓ, H₂O) must be removed to protect RWGS and FT catalysts.',
    reactions: [],
    designVariables: [
      {
        name: 'CO₂ purity',
        effectOfIncrease: 'Better catalyst protection downstream, less gas treatment needed',
        typicalRange: '95–99.9% (DAC: >99.9%, point source: 95–99% after treatment)',
        tradeoff: 'Higher purity = less downstream fouling but more expensive capture/purification',
      },
    ],
  },
};

const productSeparation: ProcessTemplate = {
  id: 'tpl-product-fractionation',
  name: 'Product Fractionation',
  category: 'separation',
  tags: ['distillation', 'fractionation', 'naphtha', 'kerosene', 'diesel', 'product separation'],
  commonPathways: ['HEFA', 'Fischer-Tropsch', 'Conventional refining'],
  template: {
    name: 'Product Fractionation',
    nodeType: 'process',
    conditions: {
      temperature: { value: 250, unit: '°C' },
      pressure: { value: 2, unit: 'bar' },
    },
    inputs: [
      { streamId: '', substance: 'Reactor product (broad boiling)', massFlow: { value: 1000, unit: 'kg/h' }, phase: 'liquid' },
    ],
    outputs: [
      { streamId: '', substance: 'Light naphtha (<150°C)', massFlow: { value: 100, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Jet/Kerosene (150–250°C)', massFlow: { value: 450, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Diesel (250–370°C)', massFlow: { value: 350, unit: 'kg/h' }, phase: 'liquid' },
      { streamId: '', substance: 'Heavy residual (>370°C)', massFlow: { value: 100, unit: 'kg/h' }, phase: 'liquid' },
    ],
    energyInput: { value: 0.5, unit: 'MW', source: 'Reboiler heat' },
    education: {
      summary: 'Separates the broad-boiling reactor product into individual fuel fractions (naphtha, jet, diesel) by distillation. The cut points determine each fraction\'s boiling range and yield.',
      explanation: 'After hydroprocessing (HDO, hydrocracking, or isomerization), the product is a mixture of hydrocarbons spanning C4 to C20+. Product fractionation separates this into marketable fuel fractions based on boiling point. The key cut points are: naphtha/kerosene at 150°C and kerosene/diesel at 250°C. For HEFA and FT pathways, this column is simpler than a crude unit because the feed is clean (no sulfur, metals, or heavy residue). The kerosene fraction is the jet fuel product; naphtha has value as gasoline blendstock or petrochemical feedstock; diesel has high cetane value.',
      keyTerms: [
        { term: 'Cut point', definition: 'The temperature that defines the boundary between two product fractions in distillation. The kerosene cut point (150–250°C) determines jet fuel yield and properties.' },
        { term: 'ASTM D7566', definition: 'The specification for aviation turbine fuel containing synthesized hydrocarbons (SAF). Defines requirements for HEFA-SPK, FT-SPK, and other synthetic jet fuel types.' },
      ],
    },
  },
  theory: {
    principle: 'Same as atmospheric distillation — vapor-liquid equilibrium separation — but applied to a cleaner, narrower-boiling feed from a hydroprocessing reactor.',
    reactions: [],
    designVariables: [
      {
        name: 'Kerosene cut point (initial)',
        effectOfIncrease: 'Higher initial boiling point = less light material in kerosene, higher flash point but lower yield',
        typicalRange: '140–160°C',
        tradeoff: 'Higher IBP = better flash point but less kerosene yield',
      },
      {
        name: 'Kerosene cut point (final)',
        effectOfIncrease: 'Higher final boiling point = more heavy kerosene, higher yield but worse freeze point',
        typicalRange: '240–270°C',
        tradeoff: 'Higher FBP = more yield but risk of failing freeze point spec',
      },
    ],
    variants: [
      'Simple flash separation (for narrow-range products)',
      'Full distillation column with side-draws',
      'Dividing wall column (energy-efficient 3-product split)',
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// PRODUCT TEMPLATES
// ─────────────────────────────────────────────────────────────

const jetFuelProduct: ProcessTemplate = {
  id: 'tpl-jet-fuel-product',
  name: 'Jet Fuel Product (Jet A-1 / SAF)',
  category: 'separation',
  tags: ['jet fuel', 'Jet A-1', 'SAF', 'SPK', 'product', 'ASTM D1655', 'ASTM D7566'],
  commonPathways: ['HEFA', 'Fischer-Tropsch', 'Conventional refining'],
  template: {
    name: 'Jet A-1 / SAF Product',
    nodeType: 'product',
    inputs: [
      { streamId: '', substance: 'Kerosene fraction (150–250°C)', massFlow: { value: 450, unit: 'kg/h' }, phase: 'liquid' },
    ],
    outputs: [],
    education: {
      summary: 'The final jet fuel product — either conventional Jet A-1 (ASTM D1655) or Synthetic Paraffinic Kerosene (SPK) for blending as Sustainable Aviation Fuel (SAF) under ASTM D7566.',
      explanation: 'Jet A-1 is a kerosene-type aviation turbine fuel with a boiling range of 150–250°C (C9–C16 hydrocarbons). Key specifications: flash point >38°C, freeze point <-47°C, energy density ≥42.8 MJ/kg, sulfur <0.3 wt%, aromatics <25 vol%. Conventional Jet A-1 from crude oil contains ~55% paraffins, 25% naphthenes (cycloparaffins), and 18% aromatics. SAF produced via HEFA or FT is a Synthetic Paraffinic Kerosene (SPK) — essentially pure iso-paraffins with near-zero aromatics and sulfur. SPK has superior combustion properties (lower soot, higher energy density) but cannot be used neat because aircraft seals require 8–25% aromatics for swelling. Current regulations allow SPK blending up to 50% with conventional jet fuel. The global aviation industry consumes ~300 million tons of jet fuel per year; SAF currently represents <0.1%.',
      keyTerms: [
        { term: 'SPK', definition: 'Synthetic Paraffinic Kerosene — the jet fuel-range product from HEFA or FT processing. Pure paraffinic, near-zero sulfur and aromatics. Must be blended with conventional fuel.' },
        { term: 'Drop-in fuel', definition: 'A fuel that is fully compatible with existing aircraft, engines, and infrastructure without modification. SAF blends up to 50% are drop-in.' },
        { term: 'Aromatic minimum', definition: 'Jet fuel requires a minimum aromatic content (typically 8%) because aromatic molecules swell nitrile rubber seals in fuel systems. Without aromatics, seals can shrink and leak.' },
        { term: 'Freeze point', definition: 'The temperature at which wax crystals first appear in fuel. Critical for aviation: aircraft tanks can reach -50°C at cruise altitude.' },
      ],
    },
  },
  theory: {
    principle: 'The product node represents the final fuel meeting certification specifications. All upstream processing must produce a kerosene-range hydrocarbon mixture that passes the full battery of ASTM tests.',
    reactions: [],
    designVariables: [],
  },
};

// ─────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────

export const processLibrary: ProcessTemplate[] = [
  // Feedstocks
  crudeFeedstock,
  tallowFeedstock,
  co2Feedstock,
  // Feedstock preparation
  desalting,
  degummingBleaching,
  // Reactions
  hydrodeoxygenation,
  fischerTropsch,
  rwgs,
  // Separation
  atmosphericDistillation,
  productSeparation,
  // Upgrading
  hydrocracking,
  isomerization,
  hydrotreating,
  // Utility
  waterElectrolysis,
  // Products
  jetFuelProduct,
];

export const categoryLabels: Record<string, string> = {
  'feedstock-preparation': 'Feedstock & Preparation',
  reaction: 'Core Reactions',
  separation: 'Separation & Fractionation',
  upgrading: 'Upgrading & Finishing',
  utility: 'Utilities',
};

export function searchLibrary(query: string): ProcessTemplate[] {
  const q = query.toLowerCase().trim();
  if (!q) return processLibrary;
  return processLibrary.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      t.commonPathways.some((p) => p.toLowerCase().includes(q)) ||
      t.template.education.summary.toLowerCase().includes(q)
  );
}

export function getTemplateById(id: string): ProcessTemplate | undefined {
  return processLibrary.find((t) => t.id === id);
}
