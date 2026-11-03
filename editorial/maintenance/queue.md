# 정비 대기열

> 자동 생성(`scripts/build-maintenance-queue.mjs`). 직접 수정하지 않는다. 기계가 원고 전체에서 찾은 **신호**일 뿐이며, 무엇을 고칠지는 [정비 절차](../../MAINTENANCE.md)에 따라 원고를 읽고 판단한다.

마지막 정비: 없음 · 다음 정비 버전: **M001** (첫 정비이므로 모든 문서가 변경 문서로 잡힌다)

원고 7개 · 변경 문서 7 · 고립 0 · 한쪽 연결 1 · 보류 0 · 열린 교차 제안 0

## 1. 지난 정비 이후 변경된 문서 (7)

첫 정비이므로 전체 문서. 분류별로 묶었으며, 양이 많으면 분류 단위로 나누어 처리한다.

- **개요** (3): `grand-questions`, `start-here`, `open-setting-questions`
- **안내** (3): `editing-guide`, `worldbuilding-guide`, `knowledge-horizons`
- **세력** (1): `seven-demon-lords`

## 2. 들어오는 연결이 없는 문서 (0)

다른 문서의 관련 문서·본문 링크·확인된 관계 어디에도 등장하지 않는다. 직접 관련 문서가 있는지 본문을 읽고 확인한다.


## 3. 한쪽에서만 건 관련 문서 (1)

`A → B`는 A의 관련 문서에 B가 있으나 B에는 A가 없다는 뜻이다. 반대 방향도 직접 관련일 때만 맞춘다.

- `knowledge-horizons` → `start-here`

## 4. 관련 문서가 없는 문서 (0)


## 5. 제목·소제목이 비슷한 문서 쌍 (상위 15)

제목·별칭·소제목의 글자 2-gram 유사도(0~1)다. 중복이 아니라 **대조해 볼 후보**이며, 이미 연결된 쌍도 표시한다.

- `worldbuilding-guide` ↔ `knowledge-horizons` · 0.09 · 연결됨
- `editing-guide` ↔ `worldbuilding-guide` · 0.09 · 연결됨
- `grand-questions` ↔ `start-here` · 0.09 · 연결됨
- `start-here` ↔ `open-setting-questions` · 0.07 · 연결됨
- `grand-questions` ↔ `knowledge-horizons` · 0.07
- `grand-questions` ↔ `open-setting-questions` · 0.06 · 연결됨
- `grand-questions` ↔ `seven-demon-lords` · 0.06 · 연결됨
- `start-here` ↔ `worldbuilding-guide` · 0.05 · 연결됨
- `seven-demon-lords` ↔ `knowledge-horizons` · 0.04 · 연결됨
- `open-setting-questions` ↔ `worldbuilding-guide` · 0.04 · 연결됨
- `grand-questions` ↔ `editing-guide` · 0.03
- `start-here` ↔ `knowledge-horizons` · 0.03 · 연결됨
- `open-setting-questions` ↔ `seven-demon-lords` · 0.03
- `start-here` ↔ `seven-demon-lords` · 0.02 · 연결됨
- `start-here` ↔ `editing-guide` · 0.01 · 연결됨

## 6. 보류 항목 (0)


## 7. 열린 교차 편집 제안 (0)

정비에서 승인하지 않는다. 판단 근거를 보고서에 적어 사용자 결정을 요청한다.


## 8. 분량 참고

분량만으로 나누거나 합치지 않는다. 내용상 이유가 있을 때만 보고서에 제안한다. 기준: 10,000자 초과 / 1,500자 미만.

- 긴 문서 (0): 없음
- 짧은 문서 (3): `editing-guide` 763자, `worldbuilding-guide` 1,092자, `open-setting-questions` 1,230자

## 9. 분류 참고

분류 3개: 개요 3, 안내 3, 세력 1
문서가 하나뿐인 분류 1개: 세력. 분류 체계 변경은 제안만 한다.
