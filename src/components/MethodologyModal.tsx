import React from 'react';
import { X, BookOpen, ExternalLink, Leaf, Droplets, RotateCcw, Trees } from 'lucide-react';
import { ASSUMPTIONS } from '../data/sustainabilityData';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div 
        className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="methodology-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 id="methodology-title" className="text-base font-bold text-slate-900">
                How We Calculate This
              </h2>
              <p className="text-xs text-slate-500">
                Transparent carbon, water, and circularity methodologies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm text-slate-600">
          {/* Key Assumptions Card */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase">
              Core Assumptions &amp; Benchmarks
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-md border border-slate-200">
                <div className="flex items-center gap-2 font-semibold text-emerald-800 mb-1">
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                  <span>75% Saved by Second-Hand</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Choosing second-hand avoids virgin agricultural growth, petrochemical synthesis, and wet processing. Based on WRAP reuse data, second-hand choices reduce footprint by 75%.
                </p>
              </div>

              <div className="p-3 bg-white rounded-md border border-slate-200">
                <div className="flex items-center gap-2 font-semibold text-emerald-800 mb-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>30 Baseline Wears</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Grounded in the Ellen MacArthur Foundation and global #30Wears benchmark. Wearing a garment at least 30 times fulfills its planned life; extending past 30 dramatically slashes impact per wear.
                </p>
              </div>

              <div className="p-3 bg-white rounded-md border border-slate-200">
                <div className="flex items-center gap-2 font-semibold text-emerald-800 mb-1">
                  <Trees className="w-3.5 h-3.5 text-emerald-600" />
                  <span>21 kg CO2e Per Tree / Year</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  According to the European Environment Agency and arboricultural standards, one mature urban tree sequesters approximately 21 kg of CO2 per year.
                </p>
              </div>

              <div className="p-3 bg-white rounded-md border border-slate-200">
                <div className="flex items-center gap-2 font-semibold text-emerald-800 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Water Equivalency</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  1 standard household bathtub equals 150 Liters of water; daily recommended human drinking water is 2.5 Liters. A single virgin pair of jeans (~8,000L) equals ~53 bathtubs of water!
                </p>
              </div>
            </div>
          </div>

          {/* Research Sources */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase">
              Scientific Research Sources
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="font-semibold text-slate-900 text-xs">
                  1. WRAP (Waste and Resources Action Programme)
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  <em>"Valuing Our Clothes: the cost of UK fashion"</em>. Benchmark figures for cradle-to-grave carbon footprint and water consumption across cotton, denim, wool, polyester, and second-hand reuse lifecycles.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="font-semibold text-slate-900 text-xs">
                  2. Ellen MacArthur Foundation
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  <em>"A New Textiles Economy: Redesigning fashion's future"</em>. Establishes the 30-wear durability metric, clothing underutilization statistics (clothing utilization declined 36% globally), and circular business model savings.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="font-semibold text-slate-900 text-xs">
                  3. Higg Materials Sustainability Index (MSI)
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Sustainable Apparel Coalition cradle-to-gate material coefficients comparing organic versus conventional cotton, virgin petrochemical synthetics, and recycled alternatives.
                </p>
              </div>
            </div>
          </div>

          {/* Formulas */}
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
            <div className="font-semibold text-slate-800">Calculation Formulas:</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-mono text-slate-800">Carbon per Wear</span> = <span className="font-mono">Footprint (kg CO2e) ÷ Max(1, Wears)</span>
              </li>
              <li>
                <span className="font-mono text-slate-800">Water per Wear</span> = <span className="font-mono">Water (Liters) ÷ Max(1, Wears)</span>
              </li>
              <li>
                <span className="font-mono text-slate-800">Second-Hand Savings</span> = <span className="font-mono">Virgin Footprint × 75%</span>
              </li>
              <li>
                <span className="font-mono text-slate-800">Trees Required to Offset</span> = <span className="font-mono">Total Footprint (kg) ÷ 21 kg/tree/year</span>
              </li>
              <li>
                <span className="font-mono text-slate-800">Seasonal Hazard Spectrum</span> = <span className="font-mono">Normal (0–35%), Little Hazardous (36–68%), Dangerous (69–100%)</span> based on cradle-to-gate carbon, freshwater depletion, and wear durability mitigation.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>FitEco Theme ST-02 · Know Your Carbon</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
