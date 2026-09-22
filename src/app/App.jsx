import React from 'react';
import Header from '../components/layout/Header';
import CulturalCard from '../features/heritage/components/CulturalCard';
import ControlTabs from '../features/studio/components/ControlTabs';
import LookbookModal from '../features/studio/components/LookbookModal';
import LookbookPresets from '../features/studio/components/LookbookPresets';
import StudioCanvas from '../features/studio/components/StudioCanvas';
import useOutfitStudio from '../features/studio/hooks/useOutfitStudio';

export default function App() {
  const {
    selectedEvent,
    setSelectedEvent,
    selectedRegion,
    setSelectedRegion,
    selectedWeather,
    setSelectedWeather,
    gender,
    setGender,
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
    isLookbookModalOpen,
    openLookbookModal,
    closeLookbookModal,
    culturalAlert,
    handleRandomize,
    handleResetTraditional,
    handleApplyPreset,
  } = useOutfitStudio();

  return (
    <div className="min-h-screen flex flex-col bg-heritage-paper font-sans selection:bg-heritage-red selection:text-white">
      
      {/* Sticky Header with Context Selectors */}
      <Header
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedWeather={selectedWeather}
        setSelectedWeather={setSelectedWeather}
        gender={gender}
        setGender={setGender}
        onRandomize={handleRandomize}
        onResetTraditional={handleResetTraditional}
        onOpenLookbookModal={openLookbookModal}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        
        {/* Top Feature Tagline */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left bg-gradient-to-r from-heritage-paper-aged via-white to-heritage-paper-aged p-3.5 rounded-2xl border border-heritage-gold/30 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-heritage-red animate-ping flex-shrink-0" />
            <p className="text-xs sm:text-sm text-heritage-charcoal font-medium">
              Chào mừng bạn đến với <strong className="text-heritage-red font-bold">Xưởng Phối Đồ Việt Phục 2026</strong>. Tự do sáng tạo phong cách Gen Z đương đại trên nền tảng di sản ngàn năm!
            </p>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-heritage-gold-dark tracking-wide uppercase whitespace-nowrap">
            #HeritageMeetsStreetwear
          </span>
        </div>

        {/* Core Remix Studio Section: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-start">
          
          {/* Column 1: Studio Canvas (5 Cols) */}
          <div className="lg:col-span-5 w-full sticky top-28">
            <StudioCanvas
              outfit={currentOutfit}
              palette={currentPalette}
              bottom={currentBottom}
              traditionalAccs={traditionalAccs}
              modernAccs={modernAccs}
              gender={gender}
              culturalAlert={culturalAlert}
              onOpenLookbookModal={openLookbookModal}
            />
          </div>

          {/* Column 2: Mix & Match Control Tabs (7 Cols) */}
          <div className="lg:col-span-7 w-full">
            <ControlTabs
              currentOutfit={currentOutfit}
              setCurrentOutfit={setCurrentOutfit}
              currentPalette={currentPalette}
              setCurrentPalette={setCurrentPalette}
              currentBottom={currentBottom}
              setCurrentBottom={setCurrentBottom}
              traditionalAccs={traditionalAccs}
              setTraditionalAccs={setTraditionalAccs}
              modernAccs={modernAccs}
              setModernAccs={setModernAccs}
              gender={gender}
            />
          </div>

        </div>

        {/* Cultural Wisdom & Safety Card */}
        <section>
          <CulturalCard 
            outfit={currentOutfit} 
            culturalAlert={culturalAlert} 
          />
        </section>

        {/* Lookbook Presets Section */}
        <section>
          <LookbookPresets 
            onApplyPreset={handleApplyPreset} 
          />
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-heritage-gold/25 bg-white/75 backdrop-blur-md py-6 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-heritage-red text-heritage-gold font-serif-heritage font-black flex items-center justify-center text-xs shadow-md">
              VP
            </div>
            <span className="font-serif-heritage font-bold text-sm sm:text-base text-heritage-charcoal">
              Việt Phục Remix - Gen Z Heritage Studio
            </span>
          </div>
          <p className="text-xs text-heritage-charcoal-muted max-w-2xl mx-auto leading-relaxed">
            Dự án kết nối giới trẻ với di sản trang phục truyền thống Việt Nam. Tôn vinh nét đẹp Áo ngũ thân tay chẽn, Áo tấc tay thụng, Áo tứ thân Kinh Bắc, Áo giao lĩnh và Áo bà ba trong dòng chảy thời trang đương đại.
          </p>
          <p className="text-[11px] sm:text-xs text-heritage-gold-dark font-semibold">
            © 2026 Việt Phục Remix. Thiết kế vì tình yêu văn hóa & thời trang bền vững.
          </p>
        </div>
      </footer>

      {/* Modal: Export Lookbook Card */}
      <LookbookModal
        isOpen={isLookbookModalOpen}
        onClose={closeLookbookModal}
        outfit={currentOutfit}
        palette={currentPalette}
        bottom={currentBottom}
        traditionalAccs={traditionalAccs}
        modernAccs={modernAccs}
        gender={gender}
        culturalAlert={culturalAlert}
      />

    </div>
  );
}
