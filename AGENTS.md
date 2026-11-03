# AI 편집 지침

이 저장소는 https://belorin.github.io/binary-arcana/ 에 게시되는 위키 「Binary Arcana」다. 지식을 주제별 원고로 집필하고 연결하며 갱신한다.

## 작업별 규칙

| 작업 | 읽을 문서 |
| --- | --- |
| 소설·롤플레잉 세션 진행과 기록 | [PLAY.md](./PLAY.md) — 이것부터. 세션 끝에 `inbox/` 묶음 하나만 커밋 |
| 두 AI가 적대 세력을 맡는 대국 | [wiki/rival-play.md](./wiki/rival-play.md)(확정 규칙) + [wiki/rival-gc-state.md](./wiki/rival-gc-state.md)(현재 기준 상태). 자기 역할의 문서만 쓴다 |
| 대화·자료의 지식을 위키에 반영 | [WIKI_PROTOCOL.md](./WIKI_PROTOCOL.md) + [GUIDE.md](./GUIDE.md) |
| 위키 전체 정비 | [WIKI_PROTOCOL.md](./WIKI_PROTOCOL.md) + [MAINTENANCE.md](./MAINTENANCE.md) |
| 새 문서 만들기 | [GUIDE.md](./GUIDE.md)의 문서 유형 + `node scripts/new-doc.mjs --list` |
| 사이트·스크립트·워크플로 수정 | [README.md](./README.md) |

## 어떤 작업에서도 지키는 것

- 본문의 정본은 `wiki/*.md`, 메타데이터는 `wiki/manifest.json`, 의미 관계는 `wiki/relations.json`, 달력은 `wiki/calendar.json`, 사이트 설정은 `site.config.json`이다. 편집 기록의 정본은 `editorial/ingestions/`(증보 장부), `editorial/crosslinks/index.json`(교차 제안), `editorial/maintenance/log.json`과 `reports/`(정비)다.
- 생성물은 직접 쓰지 않는다: `notes.json`, `index.html`, `robots.txt`, `AI_INDEX.md`, `ai/*`, `llms.txt`, `editorial/map/*`, `editorial/maintenance/queue.md`. 커밋하면 GitHub Actions가 다시 만든다.
- 대화 원문·공유 URL·API 키·토큰·개인 정보를 저장소에 넣지 않는다. 공개 저장소다.
- 사용자가 요청하지 않는 한 문서 주소 `/#문서-id`와 `.nojekyll`을 유지한다.
- **커밋은 한 작업에 한 번이 원칙이다.** 여러 파일을 한 커밋으로 올릴 수 없는 도구라면 [수신함](./inbox/README.md)에 묶음 파일 하나를 커밋하는 것을 먼저 쓴다. 그것도 안 되면 마지막 커밋을 뺀 모든 커밋 메시지 끝에 `[skip ci]`를 붙인다. 이유와 절차는 [WIKI_PROTOCOL.md](./WIKI_PROTOCOL.md) §10에 있다.
