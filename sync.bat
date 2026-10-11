@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ============================================
echo   XingHuiSama 博客 - 一键同步到 GitHub
echo ============================================
echo.

:: 检查 git 是否可用
where git >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 git，请先安装 Git for Windows
  echo 下载地址: https://git-scm.com/download/win
  pause
  exit /b 1
)

:: 显示当前分支
for /f "delims=" %%i in ('git branch --show-current') do set BRANCH=%%i
echo [信息] 当前分支: %BRANCH%
echo.

:: 显示状态
echo [信息] 检测改动...
git status --short
echo.

:: 检查是否有改动
git diff-index --quiet HEAD --
if not errorlevel 1 (
  :: 也可能是未追踪的文件，检查一下
  for /f %%i in ('git status --porcelain') do set HAS_CHANGE=1
  if not defined HAS_CHANGE (
    echo [提示] 没有改动需要提交
    echo.
    pause
    exit /b 0
  )
)

:: 添加所有改动
echo [1/3] 添加改动...
git add .
if errorlevel 1 (
  echo [错误] git add 失败
  pause
  exit /b 1
)

:: 提交（消息带时间）
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set D=%%a-%%b-%%c
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set T=%%a:%%b
set MSG=update: %D% %T%

echo [2/3] 提交: %MSG%
git commit -m "%MSG%"
if errorlevel 1 (
  echo [错误] git commit 失败
  pause
  exit /b 1
)

:: 推送
echo [3/3] 推送到 GitHub...
git push origin %BRANCH%
if errorlevel 1 (
  echo.
  echo [错误] 推送失败
  echo.
  echo 常见原因:
  echo   1. 网络问题 - 检查是否能访问 github.com
  echo   2. 认证问题 - 需要 Personal Access Token
  echo      去 https://github.com/settings/tokens 生成
  echo   3. 远端有新提交 - 先执行 git pull
  echo.
  pause
  exit /b 1
)

echo.
echo ============================================
echo   同步成功！
echo ============================================
echo.
timeout /t 3 >nul
exit /b 0