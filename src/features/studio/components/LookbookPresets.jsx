import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { LOOKBOOK_PRESETS } from '../data/presets';
import { COLOR_PALETTES } from '../data/palettes';

export default function LookbookPresets({
  onApplyPreset
}) {
  return (
    <div className="w-full rounded-3xl glass-panel p-5 sm:p-6 border border-heritage-gold/35 shadow-lg space-y-3.5">
      
      {/* Title & Tagline */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif-heritage font-bold text-base sm:text-lg text-heritage-charcoal flex items-center gap-2">
            <Zap className="w-4 h-4 text-heritage-gold-dark" />
            Lookbook Presets: Bộ Sưu Tập Phối Mẫu Sẵn
          </h3>
          <p className="text-xs text-heritage-charcoal-muted mt-0.5">
            Chọn nhanh các phong cách kinh điển được sáng tạo bởi các stylist trẻ
          </p>
        </div>
        <span className="text-xs font-bold text-heritage-red px-2.5 py-1 rounded-full bg-heritage-red/10 border border-heritage-red/25">
          4 Công Thức Hot
        </span>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LOOKBOOK_PRESETS.map((preset) => {
          const palette = COLOR_PALETTES.find(p => p.id === preset.paletteId);

          return (
            <div
              key={preset.id}
              onClick={() => onApplyPreset(preset)}
              className="group relative p-3.5 rounded-2xl bg-white/75 hover:bg-white border border-heritage-gold/25 hover:border-heritage-red/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Top Tag & Author */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-heritage-paper-aged text-heritage-charcoal border border-heritage-gold/25">
                  {preset.tag}
                </span>
                <span className="text-[11px] text-heritage-charcoal-muted font-medium truncate max-w-[110px]">
                  by {preset.author}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 my-1">
                <h4 className="font-bold text-xs sm:text-sm text-heritage-charcoal group-hover:text-heritage-red transition-colors flex items-center justify-between">
                  <span>{preset.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-heritage-charcoal-muted group-hover:text-heritage-red group-hover:translate-x-1 transition-all" />
                </h4>
                
                <p className="text-xs text-heritage-charcoal-muted line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              {/* Palette Preview Dots */}
              <div className="flex items-center justify-between pt-2.5 border-t border-heritage-gold/15 mt-1.5">
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm" 
                    style={{ backgroundColor: palette?.primary }} 
                  />
                  <div 
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm" 
                    style={{ backgroundColor: palette?.accent }} 
                  />
                  <span className="text-[11px] text-heritage-charcoal-muted font-semibold ml-0.5">
                    {palette?.elementVi.split(' ')[0]}
                  </span>
                </div>

                <span className="text-xs font-bold text-heritage-indigo group-hover:underline flex items-center gap-1">
                  Áp dụng ➔
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
