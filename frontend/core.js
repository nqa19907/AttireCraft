(function (root, factory) {
  'use strict';
  const variants = typeof module === 'object' && module.exports ? require('./image-variants.js') : root.AttireImageVariants || [];
  const core = factory(variants);
  if (typeof module === 'object' && module.exports) module.exports = core;
  else root.AttireCore = core;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (variants) {
  'use strict';

  const VERSION = 2;
  const MAX_LOOKS = 12;
  const MAX_FILE_BYTES = 100000;
  const imageVariants = new Set(variants);
  const DATA = {
    garments: {
      'ao-dai': { label: 'Áo dài', prefix: 'Nét', culture: 'Áo dài thường được nhận diện qua hai tà áo mặc cùng quần. Khi làm mới, bạn có thể bắt đầu với màu sắc, chất liệu và phụ kiện phù hợp hoàn cảnh.' },
      'tu-than': { label: 'Áo tứ thân', prefix: 'Duyên', culture: 'Áo tứ thân gắn với văn hóa Bắc Bộ; yếm, dải thắt lưng và váy tạo nên tổng thể quen thuộc. Khăn vấn là một gợi ý cho bối cảnh hội làng hoặc biểu diễn.' },
      'ngu-than': { label: 'Áo ngũ thân', prefix: 'Phong', culture: 'Cổ đứng, hàng cúc và cấu trúc năm thân tạo nên nhận diện của áo ngũ thân. Màu sắc và phụ kiện tiết chế giúp tôn phom áo trong không gian trang trọng.' },
      'ba-ba': { label: 'Áo bà ba', prefix: 'Mộc', culture: 'Áo bà ba gắn với đời sống Nam Bộ và sự thoải mái. Chất liệu nhẹ, phụ kiện nhỏ và màu sắc tự nhiên là những gợi ý dễ ứng dụng.' }
    },
    colors: {
      ivory: { label: 'Ngà', tint: '#e7d9bf', word: 'Ngà' },
      red: { label: 'Đỏ son', tint: '#a62f2b', word: 'Son' },
      teal: { label: 'Xanh ngọc', tint: '#1d716b', word: 'Ngọc' },
      pink: { label: 'Hồng sen', tint: '#d6737d', word: 'Sen' },
      black: { label: 'Đen lĩnh', tint: '#1b2527', word: 'Lĩnh' }
    },
    occasions: {
      'le-hoi': { label: 'Lễ hội', fit: ['ao-dai', 'tu-than', 'ngu-than'] },
      'ky-yeu': { label: 'Kỷ yếu', fit: ['ao-dai', 'tu-than'] },
      cuoi: { label: 'Lễ cưới', fit: ['ao-dai', 'ngu-than'] },
      'hang-ngay': { label: 'Hằng ngày', fit: ['ba-ba', 'ao-dai'] }
    },
    styles: { minimal: 'Tối giản', genz: 'Gen Z', classic: 'Cổ điển' },
    weather: { warm: 'Nắng ấm', cool: 'Se lạnh', rain: 'Có mưa' },
    accessories: { non: 'Nón lá', khan: 'Khăn vấn', ngoc: 'Khuyên ngọc', tui: 'Túi lụa' }
  };
  const DEFAULT = Object.freeze({ garment: 'ao-dai', occasion: 'le-hoi', weather: 'warm', color: 'ivory', style: 'minimal', accessories: Object.freeze([]) });
  const has = (object, key) => typeof key === 'string' && Object.prototype.hasOwnProperty.call(object, key);
  const record = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

  function validateConfig(value) {
    if (!record(value) || !has(DATA.garments, value.garment) || !has(DATA.occasions, value.occasion) ||
      !has(DATA.weather, value.weather) || !has(DATA.colors, value.color) || !has(DATA.styles, value.style) ||
      !Array.isArray(value.accessories) || value.accessories.length > 2 ||
      value.accessories.some((key) => !has(DATA.accessories, key)) || new Set(value.accessories).size !== value.accessories.length) return null;
    return { garment: value.garment, occasion: value.occasion, weather: value.weather, color: value.color, style: value.style, accessories: [...value.accessories].sort() };
  }

  function configKey(value) {
    const config = validateConfig(value);
    return config ? [config.garment, config.occasion, config.weather, config.color, config.style, config.accessories.join(',')].join('|') : null;
  }

  function getScore(config) {
    if (!validateConfig(config)) throw new TypeError('Bản phối không hợp lệ.');
    let score = 90;
    score += DATA.occasions[config.occasion].fit.includes(config.garment) ? 5 : -12;
    if (config.weather === 'warm' && config.color === 'black') score -= 8;
    if (config.weather === 'rain' && ['ao-dai', 'tu-than'].includes(config.garment)) score -= 5;
    if (config.style === 'minimal') score += 3;
    if (config.accessories.length === 2) score -= 2;
    if (config.garment === 'ba-ba' && config.accessories.includes('khan')) score -= 7;
    if (config.garment === 'tu-than' && config.accessories.includes('non')) score -= 5;
    if (config.occasion === 'cuoi' && ['red', 'pink'].includes(config.color)) score += 3;
    if (config.occasion === 'hang-ngay' && config.garment === 'ngu-than') score -= 6;
    return Math.max(62, Math.min(98, score));
  }

  function lookName(config) {
    const suffix = config.style === 'genz' ? 'Tân Thời' : config.style === 'classic' ? 'Hoài Niệm' : 'Đương Đại';
    return `${DATA.garments[config.garment].prefix} ${DATA.colors[config.color].word} ${suffix}`;
  }

  function makeLook(value, id, createdAt) {
    const config = validateConfig(value);
    if (!config) throw new TypeError('Bản phối không hợp lệ.');
    return { ...config, id: String(id), createdAt: Number.isFinite(createdAt) && createdAt > 0 ? createdAt : 0, name: lookName(config), score: getScore(config) };
  }

  function imagePath(config, thumbnail = false, original = false) {
    if (!has(DATA.garments, config?.garment) || !has(DATA.colors, config?.color)) throw new TypeError('Trang phục hoặc màu không hợp lệ.');
    const base = `${config.garment}-${config.color}`;
    const accessories = config.accessories || [];
    if (!Array.isArray(accessories) || accessories.length > 2 || accessories.some(key => !has(DATA.accessories, key)) || new Set(accessories).size !== accessories.length) throw new TypeError('Phụ kiện không hợp lệ.');
    const variant = `${base}--${[...accessories].sort().join('-')}`;
    const available = accessories.length > 0 && imageVariants.has(variant);
    const stem = available ? variant : base;
    if (original) return `assets/outfits/${available ? 'accessories/' : ''}${stem}.png`;
    return `assets/optimized/${available ? 'accessories/' : ''}${thumbnail ? 'thumbs/' : ''}${stem}.webp`;
  }

  function cultureStatus(config) {
    if (config.garment === 'tu-than' && config.accessories.includes('non')) return { warning: true, text: 'Nón lá phổ biến ở nhiều vùng, nhưng không phải điểm nhận diện riêng của áo tứ thân Bắc Bộ. Với bối cảnh hội làng, bạn có thể tham khảo khăn vấn hoặc nón quai thao.' };
    if (config.garment === 'ba-ba' && config.accessories.includes('khan')) return { warning: true, text: 'Khăn vấn tạo cảm giác trang trọng. Nếu muốn giữ vẻ giản dị thường gắn với áo bà ba, hãy thử túi nhỏ hoặc giảm phụ kiện.' };
    if (config.garment === 'ngu-than' && config.style === 'genz') return { warning: true, text: 'Một cách làm mới áo ngũ thân là chọn màu và phụ kiện có điểm nhấn, đồng thời giữ cấu trúc cổ đứng, năm thân và hàng cúc đặc trưng.' };
    return { warning: false, text: DATA.garments[config.garment].culture };
  }

  function stylingTip(config) {
    const tips = {
      minimal: 'Giữ một điểm nhấn: giày trơn màu, phụ kiện nhỏ và chất liệu ít họa tiết.',
      genz: 'Thử một phụ kiện có cá tính và giày đơn sắc; để màu áo làm điểm nhấn chính.',
      classic: 'Ưu tiên phụ kiện nhỏ, gam màu đồng điệu và kiểu tóc gọn để tôn phom áo.'
    };
    return tips[config.style];
  }

  function weatherTip(config) {
    if (config.weather === 'rain') return 'Có mưa: ưu tiên chất liệu nhanh khô, giày bám tốt và giữ tà áo tránh mặt đất ướt.';
    if (config.weather === 'cool') return 'Se lạnh: có thể thêm lớp lót mỏng hoặc khăn choàng nhẹ phù hợp phom áo.';
    return config.color === 'black' ? 'Nắng ấm: áo sẫm màu có thể hấp thụ nhiệt; hãy chọn vải thoáng và nghỉ trong bóng râm.' : 'Nắng ấm: chọn vải thoáng, lớp lót nhẹ và mang theo nước khi hoạt động ngoài trời.';
  }

  function scoreReasons(config) {
    const reasons = [];
    if (!DATA.occasions[config.occasion].fit.includes(config.garment)) reasons.push('Có thể cân nhắc dòng trang phục khác phù hợp hơn với dịp đã chọn.');
    if (config.weather === 'warm' && config.color === 'black') reasons.push('Màu sẫm cần được cân nhắc khi ở ngoài trời nắng.');
    if (config.weather === 'rain' && ['ao-dai', 'tu-than'].includes(config.garment)) reasons.push('Tà áo dài cần được giữ gọn khi di chuyển dưới mưa.');
    if (cultureStatus(config).warning) reasons.push('Xem thêm gợi ý về phụ kiện và bối cảnh văn hóa bên dưới.');
    return reasons.length ? reasons.join(' ') : 'Phom áo, màu sắc và bối cảnh phù hợp với các quy tắc gợi ý của studio.';
  }

  function addLook(looks, config, id, createdAt) {
    const key = configKey(config);
    if (!key) return { status: 'invalid', looks };
    if (looks.some((look) => configKey(look) === key)) return { status: 'duplicate', looks };
    if (looks.length >= MAX_LOOKS) return { status: 'full', looks };
    return { status: 'added', looks: [makeLook(config, id, createdAt), ...looks] };
  }

  function parseLookbook(text, recover = false) {
    if (typeof text !== 'string' || text.length > MAX_FILE_BYTES) throw new Error('Tệp lookbook quá lớn hoặc không hợp lệ.');
    let value;
    try { value = JSON.parse(text); } catch (_) { throw new Error('Không đọc được JSON. Hãy chọn tệp lookbook đã xuất từ AttireCraft.'); }
    const legacy = Array.isArray(value);
    if (!legacy && (!record(value) || value.version !== VERSION || !Array.isArray(value.looks))) throw new Error('Định dạng lookbook không được hỗ trợ.');
    const rows = legacy ? value : value.looks;
    if (rows.length > MAX_LOOKS) throw new Error(`Một lookbook chỉ chứa tối đa ${MAX_LOOKS} bản phối.`);
    const looks = [];
    const keys = new Set();
    const ids = new Set();
    let invalidCount = 0;
    let duplicateCount = 0;
    rows.forEach((row, index) => {
      const config = validateConfig(row);
      if (!config) {
        if (!recover) throw new Error(`Bản phối thứ ${index + 1} không hợp lệ. Tệp chưa được nhập.`);
        invalidCount += 1;
        return;
      }
      const key = configKey(config);
      if (keys.has(key)) { duplicateCount += 1; return; }
      let id = typeof row.id === 'string' || typeof row.id === 'number' ? String(row.id) : '';
      if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id) || ids.has(id)) id = `recovered-${index}`;
      while (ids.has(id)) id += '-r';
      const createdAt = Number.isFinite(row.createdAt) ? row.createdAt : typeof row.id === 'number' ? row.id : 0;
      looks.push(makeLook(config, id, createdAt));
      keys.add(key);
      ids.add(id);
    });
    return { looks, invalidCount, duplicateCount, legacy };
  }

  function serializeLookbook(looks) {
    if (!Array.isArray(looks) || looks.length > MAX_LOOKS || looks.some((look) => !validateConfig(look))) throw new Error('Lookbook không hợp lệ.');
    return JSON.stringify({ app: 'AttireCraft', version: VERSION, looks: looks.map((look, index) => makeLook(look, look.id || `look-${index}`, look.createdAt)) }, null, 2);
  }

  function mergeLooks(existing, incoming, idPrefix, createdAt) {
    const keys = new Set(existing.map(configKey));
    const unique = incoming.filter((look) => {
      const key = configKey(look);
      if (!key) throw new Error('Bản phối không hợp lệ.');
      if (keys.has(key)) return false;
      keys.add(key);
      return true;
    });
    if (existing.length + unique.length > MAX_LOOKS) return { status: 'full', looks: existing, added: 0, needed: existing.length + unique.length - MAX_LOOKS };
    const occupied = new Set(existing.map((look) => String(look.id)));
    const added = unique.map((look, index) => {
      let id = `${idPrefix}-${index}`;
      while (occupied.has(id)) id += '-r';
      occupied.add(id);
      return makeLook(look, id, createdAt);
    });
    return { status: added.length ? 'added' : 'duplicate', looks: [...added, ...existing], added: added.length, skipped: incoming.length - added.length };
  }

  function compact(config) {
    const valid = validateConfig(config);
    if (!valid) throw new Error('Bản phối không hợp lệ.');
    return [valid.garment, valid.occasion, valid.weather, valid.color, valid.style, valid.accessories];
  }

  function expand(row) {
    if (!Array.isArray(row) || row.length !== 6) throw new Error('Liên kết bản phối không hợp lệ.');
    const config = validateConfig({ garment: row[0], occasion: row[1], weather: row[2], color: row[3], style: row[4], accessories: row[5] });
    if (!config) throw new Error('Liên kết bản phối không hợp lệ.');
    return config;
  }

  function encodeShare(configs) {
    if (!Array.isArray(configs) || !configs.length || configs.length > MAX_LOOKS) throw new Error('Lookbook chia sẻ không hợp lệ.');
    return btoa(JSON.stringify({ v: 1, looks: configs.map(compact) })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodeShare(encoded) {
    if (typeof encoded !== 'string' || !/^[A-Za-z0-9_-]+$/.test(encoded) || encoded.length > 4000) throw new Error('Liên kết chia sẻ không hợp lệ.');
    let value;
    try { value = JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/'))); } catch (_) { throw new Error('Liên kết chia sẻ bị lỗi hoặc không đầy đủ.'); }
    if (!record(value) || value.v !== 1 || !Array.isArray(value.looks) || !value.looks.length || value.looks.length > MAX_LOOKS) throw new Error('Phiên bản liên kết này chưa được hỗ trợ.');
    return value.looks.map(expand);
  }

  function suggest(config, seed = 0) {
    const current = validateConfig(config) || validateConfig(DEFAULT);
    const fit = DATA.occasions[current.occasion].fit;
    const colors = current.occasion === 'cuoi' ? ['red', 'pink', 'ivory'] : current.weather === 'warm' ? ['ivory', 'teal', 'pink'] : ['teal', 'red', 'ivory', 'black'];
    const options = [];
    fit.forEach((garment) => colors.forEach((color) => ['minimal', 'classic', 'genz'].forEach((style) => {
      const accessories = garment === 'tu-than' ? ['khan'] : garment === 'ba-ba' ? ['tui'] : style === 'classic' ? ['ngoc'] : [];
      const look = { ...current, garment, color, style, accessories };
      if (configKey(look) !== configKey(current)) options.push(look);
    })));
    const best = options.filter((look) => getScore(look) >= 90);
    const pool = best.length ? best : options;
    return validateConfig(pool[Math.abs(Math.trunc(seed) || 0) % pool.length] || current);
  }

  function differences(before, after) {
    const labels = { garment: 'Trang phục', occasion: 'Dịp', weather: 'Thời tiết', color: 'Màu', style: 'Phong cách' };
    const maps = { garment: DATA.garments, occasion: DATA.occasions, weather: DATA.weather, color: DATA.colors, style: DATA.styles };
    const result = [];
    Object.keys(labels).forEach((key) => {
      if (before[key] === after[key]) return;
      const a = maps[key][before[key]];
      const b = maps[key][after[key]];
      result.push(`${labels[key]}: ${a.label || a} → ${b.label || b}`);
    });
    const a = [...before.accessories].sort();
    const b = [...after.accessories].sort();
    if (a.join() !== b.join()) result.push(`Phụ kiện: ${a.map((key) => DATA.accessories[key]).join(', ') || 'không'} → ${b.map((key) => DATA.accessories[key]).join(', ') || 'không'}`);
    return result;
  }

  return Object.freeze({ VERSION, MAX_LOOKS, MAX_FILE_BYTES, DATA, DEFAULT, validateConfig, configKey, getScore, lookName, makeLook, imagePath, cultureStatus, stylingTip, weatherTip, scoreReasons, addLook, parseLookbook, serializeLookbook, mergeLooks, encodeShare, decodeShare, suggest, differences });
});
