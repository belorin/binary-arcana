# 항로력 212년 별계 항로도. 저장소 최상위에서 실행: python3 tools/drawings/route_map.py
# 노선도식 그림이다. 위치는 실제 거리나 궤도와 무관하고, 어떤 항구가 어떤 항구와 이어지는지만 보인다.
W, H = 1000, 720
INK, MUTED, BG, LINE = "#252b29", "#66716a", "#fbfaf6", "#dfe3db"
REG, SEASON, PIONEER, CLOSED = "#2f5d9e", "#2f5d9e", "#c4572f", "#9a978d"
o = []
o.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
         'font-family="Noto Sans KR, Apple SD Gothic Neo, Malgun Gothic, sans-serif">')
o.append(f'<rect width="100%" height="100%" fill="{BG}"/>')
o.append('<defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">'
         '<line x1="0" y1="0" x2="0" y2="6" stroke="#b9a6d8" stroke-width="2"/></pattern></defs>')
o.append(f'<text x="32" y="44" font-size="21" font-weight="700" fill="{INK}">항로력 212년 별계 항로도</text>')
o.append(f'<text x="32" y="68" font-size="13" fill="{MUTED}">노선도처럼 그렸다. 위치는 실제 거리나 궤도와 상관없고, 어느 항구가 어디와 이어지는지만 보인다.</text>')

# 행성 상자: (x, y, w, h, 이름, 한 줄)
planets = [
    (32, 110, 300, 340, "누리", "고향 행성 · 수백만 명"),
    (700, 96, 268, 150, "건너별", "춥고 바람 세다"),
    (720, 282, 248, 128, "돌아온 별", "옛 빈자리 · 가장 큰 개척지"),
    (700, 446, 268, 130, "샛별", "덥고 늪과 균류 숲"),
    (372, 520, 250, 110, "해곁별", "뜨거운 바위 · 사람 없음"),
    (420, 214, 200, 170, "느림별의 위성", "고리의 그늘"),
]
for x, y, w, h, name, sub in planets:
    o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" fill="#ffffff" stroke="{LINE}" stroke-width="1.5"/>')
    o.append(f'<text x="{x+16}" y="{y+26}" font-size="15" font-weight="700" fill="{INK}">{name}</text>')
    o.append(f'<text x="{x+16}" y="{y+44}" font-size="11.5" fill="{MUTED}">{sub}</text>')

ports = {
    "호수문": (150, 230), "서항": (120, 390), "그늘역": (520, 312), "바람고원": (830, 186),
    "첫발기지": (850, 360), "늪항": (880, 530), "채굴장": (470, 595),
}

def line(a, b, color, width=4, dash=None, via=None):
    (x1, y1), (x2, y2) = ports[a], ports[b]
    d = f'M{x1},{y1} ' + (f'L{via[0]},{via[1]} ' if via else '') + f'L{x2},{y2}'
    extra = f' stroke-dasharray="{dash}"' if dash else ''
    o.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"{extra}/>')

def label(x, y, text, color=MUTED, size=11.5, anchor="middle", weight="400"):
    o.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" text-anchor="{anchor}" font-weight="{weight}" '
             f'paint-order="stroke" stroke="{BG}" stroke-width="4">{text}</text>')

# 닫힌 옛 길: 호수문–바람고원 (옛 큰 건넘)
line("호수문", "바람고원", CLOSED, 2.5, "3 7", via=(460, 140))
for cxx, cyy in [(300, 180), (640, 158)]:
    o.append(f'<path d="M{cxx-6},{cyy-6} L{cxx+6},{cyy+6} M{cxx+6},{cyy-6} L{cxx-6},{cyy+6}" stroke="{CLOSED}" stroke-width="2.5"/>')
label(470, 128, "옛 큰 건넘 — 닫힘의 세기에 닫혔다", CLOSED)

# 정기 항로
line("호수문", "그늘역", REG, 6)
label(338, 258, "정기선 · 매일")
line("서항", "그늘역", REG, 4)
label(330, 372, "11번")
line("그늘역", "바람고원", REG, 4)
label(690, 236, "7번")
line("그늘역", "늪항", REG, 4)
label(700, 420, "샛별선")
line("호수문", "서항", REG, 2.5)
label(124, 316, "누리 안 항로", anchor="end")

# 겹침철에만
line("서항", "늪항", SEASON, 2.5, "10 6", via=(330, 500))
label(560, 498, "겹침철에만 열린다")

# 개척 항로
line("그늘역", "첫발기지", PIONEER, 3, "2 6")
label(690, 322, "개척 항로 L06", PIONEER)
line("서항", "채굴장", PIONEER, 3, "2 6", via=(250, 595))
label(210, 616, "채굴단이 쓰는 개척 항로", PIONEER)

# 금지 구역: 기둥벌
o.append('<circle cx="230" cy="300" r="26" fill="url(#hatch)" stroke="#8f78bf" stroke-width="1.5"/>')
label(230, 342, "기둥벌 · 금지 구역", "#6f5a9e", 11.5, weight="700")

# 항구 점
for name, (x, y) in ports.items():
    hub = name == "그늘역"
    r = 13 if hub else 9
    fill = "#ffffff"
    stroke = PIONEER if name in ("첫발기지", "채굴장") else REG
    o.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{4 if hub else 3}"/>')
names = {
    "호수문": (150, 210, "호수문", "middle"), "서항": (120, 420, "서항", "middle"),
    "그늘역": (520, 346, "그늘역", "middle"), "바람고원": (830, 222, "바람고원 자유시", "middle"),
    "첫발기지": (850, 394, "첫발기지", "middle"), "늪항": (880, 562, "늪항", "middle"),
    "채굴장": (470, 622, "그늘 쪽 채굴장", "middle"),
}
for key, (x, y, text, anchor) in names.items():
    label(x, y, text, INK, 13.5 if key != "그늘역" else 15, anchor, "700")
label(520, 366, "모든 정기 항로가 만나는 환승역", MUTED, 11)
label(150, 190, "수도 · 큰 호수 위의 문", MUTED, 11)

# 범례
lx, ly = 700, 596
o.append(f'<rect x="{lx}" y="{ly}" width="268" height="112" rx="12" fill="#ffffff" stroke="{LINE}"/>')
o.append(f'<text x="{lx+16}" y="{ly+24}" font-size="13" font-weight="700" fill="{INK}">보는 법</text>')
items = [(REG, 5, None, "정기 항로 (항로청 번호)"), (SEASON, 2.5, "10 6", "겹침철에만 열리는 항로"),
         (PIONEER, 3, "2 6", "개척 항로 (번호 없음, 위험)"), (CLOSED, 2.5, "3 7", "닫힌 옛 길")]
for i, (c, w, dash, text) in enumerate(items):
    yy = ly + 40 + i * 20
    extra = f' stroke-dasharray="{dash}"' if dash else ''
    o.append(f'<line x1="{lx+16}" y1="{yy}" x2="{lx+66}" y2="{yy}" stroke="{c}" stroke-width="{w}" stroke-linecap="round"{extra}/>')
    o.append(f'<text x="{lx+78}" y="{yy+4}" font-size="12" fill="{INK}">{text}</text>')
o.append(f'<text x="32" y="{H-34}" font-size="11.5" fill="{MUTED}">항로가 열리는 날과 시각은 항로 역서를 따른다.</text>')
o.append(f'<text x="32" y="{H-16}" font-size="11.5" fill="{MUTED}">틈을 지나는 먼 항로는 몇 시간, 짧은 항로는 숨 몇 번이 걸린다.</text>')
o.append('</svg>')
open('wiki/images/route-map-212.svg', 'w').write('\n'.join(o))
print('ok')
