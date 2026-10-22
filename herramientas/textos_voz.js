// Extrae los textos que lee la narración y los guarda en herramientas/voz.json
// Uso: node herramientas/textos_voz.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = p => fs.readFileSync(path.join(__dirname, '..', 'src', p), 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(['data.js', 'eventos.js', 'rubros.js', 'extras.js'].map(src).join('\n') +
  '\n;this.BIZS=BIZS;this.EV=EV;this.CIERRE=CIERRE;this.VOZ_IND=VOZ_IND;this.vozIndicadores=vozIndicadores;this.vozPartidas=vozPartidas;' +
  'this.vozHint=vozHint;this.vozFuerte=vozFuerte;this.vozMejora=vozMejora;this.VOZ_CARRERA=VOZ_CARRERA;this.COMPS=COMPS;this.LIVE=LIVE;this.TEAM_NAMES=TEAM_NAMES;this.slugVoz=slugVoz;this.anuncio=anuncio;this.BIENV=BIENV;', ctx);
const out = [
  { key: 'bienvenida_eq', voz: 'sofia', text: ctx.BIENV.eq },
  { key: 'bienvenida_solo', voz: 'sofia', text: ctx.BIENV.solo }];
// Los nombres sugeridos (🎲) tienen anuncio pregrabado; los inventados se leen con la voz del navegador
ctx.TEAM_NAMES.forEach(n => out.push({ key: 'anuncio_' + ctx.slugVoz(n), voz: 'marcelo', text: ctx.anuncio(n) }));
out.push({ key: 'indicadores', voz: 'sofia', text: ctx.vozIndicadores() });
['rent', 'eq', 'cli', 'cre', 'sos'].forEach(k => out.push({ key: 'ind_' + k, voz: 'sofia', text: ctx.VOZ_IND[k] }));
for (const b of ctx.BIZS) {
  const ev = ctx.EV[b.id];
  out.push({ key: 'intro_' + b.id, voz: 'sofia', text: ev.intro });
  out.push({ key: 'partidas_' + b.id, voz: 'sofia', text: ctx.vozPartidas(b.id) });
  ev.crises.forEach((c, i) => {
    out.push({ key: `crisis_${b.id}_${i}`, voz: 'marcelo', text: c.news });
    out.push({ key: `hint_${b.id}_c${i}`, voz: 'dani', text: ctx.vozHint(c) });
  });
  ev.opps.forEach((o, i) => {
    out.push({ key: `opp_${b.id}_${i}`, voz: 'marcelo', text: o.news });
    out.push({ key: `hint_${b.id}_o${i}`, voz: 'dani', text: ctx.vozHint(o) });
  });
  ev.negs.forEach((n, i) => out.push({ key: `hint_${b.id}_n${i}`, voz: 'dani', text: ctx.vozHint(n) }));
}
ctx.CIERRE.forEach((t, i) => out.push({ key: 'cierre_' + i, voz: 'sofia', text: t }));
ctx.COMPS.forEach(c => {
  out.push({ key: 'fuerte_' + c.id, voz: 'sofia', text: ctx.vozFuerte(c.id) });
  out.push({ key: 'mejora_' + c.id, voz: 'sofia', text: ctx.vozMejora(c.id) });
});
out.push({ key: 'carrera', voz: 'sofia', text: ctx.VOZ_CARRERA });
ctx.LIVE.forEach(e => out.push({ key: 'live_' + e.id, voz: 'marcelo', text: e.news }));
fs.writeFileSync(path.join(__dirname, 'voz.json'), JSON.stringify(out, null, 1));
console.log(out.length + ' textos');
