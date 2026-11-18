"""
Render share images with Cycles from build/dreifaldt.blend.
Usage: python3 render_stills.py -- <shot> <out.png> <width> <height> [samples]
Shots: home (exploded website device), phone (exploded React Native phone)
"""
import bpy, sys, os, math, random
from mathutils import Vector, Euler

args = sys.argv[sys.argv.index('--') + 1:]
SHOT, OUT, W, H = args[0], args[1], int(args[2]), int(args[3])
SAMPLES = int(args[4]) if len(args) > 4 else 64
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

bpy.ops.wm.open_mainfile(filepath=os.path.join(ROOT, 'build', 'dreifaldt.blend'))
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
sc.cycles.device = 'CPU'
sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = True
try: sc.cycles.denoiser = 'OPENIMAGEDENOISE'
except Exception: pass
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = W, H, 100
sc.render.image_settings.file_format = 'PNG'
try:
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'AgX - Medium High Contrast'
except Exception:
    pass

def textured(name, img, strength):
    m = bpy.data.materials[name]; nt = m.node_tree
    p = nt.nodes.get('Principled BSDF')
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(os.path.join(ROOT, 'build', 'tex', img))
    nt.links.new(t.outputs['Color'], p.inputs['Base Color'])
    nt.links.new(t.outputs['Color'], p.inputs['Emission Color'])
    p.inputs['Emission Strength'].default_value = strength
    p.inputs['Roughness'].default_value = 0.3
textured('WebsiteSurface', 'webCv.png', 1.0)
textured('XRaySurface', 'xrCv.png', 2.4)
textured('AppSurface', 'appCv.png', 1.0)

web = bpy.data.objects['website']; phone = bpy.data.objects['phone']
def parts(root):
    return [o for o in root.children if 'part' in o.keys()]

rng = random.Random(4)
def hide_tree(root):
    root.hide_render = True
    for o in root.children_recursive: o.hide_render = True
cam = sc.camera
target = Vector((0, 0, 0))

if SHOT == 'home':
    hide_tree(phone)
    for p in parts(web):
        p.location.z += p['lift']
        if p['part'] == 'shards':
            for s in p.children:
                if 'shard' not in s.keys():
                    continue
                d = s['dist']
                q = max(0.0, 0.7 - d / 20)          # only the shards near the impact are still in the air
                if q <= 0:
                    s.hide_render = True; continue
                out = Vector((s.location.x + 5.2, s.location.y + 1.5, 0)).normalized()
                s.location += Vector((out.x * 8 * q, out.y * 8 * q, 1.2 + 6 * q * rng.random()))
                s.rotation_euler = Euler((rng.uniform(-1.6, 1.6), rng.uniform(-1.6, 1.6), rng.uniform(-3, 3)))
    for o in bpy.data.objects:
        if 'sub' in o.keys(): o.location.z += o['sub'] * 0.45
        if 'spin' in o.keys(): o.rotation_euler.z = rng.uniform(0, 3)
    target = Vector((0, 0, 9.4)); az, pol, dist, shift = 34, 62, 82, -0.21; square = 0.74
elif SHOT == 'phone':
    hide_tree(web)
    bpy.data.objects['phone_glass'].hide_render = True
    for p in parts(phone):
        p.location.z += p['lift'] * 1.4
    target = Vector((0, -6.4, 0)); az, pol, dist, shift = 58, 80, 47, -0.2; square = 0.6
else:
    raise SystemExit('unknown shot')

if W <= H:                                           # square / portrait posts: centre the subject
    shift = 0.0; dist *= square
if len(args) > 5: shift = float(args[5])
if len(args) > 6: dist *= float(args[6])
cam.constraints.clear()
a, b = math.radians(az), math.radians(pol)
cam.location = target + Vector((math.sin(b) * math.sin(a), -math.sin(b) * math.cos(a), math.cos(b))) * dist
cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()
cam.data.lens = 50
cam.data.shift_x = shift

# studio: key, rim, cool fill; black world
def area(name, loc, energy, size, color=(1, 1, 1)):
    ld = bpy.data.lights.get(name) or bpy.data.lights.new(name, 'AREA')
    ld.energy = energy; ld.size = size; ld.color = color
    ob = bpy.data.objects.get(name) or bpy.data.objects.new(name, ld)
    if ob.name not in sc.collection.objects: sc.collection.objects.link(ob)
    ob.location = target + Vector(loc)
    ob.rotation_euler = (target - ob.location).to_track_quat('-Z', 'Y').to_euler()
area('Key', (18, -22, 26), 22000, 14)
area('Rim', (-26, 24, 14), 14000, 10, (0.6, 0.78, 1.0))
area('Fill', (-20, -26, -4), 4000, 14, (1.0, 0.86, 0.72))
area('Top', (0, 0, 42), 16000, 40)
w = sc.world
bg = w.node_tree.nodes.get('Background')
bg.inputs[0].default_value = (0.012, 0.014, 0.02, 1); bg.inputs[1].default_value = 1.0

sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print('rendered', OUT)
