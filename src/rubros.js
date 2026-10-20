/* ═══════════════════════════════════════
   RUBROS (v3.1)
   · 6 negocios nuevos de 4 estrellas
   · Partidas de capital propias de cada rubro (siempre con planilla y fondo de emergencia)
   · Perfiles para contratar según rubro y funciones críticas
═══════════════════════════════════════ */
BIZS.push(
  {id:'lac',em:'🥛',name:'Lácteos "Valle Lechero"',barrio:'Punata · Valle Alto',stars:4,glow:'#4CC9FF',
   desc:'Planta de yogurt y quesos que compra la leche de 300 familias productoras del Valle Alto.',
   lesson:'Cadena de frío, capital de trabajo y pago puntual a productores pequeños.',
   tags:[{l:'Consumo diario',c:'g'},{l:'Cadena de frío',c:'r'},{l:'Margen ajustado',c:'r'}],
   base:{rent:28,eq:30,cli:32,cre:30,sos:28},mods:{mkt:1.1,ops:1.6,rrhh:1.1,inf:1.5,res:1.1}},
  {id:'agr',em:'🍌',name:'Agroexportadora "Trópico Fresh"',barrio:'Shinahota · Trópico de Cochabamba',stars:4,glow:'#B8F34A',
   desc:'Exporta banano y piña a Argentina y Chile. Cobra en dólares, paga en bolivianos y depende del clima y las carreteras.',
   lesson:'Tipo de cambio, logística de exportación y riesgo climático.',
   tags:[{l:'Mercado externo',c:'g'},{l:'Clima y plagas',c:'r'},{l:'Fronteras',c:'r'}],
   base:{rent:30,eq:28,cli:28,cre:34,sos:24},mods:{mkt:0.9,ops:1.6,rrhh:1.0,inf:1.4,res:1.4}},
  {id:'cli',em:'🏥',name:'Clínica "Salud Cala Cala"',barrio:'Cala Cala · Zona Norte',stars:4,glow:'#22E1C3',
   desc:'Clínica ambulatoria con consultorios, laboratorio y ecografía. Los equipos cuestan como una casa.',
   lesson:'Inversión alta en equipos, regulación estricta y confianza del paciente.',
   tags:[{l:'Demanda estable',c:'g'},{l:'Equipos muy caros',c:'r'},{l:'Regulación',c:'r'}],
   base:{rent:26,eq:34,cli:30,cre:28,sos:30},mods:{mkt:0.9,ops:1.2,rrhh:1.5,inf:1.6,res:1.1}},
  {id:'con',em:'🏗️',name:'Constructora "Tunari Obras"',barrio:'Zona Sur · Av. Petrolera',stars:4,glow:'#FFC23D',
   desc:'Construye viviendas y obras municipales. Cobra por avance de obra y el precio del cemento cambia cada mes.',
   lesson:'Flujo de caja por avance, licitaciones y costos de materiales.',
   tags:[{l:'Proyectos grandes',c:'g'},{l:'Pagos lentos',c:'r'},{l:'Precio de materiales',c:'r'}],
   base:{rent:30,eq:28,cli:26,cre:32,sos:24},mods:{mkt:0.8,ops:1.5,rrhh:1.3,inf:1.4,res:1.4}},
  {id:'sol',em:'☀️',name:'Energía solar "Sol del Valle"',barrio:'Av. Blanco Galindo · Km 4',stars:4,glow:'#FF8A00',
   desc:'Instala paneles solares en casas, colegios y fábricas. Compra en dólares y el cliente quiere pagar en cuotas.',
   lesson:'Importación en dólares, financiamiento al cliente y normativa técnica.',
   tags:[{l:'Energía limpia',c:'g'},{l:'Mercado nuevo',c:'g'},{l:'Equipos importados',c:'r'}],
   base:{rent:24,eq:30,cli:24,cre:42,sos:30},mods:{mkt:1.4,ops:1.1,rrhh:1.3,inf:1.3,res:1.2}},
  {id:'cer',em:'🍺',name:'Cervecería "Llajta Brew"',barrio:'Tiquipaya',stars:4,glow:'#FF5E3A',
   desc:'Cerveza artesanal con maíz y frutas del valle. Compite con una industria gigante que controla bares y distribuidores.',
   lesson:'Diferenciarse frente a un competidor dominante, permisos y distribución.',
   tags:[{l:'Marca local',c:'g'},{l:'Competencia gigante',c:'r'},{l:'Permisos',c:'r'}],
   base:{rent:26,eq:32,cli:28,cre:36,sos:26},mods:{mkt:1.5,ops:1.3,rrhh:1.1,inf:1.3,res:1.0}}
);
Object.assign(BENCH,{
  lac:{mkt:12,ops:33,rrhh:20,inf:20,res:15}, agr:{mkt:8,ops:35,rrhh:15,inf:20,res:22},
  cli:{mkt:8,ops:15,rrhh:30,inf:32,res:15}, con:{mkt:5,ops:35,rrhh:20,inf:18,res:22},
  sol:{mkt:20,ops:30,rrhh:20,inf:12,res:18}, cer:{mkt:25,ops:25,rrhh:15,inf:20,res:15}
});

/* ───────── Partidas de capital por rubro (area = indicador que mueve) ───────── */
const PLA={id:'pla',icon:'👥',name:'Sueldos del equipo (planilla)',area:'rrhh',hint:'Paga el 1.er mes de sueldos: Bs 3.000–9.000 por persona'};
const RES={id:'res',icon:'🛡️',name:'Fondo de emergencia',area:'res',hint:'Protege ante crisis (los golpes sin reserva valen ×1,8)'};
const L=(id,icon,name,area,hint)=>({id,icon,name,area,hint});
const CAPLINES={
  chi:[L('ins','🥩','Carne e insumos','ops','Costo de cada plato'),L('coc','🔥','Cocina y equipos','inf','Freidoras, gas, campana'),L('mkt','📣','Redes y promociones','mkt','Atraer clientes nuevos'),L('del','🛵','Delivery y empaques','ops','Vender fuera del local'),L('cap','🎓','Capacitación en atención','rrhh','Servicio y fidelización'),PLA,RES],
  tra:[L('com','⛽','Combustible y llantas','ops','El costo de cada viaje'),L('man','🔧','Mantenimiento de buses','inf','Que no se queden en ruta'),L('flo','🚌','Renovación de flota','inf','Buses más nuevos y seguros'),L('mkt','📲','Venta de pasajes y marca','mkt','Boletería, app y publicidad'),L('cap','🎓','Capacitación de choferes','rrhh','Seguridad vial'),PLA,RES],
  can:[L('mer','📦','Mercadería','ops','Lo que vendes cada día'),L('ref','❄️','Refrigeración y estantes','inf','Lácteos, embutidos, orden'),L('mkt','💬','Promociones y QR','mkt','Atraer y cobrar fácil'),L('rep','🛵','Reparto a domicilio','ops','Pedidos por WhatsApp'),L('inv','🧾','Control de inventario','inf','Saber qué falta y qué sobra'),PLA,RES],
  art:[L('mat','🏺','Arcilla, lana y tintes','ops','Materia prima'),L('hor','🔥','Hornos y telares','inf','Capacidad de producción'),L('web','🌐','Tienda en línea y fotos','mkt','Vender al mundo'),L('env','📦','Envíos y aduana','ops','Exportar sin trabas'),L('dis','🎨','Diseño y capacitación','rrhh','Nuevas colecciones'),PLA,RES],
  tec:[L('nub','☁️','Servidores y nube','inf','Que el sistema nunca caiga'),L('eqp','💻','Equipos y software','inf','Laptops y licencias'),L('mkt','🚀','Marketing digital','mkt','Clientes que llegan solos'),L('b2b','🤝','Ventas B2B y eventos','mkt','Visitar empresas'),L('cap','🎓','Cursos y certificaciones','rrhh','Talento actualizado'),PLA,RES],
  imp:[L('fle','🚢','Fletes y aduana','ops','Traer la mercadería'),L('alm','🏬','Almacén y montacargas','inf','Guardar y mover equipos'),L('sto','📦','Stock de repuestos','ops','Vender rápido'),L('mkt','📣','Ferias y catálogo','mkt','Llegar a constructoras'),L('cap','🎓','Capacitación técnica','rrhh','Servicio postventa'),PLA,RES],
  fin:[L('sis','💻','Sistema y ciberseguridad','inf','Proteger el dinero de los socios'),L('age','🏢','Agencias y cajeros','inf','Estar cerca del socio'),L('mkt','📣','Campañas de ahorro','mkt','Nuevos socios'),L('cob','📑','Gestión de cobranza','ops','Que la mora no crezca'),L('cap','🎓','Capacitación de asesores','rrhh','Créditos bien evaluados'),PLA,RES],
  may:[L('flo','🚚','Flota y combustible','ops','Llegar a cada tienda'),L('alm','🏬','Almacén','inf','Espacio y orden'),L('sto','📦','Stock de productos','ops','Nunca quedarse sin'),L('mkt','📲','Preventa y app de pedidos','mkt','Pedidos más rápidos'),L('cap','🎓','Capacitación de preventistas','rrhh','Vender mejor'),PLA,RES],
  hot:[L('hab','🛏️','Habitaciones y mantenimiento','inf','Confort y reseñas'),L('lav','🧺','Lavandería y amenities','ops','Cada huésped, todo limpio'),L('web','🌐','Plataformas y redes','mkt','Reservas en línea'),L('tou','🗺️','Experiencias y tours','mkt','Ingreso extra por huésped'),L('cap','🎓','Capacitación en servicio','rrhh','Huéspedes que vuelven'),PLA,RES],
  lac:[L('lec','🥛','Compra de leche','ops','Pago a 300 productores'),L('fri','❄️','Cámaras de frío y planta','inf','Sin frío, no hay producto'),L('env','🧴','Envases y etiquetas','ops','Presentación y vida útil'),L('mkt','📣','Marca y degustaciones','mkt','Ganar góndola'),L('cal','🧪','Laboratorio y registros','inf','Calidad y registro sanitario'),PLA,RES],
  agr:[L('fru','🍌','Compra de fruta','ops','Pago a productores'),L('emp','📦','Empacadora y cámaras','inf','Fruta fresca más tiempo'),L('fle','🚛','Fletes y exportación','ops','Llegar a la frontera'),L('fer','🌐','Ferias internacionales','mkt','Nuevos compradores'),L('cer','🌱','Certificaciones','rrhh','Orgánico y buenas prácticas'),PLA,RES],
  cli:[L('eqm','🩻','Equipos médicos','inf','Ecógrafo, laboratorio'),L('rea','🧪','Reactivos e insumos','ops','Cada análisis cuesta'),L('bio','🏥','Infraestructura y bioseguridad','inf','Cumplir la norma'),L('mkt','📣','Convenios y marketing','mkt','Pacientes y aseguradoras'),L('esp','🎓','Especialización médica','rrhh','Mejor diagnóstico'),PLA,RES],
  con:[L('mat','🧱','Cemento, fierro y materiales','ops','El costo de cada obra'),L('maq','🚜','Maquinaria y andamios','inf','Avanzar rápido y seguro'),L('gar','📑','Garantías y licitaciones','ops','Poder postular'),L('mkt','📣','Marketing inmobiliario','mkt','Vender departamentos'),L('seg','🦺','Seguridad industrial','rrhh','Cero accidentes'),PLA,RES],
  sol:[L('pan','🔆','Paneles e inversores','ops','Equipos importados'),L('her','🧰','Herramientas y vehículo','inf','Instalar en cualquier techo'),L('mkt','📣','Marketing y demostraciones','mkt','Convencer del ahorro'),L('fin','💳','Financiamiento a clientes','ops','Vender en cuotas'),L('cer','🎓','Certificaciones técnicas','rrhh','Cumplir la norma eléctrica'),PLA,RES],
  cer:[L('ins','🌾','Malta, lúpulo e insumos','ops','Ingredientes de cada lote'),L('tan','🍺','Tanques y embotelladora','inf','Capacidad y calidad'),L('mar','🎨','Marca y redes','mkt','Que te reconozcan'),L('tap','🍻','Taproom y eventos','mkt','Venta directa'),L('reg','📋','Registros y permisos','ops','Vender sin problemas'),PLA,RES]
};

/* ───────── Perfiles para contratar (fit: 2 clave · 1 útil · 0 no aporta) ───────── */
const CANDS=[
  {id:'p_ven',av:'👩‍💼',name:'Vale',role:'Vendedora nata',dept:'ven',sal:3800,fit:{chi:1,tra:1,can:2,art:1,tec:1,imp:2,fin:1,may:2,hot:1,lac:1,agr:1,sol:1,cer:1}},
  {id:'v_b2b',av:'🤝',name:'Andrea',role:'Ejecutiva de ventas a empresas',dept:'ven',sal:5000,fit:{tec:2,sol:2,imp:1,con:1,may:1,lac:1,cer:1,agr:1,fin:1}},
  {id:'k_mkt',av:'📱',name:'Cami',role:'Especialista en marketing digital',dept:'ven',sal:4200,fit:{cer:2,hot:1,tec:1,chi:1,art:1,sol:1,can:1,cli:1,lac:1}},
  {id:'p_dis',av:'🎨',name:'Majo',role:'Diseñadora gráfica y de producto',dept:'ven',sal:4000,fit:{art:2,hot:1,tec:1,chi:1,cer:1,sol:1,lac:1}},
  {id:'p_coc',av:'👨‍🍳',name:'Don Rodo',role:'Cocinero con 20 años de oficio',dept:'prod',sal:3200,fit:{chi:2,hot:1,cer:1}},
  {id:'mes',av:'🍽️',name:'Lucía',role:'Mesera y cajera',dept:'aten',sal:2900,fit:{chi:2,cer:1,hot:1}},
  {id:'p_cho',av:'🚌',name:'Wilo',role:'Chofer profesional (licencia C)',dept:'prod',sal:3500,fit:{tra:2,may:2,imp:1,lac:2,agr:2,con:1,cer:1}},
  {id:'p_mec',av:'🔧',name:'Freddy',role:'Mecánico automotriz',dept:'prod',sal:3800,fit:{tra:2,may:1,imp:2,agr:1,con:1}},
  {id:'d_rep',av:'🛵',name:'Toño',role:'Repartidor con moto propia',dept:'prod',sal:2800,fit:{chi:1,can:2,cer:1,may:1,lac:1}},
  {id:'p_alm',av:'📦',name:'Ronald',role:'Encargado de almacén y logística',dept:'prod',sal:3200,fit:{may:2,imp:2,can:1,art:1,tra:1,lac:1,agr:2,cer:1,sol:1,con:1}},
  {id:'p_dev',av:'👩‍💻',name:'Sofi',role:'Programadora full-stack',dept:'inn',sal:7500,fit:{tec:2,fin:1}},
  {id:'p_ti',av:'🧑‍🔧',name:'Tito',role:'Técnico de soporte y redes',dept:'inn',sal:4200,fit:{tec:2,fin:2,imp:1,may:1,cli:1,sol:1}},
  {id:'p_dat',av:'📊',name:'Nico',role:'Analista de datos',dept:'inn',sal:6000,fit:{tec:2,fin:2,may:2,imp:1,can:1,sol:1,cli:1}},
  {id:'p_cont',av:'🧮',name:'Javi',role:'Contador público',dept:'adm',sal:5000,fit:{chi:1,tra:1,can:1,art:1,tec:1,imp:2,fin:2,may:2,hot:1,lac:1,agr:1,cli:1,con:1,sol:1,cer:1}},
  {id:'f_fin',av:'💹',name:'Rodrigo',role:'Analista financiero',dept:'adm',sal:6500,fit:{con:2,fin:1,imp:1,agr:1,sol:1,tec:1}},
  {id:'p_abo',av:'⚖️',name:'Dra. Ruiz',role:'Abogada corporativa',dept:'adm',sal:6500,fit:{fin:2,imp:1,cli:1,con:1}},
  {id:'p_com',av:'🌎',name:'Kevin',role:'Comercio exterior y aduanas',dept:'adm',sal:6000,fit:{imp:2,art:1,agr:2,sol:1,lac:1}},
  {id:'c_seg',av:'🦺',name:'Karen',role:'Técnica en seguridad industrial',dept:'adm',sal:4500,fit:{con:2,agr:1,lac:1,sol:1,cer:1,imp:1}},
  {id:'p_ate',av:'🙋‍♀️',name:'Marce',role:'Atención al cliente',dept:'aten',sal:3200,fit:{hot:2,fin:2,tra:1,can:1,tec:1,chi:1,art:1,cli:1,sol:1,cer:1}},
  {id:'r_rec',av:'🛎️',name:'Diego',role:'Recepcionista bilingüe',dept:'aten',sal:3300,fit:{hot:2,cli:2,fin:1}},
  {id:'p_guia',av:'🗺️',name:'Luz',role:'Guía turística bilingüe',dept:'aten',sal:3500,fit:{hot:2,art:1}},
  {id:'p_lim',av:'🧹',name:'Rosa',role:'Limpieza y mantenimiento',dept:'prod',sal:2700,fit:{hot:2,chi:1,can:1,cli:2,cer:1,lac:1}},
  {id:'p_art',av:'🏺',name:'Doña Juana',role:'Artesana ceramista',dept:'prod',sal:3000,fit:{art:2}},
  {id:'p_cred',av:'🏦',name:'Paola',role:'Asesora de créditos',dept:'ven',sal:4500,fit:{fin:2,sol:1}},
  {id:'l_tec',av:'🧪',name:'Wendy',role:'Técnica en alimentos y calidad',dept:'prod',sal:4500,fit:{lac:2,cer:2,chi:1,agr:1,can:0}},
  {id:'l_ord',av:'🐄',name:'Fausto',role:'Acopiador de leche',dept:'prod',sal:3000,fit:{lac:2}},
  {id:'a_agro',av:'🌱',name:'Ing. Quispe',role:'Ingeniero agrónomo',dept:'prod',sal:6000,fit:{agr:2,lac:1,cer:1}},
  {id:'a_emp',av:'🍍',name:'Liz',role:'Supervisora de empaque',dept:'prod',sal:3000,fit:{agr:2,lac:1,cer:1,may:1}},
  {id:'m_med',av:'🩺',name:'Dra. Vargas',role:'Médica general',dept:'prod',sal:9000,fit:{cli:2}},
  {id:'m_enf',av:'💉',name:'Lic. Rocío',role:'Enfermera',dept:'aten',sal:4500,fit:{cli:2}},
  {id:'m_lab',av:'🔬',name:'Andrés',role:'Bioquímico de laboratorio',dept:'prod',sal:6500,fit:{cli:2,lac:1}},
  {id:'c_res',av:'👷',name:'Ing. Torrico',role:'Ingeniero civil · residente de obra',dept:'prod',sal:8000,fit:{con:2,sol:1}},
  {id:'c_mae',av:'🧱',name:'Don Simón',role:'Maestro albañil',dept:'prod',sal:3500,fit:{con:2}},
  {id:'s_ele',av:'⚡',name:'Ing. Bruno',role:'Ingeniero electricista',dept:'prod',sal:7000,fit:{sol:2,con:1,cli:1}},
  {id:'s_ins',av:'🔆',name:'Pablo',role:'Instalador técnico solar',dept:'prod',sal:3500,fit:{sol:2,con:1}},
  {id:'b_mae',av:'🍺',name:'Gaby',role:'Maestra cervecera',dept:'prod',sal:5500,fit:{cer:2}}
];
/* Funciones críticas de cada rubro: si no contratan a nadie de un grupo, la empresa lo sufre */
const CRIT={
  chi:[{l:'cocina',ids:['p_coc']},{l:'atención en el local',ids:['mes','p_ate']}],
  tra:[{l:'choferes',ids:['p_cho']},{l:'mantenimiento de buses',ids:['p_mec']}],
  can:[{l:'ventas o reparto',ids:['p_ven','d_rep']},{l:'control de caja e inventario',ids:['p_cont','p_dat','p_alm']}],
  art:[{l:'producción artesanal',ids:['p_art']},{l:'diseño, marketing o ventas',ids:['p_dis','k_mkt','p_ven']}],
  tec:[{l:'desarrollo técnico',ids:['p_dev','p_ti','p_dat']},{l:'ventas a empresas',ids:['v_b2b','p_ven']}],
  imp:[{l:'comercio exterior',ids:['p_com']},{l:'logística y almacén',ids:['p_alm','p_cho']}],
  fin:[{l:'asesoría de créditos',ids:['p_cred']},{l:'contabilidad y cumplimiento',ids:['p_cont','p_abo']}],
  may:[{l:'logística y reparto',ids:['p_alm','p_cho']},{l:'ventas',ids:['p_ven','v_b2b']}],
  hot:[{l:'recepción y atención',ids:['r_rec','p_ate']},{l:'limpieza',ids:['p_lim']}],
  lac:[{l:'producción y calidad',ids:['l_tec','l_ord']},{l:'reparto refrigerado',ids:['p_cho','d_rep']}],
  agr:[{l:'campo y calidad de fruta',ids:['a_agro']},{l:'empaque y exportación',ids:['a_emp','p_alm','p_com']}],
  cli:[{l:'personal médico',ids:['m_med','m_enf','m_lab']},{l:'recepción de pacientes',ids:['r_rec','p_ate']}],
  con:[{l:'dirección de obra',ids:['c_res']},{l:'obreros calificados',ids:['c_mae']}],
  sol:[{l:'instalación técnica',ids:['s_ele','s_ins']},{l:'ventas',ids:['v_b2b','p_ven']}],
  cer:[{l:'producción cervecera',ids:['b_mae']},{l:'marca y ventas',ids:['k_mkt','p_ven','v_b2b']}]
};

/* ───────── Eventos de los 6 negocios nuevos ───────── */
Object.assign(EV,{
lac:{
 intro:'Ustedes dirigen Lácteos Valle Lechero, una planta en Punata que transforma la leche de trescientas familias productoras en yogurt y quesos. Todo depende de la cadena de frío y de pagar puntual a los productores. Su reto: crecer sin cortar la leche, ni la confianza.',
 crises:[
  {ic:'⚡',title:'Corte de luz de 12 horas en la planta',news:'Último momento: un corte eléctrico de doce horas afecta al Valle Alto. Las plantas lecheras temen perder su producción.',
   desc:'Se cortó la luz en Punata. Tienes 8.000 litros de leche y yogurt en cámaras de frío que empiezan a calentarse.',loc:'📍 Punata · Valle Alto',opts:[
   {lbl:'Alquilar un generador de emergencia',sub:'Caro, pero salvas toda la producción.',fx:{rent:-8,eq:2,cli:6,cre:0,sos:8},q:2,
    cond:{need:{cap:'res',min:10000},ok:{rent:4},ko:{rent:-6,sos:-4},okMsg:'El fondo de emergencia pagó el generador al instante.',koMsg:'Sin reserva, el generador se pagó con deuda cara.'}},
   {lbl:'Vender todo hoy con descuento a tiendas',sub:'Recuperas algo antes de que se eche a perder.',fx:{rent:-4,eq:0,cli:2,cre:0,sos:2},q:1},
   {lbl:'Esperar a que vuelva la luz',sub:'Ojalá no se dañe…',fx:{rent:-12,eq:-2,cli:-8,cre:-2,sos:-6},q:0}]},
  {ic:'🐄',title:'Productores amenazan con no entregar leche',news:'Último momento: productores lecheros del Valle Alto exigen mejor precio y anuncian suspensión de entregas.',
   desc:'Los productores piden 15 % más por litro o dejan de entregar mañana. Una industria grande les ofrece pagar más.',loc:'📍 Centro de acopio',opts:[
   {lbl:'Subir 8 % y pagar semanal en lugar de mensual',sub:'Les das liquidez, no solo precio.',fx:{rent:-4,eq:4,cli:2,cre:2,sos:8},q:2,
    cond:{need:{cap:'res',min:8000},ok:{sos:4},ko:{sos:-6,rent:-2},okMsg:'La reserva permitió pagar cada semana sin ahogar la caja.',koMsg:'Pagar semanal sin reserva dejó la caja en rojo.'}},
   {lbl:'Aceptar el 15 % completo',sub:'Paz inmediata, margen apretado.',fx:{rent:-10,eq:2,cli:0,cre:0,sos:2},q:1},
   {lbl:'Buscar leche en otra región',sub:'Más lejos, más caro y rompes la relación.',fx:{rent:-6,eq:-4,cli:-4,cre:0,sos:-8},q:0}]}
 ],
 negs:[
  {tipo:'cliente',ic:'🛒',who:'Supermercados del Valle',role:'Gerente de compras · 15 sucursales',badge:'Cliente',title:'60 días de pago y góndola pagada',
   msgs:['Queremos sus yogures en nuestras 15 sucursales 🛒','Condiciones: <b>pago a 60 días</b> y ustedes pagan <b>Bs 1.500 por góndola</b> al mes.','¿Les interesa?'],loc:'Oficina del supermercado',opts:[
   {lbl:'Aceptar todo',sub:'Gran vitrina, caja apretada.',fx:{rent:-6,eq:0,cli:8,cre:6,sos:-6},q:0,r:'¡Excelente! Los esperamos con el primer pedido el lunes.'},
   {lbl:'Pago a 30 días y góndola gratis 3 meses',sub:'Negocias plazo y costo de entrada.',fx:{rent:2,eq:0,cli:8,cre:6,sos:4},q:2,r:'Mmm… por ser productos locales, aceptamos 🤝'},
   {lbl:'Seguir solo con tiendas de barrio',sub:'Sin riesgo, sin crecimiento.',fx:{rent:2,eq:0,cli:-4,cre:-4,sos:2},q:1,r:'Bueno, la puerta queda abierta.'}]},
  {tipo:'proveedor',ic:'🧴',who:'Envases Andinos',role:'Proveedor de envases plásticos',badge:'Proveedor',title:'Los envases suben 20 %',
   msgs:['Hola 👋 Por el precio del plástico importado, los envases suben <b>20 %</b>.','Si compran 6 meses por adelantado, mantenemos el precio.'],loc:'Llamada del proveedor',opts:[
   {lbl:'Comprar 6 meses por adelantado',sub:'Precio fijo, dinero inmovilizado.',fx:{rent:4,eq:0,cli:0,cre:0,sos:2},q:1,
    cond:{need:{cap:'res',min:10000},ok:{sos:4},ko:{sos:-8},okMsg:'Tenían reserva para pagar por adelantado.',koMsg:'El pago adelantado vació la caja.'}},
   {lbl:'Cambiar a envases retornables de vidrio',sub:'Inversión inicial, diferenciación y ahorro.',fx:{rent:2,eq:2,cli:6,cre:4,sos:6},q:2,
    cond:{need:{cap:'inf',min:15000},ok:{rent:2},ko:{rent:-6},okMsg:'Su inversión en planta permitió lavar y reutilizar envases.',koMsg:'Sin inversión en planta, el lavado de envases salió caro.'}},
   {lbl:'Aceptar el alza y subir el precio',sub:'Trasladas todo al cliente.',fx:{rent:2,eq:0,cli:-6,cre:-2,sos:0},q:0}]},
  {tipo:'aliado',ic:'🏫',who:'Gobierno Municipal',role:'Programa de desayuno escolar',badge:'Aliado',title:'Yogurt para 40 colegios',
   msgs:['Saludos 🏫 Buscamos proveedor de <b>yogurt para 40 colegios</b>.','Volumen garantizado todo el año, pero pagamos a <b>90 días</b>.'],loc:'Licitación municipal',opts:[
   {lbl:'Aceptar todo el volumen',sub:'Venta segura, liquidez en riesgo.',fx:{rent:4,eq:-4,cli:6,cre:10,sos:-8},q:1},
   {lbl:'20 colegios y cobrar antes con factoraje',sub:'Vendes tus facturas al banco para cobrar antes.',fx:{rent:4,eq:2,cli:6,cre:8,sos:4},q:2,r:'Perfecto, firmamos el convenio por 20 colegios.'},
   {lbl:'No trabajar con el Estado',sub:'Evitas burocracia.',fx:{rent:0,eq:0,cli:-2,cre:-6,sos:2},q:0}]}
 ],
 opps:[
  {ic:'🧀',title:'Quesos madurados premium',news:'Atención: crece la demanda de quesos madurados gourmet en restaurantes y hoteles de Bolivia.',
   desc:'Restaurantes y hoteles buscan quesos madurados nacionales. Requiere cámara de maduración y 3 meses de espera.',loc:'📍 Mercado gourmet',opts:[
   {lbl:'Invertir en cámara de maduración',sub:'Producto premium con mayor margen.',fx:{rent:-4,eq:2,cli:8,cre:12,sos:2},q:2,
    cond:{need:{hire:'l_tec'},ok:{cre:4},ko:{cli:-4},okMsg:'Su técnica en alimentos aseguró la calidad del queso.',koMsg:'Sin técnico de calidad, varios lotes se perdieron.'}},
   {lbl:'Probar con una línea pequeña',sub:'Aprendes con poco riesgo.',fx:{rent:0,eq:0,cli:4,cre:6,sos:2},q:1},
   {lbl:'Seguir solo con yogurt',sub:'Foco en lo conocido.',fx:{rent:2,eq:0,cli:0,cre:-6,sos:2},q:0}]},
  {ic:'🇵🇪',title:'Exportar quesos a Perú',news:'Atención: Perú abre cupos de importación para lácteos bolivianos.',
   desc:'Un distribuidor peruano quiere tus quesos. Necesitas registro sanitario de exportación.',loc:'📍 Desaguadero · frontera',opts:[
   {lbl:'Tramitar el registro y exportar',sub:'Nuevo mercado en dólares.',fx:{rent:-4,eq:0,cli:6,cre:14,sos:0},q:2,
    cond:{need:{hire:'p_com'},ok:{cre:2,rent:4},ko:{rent:-4},okMsg:'Su especialista en comercio exterior agilizó el registro.',koMsg:'Sin experto en exportación, el trámite tardó meses.'}},
   {lbl:'Venderle en frontera sin exportar directo',sub:'Menos margen, menos trámite.',fx:{rent:2,eq:0,cli:4,cre:6,sos:2},q:1},
   {lbl:'No exportar',sub:'Te quedas en Bolivia.',fx:{rent:0,eq:0,cli:0,cre:-6,sos:2},q:0}]}
 ]},
agr:{
 intro:'Ustedes dirigen Trópico Fresh, una agroexportadora de Shinahota que envía banano y piña a Argentina y Chile. Cobran en dólares, pagan en bolivianos y dependen del clima y de las carreteras. Su reto: que la fruta llegue fresca, y que la plata vuelva.',
 crises:[
  {ic:'🌧️',title:'Inundaciones en el Trópico',news:'Último momento: lluvias torrenciales inundan cultivos en el Trópico de Cochabamba. Productores reportan grandes pérdidas.',
   desc:'Las lluvias inundaron el 30 % de las plantaciones de tus proveedores. El contrato con Argentina exige 4 contenedores este mes.',loc:'📍 Trópico de Cochabamba',opts:[
   {lbl:'Avisar al cliente y renegociar el volumen',sub:'Transparencia antes que incumplir.',fx:{rent:-4,eq:2,cli:4,cre:0,sos:6},q:2},
   {lbl:'Comprar fruta a otros productores más caro',sub:'Cumples, pero ganas menos.',fx:{rent:-8,eq:0,cli:6,cre:2,sos:2},q:1,
    cond:{need:{cap:'res',min:12000},ok:{rent:4},ko:{sos:-6},okMsg:'La reserva cubrió la compra de emergencia.',koMsg:'Sin reserva, se endeudaron para comprar fruta.'}},
   {lbl:'Enviar fruta de menor calidad para cumplir',sub:'Cumples el volumen… ¿y la calidad?',fx:{rent:4,eq:-2,cli:-12,cre:-4,sos:-6},q:0}]},
  {ic:'🚛',title:'Frontera cerrada por paro de transporte',news:'Último momento: un paro de transportistas cierra el paso fronterizo hacia Argentina. Camiones con fruta quedan varados.',
   desc:'Tus camiones con banano están parados en la frontera. La fruta madura en 5 días.',loc:'📍 Frontera Yacuiba · Pocitos',opts:[
   {lbl:'Desviar la carga al mercado nacional',sub:'Vendes más barato, pero vendes.',fx:{rent:-6,eq:0,cli:2,cre:0,sos:4},q:2},
   {lbl:'Esperar en la frontera',sub:'Si abre pronto, ganas todo.',fx:{rent:-10,eq:-2,cli:-4,cre:0,sos:-6},q:0},
   {lbl:'Pagar una ruta alterna por Chile',sub:'Más caro y más trámites.',fx:{rent:-6,eq:0,cli:6,cre:2,sos:0},q:1,
    cond:{need:{hire:'p_com'},ok:{rent:4},ko:{rent:-4},okMsg:'Su especialista en aduanas armó la ruta en un día.',koMsg:'Sin experto, los papeles demoraron la ruta.'}}]}
 ],
 negs:[
  {tipo:'cliente',ic:'🇦🇷',who:'Martín · Importadora Mendoza',role:'Tu cliente principal en Argentina',badge:'Cliente',title:'Pide pagar 30 % menos por la devaluación',
   msgs:['¡Che, qué tal! 🇦🇷','El peso se devaluó otra vez… Queremos pagar <b>30 % menos</b> en dólares.','O reducimos el pedido a la mitad.'],loc:'Videollamada',opts:[
   {lbl:'Aceptar 30 % menos',sub:'Mantienes el cliente, pierdes margen.',fx:{rent:-10,eq:0,cli:6,cre:0,sos:-4},q:0,r:'¡Genial, che! Seguimos comprando.'},
   {lbl:'Precio fijo en dólares con 10 % por volumen',sub:'Cedes algo a cambio de volumen.',fx:{rent:-2,eq:0,cli:6,cre:4,sos:6},q:2,r:'Bueno… 10 % por volumen nos sirve. ¡Dale!'},
   {lbl:'Mantener precio y buscar clientes en Chile',sub:'Diversificas mercados.',fx:{rent:2,eq:0,cli:-4,cre:6,sos:2},q:1,r:'Entiendo. Si cambian de idea, avisanos.'}]},
  {tipo:'proveedor',ic:'👨‍🌾',who:'Don Félix',role:'Asociación de bananeros',badge:'Proveedor',title:'Quieren precio fijo todo el año',
   msgs:['Buenos días, socio 🍌','Los productores queremos <b>precio fijo todo el año</b>, haya o no buena cosecha.','Si no, le vendemos al intermediario.'],loc:'Reunión en Shinahota',opts:[
   {lbl:'Precio fijo con pago puntual a 15 días',sub:'Estabilidad para todos.',fx:{rent:-2,eq:4,cli:2,cre:2,sos:8},q:2,r:'Con pago puntual, nos quedamos con ustedes 🤝'},
   {lbl:'Precio variable como siempre',sub:'Más barato en buena cosecha… si se quedan.',fx:{rent:4,eq:-2,cli:0,cre:0,sos:-6},q:0},
   {lbl:'Precio fijo para la mitad del volumen',sub:'Término medio.',fx:{rent:2,eq:2,cli:0,cre:2,sos:4},q:1}]},
  {tipo:'aliado',ic:'🚢',who:'Agencia naviera',role:'Exportación por Arica',badge:'Aliado',title:'Contrato anual de contenedores refrigerados',
   msgs:['Hola 🚢 Ofrecemos <b>contenedores refrigerados</b> a Chile y Asia.','Con contrato anual, 20 % menos de flete… pero pagan aunque no envíen.'],loc:'Correo de la naviera',opts:[
   {lbl:'Contrato anual completo',sub:'Flete barato, compromiso total.',fx:{rent:6,eq:0,cli:2,cre:6,sos:-6},q:1},
   {lbl:'Contrato anual por la mitad de contenedores',sub:'Ahorro con flexibilidad.',fx:{rent:4,eq:0,cli:2,cre:6,sos:4},q:2,r:'De acuerdo: mitad fija y el resto según demanda.'},
   {lbl:'Seguir con fletes sueltos',sub:'Caro pero flexible.',fx:{rent:-2,eq:0,cli:0,cre:0,sos:2},q:1}]}
 ],
 opps:[
  {ic:'🍍',title:'Piña orgánica para Europa',news:'Atención: Europa busca piña orgánica certificada de Sudamérica, y paga hasta el doble.',
   desc:'Un comprador europeo paga el doble por piña orgánica certificada. La certificación toma un año.',loc:'📍 Mercado europeo',opts:[
   {lbl:'Certificar junto con los productores',sub:'Inversión de un año, precio doble.',fx:{rent:-4,eq:4,cli:6,cre:14,sos:4},q:2,
    cond:{need:{hire:'a_agro'},ok:{cre:4},ko:{cre:-4},okMsg:'Su ingeniero agrónomo guió la certificación.',koMsg:'Sin agrónomo, la certificación se retrasó.'}},
   {lbl:'Comprar fruta ya certificada a terceros',sub:'Rápido, menos margen.',fx:{rent:-2,eq:0,cli:4,cre:6,sos:0},q:1},
   {lbl:'No entrar al mercado orgánico',sub:'Sigues con lo de siempre.',fx:{rent:2,eq:0,cli:0,cre:-6,sos:0},q:0}]},
  {ic:'🏭',title:'Planta de fruta deshidratada',news:'Atención: la fruta deshidratada boliviana gana mercado como snack saludable.',
   desc:'Podrías deshidratar la fruta que no cumple calidad de exportación y venderla como snack.',loc:'📍 Shinahota',opts:[
   {lbl:'Instalar planta de deshidratado',sub:'Conviertes el descarte en producto.',fx:{rent:2,eq:2,cli:6,cre:10,sos:6},q:2,
    cond:{need:{cap:'inf',min:15000},ok:{rent:4},ko:{rent:-6},okMsg:'Su inversión en infraestructura financió la planta.',koMsg:'Sin presupuesto de infraestructura, la planta se financió con deuda.'}},
   {lbl:'Vender el descarte a intermediarios',sub:'Algo es algo.',fx:{rent:2,eq:0,cli:0,cre:2,sos:2},q:1},
   {lbl:'Seguir botando el descarte',sub:'Desperdicio y costo.',fx:{rent:-2,eq:0,cli:0,cre:-4,sos:-4},q:0}]}
 ]},
cli:{
 intro:'Ustedes dirigen la Clínica Salud Cala Cala: consultorios, laboratorio y ecografía en la zona norte. Los equipos cuestan como una casa y cada paciente confía su salud a su equipo. Su reto: ser rentables sin dejar de cuidar a las personas.',
 crises:[
  {ic:'🦟',title:'Brote de dengue en la ciudad',news:'Último momento: el SEDES declara alerta por brote de dengue en Cochabamba. Los centros de salud están desbordados.',
   desc:'Hay alerta de dengue: tus consultorios están llenos, faltan reactivos de laboratorio y el personal está agotado.',loc:'📍 Cochabamba',opts:[
   {lbl:'Turnos extra y triaje organizado',sub:'Atiendes a más, con orden.',fx:{rent:2,eq:-2,cli:10,cre:4,sos:4},q:2,
    cond:{need:{fit:2,min:3},ok:{eq:4},ko:{eq:-6},okMsg:'Su personal clave sostuvo los turnos.',koMsg:'Con poco personal de salud, el equipo colapsó.'}},
   {lbl:'Subir precios por la alta demanda',sub:'Ganancia rápida… en plena emergencia.',fx:{rent:8,eq:0,cli:-12,cre:0,sos:-8},q:0},
   {lbl:'Atender solo con cita previa',sub:'Controlas el flujo, rechazas pacientes.',fx:{rent:0,eq:2,cli:-6,cre:0,sos:2},q:1}]},
  {ic:'🩻',title:'Se avería el ecógrafo',news:'Último momento: la falta de repuestos importados afecta a equipos médicos en clínicas de Cochabamba.',
   desc:'Tu ecógrafo principal se dañó. El repuesto viene de Alemania en 6 semanas y cuesta Bs 25.000.',loc:'📍 Tu clínica',opts:[
   {lbl:'Alquilar un equipo mientras llega el repuesto',sub:'Sigues atendiendo.',fx:{rent:-6,eq:2,cli:6,cre:0,sos:4},q:2,
    cond:{need:{cap:'res',min:12000},ok:{rent:4},ko:{sos:-6},okMsg:'La reserva pagó el alquiler sin problemas.',koMsg:'Sin reserva, el alquiler se pagó con deuda.'}},
   {lbl:'Derivar pacientes a otra clínica con comisión',sub:'No pierdes al paciente del todo.',fx:{rent:-2,eq:0,cli:2,cre:0,sos:2},q:1},
   {lbl:'Suspender ecografías 6 semanas',sub:'Los pacientes buscarán otra clínica.',fx:{rent:-6,eq:0,cli:-10,cre:-4,sos:-2},q:0}]}
 ],
 negs:[
  {tipo:'cliente',ic:'🛡️',who:'Lic. Méndez',role:'Aseguradora de salud · 2.000 asegurados',badge:'Cliente',title:'Convenio con 25 % de descuento',
   msgs:['Buenas tardes 🩺 Queremos derivarles a <b>2.000 asegurados</b>.','Pedimos <b>25 % de descuento</b> en consultas y pagamos a 60 días.'],loc:'Reunión con la aseguradora',opts:[
   {lbl:'Aceptar el convenio completo',sub:'Muchos pacientes, poco margen.',fx:{rent:-6,eq:-2,cli:10,cre:6,sos:-6},q:0,r:'¡Excelente! Desde el lunes les derivamos pacientes.'},
   {lbl:'15 % de descuento y pago a 30 días',sub:'Volumen con margen sano.',fx:{rent:2,eq:0,cli:8,cre:6,sos:4},q:2,r:'Es razonable. Firmamos 🤝'},
   {lbl:'Solo pacientes particulares',sub:'Margen alto, menos pacientes.',fx:{rent:2,eq:0,cli:-6,cre:-4,sos:2},q:1,r:'Entendemos.'}]},
  {tipo:'proveedor',ic:'🧪',who:'Distribuidora de reactivos',role:'Proveedor de laboratorio',badge:'Proveedor',title:'Reactivos 30 % más caros',
   msgs:['Doctor, le informamos 🧪','Los reactivos suben <b>30 %</b> por el tipo de cambio.','Si firma exclusividad un año, lo dejamos en 15 %.'],loc:'Visita del proveedor',opts:[
   {lbl:'Exclusividad un año con 15 %',sub:'Costo estable.',fx:{rent:4,eq:0,cli:0,cre:0,sos:4},q:2,r:'¡Listo! Contrato firmado.'},
   {lbl:'Comprar a varios proveedores según precio',sub:'Flexible, más trabajo.',fx:{rent:2,eq:-2,cli:0,cre:0,sos:2},q:1},
   {lbl:'Usar reactivos genéricos sin registro',sub:'Barato… y peligroso.',fx:{rent:6,eq:-4,cli:-8,cre:0,sos:-12},q:0}]},
  {tipo:'aliado',ic:'🏛️',who:'Servicio Departamental de Salud',role:'Sistema público',badge:'Aliado',title:'Atender pacientes del sistema público',
   msgs:['Saludos 🏛️ El sistema público necesita apoyo en <b>laboratorio y ecografías</b>.','Pagamos tarifa pública (40 % menos) cada trimestre.'],loc:'SEDES Cochabamba',opts:[
   {lbl:'Aceptar con cupo diario limitado',sub:'Apoyas sin saturarte.',fx:{rent:0,eq:2,cli:8,cre:6,sos:4},q:2,r:'De acuerdo, un cupo diario. Gracias por apoyar.'},
   {lbl:'Aceptar sin límite',sub:'Mucho volumen, poco margen.',fx:{rent:-6,eq:-6,cli:10,cre:4,sos:-6},q:0},
   {lbl:'Rechazar',sub:'Sin ingresos públicos.',fx:{rent:2,eq:0,cli:-4,cre:-2,sos:0},q:1}]}
 ],
 opps:[
  {ic:'💻',title:'Telemedicina para provincias',news:'Atención: la telemedicina crece en Bolivia y los pacientes de provincias buscan consultas en línea.',
   desc:'Podrías ofrecer consultas por videollamada a pacientes del interior.',loc:'📍 Provincias de Cochabamba',opts:[
   {lbl:'Plataforma propia con historia clínica digital',sub:'Profesional y segura.',fx:{rent:-2,eq:2,cli:10,cre:12,sos:4},q:2,
    cond:{need:{hire:'p_ti'},ok:{cli:4},ko:{cli:-4},okMsg:'Su técnico de redes implementó la plataforma sin fallas.',koMsg:'Sin soporte técnico, las videollamadas fallaban.'}},
   {lbl:'Consultas por WhatsApp sin registro',sub:'Rápido, pero informal.',fx:{rent:2,eq:-2,cli:4,cre:4,sos:-6},q:0},
   {lbl:'Solo atención presencial',sub:'Como siempre.',fx:{rent:0,eq:0,cli:-2,cre:-6,sos:2},q:1}]},
  {ic:'🔬',title:'Tomógrafo con crédito bancario',news:'Atención: los bancos ofrecen créditos productivos para equipamiento médico de alta tecnología.',
   desc:'Un banco financia un tomógrafo. Serían los únicos en la zona norte, pero la cuota mensual es alta.',loc:'📍 Banco',opts:[
   {lbl:'Comprarlo con crédito',sub:'Diferenciación total, deuda grande.',fx:{rent:-4,eq:2,cli:10,cre:14,sos:-6},q:1},
   {lbl:'Alianza con otra clínica para compartirlo',sub:'Compartes la inversión y los pacientes.',fx:{rent:2,eq:2,cli:8,cre:10,sos:4},q:2},
   {lbl:'No endeudarse',sub:'Prudente, sin crecer.',fx:{rent:2,eq:0,cli:-2,cre:-6,sos:4},q:1}]}
 ]},
con:{
 intro:'Ustedes dirigen Tunari Obras, una constructora de la zona sur que levanta viviendas y obras para el municipio. Cada proyecto mueve millones, pero el dinero entra por avance de obra y el cemento cambia de precio cada mes. Su reto: terminar las obras sin quedarse sin caja.',
 crises:[
  {ic:'🧱',title:'Escasez de cemento y fierro',news:'Último momento: escasez de cemento y fierro en el mercado nacional. Las obras se paralizan en varias ciudades.',
   desc:'No hay cemento ni fierro en plaza. Tus 3 obras se paralizan y los obreros esperan.',loc:'📍 Tus obras',opts:[
   {lbl:'Reprogramar y avanzar en acabados',sub:'Usas el tiempo en lo que sí se puede hacer.',fx:{rent:-2,eq:2,cli:2,cre:0,sos:6},q:2,
    cond:{need:{hire:'c_res'},ok:{eq:2,sos:2},ko:{eq:-4},okMsg:'Su residente de obra reorganizó todo en un día.',koMsg:'Sin residente de obra, la reprogramación fue un caos.'}},
   {lbl:'Comprar en el mercado negro',sub:'Caro, sin factura.',fx:{rent:-10,eq:0,cli:4,cre:0,sos:-8},q:0},
   {lbl:'Paralizar y despedir obreros temporalmente',sub:'Ahorras hoy, pierdes equipo.',fx:{rent:4,eq:-10,cli:-4,cre:-2,sos:-4},q:0}]},
  {ic:'🦺',title:'Accidente en la obra',news:'Último momento: un accidente laboral en una obra de la zona sur deja a un trabajador herido. El Ministerio de Trabajo inspeccionará.',
   desc:'Un obrero se cayó de un andamio. Está estable, pero el Ministerio de Trabajo inspeccionará tus obras.',loc:'📍 Obra en la zona sur',opts:[
   {lbl:'Cubrir gastos médicos y reforzar la seguridad',sub:'Haces lo correcto.',fx:{rent:-6,eq:8,cli:4,cre:0,sos:8},q:2,
    cond:{need:{hire:'c_seg'},ok:{rent:4},ko:{sos:-4},okMsg:'Su técnica en seguridad tenía todo documentado.',koMsg:'Sin responsable de seguridad, la inspección encontró muchas fallas.'}},
   {lbl:'Pagar al obrero para que no denuncie',sub:'Antiético e ilegal.',fx:{rent:-4,eq:-8,cli:-4,cre:0,sos:-12},q:0},
   {lbl:'Cubrir solo lo mínimo legal',sub:'Cumples, sin más.',fx:{rent:-2,eq:-2,cli:0,cre:0,sos:0},q:1}]}
 ],
 negs:[
  {tipo:'cliente',ic:'🏛️',who:'Ing. Salazar',role:'Obras Públicas · Gobierno Municipal',badge:'Cliente',title:'Obra de 2 millones con pago a 120 días',
   msgs:['Buenos días 👷 Les adjudicamos la <b>pavimentación de 20 cuadras</b>.','El pago es por planillas de avance… a <b>120 días</b>.','Necesitamos que empiecen la próxima semana.'],loc:'Oficina municipal',opts:[
   {lbl:'Aceptar y financiar con capital propio',sub:'Contrato grande, caja vacía.',fx:{rent:4,eq:-2,cli:6,cre:8,sos:-10},q:0},
   {lbl:'Aceptar con anticipo del 20 % y planillas mensuales',sub:'Lo que permite la ley de contrataciones.',fx:{rent:4,eq:2,cli:6,cre:8,sos:4},q:2,r:'El anticipo está en la norma. Procedemos 📝'},
   {lbl:'Pedir una línea de crédito antes de empezar',sub:'Más lento, más seguro.',fx:{rent:2,eq:0,cli:4,cre:6,sos:4},q:1}]},
  {tipo:'proveedor',ic:'🏭',who:'Ferretería mayorista',role:'Materiales de construcción',badge:'Proveedor',title:'Materiales a crédito con interés',
   msgs:['Hola, ingeniero 🏗️','Le damos <b>materiales a crédito 60 días</b>…','con <b>3 % de interés mensual</b>.'],loc:'Ferretería',opts:[
   {lbl:'Tomar todo a crédito',sub:'Sin desembolso hoy, intereses altos.',fx:{rent:-6,eq:0,cli:2,cre:4,sos:-6},q:0},
   {lbl:'Crédito solo para la obra con anticipo',sub:'Calzas pagos con cobros.',fx:{rent:0,eq:0,cli:2,cre:4,sos:4},q:2},
   {lbl:'Comprar al contado con descuento',sub:'Barato si tienes caja.',fx:{rent:4,eq:0,cli:0,cre:0,sos:-2},q:1,
    cond:{need:{cap:'res',min:15000},ok:{sos:6},ko:{sos:-6},okMsg:'Tenían reserva para comprar al contado.',koMsg:'Pagar al contado los dejó sin caja para sueldos.'}}]},
  {tipo:'aliado',ic:'👷',who:'Dirigente del sindicato',role:'Representa a tus 60 obreros',badge:'Sindicato',title:'Piden 12 % de aumento',
   msgs:['Buenas, ingeniero 👷','Los compañeros piden <b>12 % de aumento</b> y seguro de salud.','Si no, paramos el lunes.'],loc:'En la obra',opts:[
   {lbl:'Aceptar todo',sub:'Paz laboral, costo alto.',fx:{rent:-8,eq:6,cli:0,cre:0,sos:2},q:1},
   {lbl:'6 % ahora, seguro de salud y bono por avance',sub:'Ganan ambos si la obra avanza.',fx:{rent:-2,eq:8,cli:2,cre:2,sos:6},q:2,r:'Con seguro y bono, los compañeros aceptan 🤝'},
   {lbl:'Rechazar y contratar otros obreros',sub:'Conflicto asegurado.',fx:{rent:2,eq:-10,cli:-4,cre:0,sos:-6},q:0}]}
 ],
 opps:[
  {ic:'🏘️',title:'Programa de vivienda social',news:'Atención: el Estado lanza un programa de vivienda social y busca constructoras locales en Cochabamba.',
   desc:'Te invitan a construir 80 viviendas sociales. Margen bajo, pero volumen y pagos garantizados.',loc:'📍 Zona sur',opts:[
   {lbl:'Postular con un sistema constructivo eficiente',sub:'Más casas, menos costo.',fx:{rent:4,eq:2,cli:6,cre:12,sos:4},q:2,
    cond:{need:{hire:'c_res'},ok:{rent:4},ko:{rent:-4},okMsg:'Su ingeniero residente optimizó el diseño.',koMsg:'Sin ingeniero residente, hubo sobrecostos.'}},
   {lbl:'Postular con el método tradicional',sub:'Conocido, pero lento.',fx:{rent:0,eq:-2,cli:4,cre:8,sos:0},q:1},
   {lbl:'No postular',sub:'Sin riesgo, sin volumen.',fx:{rent:0,eq:0,cli:0,cre:-6,sos:2},q:0}]},
  {ic:'🏢',title:'Edificio propio en preventa',news:'Atención: crece la demanda de departamentos en el sur de Cochabamba.',
   desc:'Podrías construir un edificio propio y venderlo en preventa antes de terminarlo.',loc:'📍 Av. Petrolera',opts:[
   {lbl:'Preventa con avance garantizado',sub:'Los compradores financian la obra.',fx:{rent:6,eq:0,cli:6,cre:12,sos:2},q:2,
    cond:{need:{dept:'ven',min:1},ok:{cli:4},ko:{cli:-6},okMsg:'Su equipo de ventas llenó la preventa.',koMsg:'Nadie vendía los departamentos.'}},
   {lbl:'Construir todo con crédito y vender al final',sub:'Ganancia mayor… si todo sale bien.',fx:{rent:2,eq:0,cli:2,cre:10,sos:-10},q:0},
   {lbl:'Seguir solo con obras por contrato',sub:'Lo conocido.',fx:{rent:2,eq:0,cli:0,cre:-4,sos:2},q:1}]}
 ]},
sol:{
 intro:'Ustedes dirigen Sol del Valle, una empresa que instala paneles solares en casas, colegios y fábricas de Cochabamba. Venden ahorro para el futuro, pero los paneles se compran en dólares y el cliente quiere pagar en cuotas. Su reto: hacer crecer la energía limpia sin quemar la caja.',
 crises:[
  {ic:'💵',title:'Paneles importados 40 % más caros',news:'Último momento: el tipo de cambio paralelo encarece los equipos importados. Empresas de tecnología suspenden ventas.',
   desc:'Tu contenedor de paneles cuesta 40 % más en bolivianos. Tienes 30 instalaciones vendidas a precio antiguo.',loc:'📍 Aduana',opts:[
   {lbl:'Cumplir los contratos y ajustar precios nuevos',sub:'Pierdes en estos 30, cuidas la reputación.',fx:{rent:-6,eq:2,cli:8,cre:2,sos:4},q:2,
    cond:{need:{cap:'res',min:12000},ok:{rent:4},ko:{sos:-8},okMsg:'La reserva absorbió la diferencia de precio.',koMsg:'Sin reserva, cumplir los contratos los endeudó.'}},
   {lbl:'Pedir a los clientes que paguen la diferencia',sub:'Rompes lo acordado.',fx:{rent:4,eq:0,cli:-10,cre:-2,sos:-4},q:0},
   {lbl:'Instalar paneles más baratos de otra marca',sub:'Cumples, con menos garantía.',fx:{rent:2,eq:-2,cli:-4,cre:0,sos:-4},q:1}]},
  {ic:'⚡',title:'Nueva norma para conectar paneles a la red',news:'Último momento: la autoridad eléctrica cambia los requisitos para conectar sistemas solares a la red.',
   desc:'Una nueva norma exige inversores certificados y trámites para conectar a la red. 15 instalaciones quedan en pausa.',loc:'📍 Autoridad eléctrica',opts:[
   {lbl:'Certificar al equipo y cumplir la norma',sub:'Te diferencias como empresa seria.',fx:{rent:-4,eq:4,cli:4,cre:4,sos:8},q:2,
    cond:{need:{hire:'s_ele'},ok:{eq:2,sos:2},ko:{rent:-4},okMsg:'Su ingeniero electricista ya conocía la norma.',koMsg:'Sin electricista certificado, tuvieron que contratar afuera.'}},
   {lbl:'Instalar solo con baterías, sin conectar a la red',sub:'Sales del problema, más caro para el cliente.',fx:{rent:-4,eq:0,cli:2,cre:2,sos:2},q:1},
   {lbl:'Conectar igual y esperar que nadie revise',sub:'Riesgo legal y de seguridad.',fx:{rent:2,eq:-2,cli:-6,cre:0,sos:-12},q:0}]}
 ],
 negs:[
  {tipo:'cliente',ic:'🏭',who:'Gerente · Textiles Quillacollo',role:'Fábrica con alto consumo eléctrico',badge:'Cliente',title:'Paneles en 36 cuotas sin interés',
   msgs:['Hola ☀️ Queremos paneles para toda la fábrica.','Ahorraríamos 40 % de luz… pero pagamos en <b>36 cuotas sin interés</b>.'],loc:'Visita a la fábrica',opts:[
   {lbl:'Aceptar 36 cuotas',sub:'Gran venta, tú financias 3 años.',fx:{rent:-4,eq:0,cli:8,cre:6,sos:-8},q:0},
   {lbl:'Financiar con un banco aliado: la cuota se paga con el ahorro',sub:'El banco financia, tú cobras al contado.',fx:{rent:4,eq:0,cli:8,cre:8,sos:4},q:2,r:'Si la cuota es menor que el ahorro, ¡firmamos! 📝'},
   {lbl:'50 % al contado y 12 cuotas',sub:'Término medio.',fx:{rent:4,eq:0,cli:2,cre:4,sos:4},q:1}]},
  {tipo:'proveedor',ic:'🔋',who:'Fabricante en China',role:'Proveedor de paneles',badge:'Proveedor',title:'15 % menos por contenedor completo',
   msgs:['Hello! ☀️','If you buy a <b>full container</b>, 15 % discount.','Pago 100 % antes del embarque.'],loc:'Correo del fabricante',opts:[
   {lbl:'Comprar el contenedor completo',sub:'Barato, pero inmovilizas mucha caja.',fx:{rent:4,eq:0,cli:0,cre:4,sos:-8},q:1},
   {lbl:'Compra conjunta con otra empresa solar',sub:'Comparten contenedor y riesgo.',fx:{rent:4,eq:2,cli:0,cre:4,sos:4},q:2,r:'OK: two companies, one container 🤝'},
   {lbl:'Seguir comprando a un importador local',sub:'Más caro, sin riesgo.',fx:{rent:-4,eq:0,cli:0,cre:0,sos:4},q:1}]},
  {tipo:'aliado',ic:'🏫',who:'Director distrital de educación',role:'Red de colegios',badge:'Aliado',title:'Paneles para 10 colegios a cambio de publicidad',
   msgs:['Buenos días 🏫 Diez colegios quieren paneles solares.','No tenemos presupuesto completo… pero les damos <b>visibilidad</b> y testimonios.'],loc:'Dirección distrital',opts:[
   {lbl:'Instalar gratis a cambio de publicidad',sub:'Mucha imagen, cero ingreso.',fx:{rent:-8,eq:0,cli:6,cre:6,sos:-4},q:0},
   {lbl:'Piloto en 2 colegios con fondos de cooperación',sub:'Imagen y proyecto sostenible.',fx:{rent:0,eq:2,cli:6,cre:8,sos:4},q:2,r:'¡Excelente idea! Buscamos el fondo juntos 🤝'},
   {lbl:'Rechazar',sub:'Sin costo, sin vitrina.',fx:{rent:2,eq:0,cli:-2,cre:-4,sos:0},q:1}]}
 ],
 opps:[
  {ic:'🚗',title:'Cargadores solares para autos eléctricos',news:'Atención: llegan más autos eléctricos a Bolivia y faltan estaciones de carga.',
   desc:'Podrías instalar estaciones de carga solar en estacionamientos y supermercados.',loc:'📍 Cochabamba',opts:[
   {lbl:'Piloto con un supermercado',sub:'Aprendes con riesgo bajo.',fx:{rent:0,eq:2,cli:6,cre:12,sos:4},q:2},
   {lbl:'Red de 10 estaciones con crédito',sub:'Pionero… y endeudado.',fx:{rent:-6,eq:0,cli:4,cre:14,sos:-8},q:1},
   {lbl:'Esperar a que haya más autos',sub:'Otros llegarán primero.',fx:{rent:2,eq:0,cli:0,cre:-6,sos:2},q:1}]},
  {ic:'💧',title:'Bombeo solar para riego',news:'Atención: productores del Valle Alto buscan bombas solares para riego ante la sequía.',
   desc:'Agricultores del Valle Alto quieren bombas solares para riego, financiadas por una ONG.',loc:'📍 Valle Alto',opts:[
   {lbl:'Alianza con la ONG y técnicos locales',sub:'Impacto social y ventas.',fx:{rent:4,eq:4,cli:8,cre:10,sos:6},q:2,
    cond:{need:{hire:'s_ins'},ok:{cli:4},ko:{cli:-4},okMsg:'Su instalador hizo las bombas funcionar a la primera.',koMsg:'Sin instalador propio, hubo retrasos y quejas.'}},
   {lbl:'Vender solo los equipos',sub:'Venta simple, sin servicio.',fx:{rent:4,eq:0,cli:2,cre:4,sos:0},q:1},
   {lbl:'No es nuestro mercado',sub:'Te quedas en la ciudad.',fx:{rent:0,eq:0,cli:-2,cre:-6,sos:0},q:0}]}
 ]},
cer:{
 intro:'Ustedes dirigen Llajta Brew, una cervecería artesanal de Tiquipaya que usa maíz y frutas del valle. La gente ama su sabor, pero compiten con una industria gigante que controla bares y distribuidores. Su reto: hacerse un espacio sin que los aplasten.',
 crises:[
  {ic:'🚫',title:'Bares firman exclusividad con la competencia',news:'Último momento: una gran cervecera ofrece refrigeradores gratis a bares de Cochabamba a cambio de exclusividad.',
   desc:'Una gran cervecera ofrece refrigeradores gratis a los bares a cambio de exclusividad. Pierdes 12 puntos de venta.',loc:'📍 Bares de Cochabamba',opts:[
   {lbl:'Abrir un taproom propio con eventos',sub:'Tu propio canal de venta.',fx:{rent:-4,eq:2,cli:8,cre:8,sos:4},q:2,
    cond:{need:{cap:'inf',min:12000},ok:{rent:4},ko:{rent:-4},okMsg:'Su inversión en infraestructura montó el taproom rápido.',koMsg:'Sin presupuesto de infraestructura, el taproom salió caro.'}},
   {lbl:'Bajar precios para recuperar los bares',sub:'Peleas en el terreno del gigante.',fx:{rent:-10,eq:0,cli:4,cre:0,sos:-6},q:0},
   {lbl:'Enfocarse en tiendas gourmet y delivery',sub:'Otro canal, menos volumen.',fx:{rent:0,eq:0,cli:4,cre:4,sos:4},q:1}]},
  {ic:'📋',title:'Lote observado por la autoridad sanitaria',news:'Último momento: la autoridad sanitaria observa lotes de bebidas artesanales con registros desactualizados.',
   desc:'Un lote de 3.000 botellas fue observado por una etiqueta sin el registro sanitario actualizado.',loc:'📍 Control sanitario',opts:[
   {lbl:'Retirar el lote y regularizar todo',sub:'Pierdes un lote, ganas confianza.',fx:{rent:-6,eq:2,cli:2,cre:0,sos:10},q:2,
    cond:{need:{hire:'l_tec'},ok:{rent:2},ko:{sos:-2},okMsg:'Su técnica de calidad regularizó todo en días.'}},
   {lbl:'Seguir vendiendo y tramitar después',sub:'Riesgo de clausura.',fx:{rent:4,eq:-2,cli:-8,cre:0,sos:-12},q:0},
   {lbl:'Re-etiquetar el lote a mano',sub:'Mucho trabajo, salvas el lote.',fx:{rent:-2,eq:-4,cli:0,cre:0,sos:4},q:1}]}
 ],
 negs:[
  {tipo:'cliente',ic:'🎸',who:'Bar Rock & Llajta',role:'Bar en El Prado',badge:'Cliente',title:'Quiere 3 meses de consignación',
   msgs:['¡Hola, cerveceros! 🍺','Quiero sus cervezas en mi bar…','pero en <b>consignación</b>: pago lo que vendo, cada 3 meses.'],loc:'El Prado',opts:[
   {lbl:'Aceptar la consignación',sub:'Entras al bar, financias al dueño.',fx:{rent:-4,eq:0,cli:6,cre:4,sos:-6},q:0},
   {lbl:'Barril en comodato y pago mensual',sub:'Tú pones el barril, él paga cada mes.',fx:{rent:4,eq:0,cli:6,cre:4,sos:4},q:2,r:'Barril propio y pago mensual… ¡trato! 🤘'},
   {lbl:'Solo al contado',sub:'Caja sana, menos bares.',fx:{rent:2,eq:0,cli:-4,cre:-2,sos:2},q:1}]},
  {tipo:'proveedor',ic:'🌾',who:'Malta importada',role:'Proveedor de Argentina',badge:'Proveedor',title:'La malta sube 25 %',
   msgs:['Hola 🌾 La malta importada sube <b>25 %</b>.','Podemos fijar el precio un año con pago adelantado.'],loc:'Correo del proveedor',opts:[
   {lbl:'Fijar precio un año pagando adelantado',sub:'Estabilidad, caja inmovilizada.',fx:{rent:4,eq:0,cli:0,cre:0,sos:2},q:1,
    cond:{need:{cap:'res',min:10000},ok:{sos:4},ko:{sos:-8},okMsg:'La reserva permitió pagar por adelantado.',koMsg:'El adelanto dejó sin caja a la cervecería.'}},
   {lbl:'Usar más maíz y cebada del valle',sub:'Identidad local y menos dependencia.',fx:{rent:2,eq:2,cli:4,cre:6,sos:6},q:2,
    cond:{need:{hire:'b_mae'},ok:{cli:4},ko:{cli:-6},okMsg:'Su maestra cervecera adaptó la receta sin perder calidad.',koMsg:'Sin maestro cervecero, el sabor cambió y los clientes lo notaron.'}},
   {lbl:'Aceptar el alza',sub:'Lo más fácil.',fx:{rent:-6,eq:0,cli:0,cre:0,sos:0},q:0}]},
  {tipo:'aliado',ic:'🚚',who:'Distribuidora Andina',role:'Distribuidor nacional',badge:'Aliado',title:'Llevarte a 4 ciudades por 35 % de margen',
   msgs:['Hola 🚚 Podemos llevar Llajta Brew a <b>La Paz, Santa Cruz, Sucre y Tarija</b>.','Nuestro margen es <b>35 %</b>.'],loc:'Reunión comercial',opts:[
   {lbl:'Aceptar el 35 %',sub:'Llegas a todo el país, ganas menos.',fx:{rent:-4,eq:0,cli:8,cre:10,sos:0},q:1},
   {lbl:'25 % con metas y exclusividad por ciudad',sub:'Socios con objetivos claros.',fx:{rent:2,eq:0,cli:8,cre:10,sos:4},q:2,r:'25 % con metas claras… ¡vamos! 🍻'},
   {lbl:'Crecer solo en Cochabamba',sub:'Controlas todo, creces lento.',fx:{rent:2,eq:0,cli:-2,cre:-6,sos:2},q:0}]}
 ],
 opps:[
  {ic:'🏆',title:'Festival cervecero nacional',news:'Atención: se viene el festival de cerveza artesanal más grande de Bolivia, con jurado internacional.',
   desc:'Puedes competir con tus recetas. Si ganas, la prensa y los bares te buscarán.',loc:'📍 Festival nacional',opts:[
   {lbl:'Participar con stand y concurso',sub:'Vitrina nacional.',fx:{rent:-4,eq:2,cli:10,cre:12,sos:2},q:2,
    cond:{need:{hire:'b_mae'},ok:{cli:4},ko:{cli:-4},okMsg:'Su maestra cervecera ganó una medalla.',koMsg:'Sin maestro cervecero, la receta no destacó.'}},
   {lbl:'Solo stand de venta',sub:'Ventas del día.',fx:{rent:2,eq:0,cli:4,cre:4,sos:0},q:1},
   {lbl:'No participar',sub:'Nadie se entera de tu cerveza.',fx:{rent:0,eq:0,cli:-2,cre:-6,sos:2},q:0}]},
  {ic:'🛒',title:'Cadena de supermercados',news:'Atención: supermercados nacionales abren espacio para productos artesanales locales.',
   desc:'Una cadena quiere tu cerveza en 20 tiendas. Exige volumen constante y precio bajo.',loc:'📍 Supermercados',opts:[
   {lbl:'Línea especial para supermercado con precio menor',sub:'Volumen sin canibalizar los bares.',fx:{rent:2,eq:0,cli:8,cre:10,sos:2},q:2},
   {lbl:'Entrar con todas las variedades a precio de bar',sub:'Caro para el súper, poca rotación.',fx:{rent:4,eq:0,cli:-2,cre:4,sos:0},q:1},
   {lbl:'Seguir solo en bares',sub:'Nicho seguro.',fx:{rent:0,eq:0,cli:0,cre:-6,sos:2},q:0}]}
 ]}
});
