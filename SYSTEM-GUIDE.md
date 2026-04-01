# RenewBuild Painting Estimator — System Guide
## Complete Documentation & Recovery Instructions

**Version:** 1.6
**Created:** March 2026
**Owner:** Ramon Medina — RenewBuild LLC
**Live URL:** https://always202.github.io/renewbuild-estimator/estimator.html
**GitHub Repo:** https://github.com/ALWAYS202/renewbuild-estimator

---

## 1. WHAT THIS SYSTEM IS

A production rate-based estimating tool for RenewBuild LLC that calculates accurate quotes for:
- **Interior Painting** — walls, ceiling, trim, doors, windows (per room)
- **Exterior Painting** — siding, prep, primer, trim, doors (per side of house)
- **Cabinet Painting** — per-piece pricing with sub-contractor model

The system runs as a **single HTML file** — no server, no database, no installation needed. Open in any browser and it works.

---

## 2. HOW IT WAS BUILT

### Architecture
- **1 file:** `estimator.html` contains ALL HTML + CSS + JavaScript
- **Hosted on:** GitHub Pages (free, auto-deploys on push)
- **Data saves to:** Google Sheets via Apps Script API
- **No dependencies:** no React, no Node, no build tools

### Design Philosophy
- **Production Rate Based:** Every estimate is calculated from SF/HR rates, not guesses
- **Calibrated with Real Jobs:** Rates were validated against completed RenewBuild jobs
- **Honest Time = Honest Price:** The system calculates real labor hours, then applies margin
- **Itemized by Phase:** Each phase (prep, prime, paint) is priced separately to prevent losses

### Build Timeline
- **v1.0-1.4:** Interior module (rooms, walls, ceiling, trim, doors, windows, closets)
- **v1.5:** Exterior module (siding, prep levels, application methods, height factors)
- **v1.6:** Cabinet module (sub-contracted model, tiered per-piece pricing)

---

## 3. HOW EACH MODULE WORKS

### Interior Module
**Input:** Add rooms with dimensions (L x W x H), select surfaces, choose paint, set coats
**Calculation:**
1. SF = perimeter x height - (doors x 21 SF) per PDCA rules
2. Hours = SF / production rate (walls 337 SF/HR 1st coat, 375 add)
3. Gallons = coat-SF / coverage (400 SF/gal) + 10% waste
4. Labor cost = hours x $30/hr x complexity factor
5. Materials = gallons x SW PRO+ price
6. Price = (labor + materials) / (1 - margin%)

**Key Rates (PCA Standard):**
| Surface | 1st Coat | Additional |
|---------|----------|------------|
| Walls (roll) | 337 SF/HR | 375 SF/HR |
| Ceiling (roll) | 325 SF/HR | 375 SF/HR |
| Trim (brush) | 75 SF/HR | 100 SF/HR |
| Door (flush, 2-sided) | 34 SF @ 150 SF/HR | — |

**Complexity Factors:**
- Simple (condos, 8ft, no ladders): 1.75x
- Medium: 2.25x
- High/Stairs: 4.0x (calibrated with King Leong job = 64 real hours)

### Exterior Module
**Input:** Add house sides (W x H), set prep level, method, coats, paint selection
**Calculation:**
1. Total siding SF from all sides
2. Hours per phase: power wash + prep + mask + primer + paint + trim + doors
3. Height factor multiplier (1-story 1.0x, 2-story 1.3x, 3-story 1.7x)
4. Setup buffer 15%
5. Materials: gallon count from coverage rates
6. Price = (labor + materials + overhead) / (1 - margin%)

**Production Rates (calibrated from Foster St job):**
| Phase | Rate |
|-------|------|
| Power Wash | 400 SF/HR |
| Prep Light | 80 SF/HR |
| Prep Medium | 45 SF/HR |
| Prep Heavy | 25 SF/HR |
| Primer Spot (brush) | 120 SF/HR |
| Primer Full (spray) | 300 SF/HR |
| Siding Spray 1st | 350 SF/HR |
| Siding Spray+Back 1st | 200 SF/HR |
| Siding Brush/Roll 1st | 120 SF/HR |
| Trim Brush 1st | 60 SF/HR |

**Calibration:**
- Foster St (GOOD): 2,407 SF, ~87 hours, billed $9,021, margin 51%
- Nashville Ave (BAD): 3,819 SF, lump sum $5,757, LOST $84 — proved itemized pricing is essential

### Cabinet Module
**Input:** Door/drawer count, prep level, add-ons, paint selection, gallons
**Calculation (sub-contracted):**
1. Sub cost = MAX(minimum, pieces x tier rate) + add-ons
2. Materials = gallons x SW price x (1 + markup%)
3. Price = (sub + materials) / (1 - margin% - overhead%)

**Sub Rates (per piece):**
| Tier | Rate | Condition |
|------|------|-----------|
| Light | $140 | Scuff sand, clean substrate |
| Moderate | $150 | Small repairs, adhesion concerns |
| Heavy | $175 | Chipping, peeling, major patch/fill |

**Add-ons:**
- Two-color kitchen: +$300
- New construction (raw wood): +$500
- Previously painted/refinished: +$800
- Minimum job: $2,000 (editable)

---

## 4. SHERWIN-WILLIAMS PRO+ PRICES (Store #703410, Niles IL)

### Interior
| Product | Price/gal |
|---------|-----------|
| ProMar 200 Zero VOC | $31.95 |
| Cashmere Interior | $38.95 |
| Duration Home | $47.95 |
| Emerald Interior | $56.45 |
| ProMar Ceiling | $25.95 |
| Premium Ceiling | $36.45 |
| ProClassic Enamel (trim) | $49.95 |
| Emerald Urethane Trim | $61.95 |

### Exterior
| Product | Price/gal |
|---------|-----------|
| A-100 Exterior Latex | $34.95 |
| SuperPaint Exterior | $44.95 |
| Resilience Exterior | $49.95 |
| Duration Exterior | $55.95 |
| Emerald Exterior | $65.95 |

### Primers
| Product | Price/gal |
|---------|-----------|
| Extreme Block | $30.95 |
| Multi-Purpose | $38.45 |
| White Shellac | $55.45 |
| Extreme Bond | $61.95 |

---

## 5. GOOGLE SHEETS INTEGRATION

**How it works:**
1. User fills estimate in browser
2. Clicks "Save to Google Sheets"
3. JS sends data via fetch() to Google Apps Script Web App
4. Apps Script writes a new row to the "Estimates" tab

**Sheet ID:** `1KhYTz1VERiKoirx1hSDOk_nmJlY8TKCbIOhiBOqUoJg`
**Apps Script:** `/RenewBuild-Estimator/apps-script/Code.js`

---

## 6. RECOVERY INSTRUCTIONS

### If the live site goes down
1. Go to https://github.com/ALWAYS202/renewbuild-estimator
2. Check if the repo still exists — if yes, GitHub Pages may just need a minute
3. Go to repo Settings > Pages > check it's set to deploy from `main` branch

### If you lose your local files
```bash
git clone https://github.com/ALWAYS202/renewbuild-estimator.git
cd renewbuild-estimator
# Open estimator.html in browser — done
```

### If you need to edit and re-deploy
```bash
cd /Users/ramonmedina/Claude\ Code\ Antigravity/RenewBuild-Estimator/
# Edit estimator.html
git add estimator.html
git commit -m "description of change"
git push origin main
# Live in ~1-2 minutes on GitHub Pages
```

### If GitHub account is lost
- The `estimator.html` file works standalone — just open it in any browser
- Create a new GitHub repo and push the file there
- Or host on any web server (Hostinger, Netlify, Vercel — all free options)

### If you want to move to a different host
The file works ANYWHERE that serves HTML:
- Hostinger (you already have an account)
- Netlify (free, drag & drop)
- Vercel (free)
- Any WordPress site (upload as HTML page)
- Even email it to yourself as backup

---

## 7. FILE INVENTORY

| File | Purpose |
|------|---------|
| `estimator.html` | THE estimator — all 3 modules |
| `pl-dashboard.html` | P&L dashboard 2025 real numbers |
| `apps-script/Code.js` | Google Sheets save backend |
| `SYSTEM-GUIDE.md` | This file — full documentation |
| `Exterior PaintingCalibrador jobs/` | Real job data used for calibration |
| `C&E Guide Vol. 2 (1).pdf` | PCA production rate reference |
| `sw_images/` | Sherwin-Williams product images |

---

## 8. ROADMAP

### Phase 1 — DONE
- Interior estimator with per-room calculation
- Exterior estimator calibrated with real jobs
- Cabinet estimator with sub-contractor model
- Google Sheets integration
- GitHub Pages hosting

### Phase 2 — NEXT (Q2 2026)
- Test with 10-15 real estimates and calibrate rates
- Custom domain (estimator.renewbuildpainting.com)
- Job tracker: actual cost vs estimate per job
- PDF export with RenewBuild logo

### Phase 3 — FUTURE (Q3-Q4 2026)
- Metal/Iron module (rejas, fire escapes, railings, stairs)
- Client portal: share estimate link with client
- Photo attachment per estimate
- Historical data: which estimates converted to jobs

### Phase 4 — SCALE (2027+)
- Multi-user login (team access)
- Mobile-optimized UI
- CRM integration (DripJobs)
- Potential SaaS for other contractors

---

## 9. KEY BUSINESS RULES

1. **Ramon does NOT paint** — all labor is sub-contracted
2. **Default margin target:** 40%, growing to 50%
3. **Labor rate:** $30/hr per painter (what sub charges)
4. **Itemize ALWAYS** — never lump sum (Nashville lesson)
5. **Prep is what kills you** — always assess prep level honestly
6. **You supply paint** for cabinets, sub supplies for exterior (varies)
7. **Minimum job sizes** prevent losing money on small jobs

---

## 10. CONTACTS & ACCOUNTS

| Service | Account |
|---------|---------|
| GitHub | ALWAYS202 |
| Google Drive | ramon.medina2006@gmail.com |
| Sherwin-Williams PRO+ | Store #703410 Niles IL |
| Hosting (website) | Hostinger |
| CRM | DripJobs |

---

*Last updated: March 31, 2026*
*Built with Claude Code — Anthropic*
