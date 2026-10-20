/* ═══════════════════════════════════════
   CONFIGURACIÓN — pega aquí la URL de tu Apps Script (termina en /exec)
═══════════════════════════════════════ */
const CONFIG={
  API_URL:'https://script.google.com/macros/s/AKfycbx4E1a1cdKiOMZOzahLezsqJVEjW6HmqZSYxLVYQV3wMeV6TssZpivYVLSsnGxfQPw/exec',
  CTA_URL:'https://unifranz.edu.bo/carreras/negocios-y-gestion-empresarial/',
  POLL_MS:4000
};
const VOZ_BASE=/\/v\d+\/?$/.test(location.pathname.replace(/index\.html$/,''))?'../voz/':'voz/';

/* ═══════════════════════════════════════
   UTILIDADES
═══════════════════════════════════════ */
const $=id=>document.getElementById(id);
const fmt=n=>'Bs '+Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const clamp=v=>Math.max(5,Math.min(96,v||0));
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rndI=n=>Math.floor(Math.random()*n);
const rnd=a=>a[rndI(a.length)];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const genCode=()=>Array.from({length:4},()=>'ABCDEFGHJKMNPQRSTUVWXYZ23456789'[rndI(31)]).join('');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const avgOf=m=>Math.round(METS.reduce((a,x)=>a+m[x.id],0)/METS.length);
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function vib(p){try{navigator.userActivation&&navigator.userActivation.hasBeenActive&&navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
function countUp(el,to,dur,pre){const s=performance.now();pre=pre||'';(function u(n){const t=Math.min((n-s)/dur,1);const e=1-Math.pow(1-t,3);el.textContent=pre==='Bs '?fmt(to*e):pre+Math.round(to*e);if(t<1)requestAnimationFrame(u)})(s)}
function toast(msg,ms){const t=document.createElement('div');t.className='toast';t.innerHTML=msg;$('toasts').appendChild(t);setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),400)},ms||2200)}
function floatFx(txt,x,y,col){const f=document.createElement('div');f.className='floatfx';f.textContent=txt;f.style.left=(x-30)+'px';f.style.top=(y-20)+'px';f.style.color=col||'#B8F34A';document.body.appendChild(f);setTimeout(()=>f.remove(),1300)}
function loadScript(src){return new Promise((ok,ko)=>{if(document.querySelector(`script[src="${src}"]`))return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=ko;document.head.appendChild(s)})}

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

/* Voz: Sofía (mentora) y Marcelo (noticiero), voces neuronales bolivianas pregrabadas */
const Voz={on:store('nge-voz')!=='0',audio:null,cb:null,tok:0,
  play(key,text,who,cb){
    this.stop(true);this.cb=cb||null;const tok=++this.tok;
    if(!this.on||!text){if(cb)setTimeout(cb,0);return}
    const n=$('narr');n.classList.toggle('news',who==='marcelo');
    $('nr-av').textContent=who==='marcelo'?'🎙️':'👩🏽‍💼';$('nr-who').textContent=who==='marcelo'?'Marcelo · noticiero':'Sofía · tu mentora';
    $('nr-txt').textContent=text;n.classList.add('on');
    const a=new Audio(VOZ_BASE+key+'.mp3');this.audio=a;
    a.onended=()=>{if(tok===this.tok)this.end()};
    a.onerror=()=>{if(tok===this.tok)this.tts(text,tok)};
    a.play().catch(()=>{if(tok===this.tok&&!a.error)this.tts(text,tok)});
  },
  tts(text,tok){
    this.audio=null;
    if(!('speechSynthesis'in window)){setTimeout(()=>{if(tok===this.tok)this.end()},Math.min(9000,text.length*55));return}
    const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=1.03;
    const v=speechSynthesis.getVoices().find(v=>/es[-_](BO|419|MX|US|ES)/i.test(v.lang))||speechSynthesis.getVoices().find(v=>/^es/i.test(v.lang));if(v)u.voice=v;
    u.onend=()=>{if(tok===this.tok)this.end()};speechSynthesis.cancel();speechSynthesis.speak(u);
  },
  stop(silent){
    this.tok++;if(this.audio){try{this.audio.pause()}catch(e){}this.audio=null}
    try{speechSynthesis.cancel()}catch(e){}
    $('narr').classList.remove('on');
    if(!silent){const c=this.cb;this.cb=null;if(c)c()}else this.cb=null;
  },
  end(){setTimeout(()=>{$('narr').classList.remove('on');const c=this.cb;this.cb=null;if(c)c()},500)}
};
function toggleVoz(){Voz.on=!Voz.on;store('nge-voz',Voz.on?'1':'0');$('voz-btn').style.opacity=Voz.on?1:.4;toast(Voz.on?'🎙️ Voz activada':'🎙️ Voz desactivada');if(!Voz.on)Voz.stop(true)}

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

/* Partículas del inicio (monedas y chispas) */
const FX=(()=>{let cv,cx,ps=[],raf=null,on=false;
  function start(){if(on)return;on=true;cv=$('fx-canvas');if(!cv)return;cx=cv.getContext('2d');size();addEventListener('resize',size);
    ps=Array.from({length:innerWidth<700?26:50},()=>mk(true));loop()}
  function size(){cv.width=innerWidth*Math.min(2,devicePixelRatio||1);cv.height=innerHeight*Math.min(2,devicePixelRatio||1)}
  function mk(init){const d=Math.min(2,devicePixelRatio||1);return{x:Math.random()*cv.width,y:init?Math.random()*cv.height:cv.height+20,r:(1+Math.random()*2.6)*d,v:(.2+Math.random()*.7)*d,h:Math.random()<.5?28:340,a:.25+Math.random()*.5,w:Math.random()*6}}
  function loop(){if(!on)return;cx.clearRect(0,0,cv.width,cv.height);ps.forEach((p,i)=>{p.y-=p.v;p.w+=.02;p.x+=Math.sin(p.w)*.3;if(p.y<-10)ps[i]=mk();cx.beginPath();cx.fillStyle=`hsla(${p.h},100%,62%,${p.a})`;cx.shadowColor=`hsla(${p.h},100%,60%,.9)`;cx.shadowBlur=10;cx.arc(p.x,p.y,p.r,0,7);cx.fill()});raf=requestAnimationFrame(loop)}
  function stop(){on=false;cancelAnimationFrame(raf);if(cx)cx.clearRect(0,0,cv.width,cv.height)}
  return{start,stop};
})();
function tilt(el){el.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-3px)`});el.addEventListener('pointerleave',()=>el.style.transform='')}

/* ═══════════════════════════════════════
   GRÁFICOS (SVG propios)
═══════════════════════════════════════ */
function radarSVG(svg,axes,series,o){
  o=o||{};const light=o.light;const cx=210,cy=200,R=o.R||120;const n=axes.length,ang=axes.map((_,i)=>-Math.PI/2+i*2*Math.PI/n);
  const P=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];const pts=(vals,k)=>ang.map((a,i)=>P(R*cl(vals[i],0,100)/100*(k==null?1:k),a).map(v=>v.toFixed(1)).join(',')).join(' ');
  const grid=light?'rgba(0,0,0,.12)':'rgba(255,255,255,.09)';const txt=light?'#3b3346':'rgba(255,240,225,.75)';
  let h='';for(let l=1;l<=4;l++)h+=`<polygon points="${ang.map(a=>P(R*l/4,a).join(',')).join(' ')}" fill="none" stroke="${grid}" ${l===4?'stroke-width="1.5"':''}/>`;
  ang.forEach(a=>{const [x,y]=P(R,a);h+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${grid}"/>`});
  series.forEach((s,si)=>{h+=`<polygon class="rs" data-s="${si}" points="${pts(s.v,o.anim?0:1)}" fill="${s.fill||'none'}" stroke="${s.col}" stroke-width="${s.w||2.5}" ${s.dash?'stroke-dasharray="7 5"':''} stroke-linejoin="round" ${s.glow&&!light?`style="filter:drop-shadow(0 0 10px ${s.col}88)"`:''}/>`;
    if(s.dots)s.v.forEach((v,i)=>{const [x,y]=P(R*cl(v,0,100)/100,ang[i]);h+=`<circle class="rd" data-s="${si}" data-i="${i}" cx="${x}" cy="${y}" r="5" fill="${axes[i].col||s.col}" stroke="${light?'#fff':'#120A1E'}" stroke-width="2"/>`})});
  axes.forEach((a,i)=>{const [lx,ly]=P(R+34,ang[i]);const anc=Math.abs(lx-cx)<8?'middle':lx>cx?'start':'end';
    h+=`<text x="${lx}" y="${ly-4}" text-anchor="${anc}" font-size="${o.fs||14}" font-weight="700" fill="${a.col||txt}" font-family="Plus Jakarta Sans,sans-serif">${a.ic} ${a.lbl}</text>`;
    if(o.vals!==false&&series[0])h+=`<text x="${lx}" y="${ly+13}" text-anchor="${anc}" font-size="12.5" fill="${txt}" font-family="JetBrains Mono,monospace">${Math.round(series[0].v[i])}${series[1]&&o.second!==false?` · ${Math.round(series[1].v[i])}`:''}</text>`});
  svg.setAttribute('viewBox','-80 -6 580 410');svg.innerHTML=h;
  if(o.anim){const t0=performance.now();const polys=svg.querySelectorAll('.rs'),dots=svg.querySelectorAll('.rd');
    (function u(nw){const t=Math.min((nw-t0)/1300,1),e=1-Math.pow(1-t,3);polys.forEach(p=>p.setAttribute('points',pts(series[+p.dataset.s].v,e)));
      dots.forEach(d=>{const s=series[+d.dataset.s],i=+d.dataset.i;const [x,y]=P(R*cl(s.v[i],0,100)/100*e,ang[i]);d.setAttribute('cx',x);d.setAttribute('cy',y)});if(t<1)requestAnimationFrame(u)})(t0)}
}
const metAxes=()=>METS.map(m=>({lbl:m.lbl,ic:m.ic,col:m.col}));
const metVals=m=>METS.map(x=>clamp(m[x.id]));
function lineChart(el,hist,o){
  o=o||{};const light=o.light;const W=640,H=o.h||250,pl=38,pr=16,pt=14,pb=46;
  if(!hist||hist.length<2){el.innerHTML='<p class="fb-t" style="opacity:.7">La evolución aparecerá a medida que tomen decisiones.</p>';return}
  const X=i=>pl+i*(W-pl-pr)/(hist.length-1),Y=v=>pt+(1-cl(v,0,100)/100)*(H-pt-pb);
  const grid=light?'rgba(0,0,0,.1)':'rgba(255,255,255,.07)',txt=light?'#5a5068':'rgba(255,240,225,.6)';
  let h='';[0,25,50,75,100].forEach(v=>h+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(v)}" y2="${Y(v)}" stroke="${grid}"/><text x="${pl-8}" y="${Y(v)+4}" text-anchor="end" font-size="11" fill="${txt}" font-family="JetBrains Mono,monospace">${v}</text>`);
  hist.forEach((p,i)=>h+=`<text x="${X(i)}" y="${H-24}" text-anchor="middle" font-size="11.5" fill="${txt}" font-family="Plus Jakarta Sans,sans-serif" font-weight="700">${esc(p.k)}</text>`);
  METS.forEach((m,mi)=>{const d=hist.map((p,i)=>`${i?'L':'M'}${X(i).toFixed(1)},${Y(clamp(p.m[m.id])).toFixed(1)}`).join(' ');
    h+=`<path d="${d}" fill="none" stroke="${m.col}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" ${o.anim?`pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" style="animation:drawLn 1.4s ${mi*.12}s ease forwards"`:''}/>`;
    hist.forEach((p,i)=>h+=`<circle cx="${X(i)}" cy="${Y(clamp(p.m[m.id]))}" r="3.5" fill="${m.col}"/>`)});
  const lg=METS.map((m,i)=>`<text x="${pl+i*118}" y="${H-4}" font-size="11.5" fill="${m.col}" font-family="Plus Jakarta Sans,sans-serif" font-weight="700">${m.ic} ${m.lbl}</text>`).join('');
  el.innerHTML=`<svg class="chart" viewBox="0 0 ${W} ${H}">${h}${lg}</svg>`;
}
function donut(el,cap,o){
  o=o||{};const tot=Object.values(cap).reduce((a,b)=>a+b,0)||1;let a0=-Math.PI/2;const R=70,r=44,c=90;
  let h='';AREAS.forEach(a=>{const v=cap[a.id]/tot;if(!v)return;const a1=a0+v*Math.PI*2;const lg=a1-a0>Math.PI?1:0;
    const p=(ang,rad)=>[c+rad*Math.cos(ang),c+rad*Math.sin(ang)];const [x0,y0]=p(a0,R),[x1,y1]=p(a1-.0001,R),[x2,y2]=p(a1-.0001,r),[x3,y3]=p(a0,r);
    h+=`<path d="M${x0},${y0} A${R},${R} 0 ${lg} 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 ${lg} 0 ${x3},${y3}Z" fill="${a.col}"/>`;a0=a1});
  const leg=AREAS.map(a=>`<div style="display:flex;align-items:center;gap:6px;font-size:.78rem;margin:3px 0"><i style="width:10px;height:10px;border-radius:3px;background:${a.col}"></i>${a.icon} ${a.name}<b style="margin-left:auto;font-family:var(--fm)">${Math.round(cap[a.id]/1000)}k</b></div>`).join('');
  el.innerHTML=`<div style="display:grid;grid-template-columns:180px 1fr;gap:14px;align-items:center"><svg viewBox="0 0 180 180" style="width:180px"><circle cx="90" cy="90" r="70" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="26"/>${h}<text x="90" y="95" text-anchor="middle" font-size="16" font-weight="800" fill="${o.light?'#1d1626':'#fff'}" font-family="Bricolage Grotesque">${fmt(tot)}</text></svg><div>${leg}</div></div>`;
}

/* ═══════════════════════════════════════
   ESTADO
═══════════════════════════════════════ */
function newState(prev){return{
  id:uid(),mode:prev?prev.mode:'team',name:prev?prev.name:'',av:prev?prev.av:'🦊',members:prev?prev.members:[],sala:prev?prev.sala:'',
  biz:null,cap:{mkt:0,ops:0,rrhh:0,inf:0,res:0},hires:[],payroll:0,resEff:0,
  met:{rent:50,eq:50,cli:50,cre:50,sos:50},noRes:false,hist:[],
  crisis:null,cIdx:0,cOpt:null,timedOut:false,crisisT0:0,crisisTime:0,cRes:null,
  negs:[],negOpts:[null,null,null],negRes:[null,null,null],negRound:0,
  opp:null,oIdx:0,oppOpt:null,oppShown:false,oRes:null,
  justif:{cap:'',team:'',crisis:'',neg:'',opp:''},boards:{d1:false,d2:false},
  score:0,tier:'',tierIdx:4,perfil:'',finished:false,phase:'home',class:null,pdfUrl:''}}
let S=newState();

/* Textos en modo individual */
const SOLO={
  '#ph-select .h2':'¿Qué negocio <span class="gt">cochabambino</span> dirigirás?',
  '#ph-draw1 .h2':'Antes de gastar… <span class="gt">¡dibuja tu plan!</span>',
  '#ph-draw1 .lead':'Usa fichas, flechas y notas para mostrar <strong>dónde pondrías más dinero y por qué</strong>.',
  '#ph-capital .h2':'Reparte tus <span class="gt">Bs 100.000</span>',
  '#ph-capital .lead':'Llena los 5 frascos hasta usar <strong>exactamente</strong> Bs 100.000. El fondo de emergencia te protege si llega una crisis.',
  '#ph-draw2 .h2':'Diseña tu <span class="gt">organigrama</span>',
  '#ph-team .h2':'Contrata a tu <span class="gt">equipo</span>',
  '#ph-team .lead':'Elige de <strong>3 a 10 personas</strong>. Cada sueldo sale de tu presupuesto de <strong>Talento</strong>. Ojo: no todos sirven para tu rubro.',
  '#ph-transfer .h2':'De tu empresa a <span class="gt">tu vida personal</span>'
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
const LABELS={setup:'Preparación',select:'Fase 1 de 8 · Negocio',mision:'Fase 1 de 8 · Misión',draw1:'Fase 2 de 8 · Pizarra',capital:'Fase 3 de 8 · Capital',draw2:'Fase 4 de 8 · Organigrama',team:'Fase 5 de 8 · Contratación',crisis:'Fase 6 de 8 · Crisis',neg:'Fase 7 de 8 · Negociación',opp:'Fase 8 de 8 · Oportunidad',results:'Resultados',transfer:'Tus finanzas personales'};
const PROG={setup:2,select:8,mision:10,draw1:18,capital:30,draw2:42,team:52,crisis:64,neg:76,opp:88,results:100,transfer:100};
const SPL={select:['1','Elige tu negocio'],draw1:['2','Pizarra estratégica'],capital:['3','Capital'],draw2:['4','Organigrama'],team:['5','Contratación'],neg:['7','Negociación'],opp:['8','Oportunidad'],results:['🏁','Resultados']};
const INIT={setup:initSetup,select:initSelect,mision:initMision,draw1:()=>initDraw('d1'),capital:initCapital,draw2:()=>initDraw('d2'),team:initTeam,crisis:initCrisis,neg:initNeg,opp:initOpp,results:initResults,transfer:initTransfer,proj:()=>{}};
let skipT=null;
function splash(ph){const s=SPL[ph];if(!s)return;$('sp-n').textContent=s[0];$('sp-t').textContent=s[1];const el=$('splash');el.classList.remove('on');void el.offsetWidth;el.classList.add('on');Snd.whoosh();setTimeout(()=>el.classList.remove('on'),1100)}
function go(ph){
  document.querySelectorAll('.ph').forEach(p=>p.classList.remove('on'));
  $('ph-'+ph).classList.add('on');S.phase=ph;
  if(ph==='home')FX.start();else FX.stop();
  const showHud=!['home','proj'].includes(ph);$('hud').classList.toggle('on',showHud);
  if(showHud){
    const i=STEPS.indexOf(ph==='mision'?'select':ph);
    $('hud-steps').innerHTML=STEPS.map((s,k)=>`<span class="${ph==='transfer'||k<i?'done':k===i?'now':''}"></span>`).join('');
    $('hud-label').textContent=LABELS[ph]+(S.biz&&!['setup','select'].includes(ph)?'  ·  '+S.biz.em+' '+S.biz.name:'');
    $('hud-name').textContent=S.name||'—';$('hud-av').textContent=S.av;
    $('dash-btn').style.display=PROG[ph]>=30&&ph!=='results'&&ph!=='transfer'?'':'none';
  }
  AB.reset();clearInterval(skipT);
  window.scrollTo(0,0);
  splash(ph);
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
  document.querySelectorAll('.mode').forEach(tilt);FX.start();
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
  Pizarra.preload();
}
function pickAv(a,el){S.av=a;document.querySelectorAll('.av-op').forEach(b=>b.classList.remove('sel'));el.classList.add('sel');Snd.click()}
function randomName(){$('in-name').value=rnd(TEAM_NAMES);validateSetup();Snd.click()}
function addMember(){const i=$('in-member');const v=i.value.trim();if(!v||S.members.length>=6)return;S.members.push(v);i.value='';renderMembers();Snd.click()}
function delMember(k){S.members.splice(k,1);renderMembers()}
function renderMembers(){$('members').innerHTML=S.members.map((m,k)=>`<span class="member">${esc(m)}<button onclick="delMember(${k})">✕</button></span>`).join('')}
const salaReq=()=>S.mode==='team'&&!!CONFIG.API_URL;
function validateSetup(){
  const nm=$('in-name').value.trim().length>=2,sl=$('in-sala').value.trim().length>=3,need=salaReq();
  $('sala-req').innerHTML=need?'<b style="color:var(--gold)">obligatorio</b> · está grande en el proyector':'(lo da el docente para el ranking en vivo)';
  $('in-sala').style.borderColor=need&&!sl?'rgba(255,194,61,.6)':'';
  AB.ok(nm&&(!need||sl),!nm?P('Escriban el nombre del equipo','Escribe tu nombre'):'Escriban el código de sala que muestra el proyector');
}
const BIENVENIDA='¡Hola, futuros gerentes! Soy Sofía y hoy seré su mentora. Bienvenidos al Laboratorio de Decisiones Financieras de UNIFRANZ. Van a dirigir un negocio real de Cochabamba, con cien mil bolivianos y un equipo que ustedes mismos van a contratar. Habrá crisis, negociaciones y oportunidades. Cada decisión cuenta. ¿Listos?';
async function startGame(){
  S.name=$('in-name').value.trim().slice(0,28);S.sala=$('in-sala').value.trim().toUpperCase();
  if($('in-member').value.trim())addMember();
  Live.push('Preparación');
  Voz.play('bienvenida',BIENVENIDA,'sofia');
  const cd=$('countdown');cd.classList.add('on');AB.reset();
  for(const n of[3,2,1]){$('cd-n').innerHTML=`<div class="n">${n}</div>`;Snd.beep();vib(40);await sleep(850)}
  $('cd-n').innerHTML=`<div class="msg">${P('¡Ahora son<br><span class="gt">gerentes!</span> 💼','¡Ahora eres<br><span class="gt">gerente!</span> 💼')}</div>`;Snd.beep(true);vib([60,40,120]);Confetti.burst(120);
  await sleep(1300);cd.classList.remove('on');go('select');
}

/* ═══════════════════════════════════════
   FASE 1 — NEGOCIO + MISIÓN
═══════════════════════════════════════ */
function initSelect(){
  $('bgrid').innerHTML=BIZS.map(b=>`
    <div class="bcard${S.biz&&S.biz.id===b.id?' sel':''}" id="bc-${b.id}" onclick="flipBiz('${b.id}')">
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
  document.querySelectorAll('.bcard').forEach(tilt);
  $('bdots').innerHTML=BIZS.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('');
  $('bgrid').onscroll=()=>{const g=$('bgrid');const w=g.firstElementChild.offsetWidth+14;const k=Math.round(g.scrollLeft/w);document.querySelectorAll('#bdots i').forEach((d,j)=>d.classList.toggle('on',j===k))};
  AB.set('Ver la misión →',()=>go('mision'),{disabled:!S.biz,back:()=>go('setup')});
  if(!S.biz)AB.ok(false,P('Toquen una carta y elijan su negocio','Toca una carta y elige tu negocio'));
}
function flipBiz(id){const c=$('bc-'+id);Snd.whoosh();document.querySelectorAll('.bcard.flip').forEach(x=>{if(x!==c)x.classList.remove('flip')});c.classList.toggle('flip')}
function pickBiz(id,e){
  e.stopPropagation();
  if(S.biz&&S.biz.id!==id){S.hires=[];S.crisis=null;S.opp=null;S.negs=[]}
  S.biz=BIZS.find(b=>b.id===id);S.met={...S.biz.base};
  document.querySelectorAll('.bcard').forEach(x=>x.classList.toggle('sel',x.id==='bc-'+id));
  document.querySelectorAll('.bz-name').forEach(x=>x.textContent=S.biz.name);
  Snd.ok();vib(30);const r=e.target.getBoundingClientRect();Confetti.burst(50,r.left+r.width/2,r.top);
  AB.ok(true);AB.label(`Dirigir ${S.biz.em} ${S.biz.name.split('"')[1]||'este negocio'} →`);
}
let typeT=null;
function initMision(){
  const b=S.biz,ev=EV[b.id];
  $('ms-em').textContent=b.em;$('ms-name').textContent=b.name;$('ms-barrio').textContent='📍 '+b.barrio;$('ms-reto').textContent=b.lesson;
  $('ms-tags').innerHTML=b.tags.map(t=>`<span class="chip ${t.c}">${t.l}</span>`).join('');
  radarSVG($('ms-radar'),metAxes(),[{v:metVals(b.base),col:'#FF8A00',fill:'rgba(255,138,0,.22)',dots:true,glow:true}],{anim:true});
  const txt=ev.intro;const el=$('ms-text');el.innerHTML='<span class="cur"></span>';let i=0;clearInterval(typeT);
  typeT=setInterval(()=>{i+=2;el.innerHTML=esc(txt.slice(0,i))+'<span class="cur"></span>';if(i>=txt.length){clearInterval(typeT);el.textContent=txt}},38);
  Voz.play('intro_'+b.id,txt,'sofia');
  AB.set('Aceptar la misión 🚀',()=>{Voz.stop(true);clearInterval(typeT);S.hist=[{k:'Inicio',m:{...b.base}}];go('draw1')},{back:()=>{Voz.stop(true);go('select')}});
}

/* ═══════════════════════════════════════
   PIZARRAS (fases 2 y 4)
═══════════════════════════════════════ */
function initDraw(k){
  refreshThumb(k);
  const next=k==='d1'?'capital':'team',back=k==='d1'?'mision':'capital';
  AB.set('Continuar →',()=>go(next),{back:()=>go(back)});
  updDrawAB(k);
}
function updDrawAB(k){
  clearInterval(skipT);
  if(Pizarra.info(k).used){AB.ok(true);AB.label(k==='d1'?'Continuar a finanzas →':'Contratar al equipo →');return}
  let s=8;AB.ok(false,P('Abran la pizarra y dibujen su plan ✏️','Abre la pizarra y dibuja tu plan ✏️'));AB.label(`Omitir pizarra (${s}s)`);
  skipT=setInterval(()=>{s--;if(s<=0){clearInterval(skipT);AB.ok(true);AB.label('Continuar sin dibujar →')}else AB.label(`Omitir pizarra (${s}s)`)},1000);
}
function openBoard(k){
  Snd.whoosh();
  Pizarra.open(k,{...BOARDS[k],onClose:(png,used,n)=>{
    S.boards[k]=used;refreshThumb(k);if(S.phase===(k==='d1'?'draw1':'draw2'))updDrawAB(k);
    if(used){Snd.ok();toast(`✏️ Pizarra guardada · ${n} elemento${n!==1?'s':''}`)}
    Live.push();
  }});
}
function refreshThumb(k){
  const box=$('dopen-'+k);const inf=Pizarra.info(k);
  const old=box.querySelector('img');if(old)old.remove();
  box.classList.toggle('has',!!inf.png);
  if(inf.png){const im=new Image();im.src=inf.png;im.alt='Pizarra';box.prepend(im);box.querySelector('.cta b').textContent='✏️ Editar pizarra'}
  else box.querySelector('.cta b').textContent='Abrir pizarra';
}

/* ═══════════════════════════════════════
   JUSTIFICACIONES
═══════════════════════════════════════ */
const JUST_MIN=45;
const JQ={cap:['¿Por qué repartieron el capital así?','¿Por qué repartiste el capital así?'],team:['¿Por qué contrataron a estas personas?','¿Por qué contrataste a estas personas?'],crisis:['¿Por qué eligieron esta opción ante la crisis?','¿Por qué elegiste esta opción ante la crisis?'],neg:['¿Qué estrategia siguieron en las 3 negociaciones?','¿Qué estrategia seguiste en las 3 negociaciones?'],opp:['¿Por qué tomaron esta decisión ante la oportunidad?','¿Por qué tomaste esta decisión ante la oportunidad?']};
const STARTERS2={...STARTERS,team:['Contratamos a … porque nuestro negocio necesita …','No contratamos a … porque …','La planilla nos alcanza porque …']};
let onJust=()=>{};
function renderJust(key,boxId,cb){
  onJust=cb;
  $(boxId).innerHTML=`<div class="just">
    <div class="just-h"><span style="font-size:1.3rem">✍️</span><b>Justificación obligatoria</b></div>
    <p class="just-q">${P(JQ[key][0],JQ[key][1])} ${S.mode==='team'?'<br>💬 <i>Debatan un minuto y escriban su razonamiento.</i>':''}</p>
    <div class="starters">${STARTERS2[key].map(s=>`<button class="starter" onclick="useStarter('${key}',this)">${s}</button>`).join('')}</div>
    <div class="ta-wrap"><textarea class="ta" id="ta-${key}" placeholder="Escriban aquí…" oninput="justInput('${key}')">${esc(S.justif[key])}</textarea>
    <button class="mic" id="mic-${key}" onclick="dictate('${key}')" title="Dictar con la voz" style="${'webkitSpeechRecognition'in window||'SpeechRecognition'in window?'':'display:none'}">🎤</button></div>
    <div class="just-foot"><div class="cnt" id="cnt-${key}"><div class="bar"><i></i></div><span></span></div></div>
  </div>`;
  justInput(key,true);
}
function useStarter(key,btn){const ta=$('ta-'+key);const t=btn.textContent;ta.value=(ta.value.trim()?ta.value.trim()+' ':'')+t;ta.focus();const p=ta.value.indexOf('…');if(p>=0)ta.setSelectionRange(p,p+1);justInput(key);Snd.click()}
function justInput(key){
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
const justHint=()=>P('Escriban su justificación (mín. 45 caracteres)','Escribe tu justificación (mín. 45 caracteres)');

/* ═══════════════════════════════════════
   FASE 3 — CAPITAL
═══════════════════════════════════════ */
const TOTAL=100000,STEP=5000;
let capDone=false,lastArea=null,prevBM=null;
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
  AB.set('Organizar el equipo →',()=>{S.hist=S.hist.filter(h=>h.k==='Inicio');S.hist.push({k:'Capital',m:projMet()});go('draw2')},{back:()=>go('draw1')});
  capDone=totalCap()===TOTAL;prevBM=null;updCap();
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
function capSet(id,v){const max=S.cap[id]+(TOTAL-totalCap());S.cap[id]=Math.max(0,Math.min(v,max));if(v>max)$('rng-'+id).value=S.cap[id];lastArea=id;updCap()}
function fillRest(){const rem=TOTAL-totalCap();if(rem<=0)return;S.cap.res+=rem;lastArea='res';Snd.coin();updCap()}
function updCap(){
  const used=totalCap(),rem=TOTAL-used,pct=Math.round(used/TOTAL*100);
  AREAS.forEach(a=>{const v=S.cap[a.id];$('amt-'+a.id).innerHTML=fmt(v)+`<span class="jar-pct">${Math.round(v/TOTAL*100)} %</span>`;
    const lq=$('liq-'+a.id);const f=Math.min(100,v/TOTAL*100*1.6)+'%';lq.style.height=f;lq.style.setProperty('--fillw',f);
    const r=$('rng-'+a.id);r.value=v;r.style.setProperty('--v',(v/TOTAL*100)+'%');$('jar-'+a.id).classList.toggle('act',v>0)});
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
  if(used===0)msg=P('Toquen <strong>+</strong> para meter billetes en cada frasco. Piensen en <strong>su rubro</strong>: ¿qué necesita más?','Toca <strong>+</strong> para meter billetes en cada frasco. Piensa en <strong>tu rubro</strong>: ¿qué necesita más?');
  else if(big){face='🤔';msg=`Más del 55 % en <strong>${big.name}</strong>: después de cierto punto, cada boliviano extra rinde menos.`}
  else if(rem===0&&S.cap.res===0){face='😬';msg='Cuadraron… ¡pero <strong>sin fondo de emergencia</strong>! Si llega una crisis, el golpe será 1,8 veces más fuerte.'}
  else if(rem===0){face='🤩';msg=`¡Cuadre perfecto! Recuerden: con <strong>${fmt(S.cap.rrhh)}</strong> de Talento pagarán la planilla de su equipo.`}
  else if(S.cap.res===0&&used>=50000){face='😬';msg='¿Y la reserva? <strong>Sin fondo de emergencia</strong>, la primera crisis puede cerrar el negocio.'}
  else if(zero.length&&used>=60000){face='🤔';msg=`Ojo: dejar <strong>${zero.map(z=>z.name).join(', ')}</strong> en cero tiene penalización.`}
  else if(lastArea==='rrhh'){msg=`Con <strong>${fmt(S.cap.rrhh)}</strong> en Talento podrán pagar el primer mes de unas <strong>${Math.max(0,Math.floor(S.cap.rrhh/4000))} personas</strong>.`}
  else if(lastArea){msg=AREAS.find(a=>a.id===lastArea).tip}
  const f=$('adv-face');if(f.textContent!==face){f.textContent=face;f.classList.remove('bump');void f.offsetWidth;f.classList.add('bump')}
  $('adv-txt').innerHTML=msg;
}
function projMet(){const m={...S.biz.base};const mods=S.biz.mods;AREAS.forEach(a=>{const fx=a.fx(S.cap[a.id]/500);Object.keys(fx).forEach(k=>m[k]+=fx[k]*(mods[a.id]||1))});return m}
function renderCapMets(){const m=projMet();$('cap-mets').innerHTML=metBars(m);
  radarSVG($('cap-radar'),metAxes(),[{v:metVals(m),col:'#FF8A00',fill:'rgba(255,138,0,.25)',glow:true}],{fs:13,vals:false});
  $('bud-mets').innerHTML=METS.map(x=>{const v=Math.round(clamp(m[x.id]));const d=prevBM?v-prevBM[x.id]:0;return`<div class="bm${d>0?' up':d<0?' down':''}"><b style="color:${x.col}">${v}</b>${x.ic}</div>`}).join('');
  prevBM=Object.fromEntries(METS.map(x=>[x.id,Math.round(clamp(m[x.id]))]))}
function metBars(m){return METS.map(x=>`<div class="mrow"><span class="mi">${x.ic}</span><span class="mn">${x.lbl}</span><div class="mb"><i style="width:${clamp(m[x.id])}%;background:${x.col}"></i></div><span class="mv">${Math.round(clamp(m[x.id]))}</span></div>`).join('')}
function capAB(){const t=totalCap();AB.ok(t===TOTAL&&justOk('cap'),t!==TOTAL?`Faltan ${fmt(TOTAL-t)} por asignar`:justHint())}

/* ═══════════════════════════════════════
   FASE 5 — CONTRATACIÓN
═══════════════════════════════════════ */
const hired=()=>CANDS.filter(c=>S.hires.includes(c.id));
const fitOf=c=>(c.fit[S.biz.id]||0);
function initTeam(){
  $('cands').innerHTML=CANDS.map(c=>`<button class="cand" id="cd-${c.id}" onclick="toggleHire('${c.id}')"><span class="ca">${c.av}</span><span class="cn">${c.name}</span><span class="cr">${c.role}</span><span class="cs">${fmt(c.sal)}/mes</span><span class="cd">${DEPTOS.find(d=>d.id===c.dept).ic} ${DEPTOS.find(d=>d.id===c.dept).name}</span></button>`).join('');
  document.querySelectorAll('.cand').forEach(tilt);
  renderJust('team','just-team',teamAB);updTeam();
  AB.set('Enfrentar los desafíos →',()=>{resolveAll();S.hist.push({k:'Equipo',m:{...S.met}});go('crisis')},{back:()=>go('draw2')});teamAB();
}
function toggleHire(id){
  const i=S.hires.indexOf(id);
  if(i>=0){S.hires.splice(i,1);Snd.click()}
  else{if(S.hires.length>=TEAM_MAX){toast('👥 Máximo 10 personas');Snd.bad();return}S.hires.push(id);Snd.coin();vib(15);const r=$('cd-'+id).getBoundingClientRect();floatFx('-'+fmt(CANDS.find(c=>c.id===id).sal),r.left+r.width/2,r.top,'#FF8A94')}
  updTeam();teamAB();
}
function updTeam(){
  const H=hired(),n=H.length,pay=H.reduce((a,c)=>a+c.sal,0),bud=S.cap.rrhh;S.payroll=pay;
  CANDS.forEach(c=>{const el=$('cd-'+c.id);el.classList.toggle('on',S.hires.includes(c.id));el.classList.toggle('full',n>=TEAM_MAX&&!S.hires.includes(c.id))});
  $('hb-n').textContent=n;$('hb-ring').style.setProperty('--p',n*10);
  const mx=Math.max(bud,pay,1)*1.15;$('hb-fill').style.width=(pay/mx*100)+'%';$('hb-mark').style.left=(bud/mx*100)+'%';
  $('hire-bar').querySelector('.hb-gauge').classList.toggle('over',pay>bud);
  $('hb-pay').textContent=fmt(pay)+'/mes';$('hb-bud').textContent='presupuesto '+fmt(bud);
  const w=$('hb-warn');const over=pay-bud;
  if(over>0){const fromRes=Math.min(over,S.cap.res);w.className='hb-warn bad';w.innerHTML=`⚠️ Exceden por ${fmt(over)}: ${fromRes?`${fmt(fromRes)} saldrán del fondo de emergencia`:''}${over>fromRes?`${fromRes?' y ':''}${fmt(over-fromRes)} serán deuda`:''}.`}
  else if(n){w.className='hb-warn ok';w.textContent=`✓ Les sobran ${fmt(-over)} para capacitación.`}else{w.className='hb-warn';w.textContent=''}
  const T={};DEPTOS.forEach(d=>T[d.id]=0);H.forEach(c=>T[c.dept]++);
  $('hb-depts').innerHTML=DEPTOS.map(d=>`<span class="hb-dep${T[d.id]?'':' zero'}">${d.ic} ${T[d.id]}</span>`).join('');
}
function teamAB(){const n=S.hires.length;AB.ok(n>=TEAM_MIN&&justOk('team'),n<TEAM_MIN?`Contraten al menos ${TEAM_MIN} personas`:justHint())}
function hireEval(){const e={key:0,useful:0,none:0};hired().forEach(c=>{const f=fitOf(c);f===2?e.key++:f===1?e.useful++:e.none++});return e}

/* Cálculo del puntaje base (capital + equipo) */
function resolveAll(){
  const m={...S.biz.base};const mods=S.biz.mods;
  AREAS.forEach(a=>{const fx=a.fx(S.cap[a.id]/500);Object.keys(fx).forEach(k=>m[k]+=fx[k]*(mods[a.id]||1))});
  if(S.cap.mkt===0){m.cli-=9;m.cre-=7}
  if(S.cap.ops===0){m.rent-=10;m.cli-=5;m.sos-=4}
  if(S.cap.rrhh===0){m.eq-=12;m.sos-=7;m.rent-=3}
  if(S.cap.inf===0){m.rent-=6;m.eq-=4;m.sos-=3}
  AREAS.forEach(a=>{const pct=S.cap[a.id]/TOTAL;if(pct>.55){const pf=(pct-.55)*1.4;const fx=a.fx((pct-.55)*TOTAL/500);Object.keys(fx).forEach(k=>m[k]-=fx[k]*(mods[a.id]||1)*pf)}});
  // Planilla vs. presupuesto de Talento
  const H=hired();S.payroll=H.reduce((a,c)=>a+c.sal,0);const over=Math.max(0,S.payroll-S.cap.rrhh);
  const fromRes=Math.min(over,S.cap.res);S.resEff=S.cap.res-fromRes;const debt=over-fromRes;
  if(over>0)m.rent-=Math.min(8,over/3000);
  if(debt>0){m.rent-=Math.min(12,debt/2000);m.sos-=Math.min(8,debt/3000)}
  if(S.cap.rrhh-S.payroll>=8000)m.eq+=3;
  S.noRes=S.resEff<=0;
  // Aporte de cada persona según su pertinencia para el rubro
  const T={};DEPTOS.forEach(d=>T[d.id]=0);
  H.forEach(c=>{const f=fitOf(c);const d=DEPTOS.find(x=>x.id===c.dept);if(f>0)T[c.dept]++;
    const k=f===2?1.25:f===1?.7:0;Object.keys(d.eff).forEach(x=>m[x]+=d.eff[x]*k);
    if(f===2)Object.keys(d.bonus).forEach(x=>m[x]+=d.bonus[x]);
    if(f===0){m.rent-=2;m.eq-=1}});
  const ev=hireEval();
  if(ev.key===0){m.rent-=8;m.sos-=4}
  if(!T.ven){m.cli-=6;m.cre-=4}
  if(!T.adm){m.rent-=4;m.eq-=3;m.sos-=3}
  if(H.length>7)m.rent-=(H.length-7)*2;
  const allF=AREAS.slice(0,4).every(a=>S.cap[a.id]>0),cover=DEPTOS.filter(d=>T[d.id]>0).length,capC=Math.max(...Object.values(S.cap))/TOTAL;
  if(allF&&cover>=4&&capC<=.40)METS.forEach(x=>m[x.id]+=10);else if(allF&&cover>=3)METS.forEach(x=>m[x.id]+=5);else if(allF&&capC<=.50)METS.forEach(x=>m[x.id]+=3);
  S.met=m;
}

/* ═══════════════════════════════════════
   EFECTOS DE LAS DECISIONES (ocultos hasta decidir)
═══════════════════════════════════════ */
function need(n){
  if(!n)return true;
  if(n.cap)return(n.cap==='res'?S.resEff:S.cap[n.cap])>=n.min;
  if(n.dept)return hired().filter(c=>c.dept===n.dept&&fitOf(c)>0).length>=n.min;
  if(n.hire)return S.hires.includes(n.hire);
  if(n.fit)return hired().filter(c=>fitOf(c)>=n.fit).length>=n.min;
  return true;
}
function evalOpt(o,mult,amp){
  const fx={rent:0,eq:0,cli:0,cre:0,sos:0};Object.keys(o.fx).forEach(k=>fx[k]+=o.fx[k]);
  let note=null,ok=null;
  if(o.cond){ok=need(o.cond.need);const add=ok?o.cond.ok:o.cond.ko;Object.keys(add||{}).forEach(k=>fx[k]+=add[k]);note=ok?o.cond.okMsg:o.cond.koMsg}
  Object.keys(fx).forEach(k=>{let d=Math.round(fx[k]*(mult||1));if(amp&&d<0)d=Math.round(d*1.8);fx[k]=d});
  return{fx,note,ok,q:o.q,lbl:o.lbl};
}
function applyFx(fx){const before={...S.met};Object.keys(fx).forEach(k=>S.met[k]+=fx[k]);Object.keys(S.met).forEach(k=>S.met[k]=clamp(S.met[k]));return before}
function optCards(opts,type){
  return opts.map((o,i)=>`<button class="opt" onclick="pickOpt('${type}',${i},this)"><span class="let">${'ABC'[i]}</span><span><div class="ol">${o.lbl}</div><div class="os">${o.sub}</div></span></button>`).join('');
}
function pickOpt(type,i,el){
  el.parentElement.querySelectorAll('.opt').forEach(o=>o.classList.remove('sel'));el.classList.add('sel');Snd.click();vib(15);
  if(type==='crisis'){if(S.cOpt===null)S.crisisTime=Math.round((Date.now()-S.crisisT0)/1000);S.cOpt=i;stopTimer();crAB()}
  if(type==='opp'){S.oppOpt=i;oppAB()}
}
const QTXT=['🔴 Decisión débil','🟡 Decisión aceptable','✅ Mejor práctica'];
const bestOf=opts=>opts.reduce((b,o)=>o.q>b.q?o:b,opts[0]);
function showImpact(before,title,res,opts,cb,extra){
  $('imp-t').textContent=title;
  const best=bestOf(opts);
  $('imp-s').innerHTML=`<span class="qbadge q${res.q}">${QTXT[res.q]}</span>`+(res.note?`<div class="imp-note${res.ok?'':' ko'}">${res.ok?'✅':'⚠️'} ${esc(res.note)}</div>`:'')+(extra||'');
  $('imp-rows').innerHTML=`<svg class="imp-radar" id="imp-radar"></svg>`+METS.map(x=>{const d=Math.round(S.met[x.id]-before[x.id]);return`<div class="mrow"><span class="mi">${x.ic}</span><span class="mn">${x.lbl}</span><div class="mb"><i id="imb-${x.id}" style="width:${clamp(before[x.id])}%;background:${x.col}"></i></div><span class="mv">${Math.round(S.met[x.id])}</span><span class="delta ${d>0?'p':d<0?'n':'z'}">${d>0?'+':''}${d||'±0'}</span></div>`}).join('')+
    (res.q<2&&best&&best.lbl?`<p class="imp-best">💡 Una alternativa más sólida era: <b>«${esc(best.lbl)}»</b></p>`:'');
  radarSVG($('imp-radar'),metAxes(),[{v:metVals(before),col:'rgba(255,255,255,.45)',dash:true,w:2},{v:metVals(S.met),col:'#FF8A00',fill:'rgba(255,138,0,.25)',glow:true}],{fs:13,vals:false,anim:true});
  $('impact').classList.add('on');
  const net=METS.reduce((a,x)=>a+S.met[x.id]-before[x.id],0);
  setTimeout(()=>{METS.forEach(x=>$('imb-'+x.id).style.width=clamp(S.met[x.id])+'%');net>=0?Snd.ok():Snd.bad();vib(net>=0?[20,40,20]:120)},250);
  $('imp-btn').onclick=()=>{$('impact').classList.remove('on');Snd.click();cb()};
}

/* ═══════════════════════════════════════
   FASE 6 — CRISIS
═══════════════════════════════════════ */
let tmr=null;const CR_SEC=75;
function initCrisis(){
  const ev=EV[S.biz.id];
  if(!S.crisis){S.cIdx=rndI(ev.crises.length);S.crisis=ev.crises[S.cIdx];S.cOpt=null;S.timedOut=false;S.crisisTime=0}
  const c=S.crisis;$('cr-ic').textContent=c.ic;$('cr-t').textContent=c.title;$('cr-d').textContent=c.desc;$('cr-loc').textContent=c.loc;
  $('cr-warn').style.display=S.noRes?'':'none';
  $('cr-opts').innerHTML=optCards(c.opts,'crisis');
  renderJust('crisis','just-crisis',crAB);
  AB.set('Confirmar decisión →',confirmCrisis);crAB();
  const bk=$('breaking');bk.querySelector('.bk-band div').textContent=('🚨 ÚLTIMO MOMENTO · '+c.title.toUpperCase()+' · ').repeat(3);
  bk.classList.add('on');Snd.alarm();vib([200,100,200,100,300]);bk.classList.add('shake-screen');
  Voz.play('crisis_'+S.biz.id+'_'+S.cIdx,c.news,'marcelo');
  setTimeout(()=>{bk.classList.remove('on','shake-screen');const ph=$('ph-crisis');ph.classList.add('shake-screen');setTimeout(()=>ph.classList.remove('shake-screen'),600);S.crisisT0=Date.now();startTimer(CR_SEC)},2800);
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
function crAB(){AB.ok(S.cOpt!==null&&justOk('crisis'),S.cOpt===null?P('Elijan una opción','Elige una opción'):justHint())}
function confirmCrisis(){
  stopTimer();Voz.stop(true);const o=S.crisis.opts[S.cOpt];const r=evalOpt(o,1,S.noRes);S.cRes=r;const before=applyFx(r.fx);S.hist.push({k:'Crisis',m:{...S.met}});
  showImpact(before,'Impacto de la crisis',r,S.crisis.opts,()=>go('neg'),S.noRes?'<div class="imp-note ko">⚠️ Sin fondo de emergencia: los golpes se multiplicaron ×1,8.</div>':'');
}

/* ═══════════════════════════════════════
   FASE 7 — NEGOCIACIÓN (3 rondas, propias del rubro)
═══════════════════════════════════════ */
let chatBusy=false;
function initNeg(){
  if(!S.negs.length){S.negs=EV[S.biz.id].negs.slice();S.negOpts=[null,null,null];S.negRes=[null,null,null];S.negRound=0}
  $('just-neg').innerHTML='';
  AB.set('Confirmar negociaciones →',confirmNeg,{disabled:true,hint:'Completen las 3 rondas'});
  playRound(Math.min(S.negRound,2));
}
function renderRounds(){$('rounds').innerHTML=S.negs.map((n,i)=>`<span class="round ${S.negOpts[i]!==null?'done':i===S.negRound?'now':''}">${S.negOpts[i]!==null?'✓':i+1} ${n.badge}</span>`).join('')}
async function playRound(r){
  const n=S.negs[r];renderRounds();chatBusy=true;
  $('ch-av').textContent=n.ic;$('ch-name').textContent=n.who;$('ch-status').textContent=n.role;$('ch-badge').textContent='Ronda '+(r+1)+'/3 · '+n.badge;
  const b=$('chat-b'),f=$('chat-f');b.innerHTML='';f.innerHTML='';
  addMsg('sys','📍 '+n.loc);
  for(const m of n.msgs){await typing(750);addMsg('them',m);Snd.click()}
  await sleep(300);
  f.innerHTML=`<span class="lbl" style="margin:0">${P('Elijan su respuesta','Elige tu respuesta')}</span>`+n.opts.map((o,i)=>`<button class="reply" style="animation-delay:${i*.08}s" onclick="answer(${r},${i})"><b>${'ABC'[i]}. ${o.lbl}</b><span>${o.sub}</span></button>`).join('');
  chatBusy=false;setTimeout(()=>f.scrollIntoView({behavior:'smooth',block:'center'}),120);
}
function addMsg(who,html){const d=document.createElement('div');d.className='msg '+who;d.innerHTML=html;$('chat-b').appendChild(d);d.scrollIntoView({block:'nearest',behavior:'smooth'})}
async function typing(ms){const t=document.createElement('div');t.className='typing';t.innerHTML='<i></i><i></i><i></i>';$('chat-b').appendChild(t);await sleep(ms);t.remove()}
const NEG_REPLY=['Mmm… está bien, si así lo quieren.','Trato hecho.','Bueno, lo vamos a pensar.'];
async function answer(r,i){
  if(chatBusy)return;chatBusy=true;const n=S.negs[r],o=n.opts[i];S.negOpts[r]=i;Snd.whoosh();vib(15);
  const res=evalOpt(o,NEG_WEIGHT);S.negRes[r]=res;
  $('chat-f').innerHTML='';addMsg('me',esc(o.lbl));
  await typing(950);addMsg('them',o.r||NEG_REPLY[o.q===2?1:o.q===1?0:2]);
  if(res.note){await sleep(300);addMsg('sys',(res.ok?'✅ ':'⚠️ ')+esc(res.note))}
  const deltas=Object.entries(res.fx).filter(([,v])=>v);const rc=$('chat-b').getBoundingClientRect();
  deltas.forEach(([k,v],j)=>setTimeout(()=>{const mt=METS.find(x=>x.id===k);floatFx(`${v>0?'+':''}${v} ${mt.ic}`,rc.left+rc.width*(.2+j*.15),rc.bottom-40,v>0?'#B8F34A':'#FF8A94')},j*120));
  deltas.reduce((a,[,v])=>a+v,0)>=0?Snd.coin():Snd.bad();
  await sleep(500);addMsg('sys',o.q===2?'🤝 Trato ganar-ganar':o.q===1?'✓ Trato cerrado':'😬 Trato cerrado… ¿a qué costo?');
  renderRounds();
  if(r<2){$('chat-f').innerHTML=`<button class="btn" onclick="S.negRound=${r+1};playRound(${r+1});window.scrollTo({top:$('rounds').offsetTop-80,behavior:'smooth'})">Siguiente ronda: ${S.negs[r+1].badge} →</button>`;chatBusy=false;setTimeout(()=>$('chat-f').scrollIntoView({behavior:'smooth',block:'center'}),100)}
  else{S.negRound=3;chatBusy=false;$('chat-f').innerHTML=`<div class="msg sys" style="align-self:center">✅ ${P('¡Completaron las 3 negociaciones!','¡Completaste las 3 negociaciones!')}</div>`;
    renderJust('neg','just-neg',negAB);negAB();setTimeout(()=>$('just-neg').scrollIntoView({behavior:'smooth',block:'center'}),300)}
}
function negAB(){const done=S.negOpts.every(x=>x!==null);AB.ok(done&&justOk('neg'),!done?'Completen las 3 rondas':justHint())}
function confirmNeg(){
  const fx={rent:0,eq:0,cli:0,cre:0,sos:0};S.negRes.forEach(r=>Object.keys(r.fx).forEach(k=>fx[k]+=r.fx[k]));
  const before=applyFx(fx);S.hist.push({k:'Negociación',m:{...S.met}});
  const qs=S.negRes.map(r=>r.q);const avgQ=Math.round(qs.reduce((a,b)=>a+b,0)/3);
  const summary=S.negs.map((n,i)=>`<div style="font-size:.8rem;margin:3px 0">${n.ic} <b>${n.badge}:</b> ${QTXT[S.negRes[i].q]}</div>`).join('');
  showImpact(before,'Impacto de las negociaciones',{q:avgQ,note:null},[{q:2,lbl:''}],()=>go('opp'),summary);
}

/* ═══════════════════════════════════════
   FASE 8 — OPORTUNIDAD (carta sorpresa)
═══════════════════════════════════════ */
function initOpp(){
  const ev=EV[S.biz.id];
  if(!S.opp){S.oIdx=rndI(ev.opps.length);S.opp=ev.opps[S.oIdx];S.oppOpt=null;S.oppShown=false}
  const o=S.opp;$('op-ic').textContent=o.ic;$('op-t').textContent=o.title;$('op-d').textContent=o.desc;$('op-loc').textContent=o.loc;
  $('scard').classList.toggle('rev',S.oppShown);
  $('op-opts').innerHTML=S.oppShown?optCards(o.opts,'opp'):'';$('just-opp').innerHTML='';
  if(S.oppShown)renderJust('opp','just-opp',oppAB);
  AB.set('Ver resultados 🏁',confirmOpp,{disabled:true,hint:P('Toquen la carta para revelarla','Toca la carta para revelarla')});if(S.oppShown)oppAB();
}
function revealOpp(){
  if(S.oppShown)return;S.oppShown=true;$('scard').classList.add('rev');Snd.whoosh();vib(30);
  Voz.play('opp_'+S.biz.id+'_'+S.oIdx,S.opp.news,'marcelo');
  setTimeout(()=>{Snd.ok();const r=$('scard').getBoundingClientRect();Confetti.burst(80,r.left+r.width/2,r.top+r.height/2);
    $('op-opts').innerHTML=optCards(S.opp.opts,'opp');renderJust('opp','just-opp',oppAB);oppAB()},700);
}
function oppAB(){AB.ok(S.oppOpt!==null&&justOk('opp'),S.oppOpt===null?P('Elijan una opción','Elige una opción'):justHint())}
function confirmOpp(){Voz.stop(true);const o=S.opp.opts[S.oppOpt];const r=evalOpt(o,1);S.oRes=r;const before=applyFx(r.fx);S.hist.push({k:'Oportunidad',m:{...S.met}});showImpact(before,'Impacto de la oportunidad',r,S.opp.opts,()=>go('results'))}

/* ═══════════════════════════════════════
   TABLERO EN VIVO
═══════════════════════════════════════ */
function openDash(){
  const m=S.phase==='capital'?projMet():S.met;
  radarSVG($('dash-radar'),metAxes(),[{v:metVals(m),col:'#FF8A00',fill:'rgba(255,138,0,.25)',dots:true,glow:true}],{anim:true});
  lineChart($('dash-evo'),[...S.hist,...(S.phase==='capital'?[{k:'Ahora',m}]:[])],{anim:true,h:220});
  if(totalCap())donut($('dash-donut'),S.cap);else $('dash-donut').innerHTML='';
  $('dash').classList.add('on');Snd.whoosh();
}

/* ═══════════════════════════════════════
   RESULTADOS
═══════════════════════════════════════ */
function computeAll(){
  const avg=avgOf(S.met);S.score=avg;const ti=TIERS.findIndex(([t])=>avg>=t);S.tierIdx=ti;S.tier=TIERS[ti][1];S.finished=true;S.perfil=perfil().name;
  S.hireEval=hireEval();
  S.benchDist=AREAS.reduce((a,x)=>a+Math.abs(S.cap[x.id]/1000-BENCH[S.biz.id][x.id]),0);
  S.negQ=S.negRes.map(r=>r?r.q:0);S.cQ=S.cRes?S.cRes.q:0;S.oQ=S.oRes?S.oRes.q:0;
  const resP=S.cap.res/1000,mx=Math.max(...Object.values(S.cap))/1000,payOk=S.payroll<=S.cap.rrhh,T={};DEPTOS.forEach(d=>T[d.id]=0);hired().forEach(c=>{if(fitOf(c)>0)T[c.dept]++});
  const cover=DEPTOS.filter(d=>T[d.id]).length,e=S.hireEval;
  S.comps={
    fin:cl(40+(mx<=55?10:-10)+(resP>=10&&resP<=25?15:resP>=5?6:resP>25?8:-18)+(payOk?14:-14)+(S.met.rent-50)/3,5,98),
    est:cl(92-S.benchDist*.9+S.oQ*6+(S.boards.d1?4:0)+(S.boards.d2?4:0),5,98),
    tal:cl(24+e.key*13+e.useful*5-e.none*12+cover*4+(payOk?8:-10),5,98),
    neg:cl(26+S.negQ.reduce((a,b)=>a+b,0)*11,5,98),
    rie:cl(28+S.cQ*20+(resP>=10?14:resP>0?5:-12)+(S.timedOut?-14:S.crisisTime&&S.crisisTime<25?6:0),5,98),
    mer:cl(30+(S.met.cli-45)*.7+(S.cap.mkt>0?8:-12)+(T.ven?10:-4)+(T.aten?4:0),5,98)
  };
  S.logros=LOGROS.filter(l=>{try{return l.t(S)}catch(x){return false}}).map(l=>l.id);
}
function initResults(){
  computeAll();
  $('sc-tier').textContent=S.tier;$('sc-sub').textContent=TIERS[S.tierIdx][2];
  $('sc-who').innerHTML=`<span class="chip">${S.av} ${esc(S.name)}</span><span class="chip">${S.biz.em} ${S.biz.name}</span>${S.members.length?`<span class="chip">👥 ${esc(S.members.join(', '))}</span>`:''}`;
  const sc=$('score');sc.style.setProperty('--p',0);const t0=performance.now();
  (function u(n){const t=Math.min((n-t0)/1600,1),e=1-Math.pow(1-t,3);sc.style.setProperty('--p',S.score*e);$('sc-n').textContent=Math.round(S.score*e);if(t<1)requestAnimationFrame(u)})(t0);
  setTimeout(()=>{Snd.fanfare();vib([50,50,50,50,200]);if(S.score>=47)Confetti.burst(S.score>=63?220:110)},1500);
  $('logros').innerHTML=LOGROS.map(l=>`<div class="logro${S.logros.includes(l.id)?' got':''}" title="${esc(l.d)}"><div class="li">${l.ic}</div><b>${l.n}</b><small>${l.d}</small></div>`).join('');
  document.querySelectorAll('#res-tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#res-tabs button').forEach(x=>x.classList.toggle('on',x===b));document.querySelectorAll('.res-tab').forEach(t=>t.classList.toggle('on',t.id===b.dataset.t));Snd.click()});
  $('rank-box').innerHTML='';
  renderDashTab();renderDecisions();renderFeedback();renderMalla();renderTimeline();
  $('pdf-status').innerHTML='';
  const sent=$('sent-msg');
  if(Live.enabled()){sent.style.display='';sent.innerHTML='📡 Enviando resultado al ranking de la sala <b>'+esc(S.sala)+'</b>…';Live.push('Terminó',()=>{sent.innerHTML='✅ Resultado en el ranking de la sala <b>'+esc(S.sala)+'</b>';fetchClass()})}
  else sent.style.display='none';
  const C=['¡Impresionante! Su gestión fue de nivel profesional. Imaginen lo que lograrán con cuatro años de formación en Negocios y Gestión Empresarial.','¡Muy bien! Tomaron decisiones sólidas. En la carrera aprenderán a convertir esa intuición en método.','Buen trabajo. Hubo aciertos y también decisiones costosas; justamente eso se aprende en Negocios y Gestión Empresarial.','Su empresa sobrevivió con dificultades. Lo importante es que hoy descubrieron por qué cada decisión importa.','Fue un reto duro, y está bien: así empiezan los grandes gerentes. Revisen su tablero y descubran qué materias les ayudarían.'];
  setTimeout(()=>Voz.play('cierre_'+S.tierIdx,C[S.tierIdx],'sofia'),2200);
  AB.set('💡 ¿Y mis finanzas personales? →',()=>{Voz.stop(true);go('transfer')});
}
function renderDashTab(c){
  radarSVG($('radar'),metAxes(),[{v:metVals(S.met),col:'#FF8A00',fill:'rgba(255,138,0,.25)',dots:true,glow:true},...(c?[{v:metVals(c.met),col:'#22E1C3',dash:true,w:2}]:[])],{anim:!c});
  $('lg-radar').innerHTML=`<span><i style="background:#FF8A00"></i>Ustedes</span>`+(c?`<span><i style="background:#22E1C3"></i>Promedio de la clase (${c.n})</span>`:`<span style="opacity:.6">El promedio de la clase aparece si juegan en una sala</span>`);
  const cv=COMPS.map(x=>S.comps[x.id]);
  radarSVG($('radar-comp'),COMPS.map(x=>({lbl:x.lbl,ic:x.ic})),[{v:cv,col:'#FFC23D',fill:'rgba(255,194,61,.22)',dots:true,glow:true},{v:COMPS.map(x=>EGRESADO[x.id]),col:'#9D7BFF',dash:true,w:2}],{anim:!c});
  $('lg-comp').innerHTML=`<span><i style="background:#FFC23D"></i>Ustedes hoy</span><span><i style="background:#9D7BFF"></i>Egresado NGE</span>`;
  if(c)return;
  lineChart($('evo'),S.hist,{anim:true});
  const B=BENCH[S.biz.id];
  $('cap-vs').innerHTML=AREAS.map(a=>{const v=S.cap[a.id]/1000,b=B[a.id];return`<div class="capbar"><span class="cl">${a.icon} ${a.name}</span><div class="cb"><i style="width:${v}%;background:${a.col}"></i><em style="left:${b}%" title="Recomendado ${b} %"></em></div><span class="cv">${Math.round(v)}%</span></div>`}).join('')+`<p class="cap-leg">▮ Barra blanca = distribución recomendada para un ${S.biz.name.split(' ')[0].toLowerCase()} (${AREAS.map(a=>B[a.id]+'%').join(' · ')})</p>`;
  const H=hired();const e=S.hireEval;
  $('team-eval').innerHTML=`<div class="dfx" style="margin-bottom:8px"><span class="chip g">⭐ ${e.key} clave</span><span class="chip">🟡 ${e.useful} útiles</span><span class="chip r">✗ ${e.none} sin relación</span><span class="chip">${S.payroll<=S.cap.rrhh?'🧾 Planilla dentro del presupuesto':'⚠️ Planilla excedida en '+fmt(S.payroll-S.cap.rrhh)}</span></div><div class="teval">`+
    H.map(c=>{const f=fitOf(c);return`<div class="te"><span class="ta">${c.av}</span><span class="tn">${c.name} · ${c.role}<small>${fmt(c.sal)}/mes</small></span><span class="tv ${f===2?'k':f===1?'u':'n'}">${f===2?'⭐ Clave':f===1?'Útil':'✗ No aporta'}</span></div>`}).join('')+
    `</div>`+(()=>{const miss=CANDS.filter(c=>fitOf(c)===2&&!S.hires.includes(c.id));return miss.length?`<p class="cap-leg" style="margin-top:8px">💡 Perfiles clave que no contrataron: ${miss.map(c=>c.av+' '+c.role).join(' · ')}</p>`:''})();
  $('fin-mets').innerHTML=metBars(S.met);
  $('res-boards').innerHTML=['d1','d2'].map(k=>{const i=Pizarra.info(k);return`<figure>${i.png?`<img src="${i.png}" alt="">`:'<span>Sin dibujo</span>'}<figcaption>${k==='d1'?'✏️ Boceto':'🏗️ Organigrama'}</figcaption></figure>`}).join('');
}
async function fetchClass(){
  try{const r=await fetch(`${CONFIG.API_URL}?action=ranking&sala=${encodeURIComponent(S.sala)}&t=${Date.now()}`);const j=await r.json();if(!j.ok)return;
    const fin=(j.items||[]).filter(x=>x.puntaje!==''&&x.puntaje!=null);if(fin.length<1)return;
    const met={};METS.forEach(m=>{const vs=fin.map(x=>x.met&&x.met[m.id]).filter(v=>v!==''&&v!=null);met[m.id]=vs.length?vs.reduce((a,b)=>a+Number(b),0)/vs.length:50});
    const sorted=fin.map(x=>Number(x.puntaje)).sort((a,b)=>b-a);const pos=sorted.findIndex(v=>v<=S.score)+1||sorted.length;
    const avg=Math.round(sorted.reduce((a,b)=>a+b,0)/sorted.length);
    S.class={n:fin.length,met,pos,avg};
    $('rank-box').innerHTML=`<b>#${pos}</b><span>de ${fin.length} en la sala ${esc(S.sala)}<br>Promedio de la clase: ${avg} pts</span>`;
    renderDashTab(S.class);
  }catch(e){}
}
function renderDecisions(){
  const card=(ic,step,title,choice,res,best,just,extra)=>`<div class="glass dec"><div class="dec-h"><span class="di">${ic}</span><div><small>${step}</small><b>${esc(title)}</b></div></div>
    ${res?`<span class="qbadge q${res.q}">${QTXT[res.q]}</span>`:''}
    ${choice?`<p class="dch">Eligieron: <b>«${esc(choice)}»</b></p>`:''}
    ${res?`<div class="dfx">${Object.entries(res.fx).filter(([,v])=>v).map(([k,v])=>{const mt=METS.find(x=>x.id===k);return`<span class="fx ${v>0?'p':'n'}">${v>0?'+':''}${v} ${mt.ic} ${mt.lbl}</span>`}).join('')}</div>`:''}
    ${res&&res.note?`<div class="imp-note${res.ok?'':' ko'}">${res.ok?'✅':'⚠️'} ${esc(res.note)}</div>`:''}
    ${extra||''}
    ${best&&res&&res.q<2?`<p class="imp-best">💡 Mejor práctica: <b>«${esc(best.lbl)}»</b></p>`:''}
    ${just?`<div class="tl-j">“${esc(just)}”</div>`:''}</div>`;
  const B=BENCH[S.biz.id];const worst=AREAS.slice().sort((a,b)=>Math.abs(S.cap[b.id]/1000-B[b.id])-Math.abs(S.cap[a.id]/1000-B[a.id]))[0];
  let h=card('💰','Fase 3 · Capital','Distribución de Bs 100.000',null,null,null,S.justif.cap,`<p class="dch">Distancia al reparto recomendado: <b>${Math.round(S.benchDist)} puntos</b>. La mayor diferencia fue en <b>${worst.icon} ${worst.name}</b> (${Math.round(S.cap[worst.id]/1000)} % vs. ${B[worst.id]} % recomendado).</p>`);
  h+=card('👥','Fase 5 · Contratación',`${S.hires.length} personas contratadas`,null,null,null,S.justif.team,`<p class="dch">${S.hireEval.key} clave · ${S.hireEval.useful} útiles · ${S.hireEval.none} sin relación con el rubro. Planilla: <b>${fmt(S.payroll)}/mes</b> de ${fmt(S.cap.rrhh)} presupuestados.</p>`);
  h+=card(S.crisis.ic,'Fase 6 · Crisis',S.crisis.title,S.crisis.opts[S.cOpt].lbl,S.cRes,bestOf(S.crisis.opts),S.justif.crisis,S.timedOut?'<div class="imp-note ko">⏰ Se les acabó el tiempo antes de decidir.</div>':S.crisisTime?`<p class="dch">Tiempo de decisión: <b>${S.crisisTime} s</b></p>`:'');
  S.negs.forEach((n,i)=>h+=card(n.ic,`Fase 7 · Negociación ${i+1}/3 · ${n.badge}`,`${n.who}: ${n.title}`,n.opts[S.negOpts[i]].lbl,S.negRes[i],bestOf(n.opts),i===2?S.justif.neg:''));
  h+=card(S.opp.ic,'Fase 8 · Oportunidad',S.opp.title,S.opp.opts[S.oppOpt].lbl,S.oRes,bestOf(S.opp.opts),S.justif.opp);
  $('dec-cards').innerHTML=h;
}
function renderFeedback(){
  const m=S.met,avg=S.score;
  const dx=avg>=75?'Perfil equilibrado de alto desempeño: las decisiones estuvieron bien fundamentadas.':avg>=60?'La empresa funciona, pero con asimetrías: algunas métricas destacan y otras piden atención urgente.':avg>=45?'La empresa sobrevive con vulnerabilidades estructurales: algunas decisiones priorizaron el corto plazo.':'La empresa enfrentó dificultades serias. Identificar estos errores es justo el primer paso de la formación empresarial.';
  const comps=COMPS.map(c=>({...c,v:S.comps[c.id]})).sort((a,b)=>b.v-a.v);
  $('feedback').innerHTML=`<div class="fb-sec"><p class="fb-t">${dx} Puntaje: <strong>${avg}/100</strong>.</p></div>
    <div class="fb-sec"><span class="lbl">Su mayor fortaleza</span><p class="fb-t">${comps[0].ic} <strong>${comps[0].lbl}</strong> (${Math.round(comps[0].v)}/100).</p></div>
    <div class="fb-sec"><span class="lbl">Lo que más deben fortalecer</span><p class="fb-t">${comps[5].ic} <strong>${comps[5].lbl}</strong> (${Math.round(comps[5].v)}/100) y ${comps[4].ic} <strong>${comps[4].lbl}</strong> (${Math.round(comps[4].v)}/100). Revisen la pestaña <b>🎓 Malla NGE</b>: ahí están las materias que los preparan para eso.</p></div>
    <div class="fb-sec"><span class="lbl">Reflexión final</span><p class="fb-t">Gestionar una empresa es decidir con <strong>información incompleta</strong> y recursos <strong>siempre limitados</strong>. Lo que vivieron hoy es exactamente lo que <strong>Negocios y Gestión Empresarial</strong> enseña a dominar con metodología y datos.</p></div>`;
}
function mallaScores(){return MALLA_MAP.map(s=>({...s,need:s.c.reduce((a,c)=>a+(100-S.comps[c]),0)/s.c.length}))}
function renderMalla(){
  const sc=mallaScores();const rec=sc.slice().sort((a,b)=>b.need-a.need).slice(0,5).map(s=>s.s);
  $('mmap').innerHTML=[1,2,3,4,5,6,7,8].map(n=>`<div class="mcol"><h4>${n}.º sem.</h4>`+sc.filter(s=>s.sem===n).map(s=>{const i=MALLA_MAP.findIndex(x=>x.s===s.s);return`<button class="msub${rec.includes(s.s)?' rec':''}" onclick="openSubj(${i})">${esc(s.s)}<span class="mc">${s.c.map(c=>COMPS.find(x=>x.id===c).ic).join(' ')}</span></button>`}).join('')+'</div>').join('');
}
const COMP_NOTE={
  fin:()=>`Reservaron ${Math.round(S.cap.res/1000)} % para emergencias y su planilla ${S.payroll<=S.cap.rrhh?'cupo':'no cupo'} en el presupuesto de Talento.`,
  est:()=>`Su reparto de capital estuvo a ${Math.round(S.benchDist)} puntos del recomendado para su rubro.`,
  tal:()=>`Contrataron ${S.hireEval.key} perfiles clave, ${S.hireEval.useful} útiles y ${S.hireEval.none} sin relación con el negocio.`,
  neg:()=>`${S.negQ.filter(q=>q===2).length} de 3 negociaciones con la mejor práctica.`,
  rie:()=>`En la crisis «${S.crisis.title}» su decisión fue ${QTXT[S.cQ].replace(/^\S+\s/,'').toLowerCase()}${S.timedOut?' y se les acabó el tiempo':''}.`,
  mer:()=>`Terminaron con Clientes en ${Math.round(S.met.cli)}/100 e invirtieron ${Math.round(S.cap.mkt/1000)} % en marketing.`
};
function openSubj(i){
  const s=MALLA_MAP[i];$('mm-sem').textContent=s.sem+'.º semestre';$('mm-s').textContent=s.s;$('mm-q').textContent='Aprenderán: '+s.q;
  $('mm-you').innerHTML=s.c.map(c=>{const x=COMPS.find(z=>z.id===c);return`<div style="margin-bottom:6px">${x.ic} <b>${x.lbl}: ${Math.round(S.comps[c])}/100</b> · ${COMP_NOTE[c]()}</div>`}).join('');
  $('m-malla').classList.add('on');Snd.click();
}
function renderTimeline(){
  const it=[];
  it.push({i:'🏢',s:'Fase 1',d:`Negocio: ${S.biz.em} ${S.biz.name}`,x:S.biz.barrio});
  it.push({i:'✏️',s:'Fase 2',d:'Pizarra de boceto',x:S.boards.d1?'✅ Planificaron visualmente antes de invertir.':'⚪ Omitieron la planificación visual.'});
  it.push({i:'💰',s:'Fase 3',d:'Distribución del capital',tags:AREAS.map(a=>`${a.icon} ${fmt(S.cap[a.id])}`),j:S.justif.cap});
  it.push({i:'🏗️',s:'Fase 4',d:'Organigrama',x:S.boards.d2?'✅ Diseñaron su estructura.':'⚪ Omitieron el organigrama.'});
  it.push({i:'👥',s:'Fase 5',d:`Contratación: ${S.hires.length} personas · ${fmt(S.payroll)}/mes`,tags:hired().map(c=>`${c.av} ${c.name} (${c.role})`),j:S.justif.team});
  it.push({i:'🚨',s:'Fase 6',d:`Crisis: ${S.crisis.title}`,x:`Opción: «${S.crisis.opts[S.cOpt].lbl}»${S.timedOut?' · ⏰ fuera de tiempo':''}`,j:S.justif.crisis});
  it.push({i:'🤝',s:'Fase 7',d:'Negociaciones (3 rondas)',x:S.negs.map((n,i)=>`${n.who}: «${n.opts[S.negOpts[i]].lbl}»`).join(' · '),j:S.justif.neg});
  it.push({i:'✦',s:'Fase 8',d:`Oportunidad: ${S.opp.title}`,x:`Opción: «${S.opp.opts[S.oppOpt].lbl}»`,j:S.justif.opp});
  it.push({i:'🏁',s:'Resultado',d:`Puntaje ${S.score}/100 · ${S.tier}`,x:METS.map(x=>`${x.ic} ${Math.round(S.met[x.id])}`).join(' · ')});
  $('timeline').innerHTML=it.map((t,k)=>`<div class="tl-i"><div class="tl-l"><div class="tl-dot">${t.i}</div>${k<it.length-1?'<div class="tl-line"></div>':''}</div><div class="tl-b"><span class="tl-s">${t.s}</span><div class="tl-d">${esc(t.d)}</div>${t.x?`<div class="tl-x">${esc(t.x)}</div>`:''}${t.tags?`<div class="tl-tags">${t.tags.map(g=>`<span class="chip">${esc(g)}</span>`).join('')}</div>`:''}${t.j?`<div class="tl-j">“${esc(t.j)}”</div>`:''}</div></div>`).join('');
}

/* ═══════════════════════════════════════
   INFORME PDF (detallado) + Drive
═══════════════════════════════════════ */
async function makePDF(){
  const btn=$('pdf-btn'),st=$('pdf-status');btn.disabled=true;st.innerHTML='⏳ Preparando el informe…';
  try{
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }catch(e){st.innerHTML='📴 Sin conexión: no se pudo cargar el generador de PDF. Usen «Tarjeta para historia».';btn.disabled=false;return}
  try{await document.fonts.ready}catch(e){}
  const root=$('pdf-root');root.innerHTML=reportHTML();
  const svgs=root.querySelectorAll('svg[data-chart]');svgs.forEach(sv=>{const k=sv.dataset.chart;
    if(k==='met')radarSVG(sv,metAxes(),[{v:metVals(S.met),col:'#FF8A00',fill:'rgba(255,138,0,.22)',dots:true},...(S.class?[{v:metVals(S.class.met),col:'#14A38B',dash:true,w:2}]:[])],{light:true});
    if(k==='comp')radarSVG(sv,COMPS.map(x=>({lbl:x.lbl,ic:x.ic})),[{v:COMPS.map(x=>S.comps[x.id]),col:'#E08A00',fill:'rgba(255,194,61,.25)',dots:true},{v:COMPS.map(x=>EGRESADO[x.id]),col:'#7B61C9',dash:true,w:2}],{light:true})});
  lineChart(root.querySelector('#pdf-evo'),S.hist,{light:true,h:240});
  const qr=root.querySelector('#pdf-qr');if(qr)qrInto(qr,CONFIG.CTA_URL);
  await sleep(250);
  const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'pt',format:'a4',compress:true});
  const pages=root.querySelectorAll('.pg');
  for(let i=0;i<pages.length;i++){
    st.innerHTML=`⏳ Generando página ${i+1} de ${pages.length}…`;
    const c=await html2canvas(pages[i],{scale:1.6,backgroundColor:'#ffffff',useCORS:true,logging:false});
    if(i)pdf.addPage();pdf.addImage(c.toDataURL('image/jpeg',.86),'JPEG',0,0,595.28,841.89);
  }
  const fname=`Informe NGE - ${S.name.replace(/[\\/:*?"<>|]/g,'')} - ${new Date().toLocaleDateString('es-BO').replace(/\//g,'-')}.pdf`;
  pdf.save(fname);root.innerHTML='';
  st.innerHTML='✅ Informe descargado.';Snd.ok();
  if(Live.enabled()){
    st.innerHTML='✅ Informe descargado · ☁️ Guardando copia en la carpeta Drive del grupo…';
    try{const b64=pdf.output('datauristring').split(',')[1];
      const r=await fetch(CONFIG.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'pdf',sala:S.sala,id:S.id,nombre:S.name,filename:fname,b64})});
      const j=await r.json();
      if(j.ok){S.pdfUrl=j.url;st.innerHTML='✅ Informe descargado y guardado en Drive (carpeta <b>Sala '+esc(S.sala)+' / '+esc(S.name)+'</b>).'}
      else st.innerHTML='✅ Informe descargado. ⚠️ No se pudo guardar en Drive'+(j.error?': '+esc(j.error):'.');
    }catch(e){st.innerHTML='✅ Informe descargado. ⚠️ No se pudo guardar en Drive (sin conexión).'}
  }
  btn.disabled=false;
}
function reportHTML(){
  const d=new Date().toLocaleString('es-BO',{dateStyle:'long',timeStyle:'short'});
  const foot=n=>`<div class="foot"><span>Laboratorio de Decisiones Financieras · Negocios y Gestión Empresarial · UNIFRANZ</span><span>${esc(S.name)} · pág. ${n}</span></div>`;
  const q=r=>r?`<span class="tag2 ${r.q===2?'t-k':r.q===1?'t-u':'t-n'}">${QTXT[r.q]}</span>`:'';
  const fxs=r=>r?Object.entries(r.fx).filter(([,v])=>v).map(([k,v])=>{const mt=METS.find(x=>x.id===k);return`${v>0?'+':''}${v} ${mt.lbl}`}).join(' · '):'';
  const B=BENCH[S.biz.id];const pf=perfil();
  const logros=LOGROS.filter(l=>S.logros.includes(l.id));
  const rec=mallaScores().sort((a,b)=>b.need-a.need).slice(0,5);
  const ev=(ic,t,choice,r,best,just,extra)=>`<h3>${ic} ${esc(t)}</h3><p>Decisión: <b>«${esc(choice)}»</b> ${q(r)}</p><p>Efecto: ${fxs(r)||'sin cambios'}</p>${r&&r.note?`<p>${r.ok?'✅':'⚠️'} ${esc(r.note)}</p>`:''}${extra||''}${r&&r.q<2?`<p>💡 Mejor práctica: «${esc(best.lbl)}»</p>`:''}${just?`<div class="quote">“${esc(just)}”</div>`:''}`;
  const p1=`<div class="pg"><div class="band"></div>
    <p style="font-family:var(--fm);font-size:11px;letter-spacing:2px;color:#c2410c;margin-top:14px">UNIFRANZ · NEGOCIOS Y GESTIÓN EMPRESARIAL</p>
    <h1 style="margin:10px 0 4px">Informe de gestión</h1><p style="font-size:15px;margin-bottom:24px">Laboratorio de Decisiones Financieras · ${esc(d)}</p>
    <div style="display:flex;gap:26px;align-items:center;margin-bottom:22px">
      <svg width="170" height="170" viewBox="0 0 170 170"><circle cx="85" cy="85" r="68" fill="none" stroke="#f1e9df" stroke-width="18"/><circle cx="85" cy="85" r="68" fill="none" stroke="#FF8A00" stroke-width="18" stroke-linecap="round" stroke-dasharray="${(2*Math.PI*68*S.score/100).toFixed(1)} 999" transform="rotate(-90 85 85)"/><text x="85" y="96" text-anchor="middle" font-size="50" font-weight="800" font-family="Bricolage Grotesque,sans-serif" fill="#1d1626">${S.score}</text><text x="85" y="118" text-anchor="middle" font-size="11" fill="#8a8196">/ 100 puntos</text></svg>
      <div><div style="font-size:54px;line-height:1">${S.av}</div><h2 style="margin:6px 0 2px;font-size:28px">${esc(S.name)}</h2><p>${S.mode==='team'?'Equipo':'Individual'}${S.members.length?' · '+esc(S.members.join(', ')):''}${S.sala?' · Sala '+esc(S.sala):''}</p>
      <p style="font-size:15px;margin-top:6px"><b>${S.biz.em} ${esc(S.biz.name)}</b> · ${esc(S.biz.barrio)}</p></div></div>
    <table style="width:100%;margin:4px 0 10px"><tr><td style="background:#FFF6EC;border-radius:10px;padding:10px 12px;width:33%"><p style="font-family:Bricolage Grotesque,sans-serif;font-weight:800;font-size:17px;color:#1d1626;margin:0">${esc(S.tier)}</p><p style="font-size:11px;color:#7a3b0c;margin:0">Nivel de gestión</p></td><td style="width:8px;border:0"></td><td style="background:#FFF6EC;border-radius:10px;padding:10px 12px;width:33%"><p style="font-family:Bricolage Grotesque,sans-serif;font-weight:800;font-size:17px;color:#1d1626;margin:0">${esc(pf.name)}</p><p style="font-size:11px;color:#7a3b0c;margin:0">Perfil financiero personal</p></td><td style="width:8px;border:0"></td><td style="background:#FFF6EC;border-radius:10px;padding:10px 12px"><p style="font-family:Bricolage Grotesque,sans-serif;font-weight:800;font-size:17px;color:#1d1626;margin:0">${S.class?`#${S.class.pos} de ${S.class.n}`:`${S.logros.length} de ${LOGROS.length}`}</p><p style="font-size:11px;color:#7a3b0c;margin:0">${S.class?`Puesto en la sala (promedio ${S.class.avg})`:'Logros desbloqueados'}</p></td></tr></table>
    <h3>Logros desbloqueados (${logros.length} de ${LOGROS.length})</h3><p>${logros.length?logros.map(l=>`${l.ic} <b>${l.n}</b> — ${l.d}`).join('<br>'):'Ninguno esta vez: ¡a intentarlo de nuevo!'}</p>
    <h3>Resumen ejecutivo</h3><p>${esc(TIERS[S.tierIdx][2])} Su mayor fortaleza fue <b>${(()=>{const c=COMPS.slice().sort((a,b)=>S.comps[b.id]-S.comps[a.id])[0];return c.ic+' '+c.lbl})()}</b> y lo que más deben fortalecer es <b>${(()=>{const c=COMPS.slice().sort((a,b)=>S.comps[a.id]-S.comps[b.id])[0];return c.ic+' '+c.lbl})()}</b>.</p>
    <table><tr><th>Indicador</th>${METS.map(m=>`<th>${m.ic} ${m.lbl}</th>`).join('')}</tr><tr><td>Final</td>${METS.map(m=>`<td><b>${Math.round(S.met[m.id])}</b></td>`).join('')}</tr>${S.class?`<tr><td>Promedio sala</td>${METS.map(m=>`<td>${Math.round(S.class.met[m.id])}</td>`).join('')}</tr>`:''}</table>
    ${foot(1)}</div>`;
  const p2=`<div class="pg"><div class="band"></div><h2 style="margin-top:12px">📊 Tablero de indicadores</h2>
    <div class="two"><div><h3>Indicadores${S.class?' vs. la clase':''}</h3><svg data-chart="met" style="width:100%;height:290px"></svg></div><div><h3>Competencias vs. egresado NGE</h3><svg data-chart="comp" style="width:100%;height:290px"></svg></div></div>
    <h3>Evolución decisión por decisión</h3><div id="pdf-evo"></div>
    <h3>Competencias</h3><table><tr>${COMPS.map(c=>`<th>${c.ic} ${c.lbl}</th>`).join('')}</tr><tr>${COMPS.map(c=>`<td><b>${Math.round(S.comps[c.id])}</b> / 100</td>`).join('')}</tr><tr>${COMPS.map(c=>`<td style="color:#7B61C9">Egresado: ${EGRESADO[c.id]}</td>`).join('')}</tr></table>
    ${foot(2)}</div>`;
  const p3=`<div class="pg"><div class="band"></div><h2 style="margin-top:12px">💰 Decisiones financieras</h2>
    <h3>Distribución del capital (Bs 100.000)</h3><table><tr><th>Área</th><th>Monto</th><th>%</th><th>Recomendado</th><th>Diferencia</th></tr>${AREAS.map(a=>{const v=S.cap[a.id]/1000;return`<tr><td>${a.icon} ${a.name}</td><td>${fmt(S.cap[a.id])}</td><td>${Math.round(v)} %</td><td>${B[a.id]} %</td><td>${v-B[a.id]>0?'+':''}${Math.round(v-B[a.id])} pts</td></tr>`}).join('')}</table>
    <div class="quote">“${esc(S.justif.cap)}”</div>
    <h3>👥 Contratación: ${S.hires.length} personas · planilla ${fmt(S.payroll)}/mes (presupuesto ${fmt(S.cap.rrhh)})</h3>
    <table><tr><th>Persona</th><th>Rol</th><th>Sueldo</th><th>Pertinencia para el rubro</th></tr>${hired().map(c=>{const f=fitOf(c);return`<tr><td>${c.av} ${c.name}</td><td>${c.role}</td><td>${fmt(c.sal)}</td><td><span class="tag2 ${f===2?'t-k':f===1?'t-u':'t-n'}">${f===2?'⭐ Clave':f===1?'Útil':'✗ No aporta'}</span></td></tr>`}).join('')}</table>
    <p>${S.payroll<=S.cap.rrhh?'✅ La planilla cupo en el presupuesto de Talento.':`⚠️ La planilla excedió el presupuesto en ${fmt(S.payroll-S.cap.rrhh)}: se cubrió con el fondo de emergencia${S.payroll-S.cap.rrhh>S.cap.res?' y deuda':''}.`}</p>
    <div class="quote">“${esc(S.justif.team)}”</div>${foot(3)}</div>`;
  const p4=`<div class="pg"><div class="band"></div><h2 style="margin-top:12px">🧠 Eventos y decisiones bajo presión</h2>
    ${ev(S.crisis.ic,'Crisis: '+S.crisis.title,S.crisis.opts[S.cOpt].lbl,S.cRes,bestOf(S.crisis.opts),S.justif.crisis,S.timedOut?'<p>⏰ Se les acabó el tiempo antes de decidir.</p>':S.crisisTime?`<p>Tiempo de decisión: ${S.crisisTime} s</p>`:'')}
    ${S.negs.map((n,i)=>ev(n.ic,`Negociación con ${n.who} (${n.badge}): ${n.title}`,n.opts[S.negOpts[i]].lbl,S.negRes[i],bestOf(n.opts),i===2?S.justif.neg:'')).join('')}
    ${ev(S.opp.ic,'Oportunidad: '+S.opp.title,S.opp.opts[S.oppOpt].lbl,S.oRes,bestOf(S.opp.opts),S.justif.opp)}
    ${foot(4)}</div>`;
  const i1=Pizarra.info('d1'),i2=Pizarra.info('d2');
  const p5=`<div class="pg"><div class="band"></div><h2 style="margin-top:12px">✏️ Pizarras del equipo</h2>
    <h3>Boceto de recursos</h3>${i1.png?`<img src="${i1.png}" style="width:100%;max-height:420px;object-fit:contain;border:1px solid #eee;border-radius:10px">`:'<p>No usaron la pizarra de boceto.</p>'}
    <h3>Organigrama</h3>${i2.png?`<img src="${i2.png}" style="width:100%;max-height:420px;object-fit:contain;border:1px solid #eee;border-radius:10px">`:'<p>No usaron la pizarra de organigrama.</p>'}
    ${foot(5)}</div>`;
  const p6=`<div class="pg"><div class="band"></div><h2 style="margin-top:12px">🔄 De la empresa a su vida · 🎓 Su ruta en NGE</h2>
    <h3>Perfil financiero personal: ${esc(pf.name)}</h3><p>${esc(pf.d)}</p>
    <h3>Mini simulador «Tu primer sueldo»</h3><p>Ingreso: ${fmt(SU.inc)}/mes · ${SCATS.map(c=>`${c.ic} ${c.n}: ${SU.p[c.id]} %`).join(' · ')}</p>
    <h3>Materias de la malla NGE que más les ayudarían</h3><table><tr><th>Sem.</th><th>Materia</th><th>Qué aprenderían</th></tr>${rec.map(s=>`<tr><td>${s.sem}.º</td><td><b>${esc(s.s)}</b></td><td>${esc(s.q)}</td></tr>`).join('')}</table>
    <div style="display:flex;gap:20px;align-items:center;margin-top:16px;padding:16px;border-radius:14px;background:#FFF6EC">
      <div id="pdf-qr" style="width:120px;height:120px;background:#fff;padding:6px;border-radius:10px"></div>
      <div><h2 style="font-size:20px;margin:0 0 6px">Lo que hicieron hoy, dominarlo toma 4 años.</h2><p>Negocios y Gestión Empresarial · UNIFRANZ<br>2 menciones: Transformación Digital y Analítica de Negocios · Emprendimiento, Innovación y Startups<br><b>${esc(CONFIG.CTA_URL)}</b></p></div></div>
    ${foot(6)}</div>`;
  return p1+p2+p3+p4+p5+p6;
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
  const res=S.cap.res,wins=S.negQ.filter(x=>x===2).length,e=S.hireEval;
  const cards=[
    {i:'💰',t:'Distribución del capital',b:`Su mayor inversión fue <strong>${topA.name}</strong>: ${fmt(top[1])} (${Math.round(top[1]/TOTAL*100)} %).`,f:'Cada mes repartirás tu ingreso entre <strong>gastos fijos</strong>, <strong>formación</strong>, <strong>gustos</strong> y <strong>ahorro</strong>. Es el mismo ejercicio, con tu propio dinero.'},
    {i:'🛡️',t:'El fondo de emergencia',b:res===0?'No guardaron reserva: la crisis los golpeó <strong>1,8 veces</strong> más fuerte.':`Guardaron <strong>${fmt(res)}</strong> (${Math.round(res/TOTAL*100)} %) para emergencias.`,f:'Sin ahorro, cualquier imprevisto (enfermedad, robo, reparación) te obliga a endeudarte. Se recomiendan <strong>3 a 6 meses</strong> de gastos guardados.'},
    {i:'🤝',t:'La negociación',b:`Cerraron <strong>${wins} de 3</strong> tratos con la mejor práctica.`,f:'Negociarás tu <strong>sueldo</strong>, tu <strong>alquiler</strong>, servicios y créditos. Quien negocia bien ahorra más sin ganar más.'},
    {i:'👥',t:'Contratar bien (invertir en ti)',b:`Contrataron <strong>${e.key} perfiles clave</strong> y ${e.none} sin relación con el rubro; la planilla ${S.payroll<=S.cap.rrhh?'cupo':'no cupo'} en el presupuesto.`,f:'Tu formación (idiomas, cursos, certificaciones) es tu capital humano: define cuánto podrás ganar. Y como en la planilla: no gastes en lo que no aporta.'},
    {i:'⚡',t:'Decidir bajo presión',b:S.timedOut?'Se les acabó el tiempo en la crisis: <strong>la indecisión también cuesta</strong>.':`En la crisis eligieron: «${esc(S.crisis.opts[S.cOpt].lbl)}».`,f:'Los préstamos rápidos y gastos urgentes son los errores más caros si no tienes criterios claros <strong>antes</strong> de la emergencia.'},
    {i:'🌱',t:'Sostenibilidad',b:`Terminaron con Sostenibilidad <strong>${Math.round(S.met.sos)}/100</strong>.`,f:'Gastar todo lo que ganas es lo mismo que una empresa sin reservas. La <strong>libertad financiera</strong> se construye con decisiones sostenidas, no con una gran ganancia.'}
  ];
  $('fgrid').innerHTML=cards.map((c,k)=>`<div class="fcard" onclick="this.classList.toggle('flip');Snd.whoosh()" style="animation:fadeUp .5s ${k*.08}s both">
    <div class="in"><div class="f fr"><span class="fi">${c.i}</span><div class="ft">${c.t}</div><p class="fx2">🏢 ${c.b}</p><span class="flab">↻ Toca: ¿y en tu vida?</span></div>
    <div class="f bk"><span class="fi">${c.i}</span><div class="ft">En tu vida personal</div><p class="fx2">${c.f}</p><span class="flab">↻ Volver al negocio</span></div></div></div>`).join('');
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
  x.textAlign='center';x.fillStyle='#22E1C3';x.font='700 44px "Plus Jakarta Sans",sans-serif';x.fillText(S.perfil+'  ·  '+(S.logros||[]).length+' logros',540,1660);
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
const Live={pending:null,busy:false,cb:[],warned:false,
  enabled(){return!!(CONFIG.API_URL&&S.sala)},
  payload(fase){return{action:'upsert',sala:S.sala,id:S.id,nombre:S.name,avatar:S.av,modo:S.mode==='team'?'Equipo':'Individual',integrantes:S.members.join(', '),
    negocio:S.biz?S.biz.em+' '+S.biz.name:'',fase:fase||LABELS[S.phase]||S.phase,progreso:PROG[S.phase]||0,
    puntaje:S.finished?S.score:'',nivel:S.finished?S.tier:'',perfil:S.finished?S.perfil:'',
    met:S.finished?Object.fromEntries(METS.map(m=>[m.id,Math.round(S.met[m.id])])):null,
    capital:AREAS.map(a=>`${a.name}: ${S.cap[a.id]}`).join(' | '),
    equipo:S.hires.length?hired().map(c=>`${c.name} (${c.role})${S.biz?' ['+(['no aporta','útil','clave'][fitOf(c)])+']':''}`).join(' | ')+` · planilla ${S.payroll}`:'',
    decisiones:S.finished?[`Crisis: ${S.crisis.opts[S.cOpt].lbl}${S.timedOut?' (fuera de tiempo)':''}`,...S.negs.map((n,i)=>`${n.badge}: ${n.opts[S.negOpts[i]].lbl}`),`Oportunidad: ${S.opp.opts[S.oppOpt].lbl}`,`Logros: ${(S.logros||[]).join(', ')}`].join(' | '):'',
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
  [1,0,2].forEach(i=>{const t=top[i];if(!t)return;const el=document.createElement('div');el.className='pod p'+(i+1);
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
  Voz.stop(true);S=newState(S);Pizarra.reset();capDone=false;stopTimer();clearInterval(skipT);
  document.querySelectorAll('.just').forEach(j=>j.remove());
  go('select');toast(P('🔄 Nueva partida: ¡elijan otro negocio!','🔄 Nueva partida: ¡elige otro negocio!'));
}
(function boot(){
  $('snd-btn').textContent=Snd.on?'🔊':'🔇';$('voz-btn').style.opacity=Voz.on?1:.4;
  if(!document.getElementById('fx-canvas')){const c=document.createElement('canvas');c.id='fx-canvas';document.getElementById('ph-home').prepend(c)}
  const q=new URLSearchParams(location.search);
  if(q.get('proyector')){startProjector(q.get('proyector'));return}
  if(q.has('docente')){$('teacher-link').style.display='';openTeacher()}
  initHome();
})();
