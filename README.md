# Binary Arcana

https://belorin.github.io/binary-arcana/

두 개의 태양이 도는 쌍성계, 마법과 항성 간 기술이 함께 자란 세계의 설정집. 설정·소설·롤플레잉 게임의 정본.

Markdown 원고를 정본으로 두고, GitHub Actions가 사이트 데이터·AI 색인·정적 페이지를 만들어 GitHub Pages에 배포하는 위키다. 프레임워크나 npm 설치가 필요 없고 Node.js 22만 있으면 된다.

## 처음 한 번

1. 이 폴더를 GitHub 저장소 `belorin/binary-arcana`로 올린다.
2. 저장소 Settings → Pages → Source를 **GitHub Actions**로 바꾼다.
3. `main`에 커밋하면 자동으로 배포된다.

## 정본과 생성물

| 파일 | 역할 |
| --- | --- |
| `wiki/*.md` | 문서 본문의 정본 |
| `wiki/manifest.json` | 문서별 제목·분류·상태·요약·게시 여부 등 메타데이터의 정본 |
| `wiki/relations.json` | 근거 절과 이유가 있는 의미 관계 |
| `wiki/calendar.json` | 달력 보기의 정본(`features.calendar`가 켜져 있을 때) |
| `site.config.json` | 사이트 이름·주소·주제 순서·첫 화면·소개·기능·문서 유형 |
| `templates/*.md` | 새 문서의 틀(`scripts/new-doc.mjs`가 사용) |
| `editorial/ingestions/` | 증보 장부: 반영한 지식 표제와 문서·절, 보류 항목(대화 원문 없음) |
| `editorial/crosslinks/index.json` | 교차 편집 제안: 검토 대기 중인 해석적 연결 가설 |
| `editorial/maintenance/log.json`, `reports/` | 정비 로그와 보고서([MAINTENANCE.md](MAINTENANCE.md)) |
| `editorial/map/` | **생성물.** 편집 지도: 전체 지도, 문서 카드(절 목차·줄 범위·해시), 지식 표제 역색인 |
| `editorial/maintenance/queue.md` | **생성물.** 정비 대기열: 고립·한쪽 연결·비슷한 쌍·보류·열린 제안 신호 |
| `notes.json`, `index.html`, `robots.txt` | **생성물.** 사이트 데이터와 껍데기 |
| `AI_INDEX.md`, `ai/*`, `llms.txt` | **생성물.** 외부 AI용 공개 색인 |
| `notes/`, `sitemap.xml` | 배포 때만 만드는 정적 페이지(커밋하지 않음) |

생성물을 고치지 말고 정본을 고친 뒤 `node scripts/build.mjs`를 실행한다.

## 명령

```
node scripts/build.mjs                 # 생성물 다시 만들기
node scripts/build.mjs --check         # 검사(CI와 같음)
node scripts/build-static.mjs _site    # 정적 페이지 미리 만들기
node scripts/new-doc.mjs --list        # 문서 유형 보기
node scripts/new-doc.mjs note my-topic "새 문서 제목"
node scripts/search-wiki.mjs --query "개념"            # 후보 검색(n-gram·연결 그래프, 의미 검색 아님)
node scripts/search-wiki.mjs --related <문서-id> --all --novel
node scripts/validate-editorial.mjs --report           # 장부 검사와 보류 항목 목록
```

## 편집의 세 갈래

- **증보**([WIKI_PROTOCOL.md](WIKI_PROTOCOL.md)): 지식을 원고에 반영하고 증보 장부에 표제와 위치를 남긴다. 편집 지도 → 문서 카드 → 절 본문 순으로 읽어 중복 없이 증보한다.
- **교차 제안**: 직접 근거가 없는 개념적 연결은 원고에 쓰지 않고 제안 장부에 가설로 남겨 사람의 결정을 기다린다.
- **정비**([MAINTENANCE.md](MAINTENANCE.md)): 가끔 정비 대기열의 신호를 따라 연결·중복·보류를 정리하고 보고서와 로그를 남긴다.

로컬 미리 보기: `node scripts/build-static.mjs _site` 후 저장소 폴더에서 정적 서버를 띄운다(예: `python3 -m http.server`).

## site.config.json

| 키 | 뜻 |
| --- | --- |
| `owner`, `repo`, `branch` | GitHub 저장소. 편집·이력 링크와 원문 주소에 쓴다 |
| `url` | 생략하면 `owner.github.io` 저장소는 `https://owner.github.io/`, 그 밖은 `https://owner.github.io/repo/` |
| `name`, `brand`, `brandSub`, `description`, `author`, `icon`, `footer` | 사이트 이름과 머리말, 설명, 저자, 탭 아이콘(글자 하나), 꼬리말 |
| `theme` | `accent`, `light`, `background` 색(`#rrggbb`) |
| `categories` | 주제 목록의 순서 |
| `home`, `about` | 첫 화면 제목·문구, 소개 화면 제목·문구·먼저 읽을 글 |
| `sidebarLinks` | 왼쪽 탐색에 더할 링크 `{href, label}` |
| `features.calendar` | `true`면 `/#calendar` 달력을 켠다 |
| `features.comments` | giscus 댓글. `{"repoId", "category", "categoryId"}` (giscus.app에서 확인) |
| `types` | 새 문서 유형 `{label, template, category, status}` |
| `verification` | 검색엔진 소유 확인 `{google, naver}` |

## 사이트

`index.html`·`style.css`·`app.js`로 그리는 정적 사이트다. `/`는 무작위 글과 최근 갱신, `/#all`은 전체·검색 목록, `/#about`은 소개, `/#<문서-id>`는 본문(목차·연결된 글·개정 이력·고치기)이다. 배포 때 `notes/<id>/`에 자바스크립트 없이 읽히는 정적 페이지를 만들어 검색엔진과 LLM이 읽을 수 있게 한다.
