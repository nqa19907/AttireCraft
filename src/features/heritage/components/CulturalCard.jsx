import React from 'react';
import { 
  BookOpen, 
  ShieldAlert, 
  ShieldCheck, 
  Award, 
  Compass, 
  Scroll, 
  HeartHandshake 
} from 'lucide-react';

export default function CulturalCard({ outfit, culturalAlert }) {
  return (
    <div className="w-full rounded-3xl glass-panel p-5 sm:p-6 border border-heritage-gold/35 shadow-lg space-y-4">
      
      {/* Header: Cultural Wisdom */}
      <div className="flex items-center justify-between border-b border-heritage-gold/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-heritage-red/10 text-heritage-red border border-heritage-red/25 shadow-sm">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-heritage font-bold text-base sm:text-lg text-heritage-charcoal flex items-center gap-2">
              Góc Di Sản: {outfit.name}
            </h3>
            <p className="text-xs text-heritage-gold-dark font-medium">
              Kiến thức cổ phục & Giá trị biểu trưng của cha ông ngàn đời
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-gold/15 text-heritage-charcoal-dark text-xs font-semibold border border-heritage-gold/30 shadow-sm">
          <Scroll className="w-3.5 h-3.5 text-heritage-gold-dark" />
          Niên đại: {outfit.era.split('(')[0]}
        </span>
      </div>

      {/* Cultural Wisdom Content Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
        
        {/* Card 1: Nguồn gốc & Niên đại */}
        <div className="p-3.5 rounded-2xl bg-white/75 border border-heritage-gold/25 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-heritage-indigo font-bold text-xs sm:text-sm">
            <Compass className="w-4 h-4" />
            <span>Nguồn Gốc & Thời Đại</span>
          </div>
          <p className="text-heritage-charcoal font-semibold leading-relaxed">
            {outfit.era}
          </p>
          <p className="text-heritage-charcoal-muted leading-relaxed">
            {outfit.description}
          </p>
        </div>

        {/* Card 2: Ý nghĩa Triết học & Nhân sinh */}
        <div className="p-3.5 rounded-2xl bg-white/75 border border-heritage-gold/25 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-heritage-red font-bold text-xs sm:text-sm">
            <Award className="w-4 h-4" />
            <span>Triết Lý Biểu Trưng</span>
          </div>
          <p className="text-heritage-charcoal font-semibold leading-relaxed">
            {outfit.symbolism}
          </p>
          <div className="pt-0.5 flex items-center gap-1 text-[11px] text-heritage-gold-dark font-semibold">
            <span>Hoa văn gốc:</span>
            <span className="text-heritage-charcoal font-medium">{outfit.pattern}</span>
          </div>
        </div>

        {/* Card 3: Cẩm nang Phối Gen Z Văn Minh */}
        <div className="p-3.5 rounded-2xl bg-white/75 border border-heritage-gold/25 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-heritage-gold-dark font-bold text-xs sm:text-sm">
            <HeartHandshake className="w-4 h-4" />
            <span>Tinh Thần Phối Gen Z Văn Minh</span>
          </div>
          <p className="text-heritage-charcoal-muted leading-relaxed">
            Sáng tạo tự do với phụ kiện hiện đại nhưng <strong className="text-heritage-charcoal font-semibold">luôn giữ cấu trúc cổ áo nghiêm cẩn và chiều dài tà trang nhã</strong>.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-250 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Bối cảnh: {outfit.idealOccasions.join(', ')}</span>
          </div>
        </div>

      </div>

      {/* Cultural Safety Engine Status Bar */}
      {culturalAlert ? (
        <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/50 flex items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2.5 text-amber-950">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-bold text-amber-900">{culturalAlert.title}</span>
              <span className="text-amber-900 ml-1.5 hidden sm:inline">{culturalAlert.message}</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-amber-300 text-amber-950 font-bold text-[11px] whitespace-nowrap shadow-sm">
            Cần điều chỉnh
          </span>
        </div>
      ) : (
        <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">
              Bản phối đạt chuẩn mực thẩm mỹ & giá trị văn hóa di sản nước Việt.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] whitespace-nowrap">
            100% An Toàn Văn Hóa
          </span>
        </div>
      )}

    </div>
  );
}
