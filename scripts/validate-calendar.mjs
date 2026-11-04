#!/usr/bin/env node
/**
 * Validate wiki/calendar.json, the source of the desktop calendar (/#calendar).
 * Entries are added during maintenance (MAINTENANCE.md) and only for documents
 * or sections whose time is specific. The world has no 원년: time is counted
 * from T0 in P3 units (1해 = 10철, 1철 = 4물때 = 44날, 1물때 = 11날).
 *
 *   era:       {"id":"c001","label":"…","era":1,"when":"직전 재편보다 훨씬 앞","doc":"id","section":"절 제목"}
 *              era: a positive number giving the order; decimals sit under the whole number
 *   T0 연대:   {"id":"c010","label":"…","from":"T0-33","to":"T0","doc":"id"}
 *              from/to: T0, or T0 + or - an amount in 해/철/물때/날 written largest first
 *              (T0+220, T0-1해2철, T0+3물때4날); a bare number is 날; to is optional
 *   한 해:     {"id":"c030","label":"…","every":{"from":"1철","to":"1철 2물때 5날"},"doc":"id"}
 *              every.from/to: N철, N철 M물때 or N철 M물때 K날; to before from wraps the 해
 *
 * Usage: node scripts/validate-calendar.mjs [file]
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const file = path.resolve(root, process.argv[2] || "wiki/calendar.json");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "wiki", "manifest.json"), "utf8"));
const docs = new Map(manifest.documents.map(d => [d.id, d]));
const fail = message => { throw new Error("calendar: " + message); };
const headings = new Map();

function exactFields(obj, allowed, label) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) fail(label + ": must be an object");
  for (const key of Object.keys(obj)) if (!allowed.includes(key)) fail(label + ": unexpected field " + key);
}
function line(value, label, max) {
  if (typeof value !== "string" || !value.trim() || value.length > max || /[\r\n\u0000-\u001f]/.test(value) ||
      /https?:\/\//i.test(value)) fail(label + ": expected a nonempty single-line string without URLs <= " + max);
}
const UNITS = ["해", "철", "물때", "날"], DAYS = { 해: 440, 철: 44, 물때: 11, 날: 1 };
function point(value, label) {
  const m = /^T0(?:([+-])((?:\d+(?:해|철|물때|날)?)+))?$/.exec(value ?? "");
  if (!m) fail(label + ": expected T0, T0+N or T0-N with 해/철/물때/날 (e.g. T0-33, T0+1해2철)");
  if (!m[1]) return 0;
  let days = 0, last = -1;
  const tokens = [...m[2].matchAll(/(\d+)(해|철|물때|날)?/g)];
  tokens.forEach(([, n, unit], k) => {
    const at = UNITS.indexOf(unit || "날");
    if (!unit && k !== tokens.length - 1) fail(label + ": a bare number (날) must come last");
    if (at <= last) fail(label + ": write 해, 철, 물때, 날 once each, largest first");
    last = at;
    days += +n * DAYS[unit || "날"];
  });
  if (days === 0) fail(label + ": write T0 instead of a zero offset");
  return m[1] === "-" ? -days : days;
}
function cycleDay(value, label) {
  const m = /^(\d{1,2})철(?: (\d)물때)?(?: (\d{1,2})날)?$/.exec(value ?? "");
  if (!m || +m[1] < 1 || +m[1] > 10 || (m[2] && (+m[2] < 1 || +m[2] > 4)) || (m[3] && (+m[3] < 1 || +m[3] > (m[2] ? 11 : 44))))
    fail(label + ": expected N철 (1–10), N철 M물때 (1–4) or N철 M물때 K날 (1–11)");
}
function sectionCount(doc, section) {
  if (!headings.has(doc.id)) {
    const text = fs.readFileSync(path.resolve(root, doc.path), "utf8");
    headings.set(doc.id, Array.from(text.matchAll(/^#{2,6}[ \t]+(.+?)[ \t]*$/gm), m => m[1].trim()));
  }
  return headings.get(doc.id).filter(h => h === section).length;
}

const data = JSON.parse(fs.readFileSync(file, "utf8"));
exactFields(data, ["version", "description", "entries"], "file");
if (data.version !== 1 || !Array.isArray(data.entries)) fail("version must be 1 and entries an array");
const seen = new Set();
let eras = 0, linear = 0, recurring = 0;
for (const entry of data.entries) {
  const id = entry?.id;
  if (typeof id !== "string" || !/^c\d{3,}$/.test(id) || seen.has(id)) fail("bad or duplicate id " + id);
  seen.add(id);
  exactFields(entry, ["id", "label", "era", "when", "from", "to", "every", "doc", "section"], id);
  line(entry.label, id + ".label", 60);
  const doc = docs.get(entry.doc);
  if (!doc) fail(id + ": unknown doc " + entry.doc);
  if (doc.publish !== true) fail(id + ": doc " + entry.doc + " is not published");
  if (entry.section !== undefined) {
    line(entry.section, id + ".section", 200);
    const count = sectionCount(doc, entry.section);
    if (count !== 1) fail(id + ": expected exactly one heading '" + entry.section + "' in " + doc.path + ", found " + count);
  }
  const kinds = ["era", "from", "every"].filter(k => entry[k] !== undefined);
  if (kinds.length !== 1) fail(id + ": use exactly one of era (큰 순서), from/to (T0 연대) or every (한 해)");
  if (entry.era !== undefined) {
    if (typeof entry.era !== "number" || !(entry.era > 0) || entry.to !== undefined) fail(id + ": era must be a positive number, without to");
    line(entry.when, id + ".when", 60);
    eras++;
  } else if (entry.when !== undefined) fail(id + ": when belongs to era entries");
  else if (entry.every !== undefined) {
    if (entry.to !== undefined) fail(id + ": a recurring entry keeps to inside every");
    exactFields(entry.every, ["from", "to"], id + ".every");
    cycleDay(entry.every.from, id + ".every.from");
    if (entry.every.to !== undefined) cycleDay(entry.every.to, id + ".every.to");
    recurring++;
  } else {
    const start = point(entry.from, id + ".from");
    if (entry.to !== undefined && point(entry.to, id + ".to") < start) fail(id + ": to is before from");
    linear++;
  }
}
console.log("OK: calendar has " + eras + " 큰 순서, " + linear + " T0 연대 and " + recurring + " 한 해 entries, all pointing to published documents and existing sections");
