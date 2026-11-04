#!/usr/bin/env node
// Viewer smoke test: run app.js against a fake DOM with fixture data and check
// that home, listing, search, article, about and the calendar fallback render.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const site = { name: "시험 위키", url: "https://example.github.io/wiki/", repo: "example/wiki", branch: "main",
  categories: ["둘", "하나"], home: { title: "첫 화면" }, about: { title: "소개 제목", lead: "소개 문장", links: [{ id: "a", label: "안내" }] },
  calendar: false, comments: null };
const notes = [
  { id: "a", title: "가 문서", category: "하나", status: "초고", updated: "2026-01-02", summary: "가 요약", tags: ["t"], source: "", related: ["b"],
    body: "## 첫 절\n\n본문 [나](#b) 링크와 **강조**.\n\n```\n<코드> 줄\n둘째 줄\n```\n\n> 인용 하나\n>\n> 인용 둘\n\n## 둘째 절\n\n| 열 | 값 |\n| --- | ---: |\n| x | 1 |\n\n- 목록" },
  { id: "b", title: "나 문서", category: "둘", status: "검토", updated: "2026-01-03", summary: "나 요약", tags: [], source: "출처", related: [], body: "짧은 <b>본문</b>." },
];
function element() {
  return { innerHTML: "", value: "", children: [], attributes: {}, listeners: {}, addEventListener(k, f) { this.listeners[k] = f; },
    setAttribute(k, v) { this.attributes[k] = v; }, replaceChildren() { this.children = []; }, append(x) { this.children.push(x); },
    getAttribute(k) { return this.attributes[k] ?? null; } };
}
const view = element(), search = element(), filters = element();
const nodes = { "#view": view, "#search": search, "#filters": filters, "#sidebar-random": element(), "#explore-toggle": element() };
const windowListeners = {};
const context = {
  document: { querySelector: s => nodes[s], createElement: element, getElementById: () => null, addEventListener() {}, activeElement: null, body: null },
  window: { matchMedia: () => ({ matches: false }), addEventListener: (k, f) => { windowListeners[k] = f; }, scrollTo() {} },
  location: { hash: "" }, navigator: {}, console, Math, Error, setTimeout,
  fetch: async () => ({ ok: true, json: async () => ({ site, notes }) }),
};
vm.runInNewContext(fs.readFileSync("app.js", "utf8"), context, { filename: "app.js", timeout: 5000 });
await new Promise(resolve => setImmediate(resolve));
const go = hash => { context.location.hash = hash; windowListeners.hashchange(); return view.innerHTML; };

assert.match(view.innerHTML, /<h1>첫 화면<\/h1>/);
assert.match(view.innerHTML, /2개 문서/);
assert.deepEqual(filters.children.map(b => b.innerHTML.match(/<span>(.*?)<\/span>/)[1]), ["전체", "둘", "하나"], "topic order follows config");
let html = go("#a");
assert.match(html, /<h1>가 문서<\/h1>/);
assert.match(html, /<h2 id="a-section-1">첫 절<\/h2>/);
assert.match(html, /<a href="#b">나<\/a>/);
assert.match(html, /<pre class="code-block"><code>&lt;코드&gt; 줄\n둘째 줄<\/code><\/pre>/, "fenced code keeps lines and escapes");
assert.match(html, /<blockquote><p>인용 하나<\/p><p>인용 둘<\/p><\/blockquote>/, "a lone > splits a quote into paragraphs");
assert.match(html, /<strong>강조<\/strong>/);
assert.match(html, /<table>.*<td class="align-right">1<\/td>/s);
assert.match(html, /href="https:\/\/github\.com\/example\/wiki\/edit\/main\/wiki\/a\.md"/);
assert.match(html, /data-copy="https:\/\/example\.github\.io\/wiki\/notes\/a\/"/);
assert.doesNotMatch(html, /giscus/, "comments stay off without a categoryId");
assert.match(go("#b"), /짧은 &lt;b&gt;본문&lt;\/b&gt;/, "HTML in Markdown is escaped");
notes[1].body = "앞 문단.\n\n![두 해의 <배치>](wiki/images/orbit-t0.svg)\n\n![외부](https://example.com/x.png)";
html = go("#a"); html = go("#b");
assert.match(html, /<figure class="figure"><a href="wiki\/images\/orbit-t0\.svg"[^>]*><img src="wiki\/images\/orbit-t0\.svg" alt="두 해의 &lt;배치&gt;"/, "local images become figures");
assert.match(html, /<figcaption>두 해의 &lt;배치&gt;<\/figcaption>/);
assert.doesNotMatch(html, /<img src="https/, "only wiki/images/ files are shown as images");
assert.match(go("#b"), /연결된 글.*가 문서/s, "backlinks are shown");
assert.match(go("#about"), /소개 제목.*안내 — 가 문서/s);
assert.match(go("#calendar"), /달력을 쓸 수 없습니다/);
search.value = "나 요약";
assert.match(go("#all"), /1개 문서 · 검색어/);
search.value = "";
assert.match(go("#nothing"), /문서를 찾을 수 없습니다/);
// Configured home: hero, cards (missing ids skipped), topics with empty ones, recent.
const homeSite = { ...site, home: { hero: { title: "세계", lead: "소개", actions: [{ href: "#a", label: "가" }, { href: "#nope", label: "없음" }] },
  sections: [{ type: "cards", title: "카드", items: [{ id: "b", kicker: "K" }, { id: "missing" }] },
    { type: "topics", title: "주제" }, { type: "recent", title: "최근", limit: 1 }] } };
const view2 = element();
const nodes2 = { ...nodes, "#view": view2, "#filters": element() };
vm.runInNewContext(fs.readFileSync("app.js", "utf8"), { ...context, document: { ...context.document, querySelector: s => nodes2[s] },
  location: { hash: "" }, fetch: async () => ({ ok: true, json: async () => ({ site: homeSite, notes }) }) }, { filename: "app.js", timeout: 5000 });
await new Promise(resolve => setImmediate(resolve));
html = view2.innerHTML;
assert.match(html, /<h1>세계<\/h1>/);
assert.match(html, /href="#a">가<\/a>/);
assert.doesNotMatch(html, /#nope/, "actions to missing documents are dropped");
assert.match(html, /home-card-kicker">K<.*나 문서/s);
assert.doesNotMatch(html, /missing/);
assert.match(html, /data-topic="하나"/);
assert.equal((html.match(/<li>/g) || []).length, 1, "recent honours its limit");
console.log("OK: viewer renders home, topics, article, about, search and fallbacks");
