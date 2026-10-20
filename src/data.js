/* ═══════════════════════════════════════
   DATOS — se conservan los valores calibrados del simulador original
═══════════════════════════════════════ */
const BIZS=[
  {id:'chi',em:'🍖',name:'Chicharronería "El Pairumani"',barrio:'Zona Norte · Av. Blanco Galindo',stars:2,glow:'#FF8A00',
   desc:'Restaurante familiar reconocido por su chicharrón de cerdo y lagua de maíz. Alta rotación, costos operativos variables.',
   lesson:'Gestión de costos variables y temporadas de alta demanda.',
   tags:[{l:'Alta demanda',c:'g'},{l:'Temporadas altas',c:'g'},{l:'Costos variables',c:'r'}],
   base:{rent:34,eq:32,cli:38,cre:26,sos:30},mods:{mkt:1.1,ops:1.5,rrhh:1.2,inf:0.9,res:1.0}},
  {id:'tra',em:'🚐',name:'Transporte "Cocha Express"',barrio:'Terminal de Buses · Centro',stars:3,glow:'#4CC9FF',
   desc:'Transporte interdepartamental de pasajeros y encomiendas. Expuesto a bloqueos y alta competencia.',
   lesson:'Riesgo operativo y necesidad de reservas ante imprevistos.',
   tags:[{l:'Demanda constante',c:'g'},{l:'Bloqueos frecuentes',c:'r'},{l:'Alta competencia',c:'r'}],
   base:{rent:32,eq:34,cli:30,cre:26,sos:32},mods:{mkt:0.8,ops:1.6,rrhh:1.0,inf:1.4,res:1.3}},
  {id:'can',em:'🛒',name:'Tienda "Doña Rosario"',barrio:'La Cancha · Zona Sudeste',stars:2,glow:'#B8F34A',
   desc:'Puesto de abarrotes en el mercado más grande de Bolivia. Volumen alto, margen ajustado.',
   lesson:'Margen ajustado y fidelización de la clientela local.',
   tags:[{l:'Volumen alto',c:'g'},{l:'Margen bajo',c:'r'},{l:'Cliente fiel',c:'g'}],
   base:{rent:36,eq:28,cli:40,cre:24,sos:32},mods:{mkt:1.3,ops:1.3,rrhh:0.9,inf:0.8,res:1.1}},
  {id:'art',em:'🏺',name:'Artesanías "Llajta Manos"',barrio:'Quillacollo · Zona Artesanal',stars:3,glow:'#FF5E3A',
   desc:'Producción y exportación de cerámica y textiles. Producto único con potencial internacional.',
   lesson:'Inversión en marketing y potencial de exportación.',
   tags:[{l:'Producto único',c:'g'},{l:'Mercado exportación',c:'g'},{l:'Producción lenta',c:'r'}],
   base:{rent:28,eq:36,cli:28,cre:38,sos:40},mods:{mkt:1.4,ops:1.0,rrhh:1.4,inf:1.2,res:0.9}},
  {id:'tec',em:'📱',name:'Startup "KobolDev"',barrio:'Incubadora UNIFRANZ · Av. Américas',stars:4,glow:'#9D7BFF',
   desc:'Software cochabambino para negocios locales. Alto potencial, requiere talento y capital intensivo.',
   lesson:'Capital intensivo en infraestructura y talento tecnológico.',
   tags:[{l:'Alto potencial',c:'g'},{l:'Capital intensivo',c:'r'},{l:'Mercado creciente',c:'g'}],
   base:{rent:26,eq:34,cli:26,cre:48,sos:26},mods:{mkt:1.1,ops:0.9,rrhh:1.6,inf:1.5,res:0.9}},
  {id:'imp',em:'🚢',name:'Importadora "Andes Global"',barrio:'Zona Franca · Av. Circunvalación',stars:4,glow:'#22E1C3',
   desc:'Importación de maquinaria y materias primas. Expuesta al tipo de cambio y aranceles.',
   lesson:'Exposición al tipo de cambio y riesgo de diversificación.',
   tags:[{l:'Alto margen',c:'g'},{l:'Dependencia del $',c:'r'},{l:'Aranceles variables',c:'r'}],
   base:{rent:38,eq:28,cli:26,cre:32,sos:26},mods:{mkt:0.9,ops:1.5,rrhh:1.0,inf:1.4,res:1.2}},
  {id:'fin',em:'🏦',name:'Cooperativa "Señor de Mayo"',barrio:'Punata · Valle Alto',stars:1,glow:'#FFC23D',
   desc:'Institución financiera cooperativa con créditos, ahorros y seguros para el Valle Alto.',
   lesson:'La confianza institucional como activo financiero.',
   tags:[{l:'Regulada y estable',c:'g'},{l:'Confianza social',c:'g'},{l:'Burocracia',c:'r'}],
   base:{rent:40,eq:38,cli:32,cre:26,sos:42},mods:{mkt:0.8,ops:1.2,rrhh:1.5,inf:1.0,res:1.1}},
  {id:'may',em:'🏪',name:'Distribuidora "El Mayorista"',barrio:'Mercado Mayorista · Av. Oquendo',stars:2,glow:'#FF3D7F',
   desc:'Distribución de consumo masivo a tiendas, mercados y restaurantes de toda la región.',
   lesson:'La red comercial como palanca de crecimiento.',
   tags:[{l:'Volumen garantizado',c:'g'},{l:'Márgenes ajustados',c:'r'},{l:'Red amplia',c:'g'}],
   base:{rent:34,eq:28,cli:36,cre:26,sos:32},mods:{mkt:0.9,ops:1.6,rrhh:1.0,inf:1.3,res:1.1}},
  {id:'hot',em:'🏨',name:'Hostal "Cordillera"',barrio:'Centro Histórico · Plazuela Sucre',stars:3,glow:'#4CC9FF',
   desc:'Hostal boutique en el centro orientado al turismo nacional e internacional.',
   lesson:'Estacionalidad y gestión de activos físicos.',
   tags:[{l:'Turismo en auge',c:'g'},{l:'Alta estacionalidad',c:'r'},{l:'Experiencia única',c:'g'}],
   base:{rent:28,eq:32,cli:38,cre:28,sos:30},mods:{mkt:1.5,ops:1.1,rrhh:1.4,inf:1.3,res:1.0}}
];

const AREAS=[
  {id:'mkt',name:'Marketing y Ventas',icon:'📣',col:'#FF3D7F',hint:'↑ Clientes · ↑ Crecimiento',
   tip:'<strong>Marketing</strong>: en Cochabamba el boca a boca y las redes sociales son clave. Sin visibilidad, el mejor producto no se vende.',
   fx:p=>({rent:0,eq:0,cli:p*.19,cre:p*.14,sos:0})},
  {id:'ops',name:'Operaciones y Logística',icon:'⚙️',col:'#FFC23D',hint:'↑ Rentabilidad · ↑ Clientes',
   tip:'<strong>Operaciones</strong>: procesos eficientes = menos desperdicio. Cada boliviano ahorrado es rentabilidad pura.',
   fx:p=>({rent:p*.20,eq:0,cli:p*.09,cre:0,sos:p*.06})},
  {id:'rrhh',name:'Talento y RR. HH.',icon:'👥',col:'#22E1C3',hint:'↑ Equipo · ↑ Sostenibilidad',
   tip:'<strong>Talento</strong>: capacitar y retener al equipo es inversión, no gasto. Una persona comprometida vale por tres.',
   fx:p=>({rent:0,eq:p*.22,cli:p*.04,cre:0,sos:p*.10})},
  {id:'inf',name:'Infraestructura y Equipos',icon:'🏗️',col:'#9D7BFF',hint:'↑ Rentabilidad · ↑ Equipo',
   tip:'<strong>Infraestructura</strong>: maquinaria y herramientas correctas reducen costos a largo plazo.',
   fx:p=>({rent:p*.14,eq:p*.14,cli:0,cre:p*.06,sos:0})},
  {id:'res',name:'Fondo de Emergencia',icon:'🛡️',col:'#B8F34A',hint:'↑ Protección ante crisis',
   tip:'<strong>Reserva</strong>: sin fondo de emergencia la primera crisis puede cerrarte. En Cochabamba los imprevistos son frecuentes.',
   fx:p=>({rent:p*.04,eq:0,cli:0,cre:0,sos:p*.14})}
];

const DEPTOS=[
  {id:'prod',ic:'🏭',name:'Producción / Servicio',desc:'Genera el producto o entrega el servicio',ef:'↑ Rentabilidad',eff:{rent:4,eq:0,cli:1,cre:0,sos:1},bonus:{rent:3}},
  {id:'ven',ic:'💼',name:'Ventas',desc:'Consigue nuevos clientes y cierra tratos',ef:'↑ Clientes · ↑ Crecimiento',eff:{rent:0,eq:0,cli:5,cre:3,sos:0},bonus:{cli:3}},
  {id:'aten',ic:'🎧',name:'Atención al Cliente',desc:'Fideliza y cuida la experiencia',ef:'↑ Clientes · ↑ Sostenibilidad',eff:{rent:0,eq:2,cli:4,cre:1,sos:2},bonus:{cli:2,sos:1}},
  {id:'inn',ic:'🔬',name:'Innovación',desc:'Mejora productos y explora ideas',ef:'↑ Crecimiento · ↑ Sostenibilidad',eff:{rent:0,eq:2,cli:0,cre:5,sos:3},bonus:{cre:3}},
  {id:'adm',ic:'📊',name:'Administración',desc:'Contabilidad, legal y control',ef:'↑ Rentabilidad · ↑ Equipo',eff:{rent:3,eq:3,cli:0,cre:0,sos:2},bonus:{rent:2,eq:1}}
];

const PEOPLE=[
  {id:'p1',av:'👩‍💼',name:'Vale',talent:'Vendedora nata, convence a cualquiera',ideal:'ven'},
  {id:'p2',av:'👨‍🔧',name:'Don Rodo',talent:'Maestro del oficio, 20 años de experiencia',ideal:'prod'},
  {id:'p3',av:'👩‍💻',name:'Sofi',talent:'Mente creativa, siempre con ideas nuevas',ideal:'inn'},
  {id:'p4',av:'🙋‍♂️',name:'Marce',talent:'Paciencia infinita con los clientes',ideal:'aten'},
  {id:'p5',av:'🧑‍💼',name:'Javi',talent:'Rey del Excel y de los números',ideal:'adm'}
];

const METS=[
  {id:'rent',lbl:'Rentabilidad',ic:'💰',col:'#FFC23D'},
  {id:'eq',lbl:'Equipo',ic:'🤝',col:'#22E1C3'},
  {id:'cli',lbl:'Clientes',ic:'⭐',col:'#FF3D7F'},
  {id:'cre',lbl:'Crecimiento',ic:'📈',col:'#9D7BFF'},
  {id:'sos',lbl:'Sostenibilidad',ic:'🌱',col:'#B8F34A'}
];



/* Negociación: 3 rondas por rubro. Cada ronda pesa la mitad que un evento completo. */
const NEG_WEIGHT=.5;




const TIERS=[
  [78,'🏆 Visionario Empresarial','Gestión estratégica ejemplar. Pocas personas llegan a este nivel sin formación formal.'],
  [63,'⭐ Estratega Competente','Decisiones sólidas y bien fundamentadas. Su empresa tiene futuro real.'],
  [47,'📈 Gestor en Formación','Rendimiento aceptable, pero con desequilibrios que a largo plazo se pagan caro.'],
  [31,'🌱 Emprendedor Aprendiz','La empresa sobrevive con dificultades. Los errores de hoy son la formación de mañana.'],
  [0,'📚 Futuro Estudiante de Negocios','Resultado crítico… y es exactamente por qué existe la carrera de Negocios.']
];


const YEARS=[
  {n:'1',t:'Fundamentos',l:['Fundamentos de Gestión Empresarial','Gestión Contable Financiera','Marketing Digital','Liderazgo Organizacional']},
  {n:'2',t:'Estrategia y datos',l:['Lean Startup y Modelos de Negocio','Inteligencia Artificial Aplicada','Planificación Estratégica','Análisis Financiero']},
  {n:'3',t:'Tu mención',l:['Análisis predictivo con Machine Learning','Gestión de Calidad y Mejora Continua','Finanzas para Emprendedores','Business Intelligence']},
  {n:'4',t:'Impacto real',l:['Dirección y Ejecución de Inversiones','IA aplicada a la Gestión Estratégica','Prácticas Profesionales','Proyecto Integrador Final']}
];
const JOBS=['Gerente de operaciones','Analista financiero y de inversiones','Fundador de startups','Analista de negocios y datos','Jefe de proyectos de innovación','Coordinador de transformación digital','Consultor en sostenibilidad y ESG'];

const AVATARS=['🦊','🐯','🦅','🦙','🐆','🐺','🦉','🐲','🦁','🐼'];
const TEAM_NAMES=['Los Tigres del Valle','Llajta Capital','Cóndores S.R.L.','Tunari Ventures','Chicharrón Holdings','Los Lobos del Mercado','Valle Alto Inc.','Cocha Unicornios','Los Estrategas','Pumas Financieros','Quillacollo Power','Llama Corp'];

const STARTERS={
  cap:['Priorizamos … porque …','Guardamos Bs … en reserva para …','Invertimos poco en … porque …'],
  team:['Pusimos a … en … porque …','Dejamos … con más personas porque …','Nuestro departamento clave es … porque …'],
  crisis:['Elegimos esta opción porque …','Preferimos sacrificar … para proteger …','Nos preocupa más …'],
  neg:['Nuestra estrategia fue …','En las 3 rondas buscamos …','Cedimos en … pero ganamos …'],
  opp:['Tomamos la oportunidad porque …','Preferimos no arriesgar porque …','A largo plazo esto nos da …']
};

/* Configuración de las pizarras */
const AREA_BG={mkt:'#FFD6E8',ops:'#FFF0C2',rrhh:'#CFF5EE',inf:'#E4DCFF',res:'#E2F7C2'};
const BOARDS={
  d1:{title:'Boceto: ¿cómo repartirían el dinero?',prompt:'Fichas de áreas, billetes y prioridades',
    stamps:[
      {grp:'Áreas del negocio',items:AREAS.map(a=>({ic:a.icon,txt:a.name,bg:AREA_BG[a.id]}))},
      {grp:'Dinero',items:[{ic:'💵',txt:'Bs 5.000',bg:'#E2F7C2'},{ic:'💵',txt:'Bs 10.000',bg:'#E2F7C2'},{ic:'💰',txt:'Bs 25.000',bg:'#FFF0C2'},{ic:'🏦',txt:'Bs 50.000',bg:'#FFF0C2'}]},
      {grp:'Prioridades',items:[{ic:'🥇',txt:'Prioridad 1',bg:'#FFF0C2'},{ic:'🥈',txt:'Prioridad 2',bg:'#EEE'},{ic:'🥉',txt:'Prioridad 3',bg:'#FFE2C4'},{ic:'⚠️',txt:'Riesgo',bg:'#FFD6D6'},{ic:'✅',txt:'Meta',bg:'#CFF5D8'}]}
    ],
    template:nid=>{
      const c={id:nid(),t:'stamp',ic:'🏢',txt:'Nuestro negocio',bg:'#FFE2C4',cx:460,y:250};
      const pos=[[150,70],[460,40],[770,70],[230,450],[690,450]];
      const ar=AREAS.map((a,i)=>({id:nid(),t:'stamp',ic:a.icon,txt:a.name,bg:AREA_BG[a.id],cx:pos[i][0],y:pos[i][1]}));
      const conns=ar.map(a=>({id:nid(),t:'conn',a:c.id,b:a.id,c:'#B08A5A',sz:3}));
      return[...conns,c,...ar];
    }},
  d2:{title:'Organigrama de su empresa',prompt:'¿Quién lidera? ¿Quién reporta a quién?',
    stamps:[
      {grp:'Cargos',items:[{ic:'👑',txt:'Gerente General',bg:'#FFF0C2'},...DEPTOS.map(d=>({ic:d.ic,txt:d.name,bg:'#E9E4F7'}))]},
      {grp:'Personas',items:[...PEOPLE.map(p=>({ic:p.av,txt:p.name,bg:'#CFF5EE'})),{ic:'🧑',txt:'Nueva persona',bg:'#EEE'}]}
    ],
    template:nid=>{
      const g={id:nid(),t:'stamp',ic:'👑',txt:'Gerente General',bg:'#FFF0C2',cx:500,y:40};
      const xs=[90,300,500,700,910];
      const ds=DEPTOS.map((d,i)=>({id:nid(),t:'stamp',ic:d.ic,txt:d.name,bg:'#E9E4F7',cx:xs[i],y:i%2?300:220}));
      const conns=ds.map(d=>({id:nid(),t:'conn',a:g.id,b:d.id,c:'#7B61C9',sz:3}));
      return[...conns,g,...ds];
    }}
};
