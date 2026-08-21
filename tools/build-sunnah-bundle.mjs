#!/usr/bin/env node
/**
 * Build the data Open Sunnah ships with itself.
 *
 *   public/data/index/<coll>.json          — all ten collections
 *       { name, sections: {n: title}, list: [n, …] }
 *       `list` is the sections that actually hold hadith, computed from
 *       reference.book rather than the declared section_details ranges —
 *       those disagree in Bukhari section 0 (declared 0-0, actually 311).
 *
 *   public/data/editions/<lang>-<coll>.json — the three Forty-collections only
 *       the whole edition, verbatim, for nawawi / qudsi / dehlawi in ara+eng.
 *       The six large collections stay remote: all ten in two languages is
 *       10.72 MB gzipped, 30x the Qur'an bundle.
 *
 * Deterministic: keys sorted recursively, minified, nothing timestamped.
 * No dependencies. Node 18+ (global fetch).
 *
 *   node tools/build-sunnah-bundle.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CDN = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'data');

const COLLS = ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai',
               'ibnmajah', 'malik', 'nawawi', 'qudsi', 'dehlawi'];
const BUNDLED = ['nawawi', 'qudsi', 'dehlawi'];
const LANGS = ['eng', 'ara'];

/** Stable stringify: object keys sorted recursively, minified. */
function stable(v) {
  if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
  if (v && typeof v === 'object') {
    return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}';
  }
  return JSON.stringify(v);
}

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}

function die(msg) { console.error('REFUSING TO WRITE: ' + msg); process.exit(1); }

/** sections that actually hold hadith, keyed the way the app keys them */
function nonEmptySections(hadiths, sections) {
  const byBook = {};
  for (const h of hadiths) {
    const b = h.reference && h.reference.book;
    if (b === undefined || b === null) continue;
    (byBook[b] = byBook[b] || []).push(h);
  }
  return { byBook, list: Object.keys(sections).map(Number).filter(n => (byBook[n] || []).length).sort((a, b) => a - b) };
}

await mkdir(join(OUT, 'index'), { recursive: true });
await mkdir(join(OUT, 'editions'), { recursive: true });

let idxBytes = 0, edBytes = 0;

for (const coll of COLLS) {
  const eng = await getJSON(`${CDN}/editions/eng-${coll}.min.json`);
  const sections = eng.metadata.sections || eng.metadata.section;
  if (!sections || !Object.keys(sections).length) die(`${coll}: no sections in metadata`);
  if (!Array.isArray(eng.hadiths) || !eng.hadiths.length) die(`${coll}: no hadiths`);

  const { list } = nonEmptySections(eng.hadiths, sections);
  if (!list.length) die(`${coll}: no non-empty sections`);

  const body = stable({ name: eng.metadata.name, sections, list });
  await writeFile(join(OUT, 'index', `${coll}.json`), body);
  idxBytes += Buffer.byteLength(body);
  console.log(`index/${coll}.json  ${list.length} sections  ${eng.hadiths.length} hadiths  ${Buffer.byteLength(body)} B`);
}

for (const coll of BUNDLED) {
  for (const lang of LANGS) {
    const ed = `${lang}-${coll}`;
    const d = await getJSON(`${CDN}/editions/${ed}.min.json`);
    if (!Array.isArray(d.hadiths) || !d.hadiths.length) die(`${ed}: no hadiths`);
    // carried verbatim — grades especially, which are the point of the site
    const body = stable(d);
    await writeFile(join(OUT, 'editions', `${ed}.json`), body);
    edBytes += Buffer.byteLength(body);
    console.log(`editions/${ed}.json  ${d.hadiths.length} hadiths  ${Buffer.byteLength(body)} B`);
  }
}

console.log(`\n${COLLS.length} indexes: ${idxBytes} B plain`);
console.log(`${BUNDLED.length * LANGS.length} bundled editions: ${edBytes} B plain`);
console.log(`total ${idxBytes + edBytes} B plain`);
