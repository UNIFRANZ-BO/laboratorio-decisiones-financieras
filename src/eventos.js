/* ═══════════════════════════════════════
   EVENTOS POR RUBRO (v3)
   Cada negocio tiene: intro (voz), 2 crisis, 3 negociaciones (cliente, proveedor, aliado) y 2 oportunidades.
   fx  = efecto base en indicadores (rent, eq, cli, cre, sos)
   q   = calidad de la decisión (0 débil · 1 aceptable · 2 mejor práctica) → competencias y feedback
   cond= el efecto cambia según decisiones previas:
         need:{cap:'res',min:10000} | {dept:'ven',min:1} | {hire:'p_dev'} | {fit:2,min:3}
         ok / ko = ajuste extra · okMsg / koMsg = explicación que verá el equipo
═══════════════════════════════════════ */
const EV={
/* ───────── CHICHARRONERÍA ───────── */
chi:{
 intro:'Ustedes dirigen la Chicharronería El Pairumani, un clásico familiar de la zona norte. Los domingos se llena, pero los costos del cerdo, el gas y el personal cambian cada semana. Su reto: crecer sin perder el sabor ni la caja.',
 crises:[
  {ic:'🐷',title:'El precio del cerdo sube 30 %',news:'Último momento: escasez de cerdo en el trópico dispara el precio un treinta por ciento. Los restaurantes de Cochabamba ya sienten el golpe.',
   desc:'Por la escasez en el trópico, tu proveedor sube el kilo de cerdo un 30 % desde mañana. Es tu insumo principal y el domingo es en 3 días.',loc:'📍 Mercado de carnes · Cochabamba',opts:[
   {lbl:'Subir el precio del plato un 15 %',sub:'Trasladas el costo al cliente de inmediato.',fx:{rent:6,eq:0,cli:-8,cre:-2,sos:0},q:1},
   {lbl:'Reducir la porción y mantener el precio',sub:'Nadie lo notará… o sí.',fx:{rent:5,eq:-2,cli:-6,cre:0,sos:-6},q:0},
   {lbl:'Comprar stock para 2 meses a precio fijo',sub:'Negocias volumen con un productor, pero necesitas liquidez ahora.',fx:{rent:-2,eq:2,cli:4,cre:2,sos:6},q:2,
    cond:{need:{cap:'res',min:10000},ok:{sos:4,rent:3},ko:{rent:-8,sos:-4},okMsg:'Su fondo de emergencia les permitió comprar por adelantado.',koMsg:'Sin reserva tuvieron que endeudarse para comprar el stock.'}}]},
  {ic:'🧪',title:'Inspección sanitaria municipal',news:'Último momento: la Intendencia Municipal intensifica inspecciones sanitarias en restaurantes de la zona norte. Hay locales clausurados.',
   desc:'Llega la Intendencia: la campana extractora y la cámara de frío no cumplen la norma. Te dan 48 horas o clausuran el local.',loc:'📍 Intendencia Municipal · Zona Norte',opts:[
   {lbl:'Cerrar 2 días y adecuar la cocina',sub:'Pierdes ventas del fin de semana, pero cumples con todo.',fx:{rent:-6,eq:2,cli:-2,cre:0,sos:10},q:2,
    cond:{need:{cap:'inf',min:15000},ok:{rent:4},ko:{rent:-4},okMsg:'Su inversión en infraestructura abarató la adecuación.',koMsg:'Con poca inversión en equipos, la adecuación salió cara.'}},
   {lbl:'Pagar la multa y seguir atendiendo',sub:'El problema de fondo sigue ahí.',fx:{rent:-4,eq:-2,cli:-4,cre:0,sos:-8},q:0},
   {lbl:'“Cocina abierta”: mostrar en redes la mejora',sub:'Conviertes la crisis en marketing, pero requiere ejecución rápida.',fx:{rent:-4,eq:2,cli:6,cre:4,sos:4},q:2,
    cond:{need:{dept:'ven',min:1},ok:{cli:4,cre:2},ko:{cli:-6},okMsg:'Su equipo de ventas y marketing difundió la mejora.',koMsg:'Nadie en ventas o marketing: la campaña no despegó.'}}]}
 ],
 negs:[
  {tipo:'cliente',ic:'🏭',who:'Lic. Paredes',role:'RR. HH. · Fábrica en Quillacollo',badge:'Cliente',title:'Evento corporativo de 300 platos',
   msgs:['Buenas tardes 👋 Organizamos el aniversario de la fábrica.','Necesitamos <b>300 platos de chicharrón</b> para el sábado.','Pedimos <b>25 % de descuento</b> y pagamos a 60 días, como con todos nuestros proveedores.'],
   loc:'Pedido por WhatsApp',opts:[
   {lbl:'Aceptar todo: es un gran pedido',sub:'Volumen alto, pero financias 2 meses al cliente.',fx:{rent:-6,eq:-2,cli:8,cre:4,sos:-6},q:0,r:'¡Excelente! Les pagamos a fines de… bueno, en 60 días 😅'},
   {lbl:'10 % de descuento con 50 % de adelanto',sub:'Cuidas la caja sin perder el pedido.',fx:{rent:4,eq:2,cli:6,cre:4,sos:6},q:2,r:'Mmm… está bien, es razonable. Les transfiero el adelanto hoy 🤝'},
   {lbl:'Precio normal, pago contra entrega',sub:'Sin riesgo, pero puede irse a otro lado.',fx:{rent:4,eq:0,cli:-4,cre:-2,sos:4},q:1,r:'Entiendo… lo consulto con gerencia. Quizá busquemos otra opción.'}]},
  {tipo:'proveedor',ic:'🐖',who:'Granja San Isidro',role:'Productor porcino · Trópico',badge:'Proveedor',title:'Contrato exclusivo con precio fijo',
   msgs:['Hola, somos productores del trópico 🐖','Les ofrecemos <b>precio fijo por 6 meses</b>, 10 % más barato que el mercado.','Condición: comprarnos <b>mínimo 400 kg por semana</b> y solo a nosotros.'],
   loc:'Llamada del productor',opts:[
   {lbl:'Firmar el contrato completo',sub:'Precio estable, pero quedas atado a un mínimo alto.',fx:{rent:8,eq:0,cli:2,cre:2,sos:-6},q:1,r:'¡Trato hecho! Desde el lunes llegan los 400 kg 🚚'},
   {lbl:'Aceptar precio fijo con mínimo de 250 kg',sub:'Negocias un volumen que sí puedes vender.',fx:{rent:6,eq:2,cli:2,cre:2,sos:6},q:2,r:'250 kg… está bien, preferimos un cliente fijo. ¡Hecho!'},
   {lbl:'Seguir comprando en el mercado',sub:'Flexibilidad total, pero precio variable.',fx:{rent:-2,eq:0,cli:0,cre:0,sos:2},q:1,r:'Como gusten. Cuando el precio suba, aquí estaremos 😏'}]},
  {tipo:'aliado',ic:'🛵',who:'App de delivery',role:'Plataforma de pedidos en línea',badge:'Aliado',title:'Comisión del 25 % por delivery',
   msgs:['¡Hola! Queremos sumar a El Pairumani a nuestra app 🛵','Llegarías a <b>miles de clientes nuevos</b> en toda la ciudad.','Nuestra comisión es del <b>25 % por pedido</b>.'],
   loc:'Ejecutivo comercial de la app',opts:[
   {lbl:'Entrar con el 25 % y el mismo precio',sub:'Más ventas, pero cada plato deja menos margen.',fx:{rent:-6,eq:0,cli:8,cre:6,sos:-2},q:0,r:'¡Bienvenidos! Ya los ponemos en portada 🎉'},
   {lbl:'Entrar con un menú delivery a otro precio',sub:'Ajustas el precio en la app para cubrir la comisión.',fx:{rent:2,eq:0,cli:6,cre:6,sos:4},q:2,r:'Muchos restaurantes lo hacen así. ¡Perfecto!'},
   {lbl:'Delivery propio por WhatsApp',sub:'Sin comisión, pero necesitas gente y moto.',fx:{rent:2,eq:-2,cli:2,cre:4,sos:2},q:1,
    cond:{need:{dept:'aten',min:1},ok:{cli:4},ko:{cli:-4,eq:-2},okMsg:'Su equipo de atención manejó los pedidos sin problema.',koMsg:'Nadie atendía el WhatsApp: pedidos perdidos.'},r:'Bueno, si cambian de opinión, nos escriben 👋'}]}
 ],
 opps:[
  {ic:'🎊',title:'Festividad de Urkupiña',news:'Atención: se acerca Urkupiña y Quillacollo espera a más de un millón de visitantes. Los negocios gastronómicos se preparan.',
   desc:'En agosto llegan más de un millón de peregrinos a Quillacollo. Te ofrecen un puesto en la avenida principal por 3 días.',loc:'📍 Quillacollo · Agosto',opts:[
   {lbl:'Puesto grande con personal extra',sub:'Gran inversión, ventas récord si se ejecuta bien.',fx:{rent:6,eq:-4,cli:12,cre:12,sos:-2},q:1,
    cond:{need:{fit:2,min:3},ok:{eq:4,rent:4},ko:{eq:-4,cli:-4},okMsg:'Su equipo clave sostuvo el ritmo de 3 días.',koMsg:'El equipo no tenía experiencia: colas y quejas.'}},
   {lbl:'Puesto pequeño con menú reducido',sub:'Menos riesgo, presencia segura.',fx:{rent:4,eq:0,cli:6,cre:6,sos:4},q:2},
   {lbl:'Quedarse en el local de siempre',sub:'Sin riesgo… sin crecimiento.',fx:{rent:2,eq:2,cli:-2,cre:-6,sos:4},q:0}]},
  {ic:'📸',title:'Influencer gastronómico quiere grabar',news:'Atención: un influencer gastronómico con cien mil seguidores recorre Cochabamba buscando el mejor chicharrón.',
   desc:'Un creador de contenido con 100 mil seguidores quiere grabar un video. Pide comida gratis para él y 10 invitados.',loc:'📍 Redes sociales',opts:[
   {lbl:'Aceptar y preparar una experiencia',sub:'Inviertes en una buena primera impresión.',fx:{rent:-4,eq:2,cli:12,cre:10,sos:0},q:2},
   {lbl:'Aceptar solo para él',sub:'Ahorras, pero el video puede salir flojo.',fx:{rent:-1,eq:0,cli:4,cre:4,sos:0},q:1},
   {lbl:'Rechazar: “aquí todos pagan”',sub:'Coherente, pero pierdes visibilidad.',fx:{rent:2,eq:0,cli:-4,cre:-6,sos:2},q:0}]}
 ]},

/* ───────── TRANSPORTE ───────── */
tra:{
 intro:'Ustedes dirigen Cocha Express, transporte de pasajeros y encomiendas desde la Terminal de Cochabamba. Cada día salen buses a La Paz, Oruro y Santa Cruz. Su reto: llegar siempre, aunque el camino se complique.',
 crises:[
  {ic:'🚧',title:'Bloqueo de 72 horas al occidente',news:'Último momento: los transportistas anuncian un bloqueo de setenta y dos horas en la carretera al occidente. Cientos de pasajeros quedan varados.',
   desc:'Bloquean la carretera Cochabamba–Oruro por 3 días. Tienes 6 buses vendidos y 200 pasajeros esperando en la terminal.',loc:'📍 Carretera al occidente',opts:[
   {lbl:'Devolver pasajes y suspender salidas',sub:'Pierdes ingresos, pero cuidas la confianza.',fx:{rent:-8,eq:2,cli:6,cre:-2,sos:6},q:2,
    cond:{need:{cap:'res',min:10000},ok:{rent:5},ko:{rent:-4,sos:-4},okMsg:'La reserva cubrió las devoluciones sin ahogar la caja.',koMsg:'Sin reserva, devolver el dinero los dejó sin liquidez.'}},
   {lbl:'Ruta alterna por caminos secundarios',sub:'Más largo y riesgoso, pero cumples.',fx:{rent:-4,eq:-4,cli:8,cre:2,sos:-4},q:1,
    cond:{need:{hire:'p_mec'},ok:{sos:6,eq:2},ko:{sos:-4},okMsg:'Su mecánico mantuvo los buses en buen estado en la ruta difícil.',koMsg:'Sin mecánico, un bus se quedó en el camino.'}},
   {lbl:'Vender pasajes “para cuando se levante”',sub:'Cobras hoy sin saber cuándo saldrás.',fx:{rent:6,eq:-2,cli:-10,cre:0,sos:-6},q:0}]},
  {ic:'⛽',title:'Filas de diésel en los surtidores',news:'Último momento: largas filas de camiones y buses en los surtidores por escasez de diésel en el país.',
   desc:'Hay escasez de diésel: tus choferes esperan hasta 10 horas en fila. Puedes perder salidas y clientes.',loc:'📍 Surtidores de Cochabamba',opts:[
   {lbl:'Reducir frecuencias y priorizar rutas rentables',sub:'Menos salidas, pero llenas.',fx:{rent:4,eq:0,cli:-4,cre:-2,sos:6},q:2},
   {lbl:'Comprar diésel en el mercado informal',sub:'Más caro y sin factura.',fx:{rent:-8,eq:0,cli:4,cre:0,sos:-8},q:0},
   {lbl:'Turnos de choferes para hacer fila de noche',sub:'Mantienes salidas, pero el equipo se agota.',fx:{rent:-2,eq:-6,cli:6,cre:0,sos:0},q:1,
    cond:{need:{dept:'prod',min:2},ok:{eq:4},ko:{eq:-4},okMsg:'Tenían suficientes choferes para rotar turnos.',koMsg:'Con pocos choferes, el cansancio pasó factura.'}}]}
 ],
 negs:[
  {tipo:'cliente',ic:'⛏️',who:'Ing. Rocha',role:'Empresa minera · Oruro',badge:'Cliente',title:'Contrato para transportar personal',
   msgs:['Buen día. Buscamos transporte diario para <b>80 trabajadores</b> a la mina 🚌','Contrato de 1 año.','Pero necesitamos una tarifa <b>30 % más baja</b> que la del pasaje normal.'],
   loc:'Reunión en Oruro',opts:[
   {lbl:'Aceptar el 30 % por el volumen',sub:'Ingreso seguro, pero con margen mínimo.',fx:{rent:-4,eq:0,cli:6,cre:4,sos:2},q:1,r:'Perfecto, firmamos el lunes ✍️'},
   {lbl:'15 % menos con reajuste por precio del diésel',sub:'Te proteges si el combustible sube.',fx:{rent:4,eq:2,cli:6,cre:4,sos:6},q:2,r:'Es justo. Con esa cláusula todos estamos tranquilos 🤝'},
   {lbl:'Rechazar: no bajamos tarifas',sub:'Mantienes margen y buses libres.',fx:{rent:2,eq:0,cli:-4,cre:-4,sos:0},q:0,r:'Bueno, buscaremos otra empresa.'}]},
  {tipo:'proveedor',ic:'🛞',who:'Importadora de llantas',role:'Tu proveedor de neumáticos',badge:'Proveedor',title:'Llantas 20 % más caras por el dólar',
   msgs:['Estimado cliente 🛞','Por el tipo de cambio, las llantas suben <b>20 %</b> desde el lunes.','Si compra ahora, le respetamos el precio anterior… pero solo pago al contado.'],
   loc:'Proveedor de neumáticos',opts:[
   {lbl:'Comprar llantas para todo el año ahora',sub:'Ahorras, pero inmovilizas mucho dinero.',fx:{rent:4,eq:0,cli:0,cre:0,sos:2},q:1,
    cond:{need:{cap:'res',min:15000},ok:{sos:4},ko:{sos:-8,rent:-4},okMsg:'Tenían reserva para comprar sin ahogarse.',koMsg:'Sin reserva, esa compra dejó la caja en cero.'}},
   {lbl:'Comprar lo de 3 meses y negociar crédito',sub:'Equilibras ahorro y liquidez.',fx:{rent:2,eq:0,cli:0,cre:0,sos:6},q:2,r:'Le damos 30 días para el resto. ¡Hecho!'},
   {lbl:'Usar llantas reencauchadas',sub:'Más barato, pero más riesgo en ruta.',fx:{rent:6,eq:-2,cli:-4,cre:0,sos:-8},q:0}]},
  {tipo:'aliado',ic:'📲',who:'App de pasajes',role:'Venta de boletos en línea',badge:'Aliado',title:'Vender pasajes por app con 10 % de comisión',
   msgs:['¡Hola! Vendemos pasajes en línea en todo el país 📲','El 40 % de los viajeros jóvenes ya compra por app.','Cobramos <b>10 % por boleto</b> vendido.'],
   loc:'Plataforma digital',opts:[
   {lbl:'Sumarse a la app',sub:'Nuevos clientes, menos margen por boleto.',fx:{rent:-2,eq:0,cli:8,cre:8,sos:2},q:2,r:'¡Listo! Sus rutas ya aparecen en la app 🚌'},
   {lbl:'Pedir 6 % por ser empresa nueva',sub:'Puede aceptar… o no.',fx:{rent:2,eq:0,cli:6,cre:6,sos:2},q:2,r:'Les damos 8 % los primeros 6 meses. ¿Trato?'},
   {lbl:'Seguir solo con boletería',sub:'Sin comisión, pero sin clientes digitales.',fx:{rent:2,eq:0,cli:-4,cre:-6,sos:0},q:0,r:'Ok, la oferta queda abierta 👋'}]}
 ],
 opps:[
  {ic:'🎭',title:'Carnaval de Oruro',news:'Atención: Oruro espera a medio millón de visitantes para el Carnaval. Las empresas de transporte compiten por los pasajeros.',
   desc:'Una agencia de turismo quiere 10 buses para llevar turistas al Carnaval de Oruro. Pagan bien, pero exigen puntualidad total.',loc:'📍 Oruro · Febrero',opts:[
   {lbl:'Aceptar los 10 buses',sub:'Gran ingreso, pero dejas tus rutas regulares.',fx:{rent:10,eq:-4,cli:-2,cre:10,sos:-4},q:1},
   {lbl:'Aceptar 5 buses y mantener rutas',sub:'Creces sin abandonar a tus clientes.',fx:{rent:6,eq:0,cli:4,cre:6,sos:4},q:2},
   {lbl:'No participar',sub:'Cero riesgo, cero crecimiento.',fx:{rent:0,eq:2,cli:0,cre:-6,sos:2},q:0}]},
  {ic:'📦',title:'Boom de encomiendas por internet',news:'Atención: las compras por internet crecen y las encomiendas entre ciudades se duplican en Bolivia.',
   desc:'Las tiendas online necesitan enviar paquetes entre ciudades. Podrías crear un servicio de encomiendas exprés.',loc:'📍 Comercio electrónico',opts:[
   {lbl:'Lanzar encomiendas exprés con rastreo',sub:'Requiere sistema y personal.',fx:{rent:4,eq:0,cli:8,cre:12,sos:2},q:2,
    cond:{need:{dept:'aten',min:1},ok:{cli:4},ko:{cli:-6},okMsg:'Su equipo de atención gestionó los envíos y reclamos.',koMsg:'Sin atención al cliente, se perdieron paquetes y reclamos.'}},
   {lbl:'Llevar encomiendas en los buses actuales',sub:'Barato, pero sin diferenciación.',fx:{rent:4,eq:0,cli:2,cre:4,sos:2},q:1},
   {lbl:'Ignorar la tendencia',sub:'Te quedas solo con pasajeros.',fx:{rent:0,eq:0,cli:-2,cre:-6,sos:0},q:0}]}
 ]},

/* ───────── TIENDA DE ABARROTES ───────── */
can:{
 intro:'Ustedes dirigen la Tienda Doña Rosario, un puesto de abarrotes en La Cancha, el mercado más grande de Bolivia. Venden mucho, pero ganan centavos por producto. Su reto: que la caja crezca sin perder a la clientela de siempre.',
 crises:[
  {ic:'🛢️',title:'Escasez de aceite y azúcar',news:'Último momento: falta aceite y azúcar en los mercados de Cochabamba y los precios se disparan por la especulación.',
   desc:'Hay escasez de aceite y azúcar. Tus clientes hacen fila y otros puestos están acaparando para vender más caro.',loc:'📍 La Cancha',opts:[
   {lbl:'Vender a precio justo con límite por cliente',sub:'Ganas menos, pero la gente lo recordará.',fx:{rent:-2,eq:2,cli:10,cre:2,sos:6},q:2},
   {lbl:'Subir precios como todos',sub:'Ganancia rápida, reputación en juego.',fx:{rent:8,eq:0,cli:-8,cre:0,sos:-4},q:0},
   {lbl:'Guardar stock para vender después',sub:'Apuestas a que el precio suba más.',fx:{rent:4,eq:0,cli:-6,cre:0,sos:-6},q:0}]},
  {ic:'🌧️',title:'Lluvias inundan los pasillos',news:'Último momento: fuertes lluvias inundan pasillos de La Cancha. Comerciantes reportan pérdidas de mercadería.',
   desc:'Una tormenta inunda tu pasillo. El agua entró al depósito y hay bolsas de harina y azúcar mojadas.',loc:'📍 La Cancha · Época de lluvias',opts:[
   {lbl:'Reponer con el fondo de emergencia',sub:'Vuelves a vender mañana mismo.',fx:{rent:-4,eq:2,cli:6,cre:0,sos:6},q:2,
    cond:{need:{cap:'res',min:8000},ok:{rent:4},ko:{rent:-6,sos:-6},okMsg:'La reserva permitió reponer sin endeudarse.',koMsg:'Sin reserva tuvieron que pedir un préstamo caro.'}},
   {lbl:'Pedir préstamo rápido al “prestamista”',sub:'Dinero hoy, intereses altísimos mañana.',fx:{rent:-8,eq:0,cli:4,cre:0,sos:-8},q:0},
   {lbl:'Elevar estantes y vender lo que quedó',sub:'Pierdes ventas unos días, pero aprendes.',fx:{rent:-2,eq:2,cli:-2,cre:2,sos:4},q:1,
    cond:{need:{cap:'inf',min:10000},ok:{sos:4},ko:{},okMsg:'Su inversión en infraestructura ya protegía parte del depósito.'}}]}
 ],
 negs:[
  {tipo:'cliente',ic:'🍲',who:'Doña Elsa',role:'Dueña de una pensión · cliente de 10 años',badge:'Cliente',title:'Pide fiado por 2 meses',
   msgs:['Hola mamita, ¿cómo estás? 😊','La pensión anda floja este mes…','¿Me puedes <b>fiar los abarrotes por 2 meses</b>? Siempre te he pagado.'],
   loc:'En tu puesto',opts:[
   {lbl:'Fiar todo: es clienta de años',sub:'Lealtad, pero tu caja sufre.',fx:{rent:-4,eq:0,cli:6,cre:0,sos:-6},q:0,r:'¡Gracias, mamita! Dios te lo pague 🙏'},
   {lbl:'Fiar la mitad, a 30 días y anotado',sub:'Apoyas con reglas claras.',fx:{rent:0,eq:2,cli:6,cre:0,sos:4},q:2,r:'Está bien, es justo. Firmamos en tu cuaderno 📒'},
   {lbl:'Solo al contado',sub:'Caja sana, clienta molesta.',fx:{rent:2,eq:0,cli:-6,cre:-2,sos:2},q:1,r:'Ay… bueno, iré donde la vecina entonces.'}]},
  {tipo:'proveedor',ic:'🚛',who:'Distribuidora El Mayorista',role:'Tu proveedor principal',badge:'Proveedor',title:'Descuento si pagas al contado',
   msgs:['Hola, casera 👋','Este mes tenemos oferta: <b>8 % de descuento</b> si pagas todo al contado.','A crédito el precio es normal, con 15 días de plazo.'],
   loc:'Visita del preventista',opts:[
   {lbl:'Pagar al contado y aprovechar el 8 %',sub:'Más margen, menos efectivo disponible.',fx:{rent:6,eq:0,cli:0,cre:0,sos:-2},q:1,
    cond:{need:{cap:'res',min:8000},ok:{sos:4},ko:{sos:-6},okMsg:'Tenían reserva para pagar al contado sin quedarse secos.',koMsg:'Pagar al contado los dejó sin efectivo para el día a día.'}},
   {lbl:'Pedir 5 % y 30 días de plazo',sub:'Negocias ambos beneficios.',fx:{rent:4,eq:0,cli:0,cre:2,sos:4},q:2,r:'Mmm… 5 % y 30 días. Por ser buena clienta, ¡ya!'},
   {lbl:'Seguir a crédito sin descuento',sub:'Cómodo, pero dejas plata en la mesa.',fx:{rent:-2,eq:0,cli:0,cre:0,sos:2},q:0}]},
  {tipo:'aliado',ic:'📱',who:'Banco local',role:'Pagos con QR',badge:'Aliado',title:'Cobrar con QR',
   msgs:['¡Hola! Te ofrecemos <b>cobros con QR</b> gratis el primer año 📱','Tus clientes jóvenes ya casi no usan efectivo.','Solo necesitas abrir una cuenta.'],
   loc:'Ejecutiva del banco',opts:[
   {lbl:'Activar QR y avisar a los clientes',sub:'Más ventas, menos manejo de efectivo.',fx:{rent:2,eq:2,cli:8,cre:6,sos:4},q:2,r:'¡Listo! Tu QR ya está activo ✅'},
   {lbl:'Activar QR pero sin promocionarlo',sub:'Lo tienes, pero pocos lo saben.',fx:{rent:0,eq:0,cli:2,cre:2,sos:2},q:1},
   {lbl:'Seguir solo con efectivo',sub:'“Siempre ha funcionado así”.',fx:{rent:0,eq:0,cli:-4,cre:-4,sos:-2},q:0,r:'Ok. Cuando quieras, aquí estamos.'}]}
 ],
 opps:[
  {ic:'💬',title:'Pedidos por WhatsApp con delivery',news:'Atención: cada vez más familias cochabambinas compran sus abarrotes por WhatsApp desde la casa.',
   desc:'Varias clientas te piden hacer sus compras por WhatsApp y que se las lleven a casa.',loc:'📍 Barrios cercanos',opts:[
   {lbl:'Lanzar catálogo y delivery semanal',sub:'Nuevo canal, requiere organización.',fx:{rent:4,eq:-2,cli:10,cre:10,sos:2},q:2,
    cond:{need:{dept:'aten',min:1},ok:{eq:4,cli:2},ko:{eq:-4},okMsg:'Tenían a alguien dedicado a atender pedidos.',koMsg:'Todos atendían todo: el puesto se desordenó.'}},
   {lbl:'Solo pedidos de clientas frecuentes',sub:'Prueba pequeña, sin riesgo.',fx:{rent:2,eq:0,cli:4,cre:4,sos:2},q:1},
   {lbl:'No, la gente debe venir al puesto',sub:'Te quedas igual.',fx:{rent:0,eq:0,cli:-4,cre:-6,sos:0},q:0}]},
  {ic:'🏛️',title:'Programa municipal de mercados',news:'Atención: la Alcaldía lanza un programa de capacitación y créditos para comerciantes de mercados.',
   desc:'La Alcaldía ofrece capacitación en gestión y un crédito con tasa baja para modernizar puestos.',loc:'📍 Alcaldía de Cochabamba',opts:[
   {lbl:'Capacitarse y tomar el crédito para refrigeración',sub:'Puedes vender lácteos y embutidos.',fx:{rent:6,eq:4,cli:6,cre:8,sos:0},q:2},
   {lbl:'Solo la capacitación',sub:'Aprendes sin endeudarte.',fx:{rent:2,eq:4,cli:2,cre:2,sos:4},q:1},
   {lbl:'No tenemos tiempo para eso',sub:'El puesto sigue igual.',fx:{rent:0,eq:-2,cli:0,cre:-6,sos:0},q:0}]}
 ]},

/* ───────── ARTESANÍAS ───────── */
art:{
 intro:'Ustedes dirigen Llajta Manos, un taller de cerámica y textiles de Quillacollo que ya exporta a Europa. Cada pieza es única, pero producirlas toma tiempo. Su reto: crecer en el mundo sin perder la identidad.',
 crises:[
  {ic:'🛃',title:'Contenedor retenido en Arica',news:'Último momento: paro en el puerto de Arica retiene contenedores bolivianos. Exportadores temen perder pedidos.',
   desc:'Tu pedido de 800 piezas para Alemania está retenido en el puerto de Arica. El cliente amenaza con cancelar si llega tarde.',loc:'📍 Puerto de Arica, Chile',opts:[
   {lbl:'Avisar al cliente y ofrecer descuento por demora',sub:'Transparencia antes que excusas.',fx:{rent:-4,eq:2,cli:6,cre:2,sos:6},q:2},
   {lbl:'Reenviar una parte por avión',sub:'Muy caro, pero cumples a tiempo.',fx:{rent:-10,eq:0,cli:8,cre:4,sos:-2},q:1,
    cond:{need:{cap:'res',min:12000},ok:{rent:4,sos:4},ko:{sos:-6},okMsg:'La reserva cubrió el flete aéreo.',koMsg:'Pagar el avión sin reserva los dejó en rojo.'}},
   {lbl:'Esperar sin decir nada',sub:'Quizá el puerto se abra pronto…',fx:{rent:0,eq:0,cli:-10,cre:-4,sos:-4},q:0}]},
  {ic:'🧑‍🎨',title:'Copian tus diseños',news:'Último momento: copias industriales de artesanía boliviana aparecen en tiendas en línea a mitad de precio.',
   desc:'Encuentras copias industriales de tus diseños en una tienda online a mitad de precio.',loc:'📍 Internet',opts:[
   {lbl:'Registrar la marca y contar la historia del artesano',sub:'Diferencias lo auténtico.',fx:{rent:-2,eq:4,cli:8,cre:6,sos:6},q:2,
    cond:{need:{dept:'ven',min:1},ok:{cli:4},ko:{cli:-4},okMsg:'Su equipo de marketing comunicó la historia de cada pieza.',koMsg:'Nadie contó la historia: la gente no vio la diferencia.'}},
   {lbl:'Bajar precios para competir',sub:'Compites con máquinas… con las manos.',fx:{rent:-10,eq:-4,cli:4,cre:0,sos:-6},q:0},
   {lbl:'Ignorar: “lo original se nota”',sub:'No haces nada.',fx:{rent:0,eq:0,cli:-4,cre:-2,sos:0},q:1}]}
 ],
 negs:[
  {tipo:'cliente',ic:'🇩🇪',who:'Anna · Fair Trade Shop',role:'Tienda de comercio justo · Berlín',badge:'Cliente',title:'500 piezas en 6 semanas',
   msgs:['Hallo! 👋 Amamos sus cerámicas.','Queremos <b>500 piezas en 6 semanas</b> para Navidad.','Nuestro precio máximo es <b>20 % menor</b> al de su lista.'],
   loc:'Videollamada',opts:[
   {lbl:'Aceptar precio y plazo',sub:'Gran pedido, pero tu taller no da abasto.',fx:{rent:-4,eq:-6,cli:6,cre:6,sos:-4},q:0,r:'Wunderbar! Esperamos las 500 piezas 📦'},
   {lbl:'300 piezas a precio de lista, 200 en marzo',sub:'Cumples lo que realmente puedes producir.',fx:{rent:6,eq:2,cli:6,cre:4,sos:6},q:2,r:'Mmm… está bien, la calidad es primero. Deal! 🤝'},
   {lbl:'Rechazar: no bajamos precios',sub:'Proteges margen, pierdes el canal.',fx:{rent:2,eq:0,cli:-6,cre:-4,sos:0},q:1,r:'Qué pena. Quizá el próximo año.'}]},
  {tipo:'proveedor',ic:'🦙',who:'Cooperativa alpaquera',role:'Proveedor de fibra de alpaca',badge:'Proveedor',title:'La fibra de alpaca sube 15 %',
   msgs:['Hola, socios 🦙','La sequía redujo la producción: la fibra sube <b>15 %</b>.','Podemos mantener el precio si nos compran por adelantado todo el semestre.'],
   loc:'Cooperativa del altiplano',opts:[
   {lbl:'Comprar el semestre por adelantado',sub:'Precio fijo, dinero inmovilizado.',fx:{rent:4,eq:0,cli:0,cre:2,sos:2},q:1,
    cond:{need:{cap:'res',min:10000},ok:{sos:4},ko:{sos:-6},okMsg:'La reserva hizo posible el pago adelantado.',koMsg:'El adelanto vació la caja.'}},
   {lbl:'Acuerdo de largo plazo y pago en 2 cuotas',sub:'Apoyas a los productores y cuidas tu caja.',fx:{rent:2,eq:2,cli:2,cre:2,sos:6},q:2,r:'Así trabajamos todos tranquilos. ¡Hecho! 🤝'},
   {lbl:'Cambiar a fibra sintética',sub:'Más barata, menos auténtica.',fx:{rent:6,eq:-2,cli:-8,cre:-2,sos:-4},q:0}]},
  {tipo:'aliado',ic:'🌐',who:'Marketplace internacional',role:'Tienda en línea para artesanos',badge:'Aliado',title:'Vender en línea con 15 % de comisión',
   msgs:['Hi! Somos un marketplace de artesanía del mundo 🌐','Llegarías a compradores de 30 países.','Comisión: <b>15 %</b> + tú gestionas los envíos.'],
   loc:'Correo electrónico',opts:[
   {lbl:'Abrir tienda con fotos profesionales',sub:'Inversión en imagen para vender afuera.',fx:{rent:-2,eq:0,cli:8,cre:10,sos:2},q:2,
    cond:{need:{hire:'p_dis'},ok:{cli:4,cre:2},ko:{cli:-4},okMsg:'Su diseñadora hizo fotos y textos de nivel internacional.',koMsg:'Fotos con celular y descripciones pobres: pocas ventas.'}},
   {lbl:'Abrir tienda básica',sub:'Presencia mínima.',fx:{rent:0,eq:0,cli:2,cre:4,sos:0},q:1},
   {lbl:'No vender en línea',sub:'Solo clientes directos.',fx:{rent:0,eq:0,cli:-2,cre:-6,sos:0},q:0}]}
 ],
 opps:[
  {ic:'🌎',title:'Feria internacional de artesanía',news:'Atención: Bolivia es invitada de honor en una feria internacional de artesanía en Europa.',
   desc:'Te invitan a una feria internacional. El stand cuesta caro, pero llegan compradores de todo el mundo.',loc:'📍 Feria en Europa',opts:[
   {lbl:'Ir con stand y catálogo',sub:'Alta inversión, contactos de alto valor.',fx:{rent:-6,eq:0,cli:10,cre:14,sos:-2},q:2},
   {lbl:'Compartir stand con otros artesanos',sub:'Menos costo, menos protagonismo.',fx:{rent:-2,eq:2,cli:6,cre:8,sos:2},q:2},
   {lbl:'No ir',sub:'Te quedas en el mercado conocido.',fx:{rent:2,eq:0,cli:-2,cre:-8,sos:2},q:0}]},
  {ic:'🧳',title:'Talleres vivenciales para turistas',news:'Atención: el turismo vivencial crece en el valle de Cochabamba. Los visitantes quieren aprender de los artesanos.',
   desc:'Agencias de turismo quieren que los visitantes hagan su propia pieza de cerámica en tu taller.',loc:'📍 Quillacollo',opts:[
   {lbl:'Crear talleres de 2 horas con reserva',sub:'Nuevo ingreso y vitrina para tus piezas.',fx:{rent:6,eq:2,cli:8,cre:8,sos:4},q:2,
    cond:{need:{dept:'aten',min:1},ok:{cli:4},ko:{eq:-4},okMsg:'Tenían a alguien para recibir y guiar a los turistas.',koMsg:'Los artesanos dejaron de producir para atender turistas.'}},
   {lbl:'Solo visitas para ver el taller',sub:'Simple, bajo ingreso.',fx:{rent:2,eq:0,cli:4,cre:2,sos:2},q:1},
   {lbl:'No abrir el taller al público',sub:'Concentración total en producir.',fx:{rent:0,eq:2,cli:-2,cre:-4,sos:0},q:0}]}
 ]},

/* ───────── STARTUP ───────── */
tec:{
 intro:'Ustedes dirigen KobolDev, una startup de la incubadora de UNIFRANZ que crea software para negocios de Cochabamba. Tienen talento y muchas ideas, pero cada mes la plata se va en sueldos y servidores. Su reto: crecer rápido sin quedarse sin caja.',
 crises:[
  {ic:'🦠',title:'Ataque de ransomware',news:'Último momento: un ataque informático secuestra los datos de varias empresas bolivianas y pide rescate en criptomonedas.',
   desc:'Un ransomware cifró tu servidor. 40 clientes no pueden usar el sistema y los atacantes piden 5.000 dólares en cripto.',loc:'📍 Tus servidores',opts:[
   {lbl:'No pagar: restaurar desde respaldos',sub:'Lento, pero no financias delincuentes.',fx:{rent:-4,eq:2,cli:-2,cre:0,sos:8},q:2,
    cond:{need:{cap:'inf',min:15000},ok:{cli:6,rent:4},ko:{cli:-8,sos:-4},okMsg:'Su inversión en infraestructura incluía respaldos: volvieron en horas.',koMsg:'Sin buena infraestructura, los respaldos estaban incompletos.'}},
   {lbl:'Pagar el rescate',sub:'Rápido… si cumplen.',fx:{rent:-10,eq:-2,cli:4,cre:0,sos:-8},q:0},
   {lbl:'Avisar a todos los clientes y trabajar 24/7',sub:'Transparencia total.',fx:{rent:-2,eq:-4,cli:6,cre:2,sos:4},q:2,
    cond:{need:{dept:'inn',min:2},ok:{eq:4,cli:2},ko:{eq:-6},okMsg:'Tenían suficientes técnicos para turnos.',koMsg:'Con un solo técnico, el equipo colapsó.'}}]},
  {ic:'✈️',title:'Tu mejor programadora recibe oferta del exterior',news:'Último momento: empresas extranjeras contratan programadores bolivianos de forma remota pagando en dólares.',
   desc:'Tu programadora estrella recibe una oferta remota de una empresa de EE. UU. que paga el triple. Lleva el 60 % del código.',loc:'📍 Tu oficina',opts:[
   {lbl:'Contraoferta: participación en acciones',sub:'Compartes futuro en lugar de sueldo.',fx:{rent:0,eq:8,cli:2,cre:4,sos:6},q:2},
   {lbl:'Subirle el sueldo al doble',sub:'La retienes, pero tu planilla se dispara.',fx:{rent:-8,eq:4,cli:2,cre:0,sos:-4},q:1},
   {lbl:'Dejarla ir y contratar a alguien nuevo',sub:'El conocimiento se va con ella.',fx:{rent:2,eq:-6,cli:-6,cre:-6,sos:-4},q:0,
    cond:{need:{dept:'inn',min:2},ok:{cli:4,cre:4},ko:{},okMsg:'Otro técnico del equipo pudo continuar el trabajo.'}}]}
 ],
 negs:[
  {tipo:'cliente',ic:'💊',who:'Gerente de FarmaRed',role:'Cadena de 25 farmacias',badge:'Cliente',title:'Sistema a medida “con unos extras”',
   msgs:['Hola, equipo 👋 Queremos su sistema de inventarios.','Pero necesitamos <b>facturación, app móvil y reportes</b> extra.','Todo por el precio del plan básico. Si les va bien, los recomendamos 😉'],
   loc:'Reunión comercial',opts:[
   {lbl:'Aceptar todo para ganar el cliente',sub:'Gran logo… trabajo gratis.',fx:{rent:-8,eq:-6,cli:6,cre:4,sos:-4},q:0,r:'¡Excelente! Y ya que están, ¿pueden agregar un chat? 😅'},
   {lbl:'Plan básico ahora y extras por módulos',sub:'Defines alcance y precio de cada extra.',fx:{rent:6,eq:2,cli:6,cre:6,sos:6},q:2,r:'Tiene sentido. Empecemos con el básico y la facturación 📝'},
   {lbl:'Solo el plan básico, sin cambios',sub:'Claro, pero rígido.',fx:{rent:2,eq:0,cli:-4,cre:-2,sos:2},q:1,r:'Mmm… lo pensaremos.'}]},
  {tipo:'proveedor',ic:'☁️',who:'Proveedor de nube',role:'Servidores · cobro en dólares',badge:'Proveedor',title:'La nube cuesta más por el dólar',
   msgs:['Hola 👋 Su plan de servidores se renueva.','Como cobramos en dólares, con el tipo de cambio su costo sube <b>35 %</b> en bolivianos.','Podemos ofrecer 20 % de descuento con contrato anual pagado por adelantado.'],
   loc:'Correo del proveedor',opts:[
   {lbl:'Pagar el año por adelantado',sub:'Ahorras, pero sale mucha caja ahora.',fx:{rent:4,eq:0,cli:0,cre:0,sos:2},q:1,
    cond:{need:{cap:'res',min:12000},ok:{sos:4},ko:{sos:-8},okMsg:'La reserva permitió aprovechar el descuento.',koMsg:'El pago anual dejó a la startup sin caja.'}},
   {lbl:'Optimizar servidores y pagar mensual',sub:'Reduces consumo con trabajo técnico.',fx:{rent:4,eq:0,cli:0,cre:2,sos:6},q:2,
    cond:{need:{hire:'p_dev'},ok:{rent:4},ko:{rent:-4},okMsg:'Su programadora optimizó el consumo un 30 %.',koMsg:'Sin programador, la optimización no salió.'}},
   {lbl:'Pasar a un proveedor más barato y desconocido',sub:'Riesgo de caídas.',fx:{rent:6,eq:0,cli:-6,cre:0,sos:-6},q:0}]},
  {tipo:'aliado',ic:'💰',who:'Inversionista ángel',role:'Empresario cochabambino',badge:'Inversionista',title:'Bs 150.000 por el 30 %',
   msgs:['Hola, chicos. Me gusta lo que hacen 💼','Les ofrezco <b>Bs 150.000 por el 30 %</b> de la empresa.','Y quiero un puesto en las decisiones importantes.'],
   loc:'Café en la Av. América',opts:[
   {lbl:'Aceptar tal cual',sub:'Dinero rápido, pierdes control.',fx:{rent:6,eq:-2,cli:2,cre:10,sos:-2},q:1,r:'¡Bienvenidos a la gran liga! Mañana firmamos 🖊️'},
   {lbl:'Contraoferta: 20 % y que sea mentor',sub:'Valoras tu empresa y ganas experiencia.',fx:{rent:6,eq:4,cli:2,cre:10,sos:6},q:2,r:'Me gusta su seguridad. 20 % y les ayudo con contactos 🤝'},
   {lbl:'Rechazar: crecer con clientes',sub:'Más lento, 100 % tuyo.',fx:{rent:0,eq:2,cli:0,cre:-4,sos:2},q:1,r:'Respeto eso. La oferta sigue en pie.'}]}
 ],
 opps:[
  {ic:'🏆',title:'Concurso internacional de startups',news:'Atención: una aceleradora internacional busca startups latinoamericanas. El premio: inversión y mentoría en Silicon Valley.',
   desc:'Una aceleradora internacional abre convocatoria. Requiere pitch en inglés y prototipo funcionando en 3 semanas.',loc:'📍 Convocatoria en línea',opts:[
   {lbl:'Postular con todo el equipo',sub:'Puedes ganar mucho; descuidas clientes 3 semanas.',fx:{rent:-4,eq:2,cli:-4,cre:14,sos:0},q:1},
   {lbl:'Postular con un equipo pequeño',sub:'Equilibras concurso y clientes.',fx:{rent:-2,eq:2,cli:2,cre:10,sos:2},q:2,
    cond:{need:{dept:'inn',min:2},ok:{cre:4},ko:{cre:-4},okMsg:'Tenían talento técnico de sobra para ambas cosas.',koMsg:'El prototipo quedó a medias.'}},
   {lbl:'No postular',sub:'Foco en lo actual.',fx:{rent:2,eq:0,cli:2,cre:-6,sos:2},q:0}]},
  {ic:'🏛️',title:'Licitación: app de trámites municipales',news:'Atención: la Alcaldía de Cochabamba licita una aplicación para digitalizar trámites ciudadanos.',
   desc:'La Alcaldía licita una app de trámites. Es un contrato grande, pero exige garantías, papeles y pagos a 90 días.',loc:'📍 Alcaldía de Cochabamba',opts:[
   {lbl:'Postular sola',sub:'Todo el contrato, todo el riesgo.',fx:{rent:4,eq:-4,cli:6,cre:10,sos:-6},q:1},
   {lbl:'Postular en consorcio con otra empresa',sub:'Compartes el contrato y el riesgo.',fx:{rent:4,eq:2,cli:6,cre:8,sos:4},q:2},
   {lbl:'No postular a contratos públicos',sub:'Evitas burocracia.',fx:{rent:0,eq:0,cli:0,cre:-4,sos:2},q:1}]}
 ]},

/* ───────── IMPORTADORA ───────── */
imp:{
 intro:'Ustedes dirigen Andes Global, una importadora de maquinaria en la Zona Franca. Venden equipos a constructoras y fábricas, pero compran en dólares y cobran en bolivianos. Su reto: sobrevivir al tipo de cambio y crecer con contratos grandes.',
 crises:[
  {ic:'💵',title:'Escasez de dólares',news:'Último momento: los bancos limitan la venta de dólares y el tipo de cambio paralelo se dispara. Los importadores no pueden pagar a sus proveedores.',
   desc:'Los bancos no te venden dólares y en el mercado paralelo cuestan mucho más. Tienes que pagar un contenedor esta semana.',loc:'📍 Sistema financiero',opts:[
   {lbl:'Comprar dólares caros y subir precios',sub:'Pagas, pero tus máquinas quedan caras.',fx:{rent:-4,eq:0,cli:-6,cre:-2,sos:2},q:1},
   {lbl:'Negociar pago en partes y en otra moneda',sub:'Pides plazo y pago en reales o yuanes.',fx:{rent:2,eq:2,cli:2,cre:2,sos:8},q:2,
    cond:{need:{hire:'p_com'},ok:{sos:4,rent:2},ko:{sos:-4},okMsg:'Su especialista en comercio exterior conocía las alternativas.',koMsg:'Nadie sabía de pagos internacionales: el trámite se trabó.'}},
   {lbl:'Suspender importaciones',sub:'Sin stock, sin ventas.',fx:{rent:-6,eq:-2,cli:-8,cre:-6,sos:4},q:0}]},
  {ic:'⚓',title:'Paro en el puerto de Arica',news:'Último momento: paro portuario en Arica. Contenedores con destino a Bolivia acumulan semanas de retraso.',
   desc:'Tus 3 contenedores llevan 3 semanas detenidos. Las constructoras esperan sus equipos y corren multas por almacenaje.',loc:'📍 Puerto de Arica',opts:[
   {lbl:'Desviar los siguientes pedidos por Ilo (Perú)',sub:'Ruta alterna, más trámites.',fx:{rent:-4,eq:0,cli:4,cre:4,sos:6},q:2},
   {lbl:'Ofrecer equipos de alquiler mientras llegan',sub:'Cuidas al cliente, aunque cuesta.',fx:{rent:-6,eq:2,cli:8,cre:2,sos:2},q:2,
    cond:{need:{cap:'res',min:12000},ok:{rent:4},ko:{rent:-4,sos:-4},okMsg:'La reserva financió el alquiler temporal.',koMsg:'El alquiler se pagó con deuda.'}},
   {lbl:'Esperar y culpar al puerto',sub:'No depende de ti… ¿o sí?',fx:{rent:-2,eq:0,cli:-8,cre:-2,sos:-4},q:0}]}
 ],
 negs:[
  {tipo:'cliente',ic:'🏗️',who:'Constructora Tunari',role:'Cliente principal',badge:'Cliente',title:'Excavadora a crédito de 90 días',
   msgs:['Buen día 👷 Necesitamos <b>2 excavadoras</b> para una obra de la Gobernación.','La Gobernación nos paga a 90 días…','Así que pedimos pagarles también a <b>90 días</b>.'],
   loc:'Oficina de la constructora',opts:[
   {lbl:'Aceptar 90 días sin garantía',sub:'Venta grande, riesgo grande.',fx:{rent:4,eq:0,cli:6,cre:4,sos:-10},q:0,r:'¡Perfecto! Les pagamos apenas nos paguen 🙏'},
   {lbl:'30 % de adelanto, saldo a 60 días con garantía',sub:'Vendes cuidando la caja.',fx:{rent:6,eq:0,cli:6,cre:4,sos:6},q:2,r:'Es razonable. Les firmamos la letra de cambio ✍️'},
   {lbl:'Solo al contado',sub:'Cero riesgo, probable pérdida del cliente.',fx:{rent:2,eq:0,cli:-8,cre:-4,sos:2},q:1,r:'Así no podemos. Veremos con otra importadora.'}]},
  {tipo:'proveedor',ic:'🏭',who:'Fábrica en China',role:'Fabricante de maquinaria',badge:'Proveedor',title:'Exigen 100 % por adelantado',
   msgs:['Hello friend! 🤝','Por el riesgo en Bolivia, ahora pedimos <b>100 % de pago adelantado</b>.','Antes era 30 % adelanto y 70 % al embarcar.'],
   loc:'Correo del fabricante',opts:[
   {lbl:'Aceptar el 100 % adelantado',sub:'Mantienes el proveedor, inmovilizas caja.',fx:{rent:0,eq:0,cli:2,cre:0,sos:-8},q:0},
   {lbl:'Carta de crédito bancaria',sub:'El banco garantiza a ambos; tiene costo.',fx:{rent:-2,eq:0,cli:2,cre:2,sos:8},q:2,
    cond:{need:{hire:'p_cont'},ok:{rent:2},ko:{rent:-2},okMsg:'Su contador armó la carta de crédito sin errores.',koMsg:'El trámite bancario tardó por falta de un contador.'}},
   {lbl:'Buscar fábrica en Brasil',sub:'Más cerca, más caro.',fx:{rent:-4,eq:0,cli:2,cre:4,sos:4},q:1}]},
  {tipo:'aliado',ic:'📑',who:'Agencia despachante',role:'Trámites de aduana',badge:'Aliado',title:'“Trámite rápido” de dudosa legalidad',
   msgs:['Hola, jefe 😉','Le saco los contenedores en <b>2 días</b> en vez de 3 semanas.','Solo hay que “agilizar” con un pago extra a un funcionario…'],
   loc:'Llamada telefónica',opts:[
   {lbl:'Pagar el “extra”',sub:'Rápido… e ilegal.',fx:{rent:-2,eq:-6,cli:4,cre:0,sos:-14},q:0,r:'Así me gusta, jefe 😏'},
   {lbl:'Rechazar y cambiar de agencia',sub:'Ética primero; buscas una agencia formal.',fx:{rent:-2,eq:6,cli:0,cre:2,sos:8},q:2,r:'Usted se lo pierde…'},
   {lbl:'Rechazar pero seguir con la agencia',sub:'No pagas, pero sigues con alguien dudoso.',fx:{rent:0,eq:0,cli:0,cre:0,sos:-2},q:1}]}
 ],
 opps:[
  {ic:'🏛️',title:'Licitación de maquinaria municipal',news:'Atención: el Gobierno Municipal licita maquinaria pesada por más de dos millones de bolivianos.',
   desc:'El municipio licita 5 retroexcavadoras. Necesitas garantía bancaria y papeles en regla.',loc:'📍 Gobierno Municipal',opts:[
   {lbl:'Postular con oferta competitiva',sub:'Gran contrato, pagos lentos.',fx:{rent:6,eq:0,cli:8,cre:12,sos:-4},q:1},
   {lbl:'Postular con garantía y plan de mantenimiento',sub:'Ofreces más valor, no solo precio.',fx:{rent:6,eq:2,cli:8,cre:10,sos:4},q:2,
    cond:{need:{hire:'p_mec'},ok:{cli:4},ko:{cli:-2},okMsg:'Su mecánico hizo creíble el plan de mantenimiento.'}},
   {lbl:'No postular',sub:'Evitas la burocracia.',fx:{rent:0,eq:0,cli:0,cre:-6,sos:2},q:0}]},
  {ic:'🇧🇷',title:'Representación exclusiva de marca brasileña',news:'Atención: fabricantes brasileños buscan representantes exclusivos en Bolivia.',
   desc:'Una marca brasileña de equipos agrícolas te ofrece ser su representante exclusivo en Bolivia, con meta de ventas anual.',loc:'📍 São Paulo · videollamada',opts:[
   {lbl:'Aceptar con la meta completa',sub:'Exclusividad total, presión total.',fx:{rent:4,eq:-2,cli:6,cre:12,sos:-4},q:1},
   {lbl:'Aceptar con meta escalonada',sub:'Creces a un ritmo realista.',fx:{rent:4,eq:2,cli:6,cre:10,sos:4},q:2},
   {lbl:'Rechazar',sub:'Sigues solo con China.',fx:{rent:0,eq:0,cli:0,cre:-6,sos:0},q:0}]}
 ]},

/* ───────── COOPERATIVA ───────── */
fin:{
 intro:'Ustedes dirigen la Cooperativa Señor de Mayo, en Punata. Guardan los ahorros y prestan dinero a familias y productores del Valle Alto. Su mayor activo no es el dinero: es la confianza. Su reto: cuidarla.',
 crises:[
  {ic:'📢',title:'Rumor de quiebra en redes',news:'Último momento: un audio viral en redes asegura que una cooperativa del Valle Alto estaría en quiebra. Ahorristas hacen fila.',
   desc:'Un audio falso dice que la cooperativa quebró. Hay 200 socios en fila para retirar sus ahorros.',loc:'📍 Punata · Redes sociales',opts:[
   {lbl:'Pagar a todos y dar un comunicado con datos',sub:'Transparencia y liquidez.',fx:{rent:-4,eq:2,cli:8,cre:0,sos:8},q:2,
    cond:{need:{cap:'res',min:15000},ok:{cli:4,sos:4},ko:{sos:-10,cli:-6},okMsg:'La reserva de liquidez pagó a todos: el rumor murió.',koMsg:'No alcanzó la liquidez: el pánico creció.'}},
   {lbl:'Limitar retiros por una semana',sub:'Proteges la caja… y confirmas el miedo.',fx:{rent:2,eq:-2,cli:-12,cre:-4,sos:-6},q:0},
   {lbl:'Reunión con socios y autoridades en la plaza',sub:'Da la cara, explica con números.',fx:{rent:0,eq:4,cli:6,cre:2,sos:4},q:2,
    cond:{need:{dept:'aten',min:1},ok:{cli:4},ko:{},okMsg:'Su equipo de atención acompañó a cada socio.'}}]},
  {ic:'🌵',title:'Sequía en el Valle Alto',news:'Último momento: la sequía golpea al Valle Alto. Agricultores pierden cosechas y temen no poder pagar sus créditos.',
   desc:'La sequía arruinó cosechas. El 20 % de los créditos agrícolas está en mora.',loc:'📍 Valle Alto',opts:[
   {lbl:'Reprogramar deudas con plazo de gracia',sub:'Ayudas al socio y cuidas la cartera.',fx:{rent:-4,eq:2,cli:8,cre:0,sos:6},q:2},
   {lbl:'Embargar garantías',sub:'Recuperas algo… y pierdes la comunidad.',fx:{rent:4,eq:-4,cli:-12,cre:-4,sos:-4},q:0},
   {lbl:'Esperar a ver qué pasa',sub:'La mora crece.',fx:{rent:-6,eq:0,cli:0,cre:-2,sos:-6},q:0}]}
 ],
 negs:[
  {tipo:'cliente',ic:'🐄',who:'Asociación de Lecheros',role:'60 familias productoras',badge:'Cliente',title:'Crédito grupal con tasa baja',
   msgs:['Buenos días, señores 🐄','Queremos un <b>crédito grupal</b> para comprar tanques de enfriamiento.','Pero necesitamos una tasa <b>más baja</b> que la normal.'],
   loc:'Sede de la asociación',opts:[
   {lbl:'Tasa baja sin garantías',sub:'Apoyo total, riesgo total.',fx:{rent:-4,eq:0,cli:8,cre:4,sos:-8},q:0,r:'¡Gracias! La comunidad no lo olvidará 🙏'},
   {lbl:'Tasa preferencial con garantía solidaria',sub:'Todos responden por todos.',fx:{rent:4,eq:2,cli:8,cre:6,sos:6},q:2,r:'Justo. Entre todos nos cuidamos 🤝'},
   {lbl:'Tasa normal',sub:'Rentable, menos social.',fx:{rent:4,eq:0,cli:-4,cre:0,sos:2},q:1,r:'Lo vamos a pensar…'}]},
  {tipo:'proveedor',ic:'🖥️',who:'Proveedor de software bancario',role:'Sistema central de la cooperativa',badge:'Proveedor',title:'La licencia sube 40 %',
   msgs:['Estimados 👋','La licencia del sistema central sube <b>40 %</b> el próximo año.','Incluye nuevas funciones de seguridad.'],
   loc:'Correo del proveedor',opts:[
   {lbl:'Aceptar el aumento',sub:'Cero riesgo técnico, más costo.',fx:{rent:-6,eq:0,cli:0,cre:0,sos:4},q:1},
   {lbl:'Negociar contrato de 3 años con 15 %',sub:'Estabilidad para ambos.',fx:{rent:2,eq:0,cli:0,cre:2,sos:6},q:2,r:'Tres años… de acuerdo, 15 % 📝'},
   {lbl:'Migrar a un sistema barato',sub:'Ahorro con riesgo de fallas.',fx:{rent:4,eq:-4,cli:-6,cre:0,sos:-8},q:0,
    cond:{need:{hire:'p_ti'},ok:{cli:6,sos:6},ko:{},okMsg:'Su técnico de TI hizo la migración sin caídas.'}}]},
  {tipo:'aliado',ic:'🏛️',who:'Alcaldía de Punata',role:'Gobierno municipal',badge:'Aliado',title:'Ser agente de pago de bonos',
   msgs:['Saludos 🏛️','Queremos que la cooperativa <b>pague los bonos municipales</b> a 3.000 beneficiarios.','No hay comisión, pero vendrá mucha gente.'],
   loc:'Reunión en la Alcaldía',opts:[
   {lbl:'Aceptar sin comisión',sub:'Mucho trabajo, nuevos socios potenciales.',fx:{rent:-2,eq:-4,cli:10,cre:6,sos:0},q:1},
   {lbl:'Aceptar con comisión mínima y horario especial',sub:'Cubres costos y ganas visibilidad.',fx:{rent:2,eq:0,cli:8,cre:6,sos:4},q:2,r:'Es razonable. ¡Firmamos el convenio!'},
   {lbl:'Rechazar',sub:'Sin filas, sin socios nuevos.',fx:{rent:0,eq:2,cli:-4,cre:-4,sos:0},q:0}]}
 ],
 opps:[
  {ic:'📱',title:'Banca móvil y pagos QR',news:'Atención: el uso de pagos con código QR se dispara en Bolivia. Las entidades financieras corren a digitalizarse.',
   desc:'Los socios jóvenes piden app y QR. Puedes desarrollar tu banca móvil.',loc:'📍 Punata',opts:[
   {lbl:'Lanzar app con capacitación a socios',sub:'Inversión fuerte, futuro digital.',fx:{rent:-4,eq:2,cli:10,cre:12,sos:2},q:2,
    cond:{need:{hire:'p_ti'},ok:{cli:4},ko:{cli:-4},okMsg:'Su técnico de TI implementó la app sin problemas.',koMsg:'Sin técnico, la app salió con errores.'}},
   {lbl:'Solo pagos QR',sub:'Paso pequeño y seguro.',fx:{rent:2,eq:0,cli:6,cre:6,sos:4},q:1},
   {lbl:'Seguir solo presencial',sub:'Los jóvenes se van al banco.',fx:{rent:0,eq:0,cli:-6,cre:-6,sos:0},q:0}]},
  {ic:'🌾',title:'Microseguro agrícola',news:'Atención: una aseguradora busca cooperativas para ofrecer microseguros contra sequía y helada.',
   desc:'Una aseguradora te propone vender microseguros contra sequía a tus socios agricultores.',loc:'📍 Valle Alto',opts:[
   {lbl:'Ofrecerlo junto a cada crédito agrícola',sub:'Proteges al socio y tu cartera.',fx:{rent:4,eq:2,cli:8,cre:6,sos:8},q:2},
   {lbl:'Ofrecerlo como opcional',sub:'Pocos lo comprarán.',fx:{rent:2,eq:0,cli:2,cre:2,sos:2},q:1},
   {lbl:'No ofrecer seguros',sub:'La próxima sequía será igual.',fx:{rent:0,eq:0,cli:-2,cre:-4,sos:-4},q:0}]}
 ]},

/* ───────── DISTRIBUIDORA ───────── */
may:{
 intro:'Ustedes dirigen El Mayorista, una distribuidora de consumo masivo en la Avenida Oquendo. Sus camiones abastecen a cientos de tiendas, mercados y restaurantes. Ganan poco por producto y mucho por volumen. Su reto: que la mercadería nunca deje de moverse.',
 crises:[
  {ic:'⛽',title:'Sin diésel para los camiones',news:'Último momento: la escasez de diésel paraliza camiones de distribución en Cochabamba. Tiendas de barrio reportan desabastecimiento.',
   desc:'Tus 8 camiones están en fila por diésel. Las tiendas esperan su pedido semanal y la competencia tampoco llega.',loc:'📍 Surtidores',opts:[
   {lbl:'Rutas optimizadas: menos viajes, camiones llenos',sub:'Planificas para usar menos combustible.',fx:{rent:4,eq:2,cli:2,cre:2,sos:8},q:2,
    cond:{need:{hire:'p_alm'},ok:{rent:4},ko:{sos:-2},okMsg:'Su encargado de logística rediseñó las rutas en un día.',koMsg:'Sin logística, la planificación fue improvisada.'}},
   {lbl:'Comprar diésel informal más caro',sub:'Sigues repartiendo, sin factura.',fx:{rent:-8,eq:0,cli:6,cre:0,sos:-8},q:0},
   {lbl:'Pedir a las tiendas que recojan en el almacén',sub:'Con descuento por recojo.',fx:{rent:-2,eq:0,cli:4,cre:2,sos:4},q:1}]},
  {ic:'📦',title:'Contrabando a precios imposibles',news:'Último momento: productos de contrabando inundan los mercados a precios más bajos que los de fábrica.',
   desc:'Aceite y fideos de contrabando se venden 25 % más baratos. Tus clientes dejan de comprarte.',loc:'📍 Mercados de Cochabamba',opts:[
   {lbl:'Competir con servicio: entrega rápida y crédito',sub:'Lo que el contrabando no da.',fx:{rent:-2,eq:2,cli:8,cre:4,sos:6},q:2},
   {lbl:'Vender también contrabando',sub:'Mismo precio… y riesgo legal.',fx:{rent:6,eq:-4,cli:4,cre:0,sos:-14},q:0},
   {lbl:'Bajar precios a pérdida',sub:'Aguantas… ¿cuánto tiempo?',fx:{rent:-12,eq:0,cli:6,cre:0,sos:-6},q:0}]}
 ],
 negs:[
  {tipo:'cliente',ic:'🏪',who:'MiniMarket Express',role:'Cadena de 12 minimarkets',badge:'Cliente',title:'Crédito de 45 días',
   msgs:['Hola 👋 Queremos que seas nuestro distribuidor exclusivo.','Son <b>12 tiendas</b>, pedido grande cada semana.','Pero pagamos a <b>45 días</b>, como la competencia.'],
   loc:'Oficina del cliente',opts:[
   {lbl:'Aceptar 45 días',sub:'Volumen enorme, caja apretada.',fx:{rent:2,eq:0,cli:8,cre:6,sos:-8},q:0,r:'¡Trato! Empezamos el lunes 🚚'},
   {lbl:'30 días con 2 % de descuento por pronto pago',sub:'Incentivas que paguen antes.',fx:{rent:4,eq:0,cli:8,cre:6,sos:4},q:2,r:'Buena idea. Pagaremos en 15 días para el descuento 😉'},
   {lbl:'Solo contado',sub:'Caja sana, cliente perdido.',fx:{rent:2,eq:0,cli:-6,cre:-4,sos:2},q:1,r:'Así no nos sirve, gracias.'}]},
  {tipo:'proveedor',ic:'🍝',who:'Fábrica de fideos',role:'Industria nacional',badge:'Proveedor',title:'Cuota mínima mensual',
   msgs:['Estimado distribuidor 🍝','Para mantener tu precio especial necesitas comprar <b>30 % más</b> cada mes.','Si no, pierdes la categoría de distribuidor A.'],
   loc:'Gerente comercial de la fábrica',opts:[
   {lbl:'Aceptar la cuota',sub:'Buen precio, almacén lleno.',fx:{rent:4,eq:0,cli:0,cre:2,sos:-6},q:0},
   {lbl:'Aceptar con cuota trimestral, no mensual',sub:'Flexibilidad sin perder categoría.',fx:{rent:4,eq:0,cli:2,cre:2,sos:4},q:2,r:'Trimestral… está bien, confiamos en ustedes.'},
   {lbl:'Rechazar y bajar de categoría',sub:'Pierdes margen.',fx:{rent:-4,eq:0,cli:0,cre:-2,sos:2},q:1}]},
  {tipo:'aliado',ic:'🚚',who:'Transportistas independientes',role:'Fleteros que te apoyan',badge:'Aliado',title:'Suben el flete 20 %',
   msgs:['Patrón, la cosa está difícil 🚚','Con el diésel y las llantas, subimos el flete <b>20 %</b>.','Si no, nos vamos con otra distribuidora.'],
   loc:'En el almacén',opts:[
   {lbl:'Aceptar el 20 %',sub:'Mantienes el servicio, pierdes margen.',fx:{rent:-6,eq:4,cli:2,cre:0,sos:0},q:1},
   {lbl:'10 % + pago puntual garantizado',sub:'Ganan certeza ellos y tú.',fx:{rent:-2,eq:4,cli:2,cre:0,sos:4},q:2,r:'Con pago puntual, nos quedamos 🤝'},
   {lbl:'Rechazar y buscar otros fleteros',sub:'Riesgo de quedarte sin reparto.',fx:{rent:2,eq:-6,cli:-6,cre:0,sos:-4},q:0}]}
 ],
 opps:[
  {ic:'📲',title:'App de pedidos para tiendas de barrio',news:'Atención: crecen las plataformas para que las tiendas de barrio hagan sus pedidos desde el celular.',
   desc:'Podrías lanzar una app para que las tiendas te pidan desde el celular, con promociones y crédito.',loc:'📍 Cochabamba',opts:[
   {lbl:'Lanzar la app con promociones',sub:'Digitalizas tu red comercial.',fx:{rent:-2,eq:0,cli:10,cre:12,sos:2},q:2,
    cond:{need:{hire:'p_dat'},ok:{cre:4,rent:4},ko:{cre:-4},okMsg:'Su analista de datos usó los pedidos para predecir demanda.',koMsg:'Sin análisis de datos, la app fue solo un catálogo.'}},
   {lbl:'Pedidos por WhatsApp Business',sub:'Simple y barato.',fx:{rent:2,eq:0,cli:6,cre:6,sos:2},q:1},
   {lbl:'Seguir con preventistas',sub:'Como siempre.',fx:{rent:0,eq:0,cli:-2,cre:-6,sos:0},q:0}]},
  {ic:'🌴',title:'Distribución exclusiva en el Trópico',news:'Atención: marcas nacionales buscan distribuidores para el Trópico de Cochabamba, un mercado en crecimiento.',
   desc:'Una marca de bebidas te ofrece la distribución exclusiva en el Trópico. Necesitas un depósito allá.',loc:'📍 Trópico de Cochabamba',opts:[
   {lbl:'Abrir depósito propio',sub:'Inversión grande, mercado propio.',fx:{rent:-4,eq:-2,cli:8,cre:14,sos:-2},q:1},
   {lbl:'Alianza con un distribuidor local',sub:'Compartes margen, reduces riesgo.',fx:{rent:2,eq:2,cli:6,cre:10,sos:4},q:2},
   {lbl:'No expandirse',sub:'Foco en la ciudad.',fx:{rent:2,eq:0,cli:0,cre:-6,sos:2},q:0}]}
 ]},

/* ───────── HOSTAL ───────── */
hot:{
 intro:'Ustedes dirigen el Hostal Cordillera, en el centro histórico de Cochabamba. Reciben mochileros, familias y turistas extranjeros. En temporada alta no hay cama libre; en temporada baja, el silencio. Su reto: llenar el hostal todo el año.',
 crises:[
  {ic:'❌',title:'Cancelaciones masivas por conflictos',news:'Último momento: los conflictos sociales y bloqueos provocan cancelaciones masivas de turistas en Bolivia.',
   desc:'Por los bloqueos en el país, el 60 % de tus reservas del mes se cancelaron.',loc:'📍 Plataformas de reserva',opts:[
   {lbl:'Ofertas para turismo nacional y local',sub:'Cambias de público mientras pasa la crisis.',fx:{rent:-2,eq:2,cli:8,cre:4,sos:6},q:2,
    cond:{need:{dept:'ven',min:1},ok:{cli:4},ko:{cli:-4},okMsg:'Su equipo de marketing movió las ofertas en redes.',koMsg:'Nadie promocionó las ofertas.'}},
   {lbl:'Despedir personal temporalmente',sub:'Ahorras, pero el equipo se resiente.',fx:{rent:6,eq:-10,cli:-2,cre:0,sos:-4},q:0},
   {lbl:'Aguantar con el fondo de emergencia',sub:'Mantienes todo igual.',fx:{rent:-6,eq:4,cli:0,cre:0,sos:2},q:1,
    cond:{need:{cap:'res',min:15000},ok:{sos:6},ko:{sos:-8,rent:-4},okMsg:'La reserva les dio 2 meses de aire.',koMsg:'Sin reserva, no alcanzó ni para el mes.'}}]},
  {ic:'💧',title:'Corte de agua por 48 horas',news:'Último momento: SEMAPA anuncia corte de agua de cuarenta y ocho horas en el centro de Cochabamba.',
   desc:'SEMAPA corta el agua 2 días. Tienes el hostal lleno y 30 huéspedes que quieren ducharse.',loc:'📍 Centro histórico',opts:[
   {lbl:'Contratar cisterna y avisar con anticipación',sub:'Costoso, pero el huésped ni lo nota.',fx:{rent:-6,eq:2,cli:8,cre:0,sos:4},q:2},
   {lbl:'Descuento a los huéspedes por la molestia',sub:'Compensas, pero la experiencia sufre.',fx:{rent:-4,eq:0,cli:2,cre:0,sos:0},q:1},
   {lbl:'No decir nada y esperar',sub:'Reseñas de 1 estrella en camino.',fx:{rent:0,eq:-2,cli:-12,cre:-4,sos:-4},q:0}]}
 ],
 negs:[
  {tipo:'cliente',ic:'🧳',who:'Agencia Andes Tours',role:'Agencia de turismo · La Paz',badge:'Cliente',title:'Grupo de 20 con 40 % de descuento',
   msgs:['¡Hola! Traemos un grupo de <b>20 turistas franceses</b> 🇫🇷','Es temporada baja, así que pedimos <b>40 % de descuento</b>.','Si les gusta, volvemos cada mes.'],
   loc:'Correo de la agencia',opts:[
   {lbl:'Aceptar el 40 %',sub:'Llenas camas, casi sin ganancia.',fx:{rent:-4,eq:0,cli:6,cre:4,sos:0},q:1,r:'Parfait! Nos vemos el lunes 🇫🇷'},
   {lbl:'25 % + desayuno y city tour incluido',sub:'Das valor en lugar de solo bajar precio.',fx:{rent:4,eq:2,cli:8,cre:6,sos:4},q:2,
    cond:{need:{hire:'p_guia'},ok:{cli:4},ko:{},okMsg:'Su guía turística hizo un city tour inolvidable.'},r:'¡Buena propuesta! Los turistas aman los tours 🗺️'},
   {lbl:'Precio normal',sub:'Mejor un cuarto vacío que barato.',fx:{rent:0,eq:0,cli:-6,cre:-4,sos:0},q:0,r:'Entendemos. Iremos a otro hostal.'}]},
  {tipo:'proveedor',ic:'🧺',who:'Lavandería industrial',role:'Lava sábanas y toallas',badge:'Proveedor',title:'Suben 25 % la tarifa',
   msgs:['Hola 🧺','Por el costo del gas y el agua, subimos <b>25 %</b> la tarifa.','Si firmas por un año, solo 10 %.'],
   loc:'Proveedor de lavandería',opts:[
   {lbl:'Firmar un año con 10 %',sub:'Estabilidad de costos.',fx:{rent:2,eq:0,cli:0,cre:0,sos:6},q:2,r:'¡Hecho! Contrato listo 📝'},
   {lbl:'Comprar lavadoras y lavar en el hostal',sub:'Inversión inicial, ahorro después.',fx:{rent:2,eq:-2,cli:0,cre:2,sos:2},q:1,
    cond:{need:{cap:'inf',min:12000},ok:{rent:4,sos:2},ko:{rent:-4},okMsg:'Tenían presupuesto de infraestructura para las lavadoras.',koMsg:'Las lavadoras salieron del bolsillo equivocado.'}},
   {lbl:'Aceptar el 25 % sin negociar',sub:'Lo más fácil.',fx:{rent:-4,eq:0,cli:0,cre:0,sos:0},q:0}]},
  {tipo:'aliado',ic:'🌐',who:'Plataforma de reservas',role:'Portal de viajes internacional',badge:'Aliado',title:'18 % de comisión o bajas en el ranking',
   msgs:['Hello! 🌐','Si subes tu comisión al <b>18 %</b>, tu hostal aparecerá entre los primeros.','Si no, bajarás posiciones en las búsquedas.'],
   loc:'Panel de la plataforma',opts:[
   {lbl:'Aceptar el 18 %',sub:'Más visibilidad, menos margen.',fx:{rent:-4,eq:0,cli:8,cre:6,sos:0},q:1},
   {lbl:'Mantener 15 % e impulsar reservas directas',sub:'Web propia, redes y fidelización.',fx:{rent:4,eq:0,cli:4,cre:6,sos:6},q:2,
    cond:{need:{hire:'p_dis'},ok:{cli:4},ko:{cli:-2},okMsg:'Su diseñadora creó una web y redes atractivas.'}},
   {lbl:'Salir de la plataforma',sub:'Sin comisión… ¿sin huéspedes?',fx:{rent:2,eq:0,cli:-10,cre:-6,sos:-2},q:0}]}
 ],
 opps:[
  {ic:'⛰️',title:'Paquetes de aventura: Tunari y Torotoro',news:'Atención: el turismo de aventura crece en Cochabamba. El Parque Tunari y Torotoro atraen a miles de visitantes.',
   desc:'Una operadora te propone vender paquetes de trekking al Tunari y excursiones a Torotoro desde tu hostal.',loc:'📍 Parque Tunari · Torotoro',opts:[
   {lbl:'Paquetes propios con guía',sub:'Más ingreso por huésped.',fx:{rent:6,eq:2,cli:8,cre:10,sos:2},q:2,
    cond:{need:{hire:'p_guia'},ok:{cli:4,rent:2},ko:{cli:-4},okMsg:'Su guía bilingüe hizo que los paquetes se vendieran solos.',koMsg:'Sin guía propia, tuvieron que tercerizar a precio alto.'}},
   {lbl:'Comisión por recomendar la operadora',sub:'Simple y sin riesgo.',fx:{rent:2,eq:0,cli:4,cre:4,sos:2},q:1},
   {lbl:'Solo alojamiento',sub:'Te quedas en lo tuyo.',fx:{rent:0,eq:0,cli:0,cre:-6,sos:0},q:0}]},
  {ic:'🎉',title:'Temporada alta: Feria y festividades',news:'Atención: la Feria Internacional de Cochabamba y las festividades de agosto llenan los hoteles de la ciudad.',
   desc:'Se viene la temporada alta. Puedes subir precios, pero tus clientes frecuentes lo notarán.',loc:'📍 Cochabamba · Agosto',opts:[
   {lbl:'Precios dinámicos y mínimo de 2 noches',sub:'Maximizas la temporada.',fx:{rent:8,eq:0,cli:2,cre:6,sos:4},q:2},
   {lbl:'Duplicar precios',sub:'Ganancia rápida, reseñas enojadas.',fx:{rent:10,eq:0,cli:-8,cre:0,sos:-4},q:0},
   {lbl:'Precio normal',sub:'Clientes felices, plata en la mesa.',fx:{rent:0,eq:2,cli:4,cre:0,sos:2},q:1}]}
 ]}
};

/* Distribución de capital recomendada por rubro (para comparar) */
const BENCH={
  chi:{mkt:22,ops:30,rrhh:18,inf:15,res:15}, tra:{mkt:10,ops:30,rrhh:15,inf:25,res:20},
  can:{mkt:15,ops:35,rrhh:10,inf:15,res:25}, art:{mkt:25,ops:20,rrhh:25,inf:15,res:15},
  tec:{mkt:20,ops:10,rrhh:35,inf:20,res:15}, imp:{mkt:10,ops:30,rrhh:15,inf:20,res:25},
  fin:{mkt:10,ops:20,rrhh:25,inf:15,res:30}, may:{mkt:10,ops:35,rrhh:15,inf:20,res:20},
  hot:{mkt:25,ops:20,rrhh:20,inf:20,res:15}
};

/* Candidatos (contratación hasta 10). fit: 2 clave · 1 útil · 0 no aporta */
const CANDS=[
  {id:'p_ven',av:'👩‍💼',name:'Vale',role:'Vendedora nata',dept:'ven',sal:3800,fit:{chi:1,tra:1,can:2,art:1,tec:1,imp:2,fin:1,may:2,hot:1}},
  {id:'p_coc',av:'👨‍🍳',name:'Don Rodo',role:'Cocinero con 20 años de oficio',dept:'prod',sal:3200,fit:{chi:2,hot:1}},
  {id:'p_cho',av:'🚌',name:'Wilo',role:'Chofer profesional (licencia C)',dept:'prod',sal:3500,fit:{tra:2,may:2,imp:1}},
  {id:'p_mec',av:'🔧',name:'Freddy',role:'Mecánico automotriz',dept:'prod',sal:3800,fit:{tra:2,may:1,imp:2}},
  {id:'p_dev',av:'👩‍💻',name:'Sofi',role:'Programadora full-stack',dept:'inn',sal:7500,fit:{tec:2,fin:1}},
  {id:'p_ti',av:'🧑‍🔧',name:'Tito',role:'Técnico de soporte TI',dept:'inn',sal:4200,fit:{tec:2,fin:2,imp:1,may:1}},
  {id:'p_dat',av:'📊',name:'Nico',role:'Analista de datos',dept:'inn',sal:6000,fit:{tec:2,fin:2,may:2,imp:1,can:1}},
  {id:'p_dis',av:'🎨',name:'Majo',role:'Diseñadora y community manager',dept:'ven',sal:4000,fit:{art:2,hot:2,tec:1,chi:1,can:1,fin:1}},
  {id:'p_cont',av:'🧮',name:'Javi',role:'Contador público',dept:'adm',sal:5000,fit:{chi:1,tra:1,can:1,art:1,tec:1,imp:2,fin:2,may:2,hot:1}},
  {id:'p_ate',av:'🙋‍♀️',name:'Marce',role:'Atención al cliente (inglés básico)',dept:'aten',sal:3200,fit:{hot:2,fin:2,tra:1,can:1,tec:1,chi:1,art:1}},
  {id:'p_art',av:'🏺',name:'Doña Juana',role:'Artesana ceramista',dept:'prod',sal:3000,fit:{art:2}},
  {id:'p_alm',av:'📦',name:'Ronald',role:'Encargado de almacén y logística',dept:'prod',sal:3200,fit:{may:2,imp:2,can:1,art:1,tra:1}},
  {id:'p_cred',av:'🏦',name:'Paola',role:'Asesora de créditos',dept:'ven',sal:4500,fit:{fin:2}},
  {id:'p_com',av:'🌎',name:'Kevin',role:'Comercio exterior y aduanas',dept:'adm',sal:6000,fit:{imp:2,art:1}},
  {id:'p_guia',av:'🗺️',name:'Luz',role:'Guía turística bilingüe',dept:'aten',sal:3500,fit:{hot:2,art:1}},
  {id:'p_lim',av:'🧹',name:'Rosa',role:'Limpieza y mantenimiento',dept:'prod',sal:2700,fit:{hot:2,chi:1,can:1}},
  {id:'p_abo',av:'⚖️',name:'Dra. Ruiz',role:'Abogada corporativa',dept:'adm',sal:6500,fit:{fin:2,imp:1}}
];
const TEAM_MIN=3,TEAM_MAX=10;

/* Competencias (resultados y comparación con el perfil de egreso NGE) */
const COMPS=[
  {id:'fin',ic:'💰',lbl:'Finanzas'},{id:'est',ic:'🧭',lbl:'Estrategia'},{id:'tal',ic:'👥',lbl:'Talento'},
  {id:'neg',ic:'🤝',lbl:'Negociación'},{id:'rie',ic:'🛡️',lbl:'Gestión de riesgos'},{id:'mer',ic:'📣',lbl:'Mercado y clientes'}
];
const EGRESADO={fin:92,est:90,tal:88,neg:90,rie:88,mer:90};

/* Malla NGE 2026 en el mapa interactivo: sem, nombre, competencias que fortalece y qué aprenderías */
const MALLA_MAP=[
  {sem:1,s:'Técnicas Básicas de Gestión Contable Financiera',c:['fin'],q:'Leer estados financieros y controlar la caja de una empresa.'},
  {sem:1,s:'Fundamentos de Gestión Empresarial',c:['est','tal'],q:'Cómo se organiza una empresa: áreas, roles y organigramas.'},
  {sem:1,s:'Fundamentos de Emprendimiento e Innovación',c:['est','mer'],q:'Detectar oportunidades y convertir ideas en negocios.'},
  {sem:1,s:'Ética y Sostenibilidad Empresarial',c:['rie'],q:'Decidir bien aunque nadie esté mirando (¿te acuerdas del “trámite rápido”?).'},
  {sem:2,s:'Análisis del Entorno Económico y Financiero',c:['rie','fin'],q:'Anticipar crisis: tipo de cambio, inflación, conflictos.'},
  {sem:2,s:'Fundamentos de Marketing Digital',c:['mer'],q:'Atraer clientes con redes, contenido y datos.'},
  {sem:2,s:'Liderazgo Organizacional',c:['tal'],q:'Motivar equipos y liderar en momentos difíciles.'},
  {sem:2,s:'Transformación Digital en la Empresa',c:['est','mer'],q:'Apps, QR, comercio electrónico y automatización.'},
  {sem:3,s:'Lean Startup y Modelos de Negocio',c:['est'],q:'Probar en pequeño antes de apostar todo.'},
  {sem:3,s:'Planificación Estratégica',c:['est','rie'],q:'Definir hacia dónde va la empresa y cómo llegar.'},
  {sem:3,s:'Electiva: Métodos Alternativos de Solución de Controversias',c:['neg'],q:'Negociar y resolver conflictos ganar-ganar.'},
  {sem:3,s:'Electiva: Analítica de Datos Comerciales',c:['mer','fin'],q:'Decidir con datos de ventas y clientes.'},
  {sem:4,s:'Análisis Financiero y Decisiones Estratégicas',c:['fin','rie'],q:'Evaluar inversiones, créditos y riesgos con números.'},
  {sem:4,s:'Gestión del Talento Humano',c:['tal'],q:'Contratar a las personas correctas y cuidar la planilla.'},
  {sem:4,s:'Innovación en Logística y Supply Chain',c:['rie','est'],q:'Que la mercadería llegue aunque haya bloqueos.'},
  {sem:4,s:'Marketing Digital Estratégico',c:['mer'],q:'Posicionar una marca y medir resultados.'},
  {sem:5,s:'Gestión de Calidad y Mejora Continua',c:['rie','mer'],q:'Procesos que no fallan (y que pasan inspecciones).'},
  {sem:5,s:'Liderazgo Transformacional',c:['tal','neg'],q:'Inspirar cambios en la organización.'},
  {sem:6,s:'Finanzas para Emprendedores',c:['fin','neg'],q:'Levantar inversión, negociar con inversionistas y cuidar la caja.'},
  {sem:6,s:'Business Intelligence y Análisis Prescriptivo',c:['est','fin'],q:'Tableros como el de este simulador, pero con datos reales.'},
  {sem:7,s:'Dirección y Ejecución de Inversiones',c:['fin','rie'],q:'Decidir dónde poner el dinero de la empresa.'},
  {sem:7,s:'IA Aplicada a la Gestión Estratégica',c:['est'],q:'Usar inteligencia artificial para decidir mejor.'},
  {sem:8,s:'Prácticas Profesionales',c:['tal','neg','mer'],q:'Aplicar todo en una empresa real.'},
  {sem:8,s:'Proyecto Integrador Final',c:['est','fin','mer'],q:'Tu propio proyecto de impacto, de principio a fin.'}
];

/* Logros */
const LOGROS=[
  {id:'escudo',ic:'🛡️',n:'Escudo previsor',d:'Reserva de al menos 15 %.',t:s=>s.cap.res>=15000},
  {id:'ojo',ic:'🔎',n:'Ojo de reclutador',d:'Nadie contratado “sin relación” con el rubro y 3+ perfiles clave.',t:s=>s.hireEval.none===0&&s.hireEval.key>=3},
  {id:'planilla',ic:'🧾',n:'Planilla sana',d:'La planilla cupo en el presupuesto de talento.',t:s=>s.payroll<=s.cap.rrhh},
  {id:'ganar',ic:'🤝',n:'Maestro ganar-ganar',d:'Las 3 negociaciones con la mejor práctica.',t:s=>s.negQ.filter(q=>q===2).length===3},
  {id:'rayo',ic:'⚡',n:'Decisión relámpago',d:'Resolvieron la crisis en menos de 25 s.',t:s=>s.crisisTime>0&&s.crisisTime<25},
  {id:'visual',ic:'✏️',n:'Pensamiento visual',d:'Usaron las dos pizarras.',t:s=>s.boards.d1&&s.boards.d2},
  {id:'estratega',ic:'🧭',n:'Estratega del rubro',d:'Capital muy cercano al recomendado para su negocio.',t:s=>s.benchDist<=30},
  {id:'cohete',ic:'🚀',n:'Crecimiento explosivo',d:'Crecimiento final de 80 o más.',t:s=>s.met.cre>=80},
  {id:'etica',ic:'⚖️',n:'Brújula ética',d:'Ninguna decisión “débil” en crisis y oportunidad.',t:s=>s.cQ>0&&s.oQ>0}
];
