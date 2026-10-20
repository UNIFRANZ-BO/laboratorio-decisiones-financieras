/* ═══════════════════════════════════════
   CONFIGURACIÓN — pega aquí la URL de tu Apps Script (termina en /exec)
═══════════════════════════════════════ */
const CONFIG={
  API_URL:'https://script.google.com/macros/s/AKfycbx4E1a1cdKiOMZOzahLezsqJVEjW6HmqZSYxLVYQV3wMeV6TssZpivYVLSsnGxfQPw/exec',
  CTA_URL:'https://unifranz.edu.bo/carreras/negocios-y-gestion-empresarial/',
  POLL_MS:4000
};

/* ═══════════════════════════════════════
   UTILIDADES
═══════════════════════════════════════ */
const $=id=>document.getElementById(id);
const fmt=n=>'Bs '+Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const clamp=v=>Math.max(5,Math.min(96,v||0));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const genCode=()=>Array.from({length:4},()=>'ABCDEFGHJKMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*31)]).join('');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const avgOf=m=>Math.round(METS.reduce((a,x)=>a+m[x.id],0)/METS.length);
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function vib(p){try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
function countUp(el,to,dur,pre){const s=performance.now();pre=pre||'';(function u(n){const t=Math.min((n-s)/dur,1);const e=1-Math.pow(1-t,3);el.textContent=pre==='Bs '?fmt(to*e):pre+Math.round(to*e);if(t<1)requestAnimationFrame(u)})(s)}
function toast(msg,ms){const t=document.createElement('div');t.className='toast';t.innerHTML=msg;$('toasts').appendChild(t);setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),400)},ms||2200)}
function floatFx(txt,x,y,col){const f=document.createElement('div');f.className='floatfx';f.textContent=txt;f.style.left=(x-30)+'px';f.style.top=(y-20)+'px';f.style.color=col||'#B8F34A';document.body.appendChild(f);setTimeout(()=>f.remove(),1300)}

/* Sonido (Web Audio, sin archivos) */
const Snd={on:store('nge-snd')!=='0',ctx:null,
  t(f,d,type,vol,delay){if(!this.on)return;try{this.ctx=this.ctx||new(window.AudioContext||window.webkitAudioContext)();const c=this.ctx,o=c.createOscillator(),g=c.createGain(),t0=c.currentTime+(delay||0);o.type=type||'sine';o.frequency.setValueAtTime(f,t0);g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol||.06,t0+.01);g.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(g).connect(c.destination);o.start(t0);o.stop(t0+d+.02)}catch(e){}},
  click(){this.t(620,.06,'triangle',.04)},
  coin(){this.t(988,.07,'square',.03);this.t(1319,.14,'square',.03,.06)},
  ok(){[523,659,784].forEach((f,i)=>this.t(f,.2,'triangle',.06,i*.08))},
  fanfare(){[523,659,784,1047,784,1047].forEach((f,i)=>this.t(f,.28,'triangle',.07,i*.12))},
  alarm(){for(let i=0;i<6;i++)this.t(i%2?660:880,.18,'sawtooth',.035,i*.2)},
  bad(){this.t(196,.3,'sawtooth',.04);this.t(147,.35,'sawtooth',.04,.12)},
  whoosh(){this.t(240,.25,'sine',.05);this.t(480,.2,'sine',.03,.08)},
  tick(){this.t(1200,.03,'square',.02)},
  beep(h){this.t(h?1046:523,h?.5:.18,'triangle',.08)}
};
function toggleSound(){Snd.on=!Snd.on;store('nge-snd',Snd.on?'1':'0');$('snd-btn').textContent=Snd.on?'🔊':'🔇';if(Snd.on)Snd.click()}

/* Confeti */
const Confetti=(()=>{let cv,cx,parts=[],raf=null;
  function burst(n,ox,oy){
    cv=cv||$('confetti');cx=cx||cv.getContext('2d');cv.width=innerWidth;cv.height=innerHeight;
    const cols=['#FFC23D','#FF8A00','#FF5E3A','#FF3D7F','#9D7BFF','#22E1C3','#B8F34A'];
    ox=ox==null?innerWidth/2:ox;oy=oy==null?innerHeight*.35:oy;
    for(let i=0;i<(n||140);i++){const a=Math.random()*Math.PI*2,s=4+Math.random()*9;parts.push({x:ox,y:oy,vx:Math.cos(a)*s,vy:Math.sin(a)*s-6,w:6+Math.random()*6,h:8+Math.random()*8,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:rnd(cols),life:0})}
    if(!raf)loop();
  }
  function loop(){cx.clearRect(0,0,cv.width,cv.height);parts.forEach(p=>{p.life++;p.vy+=.25;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.globalAlpha=Math.max(0,1-p.life/160);cx.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.abs(Math.cos(p.life*.1)));cx.restore()});
    parts=parts.filter(p=>p.life<160&&p.y<cv.height+40);raf=parts.length?requestAnimationFrame(loop):(cx.clearRect(0,0,cv.width,cv.height),null)}
  return{burst};
})();

/* ═══════════════════════════════════════
   ESTADO
═══════════════════════════════════════ */
function newState(prev){return{
  id:uid(),mode:prev?prev.mode:'team',name:prev?prev.name:'',av:prev?prev.av:'🦊',members:prev?prev.members:[],sala:prev?prev.sala:'',
  biz:null,cap:{mkt:0,ops:0,rrhh:0,inf:0,res:0},team:{},sel:null,
  met:{rent:50,eq:50,cli:50,cre:50,sos:50},matches:0,noRes:false,
  crisis:null,cOpt:null,timedOut:false,negs:[],negOpts:[null,null,null],negRound:0,opp:null,oppOpt:null,oppShown:false,
  justif:{cap:'',team:'',crisis:'',neg:'',opp:''},boards:{d1:false,d2:false},score:0,tier:'',perfil:'',finished:false,phase:'home'}}
let S=newState();

/* Textos en modo individual */
const SOLO={
  '#ph-select .h2':'¿Qué negocio <span class="gt">cochabambino</span> dirigirás?',
  '#ph-select .lead':'Toca una carta para ver su historia. Cada negocio tiene su propio reto financiero.',
  '#ph-draw1 .h2':'Antes de gastar… <span class="gt">¡dibuja tu plan!</span>',
  '#ph-draw1 .lead':'Usa fichas, flechas y notas para mostrar <strong>dónde pondrías más dinero y por qué</strong>.',
  '#ph-capital .h2':'Reparte tus <span class="gt">Bs 100.000</span>',
  '#ph-capital .lead':'Llena los 5 frascos hasta usar <strong>exactamente</strong> Bs 100.000. El fondo de emergencia te protege si llega una crisis.',
  '#ph-draw2 .h2':'Diseña tu <span class="gt">organigrama</span>',
  '#ph-draw2 .lead':'¿Quién lidera? ¿Quién reporta a quién? Usa la plantilla y conecta cajas con flechas.',
  '#ph-team .h2':'Arma tu <span class="gt">equipo estrella</span>',
  '#ph-team .lead':'Toca una persona y luego el departamento donde trabajará. Si va a su <strong>área ideal ⭐</strong>, rinde más.',
  '#ph-transfer .h2':'De tu empresa a <span class="gt">tu vida personal</span>',
  '#ph-transfer .tr-hero .lead':'Las mismas decisiones las tomarás <strong>con tu propio dinero</strong> todos los meses. La lógica es idéntica: solo cambia la escala.<br>Toca cada tarjeta para darle la vuelta.'
};
function applyModeTexts(){
  Object.entries(SOLO).forEach(([sel,html])=>{document.querySelectorAll(sel).forEach(el=>{if(!el.dataset.orig)el.dataset.orig=el.innerHTML;el.innerHTML=S.mode==='solo'?html:el.dataset.orig})});
  document.querySelectorAll('.team-only').forEach(el=>el.style.display=S.mode==='team'?'':'none');
}
const P=(team,solo)=>S.mode==='solo'?solo:team;

/* ═══════════════════════════════════════
   NAVEGACIÓN
═══════════════════════════════════════ */
const STEPS=['select','draw1','capital','draw2','team','crisis','neg','opp','results'];
const LABELS={setup:'Preparación',select:'Fase 1 de 8 · Negocio',draw1:'Fase 2 de 8 · Pizarra',capital:'Fase 3 de 8 · Capital',draw2:'Fase 4 de 8 · Organigrama',team:'Fase 5 de 8 · Equipo',crisis:'Fase 6 de 8 · Crisis',neg:'Fase 7 de 8 · Negociación',opp:'Fase 8 de 8 · Oportunidad',results:'Resultados',transfer:'Tus finanzas personales'};
const PROG={setup:2,select:8,draw1:18,capital:30,draw2:42,team:52,crisis:64,neg:76,opp:88,results:100,transfer:100};
const INIT={setup:initSetup,select:initSelect,draw1:()=>initDraw('d1'),capital:initCapital,draw2:()=>initDraw('d2'),team:initTeam,crisis:initCrisis,neg:initNeg,opp:initOpp,results:initResults,transfer:initTransfer,proj:()=>{}};
function go(ph){
  document.querySelectorAll('.ph').forEach(p=>p.classList.remove('on'));
  $('ph-'+ph).classList.add('on');S.phase=ph;
  const showHud=!['home','proj'].includes(ph);$('hud').classList.toggle('on',showHud);
  if(showHud){
    const i=STEPS.indexOf(ph);
    $('hud-steps').innerHTML=STEPS.map((s,k)=>`<span class="${ph==='transfer'||k<i?'done':k===i?'now':''}"></span>`).join('');
    $('hud-label').textContent=LABELS[ph]+(S.biz&&ph!=='setup'?'  ·  '+S.biz.em+' '+S.biz.name:'');
    $('hud-name').textContent=S.name||'—';$('hud-av').textContent=S.av;
  }
  AB.reset();clearInterval(skipT);
  window.scrollTo(0,0);
  INIT[ph]&&INIT[ph]();
  if(PROG[ph]&&ph!=='results')Live.push();
}

/* Barra de acción inferior */
const AB={
  reset(){$('actionbar').classList.remove('on');$('ab-back').style.display='none';$('ab-hint').textContent=''},
  set(label,fn,opt){opt=opt||{};const n=$('ab-next');n.innerHTML=label;n.onclick=()=>{if(!n.disabled){Snd.click();fn()}};n.disabled=!!opt.disabled;
    const b=$('ab-back');if(opt.back){b.style.display='';b.onclick=()=>{Snd.click();opt.back()}}else b.style.display='none';
    $('actionbar').classList.add('on');$('ab-hint').textContent=opt.hint||''},
  ok(on,hint){$('ab-next').disabled=!on;$('ab-hint').textContent=on?'':(hint||'')},
  label(l){$('ab-next').innerHTML=l}
};

/* ═══════════════════════════════════════
   INICIO / MODO / CONFIGURACIÓN
═══════════════════════════════════════ */
function initHome(){
  document.querySelectorAll('.stat b[data-count]').forEach((b,i)=>setTimeout(()=>countUp(b,+b.dataset.count,1400,b.dataset.prefix||''),900+i*150));
  const sala=S.sala||new URLSearchParams(location.search).get('sala');
  if(sala){S.sala=sala.toUpperCase();const c=$('home-sala');c.style.display='';c.innerHTML='🟢 Sala <b>'+esc(S.sala)+'</b> · ranking en vivo'}
}
function pickMode(m){Snd.ok();S.mode=m;applyModeTexts();go('setup')}
function initSetup(){
  const t=S.mode==='team';
  $('setup-tag').textContent=t?'👥 Modo equipo':'🙋 Modo individual';
  $('setup-h').innerHTML=t?'¿Cómo se llama <span class="gt">su empresa</span>?':'¿Cómo te <span class="gt">llamas</span>?';
  $('setup-lead').textContent=t?'Pónganse un nombre épico. Así aparecerán en el ranking de la sala.':'Escribe tu nombre o apodo. Así aparecerás en el ranking.';
  $('lbl-name').textContent=t?'Nombre del equipo':'Tu nombre o apodo';
  $('in-name').placeholder=t?'Ej: Los Tigres del Valle':'Ej: Cami R.';
  $('members-field').style.display=t?'':'none';
  $('in-name').value=S.name;$('in-sala').value=S.sala||'';
  $('avs').innerHTML=AVATARS.map(a=>`<button class="av-op${a===S.av?' sel':''}" onclick="pickAv('${a}',this)">${a}</button>`).join('');
  renderMembers();
  AB.set('¡Listos! 🚀',startGame,{back:()=>go('home')});validateSetup();
}
function pickAv(a,el){S.av=a;document.querySelectorAll('.av-op').forEach(b=>b.classList.remove('sel'));el.classList.add('sel');Snd.click()}
function randomName(){$('in-name').value=rnd(TEAM_NAMES);validateSetup();Snd.click()}
function addMember(){const i=$('in-member');const v=i.value.trim();if(!v||S.members.length>=6)return;S.members.push(v);i.value='';renderMembers();Snd.click()}
function delMember(k){S.members.splice(k,1);renderMembers()}
function renderMembers(){$('members').innerHTML=S.members.map((m,k)=>`<span class="member">${esc(m)}<button onclick="delMember(${k})">✕</button></span>`).join('')}
function validateSetup(){const ok=$('in-name').value.trim().length>=2;AB.ok(ok,P('Escriban el nombre del equipo','Escribe tu nombre'))}
async function startGame(){
  S.name=$('in-name').value.trim().slice(0,28);S.sala=$('in-sala').value.trim().toUpperCase();
  if($('in-member').value.trim())addMember();
  Live.push('Preparación');
  const cd=$('countdown');cd.classList.add('on');AB.reset();
  for(const n of[3,2,1]){$('cd-n').innerHTML=`<div class="n">${n}</div>`;Snd.beep();vib(40);await sleep(800)}
  $('cd-n').innerHTML=`<div class="msg">${P('¡Ahora son<br><span class="gt">gerentes!</span> 💼','¡Ahora eres<br><span class="gt">gerente!</span> 💼')}</div>`;Snd.beep(true);vib([60,40,120]);Confetti.burst(120);
  await sleep(1300);cd.classList.remove('on');go('select');
}

/* ═══════════════════════════════════════
   FASE 1 — NEGOCIO
═══════════════════════════════════════ */
function initSelect(){
  $('bgrid').innerHTML=BIZS.map(b=>`
    <div class="bcard${S.biz&&S.biz.id===b.id?' sel':''}" id="bc-${b.id}" onclick="flipBiz('${b.id}',event)">
      <div class="in">
        <div class="bface"><span class="glow" style="background:${b.glow}"></span>
          <div class="bem">${b.em}</div><div class="bname">${b.name}</div><div class="bbarrio">📍 ${b.barrio}</div>
          <div class="btags">${b.tags.map(t=>`<span class="chip ${t.c}">${t.l}</span>`).join('')}</div>
          <div class="bmeta"><div class="stars"><small>Dificultad</small>${'★'.repeat(b.stars)}<span style="opacity:.25">${'★'.repeat(4-b.stars)}</span></div><span class="flip-hint">↻ Toca para ver</span></div>
        </div>
        <div class="bface back">
          <div class="bname" style="font-size:1.1rem">${b.em} ${b.name}</div>
          <p class="bdesc" style="margin-top:8px">${b.desc}</p>
          <div class="blesson"><b>Reto financiero</b>${b.lesson}</div>
          <button class="btn bpick" style="margin-top:auto" onclick="pickBiz('${b.id}',event)">Elegir este negocio ✓</button>
        </div>
      </div>
    </div>`).join('');
  $('bdots').innerHTML=BIZS.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('');
  $('bgrid').onscroll=()=>{const g=$('bgrid');const w=g.firstElementChild.offsetWidth+14;const k=Math.round(g.scrollLeft/w);document.querySelectorAll('#bdots i').forEach((d,j)=>d.classList.toggle('on',j===k))};
  AB.set('Dirigir este negocio →',()=>go('draw1'),{disabled:!S.biz,hint:'Toquen una carta y elijan su negocio',back:()=>go('setup')});
  if(!S.biz)AB.ok(false,P('Toquen una carta y elijan su negocio','Toca una carta y elige tu negocio'));
}
function flipBiz(id,e){
  const c=$('bc-'+id);Snd.whoosh();
  document.querySelectorAll('.bcard.flip').forEach(x=>{if(x!==c)x.classList.remove('flip')});
  c.classList.toggle('flip');
}
function pickBiz(id,e){
  e.stopPropagation();
  S.biz=BIZS.find(b=>b.id===id);S.met={...S.biz.base};
  document.querySelectorAll('.bcard').forEach(x=>x.classList.toggle('sel',x.id==='bc-'+id));
  document.querySelectorAll('.bz-name').forEach(x=>x.textContent=S.biz.name);
  Snd.ok();vib(30);const r=e.target.getBoundingClientRect();Confetti.burst(50,r.left+r.width/2,r.top);
  AB.ok(true);AB.label(`Dirigir ${S.biz.em} ${S.biz.name.split('"')[1]||'este negocio'} →`);
  $('hud-label').textContent=LABELS.select+'  ·  '+S.biz.em+' '+S.biz.name;
}

/* ═══════════════════════════════════════
   PIZARRAS (fases 2 y 4)
═══════════════════════════════════════ */
let skipT=null;
function initDraw(k){
  refreshThumb(k);
  const next=k==='d1'?'capital':'team',back=k==='d1'?'select':'capital';
  AB.set('Continuar →',()=>go(next),{back:()=>go(back)});
  updDrawAB(k);
}
function updDrawAB(k){
  clearInterval(skipT);
  if(Board.info(k).used){AB.ok(true);AB.label(k==='d1'?'Continuar a finanzas →':'Asignar al equipo →');return}
  let s=8;AB.ok(false,P('Abran la pizarra y dibujen su plan ✏️','Abre la pizarra y dibuja tu plan ✏️'));AB.label(`Omitir pizarra (${s}s)`);
  skipT=setInterval(()=>{s--;if(s<=0){clearInterval(skipT);AB.ok(true);AB.label('Continuar sin dibujar →')}else AB.label(`Omitir pizarra (${s}s)`)},1000);
}
function openBoard(k){
  Snd.whoosh();
  Board.open(k,{...BOARDS[k],onClose:(png,used,n)=>{
    S.boards[k]=used;refreshThumb(k);if(S.phase===(k==='d1'?'draw1':'draw2'))updDrawAB(k);n=Board.info(k).items;
    if(used){Snd.ok();toast(`✏️ Pizarra guardada · ${n} elemento${n!==1?'s':''}`)}
    Live.push();
  }});
}
function refreshThumb(k){
  const box=$('dopen-'+k);const inf=Board.info(k);
  const old=box.querySelector('img');if(old)old.remove();
  box.classList.toggle('has',!!inf.png);
  if(inf.png){const im=new Image();im.src=inf.png;im.alt='Pizarra';box.prepend(im);box.querySelector('.cta b').textContent='✏️ Editar pizarra'}
  else box.querySelector('.cta b').textContent='Abrir pizarra';
}

/* ═══════════════════════════════════════
   JUSTIFICACIONES
═══════════════════════════════════════ */
const JUST_MIN=45;
const JQ={cap:['¿Por qué repartieron el capital así?','¿Por qué repartiste el capital así?'],team:['¿Por qué asignaron a las personas de esta manera?','¿Por qué asignaste a las personas así?'],crisis:['¿Por qué eligieron esta opción ante la crisis?','¿Por qué elegiste esta opción ante la crisis?'],neg:['¿Qué estrategia siguieron en las 3 negociaciones?','¿Qué estrategia seguiste en las 3 negociaciones?'],opp:['¿Por qué tomaron esta decisión ante la oportunidad?','¿Por qué tomaste esta decisión ante la oportunidad?']};
let onJust=()=>{};
function renderJust(key,boxId,cb){
  onJust=cb;
  $(boxId).innerHTML=`<div class="just">
    <div class="just-h"><span style="font-size:1.3rem">✍️</span><b>Justificación obligatoria</b></div>
    <p class="just-q">${P(JQ[key][0],JQ[key][1])} ${S.mode==='team'?'<br>💬 <i>Debatan un minuto y escriban su razonamiento.</i>':''}</p>
    <div class="starters">${STARTERS[key].map(s=>`<button class="starter" onclick="useStarter('${key}',this)">${s}</button>`).join('')}</div>
    <div class="ta-wrap"><textarea class="ta" id="ta-${key}" placeholder="Escriban aquí…" oninput="justInput('${key}')">${esc(S.justif[key])}</textarea>
    <button class="mic" id="mic-${key}" onclick="dictate('${key}')" title="Dictar con la voz" style="${'webkitSpeechRecognition'in window||'SpeechRecognition'in window?'':'display:none'}">🎤</button></div>
    <div class="just-foot"><div class="cnt" id="cnt-${key}"><div class="bar"><i></i></div><span></span></div></div>
  </div>`;
  justInput(key,true);
}
function useStarter(key,btn){const ta=$('ta-'+key);const t=btn.textContent;ta.value=(ta.value.trim()?ta.value.trim()+' ':'')+t;ta.focus();const p=ta.value.indexOf('…');if(p>=0)ta.setSelectionRange(p,p+1);justInput(key);Snd.click()}
function justInput(key,silent){
  const ta=$('ta-'+key);if(!ta)return;S.justif[key]=ta.value.trim();
  const n=S.justif[key].replace(/…/g,'').length;const c=$('cnt-'+key);
  c.classList.toggle('ok',n>=JUST_MIN);c.querySelector('i').style.width=Math.min(100,n/JUST_MIN*100)+'%';
  c.querySelector('span').textContent=n>=JUST_MIN?'✓ Listo':`${n} / ${JUST_MIN} caracteres`;
  onJust();
}
const justOk=k=>(S.justif[k]||'').replace(/…/g,'').length>=JUST_MIN;
let recog=null;
function dictate(key){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;
  const b=$('mic-'+key);if(recog){recog.stop();return}
  recog=new SR();recog.lang='es-BO';recog.interimResults=false;recog.continuous=false;
  b.classList.add('rec');
  recog.onresult=e=>{const t=e.results[0][0].transcript;const ta=$('ta-'+key);ta.value=(ta.value.trim()+' '+t).trim();justInput(key)};
  recog.onend=()=>{b.classList.remove('rec');recog=null};recog.onerror=()=>{b.classList.remove('rec');recog=null};
  recog.start();
}

/* ═══════════════════════════════════════
   FASE 3 — CAPITAL
═══════════════════════════════════════ */
const TOTAL=100000,STEP=5000;
let capDone=false,lastArea=null;
const totalCap=()=>Object.values(S.cap).reduce((a,b)=>a+b,0);
function initCapital(){
  $('jars').innerHTML=AREAS.map(a=>`
    <div class="jar" id="jar-${a.id}" style="--jc:${a.col}">
      <div class="liquid" id="liq-${a.id}"></div>
      <div class="jar-top"><div class="jar-ic">${a.icon}</div><div><div class="jar-name">${a.name}</div><div class="jar-hint">${a.hint}</div></div></div>
      <div class="jar-amt" id="amt-${a.id}">Bs 0</div>
      <div class="jar-ctrl">
        <button class="step" onclick="capStep('${a.id}',-1,event)" aria-label="Quitar">−</button>
        <input class="rng" type="range" min="0" max="${TOTAL}" step="1000" value="${S.cap[a.id]}" id="rng-${a.id}" oninput="capSet('${a.id}',+this.value)" aria-label="${a.name}">
        <button class="step plus" onclick="capStep('${a.id}',1,event)" aria-label="Agregar">+</button>
      </div>
    </div>`).join('');
  renderJust('cap','just-cap',capAB);
  AB.set('Organizar el equipo →',()=>go('draw2'),{back:()=>go('draw1')});
  capDone=totalCap()===TOTAL;updCap();
}
function capStep(id,d,e){
  const rem=TOTAL-totalCap();
  if(d>0){
    if(rem<=0){$('budget').classList.remove('over');void $('budget').offsetWidth;$('budget').classList.add('over');Snd.bad();vib(80);toast('💸 ¡Ya no queda dinero! Quiten de otro frasco.');return}
    const add=Math.min(STEP,rem);S.cap[id]+=add;Snd.coin();vib(15);
    if(e){const r=e.target.getBoundingClientRect();floatFx('+'+fmt(add),r.left,r.top,AREAS.find(a=>a.id===id).col)}
  }else{if(S.cap[id]<=0)return;S.cap[id]=Math.max(0,S.cap[id]-STEP);Snd.click()}
  lastArea=id;updCap();
}
function capSet(id,v){const max=S.cap[id]+(TOTAL-totalCap());S.cap[id]=Math.max(0,Math.min(v,max));if(v>max){$('rng-'+id).value=S.cap[id]}lastArea=id;updCap()}
function fillRest(){const rem=TOTAL-totalCap();if(rem<=0)return;S.cap.res+=rem;lastArea='res';Snd.coin();updCap()}
function updCap(){
  const used=totalCap(),rem=TOTAL-used,pct=Math.round(used/TOTAL*100);
  AREAS.forEach(a=>{const v=S.cap[a.id];$('amt-'+a.id).innerHTML=fmt(v)+`<span class="jar-pct">${Math.round(v/TOTAL*100)} %</span>`;
    const lq=$('liq-'+a.id);lq.style.height=Math.min(100,v/TOTAL*100*1.6)+'%';lq.style.setProperty('--fillw',Math.min(100,v/TOTAL*100*1.6)+'%');const r=$('rng-'+a.id);r.value=v;r.style.setProperty('--v',(v/TOTAL*100)+'%');$('jar-'+a.id).classList.toggle('act',v>0)});
  const b=$('budget');b.classList.toggle('ok',rem===0);
  $('bud-n').textContent=fmt(rem);$('bud-pct').textContent=pct+'%';
  const ring=$('bud-ring');ring.style.setProperty('--p',pct);ring.style.setProperty('--rc',rem===0?'#B8F34A':'#FF8A00');
  $('fill-rest').style.display=rem>0&&used>0?'':'none';
  if(rem===0&&!capDone){capDone=true;Snd.ok();vib([30,30,60]);Confetti.burst(90);toast('🎯 ¡Cuadre perfecto! Bs 100.000 asignados')}
  if(rem>0)capDone=false;
  advisor();renderCapMets();capAB();
}
function advisor(){
  const used=totalCap(),rem=TOTAL-used;let face='🧑‍💼',msg='';
  const big=AREAS.find(a=>S.cap[a.id]/TOTAL>.55);
  const zero=AREAS.slice(0,4).filter(a=>S.cap[a.id]===0);
  if(used===0)msg=P('Toquen <strong>+</strong> para meter billetes en cada frasco. ¡Miren cómo cambian los indicadores!','Toca <strong>+</strong> para meter billetes en cada frasco. ¡Mira cómo cambian los indicadores!');
  else if(big){face='🤔';msg=`Más del 55 % en <strong>${big.name}</strong>: después de cierto punto, cada boliviano extra rinde menos (rendimientos decrecientes).`}
  else if(rem===0&&S.cap.res===0){face='😬';msg='Cuadraron… ¡pero <strong>sin fondo de emergencia</strong>! Si llega una crisis, el golpe será 1,8 veces más fuerte.'}
  else if(rem===0){face='🤩';msg=P('¡Cuadre perfecto! Ahora <strong>expliquen por qué</strong> repartieron así.','¡Cuadre perfecto! Ahora <strong>explica por qué</strong> repartiste así.')}
  else if(S.cap.res===0&&used>=50000){face='😬';msg='¿Y la reserva? <strong>Sin fondo de emergencia</strong>, la primera crisis puede cerrar el negocio.'}
  else if(zero.length&&used>=60000){face='🤔';msg=`Ojo: dejar <strong>${zero.map(z=>z.name).join(', ')}</strong> en cero tiene penalización.`}
  else if(lastArea){msg=AREAS.find(a=>a.id===lastArea).tip}
  const f=$('adv-face');if(f.textContent!==face){f.textContent=face;f.classList.remove('bump');void f.offsetWidth;f.classList.add('bump')}
  $('adv-txt').innerHTML=msg;
}
function projMet(){
  const m={...S.biz.base};const mods=S.biz.mods;
  AREAS.forEach(a=>{const fx=a.fx(S.cap[a.id]/500);Object.keys(fx).forEach(k=>m[k]+=fx[k]*(mods[a.id]||1))});return m;
}
let prevBM=null;
function renderCapMets(){const m=projMet();$('cap-mets').innerHTML=metBars(m);drawRadar($('cap-radar'),m,{mini:true});
  $('bud-mets').innerHTML=METS.map(x=>{const v=Math.round(clamp(m[x.id]));const d=prevBM?v-prevBM[x.id]:0;return`<div class="bm${d>0?' up':d<0?' down':''}"><b style="color:${x.col}">${v}</b>${x.ic}</div>`}).join('');
  prevBM=Object.fromEntries(METS.map(x=>[x.id,Math.round(clamp(m[x.id]))]))}
function metBars(m){return METS.map(x=>`<div class="mrow"><span class="mi">${x.ic}</span><span class="mn">${x.lbl}</span><div class="mb"><i style="width:${clamp(m[x.id])}%;background:${x.col}"></i></div><span class="mv">${Math.round(clamp(m[x.id]))}</span></div>`).join('')}
function capAB(){const t=totalCap();AB.ok(t===TOTAL&&justOk('cap'),t!==TOTAL?`Faltan ${fmt(TOTAL-t)} por asignar`:P('Escriban su justificación (mín. 45 caracteres)','Escribe tu justificación (mín. 45 caracteres)'))}

/* ═══════════════════════════════════════
   FASE 5 — EQUIPO
═══════════════════════════════════════ */
const teamCount=()=>{const c={prod:0,ven:0,aten:0,inn:0,adm:0};Object.values(S.team).forEach(d=>c[d]++);return c};
function initTeam(){S.sel=null;renderJust('team','just-team',teamAB);renderTeam();AB.set('Enfrentar los desafíos →',()=>{resolveAll();go('crisis')},{back:()=>go('draw2')});teamAB()}
function renderTeam(){
  $('roster').innerHTML=PEOPLE.map(p=>{const d=S.team[p.id];const ideal=DEPTOS.find(x=>x.id===p.ideal);
    return`<button class="person${S.sel===p.id?' sel':''}${d?' placed':''}" onclick="selPerson('${p.id}')"><div class="pa">${p.av}</div><div class="pn">${p.name}</div><div class="pt">${p.talent}</div><div class="pi">⭐ ${ideal.ic} ${ideal.name.split(' ')[0]}</div></button>`}).join('');
  $('depts').innerHTML=DEPTOS.map(d=>{const ps=PEOPLE.filter(p=>S.team[p.id]===d.id);
    return`<div class="dept${S.sel?' target':''}${ps.length?' has':''}" onclick="placeIn('${d.id}')" role="button" tabindex="0">
      <div class="dept-top"><div class="dept-ic">${d.ic}</div><div><div class="dept-n">${d.name}</div><div class="dept-d">${d.desc}</div><div class="dept-ef">${d.ef}</div></div></div>
      <div class="slots">${ps.length?ps.map(p=>`<span class="slot${p.ideal===d.id?' match':''}" onclick="event.stopPropagation();unplace('${p.id}')" title="Quitar a ${p.name}">${p.av}</span>`).join(''):`<span class="slot-empty">${S.sel?'👆 Toca para asignar aquí':'Sin personas · penaliza'}</span>`}</div>
    </div>`}).join('');
}
function selPerson(id){S.sel=S.sel===id?null:id;Snd.click();renderTeam()}
function placeIn(dep){
  if(!S.sel){toast(P('👆 Primero toquen una persona','👆 Primero toca una persona'));return}
  const p=PEOPLE.find(x=>x.id===S.sel);S.team[p.id]=dep;S.sel=null;
  if(p.ideal===dep){Snd.ok();vib([20,30,40]);toast(`⭐ ¡Match! ${p.name}: ${p.talent.toLowerCase()}`)}else{Snd.coin();vib(15)}
  const next=PEOPLE.find(x=>!S.team[x.id]);if(next)S.sel=next.id;
  renderTeam();teamAB();
}
function unplace(id){delete S.team[id];S.sel=id;Snd.click();renderTeam();teamAB()}
function teamAB(){const n=Object.keys(S.team).length;AB.ok(n===5&&justOk('team'),n<5?`Faltan ${5-n} persona${5-n>1?'s':''} por asignar`:P('Escriban su justificación (mín. 45 caracteres)','Escribe tu justificación (mín. 45 caracteres)'))}

/* Cálculo del puntaje (lógica original + bonus de talento) */
function resolveAll(){
  const m={...S.biz.base};const mods=S.biz.mods;const T=teamCount();
  AREAS.forEach(a=>{const fx=a.fx(S.cap[a.id]/500);Object.keys(fx).forEach(k=>m[k]+=fx[k]*(mods[a.id]||1))});
  if(S.cap.mkt===0){m.cli-=9;m.cre-=7}
  if(S.cap.ops===0){m.rent-=10;m.cli-=5;m.sos-=4}
  if(S.cap.rrhh===0){m.eq-=12;m.sos-=7;m.rent-=3}
  if(S.cap.inf===0){m.rent-=6;m.eq-=4;m.sos-=3}
  AREAS.forEach(a=>{const pct=S.cap[a.id]/TOTAL;if(pct>.55){const pf=(pct-.55)*1.4;const fx=a.fx((pct-.55)*TOTAL/500);Object.keys(fx).forEach(k=>m[k]-=fx[k]*(mods[a.id]||1)*pf)}});
  S.noRes=S.cap.res===0;
  DEPTOS.forEach(d=>Object.keys(d.eff).forEach(k=>m[k]+=d.eff[k]*T[d.id]));
  if(T.prod===0){m.rent-=8;m.sos-=4}
  if(T.ven===0){m.cli-=10;m.cre-=6}
  if(T.adm===0){m.rent-=6;m.eq-=5;m.sos-=4}
  const maxT=Math.max(...Object.values(T));if(maxT>=4){const ex=maxT-3;m.rent-=ex*3;m.sos-=ex*3;m.eq-=ex*2}
  S.matches=0;PEOPLE.forEach(p=>{if(S.team[p.id]===p.ideal){S.matches++;const b=DEPTOS.find(d=>d.id===p.ideal).bonus;Object.keys(b).forEach(k=>m[k]+=b[k])}});
  const allF=AREAS.slice(0,4).every(a=>S.cap[a.id]>0),allS=DEPTOS.every(d=>T[d.id]>0),capC=Math.max(...Object.values(S.cap))/TOTAL;
  if(allF&&allS&&capC<=.40)METS.forEach(x=>m[x.id]+=10);else if(allF&&allS)METS.forEach(x=>m[x.id]+=5);else if(allF&&capC<=.50)METS.forEach(x=>m[x.id]+=3);
  S.met=m;
}
function applyFx(fx,mult,amp){
  const before={...S.met};
  Object.keys(fx).forEach(k=>{let d=Math.round(fx[k]*(mult||1));if(amp&&d<0)d=Math.round(d*1.8);S.met[k]+=d});
  Object.keys(S.met).forEach(k=>S.met[k]=clamp(S.met[k]));
  return before;
}

/* Tarjetas de opciones */
function optCards(opts,type,mult){
  return opts.map((o,i)=>{const chips=Object.entries(o.fx).map(([k,v])=>[k,Math.round(v*(mult||1))]).filter(([,v])=>v).map(([k,v])=>{const mt=METS.find(x=>x.id===k);return`<span class="fx ${v>0?'p':'n'}">${v>0?'+':''}${v} ${mt.ic} ${mt.lbl}</span>`}).join('');
    return`<button class="opt" onclick="pickOpt('${type}',${i},this)"><span class="let">${'ABC'[i]}</span><span><div class="ol">${o.lbl}</div><div class="os">${o.sub}</div><div class="fxs">${chips}</div></span></button>`}).join('');
}
function pickOpt(type,i,el){
  el.parentElement.querySelectorAll('.opt').forEach(o=>o.classList.remove('sel'));el.classList.add('sel');Snd.click();vib(15);
  if(type==='crisis'){S.cOpt=i;stopTimer();crAB()}
  if(type==='opp'){S.oppOpt=i;oppAB()}
}

/* Pantalla de impacto */
function showImpact(before,title,sub,cb){
  $('imp-t').textContent=title;$('imp-s').innerHTML=sub||'';
  $('imp-rows').innerHTML=METS.map(x=>{const d=Math.round(S.met[x.id]-before[x.id]);return`<div class="mrow"><span class="mi">${x.ic}</span><span class="mn">${x.lbl}</span><div class="mb"><i id="imb-${x.id}" style="width:${clamp(before[x.id])}%;background:${x.col}"></i></div><span class="mv">${Math.round(S.met[x.id])}</span><span class="delta ${d>0?'p':d<0?'n':'z'}">${d>0?'+':''}${d||'±0'}</span></div>`}).join('');
  $('impact').classList.add('on');
  const net=METS.reduce((a,x)=>a+S.met[x.id]-before[x.id],0);
  setTimeout(()=>{METS.forEach(x=>$('imb-'+x.id).style.width=clamp(S.met[x.id])+'%');net>=0?Snd.ok():Snd.bad();vib(net>=0?[20,40,20]:120)},250);
  $('imp-btn').onclick=()=>{$('impact').classList.remove('on');Snd.click();cb()};
}

/* ═══════════════════════════════════════
   FASE 6 — CRISIS
═══════════════════════════════════════ */
let tmr=null;
function initCrisis(){
  if(!S.crisis){S.crisis=rnd(CRISES);S.cOpt=null;S.timedOut=false}
  const c=S.crisis;$('cr-ic').textContent=c.ic;$('cr-t').textContent=c.title;$('cr-d').textContent=c.desc;$('cr-loc').textContent=c.loc;
  $('cr-warn').style.display=S.noRes?'':'none';
  $('cr-opts').innerHTML=optCards(c.opts,'crisis');
  renderJust('crisis','just-crisis',crAB);
  AB.set('Confirmar decisión →',confirmCrisis);crAB();
  const bk=$('breaking');bk.classList.add('on');Snd.alarm();vib([200,100,200,100,300]);bk.classList.add('shake-screen');
  setTimeout(()=>{bk.classList.remove('on','shake-screen');const ph=$('ph-crisis');ph.classList.add('shake-screen');setTimeout(()=>ph.classList.remove('shake-screen'),600);startTimer(60)},2600);
}
function startTimer(sec){
  stopTimer();let s=sec;const T=$('cr-timer');T.classList.remove('low','done');
  const upd=()=>{$('cr-tnum').textContent=s+'s';$('cr-tbar').style.width=(s/sec*100)+'%';T.classList.toggle('low',s<=10)};upd();
  tmr=setInterval(()=>{s--;upd();if(s<=10&&s>0)Snd.tick();if(s<=0){stopTimer();timeUp()}},1000);
}
function stopTimer(){clearInterval(tmr);tmr=null}
function timeUp(){
  if(S.cOpt!==null)return;S.timedOut=true;$('cr-timer').classList.add('done');$('cr-tnum').textContent='⏰';
  S.met.sos=clamp(S.met.sos-4);S.met.eq=clamp(S.met.eq-2);Snd.bad();vib(300);
  toast('⏰ ¡Se acabó el tiempo! La indecisión cuesta: −4 🌱 −2 🤝',3500);
}
function crAB(){AB.ok(S.cOpt!==null&&justOk('crisis'),S.cOpt===null?P('Elijan una opción','Elige una opción'):P('Escriban su justificación (mín. 45 caracteres)','Escribe tu justificación (mín. 45 caracteres)'))}
function confirmCrisis(){
  stopTimer();const o=S.crisis.opts[S.cOpt];const before=applyFx(o.fx,1,S.noRes);
  showImpact(before,'Impacto de la crisis',`Eligieron: <strong>${o.lbl}</strong>${S.noRes?'<br>⚠️ Sin fondo de emergencia: daños ×1,8':''}`,()=>go('neg'));
}

/* ═══════════════════════════════════════
   FASE 7 — NEGOCIACIÓN (3 rondas en chat)
═══════════════════════════════════════ */
let chatBusy=false;
function initNeg(){
  if(!S.negs.length){S.negs=['cliente','proveedor','distribuidor'].map(t=>rnd(NEGS.filter(n=>n.tipo===t)));S.negOpts=[null,null,null];S.negRound=0}
  $('just-neg').innerHTML='';
  AB.set('Confirmar negociaciones →',confirmNeg,{disabled:true,hint:'Completen las 3 rondas'});
  playRound(S.negRound);
}
function renderRounds(){$('rounds').innerHTML=S.negs.map((n,i)=>`<span class="round ${i<S.negRound||S.negOpts[i]!==null?'done':i===S.negRound?'now':''}">${S.negOpts[i]!==null?'✓':i+1} ${n.badge}</span>`).join('')}
async function playRound(r){
  const n=S.negs[r];renderRounds();chatBusy=true;
  $('ch-av').textContent=n.ic;$('ch-name').textContent=n.who;$('ch-status').textContent=n.role;$('ch-badge').textContent='Ronda '+(r+1)+'/3 · '+n.badge;
  const b=$('chat-b'),f=$('chat-f');b.innerHTML='';f.innerHTML='';
  addMsg('sys','📍 '+n.loc);
  for(const m of n.msgs){await typing(700);addMsg('them',m);Snd.click()}
  await sleep(300);
  f.innerHTML=`<span class="lbl" style="margin:0">${P('Elijan su respuesta','Elige tu respuesta')}</span>`+n.opts.map((o,i)=>{const chips=Object.entries(o.fx).map(([k,v])=>[k,Math.round(v*NEG_WEIGHT)]).filter(([,v])=>v).map(([k,v])=>{const mt=METS.find(x=>x.id===k);return`<span class="fx ${v>0?'p':'n'}">${v>0?'+':''}${v} ${mt.ic}</span>`}).join('');
    return`<button class="reply" style="animation-delay:${i*.08}s" onclick="answer(${r},${i})"><b>${'ABC'[i]}. ${o.lbl}</b><span>${o.sub}</span><div class="fxs">${chips}</div></button>`}).join('');
  chatBusy=false;setTimeout(()=>f.scrollIntoView({behavior:'smooth',block:'center'}),120);
}
function addMsg(who,html){const d=document.createElement('div');d.className='msg '+who;d.innerHTML=html;$('chat-b').appendChild(d);d.scrollIntoView({block:'nearest',behavior:'smooth'})}
async function typing(ms){const t=document.createElement('div');t.className='typing';t.innerHTML='<i></i><i></i><i></i>';$('chat-b').appendChild(t);await sleep(ms);t.remove()}
async function answer(r,i){
  if(chatBusy)return;chatBusy=true;const n=S.negs[r],o=n.opts[i];S.negOpts[r]=i;Snd.whoosh();vib(15);
  $('chat-f').innerHTML='';addMsg('me',esc(o.lbl));
  await typing(900);addMsg('them',o.r);
  const deltas=Object.entries(o.fx).map(([k,v])=>[k,Math.round(v*NEG_WEIGHT)]).filter(([,v])=>v);
  const rc=$('chat-b').getBoundingClientRect();
  deltas.forEach(([k,v],j)=>setTimeout(()=>{const mt=METS.find(x=>x.id===k);floatFx(`${v>0?'+':''}${v} ${mt.ic}`,rc.left+rc.width*(.2+j*.15),rc.bottom-40,v>0?'#B8F34A':'#FF8A94')},j*120));
  const net=deltas.reduce((a,[,v])=>a+v,0);net>=0?Snd.coin():Snd.bad();
  await sleep(500);addMsg('sys',i===1?'🤝 Trato ganar-ganar':'✓ Trato cerrado');
  renderRounds();
  if(r<2){$('chat-f').innerHTML=`<button class="btn" onclick="S.negRound=${r+1};playRound(${r+1});window.scrollTo({top:$('rounds').offsetTop-80,behavior:'smooth'})">Siguiente ronda: ${S.negs[r+1].badge} →</button>`;chatBusy=false;setTimeout(()=>$('chat-f').scrollIntoView({behavior:'smooth',block:'center'}),100)}
  else{S.negRound=3;chatBusy=false;$('chat-f').innerHTML=`<div class="msg sys" style="align-self:center">✅ ${P('¡Completaron las 3 negociaciones!','¡Completaste las 3 negociaciones!')}</div>`;
    renderJust('neg','just-neg',negAB);negAB();setTimeout(()=>$('just-neg').scrollIntoView({behavior:'smooth',block:'center'}),300)}
}
function negAB(){const done=S.negOpts.every(x=>x!==null);AB.ok(done&&justOk('neg'),!done?'Completen las 3 rondas':P('Escriban su justificación (mín. 45 caracteres)','Escribe tu justificación (mín. 45 caracteres)'))}
function confirmNeg(){
  const fx={rent:0,eq:0,cli:0,cre:0,sos:0};S.negs.forEach((n,i)=>{const o=n.opts[S.negOpts[i]];Object.keys(o.fx).forEach(k=>fx[k]+=Math.round(o.fx[k]*NEG_WEIGHT))});
  const before=applyFx(fx,1);const wins=S.negOpts.filter(x=>x===1).length;
  showImpact(before,'Impacto de las negociaciones',`${wins} de 3 tratos con postura ganar-ganar 🤝`,()=>go('opp'));
}

/* ═══════════════════════════════════════
   FASE 8 — OPORTUNIDAD (carta sorpresa)
═══════════════════════════════════════ */
function initOpp(){
  if(!S.opp){S.opp=rnd(OPPS);S.oppOpt=null;S.oppShown=false}
  const o=S.opp;$('op-ic').textContent=o.ic;$('op-t').textContent=o.title;$('op-d').textContent=o.desc;$('op-loc').textContent=o.loc;
  $('scard').classList.toggle('rev',S.oppShown);
  $('op-opts').innerHTML=S.oppShown?optCards(o.opts,'opp'):'';$('just-opp').innerHTML='';
  if(S.oppShown)renderJust('opp','just-opp',oppAB);
  AB.set('Ver resultados 🏁',confirmOpp,{disabled:true,hint:P('Toquen la carta para revelarla','Toca la carta para revelarla')});if(S.oppShown)oppAB();
}
function revealOpp(){
  if(S.oppShown)return;S.oppShown=true;$('scard').classList.add('rev');Snd.whoosh();vib(30);
  setTimeout(()=>{Snd.ok();const r=$('scard').getBoundingClientRect();Confetti.burst(80,r.left+r.width/2,r.top+r.height/2);
    $('op-opts').innerHTML=optCards(S.opp.opts,'opp');renderJust('opp','just-opp',oppAB);oppAB()},700);
}
function oppAB(){AB.ok(S.oppOpt!==null&&justOk('opp'),S.oppOpt===null?P('Elijan una opción','Elige una opción'):P('Escriban su justificación (mín. 45 caracteres)','Escribe tu justificación (mín. 45 caracteres)'))}
function confirmOpp(){const o=S.opp.opts[S.oppOpt];const before=applyFx(o.fx,1);showImpact(before,'Impacto de la oportunidad',`Eligieron: <strong>${o.lbl}</strong>`,()=>go('results'))}

/* ═══════════════════════════════════════
   RESULTADOS
═══════════════════════════════════════ */
function initResults(){
  const avg=avgOf(S.met);S.score=avg;const [,tier,sub]=TIERS.find(([t])=>avg>=t);S.tier=tier;S.finished=true;S.perfil=perfil().name;
  $('sc-tier').textContent=tier;$('sc-sub').textContent=sub;
  $('sc-who').innerHTML=`<span class="chip">${S.av} ${esc(S.name)}</span><span class="chip">${S.biz.em} ${S.biz.name}</span>${S.members.length?`<span class="chip">👥 ${esc(S.members.join(', '))}</span>`:''}`;
  const sc=$('score');sc.style.setProperty('--p',0);const t0=performance.now();
  (function u(n){const t=Math.min((n-t0)/1600,1),e=1-Math.pow(1-t,3);sc.style.setProperty('--p',avg*e);$('sc-n').textContent=Math.round(avg*e);if(t<1)requestAnimationFrame(u)})(t0);
  setTimeout(()=>{Snd.fanfare();vib([50,50,50,50,200]);if(avg>=47)Confetti.burst(avg>=63?220:110)},1500);
  $('fin-mets').innerHTML=metBars(S.met);drawRadar($('radar'),S.met,{anim:true});
  $('res-boards').innerHTML=['d1','d2'].map(k=>{const i=Board.info(k);return`<figure>${i.png?`<img src="${i.png}" alt="">`:'<span>Sin dibujo</span>'}<figcaption>${k==='d1'?'✏️ Boceto':'🏗️ Organigrama'}</figcaption></figure>`}).join('');
  renderFeedback();renderTimeline();
  $('malla').innerHTML=MALLA.map(m=>`<div class="mcard"><span class="mi">${m.ic}</span><div><div class="ma">${m.a}</div><div class="ms">${m.s}</div><span class="sem">${m.sem}</span></div></div>`).join('');
  const sent=$('sent-msg');
  if(Live.enabled()){sent.style.display='';sent.innerHTML='📡 Enviando resultado al ranking de la sala <b>'+esc(S.sala)+'</b>…';Live.push('Terminó',()=>{sent.innerHTML='✅ Resultado en el ranking de la sala <b>'+esc(S.sala)+'</b>'})}
  else sent.style.display='none';
  AB.set('💡 ¿Y mis finanzas personales? →',()=>go('transfer'));
}
function drawRadar(svg,m,o){
  o=o||{};const mini=o.mini;const W=mini?240:420,H=mini?220:400,cx=W/2,cy=mini?112:200,R=mini?78:118;
  const n=METS.length,ang=METS.map((_,i)=>-Math.PI/2+i*2*Math.PI/n);
  const pt=(r,a)=>`${(cx+r*Math.cos(a)).toFixed(1)},${(cy+r*Math.sin(a)).toFixed(1)}`;
  let h=`<defs><linearGradient id="rg${mini?'m':'f'}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC23D" stop-opacity=".55"/><stop offset=".5" stop-color="#FF8A00" stop-opacity=".4"/><stop offset="1" stop-color="#FF3D7F" stop-opacity=".45"/></linearGradient></defs>`;
  for(let l=1;l<=4;l++)h+=`<polygon points="${ang.map(a=>pt(R*l/4,a)).join(' ')}" fill="none" stroke="rgba(255,255,255,${l===4?.16:.07})"/>`;
  ang.forEach(a=>h+=`<line x1="${cx}" y1="${cy}" x2="${pt(R,a).split(',')[0]}" y2="${pt(R,a).split(',')[1]}" stroke="rgba(255,255,255,.07)"/>`);
  h+=`<polygon id="rp${mini?'m':'f'}" fill="url(#rg${mini?'m':'f'})" stroke="#FF8A00" stroke-width="${mini?2:3}" stroke-linejoin="round" points="${ang.map((a,i)=>pt(o.anim?0:R*clamp(m[METS[i].id])/100,a)).join(' ')}" style="filter:drop-shadow(0 0 12px rgba(255,138,0,.5))"/>`;
  METS.forEach((x,i)=>{const r=R*clamp(m[x.id])/100;
    if(!mini)h+=`<circle class="rdot" data-i="${i}" cx="${pt(o.anim?0:r,ang[i]).split(',')[0]}" cy="${pt(o.anim?0:r,ang[i]).split(',')[1]}" r="6" fill="${x.col}" stroke="#120A1E" stroke-width="2"/>`;
    const lr=R+(mini?20:38);const [lx,ly]=pt(lr,ang[i]).split(',').map(Number);const anc=Math.abs(lx-cx)<8?'middle':lx>cx?'start':'end';
    h+=`<text x="${lx}" y="${ly-(mini?0:6)}" text-anchor="${anc}" font-size="${mini?10:14}" font-weight="700" fill="${x.col}" font-family="Plus Jakarta Sans,sans-serif">${mini?x.ic:x.ic+' '+x.lbl}</text>`;
    if(!mini)h+=`<text x="${lx}" y="${ly+12}" text-anchor="${anc}" font-size="13" fill="rgba(255,240,225,.7)" font-family="JetBrains Mono,monospace">${Math.round(m[x.id])}</text>`;
  });
  if(!mini)svg.setAttribute('viewBox','-75 0 570 400');
  svg.innerHTML=h;
  if(o.anim){const poly=svg.querySelector('polygon[id^=rp]');const dots=svg.querySelectorAll('.rdot');const t0=performance.now();
    (function u(nw){const t=Math.min((nw-t0)/1300,1),e=1-Math.pow(1-t,3);poly.setAttribute('points',ang.map((a,i)=>pt(R*clamp(m[METS[i].id])/100*e,a)).join(' '));
      dots.forEach(d=>{const i=+d.dataset.i;const [x,y]=pt(R*clamp(m[METS[i].id])/100*e,ang[i]).split(',');d.setAttribute('cx',x);d.setAttribute('cy',y)});if(t<1)requestAnimationFrame(u)})(t0)}
}
function analyzeOpt(opt,mult){
  const fx=Object.fromEntries(Object.entries(opt.fx).map(([k,v])=>[k,Math.round(v*(mult||1))]));
  const net=Object.values(fx).reduce((a,b)=>a+b,0);
  const pos=Object.entries(fx).filter(([,v])=>v>0).map(([k])=>METS.find(m=>m.id===k).lbl);
  const neg=Object.entries(fx).filter(([,v])=>v<0).map(([k])=>METS.find(m=>m.id===k).lbl);
  let s=`Eligieron <strong>«${opt.lbl}»</strong>. `;
  s+=net>0?`Balance positivo neto (+${net} pts). `:net<0?`Costo neto (${net} pts): sacrificaron algo para ganar en otra área. `:'Efecto neutro. ';
  if(pos.length)s+=`Beneficia: <strong>${pos.join(', ')}</strong>. `;if(neg.length)s+=`Costo en: <strong>${neg.join(', ')}</strong>. `;
  return s+opt.sub;
}
function renderFeedback(){
  const m=S.met,avg=avgOf(m),T=teamCount();
  const chips=(f,cls)=>METS.map(x=>({...x,v:Math.round(m[x.id])})).filter(f).map(x=>`<span class="chip ${cls}">${x.ic} ${x.lbl}: ${x.v}</span>`).join('');
  const top=Object.entries(S.cap).sort((a,b)=>b[1]-a[1])[0];const topA=AREAS.find(a=>a.id===top[0]);
  const res=S.cap.res,resP=Math.round(res/TOTAL*100);
  const resMsg=res===0?'<strong>⚠️ No destinaron nada al fondo de emergencia.</strong> Cuando llegó la crisis, los efectos negativos se multiplicaron ×1,8.':res<10000?`Guardaron ${fmt(res)} (${resP} %) de reserva: por debajo del mínimo recomendado del 10 %.`:`Su fondo de reserva de ${fmt(res)} (${resP} %) amortiguó el impacto de la crisis.`;
  const empty=DEPTOS.filter(d=>!T[d.id]).map(d=>d.name);const most=DEPTOS.slice().sort((a,b)=>T[b.id]-T[a.id])[0];
  const dx=avg>=75?'Perfil equilibrado de alto desempeño: las decisiones estuvieron bien fundamentadas.':avg>=60?'La empresa funciona, pero con asimetrías: algunas métricas destacan y otras piden atención urgente.':avg>=45?'La empresa sobrevive con vulnerabilidades estructurales: algunas decisiones priorizaron el corto plazo.':'La empresa enfrentó dificultades serias. Identificar estos errores es justo el primer paso de la formación empresarial.';
  const f=chips(x=>x.v>=70,'g'),md=chips(x=>x.v>=45&&x.v<70,''),d=chips(x=>x.v<45,'r');
  $('feedback').innerHTML=`
    <div class="fb-sec"><span class="lbl">Diagnóstico general</span><p class="fb-t">${dx} Puntaje: <strong>${avg}/100</strong>. Pizarras: boceto ${S.boards.d1?'✅':'⚪'} · organigrama ${S.boards.d2?'✅':'⚪'}.</p></div>
    <div class="fb-sec"><span class="lbl">Perfil de indicadores</span>${f?`<p class="fb-t">Fortalezas (≥70)</p><div class="fb-chips">${f}</div>`:''}${md?`<p class="fb-t" style="margin-top:8px">En desarrollo (45–69)</p><div class="fb-chips">${md}</div>`:''}${d?`<p class="fb-t" style="margin-top:8px">Áreas críticas (&lt;45)</p><div class="fb-chips">${d}</div>`:''}</div>
    <div class="fb-sec"><span class="lbl">Inversión financiera</span><p class="fb-t">Su mayor inversión fue <strong>${topA.icon} ${topA.name}</strong> (${fmt(top[1])}). ${resMsg}</p></div>
    <div class="fb-sec"><span class="lbl">Equipo</span><p class="fb-t">Concentraron más personas en <strong>${most.name}</strong> (${T[most.id]}). <strong>${S.matches}/5</strong> personas quedaron en su área ideal ⭐. ${empty.length?`Departamentos vacíos: <strong>${empty.join(', ')}</strong>, con brechas directas en los indicadores.`:'Todos los departamentos tienen personal: estructura equilibrada.'}</p></div>
    <div class="fb-sec"><span class="lbl">Decisiones críticas</span>
      <p class="fb-t"><strong>🚨 ${S.crisis.title}:</strong> ${analyzeOpt(S.crisis.opts[S.cOpt])}${S.timedOut?' <strong>⏰ Se les acabó el tiempo antes de decidir.</strong>':''}</p>
      ${S.negs.map((n,i)=>`<p class="fb-t" style="margin-top:8px"><strong>🤝 ${n.badge} · ${n.title}:</strong> ${analyzeOpt(n.opts[S.negOpts[i]],NEG_WEIGHT)}</p>`).join('')}
      <p class="fb-t" style="margin-top:8px"><strong>✦ ${S.opp.title}:</strong> ${analyzeOpt(S.opp.opts[S.oppOpt])}</p></div>
    <div class="fb-sec"><span class="lbl">Reflexión final</span><p class="fb-t">Gestionar una empresa es decidir con <strong>información incompleta</strong> y recursos <strong>siempre limitados</strong>. Lo que vivieron hoy es exactamente lo que <strong>Negocios y Gestión Empresarial</strong> enseña a dominar con metodología y datos.</p></div>`;
}
function renderTimeline(){
  const T=teamCount();const it=[];
  it.push({i:'🏢',s:'Fase 1',d:`Negocio: ${S.biz.em} ${S.biz.name}`,x:S.biz.barrio});
  it.push({i:'✏️',s:'Fase 2',d:'Pizarra de boceto',x:S.boards.d1?'✅ Planificaron visualmente antes de invertir.':'⚪ Omitieron la planificación visual.'});
  it.push({i:'💰',s:'Fase 3',d:'Distribución del capital',tags:AREAS.map(a=>`${a.icon} ${fmt(S.cap[a.id])}`),j:S.justif.cap});
  it.push({i:'🏗️',s:'Fase 4',d:'Organigrama',x:S.boards.d2?'✅ Diseñaron su estructura.':'⚪ Omitieron el organigrama.'});
  it.push({i:'👥',s:'Fase 5',d:`Equipo (${S.matches}/5 en su área ideal)`,tags:PEOPLE.map(p=>{const d=DEPTOS.find(x=>x.id===S.team[p.id]);return`${p.av} ${p.name} → ${d.ic}${p.ideal===d.id?' ⭐':''}`}),j:S.justif.team});
  it.push({i:'🚨',s:'Fase 6',d:`Crisis: ${S.crisis.title}`,x:`Opción: «${S.crisis.opts[S.cOpt].lbl}»${S.timedOut?' · ⏰ fuera de tiempo':''}`,j:S.justif.crisis});
  it.push({i:'🤝',s:'Fase 7',d:'Negociaciones (3 rondas)',tags:S.negs.map((n,i)=>`${n.ic} ${n.badge}: ${'ABC'[S.negOpts[i]]}`),x:S.negs.map((n,i)=>`${n.who}: «${n.opts[S.negOpts[i]].lbl}»`).join(' · '),j:S.justif.neg});
  it.push({i:'✦',s:'Fase 8',d:`Oportunidad: ${S.opp.title}`,x:`Opción: «${S.opp.opts[S.oppOpt].lbl}»`,j:S.justif.opp});
  it.push({i:'🏁',s:'Resultado',d:`Puntaje ${S.score}/100 · ${S.tier}`,x:METS.map(x=>`${x.ic} ${Math.round(S.met[x.id])}`).join(' · ')});
  $('timeline').innerHTML=it.map((t,k)=>`<div class="tl-i"><div class="tl-l"><div class="tl-dot">${t.i}</div>${k<it.length-1?'<div class="tl-line"></div>':''}</div><div class="tl-b"><span class="tl-s">${t.s}</span><div class="tl-d">${esc(t.d)}</div>${t.x?`<div class="tl-x">${esc(t.x)}</div>`:''}${t.tags?`<div class="tl-tags">${t.tags.map(g=>`<span class="chip">${esc(g)}</span>`).join('')}</div>`:''}${t.j?`<div class="tl-j">“${esc(t.j)}”</div>`:''}</div></div>`).join('');
}

/* ═══════════════════════════════════════
   TRANSFERENCIA A FINANZAS PERSONALES
═══════════════════════════════════════ */
function perfil(){
  const avg=avgOf(S.met),sos=S.met.sos,rp=S.cap.res/1000;
  const rs=rp===0?0:rp<5?40:rp<=25?100:rp<=35?85:60;const sc=avg*.4+sos*.3+rs*.3;
  if(rp>35)return{name:'🐢 Perfil Conservador',d:'Guardaron mucho en reserva. Protegerse es bueno, pero el dinero quieto no crece: en tu vida, busca equilibrio entre ahorrar e invertir en ti.',sc};
  if(sc>=70)return{name:'💎 Perfil Previsor',d:'Priorizaron reserva y sostenibilidad. En tu vida eso es ahorro constante y un fondo de emergencia sólido.',sc};
  if(sc>=55)return{name:'📊 Perfil Equilibrado',d:'Balancearon bien las áreas. En tu vida repartirías tu ingreso con criterio, con margen para ahorrar un poco más.',sc};
  if(sc>=40)return{name:'⚡ Perfil Orientado al Gasto',d:'Priorizaron crecer rápido sobre protegerse. En tu vida puede significar gastar lo que deberías ahorrar.',sc};
  return{name:'🔴 Perfil de Riesgo',d:'Las decisiones dejaron poca protección. En tu vida, este perfil queda vulnerable ante cualquier imprevisto.',sc};
}
let SU={inc:1000,p:{nec:50,gus:30,aho:15,inv:5}};
const SCATS=[{id:'nec',ic:'🏠',n:'Necesidades',c:'#FFC23D'},{id:'gus',ic:'🎉',n:'Gustos',c:'#FF3D7F'},{id:'aho',ic:'🛡️',n:'Ahorro y emergencias',c:'#B8F34A'},{id:'inv',ic:'📚',n:'Invertir en ti',c:'#22E1C3'}];
function initTransfer(){
  const top=Object.entries(S.cap).sort((a,b)=>b[1]-a[1])[0];const topA=AREAS.find(a=>a.id===top[0]);
  const res=S.cap.res,wins=S.negOpts.filter(x=>x===1).length,T=teamCount(),empty=DEPTOS.filter(d=>!T[d.id]);
  const cards=[
    {i:'💰',t:'Distribución del capital',b:`Su mayor inversión fue <strong>${topA.name}</strong>: ${fmt(top[1])} (${Math.round(top[1]/TOTAL*100)} %).`,f:'Cada mes repartirás tu ingreso entre <strong>gastos fijos</strong>, <strong>formación</strong>, <strong>gustos</strong> y <strong>ahorro</strong>. Es el mismo ejercicio, con tu propio dinero.'},
    {i:'🛡️',t:'El fondo de emergencia',b:res===0?'No guardaron reserva: la crisis los golpeó <strong>1,8 veces</strong> más fuerte.':`Guardaron <strong>${fmt(res)}</strong> (${Math.round(res/TOTAL*100)} %) para emergencias.`,f:'Sin ahorro, cualquier imprevisto (enfermedad, robo, reparación) te obliga a endeudarte. Se recomiendan <strong>3 a 6 meses</strong> de gastos guardados.'},
    {i:'🤝',t:'La negociación',b:`Cerraron <strong>${wins} de 3</strong> tratos con postura ganar-ganar.`,f:'Negociarás tu <strong>sueldo</strong>, tu <strong>alquiler</strong>, servicios y créditos. Quien negocia bien ahorra más sin ganar más.'},
    {i:'📈',t:'Invertir en el equipo (en ti)',b:`<strong>${S.matches}/5</strong> personas en su área ideal.${empty.length?` Dejaron vacío: ${empty.map(d=>d.name).join(', ')}.`:''}`,f:'Tu formación (idiomas, cursos, certificaciones) es tu capital humano: define cuánto podrás ganar en el futuro.'},
    {i:'⚡',t:'Decidir bajo presión',b:S.timedOut?'Se les acabó el tiempo en la crisis: <strong>la indecisión también cuesta</strong>.':`En la crisis eligieron: «${esc(S.crisis.opts[S.cOpt].lbl)}».`,f:'Los préstamos rápidos y gastos urgentes son los errores más caros si no tienes criterios claros <strong>antes</strong> de la emergencia.'},
    {i:'🌱',t:'Sostenibilidad',b:`Terminaron con Sostenibilidad <strong>${Math.round(S.met.sos)}/100</strong>.`,f:'Gastar todo lo que ganas es lo mismo que una empresa sin reservas. La <strong>libertad financiera</strong> se construye con decisiones sostenidas, no con una gran ganancia.'}
  ];
  $('fgrid').innerHTML=cards.map((c,k)=>`<div class="fcard" onclick="this.classList.toggle('flip');Snd.whoosh()" style="animation:fadeUp .5s ${k*.08}s both">
    <div class="in"><div class="f fr"><span class="fi">${c.i}</span><div class="ft">${c.t}</div><p class="fx2">🏢 ${c.b}</p><span class="flab">↻ Toca: ¿y en tu vida?</span></div>
    <div class="f bk"><span class="fi">${c.i}</span><div class="ft">En tu vida personal</div><p class="fx2">${c.f}</p><span class="flab">↻ Volver al negocio</span></div></div></div>`).join('');
  // Mini simulador: arranca con la misma lógica que usaron en la empresa
  const pc=k=>Math.round(S.cap[k]/TOTAL*20)*5;
  SU.p={gus:pc('mkt'),aho:pc('res'),inv:pc('rrhh'),nec:0};SU.p.nec=Math.max(0,100-SU.p.gus-SU.p.aho-SU.p.inv);
  $('inc').innerHTML=[{v:1000,l:'Bs 1.000',s:'Medio tiempo'},{v:3000,l:'Bs 3.000',s:'Primer empleo'},{v:6000,l:'Bs 6.000',s:'Profesional joven'}].map(o=>`<button class="${o.v===SU.inc?'sel':''}" onclick="setInc(${o.v},this)">${o.l}<small>${o.s}</small></button>`).join('');
  renderSueldo();toast('💡 El mini simulador arranca con la misma lógica que usaron en su empresa',3500);
  const pf=perfil();$('pf-v').textContent=pf.name;$('pf-d').textContent=pf.d;
  $('pf-why').innerHTML=`<span class="chip">🛡️ Reserva ${Math.round(S.cap.res/TOTAL*100)} %</span><span class="chip">🌱 Sostenibilidad ${Math.round(S.met.sos)}</span><span class="chip">📊 Promedio ${avgOf(S.met)}</span>`;
  $('years').innerHTML=YEARS.map(y=>`<div class="year"><div class="yn">Año ${y.n}</div><div class="yt">${y.t}</div><ul>${y.l.map(l=>`<li>${l}</li>`).join('')}</ul></div>`).join('');
  $('jobs').innerHTML=JOBS.map(j=>`<span class="chip">${j}</span>`).join('');
  $('cta-link').href=CONFIG.CTA_URL;qrInto($('cta-qr'),CONFIG.CTA_URL);
  AB.set('🔄 Jugar de nuevo',restart,{back:()=>go('results')});
}
function setInc(v,el){SU.inc=v;document.querySelectorAll('#inc button').forEach(b=>b.classList.remove('sel'));el.classList.add('sel');Snd.click();renderSueldo()}
function adjCat(id,d){const v=SU.p[id]+d;if(v<0||v>100)return;SU.p[id]=v;Snd.click();renderSueldo()}
function apply503020(){SU.p={nec:50,gus:30,aho:15,inv:5};Snd.ok();renderSueldo()}
function renderSueldo(){
  const tot=Object.values(SU.p).reduce((a,b)=>a+b,0);const bs=k=>SU.inc*SU.p[k]/100;
  $('cats').innerHTML=SCATS.map(c=>`<div class="cat"><div class="ci">${c.ic}</div><div class="cn">${c.n}</div><div class="cp" style="color:${c.c}">${SU.p[c.id]} %</div><div class="cb">${fmt(bs(c.id))}/mes</div><div class="cc"><button onclick="adjCat('${c.id}',-5)">−</button><button onclick="adjCat('${c.id}',5)">+</button></div></div>`).join('');
  $('stack').innerHTML=SCATS.map(c=>`<i style="width:${Math.min(100,SU.p[c.id])}%;background:${c.c}"></i>`).join('');
  const tb=$('tot-badge');tb.textContent=tot===100?'✓ 100 % repartido':`Total: ${tot} % ${tot>100?'(te pasaste)':'(falta repartir)'}`;tb.classList.toggle('bad',tot!==100);
  const fondo=bs('nec')*3,aho=bs('aho');const meses=aho>0?Math.ceil(fondo/aho):null;
  $('sueldo-out').innerHTML=`<div class="so"><b>${meses?meses+' meses':'Nunca 😬'}</b>para juntar tu fondo de emergencia (3 meses de necesidades = ${fmt(fondo)}).</div>
    <div class="so"><b>${fmt(aho*12)}</b>ahorrarías en un año con ${SU.p.aho} % al mes.</div>
    <div class="so"><b>${fmt(bs('inv')*12)}</b>invertirías en ti al año: cursos, idiomas, certificaciones.</div>`;
}

/* ═══════════════════════════════════════
   TARJETA PARA HISTORIAS (1080×1920)
═══════════════════════════════════════ */
async function shareCard(){
  try{await document.fonts.ready}catch(e){}
  const c=document.createElement('canvas');c.width=1080;c.height=1920;const x=c.getContext('2d');
  x.fillStyle='#0A0612';x.fillRect(0,0,1080,1920);
  [['#FF7A00',200,300,700],['#FF2E77',950,800,650],['#7B4DFF',300,1600,700]].forEach(([col,cx,cy,r])=>{const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,col+'AA');g.addColorStop(1,col+'00');x.fillStyle=g;x.fillRect(0,0,1080,1920)});
  const grad=x.createLinearGradient(0,0,1080,0);grad.addColorStop(0,'#FFC23D');grad.addColorStop(.35,'#FF8A00');grad.addColorStop(.66,'#FF5E3A');grad.addColorStop(1,'#FF3D7F');
  x.textAlign='center';x.fillStyle='rgba(255,230,200,.8)';x.font='600 34px "JetBrains Mono",monospace';x.fillText('LABORATORIO DE DECISIONES FINANCIERAS',540,150);
  x.font='160px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';x.fillText(S.av,540,370);
  x.fillStyle='#fff';x.font='800 78px "Bricolage Grotesque",sans-serif';x.fillText(S.name.slice(0,22),540,480);
  x.fillStyle='rgba(255,240,225,.75)';x.font='600 40px "Plus Jakarta Sans",sans-serif';x.fillText(S.biz.em+' '+S.biz.name,540,550);
  const cx=540,cy=820,R=200;x.lineWidth=40;x.strokeStyle='rgba(255,255,255,.1)';x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();
  x.strokeStyle=grad;x.lineCap='round';x.beginPath();x.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+Math.PI*2*S.score/100);x.stroke();
  x.fillStyle='#fff';x.font='800 170px "Bricolage Grotesque",sans-serif';x.fillText(S.score,cx,cy+55);
  x.fillStyle='rgba(255,240,225,.6)';x.font='500 34px "JetBrains Mono",monospace';x.fillText('/ 100 puntos',cx,cy+120);
  x.fillStyle=grad;x.font='800 66px "Bricolage Grotesque",sans-serif';x.fillText(S.tier,540,1140);
  METS.forEach((m,i)=>{const y=1240+i*72;x.textAlign='left';x.fillStyle='#fff';x.font='600 36px "Plus Jakarta Sans",sans-serif';x.fillText(m.ic+' '+m.lbl,150,y);
    x.fillStyle='rgba(255,255,255,.1)';x.fillRect(560,y-28,300,24);x.fillStyle=m.col;x.fillRect(560,y-28,300*clamp(S.met[m.id])/100,24);
    x.textAlign='right';x.fillStyle='#fff';x.font='600 34px "JetBrains Mono",monospace';x.fillText(Math.round(S.met[m.id]),930,y)});
  x.textAlign='center';x.fillStyle='#22E1C3';x.font='700 44px "Plus Jakarta Sans",sans-serif';x.fillText(S.perfil,540,1660);
  x.fillStyle=grad;x.fillRect(0,1760,1080,160);x.fillStyle='#1A0A00';x.font='800 46px "Bricolage Grotesque",sans-serif';x.fillText('NEGOCIOS Y GESTIÓN EMPRESARIAL',540,1835);x.font='700 34px "Plus Jakarta Sans",sans-serif';x.fillText('UNIFRANZ',540,1885);
  c.toBlob(async b=>{
    const file=new File([b],'mi-resultado-nge.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'Mi resultado · Laboratorio NGE'});return}catch(e){}}
    const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='mi-resultado-nge.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('📸 Tarjeta descargada');
  },'image/png');
}

/* ═══════════════════════════════════════
   RANKING EN VIVO (Apps Script)
═══════════════════════════════════════ */
function setLive(st){
  const p=$('live-pill');if(!Live.enabled()){p.classList.remove('on');return}
  p.classList.add('on');p.classList.toggle('off',st!=='on');$('live-txt').textContent=st==='on'?'EN VIVO · '+S.sala:st==='closed'?'SALA CERRADA':'SIN CONEXIÓN';
}
const Live={pending:null,busy:false,cb:[],
  enabled(){return!!(CONFIG.API_URL&&S.sala)},
  payload(fase){const T=teamCount();return{action:'upsert',sala:S.sala,id:S.id,nombre:S.name,avatar:S.av,modo:S.mode==='team'?'Equipo':'Individual',integrantes:S.members.join(', '),
    negocio:S.biz?S.biz.em+' '+S.biz.name:'',fase:fase||LABELS[S.phase]||S.phase,progreso:PROG[S.phase]||0,
    puntaje:S.finished?S.score:'',nivel:S.finished?S.tier:'',perfil:S.finished?S.perfil:'',
    met:S.finished?Object.fromEntries(METS.map(m=>[m.id,Math.round(S.met[m.id])])):null,
    capital:AREAS.map(a=>`${a.name}: ${S.cap[a.id]}`).join(' | '),
    equipo:S.finished?PEOPLE.map(p=>`${p.name}→${(DEPTOS.find(d=>d.id===S.team[p.id])||{}).name||'-'}`).join(' | '):'',
    decisiones:S.finished?[`Crisis: ${S.crisis.opts[S.cOpt].lbl}${S.timedOut?' (fuera de tiempo)':''}`,...S.negs.map((n,i)=>`${n.badge}: ${n.opts[S.negOpts[i]].lbl}`),`Oportunidad: ${S.opp.opts[S.oppOpt].lbl}`].join(' | '):'',
    pizarras:`Boceto ${S.boards.d1?'sí':'no'} · Organigrama ${S.boards.d2?'sí':'no'}`,justif:S.finished?S.justif:null}},
  push(fase,cb){if(!this.enabled()||!S.name)return;this.pending=this.payload(fase);if(cb)this.cb.push(cb);this.flush()},
  async flush(){
    if(this.busy||!this.pending)return;this.busy=true;const body=this.pending;this.pending=null;const cbs=this.cb.splice(0);
    try{const r=await fetch(CONFIG.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)});const j=await r.json();
      if(j.ok){setLive('on');cbs.forEach(f=>f())}
      else if(j.error==='cerrada'){setLive('closed');if(!this.warned){this.warned=true;toast('🔒 '+(j.msg||'La sala está cerrada')+' Pueden seguir jugando, pero sin ranking.',4500)}
        const sm=$('sent-msg');if(sm&&S.phase==='results')sm.innerHTML='🔒 La sala <b>'+esc(S.sala)+'</b> está cerrada: el resultado no se envió al ranking.'}
      else setLive('err')}
    catch(e){setLive('err');if(!this.pending)this.pending=body;this.cb.push(...cbs);setTimeout(()=>{this.busy=false;this.flush()},5000);return}
    this.busy=false;if(this.pending)this.flush();
  }
};

/* Proyector del docente */
let pjCode='',pjTimer=null,pjHide=false,pjData=[];
function openTeacher(){$('t-sala').value=genCode();$('t-warn').style.display=CONFIG.API_URL?'none':'';$('m-teacher').classList.add('on')}
function closeModal(id){$(id).classList.remove('on')}
function startProjector(code){
  pjCode=(code||$('t-sala').value||genCode()).toUpperCase();closeModal('m-teacher');
  history.replaceState(null,'',location.pathname+'?proyector='+pjCode);
  go('proj');$('pj-code').textContent=pjCode;
  const join=location.origin+location.pathname+'?sala='+pjCode;$('pj-url').textContent=join.replace(/^https?:\/\//,'');qrInto($('pj-qr'),join);
  $('pod-wait').style.display='';document.querySelectorAll('#podium .pod,#podium .drum').forEach(e=>e.remove());
  pollRanking();clearInterval(pjTimer);pjTimer=setInterval(pollRanking,CONFIG.POLL_MS);
}
function exitProjector(){clearInterval(pjTimer);history.replaceState(null,'',location.pathname);go('home')}
async function pollRanking(){
  if(!CONFIG.API_URL){$('pj-list').innerHTML='<div class="pj-empty">⚠️ Falta configurar <b>API_URL</b> (la URL /exec del Apps Script) en el archivo HTML.</div>';$('pj-live-txt').textContent='Sin configurar';$('pj-live').classList.add('off');return}
  try{const r=await fetch(`${CONFIG.API_URL}?action=ranking&sala=${encodeURIComponent(pjCode)}&t=${Date.now()}`);const j=await r.json();if(!j.ok)throw 0;
    pjData=j.items||[];$('pj-live').classList.toggle('off',!!j.cerrada);$('pj-live-txt').textContent=j.cerrada?'🔒 Sala cerrada':'Conectado';renderRanking()}
  catch(e){$('pj-live').classList.add('off');$('pj-live-txt').textContent='Reintentando…'}
}
function sortedRank(){return pjData.slice().sort((a,b)=>{const fa=a.puntaje!==''&&a.puntaje!=null,fb=b.puntaje!==''&&b.puntaje!=null;if(fa!==fb)return fa?-1:1;if(fa)return b.puntaje-a.puntaje;return(b.progreso||0)-(a.progreso||0)})}
function renderRanking(){
  const L=sortedRank();$('pj-count').textContent=L.length;
  if(!L.length){$('pj-list').innerHTML='<div class="pj-empty">Esperando participantes… 📱<br>Escaneen el QR para unirse.</div>';return}
  let pos=0;
  $('pj-list').innerHTML=L.slice(0,14).map(t=>{const fin=t.puntaje!==''&&t.puntaje!=null;if(fin)pos++;
    return`<div class="pj-row${fin?' fin':''}"><div class="pos">${fin?(pos<=3?['🥇','🥈','🥉'][pos-1]:pos):'·'}</div><div class="pav">${esc(t.avatar||'🦊')}</div>
    <div><div class="pnm">${esc(t.nombre)}</div><div class="pbz">${esc(t.negocio||'Eligiendo negocio…')} · ${esc(t.fase||'')}</div><div class="pprog"><i style="width:${t.progreso||0}%"></i></div></div>
    <div class="psc">${fin?(pjHide?'??':t.puntaje):'<small>en juego</small>'}${fin?`<small>${esc(t.nivel||'')}</small>`:''}</div></div>`}).join('');
}
function toggleScores(){pjHide=!pjHide;$('hide-btn').textContent=pjHide?'👀 Mostrar puntajes':'🙈 Ocultar puntajes';renderRanking()}
async function revealPodium(){
  const top=sortedRank().filter(t=>t.puntaje!==''&&t.puntaje!=null).slice(0,3);
  if(!top.length){toast('Aún no hay equipos que hayan terminado');return}
  const pd=$('podium');$('pod-wait').style.display='none';pd.querySelectorAll('.pod,.drum').forEach(e=>e.remove());
  for(const n of[3,2,1]){const d=document.createElement('div');d.className='drum';d.textContent=n;d.style.position='absolute';pd.appendChild(d);Snd.beep();await sleep(900);d.remove()}
  const order=[1,0,2];
  order.forEach(i=>{const t=top[i];if(!t)return;const el=document.createElement('div');el.className='pod p'+(i+1);
    el.innerHTML=`<div class="pav">${esc(t.avatar||'🦊')}</div><div class="pnm">${esc(t.nombre)}</div><div class="psc">${t.puntaje} pts</div><div class="blk">${i+1}</div>`;pd.appendChild(el)});
  for(const i of[2,1,0]){const el=pd.querySelector('.pod.p'+(i+1));if(!el)continue;el.classList.add('show');Snd.coin();await sleep(i===0?300:900)}
  Snd.fanfare();Confetti.burst(260);setTimeout(()=>Confetti.burst(200,innerWidth*.2,innerHeight*.3),500);setTimeout(()=>Confetti.burst(200,innerWidth*.8,innerHeight*.3),900);
}
function qrInto(el,url){
  el.innerHTML='';if(typeof qrcode!=='function'){el.style.display='none';return}
  try{const q=qrcode(0,'M');q.addData(url);q.make();el.innerHTML=q.createSvgTag({cellSize:4,margin:0,scalable:true});el.style.display=''}catch(e){el.style.display='none'}
}

/* ═══════════════════════════════════════
   REINICIO E INICIO
═══════════════════════════════════════ */
function restart(){
  if(S.phase!=='transfer'&&S.phase!=='results'&&!confirm('¿Empezar una nueva partida?'))return;
  S=newState(S);Board.reset();capDone=false;stopTimer();clearInterval(skipT);
  document.querySelectorAll('.just').forEach(j=>j.remove());
  go('select');toast(P('🔄 Nueva partida: ¡elijan otro negocio!','🔄 Nueva partida: ¡elige otro negocio!'));
}
(function boot(){
  $('snd-btn').textContent=Snd.on?'🔊':'🔇';
  const q=new URLSearchParams(location.search);
  if(q.get('proyector')){startProjector(q.get('proyector'));return}
  initHome();
})();
