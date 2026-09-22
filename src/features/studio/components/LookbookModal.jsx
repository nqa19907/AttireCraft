import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Check, 
  ShieldCheck, 
  QrCode
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

export default function LookbookModal({
  isOpen,
  onClose,
  outfit,
  palette,
  bottom,
  gender,
  culturalAlert
}) {
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [creatorName, setCreatorName] = useState('Gen Z Heritage Stylist');
  const [lookbookTitle, setLookbookTitle] = useState(`${outfit.name} Remix`);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });

      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#FAF7F2'
      });
      
      const link = document.createElement('a');
      link.download = `VietPhucRemix-${outfit.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export lookbook card', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyShareText = () => {
    const text = `✨ Xem bản phối "${lookbookTitle}" trên Việt Phục Remix - Gen Z Heritage Studio! #VietPhucRemix #GenZHeritage #CoPhucVietNam #AoNguThan`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-heritage-paper rounded-3xl border-2 border-heritage-gold shadow-2xl p-5 sm:p-6 overflow-hidden my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-heritage-paper-aged text-heritage-charcoal hover:bg-heritage-red hover:text-white transition-all z-10 shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold tracking-widest uppercase text-heritage-red px-2.5 py-0.5 rounded-full bg-heritage-red/10 border border-heritage-red/25">
            Thẻ Thời Trang Kỹ Thuật Số
          </span>
          <h2 className="font-serif-heritage font-bold text-xl sm:text-2xl text-heritage-charcoal mt-1.5">
            Xuất Thẻ Lookbook Heritage Card
          </h2>
          <p className="text-xs text-heritage-charcoal-muted mt-0.5">
            Lưu ảnh độ phân giải cao để khoe lên Instagram Story hoặc TikTok
          </p>
        </div>

        {/* Editable Title & Creator */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-3.5 text-xs sm:text-sm">
          <input
            type="text"
            value={lookbookTitle}
            onChange={(e) => setLookbookTitle(e.target.value)}
            className="w-full sm:flex-1 bg-white border border-heritage-gold/40 rounded-xl px-3 py-1.5 font-bold text-heritage-charcoal outline-none focus:border-heritage-red shadow-sm text-xs sm:text-sm"
            placeholder="Tên bản phối..."
          />
          <input
            type="text"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            className="w-full sm:w-44 bg-white border border-heritage-gold/40 rounded-xl px-3 py-1.5 font-medium text-heritage-charcoal outline-none focus:border-heritage-red shadow-sm text-xs sm:text-sm"
            placeholder="Tên Stylist..."
          />
        </div>

        {/* THE LOOKBOOK CARD TO BE EXPORTED AS IMAGE */}
        <div 
          ref={cardRef}
          className="relative bg-white rounded-2xl p-5 border-2 border-heritage-gold shadow-md overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(${palette.primary}15 1.5px, transparent 1.5px)`,
            backgroundSize: '16px 16px'
          }}
        >
          {/* Decorative Corner Seals */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-heritage-red" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-heritage-red" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-heritage-red" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-heritage-red" />

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-heritage-gold/30 pb-2.5 mb-3">
            <div>
              <span className="text-[10px] font-bold text-heritage-gold-dark uppercase tracking-widest block">
                VIỆT PHỤC REMIX • GEN Z HERITAGE
              </span>
              <h3 className="font-serif-heritage font-black text-base sm:text-lg text-heritage-charcoal leading-tight mt-0.5">
                {lookbookTitle}
              </h3>
            </div>

            {/* Red Stamp Seal */}
            <div className="w-10 h-10 rounded-xl border-2 border-heritage-red flex flex-col items-center justify-center text-heritage-red rotate-3 font-serif-heritage shadow-sm bg-heritage-red/5">
              <span className="text-[7px] font-black">CỔ PHỤC</span>
              <span className="text-[9px] font-black">2026</span>
            </div>
          </div>

          {/* Card Content Details */}
          <div className="grid grid-cols-2 gap-3 text-xs mb-3">
            
            {/* Left: Outfit breakdown */}
            <div className="space-y-1.5">
              <div>
                <span className="text-heritage-charcoal-muted text-[10px] block">Trang phục chính:</span>
                <span className="font-bold text-heritage-charcoal text-xs sm:text-[13px]">{outfit.name}</span>
              </div>

              <div>
                <span className="text-heritage-charcoal-muted text-[10px] block">Quần / Chân váy:</span>
                <span className="font-medium text-heritage-charcoal text-xs">{bottom.name}</span>
              </div>

              <div>
                <span className="text-heritage-charcoal-muted text-[10px] block">Bản phối Ngũ Hành:</span>
                <span className="font-bold text-heritage-red text-xs">{palette.elementVi}</span>
              </div>
            </div>

            {/* Right: Palettes & Cultural Stamp */}
            <div className="flex flex-col justify-between items-end text-right">
              <div>
                <span className="text-heritage-charcoal-muted text-[10px] block mb-1">Mã Màu Di Sản:</span>
                <div className="flex items-center gap-1.5 justify-end">
                  <div className="w-4 h-4 rounded-full border border-black/15 shadow-sm" style={{ backgroundColor: palette.primary }} />
                  <div className="w-4 h-4 rounded-full border border-black/15 shadow-sm" style={{ backgroundColor: palette.secondary }} />
                  <div className="w-4 h-4 rounded-full border border-black/15 shadow-sm" style={{ backgroundColor: palette.accent }} />
                </div>
              </div>

              <div className="mt-1.5 bg-heritage-paper-aged px-2.5 py-1 rounded-lg border border-heritage-gold/25 text-[11px]">
                <span className="text-heritage-gold-dark font-bold">Hòa sắc: </span>
                <span className="font-black text-heritage-red">{palette.harmonyScore}/100</span>
              </div>
            </div>

          </div>

          {/* Cultural Certification Badge */}
          <div className="py-1.5 px-2.5 rounded-xl bg-heritage-paper border border-heritage-gold/30 flex items-center justify-between text-[11px] mb-3">
            <span className="flex items-center gap-1 font-semibold text-heritage-charcoal">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {culturalAlert ? 'Lưu ý chuẩn mực di sản' : 'Chứng nhận chuẩn mực di sản 100%'}
            </span>
            <span className="text-heritage-charcoal-muted font-medium">
              Model: {gender === 'female' ? 'Nữ' : 'Nam'}
            </span>
          </div>

          {/* Card Footer: Stylist & QR Mock */}
          <div className="flex items-center justify-between border-t border-heritage-gold/25 pt-2 text-[11px]">
            <div>
              <span className="text-heritage-charcoal-muted text-[10px]">Stylist sáng tạo:</span>
              <p className="font-bold text-heritage-charcoal text-xs">{creatorName}</p>
              <span className="text-[9px] text-heritage-gold-dark font-medium">#VietPhucRemix #GenZHeritage</span>
            </div>

            <div className="flex items-center gap-1 text-heritage-charcoal-muted">
              <QrCode className="w-7 h-7 text-heritage-charcoal" />
              <div className="text-[8px] leading-tight">
                <span>QUÉT MÃ</span>
                <br />
                <strong>TRẢI NGHIỆM</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 mt-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-heritage-red hover:bg-heritage-red-lacquer text-white font-bold text-xs sm:text-[13px] shadow-heritage-glow hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Đang xuất ảnh...' : 'Tải Thẻ Lookbook (.PNG)'}</span>
          </button>

          <button
            onClick={handleCopyShareText}
            className="flex items-center gap-1.5 py-2.5 px-4 rounded-2xl bg-white hover:bg-heritage-paper-aged text-heritage-charcoal font-semibold text-xs sm:text-[13px] border border-heritage-gold/40 transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép!' : 'Copy Caption'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
