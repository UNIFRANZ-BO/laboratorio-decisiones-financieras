/* ═══════════════════════════════════════
   EXTRAS v3.2 — textos de voz compartidos, prioridades, guía de organigramas,
   caja de 6 meses, micropausas, comodín, contraoferta, crisis en vivo, certificado y quiz
   (Las funciones de texto también las usa herramientas/textos_voz.js para generar los MP3)
═══════════════════════════════════════ */

/* ---------- Textos de voz ---------- */
const VOZ_IND={
  intro:'Su empresa se mide con cinco indicadores, de cero a cien. Cada decisión que tomen moverá estos números.',
  rent:'Rentabilidad: cuánto ganan por cada boliviano que invierten. No es cuánto venden, sino cuánto les queda después de pagar todo.',
  eq:'Equipo: qué tan capaz, motivado y bien organizado está su personal. Un buen equipo hace que todo lo demás funcione.',
  cli:'Clientes: cuántas personas los eligen y vuelven a comprarles. Sin clientes satisfechos no hay negocio.',
  cre:'Crecimiento: su capacidad de expandirse, innovar y llegar a nuevos mercados.',
  sos:'Sostenibilidad: qué tan preparados están para durar en el tiempo y resistir crisis. Aquí pesan mucho la reserva y las decisiones responsables.'
};
const vozIndicadores=()=>[VOZ_IND.intro,VOZ_IND.rent,VOZ_IND.eq,VOZ_IND.cli,VOZ_IND.cre,VOZ_IND.sos].join(' ');
function vozPartidas(bizId){
  const L=CAPLINES[bizId].filter(l=>l.id!=='pla'&&l.id!=='res');
  return 'Estas son las partidas de su negocio. '+L.map(l=>l.name+': '+l.hint.toLowerCase()+'.').join(' ')+
    ' Muy importante: en Sueldos del equipo reserven una parte importante, porque más adelante podrán contratar a personal especializado en su negocio. Un perfil técnico cuesta entre tres mil y nueve mil bolivianos al mes. Y el fondo de emergencia los protegerá cuando llegue una crisis.';
}
const CIERRE=[
  '¡Impresionante! Su gestión fue de nivel profesional.',
  '¡Muy bien! Tomaron decisiones sólidas y bien pensadas.',
  'Buen trabajo. Hubo aciertos, y también decisiones que les costaron caro.',
  'Su empresa sobrevivió con dificultades, y eso también enseña mucho.',
  'Fue un reto duro, y está bien: así empiezan los grandes gerentes.'
];
const COMP_MATERIAS=c=>MALLA_MAP.filter(s=>s.c.includes(c)).slice(0,2).map(s=>s.s);
const vozFuerte=c=>{const x=COMPS.find(z=>z.id===c);const m=COMP_MATERIAS(c);return`Su mayor fortaleza fue ${x.lbl.toLowerCase()}. En la carrera la llevarán al siguiente nivel con materias como ${m.join(' y ')}.`};
const vozMejora=c=>{const x=COMPS.find(z=>z.id===c);const m=COMP_MATERIAS(c);return`Lo que más deben fortalecer es ${x.lbl.toLowerCase()}. Justamente para eso, Negocios y Gestión Empresarial tiene materias como ${m.join(' y ')}.`};
const VOZ_CARRERA='Lo que vivieron hoy en una hora, en Negocios y Gestión Empresarial de UNIFRANZ lo dominarán en cuatro años: con proyectos integradores reales en cada semestre, inteligencia artificial y análisis de datos, dos menciones para especializarse y experiencias internacionales. Si hoy disfrutaron tomar decisiones, esta carrera es para ustedes. ¡Los esperamos!';
function vozHint(ev){const b=ev.opts.reduce((x,o)=>o.q>x.q?o:x,ev.opts[0]);
  return `¡Hola! Soy Dani, estudiante de Negocios y Gestión Empresarial. Vimos casos así en clase. Mi consejo: busquen la opción que logre esto: ${b.sub.toLowerCase().replace(/\.$/,'')}. Y piensen en qué pasará en seis meses, no solo hoy.`}

/* ---------- Micropausas «¿Y en tu vida?» ---------- */
const MICRO={
  capital:{q:'Te pagan Bs 1.000 en tu primer trabajo de medio tiempo. ¿Cuánto guardarías para emergencias?',o:[
    {t:'Nada, ya veré después',f:'Sin reserva, cualquier imprevisto te obliga a endeudarte, igual que a tu empresa sin fondo de emergencia.'},
    {t:'Entre Bs 100 y 200 (10–20 %)',f:'¡Exacto! Es lo que recomiendan los expertos: ahorrar una parte fija de cada ingreso.',ok:1},
    {t:'Todo: no gasto nada',f:'Ahorrar todo tampoco es sano: también necesitas cubrir gastos e invertir en ti.'}]},
  team:{q:'Quieres ganar más en el futuro. ¿En qué invertirías primero?',o:[
    {t:'Un celular último modelo',f:'Es un gusto, no una inversión: pierde valor cada mes.'},
    {t:'Un curso o una certificación',f:'¡Bien! Tu capital humano es tu mejor inversión, igual que contratar al personal correcto.',ok:1},
    {t:'Ropa de marca',f:'Es un gusto válido, pero no aumenta lo que podrás ganar.'}]},
  crisis:{q:'Se te rompe el celular y necesitas otro ya. ¿Qué haces?',o:[
    {t:'Pido un préstamo rápido con interés alto',f:'Es la opción más cara: los préstamos rápidos pueden costarte el doble.'},
    {t:'Uso mi fondo de emergencia',f:'¡Exacto! Para eso existe: resolver imprevistos sin deudas.',ok:1},
    {t:'Compro el más caro en 24 cuotas',f:'Las cuotas largas parecen fáciles, pero terminas pagando mucho más.'}]},
  neg:{q:'Vas a comprar una laptop de Bs 5.000. ¿Qué haces?',o:[
    {t:'Pago lo que me piden',f:'Pierdes la oportunidad de ahorrar sin ganar más.'},
    {t:'Comparo 3 tiendas y pido descuento por pagar al contado',f:'¡Así se negocia! Comparar y proponer te puede ahorrar cientos de bolivianos.',ok:1},
    {t:'Pido que me la fíen',f:'Endeudarte sin un plan es riesgoso, aunque te la fíen.'}]},
  opp:{q:'Un amigo te ofrece «duplicar tu dinero en un mes» con un negocio en internet. ¿Qué haces?',o:[
    {t:'Invierto todos mis ahorros',f:'¡Cuidado! Las ganancias aseguradas y rápidas suelen ser estafas piramidales.'},
    {t:'Investigo y desconfío de ganancias aseguradas',f:'¡Muy bien! Una oportunidad real se analiza con datos, como hicieron en su empresa.',ok:1},
    {t:'Invierto una parte, por si acaso',f:'Es mejor que todo, pero si es una estafa igual pierdes. Primero investiga.'}]}
};

/* ---------- Quiz final ---------- */
const QUIZ=[
  {q:'¿Qué es la rentabilidad?',o:['Cuánto vendes en un mes','Cuánto ganas en relación con lo que inviertes','Cuántos clientes tienes'],a:1},
  {q:'Una empresa puede tener ganancias y aun así quebrar si…',o:['No tiene efectivo para pagar sus cuentas','Tiene muchos clientes','Paga sus impuestos'],a:0},
  {q:'¿Para qué sirve un fondo de emergencia?',o:['Para darse gustos','Para cubrir imprevistos sin endeudarse','Para pagar sueldos más altos'],a:1},
  {q:'En una negociación «ganar-ganar»…',o:['Una parte cede todo','Ambas partes obtienen algo valioso','Gana quien grita más fuerte'],a:1},
  {q:'La regla 50/30/20 recomienda destinar al ahorro e inversión…',o:['El 50 %','El 30 %','El 20 %'],a:2},
  {q:'Contratar a alguien sin relación con tu negocio…',o:['Aumenta costos sin aportar','Siempre mejora el equipo','Reduce la planilla'],a:0},
  {q:'Tener varios clientes y proveedores sirve para…',o:['Complicarse la vida','Reducir el riesgo','Pagar menos impuestos'],a:1},
  {q:'¿Qué aprendes en Negocios y Gestión Empresarial?',o:['Solo contabilidad','A dirigir empresas con finanzas, datos, talento e innovación','Solo marketing'],a:1}
];

/* ---------- Crisis en vivo (las lanza el docente desde el proyector) ---------- */
const LIVE=[
  {id:'feriado',ic:'🎉',title:'¡Feriado largo de 4 días!',news:'Atención: el gobierno declara feriado largo de cuatro días. Miles de familias viajan y el consumo cambia de golpe.',
   desc:'El gobierno declara feriado largo. La mitad de tus clientes se va de viaje, pero llegan turistas.',opts:[
   {lbl:'Abrir con promociones especiales',sub:'Aprovechas a quienes se quedan y a los visitantes.',fx:{rent:4,eq:-2,cli:6,cre:4,sos:2},q:2},
   {lbl:'Cerrar y dar descanso al equipo',sub:'Equipo feliz, ventas cero.',fx:{rent:-4,eq:6,cli:-2,cre:0,sos:0},q:1},
   {lbl:'Abrir como un día normal',sub:'Sin plan, ventas flojas.',fx:{rent:-2,eq:-2,cli:0,cre:0,sos:0},q:0}]},
  {id:'impuestos',ic:'🧾',title:'Fiscalización de Impuestos Nacionales',news:'Último momento: Impuestos Nacionales inicia operativos sorpresa de fiscalización en negocios de Cochabamba.',
   desc:'Llegan fiscalizadores de Impuestos Nacionales. Revisarán facturas de los últimos 6 meses.',opts:[
   {lbl:'Mostrar todo en orden y regularizar lo pendiente',sub:'Transparencia y cumplimiento.',fx:{rent:-2,eq:2,cli:2,cre:0,sos:8},q:2},
   {lbl:'Pagarle a un «tramitador» para que lo arregle',sub:'Ilegal y arriesgado.',fx:{rent:-6,eq:-4,cli:-2,cre:0,sos:-12},q:0},
   {lbl:'Cerrar el día para evitar la revisión',sub:'Solo postergas el problema.',fx:{rent:-4,eq:0,cli:-4,cre:0,sos:-4},q:0}]},
  {id:'qr',ic:'📱',title:'Estafa con un QR falso a tu nombre',news:'Último momento: estafadores circulan códigos QR falsos usando el nombre de negocios conocidos de Cochabamba.',
   desc:'Circulan QR falsos con el nombre de tu negocio. Algunos clientes pagaron a estafadores.',opts:[
   {lbl:'Avisar a clientes y al banco, y mostrar el QR oficial',sub:'Proteges a tus clientes.',fx:{rent:-2,eq:2,cli:6,cre:0,sos:6},q:2},
   {lbl:'Ignorarlo: no es tu culpa',sub:'Los clientes se sienten abandonados.',fx:{rent:0,eq:0,cli:-8,cre:0,sos:-4},q:0},
   {lbl:'Dejar de cobrar con QR',sub:'Seguro, pero pierdes ventas.',fx:{rent:-4,eq:0,cli:-2,cre:-4,sos:2},q:1}]},
  {id:'viral',ic:'🔥',title:'Un video viral critica tu servicio',news:'Atención: un video con miles de reproducciones critica a un negocio cochabambino. Las redes arden.',
   desc:'Un video viral con 200 mil vistas critica tu atención. Los comentarios se multiplican.',opts:[
   {lbl:'Responder con transparencia y una solución concreta',sub:'Conviertes la crítica en confianza.',fx:{rent:-2,eq:2,cli:6,cre:4,sos:4},q:2},
   {lbl:'Borrar los comentarios negativos',sub:'La gente lo nota… y se enoja más.',fx:{rent:0,eq:0,cli:-8,cre:-2,sos:-4},q:0},
   {lbl:'Pelear en redes con el autor',sub:'Más visibilidad… negativa.',fx:{rent:0,eq:-2,cli:-6,cre:2,sos:-4},q:0}]}
];

/* ---------- Guía de organigramas ---------- */
const ORG_TIPOS=[
  {id:'vertical',n:'Vertical (funcional)',ic:'🔽',cuando:'El más común: la gerencia arriba y cada área debajo. Ideal para la mayoría de las empresas.',
   svg:'<rect x="70" y="6" width="60" height="22" rx="5"/><rect x="6" y="56" width="48" height="20" rx="5"/><rect x="76" y="56" width="48" height="20" rx="5"/><rect x="146" y="56" width="48" height="20" rx="5"/><path d="M100 28v14M30 42h140M30 42v14M100 42v14M170 42v14"/>'},
  {id:'horizontal',n:'Horizontal',ic:'➡️',cuando:'Se lee de izquierda a derecha. Útil para mostrar procesos o en pantallas anchas.',
   svg:'<rect x="6" y="34" width="50" height="22" rx="5"/><rect x="120" y="6" width="70" height="18" rx="5"/><rect x="120" y="36" width="70" height="18" rx="5"/><rect x="120" y="66" width="70" height="18" rx="5"/><path d="M56 45h30M86 15v60M86 15h34M86 45h34M86 75h34"/>'},
  {id:'plano',n:'Plano (startup)',ic:'🟰',cuando:'Pocos niveles: todos reportan directo a quien dirige. Típico de startups y equipos pequeños.',
   svg:'<rect x="70" y="6" width="60" height="22" rx="5"/><circle cx="25" cy="66" r="13"/><circle cx="75" cy="66" r="13"/><circle cx="125" cy="66" r="13"/><circle cx="175" cy="66" r="13"/><path d="M100 28L25 53M100 28L75 53M100 28L125 53M100 28L175 53"/>'},
  {id:'matricial',n:'Matricial',ic:'🔲',cuando:'Las personas tienen un jefe de área y uno de proyecto. Común en constructoras y consultoras.',
   svg:'<rect x="56" y="4" width="40" height="16" rx="4"/><rect x="104" y="4" width="40" height="16" rx="4"/><rect x="152" y="4" width="40" height="16" rx="4"/><rect x="2" y="34" width="44" height="16" rx="4"/><rect x="2" y="64" width="44" height="16" rx="4"/><circle cx="76" cy="42" r="6"/><circle cx="124" cy="42" r="6"/><circle cx="172" cy="42" r="6"/><circle cx="76" cy="72" r="6"/><circle cx="124" cy="72" r="6"/><circle cx="172" cy="72" r="6"/><path d="M76 20v46M124 20v46M172 20v46M46 42h120M46 72h120" stroke-dasharray="3 3"/>'}
];
const ORG_PASOS=['Escriban las <b>funciones</b> que su negocio necesita (no los nombres todavía).','Agrúpenlas en <b>áreas</b>: producción, ventas, atención, administración…','Definan <b>quién reporta a quién</b> con flechas.','Pongan <b>nombres o cargos</b> y revisen que nadie tenga dos jefes (salvo en el matricial).'];
