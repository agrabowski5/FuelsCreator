import { Pathway } from '../types/pathway';

export const fischerTropschGreenH2: Pathway = {
  id: 'ft-green-h2',
  name: 'Fischer-Tropsch — Green H₂ + CO₂',
  description:
    'Power-to-Liquid (PtL) Fischer-Tropsch synthesis converts green hydrogen and captured CO₂ into synthetic jet fuel. This is the approach pursued by companies like Lydian Fuels, which uses resistively heated reverse water-gas shift to create syngas, followed by cobalt-catalyzed FT synthesis. While less commercially mature than HEFA, it offers a pathway to virtually unlimited SAF scale independent of biomass availability.',
  category: 'synthetic',
  steps: [
    {
      id: 'feedstock-renewable-elec',
      name: 'Renewable Electricity',
      nodeType: 'feedstock',
      inputs: [],
      outputs: [{ streamId: 's-elec', substance: 'Electricity', massFlow: { value: 55, unit: 'MWh' }, phase: 'gas' }],
      education: {
        summary: 'Renewable electricity (wind, solar, nuclear) powers the electrolyzer and RWGS reactor, making the entire process carbon-neutral.',
        explanation:
          'The energy input to a PtL process is dominated by electrolysis (~70% of total) and the reverse water-gas shift reactor (~15%). For the process to produce truly low-carbon fuel, this electricity must come from renewable or zero-carbon sources. The Lydian Fuels approach is notable for using resistive (Joule) heating in the RWGS reactor, directly converting electricity to the high temperatures needed, rather than burning fuel. This simplifies the energy system and maximizes electrification. A typical PtL plant producing 100 kt/year of jet fuel would require ~1 GW of dedicated renewable capacity.',
        keyTerms: [
          { term: 'Power-to-Liquid (PtL)', definition: 'A process that converts renewable electricity into liquid hydrocarbon fuels via electrolysis and synthesis.' },
          { term: 'Additionality', definition: 'The principle that renewable electricity for PtL must be "additional" — new capacity, not diverted from the grid.' },
        ],
      },
    },
    {
      id: 'electrolysis',
      name: 'Water Electrolysis',
      nodeType: 'process',
      conditions: {
        temperature: { value: 80, unit: '°C' },
        pressure: { value: 30, unit: 'bar' },
      },
      inputs: [
        { streamId: 's-water-in', substance: 'Deionized Water', massFlow: { value: 900, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's-elec', substance: 'Electricity', phase: 'gas' },
      ],
      outputs: [
        { streamId: 's-h2', substance: 'Green H₂', massFlow: { value: 100, unit: 'kg/h' }, phase: 'gas' },
        { streamId: 's-o2', substance: 'O₂ (byproduct)', massFlow: { value: 800, unit: 'kg/h' }, phase: 'gas' },
      ],
      energyInput: { value: 5.5, unit: 'MW', source: 'renewable electricity' },
      education: {
        summary: 'Splits water into hydrogen and oxygen using electricity. PEM or solid oxide electrolyzers are the leading technologies.',
        chemistry: '2 H₂O → 2 H₂ + O₂   (ΔH = +286 kJ/mol H₂)',
        explanation:
          'Electrolysis is the first step in the PtL chain, converting water and electricity into green hydrogen. Three main technologies exist: (1) PEM (Proton Exchange Membrane) — operates at 50–80°C, fast ramp-up, good for intermittent renewables, ~55 kWh/kg H₂. (2) Alkaline — mature, lower cost, but slower dynamics, ~50 kWh/kg H₂. (3) SOEC (Solid Oxide Electrolyzer Cell) — operates at 700–900°C, can use waste heat to improve efficiency to ~40 kWh/kg H₂, but less mature. The Lydian Fuels approach favors PEM or SOEC, depending on heat integration opportunities with the RWGS reactor. The oxygen byproduct can be sold or used in downstream processes.',
        engineeringNotes:
          'Electrolyzer degradation is a key economic factor — stack lifetime is typically 60,000–80,000 hours for PEM. Water purity is critical: trace chlorides destroy membranes. Capital cost is ~$500–1000/kW for PEM in 2024, falling toward $200/kW at scale.',
        keyTerms: [
          { term: 'PEM Electrolyzer', definition: 'Uses a proton-conducting polymer membrane. Compact, responsive to variable power input, but requires expensive iridium/platinum catalysts.' },
          { term: 'SOEC', definition: 'Solid Oxide Electrolyzer Cell — high-temperature (700–900°C) electrolysis using a ceramic membrane. Highest efficiency but least mature.' },
          { term: 'Stack', definition: 'Multiple electrolyzer cells connected in series/parallel to achieve the desired hydrogen production rate.' },
        ],
      },
    },
    {
      id: 'co2-capture',
      name: 'CO₂ Capture',
      nodeType: 'process',
      conditions: {
        temperature: { value: 100, unit: '°C' },
        pressure: { value: 1, unit: 'bar' },
      },
      inputs: [{ streamId: 's-air', substance: 'Air / Flue Gas', phase: 'gas' }],
      outputs: [{ streamId: 's-co2', substance: 'Concentrated CO₂', massFlow: { value: 700, unit: 'kg/h' }, phase: 'gas' }],
      energyInput: { value: 1.5, unit: 'MW', source: 'heat + electricity' },
      education: {
        summary: 'Captures CO₂ from the atmosphere (DAC) or from industrial point sources to provide the carbon feedstock for FT synthesis.',
        chemistry: 'CO₂ + sorbent → loaded sorbent → (heat) → CO₂ (pure) + regenerated sorbent',
        explanation:
          'The carbon in Fischer-Tropsch jet fuel must come from CO₂. Two main sources exist: (1) Direct Air Capture (DAC) — extracts CO₂ from ambient air (~420 ppm), requiring large energy input (~1500–2000 kWh thermal + 200–400 kWh electric per ton CO₂). Companies like Climeworks and Carbon Engineering lead here. (2) Point-source capture — from industrial emitters like cement plants or ethanol fermentation, requiring ~200–400 kWh/ton total. Point source is cheaper but location-constrained. For SAF carbon accounting, the source matters: DAC provides the strongest carbon neutrality argument, while point-source capture from fossil emitters is considered recycling rather than removing carbon.',
        engineeringNotes:
          'DAC is currently the bottleneck for PtL cost and scale — at $400–600/ton CO₂ for DAC vs. $30–80/ton for point source. The Lydian approach integrates heat from the RWGS and FT reactors to reduce the energy penalty of CO₂ capture. About 3.1 ton CO₂ is needed per ton of jet fuel produced.',
        keyTerms: [
          { term: 'DAC (Direct Air Capture)', definition: 'Technology that extracts CO₂ directly from ambient air using chemical sorbents or solvents.' },
          { term: 'Point-source Capture', definition: 'Capturing CO₂ from concentrated industrial exhaust streams (cement, steel, fermentation).' },
          { term: 'Carbon Recycling', definition: 'Using captured fossil CO₂ to make fuel — displaces fossil fuel but doesn\'t remove CO₂ from the total carbon cycle.' },
        ],
      },
    },
    {
      id: 'rwgs',
      name: 'Reverse Water-Gas Shift (RWGS)',
      nodeType: 'process',
      conditions: {
        temperature: { value: 950, unit: '°C' },
        pressure: { value: 20, unit: 'bar' },
        catalyst: 'Ni/Al₂O₃ or Fe-based (Lydian: resistive heating)',
        residenceTime: 'seconds',
      },
      inputs: [
        { streamId: 's-h2', substance: 'Green H₂', massFlow: { value: 60, unit: 'kg/h' }, phase: 'gas' },
        { streamId: 's-co2', substance: 'CO₂', massFlow: { value: 700, unit: 'kg/h' }, phase: 'gas' },
      ],
      outputs: [
        { streamId: 's-syngas', substance: 'Syngas (H₂:CO ≈ 2:1)', massFlow: { value: 650, unit: 'kg/h' }, phase: 'gas' },
        { streamId: 's-rwgs-water', substance: 'H₂O', massFlow: { value: 110, unit: 'kg/h' }, phase: 'gas' },
      ],
      energyInput: { value: 2.0, unit: 'MW', source: 'resistive electric heating' },
      education: {
        summary: 'Converts CO₂ + H₂ into syngas (CO + H₂) — the key step that transforms captured carbon into a building block for hydrocarbons.',
        chemistry:
          'CO₂ + H₂ ⇌ CO + H₂O   (ΔH = +41 kJ/mol, endothermic)\nOverall: CO₂ + 3 H₂ → CO + H₂O + 2 H₂ (targeting 2:1 H₂:CO ratio)',
        explanation:
          'The Reverse Water-Gas Shift (RWGS) reaction is the bridge between CO₂ and hydrocarbons. It converts CO₂ and H₂ into CO and water — the CO then combines with H₂ to form syngas, the feedstock for Fischer-Tropsch synthesis. The reaction is endothermic and thermodynamically favored at high temperatures (>800°C). The Lydian Fuels innovation is to heat the reactor resistively (like an electric furnace) rather than burning fuel, achieving ~95% CO₂ conversion at 950°C with ~2 kWh/kg CO₂. The H₂:CO ratio of the product syngas is tuned to ~2:1, which is optimal for cobalt-catalyzed FT synthesis. Water is condensed out and can be recycled to the electrolyzer.',
        engineeringNotes:
          'High-temperature operation poses materials challenges — reactor alloys must withstand 1000°C+ under reducing atmosphere. The Lydian approach uses a compact, modular reactor design with rapid thermal cycling capability, suited to intermittent renewable power. Carbon deposition (coking) on the catalyst is managed by maintaining excess H₂.',
        keyTerms: [
          { term: 'Syngas', definition: 'A mixture of carbon monoxide (CO) and hydrogen (H₂) — the universal building block for synthetic fuels and chemicals.' },
          { term: 'Water-Gas Shift', definition: 'CO + H₂O ⇌ CO₂ + H₂. The RWGS is the reverse: CO₂ + H₂ → CO + H₂O, driven by high temperature.' },
          { term: 'Resistive Heating', definition: 'Heating by passing electric current through a resistant conductor — Lydian\'s key innovation for electrically driven RWGS.' },
        ],
      },
    },
    {
      id: 'ft-reactor',
      name: 'Fischer-Tropsch Reactor',
      nodeType: 'process',
      conditions: {
        temperature: { value: 220, unit: '°C' },
        pressure: { value: 25, unit: 'bar' },
        catalyst: 'Cobalt/Al₂O₃ (Co/Al₂O₃)',
        residenceTime: '10–30 seconds per pass',
      },
      inputs: [{ streamId: 's-syngas', substance: 'Syngas', massFlow: { value: 650, unit: 'kg/h' }, phase: 'gas' }],
      outputs: [
        { streamId: 's-ft-wax', substance: 'FT Wax + Liquids (C5–C60+)', massFlow: { value: 350, unit: 'kg/h' }, phase: 'mixed' },
        { streamId: 's-ft-water', substance: 'H₂O', massFlow: { value: 250, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's-ft-tail', substance: 'Tail gas (CH₄, C2–C4)', massFlow: { value: 50, unit: 'kg/h' }, phase: 'gas' },
      ],
      energyOutput: { value: 1.5, unit: 'MW', source: 'exothermic reaction' },
      education: {
        summary: 'The core synthesis: CO and H₂ polymerize on a cobalt catalyst surface into long-chain hydrocarbons — synthetic crude oil.',
        chemistry:
          'n CO + (2n+1) H₂ → CₙH₂ₙ₊₂ + n H₂O  (general FT reaction)\nExample: 8 CO + 17 H₂ → C₈H₁₈ + 8 H₂O (octane)\nAnderson-Schulz-Flory: Wₙ = n(1-α)²αⁿ⁻¹ (product distribution)',
        explanation:
          'The Fischer-Tropsch reaction is a catalytic polymerization that builds hydrocarbon chains one carbon at a time from CO and H₂. On the cobalt catalyst surface, CO dissociates and carbon atoms are sequentially added to a growing chain — the probability of chain growth vs. termination at each step is characterized by the Anderson-Schulz-Flory (ASF) parameter α. For cobalt catalysts at 200–250°C, α ≈ 0.85–0.92, producing a broad distribution of hydrocarbons from methane to heavy waxes (C60+). The reaction is strongly exothermic (~165 kJ/mol CO), so heat removal is the primary reactor design challenge. Modern FT reactors use microchannel, slurry bubble column, or multi-tubular fixed bed designs. The per-pass CO conversion is typically 40–60%, with unreacted syngas recycled.',
        engineeringNotes:
          'Cobalt catalysts give higher per-pass conversion and heavier products than iron catalysts, but are more expensive and sensitive to sulfur poisoning (< 10 ppb S in feed). The large exotherm requires careful heat management — commercial reactors often generate steam for power or process use. Catalyst lifetime is 2–5 years for cobalt.',
        keyTerms: [
          { term: 'ASF Distribution', definition: 'Anderson-Schulz-Flory — the statistical distribution of chain lengths in FT products, governed by the chain growth probability α.' },
          { term: 'Chain Growth Probability (α)', definition: 'The probability that a growing chain adds another carbon rather than terminating. Higher α means heavier products.' },
          { term: 'Per-pass Conversion', definition: 'The fraction of syngas converted to products in a single pass through the reactor. Unconverted gas is typically recycled.' },
        ],
      },
    },
    {
      id: 'hydrocracking-ft',
      name: 'Hydrocracking / Isomerization',
      nodeType: 'process',
      conditions: {
        temperature: { value: 340, unit: '°C' },
        pressure: { value: 50, unit: 'bar' },
        catalyst: 'Pt/SiO₂-Al₂O₃',
        residenceTime: '1–2 hours',
      },
      inputs: [
        { streamId: 's-ft-wax', substance: 'FT Wax', massFlow: { value: 350, unit: 'kg/h' }, phase: 'mixed' },
        { streamId: 's-h2-crack', substance: 'H₂', massFlow: { value: 15, unit: 'kg/h' }, phase: 'gas' },
      ],
      outputs: [
        { streamId: 's-ft-products', substance: 'Cracked products', massFlow: { value: 365, unit: 'kg/h' }, phase: 'liquid' },
      ],
      energyInput: { value: 0.3, unit: 'MW', source: 'furnace' },
      education: {
        summary: 'Cracks heavy FT waxes into the jet fuel range and isomerizes paraffins for cold-flow properties.',
        chemistry:
          'C₃₀H₆₂ + H₂ → C₁₅H₃₂ + C₁₅H₃₂ (ideal midpoint cracking)\nC₃₀H₆₂ + H₂ → C₁₀H₂₂ + C₂₀H₄₂ (typical non-ideal cracking)',
        explanation:
          'FT synthesis produces predominantly heavy waxes (C20+) with a cobalt catalyst, which must be hydrocracked to the jet fuel range. This is actually an advantage — it is easier to crack long chains to the desired length than to directly synthesize the right chain length. The hydrocracker uses a bifunctional catalyst (metal function for hydrogenation + acid function for cracking) to break C-C bonds while simultaneously isomerizing the products for cold-flow compliance. The severity of cracking is controlled by temperature and space velocity. This step is very similar to the wax hydrocracker used in petroleum refineries for producing lube base oils.',
        engineeringNotes:
          'The hydrocracker is a well-understood unit operation adapted from petroleum refining. Product selectivity to the jet cut is typically 50–65%, with naphtha and diesel as co-products. The process also generates some light gases that can be recycled to the RWGS reactor.',
        keyTerms: [
          { term: 'Hydrocracking', definition: 'Breaking of C-C bonds in the presence of hydrogen and a catalyst — reduces molecular weight while saturating the fragments.' },
          { term: 'Bifunctional Catalyst', definition: 'A catalyst with both metal sites (for hydrogen activation) and acid sites (for carbon-carbon bond breaking).' },
        ],
      },
    },
    {
      id: 'product-ft-jet',
      name: 'FT-SPK Jet Fuel',
      nodeType: 'product',
      inputs: [{ streamId: 's-ft-jet', substance: 'FT-SPK Jet Fuel', massFlow: { value: 200, unit: 'kg/h' }, phase: 'liquid' }],
      outputs: [],
      education: {
        summary: 'ASTM D7566 Annex 1 certified Fischer-Tropsch Synthetic Paraffinic Kerosene, approved for up to 50% blending.',
        explanation:
          'FT-SPK was the first synthetic jet fuel pathway certified under ASTM D7566 (Annex 1, approved 2009). Like HEFA-SPK, it is a paraffinic kerosene with no aromatics or sulfur, requiring blending with conventional jet fuel. FT-SPK from green hydrogen and captured CO₂ can achieve near-zero lifecycle carbon intensity, making it one of the most promising long-term SAF pathways. The main barriers are cost (currently $3–6/gallon vs ~$2.50 for conventional jet) and the need for large-scale green hydrogen and CO₂ infrastructure. The Lydian Fuels approach aims to reduce cost through modular, electrically-integrated plant design.',
        keyTerms: [
          { term: 'ASTM D7566 Annex 1', definition: 'The specification for Fischer-Tropsch SPK — the first approved SAF pathway, with the longest track record.' },
          { term: 'Power-to-Liquid', definition: 'The overall process category: renewable electricity → hydrogen → syngas → liquid fuel.' },
        ],
      },
    },
    {
      id: 'product-ft-naphtha',
      name: 'FT Naphtha',
      nodeType: 'product',
      inputs: [{ streamId: 's-ft-naphtha', substance: 'FT Naphtha', massFlow: { value: 100, unit: 'kg/h' }, phase: 'liquid' }],
      outputs: [],
      education: {
        summary: 'Light hydrocarbon co-product suitable for chemical feedstock or gasoline blending.',
        explanation: 'FT naphtha is a high-purity paraffinic stream excellent for steam cracking to produce green olefins (ethylene, propylene) for the chemical industry, often commanding a premium over fuel-grade naphtha.',
      },
    },
  ],
  streams: [
    { id: 's-elec', from: 'feedstock-renewable-elec', to: 'electrolysis', substance: 'Electricity', label: '~55 kWh/kg H₂' },
    { id: 's-water-in', from: 'feedstock-renewable-elec', to: 'electrolysis', substance: 'Water', massFlow: { value: 900, unit: 'kg/h' }, label: '900 kg/h H₂O' },
    { id: 's-air', from: 'feedstock-renewable-elec', to: 'co2-capture', substance: 'Air / Flue Gas', label: 'Ambient air or flue gas' },
    { id: 's-h2', from: 'electrolysis', to: 'rwgs', substance: 'H₂', massFlow: { value: 60, unit: 'kg/h' }, label: '60 kg/h H₂' },
    { id: 's-h2-crack', from: 'electrolysis', to: 'hydrocracking-ft', substance: 'H₂', massFlow: { value: 15, unit: 'kg/h' }, label: '15 kg/h H₂' },
    { id: 's-h2-remaining', from: 'electrolysis', to: 'rwgs', substance: 'H₂ (excess)', massFlow: { value: 25, unit: 'kg/h' }, label: '25 kg/h H₂ recycle' },
    { id: 's-co2', from: 'co2-capture', to: 'rwgs', substance: 'CO₂', massFlow: { value: 700, unit: 'kg/h' }, label: '700 kg/h CO₂' },
    { id: 's-syngas', from: 'rwgs', to: 'ft-reactor', substance: 'Syngas', massFlow: { value: 650, unit: 'kg/h' }, label: 'Syngas (H₂:CO ≈ 2:1)' },
    { id: 's-ft-wax', from: 'ft-reactor', to: 'hydrocracking-ft', substance: 'FT Wax', massFlow: { value: 350, unit: 'kg/h' }, label: '350 kg/h Wax' },
    { id: 's-ft-products', from: 'hydrocracking-ft', to: 'product-ft-jet', substance: 'Products', massFlow: { value: 200, unit: 'kg/h' }, label: '200 kg/h Jet' },
    { id: 's-ft-naphtha', from: 'hydrocracking-ft', to: 'product-ft-naphtha', substance: 'Naphtha', massFlow: { value: 100, unit: 'kg/h' }, label: '100 kg/h Naphtha' },
  ],
};
