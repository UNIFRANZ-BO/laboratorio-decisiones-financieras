"""Une los archivos de src/ en un solo index.html autónomo.

Uso:  python build.py            -> genera index.html
      python build.py URL_EXEC   -> además escribe la URL del Apps Script en CONFIG.API_URL
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"

def read(name):
    return (SRC / name).read_text(encoding="utf-8")

app = read("app.js")
if len(sys.argv) > 1:
    app = re.sub(r"API_URL:'[^']*'", "API_URL:'%s'" % sys.argv[1].strip(), app, count=1)

html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0A0612">
<title>Laboratorio de Decisiones Financieras · NGE UNIFRANZ</title>
<meta name="description" content="Simulador empresarial y de finanzas personales para estudiantes de secundaria. Negocios y Gestión Empresarial · UNIFRANZ.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💼</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
{read("styles.css")}
{read("board.css")}
{read("styles3.css")}
{read("styles4.css")}
{read("styles5.css")}
</style>
</head>
<body>
{read("body.html")}
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>
<script>
{read("data.js")}
{read("eventos.js")}
{read("rubros.js")}
{read("extras.js")}
{read("board.js")}
{read("pizarra.js")}
{app}
{read("extras2.js")}
{read("extras3.js")}
{read("extras4.js")}
</script>
</body>
</html>
"""
(ROOT / "index.html").write_text(html, encoding="utf-8")
(ROOT / "v3").mkdir(exist_ok=True)
(ROOT / "v3" / "index.html").write_text(html, encoding="utf-8")  # versión actual en una URL nueva (evita cachés viejas); /v2/ queda congelada
print("index.html generado:", round(len(html.encode("utf-8")) / 1024), "KB")
