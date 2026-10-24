import { GarmentCategory, GarmentMaterial, WardrobeItem } from '../types/wardrobe';

/**
 * SCIENTIFIC SOURCES & BENCHMARKS:
 * 
 * 1. WRAP (Waste and Resources Action Programme) - "Valuing Our Clothes" reports:
 *    - Lifecycle Carbon & Water footprint measurements for UK & Global apparel.
 *    - Estimates virgin cotton t-shirt at ~7.0 kg CO2e and ~2,700 Liters of water.
 *    - Typical pair of jeans consumes ~8,000 Liters of water and ~33.4 kg CO2e.
 *    - Second-hand garment reuse reduces carbon footprint and water consumption by ~75%
 *      due to displacement of virgin agriculture, spinning, wet processing, and assembly.
 * 
 * 2. Ellen MacArthur Foundation - "A New Textiles Economy: Redesigning fashion's future":
 *    - Fashion industry contributes ~1.2 billion tonnes of GHG emissions annually.
 *    - Clothing utilization has dropped by 36% since 2000.
 *    - The #30Wears baseline: Doubling garment lifespan from 15 to 30 wears cuts greenhouse
 *      gas emissions by 44%.
 * 
 * 3. Higg Materials Sustainability Index (MSI) & Sustainable Apparel Coalition:
 *    - Compares fiber life cycles: Organic cotton uses ~45-55% less freshwater irrigation than conventional.
 *    - Recycled polyester saves ~40-45% GHG compared to virgin petrochemical polyester.
 *    - Wool and leather carry high cradle-to-gate impacts due to livestock methane and tanning.
 * 
 * 4. Environmental Equivalency Standards:
 *    - 1 mature tree absorbs ~21 kg CO2 per year (European Environment Agency / Arbor Day Foundation standard).
 *    - 1 standard home bathtub = ~150 Liters of water.
 *    - 1 person's daily drinking water requirement = ~2.5 Liters.
 *    - 1 km driven in average passenger car = ~0.21 kg CO2.
 */

export const ASSUMPTIONS = {
  SECONDHAND_SAVINGS_PERCENT: 0.75, // 75% saved by choosing second-hand
  BASELINE_WEARS: 30, // 30 wears campaign baseline from Ellen MacArthur Foundation
  CO2_KG_PER_TREE_YEAR: 21, // 21 kg CO2 absorbed per mature tree annually
  WATER_LITERS_PER_BATHTUB: 150, // Standard bathtub volume
  DAILY_DRINKING_WATER_LITERS: 2.5, // Daily recommended drinking water
  CAR_KM_PER_KG_CO2: 4.76, // ~0.21 kg CO2 / km = ~4.76 km per 1 kg CO2
} as const;

export interface ImpactBenchmark {
  carbonKg: number; // Virgin manufacturing CO2 in kg
  waterLiters: number; // Virgin manufacturing water footprint in Liters
  description: string;
}

// Matrix of Virgin Impact by Category and Material based on WRAP & Higg MSI
export const IMPACT_MATRIX: Record<GarmentCategory, Record<GarmentMaterial, { carbonKg: number; waterLiters: number }>> = {
  'T-Shirt / Top': {
    'Conventional Cotton': { carbonKg: 7.0, waterLiters: 2700 },
    'Organic Cotton': { carbonKg: 4.2, waterLiters: 1200 },
    'Denim Cotton': { carbonKg: 8.5, waterLiters: 3200 },
    'Polyester': { carbonKg: 6.5, waterLiters: 900 },
    'Recycled Polyester': { carbonKg: 3.8, waterLiters: 450 },
    'Wool': { carbonKg: 10.5, waterLiters: 2400 },
    'Linen': { carbonKg: 4.0, waterLiters: 800 },
    'Viscose / Rayon': { carbonKg: 5.8, waterLiters: 1600 },
    'Leather / PU': { carbonKg: 18.0, waterLiters: 4500 },
    'Nylon / Spandex': { carbonKg: 7.2, waterLiters: 1100 },
  },
  'Jeans / Denim': {
    'Conventional Cotton': { carbonKg: 30.0, waterLiters: 7500 },
    'Organic Cotton': { carbonKg: 20.0, waterLiters: 4000 },
    'Denim Cotton': { carbonKg: 33.4, waterLiters: 8000 }, // WRAP & Ellen MacArthur benchmark
    'Polyester': { carbonKg: 22.0, waterLiters: 2200 },
    'Recycled Polyester': { carbonKg: 15.0, waterLiters: 1200 },
    'Wool': { carbonKg: 32.0, waterLiters: 6500 },
    'Linen': { carbonKg: 14.0, waterLiters: 2100 },
    'Viscose / Rayon': { carbonKg: 21.0, waterLiters: 3800 },
    'Leather / PU': { carbonKg: 55.0, waterLiters: 9000 },
    'Nylon / Spandex': { carbonKg: 25.0, waterLiters: 2600 },
  },
  'Jacket / Outerwear': {
    'Conventional Cotton': { carbonKg: 26.0, waterLiters: 6000 },
    'Organic Cotton': { carbonKg: 18.0, waterLiters: 3200 },
    'Denim Cotton': { carbonKg: 28.5, waterLiters: 6800 },
    'Polyester': { carbonKg: 40.0, waterLiters: 2100 }, // Puffer jacket benchmark
    'Recycled Polyester': { carbonKg: 22.0, waterLiters: 1050 },
    'Wool': { carbonKg: 48.0, waterLiters: 6800 }, // Heavy overcoat benchmark
    'Linen': { carbonKg: 16.0, waterLiters: 2000 },
    'Viscose / Rayon': { carbonKg: 24.0, waterLiters: 3400 },
    'Leather / PU': { carbonKg: 65.0, waterLiters: 12000 }, // Higg MSI leather benchmark
    'Nylon / Spandex': { carbonKg: 35.0, waterLiters: 2400 },
  },
  'Sweater / Knitwear': {
    'Conventional Cotton': { carbonKg: 14.0, waterLiters: 4200 },
    'Organic Cotton': { carbonKg: 9.0, waterLiters: 2100 },
    'Denim Cotton': { carbonKg: 16.0, waterLiters: 4500 },
    'Polyester': { carbonKg: 18.0, waterLiters: 1200 },
    'Recycled Polyester': { carbonKg: 10.5, waterLiters: 650 },
    'Wool': { carbonKg: 28.0, waterLiters: 4500 }, // WRAP knitwear benchmark
    'Linen': { carbonKg: 11.0, waterLiters: 1400 },
    'Viscose / Rayon': { carbonKg: 15.0, waterLiters: 2500 },
    'Leather / PU': { carbonKg: 35.0, waterLiters: 6000 },
    'Nylon / Spandex': { carbonKg: 16.0, waterLiters: 1600 },
  },
  'Dress': {
    'Conventional Cotton': { carbonKg: 16.5, waterLiters: 4500 },
    'Organic Cotton': { carbonKg: 10.5, waterLiters: 2200 },
    'Denim Cotton': { carbonKg: 19.0, waterLiters: 5200 },
    'Polyester': { carbonKg: 14.0, waterLiters: 1800 },
    'Recycled Polyester': { carbonKg: 8.5, waterLiters: 900 },
    'Wool': { carbonKg: 24.0, waterLiters: 4200 },
    'Linen': { carbonKg: 9.5, waterLiters: 1500 },
    'Viscose / Rayon': { carbonKg: 16.0, waterLiters: 3200 },
    'Leather / PU': { carbonKg: 42.0, waterLiters: 8000 },
    'Nylon / Spandex': { carbonKg: 13.5, waterLiters: 1500 },
  },
  'Trousers / Pants': {
    'Conventional Cotton': { carbonKg: 15.0, waterLiters: 4800 },
    'Organic Cotton': { carbonKg: 9.5, waterLiters: 2400 },
    'Denim Cotton': { carbonKg: 24.0, waterLiters: 6500 },
    'Polyester': { carbonKg: 11.0, waterLiters: 1200 },
    'Recycled Polyester': { carbonKg: 6.8, waterLiters: 650 },
    'Wool': { carbonKg: 22.0, waterLiters: 3500 },
    'Linen': { carbonKg: 8.0, waterLiters: 1400 },
    'Viscose / Rayon': { carbonKg: 12.0, waterLiters: 2300 },
    'Leather / PU': { carbonKg: 48.0, waterLiters: 9000 },
    'Nylon / Spandex': { carbonKg: 12.5, waterLiters: 1400 },
  },
  'Shoes / Footwear': {
    'Conventional Cotton': { carbonKg: 12.0, waterLiters: 3200 },
    'Organic Cotton': { carbonKg: 8.5, waterLiters: 1800 },
    'Denim Cotton': { carbonKg: 13.0, waterLiters: 3400 },
    'Polyester': { carbonKg: 14.0, waterLiters: 2200 }, // Sneakers (MIT Materials Systems Lab)
    'Recycled Polyester': { carbonKg: 9.0, waterLiters: 1100 },
    'Wool': { carbonKg: 18.0, waterLiters: 3600 },
    'Linen': { carbonKg: 10.0, waterLiters: 1700 },
    'Viscose / Rayon': { carbonKg: 12.0, waterLiters: 2100 },
    'Leather / PU': { carbonKg: 38.0, waterLiters: 8000 }, // Leather boots benchmark
    'Nylon / Spandex': { carbonKg: 15.0, waterLiters: 2400 },
  },
  'Activewear': {
    'Conventional Cotton': { carbonKg: 9.0, waterLiters: 2800 },
    'Organic Cotton': { carbonKg: 5.5, waterLiters: 1400 },
    'Denim Cotton': { carbonKg: 12.0, waterLiters: 3500 },
    'Polyester': { carbonKg: 9.5, waterLiters: 1800 },
    'Recycled Polyester': { carbonKg: 5.5, waterLiters: 900 },
    'Wool': { carbonKg: 15.0, waterLiters: 3000 },
    'Linen': { carbonKg: 6.0, waterLiters: 1100 },
    'Viscose / Rayon': { carbonKg: 8.5, waterLiters: 1900 },
    'Leather / PU': { carbonKg: 26.0, waterLiters: 5000 },
    'Nylon / Spandex': { carbonKg: 9.2, waterLiters: 1750 },
  },
  'Shirt / Blouse': {
    'Conventional Cotton': { carbonKg: 8.5, waterLiters: 3100 },
    'Organic Cotton': { carbonKg: 5.2, waterLiters: 1500 },
    'Denim Cotton': { carbonKg: 11.0, waterLiters: 3800 },
    'Polyester': { carbonKg: 7.2, waterLiters: 1100 },
    'Recycled Polyester': { carbonKg: 4.4, waterLiters: 580 },
    'Wool': { carbonKg: 14.0, waterLiters: 2900 },
    'Linen': { carbonKg: 4.8, waterLiters: 950 },
    'Viscose / Rayon': { carbonKg: 7.0, waterLiters: 1900 },
    'Leather / PU': { carbonKg: 28.0, waterLiters: 5500 },
    'Nylon / Spandex': { carbonKg: 8.0, waterLiters: 1250 },
  },
  'Accessories / Bag': {
    'Conventional Cotton': { carbonKg: 4.5, waterLiters: 1800 },
    'Organic Cotton': { carbonKg: 2.8, waterLiters: 900 },
    'Denim Cotton': { carbonKg: 5.5, waterLiters: 2100 },
    'Polyester': { carbonKg: 6.0, waterLiters: 950 },
    'Recycled Polyester': { carbonKg: 3.5, waterLiters: 480 },
    'Wool': { carbonKg: 8.0, waterLiters: 1700 },
    'Linen': { carbonKg: 3.2, waterLiters: 700 },
    'Viscose / Rayon': { carbonKg: 4.5, waterLiters: 1200 },
    'Leather / PU': { carbonKg: 24.0, waterLiters: 5000 },
    'Nylon / Spandex': { carbonKg: 5.8, waterLiters: 920 },
  },
};

/**
 * Calculates environmental footprint based on real benchmarks:
 * If secondhand, 75% is saved, meaning the item's attributed burden is only 25% of virgin production.
 */
export function calculateGarmentImpact(
  category: GarmentCategory,
  material: GarmentMaterial,
  isSecondhand: boolean
): { footprint_kg: number; water_liters: number; virgin_carbon_kg: number; virgin_water_liters: number } {
  const categoryData = IMPACT_MATRIX[category] || IMPACT_MATRIX['T-Shirt / Top'];
  const data = categoryData[material] || categoryData['Conventional Cotton'];

  const virgin_carbon_kg = Number(data.carbonKg.toFixed(2));
  const virgin_water_liters = Math.round(data.waterLiters);

  if (isSecondhand) {
    // 75% saved by second-hand (attributed burden is 25%)
    const footprint_kg = Number((virgin_carbon_kg * (1 - ASSUMPTIONS.SECONDHAND_SAVINGS_PERCENT)).toFixed(2));
    const water_liters = Math.round(virgin_water_liters * (1 - ASSUMPTIONS.SECONDHAND_SAVINGS_PERCENT));
    return {
      footprint_kg,
      water_liters,
      virgin_carbon_kg,
      virgin_water_liters,
    };
  }

  return {
    footprint_kg: virgin_carbon_kg,
    water_liters: virgin_water_liters,
    virgin_carbon_kg,
    virgin_water_liters,
  };
}

/**
 * Automatically infers season from category and fiber
 */
export function getDefaultSeason(category: GarmentCategory, material: GarmentMaterial): import('../types/wardrobe').GarmentSeason {
  if (category === 'Sweater / Knitwear') return 'Winter';
  if (category === 'Jacket / Outerwear') {
    return material === 'Wool' || material === 'Leather / PU' ? 'Winter' : 'Autumn';
  }
  if (category === 'Dress') return 'Summer';
  if (category === 'T-Shirt / Top') return 'Summer';
  if (category === 'Shirt / Blouse') return 'Spring';
  if (material === 'Linen') return 'Summer';
  if (material === 'Wool') return 'Winter';
  if (category === 'Shoes / Footwear') {
    return material === 'Leather / PU' ? 'Winter' : 'All-Season';
  }
  return 'All-Season';
}

/**
 * Automatically calculates the 3-tier Environmental Hazard Rating (Normal, Little Hazardous, Dangerous)
 * based on lifecycle carbon emissions, freshwater consumption, and wear durability.
 */
export function calculateHazardRating(item: WardrobeItem): import('../types/wardrobe').HazardEvaluation {
  // 1. Carbon Score (0 - 45 pts)
  const carbonPts = Math.min(45, (item.footprint_kg / 35.0) * 45);

  // 2. Water Score (0 - 35 pts)
  const waterPts = Math.min(35, (item.water_liters / 7500.0) * 35);

  // 3. Durability & Wear Penalty / Bonus (-18 to +18 pts)
  let wearFactor = 0;
  if (item.wears >= 50) {
    wearFactor = -18; // Strong longevity bonus
  } else if (item.wears >= ASSUMPTIONS.BASELINE_WEARS) {
    wearFactor = -10; // Baseline durability met
  } else if (item.wears < 10) {
    wearFactor = +18; // Fast-fashion underutilization risk
  } else if (item.wears < 20) {
    wearFactor = +8;
  }

  // Raw score clamped between 5 and 100
  const score = Math.max(5, Math.min(100, Math.round(carbonPts + waterPts + wearFactor)));

  // Three tiers: Normal (0-35), Little Hazardous (36-68), Dangerous (69-100)
  let level: import('../types/wardrobe').HazardLevel = 'Normal';
  let summary = '';

  if (score <= 35) {
    level = 'Normal';
    if (item.is_secondhand) {
      summary = 'Low ecological risk — 75% virgin production footprint avoided through second-hand reuse.';
    } else if (item.wears >= ASSUMPTIONS.BASELINE_WEARS) {
      summary = 'Sustainable footprint — frequent wears (30+) have neutralized initial manufacturing emissions.';
    } else {
      summary = 'Low resource intensity — low-impact fiber and modest lifecycle footprint.';
    }
  } else if (score <= 68) {
    level = 'Little Hazardous';
    if (item.wears < ASSUMPTIONS.BASELINE_WEARS) {
      summary = `Moderate ecological burden (${item.footprint_kg.toFixed(1)} kg CO2e, ${item.water_liters.toLocaleString()} L). Needs ${Math.max(1, ASSUMPTIONS.BASELINE_WEARS - item.wears)} more wears to reach safe baseline.`;
    } else {
      summary = `Moderate resource consumption. High initial production impact mitigated by steady active use.`;
    }
  } else {
    level = 'Dangerous';
    summary = `Severe climate and water burden (${item.footprint_kg.toFixed(1)} kg CO2e, ${item.water_liters.toLocaleString()} L water). High-impact virgin production with only ${item.wears} wears logged.`;
  }

  return {
    score,
    level,
    carbonScore: Math.round(carbonPts),
    waterScore: Math.round(waterPts),
    durabilityBonus: wearFactor,
    summary,
  };
}

/**
 * Initial curated realistic wardrobe items pre-seeded with WRAP / Ellen MacArthur data
 */
export const INITIAL_WARDROBE_ITEMS: WardrobeItem[] = [
  {
    id: 'item-1',
    name: 'Vintage 90s Trucker Denim Jacket',
    category: 'Jacket / Outerwear',
    material: 'Denim Cotton',
    is_secondhand: true,
    wears: 48,
    footprint_kg: 7.13, // 28.5 * 0.25 (75% saved)
    water_liters: 1700, // 6800 * 0.25 (75% saved)
    season: 'Autumn',
    date_added: '2026-08-10',
    color: '#3b82f6',
  },
  {
    id: 'item-2',
    name: 'Classic White Heavyweight T-Shirt',
    category: 'T-Shirt / Top',
    material: 'Conventional Cotton',
    is_secondhand: false,
    wears: 32,
    footprint_kg: 7.0, // WRAP benchmark: 7.0 kg CO2e
    water_liters: 2700, // WRAP benchmark: 2,700 Liters
    season: 'Summer',
    date_added: '2026-09-02',
    color: '#e2e8f0',
  },
  {
    id: 'item-3',
    name: 'Thrifted Fisherman Wool Cardigan',
    category: 'Sweater / Knitwear',
    material: 'Wool',
    is_secondhand: true,
    wears: 41,
    footprint_kg: 7.0, // 28.0 * 0.25
    water_liters: 1125, // 4500 * 0.25
    season: 'Winter',
    date_added: '2026-07-15',
    color: '#d97706',
  },
  {
    id: 'item-4',
    name: 'Selvedge Slim Fit Raw Jeans',
    category: 'Jeans / Denim',
    material: 'Denim Cotton',
    is_secondhand: false,
    wears: 65,
    footprint_kg: 33.4, // WRAP & Ellen MacArthur: 33.4 kg CO2e
    water_liters: 8000, // 8,000 Liters
    season: 'All-Season',
    date_added: '2026-05-18',
    color: '#1e3a8a',
  },
  {
    id: 'item-5',
    name: 'Organic Cotton Breton Stripe Tee',
    category: 'T-Shirt / Top',
    material: 'Organic Cotton',
    is_secondhand: false,
    wears: 28,
    footprint_kg: 4.2, // Higg MSI organic reduction
    water_liters: 1200,
    season: 'Spring',
    date_added: '2026-09-12',
    color: '#0284c7',
  },
  {
    id: 'item-6',
    name: 'Secondhand Chelsea Leather Boots',
    category: 'Shoes / Footwear',
    material: 'Leather / PU',
    is_secondhand: true,
    wears: 84,
    footprint_kg: 9.5, // 38.0 * 0.25 (75% saved)
    water_liters: 2000, // 8000 * 0.25 (75% saved)
    season: 'Winter',
    date_added: '2026-04-20',
    color: '#78350f',
  },
  {
    id: 'item-7',
    name: 'Recycled Poly Trail Running Jacket',
    category: 'Jacket / Outerwear',
    material: 'Recycled Polyester',
    is_secondhand: false,
    wears: 19,
    footprint_kg: 22.0,
    water_liters: 1050,
    season: 'Autumn',
    date_added: '2026-10-01',
    color: '#059669',
  },
  {
    id: 'item-8',
    name: 'Vintage Silk/Viscose Floral Wrap Dress',
    category: 'Dress',
    material: 'Viscose / Rayon',
    is_secondhand: true,
    wears: 22,
    footprint_kg: 4.0, // 16.0 * 0.25
    water_liters: 800, // 3200 * 0.25
    season: 'Summer',
    date_added: '2026-08-25',
    color: '#ec4899',
  },
];

/**
 * Curated Batch Presets for "Add Multiple Items at Once"
 */
export interface BatchPreset {
  id: string;
  title: string;
  description: string;
  badge: string;
  items: Omit<WardrobeItem, 'id' | 'date_added'>[];
}

export const MULTI_ITEM_PRESETS: BatchPreset[] = [
  {
    id: 'preset-thrift-haul',
    title: 'Weekend Thrift Haul (3 Items)',
    description: '3 second-hand wardrobe staples saving ~75% CO2 and water compared to buying new.',
    badge: '75% Eco Savings',
    items: [
      {
        name: 'Vintage Oversized Graphic Tee',
        category: 'T-Shirt / Top',
        material: 'Conventional Cotton',
        is_secondhand: true,
        wears: 8,
        footprint_kg: 1.75, // 7.0 * 0.25
        water_liters: 675, // 2700 * 0.25
        color: '#64748b',
      },
      {
        name: 'Thrifted High-Rise Mom Jeans',
        category: 'Jeans / Denim',
        material: 'Denim Cotton',
        is_secondhand: true,
        wears: 14,
        footprint_kg: 8.35, // 33.4 * 0.25
        water_liters: 2000, // 8000 * 0.25
        color: '#2563eb',
      },
      {
        name: 'Pre-Loved Chunky Wool Knit',
        category: 'Sweater / Knitwear',
        material: 'Wool',
        is_secondhand: true,
        wears: 10,
        footprint_kg: 7.0, // 28.0 * 0.25
        water_liters: 1125, // 4500 * 0.25
        color: '#b45309',
      },
    ],
  },
  {
    id: 'preset-capsule-basics',
    title: 'Capsule Wardrobe Starter (4 Items)',
    description: 'Core daily rotation: 2 tees, 1 chino, and 1 light jacket.',
    badge: 'Capsule Foundation',
    items: [
      {
        name: 'Everyday Black Cotton Tee',
        category: 'T-Shirt / Top',
        material: 'Organic Cotton',
        is_secondhand: false,
        wears: 25,
        footprint_kg: 4.2,
        water_liters: 1200,
        color: '#0f172a',
      },
      {
        name: 'Heather Gray Pocket Tee',
        category: 'T-Shirt / Top',
        material: 'Conventional Cotton',
        is_secondhand: false,
        wears: 20,
        footprint_kg: 7.0,
        water_liters: 2700,
        color: '#94a3b8',
      },
      {
        name: 'Khaki Cotton Chino Trousers',
        category: 'Trousers / Pants',
        material: 'Conventional Cotton',
        is_secondhand: false,
        wears: 35,
        footprint_kg: 15.0,
        water_liters: 4800,
        color: '#d97706',
      },
      {
        name: 'Utility Field Overshirt',
        category: 'Shirt / Blouse',
        material: 'Linen',
        is_secondhand: true,
        wears: 18,
        footprint_kg: 1.2,
        water_liters: 238,
        color: '#15803d',
      },
    ],
  },
  {
    id: 'preset-active-set',
    title: 'Workout & Fitness Duo (2 Items)',
    description: 'High-performance recycled activewear for sports and daily workouts.',
    badge: 'Recycled Technical',
    items: [
      {
        name: 'Moisture-Wicking Training Tee',
        category: 'Activewear',
        material: 'Recycled Polyester',
        is_secondhand: false,
        wears: 36,
        footprint_kg: 5.5,
        water_liters: 900,
        color: '#0ea5e9',
      },
      {
        name: 'Performance Running Leggings',
        category: 'Activewear',
        material: 'Nylon / Spandex',
        is_secondhand: false,
        wears: 42,
        footprint_kg: 9.2,
        water_liters: 1750,
        color: '#334155',
      },
    ],
  },
  {
    id: 'preset-sustainable-denim',
    title: 'Denim Revival Bundle (2 Items)',
    description: 'Thrifted denim jacket and upcycled jeans pairing.',
    badge: 'Circular Denim',
    items: [
      {
        name: 'Upcycled Denim Chore Coat',
        category: 'Jacket / Outerwear',
        material: 'Denim Cotton',
        is_secondhand: true,
        wears: 24,
        footprint_kg: 7.13,
        water_liters: 1700,
        color: '#1d4ed8',
      },
      {
        name: 'Vintage Straight Leg 501 Jeans',
        category: 'Jeans / Denim',
        material: 'Denim Cotton',
        is_secondhand: true,
        wears: 38,
        footprint_kg: 8.35,
        water_liters: 2000,
        color: '#3b82f6',
      },
    ],
  },
];
