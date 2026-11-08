@echo off
setlocal
cd /d "%~dp0"

:: Prefer scoop Node 24+ (Astro needs >= 22.23.4)
if exist "%USERPROFILE%\scoop\apps\nodejs24\current\node.exe" (
  set "PATH=%USERPROFILE%\scoop\apps\nodejs24\current;%PATH%"
) else if exist "%USERPROFILE%\scoop\apps\nodejs-lts\current\node.exe" (
  set "PATH=%USERPROFILE%\scoop\apps\nodejs-lts\current;%PATH%"
)

echo [zblog] working dir: %CD%
where node
node -v
if errorlevel 1 (
  echo [ERROR] Node 未找到。请先安装 scoop nodejs24，或把 Node^>=22 加入 PATH。
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo [zblog] npm install ...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install 失败
    pause
    exit /b 1
  )
)

echo [zblog] starting http://127.0.0.1:4321/
start "" "http://127.0.0.1:4321/"
:: 0.0.0.0：本机 + 同网手机可访问；--force 替换旧进程
call npm run dev
echo.
echo [zblog] 服务已退出，exit=%ERRORLEVEL%
pause
