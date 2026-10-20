/* ═══════════════════════════════════════
   PIZARRA — vectorial, táctil, pantalla completa
═══════════════════════════════════════ */
const Board=(()=>{
  const COLORS=['#2A1D10','#FF8A00','#FF3D7F','#9D7BFF','#14A38B','#2F80ED','#E53935','#6FA312'];
  const NOTES=[{bg:'#FFF3A6',bd:'#E2CB4E'},{bg:'#CFF5D8',bd:'#74C68A'},{bg:'#D6E9FF',bd:'#7FAEE6'},{bg:'#FFD6E8',bd:'#E28AB2'},{bg:'#FFE2C4',bd:'#E5A260'}];
  const TOOLS=[['stamps','🧩','Fichas'],['move','✋','Mover'],['pen','✏️','Lápiz'],['arrow','➡️','Flecha'],['note','🗒️','Nota'],['text','🔤','Texto'],['|'],['rect','⬜','Caja'],['ellipse','⭕','Círculo'],['erase','🧽','Borrar'],['color','','Color']];
  const TIPS={move:'Arrastra para mover · doble toque para editar',pen:'Dibuja con el dedo · dos dedos para zoom',arrow:'Arrastra de una caja a otra para conectarlas',rect:'Arrastra para dibujar una caja',ellipse:'Arrastra para dibujar un círculo',text:'Toca donde quieras escribir',note:'Toca donde quieras pegar la nota',erase:'Toca lo que quieras borrar'};
  const BOXY={stamp:1,note:1,text:1,rect:1,ellipse:1};
  let cv,ctx,stage,dpr=1,W=0,H=0,mctx;
  let key=null,cfg=null,st=null;
  const store={};
  let tool='pen',color=COLORS[0],size=4,noteIdx=0;
  const ptrs=new Map();let op=null,pinch=null,textCtx=null,lastTap={t:0,x:0,y:0},toastT=null;
  let seq=1;
  const $=id=>document.getElementById(id);

  function init(){
    if(cv)return;
    cv=$('bd-cv');ctx=cv.getContext('2d');stage=$('bd-stage');
    mctx=document.createElement('canvas').getContext('2d');
    new ResizeObserver(resize).observe(stage);
    cv.addEventListener('pointerdown',pDown);
    cv.addEventListener('pointermove',pMove);
    cv.addEventListener('pointerup',pUp);
    cv.addEventListener('pointercancel',pUp);
    cv.addEventListener('wheel',onWheel,{passive:false});
    window.addEventListener('popstate',()=>{if($('board').classList.contains('on'))close(true)});
    $('bd-colors').innerHTML=COLORS.map(c=>`<button class="bd-col" style="background:${c}" data-c="${c}" onclick="Board.setColor('${c}')"></button>`).join('');
    $('bd-note-cols').innerHTML=NOTES.map((n,i)=>`<button style="background:${n.bg}" data-i="${i}" onclick="Board.setNote(${i})"></button>`).join('');
  }
  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,2.5);
    const r=stage.getBoundingClientRect();W=r.width;H=r.height;
    cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
    if(st&&!st.view)st.view=defView();
    render();
  }
  function defView(){const s=Math.max(.42,Math.min(1.05,W/980));return{s,x:W/2-460*s,y:(H-90)/2-270*s}}

  /* ---------- abrir / cerrar ---------- */
  function open(k,conf){
    init();key=k;cfg=conf;
    if(!store[k])store[k]={els:[],hist:[],fut:[],view:null,used:false};
    st=store[k];
    $('bd-title').textContent=conf.title;$('bd-prompt').textContent=conf.prompt||'';
    buildDock();buildStamps();
    const b=$('board');b.classList.add('on');b.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    history.pushState({bd:1},'');
    requestAnimationFrame(()=>{resize();setTool(st.els.length?'move':'pen',true);updUndo()});
  }
  function close(fromPop){
    if(!fromPop&&history.state&&history.state.bd){history.back();return}
    sheet(null);$('bd-text').classList.remove('on');
    $('board').classList.remove('on');$('board').setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    st.used=st.els.length>0;st.png=st.used?exportImg():null;
    if(cfg&&cfg.onClose)cfg.onClose(st.png,st.used,st.els.length);
  }

  /* ---------- UI ---------- */
  function buildDock(){
    $('bd-dock').innerHTML=TOOLS.map(t=>t[0]==='|'?'<span class="bd-sep"></span>':
      `<button class="bd-tool" data-t="${t[0]}" onclick="Board.setTool('${t[0]}')">${t[0]==='color'?`<span class="sw" id="bd-sw" style="background:${color}"></span>`:`<i>${t[1]}</i>`}<small>${t[2]}</small></button>`).join('');
  }
  function buildStamps(){
    let h=cfg.template?`<button class="bd-stamp bd-tpl" onclick="Board.template()">✨ Usar plantilla lista</button>`:'';
    (cfg.stamps||[]).forEach((g,gi)=>{
      h+=`<div class="bd-grp">${g.grp}</div><div class="bd-stamps">`+g.items.map((s,si)=>`<button class="bd-stamp" style="background:${s.bg||'#F6F0E6'}" onclick="Board.stamp(${gi},${si})">${s.ic} ${s.txt}</button>`).join('')+'</div>';
    });
    $('bd-stamps').innerHTML=h;
  }
  function setTool(t,silent){
    if(t==='stamps'){sheet('stamps');return}
    if(t==='color'){sheet('color');return}
    sheet(null);tool=t;
    document.querySelectorAll('.bd-tool').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
    if(!silent&&TIPS[t])toast(TIPS[t]);
  }
  function sheet(which){
    $('bd-sh-stamps').classList.toggle('on',which==='stamps');
    $('bd-sh-color').classList.toggle('on',which==='color');
    if(which==='color'){document.querySelectorAll('.bd-col').forEach(b=>b.classList.toggle('on',b.dataset.c===color));$('bd-size').value=size;$('bd-size-v').textContent=size}
  }
  function setColor(c){color=c;const sw=$('bd-sw');if(sw)sw.style.background=c;sheet('color')}
  function setSize(v){size=v;$('bd-size-v').textContent=v}
  function setNote(i){noteIdx=i;document.querySelectorAll('#bd-note-cols button').forEach(b=>b.classList.toggle('on',+b.dataset.i===i))}
  function toast(msg){const t=$('bd-toast');t.textContent=msg;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),1900)}
  function updUndo(){
    const b=document.querySelectorAll('.bd-acts .bd-ib');
    if(b[0])b[0].disabled=!st.hist.length;if(b[1])b[1].disabled=!st.fut.length;
    $('bd-empty').classList.toggle('hide',st.els.length>0);
    const fs=document.querySelector('.bd-tool[data-t="stamps"]');if(fs)fs.classList.toggle('pulse',!st.els.length);
  }

  /* ---------- historial ---------- */
  function snap(){st.hist.push(JSON.stringify(st.els));if(st.hist.length>60)st.hist.shift();st.fut=[]}
  function undo(){if(!st.hist.length)return;st.fut.push(JSON.stringify(st.els));st.els=JSON.parse(st.hist.pop());render();updUndo()}
  function redo(){if(!st.fut.length)return;st.hist.push(JSON.stringify(st.els));st.els=JSON.parse(st.fut.pop());render();updUndo()}
  function clearAsk(){if(!st.els.length)return;if(confirm('¿Borrar toda la pizarra?')){snap();st.els=[];render();updUndo()}}
  const nid=()=>'e'+(Date.now().toString(36))+(seq++);

  /* ---------- coordenadas ---------- */
  const V=()=>st.view;
  function toW(x,y){const v=V();return[(x-v.x)/v.s,(y-v.y)/v.s]}
  function rel(e){const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}

  /* ---------- eventos ---------- */
  function pDown(e){
    e.preventDefault();cv.setPointerCapture(e.pointerId);
    const p=rel(e);ptrs.set(e.pointerId,p);
    if(ptrs.size===2){
      if(op&&op.t==='pen'&&op.el.p.length<6)op=null;else if(op)endOp();
      op=null;const [a,b]=[...ptrs.values()];
      pinch={d0:Math.hypot(a.x-b.x,a.y-b.y)||1,m0:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},v0:{...V()}};return;
    }
    if(ptrs.size>2)return;
    startOp(p,e);
  }
  function pMove(e){
    if(!ptrs.has(e.pointerId))return;
    const p=rel(e);ptrs.set(e.pointerId,p);
    if(pinch&&ptrs.size>=2){
      const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);const m={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
      const v0=pinch.v0;const s=Math.max(.2,Math.min(4,v0.s*d/pinch.d0));
      const wx=(pinch.m0.x-v0.x)/v0.s,wy=(pinch.m0.y-v0.y)/v0.s;
      st.view={s,x:m.x-wx*s,y:m.y-wy*s};render();return;
    }
    if(op)moveOp(p);
  }
  function pUp(e){
    if(!ptrs.has(e.pointerId))return;
    const p=rel(e);ptrs.delete(e.pointerId);
    if(pinch){if(ptrs.size<2)pinch=null;return}
    if(op)endOp(p);
  }
  function onWheel(e){
    e.preventDefault();const p=rel(e);const v=V();
    const s=Math.max(.2,Math.min(4,v.s*(e.deltaY<0?1.12:1/1.12)));
    const wx=(p.x-v.x)/v.s,wy=(p.y-v.y)/v.s;st.view={s,x:p.x-wx*s,y:p.y-wy*s};render();
  }

  /* ---------- operaciones ---------- */
  function startOp(p){
    const [wx,wy]=toW(p.x,p.y);
    if(tool==='pen'){op={t:'pen',el:{id:nid(),t:'pen',c:color,sz:size,p:[[wx,wy]]}};render();return}
    if(tool==='arrow'||tool==='rect'||tool==='ellipse'){op={t:'shape',el:{id:nid(),t:tool,c:color,sz:size,x1:wx,y1:wy,x2:wx,y2:wy}};return}
    if(tool==='move'){
      const h=hit(wx,wy);
      if(h&&h.t!=='conn'){op={t:'drag',el:h,last:[wx,wy],start:p,moved:false}}
      else op={t:'pan',start:p,v0:{...V()},moved:false,hitEl:h};
      return;
    }
    if(tool==='erase'){op={t:'erase',done:false};eraseAt(wx,wy);return}
    if(tool==='text'||tool==='note'){op={t:'tap',start:p};return}
  }
  function moveOp(p){
    const [wx,wy]=toW(p.x,p.y);
    if(op.t==='pen'){const l=op.el.p[op.el.p.length-1];if(Math.hypot(wx-l[0],wy-l[1])>1.2/V().s){op.el.p.push([wx,wy]);render()}return}
    if(op.t==='shape'){op.el.x2=wx;op.el.y2=wy;render();return}
    if(op.t==='drag'){
      if(!op.moved&&Math.hypot(p.x-op.start.x,p.y-op.start.y)<4)return;
      if(!op.moved){snap();op.moved=true}
      shift(op.el,wx-op.last[0],wy-op.last[1]);op.last=[wx,wy];render();return;
    }
    if(op.t==='pan'){
      if(Math.hypot(p.x-op.start.x,p.y-op.start.y)>4)op.moved=true;
      st.view={s:op.v0.s,x:op.v0.x+p.x-op.start.x,y:op.v0.y+p.y-op.start.y};render();return;
    }
    if(op.t==='erase'){eraseAt(wx,wy)}
  }
  function endOp(p){
    const o=op;op=null;if(!o)return;
    if(o.t==='pen'){snap();st.els.push(o.el)}
    else if(o.t==='shape'){
      const e=o.el;const big=Math.hypot(e.x2-e.x1,e.y2-e.y1)>8/V().s;
      if(big){
        snap();
        if(e.t==='arrow'){
          const a=boxAt(e.x1,e.y1),b=boxAt(e.x2,e.y2);
          if(a&&b&&a!==b){st.els.push({id:e.id,t:'conn',a:a.id,b:b.id,c:e.c,sz:Math.max(2,e.sz)});toast('¡Conectadas! 🔗')}
          else st.els.push(e);
        }else st.els.push({id:e.id,t:e.t,c:e.c,sz:e.sz,x:Math.min(e.x1,e.x2),y:Math.min(e.y1,e.y2),w:Math.abs(e.x2-e.x1),h:Math.abs(e.y2-e.y1)});
      }
    }
    else if(o.t==='drag'||o.t==='pan'){
      if(!o.moved&&p){
        const now=Date.now();const [wx,wy]=toW(p.x,p.y);
        const h=hit(wx,wy);
        if(h&&now-lastTap.t<380&&Math.hypot(p.x-lastTap.x,p.y-lastTap.y)<24&&(h.t==='text'||h.t==='note'||h.t==='stamp'))openText({mode:'edit',el:h});
        lastTap={t:now,x:p.x,y:p.y};
      }
    }
    else if(o.t==='tap'&&p){
      if(Math.hypot(p.x-o.start.x,p.y-o.start.y)<10){
        const [wx,wy]=toW(p.x,p.y);const h=hit(wx,wy);
        if(h&&(h.t==='text'||h.t==='note'||h.t==='stamp'))openText({mode:'edit',el:h});
        else openText({mode:'new',type:tool,x:wx,y:wy});
      }
    }
    render();updUndo();
  }
  function eraseAt(wx,wy){
    const h=hit(wx,wy);if(!h)return;
    if(!op.done){snap();op.done=true}
    remove(h);render();updUndo();
  }
  function remove(el){st.els=st.els.filter(e=>e!==el&&!(e.t==='conn'&&(e.a===el.id||e.b===el.id)))}
  function shift(el,dx,dy){
    if(el.t==='pen')el.p.forEach(q=>{q[0]+=dx;q[1]+=dy});
    else if(el.t==='arrow'){el.x1+=dx;el.y1+=dy;el.x2+=dx;el.y2+=dy}
    else{el.x+=dx;el.y+=dy}
  }

  /* ---------- texto / notas ---------- */
  function openText(c){
    textCtx=c;const m=$('bd-text');const ta=$('bd-text-in');
    const type=c.mode==='edit'?c.el.t:c.type;
    $('bd-text-t').textContent=c.mode==='edit'?'Editar texto':(type==='note'?'Nueva nota':'Escribir texto');
    $('bd-note-cols').style.display=type==='note'?'flex':'none';
    if(type==='note')setNote(c.mode==='edit'?(c.el.n||0):noteIdx);
    ta.value=c.mode==='edit'?c.el.txt:'';
    m.classList.add('on');setTimeout(()=>ta.focus(),60);
  }
  function textOk(){
    const v=$('bd-text-in').value.trim();const c=textCtx;$('bd-text').classList.remove('on');textCtx=null;
    if(!c)return;
    if(c.mode==='edit'){
      snap();
      if(!v&&c.el.t!=='stamp')remove(c.el);else{c.el.txt=v||c.el.txt;if(c.el.t==='note')c.el.n=noteIdx}
    }else if(v){
      snap();
      if(c.type==='note')st.els.push({id:nid(),t:'note',x:c.x-95,y:c.y-30,txt:v,n:noteIdx});
      else st.els.push({id:nid(),t:'text',x:c.x,y:c.y-14,txt:v,c:color,fs:24});
    }
    render();updUndo();
  }
  function textCancel(){$('bd-text').classList.remove('on');textCtx=null}

  /* ---------- fichas y plantilla ---------- */
  function center(){const v=V();return toW(W/2,(H-90)/2)}
  function stamp(gi,si){
    const s=cfg.stamps[gi].items[si];const [cx,cy]=center();
    snap();
    const el={id:nid(),t:'stamp',ic:s.ic,txt:s.txt,bg:s.bg||'#F6F0E6',x:cx-80+(Math.random()*60-30),y:cy-24+(Math.random()*60-30)};
    layout(el);el.x=cx-el._w/2+(Math.random()*50-25);
    st.els.push(el);sheet(null);setTool('move',true);toast('Ficha agregada · arrástrala con ✋');render();updUndo();
  }
  function template(){
    if(st.els.length&&!confirm('¿Agregar la plantilla a lo que ya dibujaron?'))return;
    snap();
    const els=cfg.template(nid);
    els.forEach(e=>{if(e.t==='stamp')layout(e)});
    // centrar horizontalmente las fichas respecto a su x indicada como centro
    els.forEach(e=>{if(e.t==='stamp'&&e.cx!==undefined){e.x=e.cx-e._w/2;delete e.cx}});
    st.els.push(...els);sheet(null);setTool('move',true);fit();updUndo();
    toast('Plantilla lista · muevan, editen y conecten');
  }
  function fit(){
    if(!W||!H)resize();
    const b=bounds();if(!b){st.view=defView();render();return}
    const pad=50;const s=Math.max(.25,Math.min(1.5,W/(b.w+pad*2),(H-110)/(b.h+pad*2)));
    st.view={s,x:W/2-(b.x+b.w/2)*s,y:(H-90)/2-(b.y+b.h/2)*s};render();
  }

  /* ---------- geometría ---------- */
  function font(px,w){return`${w||700} ${px}px "Plus Jakarta Sans","Segoe UI",system-ui,sans-serif`}
  function wrap(txt,maxW,fs,w){
    mctx.font=font(fs,w);const out=[];
    String(txt).split('\n').forEach(par=>{
      let line='';par.split(' ').forEach(word=>{
        const t=line?line+' '+word:word;
        if(mctx.measureText(t).width>maxW&&line){out.push(line);line=word}else line=t;
      });out.push(line);
    });return out;
  }
  function layout(el){
    if(el.t==='text'){const ls=String(el.txt).split('\n');mctx.font=font(el.fs);el._w=Math.max(...ls.map(l=>mctx.measureText(l).width),10);el._h=ls.length*el.fs*1.25;el._ls=ls}
    else if(el.t==='note'){el._w=190;el._ls=wrap(el.txt,190-26,16,600);el._h=Math.max(80,el._ls.length*21+28)}
    else if(el.t==='stamp'){mctx.font=font(17,800);el._w=Math.max(70,mctx.measureText(el.txt).width+(el.ic?52:28));el._h=50}
    return el;
  }
  function bbox(el){
    if(el.t==='pen'){let x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;el.p.forEach(([x,y])=>{x1=Math.min(x1,x);y1=Math.min(y1,y);x2=Math.max(x2,x);y2=Math.max(y2,y)});return{x:x1,y:y1,w:x2-x1,h:y2-y1}}
    if(el.t==='arrow')return{x:Math.min(el.x1,el.x2),y:Math.min(el.y1,el.y2),w:Math.abs(el.x2-el.x1),h:Math.abs(el.y2-el.y1)};
    if(el.t==='conn')return null;
    if(el.t==='rect'||el.t==='ellipse')return{x:el.x,y:el.y,w:el.w,h:el.h};
    layout(el);return{x:el.x,y:el.y,w:el._w,h:el._h};
  }
  function bounds(){
    let b=null;st.els.forEach(e=>{const q=bbox(e);if(!q)return;
      if(!b)b={...q};else{const x2=Math.max(b.x+b.w,q.x+q.w),y2=Math.max(b.y+b.h,q.y+q.h);b.x=Math.min(b.x,q.x);b.y=Math.min(b.y,q.y);b.w=x2-b.x;b.h=y2-b.y}});
    return b;
  }
  function dSeg(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1;const l=dx*dx+dy*dy;let t=l?((px-x1)*dx+(py-y1)*dy)/l:0;t=Math.max(0,Math.min(1,t));return Math.hypot(px-(x1+t*dx),py-(y1+t*dy))}
  function hit(wx,wy){
    const tol=12/V().s;
    for(let i=st.els.length-1;i>=0;i--){
      const e=st.els[i];
      if(BOXY[e.t]){const b=bbox(e);if(wx>=b.x-tol&&wx<=b.x+b.w+tol&&wy>=b.y-tol&&wy<=b.y+b.h+tol)return e}
      else if(e.t==='pen'){for(let k=1;k<e.p.length;k++)if(dSeg(wx,wy,e.p[k-1][0],e.p[k-1][1],e.p[k][0],e.p[k][1])<tol+e.sz/2)return e;if(e.p.length===1&&Math.hypot(wx-e.p[0][0],wy-e.p[0][1])<tol)return e}
      else if(e.t==='arrow'){if(dSeg(wx,wy,e.x1,e.y1,e.x2,e.y2)<tol)return e}
      else if(e.t==='conn'){const s=connPts(e);if(s&&dSeg(wx,wy,s[0],s[1],s[2],s[3])<tol)return e}
    }
    return null;
  }
  function boxAt(wx,wy){const tol=14/V().s;for(let i=st.els.length-1;i>=0;i--){const e=st.els[i];if(!BOXY[e.t])continue;const b=bbox(e);if(wx>=b.x-tol&&wx<=b.x+b.w+tol&&wy>=b.y-tol&&wy<=b.y+b.h+tol)return e}return null}
  function clipBox(b,fx,fy,tx,ty){
    const cx=b.x+b.w/2,cy=b.y+b.h/2;const dx=tx-cx,dy=ty-cy;
    if(!dx&&!dy)return[cx,cy];
    const sx=dx?(b.w/2+6)/Math.abs(dx):1e9,sy=dy?(b.h/2+6)/Math.abs(dy):1e9;const s=Math.min(sx,sy);
    return[cx+dx*s,cy+dy*s];
  }
  function connPts(e){
    const A=st.els.find(x=>x.id===e.a),B=st.els.find(x=>x.id===e.b);if(!A||!B)return null;
    const a=bbox(A),b=bbox(B);const ac=[a.x+a.w/2,a.y+a.h/2],bc=[b.x+b.w/2,b.y+b.h/2];
    const p1=clipBox(a,0,0,bc[0],bc[1]),p2=clipBox(b,0,0,ac[0],ac[1]);return[p1[0],p1[1],p2[0],p2[1]];
  }

  /* ---------- dibujo ---------- */
  function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
  function head(c,x1,y1,x2,y2,sz,col){
    const a=Math.atan2(y2-y1,x2-x1),L=12+sz*2.2;
    c.fillStyle=col;c.beginPath();c.moveTo(x2,y2);c.lineTo(x2-L*Math.cos(a-.42),y2-L*Math.sin(a-.42));c.lineTo(x2-L*Math.cos(a+.42),y2-L*Math.sin(a+.42));c.closePath();c.fill();
  }
  function drawEl(c,e){
    c.save();c.lineCap='round';c.lineJoin='round';
    if(e.t==='pen'){
      c.strokeStyle=e.c;c.lineWidth=e.sz;c.beginPath();const p=e.p;
      if(p.length===1){c.fillStyle=e.c;c.arc(p[0][0],p[0][1],e.sz/2,0,7);c.fill()}
      else{c.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length-1;i++){const mx=(p[i][0]+p[i+1][0])/2,my=(p[i][1]+p[i+1][1])/2;c.quadraticCurveTo(p[i][0],p[i][1],mx,my)}c.lineTo(p[p.length-1][0],p[p.length-1][1]);c.stroke()}
    }else if(e.t==='arrow'){
      c.strokeStyle=e.c;c.lineWidth=e.sz;c.beginPath();c.moveTo(e.x1,e.y1);c.lineTo(e.x2,e.y2);c.stroke();head(c,e.x1,e.y1,e.x2,e.y2,e.sz,e.c);
    }else if(e.t==='conn'){
      const s=connPts(e);if(s){c.strokeStyle=e.c;c.lineWidth=e.sz;c.beginPath();c.moveTo(s[0],s[1]);c.lineTo(s[2],s[3]);c.stroke();head(c,s[0],s[1],s[2],s[3],e.sz,e.c)}
    }else if(e.t==='rect'){
      c.strokeStyle=e.c;c.lineWidth=e.sz;c.fillStyle=e.c+'14';rr(c,e.x,e.y,e.w,e.h,Math.min(14,e.w/4,e.h/4));c.fill();c.stroke();
    }else if(e.t==='ellipse'){
      c.strokeStyle=e.c;c.lineWidth=e.sz;c.fillStyle=e.c+'14';c.beginPath();c.ellipse(e.x+e.w/2,e.y+e.h/2,Math.max(1,e.w/2),Math.max(1,e.h/2),0,0,7);c.fill();c.stroke();
    }else if(e.t==='text'){
      layout(e);c.fillStyle=e.c;c.font=font(e.fs);c.textBaseline='top';e._ls.forEach((l,i)=>c.fillText(l,e.x,e.y+i*e.fs*1.25));
    }else if(e.t==='note'){
      layout(e);const n=NOTES[e.n||0];
      c.shadowColor='rgba(60,30,0,.18)';c.shadowBlur=14;c.shadowOffsetY=5;c.fillStyle=n.bg;rr(c,e.x,e.y,e._w,e._h,6);c.fill();
      c.shadowColor='transparent';c.strokeStyle=n.bd;c.lineWidth=1.5;c.stroke();
      c.fillStyle='#3A2A10';c.font=font(16,600);c.textBaseline='top';e._ls.forEach((l,i)=>c.fillText(l,e.x+13,e.y+14+i*21));
    }else if(e.t==='stamp'){
      layout(e);c.shadowColor='rgba(60,30,0,.16)';c.shadowBlur=12;c.shadowOffsetY=4;c.fillStyle=e.bg;rr(c,e.x,e.y,e._w,e._h,16);c.fill();
      c.shadowColor='transparent';c.strokeStyle='rgba(0,0,0,.12)';c.lineWidth=1.5;c.stroke();
      c.textBaseline='middle';let tx=e.x+14;
      if(e.ic){c.font='24px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';c.fillText(e.ic,tx,e.y+e._h/2+1);tx+=34}
      c.fillStyle='#2A1D10';c.font=font(17,800);c.fillText(e.txt,tx,e.y+e._h/2+1);
    }
    c.restore();
  }
  function render(){
    if(!ctx||!st)return;const v=V();if(!v)return;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#FBF7F0';ctx.fillRect(0,0,W,H);
    const g=30*v.s;if(g>9){
      ctx.fillStyle='rgba(120,90,50,.18)';const ox=((v.x%g)+g)%g,oy=((v.y%g)+g)%g;const r=Math.max(.8,1.2*Math.min(v.s,1.4));
      for(let x=ox;x<W;x+=g)for(let y=oy;y<H;y+=g){ctx.fillRect(x-r/2,y-r/2,r,r)}
    }
    ctx.setTransform(dpr*v.s,0,0,dpr*v.s,dpr*v.x,dpr*v.y);
    st.els.filter(e=>e.t==='conn').forEach(e=>drawEl(ctx,e));
    st.els.filter(e=>e.t!=='conn').forEach(e=>drawEl(ctx,e));
    if(op&&op.t==='pen')drawEl(ctx,op.el);
    if(op&&op.t==='shape'){const e=op.el;ctx.save();ctx.setLineDash([8,6]);
      if(e.t==='arrow')drawEl(ctx,e);else drawEl(ctx,{t:e.t,c:e.c,sz:e.sz,x:Math.min(e.x1,e.x2),y:Math.min(e.y1,e.y2),w:Math.abs(e.x2-e.x1),h:Math.abs(e.y2-e.y1)});ctx.restore()}
    if(op&&op.t==='drag'){const b=bbox(op.el);ctx.save();ctx.strokeStyle='#FF8A00';ctx.lineWidth=2/v.s;ctx.setLineDash([6/v.s,5/v.s]);ctx.strokeRect(b.x-6,b.y-6,b.w+12,b.h+12);ctx.restore()}
  }
  function exportImg(){
    const b=bounds();if(!b)return null;const pad=36;
    const bw=b.w+pad*2,bh=b.h+pad*2;const sc=Math.min(2,1400/bw,1000/bh);
    const c=document.createElement('canvas');c.width=Math.max(10,Math.round(bw*sc));c.height=Math.max(10,Math.round(bh*sc));
    const x=c.getContext('2d');x.fillStyle='#FBF7F0';x.fillRect(0,0,c.width,c.height);
    x.setTransform(sc,0,0,sc,(-b.x+pad)*sc,(-b.y+pad)*sc);
    st.els.filter(e=>e.t==='conn').forEach(e=>drawEl(x,e));st.els.filter(e=>e.t!=='conn').forEach(e=>drawEl(x,e));
    return c.toDataURL('image/jpeg',.86);
  }
  function info(k){const s=store[k];return s?{used:s.els.length>0,png:s.png||null,n:s.els.length,items:s.els.filter(e=>e.t!=='conn').length}:{used:false,png:null,n:0,items:0}}
  function reset(){Object.keys(store).forEach(k=>delete store[k])}
  return{open,close,setTool,setColor,setSize,setNote,sheet,undo,redo,clearAsk,fit,stamp,template,textOk,textCancel,info,reset};
})();
function closeBoard(){Board.close()}
