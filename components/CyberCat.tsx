"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const DEFAULT_CONFIG: CatConfig = {
  enabled: true,
  barkInterval: 20,
  barkChance: 20,
  randomBarks: [
    "喵呜~ 今天天气真不错喵~",
    "好困哦，想睡觉喵...",
    "铲屎官，快去敲代码！",
    "我的小鱼干藏哪里去了？",
    "怎么没人理本喵...",
  ],
  petReply: "呼噜噜... 摸得本喵很舒服喵~",
  feedSuccessPrefix: "嗷呜！真好吃喵！本喵吃饱了要说两句...",
  feedErrorReply: "吧唧吧唧... 鱼干好吃，但本喵卡壳了喵...",
  thinkingReply: "让本喵想想喵...",
  chatErrorReply: "铲屎官的网线被老鼠咬断了吧？喵！",
};

// ⭐ 数据清理：防止脏数据导致崩溃
function sanitizeConfig(raw: any): CatConfig {
  const cfg: CatConfig = { ...DEFAULT_CONFIG };
  if (typeof raw !== 'object' || !raw) return cfg;

  if (typeof raw.enabled === 'boolean') cfg.enabled = raw.enabled;

  if (Array.isArray(raw.randomBarks)) {
    const cleaned = raw.randomBarks.filter((s: any) => typeof s === 'string' && s.trim().length > 0);
    if (cleaned.length > 0) cfg.randomBarks = cleaned;
  }

  const num = (v: any, def: number, min: number, max: number) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return def;
    return Math.min(max, Math.max(min, n));
  };
  cfg.barkInterval = num(raw.barkInterval, 20, 5, 3600);
  cfg.barkChance = num(raw.barkChance, 20, 1, 100);

  const str = (v: any, def: string) => (typeof v === 'string' && v.trim()) ? v : def;
  cfg.petReply = str(raw.petReply, DEFAULT_CONFIG.petReply!);
  cfg.feedSuccessPrefix = str(raw.feedSuccessPrefix, DEFAULT_CONFIG.feedSuccessPrefix!);
  cfg.feedErrorReply = str(raw.feedErrorReply, DEFAULT_CONFIG.feedErrorReply!);
  cfg.thinkingReply = str(raw.thinkingReply, DEFAULT_CONFIG.thinkingReply!);
  cfg.chatErrorReply = str(raw.chatErrorReply, DEFAULT_CONFIG.chatErrorReply!);

  return cfg;
}

export default function CyberCat() {
  const [config, setConfig] = useState<CatConfig>(DEFAULT_CONFIG);
  const [isPetted, setIsPetted] = useState(false);
  const [speech, setSpeech] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const chatTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ⭐ 从后台 API 加载配置（带数据清理）
  useEffect(() => {
    fetch('/api/site/cat')
      .then(r => r.json())
      .then((data: CatConfig) => {
        setConfig(sanitizeConfig(data));
      })
      .catch(() => {});
  }, []);

  // --- 💬 说话功能 ---
  const speak = (text: string, duration = 6000) => {
    setSpeech(text);
    if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);
    chatTimeoutRef.current = setTimeout(() => {
      setSpeech(null);
    }, duration);
  };

  // --- 🖱️ 交互事件：摸猫猫 ---
  const handlePetCat = () => {
    if (isPetted) return;
    setIsPetted(true);
    speak(config.petReply || DEFAULT_CONFIG.petReply!, 2000);
    setTimeout(() => {
      setIsPetted(false);
    }, 2000);
  };

  // --- 🐟 交互事件：喂小鱼干 ---
  const handleFeed = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isThinking) return;

    setShowInput(false);
    setIsThinking(true);
    speak(config.feedSuccessPrefix || DEFAULT_CONFIG.feedSuccessPrefix!, 6000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "我刚刚喂了你一条美味的小鱼干！你有什么表示？" }),
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      speak(data.reply, 8000);
    } catch (error) {
      speak(config.feedErrorReply || DEFAULT_CONFIG.feedErrorReply!, 4000);
    } finally {
      setIsThinking(false);
    }
  };

  // --- 💬 交互事件：发送聊天 ---
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking) return;

    const userMessage = inputValue;
    setInputValue('');
    setShowInput(false);
    setIsThinking(true);
    speak(config.thinkingReply || DEFAULT_CONFIG.thinkingReply!, 10000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      speak(data.reply, 8000);
    } catch (error) {
      speak(config.chatErrorReply || DEFAULT_CONFIG.chatErrorReply!, 4000);
    } finally {
      setIsThinking(false);
    }
  };

  // --- ⏳ 随机挂机语录 ---
  useEffect(() => {
    const barks = (config.randomBarks && config.randomBarks.length > 0)
      ? config.randomBarks
      : DEFAULT_CONFIG.randomBarks!;

    const intervalMs = (config.barkInterval || 20) * 1000;
    const chance = (config.barkChance || 20) / 100;

    const randomTalkInterval = setInterval(() => {
      if (!speech && !showInput && !isThinking && Math.random() < chance) {
        const randomMsg = barks[Math.floor(Math.random() * barks.length)];
        speak(randomMsg, 4000);
      }
    }, intervalMs);

    return () => clearInterval(randomTalkInterval);
  }, [speech, showInput, isThinking, config.randomBarks, config.barkInterval, config.barkChance]);

  // ⭐ 后台关闭时，直接不渲染
  if (config.enabled === false) return null;

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.1, cursor: "grabbing" }}
      className="fixed bottom-20 right-20 z-[9999] flex flex-col items-center group cursor-grab active:cursor-grabbing"
    >
      {/* 💬 聊天气泡 */}
      <div className="relative w-full flex justify-center mb-6">
        <AnimatePresence>
          {speech && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="absolute bottom-0 bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-200 px-4 py-3 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 text-sm max-w-[240px] break-words text-center leading-relaxed"
              style={{ pointerEvents: 'none', transformOrigin: 'bottom center' }}
            >
              {speech}
              <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-b border-r border-gray-100 dark:border-slate-700 transform rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🐈 猫咪本体 & 交互按钮区 */}
      <div className="relative">
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInput(!showInput);
            }}
            className="bg-white/90 dark:bg-slate-700/90 p-2.5 rounded-full shadow-md hover:scale-110 active:scale-95 transition-transform border border-gray-100 dark:border-slate-600 text-blue-500 hover:text-blue-600 flex items-center justify-center backdrop-blur-sm"
            title="聊天"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={handleFeed}
            disabled={isThinking}
            className={`bg-white/90 dark:bg-slate-700/90 p-2.5 rounded-full shadow-md hover:scale-110 active:scale-95 transition-transform border border-gray-100 dark:border-slate-600 flex items-center justify-center backdrop-blur-sm ${isThinking ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="喂小鱼干"
          >
            <span className="text-xl leading-none">🐟</span>
          </button>
        </div>

        <div
          className="w-[120px] h-[120px] relative cursor-pointer"
          onClick={handlePetCat}
        >
          <style>{`
            .cat-sprite {
              width: 100%;
              height: 100%;
              background-image: url('/siamese-cat.png'); 
              background-size: 300% 300%; 
              background-repeat: no-repeat;
              image-rendering: pixelated; 
            }
            .cat-idle {
              animation: idle-frames 1.2s infinite;
              background-position-y: 0%; 
            }
            .cat-petted {
              animation: pet-frames 0.8s infinite;
              background-position-y: 50%; 
            }
            .cat-thinking {
              animation: idle-frames 0.6s infinite;
              background-position-y: 0%; 
            }
            @keyframes idle-frames {
              0%, 33.32% { background-position-x: 0%; }
              33.33%, 66.65% { background-position-x: 50%; }
              66.66%, 100% { background-position-x: 100%; }
            }
            @keyframes pet-frames {
              0%, 49.99% { background-position-x: 0%; }
              50%, 100% { background-position-x: 50%; }
            }
          `}</style>
          <div className={`cat-sprite drop-shadow-2xl ${isPetted ? 'cat-petted' : isThinking ? 'cat-thinking' : 'cat-idle'}`} />
        </div>
      </div>

      {/* ⌨️ 互动输入框 */}
      <AnimatePresence>
        {showInput && (
          <motion.form
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            onSubmit={handleChatSubmit}
            className="absolute -bottom-14 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-lg flex items-center border border-gray-200 dark:border-slate-700 w-56 z-20"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="跟煤球说点啥喵..."
              className="bg-transparent border-none outline-none text-sm px-3 py-1 w-full dark:text-white placeholder-gray-400"
              disabled={isThinking}
              autoFocus
            />
            <button
              type="submit"
              disabled={isThinking || !inputValue.trim()}
              className={`rounded-full p-1.5 ml-1 flex items-center justify-center transition-colors ${
                isThinking || !inputValue.trim() ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}