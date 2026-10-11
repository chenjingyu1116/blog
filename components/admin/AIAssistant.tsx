'use client';
import { useState } from 'react';

interface Props {
  content: string;
  onInsert: (text: string) => void;
  onReplaceSelection: (text: string) => void;
  getSelected: () => string;
}

const ACTIONS = [
  { key: 'continue', label: '✨ 续写' },
  { key: 'opening', label: '🚀 写开头' },
  { key: 'ending', label: '🏁 写结尾' },
  { key: 'outline', label: '📋 大纲' },
  { key: 'expand', label: '📖 扩写' },
  { key: 'condense', label: '✂️ 缩写' },
  { key: 'polish', label: '📝 润色' },
  { key: 'proofread', label: '🔍 校对' },
  { key: 'title', label: '🏷️ 起标题' },
  { key: 'excerpt', label: '📄 写摘要' },
  { key: 'tags', label: '🔖 标签' },
];

export default function AIAssistant({ content, onInsert, onReplaceSelection, getSelected }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [lastAction, setLastAction] = useState<string>('');
  const [error, setError] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  async function run(action: string) {
    if (action !== 'custom' && !content.trim()) {
      setError('正文为空'); setTimeout(() => setError(''), 2000); return;
    }
    if ((action === 'polish' || action === 'expand' || action === 'condense' || action === 'proofread') && !getSelected().trim()) {
      setError('请先在正文里选中一段文字'); setTimeout(() => setError(''), 2000); return;
    }
    if (action === 'custom' && !customPrompt.trim()) {
      setError('请输入自定义要求'); setTimeout(() => setError(''), 2000); return;
    }

    setBusy(action); setResult(''); setError(''); setLastAction(action);
    try {
      const res = await fetch('/api/admin/ai-write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          content,
          selected: ['polish', 'expand', 'condense', 'proofread', 'custom'].includes(action) ? getSelected() : '',
          customPrompt: action === 'custom' ? customPrompt : '',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '生成失败');
      setResult(data.result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  }

  function insert() {
    if (!result) return;
    if (['polish', 'expand', 'condense', 'proofread'].includes(lastAction)) {
      onReplaceSelection(result);
    } else {
      onInsert(result);
    }
    setResult('');
  }

  function copy() { navigator.clipboard.writeText(result); setResult(''); }

  // ===== 关闭状态：浮动按钮 =====
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} title="猫猫写作助手"
        style={{ position:'fixed', right:24, bottom:24, zIndex:2147483647, width:56, height:56, borderRadius:'50%',
          background:'linear-gradient(135deg,#6366f1,#a78bfa)', border:'2px solid rgba(255,255,255,0.4)',
          boxShadow:'0 8px 24px rgba(99,102,241,0.6)', cursor:'pointer', display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:26, padding:0, color:'#fff', lineHeight:1 }}>
        🐱
      </button>
    );
  }

  // ===== 展开状态：面板 =====
  return (
    <div style={{ position:'fixed', right:24, bottom:24, zIndex:2147483647, width:380, maxHeight:'80vh',
      display:'flex', flexDirection:'column', borderRadius:18, background:'rgba(20,27,74,0.98)',
      border:'1px solid rgba(255,255,255,0.25)', boxShadow:'0 20px 60px rgba(0,0,0,0.6)',
      backdropFilter:'blur(16px)', color:'#fff', overflow:'hidden' }}>

      {/* 标题栏 */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:20 }}>🐱</span>
          <span style={{ fontWeight:700, fontSize:14 }}>猫猫写作助手</span>
        </div>
        <button type="button" onClick={() => setOpen(false)}
          style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,0.1)',
            border:'none', color:'#fff', fontSize:14, cursor:'pointer' }}>×</button>
      </div>

      {/* 按钮区 */}
      <div style={{ padding:10, borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {ACTIONS.map(a => (
            <button key={a.key} type="button" onClick={() => run(a.key)} disabled={!!busy}
              style={{ padding:'6px 10px', borderRadius:8, fontSize:11, fontWeight:700,
                cursor: busy ? 'wait' : 'pointer',
                background: busy === a.key ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)',
                border:'1px solid rgba(255,255,255,0.15)', color:'#fff',
                opacity: busy && busy !== a.key ? 0.4 : 1 }}>
              {busy === a.key ? '...' : a.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setShowCustom(v => !v)}
          style={{ marginTop:8, width:'100%', padding:'6px 10px', borderRadius:8, fontSize:11,
            fontWeight:700, background:'rgba(255,217,125,0.15)', color:'#ffd97d',
            border:'1px solid rgba(255,217,125,0.3)', cursor:'pointer' }}>
          {showCustom ? '收起自定义' : '🎯 自定义指令'}
        </button>
        {showCustom && (
          <div style={{ marginTop:8 }}>
            <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)}
              rows={2} placeholder="比如：把这段改写成鲁迅风格 / 译成英文 / 换成知乎体…"
              style={{ width:'100%', padding:'8px 10px', borderRadius:8, fontSize:12, resize:'vertical',
                background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.2)',
                color:'#fff', outline:'none', fontFamily:'inherit' }} />
            <button type="button" onClick={() => run('custom')} disabled={!!busy}
              style={{ marginTop:6, width:'100%', padding:'8px 0', borderRadius:8, fontSize:12,
                fontWeight:700, background:'#ffd97d', color:'#141b4a', border:'none',
                cursor: busy ? 'wait' : 'pointer' }}>
              {busy === 'custom' ? '生成中...' : '执行自定义指令'}
            </button>
          </div>
        )}
      </div>

      {/* 结果区 */}
      <div style={{ flex:1, overflowY:'auto', padding:12, minHeight:140, fontSize:13 }}>
        {error && (
          <div style={{ padding:8, borderRadius:8, fontSize:12, background:'rgba(239,68,68,0.15)', color:'#fca5a5' }}>
            ❌ {error}
          </div>
        )}
        {!error && !result && !busy && (
          <p style={{ fontSize:12, opacity:0.5, textAlign:'center', padding:'24px 0', lineHeight:1.8 }}>
            💡 选个操作让猫猫帮忙<br />
            <span style={{ opacity:0.7 }}>润色/扩写/缩写/校对 需先选中文字</span><br />
            <span style={{ opacity:0.7 }}>自定义指令可以玩更多花样</span>
          </p>
        )}
        {result && (
          <div style={{ padding:12, borderRadius:10, fontSize:12, lineHeight:1.7,
            whiteSpace:'pre-wrap', background:'rgba(99,102,241,0.15)',
            border:'1px solid rgba(99,102,241,0.3)' }}>
            {result}
          </div>
        )}
      </div>

      {/* 操作区 */}
      {result && (
        <div style={{ padding:12, display:'flex', gap:8, borderTop:'1px solid rgba(255,255,255,0.1)' }}>
          <button type="button" onClick={insert}
            style={{ flex:1, padding:'10px 0', borderRadius:10, fontSize:12, fontWeight:700,
              cursor:'pointer', background:'#6366f1', color:'#fff', border:'none' }}>
            {['polish','expand','condense','proofread'].includes(lastAction) ? '替换选中' : '插入到正文'}
          </button>
          <button type="button" onClick={copy}
            style={{ padding:'10px 16px', borderRadius:10, fontSize:12, fontWeight:700,
              cursor:'pointer', background:'rgba(255,255,255,0.1)', color:'#fff', border:'none' }}>
            复制
          </button>
        </div>
      )}
    </div>
  );
}