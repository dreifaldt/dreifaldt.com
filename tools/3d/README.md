# 3D pipeline for dreifaldt.com

The homepage's exploded device and phone are modelled procedurally in Blender and rendered live with three.js.

```
pip install bpy                                        # Blender 5.3 as a Python module
python3 tools/3d/blender/build_scene.py -- tools/3d/build   # writes build/scene.glb + build/dreifaldt.blend
python3 tools/3d/build.py cdn                          # inlines the model into public/index.html
```

Share images (optional):

```
(cd tools/3d && npm i geist)                           # Geist fonts for the titles
python3 tools/3d/blender/render_stills.py -- home  tools/3d/renders/og-home.png 1200 630
python3 tools/3d/blender/render_stills.py -- phone tools/3d/renders/og-rn-to-native.png 1200 630
python3 tools/3d/compose_images.py og_home og_guide    # writes public/og/*.jpg
```

`render_stills.py` expects the screen textures in `build/tex/` (webCv.png, xrCv.png, appCv.png), exported from the page's canvases.

- `index.src.html`: homepage source (copy, choreography, textures drawn on canvas)
- `shared/layout.json`: the on-screen website layout, shared by Blender and the browser
- `blender/build_scene.py`: every part, with `lift` and `side` custom properties for the explode
