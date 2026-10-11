'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SiteClient({ initial }: { initial: any }) {
  const router = useRouter();
  const [site, setSite] = useState<any>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState<'basic' | 'images' | 'social' | 'advanced'>('basic');

  function set(path: string[], value: any) {
    const next = JSON.parse(JSON.stringify(site));
    let obj = next;
    for (let i = 0; i < path.length - 1; i++) {
      if (!obj[path[i]]) obj[path[i]] = {};
      obj = obj[path[i]];
    }
    obj[path[path.length - 1]] = value;
    setSite(next);
  }

  async function save() {
    setBusy(true); setMsg('');
    try {
      const res = await fetch('/api/admin/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site),
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

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { k: 'basic', l: '基础信息' },
          { k: 'images', l: '图片资源' },
          { k: 'social', l: '社交链接' },
          { k: 'advanced', l: '高级' },
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

      <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
        {tab === 'basic' && <>
          <Field label="站点标题"><input value={site.title || ''} onChange={e => set(['title'], e.target.value)} style={inp} /></Field>
          <Field label="作者名"><input value={site.authorName || ''} onChange={e => set(['authorName'], e.target.value)} style={inp} /></Field>
          <Field label="个人简介"><textarea value={site.bio || ''} onChange={e => set(['bio'], e.target.value)} rows={3} style={{ ...inp, resize: 'none' }} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Field label="导航前缀"><input value={site.navTitle || ''} onChange={e => set(['navTitle'], e.target.value)} style={inp} /></Field>
            <Field label="分隔符"><input value={site.navSuffix || ''} onChange={e => set(['navSuffix'], e.target.value)} style={inp} /></Field>
            <Field label="导航后缀"><input value={site.navAfter || ''} onChange={e => set(['navAfter'], e.target.value)} style={inp} /></Field>
          </div>
          <Field label="杂谈标题"><input value={site.chatterTitle || ''} onChange={e => set(['chatterTitle'], e.target.value)} style={inp} /></Field>
          <Field label="杂谈描述"><input value={site.chatterDescription || ''} onChange={e => set(['chatterDescription'], e.target.value)} style={inp} /></Field>
          <Field label="建站日期"><input value={site.buildDate || ''} onChange={e => set(['buildDate'], e.target.value)} style={inp} placeholder="2026-03-23T00:00:00" /></Field>
        </>}

        {tab === 'images' && <>
          <Field label="网站图标 favicon"><input value={site.faviconUrl || ''} onChange={e => set(['faviconUrl'], e.target.value)} style={inp} /></Field>
          <Field label="头像"><input value={site.avatarUrl || ''} onChange={e => set(['avatarUrl'], e.target.value)} style={inp} /></Field>
          <Field label="默认文章封面"><input value={site.defaultPostCover || ''} onChange={e => set(['defaultPostCover'], e.target.value)} style={inp} /></Field>
          <Field label="照片墙封面"><input value={site.photoWallImage || ''} onChange={e => set(['photoWallImage'], e.target.value)} style={inp} /></Field>
          <Field label="背景图（每行一个 URL）">
            <textarea value={(site.bgImages || []).join('\n')} onChange={e => set(['bgImages'], e.target.value.split('\n').map((s: string) => s.trim()).filter(Boolean))} rows={4} style={{ ...inp, fontFamily: 'monospace', resize: 'vertical' }} />
          </Field>
        </>}

        {tab === 'social' && <>
          <Field label="GitHub"><input value={site.social?.github || ''} onChange={e => set(['social', 'github'], e.target.value)} style={inp} placeholder="https://github.com/xxx" /></Field>
          <Field label="Gitee"><input value={site.social?.gitee || ''} onChange={e => set(['social', 'gitee'], e.target.value)} style={inp} /></Field>
          <Field label="邮箱"><input value={site.social?.email || ''} onChange={e => set(['social', 'email'], e.target.value)} style={inp} placeholder="xxx@example.com" /></Field>
          <Field label="QQ"><input value={site.social?.qq || ''} onChange={e => set(['social', 'qq'], e.target.value)} style={inp} /></Field>
          <Field label="微信"><input value={site.social?.wechat || ''} onChange={e => set(['social', 'wechat'], e.target.value)} style={inp} /></Field>
          <Field label="音乐 ID（逗号分隔）"><input value={(site.cloudMusicIds || []).join(', ')} onChange={e => set(['cloudMusicIds'], e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))} style={inp} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="ICP 名称"><input value={site.icpConfig?.name || ''} onChange={e => set(['icpConfig', 'name'], e.target.value)} style={inp} /></Field>
            <Field label="ICP 链接"><input value={site.icpConfig?.link || ''} onChange={e => set(['icpConfig', 'link'], e.target.value)} style={inp} /></Field>
          </div>
        </>}

        {tab === 'advanced' && <>
          <Field label="弹幕列表（每行一条）">
            <textarea value={(site.danmakuList || []).join('\n')} onChange={e => set(['danmakuList'], e.target.value.split('\n').map((s: string) => s.trim()).filter(Boolean))} rows={8} style={{ ...inp, resize: 'vertical' }} />
          </Field>
          <Field label="友链申请格式">
            <textarea value={site.friendLinkApplyFormat || ''} onChange={e => set(['friendLinkApplyFormat'], e.target.value)} rows={5} style={{ ...inp, fontFamily: 'monospace', resize: 'vertical' }} />
          </Field>
          <Field label="Gitalk Client ID"><input value={site.gitalkConfig?.clientID || ''} onChange={e => set(['gitalkConfig', 'clientID'], e.target.value)} style={inp} /></Field>
          <Field label="Gitalk Repo"><input value={site.gitalkConfig?.repo || ''} onChange={e => set(['gitalkConfig', 'repo'], e.target.value)} style={inp} /></Field>
        </>}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button type="button" onClick={save} disabled={busy} className="anime-btn" style={{ opacity: busy ? 0.5 : 1 }}>
          {busy ? '保存中...' : '保存全部'}
        </button>
        {msg && <span style={{ fontSize: 13, fontWeight: 700, color: msg.startsWith('✅') ? '#10b981' : '#ef4444' }}>{msg}</span>}
      </div>
    </div>
  );
}

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 10,
  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
  color: '#fff', fontSize: 13, outline: 'none',
};
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 14 }}><label style={{ display: 'block', fontSize: 12, fontWeight: 700, opacity: 0.7, marginBottom: 6 }}>{label}</label>{children}</div>;
}
