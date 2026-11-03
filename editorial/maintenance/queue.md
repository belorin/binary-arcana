# 정비 대기열

> 자동 생성(`scripts/build-maintenance-queue.mjs`). 직접 수정하지 않는다. 기계가 원고 전체에서 찾은 **신호**일 뿐이며, 무엇을 고칠지는 [정비 절차](../../MAINTENANCE.md)에 따라 원고를 읽고 판단한다.

마지막 정비: **M001** (2026-11-03) · [보고서](reports/M001.md) · 다음 정비 버전: **M002**

원고 46개 · 변경 문서 46 · 고립 0 · 한쪽 연결 56 · 보류 0 · 열린 교차 제안 0

## 1. 지난 정비 이후 변경된 문서 (46)

manifest의 수정일이 2026-11-03 이후(당일 포함)이거나 수정일이 없는 문서. 분류별로 묶었으며, 양이 많으면 분류 단위로 나누어 처리한다.

- **대국 기록** (10): `rival-gc-state`, `rival-gc-t02-yunda`, `rival-gc-t01-seo`, `rival-gc-t03-world`, `rival-gc-t05-yunda`, `rival-gc-t04-seo`, `rival-gc-t06-world`, `rival-gc-t08-yunda`, `rival-gc-t07-seo`, `rival-gc-t09-world`
- **롤플레잉** (7): `aren-sheet`, `aren-session-01`, `story-state`, `scenario-great-crossing`, `rival-play`, `multi-ai-roleplay`, `demon-epoch-framework`
- **인물** (7): `demon-epoch-harmony`, `demon-epoch-oath`, `demon-epoch-resonance`, `demon-epoch-shedding`, `demon-epoch-branching`, `demon-epoch-hospitality`, `demon-epoch-dream`
- **운영 원칙** (6): `knowledge-horizons`, `causal-roleplay`, `exceptional-generations`, `rival-gc-retrospective`, `rival-character-principles`, `scene-fiction-principles`
- **개요** (3): `grand-questions`, `start-here`, `open-setting-questions`
- **천체** (3): `binary-system`, `space-codes`, `sky-positions`
- **마법** (2): `magic-as-practice`, `magic-senses`
- **안내** (2): `editing-guide`, `worldbuilding-guide`
- **마법 공예·항행** (1): `magical-distance-and-passage`
- **사건** (1): `demon-epoch-s00`
- **사물·개념** (1): `variable-rules-and-life`
- **세력** (1): `seven-demon-lords`
- **소설** (1): `rival-gc-finale-fiction`
- **장소** (1): `low-cape`

## 2. 들어오는 연결이 없는 문서 (0)

다른 문서의 관련 문서·본문 링크·확인된 관계 어디에도 등장하지 않는다. 직접 관련 문서가 있는지 본문을 읽고 확인한다.


## 3. 한쪽에서만 건 관련 문서 (56)

`A → B`는 A의 관련 문서에 B가 있으나 B에는 A가 없다는 뜻이다. 반대 방향도 직접 관련일 때만 맞춘다.

- `open-setting-questions` → `magic-senses`
- `worldbuilding-guide` → `variable-rules-and-life`
- `magic-senses` → `scenario-great-crossing`
- `magic-senses` → `low-cape`
- `magic-senses` → `rival-gc-finale-fiction`
- `magic-senses` → `aren-session-01`
- `magic-senses` → `scene-fiction-principles`
- `magic-senses` → `grand-questions`
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
- `demon-epoch-framework` → `scene-fiction-principles`
- `demon-epoch-s00` → `seven-demon-lords`
- `demon-epoch-harmony` → `seven-demon-lords`
- `demon-epoch-oath` → `seven-demon-lords`
- `demon-epoch-resonance` → `seven-demon-lords`
- `demon-epoch-shedding` → `seven-demon-lords`
- `demon-epoch-branching` → `seven-demon-lords`
- `demon-epoch-hospitality` → `seven-demon-lords`
- `demon-epoch-dream` → `seven-demon-lords`
- `variable-rules-and-life` → `grand-questions`
- `variable-rules-and-life` → `causal-roleplay`
- `variable-rules-and-life` → `knowledge-horizons`

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

## 6. 보류 항목 (0)


## 7. 열린 교차 편집 제안 (0)

정비에서 승인하지 않는다. 판단 근거를 보고서에 적어 사용자 결정을 요청한다.


## 8. 분량 참고

분량만으로 나누거나 합치지 않는다. 내용상 이유가 있을 때만 보고서에 제안한다. 기준: 10,000자 초과 / 1,500자 미만.

- 긴 문서 (6): `rival-gc-t09-world` 19,396자, `rival-gc-t06-world` 15,310자, `rival-gc-retrospective` 13,071자, `rival-gc-finale-fiction` 12,998자, `rival-play` 12,302자, `rival-gc-t03-world` 10,529자
- 짧은 문서 (1): `editing-guide` 763자

## 9. 분류 참고

분류 14개: 대국 기록 10, 롤플레잉 7, 인물 7, 운영 원칙 6, 개요 3, 천체 3, 안내 2, 마법 2, 세력 1, 마법 공예·항행 1, 장소 1, 소설 1, 사건 1, 사물·개념 1
문서가 하나뿐인 분류 6개: 세력, 마법 공예·항행, 장소, 소설, 사건, 사물·개념. 분류 체계 변경은 제안만 한다.
