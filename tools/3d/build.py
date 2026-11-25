"""Inline layout + GLB into the homepage. Usage: python3 tools/3d/build.py [local|cdn] [out.html]  (default out: public/index.html)"""
import json, sys, pathlib, re, shutil, subprocess
root = pathlib.Path(__file__).resolve().parent
mode = sys.argv[1] if len(sys.argv) > 1 else 'cdn'
out = sys.argv[2] if len(sys.argv) > 2 else str(root.parent.parent / 'public/index.html')
src = (root / 'index.src.html').read_text()
layout = json.dumps(json.loads((root / 'shared/layout.json').read_text()), separators=(',', ':'))
three = '/node_modules/three' if mode == 'local' else 'https://cdn.jsdelivr.net/npm/three@0.170.0'   # modes: local | cdn | preview (model inlined)
html = src.replace('__THREE__', three).replace('__LAYOUT__', layout)
if mode == 'local':
    html = re.sub(r'<link[^>]+fonts\.(googleapis|gstatic)[^>]*>', '', html)
if mode != 'local':
    html = re.sub(r'\nwindow\.__dbg = .*?;\n', '\n', html)
pathlib.Path(out).write_text(html)
# the model ships next to the page, meshopt-compressed (5.5 MB -> ~1.9 MB)
raw, packed = root / 'build/scene.glb', root / 'build/scene.meshopt.glb'
if not packed.exists() or packed.stat().st_mtime < raw.stat().st_mtime:
    subprocess.run(['npx', 'gltf-transform', 'meshopt', str(raw), str(packed), '--level', 'medium'], cwd=root, check=True)
if mode == 'preview':
    import base64
    blob = base64.b64encode(packed.read_bytes()).decode()
    html = html.replace('<script type="importmap">', f'<script id="glb" type="application/octet-stream">{blob}</script>\n<script type="importmap">', 1)
    pathlib.Path(out).write_text(html)
else:
    shutil.copy(packed, pathlib.Path(out).parent / 'scene.glb')
print(out, round(len(html) / 1e6, 2), 'MB')
