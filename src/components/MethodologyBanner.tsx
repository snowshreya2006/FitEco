import React from 'react';
import { Info, ExternalLink, Leaf, ArrowRight } from 'lucide-react';

interface MethodologyBannerProps {
  onOpenModal: () => void;
}

export const MethodologyBanner: React.FC<MethodologyBannerProps> = ({ onOpenModal }) => {
  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 border border-slate-800 shadow-xs relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
                Scientific Grounding
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-300">WRAP &amp; Ellen MacArthur Foundation</span>
            </div>
            <p className="text-sm text-slate-200 mt-1 leading-snug">
              Calculations assume <strong className="text-white">75% saved by second-hand</strong>, a <strong className="text-white">30 baseline wears</strong> target, and <strong className="text-white">21 kg CO2e</strong> absorbed per tree/year.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shrink-0"
        >
          <span>How we calculate this</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
