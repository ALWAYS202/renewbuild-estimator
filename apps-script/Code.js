const SPREADSHEET_ID = '1KhYTz1VERiKoirx1hSDOk_nmJlY8TKCbIOhiBOqUoJg';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    setupSheets(ss);
    const sheet = ss.getSheetByName('Estimates');
    sheet.appendRow([
      new Date().toLocaleDateString('en-US'),
      data.client || '',
      data.address || '',
      data.module || 'interior',
      data.roomsOrPieces || 0,
      data.totalSF || 0,
      data.prepLevel || '',
      data.complexity || '',
      data.painters || '',
      data.laborHours || 0,
      data.laborCost || 0,
      data.materialCost || 0,
      data.matMarkup || 0,
      data.suppliesCost || 0,
      data.overhead || 0,
      data.margin || 0,
      data.totalCost || 0,
      data.totalPrice || 0,
      data.profit || 0,
      data.notes || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const action = e && e.parameter && e.parameter.action;

  if (action === 'readSheet') {
    try {
      const sheetId = e.parameter.id;
      const ss = SpreadsheetApp.openById(sheetId);
      const sheets = ss.getSheets();
      const result = {};
      sheets.forEach(sheet => {
        result[sheet.getName()] = sheet.getDataRange().getValues();
      });
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } catch(err) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: err.message }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  if (action === 'setupDashboard') {
    try {
      const msg = setupDashboard2026();
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: msg }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch(err) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: err.message }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput('RenewBuild Estimator API OK');
}

function setupDashboard2026() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const existing = ss.getSheetByName('📊 Dashboard 2026');
  if (existing) ss.deleteSheet(existing);
  const s = ss.insertSheet('📊 Dashboard 2026', 0);

  // Colors
  const DARK    = '#1a1a2e';
  const DARK2   = '#16213e';
  const GOLD    = '#C9A84C';
  const GREEN   = '#27ae60';
  const RED     = '#e74c3c';
  const WHITE   = '#ffffff';
  const LIGHT   = '#f5f5f5';
  const ALT     = '#eef2f7';
  const MUTED   = '#888888';
  const YELLOW  = '#FFFDE7';

  // Column widths
  s.setColumnWidth(1, 16);
  s.setColumnWidth(2, 85);
  s.setColumnWidth(3, 115);
  s.setColumnWidth(4, 105);
  s.setColumnWidth(5, 120);
  s.setColumnWidth(6, 115);
  s.setColumnWidth(7, 110);
  s.setColumnWidth(8, 135);
  s.setColumnWidth(9, 16);

  // Log rows: start=16, end=67 (52 weeks)
  const LS = 16, LE = 67;
  const revYTD    = `SUM(H${LS}:H${LE})`;
  const jobsYTD   = `SUM(G${LS}:G${LE})`;
  const propsYTD  = `SUM(F${LS}:F${LE})`;
  const apptsYTD  = `SUM(E${LS}:E${LE})`;
  const leadsYTD  = `SUM(D${LS}:D${LE})`;
  const wksLeft   = `MAX(1,53-WEEKNUM(TODAY(),2))`;
  const wksElap   = `MAX(1,WEEKNUM(TODAY(),2)-1)`;

  let r = 1;

  // ── ROW 1: HEADER ──────────────────────────────────────────
  s.setRowHeight(r, 54);
  s.getRange(r, 1, 1, 9).setBackground(DARK);
  s.getRange(r, 2, 1, 7).merge()
    .setValue('RENEWBUILD LLC — DASHBOARD 2026')
    .setFontFamily('Arial').setFontSize(18).setFontWeight('bold').setFontColor(GOLD)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  r++;

  // ── ROW 2: SUBTITLE ────────────────────────────────────────
  s.setRowHeight(r, 26);
  s.getRange(r, 1, 1, 9).setBackground(DARK);
  s.getRange(r, 2, 1, 7).merge()
    .setValue('Meta Conservadora $430k → $60k personal     |     Meta Ideal $590k → $100k personal')
    .setFontSize(10).setFontColor('#9999bb')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  r++;

  // ── ROW 3: SPACER ──────────────────────────────────────────
  s.setRowHeight(r, 10);
  s.getRange(r, 1, 1, 9).setBackground(LIGHT);
  r++;

  // ── ROW 4: KPI HEADER ──────────────────────────────────────
  s.setRowHeight(r, 30);
  s.getRange(r, 1, 1, 9).setBackground(DARK2);
  s.getRange(r, 2, 1, 7).merge()
    .setValue('📊   AÑO A LA FECHA (YTD)')
    .setFontSize(11).setFontWeight('bold').setFontColor(GOLD)
    .setVerticalAlignment('middle');
  r++;

  // ── ROW 5: KPI LABELS ──────────────────────────────────────
  s.setRowHeight(r, 22);
  ['Revenue YTD','Jobs Ganados','Close Rate','Set Rate','Pace Anual','vs Meta $60k','vs Meta $100k']
    .forEach((lbl, i) => {
      s.getRange(r, i + 2).setValue(lbl)
        .setFontSize(9).setFontWeight('bold').setFontColor(MUTED)
        .setHorizontalAlignment('center').setBackground(LIGHT);
    });
  s.getRange(r, 1).setBackground(LIGHT);
  s.getRange(r, 9).setBackground(LIGHT);
  r++;

  // ── ROW 6: KPI VALUES ──────────────────────────────────────
  s.setRowHeight(r, 52);

  const kpiCfg = [
    { col: 2, f: `=${revYTD}`,                                                   fmt: '$#,##0',  color: GOLD,  size: 18 },
    { col: 3, f: `=${jobsYTD}`,                                                   fmt: '0',       color: DARK2, size: 18 },
    { col: 4, f: `=IFERROR(${jobsYTD}/${propsYTD},0)`,                           fmt: '0.0%',    color: DARK2, size: 18 },
    { col: 5, f: `=IFERROR(${apptsYTD}/${leadsYTD},0)`,                          fmt: '0.0%',    color: DARK2, size: 18 },
    { col: 6, f: `=IFERROR(${revYTD}/${wksElap}*52,0)`,                          fmt: '$#,##0',  color: DARK2, size: 18 },
    { col: 7, f: `=IFERROR(${revYTD}/430000,0)`,                                 fmt: '0.0%',    color: GREEN, size: 18 },
    { col: 8, f: `=IFERROR(${revYTD}/590000,0)`,                                 fmt: '0.0%',    color: DARK2, size: 18 },
  ];
  kpiCfg.forEach(({ col, f, fmt, color, size }) => {
    s.getRange(r, col).setFormula(f)
      .setFontSize(size).setFontWeight('bold').setFontColor(color)
      .setHorizontalAlignment('center').setVerticalAlignment('middle')
      .setBackground(WHITE).setNumberFormat(fmt);
  });
  s.getRange(r, 1).setBackground(WHITE);
  s.getRange(r, 9).setBackground(WHITE);
  r++;

  // ── ROW 7: SPACER ──────────────────────────────────────────
  s.setRowHeight(r, 10);
  s.getRange(r, 1, 1, 9).setBackground(LIGHT);
  r++;

  // ── ROW 8: ESTA SEMANA HEADER ──────────────────────────────
  s.setRowHeight(r, 30);
  s.getRange(r, 1, 1, 9).setBackground(DARK2);
  s.getRange(r, 2, 1, 7).merge()
    .setValue('🎯   LO QUE NECESITAS ESTA SEMANA')
    .setFontSize(11).setFontWeight('bold').setFontColor(GOLD)
    .setVerticalAlignment('middle');
  r++;

  // ── ROW 9: ESTA SEMANA LABELS ──────────────────────────────
  s.setRowHeight(r, 22);
  ['','Revenue/Semana','Jobs a Cerrar','Proposals','Leads','Semanas Rest.','Revenue Faltante']
    .forEach((lbl, i) => {
      s.getRange(r, i + 2).setValue(lbl)
        .setFontSize(9).setFontWeight('bold').setFontColor(MUTED)
        .setHorizontalAlignment('center').setBackground(LIGHT);
    });
  s.getRange(r, 1).setBackground(LIGHT);
  s.getRange(r, 9).setBackground(LIGHT);
  r++;

  // ── ROWS 10-11: METAS ──────────────────────────────────────
  const metaRows = [
    { label: 'Meta $60k',  labelColor: GREEN, labelBg: '#e8f5e9', target: 430000, valColor: GREEN  },
    { label: 'Meta $100k', labelColor: GOLD,  labelBg: '#fff8e1', target: 590000, valColor: GOLD   },
  ];

  metaRows.forEach(({ label, labelColor, labelBg, target, valColor }) => {
    s.setRowHeight(r, 44);
    const rf = `MAX(0,${target}-${revYTD})`;

    s.getRange(r, 2).setValue(label)
      .setFontSize(10).setFontWeight('bold').setFontColor(labelColor)
      .setHorizontalAlignment('center').setVerticalAlignment('middle')
      .setBackground(labelBg);

    // Revenue/semana
    s.getRange(r, 3).setFormula(`=IFERROR((${rf})/(${wksLeft}),0)`)
      .setFontSize(15).setFontWeight('bold').setFontColor(valColor)
      .setHorizontalAlignment('center').setVerticalAlignment('middle')
      .setBackground(WHITE).setNumberFormat('$#,##0');

    // Jobs/semana
    s.getRange(r, 4).setFormula(`=IFERROR(CEILING(((${rf})/(${wksLeft}))/6686,0.5),0)`)
      .setFontSize(15).setFontWeight('bold').setFontColor(DARK2)
      .setHorizontalAlignment('center').setVerticalAlignment('middle')
      .setBackground(WHITE).setNumberFormat('0.0');

    // Proposals/semana
    s.getRange(r, 5).setFormula(`=IFERROR(CEILING((((${rf})/(${wksLeft}))/6686)/0.304,1),0)`)
      .setFontSize(15).setFontWeight('bold').setFontColor(DARK2)
      .setHorizontalAlignment('center').setVerticalAlignment('middle')
      .setBackground(WHITE).setNumberFormat('0');

    // Leads/semana  (close_rate × set_rate ≈ 9%)
    s.getRange(r, 6).setFormula(`=IFERROR(CEILING((((${rf})/(${wksLeft}))/6686)/0.09,1),0)`)
      .setFontSize(15).setFontWeight('bold').setFontColor(DARK2)
      .setHorizontalAlignment('center').setVerticalAlignment('middle')
      .setBackground(WHITE).setNumberFormat('0');

    // Semanas restantes
    s.getRange(r, 7).setFormula(`=${wksLeft}`)
      .setFontSize(15).setFontWeight('bold').setFontColor(MUTED)
      .setHorizontalAlignment('center').setVerticalAlignment('middle')
      .setBackground(WHITE).setNumberFormat('0');

    // Revenue faltante
    s.getRange(r, 8).setFormula(`=${rf}`)
      .setFontSize(15).setFontWeight('bold').setFontColor(RED)
      .setHorizontalAlignment('center').setVerticalAlignment('middle')
      .setBackground(WHITE).setNumberFormat('$#,##0');

    s.getRange(r, 1).setBackground(WHITE);
    s.getRange(r, 9).setBackground(WHITE);
    r++;
  });

  // ── ROW 12: SPACER ─────────────────────────────────────────
  s.setRowHeight(r, 10);
  s.getRange(r, 1, 1, 9).setBackground(LIGHT);
  r++;

  // ── ROW 13: LOG HEADER ─────────────────────────────────────
  s.setRowHeight(r, 30);
  s.getRange(r, 1, 1, 9).setBackground(DARK2);
  s.getRange(r, 2, 1, 7).merge()
    .setValue('📋   REGISTRO SEMANAL — Llena cada lunes con los números de la semana anterior')
    .setFontSize(11).setFontWeight('bold').setFontColor(GOLD)
    .setVerticalAlignment('middle');
  r++;

  // ── ROW 14: INSTRUCTION ────────────────────────────────────
  s.setRowHeight(r, 22);
  s.getRange(r, 1, 1, 9).setBackground(LIGHT);
  s.getRange(r, 2, 1, 7).merge()
    .setValue('Celdas amarillas = editables. El dashboard se actualiza automáticamente.')
    .setFontSize(9).setFontColor(MUTED)
    .setHorizontalAlignment('left').setVerticalAlignment('middle');
  r++;

  // ── ROW 15: LOG COLUMN HEADERS ─────────────────────────────
  s.setRowHeight(r, 26);
  ['Semana','Semana de','Leads Nuevos','Appointments','Proposals','Jobs Ganados','Revenue ($)']
    .forEach((h, i) => {
      s.getRange(r, i + 2).setValue(h)
        .setFontSize(9).setFontWeight('bold').setFontColor(WHITE)
        .setHorizontalAlignment('center').setBackground(DARK);
    });
  s.getRange(r, 1).setBackground(DARK);
  s.getRange(r, 9).setBackground(DARK);
  r++;

  // ── ROWS 16-67: 52 WEEKS ───────────────────────────────────
  // r should now = 16 = LS ✓
  const week1 = new Date(2026, 0, 5); // Jan 5, 2026 (first Monday)

  for (let w = 1; w <= 52; w++) {
    const d = new Date(week1);
    d.setDate(week1.getDate() + (w - 1) * 7);
    const rowBg = w % 2 === 0 ? ALT : WHITE;

    s.setRowHeight(r, 28);

    s.getRange(r, 2).setValue('W' + w)
      .setFontSize(10).setFontWeight('bold').setFontColor(MUTED)
      .setHorizontalAlignment('center').setVerticalAlignment('middle')
      .setBackground(rowBg);

    s.getRange(r, 3).setValue(d)
      .setFontSize(10).setFontColor(DARK2)
      .setHorizontalAlignment('center').setVerticalAlignment('middle')
      .setBackground(rowBg).setNumberFormat('MMM d');

    // Input cells: Leads(D), Appointments(E), Proposals(F), Jobs(G), Revenue(H)
    s.getRange(r, 4, 1, 4).setBackground(YELLOW)
      .setHorizontalAlignment('center').setVerticalAlignment('middle')
      .setFontSize(11).setFontColor(DARK);

    s.getRange(r, 8).setBackground(YELLOW)
      .setHorizontalAlignment('center').setVerticalAlignment('middle')
      .setFontSize(11).setFontColor(DARK).setNumberFormat('$#,##0');

    s.getRange(r, 1).setBackground(rowBg);
    s.getRange(r, 9).setBackground(rowBg);
    r++;
  }

  // ── FREEZE & FINALIZE ──────────────────────────────────────
  s.setFrozenRows(15);
  s.setTabColor(GOLD);

  return 'Dashboard 2026 creado — ' + (r - 1) + ' filas totales.';
}

function setupSheets(ss) {
  let estimates = ss.getSheetByName('Estimates');
  if (!estimates) {
    estimates = ss.insertSheet('Estimates');
    const headers = ['Date','Client','Address','Module','Rooms/Sides/Pieces','Total SF','Prep Level','Complexity/Height','Painters/Sub','Labor Hrs','Labor/Sub $','Materials $','Mat Markup $','Supplies $','Overhead $','Margin %','Total Cost','QUOTE TO CLIENT','Profit $','Notes'];
    estimates.appendRow(headers);
    estimates.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1a1a2e').setFontColor('#ffffff');
    estimates.setFrozenRows(1);
    estimates.setColumnWidth(1, 90);
    estimates.setColumnWidth(2, 140);
    estimates.setColumnWidth(3, 180);
  }
  let actuals = ss.getSheetByName('Actuals');
  if (!actuals) {
    actuals = ss.insertSheet('Actuals');
    const headers = ['Date','Client','Module','Estimated Quote','Actual Invoice $','Actual Sub/Labor $','Actual Materials $','Est Hrs','Actual Hrs','Est Margin %','Actual Margin %','Difference $','Accuracy %','Notes'];
    actuals.appendRow(headers);
    actuals.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1a1a2e').setFontColor('#ffffff');
    actuals.setFrozenRows(1);
  }
}
