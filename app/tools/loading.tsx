export default function ToolsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-4xl animate-bounce">🧰</div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">加载工具箱...</p>
      </div>
    </div>
  );
}