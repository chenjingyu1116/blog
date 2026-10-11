import { NextResponse } from 'next/server';
import {
  listTools,
  createTool,
  updateTool,
  deleteTool,
  toggleTool,
  moveTool,
} from '@/lib/tools';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ tools: await listTools() });
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '请求体不是 JSON' }, { status: 400 });
  }

  const { action, id, data, enabled, direction } = body || {};

  try {
    if (action === 'create') {
      const tool = await createTool(data || {});
      return NextResponse.json({ ok: true, tool, tools: await listTools() });
    }
    if (action === 'update' && id) {
      const tool = await updateTool(id, data || {});
      if (!tool) return NextResponse.json({ error: '工具不存在' }, { status: 404 });
      return NextResponse.json({ ok: true, tool, tools: await listTools() });
    }
    if (action === 'delete' && id) {
      await deleteTool(id);
      return NextResponse.json({ ok: true, tools: await listTools() });
    }
    if (action === 'toggle' && id) {
      await toggleTool(id, !!enabled);
      return NextResponse.json({ ok: true, tools: await listTools() });
    }
    if (action === 'move' && id && (direction === 'up' || direction === 'down')) {
      await moveTool(id, direction);
      return NextResponse.json({ ok: true, tools: await listTools() });
    }
    return NextResponse.json({ error: '参数错误' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || '操作失败' }, { status: 500 });
  }
}