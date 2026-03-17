import { Pathway } from '../types/pathway';

export const conventionalJet: Pathway = {
  id: 'conventional-jet',
  name: 'Conventional Jet A-1 from Crude Oil',
  description:
    'The traditional petroleum refining pathway that produces the vast majority of the world\'s jet fuel. Crude oil is desalted, distilled, and hydrotreated to produce Jet A-1 meeting ASTM D1655. Understanding this baseline process is essential for appreciating how alternative pathways differ and what specifications SAF must match.',
  category: 'conventional',
  steps: [
    {
      id: 'feedstock-crude',
      name: 'Crude Oil',
      nodeType: 'feedstock',
      inputs: [],
      outputs: [{ streamId: 's-crude', substance: 'Crude Oil', massFlow: { value: 10000, unit: 'kg/h' }, phase: 'liquid' }],
      education: {
        summary: 'Crude oil is a complex mixture of thousands of hydrocarbon compounds, with carbon numbers ranging from C1 (methane) to C60+ (asphaltenes).',
        explanation:
          'Crude oil is the starting material for virtually all conventional jet fuel. It is a naturally occurring mixture of hydrocarbons formed over millions of years from marine organisms under heat and pressure. Crude oils vary enormously in composition: light sweet crudes (like West Texas Intermediate) are rich in the lighter hydrocarbons that include the kerosene range, while heavy sour crudes (like Venezuelan Merey) contain more heavy ends and sulfur. A typical medium crude contains roughly 15–25% gasoline-range, 10–15% kerosene-range (jet fuel), 15–20% diesel-range, and the remainder heavier fractions. The kerosene fraction boils between approximately 150–250°C and consists primarily of C9–C16 hydrocarbons including paraffins, naphthenes (cycloparaffins), and aromatics.',
        engineeringNotes:
          'Crude selection significantly impacts jet fuel yield and quality. Refiners optimize crude diet based on product demand, crude pricing, and unit capabilities. The crude assay — a detailed analysis of a crude oil\'s properties and fraction yields — is a fundamental tool in refinery planning.',
        keyTerms: [
          { term: 'Crude Assay', definition: 'A comprehensive laboratory analysis of a crude oil, including distillation curve, sulfur content, API gravity, and individual fraction properties.' },
          { term: 'API Gravity', definition: 'A measure of crude oil density relative to water. Higher API = lighter crude. Typical range: 20 (heavy) to 45 (light).' },
          { term: 'Sweet vs Sour', definition: 'Sweet crude has low sulfur (<0.5 wt%), sour crude has high sulfur (>0.5 wt%). Sour crudes require more hydrotreating.' },
        ],
      },
    },
    {
      id: 'desalter',
      name: 'Desalting',
      nodeType: 'process',
      conditions: {
        temperature: { value: 130, unit: '°C' },
        pressure: { value: 10, unit: 'bar' },
      },
      inputs: [
        { streamId: 's-crude', substance: 'Crude Oil', massFlow: { value: 10000, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's-wash-water', substance: 'Wash Water', massFlow: { value: 500, unit: 'kg/h' }, phase: 'liquid' },
      ],
      outputs: [
        { streamId: 's-desalted', substance: 'Desalted Crude', massFlow: { value: 10000, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's-brine', substance: 'Brine (waste)', massFlow: { value: 500, unit: 'kg/h' }, phase: 'liquid' },
      ],
      energyInput: { value: 0.05, unit: 'MW', source: 'electric field' },
      education: {
        summary: 'Removes dissolved salts (NaCl, CaCl₂, MgCl₂) and water from crude oil to prevent corrosion and fouling in downstream equipment.',
        chemistry: 'NaCl (dissolved in oil-water emulsion) → NaCl (in aqueous brine, removed)\nCaCl₂ + H₂O → CaCO₃ + HCl (at high temp — this is what we\'re preventing)',
        explanation:
          'Crude oil as produced contains entrained water with dissolved salts, typically 10–200 PTB (pounds of salt per thousand barrels). If not removed, these salts cause severe problems: (1) HCl formation in the distillation column overhead, causing aggressive corrosion; (2) Fouling and plugging of heat exchangers; (3) Catalyst poisoning in downstream units. The desalter works by mixing wash water into the crude (3–10 vol%), creating a fine emulsion, then applying a high-voltage electric field (15–35 kV) to coalesce the water droplets. The enlarged droplets settle by gravity, carrying dissolved salts with them. Target: reduce salt content to <1 PTB.',
        engineeringNotes:
          'Desalter performance is critical for overall refinery reliability. Emulsion-breaking chemicals (demulsifiers) are added at ppm levels to aid water separation. pH control of the brine is important to prevent corrosion. Two-stage desalting is common for sour crudes.',
        keyTerms: [
          { term: 'PTB', definition: 'Pounds of salt per Thousand Barrels — the standard measure of salt content in crude oil.' },
          { term: 'Electrostatic Coalescence', definition: 'Using an electric field to merge small water droplets into larger ones that settle faster — the operating principle of a desalter.' },
          { term: 'Overhead Corrosion', definition: 'Corrosion in the top of the distillation column caused by HCl from hydrolysis of calcium and magnesium chloride salts.' },
        ],
      },
    },
    {
      id: 'cdu',
      name: 'Atmospheric Distillation (CDU)',
      nodeType: 'process',
      conditions: {
        temperature: { value: 360, unit: '°C' },
        pressure: { value: 1.5, unit: 'bar' },
      },
      inputs: [{ streamId: 's-desalted', substance: 'Desalted Crude', massFlow: { value: 10000, unit: 'kg/h' }, phase: 'liquid' }],
      outputs: [
        { streamId: 's-lpg', substance: 'LPG + Light Naphtha', massFlow: { value: 800, unit: 'kg/h' }, phase: 'gas' },
        { streamId: 's-naphtha', substance: 'Heavy Naphtha', massFlow: { value: 2000, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's-kerosene', substance: 'Kerosene (raw)', massFlow: { value: 1200, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's-diesel-raw', substance: 'Diesel (raw)', massFlow: { value: 2500, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's-residue', substance: 'Atmospheric Residue', massFlow: { value: 3500, unit: 'kg/h' }, phase: 'liquid' },
      ],
      energyInput: { value: 8.0, unit: 'MW', source: 'fired heater (fuel gas/oil)' },
      education: {
        summary: 'The heart of the refinery: a large distillation column that separates crude oil into fractions by boiling point. The kerosene cut (150–250°C) is the raw material for jet fuel.',
        chemistry: 'No chemical reactions — this is a physical separation based on vapor-liquid equilibrium at different temperatures.',
        explanation:
          'The Crude Distillation Unit (CDU) is the first and largest processing unit in any refinery. Desalted crude is heated in a fired furnace to ~360°C (keeping below ~370°C to avoid thermal cracking) and flashed into the bottom of a large column containing 30–50 fractionation trays. As vapor rises through the column, it cools and condenses at different heights corresponding to different boiling ranges. The kerosene side-draw (150–250°C) produces raw kerosene that will become jet fuel after hydrotreating. This is a straight-run kerosene — it contains all the natural compounds in that boiling range, including sulfur species, nitrogen compounds, and mercaptans that must be removed. A typical CDU processing 100,000 bbl/day of medium crude produces about 12,000 bbl/day of kerosene.',
        engineeringNotes:
          'The CDU is the most energy-intensive unit in a refinery. Heat integration (crude preheat train) typically recovers 60–70% of the fired duty, but the remaining 30–40% makes it the largest single CO₂ source in the refinery. The atmospheric residue goes to a vacuum distillation unit for further fractionation. Column operation is controlled by adjusting reflux ratios and side-draw rates.',
        keyTerms: [
          { term: 'Straight-run', definition: 'A product obtained directly from distillation without chemical conversion — e.g., straight-run kerosene, straight-run naphtha.' },
          { term: 'Side-draw', definition: 'A liquid product withdrawn from the middle of a distillation column at an intermediate boiling range.' },
          { term: 'Preheat Train', definition: 'A network of heat exchangers that recovers heat from hot product streams to preheat the incoming crude, reducing furnace duty.' },
          { term: 'Flash Zone', definition: 'The section at the bottom of the column where the heated crude enters and the liquid/vapor separation begins.' },
        ],
      },
    },
    {
      id: 'hydrotreater',
      name: 'Kerosene Hydrotreater',
      nodeType: 'process',
      conditions: {
        temperature: { value: 340, unit: '°C' },
        pressure: { value: 50, unit: 'bar' },
        catalyst: 'CoMo/Al₂O₃ or NiMo/Al₂O₃',
        residenceTime: '1–2 hours',
      },
      inputs: [
        { streamId: 's-kerosene', substance: 'Raw Kerosene', massFlow: { value: 1200, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's-h2-ht', substance: 'H₂', massFlow: { value: 12, unit: 'kg/h' }, phase: 'gas' },
      ],
      outputs: [
        { streamId: 's-jet-treated', substance: 'Hydrotreated Kerosene', massFlow: { value: 1190, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's-h2s', substance: 'H₂S + NH₃ (removed)', massFlow: { value: 22, unit: 'kg/h' }, phase: 'gas' },
      ],
      energyInput: { value: 0.5, unit: 'MW', source: 'fired heater + H₂ compressor' },
      education: {
        summary: 'Catalytically removes sulfur, nitrogen, and other contaminants from raw kerosene using hydrogen, producing clean jet fuel that meets ASTM D1655 specifications.',
        chemistry:
          'R-SH + H₂ → R-H + H₂S (mercaptan removal)\nR₂-S + 2 H₂ → 2 R-H + H₂S (thioether removal)\nC₄H₄S + 4 H₂ → C₄H₁₀ + H₂S (thiophene hydrodesulfurization)\nR-NH₂ + H₂ → R-H + NH₃ (nitrogen removal)',
        explanation:
          'Hydrotreating is the final chemical processing step for conventional jet fuel. The raw kerosene from the CDU typically contains 500–3000 ppm sulfur (depending on crude), nitrogen compounds, olefins, and mercaptans that must be removed to meet specifications. In the hydrotreater, the kerosene passes through a fixed bed of CoMo or NiMo catalyst at 300–380°C and 30–70 bar H₂ pressure. The catalyst promotes selective breaking of C-S, C-N, and C-O bonds while leaving the hydrocarbon backbone largely intact. Sulfur is converted to H₂S, nitrogen to NH₃, and olefins are saturated to paraffins. The H₂S and NH₃ are scrubbed from the reactor effluent gas with an amine solution. Target: sulfur <3000 ppm (typically <10 ppm achieved), mercaptan <30 ppm, total acidity <0.1 mg KOH/g.',
        engineeringNotes:
          'Catalyst selection depends on the difficulty of desulfurization. CoMo catalysts are preferred for easy sulfur (mercaptans, simple sulfides), while NiMo catalysts are better for refractory sulfur (dibenzothiophenes). Typical catalyst life is 2–4 years. Hydrogen consumption is 5–15 Nm³/ton of feed, much less than HEFA HDO because only contaminants are being removed, not the main molecular structure.',
        keyTerms: [
          { term: 'HDS', definition: 'Hydrodesulfurization — catalytic removal of sulfur from hydrocarbons using hydrogen. The primary reaction in jet fuel hydrotreating.' },
          { term: 'Mercaptan', definition: 'An organic sulfur compound (R-SH) known for its extremely foul smell. Even trace amounts are unacceptable in jet fuel.' },
          { term: 'Refractory Sulfur', definition: 'Sulfur compounds (like 4,6-dimethyldibenzothiophene) that are sterically hindered and difficult to remove catalytically.' },
          { term: 'Amine Scrubbing', definition: 'A process that uses an amine solution (MEA, DEA, or MDEA) to selectively absorb H₂S from gas streams.' },
        ],
      },
    },
    {
      id: 'product-jet-a1',
      name: 'Jet A-1',
      nodeType: 'product',
      inputs: [{ streamId: 's-jet-treated', substance: 'Jet A-1', massFlow: { value: 1190, unit: 'kg/h' }, phase: 'liquid' }],
      outputs: [],
      education: {
        summary: 'Jet A-1 is the standard international aviation turbine fuel, meeting ASTM D1655 / DEF STAN 91-091. It is the benchmark that all SAF must be compatible with.',
        explanation:
          'Jet A-1 is a kerosene-grade fuel with a boiling range of approximately 150–250°C, consisting of C9–C16 hydrocarbons. Unlike SAF (which is purely paraffinic), conventional jet fuel contains a mix of paraffins (~55%), naphthenes (~25%), and aromatics (~18%). The aromatics are significant: while they reduce specific energy slightly, they are necessary for elastomer seal swell in aircraft fuel systems. Key specifications include: flash point >38°C (safety), freeze point <-47°C (operability at altitude), minimum specific energy 42.8 MJ/kg, maximum sulfur 0.3 wt%, and thermal stability (JFTOT test). The global jet fuel market is approximately 300 million tons per year, of which SAF currently represents <0.1%.',
        keyTerms: [
          { term: 'ASTM D1655', definition: 'The standard specification for aviation turbine fuels — the regulatory framework defining what is and isn\'t acceptable jet fuel.' },
          { term: 'Freeze Point', definition: 'The temperature at which the last wax crystal melts in the fuel. Jet A-1 requires <-47°C; Jet A (US domestic) requires <-40°C.' },
          { term: 'Flash Point', definition: 'The lowest temperature at which fuel vapors ignite with an external spark. A key safety specification (>38°C for Jet A-1).' },
          { term: 'JFTOT', definition: 'Jet Fuel Thermal Oxidation Test — measures fuel thermal stability by heating a tube and checking for deposits. Critical for engine fuel system integrity.' },
          { term: 'Seal Swell', definition: 'The expansion of elastomer seals when in contact with aromatic hydrocarbons. Aircraft fuel systems rely on this for leak-free operation.' },
        ],
      },
    },
    {
      id: 'product-other-fractions',
      name: 'Other Refinery Products',
      nodeType: 'product',
      inputs: [
        { streamId: 's-lpg', substance: 'LPG', phase: 'gas' },
        { streamId: 's-naphtha', substance: 'Naphtha', phase: 'liquid' },
        { streamId: 's-diesel-raw', substance: 'Diesel', phase: 'liquid' },
        { streamId: 's-residue', substance: 'Residue', phase: 'liquid' },
      ],
      outputs: [],
      education: {
        summary: 'The CDU produces many co-products alongside kerosene: LPG, naphtha (→ gasoline), diesel, and atmospheric residue (→ vacuum distillation → fuel oil, lubricants, asphalt).',
        explanation:
          'A refinery is fundamentally a multi-product facility. Jet fuel typically represents only 10–15% of the output from crude oil distillation. The other fractions have their own processing trains: naphtha goes to catalytic reforming (to make high-octane gasoline and aromatics), diesel goes to its own hydrotreater, LPG is treated and sold, and the atmospheric residue is processed in a vacuum distillation unit to recover vacuum gas oil (for fluid catalytic cracking) and vacuum residue (for asphalt or coking). Understanding this multi-product nature is important: jet fuel production cannot be optimized in isolation — changes to jet yield affect all other products. This is a key difference from dedicated SAF plants, which are designed specifically for jet fuel production.',
      },
    },
  ],
  streams: [
    { id: 's-crude', from: 'feedstock-crude', to: 'desalter', substance: 'Crude Oil', massFlow: { value: 10000, unit: 'kg/h' }, label: '10,000 kg/h Crude' },
    { id: 's-wash-water', from: 'feedstock-crude', to: 'desalter', substance: 'Wash Water', massFlow: { value: 500, unit: 'kg/h' }, label: 'Wash Water' },
    { id: 's-desalted', from: 'desalter', to: 'cdu', substance: 'Desalted Crude', massFlow: { value: 10000, unit: 'kg/h' }, label: '10,000 kg/h' },
    { id: 's-kerosene', from: 'cdu', to: 'hydrotreater', substance: 'Raw Kerosene', massFlow: { value: 1200, unit: 'kg/h' }, label: '1,200 kg/h Kerosene' },
    { id: 's-h2-ht', from: 'feedstock-crude', to: 'hydrotreater', substance: 'H₂', massFlow: { value: 12, unit: 'kg/h' }, label: '12 kg/h H₂' },
    { id: 's-jet-treated', from: 'hydrotreater', to: 'product-jet-a1', substance: 'Jet A-1', massFlow: { value: 1190, unit: 'kg/h' }, label: '1,190 kg/h Jet A-1' },
    { id: 's-lpg', from: 'cdu', to: 'product-other-fractions', substance: 'LPG', massFlow: { value: 800, unit: 'kg/h' }, label: '800 kg/h LPG' },
    { id: 's-naphtha', from: 'cdu', to: 'product-other-fractions', substance: 'Naphtha', massFlow: { value: 2000, unit: 'kg/h' }, label: '2,000 kg/h Naphtha' },
    { id: 's-diesel-raw', from: 'cdu', to: 'product-other-fractions', substance: 'Diesel', massFlow: { value: 2500, unit: 'kg/h' }, label: '2,500 kg/h Diesel' },
    { id: 's-residue', from: 'cdu', to: 'product-other-fractions', substance: 'Residue', massFlow: { value: 3500, unit: 'kg/h' }, label: '3,500 kg/h Residue' },
  ],
};
