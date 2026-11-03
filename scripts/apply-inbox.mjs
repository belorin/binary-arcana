#!/usr/bin/env node
/**
 * Apply inbox bundles (inbox/*.md) to the wiki in one step, so an editor that
 * can only commit one file at a time can still make a whole change at once.
 * The format is described in inbox/README.md.
 *
 *   node scripts/apply-inbox.mjs            # apply every bundle; delete it on success,
 *                                           # move it to inbox/rejected/ with an .error.txt on failure
 *   node scripts/apply-inbox.mjs --check    # parse every bundle without writing anything
 *
 * After applying, the touched wiki files are validated by the regular build
 * scripts. A failed bundle is rolled back completely, so it never half-applies
 * and never blocks the deploy of the rest of the wiki.
 * The commit message of the applied bundles is written to $INBOX_MESSAGE_FILE
 * when that variable is set (the deploy workflow uses it).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const inboxDir = path.join(root, "inbox");
const rejectedDir = path.join(inboxDir, "rejected");
const check = process.argv.includes("--check");
const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
const ALLOWED = [
  /^wiki\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/,
  /^wiki\/(?:relations|calendar)\.json$/,
  /^editorial\/ingestions\/ing-\d{8}-[a-z0-9]+(?:-[a-z0-9]+)*\.json$/,
  /^editorial\/crosslinks\/index\.json$/,
];
const MANIFEST = "wiki/manifest.json";
const fail = message => { throw new Error(message); };

// --- parsing -----------------------------------------------------------------
function parse(text, name) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  let i = 0, message = null;
  if (lines[0]?.trim() === "---") {
    for (i = 1; i < lines.length && lines[i].trim() !== "---"; i++) {
      const m = lines[i].match(/^message:\s*(.+)$/);
      if (m) message = m[1].trim();
    }
    if (i >= lines.length) fail(name + ": front matter is not closed with ---");
    i++;
  }
  if (!message) fail(name + ": front matter needs 'message: <commit message>'");
  const ops = [];
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const head = line.match(/^=== (FILE|APPEND|MANIFEST) (.+?) ===$/);
    if (!head) fail(name + `: line ${i + 1}: expected '=== FILE|APPEND|MANIFEST … ===', got: ${line.slice(0, 60)}`);
    const body = [];
    for (i++; i < lines.length && lines[i] !== "=== END ==="; i++) body.push(lines[i]);
    if (i >= lines.length) fail(name + `: block '${head[2]}' is not closed with '=== END ==='`);
    while (body.length && !body[0].trim()) body.shift();
    while (body.length && !body.at(-1).trim()) body.pop();
    const [, kind, target] = head;
    if (kind === "MANIFEST") {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(target)) fail(name + ": MANIFEST needs a document id: " + target);
      let data;
      try { data = JSON.parse(body.join("\n")); } catch (e) { fail(name + ": MANIFEST " + target + " is not valid JSON: " + e.message); }
      if (!data || typeof data !== "object" || Array.isArray(data)) fail(name + ": MANIFEST " + target + " must be a JSON object");
      ops.push({ kind, id: target, data });
    } else {
      const [file, section] = target.split(/\s+§\s+/);
      if (!ALLOWED.some(r => r.test(file))) fail(name + ": path not allowed in an inbox bundle: " + file);
      if (kind === "FILE" && section) fail(name + ": FILE takes a path only: " + target);
      if (section && !file.endsWith(".md")) fail(name + ": § sections apply to Markdown only: " + target);
      if (!body.length) fail(name + ": empty " + kind + " block for " + target);
      ops.push({ kind, file, section: section?.trim(), text: body.join("\n") });
    }
  }
  if (!ops.length) fail(name + ": no blocks");
  return { message, ops };
}

// --- applying ----------------------------------------------------------------
function appendToSection(markdown, section, text, label) {
  const lines = markdown.replace(/\s+$/, "").split("\n");
  if (!section) return lines.join("\n") + "\n\n" + text + "\n";
  const heads = lines.map((l, n) => [n, l.match(/^(#{2,6})[ \t]+(.+?)[ \t]*$/)]).filter(([, m]) => m);
  const found = heads.filter(([, m]) => m[2] === section);
  if (found.length !== 1) fail(label + ": expected exactly one heading '" + section + "', found " + found.length);
  const [at, m] = found[0];
  const next = heads.find(([n, h]) => n > at && h[1].length <= m[1].length);
  let end = next ? next[0] : lines.length;
  while (end > at + 1 && !lines[end - 1].trim()) end--;
  lines.splice(end, 0, "", text, ...(next ? [""] : []));
  return lines.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

function apply(bundle, name) {
  const files = new Map(); // path -> new text (pending)
  const read = file => files.has(file) ? files.get(file)
    : fs.existsSync(path.join(root, file)) ? fs.readFileSync(path.join(root, file), "utf8") : null;
  const manifest = JSON.parse(read(MANIFEST));
  const byId = new Map(manifest.documents.map(d => [d.id, d]));
  const touched = new Set();

  for (const op of bundle.ops) {
    if (op.kind === "FILE") {
      let text = op.text + "\n";
      if (op.file.endsWith(".json")) {
        try { text = JSON.stringify(JSON.parse(op.text), null, 2) + "\n"; } catch (e) { fail(name + ": " + op.file + " is not valid JSON: " + e.message); }
      } else if (!/^# .+\n\n/.test(text)) fail(name + ": " + op.file + " must start with '# 제목' and a blank line");
      files.set(op.file, text);
      touched.add(op.file);
    } else if (op.kind === "APPEND") {
      const current = read(op.file);
      if (current === null) fail(name + ": APPEND to a missing file " + op.file + " (use FILE to create it)");
      files.set(op.file, appendToSection(current, op.section, op.text, name + ": " + op.file));
      touched.add(op.file);
    }
  }
  for (const op of bundle.ops.filter(o => o.kind === "MANIFEST")) {
    const file = "wiki/" + op.id + ".md";
    const text = read(file);
    if (text === null) fail(name + ": MANIFEST " + op.id + " has no " + file);
    let entry = byId.get(op.id);
    if (!entry) {
      entry = { path: file, publish: true, order: Math.max(-1, ...manifest.documents.map(d => d.order ?? -1)) + 1, id: op.id,
        title: text.match(/^# (.+)$/m)[1].trim(), category: "", status: "초안", updated: today, summary: "",
        tags: [], source: "", related: [], aliases: [], review_state: "unassessed", last_enriched_on: null };
      manifest.documents.push(entry);
      byId.set(op.id, entry);
    }
    for (const [key, value] of Object.entries(op.data)) {
      if (["id", "path"].includes(key)) fail(name + ": MANIFEST " + op.id + " cannot change " + key);
      if (key.endsWith("+")) {
        const field = key.slice(0, -1);
        if (!Array.isArray(value) || !Array.isArray(entry[field] ?? [])) fail(name + ": " + key + " must add to an array");
        entry[field] = [...new Set([...(entry[field] ?? []), ...value])];
      } else entry[key] = value;
    }
  }
  // Every touched article is registered and dated; titles follow the "# heading".
  for (const file of touched) {
    if (!file.startsWith("wiki/") || !file.endsWith(".md")) continue;
    const id = file.slice(5, -3);
    const entry = byId.get(id);
    if (!entry) fail(name + ": " + file + " is new but has no MANIFEST block");
    if (!bundle.ops.some(o => o.kind === "MANIFEST" && o.id === id && "updated" in o.data)) entry.updated = today;
    entry.title = files.get(file).match(/^# (.+)$/m)[1].trim();
  }
  // A new ingestion batch is listed in the ledger index automatically.
  for (const file of touched) {
    const m = file.match(/^editorial\/ingestions\/(ing-.+)\.json$/);
    if (!m) continue;
    const index = JSON.parse(read("editorial/ingestions/index.json"));
    if (!index.batches.includes(m[1])) {
      index.batches.push(m[1]);
      files.set("editorial/ingestions/index.json", JSON.stringify(index, null, 2) + "\n");
    }
  }
  files.set(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  return { files, touched };
}

function validate() {
  const run = script => execFileSync(process.execPath, [script], { cwd: root, stdio: "pipe", encoding: "utf8" });
  for (const script of ["scripts/build-notes.mjs", "scripts/build-ai-index.mjs", "scripts/validate-editorial.mjs",
    "scripts/validate-crosslinks.mjs", "scripts/validate-calendar.mjs"]) {
    try { run(script); } catch (e) {
      const line = String(e.stderr || "").split("\n").find(l => /^\w*Error: /.test(l));
      fail(script + ": " + (line ? line.replace(/^\w*Error: /, "") : e.message));
    }
  }
}

// --- main --------------------------------------------------------------------
const bundles = fs.existsSync(inboxDir)
  ? fs.readdirSync(inboxDir).filter(n => n.endsWith(".md") && n !== "README.md").sort()
  : [];
if (!bundles.length) { console.log("Inbox: empty"); process.exit(0); }
const applied = [], rejected = [];
for (const name of bundles) {
  const source = path.join(inboxDir, name);
  try {
    const bundle = parse(fs.readFileSync(source, "utf8"), name);
    if (check) { console.log(`Inbox: ${name} parses (${bundle.ops.length} blocks)`); continue; }
    const { files } = apply(bundle, name);
    const backup = new Map([...files.keys(), "notes.json"].map(f => [f, fs.existsSync(path.join(root, f)) ? fs.readFileSync(path.join(root, f), "utf8") : null]));
    for (const [file, text] of files) fs.writeFileSync(path.join(root, file), text);
    try { validate(); } catch (e) {
      for (const [file, text] of backup) {
        if (text === null) fs.rmSync(path.join(root, file), { force: true });
        else fs.writeFileSync(path.join(root, file), text);
      }
      throw e;
    }
    fs.rmSync(source);
    applied.push(bundle.message);
    console.log(`Inbox: applied ${name} — ${bundle.message} (${files.size} files)`);
  } catch (e) {
    if (check) { console.error(e.message); process.exitCode = 1; continue; }
    fs.mkdirSync(rejectedDir, { recursive: true });
    fs.renameSync(source, path.join(rejectedDir, name));
    fs.writeFileSync(path.join(rejectedDir, name.replace(/\.md$/, ".error.txt")), today + "\n" + e.message + "\n");
    rejected.push(name);
    console.log(`Inbox: rejected ${name} — ${e.message}`);
  }
}
if (!check && process.env.INBOX_MESSAGE_FILE && (applied.length || rejected.length)) {
  const message = applied.length === 1 && !rejected.length ? applied[0]
    : [...applied, ...rejected.map(n => "rejected " + n)].join("; ");
  fs.writeFileSync(process.env.INBOX_MESSAGE_FILE, message + "\n");
}
