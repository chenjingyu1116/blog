'use client';
import { useEffect, useState } from 'react';

function simpleMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  html = html.replace(/```([\s\S]*?)```/g, (_, code) => '<pre><code>' + code + '</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
  html = html.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  html = html.replace(/^- (.*)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  return html;
}

export default function MarkdownPreview({ content }: { content: string }) {
  const [html, setHtml] = useState('');
  useEffect(() => { setHtml(simpleMarkdown(content)); }, [content]);
  if (!content.trim()) {
    return (
      <div className="md-preview h-full grid place-items-center opacity-40 text-sm">
        <div className="text-center">
          <div className="text-4xl mb-2">🌌</div>
          <p>开始输入，预览会出现在这里</p>
        </div>
      </div>
    );
  }
  return <div className="md-preview" dangerouslySetInnerHTML={{ __html: html }} />;
}