# Box face mock (Claudia, 2026-11-23).  Draws the approved v0.3 layout from the art masters for review only; the game never loads it.
# Run from anywhere:  python3 tools/mocks/box_face_mock.py   (writes tools/out/box-face-mock.png)
import glob
from PIL import Image, ImageDraw, ImageFont
import os
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..')
A=os.path.join(R,'art-masters/packing-line/'); G=os.path.join(R,'assets/packing/')
FB='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'; FR='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'; FS='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def tight(im): return im.crop(im.getchannel('A').point(lambda v:255 if v>40 else 0).getbbox())
def load(p,w):
    im=tight(Image.open(p).convert('RGBA')); return im.resize((max(1,int(w)),max(1,int(im.height*w/im.width))),Image.LANCZOS)
def hz(n): return glob.glob(A+f'15-16-hazard-stamps/hazard-{n:02d}-*.png')[0]
# Front face of each box, as fractions of the tightly cropped box art (measured on a 5% grid).
FACE={'plain':(0.03,0.21,0.97,0.97),'temp':(0.10,0.48,0.90,0.86)}
# Layout, all as fractions of the box width.  m = the same gap from the face's top, left and right edges.
L={'plain':dict(m=0.045,rs=0.10,hs=0.085,gap=0.02,ss=0.065,lw=0.50,ly=0.56),
   'temp': dict(m=0.035,rs=0.085,hs=0.075,gap=0.015,ss=0.065,lw=0.40,ly=0.625)}
def label(w,town,region):
    lb=load(A+'07-address-label/address_label.png',w); d=ImageDraw.Draw(lb); W,H=lb.size
    d.text((W*0.31,H*0.375),town,font=ImageFont.truetype(FB,max(6,int(H*0.16))),fill=(50,30,20),anchor='ls')
    d.text((W*0.31,H*0.525),region,font=ImageFont.truetype(FR,max(5,int(H*0.10))),fill=(70,50,35),anchor='ls')
    d.text((W*0.31,H*0.68),'via GRIP',font=ImageFont.truetype(FR,max(5,int(H*0.085))),fill=(110,85,60),anchor='ls')
    return lb
def box(kind,region_id,town,region,fh=(),safety=0,rune=False,S=520):
    b=tight(Image.open(A+f'10-13-boxes/box_{kind}_closed.png').convert('RGBA')).resize((S,S),Image.LANCZOS)
    fx0,fy0,fx1,fy1=[v*S for v in FACE[kind]]; c=L[kind]; m=c['m']*S
    def at(im,left=None,right=None,top=None,bottom=None,cx=None,cy=None):
        x=left if left is not None else (right-im.width if right is not None else cx-im.width/2)
        y=top if top is not None else (bottom-im.height if bottom is not None else cy-im.height/2)
        b.alpha_composite(im,(int(x),int(y)))
    # top right: the region stamp; top left: handling stickers.  Same gap m from the top and the side.
    at(load(G+f'stamp_{region_id}.webp',c['rs']*S),right=fx1-m,top=fy0+m)
    x=fx0+m
    for n in fh:
        im=load(hz(n),c['hs']*S); at(im,left=x,top=fy0+m); x+=im.width+c['gap']*S
    # bottom right: safety stickers in rows of 5, same gap m from the bottom and the right
    pool=[3,5,9,6,10,4,8,7,12,19]; rows=(safety+4)//5
    for i in range(safety):
        r,col=divmod(i,5); im=load(hz(pool[i]),c['ss']*S)
        at(im,right=fx1-m-col*(im.width+c['gap']*S),bottom=fy1-m-(rows-1-r)*(im.height+c['gap']*S))
    # middle: the shipping label
    at(label(c['lw']*S,town,region),cx=S*0.5,cy=S*c['ly'])
    if rune:
        im=load(A+'22-runes/rune-1-no-demon.png',0.13*S); at(im,left=fx0+m,bottom=fy1-m)
    return b
cases=[('Layer 1','plain','gnomerica','Sproing','Gnomerica',(),0,False),
       ('Mid game','plain','gnohio','Cogsworth','Gnohio',(1,2),5,False),
       ('Worst case','temp','gnonmoon','Zohee Bay','Gnonmoon',(1,2),10,True)]
out=Image.new('RGBA',(1720,800),(50,34,24,255)); d=ImageDraw.Draw(out); f=ImageFont.truetype(FS,20)
d.text((30,16),'Box face mock v0.3, option A (Claudia, 2026-11-23): same gap from the top and the sides.  Bottom: about phone size.',fill=(255,235,200),font=f)
for k,cs in enumerate(cases):
    b=box(*cs[1:]); out.alpha_composite(b,(30+k*570,90)); d.text((30+k*570,58),cs[0],fill=(255,235,200),font=f)
    out.alpha_composite(b.resize((110,110),Image.LANCZOS),(30+k*570,660))
out.convert('RGB').save(os.path.join(R,'tools/out/box-face-mock.png'))
