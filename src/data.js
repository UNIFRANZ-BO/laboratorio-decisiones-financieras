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

const CRISES=[
  {ic:'🚧',title:'¡Bloqueo en la carretera principal!',desc:'Los sindicatos cerraron la Av. Blanco Galindo durante 3 días. Tu proveedor no puede llegar y los pedidos se acumulan. Cada hora sin resolver te cuesta clientes.',loc:'📍 Zona Norte · Situación recurrente en Cochabamba',opts:[
    {lbl:'Buscar proveedor alternativo local',sub:'Más caro pero disponible. Protege la operación a corto plazo.',fx:{rent:-10,eq:0,cli:4,cre:0,sos:8}},
    {lbl:'Cerrar operaciones temporalmente',sub:'Reduces pérdidas inmediatas pero dañas la relación con clientes clave.',fx:{rent:4,eq:-6,cli:-12,cre:-8,sos:2}},
    {lbl:'Comunicar proactivamente y ofrecer descuentos',sub:'Sacrificas margen pero mantienes la confianza del cliente.',fx:{rent:-6,eq:8,cli:10,cre:4,sos:6}}]},
  {ic:'💧',title:'Corte de agua por SEMAPA',desc:'Servicio cortado por reparaciones de emergencia durante 48 horas. Tu operación lo necesita y los vecinos están en la misma situación.',loc:'📍 Cochabamba Centro · Crisis recurrente de servicios básicos',opts:[
    {lbl:'Contratar cisterna privada de inmediato',sub:'Costoso pero el negocio no para.',fx:{rent:-12,eq:2,cli:8,cre:0,sos:-4}},
    {lbl:'Adaptar el servicio temporalmente',sub:'Creatividad ante la adversidad, pero puede afectar la calidad percibida.',fx:{rent:0,eq:4,cli:-8,cre:6,sos:2}},
    {lbl:'Coordinar con vecinos para compartir cisterna',sub:'Más lento pero construye comunidad y reduce el gasto.',fx:{rent:-4,eq:10,cli:0,cre:4,sos:12}}]},
  {ic:'📉',title:'Competidor informal con precios más bajos',desc:'Un vendedor informal opera en la misma cuadra a mitad de precio. Tus ventas cayeron 25 % en 2 semanas.',loc:'📍 Tu zona de influencia · Competencia informal común en Bolivia',opts:[
    {lbl:'Bajar precios para competir directamente',sub:'Recuperas clientes pero reduces el margen operativo significativamente.',fx:{rent:-14,eq:0,cli:10,cre:-4,sos:-4}},
    {lbl:'Diferenciarte por calidad y experiencia',sub:'Apuestas al segmento que valora calidad sobre precio.',fx:{rent:4,eq:4,cli:-4,cre:10,sos:8}},
    {lbl:'Denunciar y regularizar la situación',sub:'Proceso lento pero establece una ventaja legal y formal.',fx:{rent:2,eq:0,cli:2,cre:-6,sos:6}}]}
];

/* Negociación: 3 rondas (cliente, proveedor, distribuidor). Cada ronda pesa la mitad que el evento original. */
const NEG_WEIGHT=.5;
const NEGS=[
  {tipo:'cliente',ic:'🛍️',who:'Don Ernesto',role:'Cliente principal · 30 % de tus ingresos',badge:'Cliente',title:'Cliente clave pide descuento del 20 %',
   msgs:['Hola, buen día 👋','Te soy sincero: otra empresa me ofrece mejor precio. Si no me das un <b>descuento permanente del 20 %</b>, me voy.','Necesito tu respuesta hoy.'],
   loc:'Reunión presencial · Tu local, Cochabamba',opts:[
     {lbl:'Otorgar el 20 % que pide',sub:'Retienes al cliente pero tu margen cae drásticamente.',fx:{rent:-12,eq:0,cli:8,cre:-4,sos:-2},r:'¡Perfecto! Sabía que aceptarías 😏 Mañana te pido otra cosita…'},
     {lbl:'Negociar: 10 % a cambio de contrato anual',sub:'Cedes menos pero aseguras ingresos estables.',fx:{rent:-4,eq:2,cli:10,cre:6,sos:8},r:'Mmm… 10 % con contrato de un año. Me da seguridad. ¡Trato hecho! 🤝'},
     {lbl:'Rechazar y ofrecer valor diferencial',sub:'Propones servicio premium en lugar de bajar precio.',fx:{rent:6,eq:4,cli:-8,cre:4,sos:6},r:'No era lo que esperaba… Lo voy a pensar. Quizá pruebe con la otra empresa 😒'}]},
  {tipo:'cliente',ic:'⭐',who:'Fer Rojas',role:'@cochalover · 8.000 seguidores',badge:'Cliente',title:'Cliente insatisfecho amenaza con reseñas negativas',
   msgs:['Tuve una PÉSIMA experiencia con su negocio 😡','Quiero <b>compensación total</b>. Si no, lo publico en Instagram para mis 8.000 seguidores.'],
   loc:'Redes sociales · Mercado digital cochabambino',opts:[
     {lbl:'Dar compensación completa sin preguntar',sub:'Resuelves rápido pero abres la puerta a abusos futuros.',fx:{rent:-8,eq:0,cli:12,cre:0,sos:4},r:'¡Genial! Ya borré la queja. Mis amigos también van a querer lo mismo 😅'},
     {lbl:'Investigar el caso y ofrecer solución parcial',sub:'Más lento pero justo y con criterio profesional.',fx:{rent:-2,eq:6,cli:6,cre:4,sos:10},r:'Ok, me explicaron bien lo que pasó. Acepto la solución, gracias por escucharme 👍'},
     {lbl:'Responder públicamente con hechos concretos',sub:'Arriesgado: puede escalar o fortalecer tu reputación.',fx:{rent:2,eq:0,cli:-10,cre:2,sos:4},r:'¿¡En público!? 😤 Esto se va a poner feo en los comentarios…'}]},
  {tipo:'proveedor',ic:'📦',who:'Insumos del Valle',role:'Tu proveedor hace 3 años',badge:'Proveedor',title:'Proveedor principal sube precios un 18 %',
   msgs:['Estimado cliente, le escribimos por algo importante.','Por inflación y transporte, desde el lunes nuestros precios suben <b>18 %</b> 📈','Esperamos seguir trabajando juntos.'],
   loc:'Zona Industrial · Av. Blanco Galindo, Cbba',opts:[
     {lbl:'Aceptar y trasladar el alza al precio final',sub:'Proteges tu margen pero pierdes competitividad.',fx:{rent:6,eq:0,cli:-10,cre:-4,sos:0},r:'Gracias por entender. Eso sí, tus clientes van a notar el nuevo precio.'},
     {lbl:'Negociar: 10 % a cambio de contrato exclusivo',sub:'Cedes menos y aseguras abastecimiento estable.',fx:{rent:-2,eq:4,cli:2,cre:4,sos:8},r:'10 % con exclusividad… nos conviene asegurar tu volumen. ¡Hecho! 📝'},
     {lbl:'Buscar proveedores alternativos',sub:'Más independencia, pero riesgo de quedarte sin insumos.',fx:{rent:-6,eq:0,cli:-4,cre:8,sos:6},r:'Entendemos. Si no te va bien con los nuevos, aquí estaremos… o no 🤷'}]},
  {tipo:'proveedor',ic:'🔗',who:'Altiplano Express',role:'Proveedor nuevo · La Paz',badge:'Proveedor',title:'Proveedor nuevo ofrece precio 25 % más bajo',
   msgs:['¡Hola! Somos distribuidores de La Paz 🏔️','Te ofrecemos los mismos insumos <b>25 % más baratos</b> que tu proveedor actual.','¿Empezamos esta semana?'],
   loc:'Contacto remoto · Sin referencias verificadas',opts:[
     {lbl:'Cambiar al proveedor nuevo de inmediato',sub:'Máximo ahorro, pero sin red de seguridad si fallan.',fx:{rent:14,eq:0,cli:-8,cre:4,sos:-8},r:'¡Excelente decisión! El primer envío sale… cuando haya transporte 😅'},
     {lbl:'Probar con un pedido pequeño primero',sub:'Verificas calidad y cumplimiento antes de comprometerte.',fx:{rent:4,eq:2,cli:0,cre:6,sos:4},r:'Me parece razonable. Te mandamos la muestra esta semana 📦'},
     {lbl:'Usar la oferta para negociar con el actual',sub:'Bajas el precio sin cambiar de proveedor conocido.',fx:{rent:8,eq:2,cli:2,cre:0,sos:6},r:'Ah, ¿solo querías nuestro precio para negociar? Bueno… suerte con eso 😑'}]},
  {tipo:'distribuidor',ic:'🚛',who:'Transportes Valle Alto',role:'Canal Quillacollo – Punata',badge:'Distribuidor',title:'Distribuidor quiere exclusividad regional',
   msgs:['¡Buenas! Tenemos una propuesta grande 🚛','Si nos das <b>exclusividad regional</b>, aumentamos tu volumen un 40 %.','Eso sí: tendrías que dejar a tus otros distribuidores.'],
   loc:'Valle Alto · Quillacollo – Punata',opts:[
     {lbl:'Aceptar la exclusividad a cambio del volumen',sub:'Más ingresos, pero dependencia total de un solo canal.',fx:{rent:12,eq:0,cli:8,cre:6,sos:-8},r:'¡Excelente! Desde hoy solo trabajas con nosotros 🚛💨'},
     {lbl:'Aceptar solo por 6 meses con revisión',sub:'Evalúas antes de comprometerte definitivamente.',fx:{rent:6,eq:2,cli:6,cre:4,sos:4},r:'Seis meses de prueba… justo. Hagamos que funcione 🤝'},
     {lbl:'Rechazar y mantener diversidad de canales',sub:'Conservas flexibilidad estratégica a largo plazo.',fx:{rent:-4,eq:4,cli:-4,cre:2,sos:10},r:'Bueno, seguimos como hasta ahora. Tú te lo pierdes 🙃'}]},
  {tipo:'distribuidor',ic:'📊',who:'Distribuidora Zona Sur',role:'Mueve el 25 % de tu volumen',badge:'Distribuidor',title:'Distribuidor pide rebaja del 15 % en precio mayorista',
   msgs:['Hola, te hablo claro 📊','La competencia nos ofrece mejores condiciones. Necesitamos un <b>15 % menos</b> en el precio mayorista.','Si no, cambiamos de marca.'],
   loc:'Zona Sur · Sacaba – Colcapirhua, Cbba',opts:[
     {lbl:'Dar el 15 % que pide',sub:'Retienes el canal pero comprimes seriamente el margen.',fx:{rent:-14,eq:0,cli:6,cre:-2,sos:2},r:'¡Así me gusta! Seguimos trabajando 😁'},
     {lbl:'Ofrecer 8 % + campaña de marketing conjunta',sub:'Cedes menos dinero y creas una alianza más profunda.',fx:{rent:-4,eq:4,cli:8,cre:8,sos:6},r:'8 % y campañas juntos… ¡me gusta la idea! Somos socios 🤜🤛'},
     {lbl:'Proponer descuento escalonado por volumen',sub:'Más justo y escalable, aunque más complejo de gestionar.',fx:{rent:2,eq:2,cli:4,cre:6,sos:8},r:'Si vendo más, gano más descuento… me motiva. ¡Acepto! 📈'}]}
];

const OPPS=[
  {ic:'🎪',title:'¡Feria de la Exposición de Cochabamba!',desc:'La Feria Internacional abre sus puertas. Oportunidad de presentar tu negocio ante miles de visitantes y compradores nacionales.',loc:'📍 Recinto Ferial · Evento anual más importante de la región',opts:[
    {lbl:'Participar con stand completo',sub:'Inversión alta pero acceso a nuevos mercados.',fx:{rent:-8,eq:-4,cli:16,cre:20,sos:0}},
    {lbl:'Participar con presencia mínima',sub:'Bajo costo, presencia moderada, aprendizaje sin riesgo.',fx:{rent:-2,eq:0,cli:8,cre:8,sos:4}},
    {lbl:'No participar, enfocarse en lo local',sub:'Fortaleces el mercado actual sin distracciones.',fx:{rent:8,eq:4,cli:-4,cre:-8,sos:8}}]},
  {ic:'🤝',title:'Propuesta de alianza estratégica local',desc:'Un negocio complementario propone compartir costos de distribución y recomendarse clientes mutuamente.',loc:'📍 Cochabamba · Ecosistema empresarial local',opts:[
    {lbl:'Aceptar la alianza completa',sub:'Creces más rápido pero compartes información sensible.',fx:{rent:8,eq:4,cli:14,cre:14,sos:0}},
    {lbl:'Proponer una prueba de 3 meses',sub:'Evalúas antes de comprometerte formalmente.',fx:{rent:4,eq:2,cli:8,cre:6,sos:6}},
    {lbl:'Rechazar y crecer de forma independiente',sub:'Mantienes control total de tu estrategia.',fx:{rent:-4,eq:0,cli:-4,cre:-8,sos:10}}]},
  {ic:'💳',title:'Acceso a crédito productivo del BDP',desc:'El Banco de Desarrollo Productivo ofrece un crédito a tasa preferencial para expansión. Requiere garantías y documentación formal.',loc:'📍 Oficinas BDP · Centro, Cochabamba',opts:[
    {lbl:'Tomar el crédito completo y expandir',sub:'Creces rápido pero aumenta tu endeudamiento.',fx:{rent:-6,eq:0,cli:12,cre:18,sos:-6}},
    {lbl:'Tomar el crédito solo para modernizar',sub:'Mejoras eficiencia sin exponerte a sobreexpandirte.',fx:{rent:8,eq:6,cli:4,cre:6,sos:4}},
    {lbl:'Rechazar el crédito y crecer con recursos propios',sub:'Crecimiento más lento pero sin deuda adicional.',fx:{rent:4,eq:2,cli:-2,cre:-4,sos:12}}]}
];

const TIERS=[
  [78,'🏆 Visionario Empresarial','Gestión estratégica ejemplar. Pocas personas llegan a este nivel sin formación formal.'],
  [63,'⭐ Estratega Competente','Decisiones sólidas y bien fundamentadas. Su empresa tiene futuro real.'],
  [47,'📈 Gestor en Formación','Rendimiento aceptable, pero con desequilibrios que a largo plazo se pagan caro.'],
  [31,'🌱 Emprendedor Aprendiz','La empresa sobrevive con dificultades. Los errores de hoy son la formación de mañana.'],
  [0,'📚 Futuro Estudiante de Negocios','Resultado crítico… y es exactamente por qué existe la carrera de Negocios.']
];

/* Malla NGE 2026 (unifranz.edu.bo) — cada decisión enlazada con su materia */
const MALLA=[
  {ic:'💰',a:'Repartieron Bs 100.000 con criterio',s:'Técnicas Básicas de Gestión Contable Financiera',sem:'1.er semestre'},
  {ic:'📊',a:'Leyeron el impacto en 5 indicadores',s:'Análisis Financiero y Decisiones Estratégicas',sem:'4.º semestre'},
  {ic:'🛡️',a:'Se protegieron ante el entorno (o no)',s:'Análisis del Entorno Económico y Financiero',sem:'2.º semestre'},
  {ic:'✏️',a:'Bocetaron su plan antes de invertir',s:'Lean Startup y Modelos de Negocio',sem:'3.er semestre'},
  {ic:'🏗️',a:'Diseñaron su organigrama',s:'Fundamentos de Gestión Empresarial',sem:'1.er semestre'},
  {ic:'👥',a:'Pusieron a cada persona en su lugar',s:'Gestión del Talento Humano',sem:'4.º semestre'},
  {ic:'🧭',a:'Lideraron al equipo en la decisión',s:'Liderazgo Organizacional',sem:'2.º semestre'},
  {ic:'🚧',a:'Resolvieron una crisis de abastecimiento',s:'Innovación en Logística y Supply Chain',sem:'4.º semestre'},
  {ic:'🤝',a:'Negociaron con cliente, proveedor y distribuidor',s:'Métodos Alternativos de Solución de Controversias',sem:'Electiva · 3.er semestre'},
  {ic:'📣',a:'Invirtieron (o no) en atraer clientes',s:'Fundamentos de Marketing Digital',sem:'2.º semestre'},
  {ic:'💳',a:'Evaluaron una oportunidad y un crédito',s:'Finanzas para Emprendedores',sem:'Mención Startups'},
  {ic:'📈',a:'Interpretaron su radar de desempeño',s:'Business Intelligence y Análisis Prescriptivo',sem:'Mención Analítica'}
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
