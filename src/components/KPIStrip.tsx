import React from 'react';
import { WardrobeItem } from '../types/wardrobe';
import { ASSUMPTIONS } from '../data/sustainabilityData';
import { CloudRain, Trees, RotateCcw, Flame, CheckCircle2, Droplets } from 'lucide-react';

interface KPIStripProps {
  items: WardrobeItem[];
}

export const KPIStrip: React.FC<KPIStripProps> = ({ items }) => {
  const totalCarbonKg = items.reduce((sum, item) => sum + item.footprint_kg, 0);
  const totalWaterLiters = items.reduce((sum, item) => sum + item.water_liters, 0);
  const totalWears = items.reduce((sum, item) => sum + item.wears, 0);
  
  // Second-hand items count & savings
  const secondhandItems = items.filter((item) => item.is_secondhand);
  const secondhandCount = secondhandItems.length;
  const circularityRate = items.length > 0 ? Math.round((secondhandCount / items.length) * 100) : 0;

  // Since secondhand items have 75% saved, their current footprint is 25% of virgin.
  // The avoided/saved emissions are: footprint / 0.25 * 0.75 = footprint * 3
  const co2SavedKg = secondhandItems.reduce((sum, item) => sum + item.footprint_kg * 3, 0);
  const waterSavedLiters = secondhandItems.reduce((sum, item) => sum + item.water_liters * 3, 0);

  // Carbon per wear across entire wardrobe
  const avgCarbonPerWear = totalWears > 0 ? (totalCarbonKg / totalWears).toFixed(2) : '0.00';
  const avgWaterPerWear = totalWears > 0 ? Math.round(totalWaterLiters / totalWears) : 0;

  // Trees equivalent: 21 kg CO2 absorbed per mature tree annually
  const treesNeeded = (totalCarbonKg / ASSUMPTIONS.CO2_KG_PER_TREE_YEAR).toFixed(1);
  const treesSaved = (co2SavedKg / ASSUMPTIONS.CO2_KG_PER_TREE_YEAR).toFixed(1);

  // Bathtub equivalent (150 Liters each)
  const bathtubsWater = Math.round(totalWaterLiters / ASSUMPTIONS.WATER_LITERS_PER_BATHTUB);
  const bathtubsSaved = Math.round(waterSavedLiters / ASSUMPTIONS.WATER_LITERS_PER_BATHTUB);

  // Garments achieving 30+ wears baseline
  const baselineAchievedCount = items.filter((i) => i.wears >= ASSUMPTIONS.BASELINE_WEARS).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Wardrobe Carbon Footprint */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
          <span>Wardrobe Carbon Footprint</span>
          <Flame className="w-4 h-4 text-amber-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {totalCarbonKg.toFixed(1)}
          </span>
          <span className="text-xs font-semibold text-slate-600">kg CO2e</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Avg per wear:</span>
          <span className="font-mono tabular-nums font-semibold text-slate-700">
            {avgCarbonPerWear} kg / wear
          </span>
        </div>
      </div>

      {/* 2. Wardrobe Water Footprint */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
          <span>Wardrobe Water Footprint</span>
          <Droplets className="w-4 h-4 text-sky-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {totalWaterLiters.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-slate-600">Liters</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Bathtub equivalent:</span>
          <span className="font-mono tabular-nums font-semibold text-slate-700">
            ~{bathtubsWater} tubs (150L)
          </span>
        </div>
      </div>

      {/* 3. Second-Hand Savings (75% avoided) */}
      <div className="bg-white rounded-xl p-5 border border-emerald-200/80 bg-linear-to-b from-emerald-50/40 to-white shadow-2xs">
        <div className="flex items-center justify-between text-emerald-800 text-xs font-medium">
          <span>Second-Hand Avoided Impact</span>
          <RotateCcw className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-emerald-700 font-mono tabular-nums">
            +{co2SavedKg.toFixed(1)}
          </span>
          <span className="text-xs font-semibold text-emerald-800">kg CO2e saved</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-emerald-100">
          <span>Water saved:</span>
          <span className="font-mono tabular-nums font-semibold text-emerald-700">
            +{waterSavedLiters.toLocaleString()} L (~{bathtubsSaved} tubs)
          </span>
        </div>
      </div>

      {/* 4. Tree Absorption & 30-Wear Longevity */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
          <span>Tree Offset &amp; 30-Wear Goal</span>
          <Trees className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {treesNeeded}
          </span>
          <span className="text-xs font-semibold text-slate-600">trees / year to offset</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Reached 30+ wears:</span>
          <span className="font-mono tabular-nums font-semibold text-emerald-600">
            {baselineAchievedCount} of {items.length} garments
          </span>
        </div>
      </div>
    </div>
  );
};
