# ZUKUNFT SERVICE — DESIGN SYSTEM SPEC v1.0
**Role: design system architect · Tailwind CSS v4 · UI-only · $700 budget**

---

## 0. EXECUTIVE SUMMARY / DECISIONS UP FRONT

| # | Decision | Answer |
|---|---|---|
| 1 | Brand gold as text | **Banned.** `#c48a16` = **3.00:1 on white, 2.96:1 on page bg, 2.65:1 on cream.** Ships as fill only. Text gold = `#8a6013`. |
| 2 | Type pairing | **IBM Plex Serif (DE display) + IBM Plex Sans (DE UI) + IBM Plex Sans Arabic (all AR)**. One superfamily, OFL, self-hosted via Fontsource. |
| 3 | Muted text | Five reference greys collapse to **one** token `#5a6b66` (≥4.80:1 on every light surface we ship). |
| 4 | Dark mode | **NO.** Token layer built dark-ready; quoted as a paid add-on. Reasoning in §8. |
| 5 | Breakpoints | Tailwind v4 stock (`sm/md/lg/xl/2xl`) + one `xs: 26.25rem`. Nav collapses at **`lg` (1024px)** into a full-screen overlay — fixes the reference's missing mobile nav. |
| 6 | Motion | CSS-only. No animation library. IntersectionObserver reveal + 5 durations + 4 easings. |
| 7 | Modal | Native `<dialog>` + `showModal()` + `@starting-style`. Zero dependencies, free focus trap. |
| 8 | WhatsApp FAB | `#25d366` **rejected** (white glyph = 1.98:1). Ships `#128c7e` (WhatsApp's own darker brand green, 4.14:1). |

**Correction to the brief:** it states gold-on-white is "~3.4:1". The actual computed value is **3.0025:1**, and on the real page background `#fffdf9` it is **2.96:1** — which fails not only AA normal text but also the 3:1 floor for large text and non-text UI (WCAG 1.4.11). The reference's gold focus ring at 40% alpha (`#c48a1666`) is therefore roughly **1.6:1** and is functionally invisible. This is worse than the brief assumed and the fix is non-optional.

---

## 1. COLOR SYSTEM

### 1.1 Method

All contrast ratios below are computed from WCAG 2.2 relative luminance:

```
c_lin = c ≤ 0.03928 ? c/12.92 : ((c + 0.055)/1.055)^2.4
L     = 0.2126·R_lin + 0.7152·G_lin + 0.0722·B_lin
ratio = (L_lighter + 0.05) / (L_darker + 0.05)
```

Reference luminances used throughout (computed, not estimated):

| Hex | L | Hex | L |
|---|---|---|---|
| `#ffffff` | 1.0000 | `#c48a16` | 0.2997 |
| `#fffdf9` | 0.9835 | `#7d8d89` | 0.2522 |
| `#fbfcfa` | 0.9703 | `#a97612` | 0.2144 |
| `#f5f7f3` | 0.9241 | `#128c7e` | 0.2039 |
| `#fdf6e3` | 0.9234 | `#8a6013` | 0.1382 |
| `#eef4f2` | 0.8929 | `#5a6b66` | 0.1365 |
| `#f7f0e5` | 0.8775 | `#4a6b52` | 0.1258 |
| `#e8f0e9` | 0.8536 | `#74520f` | 0.0978 |
| `#f4ecdf` | 0.8455 | `#3f524d` | 0.0763 |
| `#cdd9d5` | 0.6741 | `#075344` | 0.0665 |
| `#c7d6d2` | 0.6489 | `#8c1d18` | 0.0652 |
| `#e3bd52` | 0.5334 | `#05502f` | 0.0597 |
| `#25d366` | 0.4794 | `#05493c` | 0.0512 |
| `#d3a32c` | 0.4023 | `#043b32` | 0.0339 |
| `#769b7e` | 0.2880 | `#19312c` | 0.0258 |
|  |  | `#172c27` | 0.0213 |

### 1.2 PRIMITIVE tokens

Four hue ramps. Brand-locked stops are marked ★ — those hexes come from the reference and must not drift.

**Green (H ≈ 168°) — the brand spine**

| Token | Hex | L | Notes |
|---|---|---|---|
| `brand-green-50` | `#eef4f2` | 0.8929 | secondary-button hover tint |
| `brand-green-100` | `#d6e4e0` | — | secondary-button active tint |
| `brand-green-200` | `#a9c6be` | — | decorative only |
| `brand-green-300` | `#6f9d92` | — | decorative only |
| `brand-green-400` | `#3b7668` | — | decorative only |
| `brand-green-500` | `#0a604f` | — | link hover on light |
| **`brand-green-600`** ★ | **`#075344`** | 0.0665 | primary brand green (`--green`) |
| `brand-green-700` | `#05493c` | 0.0512 | primary button hover |
| **`brand-green-800`** ★ | **`#043b32`** | 0.0339 | deep (`--deep`) — headings, dark section |
| `brand-green-900` | `#032e27` | — | dark-section deepest layer |
| `brand-green-950` | `#021f1a` | — | reserved |

**Gold (H ≈ 40°) — one hue, three functional stops**

| Token | Hex | L | Role |
|---|---|---|---|
| `brand-gold-50` | `#fdf6e3` | 0.9234 | badge background |
| `brand-gold-100` | `#f8e9bf` | — | badge border, hairline on cream |
| `brand-gold-200` | `#f0d68a` | — | decorative |
| **`brand-gold-300`** | **`#e3bd52`** | 0.5334 | **accent text ON dark green** |
| `brand-gold-400` | `#d3a32c` | 0.4023 | gold-button **hover** fill |
| **`brand-gold-500`** ★ | **`#c48a16`** | 0.2997 | brand gold — **FILL ONLY, NEVER TEXT** |
| `brand-gold-600` | `#a97612` | 0.2144 | **focus ring on light** + large-text-only gold |
| **`brand-gold-700`** | **`#8a6013`** | 0.1382 | **accent text on light — the corrected gold** |
| `brand-gold-800` | `#74520f` | 0.0978 | dense/small gold text, badge text |
| `brand-gold-900` | `#5c400d` | — | reserved |

**Sage (H ≈ 133°) — from the logo leaf**

| Token | Hex | L | Role |
|---|---|---|---|
| `brand-sage-50` | `#f2f6f2` | — | tint |
| `brand-sage-100` | `#e3ece5` | — | tint |
| `brand-sage-200` | `#c7d9cb` | — | divider on light |
| `brand-sage-300` | `#a3bfa9` | — | decorative |
| **`brand-sage-400`** ★ | **`#769b7e`** | 0.2880 | brand sage — **DECORATIVE ONLY (3.11:1 on white)** |
| `brand-sage-500` | `#5d8467` | 0.1981 | 4.23:1 on white → **large text / UI only** |
| `brand-sage-600` | `#4a6b52` | 0.1258 | **text-safe sage**, 5.97:1 on white |
| `brand-sage-700` | `#3b5642` | — | reserved |

**Cream / Neutral (warm green-grey)**

| Token | Hex | L | Role |
|---|---|---|---|
| `brand-cream-50` | `#fffdf9` ★ | 0.9835 | page background |
| `brand-cream-100` | `#f7f0e5` ★ | 0.8775 | cream sections (hero, why, footer, notice) |
| `brand-cream-200` | `#f4ecdf` | 0.8455 | optional deeper cream (footer base) |
| `neutral-0` | `#ffffff` | 1.0000 | cards, form card, header pill |
| `neutral-50` | `#fbfcfa` ★ | 0.9703 | input rest background |
| `neutral-100` | `#f5f7f3` ★ | 0.9241 | cool section background (services) |
| `neutral-150` | `#eef2ee` | — | image letterbox (replaces `#edf2ed`) |
| `neutral-200` | `#e2e8e5` ★ | — | dividers |
| `neutral-250` | `#dfe7e1` ★ | — | card border (decorative) |
| `neutral-300` | `#cdd9d5` ★ | 0.6741 | input border, control border |
| `neutral-400` | `#a7b5b1` | — | disabled fill / decorative |
| `neutral-500` | `#7d8d89` | 0.2522 | **3.38:1 — icons ≥24px only, NEVER text** |
| **`neutral-600`** | **`#5a6b66`** | 0.1365 | **the single muted-text token** |
| `neutral-700` | `#3f524d` | 0.0763 | secondary body text (8.32:1 on white) |
| `neutral-800` | `#2e433e` | — | reserved |
| **`neutral-900`** ★ | **`#19312c`** | 0.0258 | ink — body text |
| `neutral-950` | `#172c27` ★ | 0.0213 | text on gold button |

**Mint / status / utility**

| Token | Hex | L | Role |
|---|---|---|---|
| `brand-mint-100` | `#e8f0e9` ★ | 0.8536 | cleaning feature-card background |
| `status-danger` | `#b3261e` | 0.1106 | error border (6.54:1 on white) |
| `status-danger-fg` | `#8c1d18` | 0.0652 | error message text (8.97:1 on `#fffdf9`) |
| `status-danger-bg` | `#fef7f6` | — | error field background |
| `status-success-fg` | `#05502f` | 0.0597 | success text (9.42:1 on `#fffdf9`) |
| `status-success-bg` | `#eef6f1` | — | success panel background |
| `whatsapp` | `#128c7e` | 0.2039 | FAB fill (see §5.9) |
| `whatsapp-brand` | `#25d366` | 0.4794 | brand green — **reference only, not shipped as a fill under white glyphs** |

### 1.3 SEMANTIC tokens

These are what components consume. Nothing in a component file ever references a primitive directly.

| Semantic token | Light value | Dark-surface value | Role |
|---|---|---|---|
| `surface` | `#fffdf9` | `#043b32` | page canvas |
| `surface-alt` | `#f5f7f3` | `#032e27` | alternating cool section |
| `surface-warm` | `#f7f0e5` | `#043b32` | cream section |
| `surface-raised` | `#ffffff` | `#ffffff` | cards, form card, modal panel |
| `surface-sunken` | `#eef2ee` | `#032e27` | image letterbox, media placeholder |
| `surface-field` | `#fbfcfa` | `#fbfcfa` | input rest |
| `surface-field-focus` | `#ffffff` | `#ffffff` | input focus |
| `surface-inverse` | `#043b32` | `#fffdf9` | dark panel (contact, cleaning) |
| `surface-overlay` | `#03231db8` | same | modal backdrop |
| `text-body` | `#19312c` | `#ffffff` | default copy |
| `text-heading` | `#043b32` | `#ffffff` | h1–h4 |
| `text-secondary` | `#3f524d` | `#dbe6e2` | lead paragraphs, nav |
| `text-muted` | `#5a6b66` | `#c7d6d2` | card body, captions, placeholders, footnotes |
| `text-on-brand` | `#ffffff` | `#ffffff` | text on green fills |
| `text-on-accent` | `#172c27` | `#172c27` | text on gold fills |
| `text-disabled` | `#5a6b66` @ 55% | — | disabled control label |
| `accent` | `#c48a16` | `#c48a16` | gold **fills** (button, rule, dot, icon) |
| `accent-fg` | `#172c27` | `#172c27` | foreground on `accent` |
| `accent-text` | `#8a6013` | `#e3bd52` | **gold used as text** (eyebrow, detail link) |
| `accent-text-strong` | `#74520f` | `#f0d68a` | gold text at ≤13px / dense settings |
| `accent-hover` | `#d3a32c` | `#f0d68a` | gold fill hover |
| `brand` | `#075344` | `#e3bd52` | primary action fill / link colour |
| `brand-hover` | `#05493c` | `#f0d68a` | |
| `brand-active` | `#043b32` | — | |
| `border-subtle` | `#dfe7e1` | `#ffffff1f` | decorative card edges |
| `border-default` | `#cdd9d5` | `#ffffff33` | inputs, controls, dividers |
| `border-strong` | `#a7b5b1` | `#ffffff52` | hovered control edges |
| `border-accent` | `#a97612` | `#e3bd52` | gold-bounded clickable card |
| `focus` | `#a97612` | `#e3bd52` | focus-visible outline |
| `focus-halo` | `#fffdf9` | `#043b32` | 2px surface-coloured gap under the ring |
| `shadow-tint` | `#075344` | `#000000` | shadow base hue |

The dark column is **not** dark mode. It is the `[data-surface="dark"]` scope for the contact section, the cleaning panel and the green modal — sections that already exist in the design. That it also happens to be 80% of a dark-mode implementation is the argument in §8.

---

## 2. CONTRAST AUDIT & THE FIXES

### 2.1 The gold failure — full math

`#c48a16` → R_lin 0.552008, G_lin 0.254152, B_lin 0.008026 → **L = 0.29971**

| Foreground | Background | Ratio | AA normal (4.5) | AA large (3.0) | Non-text (3.0) |
|---|---|---|---|---|---|
| `#c48a16` | `#ffffff` | (1.05)/(0.34971) = **3.00** | ✗ | ✓ borderline | ✓ borderline |
| `#c48a16` | `#fffdf9` page | (1.03351)/(0.34971) = **2.96** | ✗ | **✗** | **✗** |
| `#c48a16` | `#f7f0e5` cream | (0.92751)/(0.34971) = **2.65** | ✗ | **✗** | **✗** |
| `#c48a16` | `#f5f7f3` | (0.97405)/(0.34971) = **2.79** | ✗ | **✗** | **✗** |
| `#c48a16` | `#043b32` deep | (0.34971)/(0.08390) = **4.17** | ✗ | ✓ | ✓ |
| `#c48a16` | `#075344` green | (0.34971)/(0.11650) = **3.00** | ✗ | ✓ borderline | ✓ borderline |
| `#c48a166 6` (40% α ≈ `#e2c584` on `#fffdf9`) | `#fffdf9` | ≈ **1.6** | ✗ | ✗ | **✗ focus ring invisible** |

Every single gold-as-text use in the reference fails. So does the focus ring.

### 2.2 The corrected golds

**`brand-gold-700 = #8a6013`** → R_lin 0.254152, G_lin 0.116971, B_lin 0.006511 → **L = 0.13816**

| Background | L_bg | Ratio | Verdict |
|---|---|---|---|
| `#ffffff` | 1.0000 | 1.05/0.18816 = **5.58** | ✓ AA |
| `#fffdf9` page | 0.9835 | 1.03351/0.18816 = **5.49** | ✓ AA |
| `#f5f7f3` services | 0.9241 | 0.97405/0.18816 = **5.18** | ✓ AA |
| `#f7f0e5` cream | 0.8775 | 0.92751/0.18816 = **4.93** | ✓ AA |
| `#e8f0e9` mint | 0.8536 | 0.90358/0.18816 = **4.80** | ✓ AA |
| `#f4ecdf` footer | 0.8455 | 0.89551/0.18816 = **4.76** | ✓ AA |

`#8a6013` passes AA on **every light surface we ship**, with ≥0.26 of margin everywhere. Same hue as brand gold (H 38.8° vs 39.7°) — it reads as "the dark version of our gold", not as a different colour.

> I first tested `#8f6410` (L 0.14991). It passes at 5.17 / 4.64 on page bg and cream but lands at **4.48 on the `#f4ecdf` footer** — a marginal fail. `#8a6013` was chosen specifically to clear the footer. If the client prefers, the alternative fix is to delete `#f4ecdf` and make the footer plain cream `#f7f0e5`; I'd keep both options open but ship `#8a6013` either way.

**`brand-gold-600 = #a97612`** (L 0.21436) — the focus ring / large-text gold:

| Background | Ratio | Verdict |
|---|---|---|
| `#ffffff` | 1.05/0.26436 = **3.97** | ✓ non-text, ✓ large text |
| `#fffdf9` | **3.91** | ✓ |
| `#f5f7f3` | **3.69** | ✓ |
| `#f7f0e5` | **3.51** | ✓ |
| `#e8f0e9` | **3.42** | ✓ |
| `#f4ecdf` | **3.39** | ✓ |
| `#043b32` deep | 0.26436/0.08390 = **3.15** | ✓ but thin → use `#e3bd52` on dark instead |

**`brand-gold-300 = #e3bd52`** (L 0.53336) — accent text on dark:

| Background | Ratio | Verdict |
|---|---|---|
| `#043b32` deep | 0.58336/0.08390 = **6.95** | ✓ AA + AAA |
| `#075344` green | 0.58336/0.11650 = **5.01** | ✓ AA |

**`brand-gold-500` on the gold button** — `#172c27` (L 0.02130) on `#c48a16`:
(0.34971)/(0.07130) = **4.90** ✓ AA. The gold button is fine; only gold-as-text was broken.

Gold button **hover** must also pass. `#172c27` on `brand-gold-600 #a97612` = 0.26436/0.07130 = **3.71 ✗**. Therefore the gold button gets **lighter** on hover, not darker: `#172c27` on `brand-gold-400 #d3a32c` = 0.45225/0.07130 = **6.34 ✓**.

### 2.3 The gold usage rule (ship this verbatim in the README)

```
GOLD RULE
─────────
#c48a16 (accent)      → FILLS ONLY. Button backgrounds, ≥3px decorative rules,
                        icon fills that are redundant with adjacent text, dots,
                        the logo. NEVER as a text colour. NEVER as the sole
                        focus indicator. NEVER as the only signal distinguishing
                        two card types.
#a97612 (focus)       → focus-visible rings on light surfaces; gold text ONLY at
                        ≥24px regular or ≥18.66px (1.167rem) bold.
#8a6013 (accent-text) → ALL gold text on light surfaces at any size. Eyebrows,
                        "Details →" links, inline accents.
#74520f               → gold text at ≤13px or on the deepest cream (#f4ecdf).
#e3bd52               → ALL gold text on dark-green surfaces.
```

### 2.4 Muted-text audit — five colours collapse to one

| Reference hex | L | On `#ffffff` | On `#fffdf9` | On `#f7f0e5` | On `#f5f7f3` | On `#f4ecdf` | Verdict |
|---|---|---|---|---|---|---|---|
| `#4f625e` hero p | 0.11206 | 6.48 | 6.38 | 5.72 | 6.01 | 5.53 | ✓ passes |
| `#61716d` section sub | 0.15456 | 5.13 | 5.05 | **4.53** | 4.76 | **4.38 ✗** | marginal |
| `#566864` feature p | 0.12799 | 5.90 | 5.81 | 5.21 | 5.47 | 5.04 | ✓ passes |
| `#5c6e69` why p | 0.14447 | 5.40 | 5.31 | 4.77 | 5.01 | **4.60** | ✓ thin |
| `#526762` detail intro | 0.12377 | 6.04 | 5.95 | 5.33 | 5.60 | 5.15 | ✓ passes |
| `#50625e` detail list | 0.11249 | 6.47 | 6.36 | 5.71 | 6.00 | 5.52 | ✓ passes |
| `#5f6c69` notice | 0.14178 | 5.46 | 5.37 | 4.84 | 5.08 | **4.67** | ✓ thin |
| **`#687773`** service-note 13px | 0.17375 | 4.69 | 4.62 | **4.13 ✗** | **4.35 ✗** | **3.99 ✗** | **FAILS** |
| **`#6c7a76`** info-strip small | 0.18417 | **4.48 ✗** | **4.41 ✗** | **3.96 ✗** | **4.16 ✗** | **3.82 ✗** | **FAILS EVERYWHERE** |
| **`#6f7a77`** footer small | ≈0.1875 | **4.42 ✗** | **4.35 ✗** | **3.91 ✗** | ≈4.11 ✗ | **3.77 ✗** | **FAILS EVERYWHERE** |

The three failures are exactly the *smallest* text on the page (12–13px footnotes, the info strip, the footer copyright) — the worst possible place for it.

**Fix: one token.** `neutral-600 = #5a6b66` → R_lin 0.102241, G_lin 0.147026, B_lin 0.132869 → **L = 0.13648**

| Background | Ratio |
|---|---|
| `#ffffff` | 1.05/0.18648 = **5.63** ✓ |
| `#fffdf9` | **5.54** ✓ |
| `#fbfcfa` (placeholder on input) | **5.47** ✓ |
| `#f5f7f3` | **5.22** ✓ |
| `#f7f0e5` | **4.97** ✓ |
| `#e8f0e9` | **4.85** ✓ |
| `#f4ecdf` | **4.80** ✓ |

Every muted use on the site — card body, section subtitle, footnote, placeholder, caption, copyright — becomes `text-muted`. Nine hexes down to one, and the accessibility bug disappears as a side effect. This is the single highest value-per-hour change in the whole colour system.

For copy that should read a step stronger (lead paragraphs, nav links) use `text-secondary = #3f524d` (L 0.07627): **8.32** on white, **7.35** on cream, **8.19** on `#fffdf9`. Comfortably AAA.

### 2.5 Everything else we ship

| Pair | Ratio | Verdict |
|---|---|---|
| `#19312c` ink on `#fffdf9` | 13.63 | ✓ AAA |
| `#19312c` on `#f7f0e5` | 12.23 | ✓ AAA |
| `#043b32` deep heading on `#fffdf9` | 12.33 | ✓ AAA |
| `#043b32` on `#f7f0e5` | 11.06 | ✓ AAA |
| `#043b32` on `#f5f7f3` | 11.62 | ✓ AAA |
| `#075344` green on `#ffffff` | 9.01 | ✓ AAA |
| `#075344` on `#f5f7f3` | 8.36 | ✓ AAA |
| `#075344` on `#eef4f2` (secondary btn hover) | 8.09 | ✓ AAA |
| `#ffffff` on `#075344` (primary btn) | 9.01 | ✓ AAA |
| `#ffffff` on `#05493c` (btn hover) | 10.37 | ✓ AAA |
| `#ffffff` on `#043b32` (contact section) | 12.52 | ✓ AAA |
| `#c7d6d2` on `#043b32` (muted on dark) | 8.34 | ✓ AAA |
| `#c7d6d2` on `#075344` | 6.00 | ✓ AA |
| `#172c27` on `#c48a16` (gold btn) | 4.90 | ✓ AA |
| `#172c27` on `#d3a32c` (gold btn hover) | 6.34 | ✓ AA |
| `#8c1d18` error text on `#fffdf9` | 8.97 | ✓ AAA |
| `#b3261e` error border on `#ffffff` | 6.54 | ✓ 1.4.11 |
| `#05502f` success text on `#fffdf9` | 9.42 | ✓ AAA |
| `#4a6b52` sage-600 on `#ffffff` | 5.97 | ✓ AA |
| **`#769b7e` sage-400 on `#ffffff`** | **3.11** | **decorative only** |
| **`#5d8467` sage-500 on `#ffffff`** | **4.23** | **large text / UI only** |
| **`#7d8d89` neutral-500 on `#fbfcfa`** | **3.38** | **icons ≥24px only** |
| **`#ffffff` on `#25d366`** | **1.98** | **REJECTED — see §5.9** |
| `#ffffff` on `#128c7e` | 4.14 | ✓ 1.4.11, near-AA |

**Two decorative-only warnings to write into the README:**
1. `border-subtle #dfe7e1` on white is **1.42:1**. It is *not* a perceivable boundary. A clickable card must not rely on its border — the affordance is the "Details →" label + hover lift + a real `<button>`/`<a>` element.
2. The gold 3px top-border on the "Warum" cards is **decorative under 1.4.11** only as long as it doesn't distinguish card *categories*. If it ever does, add a text label.

---

## 3. THE `@theme` BLOCK — REAL CODE

File: `src/styles/theme.css`, imported once from `src/main.tsx`.

```css
/* ═══════════════════════════════════════════════════════════════
   ZUKUNFT SERVICE — Tailwind v4 theme
   Requires: tailwindcss@^4.1, @tailwindcss/vite@^4.1
   ═══════════════════════════════════════════════════════════════ */
@import "tailwindcss";

/* Self-hosted fonts (see §4.6). Fontsource CSS is imported in main.tsx
   BEFORE this file so @font-face lands in the default layer. */

/* ── Custom variants ────────────────────────────────────────── */
@custom-variant ar (&:where(html[lang="ar"], html[lang="ar"] *));
@custom-variant de (&:where(html[lang="de"], html[lang="de"] *));
@custom-variant on-dark (&:where([data-surface="dark"], [data-surface="dark"] *));

/* ── PRIMITIVES ─────────────────────────────────────────────── */
@theme {
  /* Green */
  --color-brand-green-50:  #eef4f2;
  --color-brand-green-100: #d6e4e0;
  --color-brand-green-200: #a9c6be;
  --color-brand-green-300: #6f9d92;
  --color-brand-green-400: #3b7668;
  --color-brand-green-500: #0a604f;
  --color-brand-green-600: #075344;   /* ★ brand */
  --color-brand-green-700: #05493c;
  --color-brand-green-800: #043b32;   /* ★ deep */
  --color-brand-green-900: #032e27;
  --color-brand-green-950: #021f1a;

  /* Gold */
  --color-brand-gold-50:  #fdf6e3;
  --color-brand-gold-100: #f8e9bf;
  --color-brand-gold-200: #f0d68a;
  --color-brand-gold-300: #e3bd52;    /* text on dark */
  --color-brand-gold-400: #d3a32c;    /* gold-btn hover */
  --color-brand-gold-500: #c48a16;    /* ★ brand — FILL ONLY */
  --color-brand-gold-600: #a97612;    /* focus ring */
  --color-brand-gold-700: #8a6013;    /* text on light */
  --color-brand-gold-800: #74520f;    /* dense text */
  --color-brand-gold-900: #5c400d;

  /* Sage */
  --color-brand-sage-50:  #f2f6f2;
  --color-brand-sage-100: #e3ece5;
  --color-brand-sage-200: #c7d9cb;
  --color-brand-sage-300: #a3bfa9;
  --color-brand-sage-400: #769b7e;    /* ★ brand — DECORATIVE ONLY */
  --color-brand-sage-500: #5d8467;
  --color-brand-sage-600: #4a6b52;    /* text-safe */
  --color-brand-sage-700: #3b5642;

  /* Cream + neutral */
  --color-brand-cream-50:  #fffdf9;
  --color-brand-cream-100: #f7f0e5;
  --color-brand-cream-200: #f4ecdf;
  --color-brand-mint-100:  #e8f0e9;

  --color-neutral-0:   #ffffff;
  --color-neutral-50:  #fbfcfa;
  --color-neutral-100: #f5f7f3;
  --color-neutral-150: #eef2ee;
  --color-neutral-200: #e2e8e5;
  --color-neutral-250: #dfe7e1;
  --color-neutral-300: #cdd9d5;
  --color-neutral-400: #a7b5b1;
  --color-neutral-500: #7d8d89;
  --color-neutral-600: #5a6b66;
  --color-neutral-700: #3f524d;
  --color-neutral-800: #2e433e;
  --color-neutral-900: #19312c;       /* ★ ink */
  --color-neutral-950: #172c27;

  /* Status + utility */
  --color-danger:      #b3261e;
  --color-danger-fg:   #8c1d18;
  --color-danger-bg:   #fef7f6;
  --color-success-fg:  #05502f;
  --color-success-bg:  #eef6f1;
  --color-whatsapp:    #128c7e;

  /* ── FONT FAMILIES ────────────────────────────────────────── */
  --font-sans:    "IBM Plex Sans", "IBM Plex Sans Arabic",
                  ui-sans-serif, system-ui, "Segoe UI", Arial, sans-serif;
  --font-display: "IBM Plex Serif", "IBM Plex Sans Arabic",
                  Georgia, "Times New Roman", serif;
  --font-arabic:  "IBM Plex Sans Arabic", "Noto Sans Arabic",
                  Tahoma, Arial, sans-serif;

  /* ── TYPE SCALE (Latin / German is the base) ───────────────── */
  --text-display-xl: clamp(2.75rem, 1.75rem + 4.6vw, 5.25rem);   /* 44→84 */
  --text-display-xl--line-height: 0.96;
  --text-display-xl--letter-spacing: -0.032em;
  --text-display-xl--font-weight: 600;

  --text-display-lg: clamp(2rem, 1.35rem + 2.9vw, 3.25rem);      /* 32→52 */
  --text-display-lg--line-height: 1.06;
  --text-display-lg--letter-spacing: -0.022em;
  --text-display-lg--font-weight: 600;

  --text-display-md: clamp(1.5rem, 1.2rem + 1.35vw, 2rem);       /* 24→32 */
  --text-display-md--line-height: 1.15;
  --text-display-md--letter-spacing: -0.015em;
  --text-display-md--font-weight: 600;

  --text-display-sm: 1.4375rem;                                   /* 23 */
  --text-display-sm--line-height: 1.26;
  --text-display-sm--letter-spacing: -0.01em;
  --text-display-sm--font-weight: 600;

  --text-title:      1.25rem;                                     /* 20 */
  --text-title--line-height: 1.35;
  --text-title--letter-spacing: -0.005em;
  --text-title--font-weight: 600;

  --text-lead:       1.1875rem;                                   /* 19 */
  --text-lead--line-height: 1.7;
  --text-lead--letter-spacing: 0em;

  --text-body:       1rem;                                        /* 16 */
  --text-body--line-height: 1.65;
  --text-body--letter-spacing: 0em;

  --text-body-sm:    0.875rem;                                    /* 14 */
  --text-body-sm--line-height: 1.6;

  --text-label:      0.8125rem;                                   /* 13 */
  --text-label--line-height: 1.4;
  --text-label--letter-spacing: 0.01em;
  --text-label--font-weight: 600;

  --text-caption:    0.75rem;                                     /* 12 */
  --text-caption--line-height: 1.5;
  --text-caption--letter-spacing: 0.005em;

  --text-eyebrow:    0.75rem;                                     /* 12 */
  --text-eyebrow--line-height: 1.2;
  --text-eyebrow--letter-spacing: 0.16em;
  --text-eyebrow--font-weight: 700;

  /* ── RADII (reference values, named) ──────────────────────── */
  --radius-xs:  0.375rem;   /*  6 — badges */
  --radius-sm:  0.5rem;     /*  8 — inputs (ref 7) */
  --radius-md:  0.625rem;   /* 10 — buttons (ref 8) */
  --radius-lg:  0.875rem;   /* 14 — service card ★ */
  --radius-xl:  1.125rem;   /* 18 — panels, form card ★ */
  --radius-2xl: 1.25rem;    /* 20 — feature card ★ */
  --radius-3xl: 1.375rem;   /* 22 — modal / sheet ★ */
  --radius-pill: 9999px;

  /* ── SHADOWS (green-tinted, per the reference's #07534417) ─ */
  --shadow-xs: 0 1px 2px 0 #0753440f;
  --shadow-sm: 0 1px 3px 0 #07534414, 0 1px 2px -1px #0753440f;
  --shadow-md: 0 4px 12px -2px #0753441a, 0 2px 6px -2px #07534414;
  --shadow-lg: 0 12px 28px -6px #0753441f, 0 4px 10px -4px #07534414;
  --shadow-xl: 0 24px 56px -12px #07534429, 0 8px 20px -8px #0753441a;
  --shadow-modal: 0 32px 90px -20px #00000052, 0 8px 24px -12px #00000029;
  --shadow-fab: 0 8px 24px -4px #04231d4d, 0 2px 8px -2px #04231d33;
  --shadow-header: 0 1px 0 0 #07534414, 0 6px 18px -12px #07534429;

  /* ── SPACING (base 4px scale kept) + named rhythm ─────────── */
  --spacing: 0.25rem;
  --spacing-gutter:    clamp(1.25rem, 0.5rem + 4.5vw, 5.5rem);   /* 20→88 */
  --spacing-section:   clamp(4.5rem, 3rem + 6vw, 7rem);          /* 72→112 */
  --spacing-section-lg: clamp(5.5rem, 3.5rem + 8vw, 8.5rem);     /* 88→136 */
  --spacing-block:     clamp(2rem, 1.5rem + 2vw, 3rem);          /* 32→48 */

  /* ── CONTAINERS ───────────────────────────────────────────── */
  --container-prose:   44rem;    /*  704 — section-heading copy */
  --container-content: 68rem;    /* 1088 — grids, forms */
  --container-wide:   77.5rem;   /* 1240 — service split ★ */
  --container-max:     90rem;    /* 1440 — hero, header */

  /* ── BREAKPOINTS (v4 defaults + xs) ───────────────────────── */
  --breakpoint-xs: 26.25rem;     /* 420 */
  /* sm 40rem · md 48rem · lg 64rem · xl 80rem · 2xl 96rem (stock) */

  /* ── MOTION ───────────────────────────────────────────────── */
  --ease-out-quart:   cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-quad: cubic-bezier(0.45, 0, 0.55, 1);
  --ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1);

  --duration-instant: 90ms;
  --duration-fast:    160ms;
  --duration-base:    240ms;
  --duration-slow:    380ms;
  --duration-slower:  620ms;

  --animate-reveal: reveal var(--duration-slower) var(--ease-out-expo) both;
  --animate-fab-in: fab-in var(--duration-base) var(--ease-spring) both;
}

/* ── SEMANTIC LAYER ─────────────────────────────────────────────
   `inline` makes utilities emit var(--surface) rather than the
   resolved hex, so [data-surface="dark"] flips them at runtime
   without regenerating any CSS. Same mechanism unlocks dark mode
   later (§8) with a single extra block.                          */
@theme inline {
  --color-surface:          var(--surface);
  --color-surface-alt:      var(--surface-alt);
  --color-surface-warm:     var(--surface-warm);
  --color-surface-raised:   var(--surface-raised);
  --color-surface-sunken:   var(--surface-sunken);
  --color-surface-field:    var(--surface-field);
  --color-surface-inverse:  var(--surface-inverse);

  --color-text-body:        var(--text-body-color);
  --color-text-heading:     var(--text-heading-color);
  --color-text-secondary:   var(--text-secondary-color);
  --color-text-muted:       var(--text-muted-color);
  --color-text-on-brand:    #ffffff;
  --color-text-on-accent:   #172c27;

  --color-brand:            var(--brand);
  --color-brand-hover:      var(--brand-hover);
  --color-accent:           var(--accent);
  --color-accent-hover:     var(--accent-hover);
  --color-accent-text:      var(--accent-text);
  --color-accent-text-strong: var(--accent-text-strong);

  --color-border-subtle:    var(--border-subtle);
  --color-border-default:   var(--border-default);
  --color-border-strong:    var(--border-strong);
  --color-focus:            var(--focus);
  --color-focus-halo:       var(--focus-halo);
}

@layer base {
  :root {
    color-scheme: light;                    /* never force-dark native controls */

    --surface:         #fffdf9;
    --surface-alt:     #f5f7f3;
    --surface-warm:    #f7f0e5;
    --surface-raised:  #ffffff;
    --surface-sunken:  #eef2ee;
    --surface-field:   #fbfcfa;
    --surface-inverse: #043b32;

    --text-body-color:      #19312c;
    --text-heading-color:   #043b32;
    --text-secondary-color: #3f524d;
    --text-muted-color:     #5a6b66;

    --brand:        #075344;
    --brand-hover:  #05493c;
    --accent:       #c48a16;
    --accent-hover: #d3a32c;
    --accent-text:        #8a6013;
    --accent-text-strong: #74520f;

    --border-subtle:  #dfe7e1;
    --border-default: #cdd9d5;
    --border-strong:  #a7b5b1;
    --focus:      #a97612;
    --focus-halo: #fffdf9;
  }

  [data-surface="dark"] {
    --surface:         #043b32;
    --surface-alt:     #032e27;
    --surface-warm:    #043b32;
    --surface-sunken:  #032e27;
    --surface-inverse: #fffdf9;

    --text-body-color:      #ffffff;
    --text-heading-color:   #ffffff;
    --text-secondary-color: #dbe6e2;
    --text-muted-color:     #c7d6d2;

    --brand:        #e3bd52;
    --brand-hover:  #f0d68a;
    --accent-text:        #e3bd52;
    --accent-text-strong: #f0d68a;

    --border-subtle:  #ffffff1f;
    --border-default: #ffffff33;
    --border-strong:  #ffffff52;
    --focus:      #e3bd52;
    --focus-halo: #043b32;
    /* deliberately NOT setting color-scheme: dark — the white form
       card lives inside this scope and native inputs must stay light */
  }

  /* the white form card resets back to the light scope */
  [data-surface="light"] {
    --surface: #ffffff; --surface-raised: #ffffff;
    --text-body-color: #19312c; --text-heading-color: #043b32;
    --text-secondary-color: #3f524d; --text-muted-color: #5a6b66;
    --brand: #075344; --brand-hover: #05493c;
    --accent-text: #8a6013; --accent-text-strong: #74520f;
    --border-subtle: #dfe7e1; --border-default: #cdd9d5;
    --focus: #a97612; --focus-halo: #ffffff;
  }

  html { scroll-behavior: smooth; scroll-padding-block-start: 6.5rem; }
  body {
    background: var(--color-surface);
    color: var(--color-text-body);
    font-family: var(--font-sans);
    font-size: var(--text-body);
    line-height: var(--text-body--line-height);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  h1, h2, h3, h4 {
    font-family: var(--font-display);
    color: var(--color-text-heading);
    text-wrap: balance;
    overflow-wrap: break-word;
  }
  p, li { text-wrap: pretty; }
  ::selection { background: #c48a1636; color: #19312c; }

  /* German compound nouns ("Personenstandsdokumente",
     "Immobilienfinanzierung") WILL break mobile layouts otherwise. */
  html[lang="de"] p,
  html[lang="de"] li,
  html[lang="de"] dd { hyphens: auto; }
  html[lang="de"] h1,
  html[lang="de"] h2 { hyphens: manual; overflow-wrap: anywhere; }
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}
@keyframes fab-in {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: none; }
}
```

**Custom utilities** (v4 `@utility`, not `@layer utilities`):

```css
@utility section {
  padding-block: var(--spacing-section);
  padding-inline: var(--spacing-gutter);
}
@utility section-lg {
  padding-block: var(--spacing-section-lg);
  padding-inline: var(--spacing-gutter);
}
@utility focus-ring {
  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
    border-radius: inherit;
  }
}
/* RTL-safe image edge fade — gradients have no logical direction,
   so the angle is a custom property, flipped by dir. */
@utility img-fade {
  position: relative;
  --fade-angle: 90deg;
  --fade-stop: 22%;
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      var(--fade-angle),
      var(--color-surface-warm),
      transparent var(--fade-stop)
    );
  }
}
[dir="rtl"] .img-fade { --fade-angle: -90deg; }
@media (width < 64rem) {
  .img-fade { --fade-angle: 0deg; --fade-stop: 30%; }
}
```

---

## 4. TYPOGRAPHY

### 4.1 The pairing — and why

**Ship: the IBM Plex superfamily.**

| Role | German (Latin) | Arabic |
|---|---|---|
| Display / h1–h4 | **IBM Plex Serif** 600 | **IBM Plex Sans Arabic** 600 |
| Body / UI / buttons | **IBM Plex Sans** 400 / 500 / 600 / 700 | **IBM Plex Sans Arabic** 400 / 500 / 600 / 700 |

Justification against the three constraints:

1. **Genuine Arabic companion.** IBM Plex Sans Arabic was drawn by Bold Monday *as a member of the Plex family*, on

the same design brief as the Latin, with matched vertical metrics, stroke weights and counters. It is not a bolted-on script — DE and AR genuinely render as one brand.

2. **Free / self-hostable.** All three are SIL OFL 1.1. No licence fee, no CDN dependency, no CSP problems.

3. **Costs nothing at $700.** Three Fontsource packages, four WOFF2 subsets, ~15 minutes of setup.

**Why not the alternatives:**

| Candidate | Rejected because |
|---|---|
| Cairo | Latin half is a thin afterthought; would fight any real Latin partner. Very "startup", wrong register for a documents/authority business. |
| Tajawal | Same problem. Latin is Kufi-derived and awkward with German diacritics (ä ö ü ß). |
| Amiri | Beautiful book Naskh, but low x-height, high contrast, designed for long-form print. Illegible at 13px UI sizes. No Latin partner. |
| Noto Sans / Noto Kufi Arabic | Free and safe, but Noto Sans is deliberately neutral — it would be a *lateral* move from Arial, not an upgrade. Client is paying for a visible improvement. |
| Rubik, Lora, Frank Ruhl, Source Serif | **No Arabic at all.** Fails constraint (a) outright. |
| Readex Pro | The one real alternative — genuine Latin+Arabic variable superfamily, OFL. Warmer and rounder than Plex. **Offer as the swap option** if the client finds Plex too technical. It is a one-line token change. |

**Why serif for German headings but not Arabic:** Arabic typography has no serif/sans axis. The Latin serif/sans contrast is replaced in Arabic by **weight + optical size + spacing**. Forcing a Naskh display face next to a Plex Sans body would introduce a mismatch that doesn't exist in the Latin. One Arabic family, differentiated by weight, is the correct answer — and it also halves the Arabic payload.

**Weight ceiling — a real constraint:** the reference uses 800 (buttons) and 900 (gold links, eyebrows). IBM Plex Sans tops out at **700 (Bold)**. Every 800/900 in the reference maps to **600 (SemiBold)** for UI and **700 (Bold)** for eyebrows/emphasis. With Plex's larger x-height and the 0.16em eyebrow tracking, 700 reads as heavy as Arial 900 did. No visual loss.

### 4.2 German / Latin type scale

| Token | Size (min→max) | Line-height | Weight | Tracking | Family | Use |
|---|---|---|---|---|---|---|
| `display-xl` | `clamp(2.75rem, 1.75rem + 4.6vw, 5.25rem)` 44→84px | 0.96 | 600 | −0.032em | Serif | hero h1 |
| `display-lg` | `clamp(2rem, 1.35rem + 2.9vw, 3.25rem)` 32→52px | 1.06 | 600 | −0.022em | Serif | section h2 |
| `display-md` | `clamp(1.5rem, 1.2rem + 1.35vw, 2rem)` 24→32px | 1.15 | 600 | −0.015em | Serif | feature-card h3, modal h2 |
| `display-sm` | 23px | 1.26 | 600 | −0.01em | Serif | service-card h3, info-strip h3 |
| `title` | 20px | 1.35 | 600 | −0.005em | Serif | why-card h3, modal sub-heads |
| `lead` | 19px | 1.70 | 400 | 0 | Sans | hero paragraph, section subtitle |
| `body` | 16px | 1.65 | 400 | 0 | Sans | default copy, list items |
| `body-sm` | 14px | 1.60 | 400 | 0 | Sans | nav links (600), dense lists |
| `label` | 13px | 1.40 | 600 | 0.01em | Sans | form labels, quick-contact rows |
| `caption` | 12px | 1.50 | 400 | 0.005em | Sans | footnotes, copyright, figcaption |
| `eyebrow` | 12px | 1.20 | 700 | 0.16em + `uppercase` | Sans | section kickers |

Minimum shipped text size: **12px**, and only for genuinely non-essential captions. Everything the user must read is ≥13px. Note the reference's `.service-note` (13px, centred, 900px wide) — keep it at 13px but with `text-muted #5a6b66` (5.22:1 on `#f5f7f3`).

### 4.3 Arabic type scale + overrides

Arabic is not "German with a different font". Four things change: **size, leading, tracking, casing.**

| Token | AR size | AR line-height | Weight | Tracking | Δ vs Latin |
|---|---|---|---|---|---|
| `display-xl` | `clamp(2.375rem, 1.6rem + 3.6vw, 4.375rem)` 38→70px | 1.28 | 600 | 0 | −17% size, +0.32 LH |
| `display-lg` | `clamp(1.75rem, 1.2rem + 2.4vw, 2.75rem)` 28→44px | 1.36 | 600 | 0 | −15% size |
| `display-md` | `clamp(1.375rem, 1.1rem + 1.2vw, 1.75rem)` 22→28px | 1.45 | 600 | 0 | −12% size |
| `display-sm` | 21px | 1.52 | 600 | 0 | −9% size |
| `title` | 19px | 1.55 | 600 | 0 | −5% |
| `lead` | 20px | 1.95 | 400 | 0 | **+5% size**, +0.25 LH |
| `body` | 17px | 1.90 | 400 | 0 | **+6% size**, +0.25 LH |
| `body-sm` | 15px | 1.85 | 400 | 0 | **+7% size** |
| `label` | 14px | 1.60 | 600 | 0 | +8% |
| `caption` | 13px | 1.65 | 400 | 0 | +8% |
| `eyebrow` | 13px | 1.50 | 700 | 0 | **+8%, NO uppercase** |

**The rule behind the numbers:** at *body* sizes Arabic needs to go **up** (~5–8%) because the apparent size of Arabic glyphs relative to the em is smaller than a Latin lowercase; at *display* sizes it needs to come **down** (~12–17%) because Arabic ascenders/descenders plus the deep initial/final forms make headlines run much taller and heavier, and an Arabic h1 set at the Latin size looks shouty and overflows two lines where German fits one.

**Non-negotiable Arabic overrides:**

```css
@layer base {
  html[lang="ar"] {
    font-family: var(--font-arabic);
    direction: rtl;

    /* re-point the scale tokens; html[lang="ar"] (0,1,1) beats :root (0,1,0) */
    --text-display-xl: clamp(2.375rem, 1.6rem + 3.6vw, 4.375rem);
    --text-display-xl--line-height: 1.28;
    --text-display-xl--letter-spacing: 0em;
    --text-display-lg: clamp(1.75rem, 1.2rem + 2.4vw, 2.75rem);
    --text-display-lg--line-height: 1.36;
    --text-display-lg--letter-spacing: 0em;
    --text-display-md: clamp(1.375rem, 1.1rem + 1.2vw, 1.75rem);
    --text-display-md--line-height: 1.45;
    --text-display-md--letter-spacing: 0em;
    --text-display-sm: 1.3125rem;  --text-display-sm--line-height: 1.52;
    --text-display-sm--letter-spacing: 0em;
    --text-title: 1.1875rem;       --text-title--line-height: 1.55;
    --text-title--letter-spacing: 0em;
    --text-lead: 1.25rem;          --text-lead--line-height: 1.95;
    --text-body: 1.0625rem;        --text-body--line-height: 1.90;
    --text-body-sm: 0.9375rem;     --text-body-sm--line-height: 1.85;
    --text-label: 0.875rem;        --text-label--line-height: 1.6;
    --text-label--letter-spacing: 0em;
    --text-caption: 0.8125rem;     --text-caption--line-height: 1.65;
    --text-caption--letter-spacing: 0em;
    --text-eyebrow: 0.8125rem;     --text-eyebrow--line-height: 1.5;
    --text-eyebrow--letter-spacing: 0em;
  }

  /* Belt-and-braces: nothing in Arabic ever gets tracking, casing or
     small-caps, regardless of what a utility class asks for. */
  html[lang="ar"] :is(h1,h2,h3,h4,h5,h6,p,li,a,button,label,span,strong,em,small) {
    letter-spacing: 0 !important;
    text-transform: none !important;
    font-variant-caps: normal;
  }
  html[lang="ar"] { hyphens: none; }
  html[lang="ar"] :is(h1,h2,h3,p,li) { text-align: start; }  /* never justify */

  /* Headings in Arabic use the Sans Arabic, not the Latin serif */
  html[lang="ar"] :is(h1,h2,h3,h4) { font-family: var(--font-arabic); }

  /* Latin runs inside Arabic copy — "Zukunft Service", "Schengen-Visa",
     phone numbers, email — keep the Latin face and LTR ordering. */
  html[lang="ar"] :lang(de),
  html[lang="ar"] .latin { font-family: var(--font-sans); }
  bdi[dir="ltr"] { unicode-bidi: isolate; font-variant-numeric: tabular-nums; }
}
```

**Practical rules for the component authors:**
- Every phone number, email address, IBAN, date and "Zukunft Service" wordmark inside Arabic copy goes in `<bdi dir="ltr">`. Without it, a leading `+49` reorders and the number renders wrong. This is the single most common Arabic bug and it *will* happen on the info strip.
- Never `text-transform: uppercase` in AR. Arabic has no case; the browser silently no-ops, but the 0.16em eyebrow tracking would still break glyph joining — hence the `letter-spacing: 0` override.
- Never `font-style: italic` in AR — Plex Sans Arabic has no italic and the browser will synthesise a sheared, broken join.
- `text-wrap: balance` is safe in Arabic and helps a lot on h1.

**OPEN QUESTION — numerals.** Western digits (`0–9`) or Eastern Arabic digits (`٠–٩`) in the AR locale? My recommendation is **Western**, because: the audience lives in Germany and transacts with German forms, phone numbers and addresses; Levantine and Iraqi diaspora usage on web/WhatsApp is overwhelmingly Western; and it removes a whole class of bidi bugs. But this is a brand-voice call the client should make, not me. It is a one-line change if they disagree.

### 4.4 Type-related section-level rules

- **Line length.** Cap measure at `--container-prose: 44rem` for German lead copy (≈70–75 characters at 19px). Arabic runs shorter per line at the same width — cap AR at `40rem` via `html[lang="ar"] .prose-measure { max-width: 40rem; }`.
- **h1 max-width** 760px in DE (matches the reference), 680px in AR.
- **`font-optical-sizing: auto`** — Plex is not an optical-size variable font, so this is a no-op; do not add it.
- **Numeric alignment** in the info strip (hours, phone): `font-variant-numeric: tabular-nums`.

### 4.5 What this costs in bytes

| Face | Weights | Subset | Approx WOFF2 |
|---|---|---|---|
| IBM Plex Sans | 400, 500, 600, 700 | latin + latin-ext | ~4 × 22 KB = 88 KB |
| IBM Plex Serif | 400, 600 | latin + latin-ext | ~2 × 24 KB = 48 KB |
| IBM Plex Sans Arabic | 400, 500, 600, 700 | arabic | ~4 × 30 KB = 120 KB |

**Load only what the active locale needs.** German visitors never download the Arabic (and vice versa). Per-locale budget lands at **~136 KB (DE)** or **~120 KB (AR)**, which is fine and still far better perceived quality than the reference's zero-webfont Arial.

### 4.6 Font loading — exact packages and code

```bash
npm i @fontsource/ibm-plex-sans@^5 \
      @fontsource/ibm-plex-serif@^5 \
      @fontsource/ibm-plex-sans-arabic@^5
```

Fontsource v5 is the current major and ships per-weight, per-subset WOFF2 with `font-display: swap` already set. Self-hosted, no Google Fonts request, no consent-banner exposure under DSGVO (a real and often-missed benefit for a German site — remote Google Fonts embedding has been ruled a GDPR violation by LG München I, 3 O 17493/20).

```ts
// src/main.tsx — Latin is always needed (brand name, nav, numbers)
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-700.css";
import "@fontsource/ibm-plex-serif/latin-400.css";
import "@fontsource/ibm-plex-serif/latin-600.css";
import "./styles/theme.css";
```

```ts
// src/i18n/loadArabicFonts.ts — lazy, only when locale === "ar"
export const loadArabicFonts = () =>
  Promise.all([
    import("@fontsource/ibm-plex-sans-arabic/arabic-400.css"),
    import("@fontsource/ibm-plex-sans-arabic/arabic-500.css"),
    import("@fontsource/ibm-plex-sans-arabic/arabic-600.css"),
    import("@fontsource/ibm-plex-sans-arabic/arabic-700.css"),
  ]);
```

Preload the two faces that render above the fold, per locale, in `index.html`:

```html
<link rel="preload" as="font" type="font/woff2" crossorigin
      href="/fonts/ibm-plex-serif-latin-600.woff2">
<link rel="preload" as="font" type="font/woff2" crossorigin
      href="/fonts/ibm-plex-sans-latin-400.woff2">
```

Add a `size-adjust` fallback so the swap doesn't shift layout:

```css
@font-face {
  font-family: "Plex Serif Fallback";
  src: local("Georgia"), local("Times New Roman");
  size-adjust: 103%;
  ascent-override: 92%;
  descent-override: 24%;
  line-gap-override: 0%;
}
@font-face {
  font-family: "Plex Sans Fallback";
  src: local("Segoe UI"), local("Arial");
  size-adjust: 101%;
  ascent-override: 94%;
  descent-override: 25%;
  line-gap-override: 0%;
}
```
…then insert these before the generic fallbacks in `--font-display` / `--font-sans`. **The override percentages above are a starting estimate and must be measured** against the real faces during build — that's a 20-minute QA task, not a guess to ship blind. Budget it.

---

## 5. COMPONENT DESIGN LANGUAGE

Every interactive component inherits the same focus treatment. Specify it once:

```css
.focus-ring:focus-visible,
:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible {
  outline: 3px solid var(--color-focus);   /* #a97612 light / #e3bd52 dark */
  outline-offset: 2px;
  border-radius: inherit;
}
```
The 2px offset renders in the surface colour, giving the ring a guaranteed light gap on every background — so the ring itself only has to clear 3:1 against *one* colour, which §2.2 proved it does on all seven of our light surfaces and on deep green. `:focus` without `-visible` is never styled; mouse users see nothing.

### 5.1 Buttons

**Geometry**

| Size | Height | Padding-inline | Font | Icon | Gap |
|---|---|---|---|---|---|
| `sm` | 40px | 16px | `body-sm` / 600 | 16px | 8px |
| `md` (default) | 48px | 24px | `body` / 600 | 18px | 10px |
| `lg` | 56px | 32px | `lead` / 600 | 20px | 12px |

Radius `--radius-md` (10px — the reference's 8px, softened 2px). Latin tracking `0.005em`; Arabic `0`. `display: inline-flex; align-items: center; justify-content: center;` Minimum touch target 44×44 on all sizes (the `sm` 40px button gets `min-height: 44px` below `md` breakpoint, or an invisible `::before` inset of −2px).

**Variants and every state**

| Variant | Rest | Hover | Active | Focus-visible | Disabled | Loading |
|---|---|---|---|---|---|---|
| **primary** | bg `#075344`, text `#fff` (9.01:1), `shadow-xs` | bg `#05493c` (10.37:1), `shadow-sm` | bg `#043b32`, `translateY(1px)`, shadow none | ring `#a97612` | bg `#cdd9d5`, text `#5a6b66`, `cursor: not-allowed`, no shadow | width locked to rest width, label → `opacity: 0`, 18px spinner centred, `aria-busy="true"` |
| **secondary** | transparent, 1.5px border `#075344`, text `#075344` (9.01:1) | bg `#eef4f2` (text 8.09:1), border `#05493c` | bg `#d6e4e0`, `translateY(1px)` | ring `#a97612` | border `#cdd9d5`, text `#a7b5b1` | same |
| **gold** | bg `#c48a16`, text `#172c27` (4.90:1), `shadow-xs` | bg `#d3a32c` (6.34:1) — **lighter, not darker**, `shadow-sm` | bg `#c48a16`, `translateY(1px)`, `inset 0 2px 4px #00000026` | ring `#075344` (gold ring on gold fill would vanish) | bg `#f0d68a`, text `#74520f` | same |
| **ghost** | transparent, text `#075344` | bg `#eef4f2` | bg `#d6e4e0` | ring `#a97612` | text `#a7b5b1` | n/a |
| **link** | text `#8a6013` (5.49:1), `text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; text-decoration-color: #c48a16` | text `#075344`, decoration `#075344` | text `#043b32` | ring `#a97612` | text `#a7b5b1`, no underline | n/a |
| **on-dark** (inside `[data-surface="dark"]`) | bg `#fff`, text `#043b32` (12.52:1) | bg `#f7f0e5` | bg `#e2e8e5` | ring `#e3bd52` | bg `#ffffff29`, text `#ffffff80` | same |

Transitions: `background-color, border-color, color, box-shadow var(--duration-fast) var(--ease-out-quart)`; `transform var(--duration-instant) var(--ease-out-quart)`. Never transition `all` (the reference does — it animates layout properties for free jank).

**Loading state detail (matters for the contact form):** the button must not resize. Reserve the label's width with `min-width` captured on first render, or render the label at `opacity:0; visibility:hidden` beneath an absolutely-positioned spinner. The accessible announcement is a separate visually-hidden `role="status"` region, not the button label — swapping a button's accessible name mid-press confuses screen readers.

**Full-width on mobile:** below `sm` (640px), buttons inside `.hero-actions` and the form submit go `width: 100%` — the reference gets this right; keep it. Stack with `gap: 12px`.

### 5.2 Cards

| Card | Background | Border | Radius | Shadow rest | Hover | Padding |
|---|---|---|---|---|---|---|
| **service card** (clickable) | `#ffffff` | 1px `#dfe7e1` | `--radius-lg` 14px | `shadow-xs` | `translateY(-4px)`, `shadow-lg`, border `#cdd9d5` | 32px (24px < md) |
| **service card, gold-bounded** (opens modal) | `#ffffff` | 1px `#a97612` (3.97:1 — perceivable) | 14px | `shadow-xs` | same + border `#8a6013` | 32px |
| **feature card** (Büroservice / Reinigung) | `#f7f0e5` / `#e8f0e9` | none | `--radius-2xl` 20px | none | `shadow-md` on the whole card | 42px copy side (28px < md) |
| **why card** | `#ffffffa8` over cream | `border-block-start: 3px solid #c48a16` (decorative) | 0 top, `--radius-lg` bottom | none | bg → `#ffffffd6` | 34px 28px |
| **elevated / form card** | `#ffffff` | none | `--radius-xl` 18px | `shadow-md` | — | 34px (22px < sm) |
| **cleaning panel** (dark) | `#075344`, `data-surface="dark"` | none | `--radius-xl` 18px | none | — | 48px (30px 22px < sm) |
| **info strip** | `#ffffff` | rows: `border-block-end: 1px #e2e8e5` | 0 | none | — | 72px `--spacing-gutter` |

**Hard rule for clickable cards:** the entire card is a real `<a>` or `<button>`, never a `div` with `onClick`. Use the stretched-link pattern so nested text stays selectable:

```css
.card-link::after { content: ""; position: absolute; inset: 0; border-radius: inherit; }
.card { position: relative; }
.card:has(.card-link:focus-visible) {
  outline: 3px solid var(--color-focus); outline-offset: 2px;
}
```
Focus lands on the card, not an invisible sliver. Per §2.5, the `#dfe7e1` border is **1.42:1** and is not the affordance — the "Details →" label (`accent-text #8a6013`, `body-sm`, 600, with a `→` that translates 3px on hover) is.

Card transitions: `transform, box-shadow, border-color var(--duration-base) var(--ease-out-quart)`.

### 5.3 Inputs

| Property | Value |
|---|---|
| Height | 48px (`sm` 44px; never below 44 — touch target) |
| Font size | **16px minimum** — below 16px iOS Safari zooms the viewport on focus. The reference inherits Arial at browser default so it escapes this; with our tokens it must be explicit. |
| Background | `#fbfcfa` rest → `#ffffff` focus |
| Border | 1px `#cdd9d5` rest → 1.5px `#a97612` focus → 2px `#b3261e` error |
| Radius | `--radius-sm` 8px |
| Padding | `13px 14px` (`padding-inline-start` +40px when there's a leading icon) |
| Placeholder | `#5a6b66` (5.47:1 on `#fbfcfa`) — and never the only label |
| Label | `text-label` 13px/600, `#3f524d`, 8px above the field, always visible |
| Help text | `caption` 12px, `#5a6b66`, 6px below |
| Textarea | `min-height: 140px`, `resize: vertical`, `field-sizing: content` where supported |
| Select | native `<select>` + custom chevron via `background-image` SVG data-URI; `appearance: none`. RTL: chevron moves to `inset-inline-start` — set the SVG position with `background-position: right 14px center` under `[dir=ltr]` and `left 14px center` under `[dir=rtl]` |

**States**

| State | Treatment |
|---|---|
| rest | as above |
| hover | border `#a7b5b1` |
| focus-visible | bg `#ffffff`, border 1.5px `#a97612`, `outline: 3px solid #a97612; outline-offset: 1px` |
| filled | no change (avoid "filled" styling — it fights autofill) |
| error | border 2px `#b3261e` (6.54:1), bg `#fef7f6`, message `#8c1d18` (8.97:1) 13px with a 16px `!` icon, `aria-invalid="true"`, `aria-describedby="<id>-err"`, message in `role="alert"` |
| success | border `#05502f`, 16px check icon `inset-inline-end: 14px` |
| disabled | bg `#f5f7f3`, border `#e2e8e5`, text `#a7b5b1`, `cursor: not-allowed` |
| autofill | `input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #fbfcfa inset; -webkit-text-fill-color: #19312c; }` — otherwise Chrome paints it pale blue and destroys the palette |

**Notice / callout** (the reference's `.detail-notice` — this is where the RDG/StBerG hedging lives, so it must be visually distinct and legible): bg `#f7f0e5`, `border-inline-start: 3px solid #a97612`, padding `14px 16px`, radius `0 8px 8px 0` **via logical props** (`border-start-end-radius` / `border-end-end-radius`), text `caption`+1 = 13px `#5a6b66` (4.97:1 on cream). Icon: 16px info glyph in `#8a6013`.

### 5.4 Language switcher

The reference ships a single unlabelled pill that toggles. That's wrong for this audience — it gives no indication of current state, it's 40px tall, and its `#07534440` border is ~1.3:1.

**Ship a segmented control.**

```
┌──────────────────────┐
│ ┃ Deutsch ┃ العربية  │      44px tall, pill, always both options visible
└──────────────────────┘
```

| Part | Spec |
|---|---|
| Container | `role="group"`, localised `aria-label`; bg `#ffffff`; 1px `#cdd9d5`; `--radius-pill`; `padding: 3px`; `height: 44px`; `display: flex; gap: 2px` |
| Option | Real `<a href="/de/…">` / `<a href="/ar/…">` — **not buttons**. URL-first locale so it's shareable, bookmarkable and indexable, with `hreflang` |
| Option geometry | `padding: 8px 14px`, `--radius-pill`, `min-width: 44px`, `text-label` 13px/600 |
| Selected | bg `#075344`, text `#ffffff` (9.01:1), `aria-current="page"` |
| Unselected | text `#3f524d` (8.32:1 on white), hover bg `#eef4f2`, active bg `#d6e4e0` |
| Focus | standard ring, `outline-offset: 1px` (inside the pill) |
| Transition | `background-color, color var(--duration-fast) var(--ease-out-quart)` |
| Compact (< `xs` 420px) | two-letter: `DE` / `ع`, 40px wide each, still 44px tall |

**Three non-obvious requirements:**
1. Each label is written in **its own language and script**, with the matching `lang` attribute so the correct font applies: `<a lang="de" hreflang="de">Deutsch</a>` and `<a lang="ar" hreflang="ar">العربية</a>`. Never render "Arabic" in German or "الألمانية" in Arabic — a user who only reads Arabic must be able to find their language.
2. It stays **visible in the mobile header**, never buried inside the hamburger. For a majority-Arabic-speaking audience this is a primary navigation affordance, not a settings toggle.
3. Switching sets `<html lang dir>`, persists to `localStorage`, and lazy-loads the Arabic fonts. Server-side redirect logic (Accept-Language) is the backend dev's seam — document it, don't build it.

### 5.5 Badges and eyebrows

**Eyebrow** (section kicker — `LEISTUNGEN`, `WARUM WIR`):

| | German | Arabic |
|---|---|---|
| Size / LH | 12px / 1.2 | 13px / 1.5 |
| Weight | 700 | 700 |
| Tracking | 0.16em | **0** |
| Casing | `uppercase` | **none** |
| Colour (light) | `#8a6013` (4.93:1 on cream, 5.49 on page bg) | same |
| Colour (on dark) | `#e3bd52` (6.95:1 on deep) | same |
| Optional rule | `::before` 24×2px `#c48a16`, `--radius-pill`, `margin-inline-end: 10px` — purely decorative | same, mirrors via `margin-inline-end` |
| Bottom margin | 14px | 14px |

**Badge / chip:**

| Variant | bg | text | border | Ratio |
|---|---|---|---|---|
| neutral | `#eef4f2` | `#05493c` | 1px `#d6e4e0` | 9.29:1 |
| accent | `#fdf6e3` | `#74520f` | 1px `#f0d68a` | 6.59:1 |
| on-dark | `#ffffff1f` | `#ffffff` | 1px `#ffffff33` | ≥10:1 |

Geometry: height 24px, `--radius-pill`, `padding-inline: 10px`, 12px/600, Arabic 13px/600 tracking 0.

### 5.6 Section headers

Fixed structure, one component: `eyebrow → h2 → lead paragraph`.

| Element | Spec |
|---|---|
| Wrapper | `max-width: var(--container-prose)` (44rem DE / 40rem AR); centred variant `margin-inline: auto; text-align: center`; start variant `text-align: start; margin-inline: 0` — **`start`, never `left`**, so RTL mirrors free |
| Eyebrow → h2 | 14px gap |
| h2 → lead | 16px gap |
| Block → content | `var(--spacing-block)` (32→48px) |
| h2 | `display-lg`, `--color-text-heading`, `text-wrap: balance` |
| lead | `text-lead`, `--color-text-muted` |
| Optional hairline | 40×3px `#c48a16`, `--radius-pill`, 20px above the eyebrow (centred variant only) |

### 5.7 Modal / sheet

**Use the native `<dialog>` element with `showModal()`.** This buys us focus trapping, `Esc` to close, background `inert`, and `::backdrop` for zero bytes and zero dependencies. At $700 this beats installing Radix — and there is nothing else on this site that needs a headless primitive library.

| Breakpoint | Form |
|---|---|
| ≥ `md` (768px) | Centred dialog. `max-width: 66rem` (1056px, close to the reference's 1060), `max-height: min(92dvh, 900px)`, `--radius-3xl` 22px, `shadow-modal`, bg `#fffdf9` |
| < `md` | Bottom sheet. `margin-block-start: auto`, `width: 100%`, `border-radius: 22px 22px 0 0`, `max-height: 92dvh`, `padding-block-end: env(safe-area-inset-bottom)`, drag handle 36×4px `#cdd9d5` `--radius-pill` centred 12px from top |

| Detail | Spec |
|---|---|
| Backdrop | `#03231db8` + `backdrop-filter: blur(6px)`; fades `--duration-base` |
| Enter (desktop) | `opacity 0→1`, `scale(0.97)→1`, `translateY(8px)→0`, `--duration-slow` `--ease-out-expo` |
| Enter (sheet) | `translateY(100%)→0`, `--duration-slow` `--ease-out-expo` |
| Exit | `--duration-base` `--ease-in-out-quad` |
| Close button | **44×44** (the reference's 42 is under target), circle, bg `#ffffff`, `shadow-sm`, 20px stroke-2 icon in `#043b32`, positioned `inset-block-start: 16px; inset-inline-end: 16px` — mirrors automatically, unlike the reference's hardcoded `right`/`left` pair |
| Labelling | `aria-labelledby` → the modal's `h2` id |
| Scroll | `overscroll-behavior: contain` on the dialog; body gets `overflow: hidden` + scrollbar-width compensation |
| Focus return | to the invoking card. `<dialog>` does this natively; verify it in QA |
| Content grid | `.82fr 1.18fr` ≥ `lg`, single column below; media pane `#eef2ee`, copy pane 54px 48px (36px 28px `md`, 30px 22px `sm`) |

Animation with `@starting-style` and `transition-behavior: allow-discrete`:

```css
dialog[open] { opacity: 1; transform: none; }
dialog {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
  transition:
    opacity var(--duration-slow) var(--ease-out-expo),
    transform var(--duration-slow) var(--ease-out-expo),
    overlay var(--duration-slow) allow-discrete,
    display var(--duration-slow) allow-discrete;
}
@starting-style {
  dialog[open] { opacity: 0; transform: translateY(8px) scale(0.97); }
}
dialog::backdrop {
  background: #03231db8;
  backdrop-filter: blur(6px);
  transition: opacity var(--duration-base), display var(--duration-base) allow-discrete;
}
```
`@starting-style` and `allow-discrete` are supported in current Chrome, Safari 17.4+ and Firefox 129+. Older browsers get an instant open with no animation — a clean, acceptable degradation that costs nothing to support.

### 5.8 Mobile navigation — fixing the reference's real bug

The reference does `@media (width <= 980px) { .site-header nav { display: none } }` with **no replacement**. Below 980px the site has no navigation at all.

**Our fix — full-screen overlay panel.** I chose this over a side drawer deliberately: a drawer needs `inset-inline-start/end`, mirrored slide direction, mirrored corner radii and mirrored shadow — four RTL variables. A full-screen `inset: 0` panel has zero directional geometry and works identically in DE and AR. At $700 that saved complexity is worth more than the drawer's marginal elegance.

| Part | Spec |
|---|---|
| Trigger | 44×44 button, three 20×2px bars, 6px gaps, `#043b32`; `aria-expanded`, `aria-controls`, localised `aria-label` |
| Breakpoint | shown below `lg` (1024px); desktop nav shown at `lg`+ |
| Panel | `position: fixed; inset: 0; z-index: 60`, bg `#fffdf9`, `padding: var(--spacing-gutter)`, `padding-block-start: 88px` (clears the header) |
| Links | stacked, 56px row height, `title` 20px/600, `border-block-end: 1px #e2e8e5`, `text-align: start` |
| Footer of panel | primary "Kontakt" button (full width) + phone row + WhatsApp row |
| Enter | `opacity 0→1` + `translateY(-8px)`, `--duration-base` `--ease-out-quart`; links stagger 40ms |
| Behaviour | `Esc` closes; focus moves to the close button on open and returns to the trigger on close; `inert` on `<main>` and `<footer>` while open; body scroll locked |
| Language switcher | **stays in the header**, outside the panel |

The bar animates to an X on open: bar 1 `translateY(6px) rotate(45deg)`, bar 2 `opacity: 0`, bar 3 `translateY(-6px) rotate(-45deg)`, `--duration-fast` `--ease-out-quart`. Under reduced motion, it swaps instantly.

### 5.9 WhatsApp FAB

**The colour problem.** WhatsApp's primary brand green `#25d366` has L = 0.4794. A white glyph on it is:
`1.05 / 0.5294 = 1.98:1` — a **hard failure** of WCAG 1.4.11 (non-text contrast, 3:1). The icon is functionally invisible to low-vision users. This is a widespread bug that almost every site with a WhatsApp FAB ships, and it's worth telling the client we caught it.

**Ship `#128c7e`** — WhatsApp's own darker secondary brand green, so it is still legitimately WhatsApp-branded. L = 0.2039, white glyph = `1.05 / 0.2539 = **4.14:1**` ✓ (clears 3:1 comfortably and nearly clears AA text). It also sits closer to our `#075344` brand green, so it reads as part of the palette rather than a foreign object.

If the client insists on `#25d366`, the fallback is a 1.5px `#0b4a2f` outline on the glyph plus a `#ffffff` 2px ring on the circle. Flag it, don't decide it unilaterally — but ship `#128c7e` by default.

| Property | Value |
|---|---|
| Size | 56×56 (up from the reference's 55; ≥44 touch, and 56 is the Material FAB standard) |
| Shape | `--radius-pill`, `display: grid; place-items: center` |
| Fill | `#128c7e`; 2px `#ffffff` ring for separation from any background |
| Glyph | 28px WhatsApp mark, `#ffffff` (4.14:1) |
| Shadow | `--shadow-fab` |
| Position | `position: fixed; inset-block-end: max(1.375rem, env(safe-area-inset-bottom) + 0.75rem); inset-inline-end: 1.375rem` — **logical**, so it moves to the bottom-left in Arabic automatically. The reference hardcodes `right: 22px` then overrides with `.rtl { left: 22px; right: auto }`; logical props make that override unnecessary. |
| z-index | 40 (below header 50, below drawer 60, below modal 100) |
| Accessible name | localised `aria-label` — "Über WhatsApp schreiben" / "تواصل عبر واتساب". An icon-only link with no name is a WCAG 2.4.4 failure. |
| Link | `target="_blank" rel="noopener noreferrer"`, plus a visually-hidden "(öffnet WhatsApp)" for 3.2.5 |
| Hover | `scale(1.06)`, shadow intensifies, `--duration-fast` `--ease-out-quart` |
| Active | `scale(0.96)`, `--duration-instant` |
| Focus | ring `#a97612`, `outline-offset: 3px` |
| Entrance | appears after 600px of scroll; `--animate-fab-in` (`scale(0.8)→1` + fade, `--duration-base` `--ease-spring`) |
| Optional | label expands on desktop hover ("WhatsApp", `padding-inline-end: 20px`, width transition). ~10 lines. Include if time permits; drop first if squeezed. |

**Collision check:** the FAB must not sit over the footer's Impressum/Datenschutz links (legally required, must stay clickable). Add `scroll-margin` awareness or simply hide the FAB when the footer is ≥60% in view via the same IntersectionObserver already in use.

---

## 6. SPACING & LAYOUT SCALE

### 6.1 Containers

| Token | Width | Use |
|---|---|---|
| `--container-prose` | 44rem / 704px (AR: 40rem) | section-heading copy, notice text |
| `--container-content` | 68rem / 1088px | service grid, why grid, contact grid, info strip |
| `--container-wide` | 77.5rem / 1240px | service split (matches the reference exactly) |
| `--container-max` | 90rem / 1440px | header inner, hero, footer |

Gutter: `--spacing-gutter: clamp(1.25rem, 0.5rem + 4.5vw, 5.5rem)` → **20px @ 375, 42px @ 768, 65px @ 1280, 88px @ 1920**. The reference's `clamp(24px, 7vw, 110px)` is slightly more generous at the top end; ours reaches its max on very wide screens rather than never, which is the more useful behaviour.

### 6.2 Section rhythm

| Token | Value | Resolves to |
|---|---|---|
| `--spacing-section` | `clamp(4.5rem, 3rem + 6vw, 7rem)` | 72px @ 375 → 112px @ ≥1217 |
| `--spacing-section-lg` | `clamp(5.5rem, 3.5rem + 8vw, 8.5rem)` | 88 → 136 (hero, contact) |
| `--spacing-block` | `clamp(2rem, 1.5rem + 2vw, 3rem)` | 32 → 48 (heading block → content) |

This tracks the reference's 110/75px rhythm while behaving properly on the tablet sizes it skips entirely.

### 6.3 Grid gaps

Four values only. More than four and consistency collapses.

| Gap | Value | Use |
|---|---|---|
| `gap-3` | 12px | button rows, chip rows, trust row |
| `gap-4` | 16px | service grid (matches reference), tight lists |
| `gap-5` | 20px | why grid (reference: 18) |
| `gap-6` | 24px | service split (matches reference), form fields |
| `gap-8` / `gap-10` | 32 / 40px | contact two-column, cleaning panel |

### 6.4 Breakpoints

Keep the Tailwind v4 defaults. Inventing custom breakpoints on a $700 job costs the handoff developer time for no benefit.

| Name | Width | What changes |
|---|---|---|
| *(base)* | 0 | everything single column; buttons full-width; hero copy-first |
| `xs` | 420px | trust row goes two-up; lang switcher gains full labels |
| `sm` | 640px | service/why grids → 2 columns; buttons auto-width; form stays 1 col |
| `md` | 768px | form → 2 columns; feature card → image+copy split; modal → centred dialog; info strip → 2 columns |
| `lg` | **1024px** | **desktop nav appears / hamburger disappears**; service grid → 3 columns; hero → split; contact → `.8fr 1.2fr`; modal → `.82fr 1.18fr` |
| `xl` | 1280px | why grid → 4 columns; gutters reach comfortable width |
| `2xl` | 1536px | containers cap; no further changes |

The reference has only 980 and 640 — a 340px dead zone where a tablet gets the desktop grid at phone widths, and nothing at all between 640 and 980 for the nav. `lg: 1024` is the standard iPad-landscape boundary and is where the four-item nav plus logo plus lang switcher genuinely stops fitting.

### 6.5 Hero layout — one deliberate deviation

The reference sets `.hero-image { order: -1 }` below 980px, putting a decorative photo **above** the h1 on mobile. Two problems: it makes a large image the LCP element, and it pushes the value proposition below the fold for a visitor who arrived from a WhatsApp link on a 375px phone.

**Ship copy-first on mobile:** eyebrow → h1 → lead → CTAs → trust row → *then* the image. The image is still there, still large, but the person who needs to know "these people help with Einbürgerung paperwork in Arabic" learns it in the first 200px. At `lg`+ we restore the reference's `1.03fr .97fr` side-by-side split, which is genuinely good and is the "split app concept" motif the developer described.

Hero min-height: `min(44rem, calc(100dvh - 5.5rem))` at `lg`+, `auto` below. The reference's flat `min-height: 720px` produces a hero taller than the viewport on every phone made. Use `dvh`, not `vh`, so mobile browser chrome doesn't cause a jump.

### 6.6 z-index scale

| Layer | z | Contents |
|---|---|---|
| base | 0 | page |
| raised | 10 | sticky in-page elements |
| dropdown | 20 | select menus |
| fab | 40 | WhatsApp FAB |
| header | 50 | sticky header |
| drawer | 60 | mobile nav overlay |
| modal | 100 | `<dialog>` + `::backdrop` (top layer — z-index is belt-and-braces) |
| toast | 110 | form success/error toast, if used |

### 6.7 Header

| Property | Value |
|---|---|
| Height | 72px below `lg`, 88px at `lg`+ (reference: 74/88) |
| Position | `sticky; top: 0; z-index: 50` |
| Background | `color-mix(in oklab, #fffdf9 94%, transparent)` + `backdrop-filter: blur(14px) saturate(1.08)`; `@supports not (backdrop-filter: blur(1px)) { background: #fffdf9 }` |
| Border | `border-block-end: 1px solid #07534414` at rest |
| Scrolled (`scrollY > 8`) | adds `--shadow-header`, border → `#0753441f`, `--duration-base` transition |
| Padding | `10px var(--spacing-gutter)` |
| Logo | 168×68 at `lg`+, 124×58 below (matches reference); `<img>` with explicit `width`/`height` to reserve space |
| Skip link | first focusable element; visually hidden until `:focus-visible`, then `position: fixed; inset-block-start: 12px; inset-inline-start: 12px`, bg `#075344`, text `#ffffff`, `--radius-md`, 12px 20px, z-index 200 |
| `scroll-padding-block-start` | 6.5rem on `html` so hash anchors don't land under the sticky header |

---

## 7. MOTION SYSTEM

The reference has `transition: all .2s` on one selector. That's the whole motion design. A restrained, consistent motion layer is the cheapest available way to make our version feel more expensive than the reference — perhaps three hours of work total.

### 7.1 Easings — four, each with a job

| Token | Curve | Job |
|---|---|---|
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | **The default.** Every hover, colour change, border change, small transform. If you're unsure, use this. |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances: scroll reveals, modal open, sheet slide-up. Very fast start, long settle — reads as "arriving". |
| `--ease-in-out-quad` | `cubic-bezier(0.45, 0, 0.55, 1)` | Reversible/symmetric motion: modal close, accordion, hamburger→X. |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Overshoot. **Two uses only:** the FAB entrance and the form success checkmark. Any more and the site reads as playful, which is wrong for a business handling immigration paperwork. |

### 7.2 Durations — five

| Token | ms | Use |
|---|---|---|
| `--duration-instant` | 90 | `transform` on press, hamburger bars |
| `--duration-fast` | 160 | button/link/input hover and focus, nav links, FAB hover |
| `--duration-base` | 240 | card lift, header shadow, backdrop fade, drawer, badge |
| `--duration-slow` | 380 | modal open, sheet slide, accordion |
| `--duration-slower` | 620 | scroll reveal |

**Rule: never transition `all`.** Always enumerate. `transition: all` on a card animates `width`, `height` and `top` during layout recalcs and is the single largest source of scroll jank on sites like this.

### 7.3 The five motions we actually ship

1. **Card hover lift** — `translateY(-4px)` + `shadow-xs → shadow-lg` + border darken, `--duration-base --ease-out-quart`. This is the reference's one good move; keep it, just remove `all`.
2. **Scroll reveal** — `opacity: 0 → 1` + `translateY(12px) → 0`, `--duration-slower --ease-out-expo`, 60ms stagger within a group. One shared `IntersectionObserver` (`threshold: 0.15`, `rootMargin: "0px 0px -12% 0px"`), `unobserve` after firing. Applied to: section headings, card grids, the cleaning panel, the info strip. **Not** the hero (it must be instant for LCP).
3. **Header condense** — border and shadow fade in past 8px of scroll, `--duration-base`.
4. **Gold underline draw on nav links** — `::after` 2px `#c48a16`, `transform: scaleX(0) → scaleX(1)` with `transform-origin: inset-inline-start`, `--duration-fast --ease-out-quart`. Under 10 lines, disproportionately effective, and it mirrors correctly in RTL because the origin is logical.
5. **Arrow nudge** — `→` inside "Details" / "Mehr erfahren" translates 3px on `--fade-angle`-aware axis on hover. In RTL the glyph should be `←` and translate the other way: `[dir="rtl"] .arrow { --nudge: -3px }`.

### 7.4 The reduced-motion policy

Two parts. Both are required.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

And — the part most implementations get wrong — **content must be visible by default.** Reveal elements are *not* authored at `opacity: 0` in CSS. They start visible; JavaScript adds the `data-reveal` hook only after confirming motion is allowed:

```ts
const allowsMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (allowsMotion) el.dataset.reveal = "pending";   // CSS hides it, observer reveals it
```

This guarantees that a reduced-motion user, a no-JS user, and a crawler all see the full page. A site where `opacity: 0` is the CSS default and JS is the only thing that reveals it is a blank page for anyone whose JS fails — and for a brochure site whose entire purpose is being read, that's an unacceptable risk.

Also under reduced motion: `scroll-behavior: smooth` off (already covered), FAB appears with no scale, hamburger swaps without rotation, modal opens without transform (fade only — a 0.01ms fade is effectively instant and avoids the discrete-property edge cases).

---

## 8. DARK MODE: NO

**Decision: do not build dark mode. Build the token layer dark-ready. Quote it as a paid add-on.**

**Why not, at $700:**

1. **It's not one theme, it's a second brand decision.** The identity is warm cream + deep green + gold. There is no obvious dark analogue for cream — it is load-bearing, not incidental. Answering "what is cream in the dark?" is a brand question the client hasn't been asked and hasn't paid for. Guessing at it produces a dark mode that looks like a different company.
2. **The contrast audit doubles.** Every pair in §2 would need recomputing against dark surfaces, and the gold problem *inverts* — `#8a6013` at L 0.1382 on `#032e27` is 1.5:1, unusable, so a whole second set of gold decisions is required. That's the most expensive part of this spec, done twice.
3. **Images and the fade motif break.** The signature `linear-gradient(90deg, cream, transparent 22%)` edge fade is the one visual motif carried from the reference. In dark mode it needs a different colour, a different stop and probably different photography treatment.
4. **The audience doesn't need it.** This is a brochure site visited once or twice, typically from a WhatsApp or Google link, on a phone, during business hours. Dark mode serves habitual-return, long-dwell products. This is neither.
5. **Opportunity cost.** Realistically 6–10 hours including QA across both locales. On this budget that's roughly 15% of the engagement, and it competes directly with things that have no substitute: RTL correctness, the mobile nav that currently doesn't exist, and the full state matrix on the one form that constitutes the entire functional requirement.

**What we do instead (costs ~0 extra):**

- All semantic colours are already indirected through `@theme inline` → runtime custom properties (§3). Adding dark mode later is **one `@layer base` block**, not a refactor.
- The `[data-surface="dark"]` scope already exists and is already contrast-verified, because the contact section and cleaning panel are dark. That is genuinely most of a dark palette, discovered for free.
- Declare `color-scheme: light` on `:root` so browsers don't force-darken native form controls, `<select>` dropdowns or scrollbars — which they will otherwise do on a user with OS dark mode, producing a half-broken form.
- Ship `<meta name="theme-color" content="#fffdf9">` and a `(prefers-color-scheme: dark)` variant pointing at `#043b32`, so the mobile browser chrome at least harmonises.

**Quote for later:** the dark-mode add-on is a token block, a contrast re-audit, an image-treatment pass and bilingual QA. Price it separately; do not absorb it.

---

## 9. HANDOFF NOTES

**Install:**
```bash
npm i tailwindcss@^4.1 @tailwindcss/vite@^4.1
npm i clsx@^2 tailwind-merge@^3 class-variance-authority@^0.7
npm i @fontsource/ibm-plex-sans@^5 @fontsource/ibm-plex-serif@^5 @fontsource/ibm-plex-sans-arabic@^5
```
`class-variance-authority` earns its ~2KB here: the button has 6 variants × 3 sizes × 6 states, and a `cva` definition is the clearest possible artefact to hand a developer who didn't write the frontend.

**Explicitly NOT installed:** any UI kit, any animation library (`motion`/`framer-motion`), `@tailwindcss/typography`, `tailwindcss-rtl` or `tailwindcss-logical`. Tailwind v4 ships logical properties natively (`ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`, `border-s-*`, `rounded-s-*`, `text-start`) and `rtl:`/`ltr:` variants keyed off `dir`. Nothing here needs a plugin.

**Files:**
- `src/styles/theme.css` — §3 verbatim, the single source of truth
- `src/styles/fonts.css` — `@font-face` fallback metric overrides
- `src/lib/cn.ts` — `clsx` + `tailwind-merge`
- `docs/DESIGN-TOKENS.md` — the §1.3 semantic table plus the gold rule from §2.3, for the backend developer

**Six rules to enforce in code review:**
1. No component file references a primitive colour (`brand-gold-500`) — only semantics (`accent`, `accent-text`).
2. No `left`/`right`/`margin-left`/`text-align: left` anywhere. Logical properties only.
3. No `transition: all`.
4. No gold text that isn't `accent-text` / `accent-text-strong`.
5. No `<div onClick>`. Interactive = `<a>` or `<button>`.
6. Every input has a visible `<label>`; placeholders are never labels.

---

## OPEN QUESTIONS

These are design-system decisions I cannot make without the client. Each blocks a specific token or component.

1. **Two-tone gold approval.** We ship brand gold `#c48a16` for fills and a darker `#8a6013` for gold text. Side by side these read as one family, but the client asked us to "match the colours" and will see two golds. Show them a comparison before build. *(If rejected, the only alternative is removing gold text entirely — eyebrows and detail links go green — which is a bigger visual departure.)*

2. **Logo source files.** Do we have SVG with the gold script "Alles aus einer Hand" as outlined paths, or does it need to be set live? If live, we need that script typeface and its licence. Blocks the header, footer and favicon.

3. **Arabic logo lockup.** Does an Arabic variant exist? If not, does the client want the Latin lockup in the AR locale (common and acceptable) or a transliterated one commissioned? Blocks the RTL header layout.

4. **Numerals in Arabic.** Western `0–9` (my recommendation, §4.3) or Eastern `٠–٩`? Blocks the type spec and the info strip.

5. **Typeface approval.** IBM Plex, or the warmer Readex Pro alternative? Both are free and both are one-token swaps *before* build, not after. Also: does the client already have a brand typeface from print/signage we should match?

6. **`#f4ecdf` footer.** Keep the deeper cream as a distinct footer surface, or collapse to `#f7f0e5` for one fewer token? Purely aesthetic; `#8a6013` passes on both (4.76 and 4.93), so this is a taste call, not a constraint.

7. **WhatsApp FAB colour.** We ship `#128c7e` because `#25d366` with a white glyph is 1.98:1 and fails accessibility. If the client's marketing insists on the exact brand green, we need sign-off on the outlined-glyph workaround instead.

8. **Photography aspect ratios and licence.** The cream edge-fade motif needs images with usable dead space on the fade side. If we're buying stock, that constrains selection — and the licence cost is not in the $700.

9. **Dark mode confirmed out of scope?** Get this in writing. It's the most likely "can you just also…" request after delivery.

10. **Favicon, `theme-color`, OG image.** Not in the reference at all. Needed for the WhatsApp link previews this audience will actually share. Cheap to produce, but needs the logo files from (2).