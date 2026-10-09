'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const Core = require('../frontend/core.js');
const base = (changes = {}) => ({ ...Core.DEFAULT, accessories: [], ...changes });
const look = (changes = {}, id = 'test') => Core.makeLook(base(changes), id, 1750000000000);
const encodeRaw = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const configurations = Object.keys(Core.DATA.garments).flatMap((garment) => Object.keys(Core.DATA.colors).map((color) => base({ garment, color })));

test('validates every enum and refuses prototype keys, incomplete objects and malformed accessories', () => {
  for (const value of [null, [], {}, 'look', 42, { ...base(), color: '__proto__' }, { ...base(), garment: 'constructor' }, { ...base(), occasion: 'toString' }, { ...base(), weather: 'snow' }, { ...base(), style: 'unknown' }, { ...base(), accessories: null }, { ...base(), accessories: ['non', 'non'] }, { ...base(), accessories: ['unknown'] }, { ...base(), accessories: ['non', 'tui', 'ngoc'] }]) {
    assert.equal(Core.validateConfig(value), null);
    assert.equal(Core.configKey(value), null);
  }
  assert.deepEqual(Core.validateConfig(base()), base());
});

test('normalization strips untrusted metadata, sorts accessories and does not mutate input', () => {
  const input = base({ accessories: ['tui', 'non'], name: '<img onerror=alert(1)>', extra: true });
  const valid = Core.validateConfig(input);
  assert.deepEqual(valid.accessories, ['non', 'tui']);
  assert.deepEqual(input.accessories, ['tui', 'non']);
  assert.equal(valid.name, undefined);
  assert.equal(valid.extra, undefined);
  valid.accessories.pop();
  assert.equal(input.accessories.length, 2);
});

test('full configuration identity includes weather and accessories but ignores selection order', () => {
  const key = Core.configKey(base());
  for (const changes of [{ weather: 'rain' }, { color: 'red' }, { style: 'classic' }, { garment: 'ba-ba' }, { occasion: 'cuoi' }, { accessories: ['non'] }]) {
    assert.notEqual(Core.configKey(base(changes)), key);
  }
  assert.equal(Core.configKey(base({ accessories: ['tui', 'non'] })), Core.configKey(base({ accessories: ['non', 'tui'] })));
});

test('scoring responds to context and material comfort constraints', () => {
  assert.equal(Core.getScore(base()), 98);
  assert.ok(Core.getScore(base({ weather: 'rain' })) < Core.getScore(base()));
  assert.ok(Core.getScore(base({ color: 'black' })) < Core.getScore(base({ color: 'ivory' })));
  assert.ok(Core.getScore(base({ garment: 'ba-ba', occasion: 'hang-ngay' })) > Core.getScore(base({ garment: 'ba-ba', occasion: 'cuoi' })));
  assert.equal(Core.getScore(base({ garment: 'ba-ba', accessories: ['khan'] })), Core.getScore(base({ garment: 'ba-ba' })), 'Cultural notes do not penalize the styling score');
  assert.throws(() => Core.getScore({}), TypeError);
});

test('all supported choices produce bounded scores, descriptions and safe local image paths', () => {
  const accessories = [[], ['non'], ['khan'], ['ngoc'], ['tui'], ['non', 'tui'], ['khan', 'ngoc']];
  let visited = 0;
  for (const garment of Object.keys(Core.DATA.garments)) {
    for (const occasion of Object.keys(Core.DATA.occasions)) {
      for (const weather of Object.keys(Core.DATA.weather)) {
        for (const color of Object.keys(Core.DATA.colors)) {
          for (const style of Object.keys(Core.DATA.styles)) {
            for (const items of accessories) {
              const config = { garment, occasion, weather, color, style, accessories: items };
              const score = Core.getScore(config);
              assert.ok(score >= 0 && score <= 100);
              assert.ok(Core.lookName(config).length > 5);
              assert.equal(typeof Core.cultureStatus(config).warning, 'boolean');
              assert.ok(Core.scoreReasons(config).length > 10);
              assert.ok(Core.stylingTip(config).length > 10);
              assert.ok(Core.weatherTip(config).length > 10);
              assert.match(Core.imagePath(config), /^assets\/optimized\/(?:(?:accessories|styles\/(?:genz|classic))\/)?[a-z-]+\.webp$/);
              visited++;
            }
          }
        }
      }
    }
  }
  assert.equal(visited, 5040);
});

test('every outfit and accessory combination has matching full, original and thumbnail artwork', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const variants = require('../frontend/image-variants.js');
  assert.equal(variants.length, 200, '20 outfits each need 10 accessory variants');
  assert.equal(new Set(variants).size, 200);
  const keys = Object.keys(Core.DATA.accessories).sort();
  const combinations = [[], ...keys.map(key => [key])];
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) combinations.push([keys[i], keys[j]]);
  for (const garment of Object.keys(Core.DATA.garments)) for (const color of Object.keys(Core.DATA.colors)) for (const accessories of combinations) {
    const config = base({ garment, color, accessories });
    const image = Core.imagePath(config);
    assert.equal(image.includes('/accessories/'), accessories.length > 0);
    assert.equal(Core.imagePath(base({ garment, color, accessories: [...accessories].reverse() })), image, 'Selection order does not change the image');
    for (const source of [image, Core.imagePath(config, true), Core.imagePath(config, false, true)]) {
      assert.ok(fs.existsSync(path.resolve(__dirname, '../frontend', source)), `Missing ${source}`);
    }
  }
  assert.throws(() => Core.imagePath({ garment: '../escape', color: 'ivory' }), TypeError);
  assert.throws(() => Core.imagePath(base({ accessories: ['../escape'] })), TypeError);
  assert.throws(() => Core.imagePath(base({ style: '../escape' })), TypeError);
});

test('published personality images resolve correctly and pending variants use matching existing photos', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const variants = require('../frontend/style-image-variants.js');
  const published = new Set(variants);
  assert.equal(published.size, variants.length, 'No duplicate published variants');
  const expected = new Set();
  let available = 0;
  const keys = Object.keys(Core.DATA.accessories).sort();
  const combinations = [[], ...keys.map(key => [key])];
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) combinations.push([keys[i], keys[j]]);
  for (const garment of Object.keys(Core.DATA.garments)) for (const color of Object.keys(Core.DATA.colors)) for (const accessories of combinations) {
    const minimal = base({ garment, color, accessories });
    for (const style of ['genz', 'classic']) {
      const config = { ...minimal, style };
      const stem = `${garment}-${color}${accessories.length ? '--' + accessories.join('-') : ''}`;
      const registryKey = `${style}/${stem}`;
      expected.add(registryKey);
      const source = Core.imagePath(config);
      if (published.has(registryKey)) {
        available++;
        assert.ok(source.includes(`/styles/${style}/`));
        assert.notEqual(source, Core.imagePath(minimal));
        assert.ok(Core.imageDescription(config).includes(Core.DATA.styleAccessories[style]));
      } else {
        assert.equal(source, Core.imagePath(minimal), `Pending ${registryKey} keeps its selected accessories`);
        assert.ok(!Core.imageDescription(config).includes(Core.DATA.styleAccessories[style]));
      }
      assert.equal(Core.imagePath({ ...config, accessories: [...accessories].reverse() }), source);
      for (const image of [source, Core.imagePath(config, true), Core.imagePath(config, false, true)]) {
        assert.ok(fs.existsSync(path.resolve(__dirname, '../frontend', image)), `Missing ${image}`);
      }
      assert.equal(config.accessories.length, accessories.length, 'Style accents do not consume accessory slots');
    }
    assert.ok(!Core.imagePath(minimal).includes('/styles/'));
  }
  assert.equal(expected.size, 440, 'Each style needs 200 accessory variants and 20 base outfits');
  assert.equal(available, variants.length, 'Every published variant belongs to the expected catalog');
});

test('classic ngu than with jade earrings and headscarf has style photos in all five colors', () => {
  for (const color of Object.keys(Core.DATA.colors)) {
    const config = base({ garment: 'ngu-than', color, style: 'classic', accessories: ['ngoc', 'khan'] });
    assert.equal(Core.imagePath(config), `assets/optimized/styles/classic/ngu-than-${color}--khan-ngoc.webp`);
    assert.ok(Core.imageDescription(config).includes('Vòng cổ ngọc trai'));
  }
});

test('style labels include automatic accents without changing selected accessories', () => {
  const config = base({ garment: 'ngu-than', style: 'classic', accessories: ['ngoc', 'tui'] });
  assert.deepEqual(Core.accessoryLabels(config), ['Khuyên ngọc', 'Túi lụa', 'Vòng cổ ngọc trai']);
  assert.deepEqual(config.accessories, ['ngoc', 'tui']);
  assert.deepEqual(Core.accessoryLabels(base({ style: 'genz' })), ['Kính râm']);
  assert.deepEqual(Core.accessoryLabels(base()), []);
});

test('missing style artwork falls back to the matching existing photo', () => {
  const fs = require('node:fs');
  const vm = require('node:vm');
  const sandbox = { AttireImageVariants: require('../frontend/image-variants.js'), AttireStyleImageVariants: [] };
  vm.runInNewContext(fs.readFileSync(require.resolve('../frontend/core.js'), 'utf8'), sandbox);
  for (const accessories of [[], ['non'], ['khan', 'tui']]) {
    for (const style of ['genz', 'classic']) {
      const config = base({ style, accessories });
      assert.equal(sandbox.AttireCore.imagePath(config), sandbox.AttireCore.imagePath({ ...config, style: 'minimal' }));
      assert.ok(!sandbox.AttireCore.imageDescription(config).includes(Core.DATA.styleAccessories[style]));
      assert.ok(!sandbox.AttireCore.accessoryLabels(config).includes(Core.DATA.styleAccessories[style]));
    }
  }
});

test('saved snapshots derive trusted name and score from configuration', () => {
  const snapshot = Core.makeLook({ ...base(), name: '<script>alert(1)</script>', score: 10000 }, 'known', 42);
  assert.equal(snapshot.name, 'Nét Ngà Đương Đại');
  assert.equal(snapshot.score, 98);
  assert.equal(snapshot.createdAt, 42);
  assert.throws(() => Core.makeLook({}, 'broken', 0));
});

test('adding a duplicate or a thirteenth item never changes or evicts existing items', () => {
  let looks = [];
  configurations.slice(0, 12).forEach((config, index) => {
    const previous = looks;
    const result = Core.addLook(looks, config, `look-${index}`, 10);
    assert.equal(result.status, 'added');
    assert.equal(previous.length, index);
    looks = result.looks;
  });
  const before = JSON.stringify(looks);
  const duplicate = Core.addLook(looks, configurations[0], 'duplicate', 20);
  const full = Core.addLook(looks, configurations[12], 'overflow', 20);
  assert.equal(duplicate.status, 'duplicate');
  assert.equal(full.status, 'full');
  assert.equal(full.looks, looks);
  assert.equal(JSON.stringify(looks), before);
  assert.equal(looks.length, 12);
});

test('the old six-item lookbook migrates without losing configurations', () => {
  const legacy = configurations.slice(0, 6).map((config, index) => ({ ...config, name: 'Old name', score: 1, id: 1700000000000 + index }));
  const result = Core.parseLookbook(JSON.stringify(legacy), true);
  assert.equal(result.legacy, true);
  assert.equal(result.looks.length, 6);
  assert.deepEqual(result.looks.map(Core.configKey), legacy.map(Core.configKey));
  assert.equal(result.looks[0].id, '1700000000000');
  assert.equal(result.looks[0].name, 'Nét Ngà Đương Đại');
  assert.equal(result.looks[0].createdAt, legacy[0].id);
});

test('storage recovery salvages valid records while strict import rejects incomplete records', () => {
  const raw = JSON.stringify([look(), null, { garment: 'unknown' }, look({ color: 'red' }, 'red')]);
  const recovered = Core.parseLookbook(raw, true);
  assert.equal(recovered.looks.length, 2);
  assert.equal(recovered.invalidCount, 2);
  assert.throws(() => Core.parseLookbook(raw), /thứ 2/);
});

test('parsing rejects broken envelopes, over-limit arrays and oversized JSON', () => {
  for (const text of ['null', '{}', '{', '42', JSON.stringify({ version: 99, looks: [] }), JSON.stringify({ version: 2, looks: {} }), JSON.stringify(Array.from({ length: 13 }, () => look())), ' '.repeat(Core.MAX_FILE_BYTES + 1)]) {
    assert.throws(() => Core.parseLookbook(text));
  }
});

test('parsing neutralizes untrusted text and guarantees distinct safe IDs', () => {
  const rows = [look({}, '\" onclick=alert(1)'), look({ color: 'red' }, 'same'), look({ color: 'pink' }, 'same'), look({ color: 'teal' }, 'recovered-2')];
  rows[0].name = '<svg onload=alert(1)>';
  rows[0].score = -10000;
  const parsed = Core.parseLookbook(JSON.stringify(rows));
  assert.equal(parsed.looks[0].name, 'Nét Ngà Đương Đại');
  assert.equal(parsed.looks[0].score, 98);
  assert.ok(parsed.looks.every((item) => /^[A-Za-z0-9_-]+$/.test(item.id)));
  assert.equal(new Set(parsed.looks.map((item) => item.id)).size, rows.length);
});

test('import deduplication includes accessories and weather', () => {
  const rows = [look(), look({}, 'copy'), look({ weather: 'rain' }, 'rain'), look({ accessories: ['ngoc'] }, 'ngoc')];
  const parsed = Core.parseLookbook(JSON.stringify(rows));
  assert.equal(parsed.looks.length, 3);
  assert.equal(parsed.duplicateCount, 1);
});

test('JSON export and import preserve all supported configuration fields', () => {
  const looks = [look({ accessories: ['non', 'tui'] }), look({ garment: 'ngu-than', style: 'classic', color: 'red', weather: 'cool', occasion: 'cuoi' }, 'second')];
  const exported = Core.serializeLookbook(looks);
  const envelope = JSON.parse(exported);
  assert.equal(envelope.version, 2);
  assert.equal(envelope.app, 'AttireCraft');
  assert.deepEqual(Core.parseLookbook(exported).looks, looks);
  assert.throws(() => Core.serializeLookbook(Array(13).fill(look())));
});

test('merge is atomic at capacity and leaves both source arrays untouched', () => {
  const existing = configurations.slice(0, 11).map((config, index) => Core.makeLook(config, `old-${index}`, 1));
  const incoming = configurations.slice(10, 13).map((config, index) => Core.makeLook(config, `new-${index}`, 2));
  const before = JSON.stringify({ existing, incoming });
  const full = Core.mergeLooks(existing, incoming, 'import', 3);
  assert.equal(full.status, 'full');
  assert.equal(full.needed, 1);
  assert.equal(full.looks, existing);
  assert.equal(JSON.stringify({ existing, incoming }), before);
  const success = Core.mergeLooks(existing, incoming.slice(0, 2), 'import', 3);
  assert.equal(success.added, 1);
  assert.equal(success.skipped, 1);
  assert.equal(success.looks.length, 12);
  assert.equal(existing.length, 11);
});

test('merge repairs ID collisions and retains complete weather/accessory variants', () => {
  const existing = [look({}, 'import-0')];
  const incoming = [base({ weather: 'rain' }), base({ accessories: ['tui'] })];
  const result = Core.mergeLooks(existing, incoming, 'import', 3);
  assert.equal(result.added, 2);
  assert.equal(new Set(result.looks.map((item) => item.id)).size, 3);
  assert.equal(Core.mergeLooks(result.looks, incoming, 'again', 4).status, 'duplicate');
});

test('share links round-trip a full twelve-look collection using URL-safe compact tokens', () => {
  const configs = configurations.slice(0, 12).map((config, index) => ({ ...config, weather: index % 2 ? 'rain' : 'cool', accessories: ['ngoc', 'tui'] }));
  const encoded = Core.encodeShare(configs);
  assert.match(encoded, /^[A-Za-z0-9_-]+$/);
  assert.ok(encoded.length < 2000);
  assert.deepEqual(Core.decodeShare(encoded), configs);
  assert.equal(encoded.includes('name'), false);
  assert.throws(() => Core.encodeShare([]));
  assert.throws(() => Core.encodeShare(Array(13).fill(base())));
});

test('share links reject malformed tokens, unsupported versions and invalid configurations', () => {
  const samples = ['', '<script>', 'a'.repeat(4001), encodeRaw(null), encodeRaw({ v: 2, looks: [] }), encodeRaw({ v: 1, looks: [] }), encodeRaw({ v: 1, looks: Array(13).fill([]) }), encodeRaw({ v: 1, looks: [['__proto__', 'le-hoi', 'warm', 'ivory', 'minimal', []]] }), encodeRaw({ v: 1, looks: [['ao-dai', 'le-hoi', 'warm', 'ivory', 'minimal', ['non', 'non']]] })];
  samples.forEach((encoded) => assert.throws(() => Core.decodeShare(encoded)));
});

test('suggestions preserve selected occasion and weather and always return a different valid look', () => {
  for (const occasion of Object.keys(Core.DATA.occasions)) {
    for (const weather of Object.keys(Core.DATA.weather)) {
      for (let seed = -10; seed < 20; seed++) {
        const original = base({ occasion, weather });
        const suggested = Core.suggest(original, seed);
        assert.ok(Core.validateConfig(suggested));
        assert.equal(suggested.occasion, occasion);
        assert.equal(suggested.weather, weather);
        assert.ok(Core.DATA.occasions[occasion].fit.includes(suggested.garment));
        assert.notEqual(Core.configKey(suggested), Core.configKey(original));
      }
    }
  }
});

test('comparison differences cover every selected dimension and ignore accessory order', () => {
  assert.deepEqual(Core.differences(base(), base()), []);
  assert.deepEqual(Core.differences(base({ accessories: ['non', 'tui'] }), base({ accessories: ['tui', 'non'] })), []);
  const changes = Core.differences(base(), base({ garment: 'ba-ba', color: 'red', occasion: 'hang-ngay', weather: 'rain', style: 'classic', accessories: ['tui'] }));
  assert.equal(changes.length, 6);
  assert.ok(changes.some((message) => message.includes('Thời tiết')));
  assert.ok(changes.some((message) => message.includes('Phụ kiện')));
});


test('score criteria add up and culturally flagged combinations are scored independently', () => {
  const configs = [base(), base({ occasion: 'cuoi', color: 'red' }), base({ garment: 'ba-ba', occasion: 'cuoi', color: 'black', accessories: ['ngoc', 'tui'] }), base({ weather: 'rain', style: 'genz' })];
  for (const config of configs) {
    const breakdown = Core.scoreBreakdown(config);
    assert.equal(breakdown.criteria.length, 3);
    assert.equal(breakdown.criteria.reduce((sum, item) => sum + item.max, 0), 100);
    assert.equal(breakdown.total, breakdown.criteria.reduce((sum, item) => sum + item.score, 0));
    assert.equal(breakdown.total, Core.makeLook(config, 'score-test', 1).score);
    for (const item of breakdown.criteria) {
      assert.ok(item.score >= 0 && item.score <= item.max);
      assert.ok(item.reason.length > 20);
    }
  }
  assert.equal(Core.getScore(base({ occasion: 'cuoi', color: 'red' })), 100);
  const flagged = base({ garment: 'ngu-than', style: 'genz' });
  assert.equal(Core.cultureStatus(flagged).warning, true);
  assert.equal(Core.getScore(flagged), Core.getScore({ ...flagged, style: 'classic' }));
  assert.throws(() => Core.scoreBreakdown({}), TypeError);
  assert.throws(() => Core.scoreImprovements({}), TypeError);
});

test('score improvements preserve user context and report the actual gain without mutation', () => {
  const keys = Object.keys(Core.DATA.accessories);
  const combinations = [[], ...keys.map(key => [key])];
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) combinations.push([keys[i], keys[j]]);
  for (const garment of Object.keys(Core.DATA.garments)) for (const occasion of Object.keys(Core.DATA.occasions)) for (const weather of Object.keys(Core.DATA.weather)) for (const color of Object.keys(Core.DATA.colors)) for (const style of Object.keys(Core.DATA.styles)) for (const accessories of combinations) {
    const config = { garment, occasion, weather, color, style, accessories };
    const snapshot = JSON.stringify(config);
    const changes = Core.scoreImprovements(config);
    assert.ok(changes.length <= 3);
    assert.equal(new Set(changes.map(change => change.id)).size, changes.length);
    for (const change of changes) {
      assert.ok(Core.validateConfig(change.config));
      assert.equal(change.config.occasion, occasion);
      assert.equal(change.config.weather, weather);
      assert.equal(change.config.style, style);
      assert.notEqual(Core.configKey(change.config), Core.configKey(config));
      assert.equal(change.before, Core.getScore(config));
      assert.equal(change.after, Core.getScore(change.config));
      assert.equal(change.delta, change.after - change.before);
      assert.ok(change.delta > 0);
    }
    assert.equal(JSON.stringify(config), snapshot);
  }
  assert.deepEqual(Core.scoreImprovements(base()), []);
});

test('guided discovery returns three distinct editable looks for every answer combination', () => {
  for (const occasion of Object.keys(Core.DATA.occasions)) for (const weather of Object.keys(Core.DATA.weather)) for (const style of Object.keys(Core.DATA.styles)) {
    const answers = { occasion, weather, style };
    const snapshot = JSON.stringify(answers);
    const results = Core.guidedSuggestions(answers);
    assert.equal(results.length, 3);
    assert.equal(new Set(results.map(item => Core.configKey(item.config))).size, 3);
    assert.ok(new Set(results.map(item => item.config.garment)).size >= 2);
    for (const result of results) {
      assert.ok(Core.validateConfig(result.config));
      assert.equal(result.config.occasion, occasion);
      assert.equal(result.config.weather, weather);
      assert.equal(result.config.style, style);
      assert.ok(Core.DATA.occasions[occasion].fit.includes(result.config.garment));
      assert.equal(result.score, Core.getScore(result.config));
      assert.equal(result.reasons.length, 3);
      assert.ok(result.reasons.every(reason => reason.length > 20));
      if (weather === 'warm') assert.notEqual(result.config.color, 'black');
      assert.deepEqual(Core.decodeShare(Core.encodeShare([result.config])), [result.config]);
    }
    assert.deepEqual(results, Core.guidedSuggestions(answers));
    assert.equal(JSON.stringify(answers), snapshot);
  }
  for (const answers of [null, {}, [], { occasion: 'le-hoi', weather: 'snow', style: 'minimal' }, { occasion: '__proto__', weather: 'warm', style: 'genz' }, { occasion: 'cuoi', weather: 'warm', style: 'unknown' }]) {
    assert.throws(() => Core.guidedSuggestions(answers), TypeError);
  }
});
