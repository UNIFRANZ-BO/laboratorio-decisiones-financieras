# Laboratorio de Decisiones Financieras · Guía del docente

## Archivos
| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa en un solo archivo. Es lo que se publica o se comparte. |
| `apps-script/Codigo.gs` | Backend del ranking en vivo (Google Sheets + Apps Script). |
| `src/` y `build.py` | Fuentes editables. `python build.py` vuelve a generar `index.html`. |

## 1. Activar el ranking en vivo (una sola vez)
1. Crea una hoja de cálculo de Google nueva, por ejemplo «Laboratorio NGE – Ranking».
2. Ve a **Extensiones → Apps Script**, borra lo que haya y pega todo `apps-script/Codigo.gs`. Guarda.
3. Elige la función **preparar** y pulsa ▶ Ejecutar. Acepta los permisos.
4. **Implementar → Nueva implementación → Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
5. Copia la URL que termina en `/exec` y genera el HTML con ella:
   ```
   python build.py https://script.google.com/macros/s/XXXX/exec
   ```
   (O pégala a mano en `CONFIG.API_URL`, al inicio del script de `index.html`.)
6. Publica `index.html` (GitHub Pages o cualquier hosting). Los celulares necesitan internet para el ranking.

> **Sin internet:** comparte `index.html` tal cual. El juego funciona completo; solo se omiten el ranking y el QR.

## 2. El día del taller (equipos de 3 a 5)
1. En la laptop del proyector abre `…/laboratorio-decisiones-financieras/?docente`: se abre el modo docente. Elige un código (por ejemplo `ABCD`) y pulsa **Proyectar**. Los estudiantes no ven esta opción en su enlace. También puedes ir directo con `?proyector=ABCD`.
2. El proyector muestra un QR. Cada equipo lo escanea, elige **Jugar en equipo**, se pone un nombre y una mascota. El código de sala ya viene escrito.
3. En el proyector ves en vivo a cada equipo: en qué fase está y su puntaje al terminar. Con **🙈 Ocultar puntajes** mantienes el suspenso.
4. Cuando todos terminen, pulsa **🥁 Revelar podio**.
5. En la hoja «Ranking» quedan como evidencia pedagógica las decisiones, las 5 justificaciones, los indicadores y el perfil de cada equipo.
6. Al terminar, usa **🔒 Cerrar o abrir una sala** para que nadie siga enviando datos, y **📄 Exportar sala** si quieres una hoja propia para el colegio.

## 2b. Gestionar los datos (menú 🏆 Laboratorio de la hoja)
| Opción | Qué hace |
|---|---|
| 📊 Resumen de una sala | Ranking, promedio y quiénes siguen jugando. |
| 📄 Exportar sala a hoja propia | Crea la hoja «Sala XXXX» ordenada por puntaje, con todas las justificaciones. Se descarga en Archivo → Descargar. |
| 🔒 Cerrar o abrir una sala | La sala deja de aceptar resultados nuevos; su ranking se sigue viendo. La app avisa «Sala cerrada». |
| ⏯️ Abrir o pausar todo el registro | Interruptor general (CONFIG → Registro abierto). |
| 🧹 Limpiar incompletos | Borra a quienes no terminaron y llevan más de N horas sin actividad (CONFIG). Acepta `TODAS`. |
| 📦 Archivar una sala | Mueve sus filas a la hoja «Archivo»: salen del ranking pero se conserva la evidencia. |
| 🗑️ Borrar una sala | Borra definitivamente (pide confirmación). Ideal para salas de prueba como `ZTEST`. |
| ⚙️ Preparar o reparar hojas | Crea o repara Ranking, Salas (resumen automático) y CONFIG. |

La hoja **Salas** se actualiza sola: participantes, cuántos terminaron, promedio, mejor puntaje y fechas de cada sala.

> **Al actualizar el código del Apps Script:** Implementar → Gestionar implementaciones → ✏️ → Versión «Nueva versión» → Implementar. Así la URL `/exec` no cambia y no hay que tocar el HTML.

## Novedades v3 (enlace: `…/laboratorio-decisiones-financieras/v3/`)
- **Voz neural boliviana**: Sofía (mentora) da la bienvenida, presenta la misión de cada negocio y cierra; Marcelo (noticiero) anuncia crisis y oportunidades. Se apaga con 🎙️. Los MP3 están en `voz/` y se regeneran con `node herramientas/textos_voz.js` y `python herramientas/generar_voz.py`.
- **Eventos realistas por rubro**: cada negocio tiene sus propias 2 crisis, 3 negociaciones tipo chat (cliente, proveedor y aliado) y 2 oportunidades (`src/eventos.js`).
- **Sin puntajes visibles**: las opciones ya no muestran cuánto suman; el efecto se revela después y depende de decisiones previas (reserva, inversión, personal contratado).
- **Contratación**: de 3 a 10 personas de 17 perfiles con sueldo. La planilla sale del presupuesto de Talento; si se pasan, se consume la reserva o se genera deuda. Al final se evalúa si cada contratación tenía relación con el rubro.
- **Pizarra pro (Excalidraw)**: mover, redimensionar, texto dentro de formas, flechas que se pegan, colores, fondos, tamaños de letra, deshacer, plantillas y fichas. Sin internet se usa la pizarra ligera.
- **Tablero en vivo (📊)**, misión inicial, transiciones de fase, logros y resultados con 4 pestañas: tablero (radar vs. clase, competencias vs. egresado NGE, evolución, capital vs. lo recomendado, evaluación del equipo), decisiones con la mejor práctica, mapa interactivo de la malla y registro.
- **Informe PDF detallado (6 páginas)** que se descarga y además se guarda en Drive: `Laboratorio NGE – Informes / Sala XXXX / Nombre del grupo`.

> **Para activar el guardado en Drive:** pega el nuevo `apps-script/Codigo.gs`, ejecuta una vez la función **autorizarDrive** (acepta el permiso de Drive), luego **preparar**, y publica **Gestionar implementaciones → ✏️ → Nueva versión**. El menú 🏆 Laboratorio suma **📁 Abrir carpeta de informes**.

## Novedades v3.1
- **15 negocios**: se suman 6 de dificultad experta (★★★★): 🥛 Lácteos Valle Lechero, 🍌 Agroexportadora Trópico Fresh, 🏥 Clínica Salud Cala Cala, 🏗️ Constructora Tunari Obras, ☀️ Energía solar Sol del Valle y 🍺 Cervecería Llajta Brew. Hay un filtro por dificultad en la selección.
- **Capital por partidas del rubro**: 7 frascos propios de cada negocio (por ejemplo, la clínica: equipos médicos, reactivos, bioseguridad…), siempre con **Sueldos del equipo (planilla)** y **Fondo de emergencia**.
- **Planilla clara**: al contratar se compara con la partida de sueldos y el botón **↔️ Ajustar planilla** mueve dinero desde otras partidas sin volver atrás.
- **Contratación por rubro**: 37 perfiles; cada negocio muestra los que le sirven más 5 que no aportan. Ya no hay que cubrir todos los departamentos, sino las **funciones críticas** del rubro (por ejemplo, la constructora necesita un residente de obra y un maestro albañil). Los resultados indican cuál faltó.
- **Panel de control seguro en el Sheets**: menú **🏆 Laboratorio → 🛠️ Panel de control (seguro)**. Muestra cada sala con resumen, exportar, cerrar o abrir, limpiar incompletos, archivar y borrar (este último pide escribir el código de la sala). Las hojas Ranking, Salas y Archivo quedan protegidas: Google avisa antes de editarlas a mano.

> **¿No aparece el menú 🏆 Laboratorio junto a «Ayuda»?** El menú se crea al **abrir la hoja**. Recarga la pestaña del Sheets (F5). Si aún no aparece, en el editor de Apps Script elige la función **onOpen** y pulsa ▶ Ejecutar una vez.

## 3. Flujo del juego (estructura original respetada)
Inicio → Negocio (9 de Cochabamba) → Pizarra: boceto → Capital Bs 100.000 → Pizarra: organigrama → Equipo (5 personas) → Crisis (60 s) → Negociación (3 rondas: cliente, proveedor y distribuidor) → Oportunidad (carta sorpresa) → Resultados → Finanzas personales.

## 4. Cambios respecto a la versión anterior
- Interfaz nueva: aurora naranja, coral y violeta; animaciones, sonidos (se pueden silenciar), vibración y confeti.
- Pizarra **solo en pantalla completa**: fichas, plantilla lista, flechas que conectan cajas, notas, zoom con dos dedos, deshacer y rehacer.
- Capital con frascos (+/− de Bs 5.000 o deslizador), asesor que reacciona e indicadores en vivo.
- Equipo con 5 personajes: cada uno rinde un poco más en su área ideal ⭐.
- Crisis con «Último momento» y cronómetro: quedarse sin tiempo resta −4 de Sostenibilidad y −2 de Equipo.
- Negociación tipo WhatsApp en 3 rondas (cada ronda pesa la mitad que el evento original).
- Justificaciones con frases de inicio y dictado por voz (mínimo 45 caracteres).
- Resultados: radar animado, análisis ejecutivo, registro completo, «Esto ya lo estudiaron hoy» (materias reales de la malla NGE 2026) y tarjeta para historia de Instagram.
- Finanzas personales: tarjetas que se voltean, mini simulador «Tu primer sueldo» (arranca con la lógica que usaron en su empresa) y perfil financiero **corregido**. Antes leía un dato inexistente.
- Ruta de la carrera: 4 años, 2 menciones, salidas laborales y QR (`CONFIG.CTA_URL`).

## 5. Ajustes rápidos (en `src/app.js` → `CONFIG`, y luego `python build.py`)
- `CTA_URL`: enlace del botón «Conocer la carrera» y de su QR (página oficial de la carrera NGE).
- `POLL_MS`: cada cuánto se actualiza el proyector (4000 = 4 s).
