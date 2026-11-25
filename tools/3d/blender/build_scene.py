"""
Dreifaldt.com — procedural Blender scene.

Builds two "products" whose layers explode on scroll:
  * website  — a slab device whose top is the website. Layers from the bottom:
               base (case + foot), fans, data, core (AI chip board), api, components,
               frame, display (x-ray surface) and the website itself, pre-fractured into shards.
  * phone    — a React Native phone: chassis, native board, battery, turbo modules,
               JSI lattice, Hermes engine, Fabric view tree, screen and glass.

Every part is an Empty carrying custom properties (exported as glTF extras):
  part, label, lift (exploded offset along the part's local up axis, Blender units), side (label side).
Run:  python3 build_scene.py -- <out_dir>
Writes <out_dir>/scene.glb and <out_dir>/dreifaldt.blend
"""
import bpy, bmesh, math, random, json, sys, os
from mathutils import Vector, Matrix
from mathutils.geometry import delaunay_2d_cdt

HERE = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(os.path.join(HERE, '..', 'shared', 'layout.json')))
OUT = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else os.path.join(HERE, '..', 'build')
os.makedirs(OUT, exist_ok=True)
rng = random.Random(11)

bpy.ops.wm.read_factory_settings(use_empty=True)
SC = bpy.context.scene
COL = SC.collection

# ---------------------------------------------------------------- materials
MATS = {}
def mat(name, base, metal=0.0, rough=0.5, emit=None, strength=0.0, trans=0.0, coat=0.0):
    m = bpy.data.materials.new(name)
    try: m.use_nodes = True
    except Exception: pass
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*base, 1)
    p.inputs['Metallic'].default_value = metal
    p.inputs['Roughness'].default_value = rough
    if emit:
        p.inputs['Emission Color'].default_value = (*emit, 1)
        p.inputs['Emission Strength'].default_value = strength
    if trans: p.inputs['Transmission Weight'].default_value = trans
    if coat: p.inputs['Coat Weight'].default_value = coat
    m.diffuse_color = (*base, 1)
    MATS[name] = m
    return m

ALU      = mat('Aluminium',   (0.80, 0.81, 0.83), 1.0, 0.26)
ANOD     = mat('Anodized',    (0.30, 0.31, 0.33), 0.9, 0.32)
BLACK    = mat('SpaceBlack',  (0.025, 0.025, 0.03), 0.8, 0.34)
GRAPH    = mat('Graphite',    (0.055, 0.06, 0.065), 0.55, 0.42)
RUBBER   = mat('Rubber',      (0.012, 0.012, 0.012), 0.0, 0.85)
PCB      = mat('PCB',         (0.004, 0.016, 0.013), 0.0, 0.42, coat=0.5)
SUBST    = mat('Substrate',   (0.02, 0.05, 0.035), 0.1, 0.35)
GOLD     = mat('Gold',        (1.0, 0.70, 0.32), 1.0, 0.26)
CORE     = mat('CoreGlow',    (1.0, 0.45, 0.08), 0.0, 0.3, emit=(1.0, 0.42, 0.06), strength=6.0)
BLUEG    = mat('BlueGlow',    (0.04, 0.32, 1.0), 0.0, 0.3, emit=(0.05, 0.36, 1.0), strength=5.0)
CYANG    = mat('CyanGlow',    (0.2, 0.8, 1.0), 0.0, 0.3, emit=(0.2, 0.75, 1.0), strength=4.0)
ACRYL    = mat('Acrylic',     (0.85, 0.92, 1.0), 0.0, 0.32, trans=1.0)
CERAMIC  = mat('Ceramic',     (0.90, 0.905, 0.915), 0.0, 0.22, coat=1.0)
LIBLUE   = mat('LinkedInBlue',(0.003, 0.133, 0.539), 0.0, 0.28, coat=0.8)
DISPLAY  = mat('DisplayBlack',(0.004, 0.004, 0.005), 0.0, 0.12, coat=1.0)
GLASS    = mat('Glass',       (0.95, 0.97, 1.0), 0.0, 0.02, trans=1.0)
TITAN    = mat('Titanium',    (0.50, 0.48, 0.45), 1.0, 0.30)
LENS     = mat('Lens',        (0.0, 0.0, 0.0), 0.2, 0.05, coat=1.0)
BATT     = mat('Battery',     (0.02, 0.02, 0.024), 0.1, 0.6)
ENGRAVE  = mat('Engrave',     (0.45, 0.46, 0.48), 1.0, 0.55)
FROST    = mat('Frost',       (0.92, 0.94, 1.0), 0.0, 0.45, trans=0.6)
WEBSITE  = mat('WebsiteSurface', (1, 1, 1), 0.0, 0.2)
XRAY     = mat('XRaySurface',    (0.02, 0.05, 0.12), 0.0, 0.2, emit=(0.05, 0.3, 1.0), strength=1.0)
APPSURF  = mat('AppSurface',     (1, 1, 1), 0.0, 0.2)
STEEL    = mat('Steel',       (0.10, 0.10, 0.11), 1.0, 0.28)
RECESS   = mat('Recess',      (0.0, 0.0, 0.0), 0.0, 0.9)
COPPER   = mat('Copper',      (0.95, 0.56, 0.40), 1.0, 0.24)
FERRITE  = mat('Ferrite',     (0.16, 0.16, 0.17), 0.3, 0.55)
MLCC     = mat('MLCC',        (0.42, 0.31, 0.19), 0.0, 0.45)

# ---------------------------------------------------------------- geometry helpers
def dedupe(pts, eps=1e-5):
    out = []
    for p in pts:
        if not out or (abs(p[0] - out[-1][0]) > eps or abs(p[1] - out[-1][1]) > eps):
            out.append(p)
    if len(out) > 1 and abs(out[0][0] - out[-1][0]) < eps and abs(out[0][1] - out[-1][1]) < eps:
        out.pop()
    return out

def rr_pts(w, h, r, seg=10, cx=0.0, cy=0.0):
    r = max(min(r, w / 2, h / 2), 0.0)
    if r < 1e-4: seg = 0
    pts = []
    for (qx, qy, a0) in ((1, 1, 0), (-1, 1, 90), (-1, -1, 180), (1, -1, 270)):
        ccx = cx + qx * (w / 2 - r); ccy = cy + qy * (h / 2 - r)
        for i in range(seg + 1):
            a = math.radians(a0 + (90 * i / seg if seg else 45))
            pts.append((ccx + r * math.cos(a), ccy + r * math.sin(a)) if seg else (cx + qx * w / 2, cy + qy * h / 2))
    return dedupe(pts)

def circle_pts(r, n=48, cx=0.0, cy=0.0):
    return [(cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n)) for i in range(n)]

def prism_into(bm, pts, z0, z1):
    vs = [bm.verts.new((x, y, z0)) for x, y in pts]
    f = bm.faces.new(vs)
    r = bmesh.ops.extrude_face_region(bm, geom=[f], use_keep_orig=True)
    nv = [g for g in r['geom'] if isinstance(g, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=nv, vec=(0, 0, z1 - z0))

def prism(pts, z0, z1):
    bm = bmesh.new(); prism_into(bm, pts, z0, z1); return bm

def box_into(bm, x0, y0, z0, x1, y1, z1):
    m = Matrix.Translation(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)) @ Matrix.Diagonal((x1 - x0, y1 - y0, z1 - z0, 1))
    bmesh.ops.create_cube(bm, size=1.0, matrix=m)

def cyl_into(bm, r, z0, z1, cx=0.0, cy=0.0, seg=40):
    m = Matrix.Translation((cx, cy, (z0 + z1) / 2))
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg, radius1=r, radius2=r, depth=z1 - z0, matrix=m)

def ring_into(bm, r_out, r_in, z0, z1, cx=0.0, cy=0.0, seg=64):
    rings = []
    for (r, z) in ((r_out, z0), (r_out, z1), (r_in, z1), (r_in, z0)):
        rings.append([bm.verts.new((cx + r * math.cos(2 * math.pi * i / seg), cy + r * math.sin(2 * math.pi * i / seg), z)) for i in range(seg)])
    for k in range(4):
        a, b = rings[k], rings[(k + 1) % 4]
        for i in range(seg):
            j = (i + 1) % seg
            bm.faces.new((a[i], a[j], b[j], b[i]))

def finish(bm):
    bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])

def planar_uv(me, x0, x1, y0, y1):
    uv = me.uv_layers.new(name='UVMap')
    for loop in me.loops:
        co = me.vertices[loop.vertex_index].co
        uv.data[loop.index].uv = ((co.x - x0) / (x1 - x0), (co.y - y0) / (y1 - y0))

def apply_mods(ob):
    dg = bpy.context.evaluated_depsgraph_get()
    ev = ob.evaluated_get(dg)
    me = bpy.data.meshes.new_from_object(ev, preserve_all_data_layers=True, depsgraph=dg)
    old = ob.data
    ob.modifiers.clear()
    ob.data = me
    me.name = old.name
    bpy.data.meshes.remove(old)

def obj(name, bm, material, parent=None, loc=(0, 0, 0), bevel=0.0, seg=3, angle=50, smooth=True, uv=None, props=None):
    finish(bm)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    for m in (material if isinstance(material, (list, tuple)) else [material]):
        me.materials.append(m)
    if uv: planar_uv(me, *uv)
    ob = bpy.data.objects.new(name, me)
    ob.location = loc
    COL.objects.link(ob)
    if parent: ob.parent = parent
    if bevel > 0:
        md = ob.modifiers.new('Bevel', 'BEVEL')
        md.width = bevel; md.segments = seg
        md.limit_method = 'ANGLE'; md.angle_limit = math.radians(angle)
        apply_mods(ob)
    if smooth:
        for p in ob.data.polygons: p.use_smooth = True
        ob.data.set_sharp_from_angle(angle=math.radians(32))
    for k, v in (props or {}).items(): ob[k] = v
    return ob

def cut(target, cutter_bm, bevel=0.0, seg=3):
    finish(cutter_bm)
    me = bpy.data.meshes.new('cutter'); cutter_bm.to_mesh(me); cutter_bm.free()
    c = bpy.data.objects.new('cutter', me); COL.objects.link(c)
    md = target.modifiers.new('Bool', 'BOOLEAN'); md.operation = 'DIFFERENCE'; md.object = c
    try: md.solver = 'EXACT'
    except Exception: pass
    apply_mods(target)
    bpy.data.objects.remove(c); bpy.data.meshes.remove(me)
    if bevel > 0:
        md = target.modifiers.new('Bevel', 'BEVEL'); md.width = bevel; md.segments = seg
        md.limit_method = 'ANGLE'; md.angle_limit = math.radians(50)
        apply_mods(target)
    for p in target.data.polygons: p.use_smooth = True
    target.data.set_sharp_from_angle(angle=math.radians(32))
    return target

def empty(name, parent=None, loc=(0, 0, 0), props=None, size=0.4):
    e = bpy.data.objects.new(name, None)
    e.empty_display_size = size
    e.location = loc
    COL.objects.link(e)
    if parent: e.parent = parent
    for k, v in (props or {}).items(): e[k] = v
    return e

def part(root, pid, label, lift, side, anchor):
    p = empty('part_' + pid, root, props={'part': pid, 'label': label, 'lift': lift, 'side': side})
    if root.name == 'website':
        anchor = (side * 7.5, side * 4.5, anchor[2])
    else:
        anchor = (0.0, side * 4.55, anchor[2])
    empty('anchor_' + pid, p, loc=anchor, size=0.15)
    return p

def text(name, body, size, loc, material, parent, extrude=0.004, align='CENTER'):
    try:
        cu = bpy.data.curves.new(name, 'FONT')
        cu.body = body; cu.size = size; cu.extrude = extrude
        cu.align_x = align; cu.align_y = 'CENTER'
        tmp = bpy.data.objects.new(name + '_tmp', cu); COL.objects.link(tmp)
        dg = bpy.context.evaluated_depsgraph_get()
        me = bpy.data.meshes.new_from_object(tmp.evaluated_get(dg))
        bpy.data.objects.remove(tmp); bpy.data.curves.remove(cu)
        me.materials.clear(); me.materials.append(material)
        ob = bpy.data.objects.new(name, me); ob.location = loc
        COL.objects.link(ob); ob.parent = parent
        return ob
    except Exception as e:
        print('text failed', name, e)

def screw(name, parent, x, y, z, r=0.15, idx=0):
    """Torx screw: head, hexalobular recess and a threaded shank. The Empty is what animates."""
    e = empty(name, parent, loc=(x, y, z), props={'screw': float(idx)}, size=0.1)
    obj(name + '_head', prism(circle_pts(r, 32), 0.0, 0.065), STEEL, e, bevel=0.022, seg=3, angle=40)
    pts = []
    for k in range(48):
        a = 2 * math.pi * k / 48
        rr = r * 0.40 * (1 + 0.24 * math.cos(6 * a))
        pts.append((rr * math.cos(a), rr * math.sin(a)))
    obj(name + '_recess', prism(pts, 0.066, 0.069), RECESS, e, smooth=False)
    bm = bmesh.new(); cyl_into(bm, r * 0.40, -0.40, 0.0, seg=20)
    for t in range(7):
        ring_into(bm, r * 0.56, r * 0.40, -0.37 + t * 0.05, -0.35 + t * 0.05, seg=20)
    obj(name + '_thread', bm, STEEL, e)
    return e

def pipe(name, pts, r, material, parent):
    """Smooth tube along a bezier path (heat pipes)."""
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'
    cu.bevel_depth = r; cu.bevel_resolution = 4; cu.use_fill_caps = True; cu.resolution_u = 10
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(pts) - 1)
    for i, q in enumerate(pts):
        bp = sp.bezier_points[i]; bp.co = q; bp.handle_left_type = bp.handle_right_type = 'AUTO'
    tmp = bpy.data.objects.new(name + '_tmp', cu); COL.objects.link(tmp)
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(tmp.evaluated_get(dg))
    bpy.data.objects.remove(tmp); bpy.data.curves.remove(cu)
    me.materials.clear(); me.materials.append(material)
    for f in me.polygons: f.use_smooth = True
    ob = bpy.data.objects.new(name, me); COL.objects.link(ob); ob.parent = parent
    return ob

def box_uv(me, scale=0.5):
    """Box-projected UVs so micro-texture (bead blast, brushed metal) can tile on any part."""
    if me.uv_layers: return
    uv = me.uv_layers.new(name='UVMap')
    for poly in me.polygons:
        n = poly.normal; ax = max(range(3), key=lambda i: abs(n[i]))
        for li in poly.loop_indices:
            co = me.vertices[me.loops[li].vertex_index].co
            u, v = ((co.y, co.z), (co.x, co.z), (co.x, co.y))[ax]
            uv.data[li].uv = (u * scale, v * scale)

# ================================================================ WEBSITE DEVICE
W, H, R = 16.0, 10.0, 0.9
SW, SH, SR = L['screen']['w'], L['screen']['h'], L['screen']['r']
web = empty('website', props={'product': 'website'}, size=1.0)

def uv_to_xy(u, v):
    return ((u - 0.5) * SW, (0.5 - v) * SH)

# -- base: aluminium case with front perforation + ports, and the foot
p = part(web, 'base', 'Foundation', 0.0, 1, (7.3, -4.2, 1.6))
case = obj('case', prism(rr_pts(W, H, R, 14), 0.0, 1.6), ALU, p, smooth=False)
c = prism(rr_pts(W - 0.44, H - 0.44, R - 0.22, 14), 0.14, 2.2)
for i in range(27):                       # front perforation, two rows
    for zz in (0.55, 0.85):
        m = Matrix.Translation((-6.6 + i * 0.3, -H / 2, zz)) @ Matrix.Rotation(math.radians(90), 4, 'X')
        bmesh.ops.create_cone(c, cap_ends=True, segments=16, radius1=0.08, radius2=0.08, depth=1.2, matrix=m)
def slot(c, x, z, w, h):                  # port opening through the front wall
    bm2 = bmesh.new(); prism_into(bm2, rr_pts(w, h, h / 2, 6), -0.6, 0.6)
    bmesh.ops.rotate(bm2, verts=bm2.verts[:], cent=(0, 0, 0), matrix=Matrix.Rotation(math.radians(90), 3, 'X'))
    bmesh.ops.translate(bm2, verts=bm2.verts[:], vec=(x, -H / 2, z))
    me = bpy.data.meshes.new('t'); bm2.to_mesh(me); bm2.free(); c.from_mesh(me); bpy.data.meshes.remove(me)
slot(c, 4.4, 0.72, 0.72, 0.26); slot(c, 5.4, 0.72, 0.72, 0.26); slot(c, 6.55, 0.72, 1.0, 0.1)
cut(case, c, bevel=0.035)
bm = bmesh.new(); cyl_into(bm, 3.4, -0.16, 0.0, seg=72)
obj('foot', bm, RUBBER, p, bevel=0.03)
text('engrave1', 'Designed by Erik in Stockholm.', 0.36, (0, -3.75, 0.14), ENGRAVE, p)
text('engrave2', 'Modelled in Blender. Rendered in your browser.', 0.2, (0, -4.25, 0.14), ENGRAVE, p)

# -- fans
p = part(web, 'fans', 'Infra & delivery', 2.0, -1, (-7.0, -4.0, 0.62))
bm = prism(rr_pts(W - 0.8, H - 0.8, 0.65, 12), 0.16, 0.2)
plate = obj('fan_plate', bm, GRAPH, p, smooth=False)
c = bmesh.new()
for sx in (-1, 1): cyl_into(c, 2.6, 0.0, 0.5, cx=sx * 4.2, seg=72)
cut(plate, c, bevel=0.012)
for sx, nm in ((-1, 'L'), (1, 'R')):
    bm = bmesh.new(); ring_into(bm, 2.78, 2.6, 0.2, 0.62, cx=sx * 4.2, seg=96)
    obj('fan_housing_' + nm, bm, BLACK, p, bevel=0.015)
    rot = bmesh.new()
    cyl_into(rot, 0.74, -0.19, 0.17, seg=48)
    nb = 29
    for i in range(nb):                     # swept, pitched airfoil blades, like a blower fan
        blade = bmesh.new()
        bmesh.ops.create_grid(blade, x_segments=10, y_segments=3, size=0.5)
        r_ = bmesh.ops.extrude_face_region(blade, geom=blade.faces[:], use_keep_orig=True)
        nv = [g for g in r_['geom'] if isinstance(g, bmesh.types.BMVert)]
        bmesh.ops.translate(blade, verts=nv, vec=(0, 0, 0.028))
        for v in blade.verts:
            t = v.co.x + 0.5; chord = v.co.y * 0.36; zt = v.co.z
            rr = 0.72 + t * (2.47 - 0.72)
            pitch = math.radians(36 - 14 * t)
            ang = 2 * math.pi * i / nb + chord * math.cos(pitch) / rr + 0.62 * t
            v.co = (rr * math.cos(ang), rr * math.sin(ang), chord * math.sin(pitch) + zt - 0.014)
        bmesh.ops.recalc_face_normals(blade, faces=blade.faces[:])
        me = bpy.data.meshes.new('b'); blade.to_mesh(me); blade.free(); rot.from_mesh(me); bpy.data.meshes.remove(me)
    ring_into(rot, 2.53, 2.40, 0.11, 0.17, seg=128)
    obj('rotor_' + nm, rot, ANOD, p, loc=(sx * 4.2, 0, 0.41), props={'spin': 1.0 if sx < 0 else -1.0})
    bm = bmesh.new(); cyl_into(bm, 0.6, 0.17, 0.2, seg=48)
    obj('rotor_cap_' + nm, bm, ALU, bpy.data.objects['rotor_' + nm], loc=(0, 0, 0), bevel=0.01)

for k, (sx, sy) in enumerate(((-1, -1), (1, -1), (1, 1), (-1, 1))):
    screw(f'fan_screw_{k}', bpy.data.objects['part_fans'], sx * 7.05, sy * 4.1, 0.2, 0.14, k)

# -- data
p = part(web, 'data', 'Data', 4.0, 1, (6.6, -3.0, 1.0))
obj('data_plate', prism(rr_pts(W - 1.4, H - 1.4, 0.55, 12), 0.64, 0.67), GRAPH, p, bevel=0.01)
for k, (sx, sy) in enumerate(((-1, -1), (1, -1), (1, 1), (-1, 1))):
    screw(f'data_screw_{k}', p, sx * 6.75, sy * 3.75, 0.67, 0.13, k)
for n, x in enumerate((-5.0, 0.0, 5.0)):
    for i in range(3):
        z0 = 0.67 + i * 0.13
        bm = bmesh.new(); cyl_into(bm, 1.35, z0, z0 + 0.08, cx=x, cy=-1.3, seg=64)
        obj(f'db{n}_disc{i}', bm, ALU, p, bevel=0.02, props={'sub': float(i)})
        if i < 2:
            bm = bmesh.new(); ring_into(bm, 1.3, 1.08, z0 + 0.08, z0 + 0.13, cx=x, cy=-1.3, seg=64)
            obj(f'db{n}_ring{i}', bm, CYANG, p, props={'sub': i + 0.5})
for sx in (-1, 1):
    bm = prism(rr_pts(4.6, 1.3, 0.08, 4, cx=sx * 3.8, cy=2.75), 0.67, 0.71)
    obj(f'ssd_{sx}', bm, PCB, p, bevel=0.008, uv=(sx * 3.8 - 2.3, sx * 3.8 + 2.3, 2.1, 3.4))
    bm = bmesh.new()
    for k in range(3): box_into(bm, sx * 3.8 - 1.9 + k * 1.25, 2.3, 0.71, sx * 3.8 - 0.95 + k * 1.25, 3.2, 0.77)
    obj(f'ssd_chips_{sx}', bm, BLACK, p, bevel=0.01)
    bm = bmesh.new()
    for k in range(8): box_into(bm, sx * 3.8 + sx * 2.05, 2.25 + k * 0.13, 0.71, sx * 3.8 + sx * 2.25, 2.32 + k * 0.13, 0.715)
    obj(f'ssd_pins_{sx}', bm, GOLD, p, smooth=False)

# -- core: the AI chip board
p = part(web, 'core', 'AI core', 6.2, -1, (-6.8, -3.6, 1.1))
obj('core_pcb', prism(rr_pts(15.0, 9.0, 0.6, 12), 1.02, 1.06), PCB, p, bevel=0.01, uv=(-7.5, 7.5, -4.5, 4.5))
for k, (sx, sy) in enumerate(((-1, -1), (1, -1), (1, 1), (-1, 1))):
    screw(f'core_screw_{k}', p, sx * 6.95, sy * 3.95, 1.06, 0.15, k)
# heat pipes from the chip to two fin stacks along the back edge
for sx in (-1, 1):
    pipe(f'heatpipe_a_{sx}', [(sx * 0.9, 2.15, 1.17), (sx * 0.95, 2.75, 1.15), (sx * 1.8, 3.3, 1.14), (sx * 3.1, 3.38, 1.14), (sx * 5.75, 3.38, 1.14)], 0.075, COPPER, p)
    pipe(f'heatpipe_b_{sx}', [(sx * 1.45, 2.15, 1.17), (sx * 1.5, 2.55, 1.15), (sx * 2.3, 3.78, 1.14), (sx * 3.1, 3.82, 1.14), (sx * 5.75, 3.82, 1.14)], 0.075, COPPER, p)
    bm = bmesh.new()
    box_into(bm, min(sx * 2.65, sx * 5.75), 2.92, 1.06, max(sx * 2.65, sx * 5.75), 4.2, 1.09)
    for f in range(23):
        x = sx * (2.72 + f * 0.135)
        box_into(bm, x - 0.013, 2.95, 1.09, x + 0.013, 4.17, 1.5)
    obj(f'fins_{sx}', bm, ALU, p, smooth=False)
bm = bmesh.new()
for k in range(5):
    prism_into(bm, rr_pts(0.52, 0.52, 0.06, 4, cx=-1.8 + k * 0.9, cy=-2.58), 1.06, 1.33)
obj('core_inductors', bm, FERRITE, p, bevel=0.025)
bodies, caps_, ends = bmesh.new(), bmesh.new(), bmesh.new()
placed = 0; tries = 0
while placed < 110 and tries < 5000:
    tries += 1
    x = rng.uniform(-7.0, 7.0); y = rng.uniform(-4.1, 4.1)
    if abs(x) < 2.55 and -2.95 < y < 2.6: continue          # chip + inductors
    if 2.8 < abs(x) < 3.9 and -1.9 < y < 2.3: continue      # memory
    if 2.5 < abs(x) < 5.9 and y > 2.75: continue            # fin stacks
    if abs(x) > 6.0 and abs(y) < 3.0: continue              # connectors
    if abs(x) > 6.6 and abs(y) > 3.6: continue              # screws
    horiz = rng.random() < 0.5
    lx, ly = (0.16, 0.08) if horiz else (0.08, 0.16)
    target = bodies if placed % 2 else caps_
    box_into(target, x - lx / 2 + 0.03 * horiz, y - ly / 2 + 0.03 * (not horiz), 1.06, x + lx / 2 - 0.03 * horiz, y + ly / 2 - 0.03 * (not horiz), 1.105)
    for e_ in (-1, 1):
        ex, ey = (x + e_ * (lx / 2 - 0.015), y) if horiz else (x, y + e_ * (ly / 2 - 0.015))
        box_into(ends, ex - (0.015 if horiz else ly / 4), ey - (ly / 4 if horiz else 0.015), 1.06, ex + (0.015 if horiz else ly / 4), ey + (ly / 4 if horiz else 0.015), 1.107)
    placed += 1
obj('core_resistors', bodies, BLACK, p, smooth=False)
obj('core_mlcc', caps_, MLCC, p, smooth=False)
obj('core_smd_ends', ends, ALU, p, smooth=False)
obj('core_crystal', prism(rr_pts(0.62, 0.3, 0.12, 6, cx=4.7, cy=-3.45), 1.06, 1.16), ALU, p, bevel=0.02)
obj('core_substrate', prism(rr_pts(4.6, 4.6, 0.12, 6, cy=0.2), 1.06, 1.1), SUBST, p, bevel=0.01)
bm = bmesh.new()
for cx_ in range(3):
    for cy_ in range(2):
        x0 = -1.545 + cx_ * 1.07; y0 = 0.2 - 1.51 + cy_ * 1.57
        prism_into(bm, rr_pts(0.95, 1.45, 0.06, 3, cx=x0 + 0.475, cy=y0 + 0.725), 1.1, 1.14)
obj('core_die', bm, CORE, p, bevel=0.008)
lid = obj('core_lid', prism(rr_pts(3.8, 3.8, 0.28, 8, cy=0.2), 1.14, 1.26), ALU, p, bevel=0.03, props={'sublift': 1.6})
text('core_lid_text', 'E1 Agent', 0.5, (0, 0.2, 1.26), ENGRAVE, lid)
bm = bmesh.new()
for sx in (-1, 1):
    for y in (1.85, 0.75, -0.35, -1.45):
        box_into(bm, sx * 3.35 - 0.48, y - 0.34, 1.06, sx * 3.35 + 0.48, y + 0.34, 1.15)
obj('core_memory', bm, BLACK, p, bevel=0.012)
bm = bmesh.new()                                   # gold traces: Manhattan routes from the chip to the edges
for side in (-1, 1):
    for k in range(9):
        y = -1.6 + k * 0.42 + 0.2
        xa = side * (2.3 + 2.6 + (k % 3) * 0.35)
        yt = y * 1.9
        x_end = side * 7.1
        box_into(bm, min(side * 2.3, xa) - 0.015, y - 0.015, 1.06, max(side * 2.3, xa) + 0.015, y + 0.015, 1.064)
        box_into(bm, xa - 0.015, min(y, yt) - 0.015, 1.06, xa + 0.015, max(y, yt) + 0.015, 1.064)
        box_into(bm, min(xa, x_end) - 0.015, yt - 0.015, 1.06, max(xa, x_end) + 0.015, yt + 0.015, 1.064)
for side in (-1, 1):
    for k in range(9):
        x = -1.6 + k * 0.4
        ya = 0.2 + side * (2.3 + 0.7 + (k % 2) * 0.3)
        box_into(bm, x - 0.015, min(0.2 + side * 2.3, ya) - 0.015, 1.06, x + 0.015, max(0.2 + side * 2.3, ya) + 0.015, 1.064)
        box_into(bm, min(x, x * 3.2) - 0.015, ya - 0.015, 1.06, max(x, x * 3.2) + 0.015, ya + 0.015, 1.064)
        box_into(bm, x * 3.2 - 0.015, min(ya, side * 4.3) - 0.015, 1.06, x * 3.2 + 0.015, max(ya, side * 4.3) + 0.015, 1.064)
obj('core_traces', bm, GOLD, p, smooth=False)
bm = bmesh.new()
placed = 0
while placed < 34:
    x = rng.uniform(-6.9, 6.9); y = rng.uniform(-4.0, 4.0)
    if abs(x) < 4.0 and abs(y - 0.2) < 2.9: continue
    if abs(x) > 6.0 and abs(y) < 2.9: continue
    if 2.5 < abs(x) < 5.9 and y > 2.7: continue
    if abs(x) > 6.6 and abs(y) > 3.6: continue
    cyl_into(bm, 0.075, 1.06, 1.17, cx=x, cy=y, seg=12); placed += 1
obj('core_caps', bm, ALU, p)
bm = bmesh.new()
for sy in (-1, 1): box_into(bm, 6.15, sy * 1.8 - 1.0, 1.06, 6.95, sy * 1.8 + 1.0, 1.32)
obj('core_connectors', bm, ALU, p, bevel=0.03)
bm = bmesh.new()
for sy in (-1, 1):
    for row in (-0.18, 0.18):
        for k in range(18):
            y = sy * 1.8 - 0.9 + k * 0.105
            box_into(bm, 6.55 + row - 0.03, y - 0.025, 1.32, 6.55 + row + 0.03, y + 0.025, 1.345)
obj('core_pins', bm, GOLD, p, smooth=False)

# -- api: acrylic routing plane with glowing endpoints
p = part(web, 'api', 'API & integrations', 8.2, 1, (6.8, -3.4, 1.3))
obj('api_sheet', prism(rr_pts(15.0, 9.0, 0.6, 12), 1.27, 1.30), ACRYL, p, bevel=0.01)
nodes = []
for gx in range(5):
    for gy in range(3):
        nodes.append((-5.6 + gx * 2.8 + rng.uniform(-0.5, 0.5), -2.6 + gy * 2.6 + rng.uniform(-0.5, 0.5)))
bm = bmesh.new()
for (x, y) in nodes: cyl_into(bm, 0.24, 1.30, 1.36, cx=x, cy=y, seg=32)
obj('api_nodes', bm, BLUEG, p)
bm = bmesh.new()
def link_into(bm, a, b, wdt=0.035):
    (x0, y0), (x1, y1) = a, b
    d = Vector((x1 - x0, y1 - y0, 0)); ln = d.length
    m = Matrix.Translation(((x0 + x1) / 2, (y0 + y1) / 2, 1.305)) @ Matrix.Rotation(math.atan2(d.y, d.x), 4, 'Z') @ Matrix.Diagonal((ln, wdt, 0.01, 1))
    bmesh.ops.create_cube(bm, size=1.0, matrix=m)
for i, a in enumerate(nodes):
    gx, gy = divmod(i, 3)
    if gy < 2: link_into(bm, a, nodes[i + 1])
    if gx < 4: link_into(bm, a, nodes[i + 3])
    if gx < 4 and gy < 2 and (gx + gy) % 2 == 0: link_into(bm, a, nodes[i + 4])
obj('api_links', bm, CYANG, p, smooth=False)
bm = bmesh.new()
for x, w in ((4.4, 0.72), (5.4, 0.72)): prism_into(bm, rr_pts(w - 0.06, 0.6, 0.1, 4, cx=x, cy=-4.1), 1.30, 1.52)
obj('api_ports', bm, ALU, p, bevel=0.02)

# -- components: the DOM, as physical tiles that mirror the website layout
p = part(web, 'components', 'Components', 10.2, -1, (-6.9, -3.2, 1.55))
obj('components_carrier', prism(rr_pts(15.2, 9.2, 0.55, 12), 1.36, 1.38), GLASS, p, bevel=0.008)
tops = []
tile_mat = {'white': CERAMIC, 'blue': LIBLUE, 'graphite': GRAPH}
for b in L['blocks']:
    u, v, w, h = b['rect']
    x0, y1 = uv_to_xy(u, v); x1, y0 = uv_to_xy(u + w, v + h)
    pad = 0.05
    x0 += pad; x1 -= pad; y0 += pad; y1 -= pad
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    base = 1.38
    for (tx0, ty0, tx1, ty1, tz) in tops:
        if tx0 <= cx <= tx1 and ty0 <= cy <= ty1: base = max(base, tz)
    th = b['h'] * 0.8
    if b.get('round'):
        pts = circle_pts(min(x1 - x0, y1 - y0) / 2, 48, cx, cy)
    else:
        rr = min(x1 - x0, y1 - y0) / 2 if b.get('pill') else 0.14
        pts = rr_pts(x1 - x0, y1 - y0, rr, 8, cx, cy)
    obj('tile_' + b['id'], prism(pts, base, base + th), tile_mat[b['tile']], p, bevel=min(0.03, th / 3), props={'tag': b['tag']})
    tops.append((x0, y0, x1, y1, base + th))

# -- frame
p = part(web, 'frame', '', 12.2, 1, (7.6, -4.6, 1.83))
fr = obj('frame', prism(rr_pts(W, H, R, 14), 1.6, 1.83), ALU, p, smooth=False)
cut(fr, prism(rr_pts(SW, SH, SR, 12), 1.0, 2.5), bevel=0.03)

# -- display with the x-ray surface
p = part(web, 'display', 'Frontend', 13.8, 1, (7.4, 3.4, 1.79))
obj('display_panel', prism(rr_pts(SW - 0.02, SH - 0.02, SR, 12), 1.62, 1.784), DISPLAY, p, bevel=0.008)
bm = bmesh.new()
vs = [bm.verts.new((x, y, 1.788)) for x, y in rr_pts(SW - 0.06, SH - 0.06, SR, 12)]
bm.faces.new(vs)
obj('xray_surface', bm, XRAY, p, smooth=False, uv=(-SW / 2, SW / 2, -SH / 2, SH / 2))

# -- the website itself, pre-fractured from the button the visitor will press
p = part(web, 'shards', 'Website', 15.0, 1, (7.4, 3.4, 1.83))
ix, iy = uv_to_xy(*L['impact'])
outline = rr_pts(SW, SH, SR, 4)
bpts = []
for i in range(len(outline)):                       # resample the outline
    a = Vector(outline[i]); b = Vector(outline[(i + 1) % len(outline)])
    n = max(1, int((b - a).length / 1.25))
    for k in range(n): bpts.append(tuple(a.lerp(b, k / n)))
ipts = []
for r_, n_ in ((0.32, 5), (0.85, 7), (1.6, 9), (2.6, 10), (3.9, 11), (5.4, 12), (7.2, 13), (9.4, 14), (12.0, 15), (15.0, 16)):
    off = rng.uniform(0, math.tau)
    for k in range(n_):
        a = off + math.tau * k / n_ + rng.uniform(-0.18, 0.18) * math.tau / n_
        rr = r_ * rng.uniform(0.86, 1.12)
        x, y = ix + rr * math.cos(a), iy + rr * math.sin(a)
        if abs(x) < SW / 2 - 0.35 and abs(y) < SH / 2 - 0.35: ipts.append((x, y))
ipts.append((ix, iy))
allpts = [Vector((x, y)) for x, y in bpts + ipts]
res = delaunay_2d_cdt(allpts, [], [], 0, 1e-5)
verts2, faces2 = res[0], res[2]
tris = [tuple(f) for f in faces2]
# merge neighbouring triangles into quads so shards look like glass, not a mesh
edge_map = {}
for ti, t in enumerate(tris):
    for e in ((t[0], t[1]), (t[1], t[2]), (t[2], t[0])):
        edge_map.setdefault(tuple(sorted(e)), []).append(ti)
used = set(); polys = []
order = sorted(range(len(tris)), key=lambda i: rng.random())
for ti in order:
    if ti in used: continue
    t = tris[ti]; best = None
    for e in ((t[0], t[1]), (t[1], t[2]), (t[2], t[0])):
        for tj in edge_map[tuple(sorted(e))]:
            if tj != ti and tj not in used:
                ln = (verts2[e[0]] - verts2[e[1]]).length
                if best is None or ln > best[0]: best = (ln, tj, e)
    used.add(ti)
    if best and rng.random() < 0.8:
        _, tj, e = best
        other = [v for v in tris[tj] if v not in e][0]
        a, b = e
        k = list(t).index(a)
        poly = list(t[k:] + t[:k])          # starts at a
        if poly[1] == b: poly = [a, other, b, poly[2]]
        else: poly = [a, poly[1], b, other]
        used.add(tj); polys.append(poly)
    else:
        polys.append(list(t))
shard_count = 0
for si, poly in enumerate(polys):
    pts = [verts2[i] for i in poly]
    c2 = sum(pts, Vector((0, 0))) / len(pts)
    area = 0.0
    for i in range(len(pts)):
        a, b = pts[i], pts[(i + 1) % len(pts)]
        area += a.x * b.y - b.x * a.y
    if area < 0: pts = pts[::-1]
    if abs(area) < 1e-4: continue
    bm = prism([(q.x - c2.x, q.y - c2.y) for q in pts], -0.02, 0.02)
    finish(bm)
    me = bpy.data.meshes.new(f'shard_{si:03d}'); bm.to_mesh(me); bm.free()
    me.materials.append(WEBSITE)
    uvl = me.uv_layers.new(name='UVMap')
    for loop in me.loops:
        co = me.vertices[loop.vertex_index].co
        uvl.data[loop.index].uv = ((co.x + c2.x + SW / 2) / SW, (co.y + c2.y + SH / 2) / SH)
    ob = bpy.data.objects.new(f'shard_{si:03d}', me)
    ob.location = (c2.x, c2.y, 1.81); COL.objects.link(ob); ob.parent = p
    ob['shard'] = 1.0
    ob['dist'] = (c2 - Vector((ix, iy))).length
    shard_count += 1
print('shards', shard_count)

# ================================================================ PHONE
PW, PH, PR = 4.6, 9.6, 0.78
phone = empty('phone', props={'product': 'phone'}, size=1.0)

p = part(phone, 'chassis', 'iOS & Android', 0.0, -1, (-2.2, -3.6, 0.8))
ch = obj('chassis', prism(rr_pts(PW, PH, PR, 14), 0.0, 0.8), TITAN, p, smooth=False)
cut(ch, prism(rr_pts(PW - 0.24, PH - 0.24, PR - 0.12, 14), 0.08, 1.5), bevel=0.04)
obj('camera_bump', prism(rr_pts(1.95, 1.95, 0.52, 10, cx=-1.05, cy=3.45), -0.1, 0.02), TITAN, p, bevel=0.04)
for (lx, ly) in ((-1.5, 3.9), (-1.5, 3.0), (-0.6, 3.45)):
    bm = bmesh.new(); cyl_into(bm, 0.4, -0.15, -0.08, cx=lx, cy=ly, seg=48)
    obj(f'lens_ring_{lx}_{ly}', bm, BLACK, p, bevel=0.015)
    bm = bmesh.new(); cyl_into(bm, 0.3, -0.18, -0.12, cx=lx, cy=ly, seg=48)
    obj(f'lens_{lx}_{ly}', bm, LENS, p, bevel=0.02)
bm = bmesh.new()
box_into(bm, -PW / 2 - 0.05, 2.2, 0.3, -PW / 2 + 0.02, 2.9, 0.55)
box_into(bm, -PW / 2 - 0.05, 1.2, 0.3, -PW / 2 + 0.02, 1.9, 0.55)
box_into(bm, PW / 2 - 0.02, 1.4, 0.3, PW / 2 + 0.05, 2.6, 0.55)
obj('buttons', bm, TITAN, p, bevel=0.02)

p = part(phone, 'native', 'Native modules', 1.2, -1, (2.0, 3.9, 0.3))
obj('native_board', prism(rr_pts(4.0, 3.9, 0.3, 6, cy=2.55), 0.1, 0.14), PCB, p, bevel=0.008, uv=(-2.0, 2.0, 0.6, 4.5))
for k, (x, y) in enumerate(((-1.75, 0.85), (-1.75, 4.25), (1.75, 4.25))):
    screw(f'native_screw_{k}', p, x, y, 0.14, 0.09, k)
obj('native_soc', prism(rr_pts(1.5, 1.5, 0.08, 4, cx=0.4, cy=2.6), 0.14, 0.17), SUBST, p, bevel=0.006)
lid2 = obj('native_lid', prism(rr_pts(1.3, 1.3, 0.14, 6, cx=0.4, cy=2.6), 0.17, 0.25), ALU, p, bevel=0.02)
text('native_lid_text', 'E1 Native', 0.2, (0.4, 2.6, 0.25), ENGRAVE, lid2)
bm = bmesh.new()
box_into(bm, -1.6, 3.2, 0.14, -0.6, 3.9, 0.22); box_into(bm, -1.6, 1.4, 0.14, -0.6, 2.4, 0.22); box_into(bm, 1.4, 1.0, 0.14, 1.85, 1.5, 0.2)
obj('native_chips', bm, BLACK, p, bevel=0.01)

p = part(phone, 'battery', 'Expo · EAS', 1.2, -1, (-1.95, -3.6, 0.42))
obj('battery_cell', prism(rr_pts(3.8, 4.6, 0.35, 8, cy=-2.1), 0.1, 0.42), BATT, p, bevel=0.04)
obj('battery_label', prism(rr_pts(2.4, 0.5, 0.25, 6, cy=-1.2), 0.42, 0.425), LIBLUE, p, smooth=False)

p = part(phone, 'turbo', 'Turbo Modules', 2.4, 1, (2.0, -3.4, 0.6))
obj('turbo_carrier', prism(rr_pts(4.2, 9.0, 0.6, 10), 0.44, 0.46), GRAPH, p, bevel=0.008)
bm = bmesh.new(); bm2 = bmesh.new()
for row, y in enumerate((3.1, 1.1, -0.9, -2.9)):
    for x in (-0.95, 0.95):
        prism_into(bm, rr_pts(1.6, 1.6, 0.28, 6, cx=x, cy=y), 0.46, 0.6)
        cyl_into(bm2, 0.13, 0.6, 0.63, cx=x + 0.45, cy=y + 0.45, seg=20)
obj('turbo_modules', bm, CERAMIC, p, bevel=0.03)
obj('turbo_leds', bm2, BLUEG, p)

p = part(phone, 'jsi', 'JSI', 3.6, -1, (-2.1, 2.4, 0.5))
bm = bmesh.new()
for k in range(10):
    y = -4.3 + k * (8.6 / 9)
    box_into(bm, -2.0, y - 0.02, 0.48, 2.0, y + 0.02, 0.5)
for k in range(5):
    x = -2.0 + k * 1.0
    box_into(bm, x - 0.02, -4.3, 0.48, x + 0.02, 4.3, 0.5)
obj('jsi_lattice', bm, CYANG, p, smooth=False)
bm = bmesh.new()
for k in range(10):
    for j in range(5):
        box_into(bm, -2.0 + j - 0.06, -4.3 + k * (8.6 / 9) - 0.06, 0.475, -2.0 + j + 0.06, -4.3 + k * (8.6 / 9) + 0.06, 0.505)
obj('jsi_nodes', bm, ALU, p, smooth=False)

p = part(phone, 'hermes', 'Hermes', 4.8, 1, (2.0, 1.2, 0.56))
obj('hermes_carrier', prism(rr_pts(4.2, 9.0, 0.6, 10), 0.52, 0.54), ACRYL, p, bevel=0.008)
obj('hermes_substrate', prism(rr_pts(2.2, 2.2, 0.12, 6, cy=0.4), 0.54, 0.57), SUBST, p, bevel=0.008)
obj('hermes_die', prism(rr_pts(1.5, 1.5, 0.1, 6, cy=0.4), 0.57, 0.6), CORE, p, bevel=0.006)
text('hermes_text', 'JS', 0.55, (0, 0.4, 0.6), BLACK, p, extrude=0.006)

p = part(phone, 'fabric', 'Fabric', 6.0, -1, (-2.1, -2.6, 0.62))
bm = bmesh.new()
for (x0, y0, x1, y1) in ((-2.0, 4.05, 2.0, 4.4), (-2.0, 2.0, 2.0, 3.8), (-2.0, 0.2, 2.0, 1.7), (-2.0, -1.6, -0.1, -0.1),
                         (0.1, -1.6, 2.0, -0.1), (-2.0, -3.3, 2.0, -1.9), (-2.0, -4.4, 2.0, -3.7)):
    prism_into(bm, rr_pts(x1 - x0, y1 - y0, 0.15, 6, cx=(x0 + x1) / 2, cy=(y0 + y1) / 2), 0.58, 0.64)
obj('fabric_views', bm, FROST, p, bevel=0.02)
bm = bmesh.new(); cyl_into(bm, 0.55, 0.64, 0.7, cx=-1.2, cy=2.9, seg=40)
obj('fabric_avatar', bm, LIBLUE, p, bevel=0.02)

p = part(phone, 'screen', 'React Native', 7.2, 1, (2.15, 3.6, 0.78))
obj('phone_display', prism(rr_pts(PW - 0.26, PH - 0.26, PR - 0.13, 12), 0.66, 0.775), DISPLAY, p, bevel=0.008)
bm = bmesh.new()
vs = [bm.verts.new((x, y, 0.779)) for x, y in rr_pts(PW - 0.3, PH - 0.3, PR - 0.15, 12)]
bm.faces.new(vs)
obj('app_surface', bm, APPSURF, p, smooth=False, uv=(-(PW - 0.3) / 2, (PW - 0.3) / 2, -(PH - 0.3) / 2, (PH - 0.3) / 2))

p = part(phone, 'glass', '', 8.4, 1, (2.2, 4.4, 0.85))
obj('phone_glass', prism(rr_pts(PW, PH, PR, 14), 0.8, 0.85), GLASS, p, bevel=0.02)

phone.rotation_euler = (math.radians(90), 0, 0)   # stand the phone up only after its booleans ran in local space

# ================================================================ stage for the .blend (not exported)
world = bpy.data.worlds.new('Studio'); SC.world = world
try:
    world.use_nodes = True
except Exception: pass
bg = world.node_tree.nodes.get('Background')
if bg: bg.inputs[0].default_value = (0.01, 0.01, 0.012, 1); bg.inputs[1].default_value = 0.6
cam_data = bpy.data.cameras.new('Camera'); cam_data.lens = 60
cam = bpy.data.objects.new('Camera', cam_data); COL.objects.link(cam)
cam.location = (22, -30, 26); cam.rotation_euler = (math.radians(55), 0, math.radians(36)); SC.camera = cam
for nm, loc, energy, size in (('Key', (10, -12, 18), 2500, 8), ('Rim', (-14, 10, 12), 1800, 6)):
    ld = bpy.data.lights.new(nm, 'AREA'); ld.energy = energy; ld.size = size
    lo = bpy.data.objects.new(nm, ld); lo.location = loc; COL.objects.link(lo)
    lo.rotation_euler = (Vector((0, 0, 1)).rotation_difference(Vector(loc).normalized())).to_euler()

# ================================================================ export
for o in SC.objects:
    if o.type == 'MESH': box_uv(o.data)
for o in list(SC.objects):
    o.select_set(o.type in ('MESH', 'EMPTY'))
bpy.ops.export_scene.gltf(
    filepath=os.path.join(OUT, 'scene.glb'), export_format='GLB', use_selection=True,
    export_extras=True, export_yup=True, export_apply=False, export_cameras=False, export_lights=False,
    export_materials='EXPORT', export_image_format='NONE')
bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(os.path.join(OUT, 'dreifaldt.blend')))
print('done', os.path.getsize(os.path.join(OUT, 'scene.glb')))
