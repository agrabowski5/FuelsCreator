import { Pathway } from '../types/pathway';

export const hefaTallow: Pathway = {
  id: 'hefa-tallow',
  name: 'HEFA — Technical Tallow',
  description:
    'Hydroprocessed Esters and Fatty Acids (HEFA) is the most commercially mature pathway for sustainable aviation fuel (SAF). It converts lipid feedstocks — here, technical tallow (animal fat waste) — into drop-in jet fuel through hydrodeoxygenation and hydroisomerization. This is the pathway used by producers like Neste and World Energy.',
  category: 'saf',
  steps: [
    {
      id: 'feedstock-tallow',
      name: 'Technical Tallow',
      nodeType: 'feedstock',
      inputs: [],
      outputs: [{ streamId: 's1', substance: 'Tallow', massFlow: { value: 1000, unit: 'kg/h' }, phase: 'liquid' }],
      education: {
        summary: 'Technical tallow is rendered animal fat, a waste product from meat processing classified as a Category 1 or 2 animal by-product.',
        explanation:
          'Technical tallow is a triglyceride-rich fat obtained from the rendering of animal tissues. Its fatty acid profile is predominantly C16 (palmitic) and C18 (stearic/oleic), which maps well onto the jet fuel carbon range (C8–C16). It typically has a free fatty acid content of 5–15% and must be pretreated to remove phospholipids, metals, and moisture. As a waste fat, it qualifies under most regulatory frameworks (EU RED II, US LCFS) for favorable carbon intensity scores, making it an attractive SAF feedstock. The melting point is around 40–50°C, so it is handled as a heated liquid.',
        engineeringNotes:
          'Tallow supply is limited globally (~10 Mt/year) and competes with biodiesel and oleochemical demand. Feedstock quality varies significantly by source and season, affecting catalyst life downstream. Chloride and phosphorus content must be closely monitored.',
        keyTerms: [
          { term: 'Triglyceride', definition: 'A molecule consisting of glycerol esterified with three fatty acid chains — the main component of fats and oils.' },
          { term: 'Free Fatty Acid (FFA)', definition: 'A fatty acid not bound to glycerol. High FFA feedstocks require more aggressive pretreatment.' },
          { term: 'Carbon Intensity (CI)', definition: 'The lifecycle greenhouse gas emissions per unit of energy, used to score fuel sustainability.' },
        ],
      },
    },
    {
      id: 'feedstock-h2-hefa',
      name: 'Hydrogen Supply',
      nodeType: 'feedstock',
      inputs: [],
      outputs: [{ streamId: 's-h2-hefa', substance: 'H₂', massFlow: { value: 35, unit: 'kg/h' }, phase: 'gas' }],
      education: {
        summary: 'Hydrogen is consumed in both the HDO and isomerization reactors. Conventional HEFA uses grey hydrogen from SMR; green H₂ improves the carbon intensity.',
        explanation:
          'The HEFA process is hydrogen-intensive, consuming approximately 3–4 wt% H₂ relative to the lipid feed. Hydrogen is needed to (1) remove oxygen from fatty acid chains in the HDO reactor, and (2) isomerize and crack paraffins in the second reactor. Most commercial HEFA plants use grey hydrogen from steam methane reforming (SMR), which contributes significantly to the overall carbon intensity. Using green hydrogen (from electrolysis powered by renewables) can reduce the well-to-wake CI by 30–50%, but at higher cost.',
        keyTerms: [
          { term: 'Grey Hydrogen', definition: 'Hydrogen produced from natural gas via steam methane reforming, with CO₂ emitted to atmosphere.' },
          { term: 'Green Hydrogen', definition: 'Hydrogen produced via water electrolysis powered by renewable electricity.' },
        ],
      },
    },
    {
      id: 'pretreatment',
      name: 'Pretreatment',
      nodeType: 'process',
      conditions: {
        temperature: { value: 80, unit: '°C' },
        pressure: { value: 1, unit: 'bar' },
      },
      inputs: [{ streamId: 's1', substance: 'Tallow', massFlow: { value: 1000, unit: 'kg/h' }, phase: 'liquid' }],
      outputs: [{ streamId: 's2', substance: 'Pretreated Tallow', massFlow: { value: 970, unit: 'kg/h' }, phase: 'liquid' }],
      energyInput: { value: 0.05, unit: 'MW', source: 'steam' },
      education: {
        summary: 'Degumming, bleaching, and drying to remove catalyst poisons (phospholipids, metals, moisture) from the tallow.',
        chemistry: 'Phospholipids + H₃PO₄ → hydrated gums (removed by centrifuge)\nMetal ions + bleaching earth → adsorbed metals (removed by filtration)',
        explanation:
          'Pretreatment is critical to protect the expensive hydrotreating catalysts downstream. The main steps are: (1) Acid degumming with phosphoric acid to hydrate and precipitate phospholipids, followed by centrifugal separation. (2) Bleaching with activated clay or silica to adsorb trace metals (Fe, Cu, Na, Ca) and chlorides. (3) Vacuum drying to reduce moisture below 500 ppm. Without effective pretreatment, catalyst deactivation rates increase dramatically, shortening run lengths from >12 months to just weeks.',
        engineeringNotes:
          'The waste streams from pretreatment (spent bleaching earth, gums) require proper disposal. Phosphorus must be reduced to <5 ppm and metals to <1 ppm for acceptable catalyst life. Some facilities also include a guard bed with cheap adsorbent before the main reactor.',
        keyTerms: [
          { term: 'Degumming', definition: 'Removal of phospholipids (gums) from fats/oils, typically using acid treatment followed by centrifugation.' },
          { term: 'Guard Bed', definition: 'A sacrificial catalyst bed placed upstream of the main reactor to catch residual contaminants.' },
        ],
      },
    },
    {
      id: 'hdo-reactor',
      name: 'Hydrodeoxygenation (HDO)',
      nodeType: 'process',
      conditions: {
        temperature: { value: 350, unit: '°C' },
        pressure: { value: 50, unit: 'bar' },
        catalyst: 'NiMo/Al₂O₃ or CoMo/Al₂O₃',
        residenceTime: '1–2 hours',
      },
      inputs: [
        { streamId: 's2', substance: 'Pretreated Tallow', massFlow: { value: 970, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's-h2-hefa', substance: 'H₂', massFlow: { value: 25, unit: 'kg/h' }, phase: 'gas' },
      ],
      outputs: [
        { streamId: 's3', substance: 'n-Paraffins (C15–C18)', massFlow: { value: 800, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's-water', substance: 'H₂O + CO₂ + propane', massFlow: { value: 195, unit: 'kg/h' }, phase: 'mixed' },
      ],
      energyOutput: { value: 0.8, unit: 'MW', source: 'exothermic reaction' },
      education: {
        summary: 'The core reaction: hydrogen removes oxygen from fatty acid chains, producing straight-chain paraffins (n-alkanes), water, CO₂, and propane.',
        chemistry:
          'Triglyceride + 12 H₂ → 3 n-C₁₇H₃₆ + propane + 6 H₂O (hydrodeoxygenation)\nR-COOH + 3 H₂ → R-CH₃ + 2 H₂O (HDO of free fatty acids)\nAlternative: R-COOH → R-H + CO₂ (decarboxylation, minor pathway)',
        explanation:
          'Hydrodeoxygenation (HDO) is the heart of the HEFA process. In this fixed-bed catalytic reactor, hydrogen reacts with the triglyceride molecules at 300–400°C and 30–80 bar. The reaction proceeds through several steps: first, the triglyceride is cleaved into free fatty acids and propane; then, the fatty acid oxygen is removed as water (the dominant HDO pathway) or as CO₂ (the decarboxylation pathway). The product is a mixture of normal (straight-chain) paraffins, predominantly C15–C18, corresponding to the original fatty acid chain lengths. The reaction is strongly exothermic (~2 MJ/kg feed), so reactor temperature management is critical — commercial designs use multiple catalyst beds with hydrogen quench between them. The NiMo/Al₂O₃ catalyst is similar to those used in petroleum hydrotreating, but optimized for the high oxygen content of lipid feeds.',
        engineeringNotes:
          'Hydrogen consumption is typically 300–400 Nm³/ton of feed. The exotherm must be carefully managed to avoid thermal runaway. Catalyst life is 1–3 years depending on feedstock quality. The propane byproduct (from glycerol backbone) can be used as fuel gas or sold.',
        keyTerms: [
          { term: 'Hydrodeoxygenation (HDO)', definition: 'Catalytic removal of oxygen from organic molecules using hydrogen, producing water as a byproduct.' },
          { term: 'Decarboxylation', definition: 'Removal of oxygen as CO₂ rather than H₂O — produces a paraffin one carbon shorter than HDO.' },
          { term: 'Exothermic', definition: 'A reaction that releases heat. The HDO reaction releases ~2 MJ per kg of feed processed.' },
          { term: 'Quench', definition: 'Injection of cold hydrogen between catalyst beds to control temperature rise in an exothermic reactor.' },
        ],
      },
    },
    {
      id: 'isomerization',
      name: 'Hydroisomerization / Cracking',
      nodeType: 'process',
      conditions: {
        temperature: { value: 300, unit: '°C' },
        pressure: { value: 40, unit: 'bar' },
        catalyst: 'Pt/SAPO-11 or Pt/ZSM-22',
        residenceTime: '0.5–1 hour',
      },
      inputs: [
        { streamId: 's3', substance: 'n-Paraffins', massFlow: { value: 800, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's-h2-iso', substance: 'H₂', massFlow: { value: 10, unit: 'kg/h' }, phase: 'gas' },
      ],
      outputs: [
        { streamId: 's4', substance: 'Iso-paraffins + cracked products', massFlow: { value: 810, unit: 'kg/h' }, phase: 'liquid' },
      ],
      energyInput: { value: 0.1, unit: 'MW', source: 'furnace' },
      education: {
        summary: 'Converts straight-chain paraffins into branched (iso-) paraffins to meet jet fuel cold-flow specifications, and cracks some molecules into the jet range.',
        chemistry:
          'n-C₁₇H₃₆ → iso-C₁₇H₃₆ (isomerization — branching)\nn-C₁₇H₃₆ + H₂ → C₉H₂₀ + C₈H₁₈ (hydrocracking — chain breaking)',
        explanation:
          'The n-paraffins from HDO have excellent cetane numbers but terrible cold-flow properties — pure n-C17 freezes at +22°C, far above the -47°C freeze point required for Jet A-1. Hydroisomerization introduces methyl branches into the chain, dramatically lowering the freeze point. The catalyst (typically Pt on a shape-selective zeolite like SAPO-11) preferentially creates mono-methyl branches while minimizing over-cracking to light gases. Some hydrocracking also occurs, breaking C17–C18 chains into the C8–C16 jet fuel range. The balance between isomerization and cracking is controlled by temperature, pressure, and space velocity — higher temperatures favor cracking. The art is to achieve sufficient isomerization for cold-flow compliance while maximizing jet-range yield.',
        engineeringNotes:
          'Jet fuel yield from this stage is typically 50–70% of the HDO product, with the remainder being naphtha (lighter) and diesel (heavier) co-products. Over-cracking to light gases is the main yield loss mechanism. The Pt catalyst is sensitive to sulfur, so the HDO product must be essentially sulfur-free.',
        keyTerms: [
          { term: 'Isomerization', definition: 'Rearrangement of a molecule to a different structural form (same formula). Here, converting straight chains to branched chains.' },
          { term: 'Freeze Point', definition: 'The temperature at which a fuel begins to form crystals — a critical specification for aviation fuel.' },
          { term: 'SAPO-11', definition: 'A silicoaluminophosphate zeolite with 1D pore channels that favor mono-branching over multi-branching or cracking.' },
        ],
      },
    },
    {
      id: 'separation',
      name: 'Product Separation',
      nodeType: 'process',
      conditions: {
        temperature: { value: 250, unit: '°C' },
        pressure: { value: 2, unit: 'bar' },
      },
      inputs: [{ streamId: 's4', substance: 'Iso-paraffins + cracked products', massFlow: { value: 810, unit: 'kg/h' }, phase: 'liquid' }],
      outputs: [
        { streamId: 's5-naphtha', substance: 'Naphtha (C5–C8)', massFlow: { value: 150, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's5-jet', substance: 'HEFA-SPK Jet Fuel', massFlow: { value: 500, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's5-diesel', substance: 'Green Diesel', massFlow: { value: 130, unit: 'kg/h' }, phase: 'liquid' },
        { streamId: 's5-gas', substance: 'Light Gases', massFlow: { value: 30, unit: 'kg/h' }, phase: 'gas' },
      ],
      energyInput: { value: 0.3, unit: 'MW', source: 'reboiler steam' },
      education: {
        summary: 'A distillation column separates the reactor product into naphtha, jet fuel, diesel, and light gas fractions by boiling point.',
        explanation:
          'The mixed isomerized/cracked product is fed to a fractionation column that separates by boiling point. The jet fuel cut is drawn at approximately 150–250°C boiling range, corresponding to C8–C16 hydrocarbons. Lighter material (naphtha, C5–C8) is taken overhead, while heavier material (diesel, C16+) is drawn from below the jet cut. Light gases (C1–C4) from cracking exit the top and can be used as fuel gas. The jet fraction is the primary product, but the naphtha and diesel co-products add revenue. Typical yield structure from tallow: ~50% jet, ~15% naphtha, ~13% diesel, ~10% water, ~8% CO₂+gases, ~4% propane.',
        engineeringNotes:
          'Column design is straightforward — this is a relatively clean paraffinic mixture without the complexity of crude oil distillation. Product quality is monitored by online density and distillation analyzers. The jet cut width can be adjusted to optimize yield vs. specification compliance.',
        keyTerms: [
          { term: 'Fractionation', definition: 'Separation of a mixture into fractions based on boiling point differences using a distillation column.' },
          { term: 'Cut Point', definition: 'The boiling temperature at which one product fraction ends and the next begins in a distillation column.' },
        ],
      },
    },
    {
      id: 'product-naphtha',
      name: 'Bio-naphtha',
      nodeType: 'product',
      inputs: [{ streamId: 's5-naphtha', substance: 'Naphtha', massFlow: { value: 150, unit: 'kg/h' }, phase: 'liquid' }],
      outputs: [],
      education: {
        summary: 'Renewable naphtha co-product, usable as petrochemical feedstock or gasoline blendstock.',
        explanation:
          'The naphtha fraction (C5–C8, boiling range ~30–150°C) is a valuable co-product that can be sold as renewable naphtha for steam cracker feed (producing green ethylene/propylene) or as a low-carbon gasoline blendstock. It typically has very low sulfur and aromatics, making it a premium feedstock.',
      },
    },
    {
      id: 'product-jet',
      name: 'HEFA-SPK Jet Fuel',
      nodeType: 'product',
      inputs: [{ streamId: 's5-jet', substance: 'HEFA-SPK Jet Fuel', massFlow: { value: 500, unit: 'kg/h' }, phase: 'liquid' }],
      outputs: [],
      education: {
        summary: 'ASTM D7566 Annex 2 certified synthetic paraffinic kerosene, approved for blending up to 50% with conventional Jet A-1.',
        explanation:
          'HEFA-SPK (Synthesized Paraffinic Kerosene) is the most widely produced SAF today. It is a mixture of branched and linear paraffins in the C8–C16 range with excellent combustion properties (high specific energy ~44 MJ/kg vs ~43 MJ/kg for conventional jet). It contains no aromatics or sulfur, which is good for emissions but means it must be blended with conventional jet fuel to maintain seal swell compatibility (aromatics cause elastomer seals to swell to the correct size). The 50% blend limit is an ASTM certification constraint, not a performance limit. Lifecycle GHG reductions of 50–80% vs. fossil jet are typical, depending on feedstock and hydrogen source.',
        keyTerms: [
          { term: 'ASTM D7566', definition: 'The standard specification for aviation turbine fuel containing synthesized hydrocarbons — the regulatory gateway for SAF.' },
          { term: 'SPK', definition: 'Synthesized Paraffinic Kerosene — a fuel consisting primarily of paraffinic hydrocarbons, without aromatics.' },
          { term: 'Blend Wall', definition: 'The maximum percentage at which a synthetic fuel may be blended with conventional fuel, set by certification.' },
        ],
      },
    },
    {
      id: 'product-diesel',
      name: 'Green Diesel',
      nodeType: 'product',
      inputs: [{ streamId: 's5-diesel', substance: 'Green Diesel', massFlow: { value: 130, unit: 'kg/h' }, phase: 'liquid' }],
      outputs: [],
      education: {
        summary: 'Renewable diesel co-product (HVO), a drop-in replacement for fossil diesel.',
        explanation:
          'The heavier fraction (C16+) from product separation is Hydrotreated Vegetable Oil (HVO) renewable diesel. Unlike FAME biodiesel, HVO is a true hydrocarbon indistinguishable from fossil diesel, with superior cold-flow properties and cetane number (typically >70 vs ~51 minimum for standard diesel). It can be used as a 100% drop-in or blended at any ratio.',
      },
    },
  ],
  streams: [
    { id: 's1', from: 'feedstock-tallow', to: 'pretreatment', substance: 'Tallow', massFlow: { value: 1000, unit: 'kg/h' }, label: '1000 kg/h Tallow' },
    { id: 's-h2-hefa', from: 'feedstock-h2-hefa', to: 'hdo-reactor', substance: 'H₂', massFlow: { value: 25, unit: 'kg/h' }, label: '25 kg/h H₂' },
    { id: 's-h2-iso', from: 'feedstock-h2-hefa', to: 'isomerization', substance: 'H₂', massFlow: { value: 10, unit: 'kg/h' }, label: '10 kg/h H₂' },
    { id: 's2', from: 'pretreatment', to: 'hdo-reactor', substance: 'Pretreated Tallow', massFlow: { value: 970, unit: 'kg/h' }, label: '970 kg/h' },
    { id: 's3', from: 'hdo-reactor', to: 'isomerization', substance: 'n-Paraffins', massFlow: { value: 800, unit: 'kg/h' }, label: '800 kg/h n-Paraffins' },
    { id: 's-water', from: 'hdo-reactor', to: 'product-water-dummy', substance: 'H₂O + CO₂', massFlow: { value: 195, unit: 'kg/h' }, label: '195 kg/h waste' },
    { id: 's4', from: 'isomerization', to: 'separation', substance: 'Iso-paraffins', massFlow: { value: 810, unit: 'kg/h' }, label: '810 kg/h' },
    { id: 's5-naphtha', from: 'separation', to: 'product-naphtha', substance: 'Naphtha', massFlow: { value: 150, unit: 'kg/h' }, label: '150 kg/h Naphtha' },
    { id: 's5-jet', from: 'separation', to: 'product-jet', substance: 'HEFA-SPK', massFlow: { value: 500, unit: 'kg/h' }, label: '500 kg/h Jet' },
    { id: 's5-diesel', from: 'separation', to: 'product-diesel', substance: 'Diesel', massFlow: { value: 130, unit: 'kg/h' }, label: '130 kg/h Diesel' },
  ],
};
