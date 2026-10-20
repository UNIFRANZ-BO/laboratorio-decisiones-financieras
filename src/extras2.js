/* ═══════════════════════════════════════
   LÓGICA DE LOS EXTRAS v3.2 (usa funciones globales de app.js en tiempo de ejecución)
═══════════════════════════════════════ */
/* Voz en secuencia (⏭ salta al siguiente clip) */
function vozSeq(items){let i=0;const next=()=>{if(i>=items.length)return;const it=items[i++];Voz.play(it.key,it.text,it.who,next)};next()}
function explicarIndicadores(){Snd.click();vozSeq([{key:'indicadores',text:vozIndicadores(),who:'sofia'}])}
function explicarIndicador(id){Snd.click();Voz.play('ind_'+id,VOZ_IND[id],'sofia')}
function explicarPartidas(){Snd.click();Voz.play('partidas_'+S.biz.id,vozPartidas(S.biz.id),'sofia')}
function renderIndList(){
  $('ind-list').innerHTML=METS.map(m=>`<button class="ind" onclick="explicarIndicador('${m.id}')" style="--c:${m.col}"><span>${m.ic} ${m.lbl}</span><b>${Math.round(clamp(S.biz.base[m.id]))}</b><i>🔊</i></button>`).join('');
}

/* ---------- Fase 2: prioridades ---------- */
function initPrio(){
  const ids=CAPLINES[S.biz.id].map(l=>l.id);
  if(!S.prio||S.prio.length!==ids.length||!S.prio.every(id=>ids.includes(id)))S.prio=ids.slice();
  renderPrio();
  AB.set('Repartir el capital →',()=>{Voz.stop(true);go('capital')},{back:()=>go('mision')});
}
function renderPrio(){
  const L=CAPLINES[S.biz.id];
  $('prio').innerHTML=S.prio.map((id,i)=>{const l=L.find(x=>x.id===id);const a=AREAS.find(x=>x.id===l.area);return`<div class="prow" style="--c:${a.col}">
    <span class="pn">${i+1}</span><span class="pi">${l.icon}</span><span class="pt"><b>${l.name}</b><small>${l.hint}</small></span>
    <span class="pb"><button onclick="movePrio(${i},-1)" ${i?'':'disabled'} aria-label="Subir">▲</button><button onclick="movePrio(${i},1)" ${i<S.prio.length-1?'':'disabled'} aria-label="Bajar">▼</button></span></div>`}).join('');
}
function movePrio(i,d){const j=i+d;if(j<0||j>=S.prio.length)return;[S.prio[i],S.prio[j]]=[S.prio[j],S.prio[i]];Snd.click();vib(10);renderPrio()}
function prioMatch(){
  if(!S.prio)return 0;const top=CAPLINES[S.biz.id].map(l=>l.id).sort((a,b)=>(S.capL[b]||0)-(S.capL[a]||0)).slice(0,3);
  return S.prio.slice(0,3).filter(id=>top.includes(id)).length;
}

/* ---------- Guía de organigramas ---------- */
const ORG_SUGERIDO={tec:'plano',sol:'plano',cer:'plano',art:'plano',con:'matricial',imp:'horizontal',agr:'horizontal'};
function openGuia(){
  const sug=ORG_SUGERIDO[S.biz.id]||'vertical';
  $('org-tipos').innerHTML=ORG_TIPOS.map(t=>`<div class="org-t${t.id===sug?' sug':''}"><svg viewBox="0 0 200 90">${t.svg}</svg><b>${t.ic} ${t.n}${t.id===sug?' <em>sugerido</em>':''}</b><p>${t.cuando}</p><button class="btn-ghost" onclick="usarTipoOrg('${t.id}')">Usar esta plantilla</button></div>`).join('');
  $('org-pasos').innerHTML=ORG_PASOS.map(p=>`<li>${p}</li>`).join('');
  const crit=(CRIT[S.biz.id]||[]).map(g=>g.l);
  $('org-ej').innerHTML=`💡 <b>Para ${esc(S.biz.name)}</b>: les sugerimos un organigrama <b>${ORG_TIPOS.find(t=>t.id===sug).n.toLowerCase()}</b>. No olviden las funciones clave del rubro: <b>${crit.join('</b> y <b>')}</b>.`;
  $('m-guia').classList.add('on');Snd.whoosh();
}
function usarTipoOrg(t){S.orgTipo=t;closeModal('m-guia');Snd.ok();
  if($('xb').classList.contains('on'))Pizarra.template(t);else openBoard('d2',t)}

/* ---------- Caja de 6 meses ---------- */
/* Las ventas tardan en llegar (rampa): los primeros meses consumen caja.
   Ventas = costos mensuales × 1,2 × calidad de la gestión (clientes y rentabilidad). */
const RAMP=[.6,.75,.88,1,1.05,1.1];
function simCaja(){
  const opsM=CAPLINES[S.biz.id].filter(l=>l.area==='ops').reduce((a,l)=>a+(S.capL[l.id]||0),0)*.3;
  const ini=(S.capL.res||0)+Math.max(0,(S.capL.pla||0)-S.payroll);
  const sueldosCubiertos=Math.min(S.payroll,(S.capL.pla||0)+12000);  // personal que el negocio puede aprovechar
  const out=S.payroll+opsM+3000;
  const q=cl(.92+((clamp(S.met.cli)+clamp(S.met.rent))/2-45)/120,.85,1.2);
  const rev=(sueldosCubiertos+opsM+3000)*1.2*q;
  let cash=ini,min=ini,minM=0;const ms=RAMP.map((r,i)=>{const inc=rev*r;cash+=inc-out;if(cash<min){min=cash;minM=i+1}return{inc,out,cash}});
  return{ini,ms,min,minM,fin:cash};
}
function initCaja(){
  const c=S.cajaRes||simCaja();S.cajaRes=c;
  $('cj-ini').textContent=fmt(c.ini);$('cj-pay').textContent=fmt(S.payroll);$('cj-fin').textContent=fmt(c.fin);
  $('cj-fin').style.color=c.fin<0?'#FF8A94':'var(--lime)';
  const mx=Math.max(...c.ms.map(m=>Math.abs(m.cash)),c.ini,1);
  $('cj-chart').innerHTML=c.ms.map((m,i)=>{const h=Math.abs(m.cash)/mx*100;return`<div class="cj-m"><div class="cj-top">${m.cash>=0?`<i class="pos" style="--h:${h}%;animation-delay:${i*.35}s"></i>`:''}</div><div class="cj-zero"></div><div class="cj-bot">${m.cash<0?`<i class="neg" style="--h:${h}%;animation-delay:${i*.35}s"></i>`:''}</div><b>${Math.round(m.cash/1000)}k</b><small>Mes ${i+1}</small></div>`}).join('');
  let msg,fx={rent:0,eq:0,cli:0,cre:0,sos:0};
  if(c.min<-1500){msg=`😬 <b>En el mes ${c.minM} se quedaron sin caja.</b> Tuvieron que pedir un préstamo de emergencia con intereses altos. Revisen: ¿planilla muy grande? ¿poca reserva?`;fx={rent:-4,eq:-2,cli:0,cre:0,sos:-6}}
  else if(c.fin>=c.ini){msg='✅ <b>Su caja aguantó y creció.</b> Las ventas alcanzaron para pagar sueldos e insumos todos los meses.';fx={rent:2,eq:0,cli:0,cre:0,sos:3}}
  else msg='⚠️ <b>La caja bajó, pero no se acabó.</b> Están vivos, aunque con poco margen para imprevistos.';
  $('cj-msg').innerHTML=msg;
  if(!S.cajaDone){S.cajaDone=true;S.cajaFx=fx;applyFx(fx);S.hist.push({k:'Caja',m:{...S.met}});setTimeout(()=>{c.min<-1500?Snd.bad():Snd.ok()},RAMP.length*350+300)}
  AB.set('Enfrentar los desafíos →',()=>micro('team',()=>go('crisis')));
}

/* ---------- Micropausas ---------- */
function micro(k,next){
  const m=MICRO[k];if(!m||(S.micro&&S.micro[k]!=null)){next();return}
  S.micro=S.micro||{};$('mi-q').textContent=m.q;$('mi-f').textContent='';$('mi-btn').disabled=true;
  $('mi-o').innerHTML=m.o.map((o,i)=>`<button class="mopt" onclick="microPick('${k}',${i},this)">${o.t}</button>`).join('');
  $('mi-btn').onclick=()=>{closeModal('m-micro');Snd.click();next()};
  $('m-micro').classList.add('on');Snd.whoosh();
}
function microPick(k,i,el){
  if(S.micro[k]!=null)return;const o=MICRO[k].o[i];S.micro[k]=i;
  document.querySelectorAll('#mi-o .mopt').forEach((b,j)=>{b.classList.add(MICRO[k].o[j].ok?'ok':'no');b.disabled=true});el.classList.add('pick');
  $('mi-f').innerHTML=(o.ok?'✅ ':'💡 ')+o.f;if(o.ok){Snd.ok();Confetti.burst(40,innerWidth/2,innerHeight*.4)}else Snd.click();$('mi-btn').disabled=false;
}
const microOk=()=>Object.entries(S.micro||{}).filter(([k,i])=>MICRO[k].o[i].ok).length;

/* ---------- Comodín ---------- */
function comodinEv(where){
  if(where==='crisis')return{key:`hint_${S.biz.id}_c${S.cIdx}`,ev:S.crisis};
  if(where==='opp')return{key:`hint_${S.biz.id}_o${S.oIdx}`,ev:S.opp};
  const r=Math.min(S.negRound,2);return{key:`hint_${S.biz.id}_n${r}`,ev:S.negs[r]};
}
function usarComodin(where){
  if(S.comodin){toast('📞 Ya usaron su comodín en esta partida');return}
  S.comodin=where;const c=comodinEv(where);Snd.ok();vib(30);
  Voz.play(c.key,vozHint(c.ev),'dani');
  document.querySelectorAll('.comodin').forEach(b=>b.style.display='none');
}
const comodinBtn=()=>S.comodin?'':`<button class="btn-ghost comodin" onclick="usarComodin('neg')">📞 Comodín: llamar a un estudiante de NGE</button>`;

/* ---------- Contraoferta (ronda con el cliente) ---------- */
function contraUI(r){
  if(chatBusy)return;const n=S.negs[r];S.cmin=S.cmin||35+rndI(31);S.ctry=S.ctry||0;
  $('chat-f').innerHTML=`<div class="contra"><b>✍️ Su contraoferta</b><span>¿Qué parte de lo que pide <b>${esc(n.who)}</b> están dispuestos a ceder?</span>
    <input type="range" min="0" max="100" step="5" value="50" id="co-v" oninput="$('co-l').textContent=this.value+' %'"><div class="co-row"><small>0 % · nada</small><b id="co-l">50 %</b><small>100 % · todo lo que pide</small></div>
    <button class="btn" onclick="enviarContra(${r})">Enviar contraoferta</button><button class="btn-link" onclick="playRound(${r})">← Volver a las opciones</button></div>`;
}
async function enviarContra(r){
  if(chatBusy)return;chatBusy=true;const n=S.negs[r],v=+$('co-v').value,m=S.cmin;Snd.whoosh();
  $('chat-f').innerHTML='';addMsg('me',`Les propongo ceder el <b>${v} %</b> de lo que piden.`);await typing(1000);
  if(v>=m){
    const t=(v-m)/Math.max(1,100-m);const fx={};Object.keys(n.opts[1].fx).forEach(k=>fx[k]=Math.round((n.opts[1].fx[k]*(1-t)+n.opts[0].fx[k]*t)*NEG_WEIGHT));
    const q=v-m<=15?2:v-m<=35?1:0;
    addMsg('them',q===2?'Mmm… es justo. ¡Trato hecho! 🤝':q===1?'Bueno, acepto. 👍':'¡Perfecto! Aceptamos encantados 😁');
    finishRound(r,'c',{fx,q,ok:true,lbl:`Contraoferta: ceder ${v} %`,note:`Ofrecieron ceder ${v} %; lo mínimo que ${n.who} aceptaba era ${m} %. ${q===2?'¡Negociaron casi al límite!':'Cedieron más de lo necesario.'}`});
  }else if(++S.ctry<2){
    addMsg('them','Eso es muy poco… Mejoren su oferta o no hay trato 😤');chatBusy=false;contraUI(r);
  }else{
    addMsg('them','Así no llegamos a nada. Buscaré otra opción. 👋');
    const res=evalOpt(n.opts[2],NEG_WEIGHT);res.lbl='Contraoferta rechazada (sin acuerdo)';res.note=`No hubo acuerdo: ofrecieron ${v} % y lo mínimo aceptable era ${m} %.`;res.ok=false;
    finishRound(r,'c',res);
  }
}

/* ---------- Crisis en vivo ---------- */
let liveT=null,liveTimer=null;
function startLivePoll(){clearInterval(liveT);S.joinT=Date.now();liveT=setInterval(pollLive,10000)}
async function pollLive(){
  if(!Live.enabled()||['home','setup','results','transfer','proj'].includes(S.phase)||S.finished)return;
  if(document.querySelector('.modal.on,#impact.on,#breaking.on,#xb.on'))return;
  try{const r=await fetch(`${CONFIG.API_URL}?action=evento&sala=${encodeURIComponent(S.sala)}&t=${Date.now()}`);const j=await r.json();
    if(j.ok&&j.ev&&j.ev.id>S.joinT&&j.ev.id!==S.lastLive){S.lastLive=j.ev.id;showLive(j.ev.tipo)}}catch(e){}
}
function showLive(tipo){
  const ev=LIVE.find(x=>x.id===tipo);if(!ev)return;S.liveEv=ev;
  $('lv-ic').textContent=ev.ic;$('lv-t').textContent=ev.title;$('lv-d').textContent=ev.desc;
  $('lv-o').innerHTML=ev.opts.map((o,i)=>`<button class="opt" onclick="pickLive(${i})"><span class="let">${'ABC'[i]}</span><span><div class="ol">${o.lbl}</div><div class="os">${o.sub}</div></span></button>`).join('');
  $('m-live').classList.add('on');Snd.alarm();vib([200,100,200]);Voz.play('live_'+ev.id,ev.news,'marcelo');
  let s=30;const T=()=>{$('lv-tnum').textContent=s+'s';$('lv-tbar').style.width=(s/30*100)+'%'};T();clearInterval(liveTimer);
  liveTimer=setInterval(()=>{s--;T();if(s<=0){clearInterval(liveTimer);pickLive(-1)}},1000);
}
function pickLive(i){
  clearInterval(liveTimer);Voz.stop(true);const ev=S.liveEv;closeModal('m-live');
  const res=i<0?{fx:{rent:0,eq:-2,cli:0,cre:0,sos:-3},q:0,lbl:'Sin decisión (se acabó el tiempo)'}:evalOpt(ev.opts[i],1,S.noRes);
  applyFx(res.fx);S.liveRes={title:ev.title,...res};
  const d=Object.entries(res.fx).filter(([,v])=>v).map(([k,v])=>`${v>0?'+':''}${v} ${METS.find(m=>m.id===k).ic}`).join(' ');
  toast(`⚡ ${ev.title}: ${QTXT[res.q]} · ${d}`,4500);if(res.q===2)Snd.ok();else Snd.bad();
}
function openLanzar(){$('lz-o').innerHTML=LIVE.map(e=>`<button class="opt" onclick="lanzarLive('${e.id}')"><span class="let">${e.ic}</span><span><div class="ol">${e.title}</div><div class="os">${e.desc}</div></span></button>`).join('');$('m-lanzar').classList.add('on')}
async function lanzarLive(id){
  closeModal('m-lanzar');
  try{const r=await fetch(CONFIG.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'evento',sala:pjCode,tipo:id})});const j=await r.json();
    if(j.ok){toast('⚡ Crisis enviada a todos los equipos de la sala '+pjCode,4000);Snd.alarm()}else toast('⚠️ No se pudo enviar: actualiza el Apps Script ('+(j.error||'')+')',5000)}
  catch(e){toast('⚠️ Sin conexión con el Apps Script',4000)}
}

/* ---------- Quiz final ---------- */
let QZ=null;
function openQuiz(){const pool=QUIZ.slice().sort(()=>Math.random()-.5).slice(0,3);QZ={pool,i:0,ok:0};showQ();$('m-quiz').classList.add('on');Snd.whoosh()}
function showQ(){
  const q=QZ.pool[QZ.i];$('qz-n').textContent=(QZ.i+1)+'/3';$('qz-q').textContent=q.q;$('qz-f').textContent='';$('qz-btn').disabled=true;
  $('qz-btn').textContent=QZ.i<2?'Siguiente →':'Ver resultado';
  $('qz-o').dataset.done='';$('qz-o').innerHTML=q.o.map((o,i)=>`<button class="mopt" onclick="pickQ(${i},this)">${o}</button>`).join('');
  $('qz-btn').onclick=()=>{if(QZ.i<2){QZ.i++;showQ()}else{closeModal('m-quiz');S.quiz={ok:QZ.ok,n:3};toast(`🧠 Quiz: ${QZ.ok}/3 correctas`,3500);if(QZ.ok===3){Confetti.burst(160);Snd.fanfare()}Live.push('Terminó')}};
}
function pickQ(i,el){
  const q=QZ.pool[QZ.i];if(el.parentElement.dataset.done==='1')return;el.parentElement.dataset.done='1';
  document.querySelectorAll('#qz-o .mopt').forEach((b,j)=>{b.classList.add(j===q.a?'ok':'no');b.disabled=true});el.classList.add('pick');
  if(i===q.a){QZ.ok++;Snd.ok();$('qz-f').textContent='✅ ¡Correcto!'}else{Snd.bad();$('qz-f').textContent='💡 La respuesta correcta era: '+q.o[q.a]}
  $('qz-btn').disabled=false;
}

/* ---------- Certificado «Gerente por un día» ---------- */
async function makeCert(){
  const st=$('pdf-status');st.innerHTML='⏳ Preparando su certificado…';
  try{await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')}
  catch(e){st.innerHTML='📴 Sin conexión: no se pudo generar el certificado.';return}
  try{await document.fonts.ready}catch(e){}
  const d=new Date().toLocaleDateString('es-BO',{day:'numeric',month:'long',year:'numeric'});
  const lg=LOGROS.filter(l=>S.logros.includes(l.id));
  const root=$('pdf-root');root.innerHTML=`<div class="cert"><div class="cert-in">
    <p class="ce-k">UNIFRANZ · NEGOCIOS Y GESTIÓN EMPRESARIAL</p>
    <p class="ce-h">Certificado</p><p class="ce-s">de «Gerente por un día» otorgado a</p>
    <div class="ce-n">${S.av} ${esc(S.name)}</div>${S.members.length?`<p class="ce-m">${esc(S.members.join(' · '))}</p>`:''}
    <p class="ce-t">por dirigir <b>${S.biz.em} ${esc(S.biz.name)}</b> en el Laboratorio de Decisiones Financieras, alcanzando <b>${S.score} puntos</b> y el nivel <b>${esc(S.tier)}</b>.</p>
    <div class="ce-l">${lg.map(l=>`<span>${l.ic} ${l.n}</span>`).join('')}</div>
    <table class="ce-f"><tr><td><div class="ce-line"></div>Negocios y Gestión Empresarial<br>UNIFRANZ · Cochabamba</td><td style="text-align:right">${d}</td></tr></table>
  </div></div>`;
  await sleep(200);
  const c=await html2canvas(root.firstElementChild,{scale:1.6,backgroundColor:'#ffffff'});
  const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'pt',format:'a4',orientation:'landscape'});
  pdf.addImage(c.toDataURL('image/jpeg',.9),'JPEG',0,0,841.89,595.28);
  const fname=`Certificado NGE - ${S.name.replace(/[\\/:*?"<>|]/g,'')}.pdf`;pdf.save(fname);root.innerHTML='';
  st.innerHTML='🏅 Certificado descargado.';Snd.fanfare();Confetti.burst(120);
  if(Live.enabled()){try{await fetch(CONFIG.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'pdf',sala:S.sala,id:S.id,nombre:S.name,filename:fname,b64:pdf.output('datauristring').split(',')[1]})});st.innerHTML='🏅 Certificado descargado y guardado en la carpeta Drive del grupo.'}catch(e){}}
}
