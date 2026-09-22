import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { COLOR_PALETTES } from '../../data/palettes';

export default function ColorTab({
  currentPalette,
  setCurrentPalette,
}) {
  return (
          <div className="space-y-4">
            
            {/* Color Harmony Score Header Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-heritage-paper-aged via-white to-heritage-paper border border-heritage-gold/40 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-bold text-heritage-charcoal flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-heritage-gold-dark" />
                  Độ Hài Hòa Sắc Độ (Ngũ Hành Tương Sinh)
                </span>
                <span className="text-sm sm:text-base font-extrabold text-heritage-red">
                  {currentPalette.harmonyScore}%
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-heritage-paper-aged h-2.5 rounded-full overflow-hidden border border-heritage-gold/25">
                <div 
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-heritage-gold via-heritage-red to-heritage-indigo"
                  style={{ width: `${currentPalette.harmonyScore}%` }}
                />
              </div>

              <p className="text-xs text-heritage-charcoal-muted mt-2 leading-relaxed font-medium">
                {currentPalette.harmonyReview}
              </p>
            </div>

            {/* Palettes Grid */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-heritage-gold-dark">
                Chọn Bản Phối Ngũ Hành:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {COLOR_PALETTES.map((pal) => {
                  const isSelected = currentPalette.id === pal.id;

                  return (
                    <div
                      key={pal.id}
                      onClick={() => setCurrentPalette(pal)}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white border-heritage-gold shadow-md ring-1 ring-heritage-gold/30'
                          : 'bg-white/70 border-heritage-gold/20 hover:border-heritage-gold/60 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs sm:text-sm text-heritage-charcoal flex items-center gap-1.5">
                          <span>{pal.elementSign}</span>
                          <span>{pal.elementVi}</span>
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-heritage-gold text-heritage-charcoal flex items-center justify-center font-bold">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      {/* 3 Color swatches */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <div 
                          className="h-6 flex-1 rounded-lg shadow-inner border border-black/10" 
                          style={{ backgroundColor: pal.primary }}
                          title={`Chính: ${pal.primary}`}
                        />
                        <div 
                          className="h-6 flex-1 rounded-lg shadow-inner border border-black/10" 
                          style={{ backgroundColor: pal.secondary }}
                          title={`Phụ: ${pal.secondary}`}
                        />
                        <div 
                          className="h-6 flex-1 rounded-lg shadow-inner border border-black/10" 
                          style={{ backgroundColor: pal.accent }}
                          title={`Điểm nhấn: ${pal.accent}`}
                        />
                      </div>

                      <p className="text-xs text-heritage-charcoal-muted leading-snug font-medium">
                        {pal.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
  );
}
