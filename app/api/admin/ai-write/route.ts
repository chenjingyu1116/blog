import { NextResponse } from 'next/server';

export const runtime = 'edge';

const PROMPTS: Record<string, (ctx: any) => { system: string; user: string }> = {
  continue: (ctx) => ({
    system: '你是一位中文写作助手。根据用户已有的文章内容，自然地续写下去。只输出续写的正文，不要解释，不要加标题，不要重复已有内容。',
    user: `已有正文（节选）：\n\n${ctx.content}\n\n请续写 2-3 段：`,
  }),
  polish: (ctx) => ({
    system: '你是一位中文文字润色助手。保持原意，让语言更流畅、更优美、更书面化。只输出润色后的文字，不要解释。',
    user: `请润色以下文字：\n\n${ctx.selected || ctx.content}`,
  }),
  title: (ctx) => ({
    system: '你是一位中文标题党编辑。根据文章内容，给出 3 个吸引人的标题。每行一个，不要编号，不要解释。',
    user: `文章内容：\n\n${ctx.content}`,
  }),
  excerpt: (ctx) => ({
    system: '你是一位中文编辑。为文章写一段 50-80 字的摘要，简洁有力。只输出摘要，不要解释。',
    user: `文章内容：\n\n${ctx.content}`,
  }),
  tags: (ctx) => ({
    system: '你是一位内容标签助手。为文章推荐 3-6 个中文标签，用逗号分隔，只输出标签，不要解释。',
    user: `文章内容：\n\n${ctx.content}`,
  }),
  outline: (ctx) => ({
    system: '你是一位中文写作教练。根据用户提供的主题或已有内容，生成一份 Markdown 格式的文章大纲。使用 ## 或 ### 分层，不要解释。',
    user: `主题/内容：\n\n${ctx.content}\n\n请生成大纲：`,
  }),
  expand: (ctx) => ({
    system: '你是一位中文写作助手。把用户提供的简短内容扩写成 2-3 倍长度，补充细节、例子或描写。保持原意，只输出扩写后的内容。',
    user: `请扩写以下内容：\n\n${ctx.selected || ctx.content}`,
  }),
  condense: (ctx) => ({
    system: '你是一位中文编辑。把用户提供的内容压缩到一半左右，保留核心信息。只输出精简后的内容，不要解释。',
    user: `请精简以下内容：\n\n${ctx.selected || ctx.content}`,
  }),
  proofread: (ctx) => ({
    system: '你是一位中文校对员。检查错别字、语法错误、标点错误、逻辑不通顺的地方，直接输出修正后的完整文字。不要加解释、不要列出修改点。',
    user: `请校对以下文字：\n\n${ctx.selected || ctx.content}`,
  }),
  opening: (ctx) => ({
    system: '你是一位中文写作高手。为文章写一段吸引人的开头（100-200 字），点题、有悬念或代入感。只输出开头段落，不要解释。',
    user: `文章标题/内容：\n\n${ctx.content}\n\n请写一个开头：`,
  }),
  ending: (ctx) => ({
    system: '你是一位中文写作高手。为文章写一段有深度的结尾（80-150 字），总结全文或升华主题。只输出结尾段落，不要解释。',
    user: `文章内容：\n\n${ctx.content}\n\n请写一个结尾：`,
  }),
  custom: (ctx) => ({
    system: '你是一位中文写作助手。严格按用户要求处理给定文本，只输出结果，不要解释。',
    user: `要求：${ctx.customPrompt}\n\n原文：\n\n${ctx.selected || ctx.content}\n\n请执行：`,
  }),
};

export async function POST(req: Request) {
  try {
    const { action, content, selected, customPrompt } = await req.json();
    const apiKey = (process.env.ZHIPU_API_KEY || '').trim();

    if (!apiKey) return NextResponse.json({ error: '服务端未配置 ZHIPU_API_KEY' }, { status: 500 });
    if (!action || !PROMPTS[action]) return NextResponse.json({ error: '未知操作' }, { status: 400 });
    if (!content?.trim() && action !== 'custom') return NextResponse.json({ error: '正文为空' }, { status: 400 });
    if (action === 'custom' && !customPrompt?.trim()) return NextResponse.json({ error: '请输入要求' }, { status: 400 });

    const { system, user } = PROMPTS[action]({ content, selected, customPrompt });

    const res = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        max_tokens: 1500,
        temperature: 0.8,
      }),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.error?.message || data.message || 'AI 请求失败' }, { status: res.status });

    const result = data.choices?.[0]?.message?.content?.trim() || '';
    return NextResponse.json({ result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || '请求失败' }, { status: 500 });
  }
}