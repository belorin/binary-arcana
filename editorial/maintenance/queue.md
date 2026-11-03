# 정비 대기열

> 자동 생성(`scripts/build-maintenance-queue.mjs`). 직접 수정하지 않는다. 기계가 원고 전체에서 찾은 **신호**일 뿐이며, 무엇을 고칠지는 [정비 절차](../../MAINTENANCE.md)에 따라 원고를 읽고 판단한다.

마지막 정비: **M001** (2026-11-03) · [보고서](reports/M001.md) · 다음 정비 버전: **M002**

원고 15개 · 변경 문서 15 · 고립 0 · 한쪽 연결 0 · 보류 0 · 열린 교차 제안 0

## 1. 지난 정비 이후 변경된 문서 (15)

manifest의 수정일이 2026-11-03 이후(당일 포함)이거나 수정일이 없는 문서. 분류별로 묶었으며, 양이 많으면 분류 단위로 나누어 처리한다.

- **개요** (3): `grand-questions`, `start-here`, `open-setting-questions`
- **롤플레잉** (3): `aren-sheet`, `aren-session-01`, `story-state`
- **운영 원칙** (3): `knowledge-horizons`, `causal-roleplay`, `exceptional-generations`
- **안내** (2): `editing-guide`, `worldbuilding-guide`
- **마법** (1): `magic-as-practice`
- **마법 공예·항행** (1): `magical-distance-and-passage`
- **세력** (1): `seven-demon-lords`
- **장소** (1): `low-cape`

## 2. 들어오는 연결이 없는 문서 (0)

다른 문서의 관련 문서·본문 링크·확인된 관계 어디에도 등장하지 않는다. 직접 관련 문서가 있는지 본문을 읽고 확인한다.


## 3. 한쪽에서만 건 관련 문서 (0)

`A → B`는 A의 관련 문서에 B가 있으나 B에는 A가 없다는 뜻이다. 반대 방향도 직접 관련일 때만 맞춘다.


## 4. 관련 문서가 없는 문서 (0)


## 5. 제목·소제목이 비슷한 문서 쌍 (상위 15)

제목·별칭·소제목의 글자 2-gram 유사도(0~1)다. 중복이 아니라 **대조해 볼 후보**이며, 이미 연결된 쌍도 표시한다.

- `start-here` ↔ `open-setting-questions` · 0.11 · 연결됨
- `worldbuilding-guide` ↔ `aren-session-01` · 0.09
- `worldbuilding-guide` ↔ `knowledge-horizons` · 0.09 · 연결됨
- `start-here` ↔ `magic-as-practice` · 0.09 · 연결됨
- `start-here` ↔ `exceptional-generations` · 0.09 · 연결됨
- `knowledge-horizons` ↔ `causal-roleplay` · 0.08 · 연결됨
- `knowledge-horizons` ↔ `aren-session-01` · 0.08
- `causal-roleplay` ↔ `exceptional-generations` · 0.08 · 연결됨
- `grand-questions` ↔ `start-here` · 0.08 · 연결됨
- `start-here` ↔ `magical-distance-and-passage` · 0.07 · 연결됨
- `aren-sheet` ↔ `aren-session-01` · 0.07 · 연결됨
- `worldbuilding-guide` ↔ `causal-roleplay` · 0.07 · 연결됨
- `grand-questions` ↔ `knowledge-horizons` · 0.07
- `editing-guide` ↔ `worldbuilding-guide` · 0.07 · 연결됨
- `worldbuilding-guide` ↔ `magical-distance-and-passage` · 0.07

## 6. 보류 항목 (0)


## 7. 열린 교차 편집 제안 (0)

정비에서 승인하지 않는다. 판단 근거를 보고서에 적어 사용자 결정을 요청한다.


## 8. 분량 참고

분량만으로 나누거나 합치지 않는다. 내용상 이유가 있을 때만 보고서에 제안한다. 기준: 10,000자 초과 / 1,500자 미만.

- 긴 문서 (0): 없음
- 짧은 문서 (1): `editing-guide` 763자

## 9. 분류 참고

분류 8개: 개요 3, 운영 원칙 3, 롤플레잉 3, 안내 2, 세력 1, 마법 1, 마법 공예·항행 1, 장소 1
문서가 하나뿐인 분류 4개: 세력, 마법, 마법 공예·항행, 장소. 분류 체계 변경은 제안만 한다.
