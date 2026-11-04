# 정비 대기열

> 자동 생성(`scripts/build-maintenance-queue.mjs`). 직접 수정하지 않는다. 기계가 원고 전체에서 찾은 **신호**일 뿐이며, 무엇을 고칠지는 [정비 절차](../../MAINTENANCE.md)에 따라 원고를 읽고 판단한다.

마지막 정비: **M002** (2026-11-04) · [보고서](reports/M002.md) · 다음 정비 버전: **M003**

원고 56개 · 변경 문서 17 · 고립 0 · 한쪽 연결 83 · 보류 6 · 열린 교차 제안 0

## 1. 지난 정비 이후 변경된 문서 (17)

manifest의 수정일이 2026-11-04 이후(당일 포함)이거나 수정일이 없는 문서. 분류별로 묶었으며, 양이 많으면 분류 단위로 나누어 처리한다.

- **탐사대** (4): `mission-lost-freighter`, `mission-breathing-forest`, `ships-and-gear`, `route-era-life`
- **시작하기** (3): `welcome`, `open-routes-era`, `rulebook`
- **개요** (2): `grand-questions`, `start-here`
- **사건** (2): `demon-epoch-chronicle`, `reshaping`
- **천체** (2): `binary-system`, `space-codes`
- **마법** (1): `magic-senses`
- **소설** (1): `demon-epoch-fiction-pillars`
- **안내** (1): `worldbuilding-guide`
- **장소** (1): `low-cape`

## 2. 들어오는 연결이 없는 문서 (0)

다른 문서의 관련 문서·본문 링크·확인된 관계 어디에도 등장하지 않는다. 직접 관련 문서가 있는지 본문을 읽고 확인한다.


## 3. 한쪽에서만 건 관련 문서 (83)

`A → B`는 A의 관련 문서에 B가 있으나 B에는 A가 없다는 뜻이다. 반대 방향도 직접 관련일 때만 맞춘다.

- `welcome` → `mission-lost-freighter`
- `welcome` → `mission-breathing-forest`
- `welcome` → `ships-and-gear`
- `welcome` → `route-era-life`
- `open-routes-era` → `demon-epoch-chronicle`
- `open-routes-era` → `magic-senses`
- `rulebook` → `magic-senses`
- `rulebook` → `demon-epoch-chronicle`
- `mission-lost-freighter` → `ships-and-gear`
- `mission-lost-freighter` → `route-era-life`
- `mission-lost-freighter` → `demon-epoch-chronicle`
- `mission-breathing-forest` → `ships-and-gear`
- `mission-breathing-forest` → `route-era-life`
- `mission-breathing-forest` → `demon-epoch-chronicle`
- `start-here` → `open-routes-era`
- `worldbuilding-guide` → `variable-rules-and-life`
- `magic-senses` → `scenario-great-crossing`
- `magic-senses` → `rival-gc-finale-fiction`
- `magic-senses` → `aren-session-01`
- `magic-senses` → `scene-fiction-principles`
- `magic-senses` → `grand-questions`
- `story-state` → `reshaping`
- `rival-play` → `scene-fiction-principles`
- `rival-gc-t02-yunda` → `rival-play`
- `rival-gc-t02-yunda` → `rival-gc-state`
- `rival-gc-t02-yunda` → `scenario-great-crossing`
- `rival-gc-t03-world` → `rival-play`
- `rival-gc-t03-world` → `rival-gc-t01-seo`
- `rival-gc-t03-world` → `rival-gc-t02-yunda`
- `rival-gc-t03-world` → `scenario-great-crossing`
- `rival-gc-t05-yunda` → `rival-play`
- `rival-gc-t05-yunda` → `rival-gc-t03-world`
- `rival-gc-t05-yunda` → `rival-gc-t02-yunda`
- `rival-gc-t05-yunda` → `scenario-great-crossing`
- `rival-gc-t06-world` → `rival-play`
- `rival-gc-t06-world` → `rival-gc-t03-world`
- `rival-gc-t06-world` → `rival-gc-t04-seo`
- `rival-gc-t06-world` → `rival-gc-t05-yunda`
- `rival-gc-t06-world` → `scenario-great-crossing`
- `rival-gc-t08-yunda` → `rival-play`
- `rival-gc-t08-yunda` → `rival-gc-t06-world`
- `rival-gc-t08-yunda` → `rival-gc-t05-yunda`
- `rival-gc-t08-yunda` → `scenario-great-crossing`
- `rival-gc-t09-world` → `rival-play`
- `rival-gc-t09-world` → `rival-gc-t07-seo`
- `rival-gc-t09-world` → `rival-gc-t08-yunda`
- `rival-gc-t09-world` → `rival-gc-t06-world`
- `rival-gc-t09-world` → `scenario-great-crossing`
- `rival-gc-retrospective` → `scenario-great-crossing`
- `rival-gc-retrospective` → `rival-gc-state`
- `rival-gc-retrospective` → `rival-gc-t03-world`
- `rival-gc-retrospective` → `rival-gc-t06-world`
- `rival-gc-retrospective` → `rival-gc-finale-fiction`
- `rival-character-principles` → `rival-play`
- `rival-character-principles` → `causal-roleplay`
- `rival-character-principles` → `knowledge-horizons`
- `rival-gc-finale-fiction` → `rival-gc-state`
- `rival-gc-finale-fiction` → `scenario-great-crossing`
- `demon-epoch-fiction-pillars` → `demon-epoch-oath`
- `demon-epoch-fiction-pillars` → `magic-senses`
- `demon-epoch-fiction-pillars` → `scene-fiction-principles`
- `demon-epoch-framework` → `scene-fiction-principles`
- `demon-epoch-chronicle` → `magic-senses`
- `demon-epoch-chronicle` → `scenario-great-crossing`
- `demon-epoch-chronicle` → `grand-questions`
- `demon-epoch-chronicle` → `demon-epoch-resonance`
- `demon-epoch-chronicle` → `demon-epoch-shedding`
- `demon-epoch-chronicle` → `demon-epoch-branching`
- `demon-epoch-chronicle` → `demon-epoch-hospitality`
- `demon-epoch-chronicle` → `demon-epoch-dream`
- `demon-epoch-s00` → `seven-demon-lords`
- `demon-epoch-harmony` → `seven-demon-lords`
- `demon-epoch-oath` → `seven-demon-lords`
- `demon-epoch-resonance` → `seven-demon-lords`
- `demon-epoch-shedding` → `seven-demon-lords`
- `demon-epoch-branching` → `seven-demon-lords`
- `demon-epoch-hospitality` → `seven-demon-lords`
- `demon-epoch-dream` → `seven-demon-lords`
- `variable-rules-and-life` → `causal-roleplay`
- `variable-rules-and-life` → `knowledge-horizons`
- `binary-system` → `welcome`
- `space-codes` → `welcome`
- `reshaping` → `welcome`

## 4. 관련 문서가 없는 문서 (0)


## 5. 제목·소제목이 비슷한 문서 쌍 (상위 15)

제목·별칭·소제목의 글자 2-gram 유사도(0~1)다. 중복이 아니라 **대조해 볼 후보**이며, 이미 연결된 쌍도 표시한다.

- `demon-epoch-branching` ↔ `demon-epoch-dream` · 0.93
- `demon-epoch-branching` ↔ `demon-epoch-hospitality` · 0.93
- `demon-epoch-harmony` ↔ `demon-epoch-branching` · 0.93
- `demon-epoch-harmony` ↔ `demon-epoch-dream` · 0.93
- `demon-epoch-harmony` ↔ `demon-epoch-hospitality` · 0.93
- `demon-epoch-harmony` ↔ `demon-epoch-oath` · 0.93
- `demon-epoch-harmony` ↔ `demon-epoch-resonance` · 0.93
- `demon-epoch-harmony` ↔ `demon-epoch-shedding` · 0.93
- `demon-epoch-hospitality` ↔ `demon-epoch-dream` · 0.93
- `demon-epoch-oath` ↔ `demon-epoch-branching` · 0.93
- `demon-epoch-oath` ↔ `demon-epoch-dream` · 0.93
- `demon-epoch-oath` ↔ `demon-epoch-hospitality` · 0.93
- `demon-epoch-oath` ↔ `demon-epoch-resonance` · 0.93
- `demon-epoch-oath` ↔ `demon-epoch-shedding` · 0.93
- `demon-epoch-resonance` ↔ `demon-epoch-branching` · 0.93

## 6. 보류 항목 (6)

- 오래된 사물이 새 자리를 먼저 알아봄 · `ing-20261104-reshaping` — Claude의 제안. 사용자 승인 전 정본 제외
- 타는 건넘·고리의 그늘 전승 해석 · `ing-20261104-reshaping` — Claude의 제안. 사용자 승인 전 정본 제외
- 깊은 사이의 폐쇄와 세대 서열 · `ing-20261104-reshaping` — Claude의 제안. 사용자 승인 전 정본 제외
- 일곱 일족의 차별적 대응 · `ing-20261104-reshaping` — Claude의 제안. 사용자 승인 전 정본 제외
- 결의 역서 관측 기록 · `ing-20261104-reshaping` — Claude의 제안. 사용자 승인 전 정본 제외
- 비인간 지성의 선행 인지 · `ing-20261104-reshaping` — Claude의 제안. 사용자 승인 전 정본 제외

## 7. 열린 교차 편집 제안 (0)

정비에서 승인하지 않는다. 판단 근거를 보고서에 적어 사용자 결정을 요청한다.


## 8. 분량 참고

분량만으로 나누거나 합치지 않는다. 내용상 이유가 있을 때만 보고서에 제안한다. 기준: 10,000자 초과 / 1,500자 미만.

- 긴 문서 (7): `rival-gc-t09-world` 19,396자, `rival-gc-t06-world` 15,310자, `rulebook` 14,535자, `rival-gc-retrospective` 13,071자, `rival-gc-finale-fiction` 12,998자, `rival-play` 12,302자, `rival-gc-t03-world` 10,529자
- 짧은 문서 (1): `editing-guide` 763자

## 9. 분류 참고

분류 16개: 대국 기록 10, 롤플레잉 7, 인물 7, 운영 원칙 6, 탐사대 4, 시작하기 3, 개요 3, 사건 3, 천체 3, 안내 2, 마법 2, 소설 2, 세력 1, 마법 공예·항행 1, 장소 1, 사물·개념 1
문서가 하나뿐인 분류 4개: 세력, 마법 공예·항행, 장소, 사물·개념. 분류 체계 변경은 제안만 한다.
