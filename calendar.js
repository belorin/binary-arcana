'use strict';
// Desktop calendar (/#calendar), drawn from wiki/calendar.json (MAINTENANCE.md).
// The world has no 원년, so time is counted in P3 units from the reference point
// T0 (wiki/binary-system.md): 1해 = 10철, 1철 = 4물때 = 44날, 1물때 = 11날.
// T0 itself is the first 날 of a 겹침철, so the 1철 and 6철 of every 해 are 겹침철.
// 큰 순서: eras whose distance from T0 is unknown, in order, as a ladder.
// T0 연대: days down a vertical strip; one row is a 해, a 철 or a 물때 depending
// on the scale, and long empty stretches fold into a single gap row.
// 한 해: one 해 of 440날, a 물때 per row, 철 separated by lines, 겹침 marked.
// The list on the right follows the part of the strip in view; hovering an item
// lights its cells, hovering a cell lights its items. Two looks: 덩어리 and 칸.
(function () {
  const DAYS = {해: 440, 철: 44, 물때: 11, 날: 1};
  const YEAR = 440, SEASON = 44, TIDE = 11;
  const OVERLAP = [1, 6];   // 겹침철 in every 해
  const HIDE_DAY = 23;      // 숨음: half a 철 after the 겹침 on the 1st 날
  const SCALES = {
    해: {cell: SEASON, per: 10},
    철: {cell: TIDE, per: 4},
    물때: {cell: 1, per: 11}
  };
  const POINT = /^T0(?:([+-])((?:\d+(?:해|철|물때|날)?)+))?$/;
  const CYCLE = /^(\d{1,2})철(?: (\d)물때)?(?: (\d{1,2})날)?$/;
  let data = null, loading = null, mode = 'era', scale = '철', look = 'blocks', pendingSection = null;

  // "T0", "T0-33", "T0+1해2철" → days from T0.
  function dayOf(text) {
    const m = POINT.exec(text);
    if (!m) return NaN;
    if (!m[1]) return 0;
    let days = 0;
    for (const [, n, unit] of m[2].matchAll(/(\d+)(해|철|물때|날)?/g)) days += +n * DAYS[unit || '날'];
    return m[1] === '-' ? -days : days;
  }
  const signed = (n, unit) => n === 0 ? 'T0' + unit : 'T0' + (n > 0 ? '+' : '−') + Math.abs(n) + unit;
  // Days from T0 → which 해 (T0해 = the 해 that begins at T0), 철, 물때, 날.
  function parts(d) {
    const year = Math.floor(d / YEAR), r = d - year * YEAR;
    return {year, season: Math.floor(r / SEASON) + 1, tide: Math.floor(r % SEASON / TIDE) + 1, day: r % TIDE + 1, r};
  }
  const yearLabel = year => signed(year, '해');
  const isOverlap = season => OVERLAP.includes(season);
  const level = n => n ? ' l' + Math.min(n, 4) : '';
  // A day of the year that the sky marks: the 겹침 and the 숨음 of the two 겹침철.
  function skyMark(r) {
    const season = Math.floor(r / SEASON) + 1, inSeason = r % SEASON + 1;
    if (!isOverlap(season)) return '';
    return inSeason === 1 ? ' cal-ov' : inSeason === HIDE_DAY ? ' cal-hide' : '';
  }

  function lineSpan(entry) {
    return [dayOf(entry.from), dayOf(entry.to ?? entry.from)];
  }
  function lineWhen(entry) {
    const show = text => text.replace('-', '−');
    return entry.to && entry.to !== entry.from ? show(entry.from) + ' – ' + show(entry.to) : show(entry.from);
  }
  // A day of the year (0–439) from "3철", "3철 2물때" or "3철 2물때 5날".
  function cycleDay(text, end) {
    const m = CYCLE.exec(text);
    const start = (+m[1] - 1) * SEASON + (m[2] ? (+m[2] - 1) * TIDE : 0) + (m[3] ? +m[3] - 1 : 0);
    if (!end || m[3]) return start;
    return start + (m[2] ? TIDE : SEASON) - 1;
  }
  // Recurring dates are laid on one 해; a span past the 10철 wraps.
  function cycleRanges(entry) {
    const start = cycleDay(entry.every.from, false), end = cycleDay(entry.every.to ?? entry.every.from, true);
    return start <= end ? [[start, end]] : [[start, YEAR - 1], [0, end]];
  }
  function cycleWhen(entry) {
    return entry.every.to && entry.every.to !== entry.every.from ? entry.every.from + ' – ' + entry.every.to : entry.every.from;
  }

  function lineStrip(items, esc) {
    const {cell, per} = SCALES[scale], span = cell * per;
    const rowOf = t => Math.floor(t / span);
    const used = new Set();
    for (const it of items) for (let r = rowOf(it.s); r <= rowOf(it.t); r++) used.add(r);
    const rows = [...used].sort((a, b) => a - b);
    // Rows of a 물때 name only what changed since the row above; a gap or the
    // first row names the whole point.
    const rowLabel = (a, full) => {
      const p = parts(a);
      if (scale === '해') return yearLabel(p.year);
      if (scale === '철') return yearLabel(p.year) + ' ' + p.season + '철';
      if (full) return yearLabel(p.year) + ' ' + p.season + '철 ' + p.tide + '물때';
      return p.tide === 1 ? (p.season === 1 ? yearLabel(p.year) + ' ' : '') + p.season + '철' : p.tide + '물때';
    };
    const lineRow = (r, hits, full) => {
      const a = r * span, p = parts(a);
      let cells = '';
      for (let c = 0; c < per; c++) {
        const lo = a + c * cell, hi = lo + cell - 1;
        const ids = hits.filter(it => it.s <= hi && it.t >= lo).map(it => it.e.id);
        const sky = scale === '해' ? (isOverlap(c + 1) ? ' cal-ovseason' : '') : scale === '물때' ? skyMark(parts(lo).r) : '';
        cells += '<i class="cal-cell' + level(ids.length) + sky + '"' + (ids.length ? ' data-ids="' + ids.join(' ') + '"' : '') + '></i>';
      }
      const strong = scale === '해' ? p.year === 0 : scale === '철' ? isOverlap(p.season) : p.tide === 1 && isOverlap(p.season);
      return '<div class="cal-row' + (strong ? ' cal-strong' : '') + '" data-a="' + a + '" data-b="' + (a + span - 1) + '">' +
        '<span class="cal-label">' + esc(rowLabel(a, full)) + '</span><span class="cal-cells" style="--per:' + per + '">' + cells + '</span></div>';
    };
    let html = '';
    for (let i = 0; i < rows.length; i++) {
      const gap = i ? rows[i] - rows[i - 1] - 1 : 0;
      if (gap >= 3) html += '<div class="cal-gap">⋯ ' + esc(rowLabel((rows[i - 1] + 1) * span, true)) + ' – ' + esc(rowLabel((rows[i] - 1) * span, true)) + '</div>';
      else for (let k = rows[i] - gap; k < rows[i]; k++) html += lineRow(k, []);
      const a = rows[i] * span, b = a + span - 1;
      html += lineRow(rows[i], items.filter(it => it.s <= b && it.t >= a), i === 0 || gap >= 3);
    }
    return html;
  }

  function cycleStrip(items, esc) {
    let html = '';
    for (let row = 0; row < YEAR / TIDE; row++) {
      const first = row * TIDE, season = Math.floor(first / SEASON) + 1, tide = row % 4 + 1;
      let cells = '';
      for (let c = 0; c < TIDE; c++) {
        const d = first + c;
        const ids = items.filter(it => it.ranges.some(([s, t]) => s <= d && d <= t)).map(it => it.e.id);
        cells += '<i class="cal-cell' + level(ids.length) + (tide === 1 && row ? ' mt' : '') + skyMark(d) + '"' +
          (ids.length ? ' data-ids="' + ids.join(' ') + '"' : '') + '></i>';
      }
      const label = tide === 1 ? season + '철' + (isOverlap(season) ? ' · 겹침철' : '') : '';
      html += '<div class="cal-row' + (tide === 1 && isOverlap(season) ? ' cal-strong' : '') + '" data-a="' + first + '" data-b="' + (first + TIDE - 1) + '">' +
        '<span class="cal-label">' + esc(label) + '</span><span class="cal-cells" style="--per:' + TIDE + '">' + cells + '</span></div>';
    }
    return html;
  }

  // Eras: an ordered ladder. Whole numbers are eras, decimals sit under them.
  function ladder(items, esc, permalink) {
    return '<ol class="cal-ladder">' + items.map(it => {
      const sub = !Number.isInteger(it.e.era);
      return '<li class="' + (sub ? 'cal-sub' : 'cal-era') + '"><a href="' + permalink(it.e.doc) + '"' +
        (it.e.section ? ' data-section="' + esc(it.e.section) + '"' : '') + '>' +
        '<span class="cal-step">' + esc(sub ? '' : String(it.e.era)) + '</span>' +
        '<span class="cal-item">' + esc(it.e.label) + '</span>' +
        '<span class="cal-when">' + esc(it.e.when) + '</span>' +
        '<span class="cal-doc">' + esc(it.ctx.byId(it.e.doc).title) + '</span></a></li>';
    }).join('') + '</ol>';
  }

  function page(ctx) {
    const {esc, byId, permalink} = ctx;
    const key = {era: 'era', line: 'from', cycle: 'every'}[mode];
    const entries = (data.entries || []).filter(e => byId(e.doc) && e[key] !== undefined);
    const items = entries.map(e => mode === 'era' ? {e, ctx, key: e.era}
      : mode === 'line' ? (([s, t]) => ({e, s, t, key: s}))(lineSpan(e))
      : (ranges => ({e, ranges, key: ranges[0][0]}))(cycleRanges(e)));
    items.sort((a, b) => a.key - b.key || a.e.id.localeCompare(b.e.id));
    const tab = (value, label, current, attr) => '<button type="button" data-' + attr + '="' + value + '"' +
      (value === current ? ' class="active" aria-pressed="true"' : ' aria-pressed="false"') + '>' + label + '</button>';
    const bar = '<div class="cal-bar"><div class="cal-tabs">' + tab('era', '큰 순서', mode, 'cal-mode') +
      tab('line', 'T0 연대', mode, 'cal-mode') + tab('cycle', '한 해', mode, 'cal-mode') + '</div>' +
      (mode === 'line' ? '<div class="cal-tabs">' + Object.keys(SCALES).map(k => tab(k, k, scale, 'cal-scale')).join('') + '</div>' : '') +
      (mode === 'era' ? '' : '<div class="cal-tabs cal-look">' + tab('blocks', '덩어리', look, 'cal-look') + tab('cells', '칸', look, 'cal-look') + '</div>') + '</div>';
    const note = {
      era: '원년이 없어 날로 셀 수 없는 시대와 사건을 순서대로 놓았다. 간격은 아는 만큼만 적는다.',
      line: 'T0(큰 건넘 대국의 마지막 겹침)에서 센 날. 1해 = 10철, 1철 = 4물때 = 44날. T0해는 T0에서 시작하는 해다. 굵은 줄은 겹침철이다.',
      cycle: '한 해 440날. 한 줄이 한 물때(11날)다. 1철과 6철이 겹침철이며, 진한 칸은 겹침, 테두리 칸은 숨음이다.'
    }[mode];
    const head = '<div class="cal' + (look === 'blocks' ? ' cal-blocks' : '') + '" data-mode="' + mode + '"><div class="page-heading"><h1>달력</h1></div>' +
      bar + '<p class="cal-note">' + esc(note) + '</p>';
    if (mode === 'era') return head + (items.length ? ladder(items, esc, permalink) : '<p class="cal-none">아직 걸린 글이 없습니다.</p>') + '</div>';
    const list = items.map(it => '<li data-id="' + esc(it.e.id) + '"' +
      (mode === 'line' ? ' data-s="' + it.s + '" data-t="' + it.t + '"' : ' data-r="' + it.ranges.map(r => r.join('-')).join(',') + '"') +
      '><a href="' + permalink(it.e.doc) + '"' + (it.e.section ? ' data-section="' + esc(it.e.section) + '"' : '') + '>' +
      '<span class="cal-when">' + esc(mode === 'line' ? lineWhen(it.e) : cycleWhen(it.e)) + '</span>' +
      '<span class="cal-item">' + esc(it.e.label) + '</span>' +
      '<span class="cal-doc">' + esc(byId(it.e.doc).title) + '</span></a></li>').join('');
    return head + '<div class="cal-body"><div class="cal-strip">' + (mode === 'line' ? lineStrip(items, esc) : cycleStrip(items, esc)) + '</div>' +
      '<ol class="cal-list">' + list + '</ol><p class="cal-none" hidden>이 구간에 걸린 글이 없습니다.</p></div>' +
      '<div class="cal-tip" hidden></div></div>';
  }

  function wire(view, ctx) {
    const root = view.querySelector('.cal');
    root.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (link) { pendingSection = link.dataset.section || null; return; }
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.calMode) mode = button.dataset.calMode;
      else if (button.dataset.calScale) scale = button.dataset.calScale;
      else if (button.dataset.calLook) look = button.dataset.calLook;
      else return;
      show(view, ctx);
    });
    const strip = root.querySelector('.cal-strip');
    if (!strip) return;
    const list = root.querySelector('.cal-list'), tip = root.querySelector('.cal-tip'), none = root.querySelector('.cal-none');
    const labels = new Map((data.entries || []).map(e => [e.id, e.label]));
    const light = (ids, on) => {
      for (const id of ids) {
        for (const cell of strip.querySelectorAll('[data-ids~="' + id + '"]')) cell.classList.toggle('on', on);
        list.querySelector('[data-id="' + id + '"]')?.classList.toggle('on', on);
      }
    };
    // Show only the items that fall in the rows currently in view.
    const follow = () => {
      const box = strip.getBoundingClientRect();
      let a = Infinity, b = -Infinity;
      for (const row of strip.querySelectorAll('.cal-row')) {
        const r = row.getBoundingClientRect();
        if (r.bottom >= box.top && r.top <= box.bottom) { a = Math.min(a, +row.dataset.a); b = Math.max(b, +row.dataset.b); }
      }
      let shown = 0;
      for (const li of list.children) {
        const hit = li.dataset.r
          ? li.dataset.r.split(',').some(p => { const [s, t] = p.split('-').map(Number); return s <= b && t >= a; })
          : +li.dataset.s <= b && +li.dataset.t >= a;
        li.hidden = !hit;
        shown += hit;
      }
      none.hidden = shown > 0;
    };
    let frame = 0;
    strip.addEventListener('scroll', () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(follow); });
    follow();
    strip.addEventListener('mouseover', event => {
      const cell = event.target.closest('[data-ids]');
      if (!cell) return;
      const ids = cell.dataset.ids.split(' ');
      light(ids, true);
      tip.innerHTML = ids.map(id => '<div>' + ctx.esc(labels.get(id)) + '</div>').join('');
      tip.hidden = false;
    });
    strip.addEventListener('mousemove', event => {
      tip.style.left = event.clientX + 16 + 'px';
      tip.style.top = event.clientY + 12 + 'px';
    });
    strip.addEventListener('mouseout', event => {
      const cell = event.target.closest('[data-ids]');
      if (cell) { light(cell.dataset.ids.split(' '), false); tip.hidden = true; }
    });
    list.addEventListener('mouseover', event => { const li = event.target.closest('li'); if (li) light([li.dataset.id], true); });
    list.addEventListener('mouseout', event => { const li = event.target.closest('li'); if (li) light([li.dataset.id], false); });
  }

  // Mark the outer corners of each filled block; the 덩어리 look rounds them.
  // Gap rows break a block, as do empty cells.
  function corners(strip) {
    if (!strip) return;
    const grid = [...strip.children].map(row => row.classList.contains('cal-row') ? [...row.querySelectorAll('.cal-cell')] : []);
    const filled = (y, x) => Boolean(grid[y] && grid[y][x] && grid[y][x].dataset.ids);
    grid.forEach((cells, y) => cells.forEach((cell, x) => {
      if (!filled(y, x)) return;
      const up = filled(y - 1, x), down = filled(y + 1, x), left = filled(y, x - 1), right = filled(y, x + 1);
      if (!up && !left) cell.classList.add('ctl');
      if (!up && !right) cell.classList.add('ctr');
      if (!down && !right) cell.classList.add('cbr');
      if (!down && !left) cell.classList.add('cbl');
    }));
  }

  function show(view, ctx) {
    view.innerHTML = page(ctx);
    corners(view.querySelector('.cal-strip'));
    wire(view, ctx);
  }

  // Opening an item with a section scrolls the article to that heading.
  window.addEventListener('hashchange', () => {
    if (!pendingSection) return;
    const plain = text => text.replace(/[*`]/g, '').trim();
    const want = plain(pendingSection);
    pendingSection = null;
    const heading = [...document.querySelectorAll('#view h2, #view h3, #view h4')].find(h => plain(h.textContent) === want);
    heading?.scrollIntoView({block: 'start'});
  });

  window.Calendar = {
    dayOf, parts, lineSpan, cycleRanges, page,
    render(view, ctx) {
      if (!window.matchMedia('(min-width: 900px)').matches) {
        view.innerHTML = '<div class="empty">달력은 데스크톱 화면에서 볼 수 있습니다. <a href="#all">전체 문서 보기 →</a></div>';
        return;
      }
      if (data) return show(view, ctx);
      view.innerHTML = '<p class="muted">달력을 불러오는 중입니다.</p>';
      loading = loading || fetch('wiki/calendar.json', {cache: 'no-cache'}).then(r => { if (!r.ok) throw Error(); return r.json(); });
      loading.then(json => { data = json; if (location.hash === '#calendar') show(view, ctx); })
        .catch(() => { loading = null; view.innerHTML = '<div class="empty">달력 자료를 불러오지 못했습니다.</div>'; });
    },
    // For tests: render with data already in hand.
    setData(json) { data = json; },
    setView(nextMode, nextScale, nextLook) { mode = nextMode; if (nextScale) scale = nextScale; if (nextLook) look = nextLook; }
  };
})();
