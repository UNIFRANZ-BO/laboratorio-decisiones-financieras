/**
 * LABORATORIO DE DECISIONES FINANCIERAS — Ranking en vivo
 * Negocios y Gestión Empresarial · UNIFRANZ
 *
 * Instalación (una sola vez):
 *  1. Crea una hoja de cálculo de Google nueva → Extensiones → Apps Script.
 *  2. Pega este archivo completo en Código.gs y guarda.
 *  3. Ejecuta la función «preparar» (acepta los permisos).
 *  4. Implementar → Nueva implementación → Tipo: Aplicación web
 *       Ejecutar como: Yo   ·   Quién tiene acceso: Cualquier usuario
 *  5. Copia la URL que termina en /exec y pégala en CONFIG.API_URL del HTML
 *     (o ejecuta:  python build.py https://script.google.com/macros/s/XXXX/exec).
 */

const HOJA = 'Ranking';
const COLS = ['Sala','ID','Modo','Nombre','Avatar','Integrantes','Negocio','Fase','Progreso','Puntaje','Nivel','Perfil',
  'Rentabilidad','Equipo','Clientes','Crecimiento','Sostenibilidad','Capital','Asignación equipo','Decisiones','Pizarras',
  'Just. capital','Just. equipo','Just. crisis','Just. negociación','Just. oportunidad','Creado','Actualizado'];

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🏆 Laboratorio')
    .addItem('Preparar hoja', 'preparar')
    .addItem('Ver resumen de una sala…', 'resumenSala')
    .addItem('Borrar una sala…', 'borrarSala')
    .addToUi();
}

function preparar() {
  const sh = hoja_();
  sh.getRange(1, 1, 1, COLS.length).setValues([COLS]).setFontWeight('bold')
    .setBackground('#FF8A00').setFontColor('#1A0A00');
  sh.setFrozenRows(1);
  sh.setColumnWidths(1, COLS.length, 120);
  sh.setColumnWidths(22, 5, 280);
  return 'Hoja lista';
}

function hoja_() {
  const ss = SpreadsheetApp.getActive();
  return ss.getSheetByName(HOJA) || ss.insertSheet(HOJA);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* GET ?action=ranking&sala=ABCD  → lista de participantes de la sala */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'ranking') {
    const sala = String(p.sala || '').toUpperCase().trim();
    if (!sala) return json_({ ok: false, error: 'Falta sala' });
    return json_({ ok: true, items: leerSala_(sala) });
  }
  return json_({ ok: true, app: 'Laboratorio de Decisiones Financieras', hora: new Date().toISOString() });
}

/* POST {action:'upsert', sala, id, ...} → crea o actualiza la fila del equipo */
function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'JSON inválido' }); }
  if (d.action !== 'upsert') return json_({ ok: false, error: 'Acción desconocida' });
  const sala = String(d.sala || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  const id = String(d.id || '').slice(0, 40);
  if (!sala || !id) return json_({ ok: false, error: 'Faltan datos' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = hoja_();
    if (sh.getLastRow() === 0) preparar();
    const now = new Date();
    const m = d.met || {};
    const j = d.justif || {};
    const t = v => String(v == null ? '' : v).slice(0, 1500);
    const fila = [sala, id, t(d.modo), t(d.nombre).slice(0, 40), t(d.avatar).slice(0, 8), t(d.integrantes), t(d.negocio),
      t(d.fase), Number(d.progreso) || 0, d.puntaje === '' || d.puntaje == null ? '' : Number(d.puntaje), t(d.nivel), t(d.perfil),
      m.rent == null ? '' : m.rent, m.eq == null ? '' : m.eq, m.cli == null ? '' : m.cli, m.cre == null ? '' : m.cre, m.sos == null ? '' : m.sos,
      t(d.capital), t(d.equipo), t(d.decisiones), t(d.pizarras),
      t(j.cap), t(j.team), t(j.crisis), t(j.neg), t(j.opp)];

    const n = sh.getLastRow() - 1;
    let row = -1;
    if (n > 0) {
      const keys = sh.getRange(2, 1, n, 2).getValues();
      for (let i = 0; i < keys.length; i++) if (keys[i][0] === sala && keys[i][1] === id) { row = i + 2; break; }
    }
    if (row === -1) {
      sh.appendRow(fila.concat([now, now]));
    } else {
      // No borrar el puntaje final si llega una actualización posterior sin él
      const prev = sh.getRange(row, 1, 1, COLS.length).getValues()[0];
      for (let c = 9; c < fila.length; c++) if (fila[c] === '' && prev[c] !== '') fila[c] = prev[c];
      sh.getRange(row, 1, 1, fila.length + 2).setValues([fila.concat([prev[26] || now, now])]);
    }
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function leerSala_(sala) {
  const sh = hoja_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, COLS.length).getValues()
    .filter(r => r[0] === sala)
    .map(r => ({ id: r[1], modo: r[2], nombre: r[3], avatar: r[4], negocio: r[6], fase: r[7], progreso: r[8],
      puntaje: r[9] === '' ? '' : r[9], nivel: r[10], perfil: r[11] }));
}

function resumenSala() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('Resumen de sala', 'Código de la sala:', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  const sala = r.getResponseText().toUpperCase().trim();
  const items = leerSala_(sala).filter(x => x.puntaje !== '').sort((a, b) => b.puntaje - a.puntaje);
  if (!items.length) { ui.alert('La sala ' + sala + ' no tiene resultados finales.'); return; }
  const prom = Math.round(items.reduce((a, x) => a + Number(x.puntaje), 0) / items.length);
  ui.alert('Sala ' + sala, items.map((x, i) => (i + 1) + '. ' + x.nombre + ' — ' + x.puntaje + ' pts (' + x.nivel + ')').join('\n') +
    '\n\nPromedio: ' + prom + ' pts · ' + items.length + ' resultados', ui.ButtonSet.OK);
}

function borrarSala() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('Borrar sala', 'Escribe el código de la sala que quieres borrar:', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  const sala = r.getResponseText().toUpperCase().trim();
  const sh = hoja_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return;
  const vals = sh.getRange(2, 1, n, 1).getValues();
  let borradas = 0;
  for (let i = vals.length - 1; i >= 0; i--) if (vals[i][0] === sala) { sh.deleteRow(i + 2); borradas++; }
  ui.alert(borradas + ' filas borradas de la sala ' + sala + '.');
}
