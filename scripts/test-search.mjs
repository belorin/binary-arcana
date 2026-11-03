#!/usr/bin/env node
// Offline candidate search: finds a document by its own title words, keeps
// unpublished documents out unless --all, and marks results as needing review.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync("wiki/manifest.json", "utf8"));
const run = (...args) => {
  const r = spawnSync(process.execPath, ["scripts/search-wiki.mjs", ...args, "--json"], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
};
const doc = manifest.documents.find(d => d.publish === true);
const found = run("--query", doc.title, "--limit", "50");
assert.ok(found.results.some(r => r.id === doc.id), "a document is found by its title");
assert.equal(found.scope, "published_only");
assert.ok(found.results.every(r => r.published));
assert.equal(found.requires_model_review, true);
const related = run("--related", doc.id, "--all", "--limit", "50");
assert.ok(related.results.every(r => r.id !== doc.id), "the anchor is not its own candidate");
console.log("OK: offline search finds documents and keeps review safeguards");
