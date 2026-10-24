import React, { useState, useEffect } from 'react';
import { WardrobeItem } from './types/wardrobe';
import { INITIAL_WARDROBE_ITEMS } from './data/sustainabilityData';
import { Navbar } from './components/Navbar';
import { KPIStrip } from './components/KPIStrip';
import { MethodologyBanner } from './components/MethodologyBanner';
import { MethodologyModal } from './components/MethodologyModal';
import { AddItemModal } from './components/AddItemModal';
import { MultiItemAddModal } from './components/MultiItemAddModal';
import { EditItemModal } from './components/EditItemModal';
import { WardrobeGrid } from './components/WardrobeGrid';
import { ImpactVisualizer } from './components/ImpactVisualizer';
import { RewardsSection } from './components/RewardsSection';
import { ConfirmModal } from './components/ConfirmModal';
import { SeasonalHazardBarGraph } from './components/SeasonalHazardBarGraph';
import { WardrobeConclusion } from './components/WardrobeConclusion';
import { RotateCcw, Download, Sparkles, Shirt, BarChart3, Award, Lightbulb } from 'lucide-react';

const STORAGE_KEY = 'fiteco_wardrobe_items_v2';

export default function App() {
  const [items, setItems] = useState<WardrobeItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored wardrobe:', e);
    }
    return INITIAL_WARDROBE_ITEMS;
  });

  const [activeTab, setActiveTab] = useState<'wardrobe' | 'hazard-index' | 'conclusion' | 'impact' | 'rewards'>('wardrobe');
  const [isSingleAddOpen, setIsSingleAddOpen] = useState(false);
  const [isMultiAddOpen, setIsMultiAddOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // In-app confirmation dialog (replaces native window.confirm which is blocked in iframes)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    confirmVariant: 'danger' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    confirmVariant: 'danger',
    onConfirm: () => {},
  });

  // Sync with local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }, [items]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers
  const handleAddItem = (newItem: Omit<WardrobeItem, 'id'>) => {
    const itemWithId: WardrobeItem = {
      ...newItem,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setItems((prev) => [itemWithId, ...prev]);
    showToast(`Added "${itemWithId.name}" to wardrobe!`);
  };

  const handleAddMultiple = (newItems: Omit<WardrobeItem, 'id'>[]) => {
    const itemsWithIds: WardrobeItem[] = newItems.map((item, idx) => ({
      ...item,
      id: `item-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
    }));
    setItems((prev) => [...itemsWithIds, ...prev]);
    showToast(`Successfully added ${newItems.length} garments to your wardrobe!`);
  };

  const handleIncrementWear = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const newWear = it.wears + 1;
          showToast(`Logged wear for "${it.name}" (Worn ${newWear} times)`);
          return { ...it, wears: newWear };
        }
        return it;
      })
    );
  };

  const handleBulkIncrementWear = (ids: string[]) => {
    setItems((prev) =>
      prev.map((it) => (ids.includes(it.id) ? { ...it, wears: it.wears + 1 } : it))
    );
    showToast(`Logged outfit wear for ${ids.length} garments!`);
  };

  const handleEditItem = (item: WardrobeItem) => {
    setEditingItem(item);
  };

  const handleSaveEdit = (updated: WardrobeItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    showToast(`Updated "${updated.name}"`);
  };

  const handleDeleteItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Garment?',
      message: `Are you sure you want to remove "${item?.name || 'this item'}" from your wardrobe?`,
      confirmLabel: 'Delete Garment',
      confirmVariant: 'danger',
      onConfirm: () => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        showToast('Garment removed from wardrobe.');
      },
    });
  };

  const handleBulkDelete = (ids: string[]) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Selected Garments?',
      message: `Are you sure you want to remove ${ids.length} selected garments from your wardrobe?`,
      confirmLabel: `Delete ${ids.length} Items`,
      confirmVariant: 'danger',
      onConfirm: () => {
        setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
        showToast(`Removed ${ids.length} garments from wardrobe.`);
      },
    });
  };

  const handleResetToZero = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Wardrobe to Zero?',
      message: 'Are you sure you want to reset all data to zero? This will remove all garments and reset your carbon footprint (0.0 kg CO2e) and water usage (0 Liters) to zero.',
      confirmLabel: 'Reset All to Zero',
      confirmVariant: 'danger',
      onConfirm: () => {
        setItems([]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        showToast('All wardrobe data has been reset to zero.');
      },
    });
  };

  const handleResetToDemo = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Load Benchmark Demo Garments?',
      message: 'Are you sure you want to reload the verified WRAP and Ellen MacArthur Foundation demo items?',
      confirmLabel: 'Load Benchmark Data',
      confirmVariant: 'primary',
      onConfirm: () => {
        setItems(INITIAL_WARDROBE_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WARDROBE_ITEMS));
        showToast('Reset wardrobe to verified benchmark garments.');
      },
    });
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fiteco-wardrobe-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const secondhandCount = items.filter((i) => i.is_secondhand).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract Navigation */}
      <Navbar
        onOpenSingleAdd={() => setIsSingleAddOpen(true)}
        onOpenMultiAdd={() => setIsMultiAddOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onResetToZero={handleResetToZero}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        itemCount={items.length}
        secondhandCount={secondhandCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Editorial Hero Kicker & Pitch */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs relative overflow-hidden">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 tracking-wide uppercase">
              <span>FitEco</span>
              <span aria-hidden="true">·</span>
              <span>ST-02 Know Your Carbon</span>
              <span aria-hidden="true">·</span>
              <span>ST-OPEN Sustainability &amp; Climate Tech</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
              Wardrobe Carbon &amp; Water Footprint Tracker
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed text-pretty">
              Fast fashion has a massive, hidden environmental cost. FitEco calculates the true cradle-to-gate carbon emissions and freshwater used in your clothes, and rewards you for opting for second-hand garments or extending clothing life past 30 wears.
            </p>
          </div>
        </div>

        {/* Scientific Methodology Callout Banner */}
        <MethodologyBanner onOpenModal={() => setIsMethodologyOpen(true)} />

        {/* Core Environmental KPI Strip */}
        <KPIStrip items={items} />

        {/* Sub-Navigation & Workspace Segment Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'wardrobe'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shirt className="w-4 h-4 text-emerald-600" />
            <span>Wardrobe Catalog</span>
            <span className="text-[11px] font-mono tabular-nums bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full">
              {items.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('hazard-index')}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'hazard-index'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Seasonal Hazard Bar Graph (Normal / Hazardous / Dangerous)</span>
          </button>

          <button
            onClick={() => setActiveTab('conclusion')}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'conclusion'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>What to Prefer (Conclusion)</span>
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'impact'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Impact Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'rewards'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Longevity Rewards</span>
          </button>
        </div>

        {/* Workspace Views */}
        {activeTab === 'wardrobe' && (
          <WardrobeGrid
            items={items}
            onIncrementWear={handleIncrementWear}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onBulkIncrementWear={handleBulkIncrementWear}
            onBulkDelete={handleBulkDelete}
            onOpenSingleAdd={() => setIsSingleAddOpen(true)}
            onOpenMultiAdd={() => setIsMultiAddOpen(true)}
            onResetToZero={handleResetToZero}
            onResetToDemo={handleResetToDemo}
          />
        )}

        {activeTab === 'hazard-index' && (
          <SeasonalHazardBarGraph
            items={items}
            onOpenMethodology={() => setIsMethodologyOpen(true)}
            onIncrementWear={handleIncrementWear}
          />
        )}

        {activeTab === 'conclusion' && (
          <WardrobeConclusion
            items={items}
            onOpenMethodology={() => setIsMethodologyOpen(true)}
            onOpenSingleAdd={() => setIsSingleAddOpen(true)}
            onOpenMultiAdd={() => setIsMultiAddOpen(true)}
          />
        )}

        {activeTab === 'impact' && (
          <ImpactVisualizer
            items={items}
            onOpenMethodology={() => setIsMethodologyOpen(true)}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsSection items={items} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shirt className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-800">FitEco</span>
            <span>·</span>
            <span>Grounded in WRAP &amp; Ellen MacArthur Foundation research</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleExportData}
              className="hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Wardrobe JSON</span>
            </button>

            <span>·</span>

            <button
              onClick={handleResetToZero}
              className="hover:text-rose-600 transition-colors flex items-center gap-1 text-slate-500 hover:text-rose-700"
              title="Reset all wardrobe data to zero items"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
              <span>Reset to Zero</span>
            </button>

            <span>·</span>

            <button
              onClick={handleResetToDemo}
              className="hover:text-slate-900 transition-colors flex items-center gap-1 text-slate-500 hover:text-emerald-700"
              title="Restore initial WRAP & Ellen MacArthur benchmark items"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Benchmark Demo</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddItemModal
        isOpen={isSingleAddOpen}
        onClose={() => setIsSingleAddOpen(false)}
        onAdd={handleAddItem}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      <MultiItemAddModal
        isOpen={isMultiAddOpen}
        onClose={() => setIsMultiAddOpen(false)}
        onAddMultiple={handleAddMultiple}
      />

      <EditItemModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEdit}
      />

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((d) => ({ ...d, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
      />
    </div>
  );
}
