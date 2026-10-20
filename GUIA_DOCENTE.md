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
1. En la pantalla de inicio pulsa **🎛️ Soy docente: proyectar ranking**, elige un código (por ejemplo `ABCD`) y pulsa **Proyectar**.
2. El proyector muestra un QR. Cada equipo lo escanea, elige **Jugar en equipo**, se pone un nombre y una mascota. El código de sala ya viene escrito.
3. En el proyector ves en vivo a cada equipo: en qué fase está y su puntaje al terminar. Con **🙈 Ocultar puntajes** mantienes el suspenso.
4. Cuando todos terminen, pulsa **🥁 Revelar podio**.
5. En la hoja «Ranking» quedan como evidencia pedagógica las decisiones, las 5 justificaciones, los indicadores y el perfil de cada equipo. Menú **🏆 Laboratorio** → «Ver resumen de una sala» o «Borrar una sala».

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
- `CTA_URL`: enlace del botón «Conocer la carrera» y de su QR (hoy apunta a unifranz.edu.bo).
- `POLL_MS`: cada cuánto se actualiza el proyector (4000 = 4 s).
