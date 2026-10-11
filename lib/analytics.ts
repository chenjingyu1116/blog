import fs from 'fs/promises';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'analytics.json');

interface Analytics {
  total: { pv: number; uv: number };
  daily: Record<string, { pv: number; uv: number }>;
  visitors: string[];
  postViews: Record<string, number>;
}

const EMPTY: Analytics = { total: { pv: 0, uv: 0 }, daily: {}, visitors: [], postViews: {} };

async function read(): Promise<Analytics> {
  try {
    const raw = await fs.readFile(FILE, 'utf-8');
    const data = JSON.parse(raw);
    return { ...EMPTY, ...data };
  } catch {
    return { ...EMPTY };
  }
}

async function write(data: Analytics) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function trackVisit(pathname: string, visitorId: string) {
  const data = await read();
  const today = new Date().toISOString().slice(0, 10);
  const isNewVisitor = !data.visitors.includes(visitorId);
  if (isNewVisitor) data.visitors.push(visitorId);

  data.total.pv++;
  if (isNewVisitor) data.total.uv++;

  if (!data.daily[today]) data.daily[today] = { pv: 0, uv: 0 };
  data.daily[today].pv++;
  if (isNewVisitor) data.daily[today].uv++;

  await write(data);
}

export async function trackPostView(slug: string) {
  const data = await read();
  data.postViews[slug] = (data.postViews[slug] || 0) + 1;
  await write(data);
}

export async function getAnalytics() {
  return await read();
}
