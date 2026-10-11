'use client';
import { useState } from 'react';

export default function CharacterSprite() {
  const [err, setErr] = useState(false);
  if (err) return null;
  return (
    <div className="sprite-wrap">
      <img
        src="/admin/character.png"
        alt=""
        className="sprite-img"
        onError={() => setErr(true)}
      />
      <div className="sprite-glow" />
    </div>
  );
}