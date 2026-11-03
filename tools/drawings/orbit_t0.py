import math
W,H=920,780; cx,cy=420,410
def R(a): return 118*a**0.72   # compressed radial scale for readability
pl=[('P1','해곁별',200,0.591,130),('P2','샛별',290,0.757,250),('P3','누리',440,1.0,0),('P4','건너별',880,1.587,160),('P5','느림별',2640,3.302,75)]
def xy(r,deg): return cx+r*math.cos(math.radians(deg)), cy-r*math.sin(math.radians(deg))
o=[]
o.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="Noto Sans KR, Apple SD Gothic Neo, Malgun Gothic, sans-serif">')
o.append('<rect width="100%" height="100%" fill="#fbfaf6"/>')
o.append('<text x="28" y="40" font-size="20" font-weight="700" fill="#252b29">T0의 궤도 배치</text>')
o.append('<text x="28" y="64" font-size="13" fill="#66716a">큰 건넘 대국의 마지막 겹침 순간. 위에서 내려다본 그림, 공전은 시계 반대 방향.</text>')
# node line
x1,y1=xy(R(3.6),0); x2,y2=xy(R(3.6),180)
o.append(f'<line x1="{x2:.1f}" y1="{y2:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="#c9b26b" stroke-width="1" stroke-dasharray="2 5"/>')
o.append(f'<text x="{x2+6:.1f}" y="{y2+18:.1f}" font-size="11" fill="#9a8440" text-anchor="start">겹침선 — 누리가 이 선 위에 오면 겹침철</text>')
# P6 dashed
r6=R(3.302)+48
o.append(f'<circle cx="{cx}" cy="{cy}" r="{r6:.1f}" fill="none" stroke="#c7c2b6" stroke-width="1" stroke-dasharray="1 7"/>')
px,py=xy(r6,300); o.append(f'<text x="{px+8:.1f}" y="{py+4:.1f}" font-size="12" fill="#8d8a80" text-anchor="start">빈자리(P6)? — 있는지 논쟁 중, 궤도 미정</text>')
for code,name,per,a,lam in pl:
    o.append(f'<circle cx="{cx}" cy="{cy}" r="{R(a):.1f}" fill="none" stroke="#bdb7a8" stroke-width="1.2"/>')
# sight line P3 -> P4
p3=xy(R(1),0); p4=xy(R(1.587),160)
o.append(f'<line x1="{p3[0]:.1f}" y1="{p3[1]:.1f}" x2="{p4[0]:.1f}" y2="{p4[1]:.1f}" stroke="#7a4686" stroke-width="1.3" stroke-dasharray="6 4"/>')
# suns (small, compressed)
sa=(cx-7,cy); sb=(cx+15,cy)
o.append(f'<circle cx="{sa[0]}" cy="{sa[1]}" r="11" fill="#f2c14e" stroke="#d49a1c" stroke-width="1"/>')
o.append(f'<circle cx="{sb[0]}" cy="{sb[1]}" r="5.5" fill="#eef3fb" stroke="#8aa1c6" stroke-width="1"/>')
o.append(f'<text x="{cx}" y="{cy+30}" font-size="11" fill="#66716a" text-anchor="middle">두 해 (SA·SB)</text>')
for code,name,per,a,lam in pl:
    x,y=xy(R(a),lam); big=code=='P3'
    o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{8 if big else 6.5}" fill="#3d4f8f" stroke="#fbfaf6" stroke-width="2"/>')
    if big:
        mx,my=x+13,y-9; o.append(f'<circle cx="{mx:.1f}" cy="{my:.1f}" r="2.4" fill="#8d97b8"/>')
    dx,dy=(14,-14) if code!='P2' else (14,22)
    anchor='start'
    if code=='P1': dx,dy,anchor=(-12,-12,'end')
    if code=='P4': dx,dy,anchor=(-12,-14,'end')
    o.append(f'<text x="{x+dx:.1f}" y="{y+dy:.1f}" font-size="13" font-weight="700" fill="#252b29" text-anchor="{anchor}">{code} {name}</text>')
    o.append(f'<text x="{x+dx:.1f}" y="{y+dy+15:.1f}" font-size="11" fill="#66716a" text-anchor="{anchor}">{per:,}날{" · 물달" if big else ""}</text>')
mid=((p3[0]+p4[0])/2,(p3[1]+p4[1])/2-10)
o.append(f'<text x="60" y="258" font-size="12" fill="#7a4686">보라 점선: 누리에서 건너별을 바라본 선.</text>')
o.append(f'<text x="60" y="274" font-size="12" fill="#7a4686">T0에 건너별은 두 해 바로 뒤(12°)에 숨어 있었다.</text>')
# inset
ix,iy,iw,ih=W-252,92,226,168
o.append(f'<rect x="{ix}" y="{iy}" width="{iw}" height="{ih}" rx="10" fill="#ffffff" stroke="#dfe3db"/>')
o.append(f'<text x="{ix+14}" y="{iy+24}" font-size="13" font-weight="700" fill="#252b29">누리에서 본 겹침</text>')
o.append(f'<circle cx="{ix+113}" cy="{iy+90}" r="38" fill="#f2c14e" stroke="#d49a1c"/>')
o.append(f'<circle cx="{ix+124}" cy="{iy+82}" r="14" fill="#eef3fb" stroke="#8aa1c6"/>')
o.append(f'<text x="{ix+14}" y="{iy+148}" font-size="11.5" fill="#66716a">작은 해(SB)가 큰 해(SA) 앞을 지난다.</text>')
o.append(f'<text x="{ix+14}" y="{iy+163}" font-size="11.5" fill="#66716a">큰 건넘이 가장 넓게 열리는 때.</text>')
# notes
o.append(f'<text x="28" y="{H-44}" font-size="11.5" fill="#66716a">거리는 실제 비율이 아니다. 바깥 궤도일수록 줄여 그렸다. 실제 거리(누리=1): 해곁별 0.59 · 샛별 0.76 · 건너별 1.59 · 느림별 3.30.</text>')
o.append(f'<text x="28" y="{H-24}" font-size="11.5" fill="#66716a">행성의 점은 위치만 나타낸다. 색과 크기는 행성의 모습을 뜻하지 않는다. 출처: 시점별 천체 배치(T0).</text>')
o.append('</svg>')
open('wiki/images/orbit-t0.svg','w').write('\n'.join(o))
print('ok')
