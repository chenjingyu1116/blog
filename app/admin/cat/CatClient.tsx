'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CatConfig {
  enabled?: boolean;
  barkInterval?: number;
  barkChance?: number;
  randomBarks?: string[];
  petReply?: string;
  feedSuccessPrefix?: string;
  feedErrorReply?: string;
  thinkingReply?: string;
  chatErrorReply?: string;
}

interface GeminiConfig {
  modelId?: string;
  systemPrompt?: string;
  maxOutputTokens?: number;
  temperature?: number;
}

const EMPTY_CAT: CatConfig = {
  enabled: true,
  barkInterval: 20,
  barkChance: 20,
  randomBarks: [],
  petReply: '',
  feedSuccessPrefix: '',
  feedErrorReply: '',
  thinkingReply: '',
  chatErrorReply: '',
};

const EMPTY_GEMINI: GeminiConfig = {
  modelId: 'gemini-2.5-flash-lite',
  systemPrompt: '',
  maxOutputTokens: 150,
  temperature: 0.85,
};

const MODEL_OPTIONS = [
  { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite（快·省）' },
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash（均衡）' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro（强·贵）' },
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash（旧版）' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro（旧版）' },
];

export default function CatClient({
  initialCat,
  initialGemini,
}: {
  initialCat: CatConfig;
  initialGemini: GeminiConfig;
}) {
  const router = useRouter();
  const [cat, setCat] = useState<CatConfig>({ ...EMPTY_CAT, ...initialCat });
  const [gemini, setGemini] = useState<GeminiConfig>({ ...EMPTY_GEMINI, ...initialGemini });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState<'speech' | 'ai'>('speech');

  // ---- Cat 字段 ----
  function setCatField<K extends keyof CatConfig>(key: K, value: CatConfig[K]) {
    setCat(prev => ({ ...prev, [key]: value }));
  }
  function updateBark(i: number, val: string) {
    const next = [...(cat.randomBarks || [])];
    next[i] = val;
    setCatField('randomBarks', next);
  }
  function addBark() {
    setCatField('randomBarks', [...(cat.randomBarks || []), '新的挂机语录']);
  }
  function removeBark(i: number) {
    setCatField('randomBarks', (cat.randomBarks || []).filter((_, x) => x !== i));
  }

  // ---- Gemini 字段 ----
  function setGeminiField<K extends keyof GeminiConfig>(key: K, value: GeminiConfig[K]) {
    setGemini(prev => ({ ...prev, [key]: value }));
  }

  async function save() {
    setBusy(true); setMsg('');
    try {
      const res = await fetch('/api/admin/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catConfig: cat,
          geminiConfig: gemini,
        }),
      });
      if (!res.ok) throw new Error('保存失败');
      setMsg('✅ 已保存');
      router.refresh();
      setTimeout(() => setMsg(''), 2500);
    } catch (e: any) {
      setMsg('❌ ' + e.message);
    } finally {
      setBusy(false);
    }
  }

  const avgInterval = cat.barkInterval && cat.barkChance
    ? Math.round((cat.barkInterval * 100) / cat.barkChance)
    : 0;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { k: 'speech', l: '💬 说话内容' },
          { k: 'ai', l: '🧠 AI 人格' },
        ].map(t => (
          <button key={t.k} type="button" onClick={() => setTab(t.k as any)}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition"
            style={{
              background: tab === t.k ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.08)',
              color: tab === t.k ? '#a5b4fc' : 'inherit',
              border: '1px solid ' + (tab === t.k ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.15)'),
            }}>{t.l}</button>
        ))}
      </div>

      {/* ============ Tab: 说话内容 ============ */}
      {tab === 'speech' && <>
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={cat.enabled !== false} onChange={e => setCatField('enabled', e.target.checked)} style={{ width: 18, height: 18 }} />
            <span className="font-bold text-sm">启用猫猫助手</span>
            <span className="text-xs opacity-60">（关闭后前台不再显示）</span>
          </label>
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ marginBottom: 16 }}>
            <div className="font-bold text-sm">💤 挂机语录</div>
            <div className="text-xs opacity-60 mt-0.5">猫猫随机挑一句说</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, opacity: 0.7, marginBottom: 6 }}>⏱️ 检查间隔（秒）</label>
              <input type="number" min={5} max={600} value={cat.barkInterval || 20} onChange={e => setCatField('barkInterval', Number(e.target.value))} style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, opacity: 0.7, marginBottom: 6 }}>🎲 触发概率（%）</label>
              <input type="number" min={1} max={100} value={cat.barkChance || 20} onChange={e => setCatField('barkChance', Number(e.target.value))} style={inp} />
            </div>
          </div>

          <div style={{ fontSize: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', marginBottom: 16, opacity: 0.9 }}>
            💡 平均每 <b>{avgInterval}</b> 秒说一句话
            <span style={{ opacity: 0.6, marginLeft: 8 }}>（{cat.barkInterval} 秒检查一次，{cat.barkChance}% 概率触发）</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, opacity: 0.6 }}>共 {cat.randomBarks?.length || 0} 条</span>
            <button type="button" onClick={addBark} className="anime-btn-ghost text-xs">＋ 新增</button>
          </div>
          <div className="space-y-2">
            {(cat.randomBarks || []).map((bark, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <input value={bark} onChange={e => updateBark(i, e.target.value)} style={inp} />
                <button type="button" onClick={() => removeBark(i)} style={{ ...iconBtn, color: '#ef4444' }}>×</button>
              </div>
            ))}
            {(cat.randomBarks || []).length === 0 && <p className="text-center opacity-50 text-xs py-3">还没有语录</p>}
          </div>
        </div>

        <div className="rounded-2xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div className="font-bold text-sm mb-2">🎭 场景回复文案</div>
          <Field label="🖐️ 摸猫时说的（2000ms）">
            <input value={cat.petReply || ''} onChange={e => setCatField('petReply', e.target.value)} style={inp} />
          </Field>
          <Field label="🐟 喂小鱼干时先说的（6000ms）">
            <input value={cat.feedSuccessPrefix || ''} onChange={e => setCatField('feedSuccessPrefix', e.target.value)} style={inp} />
          </Field>
          <Field label="💭 提交问题时先说的（10000ms）">
            <input value={cat.thinkingReply || ''} onChange={e => setCatField('thinkingReply', e.target.value)} style={inp} />
          </Field>
          <Field label="💔 喂食失败时说的（4000ms）">
            <input value={cat.feedErrorReply || ''} onChange={e => setCatField('feedErrorReply', e.target.value)} style={inp} />
          </Field>
          <Field label="💔 聊天失败时说的（4000ms）">
            <input value={cat.chatErrorReply || ''} onChange={e => setCatField('chatErrorReply', e.target.value)} style={inp} />
          </Field>
        </div>
      </>}

      {/* ============ Tab: AI 人格 ============ */}
      {tab === 'ai' && <>
        <div className="rounded-2xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div>
            <div className="font-bold text-sm">🧠 AI 模型</div>
            <div className="text-xs opacity-60 mt-0.5 mb-3">猫猫聊天、喂鱼回答使用的 Gemini 模型</div>
            <select
              value={gemini.modelId || 'gemini-2.5-flash-lite'}
              onChange={e => setGeminiField('modelId', e.target.value)}
              style={{ ...inp, cursor: 'pointer' }}
            >
              {MODEL_OPTIONS.map(m => (
                <option key={m.value} value={m.value} style={{ background: '#141b4a' }}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="font-bold text-sm mb-3">🎭 人格设定（systemPrompt）</div>
            <div className="text-xs opacity-60 mb-3">
              告诉 AI 它是什么角色、该怎么说话。**每次对话都会带上这段**。
            </div>
            <textarea
              value={gemini.systemPrompt || ''}
              onChange={e => setGeminiField('systemPrompt', e.target.value)}
              rows={12}
              placeholder="例如：你现在是一只傲娇、聪明、有点毒舌但很可爱的暹罗猫..."
              style={{ ...inp, resize: 'vertical', lineHeight: 1.7, fontFamily: 'monospace' }}
            />
            <div className="text-xs opacity-50 mt-2">
              当前长度：{gemini.systemPrompt?.length || 0} 字符
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, opacity: 0.7, marginBottom: 6 }}>
                📏 最大回复字数（tokens）
              </label>
              <input
                type="number"
                min={30}
                max={2000}
                value={gemini.maxOutputTokens || 150}
                onChange={e => setGeminiField('maxOutputTokens', Number(e.target.value))}
                style={inp}
              />
              <div className="text-[10px] opacity-50 mt-1">150 ≈ 100 个汉字</div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, opacity: 0.7, marginBottom: 6 }}>
                🌡️ 随机性（temperature）
              </label>
              <input
                type="number"
                min={0}
                max={2}
                step={0.05}
                value={gemini.temperature ?? 0.85}
                onChange={e => setGeminiField('temperature', Number(e.target.value))}
                style={inp}
              />
              <div className="text-[10px] opacity-50 mt-1">0=死板 · 1=正常 · 2=很跳脱</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
          <div className="text-xs leading-relaxed opacity-90">
            <div className="font-bold mb-2">⚠️ 注意事项</div>
            <ul className="space-y-1 list-disc list-inside">
              <li>改完点下方「保存全部」才会生效</li>
              <li>Gemini API Key 在 <code>.env.local</code> 的 <code>GEMINI_API_KEY</code></li>
              <li>改模型可能影响计费，注意用量</li>
            </ul>
          </div>
        </div>
      </>}

      {/* 保存 */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', position: 'sticky', bottom: 16, padding: '12px 0', background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.4))', zIndex: 10 }}>
        <button type="button" onClick={save} disabled={busy} className="anime-btn" style={{ opacity: busy ? 0.5 : 1 }}>
          {busy ? '保存中...' : '💾 保存全部'}
        </button>
        {msg && <span style={{ fontSize: 13, fontWeight: 700, color: msg.startsWith('✅') ? '#10b981' : '#ef4444' }}>{msg}</span>}
      </div>
    </div>
  );
}

const inp: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: '#fff',
  fontSize: 13,
  outline: 'none',
};

const iconBtn: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 8,
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff', fontSize: 16, cursor: 'pointer', flexShrink: 0,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, opacity: 0.7, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}