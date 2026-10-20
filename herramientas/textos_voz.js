// Extrae los textos que lee la narradora y los guarda en herramientas/voz.json
// Uso: node herramientas/textos_voz.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = p => fs.readFileSync(path.join(__dirname, '..', 'src', p), 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(src('data.js') + '\n' + src('eventos.js') + '\n' + src('rubros.js') + '\n;this.BIZS=BIZS;this.EV=EV;', ctx);
const app = src('app.js');
const bienvenida = app.match(/const BIENVENIDA='([^']+)'/)[1];
const cierres = eval(app.match(/const C=(\[[\s\S]*?\]);/)[1]);
const out = [{ key: 'bienvenida', voz: 'sofia', text: bienvenida }];
for (const b of ctx.BIZS) {
  const ev = ctx.EV[b.id];
  out.push({ key: 'intro_' + b.id, voz: 'sofia', text: ev.intro });
  ev.crises.forEach((c, i) => out.push({ key: `crisis_${b.id}_${i}`, voz: 'marcelo', text: c.news }));
  ev.opps.forEach((o, i) => out.push({ key: `opp_${b.id}_${i}`, voz: 'marcelo', text: o.news }));
}
cierres.forEach((t, i) => out.push({ key: 'cierre_' + i, voz: 'sofia', text: t }));
fs.writeFileSync(path.join(__dirname, 'voz.json'), JSON.stringify(out, null, 1));
console.log(out.length + ' textos');
