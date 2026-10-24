import React, { useState } from 'react';
import { WardrobeItem } from '../types/wardrobe';
import { ASSUMPTIONS } from '../data/sustainabilityData';
import { 
  Flame, 
  Droplets, 
  Trees, 
  Car, 
  RotateCcw, 
  TrendingDown, 
  Sliders, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface ImpactVisualizerProps {
  items: WardrobeItem[];
  onOpenMethodology: () => void;
}

export const ImpactVisualizer: React.FC<ImpactVisualizerProps> = ({
  items,
  onOpenMethodology,
}) => {
  const [simulatedWears, setSimulatedWears] = useState<number>(30);

  const totalCarbon = items.reduce((s, i) => s + i.footprint_kg, 0);
  const totalWater = items.reduce((s, i) => s + i.water_liters, 0);
  const totalWears = items.reduce((s, i) => s + i.wears, 0);

  const secondhandItems = items.filter((i) => i.is_secondhand);
  const newItems = items.filter((i) => !i.is_secondhand);

  // Secondhand avoided savings (footprint / 0.25 * 0.75 = footprint * 3)
  const co2AvoidedKg = secondhandItems.reduce((s, i) => s + i.footprint_kg * 3, 0);
  const waterAvoidedL = secondhandItems.reduce((s, i) => s + i.water_liters * 3, 0);

  // Equivalents
  const treesNeeded = (totalCarbon / ASSUMPTIONS.CO2_KG_PER_TREE_YEAR).toFixed(1);
  const treesSaved = (co2AvoidedKg / ASSUMPTIONS.CO2_KG_PER_TREE_YEAR).toFixed(1);
  const bathtubsWater = Math.round(totalWater / ASSUMPTIONS.WATER_LITERS_PER_BATHTUB);
  const bathtubsSaved = Math.round(waterAvoidedL / ASSUMPTIONS.WATER_LITERS_PER_BATHTUB);
  const drinkingWaterDays = Math.round(totalWater / ASSUMPTIONS.DAILY_DRINKING_WATER_LITERS);
  const carKm = Math.round(totalCarbon * ASSUMPTIONS.CAR_KM_PER_KG_CO2);

  // Category breakdown
  const categoryStats = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { carbon: 0, water: 0, count: 0 };
    }
    acc[item.category].carbon += item.footprint_kg;
    acc[item.category].water += item.water_liters;
    acc[item.category].count += 1;
    return acc;
  }, {} as Record<string, { carbon: number; water: number; count: number }>);

  const sortedCategories = Object.entries(categoryStats).sort((a, b) => b[1].carbon - a[1].carbon);

  // Wear Longevity Simulation (Fast Fashion 10 wears vs User Selected)
  const fastFashionCPW = totalCarbon / Math.max(1, items.length * 10);
  const simulatedCPW = totalCarbon / Math.max(1, items.length * simulatedWears);
  const reductionPercentage = fastFashionCPW > 0 ? Math.round(((fastFashionCPW - simulatedCPW) / fastFashionCPW) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Environmental Impact Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full lifecycle cradle-to-gate carbon and water accounting (WRAP &amp; Ellen MacArthur Foundation)
          </p>
        </div>

        <button
          onClick={onOpenMethodology}
          className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Calculation Assumptions</span>
        </button>
      </div>

      {/* Real-World Equivalents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trees */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Forest Absorption</span>
            <Trees className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {treesNeeded}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mature trees required for 1 full year to absorb your current wardrobe footprint (21 kg CO2e/tree).
          </p>
        </div>

        {/* Bathtubs of Water */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Freshwater Depletion</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {bathtubsWater.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Full household bathtubs (150L each). Equals {drinkingWaterDays.toLocaleString()} days of drinking water.
          </p>
        </div>

        {/* Car Travel */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Driving Equivalent</span>
            <Car className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {carKm.toLocaleString()} km
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kilometers driven in an average gasoline passenger vehicle (0.21 kg CO2/km).
          </p>
        </div>

        {/* Secondhand Avoidance */}
        <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
            <span>Circular Savings</span>
            <RotateCcw className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-800 tabular-nums">
            +{co2AvoidedKg.toFixed(1)} kg
          </div>
          <p className="text-xs text-emerald-700 mt-1">
            Emissions eliminated by opting for second-hand (+{bathtubsSaved} bathtubs of water spared!).
          </p>
        </div>
      </div>

      {/* Interactive Wear Longevity Simulator */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Wardrobe Longevity Simulator
              </h3>
              <p className="text-xs text-slate-400">
                See how extending garment wear life slashes your personal carbon per wear
              </p>
            </div>
          </div>

          <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold rounded-md border border-emerald-500/30">
            {reductionPercentage > 0 ? `-${reductionPercentage}% Carbon / Wear` : 'Baseline'}
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">Target Wear Count per Garment:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
              {simulatedWears} wears
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={simulatedWears}
            onChange={(e) => setSimulatedWears(parseInt(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>10 (Fast fashion)</span>
            <span>30 (Ellen MacArthur baseline)</span>
            <span>60 (Doubled life)</span>
            <span>100 (Century longevity)</span>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <div className="text-slate-400">Fast Fashion (10 wears)</div>
            <div className="font-mono font-bold text-white text-base mt-1 tabular-nums">
              {fastFashionCPW.toFixed(2)} kg CO2e
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Average carbon per wear</div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <div className="text-emerald-400 font-medium">Your Target ({simulatedWears} wears)</div>
            <div className="font-mono font-bold text-emerald-300 text-base mt-1 tabular-nums">
              {simulatedCPW.toFixed(2)} kg CO2e
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">
              Saves {(fastFashionCPW - simulatedCPW).toFixed(2)} kg CO2e each time!
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <div className="text-slate-400">Ellen MacArthur Finding</div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              "Doubling the average number of times clothing is worn would cut greenhouse gas emissions by 44%."
            </p>
          </div>
        </div>
      </div>

      {/* Category Footprint Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Impact by Garment Category</h3>
          <p className="text-xs text-slate-500">Distribution of carbon and water consumption across your pieces</p>
        </div>

        <div className="space-y-3">
          {sortedCategories.map(([category, stats]) => {
            const carbonPercent = totalCarbon > 0 ? (stats.carbon / totalCarbon) * 100 : 0;
            const waterPercent = totalWater > 0 ? (stats.water / totalWater) * 100 : 0;

            return (
              <div key={category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-semibold text-slate-800">
                    {category} <span className="text-slate-400 font-normal">({stats.count} items)</span>
                  </div>
                  <div className="font-mono text-slate-600 tabular-nums">
                    <strong>{stats.carbon.toFixed(1)} kg CO2e</strong> ({carbonPercent.toFixed(0)}%) · <strong>{stats.water.toLocaleString()} L</strong>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${carbonPercent}%` }}
                    title={`Carbon: ${carbonPercent.toFixed(1)}%`}
                  />
                  <div
                    className="bg-sky-400 h-full opacity-60"
                    style={{ width: `${waterPercent}%` }}
                    title={`Water: ${waterPercent.toFixed(1)}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
