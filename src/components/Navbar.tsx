import React from 'react';
import { Shirt, Plus, Layers, Award, BarChart3, HelpCircle, Sparkles, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onOpenSingleAdd: () => void;
  onOpenMultiAdd: () => void;
  onOpenMethodology: () => void;
  onResetToZero: () => void;
  activeTab: 'wardrobe' | 'hazard-index' | 'conclusion' | 'impact' | 'rewards';
  setActiveTab: (tab: 'wardrobe' | 'hazard-index' | 'conclusion' | 'impact' | 'rewards') => void;
  itemCount: number;
  secondhandCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSingleAdd,
  onOpenMultiAdd,
  onOpenMethodology,
  onResetToZero,
  activeTab,
  setActiveTab,
  itemCount,
  secondhandCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Shirt className="w-5 h-5" />
            </div>
            <a 
              href="#wardrobe" 
              onClick={() => setActiveTab('wardrobe')}
              className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap"
            >
              FitEco
            </a>
            <span className="hidden sm:inline-block text-xs text-slate-500 font-medium ml-1">
              Know Your Carbon &amp; Water
            </span>
          </div>

          {/* Zone 2: 4-5 clean single-line nav controls */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('wardrobe')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'wardrobe' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600' : ''
              }`}
            >
              <span>Wardrobe</span>
              <span className="text-xs text-slate-500 tabular-nums">({itemCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('hazard-index')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'hazard-index' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600' : ''
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Seasonal Hazard Spectrum</span>
            </button>

            <button
              onClick={() => setActiveTab('conclusion')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'conclusion' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600' : ''
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Preferences &amp; Verdict</span>
            </button>

            <button
              onClick={() => setActiveTab('impact')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'impact' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600' : ''
              }`}
            >
              <span>Impact Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'rewards' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600' : ''
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Rewards</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onResetToZero}
              disabled={itemCount === 0}
              className="px-2.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Reset all wardrobe data to zero"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Reset to Zero</span>
              <span className="sm:hidden">Reset</span>
            </button>

            <button
              onClick={onOpenMultiAdd}
              className="px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              title="Add multiple garments at once using batch table or presets"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Add Multiple Items</span>
              <span className="sm:hidden">Batch</span>
            </button>

            <button
              onClick={onOpenSingleAdd}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
