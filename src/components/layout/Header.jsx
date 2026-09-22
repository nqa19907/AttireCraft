import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Music, 
  Camera, 
  Coffee, 
  GraduationCap, 
  RotateCcw, 
  Dices, 
  Share2, 
  User, 
  MapPin, 
  CloudSun 
} from 'lucide-react';
import { CONTEXT_FILTERS } from '../../features/studio/data/filters';

export default function Header({
  selectedEvent,
  setSelectedEvent,
  selectedRegion,
  setSelectedRegion,
  selectedWeather,
  setSelectedWeather,
  gender,
  setGender,
  onRandomize,
  onResetTraditional,
  onOpenLookbookModal
}) {
  const getEventIcon = (iconName) => {
    switch(iconName) {
      case 'Sparkles': return <Sparkles className="w-3.5 h-3.5" />;
      case 'Flame': return <Flame className="w-3.5 h-3.5" />;
      case 'Music': return <Music className="w-3.5 h-3.5" />;
      case 'Camera': return <Camera className="w-3.5 h-3.5" />;
      case 'Coffee': return <Coffee className="w-3.5 h-3.5" />;
      case 'GraduationCap': return <GraduationCap className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-heritage-gold/30 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-heritage-red via-heritage-red-lacquer to-heritage-red-dark text-heritage-gold shadow-heritage-glow border border-heritage-gold/50 flex-shrink-0">
              <span className="font-serif-heritage font-bold text-xl tracking-wider">VP</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-heritage-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-heritage-gold"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-heritage font-bold text-xl sm:text-2xl text-heritage-charcoal tracking-tight flex items-center gap-1.5">
                  Việt Phục <span className="text-heritage-red underline decoration-heritage-gold decoration-2 underline-offset-4">Remix</span>
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase bg-heritage-red/10 text-heritage-red rounded-full border border-heritage-red/25">
                  Gen Z Studio
                </span>
              </div>
              <p className="text-xs text-heritage-charcoal-muted hidden sm:block font-medium mt-0.5">
                Di Sản Cổ Phục Ngàn Năm × Tinh Thần Thời Trang Đương Đại
              </p>
            </div>
          </div>

          {/* Action Center */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
            
            {/* Gender Toggle */}
            <div className="flex items-center bg-heritage-paper-aged/90 p-0.5 rounded-xl border border-heritage-gold/30 text-xs shadow-sm">
              <button
                onClick={() => setGender('female')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  gender === 'female'
                    ? 'bg-heritage-red text-white shadow-sm'
                    : 'text-heritage-charcoal-muted hover:text-heritage-charcoal'
                }`}
                title="Ma-nơ-canh Nữ"
              >
                <User className="w-3.5 h-3.5" />
                <span>Nữ</span>
              </button>
              <button
                onClick={() => setGender('male')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  gender === 'male'
                    ? 'bg-heritage-indigo text-white shadow-sm'
                    : 'text-heritage-charcoal-muted hover:text-heritage-charcoal'
                }`}
                title="Ma-nơ-canh Nam"
              >
                <User className="w-3.5 h-3.5" />
                <span>Nam</span>
              </button>
            </div>

            {/* Random Gieo Quẻ */}
            <button
              onClick={onRandomize}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-bold bg-gradient-to-r from-heritage-gold via-amber-400 to-amber-500 text-heritage-charcoal-dark shadow-sm hover:shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all border border-heritage-gold-dark/30"
              title="Ngẫu nhiên phối đồ kiểu Gen Z cực độc đáo"
            >
              <Dices className="w-3.5 h-3.5 text-heritage-charcoal animate-bounce" />
              <span>Gieo Quẻ</span>
            </button>

            {/* Reset Traditional */}
            <button
              onClick={onResetTraditional}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-heritage-charcoal-muted hover:text-heritage-red hover:bg-heritage-paper-aged transition-all border border-transparent hover:border-heritage-red/25"
              title="Đưa về trang phục nguyên bản truyền thống"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Về Gốc</span>
            </button>

            {/* Export Lookbook Card */}
            <button
              onClick={onOpenLookbookModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-bold bg-heritage-red text-white hover:bg-heritage-red-lacquer shadow-heritage-glow hover:scale-[1.02] active:scale-[0.98] transition-all border border-heritage-gold/30"
            >
              <Share2 className="w-3.5 h-3.5 text-heritage-gold" />
              <span>Xuất Lookbook</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-2.5 pt-2 border-t border-heritage-gold/15 flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Events Filter Scrollable */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar w-full lg:w-auto">
            <span className="text-[11px] sm:text-xs font-bold text-heritage-gold-dark uppercase tracking-wider whitespace-nowrap mr-1">
              Bối cảnh:
            </span>
            {CONTEXT_FILTERS.events.map((evt) => (
              <button
                key={evt.id}
                onClick={() => setSelectedEvent(evt.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full whitespace-nowrap text-xs transition-all ${
                  selectedEvent === evt.id
                    ? 'bg-heritage-charcoal text-white font-bold shadow-sm'
                    : 'bg-white/75 hover:bg-white text-heritage-charcoal-muted border border-heritage-gold/25 hover:text-heritage-charcoal'
                }`}
              >
                {getEventIcon(evt.icon)}
                <span>{evt.label}</span>
              </button>
            ))}
          </div>

          {/* Region & Weather selects */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1 text-heritage-charcoal-muted bg-white/80 px-2.5 py-1 rounded-lg border border-heritage-gold/25 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-heritage-red flex-shrink-0" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent text-xs font-semibold text-heritage-charcoal outline-none cursor-pointer"
              >
                {CONTEXT_FILTERS.regions.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 text-heritage-charcoal-muted bg-white/80 px-2.5 py-1 rounded-lg border border-heritage-gold/25 shadow-sm">
              <CloudSun className="w-3.5 h-3.5 text-heritage-gold-dark flex-shrink-0" />
              <select
                value={selectedWeather}
                onChange={(e) => setSelectedWeather(e.target.value)}
                className="bg-transparent text-xs font-semibold text-heritage-charcoal outline-none cursor-pointer"
              >
                {CONTEXT_FILTERS.weather.map(w => (
                  <option key={w.id} value={w.id}>{w.label}</option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
