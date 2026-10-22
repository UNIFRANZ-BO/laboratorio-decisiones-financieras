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
 * Crisis en vivo: el proyector envía {action:'evento', sala, tipo} y los celulares la consultan
 *   cada 10 s con ?action=evento&sala=XXXX (se guarda en las propiedades del script).
 *
 * Certificado por correo: cuando un equipo termina, la app envía {action:'certificado', sala, id}.
 *   El certificado se arma AQUÍ en Google Slides (no se acepta un PDF del celular): uno por integrante,
 *   con su nombre, y se envía a su correo junto con la malla de la carrera, una sola vez por partida.
 *   Antes ejecuta una vez «autorizarCorreo» (permisos de Gmail, Slides y descarga de la malla).
 *   «probarCertificado» crea un ejemplo en la carpeta de informes sin enviar correos.
 *
 * Encuesta final: el QR del proyector abre ?encuesta=XXXX y cada estudiante envía {action:'encuesta'}.
 *   El proyector cuenta las respuestas con ?action=encuesta&sala=XXXX.
 *
 * Hojas:
 *  · Ranking  — una fila por equipo o jugador (se crea y actualiza sola).
 *  · Contactos — nombre completo, correo y celular de cada integrante (nunca se envía al ranking ni al proyector).
 *  · Encuesta — satisfacción, interés antes/ahora y «¿qué te llevas?» (anónima).
 *  · Salas    — resumen automático por sala (fórmula, no editar).
 *  · CONFIG   — abrir o cerrar el registro, salas cerradas.
 *  · Archivo  — salas archivadas (evidencia que ya no aparece en el ranking).
 *  · Sala XXXX — copias exportadas de una sala (evidencia para el colegio).
 */

const HOJA = 'Ranking', HOJA_CFG = 'CONFIG', HOJA_SALAS = 'Salas', HOJA_ARCH = 'Archivo', HOJA_CON = 'Contactos', HOJA_ENC = 'Encuesta';
const COLS_CON = ['Fecha','Sala','ID partida','Equipo','Modo','Nombre completo','Correo','Celular','Autorizó contacto','Certificado enviado'];
const CARRERA_URL = 'https://unifranz.edu.bo/carreras/negocios-y-gestion-empresarial/';
const COLS_ENC = ['Fecha','Sala','Satisfacción (1-5)','Interés antes (1-5)','Interés ahora (1-5)','Cambio de interés','¿Qué se lleva?','Origen'];
const COLS = ['Sala','ID','Modo','Nombre','Avatar','Integrantes','Negocio','Fase','Progreso','Puntaje','Nivel','Perfil',
  'Rentabilidad','Equipo','Clientes','Crecimiento','Sostenibilidad','Capital','Asignación equipo','Decisiones','Pizarras',
  'Just. capital','Just. equipo','Just. crisis','Just. negociación','Just. oportunidad','Creado','Actualizado','Informe PDF'];
const C = { sala: 0, id: 1, nombre: 3, puntaje: 9, nivel: 10, creado: 26, act: 27, pdf: 28 };
const CFG_DEF = [
  ['Parámetro', 'Valor', 'Ayuda'],
  ['Registro abierto', 'SÍ', 'SÍ = los equipos pueden enviar datos. NO = ninguna sala recibe nada (el ranking se sigue viendo).'],
  ['Salas cerradas', '', 'Códigos separados por coma que ya no aceptan datos nuevos. Ej: ABCD, XK7P. Usa el menú para cerrar o abrir.'],
  ['Retener incompletos (horas)', '24', 'El menú «Limpiar incompletos» borra a quienes no terminaron y llevan más de estas horas sin actividad.'],
  ['Carpeta Drive de informes (ID)', '', 'Se llena sola la primera vez. Dentro se crea una carpeta por sala y otra por grupo con su informe PDF.'],
  ['Malla PDF (ID)', '', 'Se llena sola: la malla de la carrera que se adjunta al correo del certificado. Puedes poner el ID de otro PDF de tu Drive.'],
  ['Enviar certificado por correo', 'SÍ', 'SÍ = al terminar, cada integrante recibe su certificado en PDF en su correo (una vez por partida). Gmail permite unos 100 correos al día.']
];

/* ═════════════ MENÚ ═════════════ */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🏆 Laboratorio')
    .addItem('🛠️ Panel de control (seguro)', 'abrirPanel')
    .addSeparator()
    .addItem('📊 Resumen de una sala…', 'resumenSala')
    .addItem('📝 Resultados de la encuesta…', 'resumenEncuesta')
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
  const fallos = [];
  // Cada paso es independiente: si Google falla en uno, los demás siguen y el registro dice cuál fue.
  const paso = (nombre, fn) => {
    try { fn(); console.log('✓ ' + nombre); }
    catch (e) { fallos.push(nombre); console.error('✗ ' + nombre + ': ' + (e && e.message)); }
  };
  paso('Encabezados de Ranking', () => {
    const sh = hoja_(HOJA);
    sh.getRange(1, 1, 1, COLS.length).setValues([COLS]).setFontWeight('bold').setBackground('#FF8A00').setFontColor('#1A0A00');
    sh.setFrozenRows(1);
  });
  paso('Anchos de columnas de Ranking', () => {
    const sh = hoja_(HOJA);
    sh.setColumnWidths(1, COLS.length, 120);
    sh.setColumnWidths(22, 5, 280);
  });
  paso('Hoja CONFIG', () => {
    const cfg = hoja_(HOJA_CFG);
    if (cfg.getLastRow() < 2) cfg.getRange(1, 1, CFG_DEF.length, 3).setValues(CFG_DEF);
    else CFG_DEF.slice(1).forEach(r => { if (!filaCfg_(cfg, r[0])) cfg.appendRow(r); });
    cfg.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#1E1428').setFontColor('#FFFFFF');
    cfg.setColumnWidth(1, 220); cfg.setColumnWidth(2, 160); cfg.setColumnWidth(3, 560); cfg.setFrozenRows(1);
  });
  paso('Lista SÍ/NO de CONFIG', () => {
    const cfg = hoja_(HOJA_CFG);
    ['Registro abierto', 'Enviar certificado por correo'].forEach(k => {
      const r = filaCfg_(cfg, k);
      if (r) cfg.getRange(r, 2).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['SÍ', 'NO'], true).build());
    });
  });
  paso('Fórmula de la hoja Salas', () => {
    const sa = hoja_(HOJA_SALAS);
    // Separador según la configuración regional: español (es_BO…) usa «;», inglés usa «,».
    const q = '"select A, count(B), count(J), avg(J), max(J), min(AA), max(AB) where A is not null group by A order by max(AB) desc label count(B) \'Participantes\', count(J) \'Terminaron\', avg(J) \'Promedio\', max(J) \'Mejor puntaje\', min(AA) \'Inicio\', max(AB) \'Última actividad\'"';
    const loc = String(ss.getSpreadsheetLocale() || 'es');
    const sep = /^(en|ja|zh|ko|th|he|hi)/i.test(loc) ? ',' : ';';
    sa.getRange('A1').setFormula('=IFERROR(QUERY(' + HOJA + '!A1:AB' + sep + q + sep + '1)' + sep + '"Aún no hay datos")');
  });
  paso('Formato de la hoja Salas', () => {
    const sa = hoja_(HOJA_SALAS);
    sa.getRange('D:D').setNumberFormat('0.0');
    sa.getRange('F:G').setNumberFormat('dd/MM/yyyy HH:mm');
    sa.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#FF8A00').setFontColor('#1A0A00');
    sa.setFrozenRows(1); sa.setColumnWidths(1, 7, 140);
  });
  paso('Hoja Contactos', () => cabecera_(HOJA_CON, COLS_CON, '#2E7D32'));
  paso('Hoja Encuesta', () => cabecera_(HOJA_ENC, COLS_ENC, '#6A1B9A'));
  paso('Quitar hoja vacía inicial', () => {
    ['Sheet1', 'Hoja 1', 'Hoja1'].forEach(n => { const h = ss.getSheetByName(n); if (h && h.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(h); });
  });
  const msg = fallos.length ? '⚠️ Listo, salvo: ' + fallos.join(', ') + '. Revisa el registro de ejecución.' : '✅ Hojas listas: Ranking, Salas, CONFIG, Contactos y Encuesta.';
  console.log(msg);
  // Aviso que no bloquea: un alert dejaría al editor «cargando» si la hoja no está abierta
  try { ss.toast(msg, 'Laboratorio', 8); } catch (e) {}
  return msg;
}

function proteger_() {
  const ss = SpreadsheetApp.getActive(); const hechas = [];
  [HOJA, HOJA_SALAS, HOJA_ARCH].forEach(n => {
    const h = ss.getSheetByName(n); if (!h) return;
    try {
      if (!h.getProtections(SpreadsheetApp.ProtectionType.SHEET).length) {
        const p = h.protect();
        p.setWarningOnly(true);
        p.setDescription('Datos del Laboratorio: usa el menú 🏆 Laboratorio');
      }
      hechas.push(n);
    } catch (e) { console.warn('No se pudo proteger ' + n + ': ' + e.message); }
  });
  return hechas;
}
/* Opcional: protege las hojas con aviso. En unidades compartidas Google puede rechazarlo; no es necesario para usar la app ni el panel. */
function protegerHojas() {
  const h = proteger_();
  try { SpreadsheetApp.getUi().alert(h.length ? '🛡️ Hojas protegidas: ' + h.join(', ') + '.' : 'No se pudo proteger ninguna hoja (revisa el registro de ejecución).'); } catch (e) {}
  return h;
}

/* ═════════════ API ═════════════ */
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* GET ?action=ranking&sala=ABCD → lista de participantes de la sala */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'evento') {
    const sala = limpiaSala_(p.sala);
    const v = sala ? PropertiesService.getScriptProperties().getProperty('ev_' + sala) : null;
    return json_({ ok: true, ev: v ? JSON.parse(v) : null });
  }
  if (p.action === 'encuesta') {
    const sala = limpiaSala_(p.sala);
    return json_({ ok: true, n: sala ? filasDe_(HOJA_ENC, COLS_ENC).filter(r => r[1] === sala).length : 0 });
  }
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
  if (d.action === 'evento') {
    const sala = limpiaSala_(d.sala), tipo = String(d.tipo || '').replace(/[^a-z]/g, '').slice(0, 20);
    if (!sala || !tipo) return json_({ ok: false, error: 'Faltan datos' });
    const ev = { id: Date.now(), tipo: tipo };
    PropertiesService.getScriptProperties().setProperty('ev_' + sala, JSON.stringify(ev));
    return json_({ ok: true, ev: ev });
  }
  if (d.action === 'encuesta') return guardarEncuesta_(d);
  if (d.action === 'certificado') return certificado_(d);
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
    const t = v => txt_(v, 1500);
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
    if (Array.isArray(d.contactos) && d.contactos.length) guardarContactos_(sala, id, d, now);
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
function limpiaSala_(s) { const v = String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); return v === 'TODAS' ? v : v.slice(0, 6); }
/* Texto seguro para la hoja: evita que algo como «=HYPERLINK(…)» se ejecute como fórmula */
function txt_(v, max) {
  const s = String(v == null ? '' : v).slice(0, max || 1500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function cabecera_(nombre, cols, color) {
  const sh = hoja_(nombre);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold').setBackground(color).setFontColor('#FFFFFF');
    sh.setFrozenRows(1); sh.setColumnWidths(1, cols.length, 140);
  } else if (sh.getLastColumn() < cols.length) {
    sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold').setBackground(color).setFontColor('#FFFFFF');
  }
  return sh;
}
function filasDe_(nombre, cols) {
  const sh = SpreadsheetApp.getActive().getSheetByName(nombre);
  if (!sh) return [];
  const n = sh.getLastRow() - 1;
  return n < 1 ? [] : sh.getRange(2, 1, n, cols.length).getValues();
}
function borrarDe_(nombre, cols, pred) {
  const sh = SpreadsheetApp.getActive().getSheetByName(nombre);
  if (!sh) return 0;
  const v = filasDe_(nombre, cols); let k = 0;
  for (let i = v.length - 1; i >= 0; i--) if (pred(v[i])) { sh.deleteRow(i + 2); k++; }
  return k;
}
/* Contactos: una fila por integrante; si el equipo reenvía, se reemplazan sus filas */
function guardarContactos_(sala, id, d, now) {
  const sh = cabecera_(HOJA_CON, COLS_CON, '#2E7D32');
  borrarDe_(HOJA_CON, COLS_CON, r => r[1] === sala && r[2] === id);
  const filas = d.contactos.slice(0, 6).map(p => {
    const cel = String((p && p.c) || '').replace(/\D/g, '').slice(-8);
    return [now, sala, id, txt_(d.nombre, 40), txt_(d.modo, 20), txt_(p && p.n, 60), txt_(String((p && p.e) || '').toLowerCase(), 80), cel, d.autoriza ? 'SÍ' : 'NO', ''];
  }).filter(r => r[5]);
  if (!filas.length) return;
  const r0 = sh.getLastRow() + 1;
  sh.getRange(r0, 8, filas.length, 1).setNumberFormat('@');
  sh.getRange(r0, 1, filas.length, COLS_CON.length).setValues(filas);
}
/* Encuesta final (anónima) */
function guardarEncuesta_(d) {
  const n15 = v => { const x = Math.round(Number(v)); return x >= 1 && x <= 5 ? x : 0; };
  const sat = n15(d.sat), antes = n15(d.antes), ahora = n15(d.ahora);
  if (!sat || !antes || !ahora) return json_({ ok: false, error: 'Faltan respuestas' });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = cabecera_(HOJA_ENC, COLS_ENC, '#6A1B9A');
    sh.appendRow([new Date(), limpiaSala_(d.sala) || 'SIN-SALA', sat, antes, ahora, ahora - antes, txt_(d.txt, 500), txt_(d.origen, 10)]);
    return json_({ ok: true });
  } finally { lock.releaseLock(); }
}
function statsEncuesta_(filas) {
  const n = filas.length;
  if (!n) return null;
  const avg = i => Math.round(filas.reduce((a, r) => a + Number(r[i] || 0), 0) / n * 10) / 10;
  return { n: n, sat: avg(2), antes: avg(3), ahora: avg(4), subio: Math.round(filas.filter(r => Number(r[5]) > 0).length / n * 100) };
}
function textoEncuesta_(sala) {
  const f = filasDe_(HOJA_ENC, COLS_ENC).filter(r => sala === 'TODAS' || r[1] === sala);
  const st = statsEncuesta_(f);
  if (!st) return 'Aún no hay respuestas' + (sala === 'TODAS' ? '.' : ' en la sala ' + sala + '.');
  const frases = f.map(r => String(r[6] || '').trim()).filter(Boolean).slice(-25);
  return '📝 Encuesta · ' + (sala === 'TODAS' ? 'todas las salas' : 'sala ' + sala) + '\n' +
    st.n + ' respuestas · satisfacción ' + st.sat + '/5\n' +
    'Interés en NGE: ' + st.antes + ' antes → ' + st.ahora + ' ahora (subió en el ' + st.subio + ' %)' +
    (frases.length ? '\n\n¿Qué se llevan?\n' + frases.map(x => '· ' + x).join('\n') : '');
}
/* ═════════════ CERTIFICADO POR CORREO ═════════════ */
function h_(v) { return String(v == null ? '' : v).replace(/^'/, '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }
function sinEmoji_(v) { return String(v || '').replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '').trim(); }
/* El certificado se arma aquí, en Google Slides, con los datos guardados: nadie puede mandar un adjunto propio.
   Fondo futurista: cert/fondo.jpg del sitio (lo genera herramientas/fondo_certificado.py). Medidas en puntos (720 × 405). */
const FONDO_CERT = 'https://unifranz-bo.github.io/laboratorio-decisiones-financieras/cert/fondo.jpg';
const MALLA_URL = 'https://unifranz.edu.bo/wp-content/uploads/2026/07/negocios-y-gestion-empresarial.pdf';
const MET_CERT = [['Rentabilidad', 12, '#FF8A00'], ['Equipo', 13, '#22E1C3'], ['Clientes', 14, '#4CC9FF'], ['Crecimiento', 15, '#9D7BFF'], ['Sostenibilidad', 16, '#B8F34A']];
const PAD = 7; // margen interno de los cuadros de texto de Slides
function caja_(sl, txt, x, y, w, h, o) {
  const tb = sl.insertTextBox(String(txt), x - PAD, y - PAD, w + PAD * 2, h + PAD * 2);
  const st = tb.getText().getTextStyle();
  st.setFontFamily(o.f || 'Exo 2').setFontSize(o.s || 10).setForegroundColor(o.c || '#FFFFFF').setBold(!!o.b).setItalic(!!o.i);
  if (o.der) tb.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.END);
  return tb;
}
function barra_(sl, x, y, w, h, color) {
  const r = sl.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, x, y, Math.max(w, h), h);
  r.getFill().setSolidFill(color); r.getBorder().setTransparent();
  return r;
}
function codigo_(sala, id, k) {
  const dg = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, sala + '|' + id + '|' + k);
  return 'NGE-' + sala + '-' + dg.slice(0, 2).map(b => ('0' + (b & 255).toString(16)).slice(-2)).join('').toUpperCase();
}
/* Devuelve un PDF por integrante: [{nombre, blob, codigo}] */
function certificadosPdf_(r, sala, id, nombres) {
  const eq = String(r[C.nombre]), solo = /indiv/i.test(String(r[2])), negocio = sinEmoji_(r[6]) || 'su negocio';
  const fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy');
  const pres = SlidesApp.create('Certificado temporal ' + sala + ' ' + id);
  const pid = pres.getId();
  try {
    const sl = pres.getSlides()[0];
    sl.getPageElements().forEach(e => e.remove());
    try { sl.getBackground().setPictureFill(FONDO_CERT); } catch (e) { sl.getBackground().setSolidFill('#0E0718'); }
    caja_(sl, 'UNIFRANZ  ·  NEGOCIOS Y GESTIÓN EMPRESARIAL', 44, 28, 380, 14, { s: 9.5, c: '#FFC23D', b: true });
    caja_(sl, 'LABORATORIO DE DECISIONES FINANCIERAS', 392, 28, 300, 14, { s: 9, c: '#B9A6BC', der: true });
    caja_(sl, 'CERTIFICADO', 44, 70, 410, 46, { f: 'Orbitron', s: 36, b: true });
    caja_(sl, 'GERENTE POR UN DÍA', 46, 116, 380, 16, { f: 'Orbitron', s: 12, c: '#FF8A00', b: true });
    caja_(sl, 'otorgado a', 46, 146, 380, 14, { s: 10, c: '#B9A6BC', i: true });
    const nom = caja_(sl, ' ', 44, 160, 410, 34, { s: 26, b: true });
    caja_(sl, 'Lic. por un día en Negocios y Gestión Empresarial', 46, 200, 410, 16, { s: 11, c: '#FFC23D', b: true });
    // Texto del cuerpo con partes destacadas
    const seg = [['por dirigir '], [negocio, '#FFFFFF']].concat(solo ? [] : [[' junto al equipo '], [eq, '#FFFFFF']])
      .concat([[', decidiendo capital, contratación, crisis, negociación y oportunidades: '], [r[C.puntaje] + ' puntos', '#FFC23D'], [' · nivel '], [String(r[C.nivel]), '#FFC23D'], ['.']]);
    const tx = caja_(sl, seg.map(x => x[0]).join(''), 46, 226, 400, 50, { s: 10.5, c: '#EADBCB' }).getText();
    let ini = 0;
    seg.forEach(x => { const fin = ini + x[0].length; if (x[1] && fin > ini) tx.getRange(ini, fin).getTextStyle().setForegroundColor(x[1]).setBold(true); ini = fin; });
    if (r[11]) caja_(sl, 'Perfil financiero: ' + String(r[11]).replace(/^'/, ''), 46, 284, 400, 14, { s: 10, c: '#22E1C3', b: true });
    caja_(sl, 'Negocios y Gestión Empresarial\nUNIFRANZ · Cochabamba', 44, 356, 200, 26, { s: 8.5, c: '#B9A6BC' });
    caja_(sl, 'SALA ' + sala + '  ·  ' + fecha, 250, 351, 330, 12, { f: 'Orbitron', s: 7.5, c: '#B9A6BC' });
    const cod = caja_(sl, ' ', 250, 364, 330, 12, { f: 'Orbitron', s: 7.5, c: '#FFC23D', b: true });
    // Panel de desempeño
    caja_(sl, 'DESEMPEÑO', 478, 108, 140, 14, { f: 'Orbitron', s: 9, c: '#FFC23D', b: true });
    caja_(sl, String(r[C.puntaje]), 560, 98, 100, 34, { f: 'Orbitron', s: 26, b: true, der: true });
    caja_(sl, '/100', 662, 116, 30, 12, { s: 8, c: '#B9A6BC' });
    MET_CERT.forEach((m, i) => {
      const y = 148 + i * 30, v = Math.max(0, Math.min(100, Number(r[m[1]]) || 0));
      caja_(sl, m[0], 478, y, 150, 12, { s: 9, c: '#EADBCB' });
      caja_(sl, String(Math.round(v)), 628, y, 50, 12, { f: 'Orbitron', s: 9, b: true, der: true });
      barra_(sl, 478, y + 15, 200, 5, '#2A1C3E');
      if (v > 0) barra_(sl, 478, y + 15, 200 * v / 100, 5, m[2]);
    });
    const nomId = nom.getObjectId(), codId = cod.getObjectId();
    pres.saveAndClose();
    // Un PDF por integrante: solo cambian el nombre y el código de verificación
    return nombres.map((n, k) => {
      const p = SlidesApp.openById(pid), s = p.getSlides()[0];
      const largo = n.length > 30 ? 18 : n.length > 22 ? 22 : 26;
      const tn = s.getPageElementById(nomId).asShape().getText();
      tn.setText(n); tn.getTextStyle().setFontFamily('Exo 2').setFontSize(largo).setForegroundColor('#FFFFFF').setBold(true);
      const codigo = codigo_(sala, id, k);
      const tc = s.getPageElementById(codId).asShape().getText();
      tc.setText('CÓDIGO ' + codigo); tc.getTextStyle().setFontFamily('Orbitron').setFontSize(7.5).setForegroundColor('#FFC23D').setBold(true);
      p.saveAndClose();
      const blob = DriveApp.getFileById(pid).getAs(MimeType.PDF).setName('Certificado NGE - ' + n.replace(/[\/:*?"<>|#%]/g, '') + '.pdf');
      return { nombre: n, blob: blob, codigo: codigo };
    });
  } finally {
    try { DriveApp.getFileById(pid).setTrashed(true); } catch (e) {}
  }
}
/* Malla curricular: se descarga una vez de la web de UNIFRANZ y se guarda en la carpeta de informes */
function malla_() {
  const id = cfg_('Malla PDF (ID)');
  if (id) { try { return DriveApp.getFileById(id).getBlob(); } catch (e) {} }
  try {
    const blob = UrlFetchApp.fetch(MALLA_URL).getBlob().setName('Malla Negocios y Gestión Empresarial - UNIFRANZ.pdf');
    const f = carpetaRaiz_().createFile(blob);
    try { setCfg_('Malla PDF (ID)', f.getId()); } catch (e) {}
    return f.getBlob();
  } catch (e) { console.warn('No se pudo obtener la malla: ' + e.message); return null; }
}
function htmlCorreo_(nombre, eq, negocio, puntaje, nivel, codigo, conMalla) {
  const btn = (url, txt, bg) => '<a href="' + url + '" style="display:inline-block;margin:6px 4px;padding:13px 24px;border-radius:99px;background:' + bg + ';color:#fff;font-weight:bold;text-decoration:none">' + txt + '</a>';
  return '<div style="font-family:Arial,Helvetica,sans-serif;max-width:580px;margin:auto;background:#0E0718;border-radius:18px;overflow:hidden;color:#EADBCB">' +
    '<div style="background:#FF8A00;background-image:linear-gradient(120deg,#FFC23D,#FF8A00 45%,#FF3D7F);padding:26px 26px 22px;color:#1A0A00">' +
    '<div style="font-size:11px;letter-spacing:3px;font-weight:bold">UNIFRANZ · LABORATORIO DE DECISIONES FINANCIERAS</div>' +
    '<div style="font-size:27px;font-weight:bold;margin-top:8px">¡Felicitaciones, ' + h_(nombre) + '! 🎓</div>' +
    '<div style="font-size:14px;margin-top:4px">Hoy fuiste Lic. por un día en Negocios y Gestión Empresarial</div></div>' +
    '<div style="padding:24px 26px;line-height:1.6;font-size:15px">' +
    '<p style="margin:0 0 14px">Con el equipo <b style="color:#fff">' + h_(eq) + '</b> dirigiste <b style="color:#fff">' + h_(negocio) + '</b> y lograron ' +
    '<b style="color:#FFC23D">' + h_(puntaje) + ' puntos</b> (nivel <b style="color:#FFC23D">' + h_(nivel) + '</b>).</p>' +
    '<div style="background:#1B1029;border:1px solid #3a2550;border-radius:12px;padding:14px 16px;margin:0 0 16px;font-size:14px">' +
    '📎 <b style="color:#fff">Adjuntos</b><br>🏅 Tu certificado personal (código <b style="color:#FFC23D">' + h_(codigo) + '</b>)' +
    (conMalla ? '<br>📚 La malla curricular de la carrera de Negocios y Gestión Empresarial' : '') + '</div>' +
    '<p style="margin:0 0 14px">Repartir un capital, contratar un equipo, resolver una crisis y negociar: eso es lo que se aprende en <b style="color:#fff">Negocios y Gestión Empresarial</b> de UNIFRANZ, con un proyecto real en cada semestre y dos menciones: Transformación Digital y Analítica de Negocios, o Emprendimiento e Innovación.</p>' +
    '<p style="text-align:center;margin:22px 0 8px">' + btn(CARRERA_URL, 'Conocer la carrera →', '#FF5E3A') + '</p>' +
    '<p style="font-size:11px;color:#7D6C86;margin:18px 0 0">Recibes este correo porque tu equipo registró esta dirección en el Laboratorio de Decisiones Financieras de UNIFRANZ. Si no participaste, ignóralo.</p>' +
    '</div></div>';
}
function certificado_(d) {
  const sala = limpiaSala_(d.sala), id = String(d.id || '').slice(0, 40);
  if (!sala || !id) return json_({ ok: false, error: 'Faltan datos' });
  if (String(cfg_('Enviar certificado por correo') || 'SÍ').toUpperCase() === 'NO') return json_({ ok: true, n: 0, apagado: true });
  if (salaCerrada_(sala)) return json_({ ok: false, error: 'cerrada' });
  const props = PropertiesService.getScriptProperties(), clave = 'mail_' + sala + '_' + id;
  // El candado solo reserva el envío; el armado del PDF va fuera para no frenar a los demás equipos
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  let r, cont;
  try {
    const prev = props.getProperty(clave);
    if (prev && !/^enviando:/.test(prev)) return json_({ ok: true, n: 0, ya: true });
    if (prev && Date.now() - Number(prev.split(':')[1]) < 5 * 60000) return json_({ ok: true, n: 0, enCurso: true });
    r = filas_().filter(x => x[C.sala] === sala && x[C.id] === id)[0];
    if (!r || r[C.puntaje] === '') return json_({ ok: true, n: 0, pendiente: true });
    cont = filasDe_(HOJA_CON, COLS_CON).map((x, i) => ({ x: x, fila: i + 2 }))
      .filter(o => o.x[1] === sala && o.x[2] === id && /^[^\s@,;]+@[^\s@,;]+\.[a-z]{2,}$/i.test(String(o.x[6]))).slice(0, 6);
    if (!cont.length) return json_({ ok: true, n: 0, sinCorreos: true });
    if (MailApp.getRemainingDailyQuota() < cont.length) return json_({ ok: true, n: 0, cupo: true });
    props.setProperty(clave, 'enviando:' + Date.now());
  } finally { lock.releaseLock(); }
  try {
    const eq = String(r[C.nombre]), negocio = sinEmoji_(r[6]), puntaje = r[C.puntaje], nivel = String(r[C.nivel]);
    const nombres = cont.map(o => String(o.x[5]).replace(/^'/, ''));
    const pdfs = certificadosPdf_(r, sala, id, nombres);
    const malla = malla_();
    let carpeta = null;
    try { carpeta = subcarpeta_(subcarpeta_(carpetaRaiz_(), 'Sala ' + sala), eq.replace(/[\/:*?"<>|#%]/g, '').trim().slice(0, 60) || 'Grupo'); } catch (e) {}
    const sh = SpreadsheetApp.getActive().getSheetByName(HOJA_CON), ahora = new Date();
    let n = 0;
    cont.forEach((o, k) => {
      const c = pdfs[k];
      if (carpeta) { try { carpeta.createFile(c.blob.copyBlob()); } catch (e) {} }
      const adj = [c.blob.copyBlob()];
      if (malla) adj.push(malla.copyBlob());
      MailApp.sendEmail({ to: String(o.x[6]).trim(), subject: '🎓 ' + eq + ': tu certificado del Laboratorio de Decisiones Financieras · UNIFRANZ',
        htmlBody: htmlCorreo_(c.nombre.split(/\s+/)[0], eq, negocio, puntaje, nivel, c.codigo, !!malla), attachments: adj, name: 'Laboratorio NGE · UNIFRANZ' });
      if (sh) sh.getRange(o.fila, 10).setValue(ahora);
      n++;
    });
    props.setProperty(clave, ahora.toISOString());
    return json_({ ok: true, n: n, malla: !!malla });
  } catch (e) {
    props.deleteProperty(clave);
    return json_({ ok: false, error: 'correo', msg: String(e && e.message || e).slice(0, 200) });
  }
}
/* Ejecuta esta función una vez desde el editor: pide los permisos de Gmail, Slides y descarga de la malla */
function autorizarCorreo() {
  const m = malla_();
  return 'Correos disponibles hoy: ' + MailApp.getRemainingDailyQuota() + ' · Malla: ' + (m ? 'lista en la carpeta de informes' : 'no se pudo descargar');
}
/* Prueba visual: crea un certificado de ejemplo en la carpeta de informes (no envía correos) */
function probarCertificado() {
  const r = ['ZTEST', 'demo', 'Equipo', 'Los Cóndores Andinos', '🦊', '', '🍔 Hamburguesería «El Tunari»', 'Terminó', 100, 78, 'Gerente estratega', 'Ahorrador estratégico', 82, 64, 77, 70, 88];
  const c = certificadosPdf_(r, 'ZTEST', 'demo', ['Rafael Aramayo'])[0];
  const f = carpetaRaiz_().createFile(c.blob);
  return f.getUrl();
}

function resumenEncuesta() {
  const sala = pedirSala_('📝 Resultados de la encuesta', 'que quieres ver (escribe TODAS para todas)'); if (!sala) return;
  SpreadsheetApp.getUi().alert(textoEncuesta_(sala));
}

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
  let r = filaCfg_(sh, clave);
  if (!r) { const def = CFG_DEF.filter(x => x[0] === clave)[0] || [clave, '', '']; sh.appendRow(def); r = sh.getLastRow(); }
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

/* Núcleo de cada acción: lo usan el menú y el panel de control */
function exportarSala_(sala) {
  const rows = filas_().filter(r => r[C.sala] === sala)
    .sort((a, b) => (b[C.puntaje] === '' ? -1 : b[C.puntaje]) - (a[C.puntaje] === '' ? -1 : a[C.puntaje]));
  if (!rows.length) return 'La sala ' + sala + ' no tiene datos.';
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
  return '📄 Hoja «' + nombre + '» creada con ' + rows.length + ' filas, ordenadas por puntaje. Se descarga en Archivo → Descargar.';
}
function alternarSala_(sala) {
  const l = salasCerradas_(); const i = l.indexOf(sala);
  if (i >= 0) { l.splice(i, 1); setCfg_('Salas cerradas', l.join(', ')); return '🔓 La sala ' + sala + ' está abierta otra vez.'; }
  l.push(sala); setCfg_('Salas cerradas', l.join(', '));
  return '🔒 Sala ' + sala + ' cerrada: ya no recibe resultados nuevos. Su ranking se sigue viendo.';
}
function alternarRegistro_() {
  const nuevo = String(cfg_('Registro abierto') || 'SÍ').toUpperCase() === 'NO' ? 'SÍ' : 'NO';
  setCfg_('Registro abierto', nuevo);
  return nuevo === 'SÍ' ? '▶️ Registro abierto: las salas abiertas vuelven a recibir datos.' : '⏸️ Registro pausado: ninguna sala recibe datos nuevos.';
}
function limpiarIncompletos_(sala) {
  const horas = Number(cfg_('Retener incompletos (horas)')) || 0;
  const lim = Date.now() - horas * 3600000;
  const pred = r => (sala === 'TODAS' || r[C.sala] === sala) && r[C.puntaje] === '' && (!(r[C.act] instanceof Date) || r[C.act].getTime() < lim);
  const k = borrarFilas_(pred);
  return k ? '🧹 ' + k + ' filas sin terminar borradas (más de ' + horas + ' h sin actividad).' : 'No había incompletos con más de ' + horas + ' h sin actividad.';
}
function archivarSala_(sala) {
  const rows = filas_().filter(r => r[C.sala] === sala);
  if (!rows.length) return 'La sala ' + sala + ' no tiene datos.';
  const ar = hoja_(HOJA_ARCH);
  if (ar.getLastRow() === 0) {
    ar.getRange(1, 1, 1, COLS.length + 1).setValues([COLS.concat(['Archivado'])]).setFontWeight('bold').setBackground('#7A6A82').setFontColor('#FFFFFF');
    ar.setFrozenRows(1);
  }
  const now = new Date();
  ar.getRange(ar.getLastRow() + 1, 1, rows.length, COLS.length + 1).setValues(rows.map(r => r.concat([now])));
  borrarFilas_(r => r[C.sala] === sala);
  return '📦 ' + rows.length + ' filas de la sala ' + sala + ' archivadas. La evidencia quedó en la hoja «Archivo».';
}
function borrarSala_(sala) {
  const k = borrarFilas_(r => r[C.sala] === sala);
  const kc = borrarDe_(HOJA_CON, COLS_CON, r => r[1] === sala);
  const ke = borrarDe_(HOJA_ENC, COLS_ENC, r => r[1] === sala);
  return k + kc + ke ? '🗑️ Sala ' + sala + ' borrada definitivamente: ' + k + ' filas del ranking, ' + kc + ' contactos y ' + ke + ' respuestas de encuesta.' : 'La sala ' + sala + ' no tenía datos.';
}

/* ═════════════ PANEL DE CONTROL (barra lateral) ═════════════ */
function abrirPanel() {
  const html = HtmlService.createHtmlOutput(PANEL_HTML).setTitle('🏆 Laboratorio · Panel de control');
  SpreadsheetApp.getUi().showSidebar(html);
}
function panelDatos() {
  const st = {};
  filas_().forEach(r => {
    const s = r[C.sala]; if (!s) return;
    st[s] = st[s] || { sala: s, n: 0, fin: 0, suma: 0, ult: 0, pdf: 0 };
    st[s].n++; if (r[C.puntaje] !== '') { st[s].fin++; st[s].suma += Number(r[C.puntaje]); }
    if (r[C.pdf]) st[s].pdf++;
    const t = r[C.act] instanceof Date ? r[C.act].getTime() : 0; if (t > st[s].ult) st[s].ult = t;
  });
  const con = {}; filasDe_(HOJA_CON, COLS_CON).forEach(r => { con[r[1]] = (con[r[1]] || 0) + 1; });
  const encF = filasDe_(HOJA_ENC, COLS_ENC), enc = {};
  encF.forEach(r => { (enc[r[1]] = enc[r[1]] || []).push(r); });
  const cerr = salasCerradas_(), tz = Session.getScriptTimeZone();
  let carpeta = '';
  try { const id = cfg_('Carpeta Drive de informes (ID)'); if (id) carpeta = DriveApp.getFolderById(id).getUrl(); } catch (e) {}
  return {
    abierto: String(cfg_('Registro abierto') || 'SÍ').toUpperCase() !== 'NO', carpeta: carpeta, encuesta: statsEncuesta_(encF),
    salas: Object.values(st).sort((a, b) => b.ult - a.ult).map(x => ({ sala: x.sala, n: x.n, fin: x.fin, pdf: x.pdf,
      con: con[x.sala] || 0, enc: statsEncuesta_(enc[x.sala] || []),
      prom: x.fin ? Math.round(x.suma / x.fin) : null, cerrada: cerr.indexOf(x.sala) >= 0,
      ult: x.ult ? Utilities.formatDate(new Date(x.ult), tz, 'dd/MM HH:mm') : '' }))
  };
}
function panelAccion(accion, sala, confirmacion) {
  sala = sala === 'TODAS' ? 'TODAS' : limpiaSala_(sala);
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    if (accion === 'registro') return alternarRegistro_();
    if (!sala) return '⚠️ Falta el código de sala.';
    if (accion === 'resumen') {
      const fin = leerSala_(sala).filter(x => x.puntaje !== '').sort((a, b) => b.puntaje - a.puntaje);
      return fin.length ? fin.map((x, i) => (i + 1) + '. ' + x.nombre + ' — ' + x.puntaje + ' pts').join('\n') : 'Nadie terminó todavía en la sala ' + sala + '.';
    }
    if (accion === 'exportar') return exportarSala_(sala);
    if (accion === 'encuesta') return textoEncuesta_(sala);
    if (accion === 'cerrar') return alternarSala_(sala);
    if (accion === 'limpiar') return limpiarIncompletos_(sala);
    if (accion === 'archivar') return archivarSala_(sala);
    if (accion === 'borrar') {
      if (String(confirmacion || '').toUpperCase().trim() !== sala) return '✋ No se borró nada: para confirmar escribe exactamente el código ' + sala + '.';
      return borrarSala_(sala);
    }
    return 'Acción desconocida.';
  } finally { lock.releaseLock(); }
}
const PANEL_HTML = `<!doctype html><html><head><base target="_top"><style>
body{font-family:Arial,sans-serif;margin:0;padding:12px;color:#1d1626;font-size:13px}
h3{margin:4px 0 8px;font-size:15px}
.top{display:flex;gap:6px;align-items:center;justify-content:space-between;padding:10px;border-radius:10px;background:#FFF3E6;margin-bottom:10px}
.pill{font-size:11px;font-weight:700;padding:3px 8px;border-radius:99px}
.on{background:#E8F9D0;color:#3c6b00}.off{background:#FFDCE0;color:#a3172a}
button{font:inherit;cursor:pointer;border:1px solid #e3d6c6;background:#fff;border-radius:8px;padding:6px 8px;font-size:12px}
button:hover{background:#FFF3E6}button.prim{background:#FF8A00;color:#fff;border-color:#FF8A00;font-weight:700}
button.dang{color:#a3172a;border-color:#f3c0c6}
.sala{border:1px solid #eee;border-radius:10px;padding:10px;margin-bottom:8px}
.sala b{font-size:15px;letter-spacing:1px}.meta{color:#6b6475;font-size:11.5px;margin:3px 0 8px}
.acts{display:flex;flex-wrap:wrap;gap:5px}
#msg{white-space:pre-wrap;padding:10px;border-radius:10px;background:#F4F1FA;margin:10px 0;display:none}
.vac{color:#6b6475;padding:20px;text-align:center}
a{color:#c2410c}
</style></head><body>
<h3>🏆 Panel de control</h3>
<div class="top"><span>Registro de resultados: <span id="reg" class="pill"></span></span><button onclick="act(\'registro\')">⏯️ Cambiar</button></div>
<div id="carp"></div>
<div id="imp"></div>
<div id="msg"></div>
<div id="lista"><div class="vac">Cargando…</div></div>
<p style="font-size:11px;color:#6b6475">Gestiona las salas desde este panel: cada acción pide confirmación y borrar exige escribir el código de la sala. Evita editar a mano las hojas Ranking, Salas y Archivo. «Borrar» también elimina los contactos y la encuesta de esa sala.</p>
<button onclick="cargar()">🔄 Actualizar</button>
<script>
function msg(t){var m=document.getElementById(\'msg\');m.style.display=\'block\';m.textContent=t}
function cargar(){google.script.run.withSuccessHandler(pintar).withFailureHandler(function(e){msg(\'Error: \'+e.message)}).panelDatos()}
function pintar(d){
  var r=document.getElementById(\'reg\');r.textContent=d.abierto?\'ABIERTO\':\'PAUSADO\';r.className=\'pill \'+(d.abierto?\'on\':\'off\');
  var e=d.encuesta;document.getElementById(\'imp\').innerHTML=e?\'<div class="top" style="display:block;background:#F3E8FB"><b>📝 Encuesta (todas las salas)</b><br>\'+e.n+\' respuestas · satisfacción \'+e.sat+\'/5<br>Interés en NGE: \'+e.antes+\' → \'+e.ahora+\' (subió en el \'+e.subio+\' %)<br><button style="margin-top:6px" onclick="act(\\'encuesta\\',\\'TODAS\\')">💬 Ver frases</button></div>\':\'\';
  document.getElementById(\'carp\').innerHTML=d.carpeta?\'<p>📁 <a href="\'+d.carpeta+\'" target="_blank">Abrir carpeta de informes PDF</a></p>\':\'\';
  var L=document.getElementById(\'lista\');
  if(!d.salas.length){L.innerHTML=\'<div class="vac">Aún no hay salas registradas.</div>\';return}
  L.innerHTML=d.salas.map(function(s){return \'<div class="sala"><b>\'+s.sala+\'</b> \'+(s.cerrada?\'<span class="pill off">🔒 cerrada</span>\':\'<span class="pill on">abierta</span>\')+
   \'<div class="meta">\'+s.n+\' participantes · \'+s.fin+\' terminaron\'+(s.prom!==null?\' · promedio \'+s.prom:\'\')+\' · \'+s.pdf+\' PDF · \'+s.con+\' contactos\'+(s.enc?\' · encuesta \'+s.enc.n+\' (\'+s.enc.sat+\'/5)\':\'\')+\' · \'+s.ult+\'</div><div class="acts">\'+
   \'<button onclick="act(\\'resumen\\',\\'\'+s.sala+\'\\')">📊 Resumen</button>\'+
   \'<button onclick="act(\\'exportar\\',\\'\'+s.sala+\'\\')">📄 Exportar</button>\'+
   \'<button onclick="act(\\'encuesta\\',\\'\'+s.sala+\'\\')">📝 Encuesta</button>\'+
   \'<button onclick="act(\\'cerrar\\',\\'\'+s.sala+\'\\')">\'+(s.cerrada?\'🔓 Abrir\':\'🔒 Cerrar\')+\'</button>\'+
   \'<button onclick="act(\\'limpiar\\',\\'\'+s.sala+\'\\')">🧹 Limpiar incompletos</button>\'+
   \'<button onclick="if(confirm(\\'¿Archivar la sala \'+s.sala+\'? Dejará de verse en el ranking, pero se conserva en la hoja Archivo.\\'))act(\\'archivar\\',\\'\'+s.sala+\'\\')">📦 Archivar</button>\'+
   \'<button class="dang" onclick="borrar(\\'\'+s.sala+\'\\')">🗑️ Borrar</button></div></div>\'}).join(\'\');
}
function act(a,s,c){msg(\'⏳ Procesando…\');google.script.run.withSuccessHandler(function(t){msg(t);cargar()}).withFailureHandler(function(e){msg(\'Error: \'+e.message)}).panelAccion(a,s||\'\',c||\'\')}
function borrar(s){var c=prompt(\'Esto borra DEFINITIVAMENTE la sala \'+s+\'. Para confirmar, escribe el código de la sala:\');if(c!==null)act(\'borrar\',s,c)}
cargar();
</script></body></html>`;

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
  const sala = pedirSala_('📄 Exportar sala', 'que quieres exportar'); if (!sala) return;
  SpreadsheetApp.getUi().alert(exportarSala_(sala));
}
function alternarSala() {
  const sala = pedirSala_('🔒 Cerrar o abrir sala', 'que quieres cerrar o volver a abrir'); if (!sala) return;
  SpreadsheetApp.getUi().alert(alternarSala_(sala));
}
function alternarRegistro() { SpreadsheetApp.getUi().alert(alternarRegistro_()); }
function limpiarIncompletos() {
  const sala = pedirSala_('🧹 Limpiar incompletos', 'que quieres limpiar (escribe TODAS para todas)'); if (!sala) return;
  if (!confirmar_('Se borrarán las filas sin puntaje final con más de ' + (cfg_('Retener incompletos (horas)') || 0) + ' h sin actividad. ¿Continuar?')) return;
  SpreadsheetApp.getUi().alert(limpiarIncompletos_(sala));
}
function archivarSala() {
  const sala = pedirSala_('📦 Archivar sala', 'que quieres archivar'); if (!sala) return;
  if (!confirmar_('La sala ' + sala + ' pasará a la hoja «Archivo» y dejará de verse en el ranking. ¿Continuar?')) return;
  SpreadsheetApp.getUi().alert(archivarSala_(sala));
}
function borrarSala() {
  const ui = SpreadsheetApp.getUi();
  const sala = pedirSala_('🗑️ Borrar sala', 'que quieres BORRAR definitivamente'); if (!sala) return;
  const r = ui.prompt('Confirmar borrado', 'Esto no se puede deshacer (usa «Archivar» si quieres conservarla).\nEscribe otra vez el código ' + sala + ' para confirmar:', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK || limpiaSala_(r.getResponseText()) !== sala) { ui.alert('No se borró nada.'); return; }
  ui.alert(borrarSala_(sala));
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
