"""Genera los MP3 de la narradora con voces neuronales bolivianas (edge-tts).

Uso:  node herramientas/textos_voz.js
      python herramientas/generar_voz.py          (solo los que faltan)
      python herramientas/generar_voz.py --todo   (regenera todos)
"""
import asyncio, json, pathlib, sys
import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "voz"
VOCES = {
    "sofia": dict(voice="es-BO-SofiaNeural", rate="+6%", pitch="+0Hz"),
    "marcelo": dict(voice="es-BO-MarceloNeural", rate="+10%", pitch="+2Hz"),
    "dani": dict(voice="es-MX-DaliaNeural", rate="+8%", pitch="+4Hz"),
}

async def main():
    OUT.mkdir(exist_ok=True)
    items = json.loads((ROOT / "herramientas" / "voz.json").read_text(encoding="utf-8"))
    todo = "--todo" in sys.argv
    for it in items:
        dst = OUT / f"{it['key']}.mp3"
        if dst.exists() and not todo:
            continue
        v = VOCES[it["voz"]]
        for intento in range(4):  # el servicio a veces corta: reintenta
            try:
                await edge_tts.Communicate(it["text"], v["voice"], rate=v["rate"], pitch=v["pitch"]).save(str(dst))
                print("ok", dst.name)
                break
            except Exception as e:
                print("reintento", dst.name, type(e).__name__)
                await asyncio.sleep(2)
    total = sum(f.stat().st_size for f in OUT.glob("*.mp3"))
    print(f"{len(list(OUT.glob('*.mp3')))} archivos · {total/1024/1024:.1f} MB")

asyncio.run(main())
