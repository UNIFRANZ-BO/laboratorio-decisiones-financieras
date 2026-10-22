/* ═══════════════════════════════════════
   v3.4 · Certificado por correo, asesor por WhatsApp y anuncios en el proyector
═══════════════════════════════════════ */

/* ---------- WhatsApp de admisiones (CONFIG.WA_NUMERO o la hoja CONFIG) ---------- */
let WA=String(CONFIG.WA_NUMERO||'').replace(/\D/g,'');
const waUrl=()=>WA?'https://wa.me/'+WA+'?text='+encodeURIComponent('Hola, participé en el Laboratorio de Decisiones Financieras de UNIFRANZ y quiero información sobre la carrera de Negocios y Gestión Empresarial.'):'';
function waPintar(){document.querySelectorAll('[data-wa]').forEach(a=>{a.href=waUrl()||'#';a.style.display=WA?'':'none'})}
(async()=>{
  if(WA||!CONFIG.API_URL){waPintar();return}
  try{const r=await fetch(`${CONFIG.API_URL}?action=config&t=${Date.now()}`);const j=await r.json();if(j.ok&&j.wa){WA=String(j.wa).replace(/\D/g,'');waPintar()}}catch(e){}
})();

/* ---------- Certificado por correo: lo arma y envía el Apps Script ---------- */
async function pedirCertificado(intento){
  intento=intento||0;
  if(!Live.enabled()||S.certMail||!S.personas.some(p=>p.e))return;
  const sm=$('sent-msg'),linea=t=>{if(!sm)return;let el=$('cert-mail');if(!el){el=document.createElement('div');el.id='cert-mail';sm.appendChild(el)}el.innerHTML=t};
  if(!intento)linea('📧 Preparando su certificado para enviarlo a sus correos…');
  try{
    const r=await fetch(CONFIG.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'certificado',sala:S.sala,id:S.id})});const j=await r.json();
    if(j.ok&&j.n>0){S.certMail=true;linea(`📧 Certificado enviado a ${j.n} ${j.n===1?'correo':'correos'}. Revisen su bandeja (y la carpeta de spam).`);Snd.coin()}
    else if(j.ok&&j.ya){S.certMail=true;linea('📧 Su certificado ya fue enviado a sus correos.')}
    else if(j.ok&&j.pendiente&&intento<3)setTimeout(()=>pedirCertificado(intento+1),6000);
    else if(j.ok&&j.apagado)linea('');
    else linea('📧 No se pudo enviar el certificado por correo. Pueden descargarlo con 🏅 Certificado.');
  }catch(e){if(intento<2)setTimeout(()=>pedirCertificado(intento+1),8000);else linea('📴 Sin conexión: el certificado no se envió por correo. Pueden descargarlo con 🏅 Certificado.')}
}

/* ---------- Proyector: anuncia a cada equipo que se une ---------- */
const PJA={seen:null,q:[],busy:false,on:store('nge-pja')!=='0',avisado:false};
function alternarAnuncios(){PJA.on=!PJA.on;store('nge-pja',PJA.on?'1':'0');$('pja-btn').textContent=PJA.on?'🔊 Anuncios: sí':'🔇 Anuncios: no';Snd.click();if(!PJA.on){try{speechSynthesis.cancel()}catch(e){}}}
function pjAnunciar(items){
  const L=(items||[]).filter(t=>t&&t.id);
  if(!PJA.seen){PJA.seen=new Set(L.map(t=>t.id));return}  // quienes ya estaban al abrir el proyector no se anuncian
  L.forEach(t=>{if(!PJA.seen.has(t.id)){PJA.seen.add(t.id);PJA.q.push(t)}});
  pjSiguiente();
}
async function pjSiguiente(){
  if(PJA.busy||!PJA.q.length)return;PJA.busy=true;
  const t=PJA.q.shift(),solo=/indiv/i.test(t.modo||''),n=PJA.q.length;
  $('pa-av').textContent=t.avatar||'🦊';$('pa-n').textContent=t.nombre||'';$('pa-b').textContent=n?`y ${n} más en camino…`:'';
  const b=$('pj-ann');b.classList.remove('on');void b.offsetWidth;b.classList.add('on');Snd.coin();Confetti.burst(90,innerWidth/2,innerHeight*.3);
  await Promise.all([pjHablar(t,solo,n>3),sleep(n>3?1600:2600)]);
  b.classList.remove('on');await sleep(350);PJA.busy=false;pjSiguiente();
}
function pjHablar(t,solo,rapido){return new Promise(res=>{
  const to=setTimeout(res,9000),fin=()=>{clearTimeout(to);res()};
  if(!PJA.on||rapido){fin();return}
  const txt=ingreso(t.nombre,solo);
  if(!solo&&presetEq(t.nombre)){
    const a=new Audio(VOZ_BASE+'ingreso_'+slugVoz(t.nombre)+'.mp3');a.onended=fin;a.onerror=()=>pjTTS(txt,fin);
    a.play().catch(e=>{if(e&&e.name==='NotAllowedError')pjBloqueado();fin()});return}
  pjTTS(txt,fin);
})}
function pjTTS(txt,fin){
  if(!('speechSynthesis'in window)){fin();return}
  const u=new SpeechSynthesisUtterance(txt),v=vozEs('marcelo');if(v){u.voice=v;u.lang=v.lang}else u.lang='es-ES';
  u.onend=fin;u.onerror=e=>{if(e&&e.error==='not-allowed')pjBloqueado();fin()};speechSynthesis.cancel();speechSynthesis.speak(u);
}
function pjBloqueado(){if(PJA.avisado)return;PJA.avisado=true;toast('🔊 Toca una vez la pantalla del proyector para activar los anuncios con voz',6000)}
const _renderRanking=renderRanking;
renderRanking=function(){_renderRanking();pjAnunciar(pjData)};
