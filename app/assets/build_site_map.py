"""Builds site-map-sketch.svg, a placeholder Freedom Fest site map for the prototype.
Layout is invented; replace with the real grounds once known."""
import math, random

W, H = 600, 860
NAVY = "#0B1328"; BUTTER = "#F0E9B2"; PAPER = "#FFFDF2"; BLUE = "#2F63D6"
VIOLET = "#8F72F0"; GREEN = "#2DB36B"; RED = "#D62B34"; YELLOW = "#F9D84A"; ORANGE = "#F28B22"
WATER = "#A9D8EE"; WATER_EDGE = "#5FAFD6"; TREE = "#1F3A27"; FIELD = "#E5DD9C"

out = []
add = out.append
FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

def label(x, y, text, sub=None, fill=PAPER, stroke=NAVY, size=13, w=None):
    lines = [text] + ([sub] if sub else [])
    tw = w or max(len(text) * size * 0.6, len(sub or "") * 10 * 0.58) + 18
    th = size + 12 + (13 if sub else 0)
    add(f'<g><rect x="{x - tw/2:.1f}" y="{y - th/2:.1f}" width="{tw:.1f}" height="{th}" rx="9" fill="{fill}" stroke="{stroke}" stroke-width="1.6"/>')
    ty = y - (6 if sub else 0) + size * 0.36
    add(f'<text x="{x}" y="{ty:.1f}" text-anchor="middle" font-size="{size}" font-weight="700" fill="{NAVY}">{text}</text>')
    if sub:
        add(f'<text x="{x}" y="{ty + 14:.1f}" text-anchor="middle" font-size="10" fill="#474D6B">{sub}</text>')
    add('</g>')

def badge(x, y, kind):
    colors = {"water": BLUE, "wc": "#474D6B", "aid": RED, "info": VIOLET, "fire": ORANGE}
    add(f'<circle cx="{x}" cy="{y}" r="11" fill="{colors[kind]}" stroke="{PAPER}" stroke-width="2.5"/>')
    if kind == "water":
        add(f'<path d="M{x},{y-6} C{x+5},{y} {x+5},{y+5} {x},{y+5} C{x-5},{y+5} {x-5},{y} {x},{y-6}Z" fill="{PAPER}"/>')
    elif kind == "wc":
        add(f'<text x="{x}" y="{y+3.5}" text-anchor="middle" font-size="9" font-weight="800" fill="{PAPER}">WC</text>')
    elif kind == "aid":
        add(f'<path d="M{x-2.5},{y-7}h5v4.5h4.5v5h-4.5v4.5h-5v-4.5h-4.5v-5h4.5z" fill="{PAPER}"/>')
    elif kind == "info":
        add(f'<text x="{x}" y="{y+4.5}" text-anchor="middle" font-size="13" font-weight="800" font-style="italic" font-family="Georgia,serif" fill="{PAPER}">i</text>')
    elif kind == "fire":
        add(f'<path d="M{x},{y-7} C{x+6},{y-1} {x+5},{y+6} {x},{y+6} C{x-5},{y+6} {x-6},{y} {x-2},{y-3} C{x-1},{y} {x+1},{y} {x},{y-7}Z" fill="{PAPER}"/>')

def tree(x, y, s=1.0):
    add(f'<path d="M{x},{y-22*s} L{x+8*s},{y-8*s} L{x+5*s},{y-8*s} L{x+11*s},{y+2*s} L{x+2*s},{y+2*s} L{x+2*s},{y+7*s} L{x-2*s},{y+7*s} L{x-2*s},{y+2*s} L{x-11*s},{y+2*s} L{x-5*s},{y-8*s} L{x-8*s},{y-8*s}Z" fill="{TREE}"/>')

def grove(x0, y0, x1, y1, n, seed):
    r = random.Random(seed)
    pts = sorted(((r.uniform(x0, x1), r.uniform(y0, y1), r.uniform(0.75, 1.2)) for _ in range(n)), key=lambda p: p[1])
    for x, y, s in pts:
        tree(x, y, s)

add(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{FONT}">')
add('<title>Freedom Fest site map (sketch)</title>')
add(f'<rect width="{W}" height="{H}" fill="{BUTTER}"/>')

# Slough along the east and north edges
add(f'<path d="M455,0 C470,90 430,150 470,230 C510,310 500,400 525,480 C548,560 520,650 548,740 C560,790 556,830 560,{H} L{W},{H} L{W},0Z" fill="{WATER}" stroke="{WATER_EDGE}" stroke-width="2"/>')
for i in range(9):
    y = 60 + i * 92
    add(f'<path d="M{548 + (i%2)*10},{y} q8,-5 16,0 t16,0" fill="none" stroke="{WATER_EDGE}" stroke-width="1.6" stroke-linecap="round"/>')
add(f'<text x="575" y="430" font-size="12" font-weight="700" fill="#2B6E93" font-style="italic" transform="rotate(90 575 430)" text-anchor="middle">Slough</text>')

# Fields
add(f'<rect x="48" y="150" width="250" height="185" rx="22" fill="{FIELD}"/>')  # main stage lawn
add(f'<rect x="40" y="690" width="215" height="140" rx="14" fill="#D9D4B8" stroke="#9C9677" stroke-width="1.5"/>')  # parking
add(f'<rect x="325" y="700" width="170" height="125" rx="14" fill="#D9D4B8" stroke="#9C9677" stroke-width="1.5"/>')  # overflow parking
for i in range(6):
    add(f'<line x1="{60 + i*34}" y1="705" x2="{60 + i*34}" y2="815" stroke="{PAPER}" stroke-width="2" stroke-dasharray="10 8"/>')
for i in range(4):
    add(f'<line x1="{343 + i*38}" y1="715" x2="{343 + i*38}" y2="812" stroke="{PAPER}" stroke-width="2" stroke-dasharray="10 8"/>')

# Camping zones
add(f'<rect x="20" y="365" width="122" height="205" rx="20" fill="#D8E9C2" stroke="{GREEN}" stroke-width="2" stroke-dasharray="7 6"/>')
add(f'<rect x="318" y="52" width="130" height="178" rx="20" fill="#D8E9C2" stroke="{GREEN}" stroke-width="2" stroke-dasharray="7 6"/>')
for (x, y) in [(50, 415), (105, 410), (60, 470), (115, 465), (50, 530), (105, 525), (350, 95), (405, 90), (365, 160), (420, 150)]:
    add(f'<path d="M{x-12},{y+8} L{x},{y-9} L{x+12},{y+8}Z" fill="{ORANGE}" stroke="{NAVY}" stroke-width="1.2"/>')

# Trees
grove(12, 20, 300, 60, 11, 1)
grove(8, 600, 40, 690, 4, 2)
grove(330, 255, 495, 290, 6, 3)
grove(455, 300, 505, 380, 4, 4)
grove(190, 585, 240, 640, 3, 5)
grove(270, 840, 330, 858, 0, 6)

# Paths
P = f'fill="none" stroke="{PAPER}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"'
D = f'fill="none" stroke="#B5AD78" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round" stroke-linejoin="round"'
paths = [
    "M300,860 L300,600 C300,520 290,470 290,420 L290,250",
    "M290,330 C330,330 360,325 395,322",
    "M290,485 C230,485 180,480 142,478",
    "M290,250 C320,245 350,240 375,230",
    "M300,700 L300,680",
    "M300,640 C260,640 235,700 200,700",
    "M300,660 C340,660 380,690 410,700",
]
for d in paths:
    add(f'<path d="{d}" {P}/>')
for d in paths:
    add(f'<path d="{d}" {D}/>')

# Stages
add(f'<rect x="70" y="80" width="200" height="56" rx="12" fill="#DCD3FB" stroke="{BLUE}" stroke-width="2.5"/>')
add(f'<text x="170" y="114" text-anchor="middle" font-size="17" font-weight="800" fill="{NAVY}">Main Stage</text>')
add(f'<text x="173" y="250" text-anchor="middle" font-size="11" font-weight="600" fill="#6E6A3F" font-style="italic">Main Stage lawn</text>')
add(f'<rect x="385" y="300" width="112" height="48" rx="12" fill="#DCD3FB" stroke="{BLUE}" stroke-width="2.5"/>')
add(f'<text x="441" y="321" text-anchor="middle" font-size="14" font-weight="800" fill="{NAVY}">Shaman</text>')
add(f'<text x="441" y="338" text-anchor="middle" font-size="14" font-weight="800" fill="{NAVY}">Stage</text>')

# Places
label(81, 384, "West camping", size=11, fill="#EEF6E3", stroke=GREEN)
label(383, 205, "North camping", size=11, fill="#EEF6E3", stroke=GREEN)
label(212, 420, "Kitchen", sub="Ice &amp; supply drop-off")
label(400, 455, "Kids' area")
label(360, 560, "Volunteer HQ", sub="Security · Lost &amp; found")
label(255, 638, "Info booth", size=12)
label(370, 628, "Merch", size=12)
label(147, 760, "Parking", size=14)
label(410, 762, "Overflow parking", size=12)
label(300, 845, "Gate", size=13, fill=YELLOW)
label(212, 520, "Firewood", size=11)

# Facility badges
for x, y, k in [(205, 375, "water"), (348, 268, "water"), (430, 395, "water"), (95, 590, "water"),
                (318, 360, "wc"), (150, 345, "wc"), (465, 70, "wc"), (230, 690, "wc"),
                (180, 625, "aid"), (300, 608, "info"), (80, 500, "fire"), (380, 128, "fire")]:
    badge(x, y, k)

# Compass + sketch note
add(f'<g transform="translate(560,40)"><circle r="20" fill="{PAPER}" stroke="{NAVY}" stroke-width="1.5"/><path d="M0,-14 L6,4 L0,0 L-6,4Z" fill="{NAVY}"/><text y="15" text-anchor="middle" font-size="9" font-weight="800" fill="{NAVY}">N</text></g>')
add(f'<text x="14" y="{H-12}" font-size="10" fill="#474D6B" font-style="italic">Sketch for the demo. Not to scale.</text>')
add('</svg>')

with open("site-map-sketch.svg", "w") as f:
    f.write("\n".join(out))
print("ok")
