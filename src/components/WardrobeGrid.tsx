import React, { useState, useMemo } from 'react';
import { WardrobeItem, GarmentCategory } from '../types/wardrobe';
import { ASSUMPTIONS, calculateHazardRating, getDefaultSeason } from '../data/sustainabilityData';
import { 
  Plus, 
  Search, 
  Filter, 
  RotateCcw, 
  Flame, 
  Droplets, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Layers, 
  CheckSquare, 
  Square,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

interface WardrobeGridProps {
  items: WardrobeItem[];
  onIncrementWear: (id: string) => void;
  onEditItem: (item: WardrobeItem) => void;
  onDeleteItem: (id: string) => void;
  onBulkIncrementWear: (ids: string[]) => void;
  onBulkDelete: (ids: string[]) => void;
  onOpenSingleAdd: () => void;
  onOpenMultiAdd: () => void;
  onResetToZero: () => void;
  onResetToDemo: () => void;
}

type SortField = 'carbon' | 'water' | 'wears' | 'carbon_per_wear' | 'date';
type SortOrder = 'desc' | 'asc';

export const WardrobeGrid: React.FC<WardrobeGridProps> = ({
  items,
  onIncrementWear,
  onEditItem,
  onDeleteItem,
  onBulkIncrementWear,
  onBulkDelete,
  onOpenSingleAdd,
  onOpenMultiAdd,
  onResetToZero,
  onResetToDemo,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<'all' | 'secondhand' | 'new'>('all');
  const [wearFilter, setWearFilter] = useState<'all' | 'under30' | 'reached30' | 'hero50'>('all');
  const [sortField, setSortField] = useState<SortField>('carbon');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Search
        if (searchTerm.trim() && !item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())) {
          return false;
        }
        // Category
        if (categoryFilter !== 'all' && item.category !== categoryFilter) {
          return false;
        }
        // Condition
        if (conditionFilter === 'secondhand' && !item.is_secondhand) return false;
        if (conditionFilter === 'new' && item.is_secondhand) return false;
        // Wears
        if (wearFilter === 'under30' && item.wears >= ASSUMPTIONS.BASELINE_WEARS) return false;
        if (wearFilter === 'reached30' && item.wears < ASSUMPTIONS.BASELINE_WEARS) return false;
        if (wearFilter === 'hero50' && item.wears < 50) return false;

        return true;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;

        switch (sortField) {
          case 'carbon':
            valA = a.footprint_kg;
            valB = b.footprint_kg;
            break;
          case 'water':
            valA = a.water_liters;
            valB = b.water_liters;
            break;
          case 'wears':
            valA = a.wears;
            valB = b.wears;
            break;
          case 'carbon_per_wear':
            valA = a.footprint_kg / Math.max(1, a.wears);
            valB = b.footprint_kg / Math.max(1, b.wears);
            break;
          case 'date':
            valA = new Date(a.date_added || 0).getTime();
            valB = new Date(b.date_added || 0).getTime();
            break;
        }

        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [items, searchTerm, categoryFilter, conditionFilter, wearFilter, sortField, sortOrder]);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return Array.from(set).sort();
  }, [items]);

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  };

  const handleBulkWear = () => {
    if (selectedIds.length === 0) return;
    onBulkIncrementWear(selectedIds);
  };

  const handleBulkRemove = () => {
    if (selectedIds.length === 0) return;
    onBulkDelete(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      {/* Search, Filter & Sort Controls */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search garments by name (e.g. Denim jacket, Wool sweater)..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* Quick Segmented Controls: Condition */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setConditionFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                conditionFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setConditionFilter('secondhand')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                conditionFilter === 'secondhand'
                  ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <RotateCcw className="w-3 h-3 text-emerald-600" />
              <span>Secondhand (-75%)</span>
            </button>
            <button
              onClick={() => setConditionFilter('new')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                conditionFilter === 'new'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Brand New
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Data Grid Table"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Second row filters: Category, Wear status, Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category select */}
            <div className="flex items-center gap-1 text-slate-500">
              <span className="font-medium text-slate-700">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-white text-slate-700"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Wear Filter */}
            <div className="flex items-center gap-1 text-slate-500">
              <span className="font-medium text-slate-700">Durability:</span>
              <select
                value={wearFilter}
                onChange={(e) => setWearFilter(e.target.value as any)}
                className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-white text-slate-700"
              >
                <option value="all">All Wear Counts</option>
                <option value="under30">&lt;30 wears (Underutilised)</option>
                <option value="reached30">30+ wears (Goal Met)</option>
                <option value="hero50">50+ wears (Longevity Champion)</option>
              </select>
            </div>
          </div>

          {/* Sort Dropdown & Reset to Zero */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Sort By:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-white text-slate-700 font-medium"
            >
              <option value="carbon">Carbon Footprint (kg CO2e)</option>
              <option value="water">Water Footprint (Liters)</option>
              <option value="wears">Times Worn (Wears)</option>
              <option value="carbon_per_wear">Carbon / Wear (Efficiency)</option>
              <option value="date">Date Added</option>
            </select>

            <button
              onClick={() => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
              className="p-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600"
              title={sortOrder === 'desc' ? 'Descending' : 'Ascending'}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

            <button
              onClick={onResetToZero}
              disabled={items.length === 0}
              className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              title="Reset all wardrobe data to zero items"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset to Zero</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Batch Selection Toolbar (when items selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white rounded-xl px-4 py-3 shadow-lg flex items-center justify-between gap-3 animate-fade-in text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <CheckSquare className="w-4 h-4" />
              <span>
                {selectedIds.length === filteredItems.length ? 'Deselect All' : `Selected (${selectedIds.length})`}
              </span>
            </button>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300">
              Bulk actions for {selectedIds.length} garments
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkWear}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Log Outfit (+1 Wear to {selectedIds.length})</span>
            </button>
            <button
              onClick={handleBulkRemove}
              className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-900 text-rose-200 font-semibold rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200/90 shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">No garments found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchTerm || categoryFilter !== 'all' || conditionFilter !== 'all' || wearFilter !== 'all'
                ? 'Try clearing your search filters to view your wardrobe.'
                : 'Your wardrobe is currently empty. Add individual items or batch add multiple pieces at once!'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenSingleAdd}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Garment</span>
            </button>
            <button
              onClick={onOpenMultiAdd}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Add Multiple Items</span>
            </button>
            {items.length === 0 && (
              <button
                onClick={onResetToDemo}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load Benchmark Demo Items</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* CARDS VIEW */}
      {viewMode === 'cards' && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const carbonPerWear = (item.footprint_kg / Math.max(1, item.wears)).toFixed(2);
            const waterPerWear = Math.round(item.water_liters / Math.max(1, item.wears));
            const reachedBaseline = item.wears >= ASSUMPTIONS.BASELINE_WEARS;
            const season = item.season || getDefaultSeason(item.category, item.material);
            const hazard = calculateHazardRating(item);

            let hazardBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
            let hazardBarColor = 'bg-emerald-500';

            if (hazard.level === 'Little Hazardous') {
              hazardBadge = 'bg-amber-100 text-amber-900 border-amber-200';
              hazardBarColor = 'bg-amber-500';
            } else if (hazard.level === 'Dangerous') {
              hazardBadge = 'bg-rose-100 text-rose-900 border-rose-200';
              hazardBarColor = 'bg-rose-600';
            }

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-4 border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div>
                  {/* Top card row: Select & Condition & Season */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSelect(item.id)}
                        className="text-slate-400 hover:text-slate-700"
                        title={isSelected ? 'Deselect' : 'Select'}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>

                      {/* Clean unboxed metadata separator */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span>{item.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.material}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                        {season}
                      </span>
                      {item.is_secondhand ? (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <RotateCcw className="w-2.5 h-2.5 text-emerald-600" />
                          <span>-75%</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Garment Title & Hazard Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
                      {item.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 flex items-center gap-1 ${hazardBadge}`}>
                      {hazard.level === 'Normal' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                      {hazard.level === 'Little Hazardous' && <AlertCircle className="w-3 h-3 text-amber-600" />}
                      {hazard.level === 'Dangerous' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                      <span>{hazard.level}</span>
                    </span>
                  </div>

                  {/* Impact metrics: CO2 Footprint & Water Used */}
                  <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Flame className="w-3 h-3 text-amber-500" />
                        <span>Carbon Footprint</span>
                      </div>
                      <div className="mt-0.5 font-mono font-bold text-slate-900 text-sm tabular-nums">
                        {item.footprint_kg.toFixed(2)}{' '}
                        <span className="text-[11px] font-normal text-slate-500">kg CO2e</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Droplets className="w-3 h-3 text-sky-500" />
                        <span>Water Used</span>
                      </div>
                      <div className="mt-0.5 font-mono font-bold text-slate-900 text-sm tabular-nums">
                        {item.water_liters.toLocaleString()}{' '}
                        <span className="text-[11px] font-normal text-slate-500">L</span>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Hazard Bar Graph (Normal / Little Hazardous / Dangerous) */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Environmental Hazard Spectrum:</span>
                      <span className="font-mono font-bold text-slate-700 tabular-nums">
                        {hazard.score}%
                      </span>
                    </div>

                    <div className="relative w-full h-2 rounded-full overflow-hidden bg-slate-100 flex shadow-inner">
                      {/* 3 Zones */}
                      <div className="h-full bg-emerald-200/80" style={{ width: '35%' }} title="Normal (0-35%)" />
                      <div className="h-full bg-amber-200/80" style={{ width: '33%' }} title="Little Hazardous (36-68%)" />
                      <div className="h-full bg-rose-200/80" style={{ width: '32%' }} title="Dangerous (69-100%)" />
                      {/* Pinned Marker */}
                      <div
                        className={`absolute top-0 bottom-0 w-1.5 ${hazardBarColor} ring-1 ring-white shadow-xs -translate-x-1/2`}
                        style={{ left: `${hazard.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Longevity & Wear Progress */}
                  <div className="mt-2.5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Times worn:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-slate-900 tabular-nums">
                          {item.wears}
                        </span>
                        <span className="text-slate-400">/ 30 baseline target</span>
                      </div>
                    </div>

                    {/* Progress bar towards the 30-wear Ellen MacArthur target */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          reachedBaseline ? 'bg-emerald-500' : 'bg-amber-400'
                        }`}
                        style={{ width: `${Math.min(100, (item.wears / ASSUMPTIONS.BASELINE_WEARS) * 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>Carbon per wear:</span>
                      <span className="font-mono tabular-nums text-slate-700 font-semibold">
                        {carbonPerWear} kg · {waterPerWear} L
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditItem(item)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                      title="Edit garment"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-colors"
                      title="Delete garment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onIncrementWear(item.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                    title="Log that you wore this today"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Log Wear</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DATA GRID TABLE VIEW */}
      {viewMode === 'table' && filteredItems.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-3 w-8">
                    <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-700">
                      {selectedIds.length === filteredItems.length ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">Garment Name</th>
                  <th className="py-3 px-3">Season</th>
                  <th className="py-3 px-3">Category &amp; Fiber</th>
                  <th className="py-3 px-3">Condition</th>
                  <th className="py-3 px-3">Hazard Level</th>
                  <th className="py-3 px-3 text-right">CO2 Footprint</th>
                  <th className="py-3 px-3 text-right">Water Used</th>
                  <th className="py-3 px-3 text-center">Wears</th>
                  <th className="py-3 px-3 text-right">Carbon / Wear</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const carbonPerWear = (item.footprint_kg / Math.max(1, item.wears)).toFixed(2);
                  const reachedBaseline = item.wears >= ASSUMPTIONS.BASELINE_WEARS;
                  const season = item.season || getDefaultSeason(item.category, item.material);
                  const hazard = calculateHazardRating(item);

                  let hazardBadge = 'bg-emerald-100 text-emerald-800';
                  if (hazard.level === 'Little Hazardous') hazardBadge = 'bg-amber-100 text-amber-900';
                  if (hazard.level === 'Dangerous') hazardBadge = 'bg-rose-100 text-rose-900';

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleSelect(item.id)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {item.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {season}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        <span>{item.category}</span> · <span>{item.material}</span>
                      </td>
                      <td className="py-3 px-3">
                        {item.is_secondhand ? (
                          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                            <RotateCcw className="w-3 h-3 text-emerald-600" />
                            <span>Secondhand (-75%)</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Brand New
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] inline-flex items-center gap-1 ${hazardBadge}`}>
                          {hazard.level === 'Normal' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                          {hazard.level === 'Little Hazardous' && <AlertCircle className="w-3 h-3 text-amber-600" />}
                          {hazard.level === 'Dangerous' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                          <span>{hazard.level}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {item.footprint_kg.toFixed(2)} kg
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-900 tabular-nums">
                        {item.water_liters.toLocaleString()} L
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-md tabular-nums ${
                            reachedBaseline
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {item.wears}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                        {carbonPerWear} kg / wear
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onIncrementWear(item.id)}
                            className="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                            title="Log +1 wear"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => onEditItem(item)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
