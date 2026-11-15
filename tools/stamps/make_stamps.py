import math
C={'Gnomerica':'#d9a441','Gnohio':'#7fa65a','Gnafrica':'#cf7346','Slanic':'#4f9a8f','Gno Dao Cradle':'#8a77b0',
   'Gni':'#b0609a','Slaanilok':'#e0887a',
'Shen Shin':'#9a6b3f','Gnufoundland':'#8fb3d6','Gnonmoon':'#4f5f86'}
K='#fbf3dc'; INK='#3b2a1a'
def gear(cx,cy,r,n=10):
    pts=[]
    for i in range(n*4):
        a=2*math.pi*i/(n*4); rr=r if (i%4) in (0,1) else r*0.78
        pts.append(f'{cx+rr*math.cos(a):.1f},{cy+rr*math.sin(a):.1f}')
    return f'<polygon points="{" ".join(pts)}" fill="{K}"/><circle cx="{cx}" cy="{cy}" r="{r*0.32}" fill="COL"/>'
S={
'Gnomerica': gear(60,72,30),
'Gnohio': f'<path d="M60 108 L60 46" stroke="{K}" stroke-width="4" stroke-linecap="round"/>'+''.join(
   f'<ellipse cx="{60+s*9}" cy="{y}" rx="5" ry="10" fill="{K}" transform="rotate({s*-30} {60+s*9} {y})"/>' for y in (54,68,82) for s in (-1,1))+f'<ellipse cx="60" cy="40" rx="5" ry="10" fill="{K}"/>',
'Gnafrica': f'<rect x="52" y="38" width="16" height="72" rx="8" fill="{K}"/><path d="M52 80 h-12 a6 6 0 0 1 -6 -6 v-16" stroke="{K}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M68 70 h12 a6 6 0 0 0 6 -6 v-12" stroke="{K}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
'Slanic': f'<path d="M24 74 Q24 38 60 38 Q96 38 96 74 Z" fill="{K}"/><rect x="50" y="74" width="20" height="32" rx="6" fill="{K}"/><circle cx="46" cy="56" r="6" fill="COL"/><circle cx="70" cy="50" r="5" fill="COL"/><circle cx="78" cy="64" r="4" fill="COL"/>',
'Gno Dao Cradle': f'<path d="M18 106 L48 50 L62 74 L76 44 L104 106 Z" fill="{K}"/><path d="M76 44 L68 58 L74 56 L78 62 L84 56 Z" fill="COL"/><path d="M48 50 L41 63 L48 60 L54 64 Z" fill="COL"/>',
'Gnufoundland': f'<path d="M44 108 L44 62 Q44 36 64 36 Q84 36 84 62 L84 108 Z" fill="{K}"/><path d="M44 74 Q30 70 32 56 Q34 46 44 52 Z" fill="{K}"/><rect x="40" y="94" width="48" height="12" rx="3" fill="COL" opacity="0.55"/>',
'Slaanilok': ''.join(f'<rect x="{60-w/2}" y="{y}" width="{w}" height="13" fill="{K}"/>' for w,y in ((80,96),(62,82),(44,68),(26,54)))+f'<rect x="54" y="42" width="12" height="12" fill="{K}"/>',
'Gni': f'<path d="M38 106 L38 64 Q38 40 60 40 Q82 40 82 64 L82 106 Z" fill="{K}"/><rect x="44" y="66" width="32" height="6" rx="2" fill="COL"/><rect x="57" y="76" width="6" height="22" rx="2" fill="COL"/><path d="M60 40 Q62 24 80 22 Q70 30 72 42 Z" fill="{K}"/>',
'Shen Shin': f'<rect x="20" y="56" width="80" height="12" rx="3" fill="{K}"/><rect x="28" y="68" width="10" height="40" fill="{K}"/><rect x="82" y="68" width="10" height="40" fill="{K}"/><rect x="38" y="76" width="44" height="6" fill="{K}"/>',
'Gnonmoon': f'<circle cx="62" cy="72" r="34" fill="{K}"/><circle cx="78" cy="62" r="30" fill="COL"/><circle cx="88" cy="96" r="3" fill="{K}"/><circle cx="94" cy="44" r="2.5" fill="{K}"/>',
}
order=['Gnomerica','Gnohio','Gnafrica','Slanic','Gno Dao Cradle','Gni','Slaanilok','Shen Shin','Gnufoundland','Gnonmoon']
W,H=120,145; out=[]
bg='#efe2c2'
for i,n in enumerate(order):
    x=30+(i%5)*160; y=30+(i//5)*200; col=C[n]
    g=[f'<g transform="translate({x},{y})">',f'<rect x="0" y="0" width="{W}" height="{H}" fill="#fffaf0"/>']
    for k in range(0,W+1,10): g+= [f'<circle cx="{k}" cy="0" r="4" fill="{bg}"/>',f'<circle cx="{k}" cy="{H}" r="4" fill="{bg}"/>']
    for k in range(0,H+1,10): g+= [f'<circle cx="0" cy="{k}" r="4" fill="{bg}"/>',f'<circle cx="{W}" cy="{k}" r="4" fill="{bg}"/>']
    g.append(f'<rect x="9" y="9" width="{W-18}" height="{H-18}" rx="4" fill="{col}"/>')
    g.append(f'<g transform="translate(0,0)">{S[n].replace("COL",col)}</g>')
    g.append('</g>')
    g.append(f'<text x="{x+W/2}" y="{y+H+24}" font-family="serif" font-size="15" text-anchor="middle" fill="{INK}">{n}</text>')
    out+=g
svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="830" height="430"><rect width="830" height="430" fill="{bg}"/><text x="415" y="420" font-family="serif" font-size="11" text-anchor="middle" fill="#7a3b2a">Region stamps v0.1, DRAFT placeholders for Mara (names below are for review only; stamps carry no text)</text>'+''.join(out)+'</svg>'
import os,sys; OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','docs','lore','stamps'); open(os.path.join(OUT,'region-stamps-v0.1.svg'),'w').write(svg)
