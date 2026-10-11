// app/api/chat/route.ts
import { siteConfig } from '../../../siteConfig';

export const runtime = 'edge';

export async function POST(req: Request) {
  console.log("🚀 [1/5] 路由进入：开始对接 智谱 GLM");

  try {
    const { message } = await req.json();

    // ⭐ 智谱 API Key
    const apiKey = (process.env.ZHIPU_API_KEY || '').trim();

    if (!apiKey) {
      console.error("❌ 找不到 ZHIPU_API_KEY");
      return new Response(JSON.stringify({ error: "Key missing" }), { status: 500 });
    }

    // 用 siteConfig 里的参数（AI 人格 + 温度等）
    const systemPrompt = siteConfig.geminiConfig?.systemPrompt || '你是一只可爱的猫。';
    const maxTokens = siteConfig.geminiConfig?.maxOutputTokens || 150;
    const temperature = siteConfig.geminiConfig?.temperature ?? 0.85;

    // ⭐ 智谱 GLM-4-Flash 模型（免费）
    const modelId = 'glm-4-flash';

    console.log(`📡 [2/5] 正在呼叫模型: ${modelId}`);

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("🚨 智谱拒绝了请求:", JSON.stringify(data));
      return new Response(JSON.stringify({
        error: `模型拒绝访问: ${response.status}`,
        details: data.error?.message || data.message || "未知错误"
      }), { status: response.status });
    }

    console.log("✅ [3/5] 智谱成功响应");
    const reply = data.choices?.[0]?.message?.content?.trim() || "本喵现在不想理你喵...";

    console.log("🎉 [4/5] 回复已生成，准备传回前端");

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("🔥 [5/5] 运行时崩溃:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ status: "Ready", model: "GLM-4-Flash" }), { status: 200 });
}