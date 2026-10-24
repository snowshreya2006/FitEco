import React, { useState, useMemo } from 'react';
import { WardrobeItem, GarmentSeason, HazardLevel } from '../types/wardrobe';
import { calculateHazardRating, getDefaultSeason } from '../data/sustainabilityData';
import { 
  BarChart3, 
  Sun, 
  Snowflake, 
  CloudSun, 
  Flower2, 
  RotateCw, 
  AlertTriangle, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Plus
} from 'lucide-react';

interface SeasonalHazardBarGraphProps {
  items: WardrobeItem[];
  onOpenMethodology: () => void;
  onIncrementWear: (id: string) => void;
}

const SEASONS: { key: 'all' | GarmentSeason; label: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'all', label: 'All Seasons', icon: BarChart3 },
  { key: 'Spring', label: 'Spring', icon: Flower2 },
  { key: 'Summer', label: 'Summer', icon: Sun },
  { key: 'Autumn', label: 'Autumn', icon: CloudSun },
  { key: 'Winter', label: 'Winter', icon: Snowflake },
  { key: 'All-Season', label: 'Year-Round', icon: RotateCw },
];

export const SeasonalHazardBarGraph: React.FC<SeasonalHazardBarGraphProps> = ({
  items,
  onOpenMethodology,
  onIncrementWear,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<'all' | GarmentSeason>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | HazardLevel>('all');
  const [sortBy, setSortBy] = useState<'hazard-desc' | 'hazard-asc' | 'carbon' | 'water'>('hazard-desc');

  // Evaluate hazard for every item
  const evaluatedItems = useMemo(() => {
    return items.map((item) => {
      const season = item.season || getDefaultSeason(item.category, item.material);
      const hazard = calculateHazardRating(item);
      return {
        ...item,
        season,
        hazard,
      };
    });
  }, [items]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return evaluatedItems
      .filter((item) => {
        if (selectedSeason !== 'all' && item.season !== selectedSeason) {
          return false;
        }
        if (levelFilter !== 'all' && item.hazard.level !== levelFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'hazard-desc') return b.hazard.score - a.hazard.score;
        if (sortBy === 'hazard-asc') return a.hazard.score - b.hazard.score;
        if (sortBy === 'carbon') return b.footprint_kg - a.footprint_kg;
        if (sortBy === 'water') return b.water_liters - a.water_liters;
        return 0;
      });
  }, [evaluatedItems, selectedSeason, levelFilter, sortBy]);

  // Counts across the currently selected season
  const seasonItems = useMemo(() => {
    return evaluatedItems.filter((i) => selectedSeason === 'all' || i.season === selectedSeason);
  }, [evaluatedItems, selectedSeason]);

  const normalCount = seasonItems.filter((i) => i.hazard.level === 'Normal').length;
  const littleHazardousCount = seasonItems.filter((i) => i.hazard.level === 'Little Hazardous').length;
  const dangerousCount = seasonItems.filter((i) => i.hazard.level === 'Dangerous').length;

  const getSeasonIcon = (season: GarmentSeason) => {
    switch (season) {
      case 'Summer':
        return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'Winter':
        return <Snowflake className="w-3.5 h-3.5 text-sky-500" />;
      case 'Autumn':
        return <CloudSun className="w-3.5 h-3.5 text-orange-500" />;
      case 'Spring':
        return <Flower2 className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <RotateCw className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Explanatory Kicker */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <span>Automatic Lifecycle Assessment</span>
              <span>·</span>
              <span>WRAP &amp; Higg MSI Benchmarked</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Seasonal Environmental Hazard Index
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Every garment worn in each season is evaluated on a horizontal hazard spectrum with three distinct readings: 
              <strong className="text-emerald-700"> Normal</strong> (low resource footprint), 
              <strong className="text-amber-700"> Little Hazardous</strong> (moderate burden), and 
              <strong className="text-rose-700"> Dangerous</strong> (severe carbon emissions &amp; high water depletion).
            </p>
          </div>

          <button
            onClick={onOpenMethodology}
            className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hazard Methodology</span>
          </button>
        </div>

        {/* Legend of 3 Readings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-emerald-900">0% – 35% · Normal (Sustainable)</div>
              <p className="text-emerald-800 text-[11px] mt-0.5 leading-snug">
                Secondhand garments, low-irrigation fibers (linen, organic cotton), or pieces worn 30+ times.
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-amber-900">36% – 68% · Little Hazardous (Moderate)</div>
              <p className="text-amber-800 text-[11px] mt-0.5 leading-snug">
                Standard retail items with moderate water/carbon footprint needing regular active rotation.
              </p>
            </div>
          </div>

          <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-rose-900">69% – 100% · Dangerous (High Climate Burden)</div>
              <p className="text-rose-800 text-[11px] mt-0.5 leading-snug">
                High-intensity virgin production (e.g. heavy denim &gt;8,000L water, virgin leather, synthetics) with &lt;30 wears.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
            Filter Clothes by Season Worn
          </span>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {SEASONS.map((season) => {
              const Icon = season.icon;
              const isActive = selectedSeason === season.key;
              const count = season.key === 'all'
                ? evaluatedItems.length
                : evaluatedItems.filter((i) => i.season === season.key).length;

              return (
                <button
                  key={season.key}
                  onClick={() => setSelectedSeason(season.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{season.label}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-mono tabular-nums">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reading Counts Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Hazard Tier:</span>
            <button
              onClick={() => setLevelFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                levelFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({seasonItems.length})
            </button>
            <button
              onClick={() => setLevelFilter('Normal')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                levelFilter === 'Normal' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Normal ({normalCount})</span>
            </button>
            <button
              onClick={() => setLevelFilter('Little Hazardous')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                levelFilter === 'Little Hazardous' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              <span>Little Hazardous ({littleHazardousCount})</span>
            </button>
            <button
              onClick={() => setLevelFilter('Dangerous')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                levelFilter === 'Dangerous' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Dangerous ({dangerousCount})</span>
            </button>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-white text-slate-700"
            >
              <option value="hazard-desc">Hazard Score (Highest First)</option>
              <option value="hazard-asc">Hazard Score (Lowest First)</option>
              <option value="carbon">Carbon Footprint (kg CO2e)</option>
              <option value="water">Water Used (Liters)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Horizontal Bar Graph List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center border border-slate-200 text-slate-500 text-xs">
          No clothes match the selected season or hazard filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const { hazard, season } = item;
            const score = hazard.score;

            // Pin marker color
            let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
            let barFill = 'bg-emerald-500';
            let pinColor = 'bg-emerald-600 ring-emerald-300';

            if (hazard.level === 'Little Hazardous') {
              badgeBg = 'bg-amber-100 text-amber-900 border-amber-300';
              barFill = 'bg-amber-500';
              pinColor = 'bg-amber-600 ring-amber-300';
            } else if (hazard.level === 'Dangerous') {
              badgeBg = 'bg-rose-100 text-rose-900 border-rose-300';
              barFill = 'bg-rose-600';
              pinColor = 'bg-rose-600 ring-rose-300';
            }

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-3"
              >
                {/* Top Info Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {getSeasonIcon(season)}
                      <span>{season}</span>
                    </span>

                    <h3 className="text-sm font-bold text-slate-900">
                      {item.name}
                    </h3>

                    {item.is_secondhand && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-xs">
                        Secondhand (-75%)
                      </span>
                    )}
                  </div>

                  {/* Hazard Level Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-700 tabular-nums">
                      Index: {score}/100
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border flex items-center gap-1 ${badgeBg}`}>
                      {hazard.level === 'Normal' && <ShieldCheck className="w-3.5 h-3.5" />}
                      {hazard.level === 'Little Hazardous' && <AlertCircle className="w-3.5 h-3.5" />}
                      {hazard.level === 'Dangerous' && <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>{hazard.level}</span>
                    </span>
                  </div>
                </div>

                {/* HORIZONTAL BAR GRAPH */}
                <div className="space-y-1.5">
                  {/* The Spectrum Bar Container */}
                  <div className="relative w-full h-5 rounded-lg overflow-hidden bg-slate-100 flex shadow-inner border border-slate-200">
                    {/* Zone 1: Normal (0% to 35%) */}
                    <div 
                      className="h-full bg-emerald-100/80 border-r border-emerald-200/80 relative flex items-center justify-center text-[10px] font-semibold text-emerald-800"
                      style={{ width: '35%' }}
                    >
                      <span className="truncate px-1 opacity-75">Normal (0–35%)</span>
                    </div>

                    {/* Zone 2: Little Hazardous (35% to 68%) */}
                    <div 
                      className="h-full bg-amber-100/80 border-r border-amber-200/80 relative flex items-center justify-center text-[10px] font-semibold text-amber-800"
                      style={{ width: '33%' }}
                    >
                      <span className="truncate px-1 opacity-75">Little Hazardous (36–68%)</span>
                    </div>

                    {/* Zone 3: Dangerous (68% to 100%) */}
                    <div 
                      className="h-full bg-rose-100/80 relative flex items-center justify-center text-[10px] font-semibold text-rose-800"
                      style={{ width: '32%' }}
                    >
                      <span className="truncate px-1 opacity-75">Dangerous (69–100%)</span>
                    </div>

                    {/* Dynamic Filled Bar */}
                    <div
                      className={`absolute top-0 bottom-0 left-0 ${barFill} opacity-35 transition-all duration-300`}
                      style={{ width: `${score}%` }}
                    />

                    {/* Pinned Needle Marker */}
                    <div
                      className={`absolute top-0 bottom-0 w-1.5 ${pinColor} ring-2 shadow-md transition-all duration-300 -translate-x-1/2 z-10`}
                      style={{ left: `${score}%` }}
                      title={`Hazard Score: ${score}%`}
                    />
                  </div>

                  {/* Summary Note & Values */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-1 pt-1">
                    <p className="text-[11px] text-slate-500 italic max-w-xl">
                      {hazard.summary}
                    </p>

                    <div className="flex items-center gap-3 font-mono text-[11px] shrink-0 text-slate-700">
                      <span><strong>{item.footprint_kg.toFixed(1)}</strong> kg CO2e</span>
                      <span>·</span>
                      <span><strong>{item.water_liters.toLocaleString()}</strong> L water</span>
                      <span>·</span>
                      <span><strong>{item.wears}</strong> wears</span>

                      <button
                        onClick={() => onIncrementWear(item.id)}
                        className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-sans font-semibold rounded-md border border-emerald-200 transition-colors"
                        title="Log a wear to lower this garment's hazard rating"
                      >
                        +1 Wear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
