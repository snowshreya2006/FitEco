import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles, Droplets, Flame, RotateCcw, HelpCircle, Sun } from 'lucide-react';
import { GarmentCategory, GarmentMaterial, GarmentSeason, WardrobeItem } from '../types/wardrobe';
import { calculateGarmentImpact, IMPACT_MATRIX, getDefaultSeason } from '../data/sustainabilityData';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<WardrobeItem, 'id'>) => void;
  onOpenMethodology: () => void;
}

const CATEGORIES: GarmentCategory[] = [
  'T-Shirt / Top',
  'Jeans / Denim',
  'Jacket / Outerwear',
  'Sweater / Knitwear',
  'Dress',
  'Trousers / Pants',
  'Shoes / Footwear',
  'Activewear',
  'Shirt / Blouse',
  'Accessories / Bag',
];

const MATERIALS: GarmentMaterial[] = [
  'Conventional Cotton',
  'Organic Cotton',
  'Denim Cotton',
  'Polyester',
  'Recycled Polyester',
  'Wool',
  'Linen',
  'Viscose / Rayon',
  'Leather / PU',
  'Nylon / Spandex',
];

const SEASONS: GarmentSeason[] = [
  'All-Season',
  'Spring',
  'Summer',
  'Autumn',
  'Winter',
];

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  onOpenMethodology,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GarmentCategory>('T-Shirt / Top');
  const [material, setMaterial] = useState<GarmentMaterial>('Conventional Cotton');
  const [season, setSeason] = useState<GarmentSeason>('Summer');
  const [isSecondhand, setIsSecondhand] = useState(false);
  const [wears, setWears] = useState<number>(1);
  const [useCustomOverride, setUseCustomOverride] = useState(false);
  const [customCarbon, setCustomCarbon] = useState<number>(0);
  const [customWater, setCustomWater] = useState<number>(0);

  // Live calculation based on WRAP / Ellen MacArthur Foundation benchmarks
  const impact = calculateGarmentImpact(category, material, isSecondhand);

  // Auto-update season when category/material changes
  const handleCategoryChange = (newCat: GarmentCategory) => {
    setCategory(newCat);
    setSeason(getDefaultSeason(newCat, material));
  };

  const handleMaterialChange = (newMat: GarmentMaterial) => {
    setMaterial(newMat);
    setSeason(getDefaultSeason(category, newMat));
  };

  useEffect(() => {
    if (!useCustomOverride) {
      setCustomCarbon(impact.footprint_kg);
      setCustomWater(impact.water_liters);
    }
  }, [category, material, isSecondhand, useCustomOverride, impact.footprint_kg, impact.water_liters]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCarbon = useCustomOverride ? Number(customCarbon) : impact.footprint_kg;
    const finalWater = useCustomOverride ? Number(customWater) : impact.water_liters;

    onAdd({
      name: name.trim() || `${isSecondhand ? 'Second-hand ' : ''}${category}`,
      category,
      material,
      is_secondhand: isSecondhand,
      wears: Math.max(0, Number(wears) || 0),
      footprint_kg: finalCarbon,
      water_liters: finalWater,
      season,
      date_added: new Date().toISOString().split('T')[0],
    });

    // Reset form
    setName('');
    setCategory('T-Shirt / Top');
    setMaterial('Conventional Cotton');
    setSeason('Summer');
    setIsSecondhand(false);
    setWears(1);
    setUseCustomOverride(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-item-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 id="add-item-title" className="text-base font-bold text-slate-900">
                Add Wardrobe Item
              </h2>
              <p className="text-xs text-slate-500">
                Benchmarked with WRAP &amp; Ellen MacArthur Foundation figures
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Garment Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Garment Name / Description
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vintage Oversized Denim Jacket"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Category, Material & Season grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as GarmentCategory)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Material
              </label>
              <select
                value={material}
                onChange={(e) => handleMaterialChange(e.target.value as GarmentMaterial)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {MATERIALS.map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Season Worn
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as GarmentSeason)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {SEASONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition: Secondhand vs New (Key feature for 75% savings reward) */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                Condition &amp; Sourcing
              </span>
              <button
                type="button"
                onClick={onOpenMethodology}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                <HelpCircle className="w-3 h-3" />
                <span>75% savings rule</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsSecondhand(false)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-colors ${
                  !isSecondhand
                    ? 'border-slate-800 bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'border-slate-200 bg-white/60 text-slate-600 hover:bg-white'
                }`}
              >
                <div>Brand New</div>
                <div className="text-[11px] text-slate-500">100% virgin footprint</div>
              </button>

              <button
                type="button"
                onClick={() => setIsSecondhand(true)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-colors relative ${
                  isSecondhand
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-2xs font-semibold'
                    : 'border-slate-200 bg-white/60 text-slate-600 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Second-Hand / Thrifted</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded-xs">
                    -75%
                  </span>
                </div>
                <div className="text-[11px] text-emerald-700">75% CO2 &amp; water saved!</div>
              </button>
            </div>
          </div>

          {/* Times Worn */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Times Worn So Far (Wears)
              </label>
              <span className="text-[11px] text-slate-500">
                Ellen MacArthur benchmark: 30 wears
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="999"
                value={wears}
                onChange={(e) => setWears(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-32 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono tabular-nums"
              />
              <div className="flex gap-1.5">
                {[1, 5, 15, 30, 50].map((quickWear) => (
                  <button
                    key={quickWear}
                    type="button"
                    onClick={() => setWears(quickWear)}
                    className="px-2 py-1 text-xs border border-slate-200 rounded-md hover:bg-slate-100 font-mono text-slate-600"
                  >
                    {quickWear}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Environmental Impact Preview (Real Benchmarks) */}
          <div className="p-3.5 bg-slate-900 text-white rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-white">Calculated Lifecycle Footprint</span>
              <span className="text-[11px] text-emerald-400">
                {isSecondhand ? '75% Secondhand Discount Applied' : 'Virgin Lifecycle Standard'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 bg-slate-800/80 rounded-md border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Carbon Footprint</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-lg font-bold font-mono text-white tabular-nums">
                    {impact.footprint_kg.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">kg CO2e</span>
                </div>
                {isSecondhand && (
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    Avoided: +{(impact.virgin_carbon_kg * 0.75).toFixed(2)} kg
                  </div>
                )}
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-md border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  <span>Water Consumed</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-lg font-bold font-mono text-white tabular-nums">
                    {impact.water_liters.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">Liters</span>
                </div>
                {isSecondhand && (
                  <div className="text-[10px] text-sky-300 mt-0.5">
                    Saved: +{Math.round(impact.virgin_water_liters * 0.75).toLocaleString()} L
                  </div>
                )}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
              <span>Cost per wear:</span>
              <span className="font-mono text-emerald-300 font-semibold">
                {(impact.footprint_kg / Math.max(1, wears)).toFixed(3)} kg CO2e / wear
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Wardrobe</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
