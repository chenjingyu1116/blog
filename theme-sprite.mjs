// theme-sprite.mjs — 大尺寸半身立绘
import fs from 'fs';
import path from 'path';
const ROOT = process.cwd();
function w(rel, c) {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, c, 'utf-8');
  console.log('OK  ' + rel);
}

w('components/admin/CharacterSprite.tsx', `'use client';
export default function CharacterSprite() {
  return (
    <div className="sprite-wrap">
      <svg viewBox="0 0 400 640" className="sprite-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="hairTop" cx="50%" cy="20%">
            <stop offset="0%" stopColor="#d7a8ff" />
            <stop offset="55%" stopColor="#9d4eff" />
            <stop offset="100%" stopColor="#3d0f7a" />
          </radialGradient>
          <radialGradient id="faceG" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#fff5ee" />
            <stop offset="100%" stopColor="#ffd9c8" />
          </radialGradient>
          <linearGradient id="eyeG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c78bff" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#3b0f7a" />
          </linearGradient>
          <linearGradient id="dressG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a4a" />
            <stop offset="100%" stopColor="#0a0e2e" />
          </linearGradient>
          <linearGradient id="hairShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d7a8ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d7a8ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 后发 */}
        <path
          d="M 200 60 Q 80 50 60 220 Q 50 400 40 620 L 110 620 Q 100 400 120 250 Q 150 130 200 120 Q 250 130 280 250 Q 300 400 290 620 L 360 620 Q 350 400 340 220 Q 320 50 200 60 Z"
          fill="url(#hairTop)" stroke="#2a0a5a" strokeWidth="3"
        />

        {/* 身体/衣服 */}
        <path
          d="M 200 400 Q 120 420 70 520 L 60 640 L 340 640 L 330 520 Q 280 420 200 400 Z"
          fill="url(#dressG)" stroke="#2a0a5a" strokeWidth="3"
        />

        {/* 脖子 */}
        <path d="M 165 360 L 165 410 Q 200 430 235 410 L 235 360 Z" fill="#ffd9c8" stroke="#2a0a5a" strokeWidth="2.5" />

        {/* 脸 */}
        <ellipse cx="200" cy="250" rx="82" ry="108" fill="url(#faceG)" stroke="#2a0a5a" strokeWidth="3" />

        {/* 刘海 */}
        <path
          d="M 118 220 Q 128 100 200 88 Q 272 100 282 220 Q 258 145 200 145 Q 142 145 118 220 Z"
          fill="url(#hairTop)" stroke="#2a0a5a" strokeWidth="3"
        />
        {/* 刘海高光 */}
        <path d="M 140 160 Q 160 130 200 125 Q 180 145 165 175 Z" fill="url(#hairShine)" />

        {/* 呆毛 */}
        <path d="M 200 88 Q 218 45 195 30 Q 212 58 200 88 Z" fill="#c78bff" stroke="#2a0a5a" strokeWidth="2.5" />

        {/* 眼睛 */}
        <ellipse cx="166" cy="262" rx="24" ry="32" fill="#fff" stroke="#2a0a5a" strokeWidth="2.5" />
        <ellipse cx="234" cy="262" rx="24" ry="32" fill="#fff" stroke="#2a0a5a" strokeWidth="2.5" />
        <ellipse cx="166" cy="266" rx="19" ry="28" fill="url(#eyeG)" />
        <ellipse cx="234" cy="266" rx="19" ry="28" fill="url(#eyeG)" />

        {/* 眼睛高光 */}
        <ellipse cx="158" cy="255" rx="7" ry="9" fill="#fff" />
        <ellipse cx="226" cy="255" rx="7" ry="9" fill="#fff" />
        <ellipse cx="172" cy="282" rx="4" ry="3" fill="#ff4e9b" />
        <ellipse cx="240" cy="282" rx="4" ry="3" fill="#ff4e9b" />

        {/* 睫毛 */}
        <path d="M 140 248 Q 166 226 192 248" stroke="#2a0a5a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 208 248 Q 234 226 260 248" stroke="#2a0a5a" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* 腮红 */}
        <ellipse cx="132" cy="292" rx="20" ry="10" fill="#ff4e9b" opacity="0.4" />
        <ellipse cx="268" cy="292" rx="20" ry="10" fill="#ff4e9b" opacity="0.4" />

        {/* 嘴 */}
        <path d="M 186 312 Q 200 330 214 312" stroke="#2a0a5a" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* 精灵水晶发饰 - 左 */}
        <g transform="translate(88, 180)">
          <polygon points="0,0 15,-12 30,0 15,12" fill="#ff4e9b" stroke="#2a0a5a" strokeWidth="2.5" />
          <polygon points="15,0 22,-6 30,0 22,6" fill="#fff" opacity="0.7" />
        </g>
        {/* 精灵水晶发饰 - 右 */}
        <g transform="translate(282, 150)">
          <polygon points="0,0 18,-14 36,0 18,14" fill="#00e8c8" stroke="#2a0a5a" strokeWidth="2.5" />
          <polygon points="18,0 26,-7 36,0 26,7" fill="#fff" opacity="0.7" />
        </g>

        {/* 制服领口 */}
        <path d="M 130 440 L 200 510 L 270 440" stroke="#00e8c8" strokeWidth="3" fill="none" />
        <path d="M 200 510 L 200 560" stroke="#00e8c8" strokeWidth="3" fill="none" />
        <circle cx="200" cy="575" r="9" fill="#00e8c8" stroke="#2a0a5a" strokeWidth="2.5" />
        <circle cx="200" cy="575" r="3" fill="#fff" />
      </svg>
      <div className="sprite-glow" />
    </div>
  );
}`);

// 追加/覆盖 sprite CSS
const cssPath = path.join(ROOT, 'app/admin/anime.css');
let css = fs.readFileSync(cssPath, 'utf-8');
// 删掉旧的 sprite 相关规则
css = css.replace(/\/\* 角色立绘 \*\/[\s\S]*?(?=\/\* (标签芯片|对话框) \*\/|$)/, '');
css = css.replace(/\.sprite-wrap\s*\{[\s\S]*?\}\s*\.sprite-glow[\s\S]*?\}\s*/g, '');
css = css.replace(/@keyframes spriteFloat\s*\{[\s\S]*?\}\s*/g, '');
css = css.replace(/\.sprite-hud[\s\S]*?\.hud-line\.h2[^\n]*\n/g, '');

// 追加新的 sprite 样式
css += `

/* ===== 大尺寸半身立绘 ===== */
.sprite-wrap {
  position: fixed;
  right: -20px;
  bottom: 0;
  width: 400px;
  height: 640px;
  z-index: 40;
  pointer-events: none;
  animation: spriteFloat 5s ease-in-out infinite;
  opacity: 0.95;
}
@keyframes spriteFloat {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-14px); }
}
.sprite-svg {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
  filter:
    drop-shadow(0 0 24px rgba(157,78,255,0.65))
    drop-shadow(0 0 60px rgba(0,232,200,0.3));
}
.sprite-glow {
  position: absolute;
  bottom: -10px; left: 50%;
  transform: translateX(-50%);
  width: 260px; height: 40px;
  background: radial-gradient(ellipse, rgba(0,232,200,0.55), transparent 70%);
  filter: blur(14px);
  z-index: 1;
}
`;

fs.writeFileSync(cssPath, css, 'utf-8');
console.log('OK  app/admin/anime.css (已更新 sprite 样式)');

console.log('\\n◆ 大尺寸立绘已替换');
console.log('下一步: 1) Ctrl+C 停 dev  2) npm run dev  3) Ctrl+Shift+R 硬刷新');