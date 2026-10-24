export type GarmentCategory =
  | 'T-Shirt / Top'
  | 'Jeans / Denim'
  | 'Jacket / Outerwear'
  | 'Sweater / Knitwear'
  | 'Dress'
  | 'Trousers / Pants'
  | 'Shoes / Footwear'
  | 'Activewear'
  | 'Shirt / Blouse'
  | 'Accessories / Bag';

export type GarmentMaterial =
  | 'Conventional Cotton'
  | 'Organic Cotton'
  | 'Denim Cotton'
  | 'Polyester'
  | 'Recycled Polyester'
  | 'Wool'
  | 'Linen'
  | 'Viscose / Rayon'
  | 'Leather / PU'
  | 'Nylon / Spandex';

export type GarmentSeason = 'All-Season' | 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export type HazardLevel = 'Normal' | 'Little Hazardous' | 'Dangerous';

export interface HazardEvaluation {
  score: number; // 0 to 100
  level: HazardLevel;
  carbonScore: number;
  waterScore: number;
  durabilityBonus: number;
  summary: string;
}

export interface WardrobeItem {
  id: string;
  name: string;
  category: GarmentCategory;
  material: GarmentMaterial;
  is_secondhand: boolean;
  wears: number;
  footprint_kg: number; // CO2 footprint in kg CO2e
  water_liters: number; // Water consumption in Liters
  season?: GarmentSeason;
  date_added?: string;
  color?: string;
}

export interface EcoBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  progress: number; // 0 to 100
  metricLabel: string;
}
