import fs from 'fs/promises';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'site.json');

export async function getSite() {
  const raw = await fs.readFile(FILE, 'utf-8');
  return JSON.parse(raw);
}

export async function updateSite(patch: any) {
  const current = await getSite();
  const next = deepMerge(current, patch);
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(next, null, 2), 'utf-8');
  return next;
}

function deepMerge(a: any, b: any): any {
  if (Array.isArray(b)) return b;
  if (b === null || typeof b !== 'object') return b === undefined ? a : b;
  const out = { ...a };
  for (const k of Object.keys(b)) {
    out[k] = deepMerge(a?.[k], b[k]);
  }
  return out;
}
