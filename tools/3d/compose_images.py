"""Add titles to the Cycles renders and export share images as JPEG."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
R = ROOT / 'renders'
OUT = ROOT.parent.parent / 'public'
FONTS = ROOT / 'node_modules/geist/dist/fonts'   # npm i geist (inside tools/3d)
def font(weight, size, mono=False):
    name = f"geist-mono/GeistMono-{weight}.ttf" if mono else f"geist-sans/Geist-{weight}.ttf"
    return ImageFont.truetype(str(FONTS / name), size)

def bloom(im, strength=0.55):
    """Cheap glow: blur the brightest parts and add them back, like the site's bloom pass."""
    lum = im.convert('L').point(lambda v: 255 if v > 200 else int(v * 0.15))
    glow = Image.merge('RGB', [ImageChops.multiply(c, lum) for c in im.split()]).filter(ImageFilter.GaussianBlur(18))
    return ImageChops.add(im, glow.point(lambda v: int(v * strength)))

def gradient_text(base, xy, text, fnt, stops):
    d = ImageDraw.Draw(base)
    x0, y0, x1, y1 = d.textbbox(xy, text, font=fnt)
    w, h = x1 - x0, y1 - y0
    grad = Image.new('RGB', (w, h))
    gd = ImageDraw.Draw(grad)
    for i in range(w):
        t = i / max(1, w - 1)
        for k in range(len(stops) - 1):
            a, b = stops[k], stops[k + 1]
            seg = (len(stops) - 1)
            if t <= (k + 1) / seg:
                u = (t - k / seg) * seg
                col = tuple(int(a[c] + (b[c] - a[c]) * u) for c in range(3)); break
        gd.line([(i, 0), (i, h)], fill=col)
    mask = Image.new('L', base.size, 0)
    ImageDraw.Draw(mask).text(xy, text, font=fnt, fill=255)
    base.paste(grad, (x0, y0), mask.crop((x0, y0, x1, y1)))
    return x1, y1

BLUE = [(100, 210, 255), (41, 151, 255), (10, 102, 194)]
AMBER = (255, 159, 10)
WHITE = (245, 245, 247)
SOFT = (210, 210, 215)
MUTED = (134, 134, 139)

def shade_left(im, width_frac=0.62):
    """Darken the left side so the text reads over the render."""
    w, h = im.size
    m = Image.new('L', (w, 1))
    for x in range(w):
        t = x / (w * width_frac)
        m.putpixel((x, 0), int(210 * max(0.0, 1 - t) ** 1.4))
    m = m.resize((w, h))
    return Image.composite(Image.new('RGB', im.size, (0, 0, 0)), im, m)

def og_home():
    im = bloom(Image.open(R / 'og-home.png').convert('RGB'))
    im = shade_left(im, 0.55)
    d = ImageDraw.Draw(im)
    d.text((72, 92), 'DREIFALDT.COM', font=font('Medium', 22, True), fill=AMBER)
    big = font('Bold', 92)
    d.text((66, 140), 'Look into', font=big, fill=WHITE)
    gradient_text(im, (66, 240), 'the backend.', big, BLUE)
    d.text((72, 392), 'Erik Dreifaldt', font=font('SemiBold', 32), fill=WHITE)
    d.text((72, 436), 'AI-native developer · Stockholm', font=font('Regular', 26), fill=SOFT)
    d.text((72, 474), 'React Native → native Swift & Kotlin', font=font('Regular', 26), fill=SOFT)
    im.save(OUT / 'og/home.jpg', quality=88, optimize=True, progressive=True)

def og_guide():
    im = bloom(Image.open(R / 'og-rn-to-native.png').convert('RGB'))
    im = shade_left(im, 0.58)
    d = ImageDraw.Draw(im)
    d.text((72, 92), 'FIELD GUIDE · 2026', font=font('Medium', 22, True), fill=AMBER)
    big = font('Bold', 84)
    d.text((66, 136), 'React Native', font=big, fill=WHITE)
    gradient_text(im, (66, 232), '→ native', big, BLUE)
    d.text((72, 372), 'When to move to Swift and Kotlin,', font=font('Regular', 28), fill=SOFT)
    d.text((72, 410), 'and how to do it with coding agents.', font=font('Regular', 28), fill=SOFT)
    d.text((72, 520), 'dreifaldt.com · Erik Dreifaldt', font=font('Medium', 22, True), fill=MUTED)
    im.save(OUT / 'og/rn-to-native.jpg', quality=88, optimize=True, progressive=True)

def hero():
    src = R / 'hero-phone.png'
    im = bloom(Image.open(src if src.exists() else R / 'og-rn-to-native.png').convert('RGB'))
    (OUT / 'react-native-to-native').mkdir(exist_ok=True)
    im.resize((1200, 630), Image.LANCZOS).save(OUT / 'react-native-to-native/hero.jpg', quality=86, optimize=True, progressive=True)

def post(name, lines, sub, drop=0):
    src = bloom(Image.open(R / f'{name}.png').convert('RGB'))
    w, h = src.size
    im = Image.new('RGB', (w, h), src.getpixel((4, 4)))
    im.paste(src, (0, drop))
    top = Image.new('L', (1, h))
    for y in range(h):
        top.putpixel((0, y), int(200 * max(0.0, 1 - y / (h * 0.38)) ** 1.3))
    im = Image.composite(Image.new('RGB', im.size, (0, 0, 0)), im, top.resize((w, h)))
    d = ImageDraw.Draw(im)
    big = font('Bold', 76)
    y = 70
    for i, (txt, grad) in enumerate(lines):
        if grad: gradient_text(im, (64, y), txt, big, BLUE)
        else: d.text((64, y), txt, font=big, fill=WHITE)
        y += 88
    d.text((70, h - 84), sub, font=font('Medium', 26, True), fill=SOFT)
    (ROOT / 'linkedin').mkdir(exist_ok=True)
    im.save(ROOT / 'linkedin' / f'{name}.jpg', quality=88, optimize=True, progressive=True)

if __name__ == '__main__':
    import sys
    which = sys.argv[1:] or ['og_home', 'og_guide', 'hero', 'posts']
    if 'og_home' in which: og_home()
    if 'og_guide' in which: og_guide()
    if 'hero' in which: hero()
    if 'posts' in which:
        post('post-phone', [('React Native', False), ('→ native.', True)], 'dreifaldt.com/react-native-to-native')
        post('post-home', [('Look into', False), ('the backend.', True)], 'dreifaldt.com', drop=150)
    print('composed', which)
