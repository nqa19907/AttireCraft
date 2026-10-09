(() => {
  'use strict';
  const Core = window.AttireCore;
  if (!Core) return;
  const { DATA, MAX_LOOKS } = Core;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const on = (selector, event, handler) => { const node = $(selector); if (node) node.addEventListener(event, handler); };
  const setText = (selector, text) => { const node = $(selector); if (node) node.textContent = text; };
  const STORAGE_KEY = 'attirecraft-lookbook-v2';
  const LEGACY_KEY = 'attirecraft-lookbook';
  const DRAFT_KEY = 'attirecraft-draft-v1';
  const startupMessages = [];
  let storageAvailable = true;
  let savedLooks = loadLooks();
  let state = Core.validateConfig(Core.DEFAULT);
  let editingId = null;
  let compareSnapshot = null;
  let compareTrigger = null;
  let storyTrigger = null;
  let sharedLooks = [];
  let toastTimer;
  let undoAction = null;
  let imageRequest = 0;
  let suggestionIndex = Math.floor(Math.random() * 100);
  let shareBusy = false;
  let importBusy = false;
  let downloadBusy = false;
  restoreDraft();

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(className, text, id) {
    const node = element('button', className, text);
    node.type = 'button';
    if (id) node.id = id;
    return node;
  }

  function uid() {
    return window.crypto && typeof window.crypto.randomUUID === 'function' ? window.crypto.randomUUID() : `look-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function readStorage(key) {
    try { return localStorage.getItem(key); }
    catch (_) { storageAvailable = false; return null; }
  }

  function writeStorage(key, value) {
    try { localStorage.setItem(key, value); storageAvailable = true; return true; }
    catch (_) { storageAvailable = false; return false; }
  }

  function loadLooks() {
    let raw = readStorage(STORAGE_KEY);
    let migrated = false;
    if (raw === null) { raw = readStorage(LEGACY_KEY); migrated = raw !== null; }
    if (raw === null) return [];
    try {
      const result = Core.parseLookbook(raw, true);
      if (result.invalidCount) startupMessages.push(`Đã bỏ qua ${result.invalidCount} bản phối không hợp lệ trong dữ liệu cũ.`);
      if (migrated && !result.invalidCount) writeStorage(STORAGE_KEY, Core.serializeLookbook(result.looks));
      return result.looks;
    } catch (_) {
      startupMessages.push('Dữ liệu lookbook trên thiết bị không hợp lệ. Bạn vẫn có thể phối mới hoặc nhập bản sao lưu.');
      return [];
    }
  }

  function restoreDraft() {
    const raw = readStorage(DRAFT_KEY);
    if (!raw) return;
    try {
      if (raw.length > 2000) return;
      const draft = JSON.parse(raw);
      const config = draft && draft.version === 1 && Core.validateConfig(draft.config);
      if (!config) return;
      state = config;
      editingId = savedLooks.some((look) => look.id === draft.editingId) ? draft.editingId : null;
    } catch (_) { /* A damaged draft must not prevent the studio from opening. */ }
  }

  function persistDraft() {
    updateDraftStatus(writeStorage(DRAFT_KEY, JSON.stringify({ version: 1, config: state, editingId })));
  }

  function updateDraftStatus(stored = storageAvailable) {
    setText('#draft-status', stored ? editingId ? 'Đang chỉnh sửa bản đã lưu · Tự lưu bản nháp' : 'Bản nháp được lưu trên thiết bị này' : 'Bản nháp chỉ được giữ trong phiên này');
  }

  function commitLooks(next) {
    savedLooks = next;
    const stored = writeStorage(STORAGE_KEY, Core.serializeLookbook(savedLooks));
    renderLookbook();
    updateDraftStatus(stored);
    return stored;
  }

  function storageSuffix(stored) {
    return stored ? '' : ' Bộ nhớ trình duyệt không khả dụng; thay đổi chỉ được giữ trong phiên này. Hãy xuất JSON để sao lưu.';
  }

  function hideToast() {
    const toast = $('#toast');
    if (!toast || toast.contains(document.activeElement)) return;
    toast.classList.remove('show');
    if ($('#undo-button')) $('#undo-button').hidden = true;
    undoAction = null;
  }

  function scheduleToast(duration = 5500) {
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, duration);
  }

  function showToast(message, undo = null) {
    const toast = $('#toast');
    if (!toast) return;
    let messageNode = $('#toast-message');
    if (!messageNode) { messageNode = element('span'); messageNode.id = 'toast-message'; toast.replaceChildren(messageNode); }
    let undoButton = $('#undo-button');
    if (!undoButton) { undoButton = button('', 'Hoàn tác', 'undo-button'); toast.append(undoButton); }
    messageNode.textContent = message;
    undoAction = undo;
    undoButton.hidden = !undo;
    toast.classList.add('show');
    scheduleToast(undo ? 10000 : 6000);
  }

  function currentLook() {
    return Core.makeLook(state, 'current', Date.now());
  }

  function setConfig(value, options = {}) {
    const config = Core.validateConfig(value);
    if (!config) return;
    state = config;
    if (options.exitEditing) editingId = null;
    updatePreview();
    persistDraft();
    if (options.scroll) {
      $('#studio')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      const target = $('#studio-title');
      if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
    }
  }

  function syncControls() {
    $$('input[name="garment"]').forEach((input) => {
      input.checked = input.value === state.garment;
      input.closest('.garment-option')?.classList.toggle('active', input.checked);
    });
    [['#occasion-options', 'occasion', 'value'], ['#color-options', 'color', 'color'], ['#style-options', 'style', 'value']].forEach(([selector, key, data]) => {
      $$(`${selector} button`).forEach((item) => {
        const selected = item.dataset[data] === state[key];
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
    });
    if ($('#weather-select')) $('#weather-select').value = state.weather;
    $$('#accessory-options button').forEach((item) => {
      const selected = state.accessories.includes(item.dataset.value);
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
      item.setAttribute('aria-disabled', String(!selected && state.accessories.length === 2));
    });
    setText('#accessory-count', `${state.accessories.length}/2`);
    const colorNotes = {
      ivory: 'Sắc ngà nhẹ nhàng, dễ kết hợp cùng phụ kiện vàng nhạt hoặc màu tự nhiên.',
      red: 'Đỏ son tạo điểm nhấn nổi bật; phụ kiện đơn sắc giúp tổng thể cân bằng.',
      teal: 'Xanh ngọc thanh mát, hợp với phụ kiện ngà, bạc hoặc màu trung tính.',
      pink: 'Hồng sen mềm mại; thử phụ kiện ngọc trai hoặc túi màu ngà.',
      black: 'Đen lĩnh trầm và sắc nét; một phụ kiện sáng màu sẽ tạo điểm nhấn.'
    };
    setText('#palette-note', colorNotes[state.color]);
    setText('#save-button', editingId ? 'Cập nhật bản phối ↗' : 'Lưu vào lookbook ♡');
    const saved = savedLooks.some((look) => Core.configKey(look) === Core.configKey(state));
    $('#save-button')?.classList.toggle('is-saved', saved);
    if ($('#save-copy-button')) $('#save-copy-button').hidden = !editingId;
  }

  function updateMainImage() {
    setText('.image-caption', 'ẢNH MINH HỌA');
    const image = $('#model-image');
    if (!image) return;
    const source = Core.imagePath(state);
    const description = Core.imageDescription(state);
    if (image.dataset.source === source) { image.alt = description; return; }
    image.dataset.source = source;
    image.alt = description;
    const request = ++imageRequest;
    const original = Core.imagePath(state, false, true);
    const stage = $('#model-stage');
    stage?.classList.add('is-loading');
    stage?.setAttribute('aria-busy', 'true');
    setText('#preview-status', 'Đang tải ảnh trang phục…');
    const finish = (failed) => {
      if (request !== imageRequest) return;
      stage?.classList.remove('is-loading');
      stage?.classList.toggle('image-unavailable', failed);
      stage?.setAttribute('aria-busy', 'false');
      setText('#preview-status', failed ? 'Chưa tải được ảnh. Bạn vẫn có thể chọn và lưu bản phối.' : description);
    };
    image.onload = () => finish(false);
    image.onerror = () => {
      if (request !== imageRequest) return;
      if (image.getAttribute('src') !== original) image.src = original;
      else finish(true);
    };
    image.src = source;
    if (image.complete && image.naturalWidth) finish(false);
  }

  function createImage(look, thumbnail = true) {
    const image = element('img');
    image.src = Core.imagePath(look, thumbnail);
    image.alt = Core.imageDescription(look);
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 512;
    image.height = 768;
    image.addEventListener('error', () => {
      const fallback = Core.imagePath(look, false, true);
      if (image.getAttribute('src') !== fallback) image.src = fallback;
      else image.classList.add('image-unavailable');
    });
    return image;
  }

  function updatePreview() {
    syncControls();
    updateMainImage();
    const score = Core.getScore(state);
    const status = Core.cultureStatus(state);
    const stage = $('#model-stage');
    if (stage) {
      ['minimal', 'classic', 'genz'].forEach((style) => stage.classList.toggle(`style-${style}`, style === state.style));
      stage.style.setProperty('--look-color', DATA.colors[state.color].tint);
    }
    setText('#look-name', Core.lookName(state));
    setText('#look-context', `${DATA.occasions[state.occasion].label} · ${DATA.weather[state.weather]}`.toUpperCase());
    setText('#score-value', score);
    if ($('#score-ring')) {
      $('#score-ring').style.background = `conic-gradient(${score >= 84 ? 'var(--green)' : 'var(--coral)'} ${score}%, #dedad2 0)`;
      $('#score-ring').setAttribute('aria-label', `Gợi ý hài hòa: ${score} trên 100. Điểm tham khảo theo quy tắc phối đồ.`);
    }
    setText('#score-title', score >= 92 ? 'Rất hài hòa' : score >= 84 ? 'Có nét riêng' : 'Thử điều chỉnh nhé');
    setText('#score-copy', Core.scoreReasons(state));
    $('#culture-note')?.classList.toggle('warning', status.warning);
    setText('#culture-note .note-icon', status.warning ? 'i' : '✓');
    setText('#culture-note strong', status.warning ? 'Một gợi ý về bối cảnh' : 'Gợi ý giữ nét đặc trưng');
    setText('#culture-copy', status.text);
    setText('#styling-tip', Core.stylingTip(state));
    setText('#weather-tip', Core.weatherTip(state));
    const names = Core.accessoryLabels(state);
    const badge = $('#accessory-badge');
    if (badge) { badge.hidden = !names.length; badge.textContent = names.length ? `Gợi ý: ${names.join(' · ')}` : ''; }
    setText('#preview-index', String(Object.keys(DATA.garments).indexOf(state.garment) + 1).padStart(2, '0'));
    if ($('#compare-tray') && !$('#compare-tray').hidden) renderCompare();
  }

  function renderLookbook() {
    setText('#nav-save-count', savedLooks.length);
    setText('#lookbook-count', `${savedLooks.length}/${MAX_LOOKS} bản phối · Lưu trên thiết bị này`);
    if ($('#export-button')) $('#export-button').disabled = !savedLooks.length;
    if ($('#share-button')) $('#share-button').disabled = !savedLooks.length;
    const grid = $('#saved-grid');
    if (!grid) return;
    const fragment = document.createDocumentFragment();
    if (!savedLooks.length) {
      const empty = element('div', 'empty-lookbook');
      empty.id = 'empty-lookbook';
      const icon = element('span', '', '♡');
      icon.setAttribute('aria-hidden', 'true');
      const link = element('a', '', 'Tạo bản phối đầu tiên →');
      link.href = '#studio';
      empty.append(icon, element('strong', '', 'Một bộ sưu tập, rất riêng bạn'), element('p', '', 'Lưu những bản phối bạn yêu thích để xem lại, chỉnh sửa và so sánh bất cứ lúc nào.'), link);
      fragment.append(empty);
    }
    savedLooks.forEach((look, index) => {
      const card = element('article', 'saved-card');
      const remove = button('remove-look', '×');
      remove.dataset.id = look.id;
      remove.setAttribute('aria-label', `Xóa ${look.name}`);
      const imageWrapper = element('div', 'saved-image');
      imageWrapper.append(createImage(look), element('span', 'saved-index', String(index + 1).padStart(2, '0')));
      const meta = element('div', 'saved-meta');
      meta.append(element('small', '', `${DATA.garments[look.garment].label.toUpperCase()} · ${look.score}/100`), element('strong', '', look.name));
      meta.append(element('p', '', `${DATA.occasions[look.occasion].label} · ${DATA.weather[look.weather]} · ${DATA.styles[look.style]}`));
      meta.append(element('p', 'saved-accessories', Core.accessoryLabels(look).join(' · ') || 'Không thêm phụ kiện'));
      const actions = element('div', 'saved-actions');
      const edit = button('saved-edit', 'Mở bản phối ↗');
      edit.dataset.id = look.id;
      edit.setAttribute('aria-label', `Chỉnh sửa ${look.name}`);
      const compare = button('saved-compare', '⇄');
      compare.dataset.id = look.id;
      compare.setAttribute('aria-label', `So sánh với ${look.name}`);
      actions.append(edit, compare);
      meta.append(actions);
      card.append(remove, imageWrapper, meta);
      fragment.append(card);
    });
    grid.replaceChildren(fragment);
    syncControls();
  }

  async function saveLook(asCopy = false) {
    const editIndex = asCopy ? -1 : savedLooks.findIndex((look) => look.id === editingId);
    if (editIndex >= 0) {
      const original = savedLooks[editIndex];
      const key = Core.configKey(state);
      if (savedLooks.some((look, index) => index !== editIndex && Core.configKey(look) === key)) { showToast('Một bản phối giống hệt đã có trong lookbook.'); return; }
      if (Core.configKey(original) === key) {
        showToast('Bản phối đã được lưu. Hãy thay đổi lựa chọn để cập nhật.');
        return;
      }
      const next = savedLooks.slice();
      next[editIndex] = Core.makeLook(state, original.id, original.createdAt);
      const stored = commitLooks(next);
      editingId = null;
      syncControls();
      persistDraft();
      showToast(`Đã cập nhật “${Core.lookName(state)}”.${storageSuffix(stored)}`);
      return;
    }
    const result = Core.addLook(savedLooks, state, uid(), Date.now());
    if (result.status === 'duplicate') {
      showToast('Bản phối này đã có trong lookbook, kể cả thời tiết và phụ kiện.');
      return;
    }
    if (result.status === 'full') { showToast(`Lookbook đã đủ ${MAX_LOOKS} bản phối. Hãy xuất bản sao lưu hoặc xóa một bản trước khi lưu thêm.`); return; }
    if (result.status !== 'added') return;
    const stored = commitLooks(result.looks);
    editingId = null;
    syncControls();
    persistDraft();
    showToast(`Đã lưu “${Core.lookName(state)}” vào lookbook.${storageSuffix(stored)}`);
  }

  function removeLook(id) {
    const index = savedLooks.findIndex((look) => look.id === id);
    if (index < 0) return;
    const removed = savedLooks[index];
    if (editingId === id) editingId = null;
    const stored = commitLooks(savedLooks.filter((look) => look.id !== id));
    persistDraft();
    showToast(`Đã xóa “${removed.name}”.${storageSuffix(stored)}`, () => {
      if (savedLooks.some((look) => Core.configKey(look) === Core.configKey(removed))) { showToast('Bản phối này đã có trong lookbook.'); return; }
      if (savedLooks.length >= MAX_LOOKS) { showToast('Lookbook đã đầy. Hãy xóa một bản phối trước khi khôi phục.'); return; }
      const next = savedLooks.slice();
      next.splice(Math.min(index, next.length), 0, removed);
      const restored = commitLooks(next);
      showToast(`Đã khôi phục “${removed.name}”.${storageSuffix(restored)}`);
      $$('.saved-edit').find((item) => item.dataset.id === id)?.focus({ preventScroll: true });
    });
    const nextFocus = $$('.saved-edit')[Math.min(index, savedLooks.length - 1)] || $('#empty-lookbook a');
    nextFocus?.focus({ preventScroll: true });
  }

  function compareCard(look, label, current = false) {
    const card = element('div', `compare-item${current ? ' current' : ''}`);
    card.append(element('small', '', label));
    if (!look) {
      card.append(element('strong', '', 'Chọn một bản phối làm mốc'), element('p', '', 'Giữ lại phương án A, rồi thay đổi lựa chọn trong phòng phối để thấy khác biệt.'));
    } else {
      const wrapper = element('div', 'compare-image');
      wrapper.append(createImage(look));
      card.append(wrapper, element('strong', '', look.name));
      card.append(element('p', '', `${DATA.garments[look.garment].label} · ${DATA.colors[look.color].label} · ${DATA.styles[look.style]}`));
      card.append(element('p', '', `${DATA.occasions[look.occasion].label} · ${DATA.weather[look.weather]}`));
      card.append(element('p', 'compare-accessories', Core.accessoryLabels(look).join(' · ') || 'Không thêm phụ kiện'));
      card.append(element('b', 'compare-score', `Gợi ý hài hòa: ${look.score}/100`));
    }
    if (!current) card.append(button('compare-baseline-button', look ? 'Dùng hiện tại làm mốc A' : 'Chọn hiện tại làm mốc A', 'set-baseline'));
    return card;
  }

  function renderCompare() {
    const content = $('#compare-content');
    if (!content) return;
    const current = currentLook();
    content.replaceChildren(compareCard(compareSnapshot, 'PHƯƠNG ÁN A · MỐC SO SÁNH'), compareCard(current, 'PHƯƠNG ÁN B · ĐANG PHỐI', true));
    if (compareSnapshot) {
      const changes = Core.differences(compareSnapshot, current);
      const difference = current.score - compareSnapshot.score;
      const scoreText = difference === 0 ? 'Điểm gợi ý không đổi.' : `Điểm gợi ý ${difference > 0 ? 'tăng' : 'giảm'} ${Math.abs(difference)}.`;
      setText('#compare-status', changes.length ? `${changes.length} thay đổi. ${changes.join(' · ')}. ${scoreText}` : 'Hai phương án đang giống nhau. Thử đổi màu, phong cách hoặc phụ kiện trong phòng phối.');
    } else setText('#compare-status', 'Chọn mốc A để bắt đầu. Phương án B cập nhật theo lựa chọn của bạn.');
  }

  function openCompare(trigger, baseline) {
    if (baseline) compareSnapshot = Core.makeLook(baseline, baseline.id, baseline.createdAt);
    const tray = $('#compare-tray');
    if (!tray) return;
    compareTrigger = trigger || document.activeElement;
    tray.hidden = false;
    tray.classList.add('open');
    tray.setAttribute('aria-hidden', 'false');
    $('#compare-button')?.setAttribute('aria-expanded', 'true');
    renderCompare();
    $('#tray-close')?.focus({ preventScroll: true });
  }

  function closeCompare(restoreFocus = true) {
    const tray = $('#compare-tray');
    if (!tray || tray.hidden) return;
    tray.hidden = true;
    tray.classList.remove('open');
    tray.setAttribute('aria-hidden', 'true');
    $('#compare-button')?.setAttribute('aria-expanded', 'false');
    if (restoreFocus && compareTrigger?.isConnected) compareTrigger.focus({ preventScroll: true });
  }

  const STORIES = window.AttireStories || {};

  function openStory(key) {
    const story = Object.prototype.hasOwnProperty.call(STORIES, key) ? STORIES[key] : null;
    const dialog = $('#story-dialog');
    if (!story || !dialog) return;
    storyTrigger = document.activeElement;
    setText('#dialog-label', story.subtitle);
    setText('#dialog-title', story.title);
    const image = createImage({ garment: key, color: 'ivory' });
    image.className = 'story-image';
    const content = document.createDocumentFragment();
    content.append(image, element('p', 'story-intro', story.intro));
    const facts = element('dl', 'story-facts');
    story.facts.forEach(fact => {
      const item = element('div');
      item.append(element('dt', '', fact.label), element('dd', '', fact.value));
      facts.append(item);
    });
    content.append(facts);
    story.sections.forEach(section => {
      const block = element('section', 'story-section');
      block.append(element('h3', '', section.heading));
      section.paragraphs.forEach(paragraph => block.append(element('p', '', paragraph)));
      content.append(block);
    });
    const list = element('ul', 'story-styling');
    story.styling.forEach(point => list.append(element('li', '', point)));
    content.append(element('h3', 'story-subheading', 'Mang câu chuyện vào bản phối'), list);
    const sources = element('div', 'story-sources');
    sources.append(element('h3', '', 'Đọc thêm từ bảo tàng và cơ quan du lịch'));
    story.sources.forEach(source => {
      const link = element('a', '', `${source.title} ↗`);
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      sources.append(link);
    });
    const wear = button('primary-button story-wear', `Thử phối ${DATA.garments[key].label.toLowerCase()} ↗`);
    wear.addEventListener('click', () => { closeStory(); setConfig({ ...state, garment: key }, { scroll: true }); });
    content.append(sources, element('p', 'story-note', 'Việt phục có nhiều biến thể theo vùng, thời kỳ và cách sử dụng. Ảnh trên website minh họa ý tưởng phối đồ; gợi ý phối là đề xuất của AttireCraft.'), wear);
    $('#dialog-content').replaceChildren(content);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else { dialog.setAttribute('open', ''); $('#dialog-close')?.focus(); }
  }

  function closeStory() {
    const dialog = $('#story-dialog');
    if (typeof dialog.close === 'function') dialog.close();
    else { dialog.removeAttribute('open'); storyTrigger?.focus(); }
  }

  function closeMenu(restoreFocus = false) {
    const nav = $('.desktop-nav');
    if (!nav?.classList.contains('open')) return;
    nav.classList.remove('open');
    const toggle = $('#menu-button');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Mở menu điều hướng');
    setText('#menu-button', '☰');
    if (restoreFocus) toggle?.focus({ preventScroll: true });
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(text); return true; } catch (_) { /* Try the legacy clipboard path when permissions are denied. */ }
    }
    const previous = document.activeElement;
    const textarea = element('textarea');
    textarea.value = text;
    textarea.readOnly = true;
    textarea.setAttribute('aria-label', 'Liên kết chia sẻ');
    textarea.style.cssText = 'position:fixed;inset:0 auto auto 0;width:1px;height:1px;opacity:0;';
    document.body.append(textarea);
    textarea.focus({ preventScroll: true });
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { /* Manual copy remains available below. */ }
    textarea.remove();
    previous?.focus({ preventScroll: true });
    return copied;
  }

  function showManualShare(url) {
    const dialog = $('#story-dialog');
    storyTrigger = document.activeElement;
    setText('#dialog-label', 'CHIA SẺ BẢN PHỐI');
    setText('#dialog-title', 'Gửi một chút cảm hứng');
    const field = element('textarea', 'share-link-input');
    field.readOnly = true;
    field.value = url;
    field.rows = 4;
    field.setAttribute('aria-label', 'Liên kết bản phối, chọn và sao chép');
    const copy = button('secondary-button', 'Chọn toàn bộ liên kết');
    copy.addEventListener('click', () => { field.focus(); field.select(); });
    $('#dialog-content').replaceChildren(element('p', '', 'Trình duyệt chưa cho phép sao chép tự động. Chọn liên kết bên dưới rồi sao chép để gửi cho bạn bè.'), field, copy);
    if (!dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    }
    field.focus();
    field.select();
  }

  async function shareLooks(currentOnly) {
    if (shareBusy) return;
    const looks = currentOnly ? [state] : savedLooks;
    if (!looks.length) { showToast('Hãy lưu ít nhất một bản phối trước khi chia sẻ lookbook.'); return; }
    if (location.protocol === 'file:') { showToast('Liên kết cần địa chỉ website để mở trên thiết bị khác. Hãy chạy website bằng máy chủ web; bạn vẫn có thể xuất lookbook thành JSON.'); return; }
    const url = new URL(location.href);
    url.hash = `${currentOnly ? 'look' : 'lookbook'}=${Core.encodeShare(looks)}`;
    const payload = { title: currentOnly ? `${Core.lookName(state)} · AttireCraft` : 'Lookbook Việt phục · AttireCraft', text: 'Một chút di sản, một chút chất riêng. Khám phá bản phối Việt phục của tôi.', url: url.href };
    shareBusy = true;
    const trigger = $(currentOnly ? '#share-current-button' : '#share-button');
    trigger?.setAttribute('aria-busy', 'true');
    try {
      if (navigator.share) {
        try { await navigator.share(payload); closeStory(); return; }
        catch (error) { if (error.name === 'AbortError') return; }
      }
      if (await copyText(url.href)) {
        showToast(currentOnly ? 'Đã sao chép liên kết. Người nhận có thể mở đúng bản phối này.' : 'Đã sao chép liên kết lookbook với đầy đủ các lựa chọn.');
        closeStory();
      }
      else showManualShare(url.href);
    } catch (_) { showManualShare(url.href); }
    finally { shareBusy = false; trigger?.removeAttribute('aria-busy'); }
  }

  function imageForDownload(look) {
    return Core.imagePath(look, false, true);
  }

  function openShare(currentOnly) {
    const looks = currentOnly ? [currentLook()] : savedLooks;
    if (!looks.length) { showToast('Hãy lưu ít nhất một bản phối trước khi chia sẻ lookbook.'); return; }
    const dialog = $('#story-dialog');
    storyTrigger = document.activeElement;
    setText('#dialog-label', currentOnly ? 'GIỮ LẠI BẢN PHỐI' : 'CHIA SẺ LOOKBOOK');
    setText('#dialog-title', currentOnly ? 'Một bản phối, mang theo bạn.' : 'Bộ sưu tập, sẵn sàng chia sẻ.');
    const preview = element('div', `share-preview${looks.length > 1 ? ' collection' : ''}`);
    looks.slice(0, 3).forEach(look => preview.append(createImage(look)));
    const download = button('primary-button', currentOnly ? '↓ Tải ảnh bản phối PNG' : '↓ Tải ảnh lookbook PNG', 'download-image-button');
    download.addEventListener('click', async () => {
      if (downloadBusy) return;
      downloadBusy = true;
      download.disabled = true;
      download.setAttribute('aria-busy', 'true');
      download.textContent = 'Đang chuẩn bị ảnh…';
      try {
        const blob = await window.AttireDownload.create(looks, imageForDownload);
        window.AttireDownload.save(blob, `attirecraft-${currentOnly ? `${looks[0].garment}-${looks[0].color}` : 'lookbook'}.png`);
        showToast(currentOnly ? 'Đã tải ảnh bản phối xuống.' : `Đã tải ảnh lookbook gồm ${looks.length} bản phối.`);
      } catch (error) { showToast(error.message || 'Chưa tải được ảnh. Hãy thử lại.'); }
      finally {
        downloadBusy = false;
        download.disabled = false;
        download.removeAttribute('aria-busy');
        download.textContent = currentOnly ? '↓ Tải ảnh bản phối PNG' : '↓ Tải ảnh lookbook PNG';
      }
    });
    const link = button('secondary-button', '↗ Chia sẻ liên kết', 'share-link-button');
    link.addEventListener('click', () => shareLooks(currentOnly));
    const actions = element('div', 'share-dialog-actions');
    actions.append(download, link);
    $('#dialog-content').replaceChildren(preview, element('p', '', currentOnly ? 'Tải ảnh đầy đủ để lưu lại hoặc gửi cho bạn bè.' : `Tải một ảnh tổng hợp ${looks.length} bản phối, có tên trang phục và phụ kiện.`), actions, element('p', 'story-note', 'Liên kết chia sẻ chứa các lựa chọn phối đồ.'));
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  function exportLookbook() {
    if (!savedLooks.length) { showToast('Lookbook đang trống. Hãy lưu một bản phối trước.'); return; }
    const blob = new Blob([Core.serializeLookbook(savedLooks)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = element('a');
    link.href = url;
    link.download = `attirecraft-lookbook-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    showToast(`Đã xuất ${savedLooks.length} bản phối. Giữ tệp JSON để khôi phục trên thiết bị khác.`);
  }

  function importLooks(incoming) {
    const result = Core.mergeLooks(savedLooks, incoming, uid(), Date.now());
    if (result.status === 'full') { showToast(`Chưa nhập: cần thêm ${result.needed} chỗ trong lookbook (tối đa ${MAX_LOOKS}). Hãy xuất hoặc xóa bớt bản phối rồi thử lại.`); return false; }
    if (result.status === 'duplicate') { showToast('Tất cả bản phối trong tệp hoặc liên kết này đã có trong lookbook.'); return true; }
    const stored = commitLooks(result.looks);
    showToast(`Đã nhập ${result.added} bản phối${result.skipped ? `, bỏ qua ${result.skipped} bản trùng` : ''}.${storageSuffix(stored)}`);
    return true;
  }

  async function importFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || importBusy) return;
    if (file.size > Core.MAX_FILE_BYTES) { showToast('Tệp quá lớn. Hãy chọn tệp JSON lookbook dưới 100 KB.'); return; }
    importBusy = true;
    $('#import-button')?.setAttribute('aria-busy', 'true');
    try {
      const parsed = Core.parseLookbook(await file.text());
      if (!parsed.looks.length) { showToast('Tệp lookbook này chưa có bản phối.'); return; }
      importLooks(parsed.looks);
    } catch (error) { showToast(error.message || 'Không thể đọc tệp lookbook.'); }
    finally { importBusy = false; $('#import-button')?.removeAttribute('aria-busy'); }
  }

  function dismissShared() {
    sharedLooks = [];
    $('#shared-lookbook-notice')?.remove();
    try { history.replaceState(null, '', `${location.pathname}${location.search}#studio`); } catch (_) { /* Some local browser contexts restrict history updates. */ }
  }

  function readSharedLink() {
    const params = new URLSearchParams(location.hash.slice(1));
    const encoded = params.get('look') || params.get('lookbook');
    if (!encoded) return false;
    try {
      const configs = Core.decodeShare(encoded);
      setConfig(configs[0], { exitEditing: true });
      if (params.has('lookbook')) {
        sharedLooks = configs;
        $('#shared-lookbook-notice')?.remove();
        const notice = element('div', 'shared-lookbook-notice');
        notice.id = 'shared-lookbook-notice';
        const description = element('div');
        description.append(element('strong', '', `${configs.length} bản phối được chia sẻ với bạn`), element('p', '', 'Bản đầu tiên đang mở trong phòng phối. Nhập bộ sưu tập để xem và chỉnh sửa tất cả.'));
        const actions = element('div', 'shared-actions');
        const accept = button('secondary-button', 'Nhập vào lookbook', 'import-shared-button');
        accept.addEventListener('click', () => {
          if (importLooks(sharedLooks)) { dismissShared(); $('#lookbook-title')?.focus({ preventScroll: true }); }
        });
        const dismiss = button('text-button', 'Bỏ qua', 'dismiss-shared-button');
        dismiss.addEventListener('click', () => { dismissShared(); $('#lookbook-title')?.focus({ preventScroll: true }); });
        actions.append(accept, dismiss);
        notice.append(description, actions);
        $('#saved-grid')?.before(notice);
        showToast(`Đã mở bản phối được chia sẻ. Bạn có thể nhập ${configs.length} bản ở mục Lookbook.`);
      } else showToast('Đã mở bản phối được chia sẻ. Bạn có thể thay đổi lựa chọn hoặc lưu vào lookbook.');
      return true;
    } catch (error) { showToast(error.message); return false; }
  }

  if (!$('#save-copy-button') && $('.preview-actions')) {
    $('.preview-actions').append(button('secondary-button save-copy-button', 'Lưu thành bản mới', 'save-copy-button'));
    $('#save-copy-button').hidden = true;
  }
  on('#outfit-form', 'submit', (event) => event.preventDefault());
  $$('input[name="garment"]').forEach((input) => input.addEventListener('change', () => setConfig({ ...state, garment: input.value })));
  [['#occasion-options', 'occasion', 'value'], ['#color-options', 'color', 'color'], ['#style-options', 'style', 'value']].forEach(([selector, key, attribute]) => {
    on(selector, 'click', (event) => {
      const choice = event.target.closest(`button[data-${attribute}]`);
      if (choice && !choice.disabled) setConfig({ ...state, [key]: choice.dataset[attribute] });
    });
  });
  on('#weather-select', 'change', (event) => setConfig({ ...state, weather: event.target.value }));
  on('#accessory-options', 'click', (event) => {
    const choice = event.target.closest('button[data-value]');
    if (!choice) return;
    const key = choice.dataset.value;
    const selected = state.accessories.includes(key);
    if (!selected && state.accessories.length >= 2) { showToast('Bạn có thể chọn tối đa 2 phụ kiện. Bỏ một món đang chọn để thử món khác.'); return; }
    setConfig({ ...state, accessories: selected ? state.accessories.filter((item) => item !== key) : [...state.accessories, key] });
  });
  on('#save-button', 'click', () => saveLook());
  on('#save-copy-button', 'click', () => saveLook(true));
  on('#suggest-button', 'click', () => { setConfig(Core.suggest(state, ++suggestionIndex)); showToast('Đã gợi ý một cách phối theo dịp và thời tiết bạn chọn. Bạn có thể tinh chỉnh tiếp.'); });
  on('#reset-button', 'click', () => { setConfig(Core.DEFAULT, { exitEditing: true }); showToast('Đã trở về bản phối ban đầu. Lookbook vẫn được giữ nguyên.'); });
  on('#saved-grid', 'click', (event) => {
    const target = event.target.closest('button[data-id]');
    if (!target) return;
    const look = savedLooks.find((item) => item.id === target.dataset.id);
    if (!look) return;
    if (target.classList.contains('remove-look')) removeLook(look.id);
    if (target.classList.contains('saved-edit')) { editingId = look.id; setConfig(look, { scroll: true }); showToast(`Đang chỉnh sửa “${look.name}”. Bấm Cập nhật bản phối để lưu thay đổi.`); }
    if (target.classList.contains('saved-compare')) openCompare(target, look);
  });
  on('#toast', 'click', (event) => {
    if (!event.target.closest('#undo-button') || !undoAction) return;
    const action = undoAction;
    undoAction = null;
    action();
  });
  on('#toast', 'pointerenter', () => clearTimeout(toastTimer));
  on('#toast', 'pointerleave', () => scheduleToast());
  on('#toast', 'focusin', () => clearTimeout(toastTimer));
  on('#toast', 'focusout', () => scheduleToast());
  on('#compare-button', 'click', (event) => {
    const tray = $('#compare-tray');
    if (tray && !tray.hidden) closeCompare();
    else openCompare(event.currentTarget);
  });
  on('#tray-close', 'click', () => closeCompare());
  on('#compare-content', 'click', (event) => {
    if (!event.target.closest('#set-baseline')) return;
    compareSnapshot = currentLook();
    renderCompare();
    $('#set-baseline')?.focus({ preventScroll: true });
    showToast('Đã đặt mốc A. Thay đổi lựa chọn trong phòng phối để so sánh trực tiếp.');
  });
  on('#note-more', 'click', () => openStory(state.garment));
  $$('.read-button').forEach((item) => item.addEventListener('click', () => openStory(item.dataset.story)));
  on('#dialog-close', 'click', closeStory);
  on('#story-dialog', 'close', () => { if (storyTrigger?.isConnected) storyTrigger.focus({ preventScroll: true }); });
  on('#story-dialog', 'click', (event) => {
    const dialog = event.currentTarget;
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeStory();
  });
  on('#menu-button', 'click', () => {
    const nav = $('.desktop-nav');
    if (!nav) return;
    if (nav.classList.contains('open')) { closeMenu(); return; }
    nav.classList.add('open');
    $('#menu-button').setAttribute('aria-expanded', 'true');
    $('#menu-button').setAttribute('aria-label', 'Đóng menu điều hướng');
    setText('#menu-button', '×');
  });
  $$('a[href="#top"]').forEach((link) => link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu();
    window.scrollTo({ top: 0, left: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    history.replaceState(history.state, '', '#top');
  }));
  $$('.desktop-nav a').forEach((link) => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', (event) => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if ($('#story-dialog')?.open) return;
    if ($('#compare-tray') && !$('#compare-tray').hidden) { closeCompare(); event.preventDefault(); }
    else closeMenu(true);
  });
  const desktopQuery = window.matchMedia('(min-width: 821px)');
  desktopQuery.addEventListener?.('change', (event) => { if (event.matches) closeMenu(); });
  on('#share-button', 'click', () => openShare(false));
  on('#share-current-button', 'click', () => openShare(true));
  on('#export-button', 'click', exportLookbook);
  on('#import-button', 'click', () => $('#import-input')?.click());
  on('#import-input', 'change', importFile);
  const PRESETS = {
    festival: { garment: 'ngu-than', color: 'red', style: 'classic', occasion: 'le-hoi', weather: 'cool', accessories: ['khan'] },
    graduation: { garment: 'ao-dai', color: 'ivory', style: 'minimal', occasion: 'ky-yeu', weather: 'warm', accessories: ['ngoc', 'tui'] },
    daily: { garment: 'ba-ba', color: 'teal', style: 'minimal', occasion: 'hang-ngay', weather: 'warm', accessories: ['non'] }
  };
  $$('[data-preset]').forEach((item) => item.addEventListener('click', () => {
    if (!Object.prototype.hasOwnProperty.call(PRESETS, item.dataset.preset)) return;
    setConfig(PRESETS[item.dataset.preset], { exitEditing: true, scroll: true });
    showToast('Đã mở bản phối gợi ý. Thêm một chút cá tính của bạn nhé.');
  }));
  window.addEventListener('hashchange', readSharedLink);
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    try {
      savedLooks = event.newValue ? Core.parseLookbook(event.newValue, true).looks : [];
      if (!savedLooks.some((look) => look.id === editingId)) editingId = null;
      renderLookbook();
      persistDraft();
      showToast('Lookbook đã được đồng bộ với thay đổi ở thẻ trình duyệt khác.');
    } catch (_) { showToast('Dữ liệu từ thẻ khác không hợp lệ. Lookbook hiện tại được giữ nguyên.'); }
  });

  if ($('#compare-tray')) { $('#compare-tray').hidden = true; $('#compare-tray').setAttribute('aria-hidden', 'true'); }
  if ($('#lookbook-title')) $('#lookbook-title').tabIndex = -1;
  updatePreview();
  renderLookbook();
  updateDraftStatus();
  const openedShared = readSharedLink();
  if (!openedShared && (startupMessages.length || !storageAvailable)) {
    showToast(startupMessages.join(' ') || 'Bộ nhớ trình duyệt không khả dụng. Bạn vẫn có thể phối đồ và xuất lookbook trong phiên này.');
  }
})();
