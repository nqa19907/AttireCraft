import React from 'react';
import { Check, Glasses } from 'lucide-react';
import { MODERN_ACCESSORIES } from '../../data/accessories';

export default function ModernAccessoriesTab({
  modernAccs,
  toggleModern,
}) {
  return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wide text-heritage-charcoal flex items-center gap-1.5">
                <Glasses className="w-4 h-4 text-heritage-red" />
                Phụ Kiện Gen Z Đương Đại
              </h3>
              <span className="text-xs text-heritage-gold-dark font-bold">
                Đã chọn: {modernAccs.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MODERN_ACCESSORIES.map((acc) => {
                const isSelected = modernAccs.includes(acc.id);

                return (
                  <div
                    key={acc.id}
                    onClick={() => toggleModern(acc.id)}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-heritage-red/5 border-heritage-red shadow-sm'
                        : 'bg-white/70 border-heritage-gold/20 hover:border-heritage-gold hover:bg-white'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                      isSelected 
                        ? 'bg-heritage-red border-heritage-red text-white font-bold' 
                        : 'border-heritage-gold/40 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-heritage-charcoal leading-snug">
                          {acc.name}
                        </h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-heritage-gold/20 text-heritage-charcoal whitespace-nowrap">
                          {acc.tag}
                        </span>
                      </div>
                      <span className="text-[11px] text-heritage-indigo font-bold block mt-0.5">
                        {acc.category}
                      </span>
                      <p className="text-xs text-heritage-charcoal-muted leading-relaxed mt-0.5">
                        {acc.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
  );
}
