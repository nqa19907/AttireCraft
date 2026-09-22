import React from 'react';
import { AlertCircle, Check, Shirt, Sparkles } from 'lucide-react';
import { CULTURAL_OUTFITS } from '../../data/outfits';
import { BOTTOM_OPTIONS } from '../../data/bottoms';

export default function OutfitTab({
  currentOutfit,
  setCurrentOutfit,
  currentBottom,
  setCurrentBottom,
  gender,
}) {
  return (
          <div className="space-y-4">
            
            {/* Section 1: Main Robe */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wide text-heritage-charcoal flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-heritage-red" />
                  1. Chọn Áo Cổ Truyền
                </h3>
                <span className="text-xs text-heritage-gold-dark font-semibold">
                  5 kiệt tác di sản
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CULTURAL_OUTFITS.map((item) => {
                  const isSelected = currentOutfit.id === item.id;
                  const isGenderMatched = item.gender === 'both' || item.gender === gender;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setCurrentOutfit(item)}
                      className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-heritage-red/5 border-heritage-red shadow-sm ring-1 ring-heritage-red/20'
                          : 'bg-white/75 border-heritage-gold/25 hover:border-heritage-gold hover:bg-white'
                      } ${!isGenderMatched ? 'opacity-80' : ''}`}
                    >
                      {/* Selection check */}
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-heritage-red text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3" />
                        </div>
                      )}

                      <div className="flex items-start gap-2.5">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-extrabold text-xs shadow-sm"
                          style={{ backgroundColor: item.defaultColor }}
                        >
                          {item.name.charAt(0)}
                        </div>
                        <div className="flex-1 pr-4">
                          <h4 className="font-bold text-xs sm:text-sm text-heritage-charcoal leading-snug">
                            {item.name}
                          </h4>
                          <span className="inline-block text-[11px] font-semibold text-heritage-indigo bg-heritage-indigo/10 px-1.5 py-0.5 rounded mt-0.5">
                            {item.category}
                          </span>
                          <p className="text-xs text-heritage-charcoal-muted mt-1 leading-relaxed">
                            {item.tagline}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Bottoms / Quần / Chân Váy */}
            <div className="pt-2.5 border-t border-heritage-gold/20">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wide text-heritage-charcoal flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-heritage-indigo" />
                  2. Phối Cùng Quần / Chân Váy
                </h3>
                <span className="text-xs text-heritage-gold-dark font-medium">
                  Kết hợp xưa và nay
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BOTTOM_OPTIONS.map((bot) => {
                  const isSelected = currentBottom.id === bot.id;
                  const isRisky = !bot.isSafeWithAll;

                  return (
                    <button
                      key={bot.id}
                      onClick={() => setCurrentBottom(bot)}
                      className={`p-2.5 rounded-xl text-left border transition-all relative ${
                        isSelected
                          ? 'bg-heritage-indigo/10 border-heritage-indigo ring-1 ring-heritage-indigo/20 font-bold text-heritage-indigo shadow-sm'
                          : 'bg-white/70 border-heritage-gold/20 hover:border-heritage-gold text-heritage-charcoal hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-heritage-paper-aged text-heritage-charcoal border border-heritage-gold/20">
                          {bot.tag}
                        </span>
                        {isRisky && (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" title="Cần lưu ý chuẩn mực di sản" />
                        )}
                      </div>
                      <p className="text-xs leading-snug font-bold">
                        {bot.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
  );
}
