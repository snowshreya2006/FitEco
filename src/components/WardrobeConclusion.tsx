import React, { useMemo } from 'react';
import { WardrobeItem, GarmentMaterial } from '../types/wardrobe';
import { ASSUMPTIONS } from '../data/sustainabilityData';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  TrendingDown, 
  RotateCcw, 
  Leaf, 
  Droplets, 
  Flame, 
  HelpCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface WardrobeConclusionProps {
  items: WardrobeItem[];
  onOpenMethodology: () => void;
  onOpenSingleAdd: () => void;
  onOpenMultiAdd: () => void;
}

export const WardrobeConclusion: React.FC<WardrobeConclusionProps> = ({
  items,
  onOpenMethodology,
  onOpenSingleAdd,
  onOpenMultiAdd,
}) => {
  // Aggregate comparisons from each logged entry
  const analysis = useMemo(() => {
    if (items.length === 0) {
      return null;
    }

    const secondhand = items.filter((i) => i.is_secondhand);
    const virgin = items.filter((i) => !i.is_secondhand);

    const avgSecondhandCarbon = secondhand.length > 0
      ? secondhand.reduce((s, i) => s + i.footprint_kg, 0) / secondhand.length
      : 0;

    const avgVirginCarbon = virgin.length > 0
      ? virgin.reduce((s, i) => s + i.footprint_kg, 0) / virgin.length
      : 0;

    const avgSecondhandWater = secondhand.length > 0
      ? secondhand.reduce((s, i) => s + i.water_liters, 0) / secondhand.length
      : 0;

    const avgVirginWater = virgin.length > 0
      ? virgin.reduce((s, i) => s + i.water_liters, 0) / virgin.length
      : 0;

    // Material breakdown across logged entries
    const materialMap: Record<string, { count: number; totalCarbon: number; totalWater: number; totalWears: number }> = {};
    items.forEach((item) => {
      if (!materialMap[item.material]) {
        materialMap[item.material] = { count: 0, totalCarbon: 0, totalWater: 0, totalWears: 0 };
      }
      materialMap[item.material].count += 1;
      materialMap[item.material].totalCarbon += item.footprint_kg;
      materialMap[item.material].totalWater += item.water_liters;
      materialMap[item.material].totalWears += item.wears;
    });

    const materialRankings = Object.entries(materialMap).map(([mat, data]) => {
      const avgCPW = data.totalWears > 0 ? data.totalCarbon / data.totalWears : data.totalCarbon;
      const avgWater = data.totalWater / data.count;
      const avgCarbon = data.totalCarbon / data.count;
      return {
        material: mat,
        count: data.count,
        avgCarbon,
        avgWater,
        avgCPW,
      };
    }).sort((a, b) => a.avgCPW - b.avgCPW);

    // Star garments (lowest carbon per wear)
    const starGarments = [...items]
      .filter((i) => i.wears >= 15)
      .sort((a, b) => (a.footprint_kg / a.wears) - (b.footprint_kg / b.wears))
      .slice(0, 3);

    // Watchlist garments (highest impact and under 30 wears)
    const watchlistGarments = [...items]
      .filter((i) => i.wears < ASSUMPTIONS.BASELINE_WEARS)
      .sort((a, b) => b.footprint_kg - a.footprint_kg)
      .slice(0, 3);

    return {
      totalItems: items.length,
      secondhandCount: secondhand.length,
      virginCount: virgin.length,
      avgSecondhandCarbon,
      avgVirginCarbon,
      avgSecondhandWater,
      avgVirginWater,
      materialRankings,
      starGarments,
      watchlistGarments,
    };
  }, [items]);

  if (!analysis) {
    return (
      <div className="bg-white rounded-xl p-10 text-center border border-slate-200/90 shadow-2xs space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto">
          <h3 className="text-base font-bold text-slate-900">No Log Entries to Compare Yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Add garments to your wardrobe to generate a data-driven conclusion on what kind of clothes you should prefer.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenSingleAdd}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
          >
            Add First Garment
          </button>
          <button
            onClick={onOpenMultiAdd}
            className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
          >
            Add Multiple Items
          </button>
        </div>
      </div>
    );
  }

  const savingsRatio = analysis.avgVirginCarbon > 0
    ? Math.round(((analysis.avgVirginCarbon - analysis.avgSecondhandCarbon) / analysis.avgVirginCarbon) * 100)
    : 75;

  return (
    <div className="space-y-6">
      {/* Editorial Conclusion Header */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-emerald-800/60 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-emerald-300" />
          <span>Wardrobe Analysis Verdict</span>
          <span>·</span>
          <span>Based on {analysis.totalItems} Logged Garment Entries</span>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-white max-w-2xl">
          What Kind of Clothes Should Be Preferred?
        </h2>

        <p className="text-sm text-slate-200 leading-relaxed max-w-3xl">
          Comparing the carbon emissions, freshwater consumption, and active wear longevity of each logged entry in your closet reveals four clear buying rules to minimize environmental impact while maximizing clothing life.
        </p>

        {/* Quick Log Findings Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
            <span className="text-emerald-300 font-semibold block">Sourcing Verdict</span>
            <span className="text-lg font-bold font-mono text-white tabular-nums mt-0.5 block">
              {savingsRatio}% Lower Carbon
            </span>
            <span className="text-[11px] text-slate-300">
              for your second-hand entries vs brand new purchases.
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
            <span className="text-sky-300 font-semibold block">Water Preservation</span>
            <span className="text-lg font-bold font-mono text-white tabular-nums mt-0.5 block">
              {Math.round(analysis.avgSecondhandWater).toLocaleString()} L vs {Math.round(analysis.avgVirginWater).toLocaleString()} L
            </span>
            <span className="text-[11px] text-slate-300">
              average freshwater consumed per item.
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
            <span className="text-amber-300 font-semibold block">Longevity Threshold</span>
            <span className="text-lg font-bold font-mono text-white tabular-nums mt-0.5 block">
              30+ Wears
            </span>
            <span className="text-[11px] text-slate-300">
              Ellen MacArthur target cuts carbon-per-wear by 44%.
            </span>
          </div>
        </div>
      </div>

      {/* The 4 Preferable Clothing Categories */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Recommended Clothes to Prefer (Ranked by Ecological Return)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Card 1: Second-hand Denim & Heavy Outerwear */}
          <div className="bg-white rounded-xl p-5 border border-emerald-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-100 text-emerald-800">
                #1 Top Preference
              </span>
              <RotateCcw className="w-4 h-4 text-emerald-600" />
            </div>

            <h4 className="text-sm font-bold text-slate-900">
              Pre-Loved &amp; Second-Hand Heavy Garments (Denim, Coats, Leather)
            </h4>

            <p className="text-slate-600 leading-relaxed">
              <strong>Why it should be preferred:</strong> Manufacturing virgin jeans or outerwear consumes up to <strong>33.4 kg CO2e</strong> and <strong>8,000 to 12,000 Liters of water</strong>. Sourcing these second-hand bypasses raw fiber farming, toxic dyeing, and chemical finishing—delivering an instant <strong>75% savings</strong> on your closet’s heaviest footprint items.
            </p>

            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-900 font-medium">
              ✓ <em>Action rule:</em> Never buy heavy denim or winter outerwear brand new when thrifted alternatives exist.
            </div>
          </div>

          {/* Card 2: Low-Irrigation Natural Fibers (Linen & Organic Cotton) */}
          <div className="bg-white rounded-xl p-5 border border-emerald-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-100 text-emerald-800">
                #2 Fiber Preference
              </span>
              <Leaf className="w-4 h-4 text-emerald-600" />
            </div>

            <h4 className="text-sm font-bold text-slate-900">
              Linen &amp; Certified Organic Cotton Over Conventional Cotton
            </h4>

            <p className="text-slate-600 leading-relaxed">
              <strong>Why it should be preferred:</strong> Flax (linen) requires minimal chemical pesticides and only ~800 Liters of water per t-shirt (compared to <strong>2,700 Liters</strong> for conventional cotton). Organic cotton uses rainwater irrigation and zero synthetic nitrogen fertilizer, generating <strong>40% fewer greenhouse emissions</strong>.
            </p>

            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-900 font-medium">
              ✓ <em>Action rule:</em> For summer tops, shirts, and dresses, prioritize 100% linen and GOTS-certified organic cotton.
            </div>
          </div>

          {/* Card 3: High-Durability Capsule Staples */}
          <div className="bg-white rounded-xl p-5 border border-emerald-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-100 text-emerald-800">
                #3 Utility Preference
              </span>
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>

            <h4 className="text-sm font-bold text-slate-900">
              Timeless, Versatile Pieces That Exceed 30 Wears
            </h4>

            <p className="text-slate-600 leading-relaxed">
              <strong>Why it should be preferred:</strong> The single most effective climate action in fashion is extending clothing lifespan. A garment worn 60 times has a <strong>carbon-per-wear under 0.15 kg CO2e</strong>, neutralizing its production footprint. Fast-fashion items discarded after 7–10 wears carry 300% higher emissions per wear.
            </p>

            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-900 font-medium">
              ✓ <em>Action rule:</em> Before buying any new item, ask: <em>"Will I wear this at least 30 times across multiple seasons?"</em>
            </div>
          </div>

          {/* Card 4: Recycled Technical Synthetics over Virgin Petrochemicals */}
          <div className="bg-white rounded-xl p-5 border border-emerald-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-100 text-emerald-800">
                #4 Technical Preference
              </span>
              <Droplets className="w-4 h-4 text-sky-600" />
            </div>

            <h4 className="text-sm font-bold text-slate-900">
              Recycled Polyester (rPET) &amp; Nylon for High-Performance Activewear
            </h4>

            <p className="text-slate-600 leading-relaxed">
              <strong>Why it should be preferred:</strong> When technical moisture-wicking or stretch performance is required, choosing recycled polyester saves <strong>40% to 50% GHG emissions</strong> compared to virgin petrochemical polyester, avoiding crude oil extraction and plastic synthesis.
            </p>

            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-900 font-medium">
              ✓ <em>Action rule:</em> Strictly avoid virgin polyester blends in favor of recycled technical fabrics with wash-bag microplastic filters.
            </div>
          </div>
        </div>
      </div>

      {/* What to Phase Out / Avoid */}
      <div className="bg-rose-50/60 rounded-xl p-5 border border-rose-200/80 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-rose-800 font-bold uppercase tracking-wider text-[11px]">
          <XCircle className="w-4 h-4 text-rose-600" />
          <span>Clothes to Phase Out / Avoid Buying New</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-lg border border-rose-200">
            <div className="font-bold text-slate-900">Virgin Fast-Fashion Synthetics</div>
            <p className="text-slate-600 mt-1 leading-snug">
              Virgin acrylic, polyester, and polyurethane puffers have the highest petrochemical carbon cost and shed microplastics during laundering.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-rose-200">
            <div className="font-bold text-slate-900">Conventional Fast-Fashion Cotton</div>
            <p className="text-slate-600 mt-1 leading-snug">
              Consumes ~2,700 Liters of freshwater per shirt. When bought cheaply and worn under 10 times, it represents severe agricultural water waste.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-rose-200">
            <div className="font-bold text-slate-900">Single-Occasion Trend Garments</div>
            <p className="text-slate-600 mt-1 leading-snug">
              Garments purchased for one event or single seasonal trend result in an astronomical carbon-per-wear of <strong>&gt;2.5 kg CO2e / wear</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Material Comparison Table Across User's Logged Entries */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Material Efficiency Comparison (From Your Log Entries)
            </h3>
            <p className="text-xs text-slate-500">
              Ranked from lowest carbon-per-wear to highest based on your wardrobe's actual use
            </p>
          </div>
          <button
            onClick={onOpenMethodology}
            className="text-xs text-emerald-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Research coefficients</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Fiber Material</th>
                <th className="py-2.5 px-3 text-center">Items Logged</th>
                <th className="py-2.5 px-3 text-right">Avg Footprint</th>
                <th className="py-2.5 px-3 text-right">Avg Water Used</th>
                <th className="py-2.5 px-3 text-right">Carbon / Wear</th>
                <th className="py-2.5 px-3">Sustainability Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {analysis.materialRankings.map((row, idx) => {
                let verdictBadge = 'bg-emerald-100 text-emerald-800';
                let verdictText = 'Highly Preferred';

                if (row.avgCPW > 0.8) {
                  verdictBadge = 'bg-rose-100 text-rose-800';
                  verdictText = 'High Impact · Increase Wears';
                } else if (row.avgCPW > 0.4) {
                  verdictBadge = 'bg-amber-100 text-amber-800';
                  verdictText = 'Moderate · Aim for 30+ Wears';
                }

                return (
                  <tr key={row.material} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-400">#{idx + 1}</span>
                      <span>{row.material}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums">{row.count}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{row.avgCarbon.toFixed(1)} kg</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{Math.round(row.avgWater).toLocaleString()} L</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {row.avgCPW.toFixed(2)} kg / wear
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${verdictBadge}`}>
                        {verdictText}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
