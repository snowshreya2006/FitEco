import React, { useState } from 'react';
import { X, Save, RotateCcw, Flame, Droplets } from 'lucide-react';
import { GarmentCategory, GarmentMaterial, GarmentSeason, WardrobeItem } from '../types/wardrobe';
import { calculateGarmentImpact, getDefaultSeason } from '../data/sustainabilityData';

interface EditItemModalProps {
  item: WardrobeItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: WardrobeItem) => void;
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

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !item) return null;

  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState<GarmentCategory>(item.category);
  const [material, setMaterial] = useState<GarmentMaterial>(item.material);
  const [season, setSeason] = useState<GarmentSeason>(item.season || getDefaultSeason(item.category, item.material));
  const [isSecondhand, setIsSecondhand] = useState(item.is_secondhand);
  const [wears, setWears] = useState(item.wears);
  const [footprintKg, setFootprintKg] = useState(item.footprint_kg);
  const [waterLiters, setWaterLiters] = useState(item.water_liters);

  // Recalculate if user changes category, material, or secondhand status
  const handleRecalculate = () => {
    const impact = calculateGarmentImpact(category, material, isSecondhand);
    setFootprintKg(impact.footprint_kg);
    setWaterLiters(impact.water_liters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      name: name.trim() || item.name,
      category,
      material,
      season,
      is_secondhand: isSecondhand,
      wears: Math.max(0, Number(wears) || 0),
      footprint_kg: Number(footprintKg),
      water_liters: Number(waterLiters),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-item-title"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 id="edit-item-title" className="text-base font-bold text-slate-900">
              Edit Wardrobe Garment
            </h2>
            <p className="text-xs text-slate-500">Update wears, condition, or recalculate impact</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Garment Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const newCat = e.target.value as GarmentCategory;
                  setCategory(newCat);
                }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Material
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value as GarmentMaterial)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                {MATERIALS.map((m) => (
                  <option key={m} value={m}>
                    {m}
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
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                {SEASONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition toggle */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Second-Hand / Pre-Loved Item</span>
              </div>
              <div className="text-[11px] text-emerald-700">75% savings assumption applied</div>
            </div>
            <input
              type="checkbox"
              checked={isSecondhand}
              onChange={(e) => setIsSecondhand(e.target.checked)}
              className="w-4 h-4 rounded-xs text-emerald-600 focus:ring-emerald-500"
            />
          </div>

          {/* Times Worn */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Times Worn (Wears Count)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={wears}
                onChange={(e) => setWears(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-32 px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono tabular-nums"
              />
              <button
                type="button"
                onClick={() => setWears((w) => w + 1)}
                className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              >
                +1 Wear
              </button>
            </div>
          </div>

          {/* Footprint & Water Liters */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>CO2 Footprint (kg)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={footprintKg}
                onChange={(e) => setFootprintKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>Water Used (Liters)</span>
              </label>
              <input
                type="number"
                min="0"
                value={waterLiters}
                onChange={(e) => setWaterLiters(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono tabular-nums"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={handleRecalculate}
              className="text-xs text-emerald-700 hover:underline"
            >
              Reset to WRAP / EMF benchmark
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
