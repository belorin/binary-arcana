# 수신함 (inbox)

파일 하나만 커밋하면 위키의 여러 파일이 한 번에 바뀌는 통로다. 세션 마감처럼 여러 문서를 고쳐야 할 때, 파일마다 커밋하는 대신 **이 폴더에 묶음 파일 하나를 커밋**한다. 사용 절차는 [PLAY.md](../PLAY.md)에 있다.

`main`에 커밋되면 GitHub Actions가 `scripts/apply-inbox.mjs`로 묶음을 풀어 적용하고, 위키 전체를 검사한 뒤 한 커밋으로 반영하고 배포한다.

- **성공:** 묶음 파일은 지워지고, 바뀐 문서들이 `chore: 적용 — <message>` 커밋으로 들어간다.
- **실패:** 아무것도 바뀌지 않는다. 묶음은 `inbox/rejected/`로 옮겨지고, 같은 이름의 `.error.txt`에 실패 이유가 적힌다. 고친 묶음을 새 이름으로 `inbox/`에 다시 올린다. 실패한 묶음이 있어도 사이트의 나머지 배포는 막히지 않는다.

## 파일 이름

`inbox/YYYYMMDD-짧은-이름.md` (예: `inbox/20261104-aren-day2.md`). 여러 개가 있으면 이름순으로 적용한다.

## 형식

```text
---
message: story: 아렌 둘째 날
---

=== FILE wiki/aren-session-02.md ===
# 아렌의 두 번째 세션 — 제목

> 머리말

## 소설 — 제목

본문…
=== END ===

=== MANIFEST aren-session-02 ===
{"category": "롤플레잉", "status": "진행함", "summary": "한 문장 요약.", "tags": ["아렌", "세션"], "related": ["aren-session-01", "story-state"], "aliases": ["아렌 둘째 날"]}
=== END ===

=== FILE wiki/story-state.md ===
# 이야기 현재 상태
…전체 내용…
=== END ===

=== APPEND wiki/low-cape.md § 이곳에서 일어난 사건 ===
덧붙일 문단.
=== END ===

=== MANIFEST aren-session-01 ===
{"related+": ["aren-session-02"]}
=== END ===
```

| 블록 | 하는 일 |
| --- | --- |
| `=== FILE <경로> ===` | 파일을 새로 만들거나 **통째로** 바꾼다. 기존 문서를 FILE로 쓸 때는 줄이지 말고 전체를 쓴다 |
| `=== APPEND <경로> ===` | 파일 끝에 덧붙인다 |
| `=== APPEND <경로> § <절 제목> ===` | 그 절(하위 절 포함)의 끝에 덧붙인다. 절 제목은 문서에 정확히 하나 있어야 한다 |
| `=== MANIFEST <문서-id> ===` | `wiki/manifest.json`의 그 문서 항목을 고치거나 새로 만든다. JSON 객체. `"related+": [...]`처럼 키 끝에 `+`를 붙이면 배열에 더한다(중복 제외) |

- 모든 블록은 `=== END ===` 한 줄로 닫는다.
- 쓸 수 있는 경로: `wiki/<id>.md`, `wiki/relations.json`, `wiki/calendar.json`, `editorial/ingestions/ing-YYYYMMDD-<이름>.json`, `editorial/crosslinks/index.json`. 그 밖의 경로와 생성물은 거부된다.
- 새 `wiki/<id>.md`에는 반드시 MANIFEST 블록이 있어야 한다. 새 항목의 기본값: `publish: true`, `order` 맨 뒤, `updated` 오늘, `review_state: "unassessed"`. 게시하려면 `category`, `status`, `summary`를 꼭 준다.
- FILE·APPEND로 바뀐 문서는 `updated`가 오늘(한국 시간)로 자동 갱신되고, 제목은 `# 제목` 줄을 따른다.
- 새 장부 배치 `editorial/ingestions/ing-….json`은 `index.json`에 자동으로 등록된다.
- 묶음 안의 블록은 위에서부터 차례로 적용되고, 검사에 실패하면 묶음 전체가 취소된다.
