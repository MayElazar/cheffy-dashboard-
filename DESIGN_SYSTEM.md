# Cheffy — Design System

The visual language for the Cheffy restaurant analytics dashboard. All values below are the source of truth used across `index.html`, `style.css`, and `script.js`. Tokens are defined as CSS custom properties in `:root` (see `style.css`).

---

## 1. Color

### Brand / accent
| Token | Value | Usage |
|---|---|---|
| `--purple` | `#8280ff` | **Primary accent.** Active nav/tabs, buttons, chart lines, links, focus rings |
| `--purple-dark` | `#4342b1` | Secondary series in charts, active nav text/icon, gradient ends |
| `--cyan` | `#66d6fb` | Chart category (Operations) |
| `--orange` | `#f38304` | Chart category (R&D) |
| `--pink` | `#f15bd3` | Chart series (Returning customers) |

### Semantic / status
| Token | Value | Usage |
|---|---|---|
| `--green` | `#00b69b` | Positive delta (▲), "Paid" status |
| `--red` | `#f93c65` | Negative delta (▼), error dot |
| — | `#e0459b` on `#fde8f4` | "Pending" badge (text / bg) |
| — | `#16a06f` on `#e3f8ee` | "Paid" badge (text / bg) |

### Text
| Token | Value | Usage |
|---|---|---|
| `--text-dark` | `#202224` | Primary text, headings, values |
| `--text-heading` | `#111827` | Donut/section emphasis headings |
| `--text-muted` | `#5c5c66` | Nav labels, secondary text, table headers |
| `--text-muted2` | `#6b7280` | Tertiary text, dropdown labels |
| `--text-axis` | `#7b91b0` | Chart axis labels |

### Surface
| Token | Value | Usage |
|---|---|---|
| Background | `#ffffff` | App background, cards |
| `--field-bg` | `#f7f7fc` | Sidebar, input fields |
| `--border` | `#e1e1eb` | Card/input/table borders, dividers |
| Gridlines | `#eff1f3` | Chart gridlines |
| Card border | `#f8f9fa` | Subtle card outline |

### Icon color tokens
Icons use two registered CSS custom properties so a single `fill`/`stroke` reference can be recolored per-context:
```css
@property --fill-0   { syntax: '<color>'; inherits: true; initial-value: #5c5c66; }
@property --stroke-0 { syntax: '<color>'; inherits: true; initial-value: #5c5c66; }
```
SVGs authored as `<svg class="icon">` with `fill="var(--fill-0, …)"` default to `#5c5c66` and are re-tinted by setting `--fill-0` on the parent (e.g. active nav → `#4342b1`, delta arrows → `--green`/`--red`).

---

## 2. Typography

**Font family:** `Inter` (Google Fonts), fallback `-apple-system, BlinkMacSystemFont, sans-serif`.
Weights loaded: 400, 500, 600, 700, 800.

| Role | Size | Weight | Notes |
|---|---|---|---|
| H1 / Page title / KPI value | 28px | 800 | `letter-spacing: -0.2px` |
| H2 / Card value | 20px | 700 | `letter-spacing: -0.1px` |
| Card heading (H3) | 20px | 600 | Section/card titles |
| Insight heading | 17px | 600 | KPI label (`opacity: .7`) |
| Body | 14px | 400 | `line-height: 1.6` |
| Button | 16px | 500 | |
| Label / medium | 14px | 500 | Nav items, tabs |
| Caption | 12px | 500 | Legends, badges, table headers |
| Axis / tiny | 11px | 400 | Chart axes, tooltips |

---

## 3. Spacing & layout

- **Base unit:** 4px. Common steps: `4, 8, 12, 16, 24, 32`.
- **Content gutter:** `24px` horizontal padding on all page sections and card margins (`margin: 0 24px`).
- **Section gap:** `32px` vertical rhythm between major blocks (`.main`, `.page`, `.charts-row`).
- **Card padding:** `24px`.
- **Sidebar width:** `256px`; **top bar height:** ~`94px`.
- **Page grid:** fixed sidebar + fluid main column. KPI row is a 4-col grid; chart rows are flex, collapsing to a single column below `1300px`.

---

## 4. Border radius

| Element | Radius |
|---|---|
| Chart / table / large cards | `20px` |
| KPI / stat cards | `14px` |
| Inner panels, table wrapper | `12px` |
| Buttons, icon buttons, menu items | `4px` |
| Pills (tabs, filters), scrollbars | `999px` |
| Chat bubbles | `14px` (4px on the "tail" corner) |
| Avatars, status dots, donut | `50%` |

---

## 5. Elevation (shadows)

| Token / use | Value |
|---|---|
| `--card-shadow` (chart & table cards) | `0px 4px 20px rgba(238,238,238,0.6)` |
| KPI / stat cards | `6px 6px 20px rgba(0,0,0,0.05)` |
| Tooltips | `0px 4px 12px rgba(0,0,0,0.16)` |
| Floating chat FAB | `0 4px 16px rgba(0,0,0,0.12)` (hover: `0 6px 20px rgba(0,0,0,0.16)`) |

---

## 6. Components

### Buttons
- **Primary** (`.btn-primary`): bg `--purple`, white text, radius 4px, `16px/500`. Hover: `brightness(1.08)`.
- **Outline** (`.btn-outline`): white bg, `--purple` text + 1px `--purple` border. Hover: `#f4f4ff`.
- **Icon-outline** (`.btn-icon-outline`): 40×40, 1px `--purple` border, purple icon (`--fill-0: --purple`).
- **Icon-only** (`.icon-btn`): 24px icon, transparent, hover bg `#f2f2f7`.

### Tabs & filter pills
Pill shape (`999px`), `8px 14px` padding, `14px/500`. Default: white bg, `--border` outline, `--text-muted` label. Active: `--purple` bg + border, white text, weight 600. Hover: `--purple` border + text.

### Cards
White bg, `20px` radius, `1px #f8f9fa` border, `--card-shadow`, `24px` padding, `24px` side margin. Stat cards use `14px` radius + the KPI shadow.

### Navigation (sidebar)
`--field-bg` panel. Menu item: `4px` radius, `12px` gap, `14px/500` `--text-muted`. **Hover:** bg `#ececfa`, text/icon `--purple-dark`. **Active:** bg `#e9e9fb`, text/icon `#4342b1`.

### Status badge
Pill, `12px/500`, `3px 12px`. `Pending` → `#e0459b` on `#fde8f4`. `Paid` → `#16a06f` on `#e3f8ee`.

### Chat bubbles
Max-width 620px, `14px` radius, `12px 16px` padding, `14px/1.5`. User: `--purple` bg / white (right-aligned). AI: `#f3f3f7` bg / dark, preceded by a 32px round avatar; typing state animates three dots.

### Chart tooltip
Dark surface `#1e1e2e`/`#202224`, white text, `8px` radius, `10–12px` padding, colored series dots, `11px` text.

---

## 7. Data visualization

- **Series palette:** New `--purple`, Returning `--pink`; Income `--purple`, Outcome `--purple-dark`; expense stack `--purple` / `--purple-dark` / `--cyan` / `--orange`.
- **Gridlines:** 1px `#eff1f3`. **Axis text:** 11–14px `--text-axis` / `rgba(43,48,52,0.4)`.
- **Bars:** 21px wide, `4px` top radius, rest on the zero baseline.
- **Lines:** 2–3px stroke, round caps/joins; area fills use a top-down gradient of the series color fading to transparent.
- **Interactions:** hover highlights the active element and dims siblings; line charts show a vertical guide + per-series dots + tooltip. The Customer Growth chart is horizontally scrollable with a custom `--purple` scrollbar.

---

## 8. Motion

- **Standard transition:** `0.15s` on `background`, `color`, `border-color`, `filter`, `opacity`, `transform`.
- **Tooltip/hover reveals:** `0.12s` opacity + slight translate.
- **Typing indicator:** `1.2s` looped 3-dot bounce.
- Keep motion subtle; hover feedback should never shift layout.

---

## 9. Iconography

- 20px in nav, 24px in actions/KPIs, 14–18px inline.
- Line icons at ~1.5px stroke; round caps/joins.
- Recolor via `--fill-0` / `--stroke-0` rather than editing paths, so one icon adapts to default / hover / active states.
