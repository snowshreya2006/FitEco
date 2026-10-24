import React from 'react';
import { WardrobeItem } from '../types/wardrobe';
import { ASSUMPTIONS } from '../data/sustainabilityData';
import { 
  Award, 
  RotateCcw, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Trees, 
  Droplets, 
  ShieldCheck, 
  Crown,
  HeartHandshake
} from 'lucide-react';

interface RewardsSectionProps {
  items: WardrobeItem[];
}

export const RewardsSection: React.FC<RewardsSectionProps> = ({ items }) => {
  const secondhandItems = items.filter((i) => i.is_secondhand);
  const totalWears = items.reduce((s, i) => s + i.wears, 0);
  const avgWears = items.length > 0 ? totalWears / items.length : 0;
  
  // Secondhand avoided savings: footprint * 3 (because 75% was saved)
  const co2AvoidedKg = secondhandItems.reduce((s, i) => s + i.footprint_kg * 3, 0);
  const waterAvoidedL = secondhandItems.reduce((s, i) => s + i.water_liters * 3, 0);

  const baselineItemsCount = items.filter((i) => i.wears >= ASSUMPTIONS.BASELINE_WEARS).length;
  const centuryItemsCount = items.filter((i) => i.wears >= 100).length;
  const circularityPercent = items.length > 0 ? (secondhandItems.length / items.length) * 100 : 0;

  // Calculate Eco Points
  // 50 pts per secondhand item + 10 pts per 1 kg CO2 avoided + 5 pts per garment reaching 30 wears + 1 pt per wear
  const ecoPoints = Math.round(
    secondhandItems.length * 50 +
    co2AvoidedKg * 10 +
    baselineItemsCount * 40 +
    totalWears * 2
  );

  // User Eco Tier
  let tier = 'Eco Novice';
  let nextTier = 'Conscious Shopper';
  let tierProgress = Math.min(100, Math.round((ecoPoints / 300) * 100));

  if (ecoPoints >= 1200) {
    tier = 'Circular Champion';
    nextTier = 'Planet Pioneer (Max)';
    tierProgress = 100;
  } else if (ecoPoints >= 600) {
    tier = 'Longevity Master';
    nextTier = 'Circular Champion';
    tierProgress = Math.min(100, Math.round(((ecoPoints - 600) / 600) * 100));
  } else if (ecoPoints >= 300) {
    tier = 'Conscious Curator';
    nextTier = 'Longevity Master';
    tierProgress = Math.min(100, Math.round(((ecoPoints - 300) / 300) * 100));
  }

  // Defined Badges
  const badges = [
    {
      id: 'thrift-pioneer',
      title: 'Thrift Pioneer',
      description: 'Added your first second-hand or pre-loved garment',
      unlocked: secondhandItems.length >= 1,
      progress: Math.min(100, (secondhandItems.length / 1) * 100),
      current: `${secondhandItems.length} / 1 item`,
      icon: RotateCcw,
      category: 'Secondhand',
    },
    {
      id: 'circular-wardrobe',
      title: 'Circular Wardrobe',
      description: 'At least 50% of your current wardrobe is second-hand',
      unlocked: circularityPercent >= 50 && items.length >= 3,
      progress: Math.min(100, circularityPercent * 2),
      current: `${circularityPercent.toFixed(0)}% circular`,
      icon: Crown,
      category: 'Secondhand',
    },
    {
      id: 'forest-protector',
      title: 'Forest Protector',
      description: 'Avoided 42+ kg CO2e through thrifting (= 2 mature trees saved)',
      unlocked: co2AvoidedKg >= 42,
      progress: Math.min(100, (co2AvoidedKg / 42) * 100),
      current: `${co2AvoidedKg.toFixed(1)} / 42 kg saved`,
      icon: Trees,
      category: 'Impact',
    },
    {
      id: 'water-guardian',
      title: 'Water Guardian',
      description: 'Conserved over 10,000 Liters of water by choosing pre-loved',
      unlocked: waterAvoidedL >= 10000,
      progress: Math.min(100, (waterAvoidedL / 10000) * 100),
      current: `${waterAvoidedL.toLocaleString()} / 10,000 L saved`,
      icon: Droplets,
      category: 'Impact',
    },
    {
      id: 'thirty-wear-champion',
      title: '30-Wear Champion',
      description: 'Worn 3+ garments at least 30 times (Ellen MacArthur target)',
      unlocked: baselineItemsCount >= 3,
      progress: Math.min(100, (baselineItemsCount / 3) * 100),
      current: `${baselineItemsCount} / 3 items at 30+ wears`,
      icon: ShieldCheck,
      category: 'Longevity',
    },
    {
      id: 'century-club',
      title: 'Century Club (100 Wears)',
      description: 'Extended a single garment to 100+ wears for ultimate slow fashion',
      unlocked: centuryItemsCount >= 1,
      progress: Math.min(100, (Math.max(...items.map((i) => i.wears), 0) / 100) * 100),
      current: `${Math.max(...items.map((i) => i.wears), 0)} / 100 top wears`,
      icon: Award,
      category: 'Longevity',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Level & Points Banner */}
      <div className="bg-linear-to-r from-emerald-800 to-teal-900 text-white rounded-xl p-6 shadow-sm border border-emerald-700/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-emerald-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                Circularity Tier
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">{tier}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/20 px-4 py-2 rounded-xl border border-white/10">
            <div>
              <div className="text-[11px] text-emerald-200">Eco Karma Points</div>
              <div className="text-xl font-bold font-mono text-emerald-300 tabular-nums">
                {ecoPoints.toLocaleString()} pts
              </div>
            </div>
          </div>
        </div>

        {/* Level progress bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs text-emerald-200">
            <span>Progress to {nextTier}</span>
            <span className="font-mono tabular-nums">{tierProgress}%</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all"
              style={{ width: `${tierProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Highlights summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Secondhand Adoption</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {circularityPercent.toFixed(0)}%
            </span>
            <span className="text-xs text-emerald-700 font-semibold">
              ({secondhandItems.length} of {items.length} garments)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            75% lifecycle impact avoided on every pre-owned garment.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Average Times Worn</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {avgWears.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">wears / item</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Global fast-fashion average is under 10 wears.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">30-Wear Baseline Met</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
              {baselineItemsCount}
            </span>
            <span className="text-xs text-slate-500">garments</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Garments that have satisfied the Ellen MacArthur longevity standard.
          </p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Wardrobe Longevity &amp; Secondhand Badges</h3>
          <p className="text-xs text-slate-500">
            Earn badges by choosing pre-loved items and wearing your clothes repeatedly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  badge.unlocked
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-200 bg-slate-50/50 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        badge.unlocked
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {badge.unlocked ? (
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-3">{badge.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{badge.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>Progress</span>
                    <span className="tabular-nums font-semibold">{badge.current}</span>
                  </div>
                  <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        badge.unlocked ? 'bg-emerald-600' : 'bg-slate-400'
                      }`}
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
