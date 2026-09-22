import React from 'react';

export default function OutfitIllustration({
  outfit,
  effectiveBottom,
  primaryColor,
  secondaryColor,
  accentColor,
  gender,
  hasTraditional,
  hasModern,
}) {
  return (
        <svg 
          viewBox="0 0 440 600" 
          className="w-full h-full max-h-[600px] drop-shadow-2xl transition-all duration-500"
        >
          <defs>
            {/* Realistic Light & Shading Gradients */}
            <radialGradient id="bodySkinTone" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFF2E8" />
              <stop offset="65%" stopColor="#F5D2B8" />
              <stop offset="100%" stopColor="#E2B495" />
            </radialGradient>

            <linearGradient id="bodySkinShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D2B8" />
              <stop offset="100%" stopColor="#D99E7D" />
            </linearGradient>

            <linearGradient id="hairSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1919" />
              <stop offset="50%" stopColor="#382E2D" />
              <stop offset="100%" stopColor="#141011" />
            </linearGradient>

            {/* Silk Jacquard / Brocade Realistic Patterns */}
            <pattern id="brocadePattern" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M15,2 Q22,8 15,15 Q8,8 15,2 Z" fill="none" stroke="#FAF7F2" strokeWidth="0.8" opacity="0.18"/>
              <path d="M15,15 Q22,22 15,28 Q8,22 15,15 Z" fill="none" stroke="#FAF7F2" strokeWidth="0.8" opacity="0.18"/>
              <circle cx="15" cy="15" r="2" fill="#D4AF37" opacity="0.25"/>
            </pattern>

            <pattern id="cloudEmbroidery" width="50" height="40" patternUnits="userSpaceOnUse">
              <path d="M10,25 C10,18, 22,14, 28,19 C34,14, 44,18, 42,26 C38,32, 16,33, 10,25 Z" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.28"/>
              <path d="M15,23 Q22,18 28,21" fill="none" stroke="#FAF7F2" strokeWidth="0.6" opacity="0.25"/>
            </pattern>

            {/* 3D Button Specular Gradient */}
            <radialGradient id="goldButton3D" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FFF3B0" />
              <stop offset="45%" stopColor="#D4AF37" />
              <stop offset="85%" stopColor="#966E1E" />
              <stop offset="100%" stopColor="#573D0A" />
            </radialGradient>

            <radialGradient id="pearl3D" cx="30%" cy="25%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F5F3EF" />
              <stop offset="85%" stopColor="#D6CEC2" />
              <stop offset="100%" stopColor="#A89E90" />
            </radialGradient>

            {/* Garment 3D Volume Gradient */}
            <linearGradient id="robeVolume" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
              <stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.02" />
              <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
            </linearGradient>

            <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1A1A1A" floodOpacity="0.22" />
            </filter>

            <filter id="softGlow2" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP ART DISC & PEDESTAL */}
          <g id="backdrop-art">
            <ellipse cx="220" cy="565" rx="120" ry="16" fill="#1C1819" opacity="0.12" />
            <ellipse cx="220" cy="565" rx="90" ry="10" fill="#9E2A2B" opacity="0.08" />

            {/* Sun/Moon Traditional Backdrop Disc */}
            <circle cx="220" cy="270" r="185" fill="#FAF7F2" stroke="#E0A96D" strokeWidth="2" strokeDasharray="5 3" opacity="0.75"/>
            <circle cx="220" cy="270" r="170" fill={primaryColor} opacity="0.07"/>
            <circle cx="220" cy="270" r="168" fill="url(#brocadePattern)" opacity="0.4"/>
          </g>

          {/* REALISTIC MANNEQUIN BODY BASE */}
          <g id="realistic-body">
            {/* Collarbone & Upper Chest */}
            <path d="M190,140 Q220,152 250,140" stroke="#DFAC8B" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
            
            {/* Neck with 3D cylindrical shadow */}
            <rect x="210" y="112" width="20" height="32" rx="6" fill="url(#bodySkinTone)" />
            <path d="M225,112 L230,144 L220,144 Z" fill="#D99E7D" opacity="0.35" />

            {/* Face / Head with refined graceful Asian contours */}
            <path 
              d={gender === 'female' 
                ? "M200,68 C200,42 240,42 240,68 C240,96 226,116 220,117 C214,116 200,96 200,68 Z"
                : "M198,66 C198,40 242,40 242,66 C242,98 228,118 220,119 C212,118 198,98 198,66 Z"
              } 
              fill="url(#bodySkinTone)" 
              filter="url(#cardShadow)"
            />

            {/* Realistic Ears with contour */}
            <path d="M198,74 Q193,82 198,90 Q201,84 198,74 Z" fill="#F0C5A8" />
            <path d="M242,74 Q247,82 242,90 Q239,84 242,74 Z" fill="#F0C5A8" />

            {/* Pearl Earring for female */}
            {gender === 'female' && (
              <g id="earrings">
                <circle cx="196" cy="91" r="2.5" fill="url(#pearl3D)" />
                <circle cx="244" cy="91" r="2.5" fill="url(#pearl3D)" />
              </g>
            )}

            {/* Detailed Expressive Facial Features */}
            <g id="facial-features">
              {/* Eyebrows - delicate, arching */}
              <path d="M206,73 Q212,70 217,73" stroke="#3A2D27" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
              <path d="M223,73 Q228,70 234,73" stroke="#3A2D27" strokeWidth="1.8" strokeLinecap="round" fill="none"/>

              {/* Eyes with eyelid fold, pupil and specular reflection highlight */}
              {/* Left Eye */}
              <path d="M207,78 Q212,75 216,78" stroke="#3A2D27" strokeWidth="1.2" fill="none" opacity="0.6"/>
              <ellipse cx="211.5" cy="80.5" rx="3.5" ry="2.2" fill="#201511" />
              <circle cx="211" cy="79.8" r="0.8" fill="#FFFFFF" />
              <path d="M206,80 Q211.5,83.5 217,80" stroke="#2B1D17" strokeWidth="1.8" strokeLinecap="round" fill="none"/>

              {/* Right Eye */}
              <path d="M224,78 Q228,75 233,78" stroke="#3A2D27" strokeWidth="1.2" fill="none" opacity="0.6"/>
              <ellipse cx="228.5" cy="80.5" rx="3.5" ry="2.2" fill="#201511" />
              <circle cx="228" cy="79.8" r="0.8" fill="#FFFFFF" />
              <path d="M223,80 Q228.5,83.5 234,80" stroke="#2B1D17" strokeWidth="1.8" strokeLinecap="round" fill="none"/>

              {/* Nose with 3D bridge and soft nostrils */}
              <path d="M219,77 L220,88 Q222,90 224,89" stroke="#CF9877" strokeWidth="1.4" strokeLinecap="round" fill="none"/>

              {/* Natural Shaded Lips with Cupids bow */}
              <path d="M214,97 Q220,95 226,97 Q220,102 214,97 Z" fill="#C2595B" />
              <path d="M215,97 Q220,98.5 225,97" stroke="#8E2D30" strokeWidth="0.8" fill="none"/>
              <ellipse cx="220" cy="98.2" rx="2" ry="0.8" fill="#F8A5A7" opacity="0.6" />
            </g>

            {/* Hair with rich texture & sheen */}
            {gender === 'female' ? (
              <g id="female-hair-detailed">
                {/* Traditional hair bun / Tóc búi cao sang trọng */}
                <ellipse cx="220" cy="42" rx="18" ry="12" fill="url(#hairSheen)" />
                <path d="M206,42 Q220,34 234,42" stroke="#4A3B39" strokeWidth="1.5" fill="none"/>
                
                {/* Hair hairline and sleek framing */}
                <path d="M196,70 C196,38 244,38 244,70 C244,77 241,86 238,90 C234,58 206,58 202,90 C199,86 196,77 196,70 Z" fill="url(#hairSheen)" />
                {/* Hair strands shine */}
                <path d="M202,52 Q220,44 238,52" stroke="#5E4E4C" strokeWidth="1.2" fill="none" opacity="0.6"/>
              </g>
            ) : (
              <g id="male-hair-detailed">
                {/* Modern clean high-and-tight heritage style */}
                <path d="M197,68 C197,38 243,38 243,68 C243,74 240,80 238,82 C234,56 206,56 202,82 C200,80 197,74 197,68 Z" fill="url(#hairSheen)" />
                <path d="M204,50 Q220,42 236,50" stroke="#5E4E4C" strokeWidth="1.5" fill="none" opacity="0.6"/>
              </g>
            )}
          </g>

          {/* INNER LAYER (ÁO LÓT TRẮNG CỔ THÌA HOẶC YẾM ĐÀO THẮM) */}
          <g id="inner-layer-detailed">
            {outfit.id === 'ao_tu_than' ? (
              <g id="yem-dao-kinh-bac">
                {/* Yếm Đào Sen Thắm */}
                <path d="M204,130 Q220,120 236,130 L248,205 Q220,222 192,205 Z" fill="#D81E43" />
                <path d="M204,130 Q220,120 236,130" stroke="#FAF7F2" strokeWidth="2.5" fill="none"/>
                {/* Yếm strings */}
                <path d="M204,130 L214,118 M236,130 L226,118" stroke="#D81E43" strokeWidth="2"/>
                {/* Yếm embroidery flower */}
                <circle cx="220" cy="165" r="4.5" fill="#FAF7F2" opacity="0.7"/>
                <circle cx="220" cy="165" r="2" fill="#D4AF37"/>
              </g>
            ) : (
              <g id="ao-lot-co-thia">
                {/* Cổ áo lót trắng bên trong theo đúng quy thức */}
                <path d="M208,126 L220,140 L232,126 L232,145 L208,145 Z" fill="#FAF7F2" stroke="#DFD7CA" strokeWidth="1"/>
                <path d="M208,126 L220,140" stroke="#ECE5DB" strokeWidth="1.5"/>
              </g>
            )}
          </g>

          {/* REALISTIC BOTTOMS / QUẦN & VÁY */}
          <g id="bottom-detailed">
            {effectiveBottom.id === 'quan_lua_trang' && (
              <g id="quan-lua-trang-thung">
                {/* Quần thụng lụa trắng nếp gấp bồng bềnh */}
                <path d="M182,280 L168,525 Q194,534 216,525 L218,350 L222,350 L224,525 Q246,534 272,525 L258,280 Z" fill="#FAF7F2" stroke="#D8CEBE" strokeWidth="1.5"/>
                {/* Silk drapery fold lines */}
                <path d="M192,295 Q184,410 180,520" stroke="#E6DDD0" strokeWidth="2" fill="none"/>
                <path d="M206,305 Q204,420 206,522" stroke="#E6DDD0" strokeWidth="1.5" fill="none"/>
                <path d="M248,295 Q256,410 260,520" stroke="#E6DDD0" strokeWidth="2" fill="none"/>
                <path d="M234,305 Q236,420 234,522" stroke="#E6DDD0" strokeWidth="1.5" fill="none"/>
              </g>
            )}

            {effectiveBottom.id === 'quan_dui_den' && (
              <g id="quan-dui-den-suong">
                <path d="M182,280 L168,525 Q194,534 216,525 L218,350 L222,350 L224,525 Q246,534 272,525 L258,280 Z" fill="#1C1A1D" stroke="#38343A" strokeWidth="1.5"/>
                {/* Fabric sheen and fold */}
                <path d="M192,295 Q184,410 180,520" stroke="#333036" strokeWidth="2" fill="none"/>
                <path d="M248,295 Q256,410 260,520" stroke="#333036" strokeWidth="2" fill="none"/>
              </g>
            )}

            {effectiveBottom.id === 'vay_dup_den' && (
              <g id="vay-dup-bac-bo">
                <path d="M185,270 L158,520 Q220,540 282,520 L255,270 Z" fill="#201C1E" stroke="#3D373A" strokeWidth="1.5"/>
                {/* Deep pleats */}
                <path d="M195,280 Q188,400 180,522" stroke="#3A3236" strokeWidth="2.5" fill="none"/>
                <path d="M220,280 L220,528" stroke="#3A3236" strokeWidth="2" fill="none"/>
                <path d="M245,280 Q252,400 260,522" stroke="#3A3236" strokeWidth="2.5" fill="none"/>
              </g>
            )}

            {effectiveBottom.id === 'quan_jeans_baggy' && (
              <g id="jeans-baggy-genz">
                <path d="M182,280 L164,515 Q192,524 215,516 L218,345 L222,345 L225,516 Q248,524 276,515 L258,280 Z" fill="#3D5A80" stroke="#253852" strokeWidth="2"/>
                {/* Stonewash fading & distress details */}
                <path d="M180,380 Q195,378 200,380 M182,386 Q194,384 198,386" stroke="#90B4CE" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M240,430 Q255,428 260,430 M242,436 Q254,434 258,436" stroke="#90B4CE" strokeWidth="2.2" strokeLinecap="round"/>
                {/* Contrast gold denim stitching */}
                <line x1="218" y1="285" x2="218" y2="345" stroke="#E0A96D" strokeWidth="1.5" strokeDasharray="3 2"/>
                <path d="M165,512 L215,512 M225,512 L275,512" stroke="#E0A96D" strokeWidth="1.5" strokeDasharray="3 2"/>
              </g>
            )}

            {effectiveBottom.id === 'chan_vay_xep_ly' && (
              <g id="chan-vay-pleated">
                <path d="M185,275 L162,522 Q220,538 278,522 L255,275 Z" fill="#2E2C33" stroke="#44414B" strokeWidth="1.5"/>
                {[175, 185, 195, 205, 215, 225, 235, 245, 255, 265].map((x, idx) => (
                  <line key={idx} x1={x + (x - 220)*0.1} y1="280" x2={x + (x - 220)*0.28} y2="524" stroke="#4A4753" strokeWidth="1.8"/>
                ))}
              </g>
            )}

            {effectiveBottom.id === 'quan_short_ngan' && (
              <g id="shorts-mini-risk">
                {/* Exposed Legs */}
                <rect x="190" y="330" width="22" height="195" rx="9" fill="url(#bodySkinTone)" stroke="#DFAC8B" strokeWidth="1"/>
                <rect x="228" y="330" width="22" height="195" rx="9" fill="url(#bodySkinTone)" stroke="#DFAC8B" strokeWidth="1"/>
                {/* Knee joints */}
                <circle cx="201" cy="435" r="5" fill="#E2B495" opacity="0.4"/>
                <circle cx="239" cy="435" r="5" fill="#E2B495" opacity="0.4"/>
                {/* Hotpants */}
                <path d="M182,280 L178,340 Q200,345 216,340 L219,320 L221,320 L224,340 Q240,345 262,340 L258,280 Z" fill="#E11D48" stroke="#9F1239" strokeWidth="1.8"/>
              </g>
            )}
          </g>

          {/* MAIN ATTIRE (TRANG PHỤC GỐC CHI TIẾT CAO CẤP) */}
          <g id="main-attire-realistic">
            
            {/* 1. ÁO NGŨ THÂN TAY CHẼN */}
            {outfit.id === 'ngu_than_chen' && (
              <g id="real-ngu-than-chen">
                {/* Main Body Robe with 3D gradient and brocade */}
                <path 
                  d="M205,124 L154,160 L146,290 L166,298 L174,215 L176,455 Q220,468 264,455 L266,215 L274,298 L294,290 L286,160 L235,124 Z" 
                  fill={primaryColor} 
                  stroke={secondaryColor} 
                  strokeWidth="2"
                  filter="url(#cardShadow)"
                />
                
                {/* Cloud & Lotus Embroidery pattern overlay */}
                <path 
                  d="M176,215 L176,455 Q220,468 264,455 L264,215 Z" 
                  fill="url(#cloudEmbroidery)"
                />
                
                {/* 3D volume lighting gradient */}
                <path 
                  d="M176,215 L176,455 Q220,468 264,455 L264,215 Z" 
                  fill="url(#robeVolume)"
                />

                {/* Standing Mandarin Collar (Cổ đứng 2.5cm chuẩn mực triều đình) */}
                <path d="M206,124 Q220,118 234,124 L234,113 Q220,107 206,113 Z" fill={primaryColor} stroke="#D4AF37" strokeWidth="2"/>
                {/* Inner white collar line (Cổ trắng bên trong) */}
                <path d="M208,113 Q220,110 232,113" stroke="#FAF7F2" strokeWidth="2.5" fill="none"/>

                {/* Right Lapel / Vạt Hữu may lượn cài 5 cúc bên nách hữu */}
                <path d="M220,124 Q240,160 244,205 L244,456" stroke="#D4AF37" strokeWidth="2.2" fill="none"/>
                
                {/* 5 Cúc Vàng Ngũ Thường 3D Specular Highlight */}
                {[
                  {cx: 220, cy: 122},
                  {cx: 233, cy: 142},
                  {cx: 242, cy: 172},
                  {cx: 244, cy: 205},
                  {cx: 244, cy: 250}
                ].map((btn, i) => (
                  <g key={i}>
                    <circle cx={btn.cx} cy={btn.cy} r="3.8" fill="url(#goldButton3D)" stroke="#573D0A" strokeWidth="0.8"/>
                    <circle cx={btn.cx - 1} cy={btn.cy - 1} r="1.2" fill="#FFFFFF" opacity="0.8"/>
                  </g>
                ))}

                {/* Tay Chẽn (cổ tay ôm sát gọn gàng) */}
                <path d="M154,160 L146,290 L166,298 L174,215" fill={primaryColor} stroke="#D4AF37" strokeWidth="1.2"/>
                <path d="M286,160 L294,290 L274,298 L266,215" fill={primaryColor} stroke="#D4AF37" strokeWidth="1.2"/>
                
                {/* Gold Trimming at hem */}
                <path d="M176,455 Q220,468 264,455" stroke="#D4AF37" strokeWidth="3.5" fill="none"/>
              </g>
            )}

            {/* 2. ÁO TẤC (NGŨ THÂN TAY THỤNG CUNG ĐÌNH) */}
            {outfit.id === 'ao_tac' && (
              <g id="real-ao-tac">
                {/* Vast Sweeping Sleeves (Ống tay thụng rộng thướt tha dài quá gối) */}
                {/* Left Sleeve */}
                <path d="M195,130 L115,190 L106,425 Q135,448 168,415 L172,225 Z" fill={primaryColor} stroke="#D4AF37" strokeWidth="2.2" filter="url(#cardShadow)"/>
                <path d="M115,190 L106,425 Q135,448 168,415 L172,225 Z" fill="url(#cloudEmbroidery)"/>
                
                {/* Right Sleeve */}
                <path d="M245,130 L325,190 L334,425 Q305,448 272,415 L268,225 Z" fill={primaryColor} stroke="#D4AF37" strokeWidth="2.2" filter="url(#cardShadow)"/>
                <path d="M325,190 L334,425 Q305,448 272,415 L268,225 Z" fill="url(#cloudEmbroidery)"/>

                {/* Broad Dignified Robe Body */}
                <path d="M205,124 L172,225 L168,475 Q220,488 272,475 L268,225 L235,124 Z" fill={primaryColor} stroke={secondaryColor} strokeWidth="2"/>
                <path d="M172,225 L168,475 Q220,488 272,475 L268,225 Z" fill="url(#brocadePattern)"/>
                <path d="M172,225 L168,475 Q220,488 272,475 L268,225 Z" fill="url(#robeVolume)"/>

                {/* Imperial Standing Collar */}
                <path d="M205,124 Q220,117 235,124 L235,112 Q220,105 205,112 Z" fill={primaryColor} stroke="#D4AF37" strokeWidth="2.5"/>
                <path d="M207,112 Q220,108 233,112" stroke="#FAF7F2" strokeWidth="2.5" fill="none"/>

                {/* Golden Buttons 3D */}
                <path d="M220,124 Q244,165 248,210 L248,476" stroke="#D4AF37" strokeWidth="2.5" fill="none"/>
                {[
                  {cx: 220, cy: 122},
                  {cx: 236, cy: 144},
                  {cx: 245, cy: 174},
                  {cx: 248, cy: 210},
                  {cx: 248, cy: 260}
                ].map((btn, i) => (
                  <g key={i}>
                    <circle cx={btn.cx} cy={btn.cy} r="4.2" fill="url(#goldButton3D)" stroke="#573D0A" strokeWidth="1"/>
                    <circle cx={btn.cx - 1.2} cy={btn.cy - 1.2} r="1.5" fill="#FFFFFF" opacity="0.85"/>
                  </g>
                ))}

                {/* Imperial Dragon/Phoenix Brocade Gold Hem */}
                <path d="M106,425 Q135,448 168,415" stroke="#D4AF37" strokeWidth="4.5" fill="none"/>
                <path d="M334,425 Q305,448 272,415" stroke="#D4AF37" strokeWidth="4.5" fill="none"/>
                <path d="M168,475 Q220,488 272,475" stroke="#D4AF37" strokeWidth="4.5" fill="none"/>
              </g>
            )}

            {/* 3. ÁO TỨ THÂN DÂN GIAN KINH BẮC */}
            {outfit.id === 'ao_tu_than' && (
              <g id="real-ao-tu-than">
                {/* Back Robe drape */}
                <path d="M198,135 L160,175 L154,455 Q220,468 286,455 L280,175 L242,135 Z" fill={primaryColor} opacity="0.95" filter="url(#cardShadow)"/>
                
                {/* Front Lapels (Hai vạt trước xòe lụa) */}
                <path d="M205,135 L182,230 L206,285 L214,435 L196,437 L188,290 L168,230 Z" fill={accentColor} stroke="#9F1239" strokeWidth="1.5"/>
                <path d="M235,135 L258,230 L234,285 L226,435 L244,437 L252,290 L272,230 Z" fill={accentColor} stroke="#9F1239" strokeWidth="1.5"/>
                
                {/* Dải Thắt Lưng Lụa Xanh & Bao Sảo Bay Bổng */}
                <rect x="194" y="250" width="52" height="16" rx="4" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1"/>
                <path d="M216,264 L208,365 L218,368 L224,266 Z" fill="#2D6A4F"/>
                <path d="M224,264 L232,350 L242,353 L230,266 Z" fill="#E0A96D"/>

                {/* Sleeves */}
                <path d="M172,165 L152,280 L170,285 L184,215" fill={primaryColor} stroke="#D4AF37" strokeWidth="1"/>
                <path d="M268,165 L288,280 L270,285 L256,215" fill={primaryColor} stroke="#D4AF37" strokeWidth="1"/>
              </g>
            )}

            {/* 4. ÁO GIAO LĨNH (TRÀNG VẠT ĐẠI VIỆT) */}
            {outfit.id === 'ao_giao_linh' && (
              <g id="real-ao-giao-linh">
                <path d="M200,122 L132,185 L126,365 L160,370 L168,230 L164,480 Q220,494 276,480 L272,230 L280,370 L314,365 L308,185 L240,122 Z" fill={primaryColor} stroke="#D4AF37" strokeWidth="2" filter="url(#cardShadow)"/>
                <path d="M164,230 L164,480 Q220,494 276,480 L272,230 Z" fill="url(#brocadePattern)"/>

                {/* Cổ chéo Giao Lĩnh đặc sắc */}
                <path d="M204,122 L252,220" stroke="#FAF7F2" strokeWidth="6.5" strokeLinecap="square"/>
                <path d="M236,122 L188,220" stroke="#D4AF37" strokeWidth="6.5" strokeLinecap="square"/>

                {/* Dải đai thắt eo phong nhã */}
                <rect x="185" y="245" width="70" height="15" rx="3" fill="#D4AF37" stroke="#966E1E" strokeWidth="1"/>
                <path d="M212,260 L210,385 L218,388 L222,260 Z" fill="#D4AF37"/>
              </g>
            )}

            {/* 5. ÁO BÀ BA NAM BỘ */}
            {outfit.id === 'ao_ba_ba' && (
              <g id="real-ao-ba-ba">
                <path d="M205,126 L164,160 L152,295 L168,299 L176,215 L178,375 L186,375 L184,295 L220,295 L256,295 L254,375 L262,375 L264,215 L272,299 L288,295 L276,160 L235,126 Z" fill={primaryColor} stroke="#5B3A1E" strokeWidth="1.8" filter="url(#cardShadow)"/>
                
                {/* Cổ tim/tròn thanh thoát */}
                <path d="M206,126 Q220,140 234,126" stroke="#3A281A" strokeWidth="2.5" fill="none"/>

                {/* Hàng nút bấm phía trước */}
                <line x1="220" y1="140" x2="220" y2="365" stroke="#FAF7F2" strokeWidth="1.2" strokeDasharray="4 3"/>
                {[155, 185, 215, 245, 275, 305].map((y, i) => (
                  <circle key={i} cx="220" cy={y} r="2.8" fill="#FAF7F2" stroke="#444" strokeWidth="1"/>
                ))}

                {/* Hai túi con trước vạt */}
                <rect x="188" y="310" width="20" height="22" rx="3" fill="none" stroke="#FAF7F2" strokeWidth="1.5"/>
                <rect x="232" y="310" width="20" height="22" rx="3" fill="none" stroke="#FAF7F2" strokeWidth="1.5"/>
              </g>
            )}

          </g>

          {/* TRADITIONAL ACCESSORIES WITH RICH TEXTURES */}
          <g id="real-traditional-accessories">
            {/* Khăn Vấn Nhung Gấm 5-7 Vòng (Đội đầu) */}
            {hasTraditional('khan_van') && (
              <g id="khan-van-real" filter="url(#cardShadow)">
                <path d="M192,66 C192,34 248,34 248,66 C248,72 244,78 241,80 C236,52 204,52 199,80 C196,78 192,72 192,66 Z" fill={primaryColor} stroke="#D4AF37" strokeWidth="1.8"/>
                {/* Multi-layered velvet folds */}
                <path d="M194,54 Q220,42 246,54" stroke="#D4AF37" strokeWidth="1.4" fill="none" opacity="0.9"/>
                <path d="M196,60 Q220,48 244,60" stroke="#FAF7F2" strokeWidth="1" fill="none" opacity="0.7"/>
                <path d="M197,66 Q220,54 243,66" stroke="#D4AF37" strokeWidth="1.4" fill="none" opacity="0.9"/>
                {/* Gold hair pin ornament */}
                <circle cx="220" cy="50" r="3" fill="url(#goldButton3D)"/>
              </g>
            )}

            {/* Nón Quai Thao (Nón Ba Tầm - Đội trực tiếp trên đầu) */}
            {hasTraditional('non_quai_thao') && (
              <g id="non-quai-thao-on-head">
                {/* Drop shadow on forehead */}
                <ellipse cx="220" cy="54" rx="42" ry="9" fill="#1C1819" opacity="0.3" filter="url(#cardShadow)"/>
                
                {/* Quai Thao Dài (Hai dải lụa đỏ thắm buông rủ hai bên má xuống ngực) */}
                <path d="M168,46 Q184,105 190,175 Q193,220 194,260" stroke="#D81E43" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                <ellipse cx="194" cy="264" rx="4" ry="7" fill="#D81E43"/>
                <line x1="194" y1="271" x2="194" y2="282" stroke="#D81E43" strokeWidth="2.5"/>

                <path d="M272,46 Q256,105 250,175 Q247,220 246,260" stroke="#D81E43" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                <ellipse cx="246" cy="264" rx="4" ry="7" fill="#D81E43"/>
                <line x1="246" y1="271" x2="246" y2="282" stroke="#D81E43" strokeWidth="2.5"/>

                {/* Vành Nón Rộng Tròn Đội Cân Đối Trên Đầu */}
                <g filter="url(#cardShadow)">
                  {/* Main flat brim disc */}
                  <ellipse cx="220" cy="40" rx="95" ry="25" fill="#EBD2AC" stroke="#704822" strokeWidth="2.8"/>
                  {/* Woven concentric bamboo patterns */}
                  <ellipse cx="220" cy="40" rx="80" ry="21" fill="none" stroke="#B8905C" strokeWidth="1.5" strokeDasharray="5 3"/>
                  <ellipse cx="220" cy="40" rx="56" ry="15" fill="none" stroke="#CDB085" strokeWidth="1"/>
                  {/* Chóp Nón Giữa Đỉnh Đầu */}
                  <ellipse cx="220" cy="36" rx="22" ry="8" fill="#9C6B3A" stroke="#5C3B19" strokeWidth="1.5"/>
                  <circle cx="220" cy="35" r="3.5" fill="#5C3B19"/>
                </g>
              </g>
            )}

            {/* Nón Lá Huế Thêu Chỉ Sen (Đội trực tiếp trên đầu) */}
            {hasTraditional('non_la') && (
              <g id="non-la-on-head">
                {/* Soft shadow on forehead & hair */}
                <ellipse cx="220" cy="70" rx="36" ry="7" fill="#1C1819" opacity="0.3" filter="url(#cardShadow)"/>
                
                {/* Quai Nón Lụa Buộc Dưới Cằm */}
                <path d="M182,67 Q198,102 218,122" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M258,67 Q242,102 222,122" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <circle cx="220" cy="123" r="2.8" fill="#2D6A4F"/>
                <path d="M220,124 Q216,145 214,168 M220,124 Q225,145 228,165" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" fill="none"/>

                {/* Thân Nón Lá Hình Nón Cân Đối Trên Đỉnh Đầu */}
                <g filter="url(#cardShadow)">
                  {/* Conical body */}
                  <path d="M220,8 L154,66 Q220,76 286,66 Z" fill="#F8EAD0" stroke="#9A7745" strokeWidth="1.8"/>
                  {/* Conical base rim */}
                  <path d="M154,66 Q220,76 286,66 Q220,56 154,66 Z" fill="#EBD2A6" stroke="#9A7745" strokeWidth="1.8"/>
                  
                  {/* Nan tre nón lá tỏa từ chóp */}
                  <line x1="220" y1="8" x2="175" y2="67" stroke="#D4B487" strokeWidth="1"/>
                  <line x1="220" y1="8" x2="198" y2="72" stroke="#D4B487" strokeWidth="1"/>
                  <line x1="220" y1="8" x2="220" y2="74" stroke="#D4B487" strokeWidth="1.2"/>
                  <line x1="220" y1="8" x2="242" y2="72" stroke="#D4B487" strokeWidth="1"/>
                  <line x1="220" y1="8" x2="265" y2="67" stroke="#D4B487" strokeWidth="1"/>
                  
                  {/* Vòng lá kim tuyến đồng tâm */}
                  <path d="M174,48 Q220,56 266,48" stroke="#D4B487" strokeWidth="0.8" fill="none"/>
                  <path d="M190,32 Q220,38 250,32" stroke="#D4B487" strokeWidth="0.8" fill="none"/>

                  {/* Họa tiết đóa sen hồng thêu bài thơ */}
                  <circle cx="236" cy="46" r="4.5" fill="#E11D48" opacity="0.85"/>
                  <circle cx="236" cy="46" r="2.2" fill="#FAF7F2" opacity="0.95"/>
                </g>
              </g>
            )}

            {/* Khăn Rằn Nam Bộ */}
            {hasTraditional('khan_ran') && (
              <g id="khan-ran-real">
                <path d="M204,130 Q220,146 236,130 L242,310 L228,312 L225,152 L215,152 L212,312 L198,310 Z" fill="#ECE5DB" stroke="#2D2826" strokeWidth="1.4"/>
                {[180, 210, 240, 270, 300].map((y, i) => (
                  <g key={i}>
                    <line x1="200" y1={y} x2="212" y2={y} stroke="#2D2826" strokeWidth="2.5"/>
                    <line x1="228" y1={y} x2="240" y2={y} stroke="#2D2826" strokeWidth="2.5"/>
                  </g>
                ))}
              </g>
            )}

            {/* Quạt Xếp Gỗ Trầm Họa Hoa Sen */}
            {hasTraditional('quat_xep') && (
              <g id="quat-xep-real" transform="translate(130, 280) rotate(-22)" filter="url(#cardShadow)">
                <path d="M35,55 L6,16 Q35,0 75,12 L35,55 Z" fill="#FAF7F2" stroke="#8C6D46" strokeWidth="1.5"/>
                {/* Bamboo ribs */}
                {[12, 28, 48, 66].map((x, i) => (
                  <line key={i} x1="35" y1="55" x2={x} y2={10 + Math.abs(x - 35)*0.2} stroke="#A88255" strokeWidth="1.5"/>
                ))}
                {/* Watercolor Lotus Blossom */}
                <circle cx="40" cy="24" r="7" fill="#9E2A2B" opacity="0.85"/>
                <circle cx="40" cy="24" r="3.5" fill="#FAF7F2" opacity="0.9"/>
                {/* Red Silk Tassel */}
                <path d="M35,55 Q38,75 39,90" stroke="#9E2A2B" strokeWidth="2.5" fill="none"/>
              </g>
            )}

            {/* Chuỗi Ngọc Bội Hoàng Gia */}
            {hasTraditional('chuoi_ngoc') && (
              <g id="chuoi-ngoc-real">
                <path d="M208,130 Q220,195 232,130" stroke="#D4AF37" strokeWidth="1.2" fill="none"/>
                {[
                  {cx: 210, cy: 138}, {cx: 212, cy: 152}, {cx: 216, cy: 165},
                  {cx: 220, cy: 172}, // Tâm ngọc bội lớn
                  {cx: 224, cy: 165}, {cx: 228, cy: 152}, {cx: 230, cy: 138}
                ].map((p, i) => (
                  <circle key={i} cx={p.cx} cy={p.cy} r={i === 3 ? "5.5" : "3.6"} fill="url(#pearl3D)" stroke="#D4AF37" strokeWidth="0.8" filter="url(#softGlow2)"/>
                ))}
              </g>
            )}

            {/* Guốc Mộc Quai Nhung */}
            {hasTraditional('guoc_moc') && !hasModern('sneakers_white') && !hasModern('sneakers_jordan') && (
              <g id="guoc-moc-real">
                <rect x="185" y="534" width="26" height="8" rx="2.5" fill="#84532B" stroke="#502E15" strokeWidth="1"/>
                <path d="M190,534 Q198,525 206,534" stroke="#9E2A2B" strokeWidth="4" fill="none"/>
                <rect x="229" y="534" width="26" height="8" rx="2.5" fill="#84532B" stroke="#502E15" strokeWidth="1"/>
                <path d="M234,534 Q242,525 250,534" stroke="#9E2A2B" strokeWidth="4" fill="none"/>
              </g>
            )}
          </g>

          {/* MODERN ACCESSORIES WITH HIGH-TECH FINISH */}
          <g id="real-modern-accessories">
            {/* Sneaker Chunky Trắng Hypebeast */}
            {hasModern('sneakers_white') && (
              <g id="sneakers-chunky-real" filter="url(#cardShadow)">
                {/* Left Shoe */}
                <path d="M180,518 L206,518 L212,544 L174,544 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5"/>
                <rect x="172" y="542" width="42" height="8" rx="3" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5"/>
                <line x1="188" y1="524" x2="200" y2="524" stroke="#9E2A2B" strokeWidth="2.5"/>

                {/* Right Shoe */}
                <path d="M234,518 L260,518 L266,544 L228,544 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5"/>
                <rect x="226" y="542" width="42" height="8" rx="3" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5"/>
                <line x1="242" y1="524" x2="254" y2="524" stroke="#9E2A2B" strokeWidth="2.5"/>
              </g>
            )}

            {/* Sneaker Jordan 1 High-top BRED */}
            {hasModern('sneakers_jordan') && (
              <g id="sneakers-jordan-real" filter="url(#cardShadow)">
                <path d="M180,505 L206,505 L212,544 L174,544 Z" fill="#18181B" stroke="#DC2626" strokeWidth="1.5"/>
                <rect x="172" y="542" width="42" height="8" rx="3" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5"/>
                <path d="M178,522 Q194,518 206,525" stroke="#DC2626" strokeWidth="3.5" fill="none"/>

                <path d="M234,505 L260,505 L266,544 L228,544 Z" fill="#18181B" stroke="#DC2626" strokeWidth="1.5"/>
                <rect x="226" y="542" width="42" height="8" rx="3" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5"/>
                <path d="M234,522 Q250,518 262,525" stroke="#DC2626" strokeWidth="3.5" fill="none"/>
              </g>
            )}

            {/* Kính Râm Tròn Retro Specular Highlight */}
            {hasModern('kinh_ram_tron') && (
              <g id="glasses-round-real" filter="url(#cardShadow)">
                <circle cx="210" cy="80.5" r="7.2" fill="#121214" stroke="#D4AF37" strokeWidth="1.5"/>
                <line x1="206" y1="77" x2="214" y2="84" stroke="#FAF7F2" strokeWidth="1.2" opacity="0.6"/>
                
                <circle cx="230" cy="80.5" r="7.2" fill="#121214" stroke="#D4AF37" strokeWidth="1.5"/>
                <line x1="226" y1="77" x2="234" y2="84" stroke="#FAF7F2" strokeWidth="1.2" opacity="0.6"/>
                
                <line x1="217" y1="80.5" x2="223" y2="80.5" stroke="#D4AF37" strokeWidth="1.5"/>
              </g>
            )}

            {/* Kính Cyber Matrix Y2K */}
            {hasModern('kinh_ram_y2k') && (
              <g id="glasses-y2k-real" filter="url(#cardShadow)">
                <path d="M200,77 L217,81 L214,86 L201,82 Z" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.2"/>
                <path d="M223,81 L240,77 L239,82 L226,86 Z" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.2"/>
                <line x1="217" y1="81" x2="223" y2="81" stroke="#38BDF8" strokeWidth="1.5"/>
              </g>
            )}

            {/* Tai Nghe Over-Ear Bạc Vắt Cổ */}
            {hasModern('tai_nghe_overear') && (
              <g id="headphones-real" filter="url(#cardShadow)">
                <path d="M200,108 Q220,126 240,108" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
                <rect x="191" y="99" width="12" height="18" rx="5" fill="#E2E8F0" stroke="#475569" strokeWidth="1.2"/>
                <rect x="237" y="99" width="12" height="18" rx="5" fill="#E2E8F0" stroke="#475569" strokeWidth="1.2"/>
              </g>
            )}

            {/* Túi Tote Canvas Câu Đối Thư Pháp */}
            {hasModern('tui_tote_canvas') && (
              <g id="tote-real" transform="translate(260, 280)" filter="url(#cardShadow)">
                <path d="M16,-55 Q22,-10 22,12 M38,-55 Q32,-10 32,12" stroke="#C7B9A5" strokeWidth="3" fill="none"/>
                <rect x="8" y="6" width="44" height="56" rx="4" fill="#FAF7F2" stroke="#C8BCAB" strokeWidth="1.5"/>
                <line x1="30" y1="18" x2="30" y2="46" stroke="#9E2A2B" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="30" cy="50" r="3" fill="#9E2A2B"/>
              </g>
            )}

            {/* Túi Da Mini Xích Bạc */}
            {hasModern('tui_mini_crossbody') && (
              <g id="crossbody-real" filter="url(#cardShadow)">
                <path d="M196,138 L250,310" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="4 2"/>
                <rect x="242" y="300" width="28" height="20" rx="4" fill="#18181B" stroke="#A1A1AA" strokeWidth="1.2"/>
                <rect x="253" y="308" width="6" height="5" fill="#FAF7F2"/>
              </g>
            )}

            {/* Choker Bạc */}
            {hasModern('vong_choker_bac') && (
              <g id="choker-real">
                <path d="M210,121 Q220,127 230,121" stroke="#E2E8F0" strokeWidth="2.8" fill="none"/>
                <circle cx="220" cy="125" r="2.2" fill="#FFFFFF"/>
              </g>
            )}

            {/* Áo Khoác Denim Oversize */}
            {hasModern('ao_khoac_denim') && (
              <g id="denim-real" opacity="0.95" filter="url(#cardShadow)">
                <path d="M182,140 L154,172 L146,275 L164,265 L174,200" fill="#3D5A80" stroke="#253852" strokeWidth="2"/>
                <path d="M258,140 L286,172 L294,275 L276,265 L266,200" fill="#3D5A80" stroke="#253852" strokeWidth="2"/>
                <polygon points="185,142 198,160 192,168 178,152" fill="#4D729F" stroke="#253852" strokeWidth="1.2"/>
                <polygon points="255,142 242,160 248,168 262,152" fill="#4D729F" stroke="#253852" strokeWidth="1.2"/>
              </g>
            )}
          </g>

          {/* CULTURAL RED EMBOSSED SEAL */}
          <g transform="translate(50, 480) scale(0.95)">
            <rect x="0" y="0" width="95" height="46" rx="8" fill="#FAF7F2" stroke="#9E2A2B" strokeWidth="2" strokeDasharray="3 1.5" opacity="0.95"/>
            <text x="47" y="19" fill="#9E2A2B" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">VIỆT PHỤC</text>
            <text x="47" y="35" fill="#9E2A2B" fontSize="13" fontWeight="900" textAnchor="middle">REMIX 2026</text>
          </g>

        </svg>
  );
}
