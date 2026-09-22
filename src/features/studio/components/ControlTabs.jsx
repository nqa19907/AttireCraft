import React, { useState } from 'react';
import { Crown, Glasses, Palette, Shirt } from 'lucide-react';
import useAccessorySelection from '../hooks/useAccessorySelection';
import ColorTab from './tabs/ColorTab';
import ModernAccessoriesTab from './tabs/ModernAccessoriesTab';
import OutfitTab from './tabs/OutfitTab';
import TraditionalAccessoriesTab from './tabs/TraditionalAccessoriesTab';

export default function ControlTabs({
  currentOutfit,
  setCurrentOutfit,
  currentPalette,
  setCurrentPalette,
  currentBottom,
  setCurrentBottom,
  traditionalAccs,
  setTraditionalAccs,
  modernAccs,
  setModernAccs,
  gender
}) {
  const [activeTab, setActiveTab] = useState('outfit'); // 'outfit' | 'color' | 'traditional' | 'modern'

  const { toggleTraditional, toggleModern } = useAccessorySelection({
    setTraditionalAccs,
    setModernAccs,
  });

  return (
    <div className="flex flex-col w-full h-full rounded-3xl glass-panel p-4 sm:p-5 border border-heritage-gold/35 shadow-lg">
      
      {/* 4 Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-heritage-paper-aged/85 rounded-2xl border border-heritage-gold/25 mb-4">
        
        {/* Tab 1 */}
        <button
          onClick={() => setActiveTab('outfit')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 sm:py-2.5 px-1.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all ${
            activeTab === 'outfit'
              ? 'bg-heritage-red text-white shadow-sm'
              : 'text-heritage-charcoal-muted hover:text-heritage-charcoal hover:bg-white/50'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>Trang Phục</span>
        </button>

        {/* Tab 2 */}
        <button
          onClick={() => setActiveTab('color')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 sm:py-2.5 px-1.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all ${
            activeTab === 'color'
              ? 'bg-heritage-indigo text-white shadow-sm'
              : 'text-heritage-charcoal-muted hover:text-heritage-charcoal hover:bg-white/50'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Bảng Màu</span>
        </button>

        {/* Tab 3 */}
        <button
          onClick={() => setActiveTab('traditional')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 sm:py-2.5 px-1.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all ${
            activeTab === 'traditional'
              ? 'bg-amber-700 text-white shadow-sm'
              : 'text-heritage-charcoal-muted hover:text-heritage-charcoal hover:bg-white/50'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Cổ Truyền</span>
        </button>

        {/* Tab 4 */}
        <button
          onClick={() => setActiveTab('modern')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 sm:py-2.5 px-1.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all ${
            activeTab === 'modern'
              ? 'bg-heritage-charcoal text-heritage-gold shadow-sm'
              : 'text-heritage-charcoal-muted hover:text-heritage-charcoal hover:bg-white/50'
          }`}
        >
          <Glasses className="w-4 h-4" />
          <span>Gen Z Remix</span>
        </button>

      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[550px]">
        
        {/* ================= TAB 1 */}
        {activeTab === 'outfit' && (
          <OutfitTab
            currentOutfit={currentOutfit}
            setCurrentOutfit={setCurrentOutfit}
            currentBottom={currentBottom}
            setCurrentBottom={setCurrentBottom}
            gender={gender}
          />
        )}

        {/* ================= TAB 2 */}
        {activeTab === 'color' && (
          <ColorTab
            currentPalette={currentPalette}
            setCurrentPalette={setCurrentPalette}
          />
        )}

        {/* ================= TAB 3 */}
        {activeTab === 'traditional' && (
          <TraditionalAccessoriesTab
            traditionalAccs={traditionalAccs}
            toggleTraditional={toggleTraditional}
          />
        )}

        {/* ================= TAB 4 */}
        {activeTab === 'modern' && (
          <ModernAccessoriesTab
            modernAccs={modernAccs}
            toggleModern={toggleModern}
          />
        )}



      </div>

    </div>
  );
}
