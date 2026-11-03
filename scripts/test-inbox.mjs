#!/usr/bin/env node
// Inbox checks on a throwaway copy of the repository: a valid bundle applies
// in full and is removed; a broken one changes nothing and is moved to rejected/.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "inbox-"));
try {
  for (const entry of ["wiki", "editorial", "scripts", "templates", "site.config.json", "app.js", "notes.json"]) {
    fs.cpSync(entry, path.join(tmp, entry), { recursive: true });
  }
  fs.mkdirSync(path.join(tmp, "inbox"));
  const run = () => execFileSync(process.execPath, ["scripts/apply-inbox.mjs"], { cwd: tmp, encoding: "utf8", env: { ...process.env, INBOX_MESSAGE_FILE: path.join(tmp, "msg") } });
  const manifest = () => JSON.parse(fs.readFileSync(path.join(tmp, "wiki/manifest.json"), "utf8"));
  const doc = manifest().documents.find(d => d.publish === true);
  const heading = fs.readFileSync(path.join(tmp, doc.path), "utf8").match(/^## (.+)$/m)[1];

  fs.writeFileSync(path.join(tmp, "inbox/20260101-ok.md"), `---
message: test: 묶음 적용
---

=== FILE wiki/inbox-test.md ===
# 수신함 시험 문서

> 시험.

## 첫 절

본문. [연결](./${doc.id}.md)
=== END ===

=== MANIFEST inbox-test ===
{"category": "안내", "status": "초안", "summary": "시험 요약.", "related": ["${doc.id}"]}
=== END ===

=== APPEND ${doc.path} § ${heading} ===
덧붙인 문장.
=== END ===

=== MANIFEST ${doc.id} ===
{"related+": ["inbox-test"]}
=== END ===
`);
  run();
  assert.ok(!fs.existsSync(path.join(tmp, "inbox/20260101-ok.md")), "applied bundle is removed");
  const m = manifest();
  const added = m.documents.find(d => d.id === "inbox-test");
  assert.equal(added.title, "수신함 시험 문서");
  assert.ok(m.documents.find(d => d.id === doc.id).related.includes("inbox-test"));
  const body = fs.readFileSync(path.join(tmp, doc.path), "utf8");
  const section = body.slice(body.indexOf("## " + heading));
  const nextHeading = section.slice(3).search(/\n#{2} /);
  assert.ok((nextHeading < 0 ? section : section.slice(0, nextHeading + 3)).includes("덧붙인 문장."), "APPEND lands inside the section");
  assert.equal(fs.readFileSync(path.join(tmp, "msg"), "utf8").trim(), "test: 묶음 적용");

  const before = fs.readFileSync(path.join(tmp, "wiki/manifest.json"), "utf8");
  fs.writeFileSync(path.join(tmp, "inbox/20260102-bad.md"), `---
message: test: 깨진 묶음
---

=== FILE wiki/inbox-bad.md ===
# 깨진 문서

[없는 문서](./no-such-doc.md)
=== END ===

=== MANIFEST inbox-bad ===
{"category": "안내", "status": "초안", "summary": "깨짐."}
=== END ===
`);
  run();
  assert.ok(fs.existsSync(path.join(tmp, "inbox/rejected/20260102-bad.md")), "broken bundle is moved to rejected/");
  assert.match(fs.readFileSync(path.join(tmp, "inbox/rejected/20260102-bad.error.txt"), "utf8"), /broken link|no-such-doc/);
  assert.ok(!fs.existsSync(path.join(tmp, "wiki/inbox-bad.md")), "nothing from a rejected bundle stays");
  assert.equal(fs.readFileSync(path.join(tmp, "wiki/manifest.json"), "utf8"), before, "manifest is rolled back");
  console.log("OK: inbox applies whole bundles and rolls back broken ones");
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
