#!/usr/bin/env node
/**
 * Run every generator in order, or with --check verify that the committed
 * generated files are current and run the validators and tests.
 *
 *   node scripts/build.mjs          # regenerate site data, AI index, wiki map, maintenance queue
 *   node scripts/build.mjs --check  # verify everything (what CI runs)
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import process from "node:process";

const check = process.argv.includes("--check");
const run = (...args) => execFileSync(process.execPath, args, { stdio: "inherit" });
const flag = check ? ["--check"] : [];
run("scripts/build-shell.mjs", ...flag);
run("scripts/build-notes.mjs", ...flag);
run("scripts/build-ai-index.mjs", ...flag);
run("scripts/build-wiki-map.mjs", ...flag);
run("scripts/build-maintenance-queue.mjs", ...flag);
run("scripts/validate-editorial.mjs");
run("scripts/validate-crosslinks.mjs");
if (fs.existsSync("wiki/calendar.json")) run("scripts/validate-calendar.mjs");
if (check) {
  run("scripts/test-editorial.mjs");
  run("scripts/test-search.mjs");
  run("scripts/test-inbox.mjs");
  run("scripts/apply-inbox.mjs", "--check");
  run("--check", "app.js");
  run("--check", "calendar.js");
  run("scripts/test-viewer.mjs");
  run("scripts/test-calendar.mjs");
}
