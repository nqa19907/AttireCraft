(() => {
  'use strict';
  function imageFrom(source) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Chưa tải được một ảnh trong lookbook. Hãy thử lại.'));
      image.src = source;
    });
  }
  function blobFrom(canvas) {
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Trình duyệt chưa xuất được ảnh.')), 'image/png'));
  }
  function wrap(context, value, x, y, width, lineHeight, maxLines = 2) {
    const words = value.split(/\s+/);
    let line = '';
    let row = 0;
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (context.measureText(next).width > width && line) {
        context.fillText(line, x, y + row++ * lineHeight);
        line = word;
        if (row === maxLines - 1) break;
      } else line = next;
    }
    context.fillText(line, x, y + row * lineHeight);
  }
  async function create(looks, resolveImage) {
    if (!looks.length) throw new Error('Hãy lưu ít nhất một bản phối trước khi tải lookbook.');
    const photos = await Promise.all(looks.map(look => imageFrom(resolveImage(look))));
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (looks.length === 1) {
      canvas.width = photos[0].naturalWidth;
      canvas.height = photos[0].naturalHeight;
      context.drawImage(photos[0], 0, 0);
      return blobFrom(canvas);
    }
    const Core = window.AttireCore;
    const columns = Math.min(3, looks.length);
    const width = 480;
    const gap = 32;
    const margin = 48;
    const imageHeight = 600;
    const cardHeight = 754;
    const header = 174;
    canvas.width = margin * 2 + columns * width + (columns - 1) * gap;
    canvas.height = header + Math.ceil(looks.length / columns) * (cardHeight + gap) + margin;
    context.fillStyle = '#eee8dc';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#24483d';
    context.font = '42px Georgia, serif';
    context.fillText('Lookbook của bạn', margin, 72);
    context.font = '20px Arial, sans-serif';
    context.fillText(`AttireCraft · ${looks.length} bản phối · Việt phục, theo cách bạn.`, margin, 116);
    looks.forEach((look, i) => {
      const x = margin + i % columns * (width + gap);
      const y = header + Math.floor(i / columns) * (cardHeight + gap);
      context.fillStyle = '#d8dfd2';
      context.fillRect(x, y, width, imageHeight);
      const image = photos[i];
      const scale = Math.min(width / image.naturalWidth, imageHeight / image.naturalHeight);
      const drawnWidth = image.naturalWidth * scale;
      const drawnHeight = image.naturalHeight * scale;
      context.drawImage(image, x + (width - drawnWidth) / 2, y + (imageHeight - drawnHeight) / 2, drawnWidth, drawnHeight);
      context.fillStyle = '#ffffff';
      context.fillRect(x, y + imageHeight, width, cardHeight - imageHeight);
      context.fillStyle = '#24483d';
      context.font = '25px Georgia, serif';
      wrap(context, look.name || Core.lookName(look), x + 20, y + imageHeight + 36, width - 40, 30);
      context.font = '17px Arial, sans-serif';
      context.fillText(`${Core.DATA.garments[look.garment].label} · ${Core.DATA.colors[look.color].label}`, x + 20, y + imageHeight + 78);
      context.font = '15px Arial, sans-serif';
      const details = `${Core.DATA.occasions[look.occasion].label} · ${look.accessories.length ? look.accessories.map(key => Core.DATA.accessories[key]).join(' · ') : 'Không thêm phụ kiện'}`;
      wrap(context, details, x + 20, y + imageHeight + 106, width - 40, 23);
    });
    return blobFrom(canvas);
  }
  function save(blob, name) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  window.AttireDownload = Object.freeze({ create, save });
})();
