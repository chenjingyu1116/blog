'use client';
import { useState } from 'react';
import Link from 'next/link';

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorTool() {
  const [hex, setHex] = useState('#7c3aed');

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-4xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6">
          <Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link>
        </div>

        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-6">颜色转换</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/40 dark:border-white/10 shadow-lg">
            <label className="text-xs font-bold text-slate-500 mb-3 block">选择颜色</label>
            <input
              type="color"
              value={hex}
              onChange={e => setHex(e.target.value)}
              className="w-full h-32 rounded-2xl cursor-pointer border-none outline-none"
            />
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-500 mb-2 block">HEX</label>
              <input
                type="text"
                value={hex}
                onChange={e => setHex(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 font-mono text-slate-800 dark:text-white outline-none focus:border-indigo-400 transition"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Row label="HEX" value={hex} />
            {rgb && <Row label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />}
            {hsl && <Row label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  function copy() {
    navigator.clipboard.writeText(value);
  }
  return (
    <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg flex items-center justify-between">
      <div>
        <div className="text-xs font-bold text-slate-500 mb-1">{label}</div>
        <div className="font-mono text-slate-800 dark:text-white">{value}</div>
      </div>
      <button onClick={copy} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 text-xs font-bold hover:bg-indigo-500/20 transition">
        复制
      </button>
    </div>
  );
}