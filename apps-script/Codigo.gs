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
 *
 * Al actualizar este código: Implementar → Gestionar implementaciones → ✏️ →
 * Versión: «Nueva versión» → Implementar. Así la URL /exec no cambia.
 *
 * Informes PDF: la app envía el PDF de cada grupo y se guarda en Drive →
 *   «Laboratorio NGE – Informes» / Sala XXXX / Nombre del grupo / informe.pdf
 *
 * Hojas:
 *  · Ranking  — una fila por equipo o jugador (se crea y actualiza sola).
 *  · Salas    — resumen automático por sala (fórmula, no editar).
 *  · CONFIG   — abrir o cerrar el registro, salas cerradas.
 *  · Archivo  — salas archivadas (evidencia que ya no aparece en el ranking).
 *  · Sala XXXX — copias exportadas de una sala (evidencia para el colegio).
 */

const HOJA = 'Ranking', HOJA_CFG = 'CONFIG', HOJA_SALAS = 'Salas', HOJA_ARCH = 'Archivo';
const COLS = ['Sala','ID','Modo','Nombre','Avatar','Integrantes','Negocio','Fase','Progreso','Puntaje','Nivel','Perfil',
  'Rentabilidad','Equipo','Clientes','Crecimiento','Sostenibilidad','Capital','Asignación equipo','Decisiones','Pizarras',
  'Just. capital','Just. equipo','Just. crisis','Just. negociación','Just. oportunidad','Creado','Actualizado','Informe PDF'];
const C = { sala: 0, id: 1, nombre: 3, puntaje: 9, nivel: 10, creado: 26, act: 27, pdf: 28 };
const CFG_DEF = [
  ['Parámetro', 'Valor', 'Ayuda'],
  ['Registro abierto', 'SÍ', 'SÍ = los equipos pueden enviar datos. NO = ninguna sala recibe nada (el ranking se sigue viendo).'],
  ['Salas cerradas', '', 'Códigos separados por coma que ya no aceptan datos nuevos. Ej: ABCD, XK7P. Usa el menú para cerrar o abrir.'],
  ['Retener incompletos (horas)', '24', 'El menú «Limpiar incompletos» borra a quienes no terminaron y llevan más de estas horas sin actividad.'],
  ['Carpeta Drive de informes (ID)', '', 'Se llena sola la primera vez. Dentro se crea una carpeta por sala y otra por grupo con su informe PDF.']
];

/* ═════════════ MENÚ ═════════════ */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🏆 Laboratorio')
    .addItem('📊 Resumen de una sala…', 'resumenSala')
    .addItem('📄 Exportar sala a hoja propia…', 'exportarSala')
    .addSeparator()
    .addItem('🔒 Cerrar o abrir una sala…', 'alternarSala')
    .addItem('⏯️ Abrir o pausar todo el registro', 'alternarRegistro')
    .addSeparator()
    .addItem('🧹 Limpiar incompletos de una sala…', 'limpiarIncompletos')
    .addItem('📦 Archivar una sala…', 'archivarSala')
    .addItem('🗑️ Borrar una sala…', 'borrarSala')
    .addSeparator()
    .addItem('📁 Abrir carpeta de informes', 'abrirCarpeta')
    .addItem('⚙️ Preparar o reparar hojas', 'preparar')
    .addToUi();
}

function preparar() {
  const ss = SpreadsheetApp.getActive();
  const sh = hoja_(HOJA);
  sh.getRange(1, 1, 1, COLS.length).setValues([COLS]).setFontWeight('bold').setBackground('#FF8A00').setFontColor('#1A0A00');
  sh.setFrozenRows(1);
  sh.setColumnWidths(1, COLS.length, 120);
  sh.setColumnWidths(22, 5, 280);

  const cfg = hoja_(HOJA_CFG);
  if (cfg.getLastRow() < 2) cfg.getRange(1, 1, CFG_DEF.length, 3).setValues(CFG_DEF);
  else CFG_DEF.slice(1).forEach(r => { if (!filaCfg_(cfg, r[0])) cfg.appendRow(r); });
  cfg.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#1E1428').setFontColor('#FFFFFF');
  cfg.setColumnWidth(1, 220); cfg.setColumnWidth(2, 160); cfg.setColumnWidth(3, 560); cfg.setFrozenRows(1);
  const reg = filaCfg_(cfg, 'Registro abierto');
  cfg.getRange(reg, 2).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['SÍ', 'NO'], true).build());

  const sa = hoja_(HOJA_SALAS);
  sa.clear();
  // Separador de argumentos según la configuración regional de la hoja:
  // español (es_BO, es_ES…) y otros idiomas con coma decimal usan «;», inglés usa «,».
  const q = '"select A, count(B), count(J), avg(J), max(J), min(AA), max(AB) where A is not null group by A order by max(AB) desc label count(B) \'Participantes\', count(J) \'Terminaron\', avg(J) \'Promedio\', max(J) \'Mejor puntaje\', min(AA) \'Inicio\', max(AB) \'Última actividad\'"';
  const f = sep => '=IFERROR(QUERY(' + HOJA + '!A1:AB' + sep + q + sep + '1)' + sep + '"Aún no hay datos")';
  const sep = /^(en|ja|zh|ko|th|he|hi)/i.test(ss.getSpreadsheetLocale() || '') ? ',' : ';';
  const a1 = sa.getRange('A1');
  a1.setFormula(f(sep));
  SpreadsheetApp.flush();
  if (/^#(ERROR|NAME)/.test(a1.getDisplayValue())) { a1.setFormula(f(sep === ';' ? ',' : ';')); SpreadsheetApp.flush(); }
  sa.getRange('D:D').setNumberFormat('0.0');
  sa.getRange('F:G').setNumberFormat('dd/MM/yyyy HH:mm');
  sa.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#FF8A00').setFontColor('#1A0A00');
  sa.setFrozenRows(1); sa.setColumnWidths(1, 7, 140);

  ['Sheet1', 'Hoja 1', 'Hoja1'].forEach(n => { const h = ss.getSheetByName(n); if (h && h.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(h); });
  ss.setActiveSheet(sa);
  try { SpreadsheetApp.getUi().alert('Hojas listas: Ranking, Salas y CONFIG.'); } catch (e) {}
  return 'ok';
}

/* ═════════════ API ═════════════ */
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* GET ?action=ranking&sala=ABCD → lista de participantes de la sala */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'ranking') {
    const sala = limpiaSala_(p.sala);
    if (!sala) return json_({ ok: false, error: 'Falta sala' });
    return json_({ ok: true, cerrada: salaCerrada_(sala), items: leerSala_(sala) });
  }
  return json_({ ok: true, app: 'Laboratorio de Decisiones Financieras', hora: new Date().toISOString() });
}

/* POST {action:'upsert', sala, id, ...} → crea o actualiza la fila del equipo */
function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'JSON inválido' }); }
  if (d.action === 'pdf') return guardarPdf_(d);
  if (d.action !== 'upsert') return json_({ ok: false, error: 'Acción desconocida' });
  const sala = limpiaSala_(d.sala);
  const id = String(d.id || '').slice(0, 40);
  if (!sala || !id) return json_({ ok: false, error: 'Faltan datos' });
  if (salaCerrada_(sala)) return json_({ ok: false, error: 'cerrada', msg: 'La sala ' + sala + ' está cerrada.' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = hoja_(HOJA);
    if (sh.getLastRow() === 0) preparar();
    const now = new Date();
    const m = d.met || {};
    const j = d.justif || {};
    const t = v => String(v == null ? '' : v).slice(0, 1500);
    const n_ = v => v == null || v === '' ? '' : Number(v);
    const fila = [sala, id, t(d.modo), t(d.nombre).slice(0, 40), t(d.avatar).slice(0, 8), t(d.integrantes), t(d.negocio),
      t(d.fase), Number(d.progreso) || 0, n_(d.puntaje), t(d.nivel), t(d.perfil),
      n_(m.rent), n_(m.eq), n_(m.cli), n_(m.cre), n_(m.sos),
      t(d.capital), t(d.equipo), t(d.decisiones), t(d.pizarras),
      t(j.cap), t(j.team), t(j.crisis), t(j.neg), t(j.opp)];

    const n = sh.getLastRow() - 1;
    let row = -1;
    if (n > 0) {
      const keys = sh.getRange(2, 1, n, 2).getValues();
      for (let i = 0; i < keys.length; i++) if (keys[i][0] === sala && keys[i][1] === id) { row = i + 2; break; }
    }
    if (row === -1) {
      sh.appendRow(fila.concat([now, now, '']));
    } else {
      // No borrar el puntaje final si llega una actualización posterior sin él
      const prev = sh.getRange(row, 1, 1, COLS.length).getValues()[0];
      for (let c = C.puntaje; c < fila.length; c++) if (fila[c] === '' && prev[c] !== '') fila[c] = prev[c];
      sh.getRange(row, 1, 1, COLS.length).setValues([fila.concat([prev[C.creado] || now, now, prev[C.pdf] || ''])]);
    }
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/* ═════════════ DATOS ═════════════ */
function hoja_(nombre) {
  const ss = SpreadsheetApp.getActive();
  return ss.getSheetByName(nombre) || ss.insertSheet(nombre);
}
function limpiaSala_(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6); }
function filas_() {
  const sh = hoja_(HOJA);
  const n = sh.getLastRow() - 1;
  return n < 1 ? [] : sh.getRange(2, 1, n, COLS.length).getValues();
}
function leerSala_(sala) {
  return filas_().filter(r => r[C.sala] === sala)
    .map(r => ({ id: r[1], modo: r[2], nombre: r[3], avatar: r[4], negocio: r[6], fase: r[7], progreso: r[8],
      puntaje: r[9] === '' ? '' : r[9], nivel: r[10], perfil: r[11],
      met: { rent: r[12], eq: r[13], cli: r[14], cre: r[15], sos: r[16] } }));
}

/* CONFIG */
function filaCfg_(sh, clave) {
  const n = sh.getLastRow();
  if (n < 1) return 0;
  const v = sh.getRange(1, 1, n, 1).getValues();
  for (let i = 0; i < v.length; i++) if (String(v[i][0]).trim() === clave) return i + 1;
  return 0;
}
function cfg_(clave) {
  const sh = SpreadsheetApp.getActive().getSheetByName(HOJA_CFG);
  if (!sh) return null;
  const r = filaCfg_(sh, clave);
  return r ? String(sh.getRange(r, 2).getValue()).trim() : null;
}
function setCfg_(clave, valor) {
  const sh = hoja_(HOJA_CFG);
  if (sh.getLastRow() < 2) preparar();
  const r = filaCfg_(sh, clave);
  sh.getRange(r, 2).setValue(valor);
}
function salasCerradas_() {
  return String(cfg_('Salas cerradas') || '').split(/[,;\s]+/).map(limpiaSala_).filter(Boolean);
}
function salaCerrada_(sala) {
  const abierto = String(cfg_('Registro abierto') || 'SÍ').toUpperCase();
  if (abierto === 'NO') return true;
  return salasCerradas_().indexOf(sala) >= 0;
}

/* ═════════════ ACCIONES DEL MENÚ ═════════════ */
function listaSalas_() {
  const st = {};
  filas_().forEach(r => {
    const s = r[C.sala]; if (!s) return;
    st[s] = st[s] || { n: 0, fin: 0, ult: 0 };
    st[s].n++; if (r[C.puntaje] !== '') st[s].fin++;
    const t = r[C.act] instanceof Date ? r[C.act].getTime() : 0; if (t > st[s].ult) st[s].ult = t;
  });
  const cerr = salasCerradas_();
  return Object.keys(st).sort((a, b) => st[b].ult - st[a].ult).map(s =>
    '• ' + s + ' — ' + st[s].n + ' participantes, ' + st[s].fin + ' terminaron' +
    (st[s].ult ? ' · ' + Utilities.formatDate(new Date(st[s].ult), Session.getScriptTimeZone(), 'dd/MM HH:mm') : '') +
    (cerr.indexOf(s) >= 0 ? ' 🔒' : ''));
}
function pedirSala_(titulo, accion) {
  const ui = SpreadsheetApp.getUi();
  const l = listaSalas_();
  const r = ui.prompt(titulo, (l.length ? 'Salas registradas:\n' + l.slice(0, 15).join('\n') + '\n\n' : 'Aún no hay salas.\n\n') +
    'Escribe el código de la sala ' + accion + ':', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return '';
  return limpiaSala_(r.getResponseText());
}
function confirmar_(msg) {
  const ui = SpreadsheetApp.getUi();
  return ui.alert('Confirmar', msg, ui.ButtonSet.YES_NO) === ui.Button.YES;
}
function borrarFilas_(pred) {
  const sh = hoja_(HOJA);
  const v = filas_();
  let k = 0;
  for (let i = v.length - 1; i >= 0; i--) if (pred(v[i])) { sh.deleteRow(i + 2); k++; }
  return k;
}

function resumenSala() {
  const ui = SpreadsheetApp.getUi();
  const sala = pedirSala_('📊 Resumen de sala', 'que quieres ver'); if (!sala) return;
  const items = leerSala_(sala);
  if (!items.length) { ui.alert('La sala ' + sala + ' no tiene datos.'); return; }
  const fin = items.filter(x => x.puntaje !== '').sort((a, b) => b.puntaje - a.puntaje);
  const pend = items.filter(x => x.puntaje === '');
  const prom = fin.length ? Math.round(fin.reduce((a, x) => a + Number(x.puntaje), 0) / fin.length) : 0;
  ui.alert('Sala ' + sala + (salaCerrada_(sala) ? ' 🔒 cerrada' : ''),
    (fin.length ? fin.map((x, i) => (i + 1) + '. ' + x.nombre + ' — ' + x.puntaje + ' pts (' + x.nivel + ')').join('\n') + '\n\nPromedio: ' + prom + ' pts' : 'Nadie terminó todavía.') +
    (pend.length ? '\n\nEn juego o sin terminar (' + pend.length + '):\n' + pend.map(x => '· ' + x.nombre + ' — ' + x.fase).join('\n') : ''),
    ui.ButtonSet.OK);
}

function exportarSala() {
  const ui = SpreadsheetApp.getUi();
  const sala = pedirSala_('📄 Exportar sala', 'que quieres exportar'); if (!sala) return;
  const rows = filas_().filter(r => r[C.sala] === sala)
    .sort((a, b) => (b[C.puntaje] === '' ? -1 : b[C.puntaje]) - (a[C.puntaje] === '' ? -1 : a[C.puntaje]));
  if (!rows.length) { ui.alert('La sala ' + sala + ' no tiene datos.'); return; }
  const ss = SpreadsheetApp.getActive();
  const nombre = 'Sala ' + sala;
  const old = ss.getSheetByName(nombre); if (old) ss.deleteSheet(old);
  const sh = ss.insertSheet(nombre);
  const cols = COLS.filter((_, i) => i !== C.id);
  sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold').setBackground('#FF8A00').setFontColor('#1A0A00');
  sh.getRange(2, 1, rows.length, cols.length).setValues(rows.map(r => r.filter((_, i) => i !== C.id)));
  sh.setFrozenRows(1); sh.setColumnWidths(1, cols.length, 120); sh.setColumnWidths(21, 5, 300);
  sh.getRange(2, 21, rows.length, 5).setWrap(true);
  ss.setActiveSheet(sh);
  ui.alert('Listo: hoja «' + nombre + '» con ' + rows.length + ' filas, ordenadas por puntaje.\nPuedes descargarla en Archivo → Descargar.');
}

function alternarSala() {
  const ui = SpreadsheetApp.getUi();
  const sala = pedirSala_('🔒 Cerrar o abrir sala', 'que quieres cerrar o volver a abrir'); if (!sala) return;
  const l = salasCerradas_();
  const i = l.indexOf(sala);
  if (i >= 0) { l.splice(i, 1); setCfg_('Salas cerradas', l.join(', ')); ui.alert('🔓 La sala ' + sala + ' está abierta otra vez.'); }
  else { l.push(sala); setCfg_('Salas cerradas', l.join(', ')); ui.alert('🔒 Sala ' + sala + ' cerrada: ya no recibe resultados nuevos. Su ranking se sigue viendo.'); }
}

function alternarRegistro() {
  const ui = SpreadsheetApp.getUi();
  const now = String(cfg_('Registro abierto') || 'SÍ').toUpperCase() === 'NO' ? 'NO' : 'SÍ';
  const nuevo = now === 'SÍ' ? 'NO' : 'SÍ';
  setCfg_('Registro abierto', nuevo);
  ui.alert(nuevo === 'SÍ' ? '▶️ Registro abierto: las salas abiertas vuelven a recibir datos.' : '⏸️ Registro pausado: ninguna sala recibe datos nuevos.');
}

function limpiarIncompletos() {
  const ui = SpreadsheetApp.getUi();
  const sala = pedirSala_('🧹 Limpiar incompletos', 'que quieres limpiar (escribe TODAS para todas)');
  if (!sala) return;
  const horas = Number(cfg_('Retener incompletos (horas)')) || 0;
  const lim = Date.now() - horas * 3600000;
  const pred = r => (sala === 'TODAS' || r[C.sala] === sala) && r[C.puntaje] === '' &&
    (!(r[C.act] instanceof Date) || r[C.act].getTime() < lim);
  const k = filas_().filter(pred).length;
  if (!k) { ui.alert('No hay incompletos con más de ' + horas + ' h sin actividad en ' + (sala === 'TODAS' ? 'ninguna sala' : 'la sala ' + sala) + '.'); return; }
  if (!confirmar_('Se borrarán ' + k + ' filas sin puntaje final (más de ' + horas + ' h sin actividad). ¿Continuar?')) return;
  ui.alert(borrarFilas_(pred) + ' filas borradas.');
}

function archivarSala() {
  const ui = SpreadsheetApp.getUi();
  const sala = pedirSala_('📦 Archivar sala', 'que quieres archivar'); if (!sala) return;
  const rows = filas_().filter(r => r[C.sala] === sala);
  if (!rows.length) { ui.alert('La sala ' + sala + ' no tiene datos.'); return; }
  if (!confirmar_('Se moverán ' + rows.length + ' filas de la sala ' + sala + ' a la hoja «Archivo». Dejarán de verse en el ranking. ¿Continuar?')) return;
  const ar = hoja_(HOJA_ARCH);
  if (ar.getLastRow() === 0) {
    ar.getRange(1, 1, 1, COLS.length + 1).setValues([COLS.concat(['Archivado'])]).setFontWeight('bold').setBackground('#7A6A82').setFontColor('#FFFFFF');
    ar.setFrozenRows(1);
  }
  const now = new Date();
  ar.getRange(ar.getLastRow() + 1, 1, rows.length, COLS.length + 1).setValues(rows.map(r => r.concat([now])));
  borrarFilas_(r => r[C.sala] === sala);
  ui.alert('📦 ' + rows.length + ' filas archivadas. La evidencia quedó en la hoja «Archivo».');
}

function borrarSala() {
  const ui = SpreadsheetApp.getUi();
  const sala = pedirSala_('🗑️ Borrar sala', 'que quieres BORRAR definitivamente'); if (!sala) return;
  const k = filas_().filter(r => r[C.sala] === sala).length;
  if (!k) { ui.alert('La sala ' + sala + ' no tiene datos.'); return; }
  if (!confirmar_('Se borrarán definitivamente ' + k + ' filas de la sala ' + sala + '. Esto no se puede deshacer (usa «Archivar» si quieres conservarlas). ¿Continuar?')) return;
  ui.alert(borrarFilas_(r => r[C.sala] === sala) + ' filas borradas.');
}

/* ═════════════ INFORMES PDF EN DRIVE ═════════════ */
function carpetaRaiz_() {
  const id = cfg_('Carpeta Drive de informes (ID)');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const f = DriveApp.createFolder('Laboratorio NGE – Informes');
  try { setCfg_('Carpeta Drive de informes (ID)', f.getId()); } catch (e) {}
  return f;
}
function subcarpeta_(padre, nombre) {
  const it = padre.getFoldersByName(nombre);
  return it.hasNext() ? it.next() : padre.createFolder(nombre);
}
function guardarPdf_(d) {
  const sala = limpiaSala_(d.sala) || 'SIN-SALA';
  const grupo = String(d.nombre || 'Grupo').replace(/[\/:*?"<>|#%]/g, '').trim().slice(0, 60) || 'Grupo';
  if (!d.b64) return json_({ ok: false, error: 'Falta el PDF' });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const carpeta = subcarpeta_(subcarpeta_(carpetaRaiz_(), 'Sala ' + sala), grupo);
    const nombre = String(d.filename || ('Informe ' + grupo + '.pdf')).replace(/[\/:*?"<>|#%]/g, '');
    const blob = Utilities.newBlob(Utilities.base64Decode(d.b64), 'application/pdf', nombre);
    const file = carpeta.createFile(blob);
    const url = file.getUrl();
    const sh = hoja_(HOJA);
    const n = sh.getLastRow() - 1;
    if (n > 0 && d.id) {
      const keys = sh.getRange(2, 1, n, 2).getValues();
      for (let i = 0; i < keys.length; i++) if (keys[i][0] === sala && keys[i][1] === String(d.id)) { sh.getRange(i + 2, C.pdf + 1).setValue(url); break; }
    }
    return json_({ ok: true, url: url, carpeta: carpeta.getUrl() });
  } finally {
    lock.releaseLock();
  }
}
function abrirCarpeta() {
  const f = carpetaRaiz_();
  const html = HtmlService.createHtmlOutput('<p style="font-family:sans-serif">Carpeta de informes:<br><a href="' + f.getUrl() + '" target="_blank">' + f.getName() + '</a></p>').setWidth(360).setHeight(120);
  SpreadsheetApp.getUi().showModalDialog(html, '📁 Informes PDF');
}
/* Ejecuta esta función una vez desde el editor para autorizar Google Drive */
function autorizarDrive() { return carpetaRaiz_().getUrl(); }
