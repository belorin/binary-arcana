import math, random
W,H=1000,640
def blob(cx,cy,rx,ry,seed,n=36,rough=0.18,rot=0):
    rnd=random.Random(seed); ph=[rnd.uniform(0,6.28) for _ in range(4)]
    pts=[]
    for i in range(n):
        t=2*math.pi*i/n
        k=1+rough*(0.55*math.sin(3*t+ph[0])+0.3*math.sin(5*t+ph[1])+0.2*math.sin(8*t+ph[2])+0.12*math.sin(13*t+ph[3]))
        x,y=rx*k*math.cos(t),ry*k*math.sin(t)
        c,s=math.cos(rot),math.sin(rot)
        pts.append((cx+x*c-y*s, cy+x*s+y*c))
    return pts
def path(pts):
    n=len(pts); d=f"M{pts[0][0]:.1f},{pts[0][1]:.1f}"
    for i in range(n):
        p0,p1,p2,p3=pts[i-1],pts[i],pts[(i+1)%n],pts[(i+2)%n]
        c1=(p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6); c2=(p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6)
        d+=f" C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}"
    return d+" Z"
SEA="#e1e9ef"; LAND="#ece6d6"; EDGE="#a99f86"; INK="#252b29"; MUTED="#66716a"; ROUTE="#7a4686"
o=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="Noto Sans KR, Apple SD Gothic Neo, Malgun Gothic, sans-serif">']
o.append('<defs><pattern id="unk" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#cfc6ae" stroke-width="2"/></pattern>'
         f'<marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{ROUTE}"/></marker></defs>')
o.append(f'<rect width="100%" height="100%" fill="{SEA}"/>')
for x in range(100,W,100): o.append(f'<line x1="{x}" y1="0" x2="{x}" y2="{H}" stroke="#d3dde5" stroke-width="1"/>')
for y in range(80,H,80): o.append(f'<line x1="0" y1="{y}" x2="{W}" y2="{y}" stroke="#d3dde5" stroke-width="1"/>')
# continents
A=blob(330,320,175,130,7,rough=0.16,rot=-0.15)
B=blob(700,470,150,62,11,rough=0.28,rot=0.38)
C=blob(800,245,120,82,23,rough=0.2,rot=-0.2)
D=blob(500,62,240,40,31,rough=0.22)
U1=blob(80,548,55,38,41,rough=0.25)
U2=blob(940,560,45,40,43,rough=0.25)
for pts in (A,B,C,D): o.append(f'<path d="{path(pts)}" fill="{LAND}" stroke="{EDGE}" stroke-width="1.6"/>')
# unknown interiors (hatched)
for (x,y,rx,ry,s,rot) in [(745,480,85,26,51,0.38),(830,230,58,40,52,-0.2),(520,60,170,22,53,0),(300,215,70,30,54,0)]:
    o.append(f'<path d="{path(blob(x,y,rx,ry,s,rough=0.15,rot=rot))}" fill="url(#unk)" opacity="0.7"/>')
for pts in (U1,U2): o.append(f'<path d="{path(pts)}" fill="url(#unk)" stroke="{EDGE}" stroke-width="1.2" stroke-dasharray="5 5"/>')
o.append(f'<text x="80" y="553" font-size="13" fill="{MUTED}" text-anchor="middle">모르는 땅?</text>')
o.append(f'<text x="940" y="565" font-size="13" fill="{MUTED}" text-anchor="middle">?</text>')
# lake & island in A1
o.append(f'<path d="{path(blob(330,330,46,30,61,rough=0.2))}" fill="{SEA}" stroke="{EDGE}" stroke-width="1.2"/>')
o.append('<circle cx="332" cy="331" r="5" fill="#ece6d6" stroke="#a99f86"/>')
# streams into lake (12 여울)
rnd=random.Random(5)
for i in range(12):
    t=2*math.pi*i/12+0.2; r1=40; r2=r1+rnd.uniform(28,52)
    x1,y1=330+r1*1.15*math.cos(t),330+r1*0.75*math.sin(t); x2,y2=330+r2*1.15*math.cos(t),330+r2*0.75*math.sin(t)
    o.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#9fb4c4" stroke-width="1.3"/>')
# region outlines (dashed) + labels
def reg(x,y,rx,ry,s,label,code,lx=None,ly=None,anchor="middle"):
    o.append(f'<path d="{path(blob(x,y,rx,ry,s,rough=0.12))}" fill="none" stroke="#7b725c" stroke-width="1.1" stroke-dasharray="4 4"/>')
    lx=x if lx is None else lx; ly=y if ly is None else ly
    o.append(f'<text x="{lx}" y="{ly}" font-size="12.5" font-weight="700" fill="{INK}" text-anchor="{anchor}">{code}</text>')
    o.append(f'<text x="{lx}" y="{ly+15}" font-size="11.5" fill="{MUTED}" text-anchor="{anchor}">{label}</text>')
reg(330,330,105,72,71,"열두 여울 분지","P3-A1",330,402)
reg(185,330,38,95,72,"검은모래 연안","P3-A2",186,262)
reg(460,315,52,80,73,"숲길 내륙","P3-A3",462,250)
reg(300,215,80,32,74,"북쪽 고원(미정)","P3-A4",300,212)
reg(598,410,30,22,75,"짙은돌 해안","P3-B1",578,452,"end")
reg(735,312,32,20,76,"붉은돌 해안","P3-C1",735,350)
# continent labels
for (x,y,code,name) in [(250,505,"P3-A","가운데뭍"),(800,555,"P3-B","동남뭍"),(865,170,"P3-C","맞은뭍"),(330,42,"P3-D","북뭍")]:
    o.append(f'<text x="{x}" y="{y}" font-size="17" font-weight="800" fill="#4a4537" text-anchor="middle">{name}</text>')
    o.append(f'<text x="{x}" y="{y+16}" font-size="12" fill="{MUTED}" text-anchor="middle">{code}</text>')
o.append(f'<text x="770" y="595" font-size="11" fill="{MUTED}" text-anchor="middle">빗금: 사람이 잘 모르는 내륙</text>')
# oceans
for (x,y,code,name) in [(560,520,"P3-O1","가운데바다"),(120,150,"P3-O2","먼바다"),(930,400,"P3-O2","먼바다")]:
    o.append(f'<text x="{x}" y="{y}" font-size="15" font-style="italic" fill="#5d7a90" text-anchor="middle">{name}</text>')
    o.append(f'<text x="{x}" y="{y+15}" font-size="11" fill="#7d93a5" text-anchor="middle">{code}</text>')
# routes
o.append(f'<path d="M604,402 C640,350 690,340 728,322" fill="none" stroke="{ROUTE}" stroke-width="2" stroke-dasharray="7 5" marker-start="url(#arr)" marker-end="url(#arr)"/>')
o.append(f'<text x="650" y="335" font-size="12" font-weight="700" fill="{ROUTE}" text-anchor="middle">L02 낮은곶 물턱</text>')
for (sx,sy,qx,qy,ex,ey) in [(170,320,130,290,100,245),(170,350,130,380,105,410),(175,425,150,500,178,590)]:
    o.append(f'<path d="M{sx},{sy} Q{qx},{qy} {ex},{ey}" fill="none" stroke="{ROUTE}" stroke-width="1.5" stroke-dasharray="3 5" marker-end="url(#arr)"/>')
o.append(f'<text x="14" y="448" font-size="11.5" fill="{ROUTE}">L03 검은모래 물턱들</text>')
o.append(f'<text x="14" y="463" font-size="11" fill="{MUTED}">(끝은 아직 정하지 않음)</text>')
# off-world routes
o.append(f'<path d="M336,324 C350,260 390,170 420,128" fill="none" stroke="{ROUTE}" stroke-width="2.2" marker-end="url(#arr)"/>')
o.append(f'<rect x="420" y="100" width="168" height="40" rx="7" fill="#ffffff" stroke="{ROUTE}"/>')
o.append(f'<text x="504" y="117" font-size="12" font-weight="700" fill="{ROUTE}" text-anchor="middle">L01 큰 건넘</text>')
o.append(f'<text x="504" y="132" font-size="11" fill="{MUTED}" text-anchor="middle">→ 건너별의 거점 P4-A1</text>')
o.append(f'<path d="M820,505 C870,520 900,500 925,470" fill="none" stroke="{ROUTE}" stroke-width="2.2" marker-end="url(#arr)"/>')
o.append(f'<rect x="845" y="430" width="140" height="40" rx="7" fill="#ffffff" stroke="{ROUTE}"/>')
o.append(f'<text x="915" y="447" font-size="12" font-weight="700" fill="{ROUTE}" text-anchor="middle">L04 늪 건넘</text>')
o.append(f'<text x="915" y="462" font-size="11" fill="{MUTED}" text-anchor="middle">→ 샛별의 야영지 P2-A1</text>')
# compass & notes
o.append(f'<g transform="translate({W-48},70)"><line x1="0" y1="22" x2="0" y2="-22" stroke="{INK}" stroke-width="1.5" marker-end="url(#arr)"/><text x="0" y="40" font-size="12" text-anchor="middle" fill="{INK}">북</text></g>')
o.append(f'<rect x="0" y="{H-34}" width="{W}" height="34" fill="#fbfaf6" opacity="0.92"/>')
o.append(f'<text x="16" y="{H-13}" font-size="12" fill="{MUTED}">누리(P3)의 알려진 쪽 대략도. 거리와 해안선은 정확하지 않다. 지도 밖에도 바다와 땅이 이어진다. 색은 기후나 생태를 뜻하지 않는다.</text>')
o.append('</svg>')
open('wiki/images/nuri-map.svg','w').write('\n'.join(o)); print('ok')
