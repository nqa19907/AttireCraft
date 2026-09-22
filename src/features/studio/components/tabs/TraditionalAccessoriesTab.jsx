import React from 'react';
import { Check, Crown } from 'lucide-react';
import { TRADITIONAL_ACCESSORIES } from '../../data/accessories';

export default function TraditionalAccessoriesTab({
  traditionalAccs,
  toggleTraditional,
}) {
  return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wide text-heritage-charcoal flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-700" />
                Phụ Kiện Di Sản Cổ Truyền
              </h3>
              <span className="text-xs text-heritage-gold-dark font-bold">
                Đã chọn: {traditionalAccs.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TRADITIONAL_ACCESSORIES.map((acc) => {
                const isSelected = traditionalAccs.includes(acc.id);

                return (
                  <div
                    key={acc.id}
                    onClick={() => toggleTraditional(acc.id)}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-700 shadow-sm'
                        : 'bg-white/70 border-heritage-gold/20 hover:border-heritage-gold hover:bg-white'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                      isSelected 
                        ? 'bg-amber-700 border-amber-700 text-white font-bold' 
                        : 'border-heritage-gold/40 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs sm:text-sm text-heritage-charcoal leading-snug">
                          {acc.name}
                        </h4>
                      </div>
                      <span className="text-[11px] text-amber-800 font-bold block mt-0.5">
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
