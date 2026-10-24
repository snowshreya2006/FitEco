import React, { useState } from 'react';
import { X, Layers, Plus, Trash2, Sparkles, Droplets, Flame, RotateCcw, PackageCheck } from 'lucide-react';
import { GarmentCategory, GarmentMaterial, WardrobeItem } from '../types/wardrobe';
import { calculateGarmentImpact, MULTI_ITEM_PRESETS, BatchPreset, getDefaultSeason } from '../data/sustainabilityData';

interface MultiItemAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMultiple: (items: Omit<WardrobeItem, 'id'>[]) => void;
}

interface BatchRow {
  key: string;
  name: string;
  category: GarmentCategory;
  material: GarmentMaterial;
  is_secondhand: boolean;
  wears: number;
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

export const MultiItemAddModal: React.FC<MultiItemAddModalProps> = ({
  isOpen,
  onClose,
  onAddMultiple,
}) => {
  const [activeTab, setActiveTab] = useState<'batch-table' | 'presets' | 'quantity-generator'>('batch-table');

  // Initial 3 rows for batch entry
  const [rows, setRows] = useState<BatchRow[]>([
    {
      key: 'row-1',
      name: 'Vintage Band Graphic Tee',
      category: 'T-Shirt / Top',
      material: 'Conventional Cotton',
      is_secondhand: true,
      wears: 12,
    },
    {
      key: 'row-2',
      name: 'Organic Indigo Denim Jeans',
      category: 'Jeans / Denim',
      material: 'Organic Cotton',
      is_secondhand: false,
      wears: 22,
    },
    {
      key: 'row-3',
      name: 'Thrifted Wool Knit Sweater',
      category: 'Sweater / Knitwear',
      material: 'Wool',
      is_secondhand: true,
      wears: 35,
    },
  ]);

  // Quantity generator state
  const [genCount, setGenCount] = useState<number>(3);
  const [genBaseName, setGenBaseName] = useState<string>('Everyday Cotton Crewneck');
  const [genCategory, setGenCategory] = useState<GarmentCategory>('T-Shirt / Top');
  const [genMaterial, setGenMaterial] = useState<GarmentMaterial>('Organic Cotton');
  const [genSecondhand, setGenSecondhand] = useState<boolean>(true);
  const [genWears, setGenWears] = useState<number>(15);

  if (!isOpen) return null;

  const handleRowChange = (key: string, field: keyof BatchRow, value: any) => {
    setRows((prev) =>
      prev.map((row) => (row.key === key ? { ...row, [field]: value } : row))
    );
  };

  const handleAddRow = () => {
    const newKey = `row-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setRows((prev) => [
      ...prev,
      {
        key: newKey,
        name: `Wardrobe Piece #${prev.length + 1}`,
        category: 'T-Shirt / Top',
        material: 'Conventional Cotton',
        is_secondhand: true,
        wears: 5,
      },
    ]);
  };

  const handleRemoveRow = (key: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.key !== key));
  };

  // Submit rows
  const handleSubmitBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const preparedItems: Omit<WardrobeItem, 'id'>[] = rows.map((r) => {
      const impact = calculateGarmentImpact(r.category, r.material, r.is_secondhand);
      return {
        name: r.name.trim() || `${r.is_secondhand ? 'Secondhand ' : ''}${r.category}`,
        category: r.category,
        material: r.material,
        is_secondhand: r.is_secondhand,
        wears: Math.max(0, Number(r.wears) || 0),
        footprint_kg: impact.footprint_kg,
        water_liters: impact.water_liters,
        season: getDefaultSeason(r.category, r.material),
        date_added: new Date().toISOString().split('T')[0],
      };
    });

    onAddMultiple(preparedItems);
    onClose();
  };

  // Apply a preset pack
  const handleApplyPreset = (preset: BatchPreset) => {
    const preparedItems: Omit<WardrobeItem, 'id'>[] = preset.items.map((item) => ({
      ...item,
      season: item.season || getDefaultSeason(item.category, item.material),
      date_added: new Date().toISOString().split('T')[0],
    }));
    onAddMultiple(preparedItems);
    onClose();
  };

  // Submit Quantity Generator
  const handleSubmitGenerator = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Math.min(20, Math.max(1, genCount));
    const impact = calculateGarmentImpact(genCategory, genMaterial, genSecondhand);

    const generated: Omit<WardrobeItem, 'id'>[] = Array.from({ length: count }, (_, idx) => ({
      name: count > 1 ? `${genBaseName} #${idx + 1}` : genBaseName,
      category: genCategory,
      material: genMaterial,
      is_secondhand: genSecondhand,
      wears: Math.max(0, genWears),
      footprint_kg: impact.footprint_kg,
      water_liters: impact.water_liters,
      season: getDefaultSeason(genCategory, genMaterial),
      date_added: new Date().toISOString().split('T')[0],
    }));

    onAddMultiple(generated);
    onClose();
  };

  // Batch calculations for the table view
  const batchStats = rows.reduce(
    (acc, row) => {
      const imp = calculateGarmentImpact(row.category, row.material, row.is_secondhand);
      acc.totalCarbon += imp.footprint_kg;
      acc.totalWater += imp.water_liters;
      if (row.is_secondhand) {
        acc.avoidedCarbon += imp.virgin_carbon_kg * 0.75;
        acc.avoidedWater += imp.virgin_water_liters * 0.75;
      }
      return acc;
    },
    { totalCarbon: 0, totalWater: 0, avoidedCarbon: 0, avoidedWater: 0 }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-xl max-w-4xl w-full border border-slate-200 shadow-xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="multi-item-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 id="multi-item-title" className="text-base font-bold text-slate-900">
                Add Multiple Items at Once
              </h2>
              <p className="text-xs text-slate-500">
                Batch wardrobe entry with real carbon &amp; water lifecycle metrics
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

        {/* Mode Tabs */}
        <div className="px-6 pt-3 pb-0 border-b border-slate-100 shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('batch-table')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'batch-table'
                  ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Batch Form Table</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full tabular-nums">
                {rows.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('presets')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Curated Presets</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                4 Packs
              </span>
            </button>

            <button
              onClick={() => setActiveTab('quantity-generator')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'quantity-generator'
                  ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Multiplier</span>
            </button>
          </div>
        </div>

        {/* Body based on activeTab */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: BATCH TABLE */}
          {activeTab === 'batch-table' && (
            <form onSubmit={handleSubmitBatch} className="space-y-4">
              <div className="text-xs text-slate-600 flex items-center justify-between">
                <span>
                  Configure multiple garments. Each row updates carbon &amp; water in real time.
                </span>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Row</span>
                </button>
              </div>

              {/* Responsive Row Cards / Table */}
              <div className="space-y-3">
                {rows.map((row, idx) => {
                  const rowImpact = calculateGarmentImpact(row.category, row.material, row.is_secondhand);
                  return (
                    <div
                      key={row.key}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xs font-mono font-bold text-slate-400 w-5">
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => handleRowChange(row.key, 'name', e.target.value)}
                            placeholder="Garment name"
                            className="flex-1 px-2.5 py-1.5 text-xs font-medium border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        {/* Row remove button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.key)}
                          disabled={rows.length <= 1}
                          className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                          title="Remove row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {/* Category */}
                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                            Category
                          </label>
                          <select
                            value={row.category}
                            onChange={(e) => handleRowChange(row.key, 'category', e.target.value as GarmentCategory)}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white"
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Material */}
                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                            Material
                          </label>
                          <select
                            value={row.material}
                            onChange={(e) => handleRowChange(row.key, 'material', e.target.value as GarmentMaterial)}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white"
                          >
                            {MATERIALS.map((mat) => (
                              <option key={mat} value={mat}>
                                {mat}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Condition Checkbox (75% savings) */}
                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                            Condition
                          </label>
                          <label className={`flex items-center gap-1.5 px-2 py-1 border rounded-md cursor-pointer transition-colors ${
                            row.is_secondhand ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold' : 'bg-white border-slate-300 text-slate-700'
                          }`}>
                            <input
                              type="checkbox"
                              checked={row.is_secondhand}
                              onChange={(e) => handleRowChange(row.key, 'is_secondhand', e.target.checked)}
                              className="rounded-xs text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="truncate">
                              {row.is_secondhand ? 'Second-Hand (-75%)' : 'Brand New'}
                            </span>
                          </label>
                        </div>

                        {/* Initial Wears */}
                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                            Times Worn
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={row.wears}
                            onChange={(e) => handleRowChange(row.key, 'wears', Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white font-mono tabular-nums"
                          />
                        </div>
                      </div>

                      {/* Calculated Row Impact Badges */}
                      <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-200/60">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-slate-700">
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            <strong className="font-mono tabular-nums">{rowImpact.footprint_kg.toFixed(2)}</strong> kg CO2e
                          </span>
                          <span className="flex items-center gap-1 text-slate-700">
                            <Droplets className="w-3.5 h-3.5 text-sky-500" />
                            <strong className="font-mono tabular-nums">{rowImpact.water_liters.toLocaleString()}</strong> L water
                          </span>
                        </div>

                        {row.is_secondhand && (
                          <span className="text-[11px] text-emerald-700 font-medium">
                            Avoided: +{(rowImpact.virgin_carbon_kg * 0.75).toFixed(1)} kg CO2e · +{Math.round(rowImpact.virgin_water_liters * 0.75).toLocaleString()} L
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Row Button */}
              <button
                type="button"
                onClick={handleAddRow}
                className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Garment Row</span>
              </button>

              {/* Batch Summary Strip */}
              <div className="p-3.5 bg-slate-900 text-white rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Batch Total ({rows.length} items):</span>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="font-mono font-bold text-white tabular-nums">
                      {batchStats.totalCarbon.toFixed(1)} kg CO2e
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono font-bold text-sky-300 tabular-nums">
                      {batchStats.totalWater.toLocaleString()} Liters water
                    </span>
                  </div>
                </div>

                {batchStats.avoidedCarbon > 0 && (
                  <div className="text-emerald-400 text-right">
                    <div>Secondhand savings:</div>
                    <span className="font-mono font-bold tabular-nums">
                      +{batchStats.avoidedCarbon.toFixed(1)} kg CO2e · +{batchStats.avoidedWater.toLocaleString()} L saved
                    </span>
                  </div>
                )}
              </div>

              {/* Form submit */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Add All {rows.length} Items</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PRESET BUNDLES */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Quickly populate your wardrobe with researched garment collections with scientific carbon and water figures pre-calculated.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MULTI_ITEM_PRESETS.map((preset) => {
                  const presetCarbon = preset.items.reduce((s, i) => s + i.footprint_kg, 0);
                  const presetWater = preset.items.reduce((s, i) => s + i.water_liters, 0);

                  return (
                    <div
                      key={preset.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-900">{preset.title}</h3>
                          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{preset.description}</p>

                        {/* Items preview list */}
                        <div className="mt-3 space-y-1.5 border-t border-slate-200/80 pt-2 text-xs text-slate-700">
                          {preset.items.map((it, i) => (
                            <div key={i} className="flex items-center justify-between text-[11px]">
                              <span className="truncate pr-2">
                                • {it.name} {it.is_secondhand ? '(Secondhand)' : '(New)'}
                              </span>
                              <span className="font-mono text-slate-500 tabular-nums shrink-0">
                                {it.footprint_kg} kg / {it.water_liters} L
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <div className="text-xs font-mono">
                          <span className="font-bold text-slate-900 tabular-nums">{presetCarbon.toFixed(1)} kg</span> CO2e · <span className="text-slate-600 tabular-nums">{presetWater.toLocaleString()} L</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Pack ({preset.items.length})</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: QUANTITY GENERATOR */}
          {activeTab === 'quantity-generator' && (
            <form onSubmit={handleSubmitGenerator} className="space-y-4 max-w-lg mx-auto">
              <p className="text-xs text-slate-600">
                Quickly add multiples of the same garment type (e.g. 5 identical second-hand crewnecks or 3 pairs of denim jeans) at once.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Garment Label / Prefix
                </label>
                <input
                  type="text"
                  value={genBaseName}
                  onChange={(e) => setGenBaseName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Vintage Cotton Graphic Tee"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={genCategory}
                    onChange={(e) => setGenCategory(e.target.value as GarmentCategory)}
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
                    value={genMaterial}
                    onChange={(e) => setGenMaterial(e.target.value as GarmentMaterial)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {MATERIALS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Items (Quantity)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={genCount}
                    onChange={(e) => setGenCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Wears per Item
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={genWears}
                    onChange={(e) => setGenWears(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono tabular-nums"
                  />
                </div>
              </div>

              {/* Secondhand condition */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900">Second-Hand / Pre-Loved</div>
                  <div className="text-[11px] text-emerald-700">Applies 75% carbon &amp; water reduction</div>
                </div>
                <input
                  type="checkbox"
                  checked={genSecondhand}
                  onChange={(e) => setGenSecondhand(e.target.checked)}
                  className="w-4 h-4 rounded-xs text-emerald-600 focus:ring-emerald-500"
                />
              </div>

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
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Generate &amp; Add {genCount} Items</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
