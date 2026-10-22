/* ═══════════════════════════════════════
   v3.3 · Registro con contacto, ceremonia de licenciados y encuesta final
═══════════════════════════════════════ */

/* ---------- Integrantes: nombre completo, correo y celular ---------- */
const contactReq=()=>!!CONFIG.API_URL;
const MAILRX=/^[^\s@,;]+@[^\s@,;]+\.[a-z]{2,}$/i;
function celNorm(v){let d=String(v||'').replace(/\D/g,'');if(d.length===11&&d.startsWith('591'))d=d.slice(3);return d}
const celOk=v=>/^[67]\d{7}$/.test(celNorm(v));
const nomOk=v=>String(v||'').trim().split(/\s+/).filter(w=>w.length>=2).length>=2;
const mailOk=v=>MAILRX.test(String(v||'').trim());
const vacia=p=>!String(p.n||'').trim()&&!String(p.e||'').trim()&&!String(p.c||'').trim();
const PMIN=()=>S.mode==='team'?2:1,PMAX=()=>S.mode==='team'?6:1;

function initPersonas(){
  const t=S.mode==='team';
  S.personas=(S.personas||[]).slice(0,PMAX());while(S.personas.length<PMIN())S.personas.push({n:'',e:'',c:''});
  $('lbl-pers').innerHTML=t?'Integrantes <small>nombre completo, correo y celular de cada uno</small>':'Tus datos <small>nombre completo, correo y celular</small>';
  $('consent-t').innerHTML=t?'Aceptamos que UNIFRANZ use estos datos para enviarnos nuestros resultados e información de la carrera. <b>No se muestran en el ranking ni en el proyector.</b>':'Acepto que UNIFRANZ use estos datos para enviarme mis resultados e información de la carrera. <b>No se muestran en el ranking ni en el proyector.</b>';
  $('consent').style.display=contactReq()?'':'none';$('in-ok').checked=!!S.autoriza;
  renderPersonas();
}
function renderPersonas(){
  const t=S.mode==='team',ac=f=>t?'off':f;
  $('personas').innerHTML=S.personas.map((p,k)=>`<div class="pers">
    <div class="pers-h"><b>${t?'👤 Integrante '+(k+1):'👤 Tú'}</b>${t&&S.personas.length>PMIN()?`<button onclick="delPersona(${k})" aria-label="Quitar integrante ${k+1}">✕</button>`:''}</div>
    <input class="inp" data-k="${k}" data-f="n" value="${esc(p.n)}" placeholder="Nombre y apellido" autocomplete="${ac('name')}" autocapitalize="words" maxlength="60" oninput="setPersona(this)" onblur="tocar(this)">
    <div class="pers-2">
      <input class="inp" data-k="${k}" data-f="e" value="${esc(p.e)}" type="email" inputmode="email" placeholder="correo@ejemplo.com" autocomplete="${ac('email')}" autocapitalize="off" maxlength="80" oninput="setPersona(this)" onblur="tocar(this)">
      <input class="inp" data-k="${k}" data-f="c" value="${esc(p.c)}" type="tel" inputmode="tel" placeholder="Celular · 7XXXXXXX" autocomplete="${ac('tel')}" maxlength="16" oninput="setPersona(this)" onblur="tocar(this)">
    </div></div>`).join('');
  $('pers-add').style.display=t&&S.personas.length<PMAX()?'':'none';
  document.querySelectorAll('#personas .inp').forEach(marcar);
}
function campoOk(f,v){return f==='n'?nomOk(v):f==='e'?mailOk(v):celOk(v)}
function marcar(el){const v=el.value,bad=el.dataset.t&&v.trim()&&!campoOk(el.dataset.f,v);el.classList.toggle('bad',!!bad);el.classList.toggle('good',!!v.trim()&&campoOk(el.dataset.f,v))}
function tocar(el){el.dataset.t=1;marcar(el)}
function setPersona(el){S.personas[+el.dataset.k][el.dataset.f]=el.value;marcar(el);validateSetup()}
function addPersona(){if(S.personas.length>=PMAX())return;S.personas.push({n:'',e:'',c:''});Snd.click();renderPersonas();validateSetup();
  const ins=document.querySelectorAll('#personas .pers:last-child .inp');if(ins[0])ins[0].focus()}
function delPersona(k){S.personas.splice(k,1);Snd.click();renderPersonas();validateSetup()}
function personasEstado(){
  if(!contactReq())return{ok:true};
  const quien=k=>S.mode==='team'?' del integrante '+(k+1):'';
  const llenas=S.personas.filter(p=>!vacia(p));
  for(let k=0;k<S.personas.length;k++){const p=S.personas[k];
    if(vacia(p)&&k>=PMIN())continue;
    if(!nomOk(p.n))return{ok:false,msg:'Falta nombre y apellido'+quien(k)};
    if(!mailOk(p.e))return{ok:false,msg:'Revisen el correo'+quien(k)};
    if(!celOk(p.c))return{ok:false,msg:'El celular'+quien(k)+' debe tener 8 dígitos (empieza con 6 o 7)'}}
  if(llenas.length<PMIN())return{ok:false,msg:'Registren al menos '+PMIN()+' integrantes'};
  if(!$('in-ok').checked)return{ok:false,msg:P('Marquen la casilla de autorización','Marca la casilla de autorización')};
  return{ok:true};
}
function guardarPersonas(){
  S.personas=S.personas.filter(p=>!vacia(p)).map(p=>({n:String(p.n).trim().replace(/\s+/g,' ').slice(0,60),e:String(p.e).trim().toLowerCase().slice(0,80),c:celNorm(p.c)}));
  S.autoriza=contactReq()?$('in-ok').checked:false;
  const nombres=S.personas.map(p=>p.n).filter(Boolean);if(nombres.length)S.members=nombres;else if(S.mode==='solo')S.members=[];
  if(!S.personas.length)S.personas=[{n:'',e:'',c:''}];
}

/* ---------- Ceremonia: credencial de licenciados ---------- */
try{speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=()=>speechSynthesis.getVoices()}catch(e){}
Voz.say=function(text,who,cb){
  this.stop(true);this.cb=cb||null;const tok=++this.tok;
  if(!this.on||!text){if(cb)setTimeout(cb,0);return}
  const n=$('narr');n.classList.toggle('news',who==='marcelo');
  $('nr-av').textContent=who==='marcelo'?'🎙️':'👩🏽‍💼';$('nr-who').textContent=who==='marcelo'?'Marcelo · presentador':'Sofía · tu mentora';
  $('nr-txt').textContent=text;n.classList.add('on');this.tts(text,tok,who);
};
const presetEq=n=>TEAM_NAMES.some(x=>slugVoz(x)===slugVoz(n));
async function ceremonia(){
  const solo=S.mode==='solo',c=$('cere');AB.reset();
  const sofia=()=>Voz.play(solo?'bienvenida_solo':'bienvenida_eq',BIENV[solo?'solo':'eq'],'sofia');
  const txt=anuncio(S.name,solo);
  // Los nombres sugeridos tienen el anuncio grabado por Marcelo; los inventados los lee la voz del navegador
  if(!solo&&presetEq(S.name)){Voz.play('anuncio_'+slugVoz(S.name),txt,'marcelo',sofia);$('nr-who').textContent='Marcelo · presentador'}else Voz.say(txt,'marcelo',sofia);
  const nm=S.members.length?S.members:[];
  $('cred').innerHTML=`<div class="cred-k">🎓 UNIFRANZ · Negocios y Gestión Empresarial</div>
    <div class="cred-t">Credencial oficial de gerencia</div>
    <div class="cred-av">${S.av}</div>
    <div class="cred-n">${esc(S.name)}</div>
    <div class="cred-s">${solo?'Profesional en Negocios y Gestión Empresarial':'Licenciadas y licenciados en Negocios y Gestión Empresarial'}</div>
    ${nm.length?`<div class="cred-m">${nm.map(n=>`<span>🎓 Lic. ${esc(n)}</span>`).join('')}</div>`:''}
    <div class="cred-f"><span>${S.sala?'Sala '+esc(S.sala):'Laboratorio NGE'}</span><span>${new Date().toLocaleDateString('es-BO',{day:'numeric',month:'short',year:'numeric'})}</span></div>`;
  c.classList.remove('rev');c.classList.add('on');
  for(let i=0;i<5;i++){Snd.tick();await sleep(260)}
  c.classList.add('rev');Snd.fanfare();vib([60,40,120]);Confetti.burst(160);setTimeout(()=>Confetti.burst(120,innerWidth*.2,innerHeight*.35),400);setTimeout(()=>Confetti.burst(120,innerWidth*.8,innerHeight*.35),700);
}
function cerrarCeremonia(){Snd.click();$('cere').classList.remove('on','rev');go('select')}

/* ---------- Encuesta final ---------- */
const ENC_EMO=[['😴','Aburrido'],['😕','Meh'],['🙂','Bien'],['😃','Muy bien'],['🤩','¡Increíble!']];
let ENC={el:null,origen:'qr',r:{}};
const encUrl=sala=>location.origin+location.pathname+'?encuesta='+encodeURIComponent(sala||'');
function renderEnc(el,origen){
  ENC={el,origen,r:{sat:0,antes:0,ahora:0}};
  const esc5=k=>[1,2,3,4,5].map(v=>`<button data-v="${v}" onclick="encPick('${k}',${v},this)">${v}</button>`).join('');
  el.innerHTML=`<span class="tag">📝 30 segundos · anónima</span>
    <h3 class="enc-h">¿Qué te pareció el <span class="gt">Laboratorio</span>?</h3>
    <div class="enc-q"><b>1. ¿Cuánto te gustó la actividad?</b>
      <div class="enc-emo" data-k="sat">${ENC_EMO.map((e,i)=>`<button data-v="${i+1}" onclick="encPick('sat',${i+1},this)"><span>${e[0]}</span><small>${e[1]}</small></button>`).join('')}</div></div>
    <div class="enc-q"><b>2. ¿Qué tanto te interesa estudiar Negocios y Gestión Empresarial?</b>
      <div class="enc-sc"><span>Antes de hoy</span><div class="enc-n" data-k="antes">${esc5('antes')}</div></div>
      <div class="enc-sc"><span>Ahora</span><div class="enc-n" data-k="ahora">${esc5('ahora')}</div></div>
      <div class="enc-leg"><span>1 = nada</span><span>5 = muchísimo</span></div></div>
    <div class="enc-q"><b>3. En una frase: ¿qué te llevas de hoy?</b>
      <textarea class="inp" id="enc-txt" maxlength="300" rows="2" placeholder="Ej: que sin un fondo de emergencia una crisis te hunde…"></textarea></div>
    <button class="btn" id="enc-send" onclick="encEnviar()" disabled>Enviar ✨</button>
    <p class="enc-st" id="enc-st">Toca una opción en las preguntas 1 y 2.</p>`;
}
function encPick(k,v,b){ENC.r[k]=v;b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('sel',x===b));Snd.click();vib(15);
  const ok=ENC.r.sat&&ENC.r.antes&&ENC.r.ahora;$('enc-send').disabled=!ok;$('enc-st').textContent=ok?'La pregunta 3 es opcional, pero nos encanta leerla 💛':'Toca una opción en las preguntas 1 y 2.'}
async function encEnviar(){
  const b=$('enc-send'),st=$('enc-st');b.disabled=true;st.textContent='⏳ Enviando…';
  const body={action:'encuesta',sala:S.sala||'',sat:ENC.r.sat,antes:ENC.r.antes,ahora:ENC.r.ahora,txt:$('enc-txt').value.trim().slice(0,300),origen:ENC.origen};
  try{const r=await fetch(CONFIG.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)});const j=await r.json();
    if(!j.ok)throw new Error(j.error||'');
    store('nge-enc-'+(S.sala||'x'),'1');encGracias()}
  catch(e){b.disabled=false;st.innerHTML='📴 No se pudo enviar. Revisa tu conexión y toca <b>Enviar</b> otra vez.'}
}
function encGracias(){
  const inGame=ENC.origen==='app';
  ENC.el.innerHTML=`<div class="enc-ok"><div class="enc-big">🎉</div><h3 class="enc-h">¡Gracias!</h3>
    <p>Tu opinión nos ayuda a que el próximo Laboratorio sea todavía mejor.</p>
    ${waUrl()?`${ENC.r.ahora>=4?'<p><b>¿Te interesó la carrera?</b> Un asesor te cuenta todo por WhatsApp.</p>':''}<a class="btn wa-btn" href="${waUrl()}" target="_blank" rel="noopener">💬 Hablar con un asesor</a>`:''}
    <a class="${waUrl()&&ENC.r.ahora>=4?'btn-ghost':'btn'}" href="${CONFIG.CTA_URL}" target="_blank" rel="noopener">Conocer la carrera →</a>
    <div class="enc-row">${inGame?`<button class="btn-ghost" onclick="renderEnc($('enc-modal'),'app')">👥 Responde otro integrante</button><button class="btn-ghost" onclick="closeModal('m-enc')">Cerrar</button>`:`<button class="btn-link" onclick="renderEnc($('enc-page'),'qr')">Otra persona usa este celular</button>`}</div></div>`;
  Snd.fanfare();Confetti.burst(160);
  if(inGame)AB.set('🔄 Jugar de nuevo',restart,{back:()=>go('results')});
}
/* Página que abre el QR */
function initEncPage(){renderEnc($('enc-page'),'qr');if(!CONFIG.API_URL)$('enc-st').textContent='⚠️ Falta configurar el Apps Script: la encuesta no se puede enviar.'}
/* Dentro del juego (pantalla final) */
function encEnJuego(){
  const on=!!CONFIG.API_URL;$('enc-cta').style.display=on?'':'none';
  if(!on){AB.set('🔄 Jugar de nuevo',restart,{back:()=>go('results')});return}
  qrInto($('enc-cta-qr'),encUrl(S.sala));
  AB.set('📝 Encuesta (30 s)',abrirEnc,{back:()=>go('results')});
}
function abrirEnc(){renderEnc($('enc-modal'),'app');$('m-enc').classList.add('on')}
/* Proyector: QR grande y contador en vivo */
let encT=null;
function abrirEncQR(){
  const u=encUrl(pjCode);qrInto($('encqr'),u);$('encqr-url').textContent=u.replace(/^https?:\/\//,'');
  $('m-encqr').classList.add('on');$('encqr-btn').classList.remove('pulse');Snd.ok();
  contarEnc();clearInterval(encT);encT=setInterval(contarEnc,6000);
}
function cerrarEncQR(){clearInterval(encT);closeModal('m-encqr')}
async function contarEnc(){
  if(!CONFIG.API_URL)return;
  try{const r=await fetch(`${CONFIG.API_URL}?action=encuesta&sala=${encodeURIComponent(pjCode)}&t=${Date.now()}`);const j=await r.json();
    if(j.ok){const el=$('encqr-n'),old=+el.textContent||0;el.textContent=j.n||0;if((j.n||0)>old){el.parentElement.classList.remove('bump');void el.offsetWidth;el.parentElement.classList.add('bump');Snd.coin()}}}catch(e){}
}
