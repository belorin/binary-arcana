#!/usr/bin/env node
// Calendar test: run calendar.js with the real wiki/calendar.json and check the
// T0 time arithmetic and that the 큰 순서, T0 연대 and 한 해 pages render.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const context = { window: { addEventListener() {} }, document: {}, location: { hash: "" }, console, Math, Number };
vm.runInNewContext(fs.readFileSync("calendar.js", "utf8"), context, { filename: "calendar.js", timeout: 5000 });
const C = context.window.Calendar;
assert.equal(C.dayOf("T0"), 0);
assert.equal(C.dayOf("T0-33"), -33);
assert.equal(C.dayOf("T0+1해2철"), 528);
assert.equal(C.dayOf("T0+3물때4날"), 37);
assert.deepEqual({ ...C.parts(0) }, { year: 0, season: 1, tide: 1, day: 1, r: 0 });
assert.deepEqual({ ...C.parts(220) }, { year: 0, season: 6, tide: 1, day: 1, r: 220 }, "the second 겹침 opens the 6철");
assert.deepEqual({ ...C.parts(-33) }, { year: -1, season: 10, tide: 2, day: 1, r: 407 });
assert.equal(JSON.stringify(C.cycleRanges({ every: { from: "10철 4물때", to: "1철 1물때" } })), "[[429,439],[0,10]]", "a span past the 10철 wraps");

const manifest = JSON.parse(fs.readFileSync("wiki/manifest.json", "utf8"));
const titles = new Map(manifest.documents.map(d => [d.id, d]));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const ctx = { esc, byId: id => titles.get(id), permalink: id => "#" + id };
C.setData(JSON.parse(fs.readFileSync("wiki/calendar.json", "utf8")));

C.setView("era");
let html = C.page(ctx);
assert.match(html, /class="cal-ladder"/);
assert.ok(html.indexOf("일곱 마왕의 시대") < html.indexOf("직전 재편"), "eras keep their order");
assert.match(html, /class="cal-sub"/, "decimal eras sit under their era");

for (const scale of ["해", "철", "물때"]) {
  C.setView("line", scale);
  html = C.page(ctx);
  assert.match(html, /T0−1해|T0해/, scale + " rows are labelled from T0");
  assert.match(html, /data-ids="[^"]*c024/, scale + " shows the T0 entry");
}
C.setView("line", "철");
assert.match(C.page(ctx), /cal-row cal-strong[^>]*><span class="cal-label">T0해 1철/, "겹침철 rows stand out");

C.setView("cycle");
html = C.page(ctx);
assert.equal((html.match(/class="cal-row/g) || []).length, 40, "one 해 is 40 물때");
assert.equal((html.match(/cal-ov[" ]/g) || []).length, 2, "two 겹침 a year");
assert.match(html, /6철 · 겹침철/);
console.log("OK: calendar counts from T0 and renders 큰 순서, T0 연대 and 한 해");
