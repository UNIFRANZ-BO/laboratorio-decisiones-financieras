/* ═══════════════════════════════════════
   PIZARRA PRO — Excalidraw (redimensionar, texto en formas, conectores
   que se pegan, colores, fondo, tamaño de texto, deshacer…)
   Si no carga (sin internet) usa la pizarra ligera (Board).
═══════════════════════════════════════ */
const Pizarra=(()=>{
  const CDN={
    react:'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
    dom:'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
    xc:'https://unpkg.com/@excalidraw/excalidraw@0.17.6/dist/excalidraw.production.min.js',
    assets:'https://unpkg.com/@excalidraw/excalidraw@0.17.6/dist/'
  };
  const store={};let api=null,root=null,key=null,cfg=null,loading=null,failed=false;
  const $=id=>document.getElementById(id);
  function loadScript(src){return new Promise((ok,ko)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=ko;document.head.appendChild(s)})}
  function load(){
    if(window.ExcalidrawLib)return Promise.resolve();
    if(loading)return loading;
    window.EXCALIDRAW_ASSET_PATH=CDN.assets;
    loading=loadScript(CDN.react).then(()=>loadScript(CDN.dom)).then(()=>loadScript(CDN.xc)).catch(e=>{failed=true;throw e});
    return loading;
  }
  /* precarga silenciosa para que la pizarra abra al instante */
  function preload(){if(!failed&&navigator.onLine!==false)setTimeout(()=>load().catch(()=>{}),1500)}

  /* ---------- elementos “esqueleto” → Excalidraw ---------- */
  const FONT=1; // 1 = manuscrita (Virgil) · 2 = normal
  function box(id,x,y,w,h,text,bg,o){o=o||{};return{type:o.shape||'rectangle',id,x,y,width:w,height:h,backgroundColor:bg||'#ffffff',fillStyle:'solid',strokeColor:o.stroke||'#1e1e1e',strokeWidth:2,roughness:1,roundness:o.shape==='ellipse'?null:{type:3},label:{text,fontSize:o.fs||20,fontFamily:FONT}}}
  function arrow(a,b,col){
    const ax=a.x+a.width/2,ay=a.y+a.height,bx=b.x+b.width/2,by=b.y;
    return{type:'arrow',x:ax,y:ay+4,width:bx-ax,height:by-ay-8,points:[[0,0],[bx-ax,by-ay-8]],strokeColor:col||'#7B61C9',strokeWidth:2,start:{id:a.id},end:{id:b.id},endArrowhead:'arrow'};
  }
  function sideArrow(a,b,col){
    const ax=a.x+a.width/2,ay=a.y+a.height/2,bx=b.x+b.width/2,by=b.y+b.height/2;
    const dx=bx-ax,dy=by-ay;const k=.62;
    const sx=ax+dx*(1-k)/2*0, sy=ay;
    return{type:'arrow',x:ax+dx*.18,y:ay+dy*.18,width:dx*.64,height:dy*.64,points:[[0,0],[dx*.64,dy*.64]],strokeColor:col||'#B08A5A',strokeWidth:2,start:{id:a.id},end:{id:b.id},endArrowhead:'arrow'};
  }
  const narrow=()=>innerWidth<640;
  const TEMPLATES={
    d1:()=>{
      if(narrow()){
        const c=box('c',90,0,240,74,'🏢 Nuestro negocio','#FFE2C4',{fs:22});
        const ar=AREAS.map((a,i)=>box('a'+i,i%2?230:0,140+Math.floor(i/2)*150,200,76,a.icon+' '+a.name,AREA_BG[a.id],{fs:16}));
        const money=ar.map(a=>({type:'text',x:a.x+10,y:a.y+84,text:'Bs ______',fontSize:18,fontFamily:FONT,strokeColor:'#c2410c'}));
        return[c,...ar,...ar.map(a=>arrow(c,a,'#B08A5A')),...money];
      }
      const c=box('c',420,280,250,80,'🏢 Nuestro negocio','#FFE2C4',{fs:24});
      const pos=[[60,60],[420,40],[780,60],[150,520],[700,520]];
      const ar=AREAS.map((a,i)=>box('a'+i,pos[i][0],pos[i][1],250,70,a.icon+' '+a.name,AREA_BG[a.id]));
      const money=[{type:'text',x:60,y:150,text:'Bs ______',fontSize:20,fontFamily:FONT,strokeColor:'#c2410c'},{type:'text',x:420,y:130,text:'Bs ______',fontSize:20,fontFamily:FONT,strokeColor:'#c2410c'},{type:'text',x:780,y:150,text:'Bs ______',fontSize:20,fontFamily:FONT,strokeColor:'#c2410c'},{type:'text',x:150,y:610,text:'Bs ______',fontSize:20,fontFamily:FONT,strokeColor:'#c2410c'},{type:'text',x:700,y:610,text:'Bs ______',fontSize:20,fontFamily:FONT,strokeColor:'#c2410c'}];
      return[c,...ar,...ar.map(a=>sideArrow(c,a)),...money,{type:'text',x:60,y:-10,text:'✍️ Escriban cuánto pondrían en cada área y numeren sus prioridades',fontSize:18,fontFamily:FONT,strokeColor:'#6b5a48'}];
    },
    d2:()=>{
      if(narrow()){
        const g=box('g',0,325,150,90,'👑 Gerente General','#FFF0C2',{fs:18});
        const ds=DEPTOS.map((d,i)=>box('d'+i,210,140+i*110,200,70,d.ic+' '+d.name,'#E9E4F7',{fs:15}));
        const ps=DEPTOS.map((d,i)=>box('p'+i,450,147+i*110,150,56,'👤 Nombre…','#CFF5EE',{shape:'ellipse',fs:15}));
        const side=(a,b,col)=>{const ax=a.x+a.width+4,ay=a.y+a.height/2,bx=b.x-4,by=b.y+b.height/2;return{type:'arrow',x:ax,y:ay,width:bx-ax,height:by-ay,points:[[0,0],[bx-ax,by-ay]],strokeColor:col,strokeWidth:2,start:{id:a.id},end:{id:b.id},endArrowhead:'arrow'}};
        return[g,...ds,...ps,...ds.map(d=>side(g,d,'#7B61C9')),...ds.map((d,i)=>side(d,ps[i],'#14A38B'))];
      }
      const g=box('g',430,20,260,74,'👑 Gerente General','#FFF0C2',{fs:24});
      const xs=[20,250,480,710,940];
      const ds=DEPTOS.map((d,i)=>box('d'+i,xs[i],220,210,70,d.ic+' '+d.name,'#E9E4F7',{fs:17}));
      const ps=DEPTOS.map((d,i)=>box('p'+i,xs[i]+25,380,160,56,'👤 Nombre…','#CFF5EE',{shape:'ellipse',fs:16}));
      return[g,...ds,...ps,...ds.map(d=>arrow(g,d)),...ds.map((d,i)=>arrow(d,ps[i],'#14A38B')),{type:'text',x:20,y:-40,text:'✍️ Doble toque en una caja para escribir · arrastren flechas entre cajas',fontSize:18,fontFamily:FONT,strokeColor:'#6b5a48'}];
    }
  };
  const FICHAS={
    d1:[
      {g:'Áreas',items:AREAS.map(a=>({t:a.icon+' '+a.name,bg:AREA_BG[a.id]}))},
      {g:'Dinero',items:[{t:'💵 Bs 5.000',bg:'#E2F7C2'},{t:'💵 Bs 10.000',bg:'#E2F7C2'},{t:'💰 Bs 25.000',bg:'#FFF0C2'},{t:'🏦 Bs 50.000',bg:'#FFF0C2'}]},
      {g:'Prioridades',items:[{t:'🥇 Prioridad 1',bg:'#FFF0C2'},{t:'🥈 Prioridad 2',bg:'#EEEEEE'},{t:'🥉 Prioridad 3',bg:'#FFE2C4'},{t:'⚠️ Riesgo',bg:'#FFD6D6'},{t:'✅ Meta',bg:'#CFF5D8'},{t:'💡 Idea',bg:'#FFF3A6'}]},
      {g:'Notas',items:[{t:'Nota…',bg:'#FFF3A6',note:1},{t:'Nota…',bg:'#CFF5D8',note:1},{t:'Nota…',bg:'#D6E9FF',note:1},{t:'Nota…',bg:'#FFD6E8',note:1}]}
    ],
    d2:[
      {g:'Cargos',items:[{t:'👑 Gerente General',bg:'#FFF0C2'},...DEPTOS.map(d=>({t:d.ic+' '+d.name,bg:'#E9E4F7'}))]},
      {g:'Personas',items:[...CANDS.slice(0,12).map(c=>({t:c.av+' '+c.name,bg:'#CFF5EE',shape:'ellipse'})),{t:'👤 Nueva persona',bg:'#EEEEEE',shape:'ellipse'}]},
      {g:'Notas',items:[{t:'Responsable de…',bg:'#FFF3A6',note:1},{t:'Reporta a…',bg:'#D6E9FF',note:1}]}
    ]
  };

  /* ---------- abrir / cerrar ---------- */
  async function open(k,conf){
    key=k;cfg=conf;
    if(failed){Board.open(k,conf);return}
    const ov=$('xb');ov.classList.add('on');document.body.style.overflow='hidden';
    $('xb-title').textContent=conf.title;$('xb-prompt').textContent=conf.prompt||'';
    $('xb-loading').style.display='flex';
    history.pushState({xb:1},'');
    try{await load()}catch(e){ov.classList.remove('on');document.body.style.overflow='';if(history.state&&history.state.xb)history.back();toast('📴 Sin conexión: se usa la pizarra ligera');Board.open(k,conf);return}
    $('xb-loading').style.display='none';
    buildFichas(k);
    const X=window.ExcalidrawLib;const st=store[k]||{elements:[],files:{}};
    const el=React.createElement(X.Excalidraw,{
      key:k+'-'+Date.now(),langCode:'es-ES',
      initialData:{elements:st.elements,files:st.files,appState:{viewBackgroundColor:'#FBF7F0',currentItemFontFamily:FONT,currentItemRoughness:1,currentItemStrokeWidth:2},scrollToContent:true},
      excalidrawAPI:a=>{api=a},
      UIOptions:{canvasActions:{loadScene:false,saveToActiveFile:false,export:false,saveAsImage:false,toggleTheme:false,changeViewBackgroundColor:true,clearCanvas:true}},
      onChange:els=>{const n=els.filter(e=>!e.isDeleted).length;$('xb-empty').style.display=n?'none':'flex'}
    });
    if(!root)root=ReactDOM.createRoot($('xb-canvas'));
    root.render(el);
    $('xb-empty').style.display=st.elements.filter(e=>!e.isDeleted).length?'none':'flex';
  }
  async function close(fromPop){
    if(!fromPop&&history.state&&history.state.xb){history.back();return}
    const ov=$('xb');if(!ov.classList.contains('on'))return;
    sheet(false);
    let png=null,n=0;
    if(api){
      const els=api.getSceneElements().filter(e=>!e.isDeleted);const files=api.getFiles();
      store[key]={elements:els,files};n=els.filter(e=>e.type!=='arrow'&&!e.containerId).length;
      if(els.length){
        try{const blob=await window.ExcalidrawLib.exportToBlob({elements:els,files,appState:{exportBackground:true,viewBackgroundColor:'#FBF7F0'},mimeType:'image/png',exportPadding:24,maxWidthOrHeight:1400});
          png=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(blob)})}catch(e){}
      }
      store[key].png=png;store[key].n=n;
    }
    ov.classList.remove('on');document.body.style.overflow='';
    if(cfg&&cfg.onClose)cfg.onClose(png,n>0,n);
  }
  window.addEventListener('popstate',()=>{if($('xb')&&$('xb').classList.contains('on'))close(true)});

  /* ---------- plantilla y fichas ---------- */
  function center(){const s=api.getAppState();return{x:-s.scrollX+s.width/2/s.zoom.value,y:-s.scrollY+s.height/2/s.zoom.value}}
  function addSkeleton(sk,fit){
    const X=window.ExcalidrawLib;const nu=X.convertToExcalidrawElements(sk,{regenerateIds:true});
    api.updateScene({elements:[...api.getSceneElements(),...nu]});
    if(fit)setTimeout(()=>api.scrollToContent(nu,{fitToContent:true,animate:true}),60);
    else api.updateScene({appState:{selectedElementIds:Object.fromEntries(nu.filter(e=>!e.containerId).map(e=>[e.id,true]))}});
  }
  function template(){
    if(!api)return;
    if(api.getSceneElements().filter(e=>!e.isDeleted).length&&!confirm('¿Agregar la plantilla a lo que ya dibujaron?'))return;
    addSkeleton(TEMPLATES[key](),true);Snd.ok();toast('✨ Plantilla lista: toquen una caja para cambiarla');
  }
  function buildFichas(k){
    $('xb-fichas').innerHTML=FICHAS[k].map((g,gi)=>`<div class="bd-grp">${g.g}</div><div class="bd-stamps">`+g.items.map((it,ii)=>`<button class="bd-stamp" style="background:${it.bg}" onclick="Pizarra.ficha(${gi},${ii})">${esc(it.t)}</button>`).join('')+'</div>').join('');
  }
  function ficha(gi,ii){
    const it=FICHAS[key][gi].items[ii];const c=center();const w=it.note?190:Math.max(150,it.t.length*11+40),h=it.note?110:64;
    const j=()=>Math.random()*40-20;
    addSkeleton([box('f'+Date.now(),c.x-w/2+j(),c.y-h/2+j(),w,h,it.t,it.bg,{shape:it.shape,fs:it.note?16:18,stroke:it.note?'#C9A227':undefined})]);
    sheet(false);Snd.click();toast('Ficha agregada · arrástrala o cambia su tamaño');
  }
  function sheet(on){const s=$('xb-sheet');s.classList.toggle('on',on===undefined?!s.classList.contains('on'):on)}
  function info(k){if(failed||!store[k])return Board.info(k);const s=store[k];return{used:(s.n||0)>0,png:s.png||null,n:s.n||0,items:s.n||0}}
  function reset(){Object.keys(store).forEach(k=>delete store[k]);Board.reset()}
  return{open,close,template,ficha,sheet,info,reset,preload,isPro:()=>!failed};
})();
