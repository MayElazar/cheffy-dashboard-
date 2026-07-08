// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Total Revenue bar chart (Income / Outcome per month)
const monthsData = [
  { month: 'January',  income: 18200, outcome: 16400 },
  { month: 'February', income: 21600, outcome: 15200 },
  { month: 'March',    income: 7400,  outcome: 23800 },
  { month: 'April',    income: 20400, outcome: 8600  },
  { month: 'May',      income: 15800, outcome: 14600 },
  { month: 'June',     income: 21200, outcome: 17400 },
  { month: 'July',     income: 24600, outcome: 14200 },
];

const CHART_MAX = 25000;
const CHART_H   = 260; // px — matches .bars height in CSS

const barsEl  = document.getElementById('revenueBars');
const xAxisEl = document.getElementById('revenueXAxis');
const fmt = n => '$' + n.toLocaleString('en-US');

monthsData.forEach(({ month, income, outcome }) => {
  const iH = Math.round((income  / CHART_MAX) * CHART_H);
  const oH = Math.round((outcome / CHART_MAX) * CHART_H);
  const group = document.createElement('div');
  group.className = 'bar-group';
  group.innerHTML = `
    <i style="height:${iH}px;background:#8280ff"></i>
    <i style="height:${oH}px;background:#4342b1"></i>
    <div class="chart-tip">
      <b>${month}</b>
      <div class="tip-row"><span class="tip-dot" style="background:#8280ff"></span>Income <b>${fmt(income)}</b></div>
      <div class="tip-row"><span class="tip-dot" style="background:#4342b1"></span>Outcome <b>${fmt(outcome)}</b></div>
    </div>
  `;
  barsEl.appendChild(group);

  const label = document.createElement('span');
  label.textContent = month;
  xAxisEl.appendChild(label);
});

// ---------- Customer Growth line chart (scrollable) ----------
const growthData = [
  { label: 'Jan 2025', short: 'Jan', new: 175, returning: 165 },
  { label: 'Feb 2025', short: 'Feb', new: 190, returning: 175 },
  { label: 'Mar 2025', short: 'Mar', new: 300, returning: 250 },
  { label: 'Apr 2025', short: 'Apr', new: 420, returning: 300 },
  { label: 'May 2025', short: 'May', new: 540, returning: 415 },
  { label: 'Jun 2025', short: 'Jun', new: 610, returning: 470 },
  { label: 'Jul 2025', short: 'Jul', new: 700, returning: 545 },
  { label: 'Aug 2025', short: 'Aug', new: 730, returning: 560 },
  { label: 'Sep 2025', short: 'Sep', new: 750, returning: 585 },
  { label: 'Oct 2025', short: 'Oct', new: 770, returning: 600 },
  { label: 'Nov 2025', short: 'Nov', new: 785, returning: 615 },
  { label: 'Dec 2025', short: 'Dec', new: 800, returning: 630 },
];

const STEP = 70;                              // px between month points
const VB_W = (growthData.length - 1) * STEP;  // full drawn width
const VB_H = 160;                             // svg viewBox height
const V_MAX = 800;                            // top of value scale

const valToY = v => VB_H - (v / V_MAX) * (VB_H - 10);
const idxToX = i => i * STEP;

function buildPath(points) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

const growthTrack = document.getElementById('growthTrack');
const growthSvg = document.getElementById('growthSvg');
const growthXaxis = document.getElementById('growthXaxis');

// size the track + svg to the full timeline width so the lines run to the end
growthTrack.style.width = VB_W + 'px';
growthSvg.setAttribute('viewBox', `0 0 ${VB_W} ${VB_H}`);

const newPts = growthData.map((d, i) => ({ x: idxToX(i), y: valToY(d.new) }));
const retPts = growthData.map((d, i) => ({ x: idxToX(i), y: valToY(d.returning) }));
document.getElementById('growthNew').setAttribute('d', buildPath(newPts));
document.getElementById('growthReturning').setAttribute('d', buildPath(retPts));

// x-axis labels positioned on each point
growthData.forEach((d, i) => {
  const s = document.createElement('span');
  s.textContent = d.short;
  s.style.left = idxToX(i) + 'px';
  growthXaxis.appendChild(s);
});

// Hover interaction
const growthPlot = document.getElementById('growthPlot');
const hover = document.getElementById('growthHover');
const hoverLine = hover.querySelector('.growth-hover-line');
const dotNew = hover.querySelector('.dot-new');
const dotRet = hover.querySelector('.dot-returning');
const tooltip = hover.querySelector('.growth-tooltip');
const gtTitle = hover.querySelector('.gt-title');
const gtNew = hover.querySelector('.gt-new');
const gtRet = hover.querySelector('.gt-ret');

growthTrack.addEventListener('mousemove', e => {
  const rect = hover.getBoundingClientRect();
  const x = e.clientX - rect.left;
  if (x < 0 || x > rect.width) { hover.classList.remove('active'); return; }
  const idx = Math.max(0, Math.min(growthData.length - 1,
    Math.round((x / rect.width) * (growthData.length - 1))));
  const d = growthData[idx];
  const xPct = (idxToX(idx) / VB_W) * 100;
  const yNew = (valToY(d.new) / VB_H) * 100;
  const yRet = (valToY(d.returning) / VB_H) * 100;

  hover.classList.add('active');
  hoverLine.style.left = xPct + '%';
  dotNew.style.left = xPct + '%';
  dotNew.style.top = yNew + '%';
  dotRet.style.left = xPct + '%';
  dotRet.style.top = yRet + '%';

  gtTitle.textContent = d.label;
  gtNew.textContent = d.new;
  gtRet.textContent = d.returning;

  // flip tooltip left near the end so it doesn't overflow
  const xPx = idxToX(idx);
  tooltip.style.left = 'auto';
  tooltip.style.right = 'auto';
  if (idx >= growthData.length - 3) {
    tooltip.style.right = (VB_W - xPx + 8) + 'px';
  } else {
    tooltip.style.left = (xPx + 8) + 'px';
  }
});

growthTrack.addEventListener('mouseleave', () => hover.classList.remove('active'));

// ---------- Custom horizontal scrollbar ----------
const growthScroll = document.getElementById('growthScroll');
const scrollbar = document.getElementById('growthScrollbar');
const thumb = document.getElementById('growthThumb');

function syncThumb() {
  const barW = scrollbar.clientWidth;
  const ratio = growthScroll.clientWidth / growthScroll.scrollWidth;
  const thumbW = Math.max(ratio * barW, 24);
  const maxScroll = growthScroll.scrollWidth - growthScroll.clientWidth;
  const maxThumb = barW - thumbW;
  const left = maxScroll > 0 ? (growthScroll.scrollLeft / maxScroll) * maxThumb : 0;
  thumb.style.width = thumbW + 'px';
  thumb.style.left = left + 'px';
}

growthScroll.addEventListener('scroll', syncThumb);
window.addEventListener('resize', syncThumb);
syncThumb();

// drag the thumb
let dragging = false, dragStartX = 0, dragStartScroll = 0;
thumb.addEventListener('mousedown', e => {
  dragging = true;
  dragStartX = e.clientX;
  dragStartScroll = growthScroll.scrollLeft;
  e.preventDefault();
});
window.addEventListener('mousemove', e => {
  if (!dragging) return;
  const barW = scrollbar.clientWidth;
  const thumbW = thumb.offsetWidth;
  const maxScroll = growthScroll.scrollWidth - growthScroll.clientWidth;
  const maxThumb = barW - thumbW;
  const delta = e.clientX - dragStartX;
  growthScroll.scrollLeft = dragStartScroll + (delta / maxThumb) * maxScroll;
});
window.addEventListener('mouseup', () => { dragging = false; });

// click on the track jumps the scroll position
scrollbar.addEventListener('mousedown', e => {
  if (e.target === thumb) return;
  const barRect = scrollbar.getBoundingClientRect();
  const clickX = e.clientX - barRect.left;
  const ratio = clickX / barRect.width;
  const maxScroll = growthScroll.scrollWidth - growthScroll.clientWidth;
  growthScroll.scrollLeft = ratio * maxScroll;
});


// ============ Page routing ============
const pageMap = {
  'home': 'page-home',
  'revenue': 'page-revenue',
  'expenses': 'page-expenses',
  'inventory': 'page-inventory',
  'orders': 'page-orders',
  'suppliers invoice': 'page-invoices',
  'agent': 'page-agent',
};

function showPage(pageKey) {
  const targetId = pageMap[pageKey] || 'page-home';
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === targetId));
  document.querySelectorAll('.menu-item').forEach(m => {
    const key = (m.dataset.page || m.querySelector('span').textContent.trim().toLowerCase());
    m.classList.toggle('active', pageMap[key] === targetId);
  });
  window.scrollTo(0, 0);
}

document.querySelectorAll('.menu-item').forEach(item => {
  const key = item.dataset.page || item.querySelector('span').textContent.trim().toLowerCase();
  item.dataset.pageKey = key;
  item.addEventListener('click', e => {
    e.preventDefault();
    showPage(key);
  });
});

// Floating chat button -> agent page
const chatFab = document.querySelector('.chat-fab');
if (chatFab) chatFab.addEventListener('click', () => showPage('agent'));

// ============ Revenue: Sales Details area chart ============
(function () {
  const svg = document.getElementById('sdSvg');
  const xaxis = document.getElementById('sdXaxis');
  if (!svg) return;

  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sep'];
  // base points: [monthX (0..11), value in K] — the unfiltered "All" series
  const basePts = [
    [0, 38], [0.5, 36], [1, 40], [1.5, 44], [2, 42], [2.5, 39],
    [2.8, 40], [3, 64], [3.2, 38],                       // Jan spike
    [3.6, 46], [4, 45], [4.5, 47], [5, 44],
    [5.5, 42], [6, 33], [6.3, 34],                       // April dip
    [6.7, 40], [7, 41], [7.3, 34],
    [7.6, 57], [8, 51], [8.3, 52],                       // June rise
    [8.7, 50], [9, 49], [9.5, 44], [10, 50], [10.3, 48],
    [10.7, 49], [11, 50],
  ];

  const W = 1000, H = 234, VMIN = 0, VMAX = 70;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const mx2x = mx => (mx / 11) * W;
  const v2y = v => ((VMAX - v) / (VMAX - VMIN)) * H;

  // deterministic hash so the same filter combo always renders the same "data"
  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  // produce a variant of basePts scaled by a filter key string
  function seriesFor(key, periodKey, seatingKey) {
    // Crystal Mint Cocktail: no orders in the last 3 months (July=9, August=10, Sep=11)
    if (key === 'Crystal Mint Cocktail') {
      const h = hashStr(`${key}|${periodKey}|${seatingKey}`);
      const scale = 0.38 + (h % 20) / 100;
      const shift = -2;
      return basePts.map(([mx, v]) => {
        if (mx >= 9) return [mx, VMIN]; // flatline to zero for last 3 months
        const nv = VMIN + (v - VMIN) * scale + shift;
        return [mx, Math.max(VMIN + 1, Math.min(VMAX - 1, nv))];
      });
    }
    const h = hashStr(`${key}|${periodKey}|${seatingKey}`);
    const scale = 0.45 + (h % 46) / 100;      // 0.45 – 0.90
    const shift = ((h >> 4) % 7) - 3;
    return basePts.map(([mx, v]) => {
      const nv = VMIN + (v - VMIN) * scale + shift;
      return [mx, Math.max(VMIN + 1, Math.min(VMAX - 1, nv))];
    });
  }

  // each entry: { pts, color, label }
  let activeSeries = [{ pts: basePts, color: '#8280ff', label: 'Total' }];

  const SERIES_COLORS = ['#8280ff', '#f15bd3', '#4342b1', '#f38304', '#66d6fb'];

  function redraw() {
    svg.innerHTML = activeSeries.map((s, i) => {
      const gid = `sdGrad${i}`;
      const linePts = s.pts.map(([mx, v]) => `${mx2x(mx).toFixed(1)},${v2y(v).toFixed(1)}`);
      const linePath = 'M' + linePts.join(' L');
      const areaPath = `${linePath} L${W},${H} L0,${H} Z`;
      const op = i === 0 ? 0.22 : 0.12;
      return `
        <defs>
          <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${s.color}" stop-opacity="${op}"/>
            <stop offset="1" stop-color="${s.color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${areaPath}" fill="url(#${gid})"/>
        <path d="${linePath}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      `;
    }).join('');

    // rebuild hover dots
    dotsContainer.innerHTML = activeSeries.map((s, i) =>
      `<div class="sd-hover-dot" id="sdDot${i}" style="--dot-color:${s.color}"></div>`
    ).join('');

    // rebuild legend
    legend.innerHTML = activeSeries.map(s =>
      `<span class="sd-leg-item"><span class="sd-legdot" style="background:${s.color}"></span>${s.label}</span>`
    ).join('');
  }

  months.forEach((m, i) => {
    const s = document.createElement('span');
    s.textContent = m;
    s.style.left = ((i / 11) * 100) + '%';
    xaxis.appendChild(s);
  });

  // ---- Interactive hover (line + dot + tooltip), matching the other Home charts ----
  const plot = document.getElementById('sdPlot');
  const chartEl = document.querySelector('.sd-chart');
  const hover = document.getElementById('sdHover');
  const hoverLine = document.getElementById('sdHoverLine');
  const dotsContainer = document.getElementById('sdHoverDots');
  const tooltip = document.getElementById('sdTooltip');
  const sdtTitle = tooltip.querySelector('.sdt-title');
  const sdtRowsEl = document.getElementById('sdtRows');
  const legend = document.getElementById('sdLegend');

  redraw();

  function valueAt(pts, mx) {
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, v0] = pts[i];
      const [x1, v1] = pts[i + 1];
      if (mx >= x0 && mx <= x1) {
        const t = x1 === x0 ? 0 : (mx - x0) / (x1 - x0);
        return v0 + (v1 - v0) * t;
      }
    }
    return pts[pts.length - 1][1];
  }

  function monthLabelAt(mx) {
    const idx = Math.max(0, Math.min(months.length - 1, Math.round(mx)));
    return months[idx];
  }

  plot.addEventListener('mousemove', e => {
    const rect = chartEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < 0 || x > rect.width) { hover.classList.remove('active'); return; }

    const mx = (x / rect.width) * 11;
    const xPct = (x / rect.width) * 100;

    hover.classList.add('active');
    hoverLine.style.left = xPct + '%';

    sdtTitle.textContent = monthLabelAt(mx);
    sdtRowsEl.innerHTML = activeSeries.map((s, i) => {
      const v = valueAt(s.pts, mx);
      const dot = dotsContainer.querySelector(`#sdDot${i}`);
      if (dot) {
        dot.style.left = xPct + '%';
        dot.style.top = (v2y(v) / H * 100) + '%';
      }
      return `<div class="sdt-row">
        <i style="background:${s.color}"></i>
        <span class="sdt-series">${s.label}</span>
        <b class="sdt-value">$${Math.round(v * 1000).toLocaleString('en-US')}</b>
      </div>`;
    }).join('');

    tooltip.style.left = 'auto';
    tooltip.style.right = 'auto';
    if (xPct > 78) {
      tooltip.style.right = (rect.width - x + 10) + 'px';
    } else {
      tooltip.style.left = (x + 10) + 'px';
    }
  });

  plot.addEventListener('mouseleave', () => hover.classList.remove('active'));

  // ============ Filter dropdowns ============
  const filters = { dish: 'All Dishes', drinks: 'All Drinks', period: 'This Year', seating: 'All' };
  const defaultLabels = { dish: 'Dish', drinks: 'Drinks', period: 'Period', seating: 'Sitting / Takeaway' };
  const defaultValues = { dish: 'All Dishes', drinks: 'All Drinks', period: 'This Year', seating: 'All' };

  const dropdowns = document.querySelectorAll('.filter-dropdown');

  function closeAllDropdowns(except) {
    dropdowns.forEach(d => { if (d !== except) d.classList.remove('open'); });
  }

  function applyFilters() {
    const dishSel = filters.dish === defaultValues.dish ? [] : filters.dish.split(', ');
    const drinksSel = filters.drinks === defaultValues.drinks ? [] : filters.drinks.split(', ');

    activeSeries = [{ pts: basePts, color: SERIES_COLORS[0], label: 'Total' }];
    let colorIdx = 1;

    dishSel.forEach(d => {
      activeSeries.push({
        pts: seriesFor(d, filters.period, filters.seating),
        color: SERIES_COLORS[colorIdx++ % SERIES_COLORS.length],
        label: d,
      });
    });
    drinksSel.forEach(d => {
      activeSeries.push({
        pts: seriesFor(d, filters.period, filters.seating),
        color: SERIES_COLORS[colorIdx++ % SERIES_COLORS.length],
        label: d,
      });
    });

    redraw();
    renderChips();
  }

  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.sd-filter');
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const willOpen = !dropdown.classList.contains('open');
      closeAllDropdowns();
      dropdown.classList.toggle('open', willOpen);
    });
  });

  // ---- single-select dropdowns (Period, Sitting/Takeaway) ----
  ['period', 'seating'].forEach(key => {
    const dropdown = document.querySelector(`.filter-dropdown[data-filter="${key}"]`);
    if (!dropdown) return;
    const label = dropdown.querySelector('.sd-filter-label');
    const options = dropdown.querySelectorAll('.filter-option');

    options.forEach(opt => {
      opt.addEventListener('click', e => {
        e.stopPropagation();
        const value = opt.dataset.value;
        filters[key] = value;

        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');

        const isDefault = value === defaultValues[key];
        label.textContent = isDefault ? defaultLabels[key] : value;
        dropdown.classList.toggle('active', !isDefault);

        dropdown.classList.remove('open');
        applyFilters();
      });
    });
  });

  document.addEventListener('click', () => closeAllDropdowns());

  // ---- multi-select checklist dropdowns (Dish, Drinks) ----
  function setupChecklistFilter(key, { dropdownSelector, menuId, sumAllId, selectAllId }) {
    const dropdown = document.querySelector(dropdownSelector);
    const menu = document.getElementById(menuId);
    if (!dropdown || !menu) return;

    menu.addEventListener('click', e => e.stopPropagation()); // keep menu open while checking items

    const label = dropdown.querySelector('.sd-filter-label');
    const sumAllBox = document.getElementById(sumAllId);
    const selectAllBox = document.getElementById(selectAllId);
    const items = [...menu.querySelectorAll('.filter-item')];

    function resetToAggregate() {
      sumAllBox.checked = true;
      selectAllBox.checked = false;
      selectAllBox.indeterminate = false;
      items.forEach(i => { i.checked = false; });
      filters[key] = defaultValues[key];
      label.textContent = defaultLabels[key];
      dropdown.classList.remove('active');
      applyFilters();
    }

    function applyIndividualSelection() {
      const checked = items.filter(i => i.checked);
      if (checked.length === 0) { resetToAggregate(); return; }

      sumAllBox.checked = false;
      selectAllBox.checked = checked.length === items.length;
      selectAllBox.indeterminate = checked.length > 0 && checked.length < items.length;
      filters[key] = checked.map(i => i.dataset.value).sort().join(', ');
      label.textContent = checked.length === 1 ? checked[0].dataset.value : `${checked.length} selected`;
      dropdown.classList.add('active');
      applyFilters();
    }

    sumAllBox.addEventListener('change', () => {
      if (sumAllBox.checked) resetToAggregate();
      else sumAllBox.checked = true; // must always have an active mode
    });

    selectAllBox.addEventListener('change', () => {
      items.forEach(i => { i.checked = selectAllBox.checked; });
      selectAllBox.checked ? applyIndividualSelection() : resetToAggregate();
    });

    items.forEach(item => item.addEventListener('change', applyIndividualSelection));

    // expose a way for chips to uncheck a specific item from outside
    return function uncheck(value) {
      const item = items.find(i => i.dataset.value === value);
      if (item) { item.checked = false; applyIndividualSelection(); }
    };
  }

  const uncheckDish = setupChecklistFilter('dish', {
    dropdownSelector: '.filter-dropdown[data-filter="dish"]',
    menuId: 'dishMenu', sumAllId: 'dishSumAll', selectAllId: 'dishSelectAll',
  });
  const uncheckDrink = setupChecklistFilter('drinks', {
    dropdownSelector: '.filter-dropdown[data-filter="drinks"]',
    menuId: 'drinksMenu', sumAllId: 'drinksSumAll', selectAllId: 'drinksSelectAll',
  });

  // ---- removable chips summarizing the active multi-select filters ----
  const chipsEl = document.getElementById('filterChips');
  function renderChips() {
    if (!chipsEl) return;
    const dishSel = filters.dish === defaultValues.dish ? [] : filters.dish.split(', ');
    const drinkSel = filters.drinks === defaultValues.drinks ? [] : filters.drinks.split(', ');
    const chips = [
      ...dishSel.map(v => ({ key: 'dish', value: v })),
      ...drinkSel.map(v => ({ key: 'drinks', value: v })),
    ];
    chipsEl.innerHTML = chips.map(c => `
      <button class="filter-chip" type="button" data-key="${c.key}" data-value="${c.value}">
        ${c.value}
        <svg viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      </button>
    `).join('');
    chipsEl.style.display = chips.length ? 'flex' : 'none';
  }

  chipsEl?.addEventListener('click', e => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    if (chip.dataset.key === 'dish' && uncheckDish) uncheckDish(chip.dataset.value);
    if (chip.dataset.key === 'drinks' && uncheckDrink) uncheckDrink(chip.dataset.value);
  });
})();

// ============ Revenue: insight follow-ups -> Agent chat ============
document.querySelectorAll('.rev-insight').forEach(btn => {
  btn.addEventListener('click', () => {
    showPage('agent');
    const chat = document.getElementById('agentChat');
    if (chat) setTimeout(() => chat.scrollTop = chat.scrollHeight, 50);
  });
});

// ============ Suppliers Invoice table (with multi-row selection) ============
(function () {
  const body = document.getElementById('invBody');
  if (!body) return;

  const invoices = [
    { id: 'INV-2025-041', sup: 'Fresh Farm Produce',    rec: 'Jun 28, 2025', due: 'Jul 15, 2025', status: 'pending', total: 2840.50 },
    { id: 'INV-2025-040', sup: 'Golden Beverages Ltd.', rec: 'Jun 25, 2025', due: 'Jul 30, 2025', status: 'pending', total: 1975.00 },
    { id: 'INV-2025-039', sup: 'Israeli Dairy Co.',     rec: 'Jun 22, 2025', due: 'Jul 07, 2025', status: 'paid',    total: 3420.75 },
    { id: 'INV-2025-038', sup: 'Mediterranean Meats',   rec: 'Jun 19, 2025', due: 'Jul 24, 2025', status: 'pending', total: 5210.00 },
    { id: 'INV-2025-037', sup: 'Olive & Spice Imports', rec: 'Jun 15, 2025', due: 'Aug 01, 2025', status: 'paid',    total: 980.25 },
    { id: 'INV-2025-036', sup: 'Bakery Supplies Plus',  rec: 'Jun 12, 2025', due: 'Jul 18, 2025', status: 'paid',    total: 1540.00 },
    { id: 'INV-2025-035', sup: 'Kitchen Equipment Co.', rec: 'Jun 08, 2025', due: 'Jul 11, 2025', status: 'paid',    total: 6875.90 },
  ];

  function badge(status) {
    return `<span class="inv-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
  }

  function money(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderRows() {
    body.innerHTML = invoices.map(inv => `
      <div class="inv-row" data-id="${inv.id}">
        <span class="inv-check"><label class="row-check"><input type="checkbox" class="inv-row-check" data-id="${inv.id}"><span class="checkbox-box lg"></span></label></span>
        <span class="inv-id">${inv.id}</span>
        <span class="inv-supplier">${inv.sup}</span>
        <span class="inv-date">${inv.rec}</span>
        <span class="inv-date">${inv.due}</span>
        <span class="inv-total">${money(inv.total)}</span>
        <span class="inv-status" data-status-cell>${badge(inv.status)}</span>
        <button class="inv-actions" title="More">
          <svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="4" r="1.6"/><circle cx="10" cy="10" r="1.6"/><circle cx="10" cy="16" r="1.6"/></svg>
        </button>
      </div>
    `).join('');
  }

  renderRows();

  const selectAllBox = document.getElementById('invSelectAll');
  const floatingBar = document.getElementById('invFloatingBar');
  const floatingCount = document.getElementById('invFloatingCount');
  const markPaidBtn = document.getElementById('invMarkPaid');
  const exportBtn = document.getElementById('invExportSelected');
  const deleteBtn = document.getElementById('invDeleteSelected');
  const closeBtn = document.getElementById('invFloatingClose');

  const selected = new Set();

  function rowChecks() { return [...body.querySelectorAll('.inv-row-check')]; }

  function syncToolbar() {
    const n = selected.size;
    const total = rowChecks().length;

    floatingBar.hidden = n === 0;
    floatingCount.textContent = `${n} item${n === 1 ? '' : 's'} selected`;

    selectAllBox.checked = n > 0 && n === total;
    selectAllBox.indeterminate = n > 0 && n < total;
  }

  function setRowSelected(id, isSelected) {
    const row = body.querySelector(`.inv-row[data-id="${id}"]`);
    const box = body.querySelector(`.inv-row-check[data-id="${id}"]`);
    if (isSelected) selected.add(id); else selected.delete(id);
    if (row) row.classList.toggle('selected', isSelected);
    if (box) box.checked = isSelected;
  }

  function clearSelection() {
    selected.forEach(id => setRowSelected(id, false));
    selected.clear();
    syncToolbar();
  }

  body.addEventListener('change', e => {
    if (!e.target.classList.contains('inv-row-check')) return;
    setRowSelected(e.target.dataset.id, e.target.checked);
    syncToolbar();
  });

  selectAllBox.addEventListener('change', () => {
    const shouldSelect = selectAllBox.checked;
    invoices.forEach(inv => setRowSelected(inv.id, shouldSelect));
    syncToolbar();
  });

  closeBtn.addEventListener('click', clearSelection);

  markPaidBtn.addEventListener('click', () => {
    selected.forEach(id => {
      const inv = invoices.find(i => i.id === id);
      if (inv) inv.status = 'paid';
      const cell = body.querySelector(`.inv-row[data-id="${id}"] [data-status-cell]`);
      if (cell) cell.innerHTML = badge('paid');
    });
    clearSelection();
  });

  exportBtn.addEventListener('click', () => {
    const rows = invoices.filter(inv => selected.has(inv.id));
    const header = ['Order ID', 'Supplier', 'Receive Date', 'Due Date', 'Status'];
    const csv = [header, ...rows.map(r => [r.id, r.sup, r.rec, r.due, r.status])]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoices-export.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // ---- Delete: confirm via modal before removing anything ----
  const deleteModalBackdrop = document.getElementById('deleteModalBackdrop');
  const deleteModalText = document.getElementById('deleteModalText');
  const deleteModalCancel = document.getElementById('deleteModalCancel');
  const deleteModalConfirm = document.getElementById('deleteModalConfirm');

  function openDeleteModal() {
    const n = selected.size;
    deleteModalText.textContent = n === 1
      ? 'Are you sure you want to delete this invoice? This action cannot be undone.'
      : `Are you sure you want to delete these ${n} invoices? This action cannot be undone.`;
    deleteModalBackdrop.hidden = false;
    document.addEventListener('keydown', onDeleteModalKeydown);
  }

  function closeDeleteModal() {
    deleteModalBackdrop.hidden = true;
    document.removeEventListener('keydown', onDeleteModalKeydown);
  }

  function onDeleteModalKeydown(e) {
    if (e.key === 'Escape') closeDeleteModal();
  }

  deleteBtn.addEventListener('click', openDeleteModal);
  deleteModalCancel.addEventListener('click', closeDeleteModal);
  deleteModalBackdrop.addEventListener('click', e => {
    if (e.target === deleteModalBackdrop) closeDeleteModal();
  });

  deleteModalConfirm.addEventListener('click', () => {
    selected.forEach(id => {
      const idx = invoices.findIndex(i => i.id === id);
      if (idx !== -1) invoices.splice(idx, 1);
      const row = body.querySelector(`.inv-row[data-id="${id}"]`);
      if (row) row.remove();
    });
    selected.clear();
    syncToolbar();
    closeDeleteModal();
  });

  syncToolbar();

  // ---- Invoice details drawer ----
  const drawer = document.getElementById('invDrawer');
  const drawerOverlay = document.getElementById('invDrawerOverlay');
  const drawerCloseBtn = document.getElementById('invDrawerClose');
  const drawerDownloadBtn = document.getElementById('invDrawerDownload');
  const drawerMarkPaidBtn = document.getElementById('drawerMarkPaid');
  const drawerDeleteBtn = document.getElementById('drawerDelete');

  let activeDrawerInvId = null;

  const lineItemsMap = {
    'INV-2025-041': [
      { name: 'Tomatoes (20kg)', qty: '4 boxes', price: 320.00 },
      { name: 'Lettuce', qty: '10 heads', price: 85.50 },
      { name: 'Bell Peppers', qty: '15kg', price: 210.00 },
      { name: 'Seasonal Herbs', qty: '5 packs', price: 145.00 },
      { name: 'Citrus Fruits', qty: '30kg', price: 380.00 },
      { name: 'Avocados', qty: '8kg', price: 440.00 },
      { name: 'Garlic (bulk)', qty: '10kg', price: 160.00 },
      { name: 'Onions', qty: '25kg', price: 100.00 },
      { name: 'Other produce', qty: '—', price: 1000.00 },
    ],
    'INV-2025-040': [
      { name: 'Still Water (24×500ml)', qty: '20 cases', price: 480.00 },
      { name: 'Sparkling Water', qty: '15 cases', price: 390.00 },
      { name: 'Soft Drinks assorted', qty: '10 cases', price: 275.00 },
      { name: 'Fresh Orange Juice', qty: '50L', price: 300.00 },
      { name: 'House Wine (white)', qty: '6 bottles', price: 210.00 },
      { name: 'House Wine (red)', qty: '6 bottles', price: 320.00 },
    ],
    'INV-2025-039': [
      { name: 'Feta Cheese (5kg)', qty: '3 packs', price: 525.00 },
      { name: 'Yellow Cheese', qty: '4kg', price: 360.00 },
      { name: 'Labneh (bulk)', qty: '10kg', price: 480.00 },
      { name: 'Butter (unsalted)', qty: '8kg', price: 280.00 },
      { name: 'Heavy Cream', qty: '20L', price: 450.00 },
      { name: 'Greek Yoghurt', qty: '15kg', price: 375.00 },
      { name: 'Fresh Milk', qty: '100L', price: 320.00 },
      { name: 'Parmesan', qty: '2kg', price: 630.75 },
    ],
    'INV-2025-038': [
      { name: 'Chicken Breast (10kg)', qty: '5 packs', price: 850.00 },
      { name: 'Beef Tenderloin', qty: '8kg', price: 1440.00 },
      { name: 'Lamb Rack', qty: '6kg', price: 1200.00 },
      { name: 'Ground Beef', qty: '12kg', price: 480.00 },
      { name: 'Salmon Fillet', qty: '10kg', price: 900.00 },
      { name: 'Turkey Breast', qty: '5kg', price: 340.00 },
    ],
    'INV-2025-037': [
      { name: 'Olive Oil (5L)', qty: '4 cans', price: 320.00 },
      { name: 'Za\'atar blend', qty: '3kg', price: 155.25 },
      { name: 'Sumac', qty: '2kg', price: 120.00 },
      { name: 'Dried Chili', qty: '1kg', price: 85.00 },
      { name: 'Mixed Spice Box', qty: '1 set', price: 300.00 },
    ],
    'INV-2025-036': [
      { name: 'All-purpose Flour (25kg)', qty: '5 bags', price: 475.00 },
      { name: 'Caster Sugar', qty: '10kg', price: 180.00 },
      { name: 'Baking Powder', qty: '5kg', price: 115.00 },
      { name: 'Cocoa Powder', qty: '3kg', price: 210.00 },
      { name: 'Parchment Paper', qty: '10 rolls', price: 130.00 },
      { name: 'Baking Molds (set)', qty: '2 sets', price: 430.00 },
    ],
    'INV-2025-035': [
      { name: 'Commercial Blender', qty: '1 unit', price: 1200.00 },
      { name: 'Chef\'s Knife Set', qty: '2 sets', price: 850.00 },
      { name: 'Cutting Boards (XL)', qty: '4 pcs', price: 320.00 },
      { name: 'Stock Pot (50L)', qty: '2 units', price: 940.00 },
      { name: 'Sauce Pan Set', qty: '1 set', price: 680.00 },
      { name: 'Kitchen Scale', qty: '3 units', price: 390.00 },
      { name: 'Spatula Set', qty: '2 sets', price: 220.90 },
      { name: 'Thermometer (probe)', qty: '5 units', price: 275.00 },
												{ name: 'Misc Equipment', qty: '—', price: 2000.00 },
    ],
  };

  function openDrawer(id) {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    // Remove active highlight from previous row
    body.querySelector('.inv-row.drawer-active')?.classList.remove('drawer-active');
    activeDrawerInvId = id;
    body.querySelector(`.inv-row[data-id="${id}"]`)?.classList.add('drawer-active');

    document.getElementById('drawerTitle').textContent = inv.id;
    document.getElementById('drawerBadge').innerHTML = badge(inv.status);
    document.getElementById('drawerSupplier').textContent = inv.sup;
    document.getElementById('drawerReceived').textContent = inv.rec;
    document.getElementById('drawerDue').textContent = inv.due;
    document.getElementById('drawerTotal').textContent = money(inv.total);

    drawerMarkPaidBtn.disabled = inv.status === 'paid';

    const items = lineItemsMap[id] || [];
    document.getElementById('drawerItems').innerHTML = items.map(item => `
      <div class="inv-drawer-item">
        <div>
          <div class="inv-drawer-item-name">${item.name}</div>
          <div class="inv-drawer-item-qty">${item.qty}</div>
        </div>
        <span class="inv-drawer-item-price">${money(item.price)}</span>
      </div>
    `).join('');

    drawer.hidden = false;
    drawerOverlay.hidden = false;
    document.addEventListener('keydown', onDrawerKeydown);
  }

  function closeDrawer() {
    body.querySelector('.inv-row.drawer-active')?.classList.remove('drawer-active');
    drawer.hidden = true;
    drawerOverlay.hidden = true;
    activeDrawerInvId = null;
    document.removeEventListener('keydown', onDrawerKeydown);
  }

  function onDrawerKeydown(e) {
    if (e.key === 'Escape') closeDrawer();
  }

  drawerCloseBtn.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  drawerDownloadBtn.addEventListener('click', () => {
    const inv = invoices.find(i => i.id === activeDrawerInvId);
    if (!inv) return;
    const items = lineItemsMap[inv.id] || [];
    const header = ['Order ID', 'Supplier', 'Receive Date', 'Due Date', 'Status', 'Total', 'Item', 'Qty', 'Item Price'];
    const rows = items.length
      ? items.map((item, i) => [
          i === 0 ? inv.id : '', i === 0 ? inv.sup : '', i === 0 ? inv.rec : '',
          i === 0 ? inv.due : '', i === 0 ? inv.status : '', i === 0 ? money(inv.total) : '',
          item.name, item.qty, money(item.price),
        ])
      : [[inv.id, inv.sup, inv.rec, inv.due, inv.status, money(inv.total), '', '', '']];
    const csv = [header, ...rows]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.id}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  drawerMarkPaidBtn.addEventListener('click', () => {
    const inv = invoices.find(i => i.id === activeDrawerInvId);
    if (!inv) return;
    inv.status = 'paid';
    const cell = body.querySelector(`.inv-row[data-id="${inv.id}"] [data-status-cell]`);
    if (cell) cell.innerHTML = badge('paid');
    document.getElementById('drawerBadge').innerHTML = badge('paid');
    drawerMarkPaidBtn.disabled = true;
  });

  drawerDeleteBtn.addEventListener('click', () => {
    if (!activeDrawerInvId) return;
    selected.clear();
    selected.add(activeDrawerInvId);
    syncToolbar();
    closeDrawer();
    openDeleteModal();
  });

  body.addEventListener('click', e => {
    const row = e.target.closest('.inv-row');
    if (!row) return;
    if (e.target.closest('.inv-check') || e.target.closest('.inv-actions')) return;
    openDrawer(row.dataset.id);
  });
})();

// ============ Chat chart builder (used by both the seeded and live chat) ============
function buildChatChart({ title, rows, footLabel, footValue }) {
  const max = Math.max(...rows.map(r => r.value));
  const rowsHtml = rows.map(r => `
    <div class="chat-chart-row">
      <span class="chat-chart-label">${r.label}</span>
      <div class="chat-chart-track"><div class="chat-chart-fill" style="width:${((r.value / max) * 100).toFixed(1)}%;background:${r.color}"></div></div>
      <span class="chat-chart-value">${r.display}</span>
    </div>
  `).join('');
  return `
    <div class="chat-chart">
      <span class="chat-chart-title">${title}</span>
      <div class="chat-chart-rows">${rowsHtml}</div>
      ${footLabel ? `<div class="chat-chart-foot"><span class="label">${footLabel}</span><span class="value">${footValue}</span></div>` : ''}
    </div>
  `;
}

const CHANNEL_CHART = () => buildChatChart({
  title: 'Revenue by Channel — last 2 months',
  rows: [
    { label: 'In-house',  value: 42, display: '42%', color: '#8280ff' },
    { label: 'Take-Away', value: 18, display: '18%', color: '#d8d6ff' },
    { label: 'Online',    value: 40, display: '40%', color: '#4342b1' },
  ],
  footLabel: 'Total revenue',
  footValue: '$84,320',
});

const PRODUCTS_CHART = () => buildChatChart({
  title: 'Top products by units sold',
  rows: [
    { label: 'Salmon',   value: 1248, display: '1,248', color: '#8280ff' },
    { label: 'Burger',   value: 842,  display: '842',   color: '#8280ff' },
    { label: 'Pizza',    value: 612,  display: '612',   color: '#8280ff' },
  ],
  footLabel: 'Top performer',
  footValue: 'Grilled Salmon',
});

const TREND_CHART = () => buildChatChart({
  title: 'Revenue trend by month',
  rows: [
    { label: 'May', value: 15800, display: '$15.8K', color: '#8280ff' },
    { label: 'June', value: 21200, display: '$21.2K', color: '#8280ff' },
    { label: 'July', value: 24600, display: '$24.6K', color: '#8280ff' },
  ],
  footLabel: 'Month-over-month',
  footValue: '+8.5%',
});

const CRYSTAL_MINT_ORDERS_CHART = () => buildChatChart({
  title: 'Crystal Mint Cocktail — monthly orders',
  rows: [
    { label: 'April',  value: 38, display: '38 orders', color: '#8280ff' },
    { label: 'May',    value: 29, display: '29 orders', color: '#8280ff' },
    { label: 'June',   value: 14, display: '14 orders', color: '#f38304' },
    { label: 'July',   value: 0,  display: '0 orders',  color: '#f93c65' },
    { label: 'August', value: 0,  display: '0 orders',  color: '#f93c65' },
    { label: 'Sep',    value: 0,  display: '0 orders',  color: '#f93c65' },
  ],
  footLabel: 'Last 3 months total',
  footValue: '0 orders',
});

const CRYSTAL_MINT_REVENUE_CHART = () => buildChatChart({
  title: 'Crystal Mint — revenue contribution',
  rows: [
    { label: 'Q1 avg / mo', value: 1140, display: '$1,140', color: '#8280ff' },
    { label: 'Q2 avg / mo', value: 420,  display: '$420',   color: '#f38304' },
    { label: 'Jul–Sep',     value: 0,    display: '$0',     color: '#f93c65' },
  ],
  footLabel: 'Estimated annual loss if kept',
  footValue: '~$4,200 in menu cost',
});

// populate the seeded conversation's chart bubble
(function () {
  const seedChart = document.getElementById('seedChart');
  if (seedChart) seedChart.innerHTML = CHANNEL_CHART();
})();

// ============ Agent chat ============
(function () {
  const form = document.getElementById('agentForm');
  const field = document.getElementById('agentField');
  const chat = document.getElementById('agentChat');
  if (!form) return;

  const aiAvatar = `<div class="ai-avatar"><svg viewBox="0 0 20 16" fill="none"><path d="M10 1C6 1 3 3.5 3 6.5C3 8.5 4.5 10 6.5 10.7L5.8 13L9 11.3C9.3 11.3 9.7 11.3 10 11.3C14 11.3 17 8.8 17 6C17 3 14 1 10 1Z" stroke="#8280ff" stroke-width="1.1" stroke-linejoin="round"/></svg></div>`;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = field.value.trim();
    if (!text) return;

    // remove any existing typing indicator
    const existingTyping = chat.querySelector('.ai-bubble.typing');
    if (existingTyping) existingTyping.closest('.chat-row').remove();

    const userRow = document.createElement('div');
    userRow.className = 'chat-row user';
    userRow.innerHTML = `<div class="bubble user-bubble"></div>`;
    userRow.querySelector('.bubble').textContent = text;
    chat.appendChild(userRow);

    field.value = '';
    chat.scrollTop = chat.scrollHeight;

    // AI typing then reply
    const typingRow = document.createElement('div');
    typingRow.className = 'chat-row ai';
    typingRow.innerHTML = `${aiAvatar}<div class="bubble ai-bubble typing"><span></span><span></span><span></span></div>`;
    chat.appendChild(typingRow);
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply, chartHtml = null;

      if (/crystal mint|cocktail|mint/.test(lower)) {
        reply = "Crystal Mint Cocktail orders dropped sharply in June and <strong>hit zero for the last 3 months</strong> — July through September. This isn't seasonal; other drinks held steady. The likely causes: it was removed from the specials board in June, and a pricing change made it the most expensive cocktail without a corresponding perceived value. Revenue contribution has gone from ~$1,140/mo in Q1 to <strong>$0</strong>. <strong>Recommendation: remove it from the menu</strong> and reallocate the ingredient cost toward higher-margin cocktails.";
        chartHtml = [CRYSTAL_MINT_ORDERS_CHART(), CRYSTAL_MINT_REVENUE_CHART()];
      } else if (/channel|breakdown|chart|graph|visual/.test(lower)) {
        reply = "Here's the breakdown by channel — in-house dining leads, with online close behind.";
        chartHtml = CHANNEL_CHART();
      } else if (/product|top|best|seller|sold|menu/.test(lower)) {
        reply = "Here are your top sellers by units — Grilled Salmon is the clear favorite.";
        chartHtml = PRODUCTS_CHART();
      } else if (/trend|month|growth|revenue|sales/.test(lower)) {
        reply = "Revenue's been climbing steadily — up 8.5% month-over-month.";
        chartHtml = TREND_CHART();
      } else {
        const replies = [
          "Great question! Based on the latest data, in-house dining drives 42% of sales, take-away 18%, and online the rest. Want me to chart it?",
          "Sure — your top performer is Grilled Salmon with 1,248 units. Beef Burger and Margherita Pizza follow. Should I compare margins?",
          "On it. Revenue is trending up 8.5% month-over-month, with January as the standout. I can break this down by channel if that helps.",
        ];
        reply = replies[Math.floor(Math.random() * replies.length)];
      }

      typingRow.querySelector('.ai-bubble').classList.remove('typing');
      typingRow.querySelector('.ai-bubble').innerHTML = reply;

      if (chartHtml) {
        const bubble = typingRow.querySelector('.ai-bubble');
        const group = document.createElement('div');
        group.className = 'chat-ai-group';
        bubble.replaceWith(group);
        group.appendChild(bubble);
        const charts = Array.isArray(chartHtml) ? chartHtml : [chartHtml];
        charts.forEach(html => {
          const wrap = document.createElement('div');
          wrap.innerHTML = html;
          group.appendChild(wrap.firstElementChild);
        });
      }

      chat.scrollTop = chat.scrollHeight;
    }, 1100);
  });
})();
