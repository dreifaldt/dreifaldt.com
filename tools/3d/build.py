"""Inline layout + GLB into the homepage. Usage: python3 tools/3d/build.py [local|cdn] [out.html]  (default out: public/index.html)"""
import base64, json, sys, pathlib, re
root = pathlib.Path(__file__).resolve().parent
mode = sys.argv[1] if len(sys.argv) > 1 else 'cdn'
out = sys.argv[2] if len(sys.argv) > 2 else str(root.parent.parent / 'public/index.html')
src = (root / 'index.src.html').read_text()
layout = json.dumps(json.loads((root / 'shared/layout.json').read_text()), separators=(',', ':'))
glb = base64.b64encode((root / 'build/scene.glb').read_bytes()).decode()
three = '/node_modules/three' if mode == 'local' else 'https://cdn.jsdelivr.net/npm/three@0.170.0'
html = src.replace('__THREE__', three).replace('__LAYOUT__', layout).replace('__GLB__', glb)
if mode == 'local':
    html = re.sub(r'<link[^>]+fonts\.(googleapis|gstatic)[^>]*>', '', html)
if mode != 'local':
    html = re.sub(r'\nwindow\.__dbg = .*?;\n', '\n', html)
pathlib.Path(out).write_text(html)
print(out, round(len(html) / 1e6, 2), 'MB')
