import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  Camera, 
  Zap
} from 'lucide-react';
import OutfitIllustration from './OutfitIllustration';

export default function StudioCanvas({
  outfit,
  palette,
  bottom,
  traditionalAccs,
  modernAccs,
  gender,
  culturalAlert,
  onOpenLookbookModal
}) {
  const [viewMode, setViewMode] = useState('remix'); // 'remix' | 'traditional'

  const isTraditionalOnly = viewMode === 'traditional';
  const effectiveBottom = isTraditionalOnly 
    ? { id: 'quan_lua_trang', name: 'Quần Lụa Trắng Thụng', color: '#FAF7F2' } 
    : bottom;
  const effectiveModernAccs = isTraditionalOnly ? [] : modernAccs;

  const hasTraditional = (id) => traditionalAccs.includes(id);
  const hasModern = (id) => effectiveModernAccs.includes(id);

  const primaryColor = palette.primary;
  const secondaryColor = palette.secondary;
  const accentColor = palette.accent;

  return (
    <div className="relative flex flex-col items-center justify-between w-full h-full min-h-[660px] lg:min-h-[760px] rounded-3xl glass-panel p-4 sm:p-7 border-2 border-heritage-gold/50 shadow-2xl overflow-hidden">
      
      {/* Dynamic Ambient Glow & Traditional Motif Rings */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div 
          className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl transition-all duration-700"
          style={{ background: `radial-gradient(circle, ${primaryColor}28 0%, ${accentColor}18 50%, transparent 80%)` }}
        />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full border border-heritage-gold/30 border-dashed" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full border border-heritage-gold/20" />
      </div>

      {/* Top Floating Control Bar with LARGER FONTS */}
      <div className="w-full flex items-center justify-between z-10 gap-3 flex-wrap">
        
        {/* Outfit Badge & Era */}
        <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-heritage-gold/40 shadow-md">
          <div 
            className="w-3.5 h-3.5 rounded-full shadow-md animate-pulse" 
            style={{ backgroundColor: primaryColor }}
          />
          <div className="leading-tight">
            <span className="text-xs sm:text-sm font-bold text-heritage-charcoal block font-serif-heritage">
              {outfit.name}
            </span>
            <span className="text-[11px] text-heritage-gold-dark font-medium">
              {outfit.era.split('(')[0]}
            </span>
          </div>
        </div>

        {/* View Mode Selector: Remix vs Traditional */}
        <div className="flex items-center bg-heritage-paper-aged/90 p-0.5 rounded-xl border border-heritage-gold/30 shadow-sm">
          <button
            onClick={() => setViewMode('remix')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'remix'
                ? 'bg-heritage-red text-white shadow-sm'
                : 'text-heritage-charcoal-muted hover:text-heritage-charcoal'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-heritage-gold" />
            <span>Remix Gen Z</span>
          </button>
          <button
            onClick={() => setViewMode('traditional')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'traditional'
                ? 'bg-heritage-indigo text-white shadow-sm'
                : 'text-heritage-charcoal-muted hover:text-heritage-charcoal'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Nguyên Bản</span>
          </button>
        </div>

      </div>

      {/* Center 2D Fashion Mannequin Canvas - Ultra-detailed Vector Model */}
      <div className="relative w-full flex-1 flex items-center justify-center my-2 max-w-[460px] select-none">
        
        <OutfitIllustration
          outfit={outfit}
          effectiveBottom={effectiveBottom}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
          gender={gender}
          hasTraditional={hasTraditional}
          hasModern={hasModern}
        />

      </div>

      {/* Cultural Safety Guard Alert */}
      {culturalAlert && viewMode === 'remix' && (
        <div className="w-full z-20 transition-all mt-2">
          <div className="bg-amber-500/15 border-2 border-amber-500/60 rounded-2xl p-3 sm:p-3.5 backdrop-blur-md shadow-md flex items-start gap-2.5 text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-0.5">
              <p className="font-extrabold text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
                {culturalAlert.title}
              </p>
              <p className="text-[11px] sm:text-xs text-amber-900 leading-relaxed">
                {culturalAlert.message}
              </p>
              <p className="text-[11px] sm:text-xs text-amber-950 font-bold bg-amber-200/80 p-1.5 rounded-lg mt-1">
                💡 {culturalAlert.solution}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="w-full flex items-center justify-between z-10 pt-2.5 border-t border-heritage-gold/25 gap-2.5 flex-wrap">
        
        {/* Cultural Safety status */}
        <div className="flex items-center gap-2">
          {culturalAlert && viewMode === 'remix' ? (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Cần lưu ý di sản</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chuẩn mực di sản 100%</span>
            </div>
          )}
        </div>

        {/* Harmony Score pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-full border border-heritage-gold/30 shadow-sm text-xs">
            <Sparkles className="w-3.5 h-3.5 text-heritage-gold-dark" />
            <span className="text-heritage-charcoal-muted">Hòa sắc Ngũ hành:</span>
            <span className="font-bold text-heritage-red">{palette.harmonyScore}/100</span>
          </div>

          <button
            onClick={onOpenLookbookModal}
            className="flex items-center gap-1 bg-heritage-charcoal text-white hover:bg-black px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm hover:scale-102"
            title="Chụp ảnh Lookbook"
          >
            <Camera className="w-3.5 h-3.5 text-heritage-gold" />
            <span>Chụp Lookbook</span>
          </button>
        </div>

      </div>

    </div>
  );
}
